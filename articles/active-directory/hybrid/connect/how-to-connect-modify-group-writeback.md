---
title: 'Modify group writeback in Microsoft Entra Connect'
description: This article describes how to modify the default behavior for group writeback in Microsoft Entra Connect. 
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---

# Modify Microsoft Entra Connect group writeback default behavior 

Group writeback is a feature that allows you to write cloud groups back to your on-premises Active Directory instance by using Microsoft Entra Connect Sync. You can change the default behavior in the following ways: 

- Only groups that are configured for writeback will be written back, including newly created Microsoft 365 groups. 
- Groups that are written back will be deleted in Active Directory when they're disabled for group writeback, soft deleted, or hard deleted in Microsoft Entra ID. 
- Microsoft 365 groups with up to 250,000 members can be written back to on-premises. 

This article walks you through the options for modifying the default behaviors of Microsoft Entra Connect group writeback. 

## Considerations for existing deployments 

If the original version of group writeback is already enabled and in use in your environment, all your Microsoft 365 groups have already been written back to Active Directory. Instead of disabling all Microsoft 365 groups, review any use of the previously written-back groups. Disable only those that are no longer needed in on-premises Active Directory. 

### Disable automatic writeback of new Microsoft 365 groups 

To configure directory settings to disable automatic writeback of newly created Microsoft 365 groups, use one of these methods:

- PowerShell: Use the [Microsoft Graph Beta PowerShell SDK](/powershell/microsoftgraph/installation?view=graph-powershell-1.0&preserve-view=true). For example: 
    
  ```PowerShell 
    # Import Module
    Import-Module Microsoft.Graph.Beta.Identity.DirectoryManagement
    
    #Connect to MgGraph with necessary scope
    Connect-MgGraph -Scopes Directory.ReadWrite.All
    
    
    # Verify if "Group.Unified" directory settings exist
    $DirectorySetting = Get-MgBetaDirectorySetting| Where-Object {$_.DisplayName -eq "Group.Unified"}
    
    # If "Group.Unified" directory settings exist, update the value for new unified group writeback default
    if ($DirectorySetting) 
    {
      $params = @{
        Values = @(
          @{
            Name = "NewUnifiedGroupWritebackDefault"
            Value = $false
          }
        )
      }
      Update-MgBetaDirectorySetting -DirectorySettingId $DirectorySetting.Id -BodyParameter $params
    }
    else
    {
      # In case the directory setting doesn't exist, create a new "Group.Unified" directory setting
      # Import "Group.Unified" template values to a hashtable
      $Template = Get-MgBetaDirectorySettingTemplate | Where-Object {$_.DisplayName -eq "Group.Unified"}
      $TemplateValues = @{}
      $Template.Values | ForEach-Object {
          $TemplateValues.Add($_.Name, $_.DefaultValue)
      }
    
      # Update the value for new unified group writeback default
      $TemplateValues["NewUnifiedGroupWritebackDefault"] = $false
    
      # Create a directory setting using the Template values hashtable including the updated value
      $params = @{}
      $params.Add("TemplateId", $Template.Id)
      $params.Add("Values", @())
      $TemplateValues.Keys | ForEach-Object {
          $params.Values += @(@{Name = $_; Value = $TemplateValues[$_]})
      }
      New-MgBetaDirectorySetting -BodyParameter $params
    }
  ``` 

> [!NOTE]     
> We recommend using Microsoft Graph PowerShell SDK with [PowerShell 7](/powershell/scripting/whats-new/migrating-from-windows-powershell-51-to-powershell-7?view=powershell-7.3&preserve-view=true).

- Microsoft Graph: Use the [directorySetting](/graph/api/resources/directorysetting?view=graph-rest-beta&preserve-view=true) resource type. 

### Disable writeback for all existing Microsoft 365 group 

To disable writeback of all Microsoft 365 groups that were created before these modifications, use one of the following methods:

- Portal: Use the [Microsoft Entra admin center](../../enterprise-users/groups-write-back-portal.md).
- PowerShell: Use the [Microsoft Graph Beta PowerShell SDK](/powershell/microsoftgraph/installation?view=graph-powershell-1.0&preserve-view=true). For example: 
  
  ```PowerShell
    #Import-module
    Import-Module Microsoft.Graph.Beta
    
    #Connect to MgGraph with necessary scope
    Connect-MgGraph -Scopes Group.ReadWrite.All
    
    #List all Microsoft 365 Groups
    $Groups = Get-MgBetaGroup -All | Where-Object {$_.GroupTypes -like "*unified*"}
    
    #Disable Microsoft 365 Groups
    Foreach ($group in $Groups) 
    {
      Update-MgBetaGroup -GroupId $group.id -WritebackConfiguration @{isEnabled=$false}
    }
  ```
      
- Microsoft Graph Explorer: Use a [group object](/graph/api/group-update?tabs=http&view=graph-rest-beta&preserve-view=true). 

## Delete groups when they're disabled for writeback or soft deleted 

> [!NOTE]  
> After you delete written-back groups in Active Directory, they're not automatically restored from the Active Directory Recycle Bin feature if they're re-enabled for writeback or restored from a soft-delete state. New groups will be created. Deleted groups that are restored from Active Directory Recycle Bin before they're re-enabled for writeback, or that are restored from a soft-delete state in Microsoft Entra ID, will be joined to their respective Microsoft Entra groups. 

1. On your Microsoft Entra Connect server, open a PowerShell prompt as an administrator. 
2. Disable the [Microsoft Entra Connect Sync scheduler](./how-to-connect-sync-feature-scheduler.md):
 
   ``` PowerShell 
   Set-ADSyncScheduler -SyncCycleEnabled $false  
   ``` 
3. Create a custom synchronization rule in Microsoft Entra Connect to delete written-back groups when they're disabled for writeback or soft deleted:  
 
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
5. Enable the Microsoft Entra Connect Sync scheduler: 
 
   ``` PowerShell 
   Set-ADSyncScheduler -SyncCycleEnabled $true  
   ``` 

> [!NOTE] 
> Creating the synchronization rule will set the flag for full synchronization to `true` on the Microsoft Entra connector. This change will cause the rule changes to propagate through on the next synchronization cycle. 

## Write back Microsoft 365 groups with up to 250,000 members 

Because the default sync rule that limits the group size is created when group writeback is enabled, you must complete the following steps after you enable group writeback: 

1. On your Microsoft Entra Connect server, open a PowerShell prompt as an administrator. 
2. Disable the [Microsoft Entra Connect Sync scheduler](./how-to-connect-sync-feature-scheduler.md): 
 
   ``` PowerShell 
   Set-ADSyncScheduler -SyncCycleEnabled $false  
   ``` 
3. Open the [synchronization rule editor](./how-to-connect-create-custom-sync-rule.md). 
4. Set the direction to **Outbound**. 
5. Locate and disable the **Out to AD – Group Writeback Member Limit** synchronization rule. 
6. Enable the Microsoft Entra Connect Sync scheduler: 

   ``` PowerShell 
   Set-ADSyncScheduler -SyncCycleEnabled $true  
   ``` 

> [!NOTE] 
> Disabling the synchronization rule will set the flag for full synchronization to `true` on the Microsoft Entra connector. This change will cause the rule changes to propagate through on the next synchronization cycle.  

## Restore from Active Directory Recycle Bin 

If you're updating the default behavior to delete groups when they're disabled for writeback or soft deleted, we recommend that you enable the [Active Directory Recycle Bin](./how-to-connect-sync-recycle-bin.md) feature for your on-premises instances of Active Directory. You can use this feature to manually restore previously deleted Active Directory groups so that they can be rejoined to their respective Microsoft Entra groups, if they were accidentally disabled for writeback or soft deleted. 

Before you re-enable for writeback or restore from soft delete in Microsoft Entra ID, you first need to restore the group in Active Directory.  

## Next steps 

- [Microsoft Entra Connect group writeback](how-to-connect-group-writeback-v2.md) 
- [Enable Microsoft Entra Connect group writeback](how-to-connect-group-writeback-enable.md) 
- [Disable Microsoft Entra Connect group writeback](how-to-connect-group-writeback-disable.md)
