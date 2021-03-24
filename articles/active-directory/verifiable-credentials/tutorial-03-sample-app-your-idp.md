---
title: Tutorial - Issue and verify verifiable credentials using your tenant (preview)
description: Change the Verifiable Credential code sample to work with your Azure tenant
documentationCenter: ''
author: barclayn
manager: daveba
ms.service: identity
ms.topic: how-to
ms.subservice: verifiable-credentials
ms.date: 03/23/2021
ms.author: barclayn
ms.reviewer: 

#Customer intent: As an administrator, I want the high-level steps that I should follow so that I can quickly start using verifiable credentials in my own Azure AD

---

# Tutorial: Issue and verify verifiable credentials using your tenant (preview)

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

## Make changes to match your environment

So far, we have been working with our sample app. The app uses [Azure Active Directory B2C](../../active-directory-b2c/overview.md) and we are now switching to use AAD so we need to make some changes not just to match your environment but we also need to make changes to support additional claims that were not used with the sample app.

1. Copy the rules file below and save it to **modified-ninjaRules.json**. 

    > [!NOTE]
    > **"scope": "openid profile"** is included in this Rules file and was not included in the Sample App's Rules file. The next section will explain how to enable the optional claims in your Azure Active Directory tenant. 
    
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
            "redirect_uri": "vcclient://openid/",
             "scope": "openid profile"
          }
        ]
      },
      "validityInterval": 2592000,
      "vc": {
        "type": ["VerifiedCredentialNinja"]
      }
    }
    ```

2. Open the file and replace the **client_id** and **configuration** values with the two values we copied in the previous section.

    ![highlighting the two values that need to be modified as part of this step](media/tutorial-sample-app-your-IdP/rules-file.png)

   The value **Configuration** is the OpenID Connect metadata document URI.

    >[!IMPORTANT]
    >Since the Sample Code is using Azure Active Directory B2C and we are using Azure Active Directory, we need to add optional claims via scopes in order for these claims to be included in the ID Token to be written into the Verifiable Credential. 

3. Back in the Azure portal, open Azure Active Directory.
4. Choose **App registrations**.
5. Open the VC Wallet App we created earlier.
6. Choose **Token configuration**.
7. Choose **+ Add optional claim**

     ![under token configuration add an optional claim](media/tutorial-sample-app-your-IdP/token-configuration.png)

8. From **Token type** choose **ID** and from the list of available claims choose **given_name** and **family_name**

     ![add optional claims](media/tutorial-sample-app-your-IdP/add-optional-claim.png)

9. Press **Add**.
10. If you get a permissions warning as shown below, check the box and select **Add**.

     ![add permissions for optional claims](media/tutorial-sample-app-your-IdP/add-optional-claim-permissions.png)

Now when a user is presented with the "sign in" to get issued your Verifiable Credential, the VC Wallet App knows to include the specific claims to be written in to the Verifiable Credential.

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

1. Select **Certificates & secrets**.
2. In the **Client secrets** section choose **New client secret**
    1. Add a description like "Node VC client secret"
    1. Expires: in one year.
  ![application client id](media/tutorial-sample-app-your-IdP/add-client-secret.png)
3. Copy down the SECRET. You need this information to update your sample node app.

>[!WARNING]
> You have one chance to copy down the secret. The secret is one way hashed after this. Do not copy the ID. 

![Certificates and secrets](media/tutorial-sample-app-your-IdP/nfskid8.png)

After creating your application and client secret in Azure AD, you need to grant the application the necessary permissions to perform operations on your Key Vault. Making these permission changes is required to enable the website to access and use the private keys stored there.

1. Go to Key Vault.
2. Select the key vault we are using for these tutorials.
3. Choose **Access Policies** on left nav
4. Choose **+Add Access Policy**.
5. In the **Key permissions** section choose **Get**, and **Sign**.
6. Select **Principal** and use the application ID to search for the application we registered earlier. Select it.
7. Select **Add**.
8. Choose **SAVE**.

For more information about Key Vault permissions and access control read the [key vault rbac guide](../../key-vault/general/rbac-guide.md)

![assign key vault permissions](media/tutorial-sample-app-your-IdP/key-vault-permissions.png)

## Create new VC with this rules file and the old display file

Follow the steps we followed earlier. Once that you have a new vc get the contract URL.

1. Upload the new rules file to our container
1. From the verifiable credentials page create a new credential called **ninjaCatModified** using the old display file and the new rules file (**modified_ninjaRules.json**).
1. Save the contract URL, we will need it in the next section. 


## Before we continue

We created a new verifiable credential using your identity provider. There are some values  and that has your own IdP and copied the contract URL. You should have also generated a Client ID for the node app along with a client secret. We will need these values in the next section to turn your sample code to start using your own keys from key vault.

- Contract URI
- Application Client ID (We got this when we registered the Node app)
- Client secret.

There are a few other values we need to get in order to make the changes one time in our Sample app. Let's get those now!

## Verifiable Credentials Settings

Navigate to the Verifiable Credentials Settings and copy down the following values:

- Tenant identifier 
- Issuer identifier (your DID)
- Key vault (uri)

Under the Signing key identifier, there is a URI but we only need a portion of it. Copy from the part that says issuerSigningKeyION. 

Here is an example:

```
issuerSigningKeyIon-25e48331-508a-b026-55ee-ca87dc173104/aee901a18c814dcab1a6d202ac35a3f3
```

## DID Document 

1. Open notepad and paste ```https://beta.discover.did.microsoft.com/1.0/identifiers/``` and append your did to the url. Like what is shown below:

    ```http
    https://beta.discover.did.microsoft.com/1.0/identifiers/did:ion:EiD3DvRok3n5OwN5hXy2gmzzbzyuxNSjPm9UwnI3sL3Ssg:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJzaWdfOTk0ZWMwYWIiLCJwdWJsaWNLZXlKd2siOnsiY3J2Ijoic2VjcDI1NmsxIiwia3R5IjoiRUMiLCJ4IjoiRXFXS3g0NlRrMXgzUHpnanRMVzlMMThrbEhwZjJ3Y0xIWkFYSU5ORFF0MCIsInkiOiJ6TmVWbmZsN2xUZWJDOGNXc3VyR1l3VURCWGViWEUzeWljREZTRTFobGRjskkdlkdlslole:LoKIJNML
    ```

2. Paste the URL in your browser.

    ![assign key vault permissions](media/tutorial-sample-app-your-IdP/did-document.png)

3. Copy the json in the browser and open up the following link: https://jsonformatter.org/ to format the json response. 
4. From the formatted response find the section called **verificationMethod**
5. Under "verificationMethod" copy the id and label it as the kvSigningKeyId
    
    ```json=
    "verificationMethod": [
          {
            "id": "#sig_25e48331",
    ```

Now we have everything we need to make the changes in our sample code.

- **Issuer:** app.js update const credential with your new contract uri
- **Verifier:** app.js update the issuerDid with your Issuer Identifier
- **Issuer and Verifier** update the didconfig.json with the following values:


```json=
{
    "azTenantId": "Your tenant ID",
    "azClientId": "Your client ID",
    "azClientSecret": "Your client secret",
    "kvVaultUri": "your keyvault uri",
    "kvSigningKeyId": "The ID from your DID Document",
    "kvRemoteSigningKeyId" : "The snippet of the issuerSigningKeyION we copied ",
    "did": "Your DID"
}
```

>[!IMPORTANT]
>This is a demo application and you should never give your application the secret.


Now you have everything in place to issuer and verify your own Verifiable Credential from your AAD with your own keys. 

## Issue and Verify the VC

Follow the same steps to issue the Verifiable Credential and validate it with your app. 

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Update Sample with your IdP VC and to use your key vault ](tutorial-04-update-sample-your-IdP-vc.md)