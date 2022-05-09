---
title: Redistribute throughput across partitions (preview) in Azure Cosmos DB
description: Learn how to redistribute throughput across partitions (preview)
author: deborahc
ms.author: dech
ms.service: cosmos-db
ms.topic: how-to
ms.date: 05/24/2022
---

# Redistribute throughput across partitions (preview)
[!INCLUDE [appliesto-sql-api](../../../../Documents/cosmos/Azure-docs-pr/articles/cosmos-db/includes/appliesto-sql-api.md)]
[!INCLUDE [appliesto-mongodb-api](includes/appliesto-mongodb-api.md)]

By default, Azure Cosmos DB distributes the provisioned throughput of a database or container equally across all physical partitions. However, scenarios may arise where due to a skew in the workload or choice of partition key, certain logical (and thus physical) partitions need more throughput than others. For these scenarios, Azure Cosmos DB gives you the ability to redistribute your provisioned throughput across physical partitions. This helps you achieve better performance without having to provision your overall throughput based on the hottest partition. 

This feature applies to databases and containers using provisioned throughput (manual and autoscale) and doesn't apply to serverless containers. You can change the throughput per physical partition using the Azure Cosmos DB PowerShell or CLI commands.

## When to use this feature
In general, usage of this feature is recommended for scenarios when both the following are true:

- You're consistently seeing greater than 1-5% overall rate of 429s
- You've a consistent, predictable hot partition

If you aren't seeing 429s and your end to end latency is acceptable, then no action to reconfigure RU/s per partition is required. Similarly, if you have a workload that has consistent traffic with occasional unpredictable spikes across *all your partitions*, it's recommended to use [autoscale](provision-throughput-autoscale.md) and [burst capacity (preview)](burst-capacity.md). This will ensure you can meet your throughput requirements. 

## Example scenario
Suppose we have a workload that keeps track of transactions that take place in retail stores. Because most of our queries are by `StoreId`, we partition by `StoreId`. However, over time, we see that some stores have more activity than others and require more throughput to serve their workloads. We're seeing rate limiting (429) for requests against those StoreIds, and our [overall rate of 429s is greater than 1-5%](sql/troubleshoot-request-rate-too-large.md#recommended-solution). Meanwhile, other stores are less active and require less throughput. Let's see how we can redistribute our throughput for better performance.

## Step 1: Identify which physical partitions need more throughput
There are two ways to identify if there's a hot partition.

### Option 1: Use Azure Monitor metrics

To verify if there's a hot partition, navigate to **Insights** > **Throughput** > **Normalized RU Consumption (%) By PartitionKeyRangeID**. Filter to a specific database and container.

Each PartitionKeyRangeId maps to one physical partition. If there's one PartitionKeyRangeId that consistently has a significantly higher normalized RU consumption than others (for example, one is consistently at 100%, but others are at 30% or less), this can be a sign of a hot partition.

:::image type="content" source="sql/media/troubleshoot-request-rate-too-large/split-norm-utilization-by-pkrange-hot-partition.png" alt-text="Normalized RU Consumption by PartitionKeyRangeId chart with a hot partition.":::

### Option 2: Use Diagnostic Logs
We can use the information from **CDBPartitionKeyRUConsumption** in Diagnostic Logs to get more information about the logical partition keys (and corresponding physical partitions) that are consuming the most RU/s at a second level granularity. Note the sample queries use 24 hours for illustrative purposes only - it's recommended to use at least seven days of history to understand the pattern.

#### Find the physical partition (PartitionKeyRangeId) that is consuming the most RU/s over time
```Kusto
    CDBPartitionKeyRUConsumption 
    | where TimeGenerated >= ago(24hr)
    | where DatabaseName == "MyDB" and CollectionName == "MyCollection" // Replace with database and collection name
    | where isnotempty(PartitionKey) and isnotempty(PartitionKeyRangeId)
    | summarize sum(RequestCharge) by bin(TimeGenerated, 1s), PartitionKeyRangeId
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
First, let's determine the current RU/s for each physical partition. You can use the new Azure Monitor metric **PhysicalPartitionThroughput** and split by the dimension **PhysicalPartitionId** to see how many RU/s you have per physical partition.

Alternatively, if you haven't changed your throughput per partition before, you can use the formula:
``Current RU/s per partition = Total RU/s / Number of physical partitions``

Follow the guidance in the article [Best practices for scaling provisioned throughput (RU/s)](scaling-provisioned-throughput-best-practices.md#step-1-find-the-current-number-of-physical-partitions) to determine the number of physical partitions.
### Determine RU/s for target partition
Next, let's decide how many RU/s we want to give to our hottest physical partition(s). Let's call this set our target partition(s). The most RU/s any physical partition can have is 10,000 RU/s.

The right approach depends on your workload requirements. General approaches include:
- Increasing the RU/s by a percentage, measure the rate of 429s, and repeat until desired throughput is achieved. 
    - If you aren't sure the right percentage, you can start with 10% to be conservative.
    - If you already know this physical partition requires most of the throughput of the workload, you can start by doubling the RU/s or increasing it to the maximum of 10,000 RU/s, whichever is lower.
- Increasing the RU/s to `Total consumed RU/s of the physical partition + (Number of 429s per second * Average RU charge per request to the partition)` 
    - This approach tries to estimate what the "real" RU/s consumption would have been if the requests hadn't been rate limited. 

### Determine RU/s for source partition
Finally, let's decide how many RU/s we want to keep on our other physical partitions. These will be the partitions that the target physical partition "takes" from.

In the PowerShell and Azure CLI APIs, we must specify at least one source partition to redistribute RU/s from. Optionally, we can specify a custom minimum throughput each physical partition should have after the redistribution. If not specified, by default, Azure Cosmos DB will ensure that each physical partition has at least 100 RU/s after the redistribution.

The right approach depends on your workload requirements. General approaches include:
- Taking RU/s equally from all source partitions (works best when there are <=  10 partitions)
    - Calculate the amount we need to offset each source physical partition by. `Offset = Total desired RU/s of target partition(s) - total current RU/s of target partition(s)) / (Total physical partitions - number of target partitions)`
    - Assign the minimum throughput for each source partition = `Current RU/s of source partition - offset`
- Taking RU/s from the least active partition(s)
    - Use Azure Monitor metrics and Diagnostic Logs to determine which physical partition(s) have the least traffic/request volume
    - Calculate the amount we need to offset each source physical partition by. `Offset = Total desired RU/s of target partition(s) - total current RU/s of target partition) / Number of source physical partitions`
    - Assign the minimum throughput for each source partition = `Current RU/s of source partition - offset`

## Step 3: Programatically change the throughput across partitions

You can use the command `AzCosmosDBSqlContainerPerPartitionThroughput` to redistribute throughput. 

To understand the below example, let's take an example where we have a container that has 6000 RU/s total (either 6000 manual RU/s or autoscale 6000 RU/s) and 3 physical partitions. Based on our analysis, we want a layout where:
- Physical partition 0: 1000 RU/s
- Physical partition 1: 4000 RU/s
- Physical partition 2: 1000 RU/s

We specify partitions 0 and 2 as our source partitions, and specify that after the redistribution, they should have a minimum RU/s of 1000 RU/s. Partition 1 is out target partition, which we specify should have 4000 RU/s.

```powershell
$SourcePhysicalPartitionObjects =  @()
$SourcePhysicalPartitionObjects += New-AzCosmosDBSqlPhysicalPartitionThroughputObject -Id 0 -Throughput 1000
$SourcePhysicalPartitionObjects += New-AzCosmosDBSqlPhysicalPartitionThroughputObject -Id 2 -Throughput 1000

$TargetPhysicalPartitionObjects =  @()
$TargetPhysicalPartitionObjects += New-AzCosmosDBSqlPhysicalPartitionThroughputObject -Id 1 -Throughput 4000

Update-AzCosmosDBSqlContainerPerPartitionThroughput -ResourceGroupName cosmos-resource-group -AccountName cosmos-account-demo -DatabaseName DemoDatabaseName -ContainerName DemoContainerName -SourcePhysicalPartitionThroughputObject $SourcePhysicalPartitionObjects -TargetPhysicalPartitionThroughputObject $TargetPhysicalPartitionObjects
```

After you've completed the redistribution, you can verify the change by viewing the  **PhysicalPartitionThroughput** metric in Azure Monitor. Split by the dimension **PhysicalPartitionId** to see how many RU/s you have per physical partition.

## Step 4: Verify and monitor your RU/s consumption
After you've completed the redistribution, you can verify the change by viewing the  **PhysicalPartitionThroughput** metric in Azure Monitor. Split by the dimension **PhysicalPartitionId** to see how many RU/s you have per physical partition.

It's recommended to monitor your overall rate of 429s and RU/s consumption as described in [Step 1](#step-1-identify-which-physical-partitions-need-more-throughput) to validate you've achieved the performance you expect. 

After the changes, assuming your overall workload hasn't changed, you'll likely see that both the target and source physical partitions have higher [Normalized RU consumption](monitor-normalized-request-units.md) than previously. This is expected behavior. Essentially, you have allocated RU/s closer to what each partition actually needs to consume, so higher normalized RU consumption means that each partition is fully utilizing its allocated RU/s. You should also expect to see a lower overall rate of 429 exceptions, as the hot partitions now have more RU/s to serve requests.

## How to enroll in the preview
To enroll in the preview, file a support ticket in the [Azure portal](https://portal.azure.com/) under the path TBD.

## Frequently asked questions

### What resources can I use this feature on?
The feature is only supported for SQL and API for MongoDB accounts and on collections with dedicated throughput (either manual or autoscale). Shared throughput databases aren't supported in the preview.

### Which version of the Azure Cosmos DB PowerShell and CLI support this feature?
The ability to redistribute RU/s across physical partitions is only supported in the latest preview version of the Azure Cosmos DB PowerShell and CLI.

### What is the maximum number of physical partitions I can change in one request?
- The maximum number of source and physical partitions that can be included in a single request is 20 each.
- You must provide at least one source and one target physical partition in each request. The source partition(s) must have enough RU/s to redistribute to the target partition(s).
- The desired RU/s for each target physical partition can't exceed 10,000 RU/s or the total RU/s of the overall resource. If your desired RU/s is greater than the RU/s of the overall resource, increase your overall RU/s first before redistributing the RU/s.

### Is there a limit on how frequently I can make a call to redistribute throughput across partitions?
You can make a maximum of 5 requests per minute to redistribute throughput across partitions. 

### What happens to my RU/s distribution when I change the overall RU/s?
- If you lower your RU/s, each physical partition gets the equivalent fraction of the new RU/s (`current throughput fraction * new RU/s`). For example, suppose you have a collection with 6000 RU/s and 3 physical partitions. You scale it down to 3000 RU/s.


    |Before scale-down (6000 RU/s)  |After scale down (3000 RU/s)  |Fraction of total RU/s  |
    |---------|---------|---------|
    |P0: 1000 RU/s     | P0: 500 RU/s        |  1/6       |
    |P1: 4000 RU/s      |  P1: 1000 RU/s       |   2/3      |
    |P2: 1000 RU/s      |  P2: 500 RU/s       |       1/6  |

- If you increase your RU/s without triggering a split - that is, you scale to a total RU/s <= current partition count * 10,000 RU/s - each physical partition will have RU/s >= `MIN(current throughput fraction * new RU/s, 10,000 RU/s)`

For example, suppose you have a collection with 6000 RU/s and 3 physical partitions. You scale it up to 12,000 RU/s:

    |Before scale-up (6000 RU/s)  |After scale up (12,000 RU/s)  |Fraction of total RU/s  |
    |---------|---------|---------|
    |P0: 1000 RU/s     | P0: 2000 RU/s        |  1/6       |
    |P1: 4000 RU/s      |  P1: 8000 RU/s       |   2/3      |
    |P2: 1000 RU/s      |  P2: 2000 RU/s       |       1/6  |

    If you scaled it up to 30,000 RU/s:

    |Before scale-up (6000 RU/s)  |After scale up (30,000 RU/s)  |Fraction of total RU/s  |
    |---------|---------|---------|
    |P0: 1000 RU/s     | P0: 10,000 RU/s        |  1/6 - ignored because each partition can get 10,000 RU/s       |
    |P1: 4000 RU/s      |  P1: 10,000 RU/s       |   2/3 - ignored because each partition can get 10,000 RU/s     |
    |P2: 1000 RU/s      |  P2: 10,000 RU/s       |       1/6 - ignored because each partition can get 10,000 RU/s  |

- If you increase your RU/s [beyond what the current partition layout can serve (that is, you trigger a split)](scaling-provisioned-throughput-best-practices.md), by design, all physical partitions will default to having the same number of RU/s. After partitions split, the logical partitions that contributed to a hot partition may be on a different physical partition. If necessary, you can redistribute your RU/s on the new layout.

## Limitations
### SDK requirements
In the preview, in order to take advantage of the throughput redistribution across partitions feature, your application **must use the latest version of the .NET V3 SDK (version 3.27.0 or later).** When the feature is enabled on your account, only requests sent from this SDK version will be accepted. Other requests will fail. As a result, you should ensure that before enrolling in the preview, your application has been updated to use the right SDK version. If you're using the legacy .NET V2 SDK, follow the guide to [migrate your application to use the Azure Cosmos DB .NET SDK v3](sql/migrate-dotnet-v3.md). Support for other SDKs is planned for the future.

### Unsupported connectors
- Azure Data Factory
- Azure Stream Analytics
- Logic Apps
- Azure Functions
- Azure Search

If you enroll in the preview, requests from the connectors will fail. Support for these connectors is planned for the future.

## Next steps

Learn about how to use provisioned throughput with the following articles:

- [Introduction to provisioned throughput in Azure Cosmos DB](set-throughput.md)
- [How to monitor for hot partitions](monitor-normalized-request-units.md#how-to-monitor-for-hot-partitions)
- [Best practices for scaling provisioned throughput (RU/s)](scaling-provisioned-throughput-best-practices.md)

