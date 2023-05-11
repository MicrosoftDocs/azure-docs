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
ms.date: 12/29/2022
ms.author: dmwendia
ms.reviewer: saeeda, jmprieur
ms.custom: aaddev, has-adal-ref
# Customer intent: As an application developer, I want to learn about MSAL so I can migrate my ADAL applications to MSAL.
---

# Migrate applications to the Microsoft Authentication Library (MSAL)

If any of your applications use the Azure Active Directory Authentication Library (ADAL)  for authentication and authorization functionality, it's time to migrate them to the [Microsoft Authentication Library (MSAL)](msal-overview.md#languages-and-frameworks).

- All Microsoft support and development for ADAL, including security fixes, ends in June 2023.
- There are no ADAL feature releases or new platform version releases planned prior to June 2023.
- No new features have been added to ADAL since June 30, 2020.

> [!WARNING]
> If you choose not to migrate to MSAL before ADAL support ends in June 2023, you put your app's security at risk. Existing apps that use ADAL will continue to work after the end-of-support date but Microsoft will no longer release security fixes on ADAL. Learn more in [the official announcement](https://aka.ms/adal-eos).

## Why switch to MSAL?

If you've developed apps against Azure Active Directory (v1.0) endpoint in the past, you're likely using ADAL. Since Microsoft identity platform (v2.0) endpoint has changed significantly enough, the new library (MSAL) was built for the new endpoint entirely.

The following diagram shows the v2.0 vs v1.0 endpoint experience at a high level, including the app registration experience, SDKs, endpoints, and supported identities.

![Diagram that shows the v1.0 versus the v2.0 architecture.](../azuread-dev/media/about-microsoft-identity-platform/about-microsoft-identity-platform.svg)

MSAL leverages all the [benefits of Microsoft identity platform (v2.0) endpoint](../azuread-dev/azure-ad-endpoint-comparison.md).

MSAL is designed to enable a secure solution without developers having to worry about the implementation details. it simplifies and manages acquiring, managing, caching, and refreshing tokens, and uses best practices for resilience. We recommend you use MSAL to [increase the resilience of authentication and authorization in client applications that you develop](../fundamentals/resilience-client-app.md?tabs=csharp#use-the-microsoft-authentication-library-msal).

MSAL provides multiple benefits over ADAL, including the following features: 

|Features|MSAL|ADAL|
|---------|---------|---------|
|**Security**|||
|Security fixes beyond June 2023|![Security fixes beyond June 2023 - MSAL provides the feature][y]|![Security fixes beyond June 2023 - ADAL doesn't provide the feature][n]|
| Proactively refresh and revoke tokens based on policy or critical events for Microsoft Graph and other APIs that support [Continuous Access Evaluation (CAE)](app-resilience-continuous-access-evaluation.md).|![Proactively refresh and revoke tokens based on policy or critical events for Microsoft Graph and other APIs that support Continuous Access Evaluation (CAE) - MSAL provides the feature][y]|![Proactively refresh and revoke tokens based on policy or critical events for Microsoft Graph and other APIs that support Continuous Access Evaluation (CAE) - ADAL doesn't provide the feature][n]|
| Standards compliant with OAuth v2.0 and OpenID Connect (OIDC) |![Standards compliant with OAuth v2.0 and OpenID Connect (OIDC) - MSAL provides the feature][y]|![Standards compliant with OAuth v2.0 and OpenID Connect (OIDC) - ADAL doesn't provide the feature][n]|
|**User accounts and experiences**|||
|Azure Active Directory (Azure AD) accounts|![Azure Active Directory (Azure AD) accounts - MSAL provides the feature][y]|![Azure Active Directory (Azure AD) accounts - ADAL provides the feature][y]|
| Microsoft account (MSA) |![Microsoft account (MSA) - MSAL provides the feature][y]|![Microsoft account (MSA) - ADAL doesn't provide the feature][n]|
| Azure AD B2C accounts |![Azure AD B2C accounts - MSAL provides the feature][y]|![Azure AD B2C accounts - ADAL doesn't provide the feature][n]|
| Best single sign-on experience |![Best single sign-on experience - MSAL provides the feature][y]|![Best single sign-on experience - ADAL doesn't provide the feature][n]|
|**Resilience**|||
| Proactive token renewal |![Proactive token renewal - MSAL provides the feature][y]|![Proactive token renewal - ADAL doesn't provide the feature][n]|
| Throttling |![Throttling - MSAL provides the feature][y]|![Throttling - ADAL doesn't provide the feature][n]|

## Additional Capabilities of MSAL over ADAL
- Auth broker support – Device-based Conditional Access policy
- Proof of possession tokens
- Azure AD certificate-based authentication (CBA) on mobile
- System browsers on mobile devices
- Where ADAL had only authentication context class, MSAL exposes the notion of a collection of client apps (public client and confidential client).

## AD FS support in MSAL.NET

You can use MSAL.NET, MSAL Java, and MSAL Python to get tokens from Active Directory Federation Services (AD FS) 2019 or later. Earlier versions of AD FS, including AD FS 2016, are unsupported by MSAL.

If you need to continue using AD FS, you should upgrade to AD FS 2019 or later before you update your applications from ADAL to MSAL.

## How to migrate to MSAL

Before you start the migration, you need to identify which of your apps are using ADAL for authentication. Follow the steps in this article to get a list by using the Azure portal:
- [How to: Get a complete list of apps using ADAL in your tenant](howto-get-list-of-all-active-directory-auth-library-apps.md)

After identifying your apps that use ADAL, migrate them to MSAL depending on your application type as illustrated below.

[!INCLUDE [application type](includes/adal-msal-migration.md)]

MSAL Supports a wide range of application types and scenarios. Please refer to [Microsoft Authentication Library support for several application types](reference-v2-libraries.md#single-page-application-spa).

ADAL to MSAL Migration Guide for different platforms are available in the following link.
- [Migrate to MSAL iOS and MacOS](migrate-objc-adal-msal.md)
- [Migrate to MSAL Java](migrate-adal-msal-java.md)
- [Migrate to MSAL .NET](msal-net-migration.md)
- [Migrate to MSAL Node](msal-node-migration.md)
- [Migrate to MSAL Python](migrate-python-adal-msal.md)   

## Migration help

If you have questions about migrating your app from ADAL to MSAL, here are some options:

- Post your question on [Microsoft Q&A](/answers/topics/azure-ad-adal-deprecation.html) and tag it with `[azure-ad-adal-deprecation]`.
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
