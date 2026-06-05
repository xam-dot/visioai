'use client';
import { useState, useEffect } from 'react';
import { supabase, signOut, getUser } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('image');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Photorealistic');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [resultType, setResultType] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    getUser().then(setUser);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleGenerate() {
    if (!prompt.trim()) { setError('Please enter a prompt first.'); return; }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const endpoint = activeTab === 'image' ? '/api/generate-image' : '/api/generate-video';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, userId: user?.id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(activeTab === 'image' ? data.imageUrl : data.videoUrl);
      setResultType(activeTab);
    } catch (err) {
      setError(err.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    setUser(null);
  }

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px',
        background: 'rgba(5,5,8,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '1.4rem',
          letterSpacing: '0.1em',
          background: 'linear-gradient(135deg, #00d4ff, #7b2fff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>VISIO<span style={{
          background: 'linear-gradient(135deg, #7b2fff, #ff2d78)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>AI</span></div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{user.email}</span>
              <button onClick={() => router.push('/dashboard')} style={navBtnStyle}>Dashboard</button>
              <button onClick={handleSignOut} style={{ ...navBtnStyle, borderColor: 'var(--accent3)', color: 'var(--accent3)' }}>Sign Out</button>
            </>
          ) : (
            <>
              <button onClick={() => router.push('/login')} style={navBtnStyle}>Sign In</button>
              <button onClick={() => router.push('/signup')} style={{ ...navBtnStyle, background: 'linear-gradient(135deg,#00d4ff,#7b2fff)', color: '#fff', border: 'none' }}>Sign Up Free</button>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '120px 48px 60px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Orbs */}
        {[
          { w: 600, h: 600, color: 'rgba(0,212,255,0.12)', top: '-100px', left: '-150px' },
          { w: 500, h: 500, color: 'rgba(123,47,255,0.15)', bottom: '-100px', right: '-100px' },
        ].map((o, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%', filter: 'blur(80px)',
            width: o.w, height: o.h, background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
            top: o.top, left: o.left, bottom: o.bottom, right: o.right, pointerEvents: 'none',
          }} />
        ))}

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', border: '1px solid rgba(0,212,255,0.3)',
          borderRadius: 20, fontSize: '0.72rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 36,
        }}>
          <span style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%', boxShadow: '0 0 8px #00d4ff' }} />
          Next-Gen AI Creative Suite
        </div>

        <h1 style={{
          fontFamily: 'Orbitron, monospace', fontWeight: 900,
          fontSize: 'clamp(2.8rem, 7vw, 6rem)', lineHeight: 1.05,
          marginBottom: 24,
        }}>
          <div>Create Without</div>
          <div style={{
            background: 'linear-gradient(90deg, #00d4ff, #7b2fff, #ff2d78)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Boundaries</div>
        </h1>

        <p style={{ maxWidth: 560, fontSize: '1.05rem', color: 'var(--muted)', lineHeight: 1.8, marginBottom: 48, fontWeight: 300 }}>
          Generate stunning images and cinematic videos from text prompts in seconds. Powered by the most advanced AI models.
        </p>

        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={() => document.getElementById('generate').scrollIntoView({ behavior: 'smooth' })} style={primaryBtnStyle}>
            ⚡ Start Creating
          </button>
          {!user && (
            <button onClick={() => router.push('/signup')} style={secondaryBtnStyle}>
              Sign Up Free
            </button>
          )}
        </div>
      </section>

      {/* STATS */}
      <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'rgba(12,12,20,0.6)', backdropFilter: 'blur(10px)' }}>
        {[['12M+', 'Images Generated'], ['840K', 'Active Creators'], ['4.9s', 'Avg Gen Time'], ['99.8%', 'Uptime']].map(([num, label]) => (
          <div key={label} style={{ flex: 1, maxWidth: 240, padding: '28px 32px', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.8rem', fontWeight: 900, background: 'linear-gradient(135deg,#00d4ff,#7b2fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{num}</div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* GENERATOR */}
      <section id="generate" style={{ position: 'relative', zIndex: 1, padding: '100px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16, fontFamily: 'Orbitron, monospace' }}>// Generate</div>
        <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 700, marginBottom: 12 }}>Bring Your Vision to Life</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 48, fontWeight: 300 }}>Type anything. Our AI handles the rest.</p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: 4, width: 'fit-content' }}>
          {['image', 'video'].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setResult(null); setError(''); }}
              style={{
                padding: '10px 28px', borderRadius: 4, border: 'none', cursor: 'pointer',
                fontFamily: 'Orbitron, monospace', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                background: activeTab === tab ? 'linear-gradient(135deg,#00d4ff,#7b2fff)' : 'transparent',
                color: activeTab === tab ? '#fff' : 'var(--muted)',
                transition: 'all 0.3s',
              }}>
              {tab === 'image' ? '🖼 Image' : '🎬 Video'}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Input Panel */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 32, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#00d4ff,#7b2fff,#ff2d78)' }} />
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 }}>Prompt Configuration</div>

            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={activeTab === 'image'
                ? 'A lone astronaut on a crystalline alien planet, twin moons rising, bioluminescent flora, cinematic, 8K...'
                : 'A cinematic drone shot flying through neon-lit cyberpunk streets at night, rain-soaked reflections, 4K...'}
              style={{
                width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: 4, padding: 16, color: 'var(--text)', fontFamily: 'Syne, sans-serif',
                fontSize: '0.9rem', lineHeight: 1.6, resize: 'none', height: 130, outline: 'none',
              }}
            />

            {activeTab === 'image' && (
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                {[['Style', ['Photorealistic', 'Cinematic', 'Concept Art', 'Anime', 'Oil Painting'], style, setStyle]].map(([label, opts, val, setter]) => (
                  <div key={label} style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>{label}</div>
                    <select value={val} onChange={e => setter(e.target.value)} style={{
                      width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
                      borderRadius: 4, padding: '9px 12px', color: 'var(--text)',
                      fontFamily: 'Syne, sans-serif', fontSize: '0.82rem', outline: 'none',
                    }}>
                      {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            )}

            {error && <div style={{ marginTop: 12, color: '#ff2d78', fontSize: '0.82rem', padding: '8px 12px', background: 'rgba(255,45,120,0.1)', borderRadius: 4, border: '1px solid rgba(255,45,120,0.3)' }}>{error}</div>}

            {activeTab === 'video' && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 4, fontSize: '0.8rem', color: 'rgba(0,212,255,0.8)' }}>
                ⏱ Video generation takes 60–120 seconds. Please wait after clicking Generate.
              </div>
            )}

            <button onClick={handleGenerate} disabled={loading} style={{
              ...primaryBtnStyle, width: '100%', marginTop: 20, padding: 14,
              opacity: loading ? 0.8 : 1, cursor: loading ? 'not-allowed' : 'pointer',
              position: 'relative', overflow: 'hidden',
            }}>
              {loading ? '⟳ Generating...' : '⚡ Generate'}
            </button>
          </div>

          {/* Output Panel */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 380, position: 'relative',
          }}>
            {loading ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 16, animation: 'pulse 1.5s ease infinite' }}>
                  GENERATING...
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)',
                      animation: `bounce 1s ease ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
                {activeTab === 'video' && <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: 16 }}>Videos take 1–2 minutes...</p>}
              </div>
            ) : result ? (
              resultType === 'image' ? (
                <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 380 }}>
                  <img src={result} alt="Generated" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 380 }} />
                  <a href={result} download="visioai-image.webp" target="_blank" rel="noopener noreferrer" style={{
                    position: 'absolute', bottom: 16, right: 16,
                    padding: '8px 16px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
                    border: '1px solid var(--accent)', borderRadius: 4, color: 'var(--accent)',
                    textDecoration: 'none', fontSize: '0.72rem', fontFamily: 'Orbitron, monospace', letterSpacing: '0.1em',
                  }}>⬇ SAVE</a>
                </div>
              ) : (
                <video src={result} controls autoPlay loop style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 380 }} />
              )
            ) : (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.2 }}>
                  {activeTab === 'image' ? '🖼' : '🎬'}
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Your {activeTab} will appear here</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 48px 100px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16, fontFamily: 'Orbitron, monospace' }}>// Capabilities</div>
        <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(1.8rem,3.5vw,2.4rem)', fontWeight: 700, marginBottom: 48 }}>Everything You Need</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {[
            ['🎨', 'Text to Image', 'Transform descriptions into stunning visuals. Supports photorealism, illustration, concept art, and more.'],
            ['🎬', 'Text to Video', 'Generate fluid cinematic videos from a single prompt with full motion control.'],
            ['✏️', 'Multiple Styles', 'Photorealistic, cinematic, anime, oil painting — choose your aesthetic.'],
            ['⚡', 'Fast Generation', 'Images in under 10 seconds. Videos in 1–2 minutes.'],
            ['💾', 'Save History', 'Every generation is saved to your dashboard. Never lose your creations.'],
            ['🔓', 'Free to Start', '100 free generations when you sign up. No credit card needed.'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{
              background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 32,
              transition: 'all 0.3s',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 16 }}>{icon}</div>
              <h3 style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.82rem', letterSpacing: '0.05em', marginBottom: 10 }}>{title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.7, fontWeight: 300 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        position: 'relative', zIndex: 1, borderTop: '1px solid var(--border)',
        padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(5,5,8,0.8)',
      }}>
        <div style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '1.1rem', background: 'linear-gradient(135deg,#00d4ff,#7b2fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>VISIOAI</div>
        <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>© 2026 VisioAI. Crafted for creators.</p>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
    </div>
  );
}

const primaryBtnStyle = {
  padding: '14px 36px',
  background: 'linear-gradient(135deg, #00d4ff, #7b2fff)',
  color: 'white', border: 'none', borderRadius: 3,
  fontFamily: 'Orbitron, monospace', fontSize: '0.75rem', fontWeight: 700,
  letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
};

const secondaryBtnStyle = {
  padding: '14px 36px',
  background: 'transparent', color: 'var(--text)',
  border: '1px solid var(--border)', borderRadius: 3,
  fontFamily: 'Orbitron, monospace', fontSize: '0.75rem', fontWeight: 700,
  letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
};

const navBtnStyle = {
  padding: '8px 20px', background: 'transparent',
  border: '1px solid var(--border)', color: 'var(--text)',
  borderRadius: 3, fontFamily: 'Orbitron, monospace',
  fontSize: '0.68rem', letterSpacing: '0.12em', cursor: 'pointer',
};
