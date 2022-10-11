---
title: Estimate the cost of archiving data (Azure Blob Storage)
titleSuffix: Azure Storage
description: Learn how to calculate the cost of storing and maintaining data in the archive storage tier.
author: normesta
ms.author: normesta
ms.date: 10/07/2022
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual

---

# Estimate the cost of archiving data

The archive tier is an offline tier for storing data that is rarely accessed. The archive access tier has the lowest storage cost. However, this tier has higher data retrieval costs with a higher latency as compared to the hot and cool tiers.

The cost to archive data is derived from these three components:

- Cost to write data to the archive tier
- Cost to store data in the archive tier
- Cost to rehydrate data from the archive tier

This article explains how to calculate each component and then presents a few example scenarios. 

## Example prices used in this article

This article uses the following fictitious prices. While these prices may closely correlate to currently published prices, they are meant only as examples and should not be used to calculate your costs. 

| Cost factor                                          | Archive  | Cool      |
|------------------------------------------------------|----------|-----------|
| Cost of write transactions (per 10,000)              | $0.10    | $0.10     |
| Cost of a single write operation (cost / 10,000)     | $0.00001 | $0.00001  |
| Data prices (pay-as-you-go)                          | $0.00099 | $ 0.0152  |
| Cost of read transactions (per 10,000)               | $5.00    | $ 0.01    |
| Cost of a single read operation (cost / 10,000)      | $0.0005  | $0.000001 |
| Cost of high priority read transactions (per 10,000) | $50.00   | N/A       |
| Cost of data retrieval (per GB)                      | $0.02    | $0.01     |
| Cost of high priority data retrieval (per GB)        | $0.10    | N/A       |

For official prices, see [Azure Blob Storage pricing](/pricing/details/storage/blobs/) or [Azure Data Lake Storage pricing](pricing/details/storage/data-lake/). 

For more information about how to choose the correct pricing page, see [Understand the full billing model for Azure Blob Storage](../common/storage-plan-manage-costs.md).

## Cost to write data to the archive tier

You can calculate the cost of writing to the archive tier by multiplying the number of write operations by the cost of each operation. 

By default, the number of operations is the same as the number of blobs you plan to write to the archive tier. For example, if you plan to write `30,000` blobs to the archive tier, then that will require `30,000` operations. If you have enabled a hierarchical namespace, then the payload of each operation is limited to `4 MB`. That means that a `1 GB` file, would require `250` separate operations to complete.

Operations are billed per `10,000`. Therefore, if the cost per `10,000` operations is `$0.10`, then the cost of a single operation is `$0.10` / `10,000` = `$0.00001`.

The total cost is the number of operations multiplied by the cost of each operation. For example (using these pricing assumptions), if you plan to archive `30,000` blobs in an account that does not have a hierarchical namespace, the cost would be `30,000` * `$0.00001` = `$0.30`

## Cost to store data to the archive tier

You can calculate what it costs to store data in the archive tier by multiplying the size of the data in GB by the cost of archive storage.

For example (assuming the sample pricing), if you plan to store `10 TB` archived blobs, the capacity cost is `$0.00099` * `10` * `1024` = `$10.14` per month. 

## Cost to rehydrate data from the archive tier

While a blob is in the archive access tier, it's considered to be offline, and can't be read or modified. In order to read or modify data in an archived blob, you must first rehydrate the blob to an online tier, either the hot or hool tier. 

You can calculate the cost to rehydrate data by adding the cost to _retrieve_ data to the cost of _reading_ the data.

Start by multiplying the number of GB that you plan to retrieve by the cost per GB.  For example (assuming sample pricing) the cost of retrieving 1 GB of data from the archive tier would be `1` * `$0.02` = `$0.02`. 

Next, calculate the number of blobs that you plan to retrieve by the cost of each read operation. Like the write operation described earlier, read operations are billed per `10,000`. Therefore, if the cost per `10,000` operations is `$5.00`, then the cost of a single operation is `$5.00` / `10,000` = `$0.0005`. Assuming sample pricing, the cost of retrieving `1000` blobs at standard priority is `1000` * `$0.0005` = `$0.52`

> [!NOTE]
> If you set the rehydration priority to high, then the data retrieval and read rates increase.

If you plan to rehydrate data, you should try to avoid an early deletion fee. To review your options, see [Blob rehydration from the Archive tier](archive-rehydrate-overview.md).

### One-time on-prem data backup to Archive 

It's one of common scenarios that you need to remove on-prem tapes or file servers and migrate backup data to cloud storage. If the access rate is expected low and you want to save spending, Archive storage is the best fitted option. 

In this scenario, archiving cost would be required for the first month as one time effort. In rest of months, you need to spend on archive capacity and needed rehydration. 

Using the example data from the previous sections, this table demonstrates the spending for three months. 

This scenario assumes an initial ingest of 2,000,000 files totaling 102,400 GB in size to archive. It also assumes 1 read each month about about 1% of archived capacity.

<br>
<table>
    <tr>
        <th>Cost factor</th>
        <th>January</th>
        <th>February</th>
        <th>March</th>
        <th>Projected annual</th>
    </tr>
    <tr>
        <td>Write transactions</td>
        <td>2,000,000</td>
        <td>0</td>
        <td>0</td>
        <td>2,000,000</td>
    </tr>
    <tr>
        <td>Cost of a single write operation</td>
        <td>$0.00001</td>
        <td>$0.00001</td>
        <td>$0.00001</td>
        <td>$0.00001</td>
    </tr>
    <tr bgcolor="beige">
        <td>Cost to write</td>
        <td>$20.00</td>
        <td>$0.00</td>
        <td>$0.00</td>
        <td>$20.00</td>
    </tr>
    <tr>
        <td>Total file size (GB)</td>
        <td>102,400</td>
        <td>102,400</td>
        <td>102,400</td>
        <td>1,228,800</td>
    </tr>
    <tr>
        <td>Data prices (pay-as-you-go)</td>
        <td>$0.00099</td>
        <td>$0.00099</td>
        <td>$0.00099</td>
        <td>$0.00099</td>
    </tr>
    <tr bgcolor="beige">
        <td>Cost to store</td>
        <td>$101.38</td>
        <td>$101.38</td>
        <td>$101.38</td>
        <td>$1,216.51</td>
    </tr>
    <tr>
        <td>Data retrieval size</td>
        <td>1024</td>
        <td>1024</td>
        <td>1024</td>
        <td>12,288</td>
    </tr>
    <tr>
        <td>Cost of data retrieval</td>
        <td>$.02</td>
        <td>$.02</td>
        <td>$.02</td>
        <td>$.02</td>
    </tr>
    <tr>
        <td>Number of read transactions (File count * 1%)</td>
        <td>20,000</td>
        <td>20,000</td>
        <td>20,000</td>
        <td>240,000</td>
    </tr>
    <tr>
        <td>Cost of a single read operation</td>
        <td>$0.0005</td>
        <td>$0.0005</td>
        <td>$0.0005</td>
        <td>$0.0005</td>
    </tr>
    <tr bgcolor="beige">
        <td>Cost to rehydrate</td>
        <td>$30.48</td>
        <td>$30.48</td>
        <td>$30.48</td>
        <td>$365.76</td>
    </tr>
    <tr>
        <td><strong>Total cost</strong></td>
        <td><strong>$151.86</strong></td>
        <td><strong>$131.86</strong></td>
        <td><strong>$131.86</strong></td>
        <td><strong>$1,602.27</strong></td>
    </tr>
</table>


### Continuously tiering cold hot blobs to archive 

A data in cloud is typically hot in processing in first few months. You can measure your data temperature pattern by analysis with inventory. It would make sense to tier actual cold data to archive continuously for cost saving. 

In this scenario, archiving cost would be required every month for new aged data that are fitted to archive. You need to spend on archive capacity for accumulated data and needed rehydration as well. The following example demonstrates the spending in first 12 months. 

This scenario assumes a monthly ingest of 200,000 files totaling 10,240 GB in size to archive. It also assumes 1 read each month about about 1% of archived capacity.
<br><br>

<table>
    <tr>
        <th>Cost factor</th>
        <th>January</th>
        <th>February</th>
        <th>March</th>
        <th>Projected annual</th>
    </tr>
    <tr>
        <td>Write transactions</td>
        <td>200,000</td>
        <td>200,000</td>
        <td>200,000</td>
        <td>2,400,000</td>
    </tr>
    <tr>
        <td>Cost of a single write operation</td>
        <td>$0.00001</td>
        <td>$0.00001</td>
        <td>$0.00001</td>
        <td>$0.00001</td>
    </tr>
    <tr bgcolor="beige">
        <td>Cost to write</td>
        <td>$2.00</td>
        <td>$2.00</td>
        <td>$2.00</td>
        <td>$24.00</td>
    </tr>
    <tr>
        <td>Total file size (GB)</td>
        <td>10,240</td>
        <td>20,480</td>
        <td>39,720</td>
        <td>798,720</td>
    </tr>
    <tr>
        <td>Data prices (pay-as-you-go)</td>
        <td>$0.00099</td>
        <td>$0.00099</td>
        <td>$0.00099</td>
        <td>$0.00099</td>
    </tr>
    <tr bgcolor="beige">
        <td>Cost to store</td>
        <td>$10.14</td>
        <td>$20.28</td>
        <td>$30.41</td>
        <td>$790.73</td>
    </tr>
    <tr>
        <td>Cost of data retrieval</td>
        <td>$.02</td>
        <td>$.02</td>
        <td>$.02</td>
        <td>$.02</td>
    </tr>
    <tr>
        <td>Number of read transactions (File count * % storage read)</td>
        <td>2,000</td>
        <td>4,000</td>
        <td>6,000</td>
        <td>156,000</td>
    </tr>
    <tr>
        <td>Cost of a single read operation</td>
        <td>$0.0005</td>
        <td>$0.0005</td>
        <td>$0.0005</td>
        <td>$0.0005</td>
    </tr>
    <tr bgcolor="beige">
        <td>Cost to rehydrate</td>
        <td>$3.05</td>
        <td>$6.10</td>
        <td>$9.14</td>
        <td>$237.74</td>
    </tr>
    <tr>
        <td><strong>Total cost</strong></td>
        <td><strong>$15.19</strong></td>
        <td><strong>$28.37</strong></td>
        <td><strong>$41.56</strong></td>
        <td><strong>$1,052.48</strong></td>
    </tr>
</table>


## Cost considerations between cool and archive 

Archive storage is the lowest cost tier. However, it might not be best fit for scenarios or workloads that require immediate read while Archive takes up to 15 hours to rehydrate before it’s available for read. Cool tier offers a balance with near real time read latency and lower price than Hot tier. Understanding your access requirements would help you choose between Cool and Archive. From cost perspective, you can easily compare with an estimation modeling as the following. When you adjust the forecast factor on read, you can tell clearly that the total spending is affected significantly. 

This comparison uses the example pricing page presented earlier in this article. This scenario also assumes a monthly ingest of 200,000 files totaling 10,240 GB in size to archive. It also assumes 1 read each month about about 10% of stored capacity (1024 GB), and 10% of total transactions (20,000)

<br><br>
<table>
    <tr>
        <th>Cost factor</th>
        <th>Archive</th>
        <th>Cool</th>
    </tr>
    <tr>
        <td>Write transactions</td>
        <td>200,000</td>
        <td>200,000</td>
    </tr>
    <tr>
        <td>Cost of a single write operation</td>
        <td>$0.00001</td>
        <td>$0.00001</td>
    </tr>
    <tr bgcolor="beige">
        <td>Cost to write</td>
        <td>$2.00</td>
        <td>$2.00</td>
    </tr>
    <tr>
        <td>Total file size (GB)</td>
        <td>10,240</td>
        <td>10,240</td>
    </tr>
    <tr>
        <td>Data prices (pay-as-you-go)</td>
        <td>$0.0152</td>
        <td>$0.00099</td>
    </tr>
    <tr bgcolor="beige">
        <td>Cost to store</td>
        <td>$10.14</td>
        <td>$155.65</td>
    </tr>    
    <tr>
        <td>Data retrieval size</td>
        <td>1024</td>
        <td>1024</td>
    </tr>
    <tr>
        <td>Cost of data retrieval per GB</td>
        <td>$.02</td>
        <td>$.01</td>
    </tr>
    <tr>
        <td>Number of read transactions</td>
        <td>20,000</td>
        <td>20,000</td>
    </tr>
    <tr>
        <td>Cost of a single read operation</td>
        <td>$0.000001</td>
        <td>$0.0005</td>
    </tr>
    <tr bgcolor="beige">
        <td>Cost to rehydrate</td>
        <td>$30.48</td>
        <td>$10.26</td>
    </tr>
    <tr>
        <td><strong>Monthly cost</strong></td>
        <td><strong>$42.62</strong></td>
        <td><strong>$167.91</strong></td>
    </tr>
</table>

## Next steps

- [Set a blob's access tier](access-tiers-online-manage.md)
- [Archive a blob](archive-blob.md)
- [Optimize costs by automatically managing the data lifecycle](lifecycle-management-overview.md)
