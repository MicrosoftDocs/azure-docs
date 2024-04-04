---
title: Quickstart -  Azure Key Vault certificate client library for JavaScript (version 4)
description: Learn how to create, retrieve, and delete certificates from an Azure key vault using the JavaScript client library
author: msmbaldwin
ms.author: mbaldwin
ms.date: 02/01/2023
ms.service: key-vault
ms.subservice: certificates
ms.topic: quickstart
ms.devlang: javascript
ms.custom: devx-track-js, mode-api, passwordless-js
---

# Quickstart: Azure Key Vault certificate client library for JavaScript

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


1. Using the terminal, install the Azure Key Vault secrets library, [@azure/keyvault-certificates](https://www.npmjs.com/package/@azure/keyvault-certificates) for Node.js.

    ```terminal
    npm install @azure/keyvault-certificates
    ```

1. Install the Azure Identity client library, [@azure/identity](https://www.npmjs.com/package/@azure/identity), to authenticate to a Key Vault.

    ```terminal
    npm install @azure/identity
    ```

## Grant access to your key vault

Create a vault access policy for your key vault that grants key permissions to your user account.

```azurecli
az keyvault set-policy --name <YourKeyVaultName> --upn user@domain.com --certificate-permissions delete get list create purge update
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

This code uses the following [Key Vault Certificate classes and methods](/javascript/api/overview/azure/keyvault-certificates-readme):
    
* [DefaultAzureCredential class](/javascript/api/@azure/identity/#@azure-identity-getdefaultazurecredential)
* [CertificateClient class](/javascript/api/@azure/keyvault-certificates/certificateclient)
    * [beginCreateCertificate](/javascript/api/@azure/keyvault-certificates/certificateclient#@azure-keyvault-certificates-certificateclient-begincreatecertificate)
    * [getCertificate](/javascript/api/@azure/keyvault-certificates/certificateclient#@azure-keyvault-certificates-certificateclient-getcertificate)
    * [getCertificateVersion](/javascript/api/@azure/keyvault-certificates/certificateclient#@azure-keyvault-certificates-certificateclient-getcertificateversion)
    * [updateCertificateProperties](/javascript/api/@azure/keyvault-certificates/certificateclient#@azure-keyvault-certificates-certificateclient-updatecertificateproperties)
    * [updateCertificatePolicy](/javascript/api/@azure/keyvault-certificates/certificateclient#@azure-keyvault-certificates-certificateclient-updatecertificateproperties)
    * [beginDeleteCertificate](/javascript/api/@azure/keyvault-certificates/certificateclient#@azure-keyvault-certificates-certificateclient-begindeletecertificate)
* [PollerLike interface](/javascript/api/@azure/core-lro/pollerlike)
    * [getResult](/javascript/api/@azure/core-lro/pollerlike#@azure-core-lro-pollerlike-getresult)


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
      const credential = new DefaultAzureCredential();

      const keyVaultName = process.env["KEY_VAULT_NAME"];
      if(!keyVaultName) throw new Error("KEY_VAULT_NAME is empty");
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

The Azure SDK provides a helper method, [parseKeyVaultCertificateIdentifier](/javascript/api/@azure/keyvault-certificates#parseKeyVaultCertificateIdentifier_string_), to parse the given Key Vault certificate ID, which is necessary if you use [App Configuration](../../azure-app-configuration/index.yml) references to Key Vault. App Config stores the Key Vault certificate ID. You need the _parseKeyVaultCertificateIdentifier_ method to parse that ID to get the certificate name. Once you have the certificate name, you can get the current certificate using code from this quickstart. 

## Next steps

In this quickstart, you created a key vault, stored a certificate, and retrieved that certificate. To learn more about Key Vault and how to integrate it with your applications, continue on to these articles.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- Read an [Overview of certificates](about-certificates.md)
- See an [Access Key Vault from App Service Application Tutorial](../general/tutorial-net-create-vault-azure-web-app.md)
- See an [Access Key Vault from Virtual Machine Tutorial](../general/tutorial-net-virtual-machine.md)
- See the [Azure Key Vault developer's guide](../general/developers-guide.md)
- Review the [Key Vault security overview](../general/security-features.md)
