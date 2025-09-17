// Utilitários para sincronização de QR codes entre mobile e web
// Compatibilidade entre formatos: GameQrcodeFach:verde vs GAME_QR_GREEN_001

export const QR_CODE_FORMATS = {
  MOBILE: 'GameQrcodeFach',
  WEB_LEGACY: 'GAME_QR'
};

export const COLOR_MAPPINGS = {
  // Mobile -> Web
  verde: { web: 'GREEN', points: 1 },
  laranja: { web: 'ORANGE', points: 3 },
  vermelho: { web: 'RED', points: 5 },
  
  // Web -> Mobile
  GREEN: { mobile: 'verde', points: 1 },
  ORANGE: { mobile: 'laranja', points: 3 },
  RED: { mobile: 'vermelho', points: 5 }
};

export const POINT_VALUES = {
  verde: 1,
  laranja: 3,
  vermelho: 5,
  GREEN: 1,
  ORANGE: 3,
  RED: 5
};

/**
 * Converte QR code do formato mobile para web
 * @param {string} mobileQR - QR code no formato mobile (GameQrcodeFach:verde)
 * @returns {string} QR code no formato web (GAME_QR_GREEN_001)
 */
export function mobileToWebQR(mobileQR) {
  if (!mobileQR.startsWith(QR_CODE_FORMATS.MOBILE + ':')) {
    return null;
  }
  
  const color = mobileQR.replace(QR_CODE_FORMATS.MOBILE + ':', '');
  const mapping = COLOR_MAPPINGS[color];
  
  if (!mapping) return null;
  
  // Gera ID único baseado no timestamp
  const id = Date.now().toString().slice(-3).padStart(3, '0');
  return `${QR_CODE_FORMATS.WEB_LEGACY}_${mapping.web}_${id}`;
}

/**
 * Converte QR code do formato web para mobile
 * @param {string} webQR - QR code no formato web (GAME_QR_GREEN_001)
 * @returns {string} QR code no formato mobile (GameQrcodeFach:verde)
 */
export function webToMobileQR(webQR) {
  if (!webQR.startsWith(QR_CODE_FORMATS.WEB_LEGACY + '_')) {
    return null;
  }
  
  const parts = webQR.split('_');
  if (parts.length < 3) return null;
  
  const color = parts[2];
  const mapping = COLOR_MAPPINGS[color];
  
  if (!mapping) return null;
  
  return `${QR_CODE_FORMATS.MOBILE}:${mapping.mobile}`;
}

/**
 * Valida se um QR code é válido (qualquer formato)
 * @param {string} qrCode - QR code para validar
 * @returns {object} { valid: boolean, format: string, color: string, points: number }
 */
export function validateQRCode(qrCode) {
  // Formato mobile: GameQrcodeFach:verde
  if (qrCode.startsWith(QR_CODE_FORMATS.MOBILE + ':')) {
    const color = qrCode.replace(QR_CODE_FORMATS.MOBILE + ':', '');
    const mapping = COLOR_MAPPINGS[color];
    
    if (mapping) {
      return {
        valid: true,
        format: 'mobile',
        color: color,
        points: mapping.points
      };
    }
  }
  
  // Formato web: GAME_QR_GREEN_001
  if (qrCode.startsWith(QR_CODE_FORMATS.WEB_LEGACY + '_')) {
    const parts = qrCode.split('_');
    if (parts.length >= 3) {
      const color = parts[2];
      const mapping = COLOR_MAPPINGS[color];
      
      if (mapping) {
        return {
          valid: true,
          format: 'web',
          color: color,
          points: mapping.points
        };
      }
    }
  }
  
  return {
    valid: false,
    format: null,
    color: null,
    points: 0
  };
}

/**
 * Normaliza QR code para formato padrão interno
 * @param {string} qrCode - QR code em qualquer formato
 * @returns {object} { normalized: string, color: string, points: number }
 */
export function normalizeQRCode(qrCode) {
  const validation = validateQRCode(qrCode);
  
  if (!validation.valid) {
    return { normalized: null, color: null, points: 0 };
  }
  
  let normalizedColor;
  
  if (validation.format === 'mobile') {
    normalizedColor = validation.color; // verde, laranja, vermelho
  } else {
    normalizedColor = COLOR_MAPPINGS[validation.color].mobile; // GREEN -> verde
  }
  
  return {
    normalized: `${QR_CODE_FORMATS.MOBILE}:${normalizedColor}`,
    color: normalizedColor,
    points: validation.points
  };
}

/**
 * Gera QR codes válidos para o jogo
 * @param {string} format - 'mobile' ou 'web'
 * @returns {array} Array de QR codes válidos
 */
export function generateValidQRCodes(format = 'mobile') {
  const colors = format === 'mobile' 
    ? ['verde', 'laranja', 'vermelho']
    : ['GREEN', 'ORANGE', 'RED'];
  
  return colors.map((color, index) => {
    if (format === 'mobile') {
      return `${QR_CODE_FORMATS.MOBILE}:${color}`;
    } else {
      const id = (index + 1).toString().padStart(3, '0');
      return `${QR_CODE_FORMATS.WEB_LEGACY}_${color}_${id}`;
    }
  });
}

/**
 * Converte nome de equipe entre formatos
 * @param {string} team - Nome da equipe
 * @param {string} targetFormat - 'mobile' ou 'web'
 * @returns {string} Nome da equipe no formato alvo
 */
export function convertTeamName(team, targetFormat) {
  const teamMappings = {
    // Web -> Mobile
    blue: 'Azul',
    red: 'Vermelha',
    // Mobile -> Web
    Azul: 'blue',
    Vermelha: 'red'
  };
  
  return teamMappings[team] || team;
}

/**
 * Obtém estatísticas de QR codes escaneados
 * @param {array} scannedQRCodes - Array de QR codes escaneados
 * @returns {object} Estatísticas detalhadas
 */
export function getQRCodeStats(scannedQRCodes) {
  const stats = {
    total: scannedQRCodes.length,
    byColor: { verde: 0, laranja: 0, vermelho: 0 },
    totalPoints: 0,
    formats: { mobile: 0, web: 0 }
  };
  
  scannedQRCodes.forEach(qrCode => {
    const validation = validateQRCode(qrCode);
    if (validation.valid) {
      const normalized = normalizeQRCode(qrCode);
      stats.byColor[normalized.color]++;
      stats.totalPoints += validation.points;
      stats.formats[validation.format]++;
    }
  });
  
  return stats;
}