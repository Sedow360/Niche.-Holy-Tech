import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  tags: string[];
}

const API = {
  checkSub: "https://yl3unq3toivpvqyg5uvmqdsdlq0spmao.lambda-url.us-east-1.on.aws/",
  listPosts: "https://xb7axhfvx3iavilpqwggprjvme0isreh.lambda-url.us-east-1.on.aws/",
  addSub: "https://3zholoxsyh32sc2h7fgz5hjjpm0zvzgt.lambda-url.us-east-1.on.aws/",
  unSub: "https://rqmxrmya7qyhbc32n7fezvmyq40kizbd.lambda-url.us-east-1.on.aws/"
};

export default function Archive() {
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [notSubscribed, setNotSubscribed] = useState<boolean>(false);
  const [subscribing, setSubscribing] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
    if (savedTheme) setTheme(savedTheme);
    
    // Check if user came from navigation (has email in localStorage)
    const savedEmail = localStorage.getItem('subscriberEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      checkSubscription(savedEmail);
    }
    
    setLoading(false);
    document.title = `Archives | Niche, Holy Tech`;
  }, []);

  const checkSubscription = async (email: string) => {
    // Verify with backend
    try {
      const response = await fetch(API.checkSub, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });
      
      const data = await response.json();
      
      // Easter egg: Admin redirect
      if (data.isAdmin) {
        navigate('/admin');
        return;
      }
      
      if (data.subscribed) {
        setIsSubscribed(true);
        setEmail(email);
        localStorage.setItem('subscriberEmail', email);
        await loadPosts();
      } else {
        setNotSubscribed(true); // Show subscribe option
    }
    } catch (error) {
      console.error('Subscription check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const response = await fetch(`${API.listPosts}?status=published`);
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!email || !email.trim()) {
      alert('Please enter a valid email');
      return;
    }
  
    setLoading(true);
    await checkSubscription(email.trim());
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSubscribe = async () => {
    if (!email) return;
  
    setSubscribing(true);
    try {
      const response = await fetch(API.addSub, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });
    
      const data = await response.json();
    
      if (data.success) {
        // Recheck subscription status
        setNotSubscribed(false);
        await checkSubscription(email);
      } else {
        alert('Subscription failed. Please try again.');
      }
    } catch (error) {
      console.error('Subscription failed:', error);
      alert('Error subscribing. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!confirm('Are you sure you want to unsubscribe?')) return;
  
    try {
      const response = await fetch(API.unSub, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });
    
      const data = await response.json();
    
      if (data.success) {
        // Clear state and redirect
        localStorage.removeItem('subscriberEmail');
        setIsSubscribed(false);
        setEmail('');
        navigate('/');
      } else {
        alert('Unsubscribe failed. Please try again.');
      }
    } catch (error) {
      console.error('Unsubscribe failed:', error);
      alert('Error unsubscribing. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // If not subscribed, show email form
  if (!isSubscribed) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000',
        padding: '40px'
      }}>
        <button onClick={toggleTheme} style={{ position: 'absolute', top: 20, right: 20 }}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        
        <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
          <h1>📚 Archive Access</h1>
          <p>Enter your email to view all posts</p>
          
          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '93%',
                padding: '12px',
                marginTop: '20px',
                backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
                color: theme === 'dark' ? '#fff' : '#000',
                border: '1px solid #444',
                borderRadius: '4px',
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '10px',
                backgroundColor: '#0066cc',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Continue
            </button>
          </form>

          {/* Show subscribe option if email not subscribed */}
          {notSubscribed && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <p style={{ marginBottom: '10px', color: theme === 'dark' ? '#ccc' : '#666' }}>
                This email is not subscribed. Subscribe to access more blogs like this!
              </p>
              <button
                onClick={handleSubscribe}
                disabled={subscribing}
                style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: subscribing ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                opacity: subscribing ? 0.6 : 1,
                }}
              >
                {subscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          )}
          </div>
      </div>
    );
  }

  // If subscribed, show posts grid
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
      color: theme === 'dark' ? '#fff' : '#000',
      padding: '40px'
    }}>
      <button onClick={toggleTheme} style={{ position: 'absolute', top: 20, right: 20 }}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* Add Unsubscribe button */}
      <button 
        onClick={handleUnsubscribe}
        style={{ 
          position: 'absolute', 
          top: 20, 
          right: 70,  // Position it left of theme button
          padding: '8px 16px',
          backgroundColor: '#dc3545',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        Unsubscribe
      </button>
      
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>📚 Archive</h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {posts.map(post => (
          <a
            key={post.slug}
            href={`/post/${post.slug}`}
            style={{
              backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f5f5f5',
              padding: '20px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <h3>{post.title}</h3>
            <p style={{ opacity: 0.7, fontSize: '14px' }}>
              {new Date(post.publishedAt).toLocaleDateString()}
            </p>
            <p>{post.excerpt}</p>
            <div style={{ color: '#4da6ff', fontSize: '14px' }}>
              {post.tags?.map(tag => `#${tag}`).join(' ')}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}