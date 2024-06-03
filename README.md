# email-engine-backend

### API TESTING
Please start project `npm run dev`, after successful connection with database. please run `npm test` to run test-cases


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
