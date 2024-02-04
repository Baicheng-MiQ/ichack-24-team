import React from 'react'

const TopNavbar = () => {
    // Inline styles for demonstration purposes
    const navbarStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#333',
      color: '#fff'
    };
  
    const logoStyle = {
      fontWeight: 'bold',
      fontSize: '24px'
    };
  
    const buttonStyle = {
      padding: '10px 20px',
      margin: '0 10px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    };
  
    return (
      <div style={navbarStyle}>
          <p className="font-spaceGrotesk text-[21px] text-secondary font-bold">
            Heart<span className="bg-blue">Speak</span>
          </p>
        <div>
          <button style={buttonStyle}>Home</button>
          <button style={buttonStyle}>About</button>
          <button style={buttonStyle}>Contact</button>
        </div>
      </div>
    );
  };
  
  export default TopNavbar;