---
title: Prepare mobile app-calling web APIs for production | Azure
titleSuffix: Microsoft identity platform
description: Learn how to build a mobile app that calls web APIs. (Prepare apps for production.)
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.reviewer: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a mobile app that calls web APIs by using the Microsoft identity platform for developers.
---

# Prepare mobile apps for production

This article provides details about how to improve the quality and reliability of your mobile app before you move it to production.

## Handle errors

As you prepare a mobile app for production, several error conditions can occur. The main cases you'll handle are silent failures and fallbacks to interaction. Other conditions that you should consider include no-network situations, service outages, requirements for admin consent, and other scenario-specific cases.

For each Microsoft Authentication Library (MSAL) type, you can find sample code and wiki content that describes how to handle error conditions:

- [MSAL Android wiki](https://github.com/AzureAD/microsoft-authentication-library-for-android)
- [MSAL iOS wiki](https://github.com/AzureAD/microsoft-authentication-library-for-objc/wiki)
- [MSAL.NET wiki](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki)

## Mitigate and investigate issues

To better diagnose issues in your app, collect data. For information about the kinds of data that you can collect, see [Logging in MSAL applications](https://docs.microsoft.com/azure/active-directory/develop/msal-logging).

Here are some suggestions for data collection:

- Users might ask for help when they have problems. A best practice is to capture and temporarily store logs. Provide a location where users can upload the logs. MSAL provides logging extensions to capture detailed information about authentication.

- If telemetry is available, enable it through MSAL to gather data about how users sign in to your app.

## Next steps

[!INCLUDE [Common steps to move to production](../../../includes/active-directory-develop-scenarios-production.md)]

To try out additional samples, see [Desktop and mobile public client apps](sample-v2-code.md#desktop-and-mobile-public-client-apps).
