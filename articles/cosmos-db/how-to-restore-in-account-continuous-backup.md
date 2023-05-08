---
title: Restore a container or database into existing account
titleSuffix: Azure Cosmos DB
description: Restore a deleted container or database to an existing Azure Cosmos DB account using Azure portal, PowerShell, or CLI when using continuous backup mode.
author: kanshiG
ms.author: govindk
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.topic: how-to
ms.date: 05/08/2023
zone_pivot_groups: azure-cosmos-db-apis-nosql-mongodb-gremlin-table
---

# Restore a container or database into an existing Azure Cosmos DB account with continuous backup

[!INCLUDE[NoSQL, MongoDB, Gremlin, Table](includes/appliesto-nosql-mongodb-gremlin-table.md)]

Azure Cosmos DB's point-in-time in-account restore feature helps you to recover from an accidental deletion of a container or database. Theis feature restores the deleted  database or container to an existing account in any region where backups exist. The continuous backup mode allows you to restore to any point of time within the last 30 days.

## Prerequisites

TODO

## Restore a deleted container or database

Use the Azure portal, Azure CLI, Azure PowerShell, or an Azure Resource Manager template to restore a deleted container or database into an existing account.

### [Azure portal](#tab/azure-portal)

Use the Azure portal to restore a deleted container or database (including child containers).

1. Navigate to the [Azure portal](https://portal.azure.com/).

1. Navigate to your Azure Cosmos DB account and open the **Point In Time Restore** page.

    > [!NOTE]
    > The restore page in Azure portal is only populated if you have the `Microsoft.DocumentDB/locations/restorableDatabaseAccounts/*/read` permission. To learn more about this permission, see [backup and restore permissions](continuous-backup-restore-permissions.md).

1. Switch to the **Restore to same account** tab.

    :::image type="content" source="media/how-to-restore-in-account-continuous-backup.md\in-account-switch.png" lightbox="media/how-to-restore-in-account-continuous-backup.md\in-account-switch.png" alt-text="Screenshot of the options to restore a database or container to the same account.":::

1. In the **Database** field, enter a search query to filter the event feed to relevant deletion events for either a container or database.

    :::image type="content" source="media/how-to-restore-in-account-continuous-backup.md/event-filter.png" lightbox="media/how-to-restore-in-account-continuous-backup.md/event-filter.png" alt-text="Screenshot of the event filter showing deletion events for containers and databases.":::

1. Next, specify **Start** and **End** values to create a time window to use to filter deletion events.

    :::image type="content" source="media/how-to-restore-in-account-continuous-backup.md/date-filter.png" lightbox="media/how-to-restore-in-account-continuous-backup.md/date-filter.png" alt-text="Screenshot of the start and end date filters further filtering down deletion events.":::

    > [!NOTE]
    > The **Start** filter is limited to at most 30 days before the present date.

1. Select **Refresh** to update the list of events on different resource types with your filters applied.

1. Verify the time and select **Restore** to start restoration of the selected resource that was previously deleted.

    :::image type="content" source="media/how-to-restore-in-account-continuous-backup.md/restore-confirmation.png" lightbox="media/how-to-restore-in-account-continuous-backup.md/restore-confirmation.png" alt-text="Screenshot of the confirmation dialog prior to a restore operation.":::

    > [!IMPORTANT]
    > No more than three restore operations can be active at any given time on the same account. Deleting the source account while a restore operation is in-progress could result in the failure of the restore operation.

    > [!NOTE]
    > The event feed will display certain resources as **"Not restorable"**. The feel will provide more information why the resource cannot be restored.In most cases, you will be required to restore the parent database before you can restore any of its child containers.

1. After initiating a restore operation, track the operation using the notifications area of the Azure portal. The notification provides the status of the resource being restored. While restore is in progress, the status of the container will be **Creating**. After the restore operation completes, the status will change to **Online**.

### [Azure CLI](#tab/azure-cli)

Use Azure CLI to restore a deleted container or database (including child containers).

### [Azure PowerShell](#tab/azure-powershell)

Use Azure PowerShell to restore a deleted container or database (including child containers).

> [!IMPORTANT]
> Azure PowerShell version **2.0.5-preview** or later is required to access the in-account restore cmdlets. If you do not have the preview version installed, run `Install-Module -Name Az.CosmosDB -RequiredVersion 2.0.5-preview -AllowPrerelease`.

1. Retrieve a list of all live and deleted restorable database accounts using [`Get-AzCosmosDBRestorableDatabaseAccount`](/powershell/module/az.cosmosdb/get-azcosmosdbrestorabledatabaseaccount).

    ```azurepowershell
    Get-AzCosmosDBRestorableDatabaseAccount
    ```

    ```output
    Id                        : /subscriptions/{subscriptionId}/providers/Microsoft.DocumentDB/locations/westus/restorableDatabaseAccounts/fb8f230e-bab0-452b-81cf-e32643ccc898
    DatabaseAccountInstanceId : fb8f230e-bab0-452b-81cf-e32643ccc898
    Location                  : West US
    DatabaseAccountName       : deleted-account-1
    CreationTime              : 8/2/2020 10:23:00 PM
    DeletionTime              : 8/2/2020 10:26:13 PM
    ApiType                   : Sql
    RestorableLocations       : {West US, East US}
    ```

    > [!NOTE]
    > There are `CreationTime` or `DeletionTime` fields for the account. These same fields exist for regions too. These times allow you to choose the right region and a valid time range to use when restoring a resource.

:::zone target="api-nosql" pivot="azure-cosmos-db-apis-nosql-mongodb-gremlin-table"

1. Use [`Get-AzCosmosDBSqlRestorableDatabase`](/powershell/module/az.cosmosdb/get-azcosmosdbsqlrestorabledatabase) to list all restorable versions of databases for live accounts.

    ```azurepowershell
    $parameters = @{
        DatabaseAccountInstanceId = "<instance-id-of-account>"
        Location = "<location>"
    }
    Get-AzCosmosDBSqlRestorableDatabase @parameters
    ```

    > [!NOTE]
    > Listing all the restorable database deletion events allows you to choose the right database in a scenario where the actual time of existence is unknown. If the event feed contains the **Delete** operation type in its response, then it’s a deleted database and it can be restored within the same account. The restore timestamp can be set to any timestamp before the deletion timestamp and within the retention window.

1. Use [`Get-AzCosmosDBSqlRestorableContainer`](/powershell/module/az.cosmosdb/get-azcosmosdbsqlrestorablecontainer) list all the versions of restorable containers within a specific database.

    ```azurepowershell
    $parameters = @{
        DatabaseAccountInstanceId = "<instance-id-of-account>"
        DatabaseRId = "<resource-id-of-database>"
        Location = "<location>"
    }
    Get-AzCosmosDBSqlRestorableContainer @parameters    
    ```

    > [!NOTE]
    > Listing all the restorable database deletion events allows you allows you to choose the right container in a scenario where the actual time of existence is unknown. If the event feed contains the **Delete** operation type in its response, then it’s a deleted container and it can be restored within the same account. The restore timestamp can be set to any timestamp before the deletion timestamp and within the retention window.

1. Trigger a restore operaton for a deleted database.

    ```azurepowershell
    Restore-AzCosmosDBSqlDatabase  `
    -AccountName "my-pitr-sql-account" `
    -ResourceGroupName "my-rg" `
    -Name "my-database"  `
    -RestoreTimestampInUtc "2022-08-25T07:16:20Z"  
    ```

1. Trigger a restore operaton for a deleted container.

    ```azurepowershell
    Restore-AzCosmosDBSqlContainer ` 
    -AccountName "my-pitr-sql-account" `
    -ResourceGroupName "my-rg"  `
    -DatabaseName "my-database" `
    -Name "my-container"  `
    -RestoreTimestampInUtc "2022-08-25T07:16:20Z"  
    ```

:::zone-end

:::zone target="api-mongodb" pivot="azure-cosmos-db-apis-nosql-mongodb-gremlin-table"

1. Use [`Get-AzCosmosdbMongoDBRestorableDatabase`](/powershell/module/az.cosmosdb/get-azcosmosdbmongodbrestorabledatabase) to list all restorable versions of databases for live accounts.

    ```azurepowershell
    $parameters = @{
        DatabaseAccountInstanceId = "<instance-id-of-account>"
        Location = "<location>"
    }
    Get-AzCosmosdbMongoDBRestorableDatabase @parameters
    ```

1. Use [`Get-AzCosmosDBMongoDBRestorableCollection`](/powershell/module/az.cosmosdb/get-azcosmosdbmongodbrestorablecollection) to list all the versions of restorable collections within a specific database.

    ```azurepowershell
    $parameters = @{
        DatabaseAccountInstanceId = "<instance-id-of-account>"
        DatabaseRId = "<resource-id-of-database>"
        Location = "<location>"
    }
    Get-AzCosmosDBMongoDBRestorableCollection @parameters      
    ```

1. Trigger a restore operaton for a deleted database.

    ```azurepowershell
    Restore-AzCosmosDBMongoDBDatabase  `
    -AccountName "my-pitr-mongodb-account" `
    -ResourceGroupName "my-rg"  `
    -Name "my-database"  `
    -RestoreTimestampInUtc "2022-08-25T07:16:20Z"  
    ```

1. Trigger a restore operaton for a deleted collection.

    ```azurepowershell
    Restore-AzCosmosDBMongoDBContainer   `
    -AccountName "my-pitr-mongodb-account" `
    -ResourceGroupName "my-rg"  `
    -DatabaseName "my-database" `
    -Name "my-collection"  `
    -RestoreTimestampInUtc "2022-08-25T07:16:20Z"   
    ```

:::zone-end

:::zone target="api-mongodb" pivot="azure-cosmos-db-apis-nosql-mongodb-gremlin-table"

1. Use [`Get-AzCosmosdbGremlinRestorableDatabase`](/powershell/module/az.cosmosdb/get-azcosmosdbgremlinrestorabledatabase) to list all restorable versions of databases for live accounts.

    ```azurepowershell
    $parameters = @{
        DatabaseAccountInstanceId = "<instance-id-of-account>"
        Location = "<location>"
    }
    Get-AzCosmosdbGremlinRestorableDatabase @parameters
    ```

1. Use [`Get-AzCosmosdbGremlinRestorableGraph`](/powershell/module/az.cosmosdb/get-azcosmosdbgremlinrestorablegraph) to list all the versions of restorable graphs within a specific database.

    ```azurepowershell
    $parameters = @{
        DatabaseAccountInstanceId = "<instance-id-of-account>"
        DatabaseRId = "<owner-resource-id-of-database>"
        Location = "<location>"
    }
    Get-AzCosmosdbGremlinRestorableGraph @parameters      
    ```

1. Trigger a restore operaton for a deleted database.

    ```azurepowershell
    Restore-AzCosmosDBGremlinDatabase    `
    -AccountName "my-pitr-gremlin-account" `
    -ResourceGroupName "my-rg"  `
    -Name "my-database"  `
    -RestoreTimestampInUtc "2023-08-25T07:16:20Z"  
    ```

1. Trigger a restore operaton for a deleted graph.

    ```azurepowershell
    Restore-AzCosmosDBGremlinGraph    `
    -AccountName "my-pitr-gremlin-account" `
    -ResourceGroupName "my-rg"  `
    -DatabaseName "my-database" `
    -Name "my-graph"  `
    -RestoreTimestampInUtc "2022-08-25T07:16:20Z"   
    ```

:::zone-end

:::zone target="api-table" pivot="azure-cosmos-db-apis-nosql-mongodb-gremlin-table"

1. Use [`Get-AzCosmosdbTableRestorableTable`](/powershell/module/az.cosmosdb/get-azcosmosdbtablerestorabletable) to list all restorable versions of tables for live accounts.

    ```azurepowershell
    $parameters = @{
        DatabaseAccountInstanceId = "<instance-id-of-account>"
        Location = "<location>"
    }
    Get-AzCosmosdbTableRestorableTable @parameters
    ```

1. Trigger a restore operaton for a deleted table.

    ```azurepowershell
    Restore-AzCosmosDBTable    `
    -AccountName "my-pitr-Table-account" `
    -ResourceGroupName "my-rg"  `
    -Name "my-table"  `
    -RestoreTimestampInUtc "2023-08-25T07:16:20Z"  
    ```

:::zone-end

### [Azure Resource Manager template](#tab/azure-resource-manager)

TODO

---

## Track the status of a restore operation

When a point-in-time restore is triggered for a deleted container or database, the operation will be identified as an **InAccount** restore operation on the resource. To get a list of restore operations for a specific resource, filter the Activity Log of the account using the search filter `InAccount Restore Deleted` and a time filter. The resulting list includes the `UserPrincipalName` field that identifies the user that triggered the restore operation. For more information on how to access activity logs, see [Auditing point-in-time restore actions](audit-restore-continuous.md#audit-the-restores-that-were-triggered-on-a-live-database-account).
