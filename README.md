# React web app built with TypeScript

Website made as part of an AGH University course. Features placing orders, adding reviews, browsing order history and more. The backend uses an SQLite database due to its simplicity, while the frontend is built in React. The styling is done with pure CSS and the website itself remains responsive on different screen sizes.

## Tech Stack

- **Frontend:** React, TypeScript, Pure CSS
- **Backend:** Express, Node.js, SQLite
- **Authentication & Security:** JSON Web Tokens (JWT), Bcrypt
- **Utilities:** Dotenv

## Data source

[Fake Store API](https://fakestoreapi.com/products)

## Setup

### Server:

#### Create .env

```
JWT_SECRET=[YOUR KEY] JWT_EXPIRES_IN=1h
```

#### Run the server:

```shell
cd backend
npm install
npx tsx server.ts
```

#### Start the app

```shell
cd frontend
npm install
npm run dev
```

#### Access the admin account

```
Login: admin
Password: 123
```

## Authors

- Tomasz Stanek
- Jakub Turek
