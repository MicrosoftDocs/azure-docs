---
title: Create JavaScript Key Vault secret client
description: Create an authenticated Key Vault secret client using JavaScript.
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: secrets
ms.topic: how-to
ms.custom: devx-track-js
ms.date: 05/10/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to authenticate to the Key Vault with the SDK.
---
# Authenticating to Azure Key Vault SDK for JavaScript with DefaultAzureCredential  
  
This documentation provides guidance on how to programmatically authenticate to Azure Key Vault secrets with JavaScript. Because Azure Key Vault requires Active Directory authentication, to authenticate you must: 

* Set up your environment to provide authentication credentials.
* Use the DefaultAzureCredential class to programmatically use those credentials.
  
## Prerequisites  
  
- An Azure subscription
- [Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/) instance with appropriate access policies configured
- Node.js version LTS  

## Set up authentication

Before programmatically authenticating to Azure to use Azure Key Vault secrets, make sure you set up your environment. 

:::image type="content" source="https://raw.githubusercontent.com/Azure/azure-sdk-for-js/main/sdk/identity/identity/images/mermaidjs/DefaultAzureCredentialAuthFlow.svg" alt-text="Azure SDK for JavaScript credential flow.":::

#### [Developer authentication](#tab/developer-auth)

[!INCLUDE [Azure CLI Login with bash, powershell, and vscode](../../../includes/azure-cli-login.md)]

#### [Production authentication](#tab/production-auth)

Use the [DefaultAzureCredential](https://www.npmjs.com/package/@azure/identity#DefaultAzureCredential) in production based on the credential mechanisms.
---

## Install dependencies 

Install the Azure Key Vault secrets ([@azure/keyvault-secrets](https://www.npmjs.com/package/@azure/keyvault-secrets)) and Azure Identity ([@azure/identity](https://www.npmjs.com/package/@azure/identity)) npm packages by running the following command in your terminal:  

```bash
npm install @azure/keyvault-secrets @azure/identity
```

## Add JavaScript code to authenticate to Azure Key Vault programmatically

1. Import the necessary modules in your JavaScript file:  

    ```javascript
    const { DefaultAzureCredential } = require("@azure/identity");  
    const { SecretClient } = require("@azure/keyvault-secrets");  
    ```

2. Create an instance of the DefaultAzureCredential class:

    ```javascript
    const credential = new DefaultAzureCredential(); 
    ```

3. Create an instance of the SecretClient class and pass the credential object to it:

    ```javascript
    const vaultName = "<your-vault-name>";  
    const url = `https://${vaultName}.vault.azure.net`;  
    const client = new SecretClient(url, credential);  
    ```

## Next steps

* [Set a secret with JavaScript SDK](javascript-developer-guide-set-update-rotate-secret.md)
