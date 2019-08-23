---
title: Microsoft Authentication Library (MSAL) for iOS & macOS  | Azure
description: 
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
ms.date: 08/23/2019
ms.author: twhitney
ms.reviewer: 
ms.custom: aaddev, identityplatformtop40
#Customer intent: As an application developer, I want to learn about the Microsoft Authentication Library for macOS and iOS differences so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# Microsoft Authentication Library for iOS and macOS differences

This article explains the differences in functionality between the Microsoft Authentication Library (MSAL) for iOS and macOS.

## General differences

MSAL for macOS is a subset of the functionality available for iOS.

MSAL for macOS doesn't support:

- different authentication types such as `ASWebAuthenticationSession`, `SFAuthenticationSession`, `SFSafariViewController`.
- brokered authentication flows. Conditional access scenarios that invoke Microsoft authenticator app are not supported on macOS.

MSAL Keychain support in macOS is more limited than on iOS. The keychain is not shared with other devices nor between apps from the same publisher. Use the legacy access control list to specify the paths to the apps that should share the keychain. The user may see more authentication prompts on macOS when you use keychain to cache tokens.

### Conditional access authentication differences

For conditional access scenarios, there will be fewer user prompts when you use MSAL for iOS. This is because iOS uses the broker app (Microsoft Authenticator) which negates the need, in some cases, to prompt the user.

### Project setup differences

**macOS**

- When you set up your project on macOS, ensure that your application is signed with a valid development certificate. MSAL will still work in the unsigned mode, but it will behave differently with regards to cache persistence.

**iOS**

- There are additional steps to setup your project to support authentication broker flow. The steps are called out in the tutorial.
- iOS projects need to register custom schemes in the pinfo.list. This isn't required on macOS.