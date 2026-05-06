---
title: Azure NetApp Files storage with cool access
description: Learn how to use Azure NetApp Files storage with cool access to configure inactive data to move from Azure NetApp Files service-level storage (hot tier) to an Azure storage account (cool tier).
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 03/10/2026
ms.author: anfdocs
ms.custom: references_regions
# Customer intent: As a storage administrator, I want to configure inactive data to move from a hot tier to a cool tier in Azure NetApp Files, so that I can optimize storage costs while maintaining accessibility to archived data.
---

# Azure NetApp Files storage with cool access

When you use Azure NetApp Files storage with cool access, you can configure inactive data to move from Azure NetApp Files storage (the *hot tier*) to an Azure storage account (the *cool tier*). Enabling cool access moves inactive data blocks from the volume and the volume's snapshots to the cool tier, which results in cost savings.

Most cold data is associated with unstructured data. It can account for more than 50% of the total storage capacity in many storage environments. Infrequently accessed data associated with productivity software, completed projects, and old datasets are an inefficient use of high-performance storage.

Azure NetApp Files supports cool access with the Flexible, Standard, Premium, and Ultra [service levels](azure-netapp-files-service-levels.md).

The following diagram illustrates an application with a volume enabled for cool access.

:::image type="content" source="./media/cool-access-introduction/cool-access-explainer.png" alt-text="Diagram that shows cool access tiering showing cool volumes being moved to the cool tier." lightbox="./media/cool-access-introduction/cool-access-explainer.png" border="false":::

In the initial write, data blocks are assigned a "warm" temperature value (in the diagram, red data blocks) and exist on the "hot" tier. Because the data resides on the volume, a temperature scan monitors the activity of each block. When a data block is inactive, the temperature scan decreases the value of the block until inactivity reaches the number of days specified in the coolness period. The coolness period can be set between 2 and 183 days. The default value is 31 days.

After data blocks are marked "cold," the tiering scan collects the blocks and packages them into 4-MB objects. Their move to Azure storage is transparent. To the application and users, the cool blocks still appear online. Tiered data appears to be online and continues to be available to users and applications by transparent and automated retrieval from the cool tier.

> [!NOTE]
> When you enable cool access, data that satisfies the conditions set by the coolness period moves to the cool tier. For example, if the coolness period is set to 30 days, any data that was cool for at least 30 days moves to the cool tier _when_ you enable cool access. Once the coolness period is reached, background jobs can take up to 48 hours to initiate the data transfer to the cool tier. 

By default (unless cool access retrieval policy is configured otherwise), data blocks on the cool tier that are read randomly again become "warm" and are moved back to the hot tier. After the data blocks are marked as "warm," they're again subjected to the temperature scan. Large sequential reads (like index and antivirus scans) on inactive data in the cool tier don't "warm" the data. 

Metadata is never cooled and always remains in the hot tier. Tiering doesn't affect the activities of metadata-intensive workloads like high file-count environments like chip design, version control systems, and home directories.


## Supported regions 

Azure NetApp Files storage with cool access is available in all Azure NetApp Files-enabled regions.

## Metrics 

Cool access offers [performance metrics](azure-netapp-files-metrics.md#cool-access-metrics) to understand usage patterns on a per-volume basis:

* Volume cool tier size
* Volume cool tier data read size
* Volume cool tier data write size

## Throughput for Premium and Ultra service levels 

When cool access is enabled on the Premium and Ultra service levels, throughput is adjusted at regular intervals based on the size of the data in the cool tier.  

If a volume is within the Premium or Ultra service levels with auto QoS enabled and has more than 100 GiB of cool access data, the throughput QoS limit is different for the data on hot and cool tier respectively.

Review the table to understand how throughput limit is calculated. 

| Service level | Formula without cool access | Formula with cool access | 
| - | -- | --- |
| Premium | Maximum throughput in MiB/s = Quota in TiB * 64 MiB/s | Maximum throughput in MiB/s = (Hot tier data in TiB * 64 MiB/s) + (Cool tier data in TiB * 16 MiB/s per TiB of data in the cool tier)
| Ultra | Maximum throughput in MiB/s = Quota in TiB * 128 MiB/s | Maximum throughput in MiB/s = (Hot tier data in TiB * 128 MiB/s) + (Cool tier data in TiB * 16 MiB/s per TiB of data in the cool tier) |

For example, if a volume in the Premium service level has 10 TiB of data in the hot tier, its maximum throughput is 640 MiB/s (10 TiB * 64 MiB/s). For a Premium service level deployment with 2 TiB in the cool tier and 8 TiB in the hot tier, the maximum throughput is 544 MiB/s ([8 TiB * 64 MiB/s] + [2 TiB * 16 MiB/s]).

For existing volumes in capacity pools where cool access was enabled prior to this update, the prior throughput QoS limit continues to apply as per the following table.

| Service level | Throughput with cool access | Baseline throughput (cool access never enabled) | 
| - | -- | -- |
| Premium | Quota in TiB * 36 MiB/s |  Quota in TiB * 64 MiB/s 
| Ultra | Quota in TiB * 68 MiB/s |  Quota in TiB * 128 MiB/s 

For example, a 10-TiB volume on the Premium service regularly delivers throughput of 640 MiB/s (10 TiB * 64 MiB/s). With cool access enabled regardless of the amount of data tiered, throughput is 360 MiB/s (10 TiB * 36 MiB/s).

> [!NOTE]
> You should create a new capacity pool and move the old volumes to the new capacity pools to use the updated QoS limit. 

With either throughput calculation, increasing the volume quota increases the throughput limit because throughput scales linearly with the provisioned capacity.

### Supported regions for cool access throughput for premium and ultra service levels feature

* Australia Southeast
* Brazil South
* Brazil Southeast
* Canada Central
* Canada East
* Central US
* East Asia
* Germany North 
* Germany West Central
* Israel Central 
* Japan East
* Korea South
* North Central US
* Norway East
* Qatar Central
* Southeast Asia
* Sweden Central
* Switzerland West
* UAE Central
* UK West
* West US

## Billing 

You can enable cool access for each volume in a [cool-access enabled capacity pool](manage-cool-access.md). How you're billed is based on:

* The capacity and the service level.
* Unallocated capacity within the capacity pool.
* The capacity in the cool tier.
* Network transfer between the hot tier and the cool tier. The markup on top of the transaction cost (`GET` and `PUT` requests) on blob storage and private link transfer in either direction between the hot tiers determines the rate.

Billing calculation for a capacity pool is at the hot-tier rate for the data that isn't tiered to the cool tier. Unallocated capacity within the capacity pool is included. When you enable tiering for volumes, the capacity in the cool tier is at the rate of the cool tier. The remaining capacity is at the rate of the hot tier. The rate of the cool tier is lower than the hot tier's rate. 

The deleted data in a volume is collected once it reaches 1% of the provisioned size of the volume. This impacts the size of the cool tier, if the cool tier eligible user data is also a low percentage of the volume, such as 1~3% of the provisioned size. If the difference in the cool tier size is more than 3%, [create a support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).

Data in cool access is charged at the same rate for all service levels as defined in [Azure NetApp Files pricing](https://azure.microsoft.com/pricing/details/netapp/).

## Estimate your savings

Estimate your savings from cool access in the [Azure NetApp Files effective price estimator](https://aka.ms/anfcoolaccesscalc).

:::image type="content" source="./media/cool-access-introduction/effective-price-calculator.png" alt-text="Diagram that shows the effective price calculator chart." lightbox="./media/cool-access-introduction/effective-price-calculator.png":::

:::image type="content" source="./media/cool-access-introduction/effective-price-calculator-price.png" alt-text="Diagram that shows the effective price calculator calculation." lightbox="./media/cool-access-introduction/effective-price-calculator-price.png":::

## Related content

* [Manage Azure NetApp Files storage with cool access](manage-cool-access.md)
* [Metrics for Azure NetApp Files](azure-netapp-files-metrics.md)
* [Performance considerations for Azure NetApp Files storage with cool access](performance-considerations-cool-access.md)
