---
title: Estimate the cost of using Azure Blob Storage
description: Learn how to estimate the cost of using Azure Blob Storage.  
services: storage
author: normesta
ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 07/03/2024
ms.author: normesta
ms.custom: subject-cost-optimization
---

# Estimate the cost of using Azure Blob Storage

This article helps you estimate the cost to store blobs and to upload, download, and copy blobs between Azure Blob Storage containers. 

All calculations are based on a fictitious price. You can find each price in the [sample prices](#sample-prices) section at the end of this article. 

> [!IMPORTANT]
> These prices are meant only as examples, and shouldn't be used to calculate your costs. For official prices, see the [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) or [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/) pricing pages. For more information about how to choose the correct pricing page, see [Understand the full billing model for Azure Blob Storage](../common/storage-plan-manage-costs.md).

## The cost to store data

You can calculate your storage costs by multiplying the <u>size of your data</u> in GB by the <u>price of storage</u>. For example (assuming [sample pricing](#sample-prices)), if you plan to store 10 TB of blobs in the cool access tier, the capacity cost is $0.0115 * 10 * 1024 = **$117.78** per month. 

Depending on how much storage space you require, it might make sense to [reserve capacity](../blobs/storage-blob-reserved-capacity.md) at a discount. You can reserve capacity in increments of 100 TB and 1 PB for a 1-year or 3-year commitment duration. Reserved capacity is available only for data stored in the hot, cool, and archive access tiers.

Using the [Sample prices](#sample-prices) that appear in this article, the following table compares the pay-as-you-go and reserved capacity cost of storing 100 TB (102,400 GB) of data.

| Calculation                                           | Hot    | Cool | Archive |
|-------------------------------------------------------|--------|------|---------|
| Monthly price for 100 TB of storage                   | $2,130 | $963 | $205    |
| Monthly price for 100 TB of storage (1-year reserved) | $1,747 | $966 | $183    |
| Monthly price for 100 TB of storage (3-year reserved) | $1,406 | $872 | $168    |

To calculate the point at which reserved capacity begins to make sense, divide the cost of reserved capacity by the pay-as-you-go rate. For example, if the cost of 1-year reserved capacity for cool tier storage is $966 and the pay-as-you-go rate is $0.0115, then the calculation is  $966 / $0.0115 = 84,000 GB (roughly **82 TB**). If you plan to store at least 82 TB of data in the cool tier, then reserved capacity begins to make sense. The following table calculates break even point in TB for each access tier.

| Calculation                                          | Hot         | Cool    | Archive |
|------------------------------------------------------|-------------|---------|---------|
| Monthly price per GB of Data storage (pay-as-you-go) | $0.0208     | $0.0115 | $0.002  |
| Price for 100 TB of reserved storage                 | $1,747      | $966    | $183    |
| Break even for 1-year reserved capacity              | 84 TB<sup>1 | 82 TB   | 89 TB   |
| Break even for 3-year reserved capacity              | 67 TB<sup>1 | 76 TB   | 84 TB   |

<sup>1</sup>The hot tier has multiple pay-as-you-go rates. The price of the first 50TB and the price of the second 50TB are factored into this calculation.<br />

To learn more about reserved capacity, see [Optimize costs for Blob Storage with reserved capacity](storage-blob-reserved-capacity.md).

## The cost to transfer data

When you transfer data, you're billed for _write_ and _read_ operations. Some client applications use additional operations to transfer data such as operations to list blobs or get properties. The [AzCopy](../common/storage-use-azcopy-s3.md) utility is optimized for data transfer and can serve as a canonical example on which to base your cost estimates. 

See [Estimate the cost of using AzCopy to transfer blobs](azcopy-cost-estimation.md).

#### The cost to upload

When you upload data, your client divides that data into blocks and uploads each block individually. Each block upload is billed as a _write_ operation. A final write operation is needed to assemble blocks into a blob that is stored in the account. The number of write operations required to upload a blob depends on the size of each block. **8 MiB** is the default block size for uploads to the Blob Service endpoint (`blob.core.windows.net`) and that size is configurable. **4 MiB** is the block size for uploads to the Data Lake Storage endpoint (`dfs.core.windows.net`) and that size is not configurable. A smaller block size performs better because blocks can upload in parallel. However, the cost is higher because more write operations are required to upload a blob.

See [Estimate the cost to upload](azcopy-cost-estimation.md#the-cost-to-upload). 

#### The cost to download

The number of operations required to download blob depends on which endpoint you use. If you download a blob from the Blob Service endpoint, you're billed the cost of a single _read_ operation. If you download a blob from the Data Lake Storage endpoint, you're billed for cost of multiple read operations because blobs must be downloaded in 4 MiB blocks.   

See [Estimate the cost to download](azcopy-cost-estimation.md#the-cost-to-download). 

#### The cost to copy between containers

If you copy a blob to another container in the same account, then you're billed the cost of a single _write_ operation that is based on the destination tier. If the destination container is in another account, then you're also billed the cost of data retrieval and the cost of a read operation that is based on the source tier. If the destination account is in another region, then the cost of network egress is added to your bill. 

The following table summarizes the cost to copy a blob to another container. 

| Destination account | Costs |
|---|---|
| Same account | - A read operation based on the destination tier |
| Different account | - A read operation based on the destination tier<br>- A read operation based on the source tier<br>- A data retrieval charge |
| Different account in another region | - A read operation based on the destination tier<br>- A read operation based on the source tier<br>- A data retrieval charge<br>- network egress | 

See [Estimate the cost to copy between containers](azcopy-cost-estimation.md#the-cost-to-copy-between-containers). 

## The cost to rename

The cost to rename blobs depends on the file structure of your account and the number of blobs that you're renaming.

### The cost to rename blobs

If the account has a flat namespace, there is no dedicated operation to rename a blob. Instead, your client tool will copy the blob to a new blob, and then delete the source blob. Delete operations are free. Therefore, when you rename a blob, you're billed for the cost of single _write_ operation. If the account has a hierarchical namespace, then there is a dedicated operation to rename a blob and it is billed as an _iterative write_ operation. 

The cost of a write operation against the Blob Service endpoint is lower than the cost of an iterative write operation against the Data Lake Storage endpoint. Therefore, the cost to rename blobs one-by-one, it will cost less in accounts that have a flat namespace. 

Using the [Sample prices](#sample-prices) that appear in this article, the following table calculates the cost to rename 1000 blobs.

| Price factor                                                                                | Hot         | Cool       | Cold      |
|---------------------------------------------------------------------------------------------|-------------|------------|-----------|
| Price of a single write operation to the Blob Service endpoint (price / 10,000)             | $0.0000055  | $0.00001   | $0.000018 |
| **Cost to rename blob virtual directories (1000 * operation price)**                        | **$0.0055** | **$0.01**  | **$.018** |
| Price of a single iterative write operation to the Data Lake Storage endpoint (price / 100) | $0.000715   | $0.000715  | $0.000715 |
| **Cost to rename Data Lake Storage directories (1000 * operation price)**                   | **$0.715**  | **$0.715** | **0.715** |

Based on these calculations, the cost to rename 1000 blobs in the hot tier differs by **70** cents.

### The cost to rename a directory

If the account has a flat namespace, then blobs are organized into _virtual directories_ that mimic a folder structure. A virtual directory forms part of the name of the blob and is indicated by the delimiter character. Because a virtual directory is a part of the blob name, it doesn't actually exist as an independent object. There is no way to rename a virtual directory without renaming all of the blobs that contain that virtual directory in the name. To effectively rename each blob, client applications have to copy a blob and then delete the source blob. If the account has a hierarchical namespace, directories are not virtual. They are concrete, independent objects that you can operate on directly. Therefore, renaming a blob is far more efficient because client applications can rename a blob in a single operation. 

Using the [Sample prices](#sample-prices) that appear in this article, the following table calculates the cost to rename 1000 directories that each contain 1000 blobs.

| Price factor                                                                                | Hot        | Cool       | Cold       |
|---------------------------------------------------------------------------------------------|------------|------------|------------|
| Price of a single write operation to the Blob Service endpoint (price / 10,000)             | $0.0000055 | $0.00001   | $0.000018  |
| **Cost to rename blob virtual directories (1000 * (1000 * operation price))**               | **$5.50**  | **$10.00** | **$18.00** |
| Price of a single iterative write operation to the Data Lake Storage endpoint (price / 100) | $0.000715  | $0.000715  | $0.000715  |
| **Cost to rename Data Lake Storage directories (1000 * operation price)**                   | **$0.715** | **$0.715** | **0.715**  |

Based on these calculations, the cost to rename 1000 directories in the hot tier that each contain 1000 blobs differs by almost **$5.00**. For directories in the cold tier, the difference is over **$17**.

## The cost to move between tiers



Each month, you'd assume the cost of writing to the hot tier. The cost to store and then move data to the cool tier would increase over time. Something here about the early deletion penalty.

Using the [Sample prices](#sample-prices) that appear in this article, the following table demonstrates four months of spending. 

This scenario assumes a monthly upload of 1,000 files to the hot access tier. Each file is 5 GB so the total size is 5,000 GB. It also assumes a one-time read each month of about 5% of those files. This scenario assumes that you plan to periodically move data to the cool tier by using [lifecycle management policies](lifecycle-management-overview.md) to move data to the cool tier that has not been accessed in 30 days. 

This scenario uses these sample prices.

| Price factor                                      | Hot         | Cool      |
|---------------------------------------------------|-------------|-----------|
| Price of a single write transaction               | $0.0000055  | $0.00001  |
| Price of a single read transaction                | $0.00000044 | $0.000001 |
| Price of data retrieval (per GB)                  | Free        | $0.01     |
| Price of Data storage first 50 TB (pay-as-you-go) | $0.0208     | $0.0115   |

#### January

In the first month, this scenario assumes the following activities:

- 1000 files are uploaded to the hot access tier. Each file is 5 GB in size. 
- 5% of these files read by client workloads.

The following table calculates the number of write operations required to upload the blobs.

| Calculation                                                      | Value       |
|------------------------------------------------------------------|-------------|
| Number of MiB in 5 GiB                                           | 5,120       |
| Write operations to upload each block  (5,120 MiB / 8-MiB block) | 640         |
| Wite operation to assemble blocks into a blob                    | 1           |
| **Total write operations (1,000 * 641)**                         | **641,000** |

The following table breaks down the approximate costs for January.

| Cost factor | Cost |
|---|---|
| **Cost to write to the hot tier (641,000 * price of the operation)** | **$3.53** |
| Total size stored in hot tier | 5,000 GB |
| Total file number of files in hot tier | 1000 |
| **Cost to store blobs in hot tier (total size * price per GB)** | **$104** |
| Total number of files read from the hot tier (1000 * 5%) | 50 |
| **Cost to read files from the hot tier (50 * price of the operation)** | **$0.000022** |
| **Total invoice for January (write + read + storage)** | **$107.53** |

> [!NOTE]
> These calculations provide an approximate estimate given sample pricing. If blobs were uploaded in batches, then some portion of the storage costs would be prorated as they would not incur storage costs for the entire month. See [Data storage and index meters](../common/storage-plan-manage-costs.md#data-storage-and-index-meters).

#### February

In the second month, this scenario assumes the same pattern of uploads, but uses a lifecycle management policy that moves 20% of the files uploaded in the previous month to cool storage after 30 days of no activity. 

The following table breaks down the approximate costs for February.

| Cost factor | Cost |
|---|---|
| **Cost to write to the hot tier (641,000 * price of the operation)** | **$3.53** |
| Total size stored in hot tier before policy run | 10,000 GB |
| Total number of files in hot tier before policy run | 2000 |
| Total number of files from previous months to move to the cool tier (20% * 1000) | 200 |
| **Cost to write to the cool tier (200 * price of a write operation)** | **$0.0011** |
| Total number files in hot tier after policy run | 1800 |
| Total size stored in the hot tier after policy run | 9,000 GB |
| **Cost to store blobs in hot tier (9,000 * price per GB)** | **$187.2** |
| Total number of files in the cool tier | 200 |
| Total size of files in the cool tier | 1000 GB |
| **Cost to store blobs in the cool tier (1,000 * price per GB)** | **$11.5** |
| Total number of files read from the hot tier (1800 * 5%) | 90 |
| **Cost to read files from the hot tier (90 * price of the operation)** | **$0.0000396** |
| **Total invoice for February (write + read + storage)** | **$202.23** |

#### March

March - ingest into hot tier. Read some percentage of hot tier. Move some percentage to cool storage tier. Read some percentage from cool tier (no penalty)

#### April

April - ingest into hot tier. Read some percentage of hot tier. Move some percentage to cool storage tier. Read some percentage from cool tier (no penalty), Read some percentage from cool tier with a penalty.

#### Summary table

Put next scenario here.


## Sample prices

The following table includes sample (fictitious) prices for each request to the Blob Service endpoint (`blob.core.windows.net`). For official prices, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

| Price factor                                                    | Hot     | Cool    | Cold          | Archive |
|-----------------------------------------------------------------|---------|---------|---------------|---------|
| Price of write operations (per 10,000)                          | $0.055  | $0.10   | $0.18         | $.11    |
| Price of read operations (per 10,000)                           | $0.0044 | $0.01   | $0.10         | $5.50   |
| List and container operations (per 10,000)                      | $0.055  | $0.055  | $0.065        | $.055   |
| All other operations (per 10,000)                               | $0.0044 | $0.0044 | $0.0052       | $.0044  |
| Price of data retrieval (per GB)                                | Free    | $0.01   | $0.03         | $.022   |
| Network bandwidth between regions within North America (per GB) | $0.02   | $0.02   | $0.02         | $0.02   |
| Price of Data storage first 50 TB (pay-as-you-go)               | $0.0208 | $0.0115 | $0.0045       | $0.002  |
| Price of Data storage next 450 TB (pay-as-you-go)               | $0.020  | $0.0115 | $0.0045       | $0.002  |
| Price of 100 TB (1-year reserved capacity)                      | $1,747  | $966    | Not available | $183    |
| Price of 100 TB (3-year reserved capacity)                      | $1,406  | $872    | Not available | $168    |

The following table includes sample prices (fictitious) prices for each request to the Data Lake Storage endpoint (`dfs.core.windows.net`). For official prices, see [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/). 

| Price factor                                                    | Hot     | Cool    | Cold          | Archive |
|-----------------------------------------------------------------|---------|---------|---------------|---------|
| Price of write operations (every 4MiB, per 10,000)              | $0.0715 | $0.13   | $0.234        | $0.143  |
| Price of read operations (every 4MiB, per 10,000)               | $0.0057 | $0.013  | $0.13         | $7.15   |
| Iterative write operations (per 100)                            | $0.0715 | $0.0715 | $0.0715       | $0.0715 |
| Iterative read operations (per 10,000)                          | $0.0715 | $0.0715 | $0.0845       | $0.0715 |
| Price of data retrieval (per GB)                                | Free    | $0.01   | $0.03         | $0.022  |
| Network bandwidth between regions within North America (per GB) | $0.02   | $0.02   | $0.02         | $0.02   |
| Data storage prices first 50 TB (pay-as-you-go)                 | $0.021  | $0.012  | $0.0045       | $0.002  |
| Data storage prices next 450 TB (pay-as-you-go)                 | $0.020  | $0.012  | $0.0045       | $0.002  |
| Price of 100 TB (1-year reserved capacity)                      | $1,747  | $966    | Not available | $183    |
| Price of 100 TB (3-year reserved capacity)                      | $1,406  | $872    | Not available | $168    |

## Operations used for each endpoint

 Clients that upload to the Blob Service endpoint use the [Put Block](/rest/api/storageservices/put-block) operation to upload each block. After the final block is uploaded, clients commits those blocks by using the [Put Block List](/rest/api/storageservices/put-block-list) operation. Clients that use the Data Lake Storage endpoint upload each block by using the [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) operation with the action parameter set to `append`. After the final block is uploaded, clients commit those blocks by using the [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) operation with the action parameter set to `flush`. All of these operations are billed as _write_ operations.

## See also

- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
- [Map each REST operation to a price](map-rest-apis-transaction-categories.md)
- [Get started with AzCopy](../common/storage-use-azcopy-v10.md)
