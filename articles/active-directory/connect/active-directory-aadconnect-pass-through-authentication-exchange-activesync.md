---
title: 'Azure AD Connect: Pass-through Authentication - Exchange ActiveSync support | Microsoft Docs'
description: This article describes how to get Exchange ActiveSync support with Azure Active Directory (Azure AD) Pass-through Authentication configuration.
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
ms.date: 08/02/2017
ms.author: billmath
---

# Azure Active Directory Pass-through Authentication: Exchange ActiveSync support

## Overview

This article is for customers who want Exchange ActiveSync support with Azure AD Pass-through Authentication. Ensure that you use the instructions specific to your configuration:

- [Configuration 1: I have Exchange mailboxes and I am enabling Pass-through Authentication as my Azure AD sign-in method](#configuration-1-i-have-exchange-mailboxes-and-i-am-enabling-pass-through-authentication-as-my-azure-ad-sign-in-method)
- [Configuration 2: I have Exchange mailboxes and I am switching from AD FS to Pass-through Authentication as my Azure AD sign-in method](#configuration-2-i-have-exchange-mailboxes-and-i-am-switching-from-ad-fs-to-pass-through-authentication-as-my-azure-ad-sign-in-method)
- [Configuration 3: I already have Pass-through Authentication as my Azure AD sign-in method, and I am now setting up Exchange mailboxes](#configuration-3-i-already-have-pass-through-authentication-as-my-azure-ad-sign-in-method-and-i-am-now-setting-up-exchange-mailboxes)

If you face issues during set up, read our [troubleshooting guide](active-directory-aadconnect-troubleshoot-pass-through-authentication.md#exchange-activesync-configuration-issues) for next steps.

### Configuration 1: I have Exchange mailboxes and I am enabling Pass-through Authentication as my Azure AD sign-in method

1. Use [Exchange PowerShell](https://technet.microsoft.com/library/mt587043(v=exchg.150).aspx) to run the following command:
```
Get-OrganizationConfig | fl per*
```

2. Check the value of the `PerTenantSwitchToESTSEnabled` setting. If the value is **true**, your tenant is correctly configured - no further action is required. If the value is **false**, run the following command:
```
Set-OrganizationConfig -PerTenantSwitchToESTSEnabled:$true
```

3. Verify that the value of the `PerTenantSwitchToESTSEnabled` setting is now set to **true**.
4. Enable Pass-through Authentication on your tenant using the instructions in [this article](active-directory-aadconnect-pass-through-authentication-quick-start.md).
5. If you have not already done so, disable Password Hash Synchronization on the [Optional features](active-directory-aadconnect-get-started-custom.md#optional-features) page in the Azure AD Connect wizard.

At this stage, your tenant is correctly configured for Exchange ActiveSync support with Pass-through Authentication. Wait at least an hour before you test Exchange ActiveSync.

### Configuration 2: I have Exchange mailboxes and I am switching from AD FS to Pass-through Authentication as my Azure AD sign-in method

1. Use [Exchange PowerShell](https://technet.microsoft.com/library/mt587043(v=exchg.150).aspx) to run the following command:
```
Get-OrganizationConfig | fl per*
```

2. Check the value of the `PerTenantSwitchToESTSEnabled` setting. If the value is **true**, skip Step 3. If the value is **false**, run the following command:
```
Set-OrganizationConfig -PerTenantSwitchToESTSEnabled:$true
```

3. Verify that the value of the `PerTenantSwitchToESTSEnabled` setting is now set to **true**. Wait an hour for the `PerTenantSwitchToESTSEnabled` setting to take effect, and then proceed to the next step.
4. Enable Pass-through Authentication on your tenant using the instructions in [this article](active-directory-aadconnect-pass-through-authentication-quick-start.md). This action also disables AD FS as your sign-in method, if you had configured AD FS using Azure AD Connect. If you had configured AD FS _outside_ of Azure AD Connect, use PowerShell to manually convert your Federated domains to Managed domains. Wait at least 12 hours before shutting down your AD FS sign-in infrastructure.
5. If you have not already done so, disable Password Hash Synchronization on the [Optional features](active-directory-aadconnect-get-started-custom.md#optional-features) page in the Azure AD Connect wizard.

At this stage, your tenant is correctly configured for Exchange ActiveSync support with Pass-through Authentication.

### Configuration 3: I already have Pass-through Authentication as my Azure AD sign-in method, and I am now setting up Exchange mailboxes

1. Use [Exchange PowerShell](https://technet.microsoft.com/library/mt587043(v=exchg.150).aspx) to run the following command:
```
Get-OrganizationConfig | fl per*
```

2. Check the value of the `PerTenantSwitchToESTSEnabled` setting. If the value is **true**, your tenant is correctly configured - no further action is required. If the value is **false**, run the following command:
```
Set-OrganizationConfig -PerTenantSwitchToESTSEnabled:$true
```

3. Verify that the value of the `PerTenantSwitchToESTSEnabled` setting is now set to **true**. Wait at least an hour before you test Exchange ActiveSync.
4. If you have not already done so, disable Password Hash Synchronization on the [Optional features](active-directory-aadconnect-get-started-custom.md#optional-features) page in the Azure AD Connect wizard.

At this stage, your tenant is correctly configured for Exchange ActiveSync support with Pass-through Authentication.

## Next steps

- [**Troubleshoot**](active-directory-aadconnect-troubleshoot-pass-through-authentication.md) - Learn how to resolve common issues with the feature.
- [**UserVoice**](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect) - For filing new feature requests.
