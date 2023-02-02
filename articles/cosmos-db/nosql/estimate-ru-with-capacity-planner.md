---
title: Estimate costs using the Azure Cosmos DB capacity planner - API for NoSQL
description: The Azure Cosmos DB capacity planner allows you to estimate the throughput (RU/s) required and cost for your workload. This article describes how to use the capacity planner to estimate the throughput and cost required when using API for NoSQL. 
author: deborahc
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 08/26/2021
ms.author: dech

---

# Estimate RU/s using the Azure Cosmos DB capacity planner - API for NoSQL
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

> [!NOTE]
> If you are planning a data migration to Azure Cosmos DB and all that you know is the number of vcores and servers in your existing sharded and replicated database cluster, please also read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
>

Configuring your Azure Cosmos DB databases and containers with the right amount of provisioned throughput, or [Request Units (RU/s)](../request-units.md), for your workload is essential to optimizing cost and performance. This article describes how to use the Azure Cosmos DB [capacity planner](https://cosmos.azure.com/capacitycalculator/) to get an estimate of the required RU/s and cost of your workload when using the API for NoSQL. If you are using API for MongoDB, see how to [use capacity calculator with MongoDB](../mongodb/estimate-ru-capacity-planner.md) article.

[!INCLUDE [capacity planner modes](../includes/capacity-planner-modes.md)]

## <a id="basic-mode"></a>Estimate provisioned throughput and cost using basic mode
To get a quick estimate for your workload using the basic mode, navigate to the [capacity planner](https://cosmos.azure.com/capacitycalculator/). Enter in the following parameters based on your workload:

|**Input**  |**Description**  |
|---------|---------|
| API |Choose API for NoSQL |
|Number of regions|Azure Cosmos DB is available in all Azure regions. Select the number of regions required for your workload. You can associate any number of regions with your Azure Cosmos DB account. See [global distribution](../distribute-data-globally.md) in Azure Cosmos DB for more details.|
|Multi-region writes|If you enable [multi-region writes](../distribute-data-globally.md#key-benefits-of-global-distribution), your application can read and write to any Azure region. If you disable multi-region writes, your application can write data to a single region. <br/><br/> Enable multi-region writes if you expect to have an active-active workload that requires low latency writes in different regions. For example, an IOT workload that writes data to the database at high volumes in different regions. <br/><br/> Multi-region writes guarantees 99.999% read and write availability. Multi-region writes require more throughput when compared to the single write regions. To learn more, see [how RUs are different for single and multiple-write regions](../optimize-cost-regions.md) article.|
|Total data stored in transactional store |Total estimated data stored(GB) in the transactional store in a single region.|
|Use analytical store| Choose **On** if you want to use analytical store. Enter the **Total data stored in analytical store**, it represents the estimated data stored (GB) in the analytical store in a single region.  |
|Item size|The estimated size of the data item (for example, document), ranging from 1 KB to 2 MB. |
|Queries/sec |Number of queries expected per second per region. The average RU charge to run a query is estimated at 10 RUs. |
|Point reads/sec |Number of point read operations expected per second per region. Point reads are the key/value lookup on a single item ID and a partition key. To learn more about point reads, see the [options to read data](../optimize-cost-reads-writes.md#reading-data-point-reads-and-queries) article. |
|Creates/sec |Number of create operations expected per second per region. |
|Updates/sec |Number of update operations expected per second per region. When you choose automatic indexing, the estimated RU/s for the update operation is calculated as one property being changed per an update. |
|Deletes/sec |Number of delete operations expected per second per region. |

After filling the required details, select **Calculate**. The **Cost Estimate** tab shows the total cost for storage and provisioned throughput. You can expand the **Show Details** link in this tab to get the breakdown of the throughput required for different CRUD and query requests. Each time you change the value of any field, select **Calculate** to recalculate the estimated cost.

:::image type="content" source="../media/estimate-ru-with-capacity-planner/basic-mode-sql-api.png" alt-text="Capacity planner basic mode" border="true":::

## <a id="advanced-mode"></a>Estimate provisioned throughput and cost using advanced mode

Advanced mode allows you to provide more settings that impact the RU/s estimate. To use this option, navigate to the [capacity planner](https://cosmos.azure.com/capacitycalculator/) and **sign in** to the tool with an account you use for Azure. The sign-in option is available at the right-hand corner.

After you sign in, you can see more fields compared to the fields in basic mode. Enter the other parameters based on your workload.

|**Input**  |**Description**  |
|---------|---------|
|API|Azure Cosmos DB is a multi-model and multi-API service. Choose API for NoSQL. |
|Number of regions|Azure Cosmos DB is available in all Azure regions. Select the number of regions required for your workload. You can associate any number of regions with your Azure Cosmos DB account. See [global distribution](../distribute-data-globally.md) in Azure Cosmos DB for more details.|
|Multi-region writes|If you enable [multi-region writes](../distribute-data-globally.md#key-benefits-of-global-distribution), your application can read and write to any Azure region. If you disable multi-region writes, your application can write data to a single region. <br/><br/> Enable multi-region writes if you expect to have an active-active workload that requires low latency writes in different regions. For example, an IOT workload that writes data to the database at high volumes in different regions. <br/><br/> Multi-region writes guarantees 99.999% read and write availability. Multi-region writes require more throughput when compared to the single write regions. To learn more, see [how RUs are different for single and multiple-write regions](../optimize-cost-regions.md) article.|
|Default consistency|Azure Cosmos DB supports 5 consistency levels, to allow developers to balance the tradeoff between consistency, availability, and latency tradeoffs. To learn more, see the [consistency levels](../consistency-levels.md) article. <br/><br/> By default, Azure Cosmos DB uses session consistency, which guarantees the ability to read your own writes in a session. <br/><br/> Choosing strong or bounded staleness will require double the required RU/s for reads, when compared to session, consistent prefix, and eventual consistency. Strong consistency with multi-region writes is not supported and will automatically default to single-region writes with strong consistency. |
|Indexing policy|By default, Azure Cosmos DB [indexes all properties](../index-policy.md) in all items for flexible and efficient queries (maps to the **Automatic** indexing policy). <br/><br/> If you choose **off**, none of the properties are indexed. This results in the lowest RU charge for writes. Select **off** policy if you expect to only do [point reads](/dotnet/api/microsoft.azure.cosmos.container.readitemasync) (key value lookups) and/or writes, and no queries. <br/><br/> If you choose **Automatic**, Azure Cosmos DB automatically indexes all the items as they are written. <br/><br/> **Custom** indexing policy allows you to include or exclude specific properties from the index for lower write throughput and storage. To learn more, see [indexing policy](../index-overview.md) and [sample indexing policies](how-to-manage-indexing-policy.md#indexing-policy-examples) articles.|
|Total data stored in transactional store |Total estimated data stored(GB) in the transactional store in a single region.|
|Use analytical store| Choose **On** if you want to use analytical store. Enter the **Total data stored in analytical store**, it represents the estimated data stored(GB) in the analytical store in a single region.  |
|Workload mode|Select **Steady** option if your workload volume is constant. <br/><br/> Select **Variable** option if your workload volume changes over time.  For example, during a specific day or a month. The following setting is available if you choose the variable workload option:<ul><li>Percentage of time at peak: Percentage of time in a month where your workload requires peak (highest) throughput. </li></ul> <br/><br/> For example, if you have a workload that has high activity during 9am – 6pm weekday business hours, then the percentage of time at peak is: `(9 hours per weekday at peak * 5 days per week at peak) / (24 hours per day at peak * 7 days in a week) = 45 / 168 = ~27%`.<br/><br/>With peak and off-peak intervals, you can optimize your cost by [programmatically scaling your provisioned throughput](../set-throughput.md#update-throughput-on-a-database-or-a-container) up and down accordingly.|
|Item size|The size of the data item (for example, document), ranging from 1 KB to 2 MB. You can add estimates for multiple sample items. <br/><br/>You can also **Upload sample (JSON)** document for a more accurate estimate.<br/><br/>If your workload has multiple types of items (with different JSON content) in the same container, you can upload multiple JSON documents and get the estimate. Use the **Add new item** button to add multiple sample JSON documents.|
| Number of properties | The average number of properties per an item. |
|Point reads/sec |Number of point read operations expected per second per region. Point reads are the key/value lookup on a single item ID and a partition key. Point read operations are different from query read operations. To learn more about point reads, see the [options to read data](../optimize-cost-reads-writes.md#reading-data-point-reads-and-queries) article. If your workload mode is **Variable**, you can provide the expected number of point read operations at peak and off peak. |
|Creates/sec |Number of create operations expected per second per region. |
|Updates/sec |Number of update operations expected per second per region. |
|Deletes/sec |Number of delete operations expected per second per region. |
|Queries/sec |Number of queries expected per second per region. For an accurate estimate, either use the average cost of queries or enter the RU/s your queries use from query stats in Azure portal. |
| Average RU/s charge per query | By default, the average cost of queries/sec per region is estimated at 10 RU/s. You can increase or decrease it based on the RU/s charges based on your estimated query charge.|

You can also use the **Save Estimate** button to download a CSV file containing the current estimate.

:::image type="content" source="../media/estimate-ru-with-capacity-planner/advanced-mode-sql-api.png" alt-text="Capacity planner advanced mode" border="true":::

The prices shown in the Azure Cosmos DB capacity planner are estimates based on the public pricing rates for throughput and storage. All prices are shown in US dollars. Refer to the [Azure Cosmos DB pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) to see all rates by region.  

## Next steps

* If all you know is the number of vcores and servers in your existing sharded and replicated database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* Learn more about [Azure Cosmos DB's pricing model](../how-pricing-works.md).
* Create a new [Azure Cosmos DB account, database, and container](quickstart-portal.md).
* Learn how to [optimize provisioned throughput cost](../optimize-cost-throughput.md).
* Learn how to [optimize cost with reserved capacity](../reserved-capacity.md).

