---
title: Azure Communication Services - best practices for Calling Native SDK
description: Learn more about Azure Communication Service best practices for Calling Native SDK.
author: garchiro7
manager: chpalmer
services: azure-communication-services

ms.author: jorgarcia
ms.date: 02/08/2024
ms.topic: include
ms.service: azure-communication-services
---

## Azure Communication Services native SDK best practices

This section provides information about best practices associated with the Azure Communication Services voice and video calling native SDK.

## Supported platforms

### Android Calling SDK support

- Support for Android API Level 21 or Higher.
- Support for Java 7 or higher.
- Support for Android Studio 2.0.
- **Android Auto** and **IoT devices running Android** are currently not supported.

### iOS Calling SDK support

- Support for iOS 10.0+ at build time, and iOS 12.0+ at run time.
- Xcode 12.0+.
- Support for **iPadOS** 13.0+.

### Windows SDK

- Support for UWP (Universal Windows Platform).
- Support for WinUI 3.

## App request device permissions

### Android permission

`android.permission.INTERNET` for network access.
`android.permission.ACCESS_NETWORK_STATE` for network access.
`android.permission.ACCESS_WIFI_STATE` for network access.
`android.permission.RECORD_AUDIO` for capturing audio during calls.
`android.permission.CAMERA` for accessing the camera for video calls.

### iOS permissions

- `NSMicrophoneUsageDescription` for microphone access.
- `NSCameraUsageDescription` for camera access.

### Windows permissions

Go to `Package.appxmanifest` and select capabilities:

- `Internet (Client)` & `Internet (Client & Server)` for network access.
- `Microphone` to access the audio feed of the microphone.
- `Webcam` to access the video feed of the camera.

## Configure the logs

Implementing **logging** as per the [logs file retrieval tutorial](../../tutorials/log-file-retrieval-tutorial.md) is more critical than ever. Detailed logs help in diagnosing issues specific to device models or OS versions that meet the minimum SDK criteria. We encourage to the developers that start configuring the Logs API.

## Subscribe to UFD (User Facing Diagnostics) and media quality statistics

- [User Facing Diagnostics (UFD)](../voice-video-calling/user-facing-diagnostics.md) that can be used to examine various properties of a call to determine what the issue might be during the call that affects your customers.
- [Media quality statistics](../voice-video-calling/media-quality-sdk.md) examine the low-level audio, video, and screen-sharing quality metrics for incoming and outgoing call metrics. We recommend that you collect the data and send it to your pipeline ingestion after your call ends.

## General memory management

**Preallocate Resources**. Initialize your calling client and any necessary resources during your app's startup phase rather than on demand. This approach reduces latency when starting a call.

**Dispose Properly**. Ensure that all call objects are correctly disposed of after use to free up system resources and avoid memory leaks.

## Camera being used by another process

On mobile devices, if a Process A requests the camera device and it's being used by Process B, then Process A will overtake the camera device and Process B stop using the camera device as default behavior.
