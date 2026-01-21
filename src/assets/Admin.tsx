// Admin.tsx
import { useState, useEffect } from 'react';

// Types
interface Post {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  publishedAt: string | null;
  status: 'draft' | 'published';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Subscriber {
  email: string;
  subscribedAt: string;
  id: string;
}

type SortOption = 'latest' | 'oldest' | 'longest' | 'shortest';

// API Configuration
const API = {
  adminAuth: "https://4sbs43rmtb37sfmitzuxoarqoi0wbibv.lambda-url.us-east-1.on.aws/",
  createPost: "https://zxgv2ztejlxjh6hzajujbow5bu0krysv.lambda-url.us-east-1.on.aws/",
  listPosts: "https://m576x5sgc6uxmh57j4umisjftm0cscbf.lambda-url.us-east-1.on.aws/",
  deletePost: "https://knjnajr3zpxtypkgg7ay73tjsu0nibbh.lambda-url.us-east-1.on.aws/",
  getSubscribers: "https://shs22vd56jvibykk3e7snxhrli0hvqeq.lambda-url.us-east-1.on.aws/",
};

const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
    },
    loginBox: {
      backgroundColor: '#2a2a2a',
      color: '#fff',
      padding: '40px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      maxWidth: '400px',
      margin: '100px auto',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      margin: 10,
      color: '#fff',
    },
    logoutBtn: {
      padding: '8px 16px',
      backgroundColor: '#666',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    tabs: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      borderBottom: '2px solid #333',
    },
    tab: {
      padding: '12px 20px',
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '3px solid transparent',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      color: '#999',
    } as React.CSSProperties,
    activeTab: {
      color: '#4da6ff',
      borderBottomColor: '#4da6ff',
    } as React.CSSProperties,
    content: {
      backgroundColor: '#2a2a2a',
      color: '#fff',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    },
    sectionTitle: {
      fontSize: '22px',
      fontWeight: 'bold',
      marginBottom: '20px',
      marginTop: 0,
      color: '#fff',
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '15px',
    },
    input: {
      padding: '12px',
      fontSize: '16px',
      backgroundColor: '#333',
      color: '#fff',
      border: '1px solid #444',
      borderRadius: '4px',
      width: '93%',
    },
    textarea: {
      padding: '12px',
      fontSize: '16px',
      backgroundColor: '#333',
      color: '#fff',
      border: '1px solid #444',
      borderRadius: '4px',
      minHeight: '300px',
      fontFamily: 'monospace',
      resize: 'vertical' as const,
    },
    select: {
      padding: '12px',
      fontSize: '16px',
      backgroundColor: '#333',
      color: '#fff',
      border: '1px solid #444',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    formRow: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#0066cc',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      flex: 1,
    },
    buttonDisabled: {
      backgroundColor: '#555',
      cursor: 'not-allowed',
    },
    message: {
      padding: '12px',
      marginBottom: '20px',
      borderRadius: '4px',
      backgroundColor: '#1e3a5f',
      border: '1px solid #2563eb',
      color: '#fff',
    },
    error: {
      color: '#ff6b6b',
      marginTop: '10px',
      textAlign: 'center' as const,
    },
    list: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '15px',
    },
    listItem: {
      padding: '15px',
      backgroundColor: '#333',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    postInfo: {
      flex: 1,
    },
    postTitle: {
      margin: '0 0 5px 0',
      fontSize: '18px',
      fontWeight: '600',
      color: '#fff',
    },
    postMeta: {
      margin: 0,
      fontSize: '14px',
      color: '#999',
    },
    draftBadge: {
      backgroundColor: '#ffc107',
      color: '#000',
      padding: '2px 8px',
      borderRadius: '3px',
      fontSize: '12px',
      fontWeight: 'bold',
      marginRight: '8px',
    },
    postActions: {
      display: 'flex',
      gap: '10px',
    },
    linkBtn: {
      padding: '8px 16px',
      backgroundColor: '#0066cc',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      textDecoration: 'none',
      fontSize: '14px',
    },
    deleteBtn: {
      padding: '8px 16px',
      backgroundColor: '#d9534f',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    subscriberEmail: {
      margin: '0 0 5px 0',
      fontSize: '16px',
      fontWeight: '500',
      color: '#fff',
    },
    subscriberDate: {
      margin: 0,
      fontSize: '14px',
      color: '#999',
    },
    emptyState: {
      textAlign: 'center' as const,
      color: '#666',
      fontSize: '18px',
      padding: '40px',
    },
    publishedBadge: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '2px 8px',
    borderRadius: '3px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginRight: '8px',
  },
  editBtn: {
    padding: '8px 16px',
    backgroundColor: '#ff9800',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [posts, setPosts] = useState<Post[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [activeTab, setActiveTab] = useState<'write' | 'posts' | 'subscribers'>('write');
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      verifyToken(token);
    }
    document.title = `Admin | Niche, Holy Tech`;
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(API.adminAuth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', token })
      });
      const data = await response.json();
      
      if (data.valid) {
        setIsAuthenticated(true);
        loadData();
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('adminToken');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(API.adminAuth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password })
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        loadData();
      } else {
        setMessage('❌ Invalid password');
      }
    } catch (error) {
      setMessage('❌ Login failed' + error);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    await Promise.all([loadPosts(), loadSubscribers()]);
  };

  const loadPosts = async () => {
  try {
    const response = await fetch(API.listPosts);
    
    const text = await response.text();
    const data = JSON.parse(text);
    
    if (data.success) {
      setPosts(data.posts);
    }
  } catch (error) {
    console.error('Full error:', error);
  }
};

  const loadSubscribers = async () => {
    try {
      // Get token from localStorage (set during login)
      const token = localStorage.getItem('adminToken');
    
      if (!token) {
        console.error('No admin token found');
        return;
      }
    
      const response = await fetch(API.getSubscribers, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error('Failed to load subscribers:', response.status);
        return;
      }

      const data = await response.json();
    
      if (data.success) {
        setSubscribers(data.subscribers);
      } else {
        console.error('Subscribers API returned error:', data.error);
      }
    } catch (error) {
      console.error('Failed to load subscribers:', error);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setMessage('❌ Title and content are required');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(API.createPost, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: editingSlug || undefined,
          title,
          content,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          status
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ Post ${status === 'published' ? 'published' : 'saved as draft'}!`);
        setTitle('');
        setContent('');
        setTags('');
        setEditingSlug(null);
        await loadPosts();
      } else {
        setMessage('❌ Failed to create post');
      }
    } catch (error) {
      setMessage('❌ Error creating post' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: Post) => {
    setActiveTab('write');
    setTitle(post.title);
    setContent(post.content);
    setTags(post.tags.join(', '));
    setStatus(post.status);
    setEditingSlug(post.slug);
    setMessage(`✏️ Editing: ${post.title}`);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Delete post "${slug}"?`)) return;

    try {
      console.log('Deleting:', slug);
    
      const response = await fetch(API.deletePost, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug })
      });
      const text = await response.text();
      const data = JSON.parse(text);
    
      if (data.success) {
        setMessage('✅ Post deleted');
        await loadPosts();
      } else {
        setMessage(`❌ ${data.error || 'Failed to delete'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage('❌ Error deleting post');
    }
  };

  // Sort posts based on selected option
  const sortedPosts = [...posts].sort((a, b) => {
    switch(sortBy) {
      case 'latest':
        return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
      case 'oldest':
        return new Date(a.publishedAt || a.createdAt).getTime() - new Date(b.publishedAt || b.createdAt).getTime();
      case 'longest':
        return (b.content?.length || 0) - (a.content?.length || 0);
      case 'shortest':
        return (a.content?.length || 0) - (b.content?.length || 0);
      default:
        return 0;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.loginBox}>
          <h1 style={styles.title}>🔒 Admin Login</h1>
          <div style={styles.form}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
              style={styles.input}
              autoFocus
            />
            <button onClick={handleLogin} disabled={loading} style={styles.button}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          {message && <p style={styles.error}>{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>⚙️ Admin Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('write')}
          style={{...styles.tab, ...(activeTab === 'write' ? styles.activeTab : {})}}
        >
          ✍️ Write Post
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          style={{...styles.tab, ...(activeTab === 'posts' ? styles.activeTab : {})}}
        >
          📚 Posts ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          style={{...styles.tab, ...(activeTab === 'subscribers' ? styles.activeTab : {})}}
        >
          👥 Subscribers ({subscribers.length})
        </button>
      </div>

      {message && <div style={styles.message}>{message}</div>}

      {activeTab === 'write' && (
        <div style={styles.content}>
          <h2 style={styles.sectionTitle}>Create New Post</h2>
          <div style={styles.form}>
            <input
              type="text"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />
            
            <textarea
              placeholder="Post Content (Markdown supported)&#10;&#10;# Heading&#10;## Subheading&#10;**bold** *italic*&#10;- List item"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={styles.textarea}
            />
            
            <input
              type="text"
              placeholder="Tags (comma separated, e.g. aws, serverless)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={styles.input}
            />

            <div style={styles.formRow}>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                style={styles.select}
              >
                <option value="published">Publish</option>
                <option value="draft">Save as Draft</option>
              </select>

              <button
                onClick={handlePublish}
                disabled={loading}
                style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
              >
                {loading ? 'Publishing...' : status === 'published' ? '🚀 Publish' : '💾 Save Draft'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'posts' && (
        <div style={styles.content}>
          <h2 style={styles.sectionTitle}>Your Posts</h2>
          <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
            <h2 style={styles.sectionTitle}>Your Posts</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '14px', color: '#999' }}>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              style={{
                ...styles.select,
                padding: '8px 12px',
                fontSize: '14px',
              }}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="longest">Longest First</option>
              <option value="shortest">Shortest First</option>
            </select>
          </div>
        </div>
          {posts.length === 0 ? (
            <p style={styles.emptyState}>No posts yet. Write your first one! ✍️</p>
          ) : (
            <div style={styles.list}>
              {sortedPosts.map(post => (
                <div key={post.slug} style={styles.listItem}>
                  <div style={styles.postInfo}>
                    <h3 style={styles.postTitle}>{post.title}</h3>
                    <p style={styles.postMeta}>
                      {post.status === 'draft' && <span style={styles.draftBadge}>DRAFT</span>}
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Not published'}
                      {' • '}
                      {post.tags?.join(', ')}
                    </p>
                  </div>
                  <div style={styles.postActions}>
                    <button onClick={() => handleEdit(post)} style={styles.editBtn}>
                      Edit
                    </button>
                    <a
                      href={`/post/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.linkBtn}
                    >
                      View
                    </a>
                    <button onClick={() => handleDelete(post.slug)} style={styles.deleteBtn}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'subscribers' && (
        <div style={styles.content}>
          <h2 style={styles.sectionTitle}>Subscribers</h2>
          {subscribers.length === 0 ? (
            <p style={styles.emptyState}>No subscribers yet. Share your newsletter! 📢</p>
          ) : (
            <div style={styles.list}>
              {subscribers.map(sub => (
                <div key={sub.email} style={styles.listItem}>
                  <div>
                    <p style={styles.subscriberEmail}>{sub.email}</p>
                    <p style={styles.subscriberDate}>
                      Subscribed: {new Date(sub.subscribedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
