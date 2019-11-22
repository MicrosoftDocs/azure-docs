---
title: Get and remove accounts from the token cache using MSAL for Java (MSAL4j)
titleSuffix: Microsoft identity platform
description: Learn how to view and remove accounts from the token cache using the Microsoft Authentication Library for Java.
services: active-directory
documentationcenter: dev-center-name
author: sangonzal
manager: henrikm
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/07/2019
ms.author: sagonzal
ms.reviewer: navyasri.canumalla
ms.custom: aaddev
#Customer intent: As an application developer using the Microsoft Authentication Library for Java (MSAL4J), I want to learn how to get and remove accounts stored in the token cache.
ms.collection: M365-identity-device-management
---

# Get and remove accounts from the token cache using MSAL for Java (MSAL4j)

MSAL4J provides an in-memory token cache by default. The in-memory token cache lasts the duration of the application instance.

## See which accounts are in the cache

You can check what accounts are in the cache by calling `PublicClientApplication.getAccounts()` as shown in the following example:

```java
PublicClientApplication pca = new PublicClientApplication.Builder(
                labResponse.getAppId()).
                authority(TestConstants.ORGANIZATIONS_AUTHORITY).
                build();

Set<IAccount> accounts = pca.getAccounts().join();
```

## Remove accounts from the cache

To remove an account from the cache, find the account that needs to be removed and then call `PublicClientApplicatoin.removeAccount()` as shown in the following example:

```java
Set<IAccount> accounts = pca.getAccounts().join();

IAccount accountToBeRemoved = accounts.stream().filter(
                x -> x.username().equalsIgnoreCase(
                        UPN_OF_USER_TO_BE_REMOVED)).findFirst().orElse(null);

pca.removeAccount(accountToBeRemoved).join();
```

## Learn more

If you are using MSAL for Java, learn about [Custom token cache serialization in MSAL for Java](msal-java-token-cache-serialization.md).
