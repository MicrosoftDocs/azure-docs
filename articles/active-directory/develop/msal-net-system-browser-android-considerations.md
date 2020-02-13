---
title: Xamarin Android system browser considerations (MSAL.NET) | Azure
titleSuffix: Microsoft identity platform
description: Learn about specific considerations when using system browsers on Xamarin Android with Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
author: TylerMSFT
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 10/30/2019
ms.author: twhitney
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about specific considerations when using Xamarin Android and MSAL.NET so I can decide if this platform meets my application development needs and requirements.
---

#  Xamarin Android system browser considerations with MSAL.NET

This article discusses specific considerations when using the system browser on Xamarin Android with the Microsoft Authentication Library for .NET (MSAL.NET).

Starting with MSAL.NET 2.4.0-preview, MSAL.NET supports browsers other than Chrome and no longer requires Chrome be installed on the Android device for authentication.

We recommend you use browsers that support custom tabs, such as these:

| Browsers with custom tabs support | Package Name |
|------| ------- |
|Chrome | com.android.chrome|
|Microsoft Edge | com.microsoft.emmx|
|Firefox | org.mozilla.firefox|
|Ecosia | com.ecosia.android|
|Kiwi | com.kiwibrowser.browser|
|Brave | com.brave.browser|

In addition to browsers with custom tabs support, based on our testing, a few browsers that don't support custom tabs will also work for authentication: Opera, Opera Mini, InBrowser, and Maxthon. For more information, read [table for test results](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/Android-system-browser#devices-and-browsers-tested).

## Known issues

- If the user has no browser enabled on the device, MSAL.NET will throw an `AndroidActivityNotFound` Exception. 
  - **Mitigation**: Inform the user that they should enable a browser (preferably one with custom tabs support) on their device.

- If authentication fails (ex. authentication launches with DuckDuckGo), MSAL.NET will return an `AuthenticationCanceled MsalClientException`. 
  - **Root Problem**: A browser with custom tabs support was not enabled on the device. Authentication launched with an alternate browser, which wasn't able to complete authentication. 
  - **Mitigation**: Inform the user that they should install a browser (preferably one with custom tab support) on their device.

## Devices and browsers tested
The following table lists the devices and browsers that have been tested.

| | Browser&ast;     |  Result  | 
| ------------- |:-------------:|:-----:|
| Huawei/One+ | Chrome&ast; | Pass|
| Huawei/One+ | Edge&ast; | Pass|
| Huawei/One+ | Firefox&ast; | Pass|
| Huawei/One+ | Brave&ast; | Pass|
| One+ | Ecosia&ast; | Pass|
| One+ | Kiwi&ast; | Pass|
| Huawei/One+ | Opera | Pass|
| Huawei | OperaMini | Pass|
| Huawei/One+ | InBrowser | Pass|
| One+ | Maxthon | Pass|
| Huawei/One+ | DuckDuckGo | User canceled auth|
| Huawei/One+ | UC Browser | User canceled auth|
| One+ | Dolphin | User canceled auth|
| One+ | CM browser | User canceled auth|
| Huawei/One+ | none installed | AndroidActivityNotFound ex|

&ast; Supports custom tabs

## Next steps
For code snippets and additional information on using system browser with Xamarin Android, read this [guide](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/MSAL.NET-uses-web-browser#choosing-between-embedded-web-browser-or-system-browser-on-xamarinandroid).  