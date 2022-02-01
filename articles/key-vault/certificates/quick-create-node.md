---
title: Quickstart -  Azure Key Vault certificate client library for JavaScript (version 4)
description: Learn how to create, retrieve, and delete certificates from an Azure key vault using the JavaScript client library
author: msmbaldwin
ms.author: mbaldwin
ms.date: 12/13/2021
ms.service: key-vault
ms.subservice: certificates
ms.topic: quickstart
ms.devlang: javascript
ms.custom: devx-track-js, mode-api
---

# Quickstart: Azure Key Vault certificate client library for JavaScript (version 4)

Get started with the Azure Key Vault certificate client library for JavaScript. [Azure Key Vault](../general/overview.md) is a cloud service that provides a secure store for certificates. You can securely store keys, passwords, certificates, and other secrets. Azure key vaults may be created and managed through the Azure portal. In this quickstart, you learn how to create, retrieve, and delete certificates from an Azure key vault using the JavaScript client library

Key Vault client library resources:

[API reference documentation](/javascript/api/overview/azure/key-vault-index) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/keyvault) | [Package (npm)](https://www.npmjs.com/package/@azure/keyvault-certificates)

For more information about Key Vault and certificates, see:
- [Key Vault Overview](../general/overview.md)
- [Certificates Overview](about-certificates.md)

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


1. Using the terminal, install the Azure Key Vault secrets library, [@azure/keyvault-certificates](https://www.npmjs.com/package/@azure/keyvault-certificates) for Node.js.

    ```terminal
    npm install @azure/keyvault-certificates
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

The code samples below will show you how to create a client, set a certificate, retrieve a certificate, and delete a certificate. 

### Set up the app framework

1. Create new text file and paste the following code into the **index.js** file. 

    ```javascript
    const { CertificateClient, DefaultCertificatePolicy } = require("@azure/keyvault-certificates");
    const { DefaultAzureCredential } = require("@azure/identity");
    
    async function main() {
      // If you're using MSI, DefaultAzureCredential should "just work".
      // Otherwise, DefaultAzureCredential expects the following three environment variables:
      // - AZURE_TENANT_ID: The tenant ID in Azure Active Directory
      // - AZURE_CLIENT_ID: The application (client) ID registered in the AAD tenant
      // - AZURE_CLIENT_SECRET: The client secret for the registered application
      const url = process.env["AZURE_KEY_VAULT_URI"] || "<keyvault-url>";
      const credential = new DefaultAzureCredential();

      const keyVaultName = process.env["KEY_VAULT_NAME"];
      const url = "https://" + keyVaultName + ".vault.azure.net";
    
      const client = new CertificateClient(url, credential);
    
      const uniqueString = new Date().getTime();
      const certificateName = `cert${uniqueString}`;
    
      // Creating a self-signed certificate
      const createPoller = await client.beginCreateCertificate(
        certificateName,
        DefaultCertificatePolicy
      );
    
      const pendingCertificate = createPoller.getResult();
      console.log("Certificate: ", pendingCertificate);
    
      // To read a certificate with their policy:
      let certificateWithPolicy = await client.getCertificate(certificateName);
      // Note: It will always read the latest version of the certificate.
    
      console.log("Certificate with policy:", certificateWithPolicy);
    
      // To read a certificate from a specific version:
      const certificateFromVersion = await client.getCertificateVersion(
        certificateName,
        certificateWithPolicy.properties.version
      );
      // Note: It will not retrieve the certificate's policy.
      console.log("Certificate from a specific version:", certificateFromVersion);
    
      const updatedCertificate = await client.updateCertificateProperties(certificateName, "", {
        tags: {
          customTag: "value"
        }
      });
      console.log("Updated certificate:", updatedCertificate);
    
      // Updating the certificate's policy:
      await client.updateCertificatePolicy(certificateName, {
        issuerName: "Self",
        subject: "cn=MyOtherCert"
      });
      certificateWithPolicy = await client.getCertificate(certificateName);
      console.log("updatedCertificate certificate's policy:", certificateWithPolicy.policy);
    
      // delete certificate
      const deletePoller = await client.beginDeleteCertificate(certificateName);
      const deletedCertificate = await deletePoller.pollUntilDone();
      console.log("Recovery Id: ", deletedCertificate.recoveryId);
      console.log("Deleted Date: ", deletedCertificate.deletedOn);
      console.log("Scheduled Purge Date: ", deletedCertificate.scheduledPurgeDate);
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

1. The create and get methods return a full JSON object for the certificate:

    ```JSON
    {
      "keyId": undefined,
      "secretId": undefined,
      "name": "YOUR-CERTIFICATE-NAME",
        "reuseKey": false,
        "keyCurveName": undefined,
        "exportable": true,
        "issuerName": 'Self',
        "certificateType": undefined,
        "certificateTransparency": undefined
      },
      "properties": {
        "createdOn": 2021-11-29T20:17:45.000Z,
        "updatedOn": 2021-11-29T20:17:45.000Z,
        "expiresOn": 2022-11-29T20:17:45.000Z,
        "id": "https://YOUR-KEY-VAULT-NAME.vault.azure.net/certificates/YOUR-CERTIFICATE-NAME/YOUR-CERTIFICATE-VERSION",
        "enabled": false,
        "notBefore": 2021-11-29T20:07:45.000Z,
        "recoveryLevel": "Recoverable+Purgeable",
        "name": "YOUR-CERTIFICATE-NAME",
        "vaultUrl": "https://YOUR-KEY-VAULT-NAME.vault.azure.net",
        "version": "YOUR-CERTIFICATE-VERSION",
        "tags": undefined,
        "x509Thumbprint": undefined,
        "recoverableDays": 90
      }
    }
    ```


## Integrating with App Configuration

The Azure SDK provides a helper method, [parseKeyVaultCertificateIdentifier](/javascript/api/@azure/keyvault-certificates#parseKeyVaultCertificateIdentifier_string_), to parse the given Key Vault certificate ID. This is necessary if you use [App Configuration](../../azure-app-configuration/index.yml) references to Key Vault. App Config stores the Key Vault certificate ID. You need the _parseKeyVaultCertificateIdentifier_ method to parse that ID to get the certificate name. Once you have the certificate name, you can get the current certificate using code from this quickstart. 

## Next steps

In this quickstart, you created a key vault, stored a certificate, and retrieved that certificate. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- Read an [Overview of certificates](about-certificates.md)
- See an [Access Key Vault from App Service Application Tutorial](../general/tutorial-net-create-vault-azure-web-app.md)
- See an [Access Key Vault from Virtual Machine Tutorial](../general/tutorial-net-virtual-machine.md)
- See the [Azure Key Vault developer's guide](../general/developers-guide.md)
- Review the [Key Vault security overview](../general/security-features.md)