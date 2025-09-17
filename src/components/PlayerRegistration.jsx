import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Users, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PlayerRegistration() {
  const [playerName, setPlayerName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { addPlayer, teams } = useGame();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!playerName.trim()) {
      setError('Por favor, digite seu nome');
      setLoading(false);
      return;
    }

    if (!selectedTeam) {
      setError('Por favor, escolha uma equipe');
      setLoading(false);
      return;
    }

    try {
      await addPlayer(playerName.trim(), selectedTeam);
      navigate('/waiting-room');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTeamColor = (team) => {
    return team === 'blue' ? 'bg-blue-500' : 'bg-red-500';
  };

  const getTeamName = (team) => {
    return team === 'blue' ? 'Azul' : 'Vermelha';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-white/20 card-hover">
        {/* Header */}
        <div className="text-center mb-8 animate-slideInDown">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-75"></div>
            <Trophy className="relative w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounceIn" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-3">
            Caça ao Tesouro QR
          </h1>
          <p className="text-gray-600 text-lg">
            🎯 Entre no jogo e mostre suas habilidades!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 animate-slideInUp">
          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="playerName" className="block text-sm font-bold text-gray-700 mb-3">
              👤 Qual é o seu nome?
            </label>
            <div className="relative">
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/80 placeholder-gray-400 shadow-inner"
                placeholder="Digite seu nome aqui..."
                maxLength={20}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                {playerName.length}/20
              </div>
            </div>
          </div>

          {/* Team Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700 mb-4">
              🏆 Escolha sua equipe
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['blue', 'red'].map((team) => {
                const isSelected = selectedTeam === team;
                const isFull = teams[team].players.length >= 5;
                const teamName = getTeamName(team);
                
                return (
                  <button
                    key={team}
                    type="button"
                    onClick={() => !isFull && setSelectedTeam(team)}
                    className={`relative p-6 rounded-2xl border-3 transition-all duration-300 transform ${
                      isSelected
                        ? team === 'blue'
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg scale-105'
                          : 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 shadow-lg scale-105'
                        : isFull
                        ? 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed'
                        : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md hover:scale-102'
                    }`}
                    disabled={isFull}
                  >
                    {/* Team Icon */}
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      team === 'blue' ? 'bg-blue-500' : 'bg-red-500'
                    } ${isFull ? 'opacity-50' : ''}`}>
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Team Info */}
                    <div className={`font-bold text-lg mb-2 ${
                      isSelected 
                        ? team === 'blue' ? 'text-blue-800' : 'text-red-800'
                        : 'text-gray-700'
                    }`}>
                      Equipe {teamName}
                    </div>
                    
                    {/* Player Count */}
                    <div className={`text-sm font-medium ${
                      isSelected 
                        ? team === 'blue' ? 'text-blue-600' : 'text-red-600'
                        : 'text-gray-500'
                    }`}>
                      {teams[team].players.length}/5 jogadores
                    </div>
                    
                    {/* Status */}
                    {isFull ? (
                      <div className="text-xs mt-2 text-red-500 font-semibold">
                        🚫 Equipe Completa
                      </div>
                    ) : isSelected ? (
                      <div className={`text-xs mt-2 font-semibold ${
                        team === 'blue' ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        ✅ Selecionada
                      </div>
                    ) : (
                      <div className="text-xs mt-2 text-gray-400">
                        Clique para selecionar
                      </div>
                    )}
                    
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                        team === 'blue' ? 'bg-blue-500' : 'bg-red-500'
                      } text-white text-sm font-bold animate-bounceIn`}>
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center space-x-3 animate-slideInUp">
              <span className="text-red-500 text-xl">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !playerName.trim() || !selectedTeam}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Entrando no jogo...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <Trophy className="w-6 h-6" />
                <span>🚀 Entrar no Jogo!</span>
              </div>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center space-y-3 animate-fadeIn">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Sistema ativo - Modo demonstração</span>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="text-sm text-gray-500 hover:text-gray-700 underline hover:no-underline transition-all"
          >
            🔧 Painel Administrativo
          </button>
        </div>
      </div>
    </div>
  );
}
