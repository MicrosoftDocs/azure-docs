---
title: Merge partitions in Azure Cosmos DB (preview)
description: Learn more about the merge partitions capability in Azure Cosmos DB
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.custom: event-tier1-build-2022
ms.topic: conceptual
ms.reviewer: dech
ms.date: 05/09/2022
---

# Merge partitions in Azure Cosmos DB (preview)
[!INCLUDE[appliesto-sql-mongodb-api](includes/appliesto-sql-mongodb-api.md)]

Merging partitions in Azure Cosmos DB (preview) allows you to reduce the number of physical partitions used for your container in place. With merge, containers that are fragmented in throughput (have low RU/s per partition) or storage (have low storage per partition) can have their physical partitions reworked. If a container's throughput has been scaled up and needs to be scaled back down, merge can help resolve throughput fragmentation issues. For the same amount of provisioned RU/s, having fewer physical partitions means each physical partition gets more of the overall RU/s. Minimizing partitions reduces the chance of rate limiting if a large quantity of data is removed from a container and RU/s per partition is low. Merge can help clear out unused or empty partitions, effectively resolving storage fragmentation problems.

## Getting started

To get started using partition merge, enroll in the preview by submitting a request for the **Azure Cosmos DB Partition Merge** feature via the [**Preview Features** page](../azure-resource-manager/management/preview-features.md) in your Azure Subscription overview page. You can also select the **Register for preview** button in the eligibility check page to open the **Preview Features** page. 

Before submitting your request:
- Ensure that you have at least 1 Azure Cosmos DB account in the subscription. This may be an existing account or a new one you've created to try out the preview feature. If you have no accounts in the subscription when the Azure Cosmos DB team receives your request, it will be declined, as there are no accounts to apply the feature to.
- Verify that your Azure Cosmos DB account(s) meet all the [preview eligibility criteria](#preview-eligibility-criteria).

The Azure Cosmos DB team will review your request and contact you via email to confirm which account(s) in the subscription you want to enroll in the preview.

To check whether an Azure Cosmos DB account is eligible for the preview, you can use the built-in eligibility checker in the Azure portal. From your Azure Cosmos DB account overview page in the Azure portal, navigate to **Diagnose and solve problems** -> **Throughput and Scaling** ->  **Partition Merge**. Run the **Check eligibility for partition merge preview** diagnostic.

:::image type="content" source="media/merge/throughput-and-scaling-category.png" alt-text="Screenshot of Throughput and Scaling topic in Diagnose and solve issues page.":::

:::image type="content" source="media/merge/merge-eligibility-check.png" alt-text="Screenshot of merge eligibility check with table of all preview eligibility criteria.":::

### How to identify containers to merge

Containers that meet both of these conditions are likely to benefit from merging partitions:
- Condition 1: The current RU/s per physical partition is <3000 RU/s
- Condition 2: The current average storage in GB per physical partition is <20 GB

Condition 1 often occurs when you have previously scaled up the RU/s (often for a data ingestion) and now want to scale down in steady state.
Condition 2 often occurs when you delete/TTL a large volume of data, leaving unused partitions.

#### Criteria 1

To determine the current RU/s per physical partition, from your Cosmos account, navigate to **Metrics**. Select the metric **Physical Partition Throughput** and filter to your database and container. Apply splitting by **PhysicalPartitionId**. 

For containers using autoscale, this will show the max RU/s currently provisioned on each physical partition. For containers using manual throughput, this will show the manual RU/s on each physical partition.

In the below example, we have an autoscale container provisioned with 5000 RU/s (scales between 500 - 5000 RU/s). It has 5 physical partitions and each physical partition has 1000 RU/s.

:::image type="content" source="media/merge/RU-per-physical-partition-metric.png" alt-text="Screenshot of Azure Monitor metric Physical Partition Throughput in Azure portal.":::

#### Criteria 2

To determine the current average storage per physical partition, first find the overall storage (data + index) of the container.

Navigate to **Insights** > **Storage** > **Data & Index Usage**. The total storage is the sum of the data and index usage. In the below example, the container has a total of 74 GB of storage.

:::image type="content" source="media/merge/storage-per-container.png" alt-text="Screenshot of Azure Monitor storage (data + index) metric for container in Azure portal.":::

Next, find the total number of physical partitions. This is the distinct number of **PhysicalPartitionIds** in the **PhysicalPartitionThroughput** chart we saw in Criteria 1. In our example, we have 5 physical partitions.

Finally, calculate: Total storage in GB / number of physical partitions. In our example, we have an average of (74 GB / 5 physical partitions) = 14.8 GB per physical partition. 

Based on criteria 1 and 2, our container can potentially benefit from merging partitions.

### Merging physical partitions

In PowerShell, when the flag `-WhatIf` is passed in, Azure Cosmos DB will run a simulation and return the expected result of the merge, but won't run the merge itself. When the flag isn't passed in, the merge will execute against the resource. When finished, the command will output the current amount of storage in KB per physical partition post-merge.
> [!TIP]
> Before running a merge, it's recommended to set your provisioned RU/s (either manual RU/s or autoscale max RU/s) as close as possible to your desired steady state RU/s post-merge, to help ensure the system calculates an efficient partition layout.

#### [PowerShell](#tab/azure-powershell)

```azurepowershell
// Add the preview extension
Install-Module -Name Az.CosmosDB -AllowPrerelease -Force

// SQL API
Invoke-AzCosmosDBSqlContainerMerge `
    -ResourceGroupName "<resource-group-name>" `
    -AccountName "<cosmos-account-name>" `
    -DatabaseName "<cosmos-database-name>" `
    -Name "<cosmos-container-name>" `
    -WhatIf

// API for MongoDB
Invoke-AzCosmosDBMongoDBCollectionMerge `
    -ResourceGroupName "<resource-group-name>" `
    -AccountName "<cosmos-account-name>" `
    -DatabaseName "<cosmos-database-name>" `
    -Name "<cosmos-collection-name>" `
    -WhatIf
```

#### [Azure CLI](#tab/azure-cli)

```azurecli
// Add the preview extension
az extension add --name cosmosdb-preview

// SQL API
az cosmosdb sql container merge \
    --resource-group '<resource-group-name>' \
    --account-name '<cosmos-account-name>' \
    --database-name '<cosmos-database-name>' \
    --name '<cosmos-container-name>'

// API for MongoDB
az cosmosdb mongodb collection merge \
    --resource-group '<resource-group-name>' \
    --account-name '<cosmos-account-name>' \
    --database-name '<cosmos-database-name>' \
    --name '<cosmos-collection-name>'
```

---

### Monitor merge operations
Partition merge is a long-running operation and there's no SLA on how long it takes to complete. The time depends on the amount of data in the container and the number of physical partitions. It's recommended to allow at least 5-6 hours for merge to complete.

While partition merge is running on your container, it isn't possible to change the throughput or any container settings (TTL, indexing policy, unique keys, etc.). Wait until the merge operation completes before changing your container settings.

You can track whether merge is still in progress by checking the **Activity Log** and filtering for the events **Merge the physical partitions of a MongoDB collection** or **Merge the physical partitions of a SQL container**.

## Limitations

### Preview eligibility criteria
To enroll in the preview, your Cosmos account must meet all the following criteria:
* Your Cosmos account uses SQL API or API for MongoDB with version >=3.6.
* Your Cosmos account is using provisioned throughput (manual or autoscale). Merge doesn't apply to serverless accounts.
    * Currently, merge isn't supported for shared throughput databases. You may enroll an account that has both shared throughput databases and containers with dedicated throughput (manual or autoscale).
    * However, only the containers with dedicated throughput will be able to be merged.
* Your Cosmos account is a single-write region account (merge isn't currently supported for multi-region write accounts).
* Your Cosmos account doesn't use any of the following features:
  * [Point-in-time restore](continuous-backup-restore-introduction.md)
  * [Customer-managed keys](how-to-setup-cmk.md)
  * [Analytical store](analytical-store-introduction.md)
* Your Cosmos account uses bounded staleness, session, consistent prefix, or eventual consistency (merge isn't currently supported for strong consistency).
* If you're using SQL API, your application must use the Azure Cosmos DB .NET V3 SDK, version 3.27.0 or higher. When merge preview enabled on your account, all requests sent from non .NET SDKs or older .NET SDK versions won't be accepted.
    * There are no SDK or driver requirements to use the feature with API for MongoDB.
* Your Cosmos account doesn't use any currently unsupported connectors:
    * Azure Data Factory
    * Azure Stream Analytics
    * Logic Apps
    * Azure Functions
    * Azure Search
    * Azure Cosmos DB Spark connector
    * Azure Cosmos DB data migration tool
    * Any 3rd party library or tool that has a dependency on an Azure Cosmos DB SDK that is not .NET V3 SDK v3.27.0 or higher

### Account resources and configuration
* Merge is only available for SQL API and API for MongoDB accounts. For API for MongoDB accounts, the MongoDB account version must be 3.6 or greater.
* Merge is only available for single-region write accounts. Multi-region write account support isn't available.
* Accounts using merge functionality can't also use these features (if these features are added to a merge enabled account, resources in the account will no longer be able to be merged):
  * [Point-in-time restore](continuous-backup-restore-introduction.md)
  * [Customer-managed keys](how-to-setup-cmk.md)
  * [Analytical store](analytical-store-introduction.md)
* Containers using merge functionality must have their throughput provisioned at the container level. Database-shared throughput support isn't available.
* Merge is only available for accounts using bounded staleness, session, consistent prefix, or eventual consistency. It isn't currently supported for strong consistency.
* After a container has been merged, it isn't possible to read the change feed with start time. Support for this feature is planned for the future.

### SDK requirements (SQL API only)

Accounts with the merge feature enabled are supported only when you use the latest version of the .NET v3 SDK. When the feature is enabled on your account (regardless of whether you run the merge), you must only use the supported SDK using the account. Requests sent from other SDKs or earlier versions won't be accepted. As long as you're using the supported SDK, your application can continue to run while a merge is ongoing. 

Find the latest version of the supported SDK:

| SDK | Supported versions | Package manager link |
| --- | --- | --- |
| **.NET SDK v3** | *>= 3.27.0* | <https://www.nuget.org/packages/Microsoft.Azure.Cosmos/> |

Support for other SDKs is planned for the future.

> [!TIP]
> You should ensure that your application has been updated to use a compatible SDK version prior to enrolling in the preview. If you're using the legacy .NET V2 SDK, follow the [.NET SDK v3 migration guide](sql/migrate-dotnet-v3.md). 

### Unsupported connectors

If you enroll in the preview, the following connectors will fail.

* Azure Data Factory<sup>1</sup>
* Azure Stream Analytics<sup>1</sup>
* Logic Apps<sup>1</sup>
* Azure Functions<sup>1</sup>
* Azure Search<sup>1</sup>
* Azure Cosmos DB Spark connector<sup>1</sup>
* Azure Cosmos DB data migration tool
* Any 3rd party library or tool that has a dependency on an Azure Cosmos DB SDK that is not .NET V3 SDK v3.27.0 or higher

<sup>1</sup>Support for these connectors is planned for the future.

## Next steps

* Learn more about [using Azure CLI with Azure Cosmos DB.](/cli/azure/azure-cli-reference-for-cosmos-db)
* Learn more about [using Azure PowerShell with Azure Cosmos DB.](/powershell/module/az.cosmosdb/)
* Learn more about [partitioning in Azure Cosmos DB.](partitioning-overview.md)
