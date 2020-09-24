---
title: Quickstart -  Azure Key Vault client library for Node.js (v4)
description: Learn how to create, retrieve, and delete secrets from an Azure key vault using the Node.js client library
author: msmbaldwin
ms.author: mbaldwin
ms.date: 10/20/2019
ms.service: key-vault
ms.subservice: secrets
ms.topic: quickstart
ms.custom: devx-track-js
---

# Quickstart: Azure Key Vault client library for Node.js (v4)

Get started with the Azure Key Vault client library for Node.js. Follow the steps below to install the package and try out example code for basic tasks.

Azure Key Vault helps safeguard cryptographic keys and secrets used by cloud applications and services. Use the Key Vault client library for Node.js to:

- Increase security and control over keys and passwords.
- Create and import encryption keys in minutes.
- Reduce latency with cloud scale and global redundancy.
- Simplify and automate tasks for TLS/SSL certificates.
- Use FIPS 140-2 Level 2 validated HSMs.

[API reference documentation](https://docs.microsoft.com/javascript/api/overview/azure/key-vault-index?view=azure-node-latest) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/keyvault) | [Package (npm)](https://www.npmjs.com/package/@azure/keyvault-secrets)

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Current [Node.js](https://nodejs.org) for your operating system.
- [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest) or [Azure PowerShell](/powershell/azure/)

This quickstart assumes you are running [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest) in a Linux terminal window.

## Setting up

### Install the package

From the console window, install the Azure Key Vault secrets library for Node.js.

```console
npm install @azure/keyvault-secrets
```

For this quickstart, you will need to install the azure.identity package as well:

```console
npm install @azure/identity
```

### Create a resource group and key vault

[!INCLUDE [Create a resource group and key vault](../../../includes/key-vault-rg-kv-creation.md)]

### Create a service principal

[!INCLUDE [Create a service principal](../../../includes/key-vault-sp-creation.md)]

#### Give the service principal access to your key vault

[!INCLUDE [Give the service principal access to your key vault](../../../includes/key-vault-sp-kv-access.md)]

#### Set environmental variables

[!INCLUDE [Set environmental variables](../../../includes/key-vault-set-environmental-variables.md)]

## Object model

The Azure Key Vault client library for Node.js allows you to manage keys and related assets such as certificates and secrets. The code samples below will show you how to create a client, set a secret, retrieve a secret, and delete a secret.

The entire console app is available at https://github.com/Azure-Samples/key-vault-dotnet-core-quickstart/tree/master/key-vault-console-app.

## Code examples

### Add directives

Add the following directives to the top of your code:

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");
```

### Authenticate and create a client

Authenticating to your key vault and creating a key vault client depends on the environmental variables from the [Set environmental variables](#set-environmental-variables) step above, and the [SecretClient constructor](/javascript/api/@azure/keyvault-secrets/secretclient?view=azure-node-latest#secretclient-string--tokencredential--pipelineoptions-). 

The name of your key vault is expanded to the key vault URI, in the format `https://<your-key-vault-name>.vault.azure.net`. 

```javascript
const keyVaultName = process.env["KEY_VAULT_NAME"];
const KVUri = "https://" + keyVaultName + ".vault.azure.net";

const credential = new DefaultAzureCredential();
const client = new SecretClient(KVUri, credential);
```

### Save a secret

Now that your application is authenticated, you can put a secret into your keyvault using the [client.setSecret method](/javascript/api/@azure/keyvault-secrets/secretclient?view=azure-node-latest#setsecret-string--string--setsecretoptions-) This requires a name for the secret -- we're using "mySecret" in this sample.  

```javascript
await client.setSecret(secretName, secretValue);
```

You can verify that the secret has been set with the [az keyvault secret show](/cli/azure/keyvault/secret?view=azure-cli-latest#az-keyvault-secret-show) command:

```azurecli
az keyvault secret show --vault-name <your-unique-keyvault-name> --name mySecret
```

### Retrieve a secret

You can now retrieve the previously set value with the [client.getSecret method](/javascript/api/@azure/keyvault-secrets/secretclient?view=azure-node-latest#getsecret-string--getsecretoptions-).

```javascript
const retrievedSecret = await client.getSecret(secretName);
 ```

Your secret is now saved as `retrievedSecret.value`.

### Delete a secret

Finally, let's delete the secret from your key vault with the [client.beginDeleteSecret method](/javascript/api/@azure/keyvault-secrets/secretclient?view=azure-node-latest#begindeletesecret-string--begindeletesecretoptions-).

```javascript
await client.beginDeleteSecret(secretName)
```

You can verify that the secret is gone with the [az keyvault secret show](/cli/azure/keyvault/secret?view=azure-cli-latest#az-keyvault-secret-show) command:

```azurecli
az keyvault secret show --vault-name <your-unique-keyvault-name> --name mySecret
```

## Clean up resources

When no longer needed, you can use the Azure CLI or Azure PowerShell to remove your key vault and the corresponding  resource group.

```azurecli
az group delete -g "myResourceGroup"
```

```azurepowershell
Remove-AzResourceGroup -Name "myResourceGroup"
```

## Sample code

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

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
  const client = new SecretClient(KVUri, credential);

  const secretName = "mySecret";
  var secretValue = await askQuestion("Input the value of your secret > ");

  console.log("Creating a secret in " + keyVaultName + " called '" + secretName + "' with the value '" + secretValue + "` ...");
  await client.setSecret(secretName, secretValue);

  console.log("Done.");

  console.log("Forgetting your secret.");
  secretValue = "";
  console.log("Your secret is '" + secretValue + "'.");

  console.log("Retrieving your secret from " + keyVaultName + ".");

  const retrievedSecret = await client.getSecret(secretName);

  console.log("Your secret is '" + retrievedSecret.value + "'.");
  console.log("Deleting your secret from " + keyVaultName + " ...");

  await client.beginDeleteSecret(secretName);

  console.log("Done.");

}

main()

```

## Next steps

In this quickstart you created a key vault, stored a secret, and retrieved that secret. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- See the [Azure Key Vault developer's guide](../general/developers-guide.md)
- Review [Azure Key Vault best practices](../general/best-practices.md)