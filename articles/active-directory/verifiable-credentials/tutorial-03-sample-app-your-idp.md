---
title: Tutorial 3 Set up Verifiable Credentials issuer in your own Azure AD? (preview)
description: Change the Verifiable Credential code sample to work with your Azure tenant
documentationCenter: ''
author: barclayn
manager: daveba
ms.service: identity
ms.topic: how-to
ms.subservice: verifiable-credentials
ms.date: 03/15/2021
ms.author: barclayn
ms.reviewer: 

#Customer intent: As an administrator, I want the high-level steps that I should follow so that I can quickly start using verifiable credentials in my own Azure AD

---

# Tutorial 3 - Configure Azure Active Directory to work with the Verifiable Credential service

> [!IMPORTANT]
> Azure Verifiable Credentials is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Now that you have your Azure tenant set up with the Verifiable Credential service, we walk through the steps necessary to enable your Azure Active Directory (AAD) to issue verifiable credentials using the sample app.

In this article you:

> [!div class="checklist"]
> * Register the sample app in your Azure AD (AAD) tenant
> * Create the Ninja Credential Rules and Display File
> * Upload Rules and Display files
> * Set up your Verifiable Credentials Issuer service to use Azure Key Vault
> * Update Sample Code with your tenant's information.

Our sample code requires users to authenticate to an IdP before Ninja Verifiable Credential can be issued. Not all Verifiable Credentials issuers require authentication before issuing credentials.

Authenticating ID Tokens allows users to prove who they are before receiving their credential. When users successfully log in, the identity provider returns a security token containing claims about the user. The issuer service then transforms these security tokens and their claims into a verifiable credentials. The verifiable credential is signed with the issuer's DID.

Any identity provider that supports the OpenID Connect protocol is supported. Examples of supported identity providers include [Azure Active Directory](../fundamentals/active-directory-whatis.md), and [Azure AD B2C](../../active-directory-b2c/overview.md). In this tutorial we are using AAD.

## Prerequisites

This tutorial assumes you've already completed the steps in the [previous tutorial](create-sample-card-your-issuer.md) and have access to the environment you used.

## Register an App to enable DID Wallets to sign in users

To issue a verifiable credential, you need to register an app so Authenticator or any other verifiable credential wallet is allowed to sign in users.  

Register an application called 'VC Wallet App' in Azure Active Directory (AAD) and obtain a client ID.

1. Follow the instructions for registering an application with [Azure AD](../develop/quickstart-register-app.md) When registering, use the values below.

   - Name: "VC Wallet App"
   - Supported account types: Accounts in this organizational directory only
   - Redirect URI: vcclient://openid/

   ![register an application](media/tutorial-sample-app-your-idp/register-application.png)

2. After you register the application, write down the Application (client) ID. You need this value later.

   ![application client ID](media/tutorial-sample-app-your-IdP/client-id.png)

3. Select the **Endpoints** button and copy the OpenID Connect metadata document URI. You need this information for the next section. 

![issuer endpoints](media/tutorial-sample-app-your-IdP/application-endpoints.png)

## Your IdP with the Ninja Credential 

Now let's create a new Ninja credential using your Azure Active Directory. 

1. Copy the rules file below and save it to **modified_ninjaRules.json**.
    
    ```json
    {
      "attestations": {
        "idTokens": [
          {
            "mapping": {
              "firstName": { "claim": "given_name" },
              "lastName": { "claim": "family_name" }
            },
            "configuration": "https://dIdPlayground.b2clogin.com/dIdPlayground.onmicrosoft.com/B2C_1_sisu/v2.0/.well-known/openid-configuration",
            "client_id": "8d5b446e-22b2-4e01-bb2e-9070f6b20c90",
            "redirect_uri": "vcclient://openid"
          }
        ]
      },
      "validityInterval": 2592000,
      "vc": {
        "type": ["VerifiedCredentialNinja"]
      }
    }
    ```

2. Open the file in your editor and replace the **client_id** and **configuration** values with the two objects we copied in the previous section.

![highlighting the two values that need to be modified as part of this step](media/tutorial-sample-app-your-IdP/rules-file.png)

The value **Configuration** is the OpenID Connect metadata document URI.

## Create new VC with this rules file and old display file

Follow the steps we followed earlier. Once that you have a new vv get the contract URL.

1. Upload the new rules file to our container
1. At the verifiable credentials page create a new credential called **ninjaCatModified** using the old display file and the new rules file (**modified_ninjaRules.json**).
1.

Save the contract URL, we will need it in the next section. 

```
https://portableidentitycards.azure-api.net/v1.0/96e93203-0285-41ef-88e5-a8c9b7a33457/portableIdentities/contracts/MyIdPNinja
```

## Set up your node app with access to Key Vault

### Register node app

To authenticate a user's credential issuance request, the issuer website uses your cryptographic keys in Azure Key Vault. To access Azure Key Vault, your website needs a client ID and client secret that can be used to authenticate to Azure Key Vault.

![Register node app](media/tutorial-sample-app-your-IdP/cvkoirk.png)

Copy down your Application (client) ID as you will need this later to update your Sample Node app.

```
622d0251-9735-4ce2-b9cd-c09f69c2ff00
```

![application client id](media/tutorial-sample-app-your-IdP/jq6a7lv.png)


### Generate a client secret

- Select **Certificates & secrets**.
- In the **Client secrets** section choose **New client secret**
- Add a description like "Node VC client secret"
- Expires: in one year 
- Copy down the SECRET as you will need this to update your Sample Node app.

>[!WARNING]
> You have one chance to copy down the secret. The secret is one way hashed after this. Do not copy the ID. 

![Certificates and secrets](media/tutorial-sample-app-your-IdP/nfskid8.png)

After creating your application and client secret in Azure AD, you need to grant the application permission to perform operations on your Key Vault. Making these permission changes is required to enable the website to access and use the private keys stored there.

- Go to Key Vault.
- Select the key vault we are using for these tutorials.
- Access Policies on left nav
- Create new
- Key permissions: Get, Sign
- Select Principle and choose the application registration in the name you generated earlier. Select it.
- Select **Add**.
- Choose **SAVE**.

For more information about Key Vault permissions 

![assign key vault permissions](media/tutorial-sample-app-your-IdP/si53el7.png)

## Summary

We created a new verifiable credential using your identity provider. There are some values  and that has your own IdP and copied the contract URL. You should have also generated a Client ID for the node app along with a client secret. We will need these values in the next section to turn your sample code to start using your own keys from key vault. 

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Update Sample with your IdP VC and to use your key vault ](tutorial-04-update-sample-your-IdP-vc.md)