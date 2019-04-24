---
title: Single Page Application - App registration | Azure
description: Learn how to build a Single Page Application (App registration)
services: active-directory
documentationcenter: dev-center-name
author: navyasric
manager: CelesteDG
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/06/2019
ms.author: nacanuma
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a Single Page Application using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Single Page Application - App registration

This page explains the app registration specifics for a Single Page Application.

Follow the steps to [register a new application with Azure AD](quickstart-register-app.md), and select the supported accounts for your application. Note that the SPA scenario can support authentication with accounts in your organization or any organization and personal Microsoft accounts.

Next, here are the specific aspects of application registration that apply to single page applications.


## Register a Redirect URI

The implicit flow sends the tokens in a redirect to the single page application running in a web browser. Therefore, it is an important requirement to register a redirect URI where your application can receive the tokens. Please ensure that the redirect URI matches exactly with the URI for your application.

In the [Azure portal](https://go.microsoft.com/fwlink/?linkid=2083908), navigate to your registered application, on the **Authentication** page of the application, select the **Web** platform and enter the value of the redirect URI for your application in the **Redirect URI** field.

## Enable the implicit flow

On the same **Authentication** page, under **Advanced settings**, you must also enable the **Implicit grant**. If your application is only performing sign in of users and getting ID tokens, it is sufficient to enable **ID tokens** checkbox.
If your application also needs to get access tokens to call APIs, make sure to enable the **Access tokens** checkbox as well. For more information, see [ID tokens](./id-tokens.md) and [Access tokens](./access-tokens.md).

## API permissions

Single page applications can call APIs on behalf of the signed-in user. They need to request delegated permissions. For details see [Add permissions to access web APIs](quickstart-configure-app-access-web-apis.md#add-permissions-to-access-web-apis)

## Next steps

> [!div class="nextstepaction"]
> [App's code configuration](scenario-spa-app-configuration.md)
