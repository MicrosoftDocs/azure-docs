---
title: Protected web API - app registration | Azure
description: Learn how to build a protected Web API and the information you need to register the app.
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a protected Web API using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Protected web API - app registration

This article explains the app registration specifics for a protected web API.

See [Quickstart: Register an application with the Microsoft identity platform](quickstart-register-app.md) for the common steps on how to register the application.

## Accepted token version

The Microsoft identity platform endpoint can issue two types of tokens: v1.0 tokens and v2.0 tokens. You can learn more about these tokens in [Access tokens](access-tokens.md). The accepted token version depends on the **Supported account types** you chose when you created your application:

- If the value of **Supported account types** is **Accounts in any organizational directory and personal Microsoft accounts (e.g. Skype, Xbox, Outlook.com)**, the accepted token version will be v2.0.
- Otherwise, the accepted token version will be v1.0.

Once you've created the application, you can change the accepted token version by following these steps:

1. In the Azure portal, select your app and then select the **Manifest** for your app.
2. In the manifest, search for **"accessTokenAcceptedVersion"**, and see that its value is **2**. This property lets Azure AD know that the web API accepts v2.0 tokens. If it's **null**, the accepted token version will be v1.0.
3. Select **Save**.

> [!NOTE]
> It's up to the web API to decide which token version (v1.0 or v2.0) it accepts. When clients request a token for your web API using the Microsoft identity platform v2.0 endpoint, they'll get a token that indicates which version is accepted by the web API.

## No redirect URI

Web APIs don't need to register a redirect URI as no user is signed-in interactively.

## Expose an API

Another setting specific to web APIs is the exposed API and the exposed scopes.

### Resource URI and scopes

Scopes are usually of the form `resourceURI/scopeName`. For Microsoft Graph, the scopes have shortcuts like `User.Read`, but this string is just a shortcut for `https://graph.microsoft.com/user.read`.

During app registration, you'll need to define the following parameters:

- One resource URI - By default the application registration portal recommends that you to use `api://{clientId}`. This resource URI is unique, but it's not human readable. You can change it, but make sure that it's unique.
- One or several scopes

The scopes are also displayed on the consent screen that's presented to end-users who use your application. Therefore, you'll need to provide the corresponding strings that describe the scope:

- As seen by the end user
- As seen by the tenant admin, who can grant admin consent

### How to expose the API

1. Select the **Expose an API** section in the application registration, and:
   1. Select **Add a scope**.
   1. Accept the proposed Application ID URI (api://{clientId}) by selecting **Save and Continue**.
   1. Enter the following parameters:
      - For **Scope name**, use `access_as_user`.
      - For **Who can consent**, make sure the **Admins and users** option is selected.
      - In **Admin consent display name**, type `Access TodoListService as a user`.
      - In **Admin consent description**, type `Accesses the TodoListService Web API as a user`.
      - In **User consent display name**, type `Access TodoListService as a user`.
      - In **User consent description**, type `Accesses the TodoListService Web API as a user`.
      - Keep **State** set to **Enabled**.
      - Select **Add scope**.

## Next steps

> [!div class="nextstepaction"]
> [App's code configuration](scenario-protected-web-api-app-configuration.md)
