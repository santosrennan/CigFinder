# CigFinder Frontend

Aplicativo para encontrar locais que vendem cigarros e acessórios relacionados no Rio de Janeiro.

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
# Chave da API do Google Maps
VITE_GOOGLE_MAPS_KEY=sua_chave_do_google_maps_aqui

# Outras variáveis de ambiente 
VITE_APP_NAME=CigFinder
VITE_API_URL=https://api.cigfinder.com
```

Substitua `sua_chave_do_google_maps_aqui` pela sua chave de API do Google Maps com as APIs Maps JavaScript e Places ativadas.

### Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Compilar para produção
npm run build
```

## Funcionalidades

- Visualização de locais no mapa
- Filtragem por marcas de cigarros e acessórios disponíveis
- Check-in e avaliações de locais
- Modo escuro

## Estrutura do Projeto

- `src/api` - Serviços de API e mocks
- `src/components` - Componentes React reutilizáveis
- `src/hooks` - Hooks personalizados
- `src/pages` - Páginas da aplicação
- `src/fixtures` - Dados mockados para desenvolvimento
- `src/types` - Definições de tipos TypeScript

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
