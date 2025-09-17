# 🎯 GameQrcodeFach - Caça ao Tesouro QR

Um sistema interativo de caça ao tesouro usando QR codes para feira escolar, com painel administrativo web profissional e futuro app Android para jogadores.

![Game Preview](https://img.shields.io/badge/Status-Ready_for_School_Fair-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-6.0.1-purple)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4.15-cyan)

## 🎮 Sobre o Jogo

O jogo funciona como um caça ao tesouro onde os participantes escaneiam QR codes espalhados pela feira para ganhar pontos. As equipes competem para fazer a maior pontuação em 10 minutos.

### 📊 Sistema de Pontuação
- **QR Verde**: 1 ponto (Fácil de encontrar)
- **QR Laranja**: 3 pontos (Dificuldade média)
- **QR Vermelho**: 5 pontos (Difícil de encontrar)

### 👥 Regras
- 2 equipes: Azul e Vermelha
- Máximo 5 jogadores por equipe
- Tempo de jogo: 10 minutos
- Ganha a equipe com mais pontos

## ✨ Funcionalidades Principais

### 🖥️ **Painel Administrativo Web (Principal)**
- ✅ **Dashboard completo** com métricas em tempo real
- ✅ **Interface tabbed moderna** (Dashboard, Jogadores, QR Codes, Ferramentas)
- ✅ **Controle total do jogo** (Iniciar, pausar, resetar, timer automático)
- ✅ **Gerenciamento de jogadores** (Adicionar/remover manualmente)
- ✅ **Gerador de QR codes integrado** com preview e impressão
- ✅ **Ajuste de pontuação manual** para correções
- ✅ **Estatísticas detalhadas** com exportação de dados
- ✅ **Design responsivo** otimizado para desktop e tablet
- ✅ **Animações profissionais** e feedback visual
- ✅ **Sistema glassmorphism** com gradientes modernos

### 📱 **Interface de Jogadores Web (Demonstração)**
- ✅ Registro com seleção visual de equipes
- ✅ Sala de espera com regras e status das equipes
- ✅ Scanner de QR codes com câmera do celular
- ✅ Botões de teste para demonstração
- ✅ Visualização de pontuação em tempo real
- ✅ Tela de resultados com celebrações animadas

### 🚀 **Futuro App Android** (Planejado)
- 📱 React Native para melhor performance mobile
- 📷 Scanner nativo otimizado
- 🔔 Notificações em tempo real
- 📊 Interface dedicada para jogadores

## 🛠️ Stack Tecnológica

### **Frontend**
- **React 18.3.1** - Interface moderna e reativa
- **Vite 6.0.1** - Build tool rápido e eficiente  
- **TailwindCSS 3.4.15** - Styling utilitário com sistema moderno
- **React Router DOM** - Navegação SPA
- **Lucide React** - Ícones modernos e consistentes

### **Funcionalidades QR**
- **qr-scanner** - Leitura de QR codes via câmera
- **qrcode.react** - Geração de QR codes para impressão
- **Sistema de validação** - Códigos únicos e seguros

### **Deploy & Configuração**
- **GitHub Pages** - Hospedagem gratuita configurada
- **gh-pages** - Deploy automatizado
- **Modo Demo** - Funciona offline sem Firebase

### **Design System**
- **Gradientes dinâmicos** - Visual moderno em todos os componentes
- **Glassmorphism** - Efeitos de vidro com backdrop-blur
- **Animações CSS** - fadeIn, slideInUp, bounceIn, hover effects
- **Responsividade** - Mobile-first design
- **Tipografia** - Sistema consistente com Inter font

### **Backend (Futuro)**
- **Firebase Firestore** - Banco de dados em tempo real
- **Firebase Auth** - Autenticação de usuários
- **Firebase Hosting** - Hospedagem de produção

## 📦 Instalação e Setup

### **Desenvolvimento Local**

```bash
# Clone o repositório
git clone https://github.com/PedroMarcto/GameQrcodeFach.git
cd GameQrcodeFach

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev

# Acesse: http://localhost:3000/GameQrodeFach/
```

### **Sistema Atual - Modo Demo**
O sistema funciona perfeitamente em **modo offline/demo**:
- ✅ Todas as funcionalidades administrativas
- ✅ Gerenciamento completo de equipes
- ✅ Geração e teste de QR codes
- ✅ Interface completa sem necessidade de Firebase
- ✅ Ideal para desenvolvimento e testes

### **Firebase (Futuro - Opcional)**
Para funcionalidades avançadas:

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative o Firestore Database
4. Configure as credenciais em `src/context/GameContext.jsx`

## 🎯 Como Usar

### Para Organizar o Jogo

1. **Prepare os QR Codes**:
   - Acesse `/admin` no sistema
   - Use o gerador de QR codes integrado
   - Imprima os QR codes e espalhe pela feira
   - Formato: `GAME_QR_[COR]_[ID]` (ex: `GAME_QR_GREEN_001`)

2. **Controle o Jogo**:
   - Monitore os registros de jogadores
   - Inicie o jogo quando estiver pronto
   - Acompanhe a pontuação em tempo real
   - O timer para automaticamente em 10 minutos

### Para Participantes

1. **Registro**:
   - Acesse o sistema pelo celular
   - Digite seu nome
   - Escolha uma equipe (Azul ou Vermelha)

2. **Jogo**:
   - Aguarde na sala de espera
   - Quando o jogo iniciar, procure QR codes
   - Aponte a câmera para escanear
   - Veja sua pontuação em tempo real

## 🌐 Deploy no GitHub Pages

### Método Automático (recomendado)
O projeto já está configurado para deploy automático. Apenas:

1. Faça push para a branch `main`
2. O GitHub Actions fará o deploy automaticamente
3. Acesse em: `https://seu-usuario.github.io/GameQrodeFach/`

### Método Manual
```bash
npm run deploy
```

## 📁 Estrutura do Projeto

```
GameQrcodeFach/
├── src/
│   ├── components/           # Componentes React
│   │   ├── AdminPanelNew.jsx # 🎯 Painel administrativo principal (tabbed)
│   │   ├── QRGenerator.jsx   # 📱 Gerador de QR codes responsivo
│   │   ├── PlayerRegistration.jsx # 👤 Registro com seleção visual
│   │   ├── WaitingRoom.jsx   # ⏳ Sala de espera moderna
│   │   ├── Game.jsx          # 🎮 Interface de jogo com scanner
│   │   └── Results.jsx       # 🏆 Resultados com celebrações
│   ├── context/
│   │   └── GameContext.jsx   # 🔄 Estado global + Firebase integration
│   ├── App.jsx              # 🌐 Roteamento e configuração
│   ├── App.css              # 🎨 Estilos específicos da aplicação
│   ├── index.css            # 🎨 Sistema de design global
│   └── main.jsx             # 🚀 Entry point
├── public/                  # 📂 Arquivos estáticos
├── .github/                 # ⚙️ Configurações GitHub
│   └── copilot-instructions.md # 📋 Instruções do projeto
├── package.json            # 📦 Dependências e scripts
└── README.md               # 📖 Documentação
```

## 🎨 Design System Moderno

### **Paleta de Cores**
- **Azul**: `#3B82F6` - Equipe Azul, elementos primários
- **Vermelho**: `#EF4444` - Equipe Vermelha, alertas
- **Verde**: `#10B981` - QR codes fáceis, sucessos
- **Laranja**: `#F59E0B` - QR codes médios, avisos
- **Púrpura**: `#8B5CF6` - Elementos de interface, gradientes
- **Gradientes**: Combinações dinâmicas para profundidade

### **Animações e Transições**
- **fadeIn**: Entrada suave de páginas e elementos
- **slideInUp/Down**: Transições verticais elegantes
- **bounceIn**: Efeitos de celebração e feedback
- **Hover effects**: Interatividade em todos os botões
- **Loading states**: Spinners e estados de carregamento
- **Confetti**: Efeitos especiais na tela de vitória

### **Responsividade**
- **Mobile**: 320px+ - Interface otimizada para jogadores
- **Tablet**: 768px+ - Boa experiência administrativa
- **Desktop**: 1024px+ - Interface administrativa completa
- **Touch-friendly**: Botões grandes e espaçamento adequado

## 🎨 Screenshots

### Interface do Jogador
- Tela de registro com seleção de equipe
- Sala de espera mostrando todas as equipes  
- Scanner de QR code com pontuação em tempo real

### Painel Admin
- Controles do jogo (iniciar/parar/resetar)
- Visualização das equipes e pontuações
- Gerador de QR codes integrado
- Estatísticas completas

## 🔧 Personalização

### Alterar Tempo do Jogo
No arquivo `src/context/GameContext.jsx`, linha 12:
```javascript
timeRemaining: 600, // 600 segundos = 10 minutos
```

### Alterar Pontuação dos QR Codes
No arquivo `src/components/Game.jsx`, função `parseQRCode`:
```javascript
switch (color) {
  case 'GREEN': points = 1; break;
  case 'ORANGE': points = 3; break;  
  case 'RED': points = 5; break;
}
```

### Alterar Número Máximo de Jogadores
No arquivo `src/context/GameContext.jsx`, função `addPlayer`:
```javascript
if (state.teams[team].players.length >= 5) // Altere 5 para o número desejado
```

## 🐛 Resolução de Problemas

### Câmera não funciona
- Verifique se o site está sendo acessado via HTTPS
- Confirme permissões de câmera no navegador
- Teste em diferentes navegadores

### Firebase não conecta
- Verifique as configurações em `firebase.js`
- Confirme se o Firestore está ativado
- Verifique as regras de segurança do Firestore

### QR codes não funcionam
- Confirme o formato: `GAME_QR_[COR]_[ID]`
- Cores válidas: GREEN, ORANGE, RED
- Use o gerador integrado no painel admin

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a seção de resolução de problemas
2. Consulte a documentação do Firebase
3. Abra uma issue no GitHub

## 📝 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido para feira escolar** 🎓
Divirta-se com o caça ao tesouro! 🏆
