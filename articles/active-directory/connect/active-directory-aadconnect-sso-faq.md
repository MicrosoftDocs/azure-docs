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
ms.date: 06/12/2017
ms.author: billmath
---

# Azure Active Directory Seamless Single Sign-On: Frequently asked questions

In this article, we address frequently asked questions about Azure Active Directory Seamless Single Sign-On (Azure AD Seamless SSO). Keep checking back for new content.

## How do you disable Seamless SSO?

Azure AD Seamless SSO can be disabled via Azure AD Connect.

Run Azure AD Connect, choose "Change user sign-in page" and click "Next". Then uncheck the "Enable single sign on" option. Continue through the wizard. After completion of the wizard Seamless SSO is disabled on your tenant. However, you'll see a message on screen that reads as follows:

"Single sign-on is now disabled, but there are additional manual steps to perform in order to complete clean-up. Learn more"

These are the manual steps that you need:

- Get the list of AD forests on which Seamless SSO has been enabled
  - In PowerShell, call `New-AzureADSSOAuthenticationContext`. This should give you a popup to enter your Azure AD tenant administrator credentials.
  - Call `Get-AzureADSSOStatus`. This will provide you the list of AD forests (look at the "Domains" list) on which this feature has been enabled.
- Manually delete the AZUREADSSOACCT computer account from each AD forest that you find listed above.

## Next steps

- [**Quick Start**](active-directory-aadconnect-sso-quick-start.md) - Get up and running Azure AD Seamless SSO.
- [**Technical Deep Dive**](active-directory-aadconnect-sso-how-it-works.md) - Understand how this feature works.
- [**Troubleshoot**](active-directory-aadconnect-troubleshoot-sso.md) - Learn how to resolve common issues with the feature.
- [**UserVoice**](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect) - For filing new feature requests.
