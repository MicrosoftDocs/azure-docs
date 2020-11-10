---
title: Move single-page app to production - Microsoft identity platform | Azure
description: Learn how to build a single-page application (move to production)
services: active-directory
author: navyasric
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/07/2019
ms.author: nacanuma
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a single-page application by using the Microsoft identity platform for developers.
---

# Single-page application: Move to production

Now that you know how to acquire a token to call web APIs, learn how to move to production.

## Improve your app

[Enable logging](msal-logging.md) to make your app production ready.

## Test your integration

Test your integration by following the [Microsoft identity platform integration checklist](identity-platform-integration-checklist.md).

## Deploy your app

Check out a [deployment sample](https://github.com/Azure-Samples/ms-identity-javascript-angular-spa-aspnet-webapi-multitenant/tree/master/Chapter3) for learning how to deploy your SPA and Web API projects with Azure Storage and Azure App Services, respectively. 

## Next steps

- Deep dive of the quickstart sample, which explains the code for how to sign in users and get an access token to call the **Microsoft Graph API** by using **MSAL.js**: [JavaScript SPA tutorial](./tutorial-v2-javascript-spa.md).

- Sample that demonstrates how to get tokens for your own back-end web API (ASP.NET Core) by using **MSAL.js**: [SPA with an ASP.NET back-end](https://github.com/Azure-Samples/ms-identity-javascript-angular-spa-aspnetcore-webapi).

- Sample that demonstrates how to validate access tokens for your back-end web API (Node.js) by using **passport-azure-ad**: [Node.js Web API (Azure AD](https://github.com/Azure-Samples/active-directory-javascript-nodejs-webapi-v2).

- Sample that shows how to use **MSAL.js** to sign in users in an app that's registered with **Azure Active Directory B2C** (Azure AD B2C): [SPA with Azure AD B2C](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp).

- Sample that shows how to use **passport-azure-ad** to validate access tokens for apps registered with **Azure Active Directory B2C** (Azure AD B2C): [Node.js Web API (Azure AD B2C)](https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi).
