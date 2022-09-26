---
title: Restore a deleted Microsoft 365 group - Azure AD | Microsoft Docs
description: How to restore a deleted group, view restorable groups, and permanently delete a group in Azure Active Directory
services: active-directory
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.topic: quickstart
ms.date: 06/24/2022
ms.author: barclayn
ms.reviewer: krbain
ms.custom: it-pro, seo-update-azuread-jan, mode-other
ms.collection: M365-identity-device-management
---
# Restore a deleted Microsoft 365 group in Azure Active Directory

When you delete a Microsoft 365 group in Azure Active Directory (Azure AD), part of Microsoft Entra, the deleted group is retained but not visible for 30 days from the deletion date. This behavior is so that the group and its contents can be restored if needed. This functionality is restricted exclusively to Microsoft 365 groups in Azure AD. It is not available for security groups and distribution groups. Please note that the 30-day group restoration period is not customizable.

> [!NOTE]
> Don't use `Remove-MsolGroup` because it purges the group permanently. Always use `Remove-AzureADMSGroup` to delete a Microsoft 365 group.

The permissions required to restore a group can be any of the following:

Role | Permissions
--------- | ---------
Global administrator, Group administrator, Partner Tier2 support, and Intune administrator | Can restore any deleted Microsoft 365 group
User administrator and Partner Tier1 support | Can restore any deleted Microsoft 365 group except those groups assigned to the Global Administrator role
User | Can restore any deleted Microsoft 365 group that they own

## View and manage the deleted Microsoft 365 groups that are available to restore

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) with a User administrator account.

2. Select **Groups**, then select **Deleted groups** to view the deleted groups that are available to restore.

    ![view groups that are available to restore](./media/groups-restore-deleted/deleted-groups3.png)

3. On the **Deleted groups** blade, you can:

   - Restore the deleted group and its contents by selecting **Restore group**.
   - Permanently remove the deleted group by selecting **Delete permanently**. To permanently remove a group, you must be an administrator.

## View the deleted Microsoft 365 groups that are available to restore using PowerShell

The following cmdlets can be used to view the deleted groups to verify that the one or ones you're interested in have not yet been permanently purged. These cmdlets are part of the [Azure AD PowerShell module](https://www.powershellgallery.com/packages/AzureAD/). More information about this module can be found in the [Azure Active Directory PowerShell Version 2](/powershell/azure/active-directory/install-adv2) article.

1.  Run the following cmdlet to display all deleted Microsoft 365 groups in your Azure AD organization that are still available to restore.
   

    ```powershell
    Get-AzureADMSDeletedGroup
    ```

2.  Alternately, if you know the objectID of a specific group (and you can get it from the cmdlet in step 1), run the following cmdlet to verify that the specific deleted group has not yet been permanently purged.

    ```
    Get-AzureADMSDeletedGroup –Id <objectId>
    ```

## How to restore your deleted Microsoft 365 group using 

Once you have verified that the group is still available to restore, restore the deleted group with one of the following steps. If the group contains documents, SP sites, or other persistent objects, it might take up to 24 hours to fully restore a group and its contents.

1. Run the following cmdlet to restore the group and its contents.
 

   ```
    Restore-AzureADMSDeletedDirectoryObject –Id <objectId>
    ``` 

2. Alternatively, the following cmdlet can be run to permanently remove the deleted group.
    

    ```
    Remove-AzureADMSDeletedDirectoryObject –Id <objectId>
    ```

## How do you know this worked?

To verify that you’ve successfully restored a Microsoft 365 group, run the `Get-AzureADGroup –ObjectId <objectId>` cmdlet to display information about the group. After the restore request is completed:

- The group appears in the Left navigation bar on Exchange
- The plan for the group will appear in Planner
- Any SharePoint sites and all of their contents will be available
- The group can be accessed from any of the Exchange endpoints and other Microsoft365 workloads that support Microsoft 365 groups

## Next steps

These articles provide additional information on Azure Active Directory groups.

* [See existing groups](../fundamentals/active-directory-groups-view-azure-portal.md)
* [Manage settings of a group](../fundamentals/active-directory-groups-settings-azure-portal.md)
* [Manage members of a group](../fundamentals/active-directory-groups-members-azure-portal.md)
* [Manage memberships of a group](../fundamentals/active-directory-groups-membership-azure-portal.md)
* [Manage dynamic rules for users in a group](groups-dynamic-membership.md)
