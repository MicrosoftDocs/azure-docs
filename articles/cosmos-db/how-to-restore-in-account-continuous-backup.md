---
title: Restore a container or database to the same, existing account (preview)
titleSuffix: Azure Cosmos DB
description: Restore a deleted container or database to the same, existing Azure Cosmos DB account by using the Azure portal, the Azure CLI, Azure PowerShell, or an Azure Resource Manager template in continuous backup mode.
author: kanshiG
ms.author: govindk
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.custom: build-2023, devx-track-azurecli, devx-track-azurepowershell, devx-track-arm-template
ms.topic: how-to
ms.date: 05/08/2023
zone_pivot_groups: azure-cosmos-db-apis-nosql-mongodb-gremlin-table
---

# Restore a deleted container or database to the same Azure Cosmos DB account (preview)

[!INCLUDE[NoSQL, MongoDB, Gremlin, Table](includes/appliesto-nosql-mongodb-gremlin-table.md)]

The Azure Cosmos DB point-in-time same-account restore feature helps you recover from an accidental deletion of a container or database. This feature restores the deleted  database or container to the same, existing account in any region in which backups exist. Continuous backup mode allows you to restore to any point of time within the last 30 days.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An Azure Cosmos DB account. You can choose one of the following options for an Azure Cosmos DB account:
  - Use an existing Azure Cosmos DB account.
  - Create a [new Azure Cosmos DB account](nosql/how-to-create-account.md?tabs=azure-portal) in your Azure subscription.
  - Create a [Try Azure Cosmos DB free](try-free.md) account with no commitment.

## Restore a deleted container or database

Use the Azure portal, the Azure CLI, Azure PowerShell, or an Azure Resource Manager template to restore a deleted container or database in the same, existing account.

### [Azure portal](#tab/azure-portal)

Use the Azure portal to restore a deleted container or database. Child containers are also restored.

1. Go to the [Azure portal](https://portal.azure.com/).

1. Go to your Azure Cosmos DB account, and then go to the **Point In Time Restore** page.

   > [!NOTE]
   > The restore page in Azure portal is populated only if you have the `Microsoft.DocumentDB/locations/restorableDatabaseAccounts/*/read` permission. To learn more about this permission, see [Backup and restore permissions](continuous-backup-restore-permissions.md).

1. Select the **Restore to same account** tab.

   :::image type="content" source="media/how-to-restore-in-account-continuous-backup.md\in-account-switch.png" lightbox="media/how-to-restore-in-account-continuous-backup.md\in-account-switch.png" alt-text="Screenshot of the options to restore a database or container to the same account.":::

1. For **Database**, enter a search query to filter the event feed for relevant deletion events for a container or a database.

   :::image type="content" source="media/how-to-restore-in-account-continuous-backup.md/event-filter.png" lightbox="media/how-to-restore-in-account-continuous-backup.md/event-filter.png" alt-text="Screenshot of the event filter showing deletion events for containers and databases.":::

1. Next, specify **Start** and **End** values to create a time window to use to filter deletion events.

   :::image type="content" source="media/how-to-restore-in-account-continuous-backup.md/date-filter.png" lightbox="media/how-to-restore-in-account-continuous-backup.md/date-filter.png" alt-text="Screenshot of the start and end date filters further filtering down deletion events.":::

   > [!NOTE]
   > The **Start** filter is limited to at most 30 days before the present date.

1. Select **Refresh** to update the list of events for different resource types with your filters applied.

1. Verify the time, and then select **Restore** to start restoration of the selected resource that was previously deleted.

   :::image type="content" source="media/how-to-restore-in-account-continuous-backup.md/restore-confirmation.png" lightbox="media/how-to-restore-in-account-continuous-backup.md/restore-confirmation.png" alt-text="Screenshot of the confirmation dialog prior to a restore operation.":::

   > [!IMPORTANT]
   > No more than three restore operations can be active at any time on the same account. Deleting the source account while a restore operation is in progress might result in the failure of the restore operation.

   > [!NOTE]
   > The event feed displays resources as **Not restorable**. The feed provides more information about why the resource can't be restored. In most cases, you must restore the parent database before you can restore any of the database's child containers.

1. After you initiate a restore operation, track the operation by using the notifications area of the Azure portal. The notification provides the status of the resource that's being restored. While restore is in progress, the status of the container is **Creating**. After the restore operation completes, the status changes to **Online**.

### [Azure CLI](#tab/azure-cli)

Use the Azure CLI to restore a deleted container or database. Child containers are also restored.

> [!IMPORTANT]
> The `cosmosdb-preview` extension for Azure CLI version **0.24.0** or later is required to access the in-account restore command. If you do not have the preview version installed, run `az extension add --name cosmosdb-preview --version 0.24.0`.

:::zone pivot="api-nosql"

1. Retrieve a list of all live and deleted restorable database accounts by using [az cosmosdb restorable-database-account list](/cli/azure/cosmosdb/restorable-database-account#az-cosmosdb-restorable-database-account-list):

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

1. Use [az cosmosdb sql restorable-database list](/cli/azure/cosmosdb/sql/restorable-database#az-cosmosdb-sql-restorable-database-list) to list all restorable versions of databases for live accounts:

    ```azurecli
    az cosmosdb sql restorable-database list \
        --instance-id <instance-id-of-account> \
        --location <location>
    ```

   > [!NOTE]
   > Listing all the restorable database deletion events allows you to choose the right database in a scenario in which the actual time of existence is unknown. If the event feed contains the **Delete** operation type in its response, then it’s a deleted database, and it can be restored within the same account. The restore time stamp can be set to any time stamp before the deletion time stamp and within the retention window.

1. Use [az cosmosdb sql restorable-container list](/cli/azure/cosmosdb/sql/restorable-container#az-cosmosdb-sql-restorable-container-list) to list all the versions of restorable containers within a specific database:

    ```azurecli
    az cosmosdb sql restorable-container list \
        --instance-id <instance-id-of-account> \
        --database-rid <owner-resource-id-of-database> \
        --location <location>
    ```

   > [!NOTE]
   > Listing all the restorable database deletion events allows you to choose the right container in a scenario in which the actual time of existence is unknown. If the event feed contains the **Delete** operation type in its response, then it’s a deleted container, and it can be restored within the same account. The restore time stamp can be set to any time stamp before the deletion time stamp and within the retention window.

1. Initiate a restore operation for a deleted database by using [az cosmosdb sql database restore](/cli/azure/cosmosdb/sql/database#az-cosmosdb-sql-database-restore):

    ```azurecli
    az cosmosdb sql database restore \
         --resource-group <resource-group-name> \ 
         --account-name <account-name> \  
         --name <database-name> \
         --restore-timestamp <timestamp>
    ```

1. Initiate a restore operation for a deleted container by using [az cosmosdb sql container restore](/cli/azure/cosmosdb/sql/container#az-cosmosdb-sql-container-restore):

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

1. Retrieve a list of all live and deleted restorable database accounts by using [az cosmosdb restorable-database-account list](/cli/azure/cosmosdb/restorable-database-account#az-cosmosdb-restorable-database-account-list):

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

1. Use [az cosmosdb mongodb restorable-database list](/cli/azure/cosmosdb/mongodb/restorable-database#az-cosmosdb-mongodb-restorable-database-list) to list all restorable versions of databases for live accounts:

    ```azurecli
    az cosmosdb mongodb restorable-database list \
        --instance-id <instance-id-of-account> \
        --location <location>
    ```

1. Use [az cosmosdb mongodb restorable-collection list](/cli/azure/cosmosdb/mongodb/restorable-collection#az-cosmosdb-mongodb-restorable-collection-list) to list all the versions of restorable collections within a specific database:

    ```azurecli
    az cosmosdb mongodb restorable-collection list \
        --instance-id <instance-id-of-account> \
        --database-rid <owner-resource-id-of-database> \
        --location <location>
    ```

1. Initiate a restore operation for a deleted database by using [az cosmosdb mongodb database restore](/cli/azure/cosmosdb/mongodb/database#az-cosmosdb-mongodb-database-restore):

    ```azurecli
    az cosmosdb mongodb database restore \
         --resource-group <resource-group-name> \ 
         --account-name <account-name> \  
         --name <database-name> \
         --restore-timestamp <timestamp>
    ```

1. Initiate a restore operation for a deleted collection by using [az cosmosdb mongodb collection restore](/cli/azure/cosmosdb/mongodb/collection#az-cosmosdb-mongodb-collection-restore):

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

1. Retrieve a list of all live and deleted restorable database accounts by using [az cosmosdb restorable-database-account list](/cli/azure/cosmosdb/restorable-database-account#az-cosmosdb-restorable-database-account-list):

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

1. Use [az cosmosdb gremlin restorable-database list](/cli/azure/cosmosdb/gremlin/restorable-database#az-cosmosdb-gremlin-restorable-database-list) to list all restorable versions of databases for live accounts:

    ```azurecli
    az cosmosdb gremlin restorable-database list \
        --instance-id <instance-id-of-account> \
        --location <location>
    ```

1. Use [az cosmosdb gremlin restorable-graph list](/cli/azure/cosmosdb/gremlin/restorable-graph#az-cosmosdb-gremlin-restorable-graph-list) to list all the versions of restorable graphs within a specific database:

    ```azurecli
    az cosmosdb gremlin restorable-graph list \
        --instance-id <instance-id-of-account> \
        --database-rid <owner-resource-id-of-database> \
        --location <location>
    ```

1. Initiate a restore operation for a deleted database by using [az cosmosdb gremlin database restore](/cli/azure/cosmosdb/gremlin/database#az-cosmosdb-gremlin-database-restore):

    ```azurecli
    az cosmosdb gremlin database restore \
         --resource-group <resource-group-name> \ 
         --account-name <account-name> \  
         --name <database-name> \ 
        --restore-timestamp <timestamp>
    ```

1. Initiate a restore operation for a deleted graph by using [az cosmosdb gremlin graph restore](/cli/azure/cosmosdb/gremlin/graph#az-cosmosdb-gremlin-graph-restore):

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

1. Retrieve a list of all live and deleted restorable database accounts by using [az cosmosdb restorable-database-account list](/cli/azure/cosmosdb/restorable-database-account#az-cosmosdb-restorable-database-account-list):

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

1. Use [az cosmosdb table restorable-table list](/cli/azure/cosmosdb/table/restorable-table#az-cosmosdb-table-restorable-table-list) to list all restorable versions of tables for live accounts:

    ```azurecli
    az cosmosdb table restorable-table list \
        --instance-id <instance-id-of-account> \
        --location <location>
    ```

1. Initiate a restore operation for a deleted table by using [az cosmosdb table restore](/cli/azure/cosmosdb/table#az-cosmosdb-table-restore):

    ```azurecli
    az cosmosdb table restore \
         --resource-group <resource-group-name> \
         --account-name <account-name> \
         --table-name <table-name> \
         --restore-timestamp <timestamp>
    ```

:::zone-end

### [Azure PowerShell](#tab/azure-powershell)

Use Azure PowerShell to restore a deleted container or database. Child containers and databases are also restored.

> [!IMPORTANT]
> The `Az.CosmosDB` module for Azure PowerShell version **2.0.5-preview** or later is required to access the in-account restore cmdlets. If you do not have the preview version installed, run `Install-Module -Name Az.CosmosDB -RequiredVersion 2.0.5-preview -AllowPrerelease`.

:::zone pivot="api-nosql"

1. Retrieve a list of all live and deleted restorable database accounts by using the [Get-AzCosmosDBRestorableDatabaseAccount](/powershell/module/az.cosmosdb/get-azcosmosdbrestorabledatabaseaccount) cmdlet:

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
   > The account has `CreationTime` or `DeletionTime` fields. These fields also exist for regions. These times allow you to choose the correct region and a valid time range to use when you restore a resource.

1. Use the [Get-AzCosmosDBSqlRestorableDatabase](/powershell/module/az.cosmosdb/get-azcosmosdbsqlrestorabledatabase) cmdlet to list all restorable versions of databases for live accounts:

    ```azurepowershell
    $parameters = @{
        DatabaseAccountInstanceId = "<instance-id-of-account>"
        Location = "<location>"
    }
    Get-AzCosmosDBSqlRestorableDatabase @parameters
    ```

   > [!NOTE]
   > Listing all the restorable database deletion events allows you to choose the right database in a scenario where the actual time of existence is unknown. If the event feed contains the **Delete** operation type in its response, then it’s a deleted database and it can be restored within the same account. The restore timestamp can be set to any timestamp before the deletion timestamp and within the retention window.

1. Use the [Get-AzCosmosDBSqlRestorableContainer](/powershell/module/az.cosmosdb/get-azcosmosdbsqlrestorablecontainer) cmdlet to list all the versions of restorable containers within a specific database:

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

1. Initiate a restore operation for a deleted database by using the Restore-AzCosmosDBSqlDatabase cmdlet:

    ```azurepowershell
    $parameters = @{
        ResourceGroupName = "<resource-group-name>"
        AccountName = "<account-name>"
        Name = "<database-name>"
        RestoreTimestampInUtc = "<timestamp>"
    }
    Restore-AzCosmosDBSqlDatabase @parameters
    ```

1. Initiate a restore operation for a deleted container by using the Restore-AzCosmosDBSqlContainer cmdlet:

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

1. Retrieve a list of all live and deleted restorable database accounts by using the [Get-AzCosmosDBRestorableDatabaseAccount](/powershell/module/az.cosmosdb/get-azcosmosdbrestorabledatabaseaccount) cmdlet:

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
   > The account has `CreationTime` or `DeletionTime` fields. These fields also exist for regions. These times allow you to choose the correct region and a valid time range to use when you restore a resource.

1. Use [Get-AzCosmosdbMongoDBRestorableDatabase](/powershell/module/az.cosmosdb/get-azcosmosdbmongodbrestorabledatabase) to list all restorable versions of databases for live accounts:

    ```azurepowershell
    $parameters = @{
        DatabaseAccountInstanceId = "<instance-id-of-account>"
        Location = "<location>"
    }
    Get-AzCosmosdbMongoDBRestorableDatabase @parameters
    ```

1. Use the [Get-AzCosmosDBMongoDBRestorableCollection](/powershell/module/az.cosmosdb/get-azcosmosdbmongodbrestorablecollection) cmdlet to list all the versions of restorable collections within a specific database:

    ```azurepowershell
    $parameters = @{
        DatabaseAccountInstanceId = "<instance-id-of-account>"
        DatabaseRId = "<owner-resource-id-of-database>"
        Location = "<location>"
    }
    Get-AzCosmosDBMongoDBRestorableCollection @parameters      
    ```

1. Initiate a restore operation for a deleted database by using the Restore-AzCosmosDBMongoDBDatabase cmdlet:

    ```azurepowershell
    $parameters = @{
        ResourceGroupName = "<resource-group-name>"
        AccountName = "<account-name>"
        Name = "<database-name>"
        RestoreTimestampInUtc = "<timestamp>"
    }
    Restore-AzCosmosDBMongoDBDatabase @parameters 
    ```

1. Initiate a restore operation for a deleted collection by using the Restore-AzCosmosDBMongoDBCollection cmdlet:

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

1. Retrieve a list of all live and deleted restorable database accounts by using the [Get-AzCosmosDBRestorableDatabaseAccount](/powershell/module/az.cosmosdb/get-azcosmosdbrestorabledatabaseaccount) cmdlet:

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
   > The account has `CreationTime` or `DeletionTime` fields. These fields also exist for regions. These times allow you to choose the correct region and a valid time range to use when you restore a resource.

1. Use the [Get-AzCosmosdbGremlinRestorableDatabase](/powershell/module/az.cosmosdb/get-azcosmosdbgremlinrestorabledatabase) cmdlet to list all restorable versions of databases for live accounts:

    ```azurepowershell
    $parameters = @{
        DatabaseAccountInstanceId = "<instance-id-of-account>"
        Location = "<location>"
    }
    Get-AzCosmosdbGremlinRestorableDatabase @parameters
    ```

1. Use the [Get-AzCosmosdbGremlinRestorableGraph](/powershell/module/az.cosmosdb/get-azcosmosdbgremlinrestorablegraph) cmdlet to list all versions of restorable graphs that are in a specific database:

    ```azurepowershell
    $parameters = @{
        DatabaseAccountInstanceId = "<instance-id-of-account>"
        DatabaseRId = "<owner-resource-id-of-database>"
        Location = "<location>"
    }
    Get-AzCosmosdbGremlinRestorableGraph @parameters      
    ```

1. Initiate a restore operation for a deleted database by using the Restore-AzCosmosDBGremlinDatabase cmdlet:

    ```azurepowershell
    $parameters = @{
        ResourceGroupName = "<resource-group-name>"
        AccountName = "<account-name>"
        Name = "<database-name>"
        RestoreTimestampInUtc = "<timestamp>"
    }
    Restore-AzCosmosDBGremlinDatabase @parameters
    ```

1. Initiate a restore operation for a deleted graph by using the Restore-AzCosmosDBGremlinGraph cmdlet:

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

1. Retrieve a list of all live and deleted restorable database accounts by using the [Get-AzCosmosDBRestorableDatabaseAccount](/powershell/module/az.cosmosdb/get-azcosmosdbrestorabledatabaseaccount) cmdlet:

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
   > The account has `CreationTime` or `DeletionTime` fields. These fields also exist for regions. These times allow you to choose the correct region and a valid time range to use when you restore a resource.

1. Use the [Get-AzCosmosdbTableRestorableTable](/powershell/module/az.cosmosdb/get-azcosmosdbtablerestorabletable) cmdlet to list all restorable versions of tables for live accounts:

    ```azurepowershell
    $parameters = @{
        DatabaseAccountInstanceId = "<instance-id-of-account>"
        Location = "<location>"
    }
    Get-AzCosmosdbTableRestorableTable @parameters
    ```

1. Initiate a restore operation for a deleted table by using the Restore-AzCosmosDBTable cmdlet:

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

You can restore deleted containers and databases by using an Azure Resource Manager template.

1. Create or locate an Azure Cosmos DB resource in your template. Here's a generic example of a resource:

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

1. To update the Azure Cosmos DB resource in your template:

    - Set `properties.createMode` to `restore`.
    - Define a `properties.restoreParameters` object.
    - Set `properties.restoreParameters.restoreTimestampInUtc` to a UTC time stamp.
    - Set `properties.restoreParameters.restoreSource` to the **instance identifier** of the account that is the source of the restore operation.

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
   > Use [az cosmosdb restorable-database-account list](/cli/azure/cosmosdb/restorable-database-account#az-cosmosdb-restorable-database-account-list) to retrieve a list of instance identifiers for all live and deleted restorable database accounts.

1. Deploy the template by using [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create):

    ```azurecli-interactive
    az deployment group create \
        --resource-group <resource-group-name> \
        --template-file <template-filename>
    ```

---

## Track the status of a restore operation

When a point-in-time restore is initiated for a deleted container or database, the operation is identified as an **InAccount** restore operation on the resource.

### [Azure portal](#tab/azure-portal)

To get a list of restore operations for a specific resource, filter the activity log of the account by using the **InAccount Restore Deleted** search filter and a time filter. The list that's returns includes the **UserPrincipalName** field, which identifies the user who initiated the restore operation. For more information about how to access activity logs, see [Audit point-in-time restore actions](audit-restore-continuous.md#audit-the-restores-that-were-triggered-on-a-live-database-account).

### [Azure CLI](#tab/azure-cli)

Currently, to get the activity log of the account, you must use the Azure portal. Use the **InAccount Restore Deleted** search filter and a time filter.

### [Azure PowerShell](#tab/azure-powershell)

Currently, to get the activity log of the account, you must use the Azure portal. Use the **InAccount Restore Deleted** search filter and a time filter.

### [Azure Resource Manager template](#tab/azure-resource-manager)

Currently, to get the activity log of the account, you must use the Azure portal. Use the **InAccount Restore Deleted** search filter and a time filter.

---

## Next steps

- Enable continuous backup by using the [Azure portal](provision-account-continuous-backup.md#provision-portal), [Azure PowerShell](provision-account-continuous-backup.md#provision-powershell), the [Azure CLI](provision-account-continuous-backup.md#provision-cli), or [Azure Resource Manager](provision-account-continuous-backup.md#provision-arm-template).
- Learn how to [migrate an account from periodic backup to continuous backup](migrate-continuous-backup.md).
- Review the [continuous backup mode resource model](continuous-backup-restore-resource-model.md).
- [Manage the permissions](continuous-backup-restore-permissions.md) that are required to restore data by using continuous backup mode.
