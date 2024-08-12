---
title: Estimate the cost of archiving data (Azure Blob Storage)
titleSuffix: Azure Storage
description: Learn how to calculate the cost of storing and maintaining data in the archive storage tier.
author: normesta

ms.author: normesta
ms.date: 07/31/2024
ms.service: azure-blob-storage
ms.topic: conceptual
---

# Estimate the cost of archiving data

The archive tier is an offline tier for storing data that is rarely accessed. The archive access tier has the lowest storage cost. However, this tier has higher data retrieval costs with a higher latency as compared to the hot, cool, and cold tiers. 

This article explains how to calculate the cost of using archive storage and then presents a few example scenarios. 

## Calculate costs

The cost to archive data is derived from these three components:

- Cost to write data to the archive tier
- Cost to store data in the archive tier
- Cost to rehydrate data from the archive tier

The following sections show you how to calculate each component.

This article uses fictitious prices in all calculations. You can find these sample prices in the [Sample prices](#sample-prices) section at the end of this article. These prices are meant only as examples, and shouldn't be used to calculate your costs.

For official prices, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) or [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/). For more information about how to choose the correct pricing page, see [Understand the full billing model for Azure Blob Storage](../common/storage-plan-manage-costs.md).

#### The cost to write

You can calculate the cost of writing to the archive tier by multiplying the <u>number of write operations</u> by the <u>price of each operation</u>. The price of an operation depends on which ones you use to write data to the archive tier.

###### Put Blob

If you use the [Put Blob](/rest/api/storageservices/put-blob) operation, then the number of operations is the same as the number of blobs. For example, if you plan to write 30,000 blobs to the archive tier, then that requires 30,000 operations. Each operation is charged the price of an **archive** write operation. 

> [!TIP]
> Operations are billed per 10,000. Therefore, if the price per 10,000 operations is $0.10, then the price of a single operation is $0.10 / 10,000 = $0.00001. 

###### Put Block and Put Block List

If you upload a blob by using the [Put Block](/rest/api/storageservices/put-block) and [Put Block List](/rest/api/storageservices/put-block-list) operations, then an upload requires multiple operations, and each of those operations are charged separately. Each [Put Block](/rest/api/storageservices/put-block) operation is charged at the price of a write operation for the accounts default access tier. The number of [Put Block](/rest/api/storageservices/put-block) operations that you need depends on the block size that you specify to upload the data. For example, if the blob size is 100 MiB and you choose block size to 10 MiB when you upload that blob, you would use 10 [Put Block](/rest/api/storageservices/put-block) operations. Blocks are written (committed) to the archive tier by using the [Put Block List](/rest/api/storageservices/put-block-list) operation. That operation is charged the price of an **archive** write operation. Therefore, to upload a single blob, your cost is (<u>number of blocks</u> * <u>price of a hot write operation) + price of an archive write operation</u>.

> [!NOTE]
> If you're not using an SDK or the REST API directly, you might have to investigate which operations your data transfer tool is using to upload files. You might be able to determine this by reaching out the tool provider or by using storage logs. 

###### Set Blob Tier

If you use the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation to move a blob from the cool, cold, or hot tier to the archive tier, you're charged the price of an **archive** write operation. 

#### The cost to store

You can calculate the storage costs by multiplying the <u>size of the data</u> in GB by the <u>price of archive storage</u>.

For example (assuming the sample pricing), if you plan to store 10 TB to the archive tier, the capacity cost is $0.002 * 10 * 1024 = $20.48 per month. 

#### The cost to rehydrate

Blobs in the archive tier are offline and can't be read or modified. To read or modify data in an archived blob, you must first rehydrate the blob to an online tier (either the hot cool, or cold tier). 

You can calculate the cost to rehydrate data by adding the <u>cost to retrieve data</u> to the <u>cost of reading the data</u>.

Assuming sample pricing, the cost of retrieving 1 GB of data from the archive tier would be 1 * $0.022 = $0.022. 

Read operations are billed per 10,000. Therefore, if the cost per 10,000 operations is $5.50, then the cost of a single operation is $5.50 / 10,000 = $0.00055. The cost of reading 1000 blobs at standard priority is 1000 * $0.0005 = $0.50.

In this example, the total cost to rehydrate (retrieving + reading) would be $0.022 + $0.50 = $0.52.

> [!NOTE]
> If you set the rehydration priority to high, then the data retrieval and read rates increase.

If you plan to rehydrate data, you should try to avoid an early deletion fee. To review your options, see [Blob rehydration from the archive tier](archive-rehydrate-overview.md).

## Scenario: One-time data backup

This scenario assumes that you plan to remove on-premises tapes or file servers by migrating backup data to cloud storage. If you don't expect users to access that data often, then it might make sense to migrate that data directly to the archive tier. In the first month, you'd assume the cost of writing data to the archive tier. In the remaining months, you'd pay only for the cost to store the data and the cost to rehydrate data as needed for the occasional read operation.

Using the [Sample prices](#sample-prices) that appear in this article, the following table demonstrates three months of spending. 

This scenario assumes an initial ingest of 2,000,000 files totaling 102,400 GB in size to archive. It also assumes one-time read each month of about 1% of archived capacity. The operation used this scenario is the [Put Blob](/rest/api/storageservices/put-blob) operation. This scenario also assumes that blobs are rehydrated by [copying blobs](./archive-rehydrate-overview.md#copy-an-archived-blob-to-an-online-tier) instead of [changing the blob's access tier](./archive-rehydrate-overview.md#change-a-blobs-access-tier-to-an-online-tier).

| Cost factor                                                     | January     | February    | March       | Projected annual |
|-----------------------------------------------------------------|-------------|-------------|-------------|------------------|
| Write operations                                                | 2,000,000   | 0           | 0           | 2,000,000        |
| Price of a single write operation                               | $0.000011   | $0.000011   | $0.000011   | $0.000011        |
| **Cost to write (operations * price of a write operation)**     | **$22.00**  | **$0.00**   | **$0.00**   | **$22.00**       |
| Total file size (GB)                                            | 102,400     | 102,400     | 102,400     | 1,228,800        |
| Data prices (pay-as-you-go)                                     | $0.002      | $0.002      | $0.002      | $0.002           |
| **Cost to store (file size * data price)**                      | **$204.80** | **$204.80** | **$204.80** | **$2,457.60**    |
| Data retrieval size (1% of file size)                           | 1,024       | 1,024       | 1,024       | 12,288           |
| Price of data retrieval                                         | $0.022      | $0.022      | $0.022      | $0.022           |
| **Cost to retrieve (data retrieval size * price of retrieval)** | **$22.53**  | **$22.53**  | **$22.53**  | **$270.34**      |
| Number of read operations (File count * 1%)                     | 20,000      | 20,000      | 20,000      | 240,000          |
| Price of a single read operation                                | $0.00055    | $0.0005 5   | $0.00055    | $0.00055         |
| **Cost to read (operations * price of a read operation)**       | **$11.00**  | **$11.00**  | **$11.00**  | **$132.00**      |
| **Cost to rehydrate (cost to retrieve + cost to read)**         | **$33.53**  | **$33.53**  | **$33.53**  | **$402.34**      |
| **Total cost (write + storage + rehydrate)**                    | **$260.33** | **$238.33** | **$238.33** | **$2,881.94**    |

> [!TIP]
> To model costs over 12 months, open the **One-Time Backup** tab of this [workbook](https://azure.github.io/Storage/docs/backup-and-archive/azure-archive-storage-cost-estimation/azure-archive-storage-cost-estimation.xlsx). You can update the prices and values in that worksheet to estimate your costs.  

## Scenario: Continuous tiering

This scenario assumes that you plan to periodically move data to the archive tier. Perhaps you're using [Blob Storage inventory reports](blob-inventory.md) to gauge which blobs are accessed less frequently, and then using [lifecycle management policies](lifecycle-management-overview.md) to automate the archival process.

Each month, you'd assume the cost of writing to the archive tier. The cost to store and then rehydrate data would increase over time as you archive more blobs. 

Using the [Sample prices](#sample-prices) that appear in this article, the following table demonstrates three months of spending. 

This scenario assumes a monthly ingest of 200,000 files totaling 10,240 GB in size to archive. It also assumes a one-time read each month of about 1% of archived capacity. The operation used this scenario is the [Put Blob](/rest/api/storageservices/put-blob) operation. 

| Cost factor                                                     | January    | February   | March      | Projected annual |
|-----------------------------------------------------------------|------------|------------|------------|------------------|
| Write operations                                                | 200,000    | 200,000    | 200,000    | 2,400,000        |
| Price of a single write operation                               | $0.000011  | $0.000011  | $0.000011  |                  |
| **Cost to write (operations * price of a write operation)**     | **$2.20**  | **$2.20**  | **$2.20**  | **$26.40**       |
| Number of files                                                 | 200,000    | 400,000    | 600,000    | 2,400,000        |
| Total file size (GB)                                            | 10,240     | 20,480     | 39,720     | 122,880          |
| Data prices (pay-as-you-go)                                     | $0.002     | $0.002     | $0.002     |                  |
| **Cost to store (file size * data price)**                      | **$10.14** | **$20.28** | **$30.41** | **$1,597.44**    |
| Data retrieval size (1% of file size)                           | 102        | 205        | 307        | 7,987            |
| Price of data retrieval                                         | $0.022     | $0.022     | $0.022     |                  |
| **Cost to retrieve (data retrieval size * price of retrieval)** | **$2.25**  | **$4.51**  | **$6.76**  | **$175.72**      |
| Number of read operations (File count * 1% storage read)        | 2,000      | 4,000      | 6,000      | 156,000          |
| Price of a single read operation                                | $0.00055   | $0.00055   | $0.00055   |                  |
| **Cost to read (operations * price to read)**                   | **$1.10**  | **$2.20**  | **$3.30**  | **$85.80**       |
| **Cost to rehydrate (cost to retrieve + cost to read)**         | **$3.35**  | **$6.71**  | **$10.06** | **$261.52**      |
| **Total cost**                                                  | **$26.03** | **$49.87** | **$73.70** | **$1,885.36**    |

> [!TIP]
> To model costs over 12 months, open the **Continuous Tiering** tab of this [workbook](https://azure.github.io/Storage/docs/backup-and-archive/azure-archive-storage-cost-estimation/azure-archive-storage-cost-estimation.xlsx). You can update the prices and values in that worksheet to estimate your costs. 

## Archive versus cold and cool

Archive storage is the lowest cost tier. However, it can take up to 15 hours to rehydrate 10-GiB files. To learn more, see [Blob rehydration from the archive tier](archive-rehydrate-overview.md). The archive tier might not be the best fit if your workloads must read data quickly. The cool tier offers a near real-time read latency with a lower price than that the hot tier. Understanding your access requirements helps you to choose between the cool, cold, and archive tiers.

The following table compares the cost of archive storage with the cost of cool and cold storage by using the [Sample prices](#sample-prices) that appear in this article. This scenario assumes a monthly ingest of 200,000 files totaling 10,240 GB in size to archive. It also assumes 1 read each month about 10% of stored capacity (1,024 GB), and 10% of total operations (20,000).

| Cost factor                                                 | Archive    | Cold       | Cool        |
|-------------------------------------------------------------|------------|------------|-------------|
| Write operations                                            | 200,000    | 200,000    | 200,000     |
| Price of a single write operation                           | $0.000011  | $0.000018  | $0.00001    |
| **Cost to write (operations * price of a write operation)** | **$2.20**  | **$3.60**  | **$2.00**   |
| Total number of files                                       | 200,000    | 200,000    | 200,000     |
| Total file size (GB)                                        | 10,240     | 10,240     | 10,240      |
| Data prices (pay-as-you-go)                                 | $0.0020    | $0.0045    | $0.0115     |
| **Cost to store (file size * data price)**                  | **$20.48** | **$46.08** | **$117.76** |
| Data retrieval size  (10% of file size)                     | 1,024      | 1,024      | 1,024       |
| Price of data retrieval per GB                              | $0.022     | $0.03      | $0.01       |
| Number of read operations (file count * 10% storage read)   | 20,000     | 20,000     | 20,000      |
| Price of a single read operation                            | $0.00055   | $0.00001   | $0.000001   |
| **Cost to read (operations * price to read)**               | **$11.00** | **$.20**   | **$.02**    |
| **Cost to rehydrate (cost to retrieve + cost to read)**     | **$30.48** | **$30.92** | **$10.26**  |
| **Monthly cost**                                            | **$42.62** | **$71.38** | **$167.91** |

> [!TIP]
> To model your costs, open the **Choose Tiers** tab of this [workbook](https://azure.github.io/Storage/docs/backup-and-archive/azure-archive-storage-cost-estimation/azure-archive-storage-cost-estimation.xlsx). You can update the prices and values in that worksheet to estimate your costs.  

The following chart shows the impact on monthly spending given various read percentages. This chart assumes a monthly ingest of 1,000,000 files totaling 10,240 GB in size. Assuming sample pricing, this chart shows a break-even point at or around the 25% read level. After that level, the cost of archive storage begins to rise relative to the cost of cool storage.

> [!div class="mx-imgBorder"]
> ![Cool versus archive monthly spending](./media/archive-cost-estimation/cool-versus-archive-monthly-spending.png)

## Sample prices

[!INCLUDE [Sample prices for Azure Blob Storage and Azure Data Lake Storage](../../../includes/azure-blob-storage-sample-prices.md)]

## Next steps

- [Set a blob's access tier](access-tiers-online-manage.md)
- [Archive a blob](archive-blob.md)
- [Optimize costs by automatically managing the data lifecycle](lifecycle-management-overview.md)
