import React, { useState, useEffect, useRef } from 'react';
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
  Download,
  UserPlus,
  Monitor,
  Smartphone,
  BarChart3
} from 'lucide-react';
import QRGeneratorClean from './QRGeneratorClean';
import SystemSyncClean from './SystemSyncClean';
import './AdminPanelClean.css';
import logo from '../assets/logo.png';

export default function AdminPanelClean() {
  const { 
    gameStatus, 
    timeRemaining, 
    teams, 
    startGame, 
    stopGame, 
    resetGame,
    scannedQRCodes,
    results,
    dispatch 
  } = useGame();

  // Função para resetar o campo results no Firestore
  const resetResultsInFirestore = async () => {
    try {
      const { db } = await import('../config/firebase');
      const { doc, updateDoc } = await import('firebase/firestore');
      const gameDocRef = doc(db, 'game', 'current');
      await updateDoc(gameDocRef, { results: [] });
    } catch (err) {
      console.error('Erro ao resetar campo results:', err);
    }
  };
  
  const [timer, setTimer] = useState(null);
  const timeRef = useRef(timeRemaining);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedTeamForPlayer, setSelectedTeamForPlayer] = useState('blue');

  useEffect(() => {
    dispatch({ type: 'SET_IS_ADMIN', payload: true });
  }, [dispatch]);

  useEffect(() => {
    timeRef.current = timeRemaining;
    // Log para depuração
    console.log('[TIMER] Atualizando timeRef:', timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    if (gameStatus === 'active') {
      console.log('[TIMER] Iniciando timer...');
      const interval = setInterval(() => {
        console.log('[TIMER] Tick! timeRef:', timeRef.current);
        if (timeRef.current > 1) {
          dispatch({ type: 'SET_TIME_REMAINING', payload: timeRef.current - 1 });
        } else {
          dispatch({ type: 'SET_TIME_REMAINING', payload: 0 });
          stopGame();
        }
      }, 1000);
      setTimer(interval);
      return () => {
        console.log('[TIMER] Limpando timer...');
        clearInterval(interval);
        setTimer(null);
      };
    } else {
      if (timer) {
        console.log('[TIMER] Limpando timer manualmente...');
        clearInterval(timer);
        setTimer(null);
      }
    }
  }, [gameStatus]);


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
      // await resetGame();
      // Mantém os jogadores, zera apenas a pontuação
      const updatedTeams = {
        blue: { ...teams.blue, score: 0 },
        red: { ...teams.red, score: 0 }
      };
      dispatch({ type: 'SET_TEAMS', payload: updatedTeams });
      dispatch({ type: 'SET_GAME_STATUS', payload: 'waiting' });
      dispatch({ type: 'SET_TIME_REMAINING', payload: 600 });
      dispatch({ type: 'RESET_SCANNED_QR' });
      await resetResultsInFirestore();
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
    //{ id: 'players', name: 'Jogadores', icon: Users },
    { id: 'qrcodes', name: 'QR Codes', icon: QrCode },
    //{ id: 'sync', name: 'Sincronização', icon: Smartphone },
    { id: 'stats', name: 'Estatísticas', icon: BarChart3 }
  ];

  return (
    <div className="admin-panel">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <div className="header-left">
            <img src={logo} alt="QrcodeMaster Logo" className="header-logo" />
            <div className="header-text">
              <h1>Painel Administrativo</h1>
              <p>QrcodeMaster - Administração da Plataforma</p>
            </div>
          </div>
          
          <div className="header-right">
            <div className={`status-badge status-${gameStatus}`}>
              <div className="status-dot"></div>
              <span>{getStatusText()}</span>
            </div>
            
            <div className="timer-display">
              <Clock size={16} />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="admin-content">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <nav className="sidebar-nav">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{section.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Game Controls */}
          <div className="game-controls">
            <h3>Controles do Jogo</h3>
            <div className="controls-grid">
              <button
                onClick={handleStartGame}
                disabled={gameStatus === 'active'}
                className="control-btn start-btn"
              >
                <Play size={16} />
                <span>Iniciar</span>
              </button>
              
              <button
                onClick={handleStopGame}
                disabled={gameStatus !== 'active'}
                className="control-btn stop-btn"
              >
                <Square size={16} />
                <span>Parar</span>
              </button>
              
              <button
                onClick={handleResetGame}
                className="control-btn reset-btn"
              >
                <RotateCcw size={16} />
                <span>Resetar</span>
              </button>

              {/*
              <button
                onClick={exportGameData}
                className="control-btn export-btn"
              >
                <Download size={16} />
                <span>Exportar</span>
              </button>
               */}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {activeSection === 'dashboard' && (
            <div className="dashboard">
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-content">
                    <div className="stat-text">
                      <span className="stat-label">Tempo Restante</span>
                      <span className="stat-value">{formatTime(timeRemaining)}</span>
                    </div>
                    <div className="stat-icon clock-icon">
                      <Clock size={24} />
                    </div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-content">
                    <div className="stat-text">
                      <span className="stat-label">Total Jogadores</span>
                      <span className="stat-value">{getTotalPlayers()}</span>
                    </div>
                    <div className="stat-icon users-icon">
                      <Users size={24} />
                    </div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-content">
                    <div className="stat-text">
                      <span className="stat-label">QRs Escaneados</span>
                      <span className="stat-value">{scannedQRCodes?.length || 0}</span>
                    </div>
                    <div className="stat-icon qr-icon">
                      <QrCode size={24} />
                    </div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-content">
                    <div className="stat-text">
                      <span className="stat-label">Maior Pontuação</span>
                      <span className="stat-value">{Math.max(teams.blue.score, teams.red.score)}</span>
                    </div>
                    <div className="stat-icon trophy-icon">
                      <Trophy size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Teams Overview */}
              <div className="teams-grid">
                {["blue", "red"].map(teamName => {
                  const teamData = teams[teamName];
                  return (
                    <div key={teamName} className={`team-card team-${teamName}`}>
                      <div className="team-header">
                        <h3>Equipe {teamName === 'blue' ? 'Azul' : 'Vermelha'}</h3>
                        <div className="team-score">{teamData.score}</div>
                      </div>
                      <div className="team-players-count">
                        <Users size={16} />
                        {teamData.players.length}/5 jogadores
                      </div>
                      <div className="players-list">
                        {teamData.players.length === 0 ? (
                          <p className="no-players">Nenhum jogador registrado</p>
                        ) : (
                          teamData.players.map((player, index) => (
                            <div key={index} className="player-row">
                              <div className="player-item">
                                <div className={`player-dot team-${teamName}`}></div>
                                <span className="player-name">{player}</span>
                              </div>
                              <button
                                onClick={() => removePlayer(player, teamName)}
                                className="remove-btn"
                              >
                                <Minus size={16} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                      {/* Score Adjustment */}
                      <div className="score-adjustment">
                        <button
                          onClick={() => adjustScore(teamName, -1)}
                          className="adjust-btn minus"
                        >
                          <Minus size={16} />
                        </button>
                        <span>Ajustar Pontuação</span>
                        <button
                          onClick={() => adjustScore(teamName, 1)}
                          className="adjust-btn plus"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Winner Display */}
              {gameStatus === 'finished' && (
                <div 
                  className={`winner-display winner-${getWinningTeam()}`}
                >
                  <Trophy size={48} />
                  <h2>
                    {getWinningTeam() === 'tie' 
                      ? 'Empate!' 
                      : `Equipe ${getWinningTeam() === 'blue' ? 'Azul' : 'Vermelha'} Venceu!`
                    }
                  </h2>
                  <p>Pontuação Final: Azul {teams.blue.score} x {teams.red.score} Vermelha</p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'players' && (
            <div className="players-section">
              <h2>Gerenciamento de Jogadores</h2>
              
              {/* Add Player Manually */}
              <div className="add-player-form">
                <h3>Adicionar Jogador Manualmente</h3>
                <div className="form-row">
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Nome do jogador"
                    className="player-input"
                  />
                  <select
                    value={selectedTeamForPlayer}
                    onChange={(e) => setSelectedTeamForPlayer(e.target.value)}
                    className="team-select"
                  >
                    <option value="blue">Equipe Azul</option>
                    <option value="red">Equipe Vermelha</option>
                  </select>
                  <button onClick={addPlayerManually} className="add-btn">
                    <UserPlus size={16} />
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>

              {/* Players List */}
              <div className="teams-list">
                {Object.entries(teams).map(([teamName, teamData]) => (
                  <div key={teamName} className={`team-section team-${teamName}`}>
                    <h3>Equipe {teamName === 'blue' ? 'Azul' : 'Vermelha'} ({teamData.players.length}/5)</h3>
                    
                    <div className="players-container">
                      {teamData.players.length === 0 ? (
                        <div className="empty-team">Nenhum jogador registrado</div>
                      ) : (
                        teamData.players.map((player, index) => (
                          <div key={index} className="player-card">
                            <div className="player-info">
                              <div className={`player-dot team-${teamName}`}></div>
                              <span className="player-name">{player}</span>
                            </div>
                            <button
                              onClick={() => removePlayer(player, teamName)}
                              className="remove-player-btn"
                            >
                              <Minus size={16} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="players-note">
                <strong>Nota:</strong> Os jogadores normalmente se registram pelo app mobile. 
                Use a adição manual apenas em casos especiais.
              </div>
            </div>
          )}

          {activeSection === 'qrcodes' && (
            <div className="qrcodes-section">
              <QRGeneratorClean />
            </div>
          )}

          {activeSection === 'sync' && (
            <div className="sync-section">
              <SystemSyncClean />
            </div>
          )}

          {activeSection === 'stats' && (
            <div className="stats-section">
              <h2>Estatísticas do Jogo</h2>
              
              <div className="qr-stats">
                <div className="qr-stat verde">
                  <div className="qr-count">
                    {results?.filter(qr => qr.color === 'verde').length || 0}
                  </div>
                  <div className="qr-label">QRs Verdes</div>
                  <div className="qr-points">1 ponto cada</div>
                </div>
                <div className="qr-stat laranja">
                  <div className="qr-count">
                    {results?.filter(qr => qr.color === 'laranja').length || 0}
                  </div>
                  <div className="qr-label">QRs Laranjas</div>
                  <div className="qr-points">3 pontos cada</div>
                </div>
                <div className="qr-stat vermelho">
                  <div className="qr-count">
                    {results?.filter(qr => qr.color === 'vermelho').length || 0}
                  </div>
                  <div className="qr-label">QRs Vermelhos</div>
                  <div className="qr-points">5 pontos cada</div>
                </div>
              </div>

              <div className="team-progress">
                <h3>Progresso das Equipes</h3>
                <div className="progress-bars">
                  <div className="progress-item">
                    <div className="progress-header">
                      <span className="team-name blue">Equipe Azul</span>
                      <span className="team-points">{teams.blue.score} pontos</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill blue"
                        style={{ 
                          width: `${Math.max(teams.blue.score, teams.red.score) > 0 
                            ? (teams.blue.score / Math.max(teams.blue.score, teams.red.score)) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="progress-item">
                    <div className="progress-header">
                      <span className="team-name red">Equipe Vermelha</span>
                      <span className="team-points">{teams.red.score} pontos</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill red"
                        style={{ 
                          width: `${Math.max(teams.blue.score, teams.red.score) > 0 
                            ? (teams.red.score / Math.max(teams.blue.score, teams.red.score)) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="game-summary">
                <h3>Resumo da Partida</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <div className="summary-value">{getTotalPlayers()}</div>
                    <div className="summary-label">Jogadores</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-value">{results ? results.length : 0}</div>
                    <div className="summary-label">QRs Escaneados</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-value">{teams.blue.score + teams.red.score}</div>
                    <div className="summary-label">Pontos Totais</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-value">{Math.abs(teams.blue.score - teams.red.score)}</div>
                    <div className="summary-label">Diferença</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="admin-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span className="footer-version">QrcodeMaster Beta</span>
            <span className="footer-divider">•</span>
            <span className="footer-event">Desenvolvido para Fatech 2025</span>
          </div>
          <div className="footer-right">
            <span className="footer-copyright">
              Copyright © 2025 Pedro Otávio Rodrigues Marcato
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}