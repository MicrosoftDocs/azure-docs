---
title: mobile app that calls Web APIs - move to production | Azure
description: Learn how to build a mobile app that calls Web APIs (move to production)
services: active-directory
documentationcenter: dev-center-name
author: dadobali
manager: CelesteDG
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/19/2019
ms.author: dadobali
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a mobile app that calls Web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Mobile app that calls web APIs - move to production

This article provides details on improving the quality and reliability of your app to move it to production. 

## Handling errors in mobile applications

In the different flows we've highlighted so far, there are a variety of error conditions that can be caused. The primary scenario to handle is silent failures and fallback to interaction. There are additional conditions you should also consider for production including no network situations, service outages, admin consent required, and other scenario-specific cases. 

Each MSAL library has sample code and wiki content that dives deeper into handling these conditions.

[MSAL Android Wiki](https://github.com/AzureAD/microsoft-authentication-library-for-android)
[MSAL iOS Wiki](https://github.com/AzureAD/microsoft-authentication-library-for-objc/wiki)
[MSAL.NET Wiki](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki)

## Mitigating and investigating issues

Collecting data will help your app diagnose issues. For more detail on the type of data you can collect, see each MSAL platforms wiki.

- Users may ask for help when encountering a problem. A best practice is to capture and store logs temporarily, and allow users to upload them somewhere. MSAL provies logging extensions to capture detailed information about Auth. 
- If available, enable telemetry through MSAL to gather data about how users are signing into your app. 

## Testing your app

Be sure to test your app against the [Integration check list](active-directory-integration-checklist.md).

## Next steps

[!INCLUDE [Move to production common steps](../../../includes/active-directory-develop-scenarios-production.md)]
