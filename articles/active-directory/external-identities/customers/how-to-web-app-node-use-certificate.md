---
title: Use client certificate for authentication in your Node.js web app
description: Learn how to use client certificate instead of secrets for authentication in your Node.js web app
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/22/2023
ms.custom: developer, devx-track-js
#Customer intent: As a dev, devops, I want to learn Learn how to use client certificate instead of secrets for authentication in my Node.js web app
---

# Use client certificate for authentication in your Node.js web app

Azure Active Directory (Azure AD) for customers supports two types of authentication for [confidential client applications](../../../active-directory/develop/msal-client-applications.md); password-based authentication (such as client secret) and certificate-based authentication. For a higher level of security, we recommend using a certificate (instead of a client secret) as a credential in your confidential client applications.

In production, you should purchase a certificate signed by a well-known certificate authority, and use [Azure Key Vault](https://azure.microsoft.com/products/key-vault/) to manage certificate access and lifetime for you. However, for testing purposes, you can create a self-signed certificate and configure your apps to authenticate with it.

In this article, you learn to generate a self-signed certificate by using [Azure Key Vault](https://azure.microsoft.com/products/key-vault/) on the Azure portal, OpenSSL or Windows PowerShell.  

When needed, you can also create a self-signed certificate programmatically by using [.NET](/azure/key-vault/certificates/quick-create-net), [Node.js](/azure/key-vault/certificates/quick-create-node), [Go](/azure/key-vault/certificates/quick-create-go), [Python](/azure/key-vault/certificates/quick-create-python) or [Java](/azure/key-vault/certificates/quick-create-java) client libraries.

## Prerequisites

- [Node.js](https://nodejs.org).

- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

- Azure AD for customers tenant. If you don't already have one, <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">sign up for a free trial</a>. 

- [OpenSSL](https://wiki.openssl.org/index.php/Binaries) or you can easily install [OpenSSL](https://community.chocolatey.org/packages/openssl) in Windows via [Chocolatey](https://chocolatey.org/). 

- [Windows PowerShell](/powershell/scripting/windows-powershell/install/installing-windows-powershell) or Azure subscription. 

## Create a self-signed certificate

If you have an existing self-signed certificate in your local computer, you can skip this step, then proceed to [Upload certificate to your app registration](#upload-certificate-to-your-app-registration).

# [Azure Key Vault - via Azure portal](#tab/azure-key-vault)
You can use [Azure Key Vault](/azure/key-vault/certificates/quick-create-portal) to generate a self-signed certificate for your app. By using Azure Key Vault, you enjoy benefits, such as, assigning a partner Certificate Authority (CA) and automating certificate rotation.

If you have an existing self-signed certificate in Azure Key Vault, and you want to use it without downloading it, skip this step, then proceed to [Use a self-signed certificate directly from Azure Key Vault](#use-a-self-signed-certificate-directly-from-azure-key-vault). Otherwise, use the following steps to generate your certificate 

1. Follow the steps in [Set and retrieve a certificate from Azure Key Vault using the Azure portal](/azure/key-vault/certificates/quick-create-portal) to create and download your certificate.

1. After you create your certificate, download both the *.cer* file and the *.pfx* file such as *ciam-client-app-cert.cer* and  *ciam-client-app-cert.pfx*. The *.cer* file contains the public key and is what you upload to your Microsoft Entra admin center.

1. In your terminal, run the following command to extract the private key from the *.pfx* file. When prompted to type a pass phrase, just press **Enter** key you if you don't want to set one. Otherwise type a pass phrase of your choice: 

    ```console
    openssl pkcs12 -in ciam-client-app-cert.pfx -nocerts -out ciam-client-app-cert.key
    ```
    
    The *ciam-client-app-cert.key* file is what you use in your app.
    

# [Windows PowerShell](#tab/windows-powershell)

1. Use the steps in [Create a self-signed public certificate to authenticate your application](/azure/active-directory/develop/howto-create-self-signed-certificate). Make sure you export your public certificate with its private key. For the `certificateName`, use *ciam-client-app-cert*. 

1. In your terminal, run the following command to extract the private key from the *.pfx* file. When prompted to type in your pass phrase, type a pass phrase of your choice: 

    ```console
    openssl pkcs12 -in ciam-client-app-cert.pfx -nocerts -out ciam-client-app-cert.key
    ```
After you complete these steps, you should have a *.cer* file and the *.key* file, such as *ciam-client-app-cert.key* and *ciam-client-app-cert.cer*. The *.key* file is what you use in your app. The *.cer* file is what you upload to your Microsoft Entra admin center. 



# [OpenSSL](#tab/openssl)

In your terminal, run the following command. When prompted to type in your pass phrase, type a pass phrase of your choice: 

```console
openssl req -x509 -newkey rsa:2048 -keyout ciam-client-app-cert.key -out ciam-client-app-cert.crt -subj "/CN=ciamclientappcert.com"
``` 

After the command finishes execution, you should have a *.crt* and a *.key* files, such as *ciam-client-app-cert.key* and *ciam-client-app-cert.crt*. The *.key* file is what you use in your app. The *.cer* file is what you upload to your Microsoft Entra admin center. 

--- 

## Upload certificate to your app registration

[!INCLUDE [active-directory-customers-app-integration-add-user-flow](./includes/register-app/add-client-app-certificate.md)]

## Configure your Node.js app to use certificate

Once you associate your app registration with the certificate, you need to update your app code to start using the certificate:

1. Locate the file that contains your MSAL configuration object, such as `msalConfig`  in *authConfig.js*, then update it to look similar to the following code:

    ```javascript
    require('dotenv').config();
    const fs = require('fs'); //// import the fs module for reading the key file
    const crypto = require('crypto');
    const TENANT_SUBDOMAIN = process.env.TENANT_SUBDOMAIN || 'Enter_the_Tenant_Subdomain_Here';
    const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/auth/redirect';
    const POST_LOGOUT_REDIRECT_URI = process.env.POST_LOGOUT_REDIRECT_URI || 'http://localhost:3000';
    
    const privateKeySource = fs.readFileSync('PATH_TO_YOUR_PRIVATE_KEY_FILE')
    
    const privateKeyObject = crypto.createPrivateKey({
        key: privateKeySource,
        passphrase: 'Add_Passphrase_Here',
        format: 'pem'
    });
    
    const privateKey = privateKeyObject.export({
        format: 'pem',
        type: 'pkcs8'
    });
    
    /**
     * Configuration object to be passed to MSAL instance on creation.
     * For a full list of MSAL Node configuration parameters, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
     */
        const msalConfig = {
            auth: {
                clientId: process.env.CLIENT_ID || 'Enter_the_Application_Id_Here', // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
                authority: process.env.AUTHORITY || `https://${TENANT_SUBDOMAIN}.ciamlogin.com/`, 
                //clientSecret: process.env.CLIENT_SECRET || 'Enter_the_Client_Secret_Here', // Client secret generated from the app registration in Azure portal
                clientCertificate: {
                    thumbprint: "YOUR_CERT_THUMBPRINT", // replace with thumbprint obtained during step 2 above
                    privateKey: privateKey
                }
            },
            //... Rest of code in the msalConfig object
        };
    
    module.exports = {
        msalConfig,
        REDIRECT_URI,
        POST_LOGOUT_REDIRECT_URI,
        TENANT_SUBDOMAIN
    };
    ```   
    In your code, replace the placeholders: 
    
    - `Add_Passphrase_Here` with the pass phrase you used to encrypt your private key.
    
    - `YOUR_CERT_THUMBPRINT` with the **Thumbprint** value you recorded earlier.
    
    - `PATH_TO_YOUR_PRIVATE_KEY_FILE` with the file path to your private key file. 
    
    -  `Enter_the_Application_Id_Here` with the Application (client) ID of the app you registered earlier.
    
    - `Enter_the_Tenant_Subdomain_Here` and replace it with the Directory (tenant) subdomain. For example, if your tenant primary domain is `contoso.onmicrosoft.com`, use `contoso`. If you don't have your tenant name, learn how to [read your tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details).

    We encrypted the key (we recommend that you do so), so we have to decrypt it before we pass it to MSAL configuration object.

    ```javascript
    //...
    const privateKeyObject = crypto.createPrivateKey({
        key: privateKeySource,
        passphrase: 'Add_Passphrase_Here',
        format: 'pem'
    });
    
    const privateKey = privateKeyObject.export({
        format: 'pem',
        type: 'pkcs8'
    });
    //...
    ```
1. Use the steps in [Run and test the web app](tutorial-web-app-node-sign-in-sign-out.md#run-and-test-the-web-app) to test your app.

## Use a self-signed certificate directly from Azure Key Vault

You can use your existing certificate directly from Azure Key Vault:

1. Locate the file that contains your MSAL configuration object, such as `msalConfig`  in *authConfig.js*, then comment the `clientSecret` property:
    
    ```java
    const msalConfig = {
        auth: {
            clientId: process.env.CLIENT_ID || 'Enter_the_Application_Id_Here', // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
            authority: process.env.AUTHORITY || `https://${TENANT_SUBDOMAIN}.ciamlogin.com/`, 
            //clientSecret: process.env.CLIENT_SECRET || 'Enter_the_Client_Secret_Here', // Client secret generated from the app registration in Azure portal
        },
        //...
    };
    ```

1. Install [Azure CLI](/cli/azure/install-azure-cli), then on your console, type the following command to sign-in:


    ```console
    az login --tenant YOUR_TENANT_ID
    ```
    Replace the placeholder `YOUR_TENANT_ID` with the Directory (tenant) ID you copied earlier.

1. On your console, type the following command to install the required packages:  

    ```console
    npm install --save @azure/identity @azure/keyvault-certificates @azure/keyvault-secrets
    ```

1. In your client app, use the following code to generate `thumbprint` and `privateKey`;

    ```javascript
    const identity = require("@azure/identity");
    const keyvaultCert = require("@azure/keyvault-certificates");
    const keyvaultSecret = require('@azure/keyvault-secrets');

    const KV_URL = process.env["KEY_VAULT_URL"] || "ENTER_YOUR_KEY_VAULT_URL"
    const CERTIFICATE_NAME = process.env["CERTIFICATE_NAME"] || "ENTER_THE_NAME_OF_YOUR_CERTIFICATE_ON_KEY_VAULT";

    // Initialize Azure SDKs
    const credential = new identity.DefaultAzureCredential();
    const certClient = new keyvaultCert.CertificateClient(KV_URL, credential);
    const secretClient = new keyvaultSecret.SecretClient(KV_URL, credential);

    async function getKeyAndThumbprint() {

        // Grab the certificate thumbprint
        const certResponse = await certClient.getCertificate(CERTIFICATE_NAME).catch(err => console.log(err));
        const thumbprint = certResponse.properties.x509Thumbprint.toString('hex')

        // When you upload a certificate to Key Vault, a secret containing your private key is automatically created
        const secretResponse = await secretClient.getSecret(CERTIFICATE_NAME).catch(err => console.log(err));;

        // secretResponse contains both public and private key, but we only need the private key
        const privateKey = secretResponse.value.split('-----BEGIN CERTIFICATE-----\n')[0]
    }

    getKeyAndThumbprint();        
    ```
     
    In your code, replace the placeholders:

    - `ENTER_YOUR_KEY_VAULT_URL` with your Azure Key Vault URL.
     
    - `ENTER_THE_NAME_OF_YOUR_CERTIFICATE_ON_KEY_VAULT` with the name of your certificate in Azure Key Vault.
    
1. Use the `thumbprint` and `privateKey` values to update your configuration: 

    ```javascript
    let clientCert = {
        thumbprint: thumbprint, 
        privateKey: privateKey,
    };

    msalConfig.auth.clientCertificate = clientCert; //For this to work, you can't declares your msalConfig using const modifier 
    ```  

1. Then proceed to instantiate your confidential client as shown in the `getMsalInstance` method:

    ```javascript
    class AuthProvider {
        //...
        getMsalInstance(msalConfig) {
            return new msal.ConfidentialClientApplication(msalConfig);
        }
        //...
    }
    ``` 

1. Use the steps in [Run and test the web app](tutorial-web-app-node-sign-in-sign-out.md#run-and-test-the-web-app) to test your app.

## Next steps

Learn how to:

- [Sign in users and call an API in your own Node.js web application](how-to-web-app-node-sign-in-call-api-overview.md).
