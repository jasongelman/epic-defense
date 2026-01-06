import { useRef, useEffect, useState } from 'react';
import { GameEngine } from '../GameEngine';
import { GameUI } from './GameUI';

export function GameCanvas({ mapConfig, onQuit }) {
    const canvasRef = useRef(null);
    const engineRef = useRef(null);
    const [selectedTower, setSelectedTower] = useState('ninja');
    const [placedTower, setPlacedTower] = useState(null); // The tower instance currently selected on map
    const [paused, setPaused] = useState(true);
    const [isFastForward, setIsFastForward] = useState(false);
    const [error, setError] = useState(null);
    const [, setForceUpdate] = useState(0); // Hack to force re-render on upgrades

    useEffect(() => {
        if (!mapConfig) {
            setError('Missing Map Configuration');
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        try {
            // Initialize Engine
            engineRef.current = new GameEngine(canvas, mapConfig);
            engineRef.current.setTowerType(selectedTower);
            engineRef.current.start();

            // Wire up selection callback
            engineRef.current.onSelectionChange = (tower) => {
                setPlacedTower(tower);
            };

        } catch (err) {
            console.error("Failed to start GameEngine:", err);
            setError(err.message);
        }

        // Cleanup
        return () => {
            if (engineRef.current) {
                engineRef.current.stop();
            }
        };
    }, [mapConfig]);

    if (error) {
        return (
            <div style={{
                width: '800px', height: '600px',
                background: '#2c3e50', color: '#e74c3c',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                border: '4px solid #e74c3c'
            }}>
                <h1>GAME ERROR</h1>
                <p>{error}</p>
                <button onClick={onQuit} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
                    Return to Menu
                </button>
            </div>
        );
    }

    // ... rest of component ...


    const handleUpgrade = () => {
        if (engineRef.current && engineRef.current.upgradeSelectedTower()) {
            setForceUpdate(n => n + 1);
        }
    };

    const handleSell = () => {
        if (engineRef.current) {
            engineRef.current.sellSelectedTower();
            setPlacedTower(null);
        }
    };

    const handleDeselect = () => {
        if (engineRef.current) {
            engineRef.current.selectedPlacedTower = null;
            engineRef.current.onSelectionChange(null);
        }
    };
    const handleSelectTower = (type) => {
        setSelectedTower(type);
        if (engineRef.current) {
            engineRef.current.setTowerType(type);
        }
    };

    const handleTogglePause = () => {
        if (engineRef.current) {
            const isPaused = engineRef.current.togglePause();
            setPaused(isPaused);
        }
    };

    const handleToggleSpeed = () => {
        if (engineRef.current) {
            const speed = engineRef.current.toggleSpeed();
            setIsFastForward(speed > 1);
        }
    };

    const handleClick = (e) => {
        if (engineRef.current && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const scaleX = canvasRef.current.width / rect.width;
            const scaleY = canvasRef.current.height / rect.height;

            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            engineRef.current.handleInput(x, y);
        }
    };

    const handleMouseMove = (e) => {
        if (engineRef.current && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const scaleX = canvasRef.current.width / rect.width;
            const scaleY = canvasRef.current.height / rect.height;

            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            engineRef.current.handleMouseMove(x, y);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            backgroundColor: '#111'
        }}>
            {/* Game Area: Flex 1 to take remaining space */}
            <div style={{
                flex: 1,
                width: '100%',
                minHeight: 0, // Critical for nested flex scrolling/sizing
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px'
            }}>
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    onClick={handleClick}
                    onMouseMove={handleMouseMove}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        aspectRatio: '4/3',
                        boxShadow: '0 0 50px rgba(0,0,0,0.8)',
                        backgroundColor: '#333',
                        cursor: 'crosshair',
                        display: 'block'
                    }}
                />
            </div>

            {/* UI Area: Natural height at bottom */}
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                paddingBottom: '20px',
                zIndex: 10
            }}>
                <GameUI
                    onSelectTower={handleSelectTower}
                    selectedTower={selectedTower}
                    placedTower={placedTower}
                    onUpgrade={handleUpgrade}
                    onSell={handleSell}
                    onDeselect={handleDeselect}
                    paused={paused}
                    onTogglePause={handleTogglePause}
                    onToggleSpeed={handleToggleSpeed}
                    isFastForward={isFastForward}
                    onQuit={onQuit}
                />
            </div>
        </div>
    );
}
