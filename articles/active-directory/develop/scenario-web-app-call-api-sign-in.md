---
title: Remove accounts from the token cache on sign-out - Microsoft identity platform | Azure
description: Learn how to remove an account from the token cache on sign-out
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/30/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a web app that calls web APIs by using the Microsoft identity platform for developers.
---

# A web app that calls web APIs: Remove accounts from the token cache on global sign-out

You learned how to add sign-in to your web app in [Web app that signs in users: Sign-in and sign-out](scenario-web-app-sign-user-sign-in.md).

Sign-out is different for a web app that calls web apis. When the user signs out from your application, or from any application, you must remove the tokens associated with that user from the token cache.

## Intercept the callback after single sign-out

To clear the token-cache entry associated with the account that signed out, your application can intercept the after `logout` event. Web apps store access tokens for each user in a token cache. By intercepting the after `logout` callback,  your web application can remove the user from the cache.

# [ASP.NET Core](#tab/aspnetcore)

Microsoft.Identity.Web takes care of implementing sign-out for you.

# [ASP.NET](#tab/aspnet)

The ASP.NET sample doesn't remove accounts from the cache on global sign-out.

# [Java](#tab/java)

The Java sample doesn't remove accounts from the cache on global sign-out.

# [Python](#tab/python)

The Python sample doesn't remove accounts from the cache on global sign-out.

---

## Next steps

# [ASP.NET Core](#tab/aspnetcore)

> [!div class="nextstepaction"]
> [Acquire a token for the web app](https://docs.microsoft.com/azure/active-directory/develop/scenario-web-app-call-api-acquire-token?tabs=aspnetcore)

# [ASP.NET](#tab/aspnet)

> [!div class="nextstepaction"]
> [Acquire a token for the web app](https://docs.microsoft.com/azure/active-directory/develop/scenario-web-app-call-api-acquire-token?tabs=aspnet)

# [Java](#tab/java)

> [!div class="nextstepaction"]
> [Acquire a token for the web app](https://docs.microsoft.com/azure/active-directory/develop/scenario-web-app-call-api-acquire-token?tabs=java)

# [Python](#tab/python)

> [!div class="nextstepaction"]
> [Acquire a token for the web app](https://docs.microsoft.com/azure/active-directory/develop/scenario-web-app-call-api-acquire-token?tabs=python)

---
