---
title: Redistribute throughput across partitions in Azure Cosmos DB
description: Learn how to redistribute throughput across partitions
author: avijitgupta
ms.author: avijitgupta
ms.reviewer: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.custom: devx-track-azurecli
ms.topic: concept-article
ms.date: 04/11/2024
---

# Redistribute throughput across partitions
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

By default, Azure Cosmos DB distributes the provisioned throughput of a database or container equally across all physical partitions. However, scenarios may arise where due to a skew in the workload or choice of partition key, certain logical (and thus physical) partitions need more throughput than others. For these scenarios, Azure Cosmos DB gives you the ability to redistribute your provisioned throughput across physical partitions. Redistributing throughput across partitions helps you achieve better performance without having to configure your overall throughput based on the hottest partition. 

The throughput redistributing feature applies to databases and containers using provisioned throughput (manual and autoscale) and doesn't apply to serverless containers. You can change the throughput per physical partition using the Azure Cosmos DB PowerShell or Azure CLI commands.

## When to use this feature

In general, usage of this feature is recommended for scenarios when both the following are true:

- You're consistently seeing 100% normalized utilization on few partitions of a collection.
- You're consistently seeing latency higher than acceptance.

If you aren't seeing 100% RU consumption and your end to end latency is acceptable, then no action to reconfigure RU/s per partition is required.</br>
If you have a workload that has consistent traffic with occasional unpredictable spikes across *all your partitions*, it's recommended to use [autoscale](../provision-throughput-autoscale.md) and [burst capacity](../burst-capacity.md). Autoscale and burst capacity will ensure you can meet your throughput requirements. If you have a small amount of RU/s per partition, you can also use the [partition merge](../merge.md) to reduce the number of partitions and ensure more RU/s per partition for the same total provisioned throughput.

## Example scenario

Suppose we have a workload that keeps track of transactions that take place in retail stores. Because most of our queries are by `StoreId`, we partition by `StoreId`. However, over time, we see that some stores have more activity than others and require more throughput to serve their workloads. We're seeing 100% normalized ru consumption for requests against those StoreIds. Meanwhile, other stores are less active and require less throughput. Let's see how we can redistribute our throughput for better performance.

## Step 1: Identify which physical partitions need more throughput

There are two ways to identify if there's a hot partition.

### Option 1: Use Azure Monitor metrics

To verify if there's a hot partition, navigate to **Insights** > **Throughput** > **Normalized RU Consumption (%) By PartitionKeyRangeID**. Filter to a specific database and container.

Each PartitionKeyRangeId maps to one physical partition. Look for one PartitionKeyRangeId that consistently has a higher normalized RU consumption than others. For example, one value is consistently at 100%, but others are at 30% or less. A pattern such as this can indicate a hot partition.

:::image type="content" source="media/split-norm-utilization-by-pkrange-hot-partition.png" alt-text="Screenshot of Normalized RU Consumption by PartitionKeyRangeId chart with a hot partition.":::

### Option 2: Use Diagnostic Logs

We can use the information from **CDBPartitionKeyRUConsumption** in Diagnostic Logs to get more information about the logical partition keys (and corresponding physical partitions) that are consuming the most RU/s at a second level granularity. Note the sample queries use 24 hours for illustrative purposes only - it's recommended to use at least seven days of history to understand the pattern.

#### Find the physical partition (PartitionKeyRangeId) that is consuming the most RU/s over time

```Kusto
CDBPartitionKeyRUConsumption 
| where TimeGenerated >= ago(24hr)
| where DatabaseName == "MyDB" and CollectionName == "MyCollection" // Replace with database and collection name
| where isnotempty(PartitionKey) and isnotempty(PartitionKeyRangeId)
| summarize sum(RequestCharge) by bin(TimeGenerated, 1m), PartitionKeyRangeId
| render timechart
```

#### For a given physical partition, find the top 10 logical partition keys that are consuming the most RU/s over each hour

```Kusto
CDBPartitionKeyRUConsumption 
| where TimeGenerated >= ago(24hour)
| where DatabaseName == "MyDB" and CollectionName == "MyCollection" // Replace with database and collection name
| where isnotempty(PartitionKey) and isnotempty(PartitionKeyRangeId)
| where PartitionKeyRangeId == 0 // Replace with PartitionKeyRangeId 
| summarize sum(RequestCharge) by bin(TimeGenerated, 1hour), PartitionKey
| order by sum_RequestCharge desc | take 10
```

## Step 2: Determine the target RU/s for each physical partition

### Determine current RU/s for each physical partition

First, let's determine the current RU/s for each physical partition. You can use the Azure Monitor metric **PhysicalPartitionThroughput** and split by the dimension **PhysicalPartitionId** to see how many RU/s you have per physical partition.

Alternatively, if you haven't changed your throughput per partition before, you can use the formula:
``Current RU/s per partition = Total RU/s / Number of physical partitions``

Follow the guidance in the article [Best practices for scaling provisioned throughput (RU/s)](../scaling-provisioned-throughput-best-practices.md#step-1-find-the-current-number-of-physical-partitions) to determine the number of physical partitions.

You can also use the PowerShell `Get-AzCosmosDBSqlContainerPerPartitionThroughput` and `Get-AzCosmosDBMongoDBCollectionPerPartitionThroughput` commands to read the current RU/s on each physical partition. 


#### [PowerShell](#tab/azure-powershell)

Use [`Install-Module`](/powershell/module/powershellget/install-module) to install the [Az.CosmosDB](/powershell/module/az.cosmosdb/) module with prerelease features enabled.

```azurepowershell-interactive
$parameters = @{
    Name = "Az.CosmosDB"
    AllowPrerelease = $true
    Force = $true
}
Install-Module @parameters
```

#### [Azure CLI](#tab/azure-cli)

Use [`az extension add`](/cli/azure/extension#az-extension-add) to install the [cosmosdb-preview](https://github.com/azure/azure-cli-extensions/tree/main/src/cosmosdb-preview) Azure CLI extension.

```azurecli-interactive
az extension add \
    --name cosmosdb-preview
```
---

#### [PowerShell](#tab/azure-powershell)

Use the `Get-AzCosmosDBMongoDBCollectionPerPartitionThroughput` command to read the current RU/s on each physical partition.

```azurepowershell-interactive
// Container with dedicated RU/s
$somePartitionsDedicatedRUContainer = Get-AzCosmosDBMongoDBCollectionPerPartitionThroughput `
                    -ResourceGroupName "<resource-group-name>" `
                    -AccountName "<cosmos-account-name>" `
                    -DatabaseName "<cosmos-database-name>" `
                    -Name "<cosmos-collection-name>" `
                    -PhysicalPartitionIds ("<PartitionId>", "<PartitionId">, ...)

$allPartitionsDedicatedRUContainer = Get-AzCosmosDBMongoDBCollectionPerPartitionThroughput `
                    -ResourceGroupName "<resource-group-name>" `
                    -AccountName "<cosmos-account-name>" `
                    -DatabaseName "<cosmos-database-name>" `
                    -Name "<cosmos-collection-name>" `
                    -AllPartitions

// Database with shared RU/s
$somePartitionsSharedThroughputDatabase = Get-AzCosmosDBMongoDBDatabasePerPartitionThroughput `
                    -ResourceGroupName "<resource-group-name>" `
                    -AccountName "<cosmos-account-name>" `
                    -DatabaseName "<cosmos-database-name>" `
                    -PhysicalPartitionIds ("<PartitionId>", "<PartitionId">)

$allPartitionsSharedThroughputDatabase = Get-AzCosmosDBMongoDBDatabasePerPartitionThroughput `
                    -ResourceGroupName "<resource-group-name>" `
                    -AccountName "<cosmos-account-name>" `
                    -DatabaseName "<cosmos-database-name>" `
                    -AllPartitions

```

#### [Azure CLI](#tab/azure-cli)

Read the current RU/s on each physical partition by using [`az cosmosdb mongodb collection retrieve-partition-throughput`](/cli/azure/cosmosdb/sql/container#az-cosmosdb-mongodb-collection-retrieve-partition-throughput).

```azurecli-interactive
// Collection with dedicated RU/s - some partitions
az cosmosdb mongodb collection retrieve-partition-throughput \
    --resource-group '<resource-group-name>' \
    --account-name '<cosmos-account-name>' \
    --database-name '<cosmos-database-name>' \
    --name '<cosmos-collection-name>' \
    --physical-partition-ids '<space separated list of physical partition ids>'

// Collection with dedicated RU/s - all partitions
az cosmosdb mongodb collection retrieve-partition-throughput \
    --resource-group '<resource-group-name>' \
    --account-name '<cosmos-account-name>' \
    --database-name '<cosmos-database-name>' \
    --name '<cosmos-collection-name>'
    --all-partitions
```

---

### Determine RU/s for target partition

Next, let's decide how many RU/s we want to give to hottest physical partition(s). Let's call this set our target partition(s). The most RU/s any physical partition can contain is 10,000 RU/s.

The right approach depends on your workload requirements. General approaches include:
- Increasing the RU/s by 10 percent, and repeat until desired throughput is achieved. 
    - If you aren't sure the right percentage, you can start with 10% to be conservative.
    - If you already know this physical partition requires most of the throughput of the workload, you can start by doubling the RU/s or increasing it to the maximum of 10,000 RU/s, whichever is lower.

### Determine RU/s for source partition

Finally, let's decide how many RU/s we want to keep on our other physical partitions. This selection will determine the partitions that the target physical partition takes throughput from.

In the PowerShell APIs, we must specify at least one source partition to redistribute RU/s from. We can also specify a custom minimum throughput each physical partition should have after the redistribution. If not specified, by default, Azure Cosmos DB will ensure that each physical partition has at least 100 RU/s after the redistribution. It's recommended to explicitly specify the minimum throughput.

The right approach depends on your workload requirements. General approaches include:
- Taking RU/s equally from all source partitions (works best when there are <=  10 partitions)
    - Calculate the amount we need to offset each source physical partition by. `Offset = Total desired RU/s of target partition(s) - total current RU/s of target partition(s)) / (Total physical partitions - number of target partitions)`
    - Assign the minimum throughput for each source partition = `Current RU/s of source partition - offset`
- Taking RU/s from the least active partition(s)
    - Use Azure Monitor metrics and Diagnostic Logs to determine which physical partition(s) have the least traffic/request volume
    - Calculate the amount we need to offset each source physical partition by. `Offset = Total desired RU/s of target partition(s) - total current RU/s of target partition) / Number of source physical partitions`
    - Assign the minimum throughput for each source partition = `Current RU/s of source partition - offset`

## Step 3: Programatically change the throughput across partitions

You can use the PowerShell command `Update-AzCosmosDBSqlContainerPerPartitionThroughput` to redistribute throughput. 

To understand the below example, let's take an example where we have a container that has 6000 RU/s total (either 6000 manual RU/s or autoscale 6000 RU/s) and 3 physical partitions. Based on our analysis, we want a layout where:

- Physical partition 0: 1000 RU/s
- Physical partition 1: 4000 RU/s
- Physical partition 2: 1000 RU/s

We specify partitions 0 and 2 as our source partitions, and specify that after the redistribution, they should have a minimum RU/s of 1000 RU/s. Partition 1 is out target partition, which we specify should have 4000 RU/s.

#### [PowerShell](#tab/azure-powershell)

Use the `Update-AzCosmosDBMongoDBCollectionPerPartitionThroughput` for collections with dedicated RU/s or the `Update-AzCosmosDBMongoDBDatabasePerPartitionThroughput` command for databases with shared RU/s to redistribute throughput across physical partitions. In shared throughput databases, the Ids of the physical partitions are represented by a GUID string.

```azurepowershell-interactive
$SourcePhysicalPartitionObjects =  @()
$SourcePhysicalPartitionObjects += New-AzCosmosDBPhysicalPartitionThroughputObject -Id "0" -Throughput 1000
$SourcePhysicalPartitionObjects += New-AzCosmosDBPhysicalPartitionThroughputObject -Id "2" -Throughput 1000

$TargetPhysicalPartitionObjects =  @()
$TargetPhysicalPartitionObjects += New-AzCosmosDBPhysicalPartitionThroughputObject -Id "1" -Throughput 4000

// Collection with dedicated RU/s
Update-AzCosmosDBMongoDBCollectionPerPartitionThroughput `
    -ResourceGroupName "<resource-group-name>" `
    -AccountName "<cosmos-account-name>" `
    -DatabaseName "<cosmos-database-name>" `
    -Name "<cosmos-collection-name>" `
    -SourcePhysicalPartitionThroughputObject $SourcePhysicalPartitionObjects `
    -TargetPhysicalPartitionThroughputObject $TargetPhysicalPartitionObjects

// Database with shared RU/s
Update-AzCosmosDBMongoDBDatabasePerPartitionThroughput `
    -ResourceGroupName "<resource-group-name>" `
    -AccountName "<cosmos-account-name>" `
    -DatabaseName "<cosmos-database-name>" `
    -SourcePhysicalPartitionThroughputObject $SourcePhysicalPartitionObjects `
    -TargetPhysicalPartitionThroughputObject $TargetPhysicalPartitionObjects
```

#### [Azure CLI](#tab/azure-cli)

Update the RU/s on each physical partition by using [`az cosmosdb mongodb collection redistribute-partition-throughput`](/cli/azure/cosmosdb/mongodb/collection#az-cosmosdb-mongodb-collection-redistribute-partition-throughput).

```azurecli-interactive
az cosmosdb mongodb collection redistribute-partition-throughput \
    --resource-group '<resource-group-name>' \
    --account-name '<cosmos-account-name>' \
    --database-name '<cosmos-database-name>' \
    --name '<cosmos-collection-name>' \
    --source-partition-info '<PartitionId1=Throughput PartitionId2=Throughput...>' \
    --target-partition-info '<PartitionId3=Throughput PartitionId4=Throughput...>' \
```

---

After you've completed the redistribution, you can verify the change by viewing the  **PhysicalPartitionThroughput** metric in Azure Monitor. Split by the dimension **PhysicalPartitionId** to see how many RU/s you have per physical partition.

If necessary, you can also reset the RU/s per physical partition so that the RU/s of your container are evenly distributed across all physical partitions.

#### [PowerShell](#tab/azure-powershell)

Use the `Update-AzCosmosDBMongoDBCollectionPerPartitionThroughput` command for collections with dedicated RU/s or the `Update-AzCosmosDBMongoDBDatabasePerPartitionThroughput` command for databases with shared RU/s with parameter `-EqualDistributionPolicy` to distribute RU/s evenly across all physical partitions.

```azurepowershell-interactive
// Collection with dedicated RU/s
Update-AzCosmosDBMongoDBCollectionPerPartitionThroughput `
    -ResourceGroupName "<resource-group-name>" `
    -AccountName "<cosmos-account-name>" `
    -DatabaseName "<cosmos-database-name>" `
    -Name "<cosmos-collection-name>" `
    -EqualDistributionPolicy

// Database with shared RU/s
Update-AzCosmosDBMongoDBDatabasePerPartitionThroughput `
    -ResourceGroupName "<resource-group-name>" `
    -AccountName "<cosmos-account-name>" `
    -DatabaseName "<cosmos-database-name>" `
    -EqualDistributionPolicy
```

#### [Azure CLI](#tab/azure-cli)

Update the RU/s on each physical partition by using [`az cosmosdb mongodb collection redistribute-partition-throughput`](/cli/azure/cosmosdb/mongodb/collection#az-cosmosdb-mongodb-collection-redistribute-partition-throughput) with the parameter `--evenly-distribute`.

```azurecli-interactive
az cosmosdb mongodb collection redistribute-partition-throughput \
    --resource-group '<resource-group-name>' \
    --account-name '<cosmos-account-name>' \
    --database-name '<cosmos-database-name>' \
    --name '<cosmos-collection-name>' \
    --evenly-distribute 
```

---

## Step 4: Verify and monitor your RU/s consumption

After you've completed the redistribution, you can verify the change by viewing the  **PhysicalPartitionThroughput** metric in Azure Monitor. Split by the dimension **PhysicalPartitionId** to see how many RU/s you have per physical partition.

It's recommended to monitor your normalized ru consumption per partition. For more information, review [Step 1](#step-1-identify-which-physical-partitions-need-more-throughput) to validate you've achieved the performance you expect.

After the changes, assuming your overall workload hasn't changed, you'll likely see that both the target and source physical partitions have higher [Normalized RU consumption](../monitor-normalized-request-units.md) than previously. Higher normalized RU consumption is expected behavior. Essentially, you have allocated RU/s closer to what each partition actually needs to consume, so higher normalized RU consumption means that each partition is fully utilizing its allocated RU/s. You should also expect to see a lower overall rate of 429 exceptions, as the hot partitions now have more RU/s to serve requests.

## Limitations

### Preview eligibility criteria
To use the preview, your Azure Cosmos DB account must meet all the following criteria:
  - Your Azure Cosmos DB account is using API for MongoDB.
      - The version must be >= 3.6.
  - Your Azure Cosmos DB account is using provisioned throughput (manual or autoscale). Distribution of throughput across partitions doesn't apply to serverless accounts.

You don't need to sign up to use the preview. To use the feature, use the PowerShell or Azure CLI commands to redistribute throughput across your resources' physical partitions.

## Next steps

Learn about how to use provisioned throughput with the following articles:

* Learn more about [provisioned throughput.](../set-throughput.md)
* Learn more about [request units.](../request-units.md)
* Need to monitor for hot partitions? See [monitoring request units.](../monitor-normalized-request-units.md#how-to-monitor-for-hot-partitions)
* Want to learn the best practices? See [best practices for scaling provisioned throughput.](../scaling-provisioned-throughput-best-practices.md)
* Learn more about [Rate limiting errors](prevent-rate-limiting-errors.md)
