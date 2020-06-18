---
title: Manage access to Azure management with Conditional Access in Azure AD
description: Learn about using Conditional Access in Azure AD to manage access to Azure management.
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: skwan
ms.assetid: 0adc8b11-884e-476c-8c43-84f9bf12a34b
ms.service: role-based-access-control
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 07/15/2019
ms.author: rolyon
ms.reviewer: skwan
---

# Manage access to Azure management with Conditional Access

> [!CAUTION]
> Make sure you understand how Conditional Access works before setting up a policy to manage access to Azure management. Make sure you don't create conditions that could block your own access to the portal.

Conditional Access in Azure Active Directory (Azure AD) controls access to cloud apps based on specific conditions that you specify. To allow access, you create Conditional Access policies that allow or block access based on whether or not the requirements in the policy are met. 

Typically, you use Conditional Access to control access to your cloud apps. You can also set up policies to control access to Azure management based on certain conditions (such as sign-in risk, location, or device) and to enforce requirements like multi-factor authentication.

To create a policy for Azure management, you select **Microsoft Azure Management** under **Cloud apps** when choosing the app to which to apply the policy.

![Conditional Access for Azure management](./media/conditional-access-azure-management/conditional-access-azure-mgmt.png)

The policy you create applies to all Azure management endpoints, including the following:

- Azure portal
- Azure Resource Manager provider
- Classic Service Management APIs
- Azure PowerShell
- Visual Studio subscriptions administrator portal
- Azure DevOps
- Azure Data Factory portal

Note that the policy applies to Azure PowerShell, which calls the Azure Resource Manager API. It does not apply to [Azure AD PowerShell](/powershell/azure/active-directory/install-adv2), which calls Microsoft Graph.

For more information on how to set up a sample policy to enable Conditional Access for Microsoft Azure management, see the article [Conditional Access: Require MFA for Azure management](../active-directory/conditional-access/howto-conditional-access-policy-azure-management.md).
