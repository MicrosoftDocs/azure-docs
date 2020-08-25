---
title: Compute and Storage Options - Azure Database for MySQL - Flexible Server
description: This article describes the compute and storage options in Azure Database for MySQL - Flexible Server.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 8/24/2020
---

# Compute and Storage options in Azure Database for MySQL - Flexible Server

You can create an Azure Database for MySQL server in one of three different pricing tiers: Basic, General Purpose, and Memory Optimized. The pricing tiers are differentiated by the amount of compute in vCores that can be provisioned, memory per vCore, and the storage technology used to store the data. All resources are provisioned at the MySQL server level. A server can have one or many databases.

| Resource / Tier | **Burstable** | **General Purpose** | **Memory Optimized** |
|:---|:----------|:--------------------|:---------------------|
| vCores | 1, 2 | 2, 4, 8, 16, 32, 64 | 2, 4, 8, 16, 32, 48, 64 |
| Memory per vCore | Variable | 4 GB | 8 GB [1] |
| Storage size | 5 GB to 16 TB | 5 GB to 16 TB | 5 GB to 16 TB |
| Database backup retention period | 1 to 35 days | 1 to 35 days | 1 to 35 days |

_[1] Please note that the Memory Optimized 64 vCore server has a lower memory ratio (7.88 GB per vCore)_

To choose a pricing tier, use the following table as a starting point.

| Pricing tier | Target workloads |
|:-------------|:-----------------|
| Burstable | Best for workloads that don’t need the full CPU continuously. |
| General Purpose | Most business workloads that require balanced compute and memory with scalable I/O throughput. Examples include servers for hosting web and mobile apps and other enterprise applications.|
| Memory Optimized | High-performance database workloads that require in-memory performance for faster transaction processing and higher concurrency. Examples include servers for processing real-time data and high-performance transactional or analytical apps.|

After you create a server, the compute tier, number of vCores and storage size can be changed up or down within seconds. You also can independently adjust the backup retention period up or down. For more information, see the [Scale resources](#scale-resources) section.

## Compute tiers, vCores and server types

Compute resources can be selected based on the tier, as well as the vCores and memory size. vCores represent the logical CPU of the underlying hardware.

The detailed specifications of the available server types are as follows:

| SKU Name             | vCores | Memory Size | Max Supported IOPS | Max Supported I/O bandwidth |
|----------------------|--------|-------------|--------------------|-----------------------------|
| **Burstable**        |        |             |                    |                             |
| Basic                | 1      | 1 GiB       | 320                | 10 MiB/sec                  |
| B1ms                 | 1      | 2 GiB       | 640                | 15 MiB/sec                  |
| B2s                  | 2      | 4 GiB       | 1280               | 15 MiB/sec                  |
| **General Purpose**  |        |             |                    |                             |
| D2ds_v4              | 2      | 8 GiB       | 3200               | 48 MiB/sec                  |
| D4ds_v4              | 4      | 16 GiB      | 6400               | 96 MiB/sec                  |
| D8ds_v4              | 8      | 32 GiB      | 12800              | 192 MiB/sec                 |
| D16ds_v4             | 16     | 64 GiB      | 25600              | 384 MiB/sec                 |
| D32ds_v4             | 32     | 128 GiB     | 51200              | 768 MiB/sec                 |
| D48ds_v4             | 48     | 192 GiB     | 76800              | 1152 MiB/sec                |
| D64ds_v4             | 64     | 256 GiB     | 80000              | 1200 MiB/sec                |
| **Memory Optimized** |        |             |                    |                             |
| E2ds_v4              | 2      | 16 GiB      | 3200               | 48 MiB/sec                  |
| E4ds_v4              | 4      | 32 GiB      | 6400               | 96 MiB/sec                  |
| E8ds_v4              | 8      | 64 GiB      | 12800              | 192 MiB/sec                 |
| E16ds_v4             | 16     | 128 GiB     | 25600              | 384 MiB/sec                 |
| E32ds_v4             | 32     | 256 GiB     | 51200              | 768 MiB/sec                 |
| E48ds_v4             | 48     | 384 GiB     | 76800              | 1152 MiB/sec                |
| E64ds_v4             | 64     | 504 GiB     | 80000              | 1200 MiB/sec                |

## Storage

The storage you provision is the amount of storage capacity available to your Azure Database for MySQL server. The storage is used for the database files, temporary files, transaction logs, and the MySQL server logs. The total amount of storage you provision also defines the I/O capacity available to your server.

| Storage attribute      | Burstable                     | General Purpose                               | Memory Optimized                               |
|:-----------------------|:------------------------------|:----------------------------------------------|:-----------------------------------------------|
| Storage size           | 5 GiB to 16 TiB               | 5 GiB to 16 TiB                               | 5 GiB to 16 TiB                                |
| Storage increment size | 1 GB                          | 1 GB                                          | 1 GB                                           |
| IOPS                   | 3 IOPS/GB<br/>Max 20,000 IOPS |3 IOPS/GB<br/>Min 100 IOPS<br/>Max 20,000 IOPS | 3 IOPS/GB<br/>Min 100 IOPS<br/>Max 20,000 IOPS |

You can add additional storage capacity during and after the creation of the server.

In all compute tiers, the IOPS scale with the provisioned storage size in a 3:1 ratio.

>[!NOTE]
> Storage can only be scaled up, not down.

You can monitor your I/O consumption in the Azure portal<!-- or by using Azure CLI commands-->. The relevant metrics to monitor are storage limit, storage percentage, storage used, and IO percent <!-- [storage limit, storage percentage, storage used, and IO percent](concepts-monitoring.md)-->.

### Reaching the storage limit

<!-- FIXME: Verify the exact mechanics here -->

Servers with less than equal to 100 GB provisioned storage are marked read-only if the free storage is less than 5% of the provisioned storage size. Servers with more than 100 GB provisioned storage are marked read only when the free storage is less than 5 GB.

For example, if you have provisioned 110 GB of storage, and the actual utilization goes over 105 GB, the server is marked read-only. Alternatively, if you have provisioned 5 GB of storage, the server is marked read-only when the free storage reaches less than 256 MB.

While the service attempts to make the server read-only, all new write transaction requests are blocked and existing active transactions will continue to execute. When the server is set to read-only, all subsequent write operations and transaction commits fail. Read queries will continue to work uninterrupted. After you increase the provisioned storage, the server will be ready to accept write transactions again.

We recommend that you set up an alert to notify you when your server storage is approaching the threshold so you can avoid getting into the read-only state. 

<!-- We recommend that you turn on storage auto-grow or to set up an alert to notify you when your server storage is approaching the threshold so you can avoid getting into the read-only state. For more information, see the documentation on alert documentation [how to set up an alert](howto-alert-on-metric.md)-->.

### Storage auto-grow

Storage auto-grow is not yet available for Flexible Server.

## Backup

The service automatically takes backups of your server. You can select a retention period from a range of 7 to 35 days. Learn more about backups in the backups article <!-- [concepts article](concepts-backup.md)-->.

## Scale resources

After you create your server, you can independently change the vCores, the compute tier, the amount of storage, and the backup retention period. The number of vCores can be scaled up or down. The backup retention period can be scaled up or down from 1 to 35 days. The storage size can only be increased. Scaling of the resources can be done through the portal.<!--either through the portal or Azure CLI. For an example of scaling by using Azure CLI, see [Monitor and scale an Azure Database for MySQL server by using Azure CLI](scripts/sample-scale-server-up-or-down.md).-->

> [!NOTE]
> The storage size can only be increased. You cannot go back to a smaller storage size after the increase.

When you change the number of vCores or the compute tier, the server is restarted for the new server type to take effect. During the moment when the system switches over to the new server, no new connections can be established, and all uncommitted transactions are rolled back. This window varies, but in most cases, is less than a minute. Scaling the storage works the same way, and also requires a short restart.

Changing the backup retention period is an online operation.

## Pricing

Pricing information is not yet available.

<!--For the most up-to-date pricing information, see the service [pricing page](https://azure.microsoft.com/pricing/details/MySQL/). To see the cost for the configuration you want, the [Azure portal](https://portal.azure.com/#create/Microsoft.MySQLServer) shows the monthly cost on the **Pricing tier** tab based on the options you select. If you don't have an Azure subscription, you can use the Azure pricing calculator to get an estimated price. On the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) website, select **Add items**, expand the **Databases** category, and choose **Azure Database for MySQL** to customize the options.-->

## Next steps

- Learn how to [create a MySQL server in the portal](quickstart-create-flexible-server-portal.md).
- Learn about [service limitations](concepts-flexible-limitations.md).