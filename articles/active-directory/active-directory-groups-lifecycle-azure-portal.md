---
title: Expiration policy for Office 365 groups in Azure Active Directory | Microsoft Docs
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
ms.date: 02/15/2018
ms.author: curtand                   
ms.reviewer: kairaz.contractor
ms.custom: it-pro

---

# Configure expiration policy for Office 365 groups

You can now set up an expiration policy for Office 365 groups in Azure Active Directory (Azure AD). Once you set the expiration policy in a tenant:
-	Owners of the group are notified to renew the group as the expiration nears
-	Any group that is not renewed is deleted
-	Any Office 365 group that is deleted can be restored within 30 days by the group owners or the administrator

Currently, only one expiration policy can be configured per tenant.

> [!NOTE]
> Setting expiration for Office 365 groups requires an Azure AD Premium license for every member of the groups to which the expiration policy is applied.

For information on how to download and install the Azure AD PowerShell cmdlets, see [Azure Active Directory PowerShell for Graph - Public Preview Release 2.0.0.137](https://www.powershellgallery.com/packages/AzureADPreview/2.0.0.137).

## Roles and permissions
The following roles are permitted to configure expiration for Office 365 groups in Azure AD.

Role | Permissions
-------- | --------
Global Administrator<br>User Account Administrator | Can create, read, update, or delete the Office 365 groups expiration policy settings<br>Can renew any Office 365 group
User | Can renew an Office 365 group that they own<br>Can restore an Office 365 group that they own<br>Can read the expiration policy settings

For more information on permissions to restore a deleted group, see [Restore a deleted Office 365 group](active-directory-groups-restore-azure-portal.md).

## Set group expiration

1. Open the [Azure AD admin center](https://aad.portal.azure.com) with an account that is a global administrator in your Azure AD tenant.

2. Select **Users and groups**.

3. Select **Group settings** and then select **Expiration** to open the expiration settings.
  
  ![Expiration blade](./media/active-directory-groups-lifecycle-azure-portal/expiration-settings.png)

4. On the **Expiration** page, you can:

  * Set the group lifetime in days. You could select a preset value or set a custom value (should be 31 days or more). 
  * Specify the email address where renewal and expiration notifications are sent when a group has no owner. 
  * Enable expiration for **All** or **Selected** Office 365 groups, or select **None** to disable expiration for all groups.
  * Save your settings.

Email notifications such as the following are sent to the Office 365 group owners 30 days, 15 days, and 1 day prior to expiration of the group.

![Expiration email notification](./media/active-directory-groups-lifecycle-azure-portal/expiration-notification.png)

From the group renewal notification email, group owners can directly access the group details page in the My Apps portal. The group details page contains the group description, when it was last renewed, when it expires, and you can renew the group there. The group details page also contains links to Office 365 group resources so that group owners can view content and activity in their groups.

When a group expires, the group is deleted one day after the expiration date. The following email is an example of what is sent to Office 365 group owners informing them of the deletion of their Office 365 group.

![Group deletion email notification](./media/active-directory-groups-lifecycle-azure-portal/deletion-notification.png)

The group can be restored within 30 days of its deletion. It can be through using the **Restore group** link in the email, or you can also use PowerShell cmdlets, as described in [Restore a deleted Office 365 group in Azure Active Directory] (active-directory-groups-restore-azure-portal.md).
    
It can take up to 24 hours to fully restore the group and its contents when it contains documents, SharePoint sites, or other persistent objects.

> [!NOTE]
> * When you first set up expiration, any groups that are older than the expiration interval are set to 30 days until expiration. The first renewal notification email is sent out within a day. For example, Group A was created 400 days ago, and the expiration interval is set to 180 days. When you apply expiration settings, Group A has 30 days before it is deleted, unless the owner renews it.
> * When a dynamic group is deleted and restored, it is seen as a new group and repopulated according to the rule. This process might take up to 24 hours.

## Use PowerShell cmdlets to configure expiration
Here are examples of how you can use PowerShell cmdlets to configure the expiration settings for all Office 365 groups in your tenant.  

1. [Install the PowerShell v2.0 Preview module](https://www.powershellgallery.com/packages/AzureADPreview/2.0.0.137) (2.0.0.137) and then sign in at the PowerShell prompt:
  
  ````
  Install-Module -Name AzureADPreview
  connect-azuread 
  ````
  
2. Configure the expiration settings.
  The `New-AzureADMSGroupLifecyclePolicy` cmdlet sets the expiration interval for all Office 365 groups in the tenant to 365 days. In the example below, renewal notifications for Office 365 groups without owners are sent to ‘emailaddress@contoso.com’.
  
  ````
  New-AzureADMSGroupLifecyclePolicy -GroupLifetimeInDays 365 -ManagedGroupTypes All -AlternateNotificationEmails emailaddress@contoso.com
  ````
  
3. Retrieve the existing policy.
  The `Get-AzureADMSGroupLifecyclePolicy' cmdlet retrieves the current Office 365 group expiration settings that have been configured. In this example, you can see:
  -	The policy ID  
  -	The lifetime for all Office 365 groups in the tenant is set to 365 days
  -	Renewal notifications for Office 365 groups without owners get sent to ‘emailaddress@contoso.com.’
  
  ````
  Get-AzureADMSGroupLifecyclePolicy
  
  ID                                    GroupLifetimeInDays ManagedGroupTypes AlternateNotificationEmails
  --                                    ------------------- ----------------- ---------------------------
  26fcc232-d1c3-4375-b68d-15c296f1f077  365                 All               emailaddress@contoso.com
  ````
  
4. Update the existing policy.
  The `Set-AzureADMSGroupLifecyclePolicy` cmdlet is used to update an existing policy. In the example below, the group lifetime in the existing policy is changed from 365 days to 180 days. 
  
  ````
  Set-AzureADMSGroupLifecyclePolicy -Id “26fcc232-d1c3-4375-b68d-15c296f1f077”   -GroupLifetimeInDays 180 -AlternateNotificationEmails "emailaddress@contoso.com"
  ````
  
5. Add specific groups to the policy.
  The `Add-AzureADMSLifecyclePolicyGroup` cmdlet adds a group to the lifecycle policy. As an example: 
  
  ````
  Add-AzureADMSLifecyclePolicyGroup -Id “26fcc232-d1c3-4375-b68d-15c296f1f077” -groupId "cffd97bd-6b91-4c4e-b553-6918a320211c"
  ````
  
6. Remove the existing Policy.
  The `Remove-AzureADMSGroupLifecyclePolicy` cmdlet deletes the Office 365 group expiration settings and requires the policy ID. This action disables expiration for Office 365 groups. 

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
 
## How Office 365 group expiration works with a mailbox on legal hold 
When a group that is on legal hold expires and is deleted, 30 days after deletion:
* Groups app data (from Planner, Sites, Teams, and so on) is permanently deleted
* The group mailbox that is on legal hold is retained and isn't permanently deleted

The administrator can use Exchange cmdlets to restore the mailbox to fetch the data. 

## How Office 365 group expiration works with retention policy 
Retention policy  for Office 365 groups is configured via the Security and Compliance Center. When you set up a retention policy, when a group is deleted: 
* The group conversations in mailbox and files in the group site are retained in the retention container for the specific number of days defined in the retention policy. 
* Users can't see the group or its content after expiration, but can recover the site and mailbox data via e-discovery.

## Next steps
These articles provide additional information on Azure AD groups.

* [See existing groups](active-directory-groups-view-azure-portal.md)
* [Group name policy settings for Office 365 groups](groups-naming-policy.md)
* [Manage settings of a group](active-directory-groups-settings-azure-portal.md)
* [Manage members of a group](active-directory-groups-members-azure-portal.md)
* [Manage memberships of a group](active-directory-groups-membership-azure-portal.md)
* [Manage dynamic rules for users in a group](active-directory-groups-dynamic-membership-azure-portal.md)
