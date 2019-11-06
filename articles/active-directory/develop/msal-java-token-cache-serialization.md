---
title: Acquire and cache tokens using MSAL
titleSuffix: Microsoft identity platform
description: Learn about acquiring and caching tokens using the Microsoft Authentication Library (MSAL).
services: active-directory
documentationcenter: dev-center-name
author: TylerMSFT
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 10/30/2019
ms.author: twhitney
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about acquiring and caching tokens so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# Acquire and cache tokens using the Microsoft authentication library (MSAL)

In MSAL4J, an in-memory token cache is provided by default. The in-memory token cache lasts for the duration of the application. 

### Checking what accounts are in the cache

You can check what accounts are in the cache by calling *PublicClientApplication.getAccounts()*

```Java
PublicClientApplication pca = new PublicClientApplication.Builder(
                labResponse.getAppId()).
                authority(TestConstants.ORGANIZATIONS_AUTHORITY).
                build();

Set<IAccount> accounts = pca.getAccounts().join();
```

### Removing accounts from the cache

For removing accounts from the cache, first find the account that needs to be removed, and then call *PublicClientApplicatoin.removeAccount()*

```Java
Set<IAccount> accounts = pca.getAccounts().join();

IAccount accountToBeRemoved = accounts.stream().filter(
                x -> x.username().equalsIgnoreCase(
                        UPN_OF_USER_TO_BE_REMOVED)).findFirst().orElse(null);

pca.removeAccount(accountToBeRemoved).join();