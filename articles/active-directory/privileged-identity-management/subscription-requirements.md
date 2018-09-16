---
title: Subscription requirements to use PIM - Azure | Microsoft Docs
description: Describes the subscription and licensing requirements to use Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: markwahl-msft
ms.assetid: 34367721-8b42-4fab-a443-a2e55cdbf33d
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.component: pim
ms.date: 06/01/2017
ms.author: rolyon
ms.custom: pim

---

# Subscription requirements to use PIM

Azure AD Privileged Identity Management is available as part of the Premium P2 edition of Azure AD. For more information on the other features of P2 and how it compares to Premium P1, see [Azure Active Directory editions](../active-directory-editions.md).

>[!NOTE]
When Azure Active Directory (Azure AD) Privileged Identity Management was in preview, there were no license checks for a tenant to try the service.  Now that Azure AD Privileged Identity Management has reached general availability, a trial or paid subscription must be present for the tenant to continue using Privileged Identity Management after December 2016.
  

## Confirm your trial or paid subscription

If you're not sure whether your organization has a trial or purchased subscription, then you can check whether there is a subscription in your tenant by using the commands included in Azure Active Directory Module for Windows PowerShell V1. 
1. Open a PowerShell window.
2. Enter `Connect-MsolService` to authenticate as a user in your tenant.
3. Enter `Get-MsolSubscription | ft SkuPartNumber,IsTrial,Status`.

This command retrieves a list of the subscriptions in your tenant. If there are no lines returned, you will need to obtain an Azure AD Premium P2 trial, purchase an Azure AD Premium P2 subscription or EMS E5 subscription to use Azure AD Privileged Identity Management.  To get a trial and start using Azure AD Privileged Identity Management, read [Get started with Azure AD Privileged Identity Management](pim-getting-started.md).

If this command returns a line in which SkuPartNumber is "AAD_PREMIUM_P2" or "EMSPREMIUM" and IsTrial is "True", this indicates an Azure AD Premium P2 trial is present in the tenant.  If the subscription status is not enabled, and you do not have an Azure AD Premium P2 or EMS E5 subscription purchase, then you must purchase an Azure AD Premium P2 subscription or EMS E5 subscription to continue using Azure AD Privileged Identity Management.

Azure AD Premium P2 is available through a [Microsoft Enterprise Agreement](https://www.microsoft.com/en-us/licensing/licensing-programs/enterprise.aspx), the [Open Volume License Program](https://www.microsoft.com/en-us/licensing/licensing-programs/open-license.aspx), and the [Cloud Solution Providers program](https://partner.microsoft.com/cloud-solution-provider). Azure and Office 365 subscribers can also buy Azure AD Premium P2 online.  More information on Azure AD Premium pricing and how to order online can be found at [Azure Active Directory Pricing](https://azure.microsoft.com/pricing/details/active-directory/).

## Azure AD Privileged Identity Management is not available in tenant

Azure AD Privileged Identity Management will no longer be available in your tenant if:
- Your organization was using Azure AD Privileged Identity Management when it was in preview and does not purchase Azure AD Premium P2 subscription or EMS E5 subscription.
- Your organization had an Azure AD Premium P2 or EMS E5 trial that expired.
- Your organization had a purchased subscription that expired.

When an Azure AD Premium P2 subscription or EMS E5 subscription expires, or an organization that was using Azure AD Privileged Identity Management in preview does not obtain Azure AD Premium P2 or EMS E5 subscription:

- Permanent role assignments to Azure AD roles will be unaffected.
- The Azure AD Privileged Identity Management extension in the Azure portal, as well as the Graph API cmdlets and PowerShell interfaces of Azure AD Privileged Identity Management, will no longer be available for users to activate privileged roles, manage privileged access, or perform access reviews of privileged roles.
- Eligible role assignments of Azure AD roles will be removed, as users will no longer be able to activate privileged roles.
- Any ongoing access reviews of Azure AD roles will end, and Azure AD Privileged Identity Management configuration settings will be removed.
- Azure AD Privileged Identity Management will no longer send emails on role assignment changes.

## Next steps

- [Start using PIM](pim-getting-started.md)
- [Azure AD directory roles you can manage in PIM](pim-roles.md)
