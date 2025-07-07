import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>Welcome to My First Web App!</h1>
      <p>This is the home page.</p>
      <Link to="/about">
        <button>Go to About Page</button>
      </Link>
    </div>
  );
}

export default HomePage;
