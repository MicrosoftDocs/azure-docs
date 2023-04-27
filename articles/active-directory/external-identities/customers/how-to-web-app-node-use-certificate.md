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
ms.date: 05/05/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn Learn how to use client certificate instead of secrets for authentication in my Node.js web app
---

# Use client certificate for authentication in your Node.js web app

Microsoft identity supports two types of authentication for [confidential client applications](../../../active-directory/develop/msal-client-applications.md); password-based authentication (such as client secret) and certificate-based authentication. For a higher level of security, we recommend using a certificate (instead of a client secret) as a credential in your confidential client applications.

In production, you should purchase a certificate signed by a well-known certificate authority, and use [Azure Key Vault](https://azure.microsoft.com/products/key-vault/) to manage certificate access and lifetime for you. However, for testing purposes, you can create a self-signed certificate and configure your apps to authenticate with it.

In this article, you learn to generate a self-signed certificate by using [Azure Key Vault](https://azure.microsoft.com/products/key-vault/) on the Azure Portal.

You can also create a self-signed certificate programmatically by using [.NET](/key-vault/certificates/quick-create-net), [Node.js](/key-vault/certificates/quick-create-node), [Go](/key-vault/certificates/quick-create-go), [Python](/key-vault/certificates/quick-create-python) or [Java](/key-vault/certificates/quick-create-java) client libraries.

## Create a self-signed certificate

You can use [Azure Key Vault](/key-vault/certificates/quick-create-portal) to generate a self-signed certificate for your app. By using Azure Key Vault, you enjoy benefits, such as, assigning a partner Certificate Authority (CA) and automating certificate rotation.

Follow the steps in [Set and retrieve a certificate from Azure Key Vault using the Azure portal](/key-vault/certificates/quick-create-portal) to create and download your certificate.

If you've an existing self-signed certificate in you local machine, you can skip this step, then proceed to [Upload certificate to your app registration](#upload-certificate-to-your-app-registration).

If you've an existing self-signed certificate in Azure Key Vault, and you want to use it without downloading it, skip this step, then proceed to [Use a self-signed certificate directly from Azure Key Vault](#use-a-self-signed-certificate-directly-from-azure-key-vault). 

## Upload certificate to your app registration

[!INCLUDE [active-directory-customers-app-integration-add-user-flow](./includes/register-app/add-client-app-certificate.md)]

## Configure your Node.js app to use certificate

Once you associate your app registration with the certificate, you need to update your app code to start using the certificate:

1. Locate the file that contains your MSAL configuration object, such as `msalConfig`  in *authConfig.js*.
    
    ```java
        const msalConfig = {
            auth: {
                clientId: process.env.CLIENT_ID || 'Enter_the_Application_Id_Here', // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
                authority: process.env.AUTHORITY || `https://${TENANT_NAME}.ciamlogin.com/`, 
                clientSecret: process.env.CLIENT_SECRET || 'Enter_the_Client_Secret_Here', // Client secret generated from the app registration in Azure portal
            },
            //...
        };
    ```
1. Comment the the `clientSecret` property, then add the `clientCertificate` object similar to the following code:

    ```javascript
        const fs = require('fs'); //// import the fs module for reading the key file

        const msalConfig = {
            auth: {
                clientId: process.env.CLIENT_ID || 'Enter_the_Application_Id_Here', // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
                authority: process.env.AUTHORITY || `https://${TENANT_NAME}.ciamlogin.com/`, 
                //clientSecret: process.env.CLIENT_SECRET || 'Enter_the_Client_Secret_Here', // Client secret generated from the app registration in Azure portal
                clientCertificate: {
                    thumbprint: "YOUR_CERT_THUMBPRINT", // replace with thumbprint obtained during step 2 above
                    privateKey: fs.readFileSync('PATH_TO_YOUR_PRIVATE_KEY_FILE'), // such as, c:/Users/your-username/Desktop/ciam-client-app-cert.key
                }
            },
            //...
        };
    ```
    
    Make sure you import the file system (fs) module as you need it to read the certificate file. 

    In your code replace the placeholders: 

    - `YOUR_CERT_THUMBPRINT` with the **Thumbprint** value you recorder earlier.
    
    - `PATH_TO_YOUR_PRIVATE_KEY_FILE` with the file path to your certificate. 

1. Use the steps in [Run and test the web app](how-to-web-app-node-sign-in-sign-in-out.md#run-and-test-the-web-app) to test your app.

## Use a self-signed certificate directly from Azure Key Vault

You can use your existing certificate directly from Azure Key Vault:

1. Locate the file that contains your MSAL configuration object, such as `msalConfig`  in *authConfig.js*, then comment the the `clientSecret` property:
    
    ```java
        const msalConfig = {
            auth: {
                clientId: process.env.CLIENT_ID || 'Enter_the_Application_Id_Here', // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
                authority: process.env.AUTHORITY || `https://${TENANT_NAME}.ciamlogin.com/`, 
                //clientSecret: process.env.CLIENT_SECRET || 'Enter_the_Client_Secret_Here', // Client secret generated from the app registration in Azure portal
            },
            //...
        };
    ```

1. Install [Azure CLI](), then, on your console, type the following command to sign-in:


    ```console
        az login --tenant YOUR_TENANT_ID
    ```
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
     
    In your code replace the placeholders:

    - `ENTER_YOUR_KEY_VAULT_URL` with your Azure Key Vault URL.
     
    - `ENTER_THE_NAME_OF_YOUR_CERTIFICATE_ON_KEY_VAULT` with the name of your certificate in Azure Key Vault.
    
1. Use the `thumbprint` and `privateKey` values to update your configuration: 

    ```javascript
        let clientCert = {
            thumbprint: thumbprint, 
            privateKey: privateKey,
        };
    
        msalConfig.auth.clientCertificate = clientCert;
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

1. Use the steps in [Run and test the web app](how-to-web-app-node-sign-in-sign-in-out.md#run-and-test-the-web-app) to test your app.

## Next steps

Learn how to:

- [Sign in users and call an API in your own Node.js web application by using Microsoft Entra](how-to-web-app-node-sign-in-call-api-overview.md).