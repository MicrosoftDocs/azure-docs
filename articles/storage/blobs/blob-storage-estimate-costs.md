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

This article helps you estimate the cost of Azure Blob Storage. Make clear that this article shows costs across capacity, transactions and tiers and helps you see the impact of different use and tiering flows on costs over time.

All calculations are based on a fictitious price. You can find each price in the [sample prices](#sample-prices) section at the end of this article. 

> [!IMPORTANT]
> These prices are meant only as examples, and shouldn't be used to calculate your costs. For official prices, see the [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) or [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/) pricing pages. For more information about how to choose the correct pricing page, see [Understand the full billing model for Azure Blob Storage](../common/storage-plan-manage-costs.md).

## The cost to store data

You can calculate your storage costs by multiplying the <u>size of your data</u> in GB by the <u>price of storage</u>. For example (assuming [sample pricing](#sample-prices)), if you plan to store 10 TB of blobs in the cool access tier, the capacity cost is $0.0115 * 10 * 1024 = $117.78 per month. 

Depending on how much storage you require, it might make sense to [reserve capacity](../blobs/storage-blob-reserved-capacity.md) at a discount. You can reserve capacity in increments of 100 TB and 1 PB sizes for 1-year and 3-year commitment duration. Reserved capacity is available only for data stored in the hot, cool, and archive access tiers.

Using the [Sample prices](#sample-prices) that appear in this article, the following table compares the cost of storing 100 TB (102,400 GB) of data with pay-as-you-go pricing versus reserved capacity pricing.

| Calculation                                           | Hot    | Cool | Archive |
|-------------------------------------------------------|--------|------|---------|
| Monthly price for 100 TB of storage                   | $2,130 | $963 | $205    |
| Monthly price for 100 TB of storage (1-year reserved) | $1,747 | $966 | $183    |
| Monthly price for 100 TB of storage (3-year reserved) | $1,406 | $872 | $168    |

To calculate the amount of TB of storage where reserved capacity begins to make sense, divide the cost of reserved capacity by the pay-as-you-go rate. For example, if the cost of 1-year reserved capacity for cool tier storage is $966 and the pay-as-you-go rate is $0.0115, then the calculation is  $966 / $0.0115 = 84,000 GB (roughly 82 TB). If you plan to store at least 82 TB of data in the cool tier, then reserved capacity begins to make sense. The following table calculates break even points for each access tier.

| Calculation                                          | Hot         | Cool    | Archive |
|------------------------------------------------------|-------------|---------|---------|
| Monthly price per GB of Data storage (pay-as-you-go) | $0.0208     | $0.0115 | $0.002  |
| Price for 100 TB of reserved storage                 | $1,747      | $966    | $183    |
| Break even for 1-year reserved capacity              | 84 TB<sup>1 | 82 TB   | 89 TB   |
| Break even for 3-year reserved capacity              | 67 TB<sup>1 | 76 TB   | 84 TB   |

<sup>1</sup>The hot tier has multiple pay-as-you-go rates. The price of the first 50TB and the price of the second 50TB are factored into this calculation.<br />

> [!NOTE]
> Reserved capacity is tied to an access tier. Data that you move out of that tier is billed at the rate of the destination tier.

## The cost to transfer data

When you transfer data, you're billed for _write_ and _read_ operations. Your client utility might also use operations to list container contents or get blob properties. The AzCopy utility is optimized to upload blobs reliably and efficiently and can serve as a canonical example on which to base your cost estimates. See [Estimate the cost of using AzCopy to transfer blobs](azcopy-cost-estimation.md) for example calculations. 

#### The cost to upload

Blobs are uploaded as blocks. Each block upload is billed as a _write_ operation. A final write operation is needed to assemble blocks into a blob that is stored in the account. The number of write operations that a client needs depends on the size of each block. **8 MiB** is the default block size for uploads to the Blob Service endpoint (`blob.core.windows.net`) and that size is configurable. **4 MiB** is the block size for uploads to the Data Lake Storage endpoint (`dfs.core.windows.net`) and that size is not configurable. A smaller block size performs better because blocks can upload in parallel. However, the cost is higher because more write operations are required to upload a blob.

To estimate costs, see [The cost to upload](azcopy-cost-estimation.md#the-cost-to-upload). 

#### The cost to download

A blob that is downloaded from the Blob Service endpoint, incurs the cost of a single _read_ operation. A blob downloaded from the Data Lake Storage endpoint incurs the cost of multiple read operations because blobs must be downloaded in 4 MiB blocks and. Each 4 MiB block is billed as a separate read operation.  

To estimate costs, see [The cost to download](azcopy-cost-estimation.md#the-cost-to-download). 

#### The cost to copy between containers

A blob that is copied between containers incurs the cost of a single _write_ operation which is based on the destination tier. If the destination container is in another account, you're also billed for data retrieval and for read operation that is based on the source tier. If the destination account is in another region, you're also billed for network egress charges. 

To estimate costs, see [The cost to copy between containers](azcopy-cost-estimation.md#the-cost-to-copy-between-containers). 

## The cost to rename blobs and directories

If you rename a blob in a flat namespace account, you must copy the blob to a new blob and then delete the old blob.
Delete operations are free
If you rename a blob in a hierarchical namespace account, you can use a single rename operation because you are operating on a single zero-length blob.

Using the [Sample prices](#sample-prices) that appear in this article, the following table calculates the cost to rename 1000 directories that each contain 1000 blobs.

| Price factor                                                                                | Hot        | Cool       | Cold       |
|---------------------------------------------------------------------------------------------|------------|------------|------------|
| Price of a single write operation to the Blob Service endpoint (price / 10,000)             | $0.0000055 | $0.00001   | $0.000018  |
| **Cost to rename blob virtual directories (1000 * (1000 * operation price))**               | **$5.50**  | **$10.00** | **$18.00** |
| Price of a single iterative write operation to the Data Lake Storage endpoint (price / 100) | $0.000715  | $0.000715  | $0.000715  |
| **Cost to rename Data Lake Storage directories (1000 * operation price)**                   | **$0.715** | **$0.715** | **0.715**  |

## The cost to change access tiers

Put something here.

## Comprehensive examples

Example here that includes LCM, changing tiers, continuously reading and writing to different tiers. Storage cost and transaction costs incorporated.

## Sample prices

The following table includes sample (fictitious) prices for each request to the Blob Service endpoint (`blob.core.windows.net`). For official prices, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

| Price factor                                                    | Hot     | Cool    | Cold          | Archive |
|-----------------------------------------------------------------|---------|---------|---------------|---------|
| Price of write operations (per 10,000)                          | $0.055  | $0.10   | $0.18         | $.11    |
| Price of read operations (per 10,000)                           | $0.0044 | $0.01   | $0.10         | $5.50   |
| Price of data retrieval (per GiB)                               | Free    | $0.01   | $0.03         | $.022   |
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
| Price of data retrieval (per GiB)                               | Free    | $0.01   | $0.03         | $0.022  |
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
