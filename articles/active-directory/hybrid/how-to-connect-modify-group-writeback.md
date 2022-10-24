---
title: 'Modify group writeback in Azure AD Connect'
description: This article describes how to modify the default behavior for group writeback in Azure AD Connect. 
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.date: 06/15/2022
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---

# Modify Azure AD Connect group writeback default behavior 

Group writeback is a feature that allows you to write cloud groups back to your on-premises Active Directory instance by using Azure Active Directory (Azure AD) Connect sync. You can change the default behavior in the following ways: 

- Only groups that are configured for writeback will be written back, including newly created Microsoft 365 groups. 
- Groups that are written back will be deleted in Active Directory when they're disabled for group writeback, soft deleted, or hard deleted in Azure AD. 
- Microsoft 365 groups with up to 250,000 members can be written back to on-premises. 

This article walks you through the options for modifying the default behaviors of Azure AD Connect group writeback. 

## Considerations for existing deployments 

If the original version of group writeback is already enabled and in use in your environment, all your Microsoft 365 groups have already been written back to Active Directory. Instead of disabling all Microsoft 365 groups, review any use of the previously written-back groups. Disable only those that are no longer needed in on-premises Active Directory. 

### Disable automatic writeback of all Microsoft 365 groups 

To configure directory settings to disable automatic writeback of newly created Microsoft 365 groups, use one of these methods:

- Azure portal: Update the `NewUnifiedGroupWritebackDefault` setting to `false`. 
- PowerShell: Use the [New-AzureADDirectorySetting](../enterprise-users/groups-settings-cmdlets.md) cmdlet. For example:
    
  ```PowerShell 
  $TemplateId = (Get-AzureADDirectorySettingTemplate | where {$_.DisplayName -eq "Group.Unified" }).Id 
  $Template = Get-AzureADDirectorySettingTemplate | where -Property Id -Value $TemplateId -EQ 
  $Setting = $Template.CreateDirectorySetting() 
  $Setting["NewUnifiedGroupWritebackDefault"] = "False" 
  New-AzureADDirectorySetting -DirectorySetting $Setting 
  ``` 

- Microsoft Graph: Use the [directorySetting](/graph/api/resources/directorysetting?view=graph-rest-beta) resource type. 

### Disable writeback for each existing Microsoft 365 group 

- Portal: Use the [Microsoft Entra admin portal](../enterprise-users/groups-write-back-portal.md).
- PowerShell: Use the [Microsoft Identity Tools PowerShell module](https://www.powershellgallery.com/packages/MSIdentityTools/2.0.16). For example: 
  
  `Get-mggroup -filter "groupTypes/any(c:c eq 'Unified')" | Update-MsIdGroupWritebackConfiguration -WriteBackEnabled $false` 
- Microsoft Graph: Use a [group object](/graph/api/group-update?tabs=http&view=graph-rest-beta). 

## Delete groups when they're disabled for writeback or soft deleted 

> [!NOTE]  
> After you delete written-back groups in Active Directory, they're not automatically restored from the Active Directory Recycle Bin feature if they're re-enabled for writeback or restored from a soft-delete state. New groups will be created. Deleted groups that are restored from Active Directory Recycle Bin before they're re-enabled for writeback, or that are restored from a soft-delete state in Azure AD, will be joined to their respective Azure AD groups. 

1. On your Azure AD Connect server, open a PowerShell prompt as an administrator. 
2. Disable the [Azure AD Connect sync scheduler](./how-to-connect-sync-feature-scheduler.md):
 
   ``` PowerShell 
   Set-ADSyncScheduler -SyncCycleEnabled $false  
   ``` 
3. Create a custom synchronization rule in Azure AD Connect to delete written-back groups when they're disabled for writeback or soft deleted:  
 
   ```PowerShell 
   import-module ADSync 
   $precedenceValue = Read-Host -Prompt "Enter a unique sync rule precedence value [0-99]" 

   New-ADSyncRule  `
   -Name 'In from AAD - Group SOAinAAD Delete WriteBackOutOfScope and SoftDelete' `
   -Identifier 'cb871f2d-0f01-4c32-a333-ff809145b947' `
   -Description 'Delete AD groups that fall out of scope of Group Writeback or get Soft Deleted in Azure AD' `
   -Direction 'Inbound' `
   -Precedence $precedenceValue `
   -PrecedenceAfter '00000000-0000-0000-0000-000000000000' `
   -PrecedenceBefore '00000000-0000-0000-0000-000000000000' `
   -SourceObjectType 'group' `
   -TargetObjectType 'group' `
   -Connector 'b891884f-051e-4a83-95af-2544101c9083' `
   -LinkType 'Join' `
   -SoftDeleteExpiryInterval 0 `
   -ImmutableTag '' `
   -OutVariable syncRule

   Add-ADSyncAttributeFlowMapping  `
   -SynchronizationRule $syncRule[0] `
   -Destination 'reasonFiltered' `
   -FlowType 'Expression' `
   -ValueMergeType 'Update' `
   -Expression 'IIF((IsPresent([reasonFiltered]) = True) && (InStr([reasonFiltered], "WriteBackOutOfScope") > 0 || InStr([reasonFiltered], "SoftDelete") > 0), "DeleteThisGroupInAD", [reasonFiltered])' `
    -OutVariable syncRule

   New-Object  `
   -TypeName 'Microsoft.IdentityManagement.PowerShell.ObjectModel.ScopeCondition' `
   -ArgumentList 'cloudMastered','true','EQUAL' `
   -OutVariable condition0

   Add-ADSyncScopeConditionGroup  `
   -SynchronizationRule $syncRule[0] `
   -ScopeConditions @($condition0[0]) `
   -OutVariable syncRule
 
   New-Object  `
   -TypeName 'Microsoft.IdentityManagement.PowerShell.ObjectModel.JoinCondition' `
   -ArgumentList 'cloudAnchor','cloudAnchor',$false `
   -OutVariable condition0

   Add-ADSyncJoinConditionGroup  `
   -SynchronizationRule $syncRule[0] `
   -JoinConditions @($condition0[0]) `
   -OutVariable syncRule

   Add-ADSyncRule  `
   -SynchronizationRule $syncRule[0]

   Get-ADSyncRule  `
   -Identifier 'cb871f2d-0f01-4c32-a333-ff809145b947'
   ```

4. [Enable group writeback](how-to-connect-group-writeback-enable.md). 
5. Enable the Azure AD Connect sync scheduler: 
 
   ``` PowerShell 
   Set-ADSyncScheduler -SyncCycleEnabled $true  
   ``` 

> [!NOTE] 
> Creating the synchronization rule will set the flag for full synchronization to `true` on the Azure AD connector. This change will cause the rule changes to propagate through on the next synchronization cycle. 

## Write back Microsoft 365 groups with up to 250,000 members 

Because the default sync rule that limits the group size is created when group writeback is enabled, you must complete the following steps after you enable group writeback: 

1. On your Azure AD Connect server, open a PowerShell prompt as an administrator. 
2. Disable the [Azure AD Connect sync scheduler](./how-to-connect-sync-feature-scheduler.md): 
 
   ``` PowerShell 
   Set-ADSyncScheduler -SyncCycleEnabled $false  
   ``` 
3. Open the [synchronization rule editor](./how-to-connect-create-custom-sync-rule.md). 
4. Set the direction to **Outbound**. 
5. Locate and disable the **Out to AD – Group Writeback Member Limit** synchronization rule. 
6. Enable the Azure AD Connect sync scheduler: 

   ``` PowerShell 
   Set-ADSyncScheduler -SyncCycleEnabled $true  
   ``` 

> [!NOTE] 
> Disabling the synchronization rule will set the flag for full synchronization to `true` on the Azure AD connector. This change will cause the rule changes to propagate through on the next synchronization cycle.  

## Restore from Active Directory Recycle Bin 

If you're updating the default behavior to delete groups when they're disabled for writeback or soft deleted, we recommend that you enable the [Active Directory Recycle Bin](./how-to-connect-sync-recycle-bin.md) feature for your on-premises instances of Active Directory. You can use this feature to manually restore previously deleted Active Directory groups so that they can be rejoined to their respective Azure AD groups, if they were accidentally disabled for writeback or soft deleted. 

Before you re-enable for writeback or restore from soft delete in Azure AD, you first need to restore the group in Active Directory.  

## Next steps 

- [Azure AD Connect group writeback](how-to-connect-group-writeback-v2.md) 
- [Enable Azure AD Connect group writeback](how-to-connect-group-writeback-enable.md) 
- [Disable Azure AD Connect group writeback](how-to-connect-group-writeback-disable.md)
