# TaskFlow

Sistema de gerenciamento de tarefas com quadro Kanban, dashboard analítico e notificações por e-mail.

## Stack

- **Frontend:** React + Vite + TypeScript
- **Backend:** NestJS + TypeORM
- **Banco de dados:** PostgreSQL
- **Cache / Filas:** Redis + BullMQ
- **Infraestrutura:** Docker + Docker Compose

## Funcionalidades

- Autenticação com JWT (login e cadastro)
- Quadro Kanban com drag-and-drop
- Criação, edição e exclusão de cards
- Histórico de movimentações por card
- Prioridade, tags e data de entrega
- Dashboard com gráficos analíticos
- Fila de e-mail assíncrona com BullMQ

## Pré-requisitos

- Docker e Docker Compose
- Node.js 20+
- npm

## Como executar com Docker

```bash
# Clone o repositório
git clone https://github.com/Gustavo067/taskflow.git
cd taskflow

# Suba todos os serviços
docker compose up -d

# Acesse o frontend
cd frontend && npm install && npm run dev
```

Acesse: http://localhost:5173

## Como executar localmente

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Variáveis de ambiente

```env
DATABASE_URL=postgresql://taskflow:taskflow123@localhost:5432/taskflow
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
PORT=3001
```

## Decisões técnicas

- **BullMQ + Redis** para processamento assíncrono de e-mails, evitando bloqueio nas requisições
- **TypeORM com synchronize** apenas em desenvolvimento para agilizar iterações
- **JWT stateless** para autenticação sem necessidade de sessão no servidor
- **@hello-pangea/dnd** como alternativa mantida do react-beautiful-dnd
- **Monorepo simples** com backend e frontend na mesma raiz para facilitar o docker-compose