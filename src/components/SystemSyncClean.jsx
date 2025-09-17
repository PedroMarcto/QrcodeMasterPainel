import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { 
  Smartphone, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Users,
  Trophy,
  Clock,
  Wifi,
  WifiOff,
  Globe
} from 'lucide-react';
import { getQRCodeStats } from '../utils/qrCodeUtils';
import './SystemSyncClean.css';

export default function SystemSyncClean() {
  const { 
    gameStatus, 
    timeRemaining, 
    teams, 
    scannedQRCodes,
    dispatch 
  } = useGame();
  
  const [syncStatus, setSyncStatus] = useState('disconnected');
  const [lastSync, setLastSync] = useState(null);
  const [mobileStats, setMobileStats] = useState(null);
  const [autoSync, setAutoSync] = useState(true);

  useEffect(() => {
    if (autoSync && gameStatus === 'active') {
      const interval = setInterval(() => {
        simulateMobileSync();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [autoSync, gameStatus]);

  const simulateMobileSync = async () => {
    setSyncStatus('syncing');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMobileData = {
        connectedPlayers: Math.floor(Math.random() * 8) + 2,
        totalScans: scannedQRCodes.length + Math.floor(Math.random() * 3),
        lastActivity: new Date().toISOString(),
        deviceInfo: {
          platform: 'mobile',
          version: '1.0.0',
          devices: ['iPhone 12', 'Samsung Galaxy S21', 'Pixel 6']
        }
      };
      
      setMobileStats(mockMobileData);
      setSyncStatus('connected');
      setLastSync(new Date());
      
    } catch (error) {
      console.error('Erro na sincronização:', error);
      setSyncStatus('error');
    }
  };

  const manualSync = () => {
    simulateMobileSync();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'connected':
        return <Wifi className="status-icon connected" />;
      case 'syncing':
        return <RefreshCw className="status-icon syncing" />;
      case 'error':
        return <AlertCircle className="status-icon error" />;
      default:
        return <WifiOff className="status-icon disconnected" />;
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case 'connected':
        return 'Conectado';
      case 'syncing':
        return 'Sincronizando...';
      case 'error':
        return 'Erro de conexão';
      default:
        return 'Desconectado';
    }
  };

  const qrStats = getQRCodeStats(scannedQRCodes || []);

  return (
    <div className="system-sync">
      {/* Header */}
      <div className="sync-header">
        <div className="sync-title">
          <div className="sync-icon">
            <Smartphone size={24} />
          </div>
          <div>
            <h3>Sincronização Mobile</h3>
            <p>Status da conexão com apps móveis</p>
          </div>
        </div>
        
        <div className={`status-badge ${syncStatus}`}>
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </div>
      </div>

      {/* Connection Stats */}
      <div className="connection-stats">
        <div className="stat-item">
          <Users className="stat-icon users" />
          <div className="stat-value">{mobileStats?.connectedPlayers || 0}</div>
          <div className="stat-label">Jogadores Online</div>
        </div>
        
        <div className="stat-item">
          <CheckCircle className="stat-icon success" />
          <div className="stat-value">{qrStats.total}</div>
          <div className="stat-label">QRs Escaneados</div>
        </div>
        
        <div className="stat-item">
          <Trophy className="stat-icon trophy" />
          <div className="stat-value">{qrStats.totalPoints}</div>
          <div className="stat-label">Pontos Totais</div>
        </div>
        
        <div className="stat-item">
          <Clock className="stat-icon clock" />
          <div className="stat-value">{formatTime(timeRemaining)}</div>
          <div className="stat-label">Tempo Restante</div>
        </div>
      </div>

      {/* QR Code Distribution */}
      <div className="qr-distribution">
        <h4>Distribuição de QR Codes</h4>
        <div className="distribution-grid">
          {Object.entries(qrStats.byColor).map(([color, count]) => {
            const colorConfig = {
              verde: { emoji: '🟢', className: 'verde' },
              laranja: { emoji: '🟠', className: 'laranja' },
              vermelho: { emoji: '🔴', className: 'vermelho' }
            };
            
            const config = colorConfig[color];
            
            return (
              <div key={color} className={`distribution-item ${config.className}`}>
                <div className="distribution-header">
                  <div className="distribution-info">
                    <span className="distribution-emoji">{config.emoji}</span>
                    <span className="distribution-name">{color}</span>
                  </div>
                  <span className="distribution-count">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sync Controls */}
      <div className="sync-controls">
        <div className="controls-left">
          <label className="auto-sync-toggle">
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
            />
            <span className="toggle-text">Sincronização automática</span>
          </label>
          
          {lastSync && (
            <div className="last-sync">
              Última sync: {lastSync.toLocaleTimeString('pt-BR')}
            </div>
          )}
        </div>
        
        <button
          onClick={manualSync}
          disabled={syncStatus === 'syncing'}
          className="sync-btn"
        >
          <RefreshCw className={syncStatus === 'syncing' ? 'spinning' : ''} />
          <span>Sincronizar</span>
        </button>
      </div>

      {/* System Info */}
      {mobileStats && (
        <div className="system-info">
          <h4>
            <Globe size={16} />
            Informações do Sistema
          </h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Plataforma:</span>
              <span className="info-value">{mobileStats.deviceInfo.platform}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Versão:</span>
              <span className="info-value">{mobileStats.deviceInfo.version}</span>
            </div>
            <div className="info-item devices">
              <span className="info-label">Dispositivos conectados:</span>
              <div className="devices-list">
                {mobileStats.deviceInfo.devices.slice(0, 3).map((device, index) => (
                  <span key={index} className="device-tag">
                    {device}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection Instructions */}
      <div className="connection-instructions">
        <h4>📱 Como conectar o app mobile:</h4>
        <ol>
          <li>Abra o app GameQrcodeFach no celular</li>
          <li>Registre-se com nome e equipe</li>
          <li>A sincronização será automática durante o jogo</li>
          <li>Os dados aparecerão aqui em tempo real</li>
        </ol>
      </div>
    </div>
  );
}