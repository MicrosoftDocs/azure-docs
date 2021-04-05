---
title: Quickstart -  Azure Key Vault key client library for JavaScript (version 4)
description: Learn how to create, retrieve, and delete keys from an Azure key vault using the JavaScript client library
author: msmbaldwin
ms.author: mbaldwin
ms.date: 12/6/2020
ms.service: key-vault
ms.subservice: keys
ms.topic: quickstart
ms.custom: devx-track-js
---

# Quickstart: Azure Key Vault key client library for JavaScript (version 4)

Get started with the Azure Key Vault key client library for JavaScript. [Azure Key Vault](../general/overview.md) is a cloud service that provides a secure store for cryptographic keys. You can securely store keys, passwords, certificates, and other secrets. Azure key vaults may be created and managed through the Azure portal. In this quickstart, you learn how to create, retrieve, and delete keys from an Azure key vault using the JavaScript key client library

Key Vault client library resources:

[API reference documentation](/javascript/api/overview/azure/key-vault-index) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/keyvault) | [Package (npm)](https://www.npmjs.com/package/@azure/keyvault-keys)

For more information about Key Vault and keys, see:
- [Key Vault Overview](../general/overview.md)
- [Keys Overview](about-keys.md).

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Current [Node.js](https://nodejs.org) for your operating system.
- [Azure CLI](/cli/azure/install-azure-cli)
- A Key Vault - you can create one using [Azure portal](../general/quick-create-portal.md) [Azure CLI](../general/quick-create-cli.md), or [Azure PowerShell](../general/quick-create-powershell.md)

This quickstart assumes you are running [Azure CLI](/cli/azure/install-azure-cli).

## Sign in to Azure

1. Run the `login` command.

    ```azurecli-interactive
    az login
    ```

    If the CLI can open your default browser, it will do so and load an Azure sign-in page.

    Otherwise, open a browser page at [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter the
    authorization code displayed in your terminal.

2. Sign in with your account credentials in the browser.

## Create new Node.js application

Next, create a Node.js application that can be deployed to the Cloud. 

1. In a command shell, create a folder named `key-vault-node-app`:

```azurecli
mkdir key-vault-node-app
```

1. Change to the newly created *key-vault-node-app* directory, and run 'init' command to initialize node project:

```azurecli
cd key-vault-node-app
npm init -y
```

## Install Key Vault packages

From the console window, install the Azure Key Vault [keys library](https://www.npmjs.com/package/@azure/keyvault-keys) for Node.js.

```azurecli
npm install @azure/keyvault-keys
```

Install the [azure.identity](https://www.npmjs.com/package/@azure/identity) package to authenticate to a Key Vault

```azurecli
npm install @azure/identity
```

## Set environment variables

This application is using key vault name as an environment variable called `KEY_VAULT_NAME`.

Windows
```cmd
set KEY_VAULT_NAME=<your-key-vault-name>
````
Windows PowerShell
```powershell
$Env:KEY_VAULT_NAME="<your-key-vault-name>"
```

macOS or Linux
```cmd
export KEY_VAULT_NAME=<your-key-vault-name>
```

## Grant access to your key vault

Create an access policy for your key vault that grants key permissions to your user account

```azurecli
az keyvault set-policy --name <YourKeyVaultName> --upn user@domain.com --key-permissions delete get list create purge
```

## Code examples

The code samples below will show you how to create a client, set a key, retrieve a key, and delete a key. 

### Set up the app framework

1. Create new text file and save it as 'index.js'

1. Add require calls to load Azure and Node.js modules

1. Create the structure for the program, including basic exception handling

```javascript
const readline = require('readline');

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

async function main() {
    
}

main().then(() => console.log('Done')).catch((ex) => console.log(ex.message));
```

### Add directives

Add the following directives to the top of your code:

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { KeyClient } = require("@azure/keyvault-keys");
```

### Authenticate and create a client

In this quickstart, logged in user is used to authenticate to key vault, which is preferred method for local development. For applications deployed to Azure, managed identity should be assigned to App Service or Virtual Machine, for more information, see [Managed Identity Overview](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).

In below example, the name of your key vault is expanded to the key vault URI, in the format "https://\<your-key-vault-name\>.vault.azure.net". This example is using ['DefaultAzureCredential()'](https://docs.microsoft.com/javascript/api/@azure/identity/defaultazurecredential) class from [Azure Identity Library](https://docs.microsoft.com/javascript/api/overview/azure/identity-readme), which allows to use the same code across different environments with different options to provide identity. Fore more information about authenticating to key vault, see [Developer's Guide](https://docs.microsoft.com/azure/key-vault/general/developers-guide#authenticate-to-key-vault-in-code).

Add the following code to 'main()' function

```javascript
const keyVaultName = process.env["KEY_VAULT_NAME"];
const KVUri = "https://" + keyVaultName + ".vault.azure.net";

const credential = new DefaultAzureCredential();
const client = new KeyClient(KVUri, credential);
```

### Save a key

Now that your application is authenticated, you can put a key into your keyvault using the [createKey method](/javascript/api/@azure/keyvault-keys/keyclient?#createKey_string__KeyType__CreateKeyOptions_) The method's parameters accepts a key name and the [key type](https://docs.microsoft.com/javascript/api/@azure/keyvault-keys/keytype)

```javascript
await client.createKey(keyName, keyType);
```

### Retrieve a key

You can now retrieve the previously set value with the [getKey method](/javascript/api/@azure/keyvault-keys/keyclient?#getKey_string__GetKeyOptions_).

```javascript
const retrievedKey = await client.getKey(keyName);
 ```

### Delete a key

Finally, let's delete and purge the key from your key vault with the [beginDeleteKey](https://docs.microsoft.com/javascript/api/@azure/keyvault-keys/keyclient?#beginDeleteKey_string__BeginDeleteKeyOptions_) and [purgeDeletedKey](https://docs.microsoft.com/javascript/api/@azure/keyvault-keys/keyclient?#purgeDeletedKey_string__PurgeDeletedKeyOptions_) methods.

```javascript
const deletePoller = await client.beginDeleteKey(keyName);
await deletePoller.pollUntilDone();
await client.purgeDeletedKey(keyName);
```

## Sample code

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { KeyClient } = require("@azure/keyvault-keys");

const readline = require('readline');

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

async function main() {

  const keyVaultName = process.env["KEY_VAULT_NAME"];
  const KVUri = "https://" + keyVaultName + ".vault.azure.net";

  const credential = new DefaultAzureCredential();
  const client = new KeyClient(KVUri, credential);

  const keyName = "myKey";
  
  console.log("Creating a key in " + keyVaultName + " called '" + keyName + "` ...");
  await client.createKey(keyName, "RSA");

  console.log("Done.");

  console.log("Retrieving your key from " + keyVaultName + ".");

  const retrievedKey = await client.getKey(keyName);

  console.log("Your key version is '" + retrievedKey.properties.version + "'.");

  console.log("Deleting your key from " + keyVaultName + " ...");
  const deletePoller = await client.beginDeleteKey(keyName);
  await deletePoller.pollUntilDone();
  console.log("Done.");
  
  console.log("Purging your key from {keyVaultName} ...");
  await client.purgeDeletedKey(keyName);
  
}

main().then(() => console.log('Done')).catch((ex) => console.log(ex.message));

```

## Test and verify

Execute the following commands to run the app.

```azurecli
npm install
npm index.js
```

A variation of the following output appears:

```azurecli
Creating a key in <your-unique-keyvault-name> called 'myKey' ... done.
Retrieving your key from mykeyvault.
Your key version is '8532359bced24e4bb2525f2d2050738a'.
Deleting your key from <your-unique-keyvault-name> ... done.  
Purging your key from <your-unique-keyvault-name> ... done.   
```

## Next steps

In this quickstart, you created a key vault, stored a key, and retrieved that key. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- Read an [Overview of Azure Key Vault Keys](about-keys.md)
- How to [Secure access to a key vault](../general/security-overview.md)
- See the [Azure Key Vault developer's guide](../general/developers-guide.md)
- Review the [Key Vault security overview](../general/security-overview.md)
