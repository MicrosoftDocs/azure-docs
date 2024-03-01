---
title: Azure Communication Services - known issues
description: Learn more about Azure Communication Services known issues on Calling SDK
author: garchiro7
manager: chpalmer
services: azure-communication-services

ms.author: jorgarcia
ms.date: 02/08/2024
ms.topic: include
ms.service: azure-communication-services
---

## Android API emulators
When utilizing Android API emulators on Android 5.0 (API level 21) and Android 5.1 (API level 22), some crashes are expected.  

## Android Trouter module conflict
Known issue: When using Android Chat and Calling SDK together in the same application, Chat SDK's real-time notifications feature does not work. You might get a dependency resolving issue.

While we are working on a solution, you can turn off real-time notifications feature by adding the following dependency information in app's build.gradle file and instead poll the GetMessages API to display incoming messages to users.
 
**Java**
```java
 implementation ("com.azure.android:azure-communication-chat:1.0.0") {
     exclude group: 'com.microsoft', module: 'trouter-client-android'
 }
 implementation 'com.azure.android:azure-communication-calling:1.0.0'
 ```
 
Note with above update, if the application tries to touch any of the notification API like `chatAsyncClient.startRealtimeNotifications()` or `chatAsyncClient.addEventHandler()`, there will be a runtime error.

## iOS ongoing video Picture in Picture (PiP)

- Incomming video stops when app goes to background. If the application is in foreground the video renders correctly.

## UI Library

You can follow the known issues wiki page in the GitHub repositories.

- [Android](https://github.com/Azure/communication-ui-library-android/wiki/Known-Issues-Calling)
- [iOS](https://github.com/Azure/communication-ui-library-ios/wiki/Known-Issues-Calling)
