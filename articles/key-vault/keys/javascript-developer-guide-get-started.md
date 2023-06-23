---
title: Getting started with Azure Key Vault key in JavaScript
description: Set up your environment, install npm packages, and authenticate to Azure to get started using Key Vault keys in JavaScript
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: keys
ms.topic: how-to
ms.custom: devx-track-js
ms.date: 05/22/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to know the high level steps necessary to use Key Vault keys in JavaScript.
---
# Get started with Azure Key Vault keys in JavaScript
  
This article shows you how to connect to Azure Key Vault by using the Azure Key Vault keys client library for JavaScript. Once connected, your code can operate on keys in the vault. 

[API reference](/javascript/api/overview/azure/keyvault-keys-readme) | [Package (npm)](https://www.npmjs.com/package/@azure/keyvault-keys) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/keyvault/keyvault-keys) | [Samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/keyvault/keyvault-keys/samples/v4) | [Give feedback](https://github.com/Azure/azure-sdk-for-js/issues)
  
## Prerequisites  
  
- An Azure subscription - [create one for free](https://azure.microsoft.com/free).
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

1. Install the Azure Key Vault keys client library for JavaScript:

    ```bash
    npm install @azure/keyvault-keys
    ```

1. If you want to use passwordless connections using Azure AD, install the Azure Identity client library for JavaScript:

    ```bash
    npm install @azure/identity
    ```

## Authorize access and connect to Key Vault

Azure Active Directory (Azure AD) provides the most secure connection by managing the connection identity ([**managed identity**](../../active-directory/managed-identities-azure-resources/overview.md)). This **passwordless** functionality allows you to develop an application that doesn't require any keys stored in the code.

Before programmatically authenticating to Azure to use Azure Key Vault keys, make sure you set up your environment. 

:::image type="content" source="../media/authentication/DefaultAzureCredentialAuthFlow.svg" alt-text="Diagram of Azure SDK for JavaScript credential flow.":::

#### [Developer authentication](#tab/developer-auth)

[!INCLUDE [Azure CLI Login with bash, powershell, and vscode](../../../includes/azure-cli-login.md)]

#### [Production authentication](#tab/production-auth)

Use the [DefaultAzureCredential](https://www.npmjs.com/package/@azure/identity#DefaultAzureCredential) in production based on the credential mechanisms.

---

## Build your application

As you build your application, your code interacts with two types of resources:

- [**KeyVaultKey**](/javascript/api/@azure/keyvault-keys/keyvaultkey), which includes: 
    - ID, name, and value.
    - Allowed operations.
    - Type such as `EC`, `EC-HSM`, `RSA`, `RSA-HSM`, `oct`, `oct-HSM`.
    - Properties as KeyProperties
- [**KeyProperties**](/javascript/api/@azure/keyvault-keys/keyproperties), which include the keys's metadata, such as its name, version, tags, expiration data, and whether it's enabled.

If you need the value of the KeyVaultKey, use methods that return the [KeyVaultKey](/javascript/api/@azure/keyvault-keys/keyvaultkey):

* [getKey](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-getkey)

## Understand the clients

The Azure Key Vault keys client library for JavaScript includes the following clients:

* [KeyClient](/javascript/api/@azure/keyvault-keys/keyclient) allows you to create, rotate, backup, list and delete keys and their versions.
* [CryptographyClient](/javascript/api/@azure/keyvault-keys/cryptographyclient) allows you to encrypt, decrypt, sign, verify, wrap and unwrap keys. 

## Create a KeyClient object

The KeyClient object is the top object in the SDK. This client allows you to manipulate the keys.

Once your Azure Key Vault access roles and your local environment are set up, create a JavaScript file, which includes the [@azure/identity](https://www.npmjs.com/package/@azure/identity) package. Create a credential, such as the [DefaultAzureCredential](/javascript/api/overview/azure/identity-readme#defaultazurecredential), to implement passwordless connections to your vault. Use that credential to authenticate with a [KeyClient](/javascript/api/@azure/keyvault-keyss/keyclient) object.

```javascript
// Include required dependencies
import { DefaultAzureCredential } from '@azure/identity';  
import { KeyClient } from '@azure/keyvault-keys';  

// Authenticate to Azure
const credential = new DefaultAzureCredential(); 

// Create KeyClient
const vaultName = '<your-vault-name>';  
const url = `https://${vaultName}.vault.azure.net`;  
const client = new KeyClient(url, credential);  

// Get key
const key = await client.getKey("MyKeyName");
```

## Create a CryptographyClient object

The CryptographyClient object is the operational object in the SDK, using your key to perform actions. 

Once your Azure Key Vault access roles and your local environment are set up, create a JavaScript file, which includes the [@azure/identity](https://www.npmjs.com/package/@azure/identity) package. Create a credential, such as the [DefaultAzureCredential](/javascript/api/overview/azure/identity-readme#defaultazurecredential), to implement passwordless connections to your vault. Use that credential to authenticate with a [KeyClient](/javascript/api/@azure/keyvault-keyss/keyclient) object. Get a key from the vault using the KeyClient, then create a CryptographyClient to perform operations.

```javascript
// Include required dependencies
import { DefaultAzureCredential } from '@azure/identity';  
import {
  CryptographyClient,
  KeyClient,
  KnownEncryptionAlgorithms,
  RsaEncryptParameters
} from '@azure/keyvault-keys'; 

// Authenticate to Azure
const credential = new DefaultAzureCredential(); 

// Create KeyClient
const vaultName = '<your-vault-name>';  
const url = `https://${vaultName}.vault.azure.net`;  
const client = new KeyClient(url, credential);  

// Get key
const key = await client.getKey("MyKeyName");

if (key?.name) {

    // get encryption client
    const encryptClient = new CryptographyClient(key, credential);

    // encrypt data
    const encryptParams = { 
        algorithm: KnownEncryptionAlgorithms.RSAOaep256,
        plaintext: Buffer.from("Hello world!")
    }
    const encryptResult = await encryptClient.encrypt(encryptParams);
}
```

## See also

- [Package (npm)](https://www.npmjs.com/package/@azure/keyvault-keys)
- [Samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/keyvault/keyvault-keys/samples/v4)
- [API reference](/javascript/api/overview/azure/keyvault-keys-readme)
- [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/keyvault/keyvault-keys)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-js/issues)

## Next steps

* [Create a key](javascript-developer-guide-create-rotate-import-key.md)