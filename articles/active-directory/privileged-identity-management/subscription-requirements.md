---
title: Subscription requirements for Azure AD Privileged Identity Management  | Microsoft Docs
description: A topic that explains the subscription and licensing requirements for managing and using Azure AD PIM in your tenant
services: active-directory
documentationcenter: ''
author: barclayn
manager: mbaldwin
editor: mwahl

ms.assetid: 34367721-8b42-4fab-a443-a2e55cdbf33d
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/01/2016
ms.author: barclayn

---

# Azure AD PIM subscription requirements

## In this article
This article covers the subscription and licensing requirements for managing and using Azure AD PIM in your tenant.  

When Azure AD Privileged Identity Management was in preview there were no license checks for a tenant to try the service.  Now that Azure AD PIM has reached general availability, a trial or paid subscription must be present in the tenant to continue using PIM after December 2016.  
Azure AD Privileged Identity Management is available as part of the Premium P2 edition of Azure Active Directory. (For more information on the other features of P2 and how it compares to Premium P1, see [Azure Active Directory editions](../active-directory-editions.md)

If you're not sure whether your organization has a trial or purchased subscription, then you can check whether there is a subscription in your tenant using the commands included in Azure Active Directory Module for Windows PowerShell V1. 
1. Open a PowerShell Window
2. Type `Connect-MsolService` to authenticate as a user in your tenant
3. Type `Get-MsolSubscription | ft SkuPartNumber,IsTrial,Status`

This command retrieves a list of the subscriptions in your tenant. If there are no lines returned, you will need to obtain an Azure AD Premium P2 trial, or purchase an Azure AD Premium P2 subscription to use Azure AD PIM.  To get a trial and start using PIM, read the document [Get Started with Azure AD Privileged Identity Management.](../active-directory-privileged-identity-management-getting-started.md)

If this command returns a line in which the SkuPartNumber is "AAD_PREMIUM_P2" and IsTrial is "True", this indicates an Azure AD Premium P2 trial is present in the tenant.  If the subscription status is not Enabled, and you do not have an Azure AD Premium P2 purchase, then you must purchase an Azure AD Premium P2 subscription to continue using Azure AD PIM.
Azure AD Premium P2 is available through a [Microsoft Enterprise Agreement](https://www.microsoft.com/en-us/licensing/licensing-programs/enterprise.aspx), the [Open Volume License Program](https://www.microsoft.com/en-us/licensing/licensing-programs/open-license.aspx), and the [Cloud Solution Providers program](https://partner.microsoft.com/en-US/cloud-solution-provider). Azure and Office 365 subscribers can also buy Azure Active Directory Premium P2 online.  More information on Azure AD Premium pricing and to order online can be found at [Azure Active Directory Pricing](https://azure.microsoft.com/en-us/pricing/details/active-directory/).

Azure AD PIM will no longer be available in your tenant if:
- Your organization was using Azure AD PIM when it was in preview and does not purchase Azure AD Premium P2
- Your organization had an Azure AD Premium P2 trial that expired
- Your organization had a purchased subscription that expired

When an Azure AD Premium P2 subscription expires, or an organization which was using Azure AD PIM does not obtain Azure AD Premium P2:

- Permanent role assignments to Azure AD roles will be unaffected.
- The Azure AD PIM extension in the Azure portal, as well as the Graph API Cmdlets and PowerShell interfaces of Azure AD PIM, will no longer be available for users to activate privileged roles, manage privileged access, or perform access reviews of privileged roles.
- Eligible role assignments of Azure AD roles will be removed, as users will no longer be able to activate privileged roles.
- Any ongoing access reviews of Azure AD roles will end, and Azure AD PIM configuration settings will be removed.
- Azure AD PIM will no longer send emails on role assignment changes.

## Next Steps

- [Get Started with Azure AD Privileged Identity Management.](../active-directory-privileged-identity-management-getting-started.md)
- [Roles in Azure AD Privileged Identity Management](../active-directory-privileged-identity-management-roles.md)
