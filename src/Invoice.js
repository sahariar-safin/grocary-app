import React, { useEffect, useState } from 'react';
import './index.css';

const Invoice = ({ person, items, componentRef, total }) => {
    return (
        // <div style={{ color: 'black' }} ref={componentRef}>
        //     <h1>Invoice</h1>
        // </div>
        <div ref={componentRef} class="invoice-box">
            <table cellpadding="0" cellspacing="0">
                <tr class="information">
                    <td colspan="2">
                        <table>
                            <tr>
                                Customer name: {person && person.name.first}
                            </tr>
                            <tr>
                                Phone number: {person && person.phone}
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <table>
                <tr class="heading">
                    <td>items</td>
                    <td>Quantity</td>
                    <td>Price</td>
                </tr>
                {items.map(item => (
                    <>
                        <tr class="item">
                            <td>{item.itemName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price * item.quantity}</td>
                        </tr>
                    </>
                ))}
            </table>
            <br />
            <h1 class="justify-center">Total price: {total}</h1>
        </div>
    );
};

export default Invoice;