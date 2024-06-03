# email-engine-backend

### Run Server
Please start project using `npm start` predefined script if you want to run in prod mode
Please start project using `npm run dev` predefined script if you want to run in dev mode. project will be run using nodemon


### Structure Breakdown

```text
├── src/
│  ├── config/
│  │   ├── elasticsearch.js
│  │   └── oauth.js
│  │
│  ├── controllers/
│  │   ├── authController.js
│  │   └── emailController.js
│  │
│  ├── env/
│  │   └── Env.js   (Envs variables are exported for whole app)
│  │
│  ├── handler/
│  │   └── globalError.js
│  │
│  ├── routes/
│  │   ├── authRoutes.js
│  │   └── emailRoutes.js
│  │
│  ├── services/
│  │   ├── elasticsearchService.js
│  │   └── outlookService.js
│  │
│  ├── utils/
│  │   ├── AppError.js
│  │   │
│  │   ├── catchAsync.js
│  │   │
│  │   └── constant.js  (constants are exported for whole app)
│  │
│  ├── app.ts
│  └── server.ts
│
├── .env
├── sample.env
├── .gitignore
├── package.json
└── readme.md
```
