---
title: Global sign-out
titleSuffix: Microsoft identity platform
description: Learn how to sign out a user on a device that is using shared device mode 
services: active-directory
author: TylerMSFT
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 01/15/2020
ms.author: twhitney
ms.reviewer: hahamil
ms.custom: aaddev
ms.collection: M365-identity-device-management
---

# Shared device global sign-out

When a user signs out, you will need to take action to protect the privacy and data of the user. For example, if you're building a medical records app, you'll want to make sure that when the user signs out that previously displayed patient records are cleared. Your application must be prepared for this and check every time it enters the foreground. 

When your app uses MSAL to sign out the user in an app running on device that is in shared mode, the signed-in account and cached tokens are removed from both the app and the device.

## Determine if the user has changed



## Globally sign the user out



## Next steps
