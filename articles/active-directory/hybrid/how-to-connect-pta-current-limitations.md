---
title: 'Azure AD Connect: Pass-through Authentication - Current limitations | Microsoft Docs'
description: This article describes the current limitations of Azure Active Directory (Azure AD) Pass-through Authentication
services: active-directory
keywords: Azure AD Connect Pass-through Authentication, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: billmath
manager: daveba
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 09/04/2018
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Azure Active Directory Pass-through Authentication: Current limitations

>[!IMPORTANT]
>Azure Active Directory (Azure AD) Pass-through Authentication is a free feature, and you don't need any paid editions of Azure AD to use it. Pass-through Authentication is only available in the world-wide instance of Azure AD, and not on the [Microsoft Azure Germany cloud](https://www.microsoft.de/cloud-deutschland) or the [Microsoft Azure Government cloud](https://azure.microsoft.com/features/gov/).

## Supported scenarios

The following scenarios are supported:

- User sign-ins to web browser-based applications.
- User sign-ins to Outlook clients using legacy protocols such as Exchange ActiveSync, EAS, SMTP, POP and IMAP.
- User sign-ins to legacy Office client applications and Office applications that support [modern authentication](https://www.microsoft.com/en-us/microsoft-365/blog/2015/11/19/updated-office-365-modern-authentication-public-preview): Office 2013 and 2016 versions.
- User sign-ins to legacy protocol applications such as PowerShell version 1.0 and others.
- Azure AD joins for Windows 10 devices.
- App passwords for Multi-Factor Authentication.

## Unsupported scenarios

The following scenarios are _not_ supported:

- Detection of users with [leaked credentials](../reports-monitoring/concept-risk-events.md#leaked-credentials).
- Azure AD Domain Services needs Password Hash Synchronization to be enabled on the tenant. Therefore tenants that use Pass-through Authentication _only_ don't work for scenarios that need Azure AD Domain Services.
- Pass-through Authentication is not integrated with [Azure AD Connect Health](whatis-hybrid-identity-health.md).

> [!IMPORTANT]
> As a workaround for unsupported scenarios _only_ (except Azure AD Connect Health integration), enable Password Hash Synchronization on the [Optional features](how-to-connect-install-custom.md#optional-features) page in the Azure AD Connect wizard.
> 
> [!NOTE]
> Enabling Password Hash Synchronization gives you the option to failover authentication if your on-premises infrastructure is disrupted. This failover from Pass-through Authentication to Password Hash Synchronization is not automatic. You'll need to switch the sign-in method manually using Azure AD Connect. If the server running Azure AD Connect goes down, you'll require help from Microsoft Support to turn off Pass-through Authentication.

## Next steps
- [Quick start](how-to-connect-pta-quick-start.md): Get up and running with Azure AD Pass-through Authentication.
- [Migrate from AD FS to Pass-through Authentication](https://aka.ms/ADFSTOPTADPDownload) - A detailed guide to migrate from AD FS (or other federation technologies) to Pass-through Authentication.
- [Smart Lockout](../authentication/howto-password-smart-lockout.md): Learn how to configure the Smart Lockout capability on your tenant to protect user accounts.
- [Technical deep dive](how-to-connect-pta-how-it-works.md): Understand how the Pass-through Authentication feature works.
- [Frequently asked questions](how-to-connect-pta-faq.md): Find answers to frequently asked questions about the Pass-through Authentication feature.
- [Troubleshoot](tshoot-connect-pass-through-authentication.md): Learn how to resolve common problems with the Pass-through Authentication feature.
- [Security deep dive](how-to-connect-pta-security-deep-dive.md): Get deep technical information on the Pass-through Authentication feature.
- [Azure AD Seamless SSO](how-to-connect-sso.md): Learn more about this complementary feature.
- [UserVoice](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect): Use the Azure Active Directory Forum to file new feature requests.
