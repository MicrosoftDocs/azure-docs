---
title: Service tiers
description: This article describes the compute and storage options in Azure Database for MySQL - Flexible Server.
author: code-sidd
ms.author: sisawant
ms.reviewer: maghan
ms.date: 05/21/2024
ms.service: mysql
ms.subservice: flexible-server
ms.custom:
  - build-2024
ms.topic: concept-article
# customer intent: As a reader, I want to understand the service tiers and compute options available in Azure Database for MySQL - Flexible Server.
---

# Azure Database for MySQL - Flexible Server service tiers

[!INCLUDE [applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

You can create an Azure Database for MySQL flexible server instance in one of three service tiers: Burstable, General Purpose, and Business Critical. The underlying VM SKU differentiates the service tiers used B-series, D-series, and E-series. The compute tier and size choice determines the memory and vCores available on the server. The exact storage technology is used across all service tiers. All resources are provisioned at the Azure Database for MySQL flexible server instance level. A server can have one or many databases.

| Resource / Tier | **Burstable** | **General Purpose** | **Business Critical** |
| :--- | :--- | :--- | :--- |
| VM series | [B-series burstable virtual machine sizes](../../virtual-machines/sizes-b-series-burstable.md) | [Dadsv5-series](../../virtual-machines/dasv5-dadsv5-series.md#dadsv5-series)[Ddsv4-series](../../virtual-machines/ddv4-ddsv4-series.md#ddsv4-series) | [Edsv4](../../virtual-machines/edv4-edsv4-series.md#edsv4-series)/[Edsv5-series](../../virtual-machines/edv5-edsv5-series.md#edsv5-series)*/[Eadsv5-series](../../virtual-machines/easv5-eadsv5-series.md#eadsv5-series) |
| vCores | 1, 2, 4, 8, 12, 16, 20 | 2, 4, 8, 16, 32, 48, 64 | 2, 4, 8, 16, 32, 48, 64, 80, 96 |
| Memory per vCore | Variable | 4 GiB | 8 GiB ** |
| Storage size | 20 GiB to 16 TiB | 20 GiB to 16 TiB | 20 GiB to 32 TiB |
| Database backup retention period | 1 to 35 days | 1 to 35 days | 1 to 35 days |

\** Except 64.80, and 96 vCores, which have 504 GiB, 504 GiB, and 672 GiB of memory, respectively.

\* Ev5 compute performs best among other VM series regarding QPS and latency. Learn more about the performance and region availability of Ev5 compute from [here](https://techcommunity.microsoft.com/t5/azure-database-for-mysql-blog/boost-azure-mysql-business-critical-flexible-server-performance/ba-p/3603698).

## Flexible Server service tiers

To choose a compute tier, use the following table as a starting point.

| Compute tier | Target workloads |
| :--- | :--- |
| Burstable | Best for workloads that continuously don't need the full CPU. |
| General Purpose | Most business workloads require balanced computing and memory with scalable I/O throughput. Examples include servers for hosting web and mobile apps and other enterprise applications. |
| Business Critical | High-performance database workloads that require in-memory performance for faster transaction processing and higher concurrency. Examples include servers for processing real-time data and high-performance transactional or analytical apps. |

After you create a server, you can change the compute tier, compute size, and storage size. Compute scaling requires a restart and takes 60-120 seconds, while storage scaling doesn't. You can also independently adjust the backup retention period up or down. See the [Scale resources](#scale-resources) section for more information.

### Service tiers, size, and server types

Compute resources can be selected based on the tier and size. This determines the vCores and memory size. vCores represent the logical CPU of the underlying hardware.

#### Burstable

The detailed specifications of the available server types are as follows for the Burstable service tier.

| Compute size | vCores | Physical Memory Size (GiB) | Total Memory Size (GiB) | Max Supported IOPS | Max Connections | Temp Storage (SSD) GiB |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_B1s | 1 | 1 | 1.1 | 320 | 171 | 0 |
| Standard_B1ms | 1 | 2 | 2.2 | 640 | 341 | 0 |
| Standard_B2s | 2 | 4 | 4.4 | 1280 | 683 | 0 |
| Standard_B2ms | 2 | 8 | 8.8 | 1700 | 1365 | 0 |
| Standard_B4ms | 4 | 16 | 17.6 | 2400 | 2731 | 0 |
| Standard_B8ms | 8 | 32 | 35.2 | 3100 | 5461 | 0 |
| Standard_B12ms | 12 | 48 | 52.8 | 3800 | 8193 | 0 |
| Standard_B16ms | 16 | 64 | 70.4 | 4300 | 10923 | 0 |
| Standard_B20ms | 20 | 80 | 88 | 5000 | 13653 | 0 |

#### General Purpose

The detailed specifications of the available server types are as follows for the General Purpose service tier

| Compute size | vCores | Physical Memory Size (GiB) | Total Memory Size (GiB) | Max Supported IOPS | Max Connections | Temp Storage (SSD) GiB |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_D2ads_v5 | 2 | 8 | 11 | 3200 | 1365 | 53 |
| Standard_D2ds_v4 | 2 | 8 | 11 | 3200 | 1365 | 53 |
| Standard_D4ads_v5 | 4 | 16 | 22 | 6400 | 2731 | 107 |
| Standard_D4ds_v4 | 4 | 16 | 22 | 6400 | 2731 | 107 |
| Standard_D8ads_v5 | 8 | 32 | 44 | 12800 | 5461 | 215 |
| Standard_D8ds_v4 | 8 | 32 | 44 | 12800 | 5461 | 215 |
| Standard_D16ads_v5 | 16 | 64 | 88 | 20000 | 10923 | 430 |
| Standard_D16ds_v4 | 16 | 64 | 88 | 20000 | 10923 | 430 |
| Standard_D32ads_v5 | 32 | 128 | 176 | 20000 | 21845 | 860 |
| Standard_D32ds_v4 | 32 | 128 | 176 | 20000 | 21845 | 860 |
| Standard_D48ads_v5 | 48 | 192 | 264 | 20000 | 32768 | 1290 |
| Standard_D48ds_v4 | 48 | 192 | 264 | 20000 | 32768 | 1290 |
| Standard_D64ads_v5 | 64 | 256 | 352 | 20000 | 43691 | 1720 |
| Standard_D64ds_v4 | 64 | 256 | 352 | 20000 | 43691 | 1720 |

#### Business Critical

The detailed specifications of the available server types are as follows for the Business Critical service tier.

| Compute size | vCores | Physical Memory Size (GiB) | Total Memory Size (GiB) | Max Supported IOPS | Max Connections | Temp Storage (SSD) GiB |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_E2ds_v4 | 2 | 16 | 22 | 5000 | 2731 | 37 |
| Standard_E2ads_v5 | 2 | 16 | 22 | 5000 | 2731 | 37 |
| Standard_E4ds_v4 | 4 | 32 | 44 | 10000 | 5461 | 75 |
| Standard_E4ads_v5 | 4 | 32 | 44 | 10000 | 5461 | 75 |
| Standard_E8ds_v4 | 8 | 64 | 88 | 18000 | 10923 | 151 |
| Standard_E8ads_v5 | 8 | 64 | 88 | 18000 | 10923 | 151 |
| Standard_E16ds_v4 | 16 | 128 | 176 | 28000 | 21845 | 302 |
| Standard_E16ads_v5 | 16 | 128 | 176 | 28000 | 21845 | 302 |
| Standard_E20ds_v4 | 20 | 160 | 220 | 28000 | 27306 | 377 |
| Standard_E20ads_v5 | 20 | 160 | 220 | 28000 | 27306 | 377 |
| Standard_E32ds_v4 | 32 | 256 | 352 | 38000 | 43691 | 604 |
| Standard_E32ads_v5 | 32 | 256 | 352 | 38000 | 43691 | 604 |
| Standard_E48ds_v4 | 48 | 384 | 528 | 48000 | 65536 | 906 |
| Standard_E48ads_v5 | 48 | 384 | 528 | 48000 | 65536 | 906 |
| Standard_E64ds_v4 | 64 | 504 | 693 | 64000 | 86016 | 1224 |
| Standard_E64ads_v5 | 64 | 504 | 693 | 64000 | 86016 | 1224 |
| Standard_E80ids_v4 | 80 | 504 | 693 | 72000 | 86016 | 1224 |
| Standard_E2ds_v5 | 2 | 16 | 22 | 5000 | 2731 | 37 |
| Standard_E4ds_v5 | 4 | 32 | 44 | 10000 | 5461 | 75 |
| Standard_E8ds_v5 | 8 | 64 | 88 | 18000 | 10923 | 151 |
| Standard_E16ds_v5 | 16 | 128 | 176 | 28000 | 21845 | 302 |
| Standard_E20ds_v5 | 20 | 160 | 220 | 28000 | 27306 | 377 |
| Standard_E32ds_v5 | 32 | 256 | 352 | 38000 | 43691 | 604 |
| Standard_E48ds_v5 | 48 | 384 | 528 | 48000 | 65536 | 906 |
| Standard_E64ds_v5 | 64 | 512 | 704 | 64000 | 87383 | 1208 |
| Standard_E96ds_v5 | 96 | 672 | 924 | 80000 | 100000 | 2004 |

## Memory management in Azure Database for MySQL flexible server

In MySQL, memory plays a vital role throughout various operations, including query processing and caching. Azure Database for MySQL flexible server optimizes memory allocation for the MySQL server process ([mysqld](https://dev.mysql.com/doc/refman/8.0/en/mysqld.html)), ensuring it receives sufficient memory resources for efficient query processing, caching, client connection management, and thread handling. [Learn more on how MySQL uses memory](https://dev.mysql.com/doc/refman/8.0/en/memory-use.html).

### Physical Memory Size (GB)

The Physical Memory Size (GB) in the table below represents the available random-access memory (RAM) in gigabytes (GB) on your Azure Database for MySQL flexible server.

### Total Memory Size (GB)

Azure Database for MySQL flexible server provides a Total Memory Size (GB). This represents the total memory available to your server, which is a combination of physical memory and a set amount of temporary storage SSD component. This unified view is designed to streamline resource management, allowing you to focus only on the total memory available to your Azure MySQL Server (mysqld) process.
Memory Percent (memory_percent) metric represents the percentage of memory occupied by the Azure MySQL server process (mysqld). This metric is calculated from the **Total Memory Size (GB)**. For example, when the Memory Percent metric displays a value of 60, it means that your Azure MySQL Server process is utilizing **60% of the Total memory size (GB)** available on your Azure Database for MySQL flexible server.

### MySQL Server (mysqld)

The Azure MySQL server process, [mysqld](https://dev.mysql.com/doc/refman/8.0/en/mysqld.html), is the core database operations engine. Upon startup, it initializes total components such as the InnoDB buffer pool and thread cache, utilizing memory based on configuration and workload demands. For example, the InnoDB buffer pool caches frequently accessed data and indexes to improve query execution speed, while the thread cache manages client connection threads. [Learn more](https://dev.mysql.com/doc/refman/8.0/en/mysqld.html).

### InnoDB Storage Engine

As MySQL's default storage engine, [InnoDB](https://dev.mysql.com/doc/refman/8.0/en/innodb-in-memory-structures.html) uses memory for caching frequently accessed data and managing internal structures like the innodb buffer pool and [log buffer](https://dev.mysql.com/doc/refman/8.0/en/innodb-redo-log-buffer.html). [InnoDB buffer pool](https://dev.mysql.com/doc/refman/8.0/en/innodb-buffer-pool.html) holds table data and indexes in memory to minimize disk I/O, enhancing performance. InnoDB Buffer Pool Size parameter is calculated based on the physical memory size (GB) available on the server. [Learn more on the sizes of the InnoDB Buffer Pool available](./concepts-server-parameters.md#innodb_buffer_pool_size) in Azure Database for MySQL flexible server.

### Threads

Client connections are managed through dedicated threads handled by the connection manager. These threads handle authentication, query execution, and result retrieval for client interactions. [Learn more](https://dev.mysql.com/doc/refman/8.0/en/connection-management.html).

To get more details about the compute series available, refer to Azure VM documentation for [B-series burstable virtual machine sizes](../../virtual-machines/sizes-b-series-burstable.md), General Purpose [Dadsv5-series](../../virtual-machines/dasv5-dadsv5-series.md#dadsv5-series)[Ddsv4-series](../../virtual-machines/ddv4-ddsv4-series.md#ddsv4-series), and Business Critical [Edsv4](../../virtual-machines/edv4-edsv4-series.md#edsv4-series)/[Edsv5-series](../../virtual-machines/edv5-edsv5-series.md#edsv5-series)/[Eadsv5-series.](../../virtual-machines/easv5-eadsv5-series.md#eadsv5-series)

## Performance limitations of burstable series instances

> [!NOTE]
> For [B-series burstable virtual machine sizes](../../virtual-machines/sizes-b-series-burstable.md), if the VM is started/stopped or restarted, the credits might be lost. For more information, see [B-series burstable virtual machine sizes](../../virtual-machines/sizes-b-series-burstable.md).

The burstable compute tier is designed to provide a cost-effective solution for workloads that don't require continuous full CPU continuously. This tier is ideal for nonproduction workloads like development, staging, or testing environments.
The unique feature of the burstable compute tier is its ability to "burst", that is, to utilize more than its baseline CPU performance using up to 100% of the vCPU when the workload requires it. This is made possible by a CPU credit model, [which allows B-series instances to accumulate "CPU credits"](../../virtual-machines/b-series-cpu-credit-model/b-series-cpu-credit-model.md#b-series-cpu-credit-model) during periods of low CPU usage. These credits can then be spent during periods of high CPU usage, allowing the instance to burst above its base CPU performance.

However, it's important to note that once a burstable instance exhausts its CPU credits, it operates at its base CPU performance. For example, the base CPU performance of a Standard_B1ms is 20%, that is, 0.2 Vcore. Suppose the Burstable tier server is running a workload requiring more CPU performance than the base level and has exhausted its CPU credits. In that case, the server might experience performance limitations and eventually could affect various system operations like Stop/Start/Restart for your server.

> [!NOTE]  
> For servers in [B-series burstable virtual machine sizes](../../virtual-machines/sizes-b-series-burstable.md), such as Standard_B1s/Standard_B1ms/Standard_B2s, their relatively smaller host memory size, might lead to crashes (out of memory) under continuous workload, even if the [memory_percent](./concepts-monitoring.md#list-of-metrics) metric has not reached 100%.

Due to this throttling, the server might encounter **connectivity issues** and system operations might be affected. In such situations, the recommended course of action is to **pause the workload on the server** to accumulate credits according to the [B-series credit banking model](../../virtual-machines/b-series-cpu-credit-model/b-series-cpu-credit-model.md#b-series-cpu-credit-model), or to consider scaling the server to higher tiers such as **General Purpose** or **Business Critical** tiers.

Therefore, while the Burstable compute tier offers significant cost and flexibility advantages for certain types of workloads, **it is not recommended for production workloads** that require consistent CPU performance. The Burstable tier doesn't support the functionality of creating the [Read replicas in Azure Database for MySQL - Flexible Server](concepts-read-replicas.md) and [High availability concepts in Azure Database for MySQL - Flexible Server](concepts-high-availability.md) feature. Other compute tiers, such as the General Purpose or Business Critical,, are more appropriate for such workloads and features.

For more information on the Azure's B-series CPU credit model, see the [B-series burstable virtual machine sizes](../../virtual-machines/sizes-b-series-burstable.md) and [B-series CPU credit model](../../virtual-machines/b-series-cpu-credit-model/b-series-cpu-credit-model.md#b-series-cpu-credit-model).

### Monitor CPU credits in burstable tier

Monitoring your CPU credit balance is crucial for maintaining optimal performance in the Burstable compute tier. Azure Database for MySQL Flexible Server provides two key metrics related to CPU credits. The ideal threshold for triggering an alert depends on your workload and performance requirements.

[Monitor Azure Database for MySQL - Flexible Server](concepts-monitoring.md): This metric indicates the number of CPU credits consumed by your instance. Monitoring this metric can help you understand your instance's CPU usage patterns and manage its performance effectively.

[Monitor Azure Database for MySQL - Flexible Server](concepts-monitoring.md): This metric shows the number of CPU credits remaining for your instance. Monitoring this metric can help prevent your instance from degrading in performance due to exhausting its CPU credits. If the CPU Credit Remaining metric drops below a certain level (for example, less than 30% of the total available credits), this would indicate that the instance is at risk of exhausting its CPU credits if the current CPU load continues.

For more information on [how to set up alerts on metrics, refer to this guide](how-to-alert-on-metric.md).

## Storage

The storage you provision is the storage capacity available to your flexible server. Storage is used for the database files, temporary files, transaction logs, and the MySQL server logs. For Burstable and General Purpose service tiers, the storage range spans from a minimum of 20 GiB to a maximum of 16 TiB. Conversely, storage support extends up to 32 TiB for Business Critical service tier. In all service tiers, storage is scaled in 1-GiB increments and can be scaled up after the server is created.

> [!NOTE]  
> Storage can only be scaled up, not down.

You can monitor your storage consumption in the Azure portal (with Azure Monitor) using the storage limit, storage percentage, and storage used metrics. Refer to the [monitoring article](concepts-monitoring.md) to learn about metrics.

### Reach the storage limit

When storage consumed on the server is close to reaching the provisioned limit, the server is put into read-only mode to protect any lost writes on the server. Servers with less than equal to 100 GiB provisioned storage are marked read-only if the free storage is less than 5% of the provisioned storage size. Servers with over 100 GiB provisioned storage are marked read-only when the free storage is less than 5 GiB.

For example, if you have provisioned 110 GiB of storage, and the actual utilization exceeds 105 GiB, the server is marked read-only. Alternatively, if you have provisioned 5 GiB of storage, the server is marked read-only when the free storage reaches less than 256 MB.

While the service attempts to make the server read-only, all new write transaction requests are blocked, and existing active transactions continue to be executed. When the server is set to read-only, all subsequent write operations and transaction commits fail, but read queries continue to work uninterrupted.

To get the server out of read-only mode, you should increase the provisioned storage on the server. This can be done using the Azure portal or Azure CLI. Once increased, the server is ready to accept write transactions again.

We recommended that you <!--turn on storage auto-grow or to--> set up an alert to notify you when your server storage is approaching the threshold so you can avoid getting into the read-only state. For more information, see the documentation on alert documentation [how to set up an alert](how-to-alert-on-metric.md).

### Storage autogrow

Storage autogrow prevents your server from running out of storage and becoming read-only. If storage auto grow is enabled, the storage automatically grows without affecting the workload. Storage autogrow is enabled by default for all new server creations. For servers with less than 100 GB provisioned storage, the provisioned storage size is increased by 5 GB when the free storage is below 10% of the provisioned storage. For servers with more than 100 GB of provisioned storage, the provisioned storage size is increased by 5% when the free storage space is below 10 GB of the provisioned storage size. Maximum storage limits as specified above apply. Refresh the server instance to see the updated storage provisioned under **Settings** on the **Compute + Storage** page.

For example, if you have provisioned 1,000 GB of storage, and the actual utilization exceeds 990 GB, the server storage size is increased to 1,050 GB. Alternatively, if you have provisioned 20 GB of storage, the storage size is increased to 25 GB when less than 2 GB of storage is free.

Remember that storage, once autoscaled up, can't be scaled down.

> [!NOTE]  
> Storage autogrow is enabled by default for a high-availability configured server and can not be disabled.

## IOPS

Azure Database for MySQL flexible server supports pre-provisioned IOPS and autoscale IOPS. [Storage IOPS in Azure Database for MySQL - Flexible Server](concepts-storage-iops.md) The minimum IOPS is 360 across all compute sizes, and the maximum IOPS is determined by the selected compute size. To learn more about the maximum IOPS per compute size, refer to the [table](#service-tiers-size-and-server-types).

> [!IMPORTANT]  
> **Minimum IOPS are 360 across all compute sizes <br>
> **Maximum IOPS are determined by the selected compute size. <br>

You can monitor your I/O consumption in the Azure portal (with Azure Monitor) using [Monitor Azure Database for MySQL - Flexible Server](concepts-monitoring.md) metric. You need to scale your server's compute if you need more IOPS than the max IOPS based on compute.

## Pre-provisioned IOPS

Azure Database for MySQL flexible server offers pre-provisioned IOPS, allowing you to allocate a specific number of IOPS to your Azure Database for MySQL flexible server instance. This setting ensures consistent and predictable performance for your workloads. With pre-provisioned IOPS, you can define a specific IOPS limit for your storage volume, guaranteeing the ability to handle some requests per second. This results in a reliable and assured level of performance. Pre-provisioned IOPS enables you to provision **additional IOPS** above the IOPS limit. Using this feature, you can increase or decrease the number of IOPS provisioned based on your workload requirements at any time.

## Autoscale IOPS

The cornerstone of Azure Database for MySQL flexible server is its ability to achieve the best performance for tier 1 workloads. This can be improved by enabling the server to automatically scale its database servers' performance (IO) seamlessly depending on the workload needs. This opt-in feature enables users to scale IOPS on demand without having to pre-provision a certain amount of IO per second. With the Autoscale IOPS featured enabled, you can now enjoy worry-free IO management in Azure Database for MySQL flexible server because the server scales IOPs up or down automatically depending on workload needs.

With Autoscale IOPS, you pay only for the IO the server uses and no longer need to provision and pay for resources they aren't fully using, saving time and money. In addition, mission-critical Tier-1 applications can achieve consistent performance by making additional IO available to the workload anytime. Autoscale IOPS eliminates the administration required to provide the best performance at the least cost for Azure Database for MySQL flexible server customers.

**Dynamic Scaling**: Autoscale IOPS dynamically adjusts your database server's IOPS limit based on your workload's actual demand. This ensures optimal performance without manual intervention or configuration.

**Handling Workload Spikes**: Autoscale IOPS enables your database to seamlessly handle workload spikes or fluctuations without compromising the performance of your applications. This feature ensures consistent responsiveness even during peak usage periods.

**Cost Savings**: Unlike the Pre-provisioned IOPS, which specifies a fixed IOPS limit and is paid for regardless of usage, Autoscale IOPS lets you pay only for the number of I/O operations that you consume.

## Backup

The service automatically backs up your server. You can select a retention period of 1 to 35 days. Learn more about backups in the [backup and restore concepts article](concepts-backup-restore.md).

## Scale resources

After you create your server, you can independently change the compute tier, compute size (vCores and memory), storage amount, and backup retention period. The compute size can be scaled up or down, and the backup retention period can be scaled up or down from 1 to 35 days. The storage size can only be increased. Scaling the resources can be done through the portal or Azure CLI.

> [!NOTE]  
> The storage size can only be increased. You cannot go back to a smaller storage size after the increase.

When you change the compute tier or compute size, the server must be restarted for the new server type to take effect. When the system switches over to the new server, no new connections can be established, and all uncommitted transactions are rolled back. This window varies, but in most cases, it is between 60 and 120 seconds.

Scaling storage and changing the backup retention period are online operations and don't require a server restart.

## Price

For the most up-to-date pricing information, see the service [pricing page](https://azure.microsoft.com/pricing/details/MySQL/). To see the cost for the configuration you want, the [Azure portal](https://portal.azure.com/#create/Microsoft.MySQLServer/flexibleServers) shows the monthly cost on the **Compute + storage** tab based on the options you select. If you don't have an Azure subscription, you can use the Azure pricing calculator to get an estimated price. On the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) website, select **Add items**, expand the **Databases** category, choose **Azure Database for MySQL**, and **Flexible Server** as the deployment type to customize the options.

If you would like to optimize server cost, you can consider the following tips:

- Scale down your compute tier or compute size (vCores) if compute is underutilized.
- Consider switching to the Burstable compute tier if your workload doesn't need the full compute capacity continuously from the General Purpose and Business Critical tiers.
- Stop the server when not in use.
- Reduce the backup retention period if a longer retention of backup isn't required.

## Related content

- [Create an Azure Database for MySQL flexible server instance in the portal](quickstart-create-server-portal.md)
- [Service limitations](concepts-limitations.md)
