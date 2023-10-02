---
title: Set expiration for Microsoft 365 groups
description: How to set up expiration for Microsoft 365 groups in Microsoft Entra ID
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
editor: ''

ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.topic: how-to
ms.date: 09/08/2023
ms.author: barclayn                   
ms.reviewer: jodah
ms.custom: it-pro, has-azure-ad-ps-ref

ms.collection: M365-identity-device-management
---

# Configure the expiration policy for Microsoft 365 groups

This article tells you how to manage the lifecycle of Microsoft 365 groups by setting an expiration policy for them. You can set expiration policy only for  Microsoft 365 groups in Microsoft Entra ID, part of Microsoft Entra.

Once you set a group to expire:

- Groups with user activities are automatically renewed as the expiration nears.
- Owners of the group are notified to renew the group, if the group is not auto-renewed.
- Any group that is not renewed is deleted.
- Any Microsoft 365 group that is deleted can be restored within 30 days by the group owners or the administrator.

Currently, only one expiration policy can be configured for all Microsoft 365 groups in a Microsoft Entra organization.

> [!NOTE]
> Configuring and using the expiration policy for Microsoft 365 groups requires you to possess but not necessarily assign Microsoft Entra ID P1 or P2 licenses for the members of all groups to which the expiration policy is applied.

For information on how to download and install the Azure AD PowerShell cmdlets, see [Azure Active Directory PowerShell for Graph 2.0.0.137](https://www.powershellgallery.com/packages/AzureADPreview/2.0.0.137).

## Activity-based automatic renewal

With Microsoft Entra intelligence, groups are now automatically renewed based on whether they have been recently used. This feature eliminates the need for manual action by group owners, because it's based on user activity in groups across Microsoft 365 services like Outlook, SharePoint, Teams, or Yammer. For example, if an owner or a group member does something like upload a document to SharePoint, visit a Teams channel, send an email to the group in Outlook, or view a post in Yammer, the group is automatically renewed around 35 days before the group expires and the owner does not get any renewal notifications. 

For example, consider an expiration policy that is set so that a group expires after 30 days of inactivity. However, to keep from sending an expiration email the day that group expiration is enabled (because there's no record activity yet), Microsoft Entra first waits five days. If there is activity in those five days, the expiration policy works as expected. If there is no activity within five days, we send an expiration/renewal email. Of course, if the group was inactive for five days, an email was sent, and then the group was active, we will autorenew it and start the expiration period again.

### Activities that automatically renew group expiration

The following user actions cause automatic group renewal:

- SharePoint: View, edit, download, move, share, or upload files
- Outlook: Join group, read/write group message from group space, Like a message (in Outlook Web Access)
- Teams: Visit a Teams channel
- Yammer: View a post within a Yammer community or an interactive email in Outlook 

### Auditing and reporting

Administrators can get a list of automatically renewed groups from the activity audit logs in Microsoft Entra ID.

![Automatic renewal of groups based on activity](./media/groups-lifecycle/audit-logs-autorenew-group.png)

## Roles and permissions

The following are roles that can configure and use expiration for Microsoft 365 groups in Microsoft Entra ID.

Role | Permissions
-------- | --------
Global administrator, Group administrator, or User administrator | Can create, read, update, or delete the Microsoft 365 groups expiration policy settings<br>Can renew any Microsoft 365 group
User | Can renew a Microsoft 365 group that they own<br>Can restore a Microsoft 365 group that they own<br>Can read the expiration policy settings

For more information on permissions to restore a deleted group, see [Restore a deleted Microsoft 365 group in Microsoft Entra ID](groups-restore-deleted.md).

## Set group expiration

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Global Administrator](../roles/permissions-reference.md#global-administrator).
1. Select Microsoft Entra ID.
1. Select **Groups**, **All groups** then select **Expiration** to open the expiration settings.
  
   ![Expiration settings for groups](./media/groups-lifecycle/expiration-settings.png)

3. On the **Expiration** page, you can:

    - Set the group lifetime in days. You could select one of the preset values, or a custom value (should be 30 days or more).
    - Specify an email address where the renewal and expiration notifications should be sent when a group has no owner.
    - Select which Microsoft 365 groups expire. You can set expiration for:
      - **All** Microsoft 365 groups
      - A list of **Selected** Microsoft 365 groups
      - **None** to restrict expiration for all groups
    - Save your settings when you're done by selecting **Save**.

> [!NOTE]
> - When you first set up expiration, any groups that are older than the expiration interval are set to 35 days until expiration unless the group is automatically renewed or the owner renews it.
> - When a dynamic group is deleted and restored, it's seen as a new group and re-populated according to the rule. This process can take up to 24 hours.
> - Expiration notices for groups used in Teams appear in the Teams Owners feed.
> - When you enable expiration for selected groups, you can add up to 500 groups to the list. If you need to add more than 500 groups, you can enable expiration for all your groups. In that scenario, the 500-group limitation doesn't apply.
>- Groups do not renew immediately when auto-renew activities occur. In the event of an activity, a flag is placed on the group to indicate it is ready for renewal when it's near expiry. If the group is near expiry, then renewal will occur within 24 hours. 

## Email notifications

If groups are not automatically renewed, email notifications such as this one are sent to the Microsoft 365 group owners 30 days, 15 days, and 1 day prior to expiration of the group. The language of the email is determined by groups owner's preferred language or Microsoft Entra language setting. If the group owner has defined a preferred language, or multiple owners have the same preferred language, then that language is used. For all other cases, Microsoft Entra language setting is used.

![Expiration email notifications](./media/groups-lifecycle/expiration-notification.png)

From the **Renew group** notification email, group owners can directly access the group details page in the [Access Panel](https://account.activedirectory.windowsazure.com/r#/applications). There, the users can get more information about the group such as its description, when it was last renewed, when it will expire, and also the ability to renew the group. The group details page now also includes links to the Microsoft 365 group resources, so that the group owner can conveniently view the content and activity in their group.

>[!Important]
> If there is any problem with the notification emails, and they aren't sent out or they are delayed, be assured that Microsoft will never delete a group before the last email is sent.

When a group expires, the group is deleted one day after the expiration date. An email notification such as this one is sent to the Microsoft 365 group owners informing them about the expiration and subsequent deletion of their Microsoft 365 group.

![Group deletion email notifications](./media/groups-lifecycle/deletion-notification.png)

The group can be restored within 30 days of its deletion by selecting **Restore group** or by using PowerShell cmdlets, as described in [Restore a deleted Microsoft 365 group in Microsoft Entra ID](groups-restore-deleted.md). Please note that the 30-day group restoration period is not customizable.

If the group you're restoring contains documents, SharePoint sites, or other persistent objects, it might take up to 24 hours to fully restore the group and its contents.

## How to retrieve Microsoft 365 group expiration date

In addition to Access Panel where users can view group details including expiration date and last renewed date, expiration date of a Microsoft 365 group can be retrieved from Microsoft Graph REST API Beta. expirationDateTime as a group property has been enabled in Microsoft Graph Beta. It can be retrieved with a GET request. For more details, please refer to [this example](/graph/api/group-get?view=graph-rest-beta#example&preserve-view=true).

> [!NOTE]
> In order to manage group memberships on Access Panel, "Restrict access to Groups in Access Panel" needs to be set to "No" in Microsoft Entra groups General Setting.

## How Microsoft 365 group expiration works with a mailbox on legal hold

When a group expires and is deleted, then 30 days after deletion the group's data from apps like Planner, Sites, or Teams is permanently deleted, but the group mailbox that is on legal hold is retained and is not permanently deleted. The administrator can use Exchange cmdlets to restore the mailbox to fetch the data.

## How Microsoft 365 group expiration works with retention policy

The retention policy is configured by way of the Security & Compliance Center. If you have set up a retention policy for Microsoft 365 groups, when a group expires and is deleted, the group conversations in the group mailbox and files in the group site are retained in the retention container for the specific number of days defined in the retention policy. Users won't see the group or its content after expiration, but can recover the site and mailbox data via e-discovery.

## PowerShell examples

Here are examples of how you can use PowerShell cmdlets to configure the expiration settings for Microsoft 365 groups in your Microsoft Entra organization:

1. Install the PowerShell v2.0 module and sign in at the PowerShell prompt:

   ``` PowerShell
   Install-Module -Name AzureAD
   Connect-AzureAD
   ```

1. Configure the expiration settings Use the New-AzureADMSGroupLifecyclePolicy cmdlet to set the lifetime for all Microsoft 365 groups in the Microsoft Entra organization to 365 days. Renewal notifications for Microsoft 365 groups without owners will be sent to `emailaddress@contoso.com`
  
   ``` PowerShell
   New-AzureADMSGroupLifecyclePolicy -GroupLifetimeInDays 365 -ManagedGroupTypes All -AlternateNotificationEmails emailaddress@contoso.com
   ```

1. Retrieve the existing policy Get-AzureADMSGroupLifecyclePolicy: This cmdlet retrieves the current Microsoft 365 group expiration  settings that have been configured. In this example, you can see:

   - The policy ID
   - The lifetime for all Microsoft 365 groups in the Microsoft Entra organization is set to 365 days
   - Renewal notifications for Microsoft 365 groups without owners will be sent to 'emailaddress@contoso.com.'
  
   ```powershell
   Get-AzureADMSGroupLifecyclePolicy
  
   ID                                    GroupLifetimeInDays ManagedGroupTypes AlternateNotificationEmails
   --                                    ------------------- ----------------- ---------------------------
   26fcc232-d1c3-4375-b68d-15c296f1f077  365                 All               emailaddress@contoso.com
   ```

1. Update the existing policy Set-AzureADMSGroupLifecyclePolicy: This cmdlet is used to update an existing policy. In the example below, the group lifetime in the existing policy is changed from 365 days to 180 days.
  
   ```powershell
   Set-AzureADMSGroupLifecyclePolicy -Id "26fcc232-d1c3-4375-b68d-15c296f1f077" -GroupLifetimeInDays 180 -AlternateNotificationEmails "emailaddress@contoso.com"
   ```
  
1. Add specific groups to the policy Add-AzureADMSLifecyclePolicyGroup: This cmdlet adds a group to the lifecycle policy. As an example:
  
   ```powershell
   Add-AzureADMSLifecyclePolicyGroup -Id "26fcc232-d1c3-4375-b68d-15c296f1f077" -groupId "cffd97bd-6b91-4c4e-b553-6918a320211c"
   ```
  
1. Remove the existing Policy Remove-AzureADMSGroupLifecyclePolicy: This cmdlet deletes the Microsoft 365 group expiration settings but requires the policy ID. This cmdlet disables expiration for Microsoft 365 groups.
  
   ```powershell
   Remove-AzureADMSGroupLifecyclePolicy -Id "26fcc232-d1c3-4375-b68d-15c296f1f077"
   ```
  
The following cmdlets can be used to configure the policy in more detail. For more information, see [PowerShell documentation](/powershell/module/azuread/?view=azureadps-2.0-preview&preserve-view=true#groups).

- Get-AzureADMSGroupLifecyclePolicy
- New-AzureADMSGroupLifecyclePolicy
- Set-AzureADMSGroupLifecyclePolicy
- Remove-AzureADMSGroupLifecyclePolicy
- Add-AzureADMSLifecyclePolicyGroup
- Remove-AzureADMSLifecyclePolicyGroup
- Reset-AzureADMSLifeCycleGroup
- Get-AzureADMSLifecyclePolicyGroup

## Next steps

These articles provide additional information on Microsoft Entra groups.

- [See existing groups](../fundamentals/groups-view-azure-portal.md)
- [Manage settings of a group](../fundamentals/how-to-manage-groups.md)
- [Manage members of a group](../fundamentals/how-to-manage-groups.md)
- [Manage memberships of a group](../fundamentals/how-to-manage-groups.md)
- [Manage dynamic rules for users in a group](groups-dynamic-membership.md)
