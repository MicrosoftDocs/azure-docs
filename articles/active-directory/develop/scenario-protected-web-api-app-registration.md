---
title: protected Web API - app registration | Azure
description: Learn how to build a protected Web API (app registration)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/19/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a protected Web API using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Protected Web API - app registration

See [Quickstart: Register an application with the Microsoft identity platform](quickstart-register-app.md) how to register the application.

This article explains the app registration specifics for a protected Web API.

## Accepted token version

The Microsoft identity platform v2.0 endpoint is capable of issuing two types of tokens. v1.0 tokens, and v2.0 tokens. Learn more about these tokens in [Access Token](access-tokens.md). The accepted token version depends on the  **Supported account types** you chose when you created your application:

- if the value of **Supported account types** is **Accounts in any organizational directory and personal Microsoft accounts (e.g. Skype, Xbox, Outlook.com)**, the accepted token version will be v2.0
- Otherwise, the accepted token version will be v2.0

Once you've created your application, you can change the accepted token version by following these steps:

1. Select the **Manifest** section
2. In the manifest, search for **"accessTokenAcceptedVersion"**, and see that its value is **2**. This property lets Azure AD know that the Web API accepts v2.0 tokens. If it's **null**, the accepted token version will be v1.0
3. Select **Save**

> [!NOTE]
> it's up to the Web API to decide which version of token (v1.0 or v2.0) it accepts. Then when clients request a token for your Web API using the Microsoft identity platform v2.0 endpoint, they'll get a token which version is accepted by the Web API

## No redirect URI

Web APIs don't need to register a redirect URI as no user is signed-in interactively.

## Expose an API

Another setting specific to Web APIs is the exposed API, and the exposed scopes.

### Resource URI and Scopes

Scopes are usually of the form `resourceURI/scopeName`. In the case of Microsoft Graph the scopes have shortcuts like `User.Read`, but this string is just a shortcut for `https://graph.microsoft.com/user.read`.

During the app registration, you'll need to define:

- one resource URI. By default the application registration portal proposes you to use `api://{clientId}`. This Resource URI has the nice property of being unique, but it's not human readable. You can change it, but have it unique.
- one or several scopes

The scopes are also displayed on the consent screen presented to the end users using your application. Therefore, you'll need to provide the corresponding strings describing the scope:

- as seen by the end user
- but also the tenant admin who can grant admin consent

### How to expose the API

1. Select the **Expose an API** section in the application registration, and:
   - Select **Add a scope**
   - accept the proposed Application ID URI (api://{clientId}) by selecting **Save and Continue**
   - Enter the following parameters:
     - for **Scope name** use `access_as_user`
     - Ensure the **Admins and users** option is selected for **Who can consent**
     - in **Admin consent display name** type `Access TodoListService as a user`
     - in **Admin consent description** type `Accesses the TodoListService Web API as a user`
     - in **User consent display name** type `Access TodoListService as a user`
     - in **User consent description** type `Accesses the TodoListService Web API as a user`
     - Keep **State** as **Enabled**
     - Select **Add scope**

## Next steps

> [!div class="nextstepaction"]
> [App's code configuration](scenario-protected-web-api-app-configuration.md)
