---
title: Build a desktop app that calls web APIs - Microsoft identity platform | Azure
description: Learn how to build a desktop app that calls web APIs (overview)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev, identityplatformtop40
#Customer intent: As an application developer, I want to know how to write a desktop app that calls web APIs by using the Microsoft identity platform for developers.
---

# Scenario: Desktop app that calls web APIs

Learn all you need to build a desktop app that calls web APIs.

## Prerequisites

[!INCLUDE [Pre-requisites](../../../includes/active-directory-develop-scenarios-prerequisites.md)]

## Get started

If you haven't already, create your first application by following the .NET desktop quickstart, the Universal Windows Platform (UWP) quickstart, or the macOS native app quickstart:

> [!div class="nextstepaction"]
> [Quickstart: Acquire a token and call Microsoft Graph API from a Windows desktop app](./quickstart-v2-windows-desktop.md)


> [!div class="nextstepaction"]
> [Quickstart: Acquire a token and call Microsoft Graph API from a UWP app](./quickstart-v2-uwp.md)

> [!div class="nextstepaction"]
> [Quickstart: Acquire a token and call Microsoft Graph API from a macOS native app](./quickstart-v2-ios.md)

## Overview

You write a desktop application, and you want to sign in users to your application and call web APIs such as Microsoft Graph, other Microsoft APIs, or your own web API. You have several possibilities:

- You can use the interactive token acquisition:

  - If your desktop application supports graphical controls, for instance, if it's a Windows.Form application, a WPF application, or a macOS native application.
  - Or, if it's a .NET Core application and you agree to have the authentication interaction with Azure Active Directory (Azure AD) happen in the system browser.

- For Windows hosted applications, it's also possible for applications running on computers joined to a Windows domain or Azure AD joined to acquire a token silently by using Integrated Windows Authentication.
- Finally, and although it's not recommended, you can use a username and a password in public client applications. It's still needed in some scenarios like DevOps. Using it imposes constraints on your application. For instance, it can't sign in a user who needs to perform multifactor authentication (conditional access). Also, your application won't benefit from single sign-on (SSO).

  It's also against the principles of modern authentication and is only provided for legacy reasons.

  ![Desktop application](media/scenarios/desktop-app.svg)

- If you write a portable command-line tool, probably a .NET Core application that runs on Linux or Mac, and if you accept that authentication will be delegated to the system browser, you can use interactive authentication. .NET Core doesn't provide a [web browser](https://aka.ms/msal-net-uses-web-browser), so authentication happens in the system browser. Otherwise, the best option in that case is to use device code flow. This flow is also used for applications without a browser, such as IoT applications.

  ![Browserless application](media/scenarios/device-code-flow-app.svg)

## Specifics

Desktop applications have a number of specificities. They depend mainly on whether your application uses interactive authentication or not.

## Next steps

> [!div class="nextstepaction"]
> [Desktop app: App registration](scenario-desktop-app-registration.md)
