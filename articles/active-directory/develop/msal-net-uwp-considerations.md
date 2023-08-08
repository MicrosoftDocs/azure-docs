---
title: UWP considerations (MSAL.NET)
description: Learn about considerations for using Universal Windows Platform (UWP) with the Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 03/03/2021
ms.author: dmwendia
ms.reviewer: saeeda
ms.custom: devx-track-csharp, aaddev, devx-track-dotnet
#Customer intent: As an application developer, I want to learn about considerations for using Universal Windows Platform and MSAL.NET so that I can decide if this platform meets my application development needs.
---

# Considerations for using Universal Windows Platform with MSAL.NET
Developers of applications that use Universal Windows Platform (UWP) with MSAL.NET should consider the concepts this article presents.

## The UseCorporateNetwork property
On the Windows Runtime (WinRT) platform, `PublicClientApplication` has the Boolean property `UseCorporateNetwork`. This property enables Windows 10 applications and UWP applications to benefit from integrated Windows authentication (IWA) if the user is signed in to an account that has a federated Azure Active Directory (Azure AD) tenant. Users who are signed in to the operating system can also use single sign-on (SSO). When you set the `UseCorporateNetwork` property, MSAL.NET uses a web authentication broker (WAB).

> [!IMPORTANT]
> Setting the `UseCorporateNetwork` property to true assumes that the application developer has enabled IWA in the application. To enable IWA:
> - In your UWP application's `Package.appxmanifest`, on the **Capabilities** tab, enable the following capabilities:
> 	- **Enterprise Authentication**
> 	- **Private Networks (Client & Server)**
> 	- **Shared User Certificate**

IWA isn't enabled by default because Microsoft Store requires a high level of verification before it accepts applications that request the capabilities of enterprise authentication or shared user certificates. Not all developers want to do this level of verification.

On the UWP platform, the underlying WAB implementation doesn't work correctly in enterprise scenarios where Conditional Access is enabled. Users see symptoms of this problem when they try to sign in by using Windows Hello. When the user is asked to choose a certificate:

- The certificate for the PIN isn't found.
- After the user chooses a certificate, they aren't prompted for the PIN.

You can try to avoid this issue by using an alternative method such as username-password and phone authentication, but the experience isn't good.

## Troubleshooting

Some customers have reported the following sign-in error in specific enterprise environments in which they know that they have an internet connection and that the connection works with a public network.

```Text
We can't connect to the service you need right now. Check your network connection or try this again later.
```

You can avoid this issue by making sure that WAB (the underlying Windows component) allows a private network. You can do that by setting a registry key:

```Text
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\authhost.exe\EnablePrivateNetwork = 00000001
```

For more information, see [Web authentication broker - Fiddler](/windows/uwp/security/web-authentication-broker#fiddler).

## Next steps
The following samples provide more information.

Sample | Platform | Description
|------ | -------- | -----------|
|[`active-directory-dotnet-native-uwp-v2`](https://github.com/azure-samples/active-directory-dotnet-native-uwp-v2) | UWP | A UWP client application that uses MSAL.NET. It accesses Microsoft Graph for a user who authenticates by using an Azure AD 2.0 endpoint. <br>![Topology](media/msal-net-uwp-considerations/topology-native-uwp.png)|
|[`active-directory-xamarin-native-v2`](https://github.com/Azure-Samples/active-directory-xamarin-native-v2) | Xamarin iOS, Android, UWP | A Xamarin Forms app that shows how to use MSAL to authenticate Microsoft personal accounts and Azure AD via the Microsoft identity platform. It also shows how to access Microsoft Graph and shows the resulting token. <br>![Diagram that shows how to use MSAL to authenticate Microsoft personal accounts and Azure AD via the Microsoft identity platform.](media/msal-net-uwp-considerations/topology-xamarin-native.png)|
