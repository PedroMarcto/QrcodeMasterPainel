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
  Target,
  Monitor,
  Smartphone,
  BarChart3,
  Zap
} from 'lucide-react';
import QRGenerator from './QRGenerator';
import SystemSync from './SystemSync';

export default function AdminPanelProfessional() {
  const { 
    gameStatus, 
    timeRemaining, 
    teams, 
    startGame, 
    stopGame, 
    resetGame,
    scannedQRCodes,
    dispatch 
  } = useGame();
  
  const [timer, setTimer] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedTeamForPlayer, setSelectedTeamForPlayer] = useState('blue');

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
      alert('Não há jogadores registrados! Os jogadores devem se registrar pelo app mobile.');
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
      winner: getWinningTeam(),
      scannedQRCodes: scannedQRCodes || []
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
      case 'waiting': return 'bg-yellow-500';
      case 'active': return 'bg-green-500';
      case 'finished': return 'bg-red-500';
      default: return 'bg-gray-500';
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

  const sections = [
    { id: 'dashboard', name: 'Dashboard', icon: Monitor },
    { id: 'players', name: 'Jogadores', icon: Users },
    { id: 'qrcodes', name: 'QR Codes', icon: QrCode },
    { id: 'sync', name: 'Sincronização', icon: Smartphone },
    { id: 'stats', name: 'Estatísticas', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
                  <p className="text-sm text-gray-500">GameQrcodeFach - Controle do Jogo</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor()}`}>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>{getStatusText()}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-lg font-bold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{section.name}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Game Controls */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Controles do Jogo</h3>
              <div className="space-y-3">
                <button
                  onClick={handleStartGame}
                  disabled={gameStatus === 'active'}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>Iniciar Jogo</span>
                </button>
                
                <button
                  onClick={handleStopGame}
                  disabled={gameStatus !== 'active'}
                  className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <Square className="w-4 h-4" />
                  <span>Parar Jogo</span>
                </button>
                
                <button
                  onClick={handleResetGame}
                  className="w-full flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Resetar</span>
                </button>

                <button
                  onClick={exportGameData}
                  className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar Dados</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Tempo Restante</p>
                        <p className="text-3xl font-bold text-gray-900">{formatTime(timeRemaining)}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Jogadores</p>
                        <p className="text-3xl font-bold text-gray-900">{getTotalPlayers()}</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">QRs Escaneados</p>
                        <p className="text-3xl font-bold text-gray-900">{scannedQRCodes?.length || 0}</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <QrCode className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Maior Pontuação</p>
                        <p className="text-3xl font-bold text-gray-900">{Math.max(teams.blue.score, teams.red.score)}</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <Trophy className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Teams Overview */}
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(teams).map(([teamName, teamData]) => (
                    <div
                      key={teamName}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-xl font-bold ${
                          teamName === 'blue' ? 'text-blue-600' : 'text-red-600'
                        }`}>
                          Equipe {teamName === 'blue' ? 'Azul' : 'Vermelha'}
                        </h3>
                        <div className={`text-3xl font-bold ${
                          teamName === 'blue' ? 'text-blue-600' : 'text-red-600'
                        }`}>
                          {teamData.score}
                        </div>
                      </div>
                      
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                        teamName === 'blue'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <Users className="w-4 h-4 mr-1" />
                        {teamData.players.length}/5 jogadores
                      </div>
                      
                      <div className="space-y-2">
                        {teamData.players.length === 0 ? (
                          <p className="text-gray-500 italic">Nenhum jogador registrado</p>
                        ) : (
                          teamData.players.map((player, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  teamName === 'blue' ? 'bg-blue-500' : 'bg-red-500'
                                }`} />
                                <span className="font-medium text-gray-900">{player}</span>
                              </div>
                              <button
                                onClick={() => removePlayer(player, teamName)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Score Adjustment */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => adjustScore(teamName, -1)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm text-gray-600 flex-1 text-center">Ajustar Pontuação</span>
                          <button
                            onClick={() => adjustScore(teamName, 1)}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Winner Display */}
                {gameStatus === 'finished' && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-8 text-center text-white">
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
              </div>
            )}

            {activeSection === 'players' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Gerenciamento de Jogadores</h2>
                
                {/* Add Player Manually */}
                <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Jogador Manualmente</h3>
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      placeholder="Nome do jogador"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <select
                      value={selectedTeamForPlayer}
                      onChange={(e) => setSelectedTeamForPlayer(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="blue">Equipe Azul</option>
                      <option value="red">Equipe Vermelha</option>
                    </select>
                    <button
                      onClick={addPlayerManually}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Adicionar</span>
                    </button>
                  </div>
                </div>

                {/* Players List */}
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(teams).map(([teamName, teamData]) => (
                    <div key={teamName} className="space-y-4">
                      <h3 className={`text-xl font-bold ${
                        teamName === 'blue' ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        Equipe {teamName === 'blue' ? 'Azul' : 'Vermelha'} ({teamData.players.length}/5)
                      </h3>
                      
                      <div className="space-y-2">
                        {teamData.players.length === 0 ? (
                          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                            Nenhum jogador registrado
                          </div>
                        ) : (
                          teamData.players.map((player, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  teamName === 'blue' ? 'bg-blue-500' : 'bg-red-500'
                                }`} />
                                <span className="font-medium text-gray-900">{player}</span>
                              </div>
                              <button
                                onClick={() => removePlayer(player, teamName)}
                                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-blue-800">
                    <strong>Nota:</strong> Os jogadores normalmente se registram pelo app mobile. 
                    Use a adição manual apenas em casos especiais.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'qrcodes' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <QRGenerator />
              </div>
            )}

            {activeSection === 'sync' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <SystemSync />
              </div>
            )}

            {activeSection === 'stats' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Estatísticas do Jogo</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-green-50 rounded-xl">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {scannedQRCodes?.filter(qr => qr.includes('verde')).length || 0}
                    </div>
                    <div className="text-green-800 font-medium">QRs Verdes</div>
                    <div className="text-sm text-green-600">1 ponto cada</div>
                  </div>
                  
                  <div className="text-center p-6 bg-orange-50 rounded-xl">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {scannedQRCodes?.filter(qr => qr.includes('laranja')).length || 0}
                    </div>
                    <div className="text-orange-800 font-medium">QRs Laranjas</div>
                    <div className="text-sm text-orange-600">3 pontos cada</div>
                  </div>
                  
                  <div className="text-center p-6 bg-red-50 rounded-xl">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {scannedQRCodes?.filter(qr => qr.includes('vermelho')).length || 0}
                    </div>
                    <div className="text-red-800 font-medium">QRs Vermelhos</div>
                    <div className="text-sm text-red-600">5 pontos cada</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Progresso das Equipes</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-blue-600 font-medium">Equipe Azul</span>
                          <span className="text-blue-600 font-bold">{teams.blue.score} pontos</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${Math.max(teams.blue.score, teams.red.score) > 0 
                                ? (teams.blue.score / Math.max(teams.blue.score, teams.red.score)) * 100 
                                : 0}%` 
                            }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-red-600 font-medium">Equipe Vermelha</span>
                          <span className="text-red-600 font-bold">{teams.red.score} pontos</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-red-500 h-3 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${Math.max(teams.blue.score, teams.red.score) > 0 
                                ? (teams.red.score / Math.max(teams.blue.score, teams.red.score)) * 100 
                                : 0}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo da Partida</h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{getTotalPlayers()}</div>
                          <div className="text-sm text-gray-600">Jogadores</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{scannedQRCodes?.length || 0}</div>
                          <div className="text-sm text-gray-600">QRs Escaneados</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{teams.blue.score + teams.red.score}</div>
                          <div className="text-sm text-gray-600">Pontos Totais</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{Math.abs(teams.blue.score - teams.red.score)}</div>
                          <div className="text-sm text-gray-600">Diferença</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}