---
title: Brokered Auth on iOS 13 | Azure

titleSuffix: Microsoft identity platform
description: Authentication using the Microsoft Authenticator App on iOS 13 has introduced small behavior changes in MSAL.NET.
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 12/13/2019
ms.author: jmprieur
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn how to use brokers with my Xamarin iOS 13 application.
ms.collection: M365-identity-device-management
---

## Brokered Auth on iOS 13

If your app requires conditional access or certificate authentication support, you must set up your app to be able to talk to the Azure Authenticator app.

MSAL is then responsible for handling requests and responses between your application and the Azure Authenticator app.

However, on iOS 13, Apple made a breaking API change, and removed the application's ability to read source application when receiving a response from an external application through custom URL schemes. See the notes from Apple [here](https://developer.apple.com/documentation/uikit/uiapplicationopenurloptionssourceapplicationkey?language=objc). 

> If the request originated from another app belonging to your team, UIKit sets the value of this key to the ID of that app. If the team identifier of the originating app is different than the team identifier of the current app, the value of the key is nil.

This is a breaking change for MSAL, because it relied on `UIApplication.SharedApplication.OpensUrl` to verify communication between MSAL and the Azure Authenticator app. 

Additionally, on iOS 13 the developer is required to provide a presentation controller when using ASWebAuthenticationSession.

In order to mitigate these changes, we released MSAL.NET 4.4.0 with iOS 13 support:
- [MSAL 4.4.0](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/releases/tag/4.4.0)

### Your app IS impacted if:
1. Your app is leveraging iOS broker, AND you're building with Xcode 11, OR
2. You're using ASWebAuthenticationSession, AND you're building with Xcode 11.

In those cases you need to use latest MSAL releases to be able to complete authentication successfully.

### Your app is NOT impacted if:
1. Your app is not using iOS broker, OR
2. Your app is being built with Xcode 11, OR
3. Your app is distributed by Microsoft (signed by Microsoft developer distribution profile), OR
4. You're not using ASWebAuthenticationSession.

### Additional considerations:

1. When using latest MSAL SDKs, you need to ensure that you have the latest Authenticator app installed. **Authenticator app with a version 6.3.19 or later is supported**. 

2. When updating to MSAL.NET 4.4.0, make sure you update your `LSApplicationQueriesSchemes` in the `Info.plist`. 
The additional value should be `msauthv3`. See below:

```xml
<key>LSApplicationQueriesSchemes</key>
<array>
     <string>msauthv2</string>
     <string>msauthv3</string>
</array>
```

This is necessary to detect the presence of the latest Authenticator app on device that supports iOS 13. 

Please open [a Github issue](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/issues) if you have additional questions or seeing any issues. 