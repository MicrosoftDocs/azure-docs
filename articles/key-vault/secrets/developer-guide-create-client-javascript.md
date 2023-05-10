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
  
This documentation provides guidance on how to authenticate to Azure Key Vault SDK for JavaScript with DefaultAzureCredential. The `DefaultAzureCredential` class in the Azure SDK for JavaScript provides a way to authenticate to Azure services using various methods of authentication including environment variables, managed identities, and service principals.  
  
## Prerequisites  
  
- An Azure subscription  
- [Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/) instance  
- Node.js version LTS  

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

## Set up authentication

Before using this authentication code, make sure you set up your environment. 

#### [Developer authentication](#tab/developer-auth)

##### [Bash](#dev-auth/terminal-bash) 

A developer should install [Azure CLI](/cli/azure/install-azure-cli) and sign in interactively with the [az login](/cli/azure/authenticate-azure-cli#sign-in-interactively) command to log in to Azure before use the DefaultAzureCredential in code. 

```bash
az login
```

##### [PowerShell](#dev-auth/terminal-ps)

    To authenticate with Azure PowerShell users can run the Connect-AzAccount cmdlet. By default, ike the Azure CLI, Connect-AzAccount will launch the default web browser to authenticate a user account.
    
    ```powershell
    Connect-AzAccount
    ```

##### [Visual Studio Code](#dev-auth/vscode)

If you are using Visual Studio Code, you can also sign in to Azure with the [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account).

---

#### [Production authentication](#tab/production-auth)

To use the DefaultAzureCredential in production, learn more about [environment variable setup](https://www.npmjs.com/package/@azure/identity#environment-variables).

---
 
