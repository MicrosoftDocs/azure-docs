---
title: Quickstart -  Azure Key Vault secret client library for JavaScript (version 4)
description: Learn how to create, retrieve, and delete secrets from an Azure key vault using the JavaScript client library
author: msmbaldwin
ms.author: mbaldwin
ms.date: 02/03/2022
ms.service: key-vault
ms.subservice: secrets
ms.topic: quickstart
ms.devlang: javascript
ms.custom: devx-track-js, mode-api
---

# Quickstart: Azure Key Vault secret client library for JavaScript (version 4)

Get started with the Azure Key Vault secret client library for JavaScript. [Azure Key Vault](../general/overview.md) is a cloud service that provides a secure store for secrets. You can securely store keys, passwords, certificates, and other secrets. Azure key vaults may be created and managed through the Azure portal. In this quickstart, you learn how to create, retrieve, and delete secrets from an Azure key vault using the JavaScript client library

Key Vault client library resources:

[API reference documentation](/javascript/api/overview/azure/key-vault-index) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/keyvault) | [Package (npm)](https://www.npmjs.com/package/@azure/keyvault-secrets)

For more information about Key Vault and secrets, see:
- [Key Vault Overview](../general/overview.md)
- [Secrets Overview](about-secrets.md)

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

    Otherwise, open a browser page at [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter the authorization code displayed in your terminal.

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

1. Using the terminal, install the Azure Key Vault secrets library, [@azure/keyvault-secrets](https://www.npmjs.com/package/@azure/keyvault-secrets) for Node.js.

    ```terminal
    npm install @azure/keyvault-secrets
    ```

1. Install the Azure Identity library, [@azure/identity](https://www.npmjs.com/package/@azure/identity) package to authenticate to a Key Vault.

    ```terminal
    npm install @azure/identity
    ```

## Grant access to your key vault

Create an access policy for your key vault that grants secret permissions to your user account with the [az keyvault set-policy](/cli/azure/keyvault#az-keyvault-set-policy) command.

```azurecli
az keyvault set-policy --name <your-key-vault-name> --upn user@domain.com --secret-permissions delete get list set purge
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

The code samples below will show you how to create a client, set a secret, retrieve a secret, and delete a secret. 

1. Create new text file and paste the following code into the **index.js** file. 

    ```javascript
    const { SecretClient } = require("@azure/keyvault-secrets");
    const { DefaultAzureCredential } = require("@azure/identity");
    
    // Load the .env file if it exists
    const dotenv = require("dotenv");
    dotenv.config();
    
    async function main() {
      const credential = new DefaultAzureCredential();
    
      const keyVaultName = process.env["KEY_VAULT_NAME"];
      const url = "https://" + keyVaultName + ".vault.azure.net";
    
      const client = new SecretClient(url, credential);
    
      // Create a secret
      // The secret can be a string of any kind. For example,
      // a multiline text block such as an RSA private key with newline characters,
      // or a stringified JSON object, like `JSON.stringify({ mySecret: 'MySecretValue'})`.
      const uniqueString = new Date().getTime();
      const secretName = `secret${uniqueString}`;
      const result = await client.setSecret(secretName, "MySecretValue");
      console.log("result: ", result);
    
      // Read the secret we created
      const secret = await client.getSecret(secretName);
      console.log("secret: ", secret);
    
      // Update the secret with different attributes
      const updatedSecret = await client.updateSecretProperties(secretName, result.properties.version, {
        enabled: false
      });
      console.log("updated secret: ", updatedSecret);
    
      // Delete the secret
      // If we don't want to purge the secret later, we don't need to wait until this finishes
      await client.beginDeleteSecret(secretName);
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

1. The create and get methods return a full JSON object for the secret:

    ```JSON
    {
        "value": "MySecretValue",
        "name": "secret1637692472606",
        "properties": {
            "createdOn": "2021-11-23T18:34:33.000Z",
            "updatedOn": "2021-11-23T18:34:33.000Z",
            "enabled": true,
            "recoverableDays": 90,
            "recoveryLevel": "Recoverable+Purgeable",
            "id": "https: //YOUR-KEYVAULT-NAME.vault.azure.net/secrets/secret1637692472606/YOUR-VERSION",
            "vaultUrl": "https: //YOUR-KEYVAULT-NAME.vault.azure.net",
            "version": "YOUR-VERSION",
            "name": "secret1637692472606"
        }
    }
    ```

    The update method returns the **properties** name/values pairs:

    ```JSON
    "createdOn": "2021-11-23T18:34:33.000Z",
    "updatedOn": "2021-11-23T18:34:33.000Z",
    "enabled": true,
    "recoverableDays": 90,
    "recoveryLevel": "Recoverable+Purgeable",
    "id": "https: //YOUR-KEYVAULT-NAME.vault.azure.net/secrets/secret1637692472606/YOUR-VERSION",
    "vaultUrl": "https: //YOUR-KEYVAULT-NAME.vault.azure.net",
    "version": "YOUR-VERSION",
    "name": "secret1637692472606"
    ```

## Integrating with App Configuration

The Azure SDK provides a helper method, [parseKeyVaultSecretIdentifier](/javascript/api/@azure/keyvault-secrets/#parseKeyVaultSecretIdentifier_string_), to parse the given Key Vault Secret ID. This is necessary if you use [App Configuration](../../azure-app-configuration/index.yml) references to Key Vault. App Config stores the Key Vault Secret ID. You need the _parseKeyVaultSecretIdentifier_ method to parse that ID to get the secret name. Once you have the secret name, you can get the current secret value using code from this quickstart.  

## Next steps

In this quickstart, you created a key vault, stored a secret, and retrieved that secret. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- Read an [Overview of Azure Key Vault Secrets](about-secrets.md)
- How to [Secure access to a key vault](../general/security-features.md)
- See the [Azure Key Vault developer's guide](../general/developers-guide.md)
- Review the [Key Vault security overview](../general/security-features.md)
