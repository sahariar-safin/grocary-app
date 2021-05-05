import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faCircle, faCheckCircle, faPlus } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [items, setItems] = useState([
    // { itemName: 'item 1', quantity: 1, isSelected: false },
    // { itemName: 'item 2', quantity: 3, isSelected: true },
    // { itemName: 'item 3', quantity: 2, isSelected: false },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [inputPrice, setInputPrice] = useState('');
  const [totalPriceCount, setTotalPriceCount] = useState(0);
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
      quantity: 0,
      isSelected: false,
    };

    const newItems = [...items, newItem];

    setItems(newItems);
    setInputValue('');
    setInputPrice('');
    calculateTotal();
  };

  const handleQuantityIncrease = (index) => {
    const newItems = [...items];

    newItems[index].quantity++;

    setItems(newItems);
    calculateTotal();
  };

  const handleQuantityDecrease = (index) => {
    const newItems = [...items];

    newItems[index].quantity--;

    setItems(newItems);
    calculateTotal();
  };

  const toggleComplete = (index) => {
    const newItems = [...items];

    newItems[index].isSelected = !newItems[index].isSelected;

    setItems(newItems);
  };

  const calculateTotal = () => {
    const totalItemCount = items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    const totalPriceCount = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);


    setTotalItemCount(totalItemCount);
    setTotalPriceCount(totalPriceCount);
  };

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <BrowserRouter>
      <div className='app-background' ref={componentRef}>
        <h1>Grocery Billing App</h1>
        <div className='main-container'>
          {person && <div>Hey <strong>{person.name.first}! from {person.location.city} </strong>Phone no: {person.phone} <br />Add your grocery items</div>}
          <div className='add-item-box'>
            <input value={inputValue} onChange={(event) => setInputValue(event.target.value)} className='add-item-input' placeholder='Add an item' type='text' />
            <input value={inputPrice} onChange={(event) => setInputPrice(event.target.value)} className='add-item-input' placeholder='Add price' type='number' />
            <FontAwesomeIcon icon={faPlus} onClick={() => handleAddButtonClick()} />
          </div>
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
          <div className='total'>Total Items: {totalItemCount} Price: {totalPriceCount}</div><button>Print</button>
        </div>
        <button onClick={handlePrint}>Print this out!</button>
      </div>
    </BrowserRouter>
  );
};

export default App;
