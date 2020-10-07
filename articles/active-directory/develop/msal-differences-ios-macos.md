---
title: MSAL for iOS & macOS differences | Azure
titleSuffix: Microsoft identity platform
description: Describes Microsoft Authentication Library (MSAL) usage differences between iOS and macOS.
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 08/28/2019
ms.author: marsma
ms.reviewer: oldalton
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about the Microsoft Authentication Library for macOS and iOS differences so I can decide if this platform meets my application development needs and requirements.
---

# Microsoft Authentication Library for iOS and macOS differences

This article explains the differences in functionality between the Microsoft Authentication Library (MSAL) for iOS and macOS.

> [!NOTE]
> On the Mac, MSAL only supports macOS apps.

## General differences

MSAL for macOS is a subset of the functionality available for iOS.

MSAL for macOS doesn't support:

- different browser types such as `ASWebAuthenticationSession`, `SFAuthenticationSession`, `SFSafariViewController`.
- brokered authentication through Microsoft Authenticator app is not supported for macOS.

Keychain sharing between apps from the same publisher is more limited on macOS 10.14 and earlier. Use [access control lists](https://developer.apple.com/documentation/security/keychain_services/access_control_lists?language=objc) to specify the paths to the apps that should share the keychain. User may see additional keychain prompts.

On macOS 10.15+, MSAL's behavior is the same between iOS and macOS. MSAL uses [keychain access groups](https://developer.apple.com/documentation/security/keychain_services/keychain_items/sharing_access_to_keychain_items_among_a_collection_of_apps?language=objc) for keychain sharing. 

### Conditional access authentication differences

For Conditional Access scenarios, there will be fewer user prompts when you use MSAL for iOS. This is because iOS uses the broker app (Microsoft Authenticator) which negates the need to prompt the user in some cases.

### Project setup differences

**macOS**

- When you set up your project on macOS, ensure that your application is signed with a valid development or production certificate. MSAL still works in the unsigned mode, but it will behave differently with regards to cache persistence. The app should only be run unsigned for debugging purposes. If you distribute the app unsigned, it will:
1. On 10.14 and earlier, MSAL will prompt the user for a keychain password every time they restart the app.
2. On 10.15+, MSAL will prompt user for credentials for every token acquisition. 

- macOS apps don't need to implement the AppDelegate call.

**iOS**

- There are additional steps to set up your project to support authentication broker flow. The steps are called out in the tutorial.
- iOS projects need to register custom schemes in the info.plist. This isn't required on macOS.
