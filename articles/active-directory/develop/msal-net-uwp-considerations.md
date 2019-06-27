---
title: Universal Windows Platform considerations (Microsoft Authentication Library for .NET) | Azure
description: Learn about specific considerations when using Universal Windows Platform with the Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/24/2019
ms.author: ryanwi
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about specific considerations when using Universal Windows Platform and MSAL.NET so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# Universal Windows Platform-specific considerations with MSAL.NET
On Xamarin iOS, there are several considerations that you must take into account when using MSAL.NET.

## The UseCorporateNetwork property
In the WinRT platform, `PublicClientApplication` has the following boolean property ``UseCorporateNetwork``. This property enables Win8.1 and UWP applications to benefit from Integrated Windows Authentication (and therefore SSO with the user signed-in with the operating system) if the user is signed-in with an account in a federated Azure AD tenant. This leverages WAB (Web Authentication Broker). 

> [!IMPORTANT]
> Setting this property to true assumes that the application developer has enabled Integrated Windows Authentication (IWA) in the application. For this:
> - In the ``Package.appxmanifest`` for your UWP application, in the **Capabilities** tab, enable the following capabilities:
> 	- Enterprise Authentication
> 	- Private Networks (Client & Server)
> 	- Shared User Certificate

IWA is not enabled by default because applications requesting the Enterprise Authentication or Shared User Certificates capabilities require a higher level of verification to be accepted into the Windows Store, and not all developers may wish to perform the higher level of verification. 

The underlying implementation on the UWP platform (WAB) does not work correctly in Enterprise scenarios where Conditional Access was enabled. The symptom is that the user tries to sign-in with Windows hello, and is proposed to choose a certificate, but the certificate for the pin is not found, or the user chooses it, but never get prompted for the Pin. A workaround is to use an alternative method (username/password + phone authentication), but the experience is not good. 

## Next steps
More details are provided in the following samples:

Sample | Platform | Description 
|------ | -------- | -----------|
|[active-directory-dotnet-native-uwp-v2](https://github.com/azure-samples/active-directory-dotnet-native-uwp-v2) | UWP | A Universal Windows Platform client application using msal.net, accessing the Microsoft Graph for a user authenticating with Azure AD v2.0 endpoint. <br>![Topology](media/msal-net-uwp-considerations/topology-native-uwp.png)|
|[https://github.com/Azure-Samples/active-directory-xamarin-native-v2](https://github.com/Azure-Samples/active-directory-xamarin-native-v2) | Xamarin iOS, Android, UWP | A simple Xamarin Forms app showcasing how to use MSAL to authenticate MSA and Azure AD via the AAD v2.0 endpoint, and access the Microsoft Graph with the resulting token. <br>![Topology](media/msal-net-uwp-considerations/topology-xamarin-native.png)|