---
ms.date: 08/08/2024
ms.topic: quickstart
titleSuffix: Azure Communication Services Calling and Chat SDK
author: sanathr
title: Calling and Chat SDK in an Android application
ms.author: sanathr
ms.service: azure-communication-services
description: How to use both Calling and Chat SDK together in an Android application.
---
# Add Calling and Chat SDK in an Android application

This tutorial describes how Contoso can integrate both Calling and Chat SDK in an Android application.

## Current limitation

With Android Calling SDK versions below `2.11.0`, building an Android application with both the Calling and Chat SDK's resulted in the following errors:

```
Duplicate class com.skype.rt.XXX found in modules jetified-azure-communication-calling-1.2.0-runtime (com.azure.android:azure-communication-calling:1.2.0) and jetified-trouter-client-android-0.1.1-runtime (com.microsoft:trouter-client-android:0.1.1)

2 files found with path 'lib/x86/libc++_shared.so' from inputs: - …\.gradle\...-azure-communication-calling-1.2.0\jni\x86\libc++_shared.so - …\.gradle\...-trouter-client-android-9.1.1\jni\x86\libc++_shared.so
```

This issue was caused by conflicting `.jar` and `.so` files included in the Calling SDK package `com.azure.android:azure-communication-calling` and a transitive dependency package that the Chat SDK package `com.azure.android:azure-communication-chat` imports, `com.microsoft:trouter-client-android`.

## Solution
Starting from Android Calling SDK version `2.11.0`, support has been added for Contoso to run both the Calling and Chat SDK's in the same Android application. This was achieved by making the Calling SDK depend on `com.microsoft:trouter-client-android` and removing the conflicting `.jar` and `.so` files included in the Calling SDK.

## Implementation steps

Specify the version of the Android Calling and Chat SDK in your application's Gradle build file as shown in the example below:

   ```gradle
    implementation ('com.azure.android:azure-communication-calling:2.11.0')
    implementation ('com.azure.android:azure-communication-chat:2.0.3') {
        exclude group: 'com.microsoft', module: 'trouter-client-android'
    }
   ```

The version of `com.azure.android:azure-communication-chat` can be any version, the latest release version is used here as an example. However, the version of the Trouter package `com.microsoft:trouter-client-android` included with the Chat SDK `com.azure.android:azure-communication-chat` needs to be excluded. When the application is built, the Trouter package version included by the Calling SDK package `com.azure.android:azure-communication-calling` will be used.

## Next Steps
Quickstart sample is available in GitHub [Android QuickStarts](https://github.com/Azure-Samples/communication-services-android-quickstarts.git) under `Add-Chat-Calling` folder and follow the `README.md` on instructions how to run the sample.
