import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faCircle, faCheckCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import Invoice from './Invoice';

const App = () => {
  const [items, setItems] = useState([
    // { itemName: 'item 1', quantity: 1, isSelected: false },
    // { itemName: 'item 2', quantity: 3, isSelected: true },
    // { itemName: 'item 3', quantity: 2, isSelected: false },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [totalItemCount, setTotalItemCount] = useState();
  const [inputPrice, setInputPrice] = useState();
  const [inputQuantity, setInputQuantity] = useState()
  const [totalPriceCount, setTotalPriceCount] = useState();
  const [person, setPerson] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("https://api.randomuser.me/");
      const data = await response.json();
      const [item] = data.results;
      setPerson(item);
    };
    fetchData();
  }, []);

  const handleAddButtonClick = () => {
    const newItem = {
      itemName: inputValue,
      price: inputPrice,
      quantity: inputQuantity,
      isSelected: false,
    };

    const newItems = [...items, newItem];

    setItems(newItems);
    setInputValue(null);
    setInputPrice(null);
    setInputQuantity(null);
    document.getElementById('add-item-form').reset();
  };

  const handleQuantityIncrease = (index) => {
    const newItems = [...items];

    newItems[index].quantity++;

    setItems(newItems);
  };

  const handleQuantityDecrease = (index) => {
    const newItems = [...items];

    newItems[index].quantity--;

    setItems(newItems);
  };

  const toggleComplete = (index) => {
    const newItems = [...items];

    newItems[index].isSelected = !newItems[index].isSelected;

    setItems(newItems);
  };

  useEffect(() => {
    const newTotalItemCount = items.reduce((total, item) => {
      return total + (item.quantity * 1);
    }, 0);

    const newTotalPriceCount = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);


    setTotalItemCount(newTotalItemCount);
    setTotalPriceCount(newTotalPriceCount);
  }, [items])


  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <BrowserRouter>
      <div className='app-background'>
        <h1>Grocery Billing App</h1>
        <div className='main-container'>
          {person && <div>Hey <strong>{person.name.first}! from {person.location.city} </strong>Phone no: {person.phone} <br />Add your grocery items</div>}
          <form id='add-item-form' className='add-item-box'>
            <input value={inputValue} onChange={(event) => setInputValue(event.target.value)} className='add-item-input' placeholder='Add an item' type='text' />
            <input value={inputPrice} onChange={(event) => setInputPrice(event.target.value)} className='add-item-input' placeholder='Add price' type='number' />
            <input value={inputQuantity} onChange={(event) => setInputQuantity(event.target.value)} className='add-item-input' placeholder='Add Quantity' type='number' />
            <FontAwesomeIcon icon={faPlus} onClick={() => handleAddButtonClick()} />
          </form>
          <div className='item-list'>
            {items.map((item, index) => (
              <div className='item-container'>
                <div className='item-name' onClick={() => toggleComplete(index)}>
                  {item.isSelected ? (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} />
                      <span className='completed'>{item.itemName}</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCircle} />
                      <span>{item.itemName}</span>
                    </>
                  )}
                </div>
                <div className='quantity'>
                  <button>
                    <FontAwesomeIcon icon={faChevronLeft} onClick={() => handleQuantityDecrease(index)} />
                  </button>
                  <span>{item.quantity}</span>
                  <button>
                    <FontAwesomeIcon icon={faChevronRight} onClick={() => handleQuantityIncrease(index)} />
                  </button>
                </div>
                <div className="price">
                  <span>{item.price * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
          <div className='total'>
            Total Items: {totalItemCount}
          Total Price: {totalPriceCount}</div><button>Print</button>
        </div>
        <button onClick={() => handlePrint()}>Print this out!</button>
        <div style={{ display: 'none' }}>
          <Invoice person={person} total={totalPriceCount} componentRef={componentRef} items={items}></Invoice>
        </div>
      </div>
    </BrowserRouter >
  );
};



export default App;
