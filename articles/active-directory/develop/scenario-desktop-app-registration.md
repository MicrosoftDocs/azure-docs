---
title: Desktop app that calls web APIs (app registration) - Microsoft identity platform
description: Learn how to build a Desktop app that calls web APIs (app registration)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
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
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a Desktop app that calls web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Desktop app that calls web APIs - app registration

This article contains the app registration specificities for a desktop application.

## Supported accounts types

The account types supported in desktop application depend on the experience you want to light-up, and therefore on the flows you want to use.

### Audience for interactive token acquisition

If  your desktop application uses interactive authentication, you can sign in users from any [account type](quickstart-register-app.md#register-a-new-application-using-the-azure-portal)

### Audience for desktop app silent flows

- If you intend to use Integrated Windows authentication or username/password, your application needs to sign in users in your own tenant (LOB developer), or in Azure Active directory organizations (ISV scenario). These authentication flows aren't supported for Microsoft personal accounts
- If you want to use the Device code flow, you can't sign in users with their Microsoft personal accounts yet
- If you sign in users with social identities passing a B2C authority and policy, you can only use the interactive and username-password authentication.

## Redirect URIs

Again the redirect URIs to use in desktop application will depend on the flow you want to use.

- If you're using the **interactive authentication** or **Device Code Flow**, you'll want to use `https://login.microsoftonline.com/common/oauth2/nativeclient`. You'll achieve this configuration by clicking the corresponding URL in the **Authentication** section for your application
  
  > [!IMPORTANT]
  > Today MSAL.NET uses another Redirect URI by default in desktop applications running on Windows (`urn:ietf:wg:oauth:2.0:oob`). In the future we'll want to change this default, and therefore we recommend that you use `https://login.microsoftonline.com/common/oauth2/nativeclient`

- If your app is only using Integrated Windows authentication, Username/Password, you don't need to register a redirect URI for your application. Indeed, these flows do a round trip to the Microsoft identity platform v2.0 endpoint and your application won't be called back on any specific URI. 
- In order to distinguish Device Code Flow, Integrated Windows Authentication and Username/Password from a confidential client application flow, which doesn't have redirect URIs either (the client credential flow used in daemon applications), you need to express that your application is a public client application. This configuration is achieved by going to the **Authentication** section for your application, and in the **Advanced settings** subsection, choose **Yes**, to the question **Treat application as a public client** (in the **Default client type** paragraph)

  ![Allow public client](media/scenarios/default-client-type.png)

## API permissions

Desktop applications call APIs on behalf of the signed-in user. They need to request delegated permissions. They can't request application permissions (which are only handled in [daemon applications](scenario-daemon-overview.md))

## Next steps

> [!div class="nextstepaction"]
> [Desktop app - app configuration](scenario-desktop-app-configuration.md)
