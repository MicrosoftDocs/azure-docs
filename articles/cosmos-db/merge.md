---
title: Merge partitions in Azure Cosmos DB (preview)
description: Learn more about the merge partitions capability in Azure Cosmos DB
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.topic: conceptual
ms.reviewer: dech
ms.date: 05/09/2022
---

# Merge partitions in Azure Cosmos DB (preview)
[!INCLUDE[appliesto-sql-mongodb-api](includes/appliesto-sql-mongodb-api.md)]

Merging partitions in Azure Cosmos DB (preview) allows you to reduce the number of physical partitions used for your container. With merge, containers that are fragmented in throughput (have low RU/s per partition) or storage (have low storage per partition) can have their physical partitions reworked. If a container's throughput has been scaled up and needs to be scaled back down, merge can help resolve throughput fragmentation issues. For the same amount of provisioned RU/s, having fewer physical partitions means each physical partition gets more of the overall RU/s. Minimizing partitions reduces the chance of rate limiting if a large quantity of data is removed from a container. Merge can help clear out unused or empty partitions, effectively resolving storage fragmentation problems.

## Getting started

To get started using merge, enroll in the preview by filing a support ticket in the [Azure portal](https://portal.azure.com). 

### Merging physical partitions
When the parameter `IsDryRun` is set to true, Azure Cosmos DB will run a simulation and return the expected result of the merge, but won't run the merge itself. When set to false, the merge will execute against the resource. 
> [!TIP]
> Before running a merge, it's recommended to set your provisioned RU/s (either manual RU/s or autoscale max RU/s) as close as possible to your desired steady state RU/s post-merge, to help ensure the system calculates an efficient partition layout.

#### [PowerShell](#tab/azure-powershell)

```azurepowershell
// SQL API
Invoke-AzCosmosDbSqlContainerPartitionMerge `
    -ResourceGroupName "<resource-group-name>" `
    -AccountName "<cosmos-account-name>" `
    -DatabaseName "<cosmos-database-name>" `
    -Name "<cosmos-container-name>"
    -IsDryRun "<True|False>"

// API for MongoDB
Invoke-AzCosmosDBMongoDBCollectionPartitionMerge `
    -ResourceGroupName "<resource-group-name>" `
    -AccountName "<cosmos-account-name>" `
    -DatabaseName "<cosmos-database-name>" `
    -Name "<cosmos-collection-name>"
    -IsDryRun "<True|False>"
```

#### [Azure CLI](#tab/azure-cli)

```azurecli
// SQL API
az cosmosdb sql container merge \
    --resource-group '<resource-group-name>' \
    --account-name '<cosmos-account-name>' \
    --database-name '<cosmos-database-name>' \
    --name '<cosmos-container-name>'
    --is-dry-run '<true|false>'

// API for MongoDB
az cosmosdb mongodb collection merge \
    --resource-group '<resource-group-name>' \
    --account-name '<cosmos-account-name>' \
    --database-name '<cosmos-database-name>' \
    --name '<cosmos-collection-name>'
    --is-dry-run '<true|false>'
```

---

## Limitations

### Account resources and configuration

* Merge is only available for single-region write accounts. Multi-region write account support isn't available.
* Accounts using merge functionality can't also use these features:
  * [Point-in-time restore](continuous-backup-restore-introduction.md)
  * [Customer-managed keys](how-to-setup-cmk.md)
  * [Analytical store](analytical-store-introduction.md)
* Containers using merge functionality must have their throughput provisioned at the container level. Database-shared throughput support isn't available.
* For API for MongoDB accounts, the MongoDB account version must be 3.6 or greater.

### SDK requirements (SQL API only)

Accounts with the merge feature enabled are supported only in the latest preview version of the .NET v3 SDK. When the feature is enabled on your account (regardless of whether you run the merge), you must only use the supported SDK using the account. Requests sent from other SDKs or earlier versions won't be accepted. As long as you're using the supported SDK, your application can continue to run while a merge is ongoing. 

Find the latest preview version the supported SDK:

| SDK | Supported versions | Package manager link |
| --- | --- | --- |
| **.NET SDK v3** | *>= 3.27.0* | <https://www.nuget.org/packages/Microsoft.Azure.Cosmos/> |

Support for other SDKs is planned for the future.

> [!TIP]
> You should ensure that your application has been updated to use a compatible SDK version prior to enrolling in the preview. If you're using the legacy .NET V2 SDK, follow the [.NET SDK v3 migration guide](sql/migrate-dotnet-v3.md). 

### Unsupported connectors

If you enroll in the preview, the following connectors will fail.

* Azure Data Factory
* Azure Stream Analytics
* Logic Apps
* Azure Functions
* Azure Search

Support for these connectors is planned for the future.

## Next steps

* Learn more about [using Azure CLI with Azure Cosmos DB.](/cli/azure/azure-cli-reference-for-cosmos-db.md)
* Learn more about [using Azure PowerShell with Azure Cosmos DB.](/powershell/module/az.cosmosdb/)
* Learn more about [partitioning in Azure Cosmos DB.](partitioning-overview.md)
