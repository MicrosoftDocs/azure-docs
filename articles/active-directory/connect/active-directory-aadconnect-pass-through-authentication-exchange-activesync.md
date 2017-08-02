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

### Configuration 1: I have Exchange mailboxes and I am enabling Pass-through Authentication as my Azure AD sign-in method

1. Enable Pass-through Authentication on your tenant using the instructions in [this article](active-directory-aadconnect-pass-through-authentication-quick-start.md).
2. Use [Exchange PowerShell](https://technet.microsoft.com/library/mt587043(v=exchg.150).aspx) to run the following command:

```Get-OrganizationConfig | fl per*```

3. Check the value of the `PerTenantSwitchToESTSEnabled` setting. If the value is **true**, your tenant is correctly configured. If the value is **false**, run the following command:

```Set-OrganizationConfig -PerTenantSwitchToESTSEnabled:$true```

Contact Microsoft Support if this step fails with the following error:

```TBD```

4. Ensure that the value of the `PerTenantSwitchToESTSEnabled` setting is set to **true**. At this stage, your tenant is correctly configured for Exchange ActiveSync support with Pass-through Authentication.

>[!IMPORTANT]
>It takes up to an hour for Exchange ActiveSync to start working after you complete all the instructions.

### Configuration 2: I have Exchange mailboxes and I am switching from AD FS to Pass-through Authentication as my Azure AD sign-in method

### Configuration 3: I already have Pass-through Authentication as my Azure AD sign-in method, and I am now setting up Exchange mailboxes

1. Use [Exchange PowerShell](https://technet.microsoft.com/library/mt587043(v=exchg.150).aspx) to run the following command:

```Get-OrganizationConfig | fl per*```

2. Check the value of the `PerTenantSwitchToESTSEnabled` setting. If the value is **true**, your tenant is correctly configured. If the value is **false**, run the following command:

```Set-OrganizationConfig -PerTenantSwitchToESTSEnabled:$true```

Contact Microsoft Support if this step fails with the following error:

```TBD```

3. Ensure that the value of the `PerTenantSwitchToESTSEnabled` setting is set to **true**. At this stage, your tenant is correctly configured for Exchange ActiveSync support with Pass-through Authentication.

>[!IMPORTANT]
>It takes up to an hour for Exchange ActiveSync to start working after you complete all the instructions.

## Next steps

- [**Troubleshoot**](active-directory-aadconnect-troubleshoot-pass-through-authentication.md) - Learn how to resolve common issues with the feature.
- [**UserVoice**](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect) - For filing new feature requests.
