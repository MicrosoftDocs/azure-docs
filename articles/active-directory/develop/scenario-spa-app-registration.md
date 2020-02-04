---
title: Register single-page apps - Microsoft identity platform | Azure
description: Learn how to build a single-page application (app registration)
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

# Single-page application: App registration

This page explains the app registration specifics for a single-page application (SPA).

Follow the steps to [register a new application with the Microsoft identity platform](quickstart-register-app.md), and select the supported accounts for your application. The SPA scenario can support authentication with accounts in your organization or any organization and personal Microsoft accounts.

Next, learn the specific aspects of application registration that apply to single-page applications.

## Register a redirect URI

The implicit flow sends the tokens in a redirect to the single-page application running on a web browser. So it's important to register a redirect URI where your application can receive the tokens. Ensure that the redirect URI exactly matches the URI for your application.

In the [Azure portal](https://go.microsoft.com/fwlink/?linkid=2083908), go to your registered application. On the **Authentication** page of the application, select the **Web** platform. Enter the value of the redirect URI for your application in the **Redirect URI** field.

## Enable the implicit flow

On the same **Authentication** page, under **Advanced settings**, you must also enable **Implicit grant**. If your application is only signing in users and getting ID tokens, it's enough to select the **ID tokens** check box.

If your application also needs to get access tokens to call APIs, make sure to select the **Access tokens** check box as well. For more information, see [ID tokens](./id-tokens.md) and [Access tokens](./access-tokens.md).

## API permissions

Single-page applications can call APIs on behalf of the signed-in user. They need to request delegated permissions. For details, see [Add permissions to access web APIs](quickstart-configure-app-access-web-apis.md#add-permissions-to-access-web-apis).

## Next steps

> [!div class="nextstepaction"]
> [App's code configuration](scenario-spa-app-configuration.md)
