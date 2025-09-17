import React from 'react';
import { useGame } from '../context/GameContext';
import { Users, Clock, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WaitingRoom() {
  const { teams, gameStatus, currentPlayer } = useGame();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (gameStatus === 'active') {
      navigate('/game');
    }
  }, [gameStatus, navigate]);

  if (!currentPlayer) {
    navigate('/');
    return null;
  }

  const playerTeam = currentPlayer.team;
  const teamColor = playerTeam === 'blue' ? 'blue' : 'red';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
            <div className="text-center animate-slideInDown">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-75 animate-pulse"></div>
                <Trophy className="relative w-20 h-20 text-yellow-300 mx-auto" />
              </div>
              <h1 className="text-4xl font-bold mb-3">
                🏁 Sala de Espera
              </h1>
              <p className="text-purple-100 text-lg">
                Prepare-se para a aventura! O jogo começará em breve...
              </p>
            </div>
          </div>

          <div className="p-8">
            {/* Player Info */}
            <div className="text-center mb-8 animate-bounceIn">
              <div className={`inline-flex items-center px-8 py-4 rounded-2xl font-bold text-lg shadow-lg ${
                playerTeam === 'blue'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
              }`}>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <Users className="w-6 h-6" />
                </div>
                <span>
                  {currentPlayer.name} - Equipe {playerTeam === 'blue' ? 'Azul' : 'Vermelha'}
                </span>
              </div>
            </div>

            {/* Teams Display */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {Object.entries(teams).map(([teamName, teamData]) => (
                <div
                  key={teamName}
                  className={`rounded-2xl border-3 p-6 transition-all hover:shadow-xl animate-slideInUp ${
                    teamName === 'blue'
                      ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100'
                      : 'border-red-300 bg-gradient-to-br from-red-50 to-red-100'
                  }`}
                >
                  {/* Team Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        teamName === 'blue' ? 'bg-blue-500' : 'bg-red-500'
                      }`}>
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <h3 className={`text-2xl font-bold ${
                        teamName === 'blue' ? 'text-blue-800' : 'text-red-800'
                      }`}>
                        Equipe {teamName === 'blue' ? 'Azul' : 'Vermelha'}
                      </h3>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                      teamName === 'blue'
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {teamData.players.length}/5 jogadores
                    </div>
                  </div>
                  
                  {/* Players List */}
                  <div className="space-y-3">
                    {teamData.players.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-gray-400 text-6xl mb-4">👥</div>
                        <p className="text-gray-500 italic text-lg">
                          Aguardando jogadores...
                        </p>
                      </div>
                    ) : (
                      teamData.players.map((player, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-xl shadow-sm transition-all hover:shadow-md ${
                            teamName === 'blue' ? 'bg-blue-100 hover:bg-blue-200' : 'bg-red-100 hover:bg-red-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                teamName === 'blue' ? 'bg-blue-500' : 'bg-red-500'
                              }`}>
                                {index + 1}
                              </div>
                              <span className="font-semibold text-gray-800">{player}</span>
                            </div>
                            {player === currentPlayer.name && (
                              <div className="flex items-center space-x-2">
                                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                                  👑 VOCÊ
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Team Status */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-2">
                      {teamData.players.length === 5 ? (
                        <>
                          <span className="text-green-500">✅</span>
                          <span className="text-green-700 font-semibold">Equipe Completa!</span>
                        </>
                      ) : (
                        <>
                          <span className="text-blue-500">⏳</span>
                          <span className="text-gray-600">
                            Aguardando {5 - teamData.players.length} jogador{5 - teamData.players.length !== 1 ? 'es' : ''}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Game Rules */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 mb-8 border border-gray-200 animate-slideInUp">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">📋 Regras do Jogo</h3>
                <p className="text-gray-600">Leia atentamente antes de começar!</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center">
                    🎯 Sistema de Pontuação
                  </h4>
                  <div className="space-y-3">
                    {[
                      { color: 'green', name: 'Verde', points: 1, difficulty: 'Fácil' },
                      { color: 'orange', name: 'Laranja', points: 3, difficulty: 'Médio' },
                      { color: 'red', name: 'Vermelho', points: 5, difficulty: 'Difícil' }
                    ].map((qr) => (
                      <div key={qr.color} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 bg-${qr.color}-500 rounded-full`}></div>
                          <span className="font-medium">QR {qr.name}</span>
                          <span className="text-sm text-gray-500">({qr.difficulty})</span>
                        </div>
                        <div className="font-bold text-lg text-gray-800">
                          {qr.points} ponto{qr.points > 1 ? 's' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center">
                    ℹ️ Informações Importantes
                  </h4>
                  <div className="space-y-3">
                    {[
                      { icon: '⏱️', label: 'Duração do jogo', value: '10 minutos' },
                      { icon: '👥', label: 'Jogadores por equipe', value: 'Máximo 5' },
                      { icon: '🏆', label: 'Critério de vitória', value: 'Maior pontuação' },
                      { icon: '📱', label: 'Como jogar', value: 'Escaneie QR codes' }
                    ].map((info, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-white rounded-lg border">
                        <span className="text-2xl">{info.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{info.label}</div>
                          <div className="text-sm text-gray-600">{info.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Waiting Status */}
            <div className="text-center animate-pulse">
              <div className="inline-flex items-center space-x-4 bg-yellow-50 border-2 border-yellow-200 rounded-2xl px-8 py-6">
                <div className="relative">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full animate-ping absolute"></div>
                  <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                </div>
                <div className="text-left">
                  <div className="text-yellow-800 font-bold text-lg">
                    ⏳ Aguardando início do jogo...
                  </div>
                  <div className="text-yellow-600 text-sm">
                    O administrador iniciará o jogo em breve
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
