# ✈️ Miles Hunter — Buscador LATAM Pass

Aplicativo para encontrar barganhas em passagens aéreas com milhas LATAM Pass.

## Funcionalidades

- 🔍 **30 destinos internacionais** com custo em milhas (tabela fixa)
- 📅 **Date picker** — selecione a data e os deep links são gerados automaticamente
- 🔗 **Deep links** — abre aa.com, delta.com ou united.com já com GRU, destino e data preenchidos
- 🔔 **Seats.aero** — link direto para monitorar disponibilidade gratuita
- 📱 **Template WhatsApp** — mensagem pronta para enviar à LATAM com botão direto
- 📊 **Tabela fixa completa** — todas as regiões e classes
- 🤝 **15 companhias parceiras** — detalhes, dicas e produto de bordo

## Deploy na Vercel (5 minutos)

### Opção 1: CLI (mais rápido)

```bash
npm i -g vercel       # Instale a CLI
cd miles-hunter       # Entre na pasta
npm install           # Instale deps
npm run dev           # Teste local (localhost:5173)
vercel                # Deploy! Aceite defaults.
```

### Opção 2: Via GitHub

1. Crie repo no GitHub e faça push
2. vercel.com → New Project → Import do GitHub
3. Deploy automático a cada push

## Atualizando dados

Toda a base está no início de `src/App.jsx`:
- **TABLE** — valores tabela fixa
- **AIRLINES** — parceiras
- **DESTS** — destinos
- **REGIONS** — regiões LATAM Pass

## Stack

React 18 + Vite 6 · Zero deps externas · CSS-in-JS · DM Sans + JetBrains Mono
