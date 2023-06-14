---
title: Build single-page app calling a web API
description: Learn how to build a single-page application that calls a web API
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 11/25/2022
ms.author: owenrichards
ms.custom: aaddev, engagement-fy23
#Customer intent: As an application developer, I want to know how to write a single-page application by using the Microsoft identity platform.
---

# Single-page application: Call a web API

We recommend that you call the `acquireTokenSilent` method to acquire or renew an access token before calling a web API. After you have a token, you can call a protected web API.

## Call a web API

# [JavaScript](#tab/javascript)

Use the acquired access token as a bearer in an HTTP request to call any web API, such as Microsoft Graph API. For example:

```javascript
    var headers = new Headers();
    var bearer = "Bearer " + access_token;
    headers.append("Authorization", bearer);
    var options = {
         method: "GET",
         headers: headers
    };
    var graphEndpoint = "https://graph.microsoft.com/v1.0/me";

    fetch(graphEndpoint, options)
        .then(function (response) {
             //do something with response
        })
```

# [Angular](#tab/angular)

The MSAL Angular wrapper takes advantage of the HTTP interceptor to automatically acquire access tokens silently and attach them to the HTTP requests to APIs. For more information, see [Acquire a token to call an API](scenario-spa-acquire-token.md).

---

## Next steps

Move on to the next article in this scenario, [Move to production](scenario-spa-production.md).
