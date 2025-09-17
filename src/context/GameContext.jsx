import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, onSnapshot, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const GameContext = createContext();

const initialState = {
  gameStatus: 'waiting', // waiting, active, finished
  timeRemaining: 600, // 10 minutes in seconds
  teams: {
    blue: { players: [], score: 0 },
    red: { players: [], score: 0 }
  },
  currentPlayer: null,
  isAdmin: false,
  // Compatibilidade com app mobile
  mobileCompatibility: true,
  qrCodeFormat: 'GameQrcodeFach', // Formato compatível com mobile
  scannedQRCodes: [] // Histórico de QR codes escaneados
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_GAME_STATUS':
      return { ...state, gameStatus: action.payload };
    case 'SET_TIME_REMAINING':
      return { ...state, timeRemaining: action.payload };
    case 'SET_TEAMS':
      return { ...state, teams: action.payload };
    case 'SET_CURRENT_PLAYER':
      return { ...state, currentPlayer: action.payload };
    case 'SET_IS_ADMIN':
      return { ...state, isAdmin: action.payload };
    case 'ADD_PLAYER':
      const { playerName, team } = action.payload;
      if (state.teams[team].players.length >= 5) {
        throw new Error(`Equipe ${team} já está cheia! Máximo 5 jogadores.`);
      }
      return {
        ...state,
        teams: {
          ...state.teams,
          [team]: {
            ...state.teams[team],
            players: [...state.teams[team].players, playerName]
          }
        }
      };
    case 'ADD_SCORE':
      const { teamName, points, qrCode } = action.payload;
      // Verificar se QR code já foi escaneado
      if (qrCode && state.scannedQRCodes.includes(qrCode)) {
        throw new Error('QR Code já foi escaneado!');
      }
      
      return {
        ...state,
        teams: {
          ...state.teams,
          [teamName]: {
            ...state.teams[teamName],
            score: state.teams[teamName].score + points
          }
        },
        scannedQRCodes: qrCode ? [...state.scannedQRCodes, qrCode] : state.scannedQRCodes
      };
    case 'RESET_SCANNED_QR':
      return { ...state, scannedQRCodes: [] };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Sincroniza estado do Firestore em tempo real
  useEffect(() => {
    if (db) {
      try {
        const gameDocRef = doc(db, 'game', 'current');
        const unsubscribe = onSnapshot(gameDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            dispatch({ type: 'SET_GAME_STATUS', payload: data.status });
            dispatch({ type: 'SET_TIME_REMAINING', payload: data.timeRemaining });
            dispatch({ type: 'SET_TEAMS', payload: data.teams });
            if (data.scannedQRCodes) {
              dispatch({ type: 'RESET_SCANNED_QR' });
              data.scannedQRCodes.forEach(qr => {
                dispatch({ type: 'ADD_SCORE', payload: { teamName: null, points: 0, qrCode: qr } });
              });
            }
            setIsLoaded(true);
          }
        }, (error) => {
          console.warn("Erro ao conectar com Firebase:", error);
        });
        return () => unsubscribe();
      } catch (error) {
        console.warn("Firebase não disponível, funcionando em modo local:", error);
      }
    } else {
      console.log("Funcionando em modo offline/demo");
      setIsLoaded(true);
    }
  }, []);

  // Sempre que o estado mudar, salva no Firestore
  useEffect(() => {
    if (db && isLoaded) {
      try {
        const gameDocRef = doc(db, 'game', 'current');
        setDoc(gameDocRef, {
          status: state.gameStatus,
          timeRemaining: state.timeRemaining,
          teams: state.teams,
          scannedQRCodes: state.scannedQRCodes
        }, { merge: true });
      } catch (error) {
        console.warn("Erro ao salvar estado no Firestore:", error);
      }
    }
  }, [state.gameStatus, state.timeRemaining, state.teams, state.scannedQRCodes, isLoaded]);

  const addPlayer = async (playerName, team) => {
    try {
      dispatch({ type: 'ADD_PLAYER', payload: { playerName, team } });
      // O Firestore será atualizado pelo useEffect de sincronização
      dispatch({ type: 'SET_CURRENT_PLAYER', payload: { name: playerName, team } });
    } catch (error) {
      console.error('Erro ao adicionar jogador:', error);
      throw error;
    }
  };

  const addScore = async (team, points, qrCode = null) => {
    try {
      dispatch({ type: 'ADD_SCORE', payload: { teamName: team, points, qrCode } });
      // O Firestore será atualizado pelo useEffect de sincronização
    } catch (error) {
      console.error('Erro ao adicionar pontuação:', error);
      throw error;
    }
  };

  const startGame = async () => {
    try {
      dispatch({ type: 'SET_GAME_STATUS', payload: 'active' });
      // O Firestore será atualizado pelo useEffect de sincronização
    } catch (error) {
      console.error('Erro ao iniciar jogo:', error);
    }
  };

  const stopGame = async () => {
    try {
      dispatch({ type: 'SET_GAME_STATUS', payload: 'finished' });
      // O Firestore será atualizado pelo useEffect de sincronização
    } catch (error) {
      console.error('Erro ao parar jogo:', error);
    }
  };

  const resetGame = async () => {
    try {
      dispatch({ type: 'SET_GAME_STATUS', payload: 'waiting' });
      dispatch({ type: 'SET_TIME_REMAINING', payload: 600 });
      dispatch({ type: 'SET_TEAMS', payload: {
        blue: { players: [], score: 0 },
        red: { players: [], score: 0 }
      } });
      dispatch({ type: 'RESET_SCANNED_QR' });
      // O Firestore será atualizado pelo useEffect de sincronização
    } catch (error) {
      console.error('Erro ao resetar jogo:', error);
    }
  };

  const value = {
    ...state,
    addPlayer,
    addScore,
    startGame,
    stopGame,
    resetGame,
    dispatch
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame deve ser usado dentro de um GameProvider');
  }
  return context;
}
