---
title: Common steps for public client migration to MSAL
description: Include file that explains the common steps you need to take for all public client apps when it comes to migration from ADAL to MSAL.
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: include
ms.date: 09/08/2021
ms.author: cwerner
ms.reviewer: jmprieur, sahmalik
ms.custom: aaddev
---

The following steps for updating code apply across all the confidential client scenarios:

1. Add the MSAL.NET namespace in your source code: `using Microsoft.Identity.Client;`.
2. Instead of instantiating `AuthenticationContext`, use `PublicClientApplicationBuilder.Create` to instantiate `IPublicClientApplication`.
3. Instead of the `resourceId` string, MSAL.NET uses scopes. Because applications that use ADAL.NET are preauthorized, you can always use the following scopes: `new string[] { $"{resourceId}/.default" }`.
4. Replace the call to `AuthenticationContext.AcquireTokenAsync` with a call to `IPublicClientApplication.AcquireTokenXXX`, where *XXX* depends on your scenario.