---
title: Azure NetApp Files storage with cool access
description: Learn how to use Azure NetApp Files storage with cool access to configure inactive data to move from Azure NetApp Files service-level storage (hot tier) to an Azure storage account (cool tier).
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 03/05/2026
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

## Billing 

You can enable cool access for each volume in a [cool-access enabled capacity pool](manage-cool-access.md). How you're billed is based on:

* The capacity and the service level.
* Unallocated capacity within the capacity pool.
* The capacity in the cool tier.
* Network transfer between the hot tier and the cool tier. The markup on top of the transaction cost (`GET` and `PUT` requests) on blob storage and private link transfer in either direction between the hot tiers determines the rate.

Billing calculation for a capacity pool is at the hot-tier rate for the data that isn't tiered to the cool tier. Unallocated capacity within the capacity pool is included. When you enable tiering for volumes, the capacity in the cool tier is at the rate of the cool tier. The remaining capacity is at the rate of the hot tier. The rate of the cool tier is lower than the hot tier's rate. 

The deleted data in a volume is collected once it reaches 1% of the provisioned size of the volume. This impacts the size of the cool tier, if the cool tier eligible user data is also a low percentage of the volume, such as 1~3% of the provisioned size. If the difference in the cool tier size is more than 3%, [create a support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).

## Calculate your savings

Calculate your savings from cool access in the [Azure NetApp Files effective price estimator](https://aka.ms/anfcoolaccesscalc).

:::image type="content" source="./media/cool-access-introduction/effective-price-calculator.png" alt-text="Diagram that shows the effective price calculator chart." lightbox="./media/cool-access-introduction/effective-price-calculator.png":::

:::image type="content" source="./media/cool-access-introduction/effective-price-calculator-price.png" alt-text="Diagram that shows the effective price calculator calculation." lightbox="./media/cool-access-introduction/effective-price-calculator-price.png":::

## Related content

* [Manage Azure NetApp Files storage with cool access](manage-cool-access.md)
* [Metrics for Azure NetApp Files](azure-netapp-files-metrics.md)
* [Performance considerations for Azure NetApp Files storage with cool access](performance-considerations-cool-access.md)
