---
title: Standard storage with cool access in Azure NetApp Files
description: Explains how to use standard storage with cool access to configure inactive data to move from Azure NetApp Files Standard service-level storage (the hot tier) to an Azure storage account (the cool tier).
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 11/01/2023
ms.author: anfdocs
ms.custom: references_regions
---

# Standard storage with cool access in Azure NetApp Files 

Using Azure NetApp Files standard storage with cool access, you can configure inactive data to move from Azure NetApp Files Standard service-level storage (the *hot tier*) to an Azure storage account (the *cool tier*). In doing so, data blocks that haven't been accessed for some time will be kept and stored in the cool tier, resulting in cost savings.

Most cold data is associated with unstructured data. It can account for more than 50% of the total storage capacity in many storage environments. Infrequently accessed data associated with productivity software, completed projects, and old datasets are an inefficient use of a high-performance storage. 

Azure NetApp Files supports three [service levels](azure-netapp-files-service-levels.md) that can be configured at capacity pool level (Standard, Premium and Ultra). Cool access is an additional service only on the Standard service level. Standard storage with cool access is supported only on capacity pools of the **auto** QoS type.  

The following diagram illustrates an application with a volume enabled for cool access.

:::image type="content" source="./media/cool-access-introduction/cool-access-explainer.png" alt-text="Diagram of cool access tiering showing cool volumes being moved to the cool tier." lightbox="./media/cool-access-introduction/cool-access-explainer.png" border="false":::

In the initial write, data blocks are assigned a "warm" temperature value (in the diagram, red data blocks) and exist on the "hot" tier. As the data resides on the volume, a temperature scan monitors the activity of each block. When a data block is inactive, the temperature scan decreases the value of the block until it has been inactive for the number of days specified in the cooling period. The cooling period can be between 7 and 183 days; it has a default value of 31 days. Once marked "cold,"  the tiering scan collects blocks and packages them into 4-MB objects, which are moved to Azure storage fully transparently. To the application and users, those cool blocks still appear online. Tiered data appears to be online and continues to be available to users and applications by transparent and automated retrieval from the cool tier.

By `Default` (unless cool access retrieval policy is configured otherwise), data blocks on the cool tier that are read randomly again become "warm" and are moved back to the hot tier. Once marked as _warm_, the data blocks are again subjected to the temperature scan. However, large sequential reads (such as index and antivirus scans) on inactive data in the cool tier don't "warm" the data nor do they trigger inactive data to be moved back to the hot tier.

Metadata is never cooled and always remains in the hot tier. As such, the activities of metadata-intensive workloads (for example, high file-count environments like chip design, VCS, and home directories) aren't affected by tiering.

## Supported regions 

Standard storage with cool access is supported for the following regions: 

* Australia Central
* Australia Central 2
* Australia East 
* Australia Southeast
* Brazil South 
* Brazil Southeast
* Canada Central 
* Canada East
* Central India 
* Central US
* East Asia  
* East US 2   
* France Central
* Germany West Central
* Japan East
* Japan West 
* North Central US 
* North Europe  
* Norway East
* Norway West
* Qatar Central
* Southeast Asia
* Switzerland North 
* Switzerland West 
* Sweden Central
* UAE Central
* UAE North 
* UK South
* UK West
* US Gov Arizona
* US Gov Texas
* US Gov Virginia 
* West US
* West US 2
* West US 3

## Effects of cool access on data

This section describes a large-duration, large-dataset warming test. It shows an example scenario of a dataset where 100% of the data is in the cool tier and how it warms over time.   

Typical randomly accessed data starts as part of a working set (read, modify, and write). As data loses relevance, it becomes "cool" and is eventually tiered off to the cool tier.  

Cool data might become hot again. It’s not typical for the entire working set to start as cold, but some scenarios do exist, for example, audits, year-end processing, quarter-end processing, lawsuits, and end-of-year licensure reviews.  

This scenario provides insight to the warming performance behavior of a 100% cooled dataset. The insight applies whether it's a small percentage or the entire dataset.

### 4k random-read test

This section describes a 4k random-read test across 160 files totaling 10 TB of data.   

#### Setup 

**Capacity pool size:** 100-TB capacity pool <br>
**Volume allocated capacity:** 100-TB volumes <br>
**Working Dataset:** 10 TB <br>
**Service Level:** Standard storage with cool access <br>
**Volume Count/Size:** 1 <br>
**Client Count:** Four standard 8-s clients <br>
**OS:** RHEL 8.3 <br>
**Mount Option:** `rw,nconnect=8,hard,rsize=262144,wsize=262144,vers=3,tcp,bg,hard`

#### Methodology

This test was set up via FIO to run a 4k random-read test across 160 files that total 10 TB of data. FIO was configured to randomly read each block across the entire working dataset. (It can read any block any number of times as part of the test instead of touching each block once). This script was called once every 5 minutes and then a data point collected on performance. When blocks are randomly read, they're moved to the hot tier.

This test had a large dataset and ran several days starting the worst-case most-aged data (all caches dumped). The time component of the X axis has been removed because the total time to rewarm varies due to the dataset size. This curve could be in days, hours, minutes, or even seconds depending on the dataset. 

#### Results

The following chart shows a test that ran over 2.5 days on the 10-TB working dataset that has been 100% cooled and the buffers cleared (absolute worst-case aged data). 

:::image type="content" source="./media/cool-access-introduction/cool-access-test-chart.png" alt-text="Diagram that shows cool access read IOPS warming cooled tier, long duration, and 10-TB working set. The y-axis is titled IOPS, ranging from 0 to 140,000 in increments of 20,000. The x-axis is titled Behavior Over Time. A line charting Read IOPs is roughly flat until the right-most third of the x-axis where growth is exponential." lightbox="./media/cool-access-introduction/cool-access-test-chart.png"::: 

### 64k sequential-read test

#### Setup 

**Capacity pool size:** 100-TB capacity pool <br>
**Volume allocated capacity:** 100-TB volumes <br>
**Working Dataset:** 10 TB <br>
**Service Level:** Standard storage with cool access <br>
**Volume Count/Size:** 1 <br>
**Client Count:** One large client <br>
**OS:** RHEL 8.3 <br>
**Mount Option:** `rw,nconnect=8,hard,rsize=262144,wsize=262144,vers=3,tcp,bg,hard` <br>

#### Methodology

Sequentially read blocks aren't rewarmed to the hot tier. However, small dataset sizes might see performance improvements because of caching (no performance change guarantees). 
 
This test provides the following data points: 
* 100% hot tier dataset 
* 100% cool tier dataset 

This test ran for 30 minutes to obtain a stable performance number.  

#### Results

The following table summarizes the test results: 

| 64-k sequential | Read throughput | 
|-|-|
| Hot data | 1,683 MB/s |
| Cool data | 899 MB/s |

### Test conclusions 

Data read from the cool tier experiences a performance hit. If you size your time to cool off correctly, then you might not experience a performance hit at all. You might have little cool tier access, and a 30-day window is perfect for keeping warm data warm.

You should avoid a situation that churns blocks between the hot tier and the cool tier. For instance, you set a workload for data to cool seven days, and you randomly read a large percentage of the dataset every 11 days.

In summary, if your working set is predictable, you can save cost by moving infrequently accessed data blocks to the cool tier. The 7 to 30 day wait range before cooling provides a large window for working sets that are rarely accessed after they're dormant or don't require the hot-tier speeds when they're accessed.

## Metrics 

Cool access offers [performance metrics](azure-netapp-files-metrics.md#cool-access-metrics) to understand usage patterns on a per volume basis: 
* Volume cool tier size
* Volume cool tier data read size
* Volume cool tier data write size

## Billing 

You can enable tiering at the volume level for a newly created capacity pool that uses the Standard service level. How you're billed is based on the following factors: 

* The capacity in the Standard service level
* Unallocated capacity within the capacity pool
* The capacity in the cool tier (by enabling tiering for volumes in a Standard capacity pool)
* Network transfer between the hot tier and the cool tier at the rate that is determined by the markup on top of the transaction cost (`GET` and `PUT` requests) on blob storage and private link transfer in either direction between the hot tiers.

Billing calculation for a Standard capacity pool is at the hot-tier rate for the data that isn't tiered to the cool tier; this includes unallocated capacity within the capacity pool.  When you enable tiering for volumes, the capacity in the cool tier will be at the rate of the cool tier, and the remaining capacity will be at the rate of the hot tier. The rate of the cool tier is lower than the hot tier's rate. 

### Examples of billing structure

Assume that you created a 4 TiB Standard capacity pool. The billing structure is at the Standard capacity tier rate for the entire 4 TiB. 

When you create volumes in the capacity pool and start tiering data to the cool tier, the following scenarios explain the applicable billing structure: 

* Assume that you create three volumes with 1 TiB each. You don't enable tiering at the volume level. The billing calculation is as follows: 

    * 3 TiB of allocated capacity at the hot tier rate
    * 1 TiB of unallocated capacity at the hot tier rate
    * Zero capacity at the cool tier rate
    * Zero network transfer between the hot tier and the cool tier at the rate determined by the markup on top of the transaction cost (`GET`, `PUT`) on blob storage and private link transfer in either direction between the hot tiers.

* Assume that you create four volumes with 1 TiB each. Each volume has 0.25 TiB of the volume capacity on the hot tier, and 0.75 TiB of the volume capacity in the cool tier. The billing calculation is as follows: 

    * 1-TiB capacity at the hot tier rate
    * 3-TiB capacity at the cool tier rate
    * Network transfer between the hot tier and the cool tier at the rate determined by the markup on top of the transaction cost (`GET`, `PUT`) on blob storage and private link transfer in either direction between the hot tiers.

* Assume that you create two volumes with 1 TiB each. Each volume has 0.25 TiB of the volume capacity on the hot tier, and 0.75 TiB of the volume capacity in the cool tier. The billing calculation is as follows: 

    * 0.5-TiB capacity at the hot tier rate
    * 2 TiB of unallocated capacity at the hot tier rate 
    * 1.5-TiB capacity at the cool tier rate
    * Network transfer between the hot tier and the cool tier at the rate determined by the markup on top of the transaction cost (`GET`, `PUT`) on blob storage and private link transfer in either direction between the hot tiers.

* Assume that you create one volume with 1 TiB. The volume has 0.25 TiB of the volume capacity on the hot tier, 0.75 of the volume capacity in the cool tier. The billing calculation is as follows: 

    * 0.25-TiB capacity at the hot tier rate
    * 0.75-TiB capacity at the cool tier rate
    * Network transfer between the hot tier and the cool tier at the rate determined by the markup on top of the transaction cost (`GET`, `PUT`) on blob storage and private link transfer in either direction between the hot tiers.

### Examples of cost calculations with varying coolness periods

This section shows you examples of storage and network transfer costs with varying coolness periods. 

In these examples, assume:   
* The hot tier storage cost is $0.000202/GiB/hr. The cool tier storage cost is $0.000082/GiB/hr.  
* Network transfer cost (including read or write activities from the cool tier) is $0.020000/GiB.
* You have a 5-TiB capacity pool with cool access enabled.
* You have 1 TiB of unallocated capacity within the capacity pool
* You have a 4-TiB volume enabled for cool access.
* 3 TiB of the 4 TiB is moved to the cool tier after the coolness period. 
* You read or write 20% of data each month from the cool tier.
* Each month is 30 days or 730 hours. So each day is 730/30 hours. 

> [!IMPORTANT]
> * These calculations must only be used as a reference estimate and not for validating the exactness of the bill amount.  
> * The rates considered in the examples are for an example region and may be different for your intended region of deployment. 
> * If data is read from or written to the cool tier, it will cause the percentage of data distribution in the hot tier and cool tier to change. The calculations in this article demonstrate initial percentage distribution in the hot and cool tiers, and not after the 20% of data has been moved to or from the cool tier.

> [!NOTE]
> The following examples include 1 TiB of unallocated space in the capacity pool to show how unallocated space is charged when cool access is enabled. To maximize your savings, the capacity pool size should be reduced to eliminate unallocated pool capacity. 

#### Example 1: Coolness period is set to 7 days

Your storage cost for the *first month* would be:

| Cost | Description | Calculation |
|---|---|---|
| Unallocated storage cost for Day 1~30 (30 days) | 1 TiB of unallocated storage | `1 TiB x 1024 x 30 days x 730/30 hrs. x $0.000202/GiB/hr. = $151.00`  |
| Storage cost for Day 1~7 (seven days) | 4 TiB of active data (hot tier) | `4 TiB x 1024 x 7 days x 730/30 hrs. x $0.000202/GiB/hr. = $140.93` |
| Storage cost for Day 8~30 (23 days) | 1 TiB of active data (hot tier) <br><br> 3 TiB of inactive data (cool tier) | `1 TiB x 1024 x 23 days x 730/30 hrs. x $0.000202/GiB/hr. = $115.77` <br><br> `3 TiB x 1024 x 23 days x 730/30 hrs. x $0.000082/GiB/hr. = $140.98` |
| Network transfer cost | Moving inactive data to cool tier <br><br> 20% of data read/write from cool tier | `3 TiB x 1024 x $0.020000/GiB = $61.44` <br><br> `3 TiB x 1024 x 20% x $0.020000/GiB = $12.29` |
| **First month total** || **`$622.41`** |

Your monthly storage cost for the *second and subsequent months* would be: 

| Cost | Description | Calculation |
|---|---|---|
| Storage cost for 30 days | 1 TiB of unallocated storage <br><br> 1 TiB of active data (hot tier) <br><br> 3 TiB of inactive data (cool tier) | `1 TiB x 1024 x 30 days x 730/30 hrs. x $0.000202/GiB/hr. = $151.00` <br><br> `1 TiB x 1024 x 30 days x 730/30 hrs. x $0.000202/GiB/hr. = $151.00` <br><br> `3 TiB x 1024 x 30 days x 730/30 hrs. x $0.000082/GiB/hr. = $183.89` |
| Network transfer cost | 20% of data read/write from cool tier | `3 TiB x 1024 x 20% x $0.020000/GiB = $12.29` |
| **Second and subsequent monthly total** || **`$498.18`** |

Your first six-month savings:  
* Cost without cool access: `5 TiB x 1024 x $0.000202/GiB/hr. x 730 hrs. x 6 months = $4,529.97`
* Cost with cool access: 
    `First month + Second month + … + Sixth month = $622.41 + (5x $498.18) = $3,113.31`
* Savings using cool access: **`31.27%`**
																				
Your first twelve-month savings: 
* Cost without cool access: `5 TiB x 1024 x $0.000202/GiB/hr. x 730 hrs. x 12 months = $9,059.94`
* Cost with cool access: `First month + Second month + … + twelfth month = $622.41 + (11 x $498.18) = $6,102.39`
* Savings using cool access: **`32.64%`**

#### Example 2: Coolness period is set to 35 days

All 5 TiB is active data (in hot tier) for the first month. Your storage cost for the *first month* would be: 
`5 TiB x 1024 x 730hr. x $0.000202/GiB/hr. = $755.00`

Your storage cost for the *second month* would be:

| Cost | Description | Calculation |
|---|---|---|
| Unallocated storage cost for Day 1~30 (30 days) | 1 TiB of unallocated storage | `1 TiB x 1024 x 30 days x 730/30 hrs. x $0.000202/GiB/hr. = $151.00` |
| Storage cost for Day 1~5 (five days) | 4 TiB of active data (hot tier) | `4 TiB x 1024 x 5 days x 730/30 hrs. x $0.000202/GiB/hr. = $100.67` |
| Storage cost for Day 6~30 (25 days) | 1 TiB of active data (hot tier) <br><br> 3 TiB of inactive data (cool tier) | `1 TiB x 1024 x 25 days x 730/30 hrs. x $0.000202/GiB/hr. = $125.83` <br><br> `3 TiB x 1024 x 25 days x 730/30 hrs. x $0.000082/GiB/hr. = $153.24` |
| Network transfer cost | Moving inactive data to cool tier <br><br> 20% of data read/write from cool tier | `3 TiB x 1024 x $0.020000	/GiB	 = $61.44` <br><br> `3 TiB x 1024 x 20% x $0.020000/GiB = $12.29` |
| **Second month total** || **`$604.47`** |

Your monthly storage cost for *third and subsequent months* would be:

| Cost | Description | Calculation |
|---|---|---|
| Storage cost for 30 days | 1 TiB of unallocated storage <br><br>  1 TiB of active data (hot tier) <br><br> 3 TiB of inactive data (cool tier) | `1 TiB x 1024 x 30 days x 730/30 hrs. x $0.000202/GiB/hr. = $151.00`<br><br> `1 TiB x 1024 x 30 days x 730/30 hrs. x $0.000202/GiB/hr. = $151.00` <br><br> `3 TiB x 1024 x 30 days x 730/30 hrs. x $0.000082/GiB/hr. = $183.89` |
| Network transfer cost | 20% of data read/write from cool tier | `3 TiB x 1024 x 20% x $0.020000/GiB = $12.29` |
| **Third and subsequent monthly total** || **`$498.18`** |

Your first six-month savings:  
* Cost without cool access: `5 TiB x 1024 x $0.000202/GiB/hr. x 730 hrs. x 6 months = $4,529.97`
* Cost with cool access: 
    `First month + Second month + … + Sixth month = $755.00 + $604.47 + (4 x $498.18) = $3,352.19`
* Savings using cool access: **`25.99%`**
																				
Your first twelve-month savings: 
* Cost without cool access: `5 TiB x 1024 x $0.000202/GiB/hr. x 730 hrs. x 12 months = $9,059.94`
* Cost with cool access: `First month + Second month + … + twelfth month = $755.00 + $604.47 + (10 x $498.18) = $6,341.27`
* Savings using cool access: **`30.00%`**


#### Example 3: Coolness period is set to 63 days

All 5 TiB is active data (in hot tier) for the first two months. Your monthly storage cost for the *first and second months* would be: `5 TiB x 1024 x 730hr. x $0.000202/GiB/hr. = $755.00`

Your storage cost for the *third month* would be:

| Cost | Description | Calculation |
|---|---|---|
| Unallocated storage cost for Day 1~30 (30 days) | 1 TiB of unallocated storage | `1 TiB x 1024 x 30 days x 730/30 hrs. x $0.000202/GiB/hr. = $151.00` |
| Storage cost for Day 1~3 (three days) | 4 TiB of active data (hot tier) | `4 TiB x 1024 x 3 days x 730/30 hrs. x $0.000202/GiB/hr. = $60.40` |
| Storage cost for Day 4~30 (27 days) | 1 TiB of active data (hot tier) <br><br> 3 TiB of inactive data (cool tier) | `1 TiB x 1024 x 27 days x 730/30 hrs. x $0.000202/GiB/hr. = $135.90` <br><br> `3 TiB x 1024 x 27 days x 730/30 hrs. x $0.000082/GiB/hr. = $165.50` |
| Network transfer cost | Moving inactive data to cool tier <br><br> 20% of data read/write from cool tier | `3 TiB x 1024 x $0.020000/GiB = $61.44` <br><br> `3 TiB x 1024 x 20% x $0.020000/GiB = $12.29` |
| **Third month total** || **`$586.52`** |

Your monthly storage cost for the *fourth and subsequent months* would be:

| Cost | Description | Calculation |
|---|---|---|
| Storage cost for 30 days | 1 TiB of unallocated storage <br><br> 1 TiB of active data (hot tier) <br><br> 3 TiB of inactive data (cool tier) | `1 TiB x 1024 x 30 days x 730/30 hrs. x $0.000202/GiB/hr. = $151.00` <br><br> `1 TiB x 1024 x 30 days x 730/30 hrs. x $0.000202/GiB/hr. = $151.00` <br><br> `3 TiB x 1024 x 30 days x 730/30 hrs. x $0.000082/GiB/hr. = $183.89` |
| Network transfer cost | 20% of data read/write from cool tier | `3 TiB x 1024 x 20% x $0.020000/GiB = $12.29` |
| **Fourth and subsequent monthly total** || **`$498.18`** |

Your first six-month savings:  
* Cost without cool access: `5 TiB x 1024 x $0.000202/GiB/hr. x 730 hrs. x 6 months = $4,529.97`
* Cost with cool access: 
    `First month + Second month + … + Sixth month = (2 x $755.00) + $586.52 + (3 x $498.18) = $3,591.06`
* Savings using cool access: **`20.73%`**
																				
Your first twelve-month savings: 
* Cost without cool access: `5 TiB x 1024 x $0.000202/GiB/hr. x 730 hrs. x 12 months = $9,059.94`
* Cost with cool access: `First month + Second month + … + twelfth month = (2 x $755.00) + $586.52 + (9 x $498.18) = $6,580.14`
* Savings using cool access: **`27.37%`**


> [!TIP]     
> You can use the [Azure NetApp Files standard storage with cool access cost savings estimator](https://aka.ms/anfcoolaccesscalc) to interactively estimate cost savings based on changeable input parameters.

## Next steps

* [Manage Azure NetApp Files standard storage with cool access](manage-cool-access.md)
* [Metrics for Azure NetApp Files](azure-netapp-files-metrics.md)
