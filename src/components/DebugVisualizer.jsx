import React, { useEffect, useState } from 'react';
import { SpriteManager } from '../SpriteManager';

export function DebugVisualizer({ onBack }) {
    const [assets, setAssets] = useState([]);
    const [summary, setSummary] = useState({ loaded: 0, error: 0, pending: 0, total: 0 });

    useEffect(() => {
        const assetList = Object.entries(SpriteManager.ASSETS).map(([key, src]) => ({
            key,
            src,
            status: 'pending' // pending, success, error
        }));

        setAssets(assetList);
        setSummary(s => ({ ...s, total: assetList.length, pending: assetList.length }));

        // Test load each manually
        assetList.forEach((item, index) => {
            const img = new Image();
            img.src = item.src;
            img.onload = () => {
                setAssets(ids => {
                    const newIds = [...ids];
                    newIds[index].status = 'success';
                    return newIds;
                });
            };
            img.onerror = () => {
                setAssets(ids => {
                    const newIds = [...ids];
                    newIds[index].status = 'error';
                    return newIds;
                });
            };
        });
    }, []);

    useEffect(() => {
        const loaded = assets.filter(a => a.status === 'success').length;
        const error = assets.filter(a => a.status === 'error').length;
        const pending = assets.filter(a => a.status === 'pending').length;
        setSummary({ total: assets.length, loaded, error, pending });
    }, [assets]);

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            backgroundColor: '#111',
            color: '#fff',
            padding: '20px',
            overflowY: 'auto',
            fontFamily: 'monospace',
            zIndex: 9999
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #444', paddingBottom: '20px', marginBottom: '20px' }}>
                <div>
                    <h1>🛠️ SYSTEM DIAGNOSTIC</h1>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '1.2rem' }}>
                        <span style={{ color: '#3498db' }}>TOTAL: {summary.total}</span>
                        <span style={{ color: '#2ecc71' }}>OK: {summary.loaded}</span>
                        <span style={{ color: '#e74c3c' }}>ERR: {summary.error}</span>
                    </div>
                </div>
                <button onClick={onBack} style={{
                    padding: '10px 20px',
                    fontSize: '1.2rem',
                    background: '#e74c3c',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}>CLOSE DEBUGGER</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {assets.map((asset) => (
                    <div key={asset.key} style={{
                        border: asset.status === 'error' ? '2px solid #e74c3c' : '1px solid #444',
                        background: '#222',
                        padding: '10px',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <div style={{
                            width: '100px', height: '100px',
                            background: '#000',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '10px',
                            overflow: 'hidden'
                        }}>
                            {asset.status === 'success' && <img src={asset.src} alt={asset.key} style={{ maxWidth: '100%', maxHeight: '100%' }} />}
                            {asset.status === 'error' && <span style={{ fontSize: '3rem' }}>❌</span>}
                            {asset.status === 'pending' && <span style={{ fontSize: '2rem' }}>⏳</span>}
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#f1c40f' }}>{asset.key}</div>
                        <div style={{ fontSize: '0.8rem', color: '#7f8c8d', wordBreak: 'break-all', textAlign: 'center' }}>
                            {asset.src.split('/').pop()}
                        </div>
                        <div style={{
                            marginTop: '5px',
                            fontWeight: 'bold',
                            color: asset.status === 'success' ? '#2ecc71' : asset.status === 'error' ? '#e74c3c' : '#bdc3c7'
                        }}>
                            {asset.status.toUpperCase()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
