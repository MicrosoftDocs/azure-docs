---
title: Expiration for Office 365 groups in Azure Active Directory | Microsoft Docs
description: How to set up expiration for Office 365 groups in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman
editor: ''

ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm:
ms.devlang:
ms.topic: article
ms.date: 02/02/2018
ms.author: curtand                   
ms.reviewer: kairaz.contractor
ms.custom: it-pro

---

# Configure expiration for Office 365 groups

You can now set up expiration for only your Office 365 groups in Azure Active Directory (Azure AD). Once you set a group to expire:
-	Owners of the group are notified to renew the group as the expiration nears
-	Any group that is not renewed is deleted
-	Any Office 365 group that is deleted can be restored within 30 days by the group owners or the administrator

Currently, only one expiration policy can be configured per tenant.

> [!NOTE]
> Setting expiration for Office 365 groups requires an Azure AD Premium license for all members of the groups to which expiration settings are applied.

For information on how to download and install the Azure AD PowerShell cmdlets, see [Azure Active Directory PowerShell for Graph - Public Preview Release 2.0.0.137](https://www.powershellgallery.com/packages/AzureADPreview/2.0.0.137).

## Roles and permissions
These are the roles that can configure and use expiration for Office 365 groups in Azure AD.

Role | Permissions
-------- | --------
Global Administrator<br>User Account Administrator | Can create, read, update, or delete the Office 365 groups expiration policy settings
User | Can renew an Office 365 group that they own<br>Can restore an Office 365 group that they own

For more information on permissions to restore a deleted groups, see [Restore a deleted Office 365 group](active-directory-groups-restore-azure-portal.md).

## Set group expiration

1. Open the [Azure AD admin center](https://aad.portal.azure.com) with an account that is a global administrator in your Azure AD tenant.

2. Select **Users and groups**.

3. Select **Group settings** and then select **Expiration** to open the expiration settings.
  
  ![Expiration blade](./media/active-directory-groups-lifecycle-azure-portal/expiration-settings.png)

4. On the **Expiration** page, you can:

  * Set the group lifetime in days. You could select one of the preset values, or a custom value (should be 31 days or more). 
  * Specify an email address where the renewal and expiration notifications should be sent when a group has no owner. 
  * Select which Office 365 groups expire. You can enable expiration for **All** Office 365 groups, you can choose to enable only **Selected** Office 365 groups, or you select **None** to disable expiration for all groups.
  * Save your settings when you're done by selecting **Save**.

Email notifications such as this one are sent to the Office 365 group owners 30 days, 15 days, and 1 day prior to expiration of the group.

![Expiration email notification](./media/active-directory-groups-lifecycle-azure-portal/expiration-notification.png)

From the group renewal notification email, group owners can directly access the group details page in the My Apps portal. There, the group owners can get more information about the group such as its description, when it was last renewed, when it will expire, and also the ability to renew the group. Group owners can view content and activity in their groups on the group details page through links to Office 365 group resources.

When a group expires, the group is deleted one day after the expiration date. An email notification such as this one is sent to the Office 365 group owners informing them about the expiration and subsequent deletion of their Office 365 group.

![Group deletion email notification](./media/active-directory-groups-lifecycle-azure-portal/deletion-notification.png)

The group can be restored within 30 days of its deletion by selecting **Restore group** or by using PowerShell cmdlets, as described in [Restore a deleted Office 365 group in Azure Active Directory] (https://docs.microsoft.com/azure/active-directory/active-directory-groups-restore-azure-portal).
    
If the group you're restoring contains documents, SharePoint sites, or other persistent objects, it might take up to 24 hours to fully restore the group and its contents.

> [!NOTE]
> * When you first set up expiration, any groups that are older than the expiration interval are set to 30 days until expiration. The first renewal notification email is sent out within a day. 
>  For example, Group A was created 400 days ago, and the expiration interval is set to 180 days. When you apply expiration settings, Group A has 30 days before it is deleted, unless the owner renews it.
> * Currently only one expiration policy
> * When a dynamic group is deleted and restored, it is seen as a new group and re-populated according to the rule. This process might take up to 24 hours.

## Use PowerShell cmdlets to configure expiration
Here are examples of how you can use PowerShell cmdlets to configure the expiration settings for all Office 365 groups in your tenant.  

1. [Install the PowerShell v2.0 Preview module](https://www.powershellgallery.com/packages/AzureADPreview/2.0.0.137) (2.0.0.137) and then sign in at the PowerShell prompt:
  ````
  Install-Module -Name AzureADPreview
  connect-azuread 
  ````
2. Configure the expiration settings
  The `New-AzureADMSGroupLifecyclePolicy` cmdlet sets the lifetime for all Office 365 groups in the tenant to 365 days. Renewal notifications for Office 365 groups without owners will be sent to ‘emailaddress@contoso.com’
  ````
  New-AzureADMSGroupLifecyclePolicy -GroupLifetimeInDays 365 -ManagedGroupTypes All -AlternateNotificationEmails emailaddress@contoso.com
  ````
3. Retrieve the existing policy
  The `Get-AzureADMSGroupLifecyclePolicy' cmdlet retrieves the current Office 365 group expiration settings that have been configured. In this example, you can see 
  -	The policy ID  
  -	The lifetime for all Office 365 groups in the tenant is set to 365 days
  -	Renewal notifications for Office 365 groups without owners will be sent to ‘emailaddress@contoso.com.’
  ````
  Get-AzureADMSGroupLifecyclePolicy
  
  ID                                    GroupLifetimeInDays ManagedGroupTypes AlternateNotificationEmails
  --                                    ------------------- ----------------- ---------------------------
  26fcc232-d1c3-4375-b68d-15c296f1f077  365                 All               emailaddress@contoso.com
  ````
4. Update the existing policy
  The `Set-AzureADMSGroupLifecyclePolicy` cmdlet is used to update an existing policy. In the example below, the group lifetime in the existing policy is changed from 365 days to 180 days. 
  ````
  Set-AzureADMSGroupLifecyclePolicy -Id “26fcc232-d1c3-4375-b68d-15c296f1f077”   -GroupLifetimeInDays 180 -AlternateNotificationEmails "emailaddress@contoso.com"
  ````
5. Add specific groups to the policy
  The `Add-AzureADMSLifecyclePolicyGroup` cmdlet adds a group to the lifecycle policy. As an example: 
  ````
  Add-AzureADMSLifecyclePolicyGroup -Id “26fcc232-d1c3-4375-b68d-15c296f1f077” -groupId "cffd97bd-6b91-4c4e-b553-6918a320211c"
  ````
6. Remove the existing Policy
  The `Remove-AzureADMSGroupLifecyclePolicy` cmdlet deletes the Office 365 group expiration settings but requires the policy ID. This will disable expiration for Office 365 groups. 
  ````
  Remove-AzureADMSGroupLifecyclePolicy -Id “26fcc232-d1c3-4375-b68d-15c296f1f077”
  ````
The following cmdlets can be used to configure the policy in more detail. There's additional [PowerShell documentation](https://docs.microsoft.com/en-us/powershell/module/azuread/?view=azureadps-2.0-preview&branch=master#groups) available for them.

*	Get-AzureADMSGroupLifecyclePolicy
*	New-AzureADMSGroupLifecyclePolicy
*	Get-AzureADMSGroupLifecyclePolicy
*	Set-AzureADMSGroupLifecyclePolicy
*	Remove-AzureADMSGroupLifecyclePolicy
*	Add-AzureADMSLifecyclePolicyGroup
*	Remove-AzureADMSLifecyclePolicyGroup
*	Reset-AzureADMSLifeCycleGroup   
*	Get-AzureADMSLifecyclePolicyGroup
 
## How does expiry works with a retention policy
<!--Please use the below text as a placeholder. I will get this validated with office-->
If you have set up a retention policy in the Security and Compliance center for Office 365 groups, expiration policy works seamlessly with retention policy. When a group expires, the group’s conversations in mailbox and files in the group site are retained in the retention container for the specific number of days defined in the retention policy. Users won't see the group or its content after expiration.

## Next steps
These articles provide additional information on Azure AD groups.

* [See existing groups](active-directory-groups-view-azure-portal.md)
* [Manage settings of a group](active-directory-groups-settings-azure-portal.md)
* [Manage members of a group](active-directory-groups-members-azure-portal.md)
* [Manage memberships of a group](active-directory-groups-membership-azure-portal.md)
* [Manage dynamic rules for users in a group](active-directory-groups-dynamic-membership-azure-portal.md)
