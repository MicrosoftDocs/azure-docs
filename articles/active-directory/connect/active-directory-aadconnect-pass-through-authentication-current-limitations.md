---
title: 'Azure AD Connect: Pass-through Authentication - Current limitations | Microsoft Docs'
description: This article describes the current limitations of Azure Active Directory (Azure AD) Pass-through Authentication
services: active-directory
keywords: Azure AD Connect Pass-through Authentication, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: swkrish
manager: femila
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/19/2017
ms.author: billmath
---

# Azure Active Directory Pass-through Authentication: Current limitations

>[!IMPORTANT]
>Azure Active Directory (Azure AD) Pass-through Authentication is a free feature, and you don't need any paid editions of Azure AD to use it. Pass-through Authentication is only available in the world-wide instance of Azure AD, and not on the [Microsoft Azure Germany cloud](http://www.microsoft.de/cloud-deutschland) or the [Microsoft Azure Government cloud](https://azure.microsoft.com/features/gov/).

## Supported scenarios

The following scenarios are fully supported:

- The user signs in to all web browser-based applications.
- The user signs in to Office 365 client applications that support [modern authentication](https://aka.ms/modernauthga).
- Office 2016, and Office 2013 _with_ modern authentication.
- Azure AD domain joins for Windows 10 devices.
- Exchange ActiveSync support.

## Unsupported scenarios

The following scenarios are _not_ supported:

- The user signs in to legacy Office client applications: Office 2010, and Office 2013 _without_ modern authentication. Organizations are encouraged to switch to modern authentication, if possible. Modern authentication allows for Pass-through Authentication support. It also helps you secure your user accounts by using [conditional access](../active-directory-conditional-access-azure-portal.md) features, such as Azure Multi-Factor Authentication.
- The user signs in to Skype for Business client applications, including Skype for Business 2016.
- The user signs in to PowerShell version 1.0. We recommended that you use PowerShell version 2.0.
- Azure Active Directory Domain Services.
- App passwords for Multi-Factor Authentication.
- Detection of users with [leaked credentials](../active-directory-reporting-risk-events.md#leaked-credentials).

>[!IMPORTANT]
>As a workaround for unsupported scenarios _only_, enable password hash synchronization on the [Optional features](active-directory-aadconnect-get-started-custom.md#optional-features) page in the Azure AD Connect wizard. Enabling Password hash synchronization also gives you the option to failover authentication if your on-premises infrastructure is disrupted. This failover from Pass-through Authentication to Active Directory password hash synchronization is not automatic, but requires help from Microsoft Support.

## Next steps
- [Quick start](active-directory-aadconnect-pass-through-authentication-quick-start.md): Get up and running with Azure AD Pass-through Authentication.
- [Smart Lockout](active-directory-aadconnect-pass-through-authentication-smart-lockout.md): Learn how to configure the Smart Lockout capability on your tenant to protect user accounts.
- [Technical deep dive](active-directory-aadconnect-pass-through-authentication-how-it-works.md): Understand how the Pass-through Authentication feature works.
- [Frequently asked questions](active-directory-aadconnect-pass-through-authentication-faq.md): Find answers to frequently asked questions about the Pass-through Authentication feature.
- [Troubleshoot](active-directory-aadconnect-troubleshoot-pass-through-authentication.md): Learn how to resolve common problems with the Pass-through Authentication feature.
- [Security deep dive](active-directory-aadconnect-pass-through-authentication-security-deep-dive.md): Additional deep technical information on the Pass-through Authentication feature.
- [Azure AD Seamless SSO](active-directory-aadconnect-sso.md): Learn more about this complementary feature.
- [UserVoice](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect): Use the Azure Active Directory Forum to file new feature requests.

