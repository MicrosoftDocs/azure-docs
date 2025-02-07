---
ms.date: 08/08/2024
ms.topic: how-to
titleSuffix: Azure Communication Services Calling SDK and Chat SDK
author: sanathr
title: Add the Calling and Chat SDKs in an Android application
ms.author: sanathr
ms.service: azure-communication-services
description: Learn how to use the Calling SDK and the Chat SDK together in an Android application.
---
# Add the Calling and Chat SDKs in an Android application

This article describes how you can integrate the Azure Communication Services Calling SDK and Chat SDK in an Android application.

## Problem

With versions of the Calling SDK earlier than `2.11.0`, building an Android application with both the Calling and Chat SDKs resulted in the following errors:

```
Duplicate class com.skype.rt.XXX found in modules jetified-azure-communication-calling-1.2.0-runtime (com.azure.android:azure-communication-calling:1.2.0) and jetified-trouter-client-android-0.1.1-runtime (com.microsoft:trouter-client-android:0.1.1)

2 files found with path 'lib/x86/libc++_shared.so' from inputs: - …\.gradle\...-azure-communication-calling-1.2.0\jni\x86\libc++_shared.so - …\.gradle\...-trouter-client-android-9.1.1\jni\x86\libc++_shared.so
```

This problem had two causes:

- Conflicting `.jar` and `.so` files included in the Calling SDK package `com.azure.android:azure-communication-calling`
- A transitive dependency package that the Chat SDK package `com.azure.android:azure-communication-chat` imports, `com.microsoft:trouter-client-android`

## Solution

From Calling SDK version `2.11.0` onward, you can integrate both the Calling and Chat SDKs within the same Android application. The `2.11.0` version solved the problem by:

- Eliminating the conflicting `.jar` and `.so` files.
- Making the Calling SDK rely on the `com.microsoft:trouter-client-android` package, similar to the Chat SDK's dependency on the Trouter package.

## Implementation

Specify the version of the Calling and Chat SDKs for Android in your application's Gradle build file, as shown in this example:

   ```gradle
    implementation ('com.azure.android:azure-communication-calling:2.11.0')
    implementation ('com.azure.android:azure-communication-chat:2.0.3') {
        exclude group: 'com.microsoft', module: 'trouter-client-android'
    }
   ```

The example uses the latest release version of the Chat SDK package `com.azure.android:azure-communication-chat`, but you can use any version.

The version of the Trouter package `com.microsoft:trouter-client-android` that's included with the Chat SDK package `com.azure.android:azure-communication-chat` needs to be excluded. When the application is built, it will use the Trouter package version included by the Calling SDK package `com.azure.android:azure-communication-calling`.

## Related content

- A quickstart sample is available in the [GitHub repository for Android quickstarts](https://github.com/Azure-Samples/communication-services-android-quickstarts.git), in the `Add-Chat-Calling` folder. For instructions on how to run the sample, follow the `README.md` file.
