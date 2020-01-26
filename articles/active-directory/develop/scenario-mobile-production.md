---
title: Move mobile app calling web APIs to production - Microsoft identity platform | Azure
description: Learn how to build a mobile app that calls web APIs (move to production)
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
ms.reviwer: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a mobile app that calls web APIs by using the Microsoft identity platform for developers.
---

# Mobile app that calls web APIs - move to production

This article provides details about how to improve the quality and reliability of your app before you move it to production.

## Handling errors in mobile applications

A number of error conditions can occur in your app at this point. The main scenarios to handle are silent failures and fallbacks to interaction. Other conditions that you should consider for production include no-network situations, service outages, requirements for admin consent, and other scenario-specific cases.

Each MSAL library has sample code and wiki content that describes how to handle these conditions:

- [MSAL Android Wiki](https://github.com/AzureAD/microsoft-authentication-library-for-android)
- [MSAL iOS Wiki](https://github.com/AzureAD/microsoft-authentication-library-for-objc/wiki)
- [MSAL.NET Wiki](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki)

## Mitigating and investigating issues

To diagnose issues in your app, it helps to collect data. For information about the kinds of data you can collect, see the MSAL platform wikis.

- Users might ask for help when they encounter problems. A best practice is to capture and temporarily store logs and provide a location where users can upload them. MSAL provides logging extensions to capture detailed information about authentication.
- If it's available, enable telemetry through MSAL to gather data about how users are signing in to your app.

## Next steps

[!INCLUDE [Move to production common steps](../../../includes/active-directory-develop-scenarios-production.md)]

Try out additional samples available from [Samples | Desktop and mobile public client apps](sample-v2-code.md#desktop-and-mobile-public-client-apps)
