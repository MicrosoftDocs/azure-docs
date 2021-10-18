---
title: Move single-page app to production
titleSuffix: Microsoft identity platform
description: Learn how to build a single-page application (move to production)
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/07/2019
ms.author: marsma
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a single-page application by using the Microsoft identity platform.
---

# Single-page application: Move to production

Now that you know how to acquire a token to call web APIs, here are some things to consider when moving your application to production.

[!INCLUDE [Common steps to move to production](../../../includes/active-directory-develop-scenarios-production.md)]

## Deploy your app

Check out a [deployment sample](https://github.com/Azure-Samples/ms-identity-javascript-angular-spa-aspnet-webapi-multitenant/tree/master/Chapter3) for learning how to deploy your SPA and Web API projects with Azure Storage and Azure App Services, respectively.

## Code samples

These code samples demonstrate several key operations for a single-page app.
- [SPA with an ASP.NET back-end](https://github.com/Azure-Samples/ms-identity-javascript-angular-spa-aspnetcore-webapi): How to get tokens for your own back-end web API (ASP.NET Core) by using **MSAL.js**.

- [Node.js Web API (Azure AD](https://github.com/Azure-Samples/active-directory-javascript-nodejs-webapi-v2): How to validate access tokens for your back-end web API (Node.js) by using **passport-azure-ad**.

- [SPA with Azure AD B2C](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa): How to use **MSAL.js** to sign in users in an app that's registered with **Azure Active Directory B2C** (Azure AD B2C).

- [Node.js web API (Azure AD B2C)](https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi): How to use **passport-azure-ad** to validate access tokens for apps registered with **Azure Active Directory B2C** (Azure AD B2C).

## Next steps

- [JavaScript SPA tutorial](./tutorial-v2-javascript-auth-code.md): Deep dive to how to sign in users and get an access token to call the **Microsoft Graph API** by using **MSAL.js**.