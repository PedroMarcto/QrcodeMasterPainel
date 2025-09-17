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
  const [activeTab, setActiveTab] = useState('dashboard');
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

  const renderDashboard = () => (
    <div>
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
          onClick={exportGameData}
          className="flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          <Download className="w-5 h-5" />
          <span>Exportar</span>
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
    </div>
  );

  const renderPlayersTab = () => (
    <div>
      {/* Add Player Section */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Adicionar Jogador Manualmente</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Nome do jogador"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && addPlayerManually()}
          />
          <select
            value={selectedTeamForPlayer}
            onChange={(e) => setSelectedTeamForPlayer(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="blue">Equipe Azul</option>
            <option value="red">Equipe Vermelha</option>
          </select>
          <button
            onClick={addPlayerManually}
            className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        </div>
      </div>

      {/* Teams Management */}
      <div className="grid md:grid-cols-2 gap-6">
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
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => adjustScore(teamName, 1)}
                  className={`p-1 rounded ${
                    teamName === 'blue' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
                  } text-white`}
                  title="Adicionar 1 ponto"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className={`text-2xl font-bold ${
                  teamName === 'blue' ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {teamData.score}
                </span>
                <button
                  onClick={() => adjustScore(teamName, -1)}
                  className={`p-1 rounded ${
                    teamName === 'blue' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
                  } text-white`}
                  title="Remover 1 ponto"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              {teamData.players.length === 0 ? (
                <p className="text-gray-500 italic">Nenhum jogador registrado</p>
              ) : (
                teamData.players.map((player, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg flex items-center justify-between ${
                      teamName === 'blue' ? 'bg-blue-100' : 'bg-red-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="font-medium">{player}</span>
                    </div>
                    <button
                      onClick={() => removePlayer(player, teamName)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remover jogador"
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
    </div>
  );

  const renderQRCodesTab = () => (
    <div>
      <QRGenerator />
      
      <div className="mt-8 p-6 bg-gray-50 rounded-xl">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Instruções para QR Codes</h3>
        <p className="text-gray-600 mb-4">
          Para criar QR codes válidos para o jogo, use o formato:
        </p>
        <div className="space-y-2 text-sm font-mono bg-white p-4 rounded-lg">
          <div><span className="text-green-600">GAME_QR_GREEN_001</span> (1 ponto)</div>
          <div><span className="text-orange-600">GAME_QR_ORANGE_002</span> (3 pontos)</div>
          <div><span className="text-red-600">GAME_QR_RED_003</span> (5 pontos)</div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Dicas para Impressão:</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Imprima em papel branco para melhor leitura</li>
            <li>• Tamanho mínimo recomendado: 5x5 cm</li>
            <li>• Plastifique os QR codes para proteção</li>
            <li>• Distribua proporcionalmente pelas cores/dificuldades</li>
            <li>• Teste os QR codes antes de espalhar pela feira</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderToolsTab = () => (
    <div className="space-y-6">
      {/* Configuration */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Configurações do Jogo</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tempo do Jogo (minutos)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={Math.floor(timeRemaining / 60)}
              onChange={(e) => dispatch({ type: 'SET_TIME_REMAINING', payload: parseInt(e.target.value) * 60 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status do Sistema
            </label>
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg">
              Sistema Web Funcionando ✅
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Estatísticas do Jogo</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg text-center">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {teams.blue.score + teams.red.score}
            </div>
            <div className="text-gray-600">Pontos Totais</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {getTotalPlayers()}
            </div>
            <div className="text-gray-600">Jogadores Ativos</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {Math.abs(teams.blue.score - teams.red.score)}
            </div>
            <div className="text-gray-600">Diferença de Pontos</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Ações Administrativas</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={exportGameData}
            className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Exportar Dados do Jogo</span>
          </button>
          <button
            onClick={() => window.open('/player', '_blank')}
            className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <Eye className="w-5 h-5" />
            <span>Interface do Jogador (Web)</span>
          </button>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4">Próximos Passos</h3>
        <div className="space-y-2 text-blue-700">
          <p>✅ Painel administrativo web completo</p>
          <p>🔄 App Android para jogadores (em desenvolvimento)</p>
          <p>🔄 Configuração Firebase (quando necessário)</p>
          <p>🔄 Deploy no GitHub Pages</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Settings className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Painel Administrativo</h1>
                  <p className="text-purple-100">Controle do Caça ao Tesouro QR</p>
                  <p className="text-purple-200 text-sm">Sistema Web para Administração - Apps Android em desenvolvimento</p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full bg-${getStatusColor()}-500 font-semibold`}>
                {getStatusText()}
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="mt-6 flex space-x-1 bg-purple-700 rounded-lg p-1">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: Trophy },
                { id: 'players', name: 'Jogadores', icon: Users },
                { id: 'qrcodes', name: 'QR Codes', icon: QrCode },
                { id: 'tools', name: 'Ferramentas', icon: Settings }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-purple-600'
                        : 'text-purple-100 hover:text-white hover:bg-purple-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'players' && renderPlayersTab()}
            {activeTab === 'qrcodes' && renderQRCodesTab()}
            {activeTab === 'tools' && renderToolsTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
