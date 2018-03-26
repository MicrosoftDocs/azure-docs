---
title: 'Azure AD Connect: Pass-through Authentication - Current limitations | Microsoft Docs'
description: This article describes the current limitations of Azure Active Directory (Azure AD) Pass-through Authentication
services: active-directory
keywords: Azure AD Connect Pass-through Authentication, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: swkrish
manager: mtillman
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/22/2018
ms.author: billmath
---

# Azure Active Directory Pass-through Authentication: Current limitations

>[!IMPORTANT]
>Azure Active Directory (Azure AD) Pass-through Authentication is a free feature, and you don't need any paid editions of Azure AD to use it. Pass-through Authentication is only available in the world-wide instance of Azure AD, and not on the [Microsoft Azure Germany cloud](http://www.microsoft.de/cloud-deutschland) or the [Microsoft Azure Government cloud](https://azure.microsoft.com/features/gov/).

## Supported scenarios

The following scenarios are fully supported:

- User sign-ins to all web browser-based applications.
- User sign-ins to Office applications that support [modern authentication](https://aka.ms/modernauthga): Office 2016, and Office 2013 _with_ modern authentication.
- User sign-ins to Outlook clients using legacy protocols such as Exchange ActiveSync, SMTP, POP and IMAP.
- User sign-ins to Skype for Business that support modern authentication, including online and hybrid topologies. Learn more about supported topologies [here](https://technet.microsoft.com/library/mt803262.aspx).
- Azure AD domain joins for Windows 10 devices.
- App passwords for Multi-Factor Authentication.

## Unsupported scenarios

The following scenarios are _not_ supported:

- User sign-ins to legacy Office client applications, excluding Outlook (see **Supported scenarios** above): Office 2010, and Office 2013 _without_ modern authentication. Organizations are encouraged to switch to modern authentication, if possible. Modern authentication allows for Pass-through Authentication support. It also helps you secure your user accounts by using [conditional access](../active-directory-conditional-access-azure-portal.md) features, such as Azure Multi-Factor Authentication.
- Access to calendar sharing and free/busy information in Exchange hybrid environments on Office 2010 only.
- User sign-ins to Skype for Business client applications _without_ modern authentication.
- User sign-ins to PowerShell version 1.0. We recommended that you use PowerShell version 2.0.
- Detection of users with [leaked credentials](../active-directory-reporting-risk-events.md#leaked-credentials).
- Azure AD Domain Services needs Password Hash Synchronization to be enabled on the tenant. Therefore tenants that use Pass-through Authentication _only_ don't work for scenarios that need Azure AD Domain Services.
- Pass-through Authentication is not integrated with [Azure AD Connect Health](../connect-health/active-directory-aadconnect-health.md).
- The Apple Device Enrollment Program (Apple DEP) using the iOS Setup Assistant does not support modern authentication. This will fail to enroll Apple DEP devices into Intune for managed domains using Pass-through Authentication. Consider using the [Company Portal app](https://blogs.technet.microsoft.com/intunesupport/2018/02/08/support-for-multi-token-dep-and-authentication-with-company-portal/) as an alternative.

>[!IMPORTANT]
>As a workaround for unsupported scenarios _only_, enable Password Hash Synchronization on the [Optional features](active-directory-aadconnect-get-started-custom.md#optional-features) page in the Azure AD Connect wizard. When users sign into applications listed in the "unsupported scenarios" section, those specific sign-in requests are _not_ handled by Pass-through Authentication Agents, and therefore will not be recorded in [Pass-through Authentication logs](active-directory-aadconnect-troubleshoot-pass-through-authentication.md#collecting-pass-through-authentication-agent-logs).

>[!NOTE]
Enabling password hash synchronization gives you the option to failover authentication if your on-premises infrastructure is disrupted. This failover from Pass-through Authentication to Active Directory password hash synchronization is not automatic. You'll need to switch the sign-in method manually using Azure AD Connect. If the server running Azure AD Connect goes down, you'll require help from Microsoft Support to turn off Pass-through Authentication.

## Next steps
- [Quick start](active-directory-aadconnect-pass-through-authentication-quick-start.md): Get up and running with Azure AD Pass-through Authentication.
- [Smart Lockout](active-directory-aadconnect-pass-through-authentication-smart-lockout.md): Learn how to configure the Smart Lockout capability on your tenant to protect user accounts.
- [Technical deep dive](active-directory-aadconnect-pass-through-authentication-how-it-works.md): Understand how the Pass-through Authentication feature works.
- [Frequently asked questions](active-directory-aadconnect-pass-through-authentication-faq.md): Find answers to frequently asked questions about the Pass-through Authentication feature.
- [Troubleshoot](active-directory-aadconnect-troubleshoot-pass-through-authentication.md): Learn how to resolve common problems with the Pass-through Authentication feature.
- [Security deep dive](active-directory-aadconnect-pass-through-authentication-security-deep-dive.md): Get deep technical information on the Pass-through Authentication feature.
- [Azure AD Seamless SSO](active-directory-aadconnect-sso.md): Learn more about this complementary feature.
- [UserVoice](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect): Use the Azure Active Directory Forum to file new feature requests.
