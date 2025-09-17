import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Eye, Smartphone } from 'lucide-react';
import './QRGeneratorClean.css';

export default function QRGeneratorClean() {
  const [selectedType, setSelectedType] = useState('verde');
  
  const qrTypes = {
    verde: { 
      color: '#16a34a', 
      points: 1, 
      name: 'Verde',
      className: 'verde'
    },
    laranja: { 
      color: '#ea580c', 
      points: 3, 
      name: 'Laranja',
      className: 'laranja'
    },
    vermelho: { 
      color: '#dc2626', 
      points: 5, 
      name: 'Vermelho',
      className: 'vermelho'
    }
  };

  const generateQRData = () => {
    return `GameQrcodeFach:${selectedType}`;
  };

  const printQR = () => {
  const printWindow = window.open('', '_blank');
    const qrData = generateQRData();
    const qrType = qrTypes[selectedType];
    // Captura o SVG gerado pelo QRCodeSVG
    const qrSvg = document.querySelector('.qr-container svg');
    let qrSvgHtml = '';
    if (qrSvg) {
      qrSvgHtml = qrSvg.outerHTML;
    } else {
      qrSvgHtml = '<div style="color:red">QR não gerado</div>';
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${qrType.name} (${qrType.points} ponto${qrType.points > 1 ? 's' : ''})</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              background: #f8fafc;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .print-container {
              background: white;
              border-radius: 16px;
              padding: 40px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 400px;
              width: 100%;
              border: 2px solid ${qrType.color};
            }
            .qr-container { 
              display: inline-block; 
              border: 3px solid ${qrType.color}; 
              padding: 16px; 
              border-radius: 12px; 
              background: white;
              margin-bottom: 20px;
            }
            .game-title {
              font-size: 24px;
              color: #1e293b;
              margin-bottom: 16px;
              font-weight: 700;
            }
            .qr-type { 
              color: ${qrType.color}; 
              font-size: 28px; 
              font-weight: bold; 
              margin-bottom: 8px;
            }
            .qr-points { 
              font-size: 18px; 
              margin: 12px 0;
              color: #374151;
              font-weight: 600;
            }
            .instructions {
              margin-top: 24px;
              padding: 16px;
              background: #f8fafc;
              border-radius: 12px;
              font-size: 14px;
              color: #64748b;
              line-height: 1.6;
              border: 1px solid #e2e8f0;
            }
            @media print {
              body { background: white !important; }
              .print-container { box-shadow: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="game-title">🎯 GameQrcodeFach</div>
            <div class="qr-container">
              ${qrSvgHtml}
            </div>
            <div class="qr-type">${qrType.name}</div>
            <div class="qr-points">Vale ${qrType.points} ponto${qrType.points > 1 ? 's' : ''}</div>
            <div class="instructions">
              📱 Escaneie este QR Code com o app GameQrcodeFach<br>
              🏆 Ganhe pontos para sua equipe<br>
              ⚡ Cada QR pode ser escaneado apenas uma vez!
            </div>
          </div>
          <script>setTimeout(() => window.print(), 500);</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
  <div className="qr-generator">
      {/* Header */}
      <div className="qr-header">
        <div className="qr-title-section">
          <div className="qr-icon">
            <Smartphone size={24} />
          </div>
          <div>
            <h2>Gerador de QR Codes</h2>
            <p>Crie QR codes para o app mobile GameQrcodeFach</p>
          </div>
        </div>
        
        <div className="format-badge">
          <Smartphone size={16} />
          <span>Formato Mobile Otimizado</span>
        </div>
      </div>

      <div className="qr-content">
        {/* Controls Panel */}
        <div className="qr-controls">
          <h3>Configurações</h3>
          
          <div className="qr-type-selection">
            <label className="selection-label">Tipo de QR Code</label>
            <div className="type-options">
              {Object.entries(qrTypes).map(([key, type]) => (
                <label
                  key={key}
                  className={`type-option ${selectedType === key ? 'selected' : ''} ${type.className}`}
                >
                  <input
                    type="radio"
                    name="qrType"
                    value={key}
                    checked={selectedType === key}
                    onChange={(e) => setSelectedType(e.target.value)}
                  />
                  <div className="option-content">
                    <div className={`color-dot ${type.className}`}></div>
                    <div className="option-text">
                      <div className="option-name">{type.name}</div>
                      <div className="option-points">{type.points} ponto{type.points > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mobile-info">
            <div className="info-header">
              <Smartphone size={20} />
              <span>Formato Mobile Otimizado</span>
            </div>
            <p>
              QR codes únicos por cor, compatíveis com o app React Native.
              Cada cor pode ser escaneada apenas uma vez por jogador.
            </p>
          </div>

          {/* Generated Code Preview */}
          <div className="code-preview">
            <div className="preview-label">Código gerado:</div>
            <div className="preview-code">{generateQRData()}</div>
          </div>
        </div>

        {/* QR Code Preview & Actions */}
        <div className="qr-preview">
          <div className="preview-header">
            <Eye size={20} />
            <h3>Preview</h3>
          </div>

          <div className="qr-display">
            {/* QR Code Display */}
            <div className={`qr-container ${qrTypes[selectedType].className}`}>
              <QRCodeSVG
                value={generateQRData()}
                size={200}
                fgColor={qrTypes[selectedType].color}
                bgColor="#ffffff"
                level="M"
              />
            </div>

            {/* QR Info */}
            <div className="qr-info">
              <div className={`qr-type-name ${qrTypes[selectedType].className}`}>
                QR Code {qrTypes[selectedType].name}
              </div>
              <div className="qr-value">
                Vale <strong>{qrTypes[selectedType].points}</strong> ponto{qrTypes[selectedType].points > 1 ? 's' : ''}
              </div>
            </div>

            {/* Action Button */}
            <button onClick={printQR} className="print-btn">
              <Printer size={20} />
              <span>Imprimir QR Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="qr-instructions">
        <h3>Dicas para Uso</h3>
        <div className="instructions-grid">
          <div className="instruction-item">
            <h4>📱 Impressão</h4>
            <ul>
              <li>Use papel branco de boa qualidade</li>
              <li>Tamanho mínimo: 5x5 cm</li>
              <li>Plastifique para proteção externa</li>
              <li>Teste escaneamento antes de distribuir</li>
            </ul>
          </div>
          <div className="instruction-item">
            <h4>🎯 Distribuição</h4>
            <ul>
              <li>Verde (1pt): Locais fáceis de encontrar</li>
              <li>Laranja (3pts): Dificuldade média</li>
              <li>Vermelho (5pts): Locais mais difíceis</li>
              <li>Espalhe estrategicamente pela feira</li>
            </ul>
          </div>
          <div className="instruction-item">
            <h4>📱 App Mobile</h4>
            <ul>
              <li>Formato otimizado para React Native</li>
              <li>Cada cor escaneada apenas uma vez</li>
              <li>Validação automática de duplicatas</li>
              <li>Sincronização em tempo real</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}