---
title: Azure Communication Services - known issues in native SDKs
description: Learn more about Azure Communication Services known issues on Calling SDK.
author: sloanster
manager: chpalmer
services: azure-communication-services

ms.author: micahvivion
ms.date: 03/20/2024
ms.topic: include
ms.service: azure-communication-services
---

# Known issues associated with the Azure Communication Services Calling Native and Native UI SDKs.
This article provides known issues related to using the Azure Communication Services native calling SDKs.

## Issues with Android API emulators

When utilizing Android API emulators on Android 5.0 (API level 21) and Android 5.1 (API level 22), some crashes are expected.  

## Android chat and calling conflicts

You can't use Azure Communication Services chat and calling Android SDK at the same time, the chat real-time notifications feature doesn't work. You might get a dependency resolving issue.

To resolve this issue, you can turn off real-time notifications by adding the following dependency information in your app's build.gradle file and instead poll the GetMessages API to display incoming messages to end users.

**Java**
```java
 implementation ("com.azure.android:azure-communication-chat:1.0.0") {
     exclude group: 'com.microsoft', module: 'trouter-client-android'
 }
 implementation 'com.azure.android:azure-communication-calling:1.0.0'
 ```
 
> [!NOTE]
> If your application uses the notification APIs like `chatAsyncClient.startRealtimeNotifications()` or `chatAsyncClient.addEventHandler()`, you will see a runtime error.

## iOS ongoing video Picture in Picture (PiP)

Incoming video stops when app goes to background. If the application is in foreground the video renders correctly.

## Native SDK UI Library known issues

You can follow the known issues wiki page in the GitHub repositories.

- [Android](https://github.com/Azure/communication-ui-library-android/wiki/Known-Issues-Calling)
- [iOS](https://github.com/Azure/communication-ui-library-ios/wiki/Known-Issues-Calling)
