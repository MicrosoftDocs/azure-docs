---
title: Sign in users and call an API in a Node.js web application 
description: Learn how to sign in users and call an API in your own Node.js web application 
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/22/2023
ms.custom: developer, devx-track-js
#Customer intent: As a dev, I want to learn about how to Sign in users and call an API in your own Node.js web application by using Microsoft Entra ID for customers tenant.
---

# Sign in users and call an API in a Node.js web application 

In this article, you learn how to create your Node.js web app that calls your web API. You build the web API by using ASP.NET. You secure the web API by using Microsoft Entra ID for customers. To authorize access to the web API, you must serve requests that include a valid access token, which is issued by External ID for customers itself.

To simplify adding authentication and authorization, the Node.js client web app and .NET web API use [Microsoft Authentication Library for Node (MSAL Node)](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) and [Microsoft Identity Web](../../develop/microsoft-identity-web.md) respectively.

We've organized the content into four separate articles so it's easy for you to follow:

- [Prepare your External ID for customers tenant](how-to-web-app-node-sign-in-call-api-prepare-tenant.md) guides you how to register your API, client web app and configure user flows in the Microsoft Entra admin center.

- [Prepare your web application and API](how-to-web-app-node-sign-in-call-api-prepare-app.md) guides you how to set up your Node.js client app and web API.

- [Sign-in and acquire access token](how-to-web-app-node-sign-in-call-api-sign-in-acquire-access-token.md) guides you how to add sign in, then request for an access token with the required permissions/scopes.

- [Call API](how-to-web-app-node-sign-in-call-api-call-api.md) guides you how to make an HTTP call to the web API by using the access token as a bearer token.

## Overview

Token-based authentication ensures that requests to a web API include a valid access token.

The client web app completes the following events:

- It authenticates users with External ID for customers.

- It acquires an access token with the required permissions (scopes) for the web API endpoint.

- It passes the access token as a bearer token in the authentication header of the HTTP request. It uses the format:

    ```http
    Authorization: Bearer <token>
    ```
The web API completes the following events:

- It reads the bearer token from the authorization header of the HTTP request.

- It validates the [access token](../../develop/access-tokens.md#validate-tokens).

- It validates the permissions (scopes) in the token.

- If the access token is valid, the endpoint responds to the HTTP request, otherwise, it responds with a `401 Unauthorized` HTTP error. 

## Prerequisites

- [Node.js](https://nodejs.org).

- [.NET 7.0](https://dotnet.microsoft.com/learn/dotnet/hello-world-tutorial/install) or later. 

- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

- External ID for customers tenant. If you don't already have one, <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">sign up for a free trial</a>.


If you want to run a sample Node.js web application that calls a sample web API to get a feel of how things work, complete the steps in [Sign in users and call an API in sample Node.js web application](./sample-web-app-node-sign-in-call-api.md).

## Next steps

Next, learn how to prepare your External ID for customers tenant.

> [!div class="nextstepaction"]
> [Prepare your External ID for customers tenant for authentication >](how-to-web-app-node-sign-in-call-api-prepare-tenant.md)
