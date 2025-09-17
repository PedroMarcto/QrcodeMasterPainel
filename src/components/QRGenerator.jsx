import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Eye, Hash, Palette, Smartphone, Globe } from 'lucide-react';
import { generateValidQRCodes } from '../utils/qrCodeUtils';

export default function QRGenerator() {
  const [selectedType, setSelectedType] = useState('verde');
  
  const qrTypes = {
    // Formato Mobile (Recomendado)
    verde: {
      color: '#10b981',
      points: 1,
      name: 'Verde',
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
      webEquivalent: 'GREEN'
    },
    laranja: {
      color: '#f59e0b',
      points: 3,
      name: 'Laranja',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-800',
      borderColor: 'border-orange-200',
      webEquivalent: 'ORANGE'
    },
    vermelho: {
      color: '#ef4444',
      points: 5,
      name: 'Vermelho',
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      webEquivalent: 'RED'
    }
  };

  const generateQRData = () => {
    return `GameQrcodeFach:${selectedType}`;
  };

  const printQR = () => {
    const printWindow = window.open('', '_blank');
    const qrData = generateQRData();
    const qrType = qrTypes[selectedType];
    
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${qrType.name} (${qrType.points} ponto${qrType.points > 1 ? 's' : ''})</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .print-container {
              background: white;
              border-radius: 20px;
              padding: 40px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 400px;
              width: 100%;
            }
            .qr-container { 
              display: inline-block; 
              border: 4px solid ${qrType.color}; 
              padding: 20px; 
              border-radius: 20px; 
              background: white;
              margin-bottom: 20px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            .qr-header {
              margin-bottom: 20px;
            }
            .game-title {
              font-size: 18px;
              color: #666;
              margin-bottom: 10px;
              font-weight: 500;
            }
            .qr-type { 
              color: ${qrType.color}; 
              font-size: 32px; 
              font-weight: bold; 
              margin-bottom: 8px;
              text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .qr-points { 
              font-size: 20px; 
              margin: 10px 0;
              color: #333;
              font-weight: 600;
            }
            .qr-id { 
              font-size: 16px; 
              color: #888;
              background: #f8f9fa;
              padding: 8px 16px;
              border-radius: 20px;
              display: inline-block;
              margin-top: 15px;
              font-family: 'Courier New', monospace;
            }
            .instructions {
              margin-top: 30px;
              padding: 20px;
              background: #f8f9fa;
              border-radius: 15px;
              font-size: 14px;
              color: #666;
              line-height: 1.5;
            }
            @media print {
              body { background: white !important; }
              .print-container { box-shadow: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="qr-header">
              <div class="game-title">🎯 Caça ao Tesouro QR</div>
            </div>
            <div class="qr-container">
              <div id="qr-code"></div>
            </div>
            <div class="qr-type">${qrType.name}</div>
            <div class="qr-points">Vale ${qrType.points} ponto${qrType.points > 1 ? 's' : ''}</div>
            <div class="qr-id">Código: ${qrId.padStart(3, '0')}</div>
            <div class="instructions">
              📱 Escaneie este QR Code com o app do jogo<br>
              🏆 Ganhe pontos para sua equipe<br>
              ⚡ Corra antes que o tempo acabe!
            </div>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
          <script>
            QRCode.toCanvas(document.getElementById('qr-code'), '${qrData}', {
              width: 180,
              margin: 2,
              color: {
                dark: '${qrType.color}',
                light: '#FFFFFF'
              }
            });
            setTimeout(() => window.print(), 1500);
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Gerador de QR Codes</h2>
        </div>
        <p className="text-gray-600 text-lg">Crie QR codes para o app mobile GameQrcodeFach</p>
        
        <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 text-blue-800 rounded-full border border-blue-200">
          <Smartphone className="w-4 h-4 mr-2" />
          <span className="font-medium">Formato Mobile Otimizado</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Controls Panel */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <Palette className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800">Configurações</h3>
          </div>
          
          <div className="space-y-6">
            {/* QR Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tipo de QR Code
              </label>
              <div className="grid gap-3">
                {Object.entries(qrTypes).map(([key, type]) => (
                  <label
                    key={key}
                    className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedType === key
                        ? `${type.borderColor} ${type.bgColor} shadow-md`
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="qrType"
                      value={key}
                      checked={selectedType === key}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-4 w-full">
                      <div 
                        className="w-6 h-6 rounded-full border-4"
                        style={{ backgroundColor: type.color, borderColor: type.color }}
                      />
                      <div className="flex-1">
                        <div className={`font-bold text-lg ${selectedType === key ? type.textColor : 'text-gray-700'}`}>
                          {type.name}
                        </div>
                        <div className={`text-sm ${selectedType === key ? type.textColor : 'text-gray-500'}`}>
                          {type.points} ponto{type.points > 1 ? 's' : ''} por scan
                        </div>
                      </div>
                      {selectedType === key && (
                        <div className={`w-6 h-6 rounded-full ${type.textColor} flex items-center justify-center`}>
                          <div className="w-3 h-3 bg-current rounded-full" />
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Mobile Format Info */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Formato Mobile Otimizado</span>
              </div>
              <p className="text-sm text-blue-700">
                QR codes únicos por cor, compatíveis com o app React Native.
                Cada cor pode ser escaneada apenas uma vez por jogador.
              </p>
            </div>

            {/* Generated Code Preview */}
            <div className="p-4 bg-gray-50 rounded-xl border">
              <div className="text-sm font-medium text-gray-700 mb-2">Código gerado:</div>
              <div className="font-mono text-lg font-bold text-blue-600 bg-white px-3 py-2 rounded-lg border">
                {generateQRData()}
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Preview & Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <Eye className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Preview</h3>
          </div>

          <div className="text-center">
            {/* QR Code Display */}
            <div className={`inline-block p-6 rounded-2xl border-4 ${qrTypes[selectedType].borderColor} ${qrTypes[selectedType].bgColor} mb-6`}>
              <QRCodeSVG
                value={generateQRData()}
                size={200}
                fgColor={qrTypes[selectedType].color}
                bgColor="#ffffff"
                level="M"
                className="rounded-lg"
              />
            </div>

            {/* QR Info */}
            <div className="mb-8">
              <div className={`text-2xl font-bold mb-2 ${qrTypes[selectedType].textColor}`}>
                QR Code {qrTypes[selectedType].name}
              </div>
              <div className="text-lg text-gray-600 mb-2">
                Vale <span className="font-bold">{qrTypes[selectedType].points}</span> ponto{qrTypes[selectedType].points > 1 ? 's' : ''}
              </div>
              <div className="text-sm text-gray-500 font-mono bg-gray-100 px-3 py-1 rounded-full inline-block">
                ID: {qrId.padStart(3, '0')}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={printQR}
                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Printer className="w-5 h-5" />
                <span>Imprimir QR Code</span>
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setQrId(String(parseInt(qrId || '0') + 1).padStart(3, '0'))}
                  className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  <span>+</span>
                  <span>Próximo ID</span>
                </button>
                <button
                  onClick={() => setQrId('001')}
                  className="flex items-center justify-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  <span>↻</span>
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions Card */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-6 h-6 bg-blue-500 rounded-full mr-3 flex items-center justify-center">
            <span className="text-white text-sm">💡</span>
          </div>
          Dicas para Uso
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-gray-700">
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">📱 Impressão:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Use papel branco de boa qualidade</li>
              <li>• Tamanho mínimo: 5x5 cm</li>
              <li>• Plastifique para proteção</li>
              <li>• Teste antes de distribuir</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-800 mb-2">🎯 Distribuição:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Verde: Fáceis de encontrar</li>
              <li>• Laranja: Dificuldade média</li>
              <li>• Vermelho: Mais difíceis</li>
              <li>• Espalhe estrategicamente</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-800 mb-2">🔄 Compatibilidade:</h4>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Mobile:</strong> App React Native</li>
              <li>• <strong>Web:</strong> Interface web</li>
              <li>• Ambos formatos funcionam</li>
              <li>• Mobile é recomendado</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
