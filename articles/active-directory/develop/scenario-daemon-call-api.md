---
title: Daemon app calling web APIs (calling web APIs) - Microsoft identity platform
description: Learn how to build a daemon app that calls web APIs (calling web APIs)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a daemon app that can call web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Daemon app that calls web APIs - call a web API from the app

A daemon app can call a web API from a .NET daemon application or call several pre-approved web APIs.

## Calling a web API from a .NET daemon application

[!INCLUDE [Call web API in .NET](../../../includes/active-directory-develop-scenarios-call-apis-dotnet.md)]

<!--
More includes will come later for Python and Java
-->

## Calling several APIs

For daemon apps, the web APIs that you call need to be pre-approved. There won't be any incremental consent with daemon apps (there's no user interaction). The tenant admin needs to pre-consent the application and all the API permissions. If you want to call several APIs, you'll need to acquire a token for each resource, each time calling `AcquireTokenForClient`. MSAL will use the application token cache to avoid unnecessary service calls.

## Next steps

> [!div class="nextstepaction"]
> [Daemon app - move to production](./scenario-daemon-production.md)