'use client';
import { useState, useEffect } from 'react';

export default function TweaksPanel({ onGeomChange, onSpeedChange }: { onGeomChange: (g: string) => void, onSpeedChange: (s: number) => void }) {
  const [active, setActive] = useState(false);
  const [accent, setAccent] = useState('oklch(0.72 0.18 280)');
  const [geom, setGeom] = useState('torus');
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === '__activate_edit_mode') setActive(true);
      if (e.data?.type === '__deactivate_edit_mode') setActive(false);
    };
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    document.documentElement.style.setProperty('--accent', accent);

    return () => window.removeEventListener('message', onMessage);
  }, [accent]);

  const changeAccent = (c: string) => {
    setAccent(c);
    document.documentElement.style.setProperty('--accent', c);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { accentColor: c } }, '*');
  };

  const colors = [
    'oklch(0.72 0.19 48)',
    'oklch(0.72 0.18 280)',
    'oklch(0.72 0.18 140)',
    'oklch(0.72 0.18 200)',
    'oklch(0.72 0.18 10)'
  ];

  return (
    <div id="tweaks-panel" className={active ? 'active' : ''}>
      <div className="tweaks-title">Tweaks <span style={{color: 'var(--muted)', fontSize: '.7rem', fontFamily: 'var(--font-dm)', fontWeight: 300}}>Live controls</span></div>
      <div className="tweaks-row">
        <div className="tweaks-label">Accent Color</div>
        <div className="tweaks-swatches">
          {colors.map(c => (
            <div 
              key={c}
              className={`swatch ${c === accent ? 'active' : ''}`}
              style={{ background: c }}
              onClick={() => changeAccent(c)}
            />
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <div className="tweaks-label">3D Geometry</div>
        <select className="tweaks-select" value={geom} onChange={(e) => {
            setGeom(e.target.value);
            onGeomChange(e.target.value);
        }}>
          <option value="torus">Torus Knot</option>
          <option value="icosahedron">Icosahedron</option>
          <option value="octahedron">Octahedron</option>
          <option value="sphere">Sphere</option>
        </select>
      </div>
      <div className="tweaks-row">
        <div className="tweaks-label">Animation Speed</div>
        <input type="range" min="0.2" max="3" step="0.1" value={speed} onChange={(e) => {
            const val = parseFloat(e.target.value);
            setSpeed(val);
            onSpeedChange(val);
        }} />
      </div>
    </div>
  );
}
