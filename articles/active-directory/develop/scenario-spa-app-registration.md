---
title: Single-page application (app registration) - Microsoft identity platform
description: Learn how to build a single-page application (App registration)
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

# Single-page application - app registration

This page explains the app registration specifics for a single-page application (SPA).

Follow the steps to [register a new application with Microsoft identity platform](quickstart-register-app.md), and select the supported accounts for your application. The SPA scenario can support authentication with accounts in your organization or any organization and personal Microsoft accounts.

Next, learn the specific aspects of application registration that apply to single-page applications.

## Register a redirect URI

The implicit flow sends the tokens in a redirect to the single-page application running in a web browser. Therefore, it's an important requirement to register a redirect URI where your application can receive the tokens. Please ensure that the redirect URI matches exactly with the URI for your application.

In the [Azure portal](https://go.microsoft.com/fwlink/?linkid=2083908), navigate to your registered application, on the **Authentication** page of the application, select the **Web** platform and enter the value of the redirect URI for your application in the **Redirect URI** field.

## Enable the implicit flow

On the same **Authentication** page, under **Advanced settings**, you must also enable the **Implicit grant**. If your application is only performing sign in of users and getting ID tokens, it's sufficient to enable **ID tokens** checkbox.

If your application also needs to get access tokens to call APIs, make sure to enable the **Access tokens** checkbox as well. For more information, see [ID tokens](./id-tokens.md) and [Access tokens](./access-tokens.md).

## API permissions

Single-page applications can call APIs on behalf of the signed-in user. They need to request delegated permissions. For details, see [Add permissions to access web APIs](quickstart-configure-app-access-web-apis.md#add-permissions-to-access-web-apis)

## Next steps

> [!div class="nextstepaction"]
> [App's code configuration](scenario-spa-app-configuration.md)
