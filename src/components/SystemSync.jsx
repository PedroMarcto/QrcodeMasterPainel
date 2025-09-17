import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { 
  Smartphone, 
  Globe, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Users,
  Trophy,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';
import { getQRCodeStats, convertTeamName } from '../utils/qrCodeUtils';

export default function SystemSync() {
  const { 
    gameStatus, 
    timeRemaining, 
    teams, 
    scannedQRCodes,
    dispatch 
  } = useGame();
  
  const [syncStatus, setSyncStatus] = useState('disconnected'); // connected, syncing, disconnected, error
  const [lastSync, setLastSync] = useState(null);
  const [mobileStats, setMobileStats] = useState(null);
  const [autoSync, setAutoSync] = useState(true);

  // Simular conexão com app mobile (em produção seria WebSocket ou API)
  useEffect(() => {
    if (autoSync && gameStatus === 'active') {
      const interval = setInterval(() => {
        simulateMobileSync();
      }, 5000); // Sync a cada 5 segundos

      return () => clearInterval(interval);
    }
  }, [autoSync, gameStatus]);

  const simulateMobileSync = async () => {
    setSyncStatus('syncing');
    
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular dados do mobile
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
        return <Wifi className="w-5 h-5 text-green-500" />;
      case 'syncing':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <WifiOff className="w-5 h-5 text-gray-400" />;
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

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'syncing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const qrStats = getQRCodeStats(scannedQRCodes);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Sincronização Mobile</h3>
            <p className="text-sm text-gray-600">Status da conexão com apps móveis</p>
          </div>
        </div>
        
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-full border ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>
      </div>

      {/* Connection Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-xl text-center">
          <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-800">
            {mobileStats?.connectedPlayers || 0}
          </div>
          <div className="text-sm text-blue-600">Jogadores Online</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-xl text-center">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-800">
            {qrStats.total}
          </div>
          <div className="text-sm text-green-600">QRs Escaneados</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-xl text-center">
          <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-800">
            {qrStats.totalPoints}
          </div>
          <div className="text-sm text-purple-600">Pontos Totais</div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-xl text-center">
          <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-800">
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-orange-600">Tempo Restante</div>
        </div>
      </div>

      {/* QR Code Distribution */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Distribuição de QR Codes</h4>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(qrStats.byColor).map(([color, count]) => {
            const colorConfig = {
              verde: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', emoji: '🟢' },
              laranja: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200', emoji: '🟠' },
              vermelho: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', emoji: '🔴' }
            };
            
            const config = colorConfig[color];
            
            return (
              <div key={color} className={`p-3 rounded-lg border ${config.bg} ${config.border}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{config.emoji}</span>
                    <span className={`font-medium capitalize ${config.text}`}>
                      {color}
                    </span>
                  </div>
                  <span className={`text-xl font-bold ${config.text}`}>
                    {count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sync Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Sincronização automática</span>
          </label>
          
          {lastSync && (
            <div className="text-xs text-gray-500">
              Última sync: {lastSync.toLocaleTimeString('pt-BR')}
            </div>
          )}
        </div>
        
        <button
          onClick={manualSync}
          disabled={syncStatus === 'syncing'}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
          <span>Sincronizar</span>
        </button>
      </div>

      {/* System Info */}
      {mobileStats && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            Informações do Sistema
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Plataforma:</span>
              <span className="ml-2 font-medium text-gray-800 capitalize">
                {mobileStats.deviceInfo.platform}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Versão:</span>
              <span className="ml-2 font-medium text-gray-800">
                {mobileStats.deviceInfo.version}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Dispositivos conectados:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {mobileStats.deviceInfo.devices.slice(0, 3).map((device, index) => (
                  <span key={index} className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border">
                    {device}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
        <h4 className="font-semibold text-yellow-800 mb-2">📱 Como conectar o app mobile:</h4>
        <ol className="text-sm text-yellow-700 space-y-1">
          <li>1. Abra o app GameQrcodeFach no celular</li>
          <li>2. Registre-se com nome e equipe</li>
          <li>3. A sincronização será automática durante o jogo</li>
          <li>4. Os dados aparecerão aqui em tempo real</li>
        </ol>
      </div>
    </div>
  );
}