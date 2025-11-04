**# Correções no package.json**

**## React 19 - Atualizações Necessárias**

****Problema:**** Dependências incompatíveis com React 19

****Soluções:****

**- **`vaul`**: **`0.9.9`** → **`^1.1.2`

**- **`framer-motion`**: **`latest`** → **`^11.15.0`

**- **`@emotion/is-prop-valid`**: **`latest`** → **`^1.3.1`

**- **`@types/react`**: **`^18`** → **`^19.2.2`

**- **`@types/react-dom`**: **`^18`** → **`^19.2.2`

**---**

**## Deploy Vercel - Erro "Invalid Version"**

****Problema:**** Erro **`npm error Invalid Version:`** no deploy

****Solução:****

**- **`@vercel/analytics`**: **`latest`** → **`^1.4.1`

****Nota:**** Nunca use **`latest`** em produção. Use versões específicas (ex: **`^1.4.1`**).
