import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import './Styles/Users.css';
import ReactPaginate from 'react-paginate';

const Users = ({onLogout, users, setUsers }) => {
  const [usernameSearchTerm, setUsernameSearchTerm] = useState('');
  const [uidSearchTerm, setUidSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const filteredUsers = users.filter(user =>
    (user.username?.toLowerCase().includes(usernameSearchTerm.toLowerCase()) || '') &&
    (user.userUid?.toString().includes(uidSearchTerm) || '')
  );
  

  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentItems = filteredUsers.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="manage-users__container">
      <Header onLogout={onLogout} />
      <div className="manage-users__content">
        <h1>Manage Users</h1>
        <div className="manage-users__search-bar">
          <input
            type="text"
            className="manage-users__input"
            placeholder="Search by Username"
            value={usernameSearchTerm}
            onChange={e => setUsernameSearchTerm(e.target.value)}
          />
          <input
            type="text"
            className="manage-users__input"
            placeholder="Search by User UID"
            value={uidSearchTerm}
            onChange={e => setUidSearchTerm(e.target.value)}
          />
        </div>

        <div className="manage-users__table-container">
          <table className="manage-users__table">
            <thead>
              <tr>
                <th>User UID</th>
                <th>Username</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(user => (
                <tr key={user.userUid}>
                  <td >{user.userUid}</td>
                  <td >{user.username}</td>
                  <td>{user.gender}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={'manage-users__pagination'}
          activeClassName={'manage-users__pagination-button active'}
          previousClassName={'manage-users__pagination-button'}
          nextClassName={'manage-users__pagination-button'}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Users;
