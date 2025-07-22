# Sauce Application and Petstore API

This repository contains a clean and scalable structure for testing both **API** and **UI** flows using [Playwright](https://playwright.dev/). Two different tasks are presented in apiTest and uiTest folders.

---

## 📁 Project Structure

```
tasks/
├── apiTest/          # API testing domain
│   ├── tests/        # All API test cases
│   └── utils/        # Helpers, factory data, types
├── uiTest/           # UI testing domain
│   ├── data/         # UI test cases related data
│   ├── tests/        # UI test cases
│   ├── screenshots/  # Screenshots related to test case checks
│   └── pages/        # POM to organize pages
├── playwright.config.ts  # Global config (API + UI support)
├── package.json          # Scripts and dependencies
└── tsconfig.json         # TypeScript configuration
```

---

## 🚀 Getting Started

### 1. **Install dependencies**
npm install

### 2. **Run all API test**
npm run test:api

### 3. **Run all UI test**
npm run test:ui

### 4. **Generate API test**
npm run report:api

### 5. **Generate UI test**
npm run report:ui