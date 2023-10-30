---
title: Xamarin Android system browser considerations (MSAL.NET)
description: Learn about considerations for using system browsers on Xamarin Android with the Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
author: henrymbuguakiarie
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 10/30/2019
ms.author: henrymbugua
ms.reviewer: saeeda, Dickson-Mwendia
ms.custom: devx-track-csharp, aaddev, devx-track-dotnet
#Customer intent: As an application developer, I want to learn about considerations for using Xamarin Android and MSAL.NET so I can decide if this platform meets my application development needs.
---

#  Xamarin Android system browser considerations for using MSAL.NET

This article discusses what you should consider when you use the system browser on Xamarin Android with the Microsoft Authentication Library for .NET (MSAL.NET).

Starting with MSAL.NET 2.4.0 Preview, MSAL.NET supports browsers other than Chrome. It no longer requires Chrome be installed on the Android device for authentication.

We recommend that you use browsers that support custom tabs. Here are some examples of these browsers:

| Browsers that have custom tabs support | Package name |
|------| ------- |
|Chrome | com.android.chrome|
|Microsoft Edge | com.microsoft.emmx|
|Firefox | org.mozilla.firefox|
|Ecosia | com.ecosia.android|
|Kiwi | com.kiwibrowser.browser|
|Brave | com.brave.browser|

In addition to identifying browsers that offer custom tabs support, our testing indicates that a few browsers that don't support custom tabs also work for authentication. These browsers include Opera, Opera Mini, InBrowser, and Maxthon.

## Tested devices and browsers
The following table lists the devices and browsers that have been tested for authentication compatibility.

| Device | Browser     |  Result  |
| ------------- |:-------------:|:-----:|
| Huawei/One+ | Chrome\* | Pass|
| Huawei/One+ | Edge\* | Pass|
| Huawei/One+ | Firefox\* | Pass|
| Huawei/One+ | Brave\* | Pass|
| One+ | Ecosia\* | Pass|
| One+ | Kiwi\* | Pass|
| Huawei/One+ | Opera | Pass|
| Huawei | OperaMini | Pass|
| Huawei/One+ | InBrowser | Pass|
| One+ | Maxthon | Pass|
| Huawei/One+ | DuckDuckGo | User canceled authentication|
| Huawei/One+ | UC Browser | User canceled authentication|
| One+ | Dolphin | User canceled authentication|
| One+ | CM Browser | User canceled authentication|
| Huawei/One+ | None installed | AndroidActivityNotFound exception|

\* Supports custom tabs

## Known issues

If the user has no browser enabled on the device, MSAL.NET will throw an `AndroidActivityNotFound` exception.
  - **Mitigation**: Ask the user to enable a browser on their device. Recommend a browser that supports custom tabs.

If authentication fails (for example, if authentication launches with DuckDuckGo), MSAL.NET will return `AuthenticationCanceled MsalClientException`.
  - **Root problem**: A browser that supports custom tabs wasn't enabled on the device. Authentication launched with a browser that couldn't complete authentication.
  - **Mitigation**: Ask the user to enable a browser on their device. Recommend a browser that supports custom tabs.

## Next steps
For more information and code examples, see [Choosing between an embedded web browser and a system browser on Xamarin Android](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/MSAL.NET-uses-web-browser#choosing-between-embedded-web-browser-or-system-browser-on-xamarinandroid) and [Embedded versus system web UI](/entra/msal/dotnet/acquiring-tokens/using-web-browsers#embedded-vs-system-web-ui).
