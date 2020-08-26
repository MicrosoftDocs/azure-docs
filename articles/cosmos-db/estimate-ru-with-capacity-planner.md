---
title: Estimate costs using the Azure Cosmos DB capacity planner
description: The Azure Cosmos DB capacity planner allows you to estimate the throughput (RU/s) required and cost for your workload. This article describes how to use the new version of the capacity planner to estimate the throughput and cost required. 
author: deborahc
ms.service: cosmos-db
ms.topic: how-to
ms.date: 07/30/2019
ms.author: dech

---

# Estimate RU/s using the Azure Cosmos DB capacity planner

Configuring your Azure Cosmos databases and containers with the right amount of provisioned throughput, or [Request Units (RU/s)](request-units.md), for your workload is essential to optimizing cost and performance. This article describes how to use the Azure Cosmos DB [capacity planner](https://cosmos.azure.com/capacitycalculator/) to get an estimate of the required RU/s and cost of your workload. 

## How to estimate throughput and cost with Azure Cosmos DB capacity planner

The capacity planner can be used in two modes.

|**Mode**  |**Description**  |
|---------|---------|
|Basic|Provides a quick, high-level RU/s and cost estimate. This mode assumes the default Azure Cosmos DB settings for indexing policy, consistency, and other parameters. <br/><br/>Use basic mode for a quick, high-level estimate when you are evaluating a potential workload to run on Azure Cosmos DB.|
|Advanced|Provides a more detailed RU/s and cost estimate, with the ability to tune additional settings — indexing policy, consistency level, and other parameters that affect the cost and throughput. <br/><br/>Use advanced mode when you are estimating RU/s for a new project or want a more detailed estimate. |


## Estimate provisioned throughput and cost using basic mode
To get a quick estimate for your workload using the basic mode, navigate to the [capacity planner](https://cosmos.azure.com/capacitycalculator/). Enter in the following parameters based on your workload: 

|**Input**  |**Description**  |
|---------|---------|
|Number of regions|Azure Cosmos DB is available in all Azure regions. Select the number of regions required for your workload. You can associate any number of regions with your Cosmos account. See [global distribution](distribute-data-globally.md) in Azure Cosmos DB for more details.|
|Multi-region writes|If you enable [multi-region writes](distribute-data-globally.md#key-benefits-of-global-distribution), your application can read and write to any Azure region. If you disable multi-region writes, your application can write data to a single region. <br/><br/> Enable multi-region writes if you expect to have an active-active workload that requires low latency writes in different regions. For example, an IOT workload that writes data to the database at high volumes in different regions. <br/><br/> Multi-region writes guarantees 99.999% read and write availability. Multi-region writes require more throughput when compared to the single write regions. To learn more, see [how RUs are different for single and multiple-write regions](optimize-cost-regions.md) article.|
|Total data stored (per region)|Total estimated data stored in GB in a single region.|
|Item size|The estimated size of the data item (e.g. document), ranging from 1 KB to 2 MB. |
|Reads/sec per region|Number of reads expected per second. |
|Writes/sec per region|Number of writes expected per second. |

After filling the required details, select **Calculate**. The **Cost Estimate** tab shows the total cost for storage and provisioned throughput. You can expand the **Show Details** link in this tab to get the breakdown of the throughput required for read and write requests. Each time you change the value of any field, select **Calculate** to re-calculate the estimated cost. 

:::image type="content" source="./media/estimate-ru-with-capacity-planner/basic-mode.png" alt-text="Capacity planner basic mode":::

## Estimate provisioned throughput and cost using advanced mode

Advanced mode allows you to provide more settings that impact the RU/s estimate. To use this option, navigate to the [capacity planner](https://cosmos.azure.com/capacitycalculator/) and sign in to the tool with an account you use for Azure. The sign-in option is available at the right-hand corner. 

After you sign in, you can see additional fields compared to the fields in basic mode. Enter the additional parameters based on your workload. 

|**Input**  |**Description**  |
|---------|---------|
|API|Azure Cosmos DB is a multi-model and multi-API service. For new workloads, select SQL (Core) API. |
|Number of regions|Azure Cosmos DB is available in all Azure regions. Select the number of regions required for your workload. You can associate any number of regions with your Cosmos account. See [global distribution](distribute-data-globally.md) in Azure Cosmos DB for more details.|
|Multi-region writes|If you enable [multi-region writes](distribute-data-globally.md#key-benefits-of-global-distribution), your application can read and write to any Azure region. If you disable multi-region writes, your application can write data to a single region. <br/><br/> Enable multi-region writes if you expect to have an active-active workload that requires low latency writes in different regions. For example, an IOT workload that writes data to the database at high volumes in different regions. <br/><br/> Multi-region writes guarantees 99.999% read and write availability. Multi-region writes require more throughput when compared to the single write regions. To learn more, see [how RUs are different for single and multiple-write regions](optimize-cost-regions.md) article.|
|Default consistency|Azure Cosmos DB supports 5 consistency levels, to allow developers to balance the tradeoff between consistency, availability, and latency tradeoffs. To learn more, see the [consistency levels](consistency-levels.md) article. <br/><br/> By default, Azure Cosmos DB uses session consistency, which guarantees the ability to read your own writes in a session. <br/><br/> Choosing strong or bounded staleness will require double the required RU/s for reads, when compared to session, consistent prefix, and eventual consistency. Strong consistency with multi-region writes is not supported and will automatically default to single-region writes with strong consistency. |
|Indexing policy|By default, Azure Cosmos DB [indexes all properties](index-policy.md) in all items for flexible and efficient queries (maps to the **Automatic** indexing policy). <br/><br/> If you choose **off**, none of the properties are indexed. This results in the lowest RU charge for writes. Select **off** policy if you expect to only do [point reads](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmos.container.readitemasync?view=azure-dotnet) (key value lookups) and/or writes, and no queries. <br/><br/> Custom indexing policy allows you to include or exclude specific properties from the index for lower write throughput and storage. To learn more, see [indexing policy](index-overview.md) and [sample indexing policies](how-to-manage-indexing-policy.md#indexing-policy-examples) articles.|
|Total data stored (per region)|Total estimated data stored in GB in a single region.|
|Workload mode|Select **Steady** if your workload volume is constant. <br/><br/> Select **Variable** if your workload volume changes over time.  For example, during a specific day or a month. <br/><br/> The following settings are available if you choose the variable workload option:<ul><li>Percentage of time at peak: Percentage of time in a month where your workload requires peak (highest) throughput. <br/><br/> For example, if you have a workload that has high activity during 9am – 6pm weekday business hours, then the percentage of time at peak is: 45 hours at peak / 730 hours / month = ~6%.<br/><br/></li><li>Reads/sec per region at peak - Number of reads expected per second at peak.</li><li>Writes/sec per region at peak – Number of writes expected per second at peak.</li><li>Reads/sec per region off peak – Number of reads expected per second during off peak.</li><li>Writes/sec per region off peak – Number of writes expected per second during off peak.</li></ul>With peak and off-peak intervals, you can optimize your cost by [programmatically scaling your provisioned throughput](set-throughput.md#update-throughput-on-a-database-or-a-container) up and down accordingly.|
|Item size|The size of the data item (e.g. document), ranging from 1 KB to 2 MB. <br/><br/>You can also **Upload sample (JSON)** document for a more accurate estimate.<br/><br/>If your workload has multiple types of items (with different JSON content) in the same container, you can upload multiple JSON documents and get the estimate. Use the **Add new item** button to add multiple sample JSON documents.|

You can also use the **Save Estimate** button to download a CSV file containing the current estimate. 

:::image type="content" source="./media/estimate-ru-with-capacity-planner/advanced-mode.png" alt-text="Capacity planner advanced mode":::

The prices shown in the Azure Cosmos DB capacity planner are estimates based on the public pricing rates for throughput and storage. All prices are shown in US dollars. Refer to the [Azure Cosmos DB pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) to see all rates by region.  

## Estimating throughput for queries

The Azure Cosmos capacity calculator assumes point reads (a read of a single item, e.g. document, by ID and partition key value) and writes for the workload. To estimate the throughput needed for queries, run your query on a representative data set in a Cosmos container and [obtain the RU charge](find-request-unit-charge.md). Multiply the RU charge by the number of queries that you anticipate to run per second to get the total RU/s required. 

For example, if your workload requires a query, ``SELECT * FROM c WHERE c.id = 'Alice'`` that is run 100 times per second, and the RU charge of the query is 10 RUs, you will need 100 query / sec * 10 RU / query = 1000 RU/s in total to serve these requests. Add these RU/s to the RU/s required for any reads or writes happening in your workload.

## Next steps

* Learn more about [Azure Cosmos DB's pricing model](how-pricing-works.md).
* Create a new [Cosmos account, database, and container](create-cosmosdb-resources-portal.md).
* Learn how to [optimize provisioned throughput cost](optimize-cost-throughput.md).
* Learn how to [optimize cost with reserved capacity](cosmos-db-reserved-capacity.md).

