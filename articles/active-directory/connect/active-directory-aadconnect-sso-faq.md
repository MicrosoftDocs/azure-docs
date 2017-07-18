---
title: 'Azure AD Connect: Seamless Single Sign-On - Frequently asked questions | Microsoft Docs'
description: Answers to frequently asked questions about Azure Active Directory Seamless Single Sign-On.
services: active-directory
keywords: what is Azure AD Connect, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: swkrish
manager: femila
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/18/2017
ms.author: billmath
---

# Azure Active Directory Seamless Single Sign-On: Frequently asked questions

In this article, we address frequently asked questions about Azure Active Directory Seamless Single Sign-On (Seamless SSO). Keep checking back for new content.

## What sign-in methods do Seamless SSO work with?

Seamless SSO can be combined with either the [Password Hash Synchronization](active-directory-aadconnectsync-implement-password-synchronization.md) or [Pass-through Authentication](active-directory-aadconnect-pass-through-authentication.md) sign-in methods, but not with Active Directory Federation Services (ADFS).

## Is Seamless SSO a free feature?

Seamless SSO is a free feature and you don't need any paid editions of Azure AD to use it. It remains free when the feature reaches general availability.

## What applications take advantage of `domain_hint` or `login_hint` parameter capability of Seamless SSO?

We are in the process of compiling the list of applications that send these parameters and the ones that don't. If you have applications that are interested in, let us know in the comments section.

## Does Seamless SSO support `Alternate ID` as the username, instead of `userPrincipalName`?

Yes. Seamless SSO supports `Alternate ID` as the username when configured in Azure AD Connect as shown [here](active-directory-aadconnect-get-started-custom.md). Not all Office 365 applications support `Alternate ID`. Refer to the specific application's documentation for the support statement.

## I want to register non-Windows 10 devices with Azure AD, without using AD FS. Can I use Seamless SSO instead?

Yes, this scenario needs version 2.1 or later of the [workplace-join client](https://www.microsoft.com/download/details.aspx?id=53554).

## How can I rollover the Kerberos decryption key of the `AZUREADSSOACCT` computer account?

It is important to frequently rollover the Kerberos decryption key of the `AZUREADSSOACCT` computer account (which represents Azure AD) created in your on-premises AD forest.

>[!IMPORTANT]
>We highly recommend that you rollover the Kerberos decryption key at least every 30 days.

The steps that you need are as follows:

1. Get list of AD forests where Seamless SSO has been enabled
- First, download, and install the [Microsoft Online Services Sign-In Assistant](http://go.microsoft.com/fwlink/?LinkID=286152).
- Then download and install the [64-bit Azure Active Directory module for Windows PowerShell](http://go.microsoft.com/fwlink/p/?linkid=236297).
- Navigate to the `%programfiles%\Microsoft Azure Active Directory Connect` folder.
- Import the Seamless SSO PowerShell module using this command: `Import-Module .\AzureADSSO.psd1`.
  - In PowerShell, call `New-AzureADSSOAuthenticationContext`. This command should give you a popup to enter your Azure AD tenant administrator credentials.
  - Call `Get-AzureADSSOStatus`. This command provides you the list of AD forests (look at the "Domains" list) on which this feature has been enabled.
2. Update the Kerberos decryption key on each AD forest that it was set it up on
- Call `$creds = Get-Credential`. When prompted, enter the Domain Administrator credentials for the intended AD forest.
- Call `Update-AzureADSSOForest -OnPremCredentials $creds`. This command updates the Kerberos decryption key for the `AZUREADSSOACCT` computer account in this specific AD forest and correspondly updates it in Azure AD.
- Repeat the preceding steps for each AD forest that you’ve set up the feature on.

>[!IMPORTANT]
>Ensure that you don't run the `Update-AzureADSSOForest` command more than once. This invalidates _all_ existing Kerberos tickets for _all_ users and the Seamless SSO feature will stop working for them for up to 12 hours (or the validity time period of Kerberos tickets specified in your Active Directory configuration).

## How can I disable Seamless SSO?

Seamless SSO can be disabled using Azure AD Connect.

Run Azure AD Connect, choose "Change user sign-in page" and click "Next". Then uncheck the "Enable single sign on" option. Continue through the wizard. After completion of the wizard, Seamless SSO is disabled on your tenant.

However, you see a message on screen that reads as follows:

"Single sign-on is now disabled, but there are additional manual steps to perform in order to complete clean-up. Learn more"

The manual steps that you need are as follows:

1. Get list of AD forests where Seamless SSO has been enabled
- First, download, and install the [Microsoft Online Services Sign-In Assistant](http://go.microsoft.com/fwlink/?LinkID=286152).
- Then download and install the [64-bit Azure Active Directory module for Windows PowerShell](http://go.microsoft.com/fwlink/p/?linkid=236297).
- Navigate to the `%programfiles%\Microsoft Azure Active Directory Connect` folder.
- Import the Seamless SSO PowerShell module using this command: `Import-Module .\AzureADSSO.psd1`.
  - In PowerShell, call `New-AzureADSSOAuthenticationContext`. This command should give you a popup to enter your Azure AD tenant administrator credentials.
  - Call `Get-AzureADSSOStatus`. This command provides you the list of AD forests (look at the "Domains" list) on which this feature has been enabled.
2. Manually delete the `AZUREADSSOACCT` computer account from each AD forest that you see listed.

## Next steps

- [**Quick Start**](active-directory-aadconnect-sso-quick-start.md) - Get up and running Azure AD Seamless SSO.
- [**Technical Deep Dive**](active-directory-aadconnect-sso-how-it-works.md) - Understand how this feature works.
- [**Troubleshoot**](active-directory-aadconnect-troubleshoot-sso.md) - Learn how to resolve common issues with the feature.
- [**UserVoice**](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect) - For filing new feature requests.
