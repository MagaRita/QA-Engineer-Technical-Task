const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: [
    "default",
    [
      "jest-allure",
      {
        "outputDirectory": "allure-results"
      }
    ]
  ]
};
