---
title:  Single-page application (move to production) - Microsoft identity platform
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
#Customer intent: As an application developer, I want to know how to write a single-page application using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Single-page application - move to production

Now that you know how to acquire a token to call Web APIs, learn how to move to production.

## Improve your app

Follow the steps needed to make your app production ready.

- [Enable logging](msal-logging.md) in your application.

## Test your integration

- Test your integration by following the [Microsoft identity platform integration checklist](identity-platform-integration-checklist.md).

## Next steps

Here are a few other samples/tutorials:

- For a deep dive of the quickstart sample which explains the code for how to sign in users and get an access token to call the MS Graph API using MSAL.js

    > [!div class="nextstepaction"]
    > [JavaScript SPA tutorial](./tutorial-v2-javascript-spa.md)

- Sample demonstrating how to get tokens for your own backend web API using MSAL.js

     > [!div class="nextstepaction"]
     > [SPA with an ASP.NET backend](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-dotnet-webapi-v2)

- Sample to show how to use MSAL.js to sign in users in an app registered with Azure AD B2C

    > [!div class="nextstepaction"]
    > [SPA with Azure AD B2C](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp)
