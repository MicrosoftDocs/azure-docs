---
title: Getting started with Azure Key Vault secret in JavaScript
description: Set up your environment, install npm packages, and authenticate to Azure to get started using Key Vault secrets in JavaScript
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: secrets
ms.topic: how-to
ms.custom: devx-track-js, devx-track-azurecli
ms.date: 05/22/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to know the high level steps necessary to use Key Vault secrets in JavaScript.
---
# Get started with Azure Key Vault secrets in JavaScript
  
This article shows you how to connect to Azure Key Vault by using the Azure Key Vault secrets client library for JavaScript. Once connected, your code can operate on secrets and secret properties in the vault. 

[API reference](/javascript/api/overview/azure/keyvault-secrets-readme) | [Package (npm)](https://www.npmjs.com/package/@azure/keyvault-secrets) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/@azure/keyvault-secrets_4.7.0/sdk/keyvault/keyvault-secrets) | [Samples](https://github.com/Azure/azure-sdk-for-js/tree/@azure/keyvault-secrets_4.7.0/sdk/keyvault/keyvault-secrets/samples) | [Give feedback](https://github.com/Azure/azure-sdk-for-js/issues)
  
## Prerequisites  
  
- An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Azure Key Vault](../general/quick-create-cli.md) instance. Review [the access policies](../general/assign-access-policy.md) on your Key Vault to include the permissions necessary for the specific tasks performed in code.
- [Node.js version LTS](https://nodejs.org/)  

## Set up your project

1. Open a command prompt and change into your project folder. Change `YOUR-DIRECTORY` to your folder name:

    ```bash
    cd YOUR-DIRECTORY
    ```

1. If you don't have a `package.json` file already in your directory, initialize the project to create the file:

    ```bash
    npm init -y
    ```

1. Install the Azure Key Vault secrets client library for JavaScript:

    ```bash
    npm install @azure/keyvault-secrets
    ```

1. If you want to use passwordless connections using Microsoft Entra ID, install the Azure Identity client library for JavaScript:

    ```bash
    npm install @azure/identity
    ```

## Authorize access and connect to Key Vault

Microsoft Entra ID provides the most secure connection by managing the connection identity ([**managed identity**](../../active-directory/managed-identities-azure-resources/overview.md)). This **passwordless** functionality allows you to develop an application that doesn't require any secrets (keys or connection strings) stored in the code.

Before programmatically authenticating to Azure to use Azure Key Vault secrets, make sure you set up your environment. 

:::image type="content" source="../media/authentication/DefaultAzureCredentialAuthFlow.svg" alt-text="Diagram of Azure SDK for JavaScript credential flow.":::

#### [Developer authentication](#tab/developer-auth)

[!INCLUDE [Azure CLI Login with bash, powershell, and vscode](../../../includes/azure-cli-login.md)]

#### [Production authentication](#tab/production-auth)

Use the [DefaultAzureCredential](https://www.npmjs.com/package/@azure/identity#DefaultAzureCredential) in production based on the credential mechanisms.

---

## Build your application

As you build your application, your code interacts with two types of resources:

- [**KeyVaultSecret**](/javascript/api/@azure/keyvault-secrets/keyvaultsecret), which includes: 
    - Secret name, a string value. 
    - Secret value, which is a string of the secret. You provide the serialization and deserialization of the secret value into and out of a string as needed. 
    - Secret properties.
- [**SecretProperties**](/javascript/api/@azure/keyvault-secrets/secretproperties), which include the secret's metadata, such as its name, version, tags, expiration data, and whether it's enabled.

If you need the value of the KeyVaultSecret, use methods that return the [KeyVaultSecret](/javascript/api/@azure/keyvault-secrets/keyvaultsecret):

* [getSecret](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-getsecret)
* [setSecret](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-setsecret)

The rest of the methods return the SecretProperties object or another form of the properties such as:

* [DeletedSecret](/javascript/api/@azure/keyvault-secrets/deletedsecret) properties

## Create a SecretClient object

The SecretClient object is the top object in the SDK. This client allows you to manipulate the secrets.

Once your Azure Key Vault access roles and your local environment are set up, create a JavaScript file, which includes the [@azure/identity](https://www.npmjs.com/package/@azure/identity) package. Create a credential, such as the [DefaultAzureCredential](/javascript/api/overview/azure/identity-readme#defaultazurecredential), to implement passwordless connections to your vault. Use that credential to authenticate with a [SecretClient](/javascript/api/@azure/keyvault-secrets/secretclient) object.

```javascript
// Include required dependencies
import { DefaultAzureCredential } from '@azure/identity';  
import { SecretClient } from '@azure/keyvault-secrets';  

// Authenticate to Azure
const credential = new DefaultAzureCredential(); 

// Create SecretClient
const vaultName = '<your-vault-name>';  
const url = `https://${vaultName}.vault.azure.net`;  
const client = new SecretClient(url, credential);  

// Get secret
const secret = await client.getSecret("MySecretName");
```

## See also

- [Package (npm)](https://www.npmjs.com/package/@azure/keyvault-secrets)
- [Samples](https://github.com/Azure/azure-sdk-for-js/tree/@azure/keyvault-secrets_4.7.0/sdk/keyvault/keyvault-secrets/samples)
- [API reference](/javascript/api/overview/azure/keyvault-secrets-readme)
- [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/@azure/keyvault-secrets_4.7.0/sdk/keyvault/keyvault-secrets)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-js/issues)

## Next steps

* [Add a secret](javascript-developer-guide-set-update-rotate-secret.md)
