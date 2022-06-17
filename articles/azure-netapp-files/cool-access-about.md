---
title: Cool access in Azure NetApp Files | Microsoft Docs
description: 
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 06/17/2022
ms.author: anfdocs
---

# Cool access in Azure NetApp Files 

The majority of cold data is associated with unstructured data. It can account for more than 50% of the total storage capacity in many storage environments. Infrequently accessed data associated with productivity software, completed projects, and old datasets is an inefficient use of a high-performance storage. 

Using Azure NetApp Files Standard service level with cool access, you can configure inactive data to move from Azure NetApp Files Standard service-level storage to an Azure storage account (the cool tier). In doing so, you free up storage that resides within Azure NetApp Files, resulting in cost saving.

You can configure Standard service level with cool access on a volume by specifying the number of days (the coolness period, ranging from 7 to 63 days) for inactive data to be considered “cool”.

When the data has remained inactive for the specified coolness period, the tiering process begins, and the data is moved to the cool tier (the Azure storage account). This tiering process might take a few days.

For example, if you specify 31 days as the coolness period, then 31 days after a data block is last accessed (read or written), it is qualified for movement to the cool tier.  

After inactive data is moved to the cool tier and if it is read randomly again, it becomes “warm” and is moved back to the standard tier. Sequential reads (such as index and antivirus scans) on inactive data in the cool tier do not warm the data and will not trigger inactive data to be moved back to the standard tier. 

Metadata is never cooled and will always remain in the standard tier. As such, the activities of metadata-intensive workloads (for example, high file-count environments like chip design, VCS, and home directories) are not impacted by tiering.

## Effects of cool access on data

This section describes a large-duration, large-dataset warming test. It shows an example scenario of a dataset where 100% of the data is in the cool tier and how it warms over time.   

Typical randomly accessed data starts as part of a working set (read, modify, and write). As data loses relevance, it becomes cool and is eventually tiered off to the object storage.  

Cool data might become hot again. It’s not typical for the entire working set to start as cold, but some scenarios do exist, for example, audits, year-end processing, quarter-end processing, lawsuits, and end-of-year licensure reviews.  
This scenario provides insight to the warming performance behavior of a 100% cooled dataset. The insight applies whether it's a small percentage or the entire dataset.

### 4k random-read test

This section describes a 4k random-read test across 160 files totaling 10-TB of data.   

**Setup** 

**Region:** Japan <br>
**Capacity pool size:** 100 TB capacity pool <br>
**Volume allocated capacity:** 100-TB volumes <br>
**Working Dataset:** 10 TB <br>
**Service Level:** Standard service level with cool access <br>
**Volume Count/Size:** 1 <br>
**Client Count:** Four standard 8s clients <br>
**OS:** RHEL 8.3 <br>
**Mount Option:** `rw,nconnect=8,hard,rsize=262144,wsize=262144,vers=3,tcp,bg,hard`

**Methodology**

This test was set up via FIO to run a 4k random-read test across 160 files totaling 10-TB of data. FIO was configured to randomly read each block across the entire working dataset. (That is, it can read any block any number of times as part of the test instead of touching each block once). This script was called once every 5 minutes and then a data point collected on performance. When blocks are randomly read, they are moved to the standard tier.

This test had an extremely large dataset and ran several days starting the worst-case most-aged data (all caches dumped). The time component of the X axis has been removed because the total time to rewarm will vary significantly due to the dataset size.  This curve could be in days, hours, minutes, or even seconds depending on the dataset. 

**Results**

The following chart shows a test that ran over 2.5 days on the 10-TB working dataset that had been 100% cooled and the buffers cleared (absolute worst-case aged data). 

:::image type="content" source="../media/azure-netapp-files/cool-access-test-chart.png" alt-text="Chart titled Cool access Read IOPS warming cooled tier, long duration, 10TB working set. The y-axis is titled IOPS and show ranges from 0 to 140,000 in increments of 20,000. The x-axis is titled Behavior Over Time. A line charting Read IOPs is roughly flat until the right-most third of the x-axis where growth is approximately exponential " lightbox="../media/azure-netapp-files/cool-access-test-chart.png"::: 

### 64k sequential-read test

**Setup**

**Region:** Japan <br>
**Capacity pool size:** 100-TB capacity pool <br>
**Volume allocated capacity:** 100-TB volumes <br>
**Working Dataset:** 10 TB <br>
**Service Level:** Standard service level with cool access <br>
**Volume Count/Size:** 1 <br>
**Client Count:** 1 large client <br>
**OS:** RHEL 8.3 <br>
**Mount Option:** `rw,nconnect=8,hard,rsize=262144,wsize=262144,vers=3,tcp,bg,hard` <br>

**Methodology**

Sequentially read blocks are not rewarmed to the standard tier. However, small dataset sizes might see performance improvements because of caching (no performance change guarantees). 
 
This test provides the following data points: 
* 100% standard tier dataset 
* 100% cool tier dataset 

This test ran for 30 minutes to obtain a stable performance number.  

**Results**

The following table summarizes the test results: 

| 64-k sequential | Read throughput | 
|-|-|
| Hot data | 1,683 MB/s |
| Cool data | 899 MB/s |

### Test conclusions 

The measurements and testing executed in this section are difficult to reproduce. The numbers here show worst-case scenarios. There are diagnostic-level commands that allowed buffers to be dumped and timers shortened, so this testing could be achieved in a reasonable timeframe, and FIO scripts tuned to achieve the goals of each test.  

Data read from the cool tier experiences a performance hit. If you size your time to cool off correctly, then you might not experience a performance hit at all. You might have very little cool tier access, and a 30-day window is perfect for keeping warm data warm.

You should avoid a situation that churns blocks between the standard tier and the cool tier. For instance,  you set a workload for data to cool 7 days, and you randomly read a large percentage of the dataset every 11 days.

In summary, if your working set is predictable, you can save cost by moving infrequently accessed data blocks to the cool tier. The 7 to 30 day wait range before cooling provides a large window for working sets that are rarely accessed after they are dormant or do not require the standard-tier speeds when they are accessed.

## Metrics 

To support this functionality, the following new [Azure NetApp Files metrics](azure-netapp-files-metrics.md) are available on a per-volume basis:
* Logical capacity in performance tier
* Logical capacity in Azure storage (tiered data)
* Egress data (data tiered out using PUT)
* Ingress data (data read via GET)

## Billing 

You can enable tiering at the volume level for a newly created capacity pool that uses the Standard service level. How you are billed will be based on the following factors: 

* The capacity in the Standard service level
* The capacity in the cool tier (by enabling tiering for volumes in a Standard capacity pool)
* Network transfer between the standard tier and the cool tier at the rate determined by the markup on top of the transaction cost (GET, PUT) on blob storage and private link transfer in either direction between the standard tiers.

Billing calculation for a Standard capacity pool will be at the standard tier rate for the data that is not tiered to the cool tier. When you enable tiering for volumes, the capacity in the cool tier will be at the rate of the cool tier (which is lower than the standard tier), and the remaining capacity will be at the rate of the standard tier. 

### Billing structure examples

Assume that you created a 4 TiB Standard capacity pool. The billing structure will be at the Standard capacity tier rate for the entire 4TiB. 

When you create volumes in the capacity pool and start tiering data to the cool tier, the following examples shows you the applicable billing structure: 

1. Assume that you create 3 volumes with 1 TiB each. You do not enable tiering at the volume level. The billing calculation will be as follows: 
* 4-TiB capacity at the standard tier rate
* Zero capacity at the cool tier rate
* Zero network transfer between the standard tier and the cool tier at the rate determined by the markup on top of the transaction cost (GET, PUT) on blob storage and private link transfer in either direction between the standard tiers.
1. Assume that you create 4 volumes with 1 TiB each. Each volume has 0.25 TiB of the volume capacity on the standard tier, and 0.75 TiB of the volume capacity in the cool tier. The billing calculation will be as follows: 
* 1-TiB capacity at the standard tier rate
* 3-TiB capacity at the cool tier rate
* Network transfer between the standard tier and the cool tier at the rate determined by the markup on top of the transaction cost (GET, PUT) on blob storage and private link transfer in either direction between the standard tiers.
1. Assume that you create 2 volumes with 1 TiB each. Each volume has 0.25 TiB of the volume capacity on the standard tier, and 0.75 TiB of the volume capacity in the cool tier. The billing calculation will be as follows: 
* 2.5 TiB capacity at the standard tier rate
* 1.5 TiB capacity at the cool tier rate
* Network transfer between the standard tier and the cool tier at the rate determined by the markup on top of the transaction cost (GET, PUT) on blob storage and private link transfer in either direction between the standard tiers.
1. Assume that you create 1 volume with 1 TiB. The volume has 0.25 TiB of the volume capacity on the standard tier, 0.75 of the volume capacity in the cool tier. The billing calculation will be as follows: 
* 3.25 capacity at the standard tier rate
* 0.75 TiB capacity at the cool tier rate
* Network transfer between the standard tier and the cool tier at the rate determined by the markup on top of the transaction cost (GET, PUT) on blob storage and private link transfer in either direction between the standard tiers.

## Next steps

* [Manage Azure NetApp Files Standard service level with cool access](manage-cool-access.md)