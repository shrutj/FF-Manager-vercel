import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import './Styles/Delivery.css';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';
import ConfirmationModal from './ConfirmationModal'; // Import your modal component

const Delivery = ({ onLogout, users, products, orders, setOrders, database, Ref, update }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [deliveries, setDeliveries] = useState([]);
  const [OrderDateFo, setOrderDateFo] = useState('text');
  const [searchCriteria, setSearchCriteria] = useState({
    orderId: '',
    userId: '',
    itemId: '',
    userName: '',
    orderDate: '',
    orderStatus: 'All', // Default value
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Selected order for refund
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDeliveries = () => {
      const newDeliveries = [];
      
      orders.forEach(orderObj => {
        Object.keys(orderObj).forEach(key => {
          const order = orderObj[key];
          const user = users.find(user => user.userUid === order.userUid);
          const product = products.find(product => product.id === order.itemId);

          // Only include orders with status "Pending", "Processed", or "Canceled"
          if (user && product && (order.status === 'Pending' || order.status === 'Processed' || order.status === 'Canceled')) {
            newDeliveries.push({
              orderId: order.orderId,
              paymentId: order.paymentId,
              paymentOrderId: order.paymentOrderId, //only for online payments
              userId: user.userUid,
              userName: order.username ? order.username : user.username,
              userNumber: order.phone ? order.phone : user.phone,
              deliveryAddress: order.address ? order.address : user.address,
              itemId: product.id,
              itemName: product.name,
              itemDescription: product.description,
              quantity: order.quantity,
              price: parseFloat(product.price),
              orderDate: order.date ? new Date(order.date).toLocaleString() : 'N/A',
              status: order.status,
              size: order.size,
              paymentMethod: order.paymentMethod,
            });
          }
        });
      });

      setDeliveries(newDeliveries);
    };

    fetchDeliveries();
  }, [orders, users, products]);

  const currentItems = deliveries.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const totalPages = Math.ceil(deliveries.length / itemsPerPage);

  const handlePageChange = (data) => {
    setCurrentPage(data.selected);
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: value });
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    return (
      (searchCriteria.orderId ? delivery.orderId.includes(searchCriteria.orderId) : true) &&
      (searchCriteria.userId ? delivery.userId.includes(searchCriteria.userId) : true) &&
      (searchCriteria.itemId ? delivery.itemId.includes(searchCriteria.itemId) : true) &&
      (searchCriteria.userName ? delivery.userName.toLowerCase().includes(searchCriteria.userName.toLowerCase()) : true) &&
      (searchCriteria.orderDate ? delivery.orderDate.includes(searchCriteria.orderDate) : true) &&
      (searchCriteria.orderStatus === 'All' || delivery.status === searchCriteria.orderStatus)
    );
  });

  const currentFilteredItems = filteredDeliveries.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const filteredTotalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);

  const updateDeliveryStatus = (orderId, newStatus) => {
    deliveries.forEach(orderObj => {
      if (orderObj.orderId === orderId) {
        const database_ref = Ref.ref(database, 'orders/' + orderObj.userId + '/' + orderId);
        const updatedData = {
          orderId: orderObj.orderId,
          itemId: orderObj.itemId,
          userUid: orderObj.userId,
          date: orderObj.orderDate,
          status: newStatus,
          quantity: orderObj.quantity,
          ...(newStatus === 'Delivered' && { deliveredOn: new Date() })
        };

        update(database_ref, updatedData)
          .then(() => {
            console.log('Order status updated successfully');
          })
          .catch((error) => {
            console.error('Error updating order status:', error);
          });
      }
    });
  };

  const processRefund = async (orderId) => {
    // Find the order based on orderId
    const selectedOrder = deliveries.find(delivery => delivery.orderId === orderId);
  
    if (!selectedOrder) {
      console.error('Order not found');
      return;
    }
  
    try {
      // Step 1: Update the order status to 'Refund_in_Process'
      updateDeliveryStatus(orderId, 'Refund_in_Process');
  
      // Step 2: Call the backend to process the refund
      const response = await axios.post('http://localhost:5001/api/refund-payment', {
        orderId: selectedOrder.paymentOrderId,  // Pass the order ID
        paymentId: selectedOrder.paymentId,  // Pass the payment ID (for refund)
      });
  
      if (response.data.success) {
        alert('Refund processed successfully');
        
        // Step 3: Update the status to 'Refund_Successful' locally
        updateDeliveryStatus(orderId, 'Refund_Successful');
      } else {
        alert('Refund processing failed');
      }
    } catch (error) {
      console.error('Error processing refund:', error);
      alert('An error occurred while processing the refund');
    }
  };

  const openRefundModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true); // Show the modal
  };

  const closeRefundModal = () => {
    setSelectedOrderId(null);
    setIsModalOpen(false); // Close the modal
  };

  const handleRefundConfirmation = () => {
    processRefund(selectedOrderId);
    closeRefundModal(); // Close the modal after refund
  };

  return (
    <div>
      <Header onLogout={onLogout} />
      <div className="delivery__container">
        <h1>Pending Deliveries</h1>

        {/* Search Fields */}
        <div className="search__container">
          <input
            type="text"
            name="orderId"
            placeholder="Order ID"
            value={searchCriteria.orderId}
            onChange={handleSearchChange}
          />
          <input
            type="text"
            name="userId"
            placeholder="User ID"
            value={searchCriteria.userId}
            onChange={handleSearchChange}
          />
          <input
            type="text"
            name="itemId"
            placeholder="Item ID"
            value={searchCriteria.itemId}
            onChange={handleSearchChange}
          />
          <input
            type="text"
            name="userName"
            placeholder="User Name"
            value={searchCriteria.userName}
            onChange={handleSearchChange}
          />
          <input
            type={OrderDateFo} // Calendar input for order date
            name="orderDate"
            placeholder="Order Date"
            value={searchCriteria.orderDate}
            onChange={handleSearchChange}
            onFocus={() => setOrderDateFo('date')}
            onBlur={() => setOrderDateFo('text')}
          />
          <select
            name="orderStatus"
            value={searchCriteria.orderStatus}
            onChange={handleSearchChange}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Processed">Processed</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>

        <div className="delivery__table-container">
          <table className="delivery__table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Payment ID (only for online payments)</th>
                <th>Payment Order ID (only for online payments)</th>
                <th>User ID</th>
                <th>User Name</th>
                <th>User Number</th>
                <th>Delivery Address</th>
                <th>Item ID</th>
                <th>Item Name</th>
                <th>Item Description</th>
                <th>Quantity</th>
                <th>Price (Per item)</th>
                <th>Payment Method</th>
                <th>Size</th>
                <th>Order Date</th>
                <th>Order Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentFilteredItems.map(delivery => (
                <tr key={delivery.itemId}>
                  <td>{delivery.orderId}</td>
                  <td>{delivery.paymentId}</td>
                  <td>{delivery.paymentOrderId}</td>
                  <td>{delivery.userId}</td>
                  <td>{delivery.userName}</td>
                  <td>{delivery.userNumber}</td>
                  <td>{delivery.deliveryAddress}</td>
                  <td>{delivery.itemId}</td>
                  <td>{delivery.itemName}</td>
                  <td>{delivery.itemDescription}</td>
                  <td>{delivery.quantity}</td>
                  <td>₹{delivery.price.toFixed(2)}</td>
                  <td>{delivery.paymentMethod}</td>
                  <td>{delivery.size}</td>
                  <td>{delivery.orderDate}</td>
                  <td>{delivery.status}</td>
                  <td>
                    {(delivery.status !== 'Canceled') ? (
                      <>
                        <button
                          className="delivery__button delivery__button--processed"
                          onClick={() => updateDeliveryStatus(delivery.orderId, 'Processed')}
                        >
                          <span>✔</span> Mark as Processed
                        </button>
                        <button
                          className="delivery__button delivery__button--delivered"
                          onClick={() => updateDeliveryStatus(delivery.orderId, 'Delivered')}
                        >
                          <span>✔✔</span> Mark as Delivered
                        </button>
                      </>
                    ) : (
                      <>
                        {delivery.paymentId && (
                          <button
                            className="delivery__button delivery__button--delivered"
                            onClick={() => openRefundModal(delivery.orderId)}
                          >
                            Process Refund
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={filteredTotalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={'delivery__pagination'}
          activeClassName={'delivery__pagination-button active'}
          previousClassName={'delivery__pagination-button'}
          nextClassName={'delivery__pagination-button'}
        />
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && <ConfirmationModal
        onCancel={closeRefundModal}
        onConfirm={handleRefundConfirmation}
        message="Are you sure you want to process the refund for this order?"
      />}

      <Footer />
    </div>
  );
};

export default Delivery;
