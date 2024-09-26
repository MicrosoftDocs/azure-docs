---
title: Restore a dedicated SQL pool from a dropped workspace
description: How-to guide for restoring a dedicated SQL pool from a dropped workspace.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: stevehow, ajagadish
ms.date: 07/29/2024
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: how-to
---
# Restore a dedicated SQL pool from a deleted workspace

In this article, you learn how to restore a dedicated SQL pool in Azure Synapse Analytics after an accidental drop of a workspace using PowerShell.

> [!NOTE]
> This guidance is for dedicated SQL pools in Azure Synapse workspaces only. For standalone dedicated SQL pools (formerly SQL DW), follow guidance [Restore sql pool from deleted server](../sql-data-warehouse/sql-data-warehouse-restore-from-deleted-server.md).

## Before you begin

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

## Restore the SQL pool from the dropped workspace

The following sample script accomplishes these steps:

1. Open PowerShell

1. Connect to your Azure account.

1. Set the context to the subscription that contains the workspace that was dropped.

1. Determine the datetime the workspace was dropped. This step retrieves the exact date and time the workspace SQL pool was dropped. 
    - This step assumes that the workspace with the same name resource group and same values is still available. 
    - If not, recreate the dropped workspace with the same workspace name, resource group name, region, and all the same values from prior dropped workspace. 
    
1. Construct a string the resource ID of the sql pool you wish to recover. The format requires `Microsoft.Sql`. This includes the date and time when the server was dropped.

1. Restore the database from the dropped workspace. Restore to the target workspace with the source SQL pool.

1. Verify the status of the recovered database as 'online'.
    
    ```powershell
    $SubscriptionID = "<YourSubscriptionID>"
    $ResourceGroupName = "<YourResourceGroupName>"
    $WorkspaceName = "<YourWorkspaceNameWithoutURLSuffixSeeNote>"  # Without sql.azuresynapse.net
    $DatabaseName = "<YourDatabaseName>"
    $TargetResourceGroupName = "<YourTargetResourceGroupName>"
    $TargetWorkspaceName = "<YourtargetServerNameWithoutURLSuffixSeeNote>"
    $TargetDatabaseName = "<YourDatabaseName>"
    
    Connect-AzAccount
    Set-AzContext -SubscriptionID $SubscriptionID
    
    # Get the exact date and time the workspace SQL pool was dropped.
    # This assumes that the workspace with the same name resource group and same values is still available.
    # If not, recreate the dropped workspace with the same workspace name, resource group name, region, 
    # and all the same values from prior dropped workspace.
    # There should only be one selection to select from.
    $paramsGetDroppedSqlPool = @{
        ResourceGroupName = $ResourceGroupName
        WorkspaceName     = $WorkspaceName
        Name              = $DatabaseName
    }
    $DroppedDateTime = Get-AzSynapseDroppedSqlPool @paramsGetDroppedSqlPool `
        | Select-Object -ExpandProperty DeletionDate
    
    # Construct a string of the resource ID of the sql pool you wish to recover.
    # The format requires Microsoft.Sql. This includes the approximate date time the server was dropped.
    $SourceDatabaseID = "/subscriptions/$SubscriptionID/resourceGroups/$ResourceGroupName/providers/" `
                    + "Microsoft.Sql/servers/$WorkspaceName/databases/$DatabaseName"    

    # Restore to the target workspace with the source SQL pool.
    $paramsRestoreSqlPool = @{
        FromDroppedSqlPool  = $true
        DeletionDate        = $DroppedDateTime
        TargetSqlPoolName   = $TargetDatabaseName
        ResourceGroupName   = $TargetResourceGroupName
        WorkspaceName       = $TargetWorkspaceName
        ResourceId          = $SourceDatabaseID
    }
    $RestoredDatabase = Restore-AzSynapseSqlPool @paramsRestoreSqlPool
    
    # Verify the status of restored database
    $RestoredDatabase.status
    ```

## <a id="troubleshooting"></a> Troubleshoot

If "An unexpected error occurred while processing the request." message is received, the original database might not have any recovery points available due to the original workspace being short lived. Typically this is when the workspace existed for less than one hour.

## Related content

- [User-defined restore points](sqlpool-create-restore-point.md)
- [Restore an existing dedicated SQL pool](restore-sql-pool.md)
