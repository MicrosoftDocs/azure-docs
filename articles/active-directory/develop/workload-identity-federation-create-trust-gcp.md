---
title: Create a trust relationship between an app and Google Cloud
titleSuffix: Microsoft identity platform
description: Set up a trust relationship between an app in Azure AD and Google Cloud.  This allows a service running in Google Cloud to access Azure AD protected resources without using secrets or certificates. 
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 12/16/2021
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: keyam, udayh, vakarand
#Customer intent: As an application developer, I want to create a trust relationship with Google Cloud so my service can access Azure AD protected resources without managing secrets.
---

# Access Azure AD protected resources from a service in Google Cloud (preview)

First, let’s look at how developers access Azure resources from their services running in Google Cloud today. They first create an application registration in Azure AD and give it the necessary permissions in Azure. Then they configure the application with a secret and use that secret in their service in Google to request an access token for that application from Azure AD.

With Azure AD workload identity federation, you can avoid creating these secrets in Azure AD when your services are running in Google Cloud. Instead, you can configure your Azure AD application to trust a token issued by Google.

## Create an app registration in Azure AD

[Create an app registration](quickstart-register-app.md) in Azure AD. Grant your app access to the Azure resources targeted by the software workload running in Google Cloud.

Find the object ID of the app (not the application (client) ID), which you need in the following steps. You can find the object ID of the app in the Azure portal. 

Go to the [list of registered applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) in the Azure portal and select your app registration. 

In **Overview**->**Essentials**, find the **Object ID** which you need in later steps.

## Set up an identity in Google Cloud

You need an identity in Google Cloud that can be associated with your Azure AD application. A [service account](https://cloud.google.com/iam/docs/service-accounts), for example, used by an application or compute workload.  You can either use the default service account of your Google project or create a dedicated service account.

Each service account has a unique ID. When you visit the **IAM & Admin** page in the Google Cloud console, click on **Service Accounts**. Select the service account you plan to use, and copy its **Unique ID**.

:::image type="content" source="media/workload-identity-federation-create-trust-gcp/service-account-details.png" alt-text="Shows a screen shot of the Service Accounts page" border="false":::

Tokens issued by Google to the service account will have this unique ID as the *subject* claim.

The *issuer* claim in the tokens will be `https://accounts.google.com`.

You need these claim values to configure a trust relationship with an Azure AD application, which allows your application to trust tokens issued by Google to your service account.

## Configure an Azure AD app to trust Google Cloud

Configure a federated identity credential on your Azure AD application to set up the trust relationship. You can add up to twenty of these trusts to each Azure AD application.  See [Create a federated identity credential](workload-identity-federation-create-trust.md#create-a-federated-identity-credential)

The most important parts of the federated identity credential are the following:

- *object ID*: the object ID of the app (not the application (client) ID) you previously registered in Azure AD.
- *subject*: this should match the `sub` claim in the token issued by another identity provider, such as Google. This is the Unique ID of the service account you plan to use.
- *issuer*: this should match the `iss` claim in the token issued by the identity provider. This needs to be an URL that must comply with the OIDC Discovery Spec. Azure AD will use this issuer URL to fetch the keys that are necessary to validate the token. In the case of Google cloud, the issuer is `https://accounts.google.com`.
- *audiences*: this should match the `aud` claim in the token. For security reasons, you should pick a value that is unique for tokens meant for Azure AD. The Microsoft recommended value is “api://AzureADTokenExchange”.

## Exchange a Google token for an access token from Microsoft identity platform

Now that we have configured the Azure AD application to trust the Google service account, we are ready to get a token from Google and exchange it for an Azure AD access token,

### Get an ID token for your Google service account

As mentioned earlier, Google cloud resources such as app-engine automatically use the default service account of your Google project. You can also configure the app-engine to use a different service account when you deploy your service. Your service can request an ID token for that service account from the “metadata service endpoint” that handles such requests. With this approach, you dont need any keys for your service account: these are all managed by Google. Here’s an example in Node.js:

```nodejs
async function googleIDToken() {
    const headers = new Headers();
    const endpoint="http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=api://AzureADTokenExchange";
    return fetch(endpoint, {method: "GET", headers: headers});
}
```

You are requesting Google for a token to identify your service account (an ID token) to Azure AD. Note that the audience here needs to match the audience value you configured on your Azure AD application when setting up the federated identity credential.

### Exchang the identity token for an Azure AD access token

Now that you have an identity token from Google, we can exchange this for an Azure AD access token. The Microsoft Authentication Library (MSAL) has been updated to allow you to pass the Google token as a “clientAssertion”. Using this support in MSAL, you can write your token class that implements the “TokenCredential” interface, which can then be used in the different Azure SDKs. The following MSAL versions have support for clientAssertions:

Here’s a sample code snippet to demonstrate this:

```nodejs
const msal = require("@azure/msal-node");
import {TokenCredential, GetTokenOptions, AccessToken} from "@azure/core-auth"

class ClientAssertionCredential implements TokenCredential {

    constructor(...) {
        //constructor stuff. Store clientID, aadAuthority, tenantID for later use
    }
    
    async getToken(scope: string | string[], _options?: GetTokenOptions):Promise<AccessToken> {

        var scopes:string[] = [];           
        // write code here to update the scopes array, based on scope paramenter


        return googleIDToken() // calling this directly just for clarity, 
                               // this should be a callback
        .then((clientAssertion:any)=> {
            let msalApp = new msal.ConfidentialClientApplication({
                auth: {
                    clientId: this.clientID,
                    authority: this.aadAuthority + this.tenantID,
                    clientAssertion: clientAssertion,
                }
            });
            return msalApp.acquireTokenByClientCredential({ scopes })
        })
        .then(function(aadToken) {
            // return  in form expected by TokenCredential.getToken
            return({ 
                token: aadToken.accessToken,
                expiresOnTimestamp: aadToken.expiresOn.getTime()
            });
        })
        .catch(function(error) {
            // error stuff
        });
    }
}
```

Here’s an example of how you can use this in an Azure SDK such as storage-blob:

```nodejs
const { BlobServiceClient } = require("@azure/storage-blob");

const tokenCredential =  new ClientAssertionCredential(...);
                                             
const blobClient = new BlobServiceClient(blobUrl, tokenCredential);
```

When you make requests to the blobClient to access storage, the blobClient calls the getToken method on the ClientAssertionCredential. This results in a request for a fresh ID token from the metatdata server which then gets exchanged for an Azure AD access token.

## Next steps
