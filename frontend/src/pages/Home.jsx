  import React, { useEffect, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import Header from '../components/Header';
  import Footer from '../components/Footer';
  import PostCard from '../components/PostCard'; // Ensure this path is correct

  const Home = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const user = JSON.parse(localStorage.getItem('user')); // Assuming the user object is stored in localStorage
    const userId = user ? user.id : null; // Get the user ID from the user object
    console.log('User ID:', userId);

    useEffect(() => {
      fetchFeed();
    }, []);

    const fetchFeed = async () => {
      try {
        if (!userId) {
          console.error('User ID is not available');
          return;
        }
        console.log('Fetching feed for user ID:', userId);
        const res = await axios.get(`http://localhost:5000/api/users/${userId}/feed/posts`);
        console.log('Feed response:', res.data);
        // If response is like { posts: [...] }, access res.data.posts
        const fetchedPosts = Array.isArray(res.data) ? res.data : res.data.posts;
    
        setPosts(fetchedPosts || []); // Default to empty array if undefined
      }catch (err) {
        console.error('Error loading feed:', err.message);
        if (err.response) {
          console.error('Server responded with:', err.response.data);
        }
      }
      
    };
    

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-blue-50 to-blue-100">
        <Header />

        <main className="flex-1 container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 tracking-tight mb-4">
              Welcome to <span className="text-blue-600">Connectify</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10">
              Share your moments. Follow friends. Explore stories.
            </p>

            {/* Button section */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12">
              <button
                onClick={() => navigate('/create-post')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow"
              >
                Create Post
              </button>
              <button
                onClick={() => navigate('/edit-profile')}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow"
              >
                Edit Profile
              </button>
              <button
                onClick={() => navigate('/search')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow"
              >
                Search Profiles
              </button>
            </div>


            {/* Post Feed */}
            <div className="max-w-3xl mx-auto space-y-8">
              {posts.length === 0 ? (
                <p className="text-gray-500 text-center">No posts yet. Follow others or create a post!</p>
              ) : (
                posts.map((post) => (
                  <PostCard key={post._id} post={post} viewerId={userId} onPostUpdated={fetchFeed} />
                ))
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  };

  export default Home;