---
title: Estimate the cost of using Azure Blob Storage
description: Learn how to estimate the cost of using Azure Blob Storage.  
services: storage
author: normesta
ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 07/26/2024
ms.author: normesta
ms.custom: subject-cost-optimization
---

# Estimate the cost of using Azure Blob Storage

This article helps you estimate the cost to store, upload, download, and work with data in Azure Blob Storage. 

All calculations are based on a fictitious price. You can find each price in the [sample prices](#sample-prices) section at the end of this article. 

> [!IMPORTANT]
> These prices are meant only as examples, and shouldn't be used to calculate your costs. For official prices, see the [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) or [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/) pricing pages. For more information about how to choose the correct pricing page, see [Understand the full billing model for Azure Blob Storage](../common/storage-plan-manage-costs.md).

## The cost to store data

You can calculate your storage costs by multiplying the <u>size of your data</u> in GB by the <u>storage price of the chosen access tier</u>. For example (assuming [sample pricing](#sample-prices)), if you plan to store 10 TB of blobs in the cool access tier, the capacity cost is $0.0115 * 10 * 1024 = **$117.78** per month. 

Depending on how much storage space you require, it might make sense to [reserve capacity](../blobs/storage-blob-reserved-capacity.md) at a discount. You can reserve capacity in increments of 100 TB and 1 PB for a 1-year or 3-year commitment duration. Reserved capacity is available only for data stored in the hot, cool, and archive access tiers.

Using the [Sample prices](#sample-prices) that appear in this article, the following table compares the pay-as-you-go and reserved capacity cost of storing 100 TB (102,400 GB) of data.

| Calculation                                           | Hot    | Cool | Archive |
|-------------------------------------------------------|--------|------|---------|
| Monthly price for 100 TB of storage                   | $2,130 | $963 | $205    |
| Monthly price for 100 TB of storage (1-year reserved) | $1,747 | $966 | $183    |
| Monthly price for 100 TB of storage (3-year reserved) | $1,406 | $872 | $168    |

To calculate the point at which reserved capacity begins to make sense, divide the cost of reserved capacity by the pay-as-you-go rate. For example, if the cost of 1-year reserved capacity for cool tier storage is $966 and the pay-as-you-go rate is $0.0115, then the calculation is  $966 / $0.0115 = 84,000 GB (roughly **82 TB**). If you plan to store at least 82 TB of data in the cool tier for the entirety of the reservation period, then reserved capacity begins to make sense. The following table calculates break even point in TB for each access tier.

| Calculation                                          | Hot         | Cool    | Archive |
|------------------------------------------------------|-------------|---------|---------|
| Monthly price per GB of Data storage (pay-as-you-go) | $0.0208     | $0.0115 | $0.002  |
| Price for 100 TB of reserved storage                 | $1,747      | $966    | $183    |
| Break even for 1-year reserved capacity              | 82 TB<sup>1 | 82 TB   | 89 TB   |
| Break even for 3-year reserved capacity              | 66 TB<sup>1 | 74 TB   | 82 TB   |

<sup>1</sup>The hot tier has multiple pay-as-you-go rates. The price of the first 50TB and the price of the second 50TB are factored into this calculation.<br />

To learn more about reserved capacity, see [Optimize costs for Blob Storage with reserved capacity](storage-blob-reserved-capacity.md).

For general information about storage costs, see [Data storage and index meters](../common/storage-plan-manage-costs.md#data-storage-and-index-meters).

## The cost to transfer data

When you transfer data, you're billed for _write_ and _read_ operations. Some client applications use additional operations to transfer data such as operations to list blobs or get properties. The [AzCopy](../common/storage-use-azcopy-s3.md) utility is optimized to data transfer efficiently and can serve as a canonical example on which to base your cost estimates. 

See [Estimate the cost of using AzCopy to transfer blobs](azcopy-cost-estimation.md).

#### The cost to upload

When you upload data, your client divides that data into blocks and uploads each block individually. Each block that is upload is billed as a _write_ operation. A final write operation is needed to assemble blocks into a blob that is stored in the account. The number of write operations required to upload a blob depends on the size of each block. **8 MiB** is the default block size for uploads to the Blob Service endpoint (`blob.core.windows.net`) and that size is configurable. **4 MiB** is the block size for uploads to the Data Lake Storage endpoint (`dfs.core.windows.net`) and that size is not configurable. A smaller block size performs better because blocks can upload in parallel. However, the cost is higher because more write operations are required to upload a blob.

See [Estimate the cost to upload](azcopy-cost-estimation.md#the-cost-to-upload). 

#### The cost to download

The number of operations required to download a blob depends on which endpoint you use. If you download a blob from the Blob Service endpoint, you're billed the cost of a single _read_ operation. If you download a blob from the Data Lake Storage endpoint, you're billed for cost of multiple read operations because blobs must be downloaded in 4 MiB blocks.   

See [Estimate the cost to download](azcopy-cost-estimation.md#the-cost-to-download). 

#### The cost to copy between containers

If you copy a blob to another container in the same account, then you're billed the cost of a single _write_ operation that is based on the destination tier. If the destination container is in another account, then you're also billed the cost of data retrieval and the cost of a read operation that is based on the source tier. If the destination account is in another region, then the cost of network egress is added to your bill. 

See [Estimate the cost to copy between containers](azcopy-cost-estimation.md#the-cost-to-copy-between-containers). 

## The cost to rename a blob

The cost to rename blobs depends on the file structure of your account and the number of blobs that you're renaming.

If the account has a flat namespace, there is no dedicated operation to rename a blob. Instead, your client tool will copy the blob to a new blob, and then delete the source blob. Delete operations are free. Therefore, when you rename a blob, you're billed for the cost of single _write_ operation. If the account has a hierarchical namespace, then there is a dedicated operation to rename a blob and it is billed as an _iterative write_ operation. 

The cost of a write operation against the Blob Service endpoint is lower than the cost of an iterative write operation against the Data Lake Storage endpoint. Therefore, the cost to rename blobs one-by-one, it will cost less in accounts that have a flat namespace. 

Using the [Sample prices](#sample-prices) that appear in this article, the following table calculates the cost to rename 1000 blobs.

| Price factor                                                                                | Hot         | Cool       | Cold      |
|---------------------------------------------------------------------------------------------|-------------|------------|-----------|
| Price of a single write operation to the Blob Service endpoint (price / 10,000)             | $0.0000055  | $0.00001   | $0.000018 |
| **Cost to rename blob virtual directories (1000 * operation price)**                        | **$0.0055** | **$0.01**  | **$.018** |
| Price of a single iterative write operation to the Data Lake Storage endpoint (price / 100) | $0.000715   | $0.000715  | $0.000715 |
| **Cost to rename Data Lake Storage directories (1000 * operation price)**                   | **$0.715**  | **$0.715** | **$0.715** |

Based on these calculations, the cost to rename 1000 blobs in the hot tier differs by **70** cents.

## The cost to rename a directory

If the account has a flat namespace, then blobs are organized into _virtual directories_ that mimic a folder structure. A virtual directory forms part of the name of the blob and is indicated by the delimiter character. Because a virtual directory is a part of the blob name, it doesn't actually exist as an independent object. There is no way to rename a virtual directory without renaming all of the blobs that contain that virtual directory in the name. To effectively rename each blob, client applications have to copy a blob and then delete the source blob. 

If the account has a hierarchical namespace, directories are not virtual. They are concrete, independent objects that you can operate on directly. Therefore, renaming a blob is far more efficient because client applications can rename a blob in a single operation. 

Using the [Sample prices](#sample-prices) that appear in this article, the following table calculates the cost to rename 1000 directories that each contain 1000 blobs.

| Price factor                                                                                | Hot        | Cool       | Cold       |
|---------------------------------------------------------------------------------------------|------------|------------|------------|
| Price of a single write operation to the Blob Service endpoint (price / 10,000)             | $0.0000055 | $0.00001   | $0.000018  |
| **Cost to rename blob virtual directories (1000 * (1000 * operation price))**               | **$5.50**  | **$10.00** | **$18.00** |
| Price of a single iterative write operation to the Data Lake Storage endpoint (price / 100) | $0.000715  | $0.000715  | $0.000715  |
| **Cost to rename Data Lake Storage directories (1000 * operation price)**                   | **$0.715** | **$0.715** | **0.715**  |

Based on these calculations, the cost to rename 1000 directories in the hot tier that each contain 1000 blobs differs by almost **$5.00**. For directories in the cold tier, the difference is over **$17**.

## Example: Upload, download, and change access tiers

This example shows four months of spending based uploads, downloads, and the impact of moving objects between tiers. 

### Parameters

At the beginning of each month, 1000 files are uploaded to the hot access tier. Each file is 5 GB in size. During the month, half of these files read by client workloads. After 30 days, a [lifecycle management policy](lifecycle-management-overview.md) moves the other half to the cool access tier to save on storage costs. 

In March, client applications read 10% of the data that is stored in the cool access tier. A lifecycle management policy is configured to move those blobs back to the hot tier after they're read.

20 days into April, clients once again read 10% of the data that is stored in the cool access tier. However, those blobs were stored in the cool tier for less than 30 days. Because the lifecycle management policy moves those blobs back to the hot tier before the minimum 30 days has elapsed, an early penalty is assessed. The early deletion penalty is the cost of cool storage for 10 days.

### Calculations

Using the [Sample prices](#sample-prices) that appear in this article, the following table demonstrates four months of spending.

> [!NOTE]
> These calculations provide an approximate estimate given sample pricing. If blobs were uploaded in batches, then some portion of the storage costs would be prorated as they would not incur storage costs for the entire month. See [Data storage and index meters](../common/storage-plan-manage-costs.md#data-storage-and-index-meters).

| Cost factor                                                                                           | January         | February        | March           | April           |
|-------------------------------------------------------------------------------------------------------|-----------------|-----------------|-----------------|-----------------|
| **Cost to write 1000 blobs to the hot tier**<sup>1                                                    | **$3.53**       | **$3.53**       | **$3.53**       | **$3.53**       |
| Number of blobs in the hot tier after monthly ingest                                                                       | 1000            | 2000            | 2100            | 2155            |
| Number of blobs to move to the cool tier                                                              | 0               | 1000            | 1050            | 1078            |
| **Cost to set blobs to the cool tier (billed as a write operation)**                                  | **$0.00000000** | **$0.01000000** | **$0.01050000** | **$0.01077500** |
| Number of blobs in the cool tier                                                                      | 0               | 1000            | 1050            | 1078            |
| Total size of blobs in the cool tier (GB)                                                             | 0               | 5000            | 5250            | 5388            |
| Number of blobs read from the cool tier then moved back to the hot tier                                      | 0               | 100             | 105             | 108             |
| **Cost to read blobs from the cool tier and then to move them to the hot tier (2 read operations per blob)** | **$0.00000000** | **$0.00020000** | **$0.00021000** | **$0.00021550** |
| Number of blobs that remain in the cool tier                                                          | 0               | 900             | 945             | 970             |
| Total size of blobs that remain in the cool tier (GB)                                                 | 0               | 4500            | 4725            | 4849            |
| **Cost to store blobs in the cool tier**                                                              | **$0.00**       | **$51.75**      | **$54.34**      | **$55.76**      |
| **Early deletion penalty**                                                                            | **$0.00**       | **$0.00**       | **$0.00**       | **$0.41**       |
| Number of blobs that remain in the hot tier                                                           | 1000            | 1100            | 1155            | 1185            |
| Total size of blobs that remain in the hot tier (GB)                                                  | 5000            | 5500            | 5775            | 5926            |
| **Cost to store blobs in hot tier**                                                                   | **$104.00**     | **$114.40**     | **$120.12**     | **$123.27**     |
| Number of blobs read from the hot tier                                                                | 500             | 550             | 578             | 593             |
| **Cost to read blobs from the hot tier**                                                              | **$0.00022000** | **$0.00024200** | **$0.00025410** | **$0.00026076** |
| **Monthly total**                                                                                     | **$107.53**     | **$169.69**     | **$178.00**     | **$182.57**     |

<sup>1</sup>The number of operations required to complete each monthly upload is **641,000**. The formula to calculate that number is 1000 blobs * 5 GB / 8-MiB block + the write operation that is required to assemble all of the blocks into a blob.<br />

## Sample prices

[!INCLUDE [Sample prices for Azure Blob Storage and Azure Data Lake Storage](../../../includes/azure-blob-storage-sample-prices.md)]

## See also

- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
- [Map each REST operation to a price](map-rest-apis-transaction-categories.md)
- [Get started with AzCopy](../common/storage-use-azcopy-v10.md)
