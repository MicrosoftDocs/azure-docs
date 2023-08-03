---
title: Compute and Storage Options - Azure Database for PostgreSQL - Flexible Server
description: This article describes the compute and storage options in Azure Database for PostgreSQL - Flexible Server.
ms.author: sunila
author: sunilagarwal
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 11/30/2021
---

# Compute and Storage options in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

You can create an Azure Database for PostgreSQL server in one of three different pricing tiers: Burstable, General Purpose, and Memory Optimized. The pricing tiers are differentiated by the amount of compute in vCores that can be provisioned, memory per vCore, and the storage technology used to store the data. All resources are provisioned at the PostgreSQL server level. A server can have one or many databases.

| Resource / Tier | **Burstable** | **General Purpose** | **Memory Optimized** |
|:---|:----------|:--------------------|:---------------------|
| VM series | B-series  | Ddsv4-series, <br> Dsv3-series  | Edsv4-series, <br> Esv3 series |
| vCores | 1, 2, 4, 8, 12, 16, 20 | 2, 4, 8, 16, 32, 48, 64 | 2, 4, 8, 16, 20(v4), 32, 48, 64 |
| Memory per vCore | Variable | 4 GB | 6.75 to 8 GB |
| Storage size | 32 GB to 32 TB | 32 GB to 32 TB | 32 GB to 32 TB |
| Database backup retention period | 7 to 35 days | 7 to 35 days | 7 to 35 days |

To choose a pricing tier, use the following table as a starting point.

| Pricing tier | Target workloads |
|:-------------|:-----------------|
| Burstable | Best for workloads that don’t need the full CPU continuously. |
| General Purpose | Most business workloads that require balanced compute and memory with scalable I/O throughput. Examples include servers for hosting web and mobile apps and other enterprise applications.|
| Memory Optimized | High-performance database workloads that require in-memory performance for faster transaction processing and higher concurrency. Examples include servers for processing real-time data and high-performance transactional or analytical apps.|

After you create a server, the compute tier, number of vCores can be changed up or down and storage size can be changed up within seconds. You also can independently adjust the backup retention period up or down. For more information, see the [Scale resources](#scale-resources) section.

## Compute tiers, vCores, and server types

Compute resources can be selected based on the tier, vCores and memory size. vCores represent the logical CPU of the underlying hardware.

The detailed specifications of the available server types are as follows:

| SKU Name                            | vCores |Memory Size  | Max Supported IOPS | Max Supported I/O bandwidth |
|----------------------|--------------|----------------------|------------------- |-----------------------------|
| **Burstable**                       |        |             |                    |                             |
| B1ms                                | 1      | 2 GiB       | 640                | 10 MiB/sec                  |
| B2s                                 | 2      | 4 GiB       | 1280               | 15 MiB/sec                  |
| B2ms                                | 2      | 4 GiB       | 1700               | 22.5 MiB/sec                |
| B4ms                                | 4      | 8 GiB       | 2400               | 35 MiB/sec                  |
| B8ms                                | 8      | 16 GiB      | 3100               | 50 MiB/sec                  |                           
| B12ms                               | 12     | 24 GiB      | 3800               | 50 MiB/sec                  |
| B16ms                               | 16     | 32 GiB      | 4300               | 50 MiB/sec                  |
| B20ms                               | 20     | 40 GiB      | 5000               | 50 MiB/sec                  |
| **General Purpose**                 |        |             |                                 |                                          |
| D2s_v3 / D2ds_v4   / D2ds_v5        | 2      | 8 GiB       | 3200               | 48 MiB/sec                  |
| D4s_v3 / D4ds_v4   / D4ds_v5        | 4      | 16 GiB      | 6400               | 96 MiB/sec                  |
| D8s_v3 / D8ds_v4   / D8ds_v5        | 8      | 32 GiB      | 12800              | 192 MiB/sec                 |
| D16s_v3 / D16ds_v4 / D16ds_v5       | 16     | 64 GiB      | 20000              | 384 MiB/sec                 |
| D32s_v3 / D32ds_v4 / D32ds_v5       | 32     | 128 GiB     | 20000              | 768 MiB/sec                 |
| D48s_v3 / D48ds_v4 / D48ds_v5       | 48     | 192 GiB     | 20000              | 900 MiB/sec                 |
| D64s_v3 / D64ds_v4 / D64ds_v5       | 64     | 256 GiB     | 20000              | 900 MiB/sec                 |
| D96ds_v5                            | 96     | 384 GiB     | 20000              | 900 MiB/sec                 |
| **Memory Optimized** |              |                      |                    |                             |
| E2s_v3 / E2ds_v4 / E2ds_v5          | 2      | 16 GiB      | 3200               | 48 MiB/sec                  |
| E4s_v3 / E4ds_v4 / E4ds_v5          | 4      | 32 GiB      | 6400               | 96 MiB/sec                  |
| E8s_v3 / E8ds_v4 / E8ds_v5          | 8      | 64 GiB      | 12800              | 192 MiB/sec                 |
| E16s_v3 / E16ds_v4 / E16ds_v5       | 16     | 128 GiB     | 20000              | 384 MiB/sec                 |
| E20ds_v4  / E20ds_v5                | 20     | 160 GiB     | 20000              | 480 MiB/sec                 |
| E32s_v3 / E32ds_v4 / E32ds_v5       | 32     | 256 GiB     | 20000              | 768 MiB/sec                 |
| E48s_v3 / E48ds_v4 / E48ds_v5       | 48     | 384 GiB     | 20000              | 900 MiB/sec                 |
| E64s_v3 / E64ds_v4                  | 64     | 432 GiB     | 20000              | 900 MiB/sec                 |
| E64ds_v5                            | 64     | 512 GiB     | 20000              | 900 MiB/sec                 |
| E96ds_v5                            | 96     | 672 GiB     | 20000              | 900 MiB/sec                 |

## Storage

The storage you provision is the amount of storage capacity available to your Azure Database for PostgreSQL server. The storage is used for the database files, temporary files, transaction logs, and the PostgreSQL server logs. The total amount of storage you provision also defines the I/O capacity available to your server.

Storage is available in the following fixed sizes:

| Disk size | IOPS |
|:---|:---|
| 32 GiB | Provisioned 120, Up to 3,500 |
| 64 GiB | Provisioned 240, Up to 3,500 |
| 128 GiB | Provisioned 500, Up to 3,500 |
| 256 GiB | Provisioned 1100, Up to 3,500 |
| 512 GiB | Provisioned 2300, Up to 3,500 |
| 1 TiB | 5,000 |
| 2 TiB | 7,500 |
| 4 TiB | 7,500 |
| 8 TiB | 16,000 |
| 16 TiB | 18,000 |
| 32 TiB | 20,000 |

Note that IOPS are also constrained by your VM type. Even though you can select any storage size independent of the server type, you may not be able to use all IOPS that the storage provides, especially when you choose a server with a small number of vCores.

You can add additional storage capacity during and after the creation of the server.

>[!NOTE]
> Storage can only be scaled up, not down.

You can monitor your I/O consumption in the Azure portal or by using Azure CLI commands. The relevant metrics to monitor are [storage limit, storage percentage, storage used, and IO percent](concepts-monitoring.md).

### Maximum IOPS for your configuration

|SKU Name                               |Storage Size in GiB                       |32 |64 |128 |256 |512  |1,024|2,048|4,096|8,192 |16,384|32767 |
|---------------------------------------|------------------------------------------|---|---|----|----|-----|-----|-----|-----|------|------|
|                                       |Maximum IOPS                              |120|240|500 |1100|2300 |5000 |7500 |7500 |16000 |18000 |20000 |
|**Burstable**                          |                                          |   |   |    |    |     |     |     |     |      |      |      |
|B1ms                                   |640 IOPS                                  |120|240|500 |640*|640* |640* |640* |640* |640*  |640*  |640*  |
|B2s                                    |1280 IOPS                                 |120|240|500 |1100|1280*|1280*|1280*|1280*|1280* |1280* |1280* |
|B2ms                                   |1280 IOPS                                 |120|240|500 |1100|1700*|1700*|1700*|1700*|1700* |1700* |1700* |
|B4ms                                   |1280 IOPS                                 |120|240|500 |1100|2300 |2400*|2400*|2400*|2400* |2400* |2400* |
|B8ms                                   |1280 IOPS                                 |120|240|500 |1100|2300 |3100*|3100*|3100*|3100* |2400* |2400* |
|B12ms                                  |1280 IOPS                                 |120|240|500 |1100|2300 |3800*|3800*|3800*|3800* |3800* |3800* |
|B16ms                                  |1280 IOPS                                 |120|240|500 |1100|2300 |4300*|4300*|4300*|4300* |4300* |4300* |
|B20ms                                  |1280 IOPS                                 |120|240|500 |1100|2300 |5000 |5000*|5000*|5000* |5000* |5000* |
|**General Purpose**                    |                                          |   |   |    |    |     |     |     |     |      |      |
|D2s_v3 / D2ds_v4                       |3200 IOPS                                 |120|240|500 |1100|2300 |3200*|3200*|3200*|3200* |3200* |3200* |
|D2ds_v5                                |3750 IOPS                                 |120|240|500 |1100|2300 |3200*|3200*|3200*|3200* |3200* |3200* |
|D4s_v3  / D4ds_v4   / D4ds_v5          |6,400 IOPS                                |120|240|500 |1100|2300 |5000 |6400*|6400*|6400* |6400* |6400* |
|D8s_v3  / D8ds_v4   / D8ds_v5          |12,800 IOPS                               |120|240|500 |1100|2300 |5000 |7500 |7500 |12800*|12800*|12800*|
|D16s_v3 / D16ds_v4 / D16ds_v5          |20,000 IOPS                               |120|240|500 |1100|2300 |5000 |7500 |7500 |16000 |18000 |20000 |
|D32s_v3 / D32ds_v4 / D32ds_v5          |20,000 IOPS                               |120|240|500 |1100|2300 |5000 |7500 |7500 |16000 |18000 |20000 |
|D48s_v3 / D48ds_v4 / D48ds_v5          |20,000 IOPS                               |120|240|500 |1100|2300 |5000 |7500 |7500 |16000 |18000 |20000 |
|D64s_v3 / D64ds_v4 / D64ds_v5          |20,000 IOPS                               |120|240|500 |1100|2300 |5000 |7500 |7500 |16000 |18000 |20000 |
|D96ds_v5                               |20,000 IOPS                               |120|240|500 |1100|2300 |5000 |7500 |7500 |16000 |18000 |20000 |
|**Memory Optimized**                   |                                          |   |   |    |    |     |     |     |     |      |      |      |
|E2s_v3 / E2ds_v4                       |3200 IOPS                                 |120|240|500 |1100|2300 |3200*|3200*|3200*|3200* |3200* |3200* |
|E2ds_v5                                |3750 IOPS                                 |120|240|500 |1100|2300 |3200*|3200*|3200*|3200* |3200* |3200* |
|E4s_v3  / E4ds_v4 / E4ds_v5            |6,400 IOPS                                |120|240|500 |1100|2300 |5000 |6400*|6400*|6400* |6400* |6400* |
|E8s_v3  / E8ds_v4 / E8ds_v5            |12,800 IOPS                               |120|240|500 |1100|2300 |5000 |7500 |7500 |12800*|12800*|12800*|
|E16s_v3 / E16ds_v4 / E16ds_v5          |20,000 IOPS                               |120|240|500 |1100|2300 |5000 |7500 |7500 |16000 |18000 |20000 |
|E20ds_v4/E20ds_v5                      |20,000 IOPS                               |120|240|500 |1100|2300 |5000 |7500 |7500 |16000 |18000 |20000 |
|E32s_v3 / E32ds_v4 / E32ds_v5          |20,000 IOPS                               |120|240|500 |1100|2300 |5000 |7500 |7500 |16000 |18000 |20000 |
|E48s_v3 / E48ds_v4 / E48ds_v5          |20,000 IOPS                               |120|240|500 |1100|2300 |5000 |7500 |7500 |16000 |18000 |20000 |
|E64s_v3 / E64ds_v4  / E64ds_v5         |20,000 IOPS                               |120|240|500 |1100|2300 |5000 |7500 |7500 |16000 |18000 |20000 |
|E96ds_v5                               |20,000 IOPS                               |120|240|500 |1100|2300 |5000 |7500 |7500 |16000 |18000 |20000 |

When marked with a \*, IOPS are limited by the VM type you selected. Otherwise IOPS are limited by the selected storage size.

>[!NOTE]
> You may see higher IOPS in the metrics due to disk level bursting. Please see the [documentation](../../virtual-machines/disk-bursting.md#disk-level-bursting) for more details. 

### Maximum I/O bandwidth (MiB/sec) for your configuration

|SKU Name                         |Storage Size, GiB                             |32    |64     |128    |256   |512    |1,024  |2,048 |4,096 |8,192 |16,384|32,767|
|---------------------------------|----------------------------------------------|---   |---    |----   |----  |-----  |-----  |----- |----- |------|------|
|                                 |**Storage Bandwidth, MiB/sec**                |25    |50     |100    |125   |150    |200    |250   |250   |500   |750   |900   |
|**Burstable**                    |                                              |      |       |       |      |       |       |      |      |      |      |      |
|B1ms                             |10 MiB/sec                                    |10*   |10*    |10*    |10*   |10*    |10*    |10*   |10*   |10*   |10*   |10*   |
|B2s                              |15 MiB/sec                                    |15*   |15*    |15*    |15*   |15*    |15*    |15*   |15*   |15*   |10*   |10*   |
|B2ms                             |22.5 MiB/sec                                  |22.5* |22.5*  |22.5*  |22.5* |22.5*  |22.5*  |22.5* |22.5* |22.5* |22.5* |22.5* |
|B4ms                             |35 MiB/sec                                    |25    |35*    |35*    |35*   |35*    |35*    |35*   |35*   |35*   |35*   |35*   |
|B8ms                             |50 MiB/sec                                    |25    |50     |50*    |50*   |50*    |50*    |50*   |50*   |50*   |50*   |50*   |
|B12ms                            |50 MiB/sec                                    |25    |50     |50*    |50*   |50*    |50*    |50*   |50*   |50*   |50*   |50*   |
|B16ms                            |50 MiB/sec                                    |25    |50     |50*    |50*   |50*    |50*    |50*   |50*   |50*   |50*   |50*   |
|B20ms                            |50 MiB/sec                                    |25    |50     |50*    |50*   |50*    |50*    |50*   |50*   |50*   |50*   |50*   |
|**General Purpose**              |                                              |      |       |       |      |       |       |      |      |      |      |      |
|D2s_v3 / D2ds_v4                 |48 MiB/sec                                    |25    |48*    |48*    |48*   |48*    |48*    |48*   |48*   |48*   |48*   |48*   |
|D2ds_v5                          |85 MiB/sec                                    |25    |50     |85*    |85*   |85*    |85*    |85*   |85*   |85*   |85*   |85*   |
|D4s_v3 / D4ds_v4                 |96 MiB/sec                                    |25    |50     |96*    |96*   |96*    |96*    |96*   |96*   |96*   |96*   |96*   |
|D4ds_v5                          |145 MiB/sec                                   |25    |50*    |100*   |125*   145*   |145*   |145*  |145*  |145*  |145*  |145*  |
|D8s_v3 / D8ds_v4                 |192 MiB/sec                                   |25    |50     |100    |125   |150    |192*   |192*  |192*  |192*  |192*  |192*  |
|D8ds_v5                          |290 MiB/sec                                   |25    |50     |100    |125   |150    |200    |250   |250   |290*  |290*  |290*  | 
|D16s_v3 / D16ds_v4               |384 MiB/sec                                   |25    |50     |100    |125   |150    |200    |250   |250   |384*  |384*  |384*  |
|D16ds_v5                         |600 MiB/sec                                   |25    |50     |100    |125   |150    |200    |250   |250   |500   |600*  |600*  | 
|D32s_v3 / D32ds_v4               |768 MiB/sec                                   |25    |50     |100    |125   |150    |200    |250   |250   |500   |750   |900   |
|D32ds_v5                         |865 MiB/sec                                   |25    |50     |100    |125   |150    |200    |250   |250   |500   |750   |865*  | 
|D48s_v3 / D48ds_v4 /D48ds_v5     |900 MiB/sec                                   |25    |50     |100    |125   |150    |200    |250  |250    |500   |750   |900   |
|D64s_v3 / Dd64ds_v4 /D64ds_v5    |900 MiB/sec                                   |25    |50     |100    |125   |150    |200    |250  |250    |500   |750   |900   |
|Dd96ds_v5                        |900 MiB/sec                                   |25    |50     |100    |125   |150    |200    |250  |250    |500   |750   |900   |
|**Memory Optimized**             |                                              |      |       |       |      |       |       |     |       |      |      |      |
|E2s_v3 / E2ds_v4                 |48 MiB/sec                                    |25    |48*    |48*    |48*   |48*    |48*    |48*  |48*    |48*   |48*   |48*   |
|E2ds_v5                          |85 MiB/sec                                    |25    |50     |85*    |85*   |85*    |85*    |85*   |85*   |85*   |85*   |85*   |
|E4s_v3 / E4ds_v4                 |96 MiB/sec                                    |25    |50     |96*    |96*   |96*    |96*    |96*  |96*    |96*   |96*   |96*   |
|E4ds_v5                          |145 MiB/sec                                   |25    |50*    |100*   |125*   145*   |145*   |145*  |145*  |145*  |145*  |145*  |
|E8s_v3 / E8ds_v4                 |192 MiB/sec                                   |25    |50     |100    |125   |150    |192*   |192* |192*   |192*  |192*  |192*  |
|E8ds_v5                          |290 MiB/sec                                   |25    |50     |100    |125   |150    |200    |250   |250   |290*  |290*  |290*  | 
|E16s_v3 / E16ds_v4               |384 MiB/sec                                   |25    |50     |100    |125   |150    |200    |250  |250    |384*  |384*  |384*  |
|E16ds_v5                         |600 MiB/sec                                   |25    |50     |100    |125   |150    |200    |250   |250   |500   |600*  |600*  | 
|E20ds_v4                         |480 MiB/sec                                   |25    |50     |100    |125   |150    |200    |250  |250    |480*  |480*  |480*  |
|E20ds_v5                         |750 MiB/sec                                   |25    |50     |100    |125   |150    |200    |250   |250   |500   |750   |750*  | 
|E32s_v3 / E32ds_v4               |750 MiB/sec                                   |25    |50     |100    |125   |150    |200    |250  |250    |500   |750   |750   |
|E32ds_v5                         |865 MiB/sec                                   |25    |50     |100    |125   |150    |200    |250   |250   |500   |750   |865*  | 
|E48s_v3 / E48ds_v4 /E48ds_v5     |900 MiB/sec                                   |25    |50     |100    |125   |150    |200    |250  |250    |500   |750   |900   |
|E64s_v3 / E64ds_v4 /E64ds_v5     |900 MiB/sec                                   |25    |50     |100    |125   |150    |200    |250  |250    |500   |750   |900   |
|Ed96ds_v5                        |900 MiB/sec                                   |25    |50     |100    |125   |150    |200    |250  |250    |500   |750   |900   |

When marked with a \*, I/O bandwidth is limited by the VM type you selected. Otherwise, I/O bandwidth is limited by the selected storage size.

### Reaching the storage limit

When you reach the storage limit, the server will start returning errors and prevent any further modifications. This may also cause problems with other operational activities, such as backups and WAL archival.

To avoid this situation, when the storage usage reaches 95% or if the available capacity is less than 5 GiB, the server is automatically switched to **read-only mode**.

We recommend to actively monitor the disk space that is in use, and increase the disk size ahead of any out of storage situation. You can set up an alert to notify you when your server storage is approaching out of disk so you can avoid any issues with running out of disk. For more information, see the documentation on [how to set up an alert](howto-alert-on-metrics.md).


### Storage auto-grow (Preview)


> [!NOTE]
> Storage auto-grow is currently in preview.

Enabling storage auto-grow ensures that your server always has sufficient storage capacity and avoids the possibility of it becoming read-only. When storage auto-grow is activated, the storage will automatically expand without affecting the workload. For servers with less than 1 TiB of provisioned storage, the auto-grow feature activates when storage consumption reaches 80%. For servers with 1 TB or more of storage, auto-grow activates at 90% consumption.

For example, if you have allocated 256 GiB of storage and enabled storage auto-grow, once the actual utilization reaches 80% (205 GB), the server's storage size will automatically increase to the next available premium disk tier, which is 512 GiB. However, if the disk size is 1 TiB or larger, the scaling threshold is set at 90%. In such cases, the scaling process begins when the utilization reaches 922 GiB, and the disk is resized to 2 TiB.

Azure Database for PostgreSQL Flexible Server utilizes Azure Managed Disk v1, and the default behavior is to increase the disk size to the next premium tier. This increase is always double in both size and cost, regardless of whether the storage scaling operation is initiated manually or through storage auto-grow. Enabling storage auto-grow proves particularly valuable when managing unpredictable workloads since it automatically detects low storage conditions and scales up the storage accordingly.

The process of scaling storage is performed online, without causing any downtime, except when the disk is provisioned at 4096 GiB, which is a limitation of underlying Azure managed disk V1. If a disk is already 4096 GiB, the storage scaling activity will not be triggered, even if storage auto-grow is enabled. In such cases, you need to manually scale your storage, which is an offline operation that should be planned according to your business requirements.

Remember that storage can only be scaled up, not down.

## Limitations 

1. Disk scaling operations are always online except in specific scenarios involving the 4096 GiB boundary. These scenarios include reaching, starting at, or crossing the 4096 GiB limit, such as when scaling from 2048 GiB to 8192 GiB etc. This limitation is due to the underlying Azure Managed disk V1 which needs a manual disk scaling operation. You will receive an informational message in the portal when you approach this limit.

2. Storage auto-grow currently does not work for HA / Read replica-enabled servers; we will support this very soon.

3. Storage Autogrow does not trigger when there is high WAL usage.

> [!NOTE]
> Storage auto-grow never triggers offline increase.


## Backup

The service automatically takes backups of your server. You can select a retention period from a range of 7 to 35 days. Learn more about backups in the [concepts article](concepts-backup-restore.md).

## Scale resources

After you create your server, you can independently change the vCores, the compute tier, the amount of storage, and the backup retention period. The number of vCores can be scaled up or down. The backup retention period can be scaled up or down from 7 to 35 days. The storage size can only be increased. The resources can be scaled through the portal or Azure CLI.

> [!NOTE]
> The storage size can only be increased. You cannot go back to a smaller storage size after the increase.

When you change the number of vCores or the compute tier, the server is restarted for the new server type to take effect. During the moment when the system switches over to the new server, no new connections can be established, and all uncommitted transactions are rolled back. The time it takes to restart your server depends on crash recovery process and database activity at the time of restart. Restart typically takes one minute or less, however can be higher and can take several minutes depending upon transactional activity at time of restart. Scaling the storage works the same way, and requires restart. 

To improve the restart time, we recommend to perform scale operations during non-peak hours, that will reduce the time needed to restart the database server.

Changing the backup retention period is an online operation.

## Pricing

For the most up-to-date pricing information, see the service [pricing page](https://azure.microsoft.com/pricing/details/postgresql/flexible-server/). To see the cost for the configuration you want, the [Azure portal](https://portal.azure.com/#create/Microsoft.PostgreSQLServer) shows the monthly cost on the **Pricing tier** tab based on the options you select. If you don't have an Azure subscription, you can use the Azure pricing calculator to get an estimated price. On the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) website, select **Add items**, expand the **Databases** category, and choose **Azure Database for PostgreSQL** to customize the options.

## Next steps

- Learn how to [create a PostgreSQL server in the portal](how-to-manage-server-portal.md).
- Learn about [service limits](concepts-limits.md).
