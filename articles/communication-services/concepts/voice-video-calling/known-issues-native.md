---
title: Azure Communication Services - known issues in native SDK's
description: Learn more about Azure Communication Services known issues on Calling SDK.
author: sloanster
manager: chpalmer
services: azure-communication-services

ms.author: micahvivion
ms.date: 03/20/2024
ms.topic: include
ms.service: azure-communication-services
---

# The following sections provide information about known issues associated with the Azure Communication Services Calling Native and Native UI SDKs.

## Issues with Android API emulators

When utilizing Android API emulators on Android 5.0 (API level 21) and Android 5.1 (API level 22), some crashes are expected.  

## Android Trouter module conflicts

When the Android Chat and Calling SDK are together in the same application, Chat SDK's real-time notifications feature doesn't work. You might get a dependency resolving issue.

While we're working on a solution, you can turn off real-time notifications feature by adding the following dependency information in app's build.gradle file and instead poll the GetMessages API to display incoming messages to users.

**Java**
```java
 implementation ("com.azure.android:azure-communication-chat:1.0.0") {
     exclude group: 'com.microsoft', module: 'trouter-client-android'
 }
 implementation 'com.azure.android:azure-communication-calling:1.0.0'
 ```
 
> [!NOTE]
> If your application tries to touch any of the notification APIs like `chatAsyncClient.startRealtimeNotifications()` or `chatAsyncClient.addEventHandler()`, you will see a runtime error.

## iOS ongoing video Picture in Picture (PiP)

Incoming video stops when app goes to background. If the application is in foreground the video renders correctly.

## UI Library

You can follow the known issues wiki page in the GitHub repositories.

- [Android](https://github.com/Azure/communication-ui-library-android/wiki/Known-Issues-Calling)
- [iOS](https://github.com/Azure/communication-ui-library-ios/wiki/Known-Issues-Calling)
