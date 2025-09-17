import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Camera, Trophy, Users, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'qr-scanner';
import { validateQRCode, normalizeQRCode } from '../utils/qrCodeUtils';

export default function Game() {
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const { gameStatus, timeRemaining, teams, currentPlayer, addScore } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (gameStatus === 'waiting') {
      navigate('/waiting-room');
    } else if (gameStatus === 'finished') {
      navigate('/results');
    }
  }, [gameStatus, navigate]);

  useEffect(() => {
    setTimeLeft(timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    // Format time remaining
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
  }, [timeLeft]);

  if (!currentPlayer) {
    navigate('/');
    return null;
  }

  const startScanning = async () => {
    try {
      setScanning(true);
      setMessage('');
      
      if (videoRef.current) {
        qrScannerRef.current = new QrScanner(
          videoRef.current,
          handleScan,
          {
            returnDetailedScanResult: true,
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );
        
        await qrScannerRef.current.start();
      }
    } catch (error) {
      console.error('Erro ao iniciar scanner:', error);
      setMessage('Erro ao acessar a câmera. Verifique as permissões.');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setScanning(false);
  };

  const handleScan = async (result) => {
    const scannedData = result.data;
    
    // Avoid scanning the same QR code multiple times quickly
    if (scannedData === lastScanned) return;
    
    setLastScanned(scannedData);
    stopScanning();

    // Validar QR code usando utilitários
    const validation = validateQRCode(scannedData);
    
    if (validation.valid) {
      try {
        // Normalizar QR code para formato padrão
        const normalized = normalizeQRCode(scannedData);
        
        await addScore(currentPlayer.team, validation.points, normalized.normalized);
        setMessage(`🎉 +${validation.points} pontos para a equipe ${currentPlayer.team === 'blue' ? 'Azul' : 'Vermelha'}!`);
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        if (error.message.includes('já foi escaneado')) {
          setMessage('⚠️ QR Code já foi escaneado! Procure por outros QR codes.');
        } else {
          setMessage('Erro ao registrar pontuação. Tente novamente.');
        }
        setTimeout(() => setMessage(''), 3000);
      }
    } else {
      setMessage('QR Code inválido. Procure por QR codes oficiais do GameQrcodeFach!');
      setTimeout(() => setMessage(''), 3000);
    }

    // Allow scanning again after 2 seconds
    setTimeout(() => setLastScanned(''), 2000);
  };

  // Função para testar QR codes sem usar a câmera
  const handleTestScan = async (qrData) => {
    if (qrData === lastScanned) return;
    
    setLastScanned(qrData);
    
    const validation = validateQRCode(qrData);
    
    if (validation.valid) {
      try {
        const normalized = normalizeQRCode(qrData);
        await addScore(currentPlayer.team, validation.points, normalized.normalized);
        setMessage(`🎉 +${validation.points} pontos para a equipe ${currentPlayer.team === 'blue' ? 'Azul' : 'Vermelha'}!`);
        
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        if (error.message.includes('já foi escaneado')) {
          setMessage('⚠️ QR Code já foi escaneado! Procure por outros QR codes.');
        } else {
          setMessage('Erro ao registrar pontuação. Tente novamente.');
        }
        setTimeout(() => setMessage(''), 3000);
      }
    }
    
    setTimeout(() => setLastScanned(''), 2000);
  };

  // Função parseQRCode removida - agora usando utilitários centralizados

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playerTeam = currentPlayer.team;
  const teamColor = playerTeam === 'blue' ? 'blue' : 'red';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 animate-fadeIn">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 card-hover">
          <div className="text-center animate-slideInDown">
            {/* Timer */}
            <div className="mb-4">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                <Clock className="w-6 h-6 animate-pulse" />
                <span className="text-2xl font-bold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
            
            {/* Player Info */}
            <div className={`inline-flex items-center px-6 py-3 rounded-2xl font-bold text-lg shadow-lg ${
              playerTeam === 'blue'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
            }`}>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <Users className="w-5 h-5" />
              </div>
              <span>
                {currentPlayer.name} - Equipe {playerTeam === 'blue' ? 'Azul' : 'Vermelha'}
              </span>
            </div>
          </div>
        </div>

        {/* Score Display */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 card-hover animate-slideInUp">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center justify-center">
              <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
              Placar
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 transition-all hover:shadow-md">
              <div className="text-blue-800 font-bold text-lg mb-2">Equipe Azul</div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {teams.blue.score}
              </div>
              <div className="text-sm text-blue-600">
                {teams.blue.players.length} jogadores
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border-2 border-red-200 transition-all hover:shadow-md">
              <div className="text-red-800 font-bold text-lg mb-2">Equipe Vermelha</div>
              <div className="text-4xl font-bold text-red-600 mb-2">
                {teams.red.score}
              </div>
              <div className="text-sm text-red-600">
                {teams.red.players.length} jogadores
              </div>
            </div>
          </div>
          
          {/* Lead Indicator */}
          <div className="mt-4 text-center">
            {teams.blue.score === teams.red.score ? (
              <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full">
                <span className="text-yellow-600 mr-2">⚖️</span>
                <span className="font-semibold">Empate!</span>
              </div>
            ) : teams.blue.score > teams.red.score ? (
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                <span className="text-blue-600 mr-2">🔵</span>
                <span className="font-semibold">Azul na frente por {teams.blue.score - teams.red.score}!</span>
              </div>
            ) : (
              <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full">
                <span className="text-red-600 mr-2">🔴</span>
                <span className="font-semibold">Vermelha na frente por {teams.red.score - teams.blue.score}!</span>
              </div>
            )}
          </div>
        </div>

        {/* Scanner Area */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 card-hover animate-slideInUp">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Camera className="w-7 h-7 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Scanner QR
              </h2>
            </div>
            <p className="text-gray-600">
              📱 Aponte a câmera para um QR code do jogo
            </p>
          </div>

          {!scanning ? (
            <div className="text-center space-y-6">
              <button
                onClick={startScanning}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Camera className="w-6 h-6" />
                <span className="text-lg">🚀 Iniciar Scanner</span>
              </button>
              
              {/* Test Buttons for Demo */}
              <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  🧪 Modo Demonstração - Botões de Teste
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => handleTestScan('GameQrcodeFach:verde')}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                      <span>QR Verde (+1 ponto)</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleTestScan('GameQrcodeFach:laranja')}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                      <span>QR Laranja (+3 pontos)</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleTestScan('GameQrcodeFach:vermelho')}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                      <span>QR Vermelho (+5 pontos)</span>
                    </div>
                  </button>
                  
                  {/* Botões de teste com formato web legado */}
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <p className="text-xs text-gray-600 mb-2">Teste formato web legado:</p>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => handleTestScan('GAME_QR_GREEN_001')}
                        className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all"
                      >
                        QR Web Verde (GAME_QR_GREEN_001)
                      </button>
                      <button
                        onClick={() => handleTestScan('GAME_QR_ORANGE_002')}
                        className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all"
                      >
                        QR Web Laranja (GAME_QR_ORANGE_002)
                      </button>
                      <button
                        onClick={() => handleTestScan('GAME_QR_RED_003')}
                        className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all"
                      >
                        QR Web Vermelho (GAME_QR_RED_003)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative animate-bounceIn">
              <div className="relative rounded-2xl overflow-hidden border-4 border-purple-500">
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover"
                  playsInline
                />
                <div className="absolute inset-4 border-4 border-dashed border-white rounded-xl opacity-70"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
                  <div className="bg-black/50 px-4 py-2 rounded-lg">
                    <span className="font-semibold">Escaneando...</span>
                  </div>
                </div>
              </div>
              <button
                onClick={stopScanning}
                className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110"
              >
                <span className="text-lg font-bold">×</span>
              </button>
            </div>
          )}

          {message && (
            <div className={`mt-6 p-4 rounded-2xl text-center font-bold text-lg border-2 animate-bounceIn ${
              message.includes('🎉') 
                ? 'bg-green-50 text-green-800 border-green-200' 
                : 'bg-yellow-50 text-yellow-800 border-yellow-200'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Point Values Reference */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 card-hover animate-slideInUp">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center justify-center">
              <Zap className="w-6 h-6 mr-2 text-yellow-500" />
              Valores dos QR Codes
            </h3>
          </div>
          
          <div className="space-y-3">
            {[
              { color: 'green', name: 'Verde', points: 1, bg: 'from-green-50 to-green-100', border: 'border-green-200', text: 'text-green-800' },
              { color: 'orange', name: 'Laranja', points: 3, bg: 'from-orange-50 to-orange-100', border: 'border-orange-200', text: 'text-orange-800' },
              { color: 'red', name: 'Vermelho', points: 5, bg: 'from-red-50 to-red-100', border: 'border-red-200', text: 'text-red-800' }
            ].map((qr, index) => (
              <div key={qr.color} className={`flex items-center justify-between p-4 bg-gradient-to-r ${qr.bg} rounded-2xl border-2 ${qr.border} transition-all hover:shadow-md`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-6 h-6 bg-${qr.color}-500 rounded-full shadow-md`}></div>
                  <span className={`font-bold text-lg ${qr.text}`}>
                    QR {qr.name}
                  </span>
                </div>
                <div className={`flex items-center space-x-2 ${qr.text}`}>
                  <Zap className="w-5 h-5" />
                  <span className="font-bold text-xl">
                    {qr.points} ponto{qr.points > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
