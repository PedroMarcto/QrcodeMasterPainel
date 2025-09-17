import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Trophy, 
  Users, 
  Clock, 
  Settings, 
  QrCode,
  Plus,
  Minus,
  Eye,
  Download,
  UserPlus,
  Target
} from 'lucide-react';
import QRGenerator from './QRGenerator';
import SystemSync from './SystemSync';

export default function AdminPanel() {
  const { 
    gameStatus, 
    timeRemaining, 
    teams, 
    startGame, 
    stopGame, 
    resetGame,
    dispatch 
  } = useGame();
  
  const [timer, setTimer] = useState(null);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [showSystemSync, setShowSystemSync] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedTeamForPlayer, setSelectedTeamForPlayer] = useState('blue');
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    dispatch({ type: 'SET_IS_ADMIN', payload: true });
  }, [dispatch]);

  useEffect(() => {
    if (gameStatus === 'active' && timeRemaining > 0) {
      const interval = setInterval(() => {
        dispatch({ type: 'SET_TIME_REMAINING', payload: timeRemaining - 1 });
        
        if (timeRemaining <= 1) {
          stopGame();
          clearInterval(interval);
        }
      }, 1000);
      
      setTimer(interval);
      return () => clearInterval(interval);
    } else {
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }
    }
  }, [gameStatus, timeRemaining, stopGame, timer, dispatch]);

  const handleStartGame = async () => {
    if (getTotalPlayers() === 0) {
      alert('Não há jogadores registrados!');
      return;
    }
    await startGame();
  };

  const handleStopGame = async () => {
    if (window.confirm('Tem certeza que deseja parar o jogo?')) {
      await stopGame();
    }
  };

  const handleResetGame = async () => {
    if (window.confirm('Tem certeza que deseja resetar o jogo? Todos os dados serão perdidos!')) {
      await resetGame();
    }
  };

  const addPlayerManually = () => {
    if (!newPlayerName.trim()) {
      alert('Digite um nome para o jogador');
      return;
    }
    
    if (teams[selectedTeamForPlayer].players.length >= 5) {
      alert(`Equipe ${selectedTeamForPlayer === 'blue' ? 'Azul' : 'Vermelha'} já está cheia!`);
      return;
    }

    dispatch({ 
      type: 'ADD_PLAYER', 
      payload: { 
        playerName: newPlayerName.trim(), 
        team: selectedTeamForPlayer 
      } 
    });
    
    setNewPlayerName('');
  };

  const removePlayer = (playerName, teamName) => {
    if (window.confirm(`Remover ${playerName} da equipe ${teamName === 'blue' ? 'Azul' : 'Vermelha'}?`)) {
      const updatedTeams = {
        ...teams,
        [teamName]: {
          ...teams[teamName],
          players: teams[teamName].players.filter(p => p !== playerName)
        }
      };
      dispatch({ type: 'SET_TEAMS', payload: updatedTeams });
    }
  };

  const adjustScore = (teamName, points) => {
    dispatch({ type: 'ADD_SCORE', payload: { teamName, points } });
  };

  const exportGameData = () => {
    const gameData = {
      timestamp: new Date().toISOString(),
      status: gameStatus,
      timeRemaining,
      teams,
      totalPlayers: getTotalPlayers(),
      winner: getWinningTeam()
    };

    const dataStr = JSON.stringify(gameData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `jogo-caca-tesouro-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalPlayers = () => {
    return teams.blue.players.length + teams.red.players.length;
  };

  const getWinningTeam = () => {
    if (teams.blue.score > teams.red.score) return 'blue';
    if (teams.red.score > teams.blue.score) return 'red';
    return 'tie';
  };

  const getStatusColor = () => {
    switch (gameStatus) {
      case 'waiting': return 'yellow';
      case 'active': return 'green';
      case 'finished': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = () => {
    switch (gameStatus) {
      case 'waiting': return 'Aguardando';
      case 'active': return 'Em Andamento';
      case 'finished': return 'Finalizado';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Settings className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Painel Administrativo</h1>
                  <p className="text-purple-100">Controle do Caça ao Tesouro QR</p>
                  <p className="text-purple-200 text-sm">Modo Demo - Firebase será configurado depois</p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full bg-${getStatusColor()}-500 font-semibold`}>
                {getStatusText()}
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Game Controls */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <button
                onClick={handleStartGame}
                disabled={gameStatus === 'active'}
                className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <Play className="w-5 h-5" />
                <span>Iniciar Jogo</span>
              </button>
              
              <button
                onClick={handleStopGame}
                disabled={gameStatus !== 'active'}
                className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <Square className="w-5 h-5" />
                <span>Parar Jogo</span>
              </button>
              
              <button
                onClick={handleResetGame}
                className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Resetar</span>
              </button>

              <button
                onClick={() => setShowQRGenerator(!showQRGenerator)}
                className="flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <QrCode className="w-5 h-5" />
                <span>QR Codes</span>
              </button>

              <button
                onClick={() => setShowSystemSync(!showSystemSync)}
                className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <Target className="w-5 h-5" />
                <span>Sincronização</span>
              </button>
            </div>

            {/* Game Status */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-800">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-blue-600">Tempo Restante</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-800">
                  {getTotalPlayers()}
                </div>
                <div className="text-green-600">Total de Jogadores</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-xl text-center">
                <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-800">
                  {Math.max(teams.blue.score, teams.red.score)}
                </div>
                <div className="text-purple-600">Maior Pontuação</div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-xl text-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">VS</span>
                </div>
                <div className="text-2xl font-bold text-yellow-800">
                  {Math.abs(teams.blue.score - teams.red.score)}
                </div>
                <div className="text-yellow-600">Diferença</div>
              </div>
            </div>

            {/* QR Generator */}
            {showQRGenerator && (
              <div className="mb-8">
                <QRGenerator />
              </div>
            )}

            {/* System Sync */}
            {showSystemSync && (
              <div className="mb-8">
                <SystemSync />
              </div>
            )}

            {/* Teams Overview */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {Object.entries(teams).map(([teamName, teamData]) => (
                <div
                  key={teamName}
                  className={`p-6 rounded-xl border-2 ${
                    teamName === 'blue'
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-bold ${
                      teamName === 'blue' ? 'text-blue-800' : 'text-red-800'
                    }`}>
                      Equipe {teamName === 'blue' ? 'Azul' : 'Vermelha'}
                    </h3>
                    <div className={`text-3xl font-bold ${
                      teamName === 'blue' ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {teamData.score}
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block ${
                    teamName === 'blue'
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-red-200 text-red-800'
                  }`}>
                    {teamData.players.length}/5 jogadores
                  </div>
                  
                  <div className="space-y-2">
                    {teamData.players.length === 0 ? (
                      <p className="text-gray-500 italic">Nenhum jogador registrado</p>
                    ) : (
                      teamData.players.map((player, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            teamName === 'blue' ? 'bg-blue-100' : 'bg-red-100'
                          }`}
                        >
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            <span className="font-medium">{player}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Winner Display */}
            {gameStatus === 'finished' && (
              <div className="text-center p-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white">
                <Trophy className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">
                  {getWinningTeam() === 'tie' 
                    ? 'Empate!' 
                    : `Equipe ${getWinningTeam() === 'blue' ? 'Azul' : 'Vermelha'} Venceu!`
                  }
                </h2>
                <p className="text-xl">
                  Pontuação Final: Azul {teams.blue.score} x {teams.red.score} Vermelha
                </p>
              </div>
            )}

            {/* QR Code Instructions */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Formatos de QR Codes Suportados</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">📱 Formato Mobile (Recomendado):</h4>
                  <div className="space-y-2 text-sm font-mono bg-white p-4 rounded-lg border">
                    <div><span className="text-green-600">GameQrcodeFach:verde</span> (1 ponto)</div>
                    <div><span className="text-orange-600">GameQrcodeFach:laranja</span> (3 pontos)</div>
                    <div><span className="text-red-600">GameQrcodeFach:vermelho</span> (5 pontos)</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2">🌐 Formato Web (Legado):</h4>
                  <div className="space-y-2 text-sm font-mono bg-white p-4 rounded-lg border">
                    <div><span className="text-green-600">GAME_QR_GREEN_001</span> (1 ponto)</div>
                    <div><span className="text-orange-600">GAME_QR_ORANGE_002</span> (3 pontos)</div>
                    <div><span className="text-red-600">GAME_QR_RED_003</span> (5 pontos)</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  💡 <strong>Dica:</strong> Use o gerador de QR codes acima para criar códigos no formato correto.
                  O formato mobile é recomendado para melhor compatibilidade com o app React Native.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
