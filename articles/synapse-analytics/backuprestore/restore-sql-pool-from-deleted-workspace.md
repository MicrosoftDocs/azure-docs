---
title: Restore a dedicated SQL pool from a dropped workspace
description: How-to guide for restoring a dedicated SQL pool from a dropped workspace.
author: realAngryAnalytics
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: sql
ms.date: 03/29/2022
ms.author: realAngryAnalytics
ms.reviewer: wiassaf
---

# Restore a dedicated SQL pool from a deleted workspace

In this article, you learn how to restore a dedicated SQL pool in Azure Synapse Analytics after an accidental drop of a workspace using PowerShell.

> [!NOTE]
> This guidance is for Synapse Workspace dedicated sql pools only. For standalone dedicated sql pool (formerly SQL DW) please follow guidance [Restore sql pool from deleted server](../sql-data-warehouse/sql-data-warehouse-restore-from-deleted-server.md).

## Before you begin

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Restore the SQL pool from the dropped workspace

<ol>
    <li>Open PowerShell</li>
    <li>Connect to your Azure account.</li>
    <li>Set the context to the subscription that contains the workspace that was dropped.</li>
    <li>Specify the approximate datetime the workspace was dropped.</li>
    <li>Construct the resource id for the database you wish to recover from the dropped workspace.</li>
    <li>Restore the database from the dropped workspace</li>
    <li>Verify the status of the recovered database as 'online'.</li>
</ol>


```powershell
$SubscriptionId="<YourSubscriptionId>"
$ResourceGroupName="<YourResourceGroupName>"
$WorkspaceName="<YourWorkspaceNameWithoutURLSuffixSeeNote>"  # Without sql.azuresynapse.net
$DatabaseName="<YourDatabaseName>"
$TargetResourceGroupName="<YourTargetResourceGroupName>" 
$TargetWorkspaceName="<YourtargetServerNameWithoutURLSuffixSeeNote>"  
$TargetDatabaseName="<YourDatabaseName>"

Connect-AzAccount
Set-AzContext -SubscriptionId $SubscriptionId

# Define the approximate point in time the workspace was dropped as DroppedDateTime "yyyy-MM-ddThh:mm:ssZ" (ex. 2022-01-01T16:15:00Z)
$PointInTime=”<DroppedDateTime>” 
$DroppedDateTime = Get-Date -Date $PointInTime 


# construct the resource id of the sql pool you wish to recover. The format required Microsoft.Sql. This includes the approximate date time the server was dropped.
$SourceDatabaseId = "/subscriptions/"+$SubscriptionId+"/resourceGroups/"+$ResourceGroupName+"/providers/Microsoft.Sql/servers/"+$WorkspaceName+"/databases/"+$DatabaseName

# Restore to the target workspace with the source SQL pool.
$RestoredDatabase = Restore-AzSynapseSqlPool -FromDroppedSqlPool -DeletionDate $DroppedDateTime -TargetSqlPoolName $TargetDatabaseName -ResourceGroupName $TargetResourceGroupName -WorkspaceName $TargetWorkspaceName -ResourceId $SourceDatabaseId

# Verify the status of restored database
$RestoredDatabase.status
```

## Troubleshooting
If "An unexpected error occurred while processing the request." message is received, the original database may not have any recovery points available due to the original workspace being short lived. Typically this is when the workspace existed for less than one hour.

## Next Steps
- [Create a restore point](sqlpool-create-restore-point.md)
- [Restore a SQL pool](restore-sql-pool.md)
