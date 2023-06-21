---
title: Restore a container or database into existing same account (preview)
titleSuffix: Azure Cosmos DB
description: Restore a deleted container or database to an existing same Azure Cosmos DB account using Azure portal, PowerShell, or CLI when using continuous backup mode.
author: kanshiG
ms.author: govindk
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.custom: build-2023
ms.topic: how-to
ms.date: 05/08/2023
zone_pivot_groups: azure-cosmos-db-apis-nosql-mongodb-gremlin-table
---

# Restore a deleted container or database into same Azure Cosmos DB account (preview)

[!INCLUDE[NoSQL, MongoDB, Gremlin, Table](includes/appliesto-nosql-mongodb-gremlin-table.md)]

Azure Cosmos DB's point-in-time same account restore feature helps you to recover from an accidental deletion of a container or database. Theis feature restores the deleted  database or container to an existing same account in any region where backups exist. The continuous backup mode allows you to restore to any point of time within the last 30 days.

## Prerequisites

- An existing Azure Cosmos DB account.
  - If you have an Azure subscription, [create a new account](nosql/how-to-create-account.md?tabs=azure-portal).
  - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  - Alternatively, you can [try Azure Cosmos DB free](try-free.md) before you commit.

## Restore a deleted container or database

Use the Azure portal, Azure CLI, Azure PowerShell, or an Azure Resource Manager template to restore a deleted container or database into an same account.

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

1. After initiating a restore operation, track the operation using the notifications area of the Azure portal. The notification provides the status of the resource being restored. While restore is in progress, the status of the container is **Creating**. After the restore operation completes, the status will change to **Online**.

### [Azure CLI](#tab/azure-cli)

Use Azure CLI to restore a deleted container or database (including child containers).

> [!IMPORTANT]
> The `cosmosdb-preview` extension for Azure CLI version **0.24.0** or later is required to access the in-account restore command. If you do not have the preview version installed, run `az extension add --name cosmosdb-preview --version 0.24.0`.

:::zone pivot="api-nosql"

1. Retrieve a list of all live and deleted restorable database accounts using [`az cosmosdb restorable-database-account list`](/cli/azure/cosmosdb/restorable-database-account#az-cosmosdb-restorable-database-account-list).

    ```azurecli
    az cosmosdb restorable-database-account list \
        --account-name <name-of-account>
    ```

    ```output
    [
      {
        "accountName": "deleted-account-1",
        "apiType": "Sql",
        "creationTime": "2020-08-02T22:23:00.095870+00:00",
        "deletionTime": "2020-08-02T22:26:13.483175+00:00",
        "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/westus/restorableDatabaseAccounts/abcd1234-d1c0-4645-a699-abcd1234",
        "location": "West US",
        "name": "abcd1234-d1c0-4645-a699-abcd1234",
        "restorableLocations": [
          {
            "locationName": "West US"
          },
          {
            "locationName": "East US"
          }
        ]
      }
    ]
    ```

1. Use [`az cosmosdb sql restorable-database list`](/cli/azure/cosmosdb/sql/restorable-database#az-cosmosdb-sql-restorable-database-list) to list all restorable versions of databases for live accounts.

    ```azurecli
    az cosmosdb sql restorable-database list \
        --instance-id <instance-id-of-account> \
        --location <location>
    ```

    > [!NOTE]
    > Listing all the restorable database deletion events allows you to choose the right database in a scenario where the actual time of existence is unknown. If the event feed contains the **Delete** operation type in its response, then it’s a deleted database and it can be restored within the same account. The restore timestamp can be set to any timestamp before the deletion timestamp and within the retention window.

1. Use [`az cosmosdb sql restorable-container list`](/cli/azure/cosmosdb/sql/restorable-container#az-cosmosdb-sql-restorable-container-list) to list all the versions of restorable containers within a specific database.

    ```azurecli
    az cosmosdb sql restorable-container list \
        --instance-id <instance-id-of-account> \
        --database-rid <owner-resource-id-of-database> \
        --location <location>
    ```

    > [!NOTE]
    > Listing all the restorable database deletion events allows you allows you to choose the right container in a scenario where the actual time of existence is unknown. If the event feed contains the **Delete** operation type in its response, then it’s a deleted container and it can be restored within the same account. The restore timestamp can be set to any timestamp before the deletion timestamp and within the retention window.

1. Trigger a restore operation for a deleted database using [`az cosmosdb sql database restore`](/cli/azure/cosmosdb/sql/database#az-cosmosdb-sql-database-restore).

    ```azurecli
    az cosmosdb sql database restore \
         --resource-group <resource-group-name> \ 
         --account-name <account-name> \  
         --name <database-name> \
         --restore-timestamp <timestamp>
    ```

1. Trigger a restore operation for a deleted container using [`az cosmosdb sql container restore`](/cli/azure/cosmosdb/sql/container#az-cosmosdb-sql-container-restore).

    ```azurecli
    az cosmosdb sql container restore \
         --resource-group <resource-group-name> \ 
         --account-name <account-name> \  
         --database-name <database-name> \
        --name <container-name> \
         --restore-timestamp <timestamp>
    ```

:::zone-end

:::zone pivot="api-mongodb"

1. Retrieve a list of all live and deleted restorable database accounts using [`az cosmosdb restorable-database-account list`](/cli/azure/cosmosdb/restorable-database-account#az-cosmosdb-restorable-database-account-list).

    ```azurecli
    az cosmosdb restorable-database-account list \
        --account-name <name-of-account>
    ```

    ```output
    [
      {
        "accountName": "deleted-account-1",
        "apiType": "Sql",
        "creationTime": "2020-08-02T22:23:00.095870+00:00",
        "deletionTime": "2020-08-02T22:26:13.483175+00:00",
        "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/westus/restorableDatabaseAccounts/abcd1234-d1c0-4645-a699-abcd1234",
        "location": "West US",
        "name": "abcd1234-d1c0-4645-a699-abcd1234",
        "restorableLocations": [
          {
            "locationName": "West US"
          },
          {
            "locationName": "East US"
          }
        ]
      }
    ]
    ```

1. Use [`az cosmosdb mongodb restorable-database list`](/cli/azure/cosmosdb/mongodb/restorable-database#az-cosmosdb-mongodb-restorable-database-list) to list all restorable versions of databases for live accounts.

    ```azurecli
    az cosmosdb mongodb restorable-database list \
        --instance-id <instance-id-of-account> \
        --location <location>
    ```

1. Use [`az cosmosdb mongodb restorable-collection list`](/cli/azure/cosmosdb/mongodb/restorable-collection#az-cosmosdb-mongodb-restorable-collection-list) to list all the versions of restorable collections within a specific database.

    ```azurecli
    az cosmosdb mongodb restorable-collection list \
        --instance-id <instance-id-of-account> \
        --database-rid <owner-resource-id-of-database> \
        --location <location>
    ```

1. Trigger a restore operation for a deleted database using [`az cosmosdb mongodb database restore`](/cli/azure/cosmosdb/mongodb/database#az-cosmosdb-mongodb-database-restore).

    ```azurecli
    az cosmosdb mongodb database restore \
         --resource-group <resource-group-name> \ 
         --account-name <account-name> \  
         --name <database-name> \
         --restore-timestamp <timestamp>
    ```

1. Trigger a restore operation for a deleted collection using [`az cosmosdb mongodb collection restore`](/cli/azure/cosmosdb/mongodb/collection#az-cosmosdb-mongodb-collection-restore).

    ```azurecli
    az cosmosdb mongodb collection restore \
         --resource-group <resource-group-name> \ 
         --account-name <account-name> \   
         --database-name <database-name> \
        --name <container-name> \
         --restore-timestamp <timestamp> 
    ```

:::zone-end

:::zone pivot="api-gremlin"

1. Retrieve a list of all live and deleted restorable database accounts using [`az cosmosdb restorable-database-account list`](/cli/azure/cosmosdb/restorable-database-account#az-cosmosdb-restorable-database-account-list).

    ```azurecli
    az cosmosdb restorable-database-account list \
        --account-name <name-of-account>
    ```

    ```output
    [
      {
        "accountName": "deleted-account-1",
        "apiType": "Sql",
        "creationTime": "2020-08-02T22:23:00.095870+00:00",
        "deletionTime": "2020-08-02T22:26:13.483175+00:00",
        "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/westus/restorableDatabaseAccounts/abcd1234-d1c0-4645-a699-abcd1234",
        "location": "West US",
        "name": "abcd1234-d1c0-4645-a699-abcd1234",
        "restorableLocations": [
          {
            "locationName": "West US"
          },
          {
            "locationName": "East US"
          }
        ]
      }
    ]
    ```

1. Use [`az cosmosdb gremlin restorable-database list`](/cli/azure/cosmosdb/gremlin/restorable-database#az-cosmosdb-gremlin-restorable-database-list) to list all restorable versions of databases for live accounts.

    ```azurecli
    az cosmosdb gremlin restorable-database list \
        --instance-id <instance-id-of-account> \
        --location <location>
    ```

1. Use [`az cosmosdb gremlin restorable-graph list`](/cli/azure/cosmosdb/gremlin/restorable-graph#az-cosmosdb-gremlin-restorable-graph-list) to list all the versions of restorable graphs within a specific database.

    ```azurecli
    az cosmosdb gremlin restorable-graph list \
        --instance-id <instance-id-of-account> \
        --database-rid <owner-resource-id-of-database> \
        --location <location>
    ```

1. Trigger a restore operation for a deleted database using [`az cosmosdb gremlin database restore`](/cli/azure/cosmosdb/gremlin/database#az-cosmosdb-gremlin-database-restore).

    ```azurecli
    az cosmosdb gremlin database restore \
         --resource-group <resource-group-name> \ 
         --account-name <account-name> \  
         --name <database-name> \ 
        --restore-timestamp <timestamp>
    ```

1. Trigger a restore operation for a deleted graph using [`az cosmosdb gremlin graph restore`](/cli/azure/cosmosdb/gremlin/graph#az-cosmosdb-gremlin-graph-restore).

    ```azurecli
    az cosmosdb gremlin database restore \
         --resource-group <resource-group-name> \ 
         --account-name <account-name> \  
         --database-name <database-name> \ 
         --name <graph-name> \ 
        --restore-timestamp <timestamp>
    ```

:::zone-end

:::zone pivot="api-table"

1. Retrieve a list of all live and deleted restorable database accounts using [`az cosmosdb restorable-database-account list`](/cli/azure/cosmosdb/restorable-database-account#az-cosmosdb-restorable-database-account-list).

    ```azurecli
    az cosmosdb restorable-database-account list \
        --account-name <name-of-account>
    ```

    ```output
    [
      {
        "accountName": "deleted-account-1",
        "apiType": "Sql",
        "creationTime": "2020-08-02T22:23:00.095870+00:00",
        "deletionTime": "2020-08-02T22:26:13.483175+00:00",
        "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/westus/restorableDatabaseAccounts/abcd1234-d1c0-4645-a699-abcd1234",
        "location": "West US",
        "name": "abcd1234-d1c0-4645-a699-abcd1234",
        "restorableLocations": [
          {
            "locationName": "West US"
          },
          {
            "locationName": "East US"
          }
        ]
      }
    ]
    ```

1. Use [`az cosmosdb table restorable-table list`](/cli/azure/cosmosdb/table/restorable-table#az-cosmosdb-table-restorable-table-list) to list all restorable versions of tables for live accounts.

    ```azurecli
    az cosmosdb table restorable-table list \
        --instance-id <instance-id-of-account> \
        --location <location>
    ```

1. Trigger a restore operation for a deleted table using [`az cosmosdb table restore`](/cli/azure/cosmosdb/table#az-cosmosdb-table-restore).

    ```azurecli
    az cosmosdb table restore \
         --resource-group <resource-group-name> \
         --account-name <account-name> \
         --table-name <table-name> \
         --restore-timestamp <timestamp>
    ```

:::zone-end

### [Azure PowerShell](#tab/azure-powershell)

Use Azure PowerShell to restore a deleted container or database (including child containers).

> [!IMPORTANT]
> The `Az.CosmosDB` module for Azure PowerShell version **2.0.5-preview** or later is required to access the in-account restore cmdlets. If you do not have the preview version installed, run `Install-Module -Name Az.CosmosDB -RequiredVersion 2.0.5-preview -AllowPrerelease`.

:::zone pivot="api-nosql"

1. Retrieve a list of all live and deleted restorable database accounts using [`Get-AzCosmosDBRestorableDatabaseAccount`](/powershell/module/az.cosmosdb/get-azcosmosdbrestorabledatabaseaccount).

    ```azurepowershell
    Get-AzCosmosDBRestorableDatabaseAccount
    ```

    ```output
    Id                        : /subscriptions/{subscriptionId}/providers/Microsoft.DocumentDB/locations/westus/restorableDatabaseAccounts/abcd1234-d1c0-4645-a699-abcd1234
    DatabaseAccountInstanceId : abcd1234-d1c0-4645-a699-abcd1234
    Location                  : West US
    DatabaseAccountName       : deleted-account-1
    CreationTime              : 8/2/2020 10:23:00 PM
    DeletionTime              : 8/2/2020 10:26:13 PM
    ApiType                   : Sql
    RestorableLocations       : {West US, East US}
    ```

    > [!NOTE]
    > There are `CreationTime` or `DeletionTime` fields for the account. These same fields exist for regions too. These times allow you to choose the right region and a valid time range to use when restoring a resource.

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
        DatabaseRId = "<owner-resource-id-of-database>"
        Location = "<location>"
    }
    Get-AzCosmosDBSqlRestorableContainer @parameters    
    ```

    > [!NOTE]
    > Listing all the restorable database deletion events allows you allows you to choose the right container in a scenario where the actual time of existence is unknown. If the event feed contains the **Delete** operation type in its response, then it’s a deleted container and it can be restored within the same account. The restore timestamp can be set to any timestamp before the deletion timestamp and within the retention window.

1. Trigger a restore operation for a deleted database with `Restore-AzCosmosDBSqlDatabase`.

    ```azurepowershell
    $parameters = @{
        ResourceGroupName = "<resource-group-name>"
        AccountName = "<account-name>"
        Name = "<database-name>"
        RestoreTimestampInUtc = "<timestamp>"
    }
    Restore-AzCosmosDBSqlDatabase @parameters
    ```

1. Trigger a restore operation for a deleted container with `Restore-AzCosmosDBSqlContainer`.

    ```azurepowershell
    $parameters = @{
        ResourceGroupName = "<resource-group-name>"
        AccountName = "<account-name>"
        DatabaseName = "<database-name>"
        Name = "<container-name>"
        RestoreTimestampInUtc = "<timestamp>"
    }
    Restore-AzCosmosDBSqlContainer @parameters 
    ```

:::zone-end

:::zone pivot="api-mongodb"

1. Retrieve a list of all live and deleted restorable database accounts using [`Get-AzCosmosDBRestorableDatabaseAccount`](/powershell/module/az.cosmosdb/get-azcosmosdbrestorabledatabaseaccount).

    ```azurepowershell
    Get-AzCosmosDBRestorableDatabaseAccount
    ```

    ```output
    Id                        : /subscriptions/{subscriptionId}/providers/Microsoft.DocumentDB/locations/westus/restorableDatabaseAccounts/abcd1234-d1c0-4645-a699-abcd1234
    DatabaseAccountInstanceId : abcd1234-d1c0-4645-a699-abcd1234
    Location                  : West US
    DatabaseAccountName       : deleted-account-1
    CreationTime              : 8/2/2020 10:23:00 PM
    DeletionTime              : 8/2/2020 10:26:13 PM
    ApiType                   : Sql
    RestorableLocations       : {West US, East US}
    ```

    > [!NOTE]
    > There are `CreationTime` or `DeletionTime` fields for the account. These same fields exist for regions too. These times allow you to choose the right region and a valid time range to use when restoring a resource.

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
        DatabaseRId = "<owner-resource-id-of-database>"
        Location = "<location>"
    }
    Get-AzCosmosDBMongoDBRestorableCollection @parameters      
    ```

1. Trigger a restore operation for a deleted database with `Restore-AzCosmosDBMongoDBDatabase`.

    ```azurepowershell
    $parameters = @{
        ResourceGroupName = "<resource-group-name>"
        AccountName = "<account-name>"
        Name = "<database-name>"
        RestoreTimestampInUtc = "<timestamp>"
    }
    Restore-AzCosmosDBMongoDBDatabase @parameters 
    ```

1. Trigger a restore operation for a deleted collection with `Restore-AzCosmosDBMongoDBCollection`.

    ```azurepowershell
    $parameters = @{
        ResourceGroupName = "<resource-group-name>"
        AccountName = "<account-name>"
        DatabaseName = "<database-name>"
        Name = "<collection-name>"
        RestoreTimestampInUtc = "<timestamp>"
    }
    Restore-AzCosmosDBMongoDBCollection @parameters   
    ```

:::zone-end

:::zone pivot="api-gremlin"

1. Retrieve a list of all live and deleted restorable database accounts using [`Get-AzCosmosDBRestorableDatabaseAccount`](/powershell/module/az.cosmosdb/get-azcosmosdbrestorabledatabaseaccount).

    ```azurepowershell
    Get-AzCosmosDBRestorableDatabaseAccount
    ```

    ```output
    Id                        : /subscriptions/{subscriptionId}/providers/Microsoft.DocumentDB/locations/westus/restorableDatabaseAccounts/abcd1234-d1c0-4645-a699-abcd1234
    DatabaseAccountInstanceId : abcd1234-d1c0-4645-a699-abcd1234
    Location                  : West US
    DatabaseAccountName       : deleted-account-1
    CreationTime              : 8/2/2020 10:23:00 PM
    DeletionTime              : 8/2/2020 10:26:13 PM
    ApiType                   : Sql
    RestorableLocations       : {West US, East US}
    ```

    > [!NOTE]
    > There are `CreationTime` or `DeletionTime` fields for the account. These same fields exist for regions too. These times allow you to choose the right region and a valid time range to use when restoring a resource.

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

1. Trigger a restore operation for a deleted database with `Restore-AzCosmosDBGremlinDatabase`.

    ```azurepowershell
    $parameters = @{
        ResourceGroupName = "<resource-group-name>"
        AccountName = "<account-name>"
        Name = "<database-name>"
        RestoreTimestampInUtc = "<timestamp>"
    }
    Restore-AzCosmosDBGremlinDatabase @parameters
    ```

1. Trigger a restore operation for a deleted graph with `Restore-AzCosmosDBGremlinGraph`.

    ```azurepowershell
    $parameters = @{
        ResourceGroupName = "<resource-group-name>"
        AccountName = "<account-name>"
        DatabaseName = "<database-name>"
        Name = "<graph-name>"
        RestoreTimestampInUtc = "<timestamp>"
    }
    Restore-AzCosmosDBGremlinGraph @parameters 
    ```

:::zone-end

:::zone pivot="api-table"

1. Retrieve a list of all live and deleted restorable database accounts using [`Get-AzCosmosDBRestorableDatabaseAccount`](/powershell/module/az.cosmosdb/get-azcosmosdbrestorabledatabaseaccount).

    ```azurepowershell
    Get-AzCosmosDBRestorableDatabaseAccount
    ```

    ```output
    Id                        : /subscriptions/{subscriptionId}/providers/Microsoft.DocumentDB/locations/westus/restorableDatabaseAccounts/abcd1234-d1c0-4645-a699-abcd1234
    DatabaseAccountInstanceId : abcd1234-d1c0-4645-a699-abcd1234
    Location                  : West US
    DatabaseAccountName       : deleted-account-1
    CreationTime              : 8/2/2020 10:23:00 PM
    DeletionTime              : 8/2/2020 10:26:13 PM
    ApiType                   : Sql
    RestorableLocations       : {West US, East US}
    ```

    > [!NOTE]
    > There are `CreationTime` or `DeletionTime` fields for the account. These same fields exist for regions too. These times allow you to choose the right region and a valid time range to use when restoring a resource.

1. Use [`Get-AzCosmosdbTableRestorableTable`](/powershell/module/az.cosmosdb/get-azcosmosdbtablerestorabletable) to list all restorable versions of tables for live accounts.

    ```azurepowershell
    $parameters = @{
        DatabaseAccountInstanceId = "<instance-id-of-account>"
        Location = "<location>"
    }
    Get-AzCosmosdbTableRestorableTable @parameters
    ```

1. Trigger a restore operation for a deleted table with `Restore-AzCosmosDBTable`.

    ```azurepowershell
    $parameters = @{
        ResourceGroupName = "<resource-group-name>"
        AccountName = "<account-name>"
        Name = "<table-name>"
        RestoreTimestampInUtc = "<timestamp>"
    }
    Restore-AzCosmosDBTable @parameters
    ```

:::zone-end

### [Azure Resource Manager template](#tab/azure-resource-manager)

You can restore deleted containers and databases using an Azure Resource Manager template.

1. Create or locate an Azure Cosmos DB resource in your template. Here's a generic example of a resource.

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "resources": [
        {
          "name": "msdocs-example-arm",
          "type": "Microsoft.DocumentDB/databaseAccounts",
          "apiVersion": "2022-02-15-preview",
          "location": "West US",
          "properties": {
            "locations": [
              {
                "locationName": "West US"
              }
            ],
            "backupPolicy": {
              "type": "Continuous"
            },
            "databaseAccountOfferType": "Standard"
          }
        }
      ]
    }    
    ```

1. Update the Azure Cosmos DB resource in your template by:

    - Setting `properties.createMode` to `restore`.
    - Defining a `properties.restoreParameters` object.
    - Setting `properties.restoreParameters.restoreTimestampInUtc` to a UTC timestamp.
    - Setting `properties.restoreParameters.restoreSource` to the **instance identifier** of the account that is the source of the restore operation.

    :::zone pivot="api-nosql"

    ```json
    {
      "properties": {
        "name": "<name-of-database-or-container>",
        "restoreParameters": {
          "restoreSource": "<source-account-instance-id>",
          "restoreTimestampInUtc": "<timestamp>"
        },
        "createMode": "Restore"
      }
    }
    ```

    :::zone-end

    :::zone pivot="api-mongodb"

    ```json
    {
      "properties": {
        "name": "<name-of-database-or-collection>",
        "restoreParameters": {
          "restoreSource": "<source-account-instance-id>",
          "restoreTimestampInUtc": "<timestamp>"
        },
        "createMode": "Restore"
      }
    }
    ```

    :::zone-end

    :::zone pivot="api-gremlin"

    ```json
    {
      "properties": {
        "name": "<name-of-database-or-graph>",
        "restoreParameters": {
          "restoreSource": "<source-account-instance-id>",
          "restoreTimestampInUtc": "<timestamp>"
        },
        "createMode": "Restore"
      }
    }
    ```

    :::zone-end

    :::zone pivot="api-table"

    ```json
    {
      "properties": {
        "name": "<name-of-table>",
        "restoreParameters": {
          "restoreSource": "<source-account-instance-id>",
          "restoreTimestampInUtc": "<timestamp>"
        },
        "createMode": "Restore"
      }
    }
    ```

    :::zone-end

    > [!NOTE]
    > Use [`az cosmosdb restorable-database-account list`](/cli/azure/cosmosdb/restorable-database-account#az-cosmosdb-restorable-database-account-list) to retrieve a list of instance identifiers for all live and deleted restorable database accounts.

1. Deploy the template using [`az deployment group create`](/cli/azure/deployment/group#az-deployment-group-create).  

    ```azurecli-interactive
    az deployment group create \
        --resource-group <resource-group-name> \
        --template-file <template-filename>
    ```

---

## Track the status of a restore operation

When a point-in-time restore is triggered for a deleted container or database, the operation is identified as an **InAccount** restore operation on the resource.

### [Azure portal](#tab/azure-portal)

To get a list of restore operations for a specific resource, filter the Activity Log of the account using the search filter `InAccount Restore Deleted` and a time filter. The resulting list includes the `UserPrincipalName` field that identifies the user that triggered the restore operation. For more information on how to access activity logs, see [Auditing point-in-time restore actions](audit-restore-continuous.md#audit-the-restores-that-were-triggered-on-a-live-database-account).

### [Azure CLI / Azure PowerShell / Azure Resource Manager template](#tab/azure-cli+azure-powershell+azure-resource-manager)

At present portal is used for getting the activity log of the account using the search filter `InAccount Restore Deleted` and a time filter. 

---

## Next steps

- Enable continuous backup using [Azure portal](provision-account-continuous-backup.md#provision-portal), [PowerShell](provision-account-continuous-backup.md#provision-powershell), [CLI](provision-account-continuous-backup.md#provision-cli), or [Azure Resource Manager](provision-account-continuous-backup.md#provision-arm-template).
- [How to migrate to an account from periodic backup to continuous backup](migrate-continuous-backup.md).
- [Continuous backup mode resource model.](continuous-backup-restore-resource-model.md)
- [Manage permissions](continuous-backup-restore-permissions.md) required to restore data with continuous backup mode.
