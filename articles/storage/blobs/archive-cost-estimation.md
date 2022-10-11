---
title: Put title here
titleSuffix: Azure Storage
description: Put description here.
author: normesta
ms.author: normesta
ms.date: 10/07/2022
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual

---

# Archive cost estimation

Azure Archive Storage provides a secure, low-cost means for retaining cold data including backup and archival storage. Even Archive is the lowest priced tier of Azure Storage, it’s still recommended to estimate how much you are going to spend on Archive based on your scenarios. You can see how Archive pricing is defined in Azure Blob Storage Pricing. 

Assuming your data is stored on Hot tier in your storage account, the total price would include three major categories: Archiving cost, archive capacity cost, and rehydration cost. Especially, rehydration cost may change significantly depending on your rehydration frequency and volume. This article would guide you how to estimate your spending on each category. 

## Cost to write data to the archive tier 

To archive your data on hot tier, you need to use SetBlobTier API to change tier on each blob. Tools including Azure Portal and Azure Storage Explorer implement with the same API. These operations would be charged as Write operations on Archive tier. The units would be the number of blob. 

You can calculate what it costs to write data to the archive tier by multiplying the number of blobs that you plan to write by the cost of a write operation. 

The following table shows the cost of writing 2,000,000 blobs at a cost of $0.00001 per write transaction.

| Cost factor | Total |
|--------|---------|
| Number of blobs | 2,000,000 |
| Cost of write operations (per 10,000) | $0.10 |
| Cost of a single write operation ($.10 / 10,000) | $0.00001 |
| **Cost to write** (2,000,000 * 0.00001) | **$20.00** |

## Cost to store data in the archive tier 

If the total archive data is less than 100 TB, data storage prices pay-as-you-go would apply. If it’s above 100 TB, Azure Storage Reserved Capacity can apply with commitment. 

You can calculate what it costs to store data in the archive tier by multiplying the size in GB of the data that you plan to store by the cost of storage.

The following table shows the cost of storing 102,400 GB of data at a price of $0.00099 per GB. 

| Cost factor | Total |
|--------|---------|
| Total file size (GB) | 102,400 |
| Data prices (pay-as-you-go) | $0.00099 |
| **Cost to store** (102,400 * $0.00099) | **$101.38** |

## Cost to rehydrate data from the archive tier 

To rehydrate your data on archive tier, you need to use SetBlobTier API to change tier on each blob, or CopyBlob to copy to hotter tier. Tools including Azure Portal and Azure Storage Explorer implement with the same API. These operations would be charged in Read operations and Data Retrieval GB on Archive tier. 

Rehydration cost = Read operations price * [SetBlobTier count | CopyBlob count | Blob count] / 10,000 + Data Retrieval price * Total rehydrate blob size GB 

For example, if you rehydrate 1,000 archived blobs 1 GB in total with standard priority on an Azure Blob Storage LRS account in East US, the capacity cost is $5 * 1,000 / 10,000 + $0.02 * 1 = $0.52. With high priority retrieval, the capacity cost is $50 * 1,000 / 10,000 + $0.10 * 1 = $5.1. 

Archive is designed to host cold data which it’s expected to access archived blobs in very low occasions. The rehydration price is high on both Read operations and Data Retrieval. Thus, you are recommended to estimate the rehydration based on actual business needs and build a process to manage required rehydration properly. 

You should avoid Early deletion fee as possible. With CopyBlob operation, you won’t change the tier of original archived blobs and early deletion fee can be prevented as such. 

| Factor | Total |
|--------|---------|
| Data retrieval size (102,400 * 1%) | 1024 |
| Cost of data retrieval (per GB) | $.02 |
| **Cost to retrieve data** (1024 * $.02) | **$20.48** |
| Number of read transactions (2,000,000 * 1%) | 20,000 |
| Cost of a single read operation ($5.00 / 10,000) | $0.0005 |
| **Cost to read data** (20,000 * $0.0005) | **$10.00** | 
| **Total cost to rehydrate data** ($20.42 + $10.00) | **$30.48** |

Mention that there are separate rates for high priority reads and data retrieval. See the pricing page.

## Scenarios

We will use this data for our scenarios. Disclaimer and pointer to the pricing page for actual data.

| Factor | Example metric |
|---|---|
| Reads per month | 1 |
| Percentage of storage read | 1% |
| Data prices (pay-as-you-go) | $0.00099 |
| Cost of write transactions (per 10,000) | $0.10 |
| Cost of a single write operation ($.10 / 10,000) | $0.00001 |
| Cost of read transactions (per 10,000) | $5.00 |
| Cost of a single read operation ($5.00 / 10,000) | $0.0005 |
| Cost of high priority read transactions (per 10,000) | $50.00 |
| Cost of data retrieval (per GB) | $0.02 |
| Cost of high priority data retrieval (per GB) | $0.10 |
| Total file size (GB) | 102,400 |
| Total file count | 2,000,000 |

### One-time on-prem data backup to Archive 

It's one of common scenarios that you need to remove on-prem tapes or file servers and migrate backup data to cloud storage. If the access rate is expected low and you want to save spending, Archive storage is the best fitted option. 

In this scenario, archiving cost would be required for the first month as one time effort. In rest of months, you need to spend on archive capacity and needed rehydration. 

Using the example data from the previous sections, this table demonstrates the spending for three months. 

<table>
  <tr>
    <th>Factor</th>
    <th>January</th>
  </tr>
  <tr bgcolor="beige">
    <td>Alfreds Futterkiste</td>
    <td>Maria Anders</td>
    <td>Germany</td>
  </tr>
  <tr>
    <td>Centro comercial Moctezuma</td>
    <td>Francisco Chang</td>
    <td>Mexico</td>
  </tr>
</table>


| Factor | January | February | March |
|--------|---------|---------|----|
| Write transactions | 2,000,000 | 0 | 0 |
| Cost of a single write operation | $0.00001 | $0.00001 | $0.00001 |
| Cost to write | $20.00 | $0.00 | $0.00| $20.00 |
| Total file size (GB) | 102,400 | 102,400 | 102,400 |
| Data prices (pay-as-you-go) | $0.00099 | $0.00099 |$0.00099 |
| Cost to store  | $101.38 | $101.38 | $101.38 | 
| Data retrieval size (File size * % storage read) | 1024 | 1024 | 1024 |
| Cost of data retrieval  | $.02 | $.02 | $.02 |
| Number of read transactions (File count * 1%) | 20,000 | 20,000 | 20,000 |
| Cost of a single read operation | $0.0005 | $0.0005 | $0.0005 |
| Cost to rehydrate | $30.48 | $30.48 | $30.48 |
| **Total Cost**  | **$151.86** | **$131.86** | **$131.86** |


### Continuously tiering cold hot blobs to archive 

A data in cloud is typically hot in processing in first few months. You can measure your data temperature pattern by analysis with inventory. It would make sense to tier actual cold data to archive continuously for cost saving. 

In this scenario, archiving cost would be required every month for new aged data that are fitted to archive. You need to spend on archive capacity for accumulated data and needed rehydration as well. The following example demonstrates the spending in first 12 months. 

| Factor | January | February | March |
|--------|---------|---------|----|
| Write transactions | 200,000 | 200,000 | 200,000 |
| Cost of a single write operation | $0.00001 | $0.00001 | $0.00001 |
| **Cost to write** | **$2.00** | **$2.00** | **$2.00**|
| Total file size (GB) | 10,240 | 20,480 | 39,720 |
| Data prices (pay-as-you-go) | $0.00099 | $0.00099 |$0.00099 |
| **Cost to store** (File size * data price) | **$10.14** | **$10.14** | **$10.14** | 
| Data retrieval size (file size * % storage read) | 102 | 205 | 307 |
| Cost of data retrieval (Per GB) | $.02 | $.02 | $.02 |
| Number of read transactions (File count * % storage read) | 2,000 | 4,000 | 6,000 |
| Cost of a single read operation | $0.0005 | $0.0005 | $0.0005 |
| **Cost to rehydrate** | **$30.48** | **$30.48** | **$30.48** |
| **Total Cost** (write + store + rehydrate) | **$151.86** | **$131.86** | **$131.86** |

## Archive cost comparison

Put some inference here and qualify that you also have to pay for storage in other tiers.

| Month | One-time archive up front | Continuous tiering |
|---|---|---|
| January | $151.86 | $15.19 |
| February | $131.86 | $28.37 |
| March | $131.86 | $41.56|
| April | $131.86 | $54.74 |
| May | $131.86 | $67.93 |
| June | $131.86 | $81.11 |
| July | $131.86 | $94.30 |
| August | $131.86 | $107.48 |
| September | $131.86 | $120.67 |
| October | $131.86 | $133.86 |
| November | $131.86 | $147.04|
| December | $131.86 | $160.23 |
| **Total** | **$1,602.27** | **$1,052.48** |

## Cost considerations between Cool and Archive 

Archive storage is the lowest cost tier. However, it might not be best fit for scenarios or workloads that require immediate read while Archive takes up to 15 hours to rehydrate before it’s available for read. Cool tier offers a balance with near real time read latency and lower price than Hot tier. Understanding your access requirements would help you choose between Cool and Archive. From cost perspective, you can easily compare with an estimation modeling as the following. When you adjust the forecast factor on read, you can tell clearly that the total spending is affected significantly. 



## Next steps

- [Set a blob's access tier](access-tiers-online-manage.md)
- [Archive a blob](archive-blob.md)
- [Optimize costs by automatically managing the data lifecycle](lifecycle-management-overview.md)
