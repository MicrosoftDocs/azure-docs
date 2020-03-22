---
title: Move single-page app to production - Microsoft identity platform | Azure
description: Learn how to build a single-page application (move to production)
services: active-directory
documentationcenter: dev-center-name
author: navyasric
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
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

## Next steps

Deep dive of the quickstart sample, which explains the code for how to sign in users and get an access token to call the Microsoft Graph API by using MSAL.js:

> [!div class="nextstepaction"]
> [JavaScript SPA tutorial](./tutorial-v2-javascript-spa.md)

Sample that demonstrates how to get tokens for your own back-end web API by using MSAL.js:

> [!div class="nextstepaction"]
> [SPA with an ASP.NET back end](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-dotnet-webapi-v2)

Sample that shows how to use MSAL.js to sign in users in an app that's registered with Azure Active Directory B2C (Azure AD B2C):

> [!div class="nextstepaction"]
> [SPA with Azure AD B2C](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp)
