
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import css from './Table.module.css';

const Tables = () => {
    const [invoices, setInvoices] = useState([]);
    const [userId, setUserId] = useState(null);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
    const [invoiceLines, setInvoiceLines] = useState([]);
    const [products, setProducts] = useState([]);
    const [finalInvoiceLines, setFinalInvoiceLines] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const handleRadioClick = (event) => {
        const selectedId = event.target.value;
        setSelectedInvoiceId(selectedId);
        console.log(selectedId);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userIndex = localStorage.getItem('token');
                if (userIndex) {
                    const usersResponse = await axios.get('https://bever-aca-assignment.azurewebsites.net/users');
                    const users = usersResponse.data.value;
                    const user = users[userIndex];
                    if (user) {
                        setUserId(user.UserId);
                    } else {
                        console.error('User not found');
                    }
                } else {
                    console.error('No user index found in local storage');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchInvoices = async () => {
            try {
                const response = await axios.get('https://bever-aca-assignment.azurewebsites.net/invoices');
                const allInvoices = response.data.value;
                if (userId) {
                    const userInvoices = allInvoices.filter(invoice => invoice.UserId === userId);
                    setInvoices(userInvoices);
                }
            } catch (error) {
                console.error('Error fetching invoices:', error);
            }
        };

        fetchUserData();
        fetchInvoices();
    }, [userId]);

    const fetchInvoiceLines = async () => {
        try {
            const response = await axios.get('https://bever-aca-assignment.azurewebsites.net/invoicelines');
            const allInvoiceLines = response.data.value;
            if (selectedInvoiceId) {
                const userInvoiceLines = allInvoiceLines.filter(invoiceLine => invoiceLine.InvoiceId === selectedInvoiceId);
                setInvoiceLines(userInvoiceLines);
                const productIds = userInvoiceLines.map(line => line.ProductId);
                fetchProducts(productIds, userInvoiceLines);
            }
        } catch (error) {
            console.error('Error fetching invoice lines:', error);
        }
    };

    const fetchProducts = async (productIds, userInvoiceLines) => {
        try {
            const response = await axios.get('https://bever-aca-assignment.azurewebsites.net/products');
            const allProducts = response.data.value;
            const userProducts = allProducts.filter(product => productIds.includes(product.ProductId));
            setProducts(userProducts);


            const finalLines = userInvoiceLines.map(line => {
                const product = userProducts.find(product => product.ProductId === line.ProductId);
                return {
                    ...line,
                    Name: product ? product.Name : 'Unknown',
                    Price: product ? product.Price : 0,
                    TotalAmount: product ? product.Price * line.Quantity : 0
                };
            });
            setFinalInvoiceLines(finalLines);
            const total = finalLines.reduce((sum, line) => sum + line.TotalAmount, 0);
            setTotalAmount(total);

        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        if (selectedInvoiceId) {
            fetchInvoiceLines();
        }
    }, [selectedInvoiceId]);

    return (
        <div>
            <table className={css.table}>
                <thead>
                <tr>
                    <th></th>
                    <th>Invoice Name</th>
                    <th>Paid Date</th>
                    <th>Total Amount</th>
                </tr>
                </thead>
                <tbody>
                {invoices.map(invoice => (
                    <tr key={invoice.InvoiceId}>
                        <td>
                            <input
                                type="radio"
                                name="invoice"
                                value={invoice.InvoiceId}
                                onChange={handleRadioClick}
                            />
                        </td>
                        <td>{invoice.Name}</td>
                        <td>{new Date(invoice.PaidDate).toLocaleDateString()}</td>
                        <td>{invoice.InvoiceId === selectedInvoiceId ? totalAmount : '0'} </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h1>Invoice Lines</h1>
            <table className={css.table}>
                <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Price Per Unit</th>
                    <th>Quantity</th>
                    <th>Total Amount</th>
                </tr>
                </thead>
                <tbody>
                {finalInvoiceLines.map(line => (
                    <tr key={line.InvoiceLineId}>
                        <td>{line.Name}</td>
                        <td>{line.Price}</td>
                        <td>{line.Quantity}</td>
                        <td>{line.TotalAmount}</td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    );
};

export default Tables;
