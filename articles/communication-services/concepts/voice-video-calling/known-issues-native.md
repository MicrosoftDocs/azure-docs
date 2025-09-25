---
title: Azure Communication Services - known issues in native SDKs
description: Learn more about Azure Communication Services known issues on Calling SDK.
author: sloanster
manager: chpalmer
services: azure-communication-services

ms.author: micahvivion
ms.date: 03/20/2024
ms.topic: conceptual
ms.service: azure-communication-services
---

# Known issues associated with the Azure Communication Services Calling Native and Native UI SDKs
This article provides known issues related to using the Azure Communication Services native calling SDKs.

## Issues with Android API emulators

When utilizing Android API emulators on Android 5.0 (API level 21) and Android 5.1 (API level 22), some crashes are expected.

## iPhone and iPad simulators not working if CallKit is enabled

CallKit only works if an application is deployed to real devices. In simulators, using CallKit will cause it to crash. Developers on simulators are encouraged to turn off CallKit in local development.

## Native SDK UI Library known issues

You can follow the known issues wiki page in the GitHub repositories.

- [Android](https://github.com/Azure/communication-ui-library-android/wiki/Known-Issues-Calling)
- [iOS](https://github.com/Azure/communication-ui-library-ios/wiki/Known-Issues-Calling)
