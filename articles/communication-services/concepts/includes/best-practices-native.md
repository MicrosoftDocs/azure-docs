---
title: Azure Communication Services - best practices for Calling Native SDK
description: Learn about Azure Communication Services best practices for the Calling Native SDK.
author: garchiro7
manager: chpalmer
services: azure-communication-services

ms.author: jorgarcia
ms.date: 02/08/2024
ms.topic: include
ms.service: azure-communication-services
---

## Best practices for the Azure Communication Services Calling Native SDK

This section provides information about best practices associated with the Azure Communication Services Calling Native SDK for voice and video calling.

### Supported platforms

Here are the minimum OS platform requirements to ensure optimal functionality of the Calling Native SDK.

#### [iOS](#tab/ios)

- Support for iOS 10.0+ at build time and iOS 12.0+ at runtime
- Xcode 12.0+
- Support for iPadOS 13.0+

#### [Android](#tab/android)

- Support for Android API Level 21 or higher
- Support for Java 7 or later
- Support for Android Studio 2.0

We highly recommend that you identify and validate your scenario by using the information in [Android platform support](../sdk-options.md?#android-platform-support).

#### [Windows](#tab/windows)

- Support for Universal Windows Platform (UWP)
- Support for WinUI 3

---

### Verify device permissions for app requests

To use the Calling Native SDK for making or receiving calls, consumers need to authorize each platform to access device resources. As a developer, you must prompt the user for access and ensure that permissions are enabled. The consumer authorizes these access rights, so verify that they currently have the required permissions.

#### [iOS](#tab/ios)

- `NSMicrophoneUsageDescription` for microphone access
- `NSCameraUsageDescription` for camera access

#### [Android](#tab/android)

In the application manifest (`app/src/main/AndroidManifest.xml`), verify the following lines:

```xml
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />
```

#### [Windows](#tab/windows)

Go to `Package.appxmanifest` and select capabilities:

- `Internet (Client)` and `Internet (Client & Server)` for network access
- `Microphone` to access the audio feed of the microphone
- `Webcam` to access the video feed of the camera

---

### Configure the logs

Implementing logging as described in the [tutorial about retrieving log files](../../tutorials/log-file-retrieval-tutorial.md) is more critical than ever. Detailed logs help in diagnosing problems specific to device models or OS versions that meet the minimum SDK criteria. We encourage developers to configure logs by using the Logs API. Without the logs, the Microsoft support team can't help debug and troubleshoot the calls.

### Track CallID

`CallID` is the unique ID for a call. It identifies correlated events from all of the participants and endpoints that connect during a single call. In most cases, you use it to review the logs. The Microsoft Support team asks for it to help troubleshoot the calls.

You should track the `CallID` value in the telemetry that you configure in your app. To understand how to retrieve the value for each platform, follow the guidelines in the [troubleshooting guide](../troubleshooting-info.md).

### Subscribe to User Facing Diagnostics and media quality statistics

You can use these Azure Communication Services features to help improve the user experience:

- [User Facing Diagnostics](../voice-video-calling/user-facing-diagnostics.md): Examine properties of a call to determine the cause of problems that affect your customers.
- [Media quality statistics](../voice-video-calling/media-quality-sdk.md): Examine the low-level audio, video, and screen-sharing quality metrics for incoming and outgoing call metrics. We recommend that you collect the data and send it to your pipeline ingestion after a call ends.

### Manage error handling

If there are any errors during the call or implementation, the methods return error objects that contain error codes. It's crucial to use these error objects for proper error handling and to display alerts. The call states also return error codes to help identify the reasons behind call failures. You can refer to the [troubleshooting guide](../troubleshooting-info.md) to resolve any problems.

### Manage video streams

Be sure to dispose of `VideoStreamRendererView` when the UI no longer displays the video. Use `VideoStreamType` to determine the type of the stream.

### Conduct general memory management

**Preallocate resources**. Initialize your calling client and any necessary resources during your app's startup phase rather than on demand. This approach reduces latency in starting a call.

**Dispose properly**. Dispose of all call objects after use, to free up system resources and avoid memory leaks. Be sure to unsubscribe from *events* that might cause memory leaks.

### Consider how processes access the camera or microphone

On mobile devices, if multiple processes try to access the camera or microphone at the same time, the first process to request access takes control of the device. As a result, the second process immediately loses access to it.

### Optimize library size

Optimizing the size of libraries in software development is crucial for the following reasons, particularly as applications become more complex and resource intensive:

- **Application performance**: Smaller libraries reduce the amount of code that an application must load, parse, and execute. This reduction can significantly enhance the startup time and overall performance of your application, especially on devices that have limited resources.

- **Memory usage**: By minimizing library size, you can decrease the runtime memory footprint of an application. This decrease is important for mobile devices, where memory is often constrained. Lower memory usage can lead to fewer system crashes and better multitasking performance.

For more information, see:

- [UI Library for iOS](https://github.com/Azure/communication-ui-library-ios/wiki/Calling-Composite-Demo-Application-Size)
- [UI Library for Android](https://github.com/Azure/communication-ui-library-android/wiki/Calling-Composite-Demo-Application-Size)
