---
title: Desktop app that calls web APIs - overview | Azure
description: Learn how to build a Desktop app that calls web APIs (overview |)
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

# Scenario: Desktop app that calls web APIs

Learn all you need to build a Desktop app that calls web APIs

## Prerequisites

[!INCLUDE [Pre-requisites](../../../includes/active-directory-develop-scenarios-prerequisites.md)]

## Scenario overview

You write a desktop application, and you want to sign in users to your application and call web APIs such as the Microsoft Graph, other Microsoft APIs, or your own web API. You have several possibilities:

- If your desktop application supports graphical controls, for instance if it's a Windows.Form application or a WPF application, you can use the interactive token acquisition.
- For Windows hosted applications, it's also possible for applications running on computers joined to a Windows domain or AAD joined to acquire a token silently by using Integrated Windows Authentication.
- Finally, and although it's not recommended, you can use Username/Password in public client applications. It's still needed in some scenarios (like DevOps), but beware that using it will impose constraints
  on your application. For instance, it can't sign in user who needs to perform Multi Factor Authentication (conditional access). Also your application won't benefit from Single Sign On.
  It's also against the principles of modern authentication and is only provided for legacy reasons.

  ![Desktop application](media/scenarios/desktop-app.svg)

- If you're writing a portable command-line tool - probably a .NET Core application running on Linux or Mac - you won't be able to use neither the interactive authentication (as .NET Core doesn't provide a [Web browser](https://aka.ms/msal-net-uses-web-browser)),
  nor Integrated Windows Authentication. The best option in that case is to use device code flow. This flow is also used for applications without a browser, such as  iOT applications

  ![Browserless application](media/scenarios/device-code-flow-app.svg)

### Getting started

If you haven't already, create your first application by following the .NET desktop quickstart or the UWP quickstart:

> [!div class="nextstepaction"]
> [Quickstart: Acquire a token and call Microsoft Graph API from a Windows desktop app](./quickstart-v2-windows-desktop.md)


> [!div class="nextstepaction"]
> [Quickstart: Acquire a token and call Microsoft Graph API from a UWP app](./quickstart-v2-uwp.md)

### Specifics

Desktop applications have a number of specificities, which depends mainly on whether your application uses the interactive authentication or not.

## Next steps

> [!div class="nextstepaction"]
> [Desktop app - app registration](scenario-desktop-app-registration.md)
