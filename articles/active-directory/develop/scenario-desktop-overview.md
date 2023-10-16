---
title: Build a desktop app that calls web APIs
description: Learn how to build a desktop app that calls web APIs (overview)
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 11/22/2021
ms.author: owenrichards
ms.reviewer: jmprieur
ms.custom: aaddev, identityplatformtop40
#Customer intent: As an application developer, I want to know how to write a desktop app that calls web APIs by using the Microsoft identity platform.
---

# Scenario: Desktop app that calls web APIs

Learn all you need to build a desktop app that calls web APIs.

## Get started

If you haven't already, create your first application by completing a quickstart:

- [Quickstart: Acquire a token and call Microsoft Graph API from a Windows desktop app](./quickstart-v2-windows-desktop.md)
- [Quickstart: Acquire a token and call Microsoft Graph API from a UWP app](./quickstart-v2-uwp.md)
- [Quickstart: Acquire a token and call Microsoft Graph API from a macOS native app](./quickstart-v2-ios.md)
- [Quickstart: Acquire a token and call Microsoft Graph API from a Node.js & Electron app](./quickstart-v2-nodejs-desktop.md)

## Overview

You write a desktop application, and you want to sign in users to your application and call web APIs such as Microsoft Graph, other Microsoft APIs, or your own web API. You've several options:

- You can use the interactive token acquisition:

  - If your desktop application supports graphical controls, for instance, if it's a Windows Form application, a Windows Presentation Foundation (WPF) application, or a macOS native application.
  - Or, if it's a .NET Core application and you agree to have the authentication interaction with Microsoft Entra ID happen in the system browser.
  - Or, if it's a Node.js Electron application, which runs on a Chromium instance.

- For Windows hosted applications, it's also possible for applications running on computers joined to a Windows domain or Microsoft Entra joined to acquire a token silently by using integrated Windows authentication.
- Finally, and although it's not recommended, you can use a username and a password in public client applications. It's still needed in some scenarios like DevOps. Using it imposes constraints on your application. For instance, it can't sign in a user who needs to do [multifactor authentication](../authentication/concept-mfa-howitworks.md) (Conditional Access). Also, your application won't benefit from single sign-on (SSO).

  It's also against the principles of modern authentication and is only provided for legacy reasons.

  ![Desktop application](media/scenarios/desktop-app.svg)

- If you write a portable command-line tool, probably a .NET Core application that runs on Linux or Mac, and if you accept that authentication will be delegated to the system browser, you can use interactive authentication. .NET Core doesn't provide a [web browser](https://aka.ms/msal-net-uses-web-browser), so authentication happens in the system browser. Otherwise, the best option in that case is to use device code flow. This flow is also used for applications without a browser, such as Internet of Things (IoT) applications.

  ![Browserless application](media/scenarios/device-code-flow-app.svg)

## Specifics

Desktop applications have few specificities. They depend mainly on whether your application uses interactive authentication or not.

## Recommended reading

[!INCLUDE [recommended-topics](./includes/scenarios/scenarios-prerequisites.md)]

## Next steps

Move on to the next article in this scenario,
[App registration](scenario-desktop-app-registration.md).
