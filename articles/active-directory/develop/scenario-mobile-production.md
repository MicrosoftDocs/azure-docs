---
title: Prepare mobile app-calling web APIs for production
description: Learn how to build a mobile app that calls web APIs. (Prepare apps for production.)
services: active-directory
author: henrymbuguakiarie
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/07/2019
ms.author: henrymbugua
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


[!INCLUDE [Common steps to move to production](./includes/scenarios/scenarios-production.md)]

## Next steps

To try out additional samples, [Mobile public client applications](sample-v2-code.md#mobile).