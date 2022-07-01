---
title: Quickstart -  Azure Key Vault key client library for JavaScript (version 4)
description: Learn how to create, retrieve, and delete keys from an Azure key vault using the JavaScript client library
author: msmbaldwin
ms.author: mbaldwin
ms.date: 12/13/2021
ms.service: key-vault
ms.subservice: keys
ms.topic: quickstart
ms.devlang: javascript
ms.custom: devx-track-js, mode-api
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
- Current [Node.js LTS](https://nodejs.org).
- [Azure CLI](/cli/azure/install-azure-cli)
- An existing Key Vault - you can create one using:
    - [Azure CLI](../general/quick-create-cli.md)
    - [Azure portal](../general/quick-create-portal.md) 
    - [Azure PowerShell](../general/quick-create-powershell.md)

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

1. Using the terminal, install the Azure Key Vault secrets library, [@azure/keyvault-keys](https://www.npmjs.com/package/@azure/keyvault-keys) for Node.js.

    ```terminal
    npm install @azure/keyvault-keys
    ```

1. Install the Azure Identity library, [@azure/identity](https://www.npmjs.com/package/@azure/identity) package to authenticate to a Key Vault.

    ```terminal
    npm install @azure/identity
    ```


## Grant access to your key vault

Create an access policy for your key vault that grants key permissions to your user account

```azurecli
az keyvault set-policy --name <YourKeyVaultName> --upn user@domain.com --key-permissions delete get list create purge
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

## Code example

The code sample below will show you how to create a client, set a key, retrieve a key, and delete a key. 

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

In this quickstart, you created a key vault, stored a key, and retrieved that key. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- Read an [Overview of Azure Key Vault Keys](about-keys.md)
- How to [Secure access to a key vault](../general/security-features.md)
- See the [Azure Key Vault developer's guide](../general/developers-guide.md)
- Review the [Key Vault security overview](../general/security-features.md)