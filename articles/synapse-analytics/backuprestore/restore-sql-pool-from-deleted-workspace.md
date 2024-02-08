---
title: Restore a dedicated SQL pool from a dropped workspace
description: How-to guide for restoring a dedicated SQL pool from a dropped workspace.
author: realAngryAnalytics
ms.author: stevehow
ms.reviewer: wiassaf
ms.date: 01/23/2024
ms.service: synapse-analytics
ms.subservice: sql
ms.topic: how-to
---

# Restore a dedicated SQL pool from a deleted workspace

In this article, you learn how to restore a dedicated SQL pool in Azure Synapse Analytics after an accidental drop of a workspace using PowerShell.

> [!NOTE]
> This guidance is for dedicated SQL pools in Azure Synapse workspaces only. For standalone dedicated SQL pools (formerly SQL DW), follow guidance [Restore sql pool from deleted server](../sql-data-warehouse/sql-data-warehouse-restore-from-deleted-server.md).

## Before you begin

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Restore the SQL pool from the dropped workspace

1. Open PowerShell

1. Connect to your Azure account.

1. Set the context to the subscription that contains the workspace that was dropped.

1. Specify the approximate datetime the workspace was dropped.

1. Construct the resource ID for the database you wish to recover from the dropped workspace.

1. Restore the database from the dropped workspace

1. Verify the status of the recovered database as 'online'.
    
    
    ```powershell
    $SubscriptionID="<YourSubscriptionID>"
    $ResourceGroupName="<YourResourceGroupName>"
    $WorkspaceName="<YourWorkspaceNameWithoutURLSuffixSeeNote>"  # Without sql.azuresynapse.net
    $DatabaseName="<YourDatabaseName>"
    $TargetResourceGroupName="<YourTargetResourceGroupName>" 
    $TargetWorkspaceName="<YourtargetServerNameWithoutURLSuffixSeeNote>"  
    $TargetDatabaseName="<YourDatabaseName>"
    
    Connect-AzAccount
    Set-AzContext -SubscriptionID $SubscriptionID
    
    # Define the approximate point in time the workspace was dropped as DroppedDateTime "yyyy-MM-ddThh:mm:ssZ" (ex. 2022-01-01T16:15:00Z)
    $PointInTime="<DroppedDateTime>" 
    $DroppedDateTime = Get-Date -Date $PointInTime 
    
    
    # construct the resource ID of the sql pool you wish to recover. The format required Microsoft.Sql. This includes the approximate date time the server was dropped.
    $SourceDatabaseID = "/subscriptions/"+$SubscriptionID+"/resourceGroups/"+$ResourceGroupName+"/providers/Microsoft.Sql/servers/"+$WorkspaceName+"/databases/"+$DatabaseName
    
    # Restore to the target workspace with the source SQL pool.
    $RestoredDatabase = Restore-AzSynapseSqlPool -FromDroppedSqlPool -DeletionDate $DroppedDateTime -TargetSqlPoolName $TargetDatabaseName -ResourceGroupName $TargetResourceGroupName -WorkspaceName $TargetWorkspaceName -ResourceId $SourceDatabaseID
    
    # Verify the status of restored database
    $RestoredDatabase.status
    ```

## <a id="troubleshooting"></a> Troubleshoot
If "An unexpected error occurred while processing the request." message is received, the original database might not have any recovery points available due to the original workspace being short lived. Typically this is when the workspace existed for less than one hour.

## Related content

- [User-defined restore points](sqlpool-create-restore-point.md)
- [Restore an existing dedicated SQL pool](restore-sql-pool.md)
