---
title: Configure keychain | Microsoft identity platform
description: Learn how to configure keychain so that your app can cache tokens in the keychain.
services: active-directory
documentationcenter: ''
author: TylerMSFT
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/22/2019
ms.author: twhitney
ms.reviewer: ''
ms.custom: aaddev
ms.collection: M365-identity-device-management
---

# Configure keychain

When the [Microsoft Authentication Library for iOS and macOS](msal-overview.md) (MSAL) signs in a user, or refreshes a token, it tries to cache the token in the keychain.

This article covers how to configure app entitlements so that MSAL can write cached tokens to iOS keychain.

## Default keychain access group

MSAL uses the `com.microsoft.adalcache` access group by default. This is the shared access group used by both MSAL and Azure AD Authentication Library (ADAL) SDKs and ensures the best single sign-on (SSO) experience between multiple apps from the same publisher.

Add the `com.microsoft.adalcache` keychain group to your app's entitlement under **Project settings** -> **Capabilities** -> **Keychain sharing**

## Custom keychain access group

If you'd like to use a different keychain access group, you can pass your custom group when creating `MSALPublicClientApplicationConfig` before creating `MSALPublicClientApplication`, like this:

```objc
MSALAuthority *authority;
MSALPublicClientApplicationConfig *config = [[MSALPublicClientApplicationConfig alloc] initWithClientId:@"your-client-id"
                                                                                            redirectUri:@"your-redirect-uri"
                                                                                                authority:authority];

config.cacheConfig.keychainSharingGroup = @"custom-group";
```

## Disable keychain sharing

If you don't want to share SSO state between multiple apps, or use any keychain access group, disable keychain sharing by passing the application bundle ID as your keychainGroup:

```objc
    config.cacheConfig.keychainSharingGroup = [[NSBundle mainBundle] bundleIdentifier];
```

## Handle -34018 failed to set item into keychain errors

Error -34018 this normally means that the keychain hasn't been configured correctly. Ensure the keychain access group that has been configured in MSAL matches the ones configured in entitlements.

## Next steps

Learn more about keychain access groups in Apple's [Sharing Access to Keychain Items Among a Collection of Apps](https://developer.apple.com/documentation/security/keychain_services/keychain_items/sharing_access_to_keychain_items_among_a_collection_of_apps?language=objc) article.