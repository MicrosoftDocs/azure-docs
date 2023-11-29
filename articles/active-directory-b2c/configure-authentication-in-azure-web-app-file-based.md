---
title: Configure authentication in an Azure Web App configuration file by using Azure Active Directory B2C
description:  This article discusses how to use Azure Active Directory B2C to sign in and sign up users in an Azure Web App using configuration file.

author: kengaderdus
manager: CelesteDG
ms.service: active-directory

ms.topic: reference
ms.date: 06/28/2022
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Configure authentication in an Azure Web App configuration file by using Azure AD B2C

This article explains how to add Azure Active Directory B2C (Azure AD B2C) authentication functionality to an Azure Web App. For more information, check out the [File-based configuration in Azure App Service authentication](../app-service/configure-authentication-file-based.md) article.

## Overview

OpenID Connect (OIDC) is an authentication protocol that's built on OAuth 2.0. Use the OIDC to securely sign users in to an Azure Web App. The sign-in flow involves the following steps:

1. Users go to the Azure Web App and select **Sign-in**. 
1. The Azure Web App initiates an authentication request and redirects users to Azure AD B2C.
1. Users [sign up or sign in](add-sign-up-and-sign-in-policy.md) and [reset the password](add-password-reset-policy.md). Alternatively, they can sign in with a [social account](add-identity-provider.md).
1. After users sign in successfully, Azure AD B2C returns an ID token to the Azure Web App.
1. Azure Web App validates the ID token, reads the claims, and returns a secure page to users.

When the ID token expires or the app session is invalidated, Azure Web App initiates a new authentication request and redirects users to Azure AD B2C. If the Azure AD B2C [SSO session](session-behavior.md) is active, Azure AD B2C issues an access token without prompting users to sign in again. If the Azure AD B2C session expires or becomes invalid, users are prompted to sign in again.

## Prerequisites

- If you haven't created an app yet, follow the guidance how to create an [Azure Web App](../app-service/quickstart-dotnetcore.md).

## Step 1: Configure your user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](../../includes/active-directory-b2c-app-integration-add-user-flow.md)]

## Step 2: Register a web application

To enable your application to sign in with Azure AD B2C, register your app in the Azure AD B2C directory. The app that you register establishes a trust relationship between the app and Azure AD B2C.  

During app registration, you'll specify the *redirect URI*. The redirect URI is the endpoint to which users are redirected by Azure AD B2C after they authenticate with Azure AD B2C. The app registration process generates an *application ID*, also known as the *client ID*, that uniquely identifies your app. After your app is registered, Azure AD B2C uses both the application ID and the redirect URI to create authentication requests. You also create a client secret, which your app uses to securely acquire the tokens.

### Step 2.1: Register the app

To register your application, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **New registration**.
1. Under **Name**, enter a name for the application (for example, *My Azure web app*).
1. Under **Supported account types**, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**.
1. Under **Redirect URI**, select **Web** and then, in the URL box, enter `https://<YOUR_SITE>/.auth/login/aadb2c/callback`. Replace the `<YOUR_SITE>` with your Azure Web App name. For example: `https://contoso.azurewebsites.net/.auth/login/aadb2c/callback`. If you configured an [Azure Web App's custom domains](../app-service/app-service-web-tutorial-custom-domain.md), user the custom domain in the redirect URI. For example, `https://www.contoso.com/.auth/login/aadb2c/callback`
1. Under **Permissions**, select the **Grant admin consent to openid and offline access permissions** checkbox.
1. Select **Register**.
1. Select **Overview**.
1. Record the **Application (client) ID** for later use, when you configure the web application.

    ![Screenshot of the web app Overview page for recording your web application I D.](./media/configure-authentication-in-azure-web-app/get-azure-ad-b2c-app-id.png)  

### Step 2.2: Create a client secret

1. In the **Azure AD B2C - App registrations** page, select the application you created, for example *My Azure web app*.
1. In the left menu, under **Manage**, select **Certificates & secrets**.
1. Select **New client secret**.
1. Enter a description for the client secret in the **Description** box. For example, *clientsecret1*.
1. Under **Expires**, select a duration for which the secret is valid, and then select **Add**.
1. Record the secret's **Value** for use in your client application code. This secret value is never displayed again after you leave this page. You use this value as the application secret in your application's code.

## Step 3: Configure the Azure Web App

Once the application is registered with Azure AD B2C, create the following application secrets in the Azure Web App's  [application settings](../app-service/configure-common.md#configure-app-settings). You can configure application settings via the Azure portal or with the Azure CLI. For more information, check out the [File-based configuration in Azure App Service authentication](../app-service/configure-authentication-file-based.md) article.

Add the following keys to the app settings:

| Setting Name | Value |
| --- | --- |
| `AADB2C_PROVIDER_CLIENT_ID` | The Web App  (client) ID from [step 2.1](#step-21-register-the-app). |
| `AADB2C_PROVIDER_CLIENT_SECRET` | The Web App  (client) secret from [step 2.2](#step-22-create-a-client-secret). |

> [!IMPORTANT]
> Application secrets are sensitive security credentials. Do not share this secret with anyone. Don't distribute it within a client application, or check in into a source control.

### 3.1 Add an OpenID Connect identity provider

Once you've the added the app ID and secret, use the following steps to add the Azure AD B2C as OpenId Connect identity provider.

1. Add an `auth` section of the [configuration file](../app-service/configure-authentication-file-based.md#configuration-file-reference) with a configuration block for the OIDC providers, and your provider definition.

   ```json
   {
     "auth": {
       "identityProviders": {
         "customOpenIdConnectProviders": {
           "aadb2c": {
             "registration": {
               "clientIdSettingName": "AADB2C_PROVIDER_CLIENT_ID",
               "clientCredential": {
                 "clientSecretSettingName": "AADB2C_PROVIDER_CLIENT_SECRET"
               },
               "openIdConnectConfiguration": {
                 "wellKnownOpenIdConfiguration": "https://<TENANT_NAME>.b2clogin.com/<TENANT_NAME>.onmicrosoft.com/<POLICY_NAME>/v2.0/.well-known/openid-configuration"
               }
             },
             "login": {
               "nameClaimType": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
               "scopes": [],
               "loginParameterNames": []
             }
           }
         }
       }
     }
   }
   ```

1. Replace `<TENANT_NAME>` with the first part of your Azure AD B2C [tenant name]( tenant-management-read-tenant-name.md#get-your-tenant-name) (for example, `https://contoso.b2clogin.com/contoso.onmicrosoft.com`).
1. Replace `<POLICY_NAME>` with the user flows or custom policy you created in [step 1](#step-1-configure-your-user-flow).

## Step 4: Check the Azure Web app

1. Navigate to your Azure Web App.
1. Complete the sign up or sign in process.
1. In your browser, navigate you the following URL `https://<app-name>.azurewebsites.net/.auth/me`. Replace the `<app-name>` with your Azure Web App

## Retrieve tokens in app code

From your server code, the provider-specific tokens are injected into the request header, so you can easily access them. The following table shows possible token header names:


|Header name  |Description  |
|---------|---------|
|X-MS-CLIENT-PRINCIPAL-NAME| The user's display name. |
|X-MS-CLIENT-PRINCIPAL-ID| The ID token sub claim. |
|X-MS-CLIENT-PRINCIPAL-IDP| The identity provider name, `aadb2c`.|
|X-MS-TOKEN-AADB2C-ID-TOKEN| The ID token issued by Azure AD B2C|

## Next steps

* After successful authentication, you can show display name on the navigation bar. To view the claims that the Azure AD B2C token returns to your app, check out the [Work with user identities in Azure App Service authentication](../app-service/configure-authentication-user-identities.md).
* Learn how to [Work with OAuth tokens in Azure App Service authentication](../app-service/configure-authentication-oauth-tokens.md).