---
title: Restore a deleted Office 365 group in Azure AD | Microsoft Docs
description: How to restore a deleted group, view restorable groups, and permamnently delete a group in Azure Active Directory
services: active-directory
documentationcenter: ''
author: eross-msft
manager: mtillman
editor: ''
ms.service: active-directory
ms.workload: identity
ms.component: fundamentals
ms.topic: quickstart
ms.date: 08/28/2017
ms.author: lizross 
ms.reviewer: krbain
ms.custom: it-pro
---

# Restore a deleted Office 365 group in Azure Active Directory

When you delete an Office 365 group in the Azure Active Directory (Azure AD), the deleted group is retained but not visible for 30 days from the deletion date. This behavior is so that the group and its contents can be restored if needed. This functionality is restricted exclusively to Office 365 groups in Azure AD. It is not available for security groups and distribution groups.

> [!NOTE]
> Don't use `Remove-MsolGroup` because it purges the group permanently. Always use `Remove-AzureADMSGroup` to delete an O365 group.

The permissions required to restore a group can be any of the following:

Role | Permissions
--------- | ---------
Company Administrator, Partner Tier2 support, and InTune Service Admins | Can restore any deleted Office 365 group
User Account Administrator and Partner Tier1 support | Can restore any deleted Office 365 group except those assigned to the Company Administrator role
User | Can restore any deleted Office 365 group that they owned


## View the deleted Office 365 groups that are available to restore

The following cmdlets can be used to view the deleted groups to verify that the one or ones you're interested in have not yet been permanently purged. These cmdlets are part of the [Azure AD PowerShell module](https://www.powershellgallery.com/packages/AzureAD/). More information about this module can be found in the [Azure Active Directory PowerShell Version 2](/powershell/azure/install-adv2?view=azureadps-2.0) article.

1.  Run the following cmdlet to display all deleted Office 365 groups in your tenant that are still available to restore.
   
  ```
  Get-AzureADMSDeletedGroup
  ```

2.  Alternately, if you know the objectID of a specific group (and you can get it from the cmdlet in step 1), run the following cmdlet to verify that the specific deleted group has not yet been permanently purged.
  
  ```
  Get-AzureADMSDeletedGroup –Id <objectId>
  ```

## How to restore your deleted Office 365 group
Once you have verified that the group is still available to restore, restore the deleted group with one of the following steps. If the group contains documents, SP sites, or other persistent objects, it might take up to 24 hours to fully restore a group and its contents.

1.	Run the following cmdlet to restore the group and its contents.
 
 ```
 Restore-AzureADMSDeletedDirectoryObject –Id <objectId>
 ``` 

Alternatively, the following cmdlet can be run to permanently remove the deleted group.
 ```
 Remove-AzureADMSDeletedDirectoryObject –Id <objectId>
 ```

## How do you know this worked?

To verify that you’ve successfully restored an Office 365 group, run the `Get-AzureADGroup –ObjectId <objectId>` cmdlet to display information about the group. After the restore request is completed:

- The group appears in the Left navigation bar on Exchange
- The plan for the group will appear in Planner
- Any Sharepoint sites and all of their contents will be available
- The group can be accessed from any of the Exchange endpoints and other Office 365 workloads that support Office 365 groups

## Next steps
These articles provide additional information on Azure Active Directory groups.

* [See existing groups](../fundamentals/active-directory-groups-view-azure-portal.md)
* [Manage settings of a group](../fundamentals/active-directory-groups-settings-azure-portal.md)
* [Manage members of a group](../fundamentals/active-directory-groups-members-azure-portal.md)
* [Manage memberships of a group](../fundamentals/active-directory-groups-membership-azure-portal.md)
* [Manage dynamic rules for users in a group](groups-dynamic-membership.md)
