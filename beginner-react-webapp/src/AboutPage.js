import React from 'react';
import { Link } from 'react-router-dom';

function AboutPage() {
  return (
    <div>
      <h1>About This App</h1>
      <p>This is the About Page. Here you can learn more about this app.</p>
      <p>This application is part of a larger project to learn coding across multiple platforms.</p>
      <Link to="/">
        <button>Go to Home Page</button>
      </Link>
    </div>
  );
}

export default AboutPage;
