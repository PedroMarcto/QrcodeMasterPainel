import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Medal, Users, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Results() {
  const { teams, resetGame } = useGame();
  const navigate = useNavigate();

  const getWinningTeam = () => {
    if (teams.blue.score > teams.red.score) return 'blue';
    if (teams.red.score > teams.blue.score) return 'red';
    return 'tie';
  };

  const getWinnerText = () => {
    const winner = getWinningTeam();
    if (winner === 'tie') return 'Empate!';
    return `Equipe ${winner === 'blue' ? 'Azul' : 'Vermelha'} Venceu!`;
  };

  const handleNewGame = async () => {
    if (window.confirm('Iniciar um novo jogo? Todos os dados serão resetados.')) {
      await resetGame();
      navigate('/');
    }
  };

  const winner = getWinningTeam();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className={`p-8 text-white text-center relative overflow-hidden ${
            winner === 'blue' ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700' :
            winner === 'red' ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700' :
            'bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500'
          }`}>
            {/* Background Animation */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            
            {/* Confetti Effect */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                >
                  {Math.random() > 0.5 ? '🎉' : '🎊'}
                </div>
              ))}
            </div>
            
            <div className="relative z-10 animate-bounceIn">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-75 animate-pulse"></div>
                <Trophy className="relative w-24 h-24 mx-auto text-yellow-300" />
              </div>
              
              <h1 className="text-5xl font-bold mb-4 animate-slideInDown">
                {getWinnerText()}
              </h1>
              
              <p className="text-2xl opacity-90 animate-slideInUp">
                🎯 Caça ao Tesouro QR - Resultados Finais
              </p>
              
              {winner !== 'tie' && (
                <div className="mt-6 inline-flex items-center space-x-2 bg-yellow-400 text-yellow-900 px-6 py-3 rounded-2xl font-bold animate-pulse">
                  <Medal className="w-6 h-6" />
                  <span>VITÓRIA ÉPICA!</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-8">
            {/* Final Scores */}
            <div className="grid lg:grid-cols-2 gap-8 mb-10">
              {Object.entries(teams).map(([teamName, teamData]) => {
                const isWinner = winner === teamName && winner !== 'tie';
                return (
                  <div
                    key={teamName}
                    className={`relative p-8 rounded-3xl border-3 transition-all duration-500 hover:shadow-2xl animate-slideInUp ${
                      teamName === 'blue'
                        ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100'
                        : 'border-red-300 bg-gradient-to-br from-red-50 to-red-100'
                    } ${isWinner ? 'ring-4 ring-yellow-400 shadow-2xl transform scale-105' : ''}`}
                  >
                    {/* Winner Crown */}
                    {isWinner && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-6 py-2 rounded-2xl text-sm font-bold flex items-center shadow-lg animate-bounceIn">
                          <Trophy className="w-5 h-5 mr-2" />
                          🏆 CAMPEÃO
                        </div>
                      </div>
                    )}
                    
                    {/* Team Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                          teamName === 'blue' ? 'bg-blue-500' : 'bg-red-500'
                        }`}>
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className={`text-2xl font-bold ${
                            teamName === 'blue' ? 'text-blue-800' : 'text-red-800'
                          }`}>
                            Equipe {teamName === 'blue' ? 'Azul' : 'Vermelha'}
                          </h3>
                          <div className={`px-4 py-1 rounded-full text-sm font-bold ${
                            teamName === 'blue'
                              ? 'bg-blue-200 text-blue-800'
                              : 'bg-red-200 text-red-800'
                          }`}>
                            {teamData.players.length} jogadores
                          </div>
                        </div>
                      </div>
                      
                      {/* Score */}
                      <div className="text-center">
                        <div className={`text-6xl font-bold ${
                          teamName === 'blue' ? 'text-blue-600' : 'text-red-600'
                        }`}>
                          {teamData.score}
                        </div>
                        <div className="text-gray-600 font-medium">pontos</div>
                      </div>
                    </div>
                    
                    {/* Players List */}
                    <div className="space-y-3">
                      {teamData.players.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <div className="text-4xl mb-2">👥</div>
                          <p>Nenhum jogador</p>
                        </div>
                      ) : (
                        teamData.players.map((player, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-xl flex items-center justify-between shadow-sm transition-all hover:shadow-md ${
                              teamName === 'blue' ? 'bg-blue-100 hover:bg-blue-200' : 'bg-red-100 hover:bg-red-200'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                teamName === 'blue' ? 'bg-blue-500' : 'bg-red-500'
                              }`}>
                                {index + 1}
                              </div>
                              <span className="font-semibold text-gray-800">{player}</span>
                            </div>
                            {isWinner && (
                              <div className="flex items-center space-x-2">
                                <Trophy className="w-5 h-5 text-yellow-600" />
                                <span className="text-yellow-700 font-bold text-sm">VENCEDOR</span>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Game Statistics */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 mb-10 border border-gray-200 animate-slideInUp">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  📊 Estatísticas do Jogo
                </h3>
                <p className="text-gray-600">Resumo da partida</p>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    value: teams.blue.players.length + teams.red.players.length,
                    label: 'Total de Jogadores',
                    icon: '👥',
                    color: 'blue'
                  },
                  {
                    value: teams.blue.score + teams.red.score,
                    label: 'Pontos Totais',
                    icon: '🎯',
                    color: 'green'
                  },
                  {
                    value: Math.max(teams.blue.score, teams.red.score),
                    label: 'Maior Pontuação',
                    icon: '🏆',
                    color: 'purple'
                  },
                  {
                    value: Math.abs(teams.blue.score - teams.red.score),
                    label: 'Diferença',
                    icon: '⚖️',
                    color: 'orange'
                  }
                ].map((stat, index) => (
                  <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all">
                    <div className="text-4xl mb-3">{stat.icon}</div>
                    <div className={`text-3xl font-bold mb-2 text-${stat.color}-600`}>
                      {stat.value}
                    </div>
                    <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Congratulations Message */}
            <div className="text-center mb-10 animate-slideInUp">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 border border-yellow-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  🎉 Parabéns a Todos os Participantes!
                </h2>
                <p className="text-gray-700 text-xl mb-4">
                  Foi uma partida incrível! Obrigado por participarem do nosso caça ao tesouro QR.
                </p>
                <div className="flex items-center justify-center space-x-4 text-lg">
                  <span>🎮</span>
                  <span className="font-semibold text-gray-800">Jogo finalizado com sucesso!</span>
                  <span>🏁</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slideInUp">
              <button
                onClick={handleNewGame}
                className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <RotateCcw className="w-6 h-6" />
                <span className="text-lg">🚀 Novo Jogo</span>
              </button>
              
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center justify-center space-x-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="text-lg">⚙️ Painel Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
