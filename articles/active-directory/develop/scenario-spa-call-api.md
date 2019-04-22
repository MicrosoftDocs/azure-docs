---
title: Single Page Application - calling a Web API | Azure
description: Learn how to build a Single Page Application (calling a Web API)
services: active-directory
documentationcenter: dev-center-name
author: CelesteDG
manager: CelesteDG
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/18/2019
ms.author: CelesteDG
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a Single Page Application using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Single Page Application - calling a Web API

It is recommended to call the `acquireTokenSilent` method to acquire or renew an access token before calling a web API. Now that you have a token, you can call a protected Web API.

## Call a web API

### JavaScript

Use the acquired access token as a bearer in an HTTP request to call any Web API such as Microsoft Graph API. For example:

```JavaScript
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
        }
```

### Angular

As mentioned in the acquiring tokens section, the MSAL Angular wrapper leverages the HTTP interceptor to automatically acquire access tokens silently and attach them to the HTTP requests to APIs.

## Next steps

> [!div class="nextstepaction"]
> [Move to production](scenario-spa-production.md)
