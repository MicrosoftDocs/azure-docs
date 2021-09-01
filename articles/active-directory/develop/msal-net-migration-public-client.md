---
title: Migrate public client applications to MSAL.NET
titleSuffix: Microsoft identity platform
description: Learn how to migrate a public client application from Azure Active Directory Authentication Library for .NET to Microsoft Authentication Library for .NET.
services: active-directory
author: sahmalik
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 08/31/2021
ms.author: sahmalik
ms.reviewer: saeeda, shermanouko, jmprieur
ms.custom: "devx-track-csharp, aaddev, has-adal-ref"
#Customer intent: As an application developer, I want to migrate my public client app from ADAL.NET to MSAL.NET.
---

# Migrate public client applications from ADAL.NET to MSAL.NET

This article describes how to migrate a public client application from Azure Active Directory Authentication Library for .NET (ADAL.NET) to Microsoft Authentication Library for .NET (MSAL.NET). Public client applications are desktop apps, including Win32, WPF, and UWP apps, and mobile apps, that call another service on the user's behalf. For more information about public client applications, see [Authentication flows and application scenarios](authentication-flows-app-scenarios.md).

## Migration steps

1. Find the code by using ADAL.NET in your app.

   The code that uses ADAL in a public client application instantiates `AuthenticationContext` and calls an override of `AcquireTokenAsync` with the following parameters:

   - A `resourceId` string. This variable is the app ID URI of the web API that you want to call.
   - A `clientId` which is the identifier for your application, also known as App Id.

2. After you've identified that you have apps that are using ADAL.NET, install the MSAL.NET NuGet package [Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client) and update your project library references. For more information, see [Install a NuGet package](https://www.bing.com/search?q=install+nuget+package).

3. Update the code according to the public client application scenario. Some steps are common and apply across all the public client scenarios. Other steps are unique to each scenario. 

   The public client scenarios are:

   - [Web Authentication Manager](scenario-desktop-acquire-token-wam.md) the preferred broker based authentication on Windows.
   - [Interactive Authentication](scenario-desktop-acquire-token-interactive.md) where the user is shown a web based interface to complete the sign in process.
   - [Integrated Windows Authentication](scenario-desktop-acquire-token-iwa.md) where a user signs using the same identity they used to sign into windows domain (for domain joined or AAD joined machines).
   - [Username/Password](scenario-desktop-acquire-token-usernamepassword.md) where the sign in occurs by providing a username/password credential.
   - [Device Code Flow](scenario-desktop-acquire-token-device-code-flow.md) where a device of limited UX shows you a device code to complete the authentication flow on an alternate device.

## MSAL benefits

Key benefits of MSAL.NET for your app include:

- **Resilience**. MSAL.NET helps make your app resilient through the following:

   - Azure AD Cached Credential Service (CCS) benefits. CCS operates as an Azure AD backup.
   - Proactive renewal of tokens if the API that you call enables long-lived tokens through [continuous access evaluation](app-resilience-continuous-access-evaluation.md).

## Troubleshooting

The following troubleshooting information makes two assumptions: 

- Your ADAL.NET code was working.
- You migrated to MSAL by keeping the same client ID.

If you get an exception with either of the following messages: 

> `AADSTS90002: Tenant 'cf61953b-e41a-46b3-b500-663d279ea744' not found. This may happen if there are no active`
> `subscriptions for the tenant. Check to make sure you have the correct tenant ID. Check with your subscription`
> `administrator.`

You can troubleshoot the exception by using these steps:

1. Confirm that you're using the latest version of MSAL.NET.
1. Confirm that the authority host that you set when building the confidential client application and the authority host that you used with ADAL are similar. In particular, is it the same [cloud](msal-national-cloud.md) (Azure Government, Azure China 21Vianet, or Azure Germany)?

## Next steps

Learn more about the [differences between ADAL.NET and MSAL.NET apps](msal-net-differences-adal-net.md).
Learn more about [token cache serialization in MSAL.NET](msal-net-token-cache-serialization.md)