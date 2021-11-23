---
title: Quickstart -  Azure Key Vault secret client library for JavaScript (version 4)
description: Learn how to create, retrieve, and delete secrets from an Azure key vault using the JavaScript client library
author: msmbaldwin
ms.author: mbaldwin
ms.date: 11/13/2021
ms.service: key-vault
ms.subservice: secrets
ms.topic: quickstart
ms.custom: devx-track-js
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

Next, create a Node.js application that can be deployed to the Cloud. 

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

## Create a Service principal

Create a service principal and configure its access to Azure resources. Use a service principal instead of your own individual user account and password.

1. Create the service principal with the Azure [az ad sp create-for-rbac](/cli/azure/ad/sp#az_ad_sp_create_for_rbac) command with the Azure CLI or [Cloud Shell](https://shell.azure.com). 

    ```bash
    az ad sp create-for-rbac --name YOUR-SERVICE-PRINCIPAL-NAME
    ```

2. Make note of the command response in order to set up your Azure authentication to the Azure SDK later in this quickstart:

    ```json
    {
      "appId": "YOUR-SERVICE-PRINCIPAL-ID",
      "displayName": "YOUR-SERVICE-PRINCIPAL-NAME",
      "name": "http://YOUR-SERVICE-PRINCIPAL-NAME",
      "password": "YOUR-SERVICE-PRINCIPAL-SECRET",
      "tenant": "YOUR-TENANT-ID"
    }
    ```

## Grant access to your key vault

Create an access policy for your key vault that grants secret permissions to your service principal with the [az keyvault set-policy](/cli/azure/keyvault#az_keyvault_set_policy) command.

```azurecli
az keyvault set-policy --name <your-key-vault-name> --spn <your-service-principal-id> --secret-permissions delete get list set purge
```

## Set environment variables

1. Collect the following required environment variables:

    |Name|Value|
    |AZURE_TENANT_ID|From the service principal result, YOUR-TENANT-ID.|
    |AZURE_CLIENT_ID|From the service principal result, YOUR-SERVICE-PRINCIPAL-ID|
    |AZURE_CLIENT_SECRET|From the service principal result, YOUR-SERVICE-PRINCIPAL-SECRET|
    |KEYVAULT_URI|https://YOUR-KEY-VAULT-NAME.vault.azure.net/|

1. Select your command and run it four times with the keys and settings. 

    # [Windows](#tab/env-windows)
    
    ```cmd
    set name=value
    ```
    # [Windows PowerShell](#tab/env-windows-powershell)
    
    ```powershell
    $Env:name="value"
    ```
    # [macOS or Linux](#tab/env-mac-linux)
    
    ```cmd
    export name=value
    ```
    
    ---

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
      // DefaultAzureCredential expects the following three environment variables:
      // - AZURE_TENANT_ID: The tenant ID in Azure Active Directory
      // - AZURE_CLIENT_ID: The application (client) ID registered in the AAD tenant
      // - AZURE_CLIENT_SECRET: The client secret for the registered application
      const credential = new DefaultAzureCredential();
    
      const url = process.env["KEYVAULT_URI"] || "<keyvault-url>";
    
      const client = new SecretClient(url, credential);
    
      // Create a secret
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

The Azure SDK provides a helper method, [parseKeyVaultSecretIdentifier](javascript/api/@azure/keyvault-secrets/#parseKeyVaultSecretIdentifier_string_), to parse the given Key Vault Secret ID. This is necessary if you use [App Configuration](/azure/azure-app-configuration/) references to Key Vault. App Config stores the Key Vault Secret ID. You need the _parseKeyVaultSecretIdentifier_ method to parse that ID to get the secret name. Once you have the secret name, you can get the current secret value using code from this quickstart.  

## Next steps

In this quickstart, you created a key vault, stored a secret, and retrieved that secret. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- Read an [Overview of Azure Key Vault Secrets](about-secrets.md)
- How to [Secure access to a key vault](../general/security-features.md)
- See the [Azure Key Vault developer's guide](../general/developers-guide.md)
- Review the [Key Vault security overview](../general/security-features.md)
