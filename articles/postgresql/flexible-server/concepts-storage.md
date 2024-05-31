---
title: Storage options
description: This article describes the storage options in Azure Database for PostgreSQL - Flexible Server.
author: kabharati
ms.author: kabharati
ms.reviewer: maghan
ms.date: 05/30/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Storage options in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

You can create an Azure Database for PostgreSQL flexible server instance using Azure managed disks which are are block-level storage volumes that are managed by Azure and used with Azure Virtual Machines. Managed disks are like a physical disk in an on-premises server but, virtualized. With managed disks, all you have to do is specify the disk size, the disk type, and provision the disk. Once you provision the disk, Azure handles the rest.The available types of disks with flexible server are premium solid-state drives (SSD) and Premium SSD v2 and the pricing is calculated based on the compute, memory, and storage tier you provision.

## Premium SSD

Azure Premium SSDs deliver high-performance and low-latency disk support for virtual machines (VMs) with input/output (IO)-intensive workloads. To take advantage of the speed and performance of Premium SSDs, you can migrate existing VM disks to Premium SSDs. Premium SSDs are suitable for mission-critical production applications, but you can use them only with compatible VM series. Premium SSDs support the 512E sector size.

## Premium SSD v2 (preview)

Premium SSD v2 offers higher performance than Premium SSDs while also generally being less costly. You can individually tweak the performance (capacity, throughput, and IOPS) of Premium SSD v2 disks at any time, allowing workloads to be cost-efficient while meeting shifting performance needs. For example, a transaction-intensive database might need a large amount of IOPS at a small size, or a gaming application might need a large amount of IOPS but only during peak hours. Because of this, for most general-purpose workloads, Premium SSD v2 can provide the best price performance. You can now deploy Azure Database for PostgreSQL flexible server instances with Premium SSD v2 disk in limited regions.

> [!NOTE]  
> Premium SSD v2 is currently in preview for Azure Database for PostgreSQL flexible server.

### Differences between Premium SSD and Premium SSD v2

Unlike Premium SSDs, Premium SSD v2 doesn't have dedicated sizes. You can set a Premium SSD v2 to any supported size you prefer, and make granular adjustments (1-GiB increments) as per your workload requirements. Premium SSD v2 doesn't support host caching but still provides significantly lower latency than Premium SSD. Premium SSD v2 capacities range from 1 GiB to 64 TiBs.

The following table provides a comparison of the five disk types to help you decide which one to use.

| | Premium SSD v2 | Premium SSD |
| --- | --- | --- |
| **Disk type** | SSD | SSD |
| **Scenario** | Production and performance-sensitive workloads that consistently require low latency and high IOPS and throughput | Production and performance-sensitive workloads |
| **Max disk size** | 65,536 GiB | 32,767 GiB |
| **Max throughput** | 1,200 MB/s | 900 MB/s |
| **Max IOPS** | 80,000 | 20,000 |
| **Usable as OS Disk?** | No | Yes |

Premium SSD v2 offers up to 32 TiBs per region per subscription by default, but supports higher capacity by request. To request an increase in capacity, request a quota increase or contact Azure Support.

#### Premium SSD v2 IOPS

All Premium SSD v2 disks have a baseline of 3000 IOPS that is free of charge. After 6 GiB, the maximum IOPS a disk can have increases at a rate of 500 per GiB, up to 80,000 IOPS. So, an 8 GiB disk can have up to 4,000 IOPS, and a 10 GiB can have up to 5,000 IOPS. To be able to set 80,000 IOPS on a disk, that disk must have at least 160 GiBs. Increasing your IOPS beyond 3000 increases the price of your disk.

#### Premium SSD v2 throughput

All Premium SSD v2 disks have a baseline throughput of 125 MB/s that is free of charge. After 6 GiB, the maximum throughput that can be set increases by 0.25 MB/s per set IOPS. If a disk has 3,000 IOPS, the maximum throughput it can set is 750 MB/s. To raise the throughput for this disk beyond 750 MB/s, its IOPS must be increased. For example, if you increase the IOPS to 4,000, then the maximum throughput that can be set is 1,000. 1,200 MB/s is the maximum throughput supported for disks that have 5,000 IOPS or more. Increasing your throughput beyond 125 increases the price of your disk.

> [!NOTE]  
> Premium SSD v2 is currently in preview for Azure Database for PostgreSQL flexible server.

#### Premium SSD v2 early preview limitations

- Azure Database for PostgreSQL flexible server with Premium SSD V2 disk can be deployed only in Central US, East US, East US2, SouthCentralUS West US2, West Europe, Switzerland North regions during early preview. Support for more regions is coming soon.

- During early preview, SSD V2 disk won't have support for High Availability, Read Replicas, Geo Redundant Backups, Customer Managed Keys, or Storage Auto-grow features.

- During early preview, it is not possible to switch between Premium SSD V2 and Premium SSD storage types.

- You can enable Premium SSD V2 only for newly created servers. Enabling Premium SSD V2 on existing servers is currently not supported..

The storage that you provision is the amount of storage capacity available to your Azure Database for PostgreSQL server. The storage is used for the database files, temporary files, transaction logs, and PostgreSQL server logs. The total amount of storage that you provision also defines the I/O capacity available to your server.

| Disk size | Premium SSD IOPS | Premium SSD V2 IOPS |
| :--- | :--- | :--- |
| 32 GiB | Provisioned 120; up to 3,500 | First 3000 IOPS free can scale up to 17179 |
| 64 GiB | Provisioned 240; up to 3,500 | First 3000 IOPS free can scale up to 34359 |
| 128 GiB | Provisioned 500; up to 3,500 | First 3000 IOPS free can scale up to 68719 |
| 256 GiB | Provisioned 1,100; up to 3,500 | First 3000 IOPS free can scale up to 80000 |
| 512 GiB | Provisioned 2,300; up to 3,500 | First 3000 IOPS free can scale to 80000 |
| 1 TiB | 5,000 | First 3000 IOPS free can scale up to 80000 |
| 2 TiB | 7,500 | First 3000 IOPS free can scale up to 80000 |
| 4 TiB | 7,500 | First 3000 IOPS free can scale up to 80000 |
| 8 TiB | 16,000 | First 3000 IOPS free can scale up to 80000 |
| 16 TiB | 18,000 | First 3000 IOPS free can scale up to 80000 |
| 32 TiB | 20,000 | First 3000 IOPS free can scale up to 80000 |
| 64 TiB | N/A | First 3000 IOPS free can scale up to 80000 |

The following table provides an overview of premium SSD V2 disk capacities and performance maximums to help you decide which to use. Unlike, Premium SSD SSD cv2

| SSD v2 Disk size | Maximum available IOPS | Maximum available throughput (MB/s) |
| :--- | :--- | :--- |
| 1 GiB-64 TiBs | 3,000-80,000 (Increases by 500 IOPS per GiB) | 125-1,200 (increases by 0.25 MB/s per set IOPS) |

Your VM type also has IOPS limits. Even though you can select any storage size independently from the server type, you might not be able to use all IOPS that the storage provides, especially when you choose a server with a few vCores.
You can learn more about flexible server [Compute options in Azure Database for PostgreSQL - Flexible Server](concepts-compute.md).

> [!NOTE]  
> Storage can only be scaled up, not down.

You can monitor your I/O consumption in the Azure portal or by using Azure CLI commands. The relevant metrics to monitor are [storage limit, storage percentage, storage used, and I/O percentage](concepts-monitoring.md).

### Reach Storage Limits

When you reach the storage limit, the server starts returning errors and prevents any further modifications. Reaching the limit might also cause problems with other operational activities, such as backups and write-ahead log (WAL) archiving.
To avoid this situation, the server is automatically switched to read-only mode when the storage usage reaches 95 percent or when the available capacity is less than 5 GiB. You can use storage autogrow feature to avoid this issue with Premium SSD disk.

We recommend that you actively monitor the disk space that's in use and increase the disk size before you run out of storage. You can set up an alert to notify you when your server storage is approaching an out-of-disk state. For more information, see [Use the Azure portal to set up alerts on metrics for Azure Database for PostgreSQL - Flexible Server](how-to-alert-on-metrics.md).

### Storage autogrow (Premium SSD)

Storage autogrow can help ensure that your server always has enough storage capacity and doesn't become read-only. When you turn on storage autogrow, the storage will automatically expand without affecting the workload. Storage Autogrow is only supported for premium ssd storage tier. Premium SSD v2 does not support storage autogrow.

For servers with more than 1 TiB of provisioned storage, the storage autogrow mechanism activates when the available space falls to less than 10% of the total capacity or 64 GiB of free space, whichever of the two values is smaller. Conversely, for servers with storage under 1 TiB, this threshold is adjusted to 20% of the available free space or 64 GiB, depending on which of these values is smaller.

As an illustration, take a server with a storage capacity of 2 TiB (greater than 1 TiB). In this case, the autogrow limit is set at 64 GiB. This choice is made because 64 GiB is the smaller value when compared to 10% of 2 TiB, which is roughly 204.8 GiB. In contrast, for a server with a storage size of 128 GiB (less than 1 TiB), the autogrow feature activates when there's only 25.8 GiB of space left. This activation is based on the 20% threshold of the total allocated storage (128 GiB), which is smaller than 64 GiB.

The default behavior is to increase the disk size to the next premium SSD storage tier. This increase is always double in both size and cost, regardless of whether you start the storage scaling operation manually or through storage autogrow. Enabling storage autogrow is valuable when you're managing unpredictable workloads, because it automatically detects low-storage conditions and scales up the storage accordingly.

The process of scaling storage is performed online without causing any downtime, except when the disk is provisioned at 4,096 GiB. This exception is a limitation of Azure Managed disks. If a disk is already 4,096 GiB, the storage scaling activity will not be triggered, even if storage auto-grow is turned on. In such cases, you need to scale your storage manually. Manual scaling is an offline operation that you should plan according to your business requirements.

Remember that storage can only be scaled up, not down.

## Storage Autogrow Limitations and Considerations

- Disk scaling operations are always online, except in specific scenarios that involve the 4,096-GiB boundary. These scenarios include reaching, starting at, or crossing the 4,096-GiB limit. An example is when you're scaling from 2,048 GiB to 8,192 GiB.

- Host Caching (ReadOnly and Read/Write) is supported on disk sizes less than 4 TiB. This means any disk that is provisioned up to 4095 GiB can take advantage of Host Caching. Host caching isn't supported for disk sizes more than or equal to 4096 GiB. For example, a P50 premium disk provisioned at 4095 GiB can take advantage of Host caching and a P50 disk provisioned at 4096 GiB can't take advantage of Host Caching. Customers moving from lower disk size to 4096 GiB or higher will stop getting disk caching ability.

  This limitation is due to the underlying Azure Managed disk, which needs a manual disk scaling operation. You receive an informational message in the portal when you approach this limit.

-  Storage autogrow currently doesn't work with read-replica-enabled servers.

- Storage autogrow isn't triggered when you have high WAL usage.

> [!NOTE]  
> Storage auto-grow never triggers an offline increase.

## IOPS scaling

Azure Database for PostgreSQL flexible server supports the provisioning of additional IOPS. This feature enables you to provision additional IOPS above the complimentary IOPS limit. Using this feature, you can increase or decrease the number of IOPS provisioned based on your workload requirements at any time.

The minimum and maximum IOPS are determined by the selected compute size. To learn more about the minimum and maximum IOPS per compute size refer to the [compute size](concepts-compute.md).

> [!IMPORTANT]  
> Minimum and maximum IOPS are determined by the selected compute size.

Learn how to [scale up or down IOPS](how-to-scale-compute-storage-portal.md).

## Price

For the most up-to-date pricing information, see the [Azure Database for PostgreSQL flexible server pricing](https://azure.microsoft.com/pricing/details/postgresql/flexible-server/) page. The [Azure portal](https://portal.azure.com/#create/Microsoft.PostgreSQLServer) shows the monthly cost on the **Pricing tier** tab, based on the options that you select.

If you don't have an Azure subscription, you can use the Azure pricing calculator to get an estimated price. On the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) website, select **Add items**, expand the **Databases** category, and then select **Azure Database for PostgreSQL** to customize the options.

## Related content

- [Manage Azure Database for PostgreSQL - Flexible Server using the Azure portal](how-to-manage-server-portal.md)
- [Limits in Azure Database for PostgreSQL - Flexible Server](concepts-limits.md)
