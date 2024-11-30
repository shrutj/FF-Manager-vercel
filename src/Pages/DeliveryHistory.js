import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import './Styles/Delivery.css';
import Header from './Header';
import Footer from './Footer';
import ConfirmationModal from './ConfirmationModal';
import axios from 'axios';

const DeliveryHistory = ({ onLogout, users, products, orders, database, Ref, update }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [deliveries, setDeliveries] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    orderId: '',
    userId: '',
    itemId: '',
    itemName: '',
    userName: '',
    orderDate: '',
    deliveredDate: '',
    status: '',
  });
  const [orderDateFo, setOrderDateFo] = useState('text');
  const [deliverDateFo, setDeliverDateFo] = useState('text');
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState(null);  // Store new status for the order
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDeliveries = () => {
      const newDeliveries = [];

      orders.forEach(orderObj => {
        Object.keys(orderObj).forEach(key => {
          const order = orderObj[key];
          const user = users.find(user => user.userUid === order.userUid);
          const product = products.find(product => product.id === order.itemId);

          if (user && product && (order.status !== 'Pending' && order.status !== 'Processed' && order.status !== 'Canceled')) {
            newDeliveries.push({
              orderId: order.orderId,
              paymentId: order.paymentId,
              paymentOrderId: order.paymentOrderId, //only for online payments
              userId: user.userUid,
              userName: user.username,
              userNumber: user.phone,
              deliveryAddress: user.address,
              itemId: product.id,
              itemName: product.name,
              itemDescription: product.description,
              quantity: order.quantity,
              price: parseFloat(product.price),
              orderDate: order.date,
              status: order.status,
              deliveredOn: order.deliveredOn,
              reason: order.reason,
              size:order.size,
              paymentMethod: order.paymentMethod,
            });
          }
        });
      });

      setDeliveries(newDeliveries);
    };

    fetchDeliveries();
  }, [orders, users, products]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: value });
  };

  const openModal = (orderId, action, status) => {
    setSelectedOrderId(orderId);
    setModalAction(action);
    setNewStatus(status); // Set the new status to be updated
    setShowModal(true);
  };

  const handleModalConfirm = async () => {
    if (!selectedOrderId || !newStatus) return;
    if(newStatus !== "Refund_in_Process"){
    updateDeliveryStatus(selectedOrderId, newStatus);}
  
    // Find the selected order based on the orderId
    // 
    const selectedOrder = deliveries.find(delivery => delivery.orderId === selectedOrderId);
    
    if (!selectedOrder) {
      console.error('Order not found');
      return;
    }
  
    // If the action is 'Process Refund', handle it
    if (newStatus === 'Refund_in_Process') {
      try {
        // Pass the orderId and paymentId to the backend for processing the refund
        const response = await axios.post('https://ff-manager-vercel.vercel.app/api/refund-payment', {
          orderId: selectedOrder.paymentOrderId,  // Pass the order ID
          paymentId: selectedOrder.paymentId,  // Pass the payment ID (for refund)
        });
  
        if (response.data.success) {
          alert('Refund processed successfully');
          console.log("DH refund", response.data.success );
          // Update status locally
          updateDeliveryStatus(selectedOrderId, 'Refund_Successful');
        } else {
          alert('Refund processing failed');
        }
      } catch (error) {
        console.error('Error processing refund:', error);
        alert('An error occurred while processing the refund');
      }
    }
  
    // After handling refund, update the status based on the newStatus
    updateDeliveryStatus(selectedOrderId, newStatus);
    setShowModal(false);
    setSelectedOrderId(null);
    setModalAction(null);
    setNewStatus(null);
  };
  
  

  const handleModalCancel = () => {
    setShowModal(false);
    setSelectedOrderId(null);
    setModalAction(null);
    setNewStatus(null);
  };

  const handleProcessReplacement = (orderId) => {
    openModal(orderId, 'Process Replacement', 'Replacement_in_Process');
  };

  const handleRejectReplacement = (orderId) => {
    openModal(orderId, 'Reject Replacement', 'Replacement_Rejected');
  };

  const handleProcessReturn = (orderId) => {
    openModal(orderId, 'Process Return', 'Return_in_Process');
  };

  const handleProcessRefund = (orderId) => {
    openModal(orderId, 'Process Refund', 'Refund_in_Process');
  };

  const handleReplacementSuccessful = (orderId) => {
    openModal(orderId, 'Replacement Successful', 'Replacement_Successful');
  }

  const handleSuccessfulRefund = (orderId) => {
    openModal(orderId, 'Refund Successfu;', 'Refund_Successful');
  }

  const updateDeliveryStatus = (orderId, newStatus) => {
    deliveries.forEach(orderObj => {
      if (orderObj.orderId === orderId) {
        const database_ref = Ref.ref(database, 'orders/' + orderObj.userId + '/' + orderId);
        
        // Ensure size is defined or set a default value
        const updatedData = { 
          ...orderObj, 
          status: newStatus,
          size: orderObj.size || ''  // Default to an empty string if size is undefined
        };
  
        if(newStatus === 'Refund_in_Process'){
          const product = products.find(product => product.id === orderObj.itemId);
          const database_Ref = Ref.ref(database, 'items/'+orderObj.itemId);
  
          const newProduct = {...product, quantityAvailable: product.quantityAvailable + orderObj.quantity};
  
          update(database_Ref, newProduct)
            .then(() => {
              console.log("Quantity updated successfully");
            })
            .catch((error) => {
              console.error("Error updating quantity: ", error);
            });
        }
  
        update(database_ref, updatedData)
          .then(() => {
            console.log('Order status updated successfully');
            // Update the status locally as well
            const updatedDeliveries = deliveries.map(delivery => {
              if (delivery.orderId === orderId) {
                return { ...delivery, status: newStatus };
              }
              return delivery;
            });
            setDeliveries(updatedDeliveries);
          })
          .catch((error) => {
            console.error('Error updating order status:', error);
          });
      }
    });
  };
  

  const filteredDeliveries = deliveries.filter(delivery => {
    return (
      (searchCriteria.orderId ? delivery.orderId.includes(searchCriteria.orderId) : true) &&
      (searchCriteria.userId ? delivery.userId.includes(searchCriteria.userId) : true) &&
      (searchCriteria.itemId ? delivery.itemId.includes(searchCriteria.itemId) : true) &&
      (searchCriteria.itemName ? delivery.itemName.toLowerCase().includes(searchCriteria.itemName.toLowerCase()) : true) &&
      (searchCriteria.userName ? delivery.userName.toLowerCase().includes(searchCriteria.userName.toLowerCase()) : true) &&
      (searchCriteria.orderDate ? delivery.orderDate.includes(searchCriteria.orderDate) : true) &&
      (searchCriteria.deliveredDate ? new Date(delivery.deliveredOn).toLocaleDateString() === new Date(searchCriteria.deliveredDate).toLocaleDateString() : true) &&
      (searchCriteria.status ? delivery.status === searchCriteria.status : true)
    );
  });

  const currentItems = filteredDeliveries.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);

  const handlePageChange = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div>
      <Header onLogout={onLogout} />
      <div className="delivery__container">
        <h1>Delivery History</h1>

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
            name="itemName"
            placeholder="Item Name"
            value={searchCriteria.itemName}
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
            type={orderDateFo}
            id="orderDate"
            name="orderDate"
            placeholder="Order Date"
            value={searchCriteria.orderDate}
            onChange={handleSearchChange}
            onFocus={() => { setOrderDateFo('date'); }}
            onBlur={() => setOrderDateFo('text')}
          />
          <input
            type={deliverDateFo}
            id="deliveredDate"
            name="deliveredDate"
            placeholder="Delivered Date"
            value={searchCriteria.deliveredDate}
            onChange={handleSearchChange}
            onFocus={() => setDeliverDateFo('date')}
            onBlur={() => setDeliverDateFo('text')}
          />
          
          {/* Status Filter Dropdown */}
          <select
            name="status"
            value={searchCriteria.status}
            onChange={handleSearchChange}
          >
            <option value="">Select Status</option>
            <option value="Delivered">Delivered</option>
            <option value="Return_in_Process">Return in Process</option>
            <option value="Refund_in_Process">Refund in Process</option>
            <option value="Replacement_in_Process">Replacement in Process</option>
            <option value="Replacement_Rejected">Replacement Rejected</option>
            <option value="Return_Requested">Return Requested</option>
            <option value="Replacement_Requested">Replacement Requested</option>
            <option value="Refund_Successful">Refund Successful</option>
            <option value="Replacement_Successful">Replacement Successful</option>
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
                <th>Price (Per Item)</th>
                <th>Payment Method</th>
                <th>Size</th>  
                <th>Order Date</th>    
                <th>Delivered On</th>
                <th>Order Status</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(delivery => (
                <tr key={delivery.orderId}>
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
                  <td>{delivery.deliveredOn ? new Date(delivery.deliveredOn).toLocaleString() : 'N/A'}</td>
                  <td>{delivery.status}</td>
                  <td>{delivery.reason}</td>
                  <td>
                    {(delivery.status === 'Replacement_Requested' ||  delivery.status === 'Replacement_Rejected') && (
                      <div className="replacement-actions">
                        <button 
                          onClick={() => handleProcessReplacement(delivery.orderId)} 
                          className="process-replacement-btn">
                          Process Replacement
                        </button>
                        <button 
                          onClick={() => handleRejectReplacement(delivery.orderId)} 
                          className="reject-replacement-btn">
                          Reject Replacement
                        </button>
                      </div>
                    )}
                    {(delivery.status === 'Replacement_in_Process') && (
                      <div className="replacement-actions">
                        <button 
                          onClick={() => handleReplacementSuccessful(delivery.orderId)} 
                          className="process-replacement-btn">
                          Replacement Successful
                        </button>
                      </div>
                    )}
                    {(delivery.status === 'Return_Requested' ) && (
                      <div className="return-actions">
                        <button 
                          onClick={() => handleProcessReturn(delivery.orderId)} 
                          className="process-return-btn">
                          Process Return
                        </button>
                      </div>
                    )}
                    {( delivery.status === 'Return_in_Process') && (
                      <div className="return-actions">
                        <button 
                          onClick={() => handleProcessRefund(delivery.orderId)} 
                          className="process-refund-btn">
                          Process Refund
                        </button>
                      </div>
                    )}
                    {(  delivery.status === 'Refund_in_Process') && (
                      <div className="return-actions">
                        <button 
                          onClick={() => handleSuccessfulRefund(delivery.orderId)} 
                          className="process-refund-btn">
                          Refund Successful
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={'delivery__pagination'}
          activeClassName={'delivery__pagination-button active'}
          previousClassName={'delivery__pagination-button'}
          nextClassName={'delivery__pagination-button'}
        />
      </div>

      {showModal && (
        <ConfirmationModal
          message={`Are you sure you want to ${modalAction.replace('_', ' ').toLowerCase()}?`}
          onConfirm={handleModalConfirm}
          onCancel={handleModalCancel}
        />
      )}

      <Footer />
    </div>
  );
};

export default DeliveryHistory;
