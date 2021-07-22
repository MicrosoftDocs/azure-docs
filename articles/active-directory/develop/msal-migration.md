---
title: Migrate to the Microsoft Authentication Library (MSAL)
titleSuffix: Microsoft identity platform
description: Learn about the differences between the Microsoft Authentication Library (MSAL) and Azure AD Authentication Library (ADAL) and how to migrate to MSAL.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 07/22/2021
ms.author: jmprieur
ms.reviewer: saeeda
ms.custom: aaddev
# Customer intent: As an application developer, I want to learn about MSAL library so I can migrate my ADAL applications to MSAL.
---

# Migrate applications to the Microsoft Authentication Library (MSAL)

You need to migrate your applications that are using the Azure Active Directory Authentication Library (ADAL). We recommend using the [Microsoft Authentication Library (MSAL)](msal-overview.md#languages-and-frameworks) for authentication and authorization of Azure AD entities. Here's why:

- ADAL support will end June 30, 2022.
- No new features have been added to ADAL since June 30, 2020.

> [!WARNING]
> If you choose not to migrate to MSAL before ADAL support ends on June 30, 2022, you put your app's security at risk. Existing apps that use ADAL will continue to work after the end-of-support date, but Microsoft will no longer release security fixes on ADAL.

## Why switch to MSAL?

MSAL has several advantages over ADAL, which includes:
- Security: 
    - Security fixes beyond June 30, 2022.
    - [Continuous Access Evaluation (CAE)](app-resilience-continuous-access-evaluation.md) that proactively refreshes tokens and can revoke access tokens based on critical event and policy.
    - [Conditional access authentication context](developer-guide-conditional-access-authentication-context.md) that allows you to apply granular policies to sensitive data and actions.
    - Proof of possession ensures that access tokens aren't stolen and used to access protected resources using the following mechanisms:
        - Access tokens are bound to the user/machine that wants to access a protected resource via public/private key pair.
        - Access tokens are bound to a protected resource, i.e a token that is used to access <code>GET https://contoso.com/transactions</code> cannot be used to access <code>GET https://contoso.com/tranfer/100</code>.
- Performance and scalability:
    - Standards compliant with OAuth v2.0 and OpenID Connect (OIDC),  which enables you to authenticate several identity types like:
        - Work or school accounts, provisioned through Azure AD.
        - Microsoft accounts for Skype, Xbox, and Outlook.com
    - MSAL.NET talking directly to [Active Directory Federation Service (AD FS)](msal-net-adfs-support.md) authority. 
    - Authentication for Azure AD B2C, which allows users to sign in using social accounts like Facebook or Google, or non-Microsoft email addresses and passwords.
    - Better token caching capabilities in confidential client applications, including distributed token caches. 
- Resilience:
    - Azure AD Cached Credential Service (CSS), which operates as an Azure AD backup.

## AD FS support in MSAL.NET

You can use MSAL.NET to get tokens from AD FS 2019 or later. Earlier versions of AD FS, including AD FS 2016, are unsupported by MSAL.NET. If you need to continue using AD FS, you should upgrade to AD FS 2019 or later before you update your .NET applications to MSAL.NET.

## How to migrate to MSAL

Before starting the migration, first you need to identify which of your apps are using ADAL for authentication. Follow the steps in this article to get a list by using the Azure portal:
- [How to: Get a complete list of apps using ADAL in your tenant](howto-get-list-of-all-active-directory-auth-library-apps.md)

After identifying your apps that use ADAL, migrate them to MSAL depending on your application type as illustrated below.

[!INCLUDE [application type](includes/adal-msal-migration.md)]


## Migration help

If you have questions about migration to MSAL, you can post on [Microsoft Q&A](/answers/topics/azure-ad-adal-deprecation.html) with the tag `[azure-ad-adal-deprecation]` or open an issue in library's GitHub repository. See the [Languages and frameworks](msal-overview.md#languages-and-frameworks) section of the MSAL overview article for links to each library's repo.

 If you partnered with an Independent Software Vendor (ISV), we suggest you communicate to them directly to understand their migration journey to MSAL. 


## Next steps

After updating your code, we recommend making use of the [Microsoft identity platform code samples](sample-v2-code.md).