---
title: Configure keychain 
titleSuffix: Microsoft identity platform
description: Learn how to configure keychain so that your app can cache tokens in the keychain.
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: how-to
ms.date: 08/28/2019
ms.author: marsma
ms.reviewer: oldalton
ms.custom: aaddev
---

# Configure keychain

When the [Microsoft Authentication Library for iOS and macOS](msal-overview.md) (MSAL) signs in a user, or refreshes a token, it tries to cache tokens in the keychain. Caching tokens in the keychain allows MSAL to provide silent single sign-on (SSO) between multiple apps that are distributed by the same Apple developer. SSO is achieved via the keychain access groups functionality. For more information, see Apple's [Keychain Items documentation](https://developer.apple.com/documentation/security/keychain_services/keychain_items/sharing_access_to_keychain_items_among_a_collection_of_apps?language=objc).

This article covers how to configure app entitlements so that MSAL can write cached tokens to iOS and macOS keychain.

## Default keychain access group

### iOS

MSAL on iOS uses the `com.microsoft.adalcache` access group by default. This is the shared access group used by both MSAL and Azure AD Authentication Library (ADAL) SDKs and ensures the best single sign-on (SSO) experience between multiple apps from the same publisher.

On iOS, add the `com.microsoft.adalcache` keychain group to your app's entitlement in XCode under **Project settings** > **Capabilities** > **Keychain sharing**

### macOS

MSAL on macOS uses `com.microsoft.identity.universalstorage` access group by default.

Due to macOS keychain limitations, MSAL's `access group` doesn't directly translate to the keychain access group attribute (see [kSecAttrAccessGroup](https://developer.apple.com/documentation/security/ksecattraccessgroup?language=objc)) on macOS 10.14 and earlier. However, it behaves similarly from a SSO perspective by ensuring that multiple applications distributed by the same Apple developer can have silent SSO.

On macOS 10.15 onwards (macOS Catalina), MSAL uses keychain access group attribute to achieve silent SSO, similarly to iOS.

## Custom keychain access group

If you'd like to use a different keychain access group, you can pass your custom group when creating `MSALPublicClientApplicationConfig` before creating `MSALPublicClientApplication`, like this:

# [Objective-C](#tab/objc)

```objc
MSALPublicClientApplicationConfig *config = [[MSALPublicClientApplicationConfig alloc] initWithClientId:@"your-client-id"
                                                                                            redirectUri:@"your-redirect-uri"
                                                                                              authority:nil];
    
config.cacheConfig.keychainSharingGroup = @"custom-group";
    
MSALPublicClientApplication *application = [[MSALPublicClientApplication alloc] initWithConfiguration:config error:nil];
    
// Now call acquiretoken. 
// Tokens will be saved into the "custom-group" access group
// and only shared with other applications declaring the same access group
```

# [Swift](#tab/swift)

```swift
let config = MSALPublicClientApplicationConfig(clientId: "your-client-id",
                                            redirectUri: "your-redirect-uri",
                                              authority: nil)
config.cacheConfig.keychainSharingGroup = "custom-group"
        
do {
  let application = try MSALPublicClientApplication(configuration: config)
  // continue on with application          
} catch let error as NSError {
  // handle error here
}       
```

---

## Disable keychain sharing

If you don't want to share SSO state between multiple apps, or use any keychain access group, disable keychain sharing by passing the application bundle ID as your keychainGroup:

# [Objective-C](#tab/objc)

```objc
config.cacheConfig.keychainSharingGroup = [[NSBundle mainBundle] bundleIdentifier];
```

# [Swift](#tab/swift)

```swift
if let bundleIdentifier = Bundle.main.bundleIdentifier {
    config.cacheConfig.keychainSharingGroup = bundleIdentifier
}
```

---

## Handle -34018 error (failed to set item into keychain)

Error -34018 normally means that the keychain hasn't been configured correctly. Ensure the keychain access group that has been configured in MSAL matches the one configured in entitlements.

## Ensure your application is properly signed

On macOS, applications can execute without being signed by developer. While most of MSAL's functionality will continue to work, SSO through keychain access requires application to be signed. If you're experiencing multiple keychain prompts, make sure your application's signature is valid.

## Next steps

Learn more about keychain access groups in Apple's [Sharing Access to Keychain Items Among a Collection of Apps](https://developer.apple.com/documentation/security/keychain_services/keychain_items/sharing_access_to_keychain_items_among_a_collection_of_apps?language=objc) article.
