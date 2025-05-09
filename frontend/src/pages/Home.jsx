import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Welcome to My Social App</h1>
      </main>
      <Footer />
    </div>
  );
};

export default Home;