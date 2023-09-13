---
title: Azure Database for MySQL - Flexible Server service tiers
description: This article describes the compute and storage options in Azure Database for MySQL - Flexible Server.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
author: code-sidd 
ms.author: sisawant
ms.reviewer: maghan
ms.custom: event-tier1-build-2022, ignite-2022
ms.date: 05/24/2022
---

# Azure Database for MySQL - Flexible Server service tiers

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

You can create an Azure Database for MySQL - Flexible Server in one of three different service tiers: Burstable, General Purpose, and Business Critical. The service tiers are differentiated by the underlying VM SKU used B-series, D-series, and E-series. The choice of compute tier and size determines the memory and vCores available on the server. The same storage technology is used across all service tiers. All resources are provisioned at the MySQL server level. A server can have one or many databases.

| Resource / Tier | **Burstable** | **General Purpose** | **Business Critical** |
|:---|:----------|:--------------------|:---------------------|
| VM series| [B-series](../../virtual-machines/sizes-b-series-burstable.md) | [Dadsv5-series](../../virtual-machines/dasv5-dadsv5-series.md#dadsv5-series)[Ddsv4-series](../../virtual-machines/ddv4-ddsv4-series.md#ddsv4-series) | [Edsv4](../../virtual-machines/edv4-edsv4-series.md#edsv4-series)/[Edsv5-series](../../virtual-machines/edv5-edsv5-series.md#edsv5-series)*/[Eadsv5-series](../../virtual-machines/easv5-eadsv5-series.md#eadsv5-series)|
| vCores | 1, 2, 4, 8, 12, 16, 20 | 2, 4, 8, 16, 32, 48, 64 | 2, 4, 8, 16, 32, 48, 64, 80, 96 |
| Memory per vCore | Variable | 4 GiB | 8 GiB ** |
| Storage size | 20 GiB to 16 TiB | 20 GiB to 16 TiB | 20 GiB to 16 TiB |
| Database backup retention period | 1 to 35 days | 1 to 35 days | 1 to 35 days |

\** With the exception of 64,80, and 96 vCores, which has 504, 504 and 672 GiB of memory respectively.

\* Ev5 compute provides best performance among other VM series in terms of QPS and latency. learn more about performance and region availability of Ev5 compute from [here](https://techcommunity.microsoft.com/t5/azure-database-for-mysql-blog/boost-azure-mysql-business-critical-flexible-server-performance/ba-p/3603698).

To choose a compute tier, use the following table as a starting point.

| Compute tier | Target workloads |
|:-------------|:-----------------|
| Burstable | Best for workloads that don’t need the full CPU continuously. |
| General Purpose | Most business workloads that require balanced compute and memory with scalable I/O throughput. Examples include servers for hosting web and mobile apps and other enterprise applications.|
| Business Critical | High-performance database workloads that require in-memory performance for faster transaction processing and higher concurrency. Examples include servers for processing real-time data and high-performance transactional or analytical apps.|

After you create a server, the compute tier, compute size, and storage size can be changed. Compute scaling requires a restart and takes between 60-120 seconds, while storage scaling doesn't require restart. You also can independently adjust the backup retention period up or down. For more information, see the [Scale resources](#scale-resources) section.

## Service tiers, size, and server types

Compute resources can be selected based on the tier and size. This determines the vCores and memory size. vCores represent the logical CPU of the underlying hardware.

The detailed specifications of the available server types are as follows:

| Compute size         | vCores | Memory Size (GiB) | Max Supported IOPS | Max Connections | Temp Storage (SSD) GiB |
|----------------------|--------|-------------------| ------------------ |------------------| ------------------ |
|**Burstable**				
|Standard_B1s	|	1	|	1	|	320		|	171	|   4   |
|Standard_B1ms	|	1	|	2	|	640		|	341	|   4   |
|Standard_B2s	|	2	|	4	|	1280	|	683	|   4   |
|Standard_B2ms	|	2	|	8	|	1700	|	1365	|   16  |
|Standard_B4ms	|	4	|	16	|	2400	|	2731	|   32  |
|Standard_B8ms	|	8	|	32	|	3100	|	5461	|   64  |
|Standard_B12ms	|	12	|	48	|	3800	|	8193	|   96  |
|Standard_B16ms	|	16	|	64	|	4300	|	10923	|   128 |
|Standard_B20ms	|	20	|	80	|	5000	|	13653	|   160 |
|**General Purpose**|				
|Standard_D2ads_v5	|2  |8  |3200   |1365   |   75  |
|Standard_D2ds_v4	|2	|8	|3200	|1365   |   75  |
|Standard_D4ads_v5	|4	|16	|6400	|2731   |   150 |
|Standard_D4ds_v4	|4	|16	|6400	|2731   |   150 |
|Standard_D8ads_v5	|8	|32	|12800	|5461   |   300 |
|Standard_D8ds_v4	|8	|32	|12800	|5461   |   300 |
|Standard_D16ads_v5	|16	|64	|20000	|10923  |   600 |
|Standard_D16ds_v4	|16	|64	|20000	|10923  |   600 |
|Standard_D32ads_v5	|32	|128	|20000	|21845  |   1200    |
|Standard_D32ds_v4	|32	|128	|20000	|21845  |   1200    |
|Standard_D48ads_v5	|48	|192	|20000	|32768  |   1800    |
|Standard_D48ds_v4	|48	|192	|20000	|32768  |   1800    |
|Standard_D64ads_v5	|64	|256	|20000	|43691  |   2400    |
|Standard_D64ds_v4	|64	|256	|20000	|43691  |   2400    |
|**Business Critical** |	
|Standard_E2ds_v4	|	2	|	16	|	5000	|	2731    |   75  |
|Standard_E2ads_v5	|	2	|	16	|	5000	|	2731    |   75  |
|Standard_E4ds_v4	|	4	|	32	|	10000	|	5461    |   150 |
|Standard_E4ads_v5	|	4	|	32	|	10000	|	5461    |   150 |
|Standard_E8ds_v4	|	8	|	64	|	18000	|	10923   |   300 |
|Standard_E8ads_v5	|	8	|	64	|	18000	|	10923   |   300 |
|Standard_E16ds_v4	|	16	|	128	|	28000	|	21845   |   600 |
|Standard_E16ads_v5	|	16	|	128	|	28000	|	21845   |   600 |
|Standard_E32ds_v4	|	32	|	256	|	38000	|	43691   |   1200    |
|Standard_E32ads_v5	|	32	|	256	|	38000	|	43691   |   1200    |
|Standard_E48ds_v4	|	48	|	384	|	48000	|	65536   |   1800    |
|Standard_E48ads_v5	|	48	|	384	|	48000	|	65536   |   1800    |
|Standard_E64ds_v4	|	64	|	504	|	64000	|	86016   |   2400    |
|Standard_E64ads_v5	|	64	|	504	|	64000	|	86016   |   2400    |
|Standard_E80ids_v4	|	80	|	504	|	72000	|	86016   |   2400    |
|Standard_E2ds_v5	|	2	|	16	|	5000	|	2731    |   75  |
|Standard_E4ds_v5	|	4	|	32	|	10000	|	5461    |   150 | 
|Standard_E8ds_v5	|	8	|	64	|	18000	|	10923   |   300 |
|Standard_E16ds_v5	|	16	|	128	|	28000	|	21845   |   600 |
|Standard_E32ds_v5	|	32	|	256	|	38000	|	43691   |   1200    |
|Standard_E48ds_v5	|	48	|	384	|	48000	|	65536   |   1800    |
|Standard_E64ds_v5	|	64	|	512	|	64000	|	87383   |   2400    |
|Standard_E96ds_v5	|	96	|	672	|	80000	|	100000  |   3600    |

To get more details about the compute series available, refer to Azure VM documentation for [Burstable (B-series)](../../virtual-machines/sizes-b-series-burstable.md), General Purpose [Dadsv5-series](../../virtual-machines/dasv5-dadsv5-series.md#dadsv5-series)[Ddsv4-series](../../virtual-machines/ddv4-ddsv4-series.md#ddsv4-series), and Business Critical [Edsv4](../../virtual-machines/edv4-edsv4-series.md#edsv4-series)/[Edsv5-series](../../virtual-machines/edv5-edsv5-series.md#edsv5-series)/[Eadsv5-series](../../virtual-machines/easv5-eadsv5-series.md#eadsv5-series)


>[!NOTE]
>For [Burstable (B-series) compute tier](../../virtual-machines/sizes-b-series-burstable.md) if the VM is started/stopped or restarted, the credits may be lost. For more information, see [Burstable (B-Series) FAQ](../../virtual-machines/sizes-b-series-burstable.md).

## Storage

The storage you provision is the amount of storage capacity available to your flexible server. Storage is used for the database files, temporary files, transaction logs, and the MySQL server logs. In all service tiers, the minimum storage supported is 20 GiB and maximum is 16 TiB. Storage is scaled in 1 GiB increments and can be scaled up after the server is created.

>[!NOTE]
> Storage can only be scaled up, not down.

You can monitor your storage consumption in the Azure portal (with Azure Monitor) using the storage limit, storage percentage, and storage used metrics. Refer to the [monitoring article](./concepts-monitoring.md) to learn about metrics. 

### Reaching the storage limit

When storage consumed on the server is close to reaching the provisioned limit, the server is put to read-only mode to protect any lost writes on the server. Servers with less than equal to 100 GiB provisioned storage are marked read-only if the free storage is less than 5% of the provisioned storage size. Servers with more than 100 GiB provisioned storage are marked read only when the free storage is less than 5 GiB.

For example, if you have provisioned 110 GiB of storage, and the actual utilization goes over 105 GiB, the server is marked read-only. Alternatively, if you have provisioned 5 GiB of storage, the server is marked read-only when the free storage reaches less than 256 MB.

While the service attempts to make the server read-only, all new write transaction requests are blocked and existing active transactions will continue to execute. When the server is set to read-only, all subsequent write operations and transaction commits fail. Read queries will continue to work uninterrupted. 

To get the server out of read-only mode, you should increase the provisioned storage on the server. This can be done using the Azure portal or Azure CLI. Once increased, the server will be ready to accept write transactions again.

We recommend that you <!--turn on storage auto-grow or to--> set up an alert to notify you when your server storage is approaching the threshold so you can avoid getting into the read-only state. For more information, see the documentation on alert documentation [how to set up an alert](how-to-alert-on-metric.md).

### Storage auto-grow

Storage auto-grow prevents your server from running out of storage and becoming read-only. If storage auto-grow is enabled, the storage automatically grows without impacting the workload. Storage auto-grow is enabled by default for all new server creates. For servers with less than equal to 100 GB provisioned storage, the provisioned storage size is increased by 5 GB when the free storage is below 10% of the provisioned storage. For servers with more than 100 GB of provisioned storage, the provisioned storage size is increased by 5% when the free storage space is below 10 GB of the provisioned storage size. Maximum storage limits as specified above apply. Refresh the server instance to see the updated storage provisioned under **Settings** on the **Compute + Storage** page. 

For example, if you have provisioned 1000 GB of storage, and the actual utilization goes over 990 GB, the server storage size is increased to 1050 GB. Alternatively, if you have provisioned 20 GB of storage, the storage size is increase to 25 GB when less than 2 GB of storage is free.

Remember that storage once auto-scaled up, cannot be scaled down.

## IOPS

Azure Database for MySQL – Flexible Server supports the provisioning of additional IOPS. This feature enables you to provision additional IOPS above the complimentary IOPS limit. Using this feature, you can increase or decrease the number of IOPS provisioned based on your workload requirements at any time. 

The minimum IOPS are 360 across all compute sizes and the maximum IOPS is determined by the selected compute size. To learn more about the maximum IOPS per compute size refer to the [table](#service-tiers-size-and-server-types).

> [!Important]
> **Minimum IOPS are 360 across all compute sizes<br>
> **Maximum IOPS are determined by the selected compute size. 

You can monitor your I/O consumption in the Azure portal (with Azure Monitor) using [IO percent](./concepts-monitoring.md) metric. If you need more IOPS than the max IOPS based on compute then you need to scale your server's compute.

## Autoscale IOPS
The cornerstone of the Azure Database for MySQL - Flexible Server is its ability to achieve the best performance for tier 1 workloads, which can be improved by enabling server automatically scale performance (IO) of its database servers seamlessly depending on the workload needs. This is an opt-in feature that enables users to scale IOPS on demand without having to pre-provision a certain amount of IO per second. With the Autoscale IOPS featured enable, you can now enjoy worry free IO management in Azure Database for MySQL - Flexible Server because the server scales IOPs up or down automatically depending on workload needs.  

With Autoscale IOPS, you pay only for the IO the server use and no longer need to provision and pay for resources they aren’t fully using, saving both time and money. In addition, mission-critical Tier-1 applications can achieve consistent performance by making additional IO available to the workload at any time. Autoscale IOPS eliminates the administration required to provide the best performance at the least cost for Azure Database for MySQL customers. 

## Backup

The service automatically takes backups of your server. You can select a retention period from a range of 1 to 35 days. Learn more about backups in the [backup and restore concepts article](concepts-backup-restore.md).

## Scale resources

After you create your server, you can independently change the compute tier, compute size (vCores and memory), and the amount of storage, and the backup retention period. The compute size can be scaled up or down. The backup retention period can be scaled up or down from 1 to 35 days. The storage size can only be increased. Scaling of the resources can be done through the portal or Azure CLI.

> [!NOTE]
> The storage size can only be increased. You cannot go back to a smaller storage size after the increase.

When you change the compute tier or compute size, the server is restarted for the new server type to take effect. During the moment when the system switches over to the new server, no new connections can be established, and all uncommitted transactions are rolled back. This window varies, but in most cases, is between 60-120 seconds. 

Scaling storage and changing the backup retention period are online operations and don't require a server restart.

## Pricing

For the most up-to-date pricing information, see the service [pricing page](https://azure.microsoft.com/pricing/details/MySQL/). To see the cost for the configuration you want, the [Azure portal](https://portal.azure.com/#create/Microsoft.MySQLServer/flexibleServers) shows the monthly cost on the **Compute + storage** tab based on the options you select. If you don't have an Azure subscription, you can use the Azure pricing calculator to get an estimated price. On the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) website, select **Add items**, expand the **Databases** category, choose **Azure Database for MySQL**, and **Flexible Server** as the deployment type to customize the options.

If you would like to optimize server cost, you can consider following tips:

- Scale down your compute tier or compute size (vCores) if compute is underutilized.
- Consider switching to the Burstable compute tier if your workload doesn't need the full compute capacity continuously from the General Purpose and Business Critical tiers.
- Stop the server when not in use.
- Reduce the backup retention period if a longer retention of backup isn't required.

## Next steps

- Learn how to [create a MySQL server in the portal](quickstart-create-server-portal.md).
- Learn about [service limitations](concepts-limitations.md).
