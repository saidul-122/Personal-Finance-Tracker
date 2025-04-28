
import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="w-full bg-primary text-white py-6 px-4 md:px-8 mb-8">
      <div className="container mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold">Personal Finance Tracker</h1>
        <p className="text-primary-foreground/80 mt-1">Visualize and manage your financial activities</p>
      </div>
    </div>
  );
};

export default Header;
