---
title: Migrate to the Microsoft Authentication Library (MSAL)
description: Learn about the differences between the Microsoft Authentication Library (MSAL) and Azure AD Authentication Library (ADAL) and how to migrate to MSAL.
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 07/17/2023
ms.author: dmwendia
ms.reviewer: saeeda, jmprieur, localden
ms.custom: aaddev, has-adal-ref
# Customer intent: As an application developer, I want to learn about MSAL so I can migrate my ADAL applications to MSAL.
---

# Migrate applications to the Microsoft Authentication Library (MSAL)

If any of your applications use the Azure Active Directory Authentication Library (ADAL) for authentication and authorization capabilities, it's time to migrate them to the [Microsoft Authentication Library (MSAL)](/entra/msal).

- All Microsoft support and development for ADAL, including security fixes, ended on June 30, 2023.
- There were no ADAL feature releases or new platform version releases planned prior to the deprecation date.
- No new features have been added to ADAL since June 30, 2020.

> [!WARNING]
> Azure Active Directory Authentication Library (ADAL) has been deprecated. While existing apps that use ADAL will continue to work, Microsoft will no longer release security fixes on ADAL. Use the [Microsoft Authentication Library (MSAL)](/entra/msal/) to avoid putting your app's security at risk.

## Why switch to MSAL?

If you've developed apps against Azure Active Directory (v1.0) endpoint in the past, you're likely using ADAL. Since Microsoft identity platform (v2.0) endpoint has changed significantly, the new library (MSAL) was entirely built for the new endpoint.

MSAL is designed to enable a secure solution without developers having to worry about the implementation details. It simplifies and manages acquiring, managing, caching, and refreshing tokens, and uses best practices for resilience. We recommend you use MSAL to [increase the resilience of authentication and authorization in client applications that you develop](../architecture/resilience-client-app.md?tabs=csharp#use-the-microsoft-authentication-library-msal).

MSAL provides multiple benefits over ADAL, including the following features: 

|Features|MSAL|ADAL|
|---------|---------|---------|
|**Security**|||
|Security fixes beyond June 2023|![Security fixes beyond June 2023 - MSAL provides the feature][y]|![Security fixes beyond June 2023 - ADAL doesn't provide the feature][n]|
| Proactively refresh and revoke tokens based on policy or critical events for Microsoft Graph and other APIs that support [Continuous Access Evaluation (CAE)](app-resilience-continuous-access-evaluation.md).|![Proactively refresh and revoke tokens based on policy or critical events for Microsoft Graph and other APIs that support Continuous Access Evaluation (CAE) - MSAL provides the feature][y]|![Proactively refresh and revoke tokens based on policy or critical events for Microsoft Graph and other APIs that support Continuous Access Evaluation (CAE) - ADAL doesn't provide the feature][n]|
| Standards compliant with OAuth v2.0 and OpenID Connect (OIDC) |![Standards compliant with OAuth v2.0 and OpenID Connect (OIDC) - MSAL provides the feature][y]|![Standards compliant with OAuth v2.0 and OpenID Connect (OIDC) - ADAL doesn't provide the feature][n]|
|**User accounts and experiences**|||
|Microsoft Entra accounts|![Microsoft Entra accounts - MSAL provides the feature][y]|![Microsoft Entra accounts - ADAL provides the feature][y]|
| Microsoft account (MSA) |![Microsoft account (MSA) - MSAL provides the feature][y]|![Microsoft account (MSA) - ADAL doesn't provide the feature][n]|
| Azure AD B2C accounts |![Azure AD B2C accounts - MSAL provides the feature][y]|![Azure AD B2C accounts - ADAL doesn't provide the feature][n]|
| Best single sign-on experience |![Best single sign-on experience - MSAL provides the feature][y]|![Best single sign-on experience - ADAL doesn't provide the feature][n]|
|**Authentication experiences**|||
| Continuous access evaluation through proactive token refresh |![Proactive token renewal - MSAL provides the feature][y]|![Proactive token renewal - ADAL doesn't provide the feature][n]|
| Throttling |![Throttling - MSAL provides the feature][y]|![Throttling - ADAL doesn't provide the feature][n]|
|Auth broker support |![Device-based Conditional Access policy - MSAL has the feature built-in][y]|![Device-based Conditional Access policy - ADAL doesn't provide the feature][n]|
| Token protection|![Token protection - MSAL provides the feature][y]|![Token protection - ADAL doesn't provide the feature][n]|


## Additional capabilities of MSAL over ADAL

- Proof of possession tokens
- Microsoft Entra certificate-based authentication (CBA) on mobile
- System browsers on mobile devices
- Where ADAL had only authentication context class, MSAL exposes the notion of a collection of client apps (public client and confidential client).

## AD FS support in MSAL

You can use MSAL.NET, MSAL Java, MSAL.js, and MSAL Python to get tokens from Active Directory Federation Services (AD FS) 2019 or later. Earlier versions of AD FS, including AD FS 2016, are unsupported by MSAL.

If you need to continue using AD FS, you should upgrade to AD FS 2019 or later before you update your applications from ADAL to MSAL.

## How to migrate to MSAL

Before you start the migration, you need to identify which of your apps are using ADAL for authentication. Follow the steps in this article to get a list by using the Azure portal:
- [How to: Get a complete list of apps using ADAL in your tenant](./howto-get-list-of-all-auth-library-apps.md)

After identifying applications that use ADAL, migrate them to MSAL depending on your app type:

[!INCLUDE [application type](includes/adal-msal-migration.md)]

MSAL Supports a wide range of application types and scenarios. Refer to [Microsoft Authentication Library support for several application types](reference-v2-libraries.md#single-page-application-spa).

ADAL to MSAL migration guide for different platforms are available in the following links:

- [Migrate to MSAL iOS and macOS](migrate-objc-adal-msal.md)
- [Migrate to MSAL Java](/entra/msal/java/advanced/migrate-adal-msal-java)
- [Migrate to MSAL.js](msal-compare-msal-js-and-adal-js.md)
- [Migrate to MSAL .NET](/entra/msal/dotnet/how-to/msal-net-migration)
- [Migrate to MSAL Node](msal-node-migration.md)
- [Migrate to MSAL Python](/entra/msal/python/advanced/migrate-python-adal-msal)   

## Migration help

If you have questions about migrating your app from ADAL to MSAL, here are some options:

- Post your question on [Microsoft Q&A](/answers/tags/455/entra-id) and tag it with `[azure-ad-adal-deprecation]`.
- Open an issue in the library's GitHub repository. See the [Languages and frameworks](msal-overview.md#languages-and-frameworks) section of the MSAL overview article for links to each library's repo.

If you partnered with an Independent Software Vendor (ISV) in the development of your application, we recommend that you contact them directly to understand their migration journey to MSAL.

## Next steps

For more information about MSAL, including usage information and which libraries are available for different programming languages and application types, see:

- [Acquire and cache tokens using MSAL](msal-acquire-cache-tokens.md)
- [Application configuration options](msal-client-application-configuration.md)
- [MSAL authentication libraries](reference-v2-libraries.md)

<!--
 ![X indicating no.][n] | ![Green check mark.][y] | ![Green check mark.][y] | -- |
-->
[y]: media/common/yes.png
[n]: media/common/no.png
