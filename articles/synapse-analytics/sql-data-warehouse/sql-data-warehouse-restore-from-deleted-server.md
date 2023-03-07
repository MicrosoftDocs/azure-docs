---
title: Restore a dedicated SQL pool (formerly SQL DW) from a deleted server
description: How-to guide for restoring a dedicated SQL pool from a deleted server.
author: realAngryAnalytics
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: sql-dw
ms.date: 08/24/2022
ms.author: stevehow
ms.reviewer: wiassaf
---

# Restore a dedicated SQL pool (formerly SQL DW) from a deleted server

In this article, you learn how to restore a dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics after an accidental drop of a server using PowerShell.

> [!NOTE]
> This guidance is for standalone dedicated SQL pools (formerly SQL DW) only. For dedicated SQL pools in an Azure Synapse Analytics workspace, see [Restore SQL pool from deleted workspace](../backuprestore/restore-sql-pool-from-deleted-workspace.md).

## Before you begin

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Restore the SQL pool from the deleted server

1. Open PowerShell.

2. Connect to your Azure account.

3. Set the context to the subscription that contains the server that was dropped.

4. Specify the approximate datetime the server was dropped.

5. Construct the resource ID for the database you wish to recover from the dropped server.

6. Restore the database from the dropped server

7. Verify the status of the recovered database as 'online'.


```powershell
$SubscriptionID="<YourSubscriptionID>"
$ResourceGroupName="<YourResourceGroupName>"
$ServerName="<YourServerNameWithoutURLSuffixSeeNote>"  # Without database.windows.net
$DatabaseName="<YourDatabaseName>"
$TargetServerName="<YourtargetServerNameWithoutURLSuffixSeeNote>"  
$TargetDatabaseName="<YourDatabaseName>"

Connect-AzAccount
Set-AzContext -SubscriptionId $SubscriptionID

# Define the approximate point in time the server was dropped as DroppedDateTime "yyyy-MM-ddThh:mm:ssZ" (ex. 2022-01-01T16:15:00Z)
$PointInTime="<DroppedDateTime>" 
$DroppedDateTime = Get-Date -Date $PointInTime 

# construct the resource ID of the database you wish to recover. The format required Microsoft.Sql. This includes the approximate date time the server was dropped.
$SourceDatabaseID = "/subscriptions/"+$SubscriptionID+"/resourceGroups/"+$ResourceGroupName+"/providers/Microsoft.Sql/servers/"+$ServerName+"/restorableDroppedDatabases/"+$DatabaseName+","+$DroppedDateTime.ToUniversalTime().ToFileTimeUtc().ToString()

# Restore to target workspace with the source database.
$RestoredDatabase = Restore-AzSqlDatabase -FromDeletedDatabaseBackup -DeletionDate $DroppedDateTime -ResourceGroupName $ResourceGroupName -ServerName $TargetServerName -TargetDatabaseName $TargetDatabaseName -ResourceId $SourceDatabaseID 

# Verify the status of restored database
$RestoredDatabase.status
```

## Troubleshooting
If "An unexpected error occurred while processing the request." message is received, the original database may not have any recovery points available due to the original server being short lived. Typically this is when the server existed for less than one hour.