---
title: Quickstart -  Azure Key Vault key client library for JavaScript (version 4)
description: Learn how to create, retrieve, and delete keys from an Azure key vault using the JavaScript client library
author: msmbaldwin
ms.author: mbaldwin
ms.date: 02/02/2023
ms.service: key-vault
ms.subservice: keys
ms.topic: quickstart
ms.devlang: javascript
ms.custom: devx-track-js, mode-api, passwordless-js
---

# Quickstart: Azure Key Vault key client library for JavaScript

Get started with the Azure Key Vault key client library for JavaScript. [Azure Key Vault](../general/overview.md) is a cloud service that provides a secure store for cryptographic keys. You can securely store keys, passwords, certificates, and other secrets. Azure key vaults may be created and managed through the Azure portal. In this quickstart, you learn how to create, retrieve, and delete keys from an Azure key vault using the JavaScript key client library

Key Vault client library resources:

[API reference documentation](/javascript/api/overview/azure/key-vault-index) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/keyvault) | [Package (npm)](https://www.npmjs.com/package/@azure/keyvault-keys)

For more information about Key Vault and keys, see:
- [Key Vault Overview](../general/overview.md)
- [Keys Overview](about-keys.md).

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Current [Node.js LTS](https://nodejs.org).
- [Azure CLI](/cli/azure/install-azure-cli)
- An existing Key Vault - you can create one using:
    - [Azure CLI](../general/quick-create-cli.md)
    - [Azure portal](../general/quick-create-portal.md) 
    - [Azure PowerShell](../general/quick-create-powershell.md)

This quickstart assumes you're running [Azure CLI](/cli/azure/install-azure-cli).

## Sign in to Azure

1. Run the `login` command.

    ```azurecli
    az login
    ```

    If the CLI can open your default browser, it will do so and load an Azure sign-in page.

    Otherwise, open a browser page at [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter the
    authorization code displayed in your terminal.

2. Sign in with your account credentials in the browser.

## Create new Node.js application

Create a Node.js application that uses your key vault. 

1. In a terminal, create a folder named `key-vault-node-app` and change into that folder:

    ```terminal
    mkdir key-vault-node-app && cd key-vault-node-app
    ```

1. Initialize the Node.js project:

    ```terminal
    npm init -y
    ```

## Install Key Vault packages

1. Using the terminal, install the Azure Key Vault secrets client library, [@azure/keyvault-keys](https://www.npmjs.com/package/@azure/keyvault-keys) for Node.js.

    ```terminal
    npm install @azure/keyvault-keys
    ```

1. Install the Azure Identity client library, [@azure/identity](https://www.npmjs.com/package/@azure/identity) package to authenticate to a Key Vault.

    ```terminal
    npm install @azure/identity
    ```


## Grant access to your key vault

Create an access policy for your key vault that grants key permissions to your user account

```azurecli
az keyvault set-policy --name <YourKeyVaultName> --upn user@domain.com --key-permissions delete get list create update purge
```

## Set environment variables

This application is using key vault name as an environment variable called `KEY_VAULT_NAME`.

### [Windows](#tab/windows)

```cmd
set KEY_VAULT_NAME=<your-key-vault-name>
````

### [PowerShell](#tab/powershell)

Windows PowerShell
```powershell
$Env:KEY_VAULT_NAME="<your-key-vault-name>"
```

### [macOS or Linux](#tab/linux)

```cmd
export KEY_VAULT_NAME=<your-key-vault-name>
```
---

## Authenticate and create a client

Application requests to most Azure services must be authorized. Using the [DefaultAzureCredential](/javascript/api/@azure/identity/#@azure-identity-getdefaultazurecredential) method provided by the [Azure Identity client library](/javascript/api/@azure/identity) is the recommended approach for implementing passwordless connections to Azure services in your code. `DefaultAzureCredential` supports multiple authentication methods and determines which method should be used at runtime. This approach enables your app to use different authentication methods in different environments (local vs. production) without implementing environment-specific code. 

In this quickstart, `DefaultAzureCredential` authenticates to key vault using the credentials of the local development user logged into the Azure CLI. When the application is deployed to Azure, the same `DefaultAzureCredential` code can automatically discover and use a managed identity that is assigned to an App Service, Virtual Machine, or other services. For more information, see [Managed Identity Overview](/azure/active-directory/managed-identities-azure-resources/overview).

In this code, the name of your key vault is used to create the key vault URI, in the format `https://<your-key-vault-name>.vault.azure.net`. For more information about authenticating to key vault, see [Developer's Guide](/azure/key-vault/general/developers-guide#authenticate-to-key-vault-in-code).

## Code example

The code samples below will show you how to create a client, set a secret, retrieve a secret, and delete a secret. 

This code uses the following [Key Vault Secret classes and methods](/javascript/api/overview/azure/keyvault-keys-readme):
    
* [DefaultAzureCredential class](/javascript/api/@azure/identity/#@azure-identity-getdefaultazurecredential)
* [KeyClient class](/javascript/api/@azure/keyvault-keys/keyclient)
    * [createKey](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-createkey)
    * [createEcKey](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-createeckey)
    * [createRsaKey](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-creatersakey)
    * [getKey](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-getkey)
    * [listPropertiesOfKeys](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-listpropertiesofkeys)
    * [updateKeyProperties](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-updatekeyproperties)
    * [beginDeleteKey](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-begindeletekey)
    * [getDeletedKey](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-getdeletedkey)
    * [purgeDeletedKey](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-purgedeletedkey)

### Set up the app framework

1. Create new text file and paste the following code into the **index.js** file.
    
    ```javascript
    const { KeyClient } = require("@azure/keyvault-keys");
    const { DefaultAzureCredential } = require("@azure/identity");
    
    async function main() {

        // DefaultAzureCredential expects the following three environment variables:
        // - AZURE_TENANT_ID: The tenant ID in Azure Active Directory
        // - AZURE_CLIENT_ID: The application (client) ID registered in the AAD tenant
        // - AZURE_CLIENT_SECRET: The client secret for the registered application
        const credential = new DefaultAzureCredential();
        
        const keyVaultName = process.env["KEY_VAULT_NAME"];
        if(!keyVaultName) throw new Error("KEY_VAULT_NAME is empty");
        const url = "https://" + keyVaultName + ".vault.azure.net";

        const client = new KeyClient(url, credential);
        
        const uniqueString = Date.now();
        const keyName = `sample-key-${uniqueString}`;
        const ecKeyName = `sample-ec-key-${uniqueString}`;
        const rsaKeyName = `sample-rsa-key-${uniqueString}`;
        
        // Create key using the general method
        const result = await client.createKey(keyName, "EC");
        console.log("key: ", result);
        
        // Create key using specialized key creation methods
        const ecResult = await client.createEcKey(ecKeyName, { curve: "P-256" });
        const rsaResult = await client.createRsaKey(rsaKeyName, { keySize: 2048 });
        console.log("Elliptic curve key: ", ecResult);
        console.log("RSA Key: ", rsaResult);
        
        // Get a specific key
        const key = await client.getKey(keyName);
        console.log("key: ", key);
        
        // Or list the keys we have
        for await (const keyProperties of client.listPropertiesOfKeys()) {
        const key = await client.getKey(keyProperties.name);
        console.log("key: ", key);
        }
        
        // Update the key
        const updatedKey = await client.updateKeyProperties(keyName, result.properties.version, {
        enabled: false
        });
        console.log("updated key: ", updatedKey);
            
        // Delete the key - the key is soft-deleted but not yet purged
        const deletePoller = await client.beginDeleteKey(keyName);
        await deletePoller.pollUntilDone();
        
        const deletedKey = await client.getDeletedKey(keyName);
        console.log("deleted key: ", deletedKey);
        
        // Purge the key - the key is permanently deleted
        // This operation could take some time to complete
        console.time("purge a single key");
        await client.purgeDeletedKey(keyName);
        console.timeEnd("purge a single key");
    }
    
    main().catch((error) => {
      console.error("An error occurred:", error);
      process.exit(1);
    });
    ```

## Run the sample application

1. Run the app:

    ```terminal
    node index.js
    ```

1. The create and get methods return a full JSON object for the key:

    ```JSON
    "key":  {
      "key": {
        "kid": "https://YOUR-KEY-VAULT-NAME.vault.azure.net/keys/YOUR-KEY-NAME/YOUR-KEY-VERSION",
        "kty": "YOUR-KEY-TYPE",
        "keyOps": [ ARRAY-OF-VALID-OPERATIONS ],
        ... other properties based on key type
      },
      "id": "https://YOUR-KEY-VAULT-NAME.vault.azure.net/keys/YOUR-KEY-NAME/YOUR-KEY-VERSION",
      "name": "YOUR-KEY-NAME",
      "keyOperations": [ ARRAY-OF-VALID-OPERATIONS ],
      "keyType": "YOUR-KEY-TYPE",
      "properties": {
        "tags": undefined,
        "enabled": true,
        "notBefore": undefined,
        "expiresOn": undefined,
        "createdOn": 2021-11-29T18:29:11.000Z,
        "updatedOn": 2021-11-29T18:29:11.000Z,
        "recoverableDays": 90,
        "recoveryLevel": "Recoverable+Purgeable",
        "exportable": undefined,
        "releasePolicy": undefined,
        "vaultUrl": "https://YOUR-KEY-VAULT-NAME.vault.azure.net",
        "version": "YOUR-KEY-VERSION",
        "name": "YOUR-KEY-VAULT-NAME",
        "managed": undefined,
        "id": "https://YOUR-KEY-VAULT-NAME.vault.azure.net/keys/YOUR-KEY-NAME/YOUR-KEY-VERSION"
      }
    }
    ```

## Integrating with App Configuration

The Azure SDK provides a helper method, [parseKeyVaultKeyIdentifier](/javascript/api/@azure/keyvault-keys#functions), to parse the given Key Vault Key ID. This is necessary if you use [App Configuration](../../azure-app-configuration/index.yml) references to Key Vault. App Config stores the Key Vault Key ID. You need the _parseKeyVaultKeyIdentifier_ method to parse that ID to get the key name. Once you have the key name, you can get the current key value using code from this quickstart.  

## Next steps

In this quickstart, you created a key vault, stored a key, and retrieved that key. To learn more about Key Vault and how to integrate it with your applications, continue on to these articles.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- Read an [Overview of Azure Key Vault Keys](about-keys.md)
- How to [Secure access to a key vault](../general/security-features.md)
- See the [Azure Key Vault developer's guide](../general/developers-guide.md)
- Review the [Key Vault security overview](../general/security-features.md)