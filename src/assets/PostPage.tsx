// PostPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MarkdownPreview from '@uiw/react-markdown-preview';

interface Post {
  slug: string;
  title: string;
  content: string;
  publishedAt: string;
  tags: string[];
}

const API = {
  listPosts: "https://xb7axhfvx3iavilpqwggprjvme0isreh.lambda-url.us-east-1.on.aws/",
  getPost: "https://avhz7ybe7ynb6b6vrofteorkbe0hqtia.lambda-url.us-east-1.on.aws/",
};

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    } else {
      fetchLatestPost();
    }

    if (post?.title) document.title = `${post.title} | Niche, Holy Tech`;
  }, [slug]);

  const fetchLatestPost = async () => {
    try {
      const response = await fetch(`${API.listPosts}?status=published`);
      const data = await response.json();
      if (data.success && data.posts.length > 0) {
        setPost(data.posts[0]);
      }
    } catch (error) {
      console.error('Failed to load latest post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPost = async (slug: string) => {
    try {
      const response = await fetch(API.getPost, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug })
      });
      const data = await response.json();
      if (data.success) {
        setPost(data.post);
      }
    } catch (error) {
      console.error('Failed to load post:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!post) return <div style={styles.error}>Post not found</div>;

  const containerStyle = {
    ...styles.container,
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    color: theme === 'dark' ? '#fff' : '#000',
  };

  return (
    <div style={containerStyle}>
      <div style={styles.header}>
        <Link to="/archive" style={styles.archiveLink}>
          📚 View Archive
        </Link>
        <button onClick={toggleTheme} style={styles.themeToggle}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <article style={styles.article}>
        <h1 style={styles.title}>{post.title}</h1>
        <div style={styles.meta}>
          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          {post.tags && post.tags.length > 0 && (
            <span style={styles.tags}>
              {post.tags.map(tag => `#${tag}`).join(' ')}
            </span>
          )}
        </div>
        
        <MarkdownPreview 
          source={post.content}
          style={{ 
            backgroundColor: 'transparent',
            color: theme === 'dark' ? '#fff' : '#000',
          }}
          data-color-mode={theme}
        />
      </article>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '18px',
  },
  error: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: '#ff6b6b',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '800px',
    margin: '0 auto 40px',
  },
  archiveLink: {
    textDecoration: 'none',
    color: '#4da6ff',
    fontSize: '16px',
    fontWeight: '500',
  },
  themeToggle: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '8px',
  },
  article: {
    maxWidth: '800px',
    margin: '0 auto',
    lineHeight: 1.7,
  },
  title: {
    fontSize: '42px',
    fontWeight: 'bold',
    marginBottom: '20px',
    lineHeight: 1.2,
  },
  meta: {
    display: 'flex',
    gap: '20px',
    marginBottom: '40px',
    fontSize: '14px',
    opacity: 0.7,
  },
  tags: {
    color: '#4da6ff',
  },
};