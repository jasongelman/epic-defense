import React from 'react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    backgroundColor: '#2c3e50',
                    color: '#ecf0f1',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'monospace'
                }}>
                    <h1 style={{ color: '#e74c3c', fontSize: '2rem' }}>Something went wrong.</h1>
                    <div style={{
                        backgroundColor: '#34495e',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        marginTop: '1rem',
                        maxWidth: '80%',
                        overflow: 'auto',
                        border: '1px solid #e74c3c'
                    }}>
                        <p style={{ fontWeight: 'bold', color: '#f1c40f' }}>{this.state.error && this.state.error.toString()}</p>
                        <pre style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '2rem',
                            padding: '0.5rem 1rem',
                            fontSize: '1.2rem',
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer'
                        }}
                    >
                        Reload Game
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
