---
title: What is a baseline protection in Azure Active Directory conditional access? | Microsoft Docs
description: Learn how baseline protection ensures that you have at least the baseline level of security enabled in your Azure Active Directory environment. 
services: active-directory
keywords: conditional access to apps, conditional access with Azure AD, secure access to company resources, conditional access policies
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: daveba
editor: ''

ms.assetid: 8c1d978f-e80b-420e-853a-8bbddc4bcdad
ms.service: active-directory
ms.subservice: conditional-access
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 08/08/2018
ms.author: joflore
ms.reviewer: nigu

ms.collection: M365-identity-device-management
---
# What is baseline protection?

In the last year, identity attacks have increased by 300%. To protect your environment from the ever-increasing attacks, Azure Active Directory (Azure AD) introduces a new feature called baseline protection. Baseline protection is a set of predefined [conditional access policies](../active-directory-conditional-access-azure-portal.md). The goal of these policies is to ensure that you have at least the baseline level of security enabled in all editions of Azure AD. 

This article provides you with an overview of baseline protection in Azure Active Directory.
 
## Require MFA for admins

Users with access to privileged accounts have unrestricted access to your environment. Due to the power these accounts have, you should treat them with special care. One common method to improve the protection of privileged accounts is to require a stronger form of account verification when they are used to sign-in. In Azure Active Directory, you can get a stronger account verification by requiring multi-factor authentication (MFA).  

**Require MFA for admins** is a baseline policy that requires MFA for the following directory roles:

* Global administrator
* SharePoint administrator
* Exchange administrator
* Conditional access administrator
* Security administrator
* Helpdesk administrator / Password administrator
* Billing administrator
* User administrator

![Azure Active Directory](./media/baseline-protection/01.png)

This baseline policy provides you with the option to exclude users. You might want to exclude one *[emergency-access administrative account](../users-groups-roles/directory-emergency-access.md)* to ensure you are not locked out of the tenant.

## Enable a baseline policy

**To enable a baseline policy:**  

1. Sign in to the [Azure portal](https://portal.azure.com) as global administrator, security administrator, or conditional access administrator.

2. In the **Azure portal**, on the left navbar, click **Azure Active Directory**.

    ![Azure Active Directory](./media/baseline-protection/02.png)

3. On the **Azure Active Directory** page, in the **Security** section, click **Conditional access**.

    ![Conditional access](./media/baseline-protection/05.png)

4. In the list of policies, click a policy that starts with **Baseline policy:**. 

5. To enable the policy, click **Use policy immediately**.

6. Click **Save**. 

## What you should know 

While managing custom conditional access policies requires an Azure AD Premium license, baseline policies are available in all editions of Azure AD.     

The directory roles that are included in the baseline policy are the most privileged Azure AD roles. 

If you have privileged accounts that are used in your scripts, you should replace them with [managed identities for Azure resources](../managed-identities-azure-resources/overview.md) or [service principals with certificates](../develop/howto-authenticate-service-principal-powershell.md). As a temporary workaround, you can exclude specific user accounts from the baseline policy. 

Baseline policies apply to legacy authentication flows like POP, IMAP, older Office desktop client. 

## Next steps

For more information, see:

- [Five steps to securing your identity infrastructure](https://docs.microsoft.com/azure/security/azure-ad-secure-steps)

- [What is conditional access in Azure Active Directory?](overview.md) 
