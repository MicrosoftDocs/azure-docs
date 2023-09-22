---
title: Move single-page app to production
description: Learn how to build a single-page application (move to production)
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/07/2019
ms.author: owenrichards
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a single-page application by using the Microsoft identity platform. 
---

# Single-page application: Move to production

Now that you know how to acquire a token to call web APIs, here are some things to consider when moving your application to production.

[!INCLUDE [Common steps to move to production](./includes/scenarios/scenarios-production.md)]

## Deploy your app

Check out a [deployment sample](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/4-Deployment) for learning how to deploy your SPA and Web API projects with Azure Storage and Azure App Service, respectively.

## Code samples

These code samples demonstrate several key operations for a single-page app:

- [SPA with an ASP.NET backend](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/3-Authorization-II/1-call-api): How to get tokens for your own back-end web API (ASP.NET Core) by using **MSAL.js**.

- [SPA with an Node.js backend)](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/3-Authorization-II/1-call-api): How to get tokens for your own back-end web API (Express.js) by using **MSAL.js**.

- [SPA with Azure AD B2C](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa): How to use **MSAL.js** to sign in users in an app that's registered with **Azure Active Directory B2C** (Azure AD B2C).

## Next steps

- [JavaScript SPA tutorial](./tutorial-v2-javascript-auth-code.md): Deep dive to how to sign in users and get an access token to call the **Microsoft Graph API** by using **MSAL.js**.
