---
title: Pricing tiers for Azure Database for MariaDB
description: This article describes the pricing tiers for Azure Database for MariaDB.
author: jan-eng
ms.author: janeng
ms.service: mariadb
ms.topic: conceptual
ms.date: 04/15/2019
---

# Azure Database for MariaDB pricing tiers

You can create an Azure Database for MariaDB server in one of three different pricing tiers: Basic, General Purpose, and Memory Optimized. The pricing tiers are differentiated by the amount of compute in vCores that can be provisioned, memory per vCore, and the storage technology used to store the data. All resources are provisioned at the MariaDB server level. A server can have one or many databases.

|    | **Basic** | **General Purpose** | **Memory Optimized** |
|:---|:----------|:--------------------|:---------------------|
| Compute generation | Gen 5 |Gen 5 | Gen 5 |
| vCores | 1, 2 | 2, 4, 8, 16, 32, 64 |2, 4, 8, 16, 32 |
| Memory per vCore | 2 GB | 5 GB | 10 GB |
| Storage size | 5 GB to 1 TB | 5 GB to 4 TB | 5 GB to 4 TB |
| Storage type | Azure Standard Storage | Azure Premium Storage | Azure Premium Storage |
| Database backup retention period | 7 to 35 days | 7 to 35 days | 7 to 35 days |

To choose a pricing tier, use the following table as a starting point.

| Pricing tier | Target workloads |
|:-------------|:-----------------|
| Basic | Workloads that require light compute and I/O performance. Examples include servers used for development or testing or small-scale infrequently used applications. |
| General Purpose | Most business workloads that require balanced compute and memory with scalable I/O throughput. Examples include servers for hosting web and mobile apps and other enterprise applications.|
| Memory Optimized | High-performance database workloads that require in-memory performance for faster transaction processing and higher concurrency. Examples include servers for processing real-time data and high-performance transactional or analytical apps.|

After you create a server, the number of vCores, and pricing tier (except to and from Basic) can be changed up or down within seconds. You also can independently adjust the amount of storage up and the backup retention period up or down with no application downtime. You can't change the backup storage type after a server is created. For more information, see the [Scale resources](#scale-resources) section.

## Compute generations and vCores

Compute resources are provided as vCores, which represent the logical CPU of the underlying hardware. Gen 5 logical CPUs are based on Intel E5-2673 v4 (Broadwell) 2.3-GHz processors.

## Storage

The storage you provision is the amount of storage capacity available to your Azure Database for MariaDB server. The storage is used for the database files, temporary files, transaction logs, and the MariaDB server logs. The total amount of storage you provision also defines the I/O capacity available to your server.

|    | **Basic** | **General Purpose** | **Memory Optimized** |
|:---|:----------|:--------------------|:---------------------|
| Storage type | Azure Standard Storage | Azure Premium Storage | Azure Premium Storage |
| Storage size | 5 GB to 1 TB | 5 GB to 4 TB | 5 GB to 4 TB |
| Storage increment size | 1 GB | 1 GB | 1 GB |
| IOPS | Variable |3 IOPS/GB<br/>Min 100 IOPS<br/>Max 6000 IOPS | 3 IOPS/GB<br/>Min 100 IOPS<br/>Max 6000 IOPS |

You can add additional storage capacity during and after the creation of the server, and allow the system to grow storage automatically based on the storage consumption of your workload. The Basic tier does not provide an IOPS guarantee. In the General Purpose and Memory Optimized pricing tiers, the IOPS scale with the provisioned storage size in a 3:1 ratio.

You can monitor your I/O consumption in the Azure portal or by using Azure CLI commands. The relevant metrics to monitor are [storage limit, storage percentage, storage used, and IO percent](concepts-monitoring.md).

### Reaching the storage limit

Servers with less than 100 GB provisioned storage are marked read-only if the free storage is less than 512MB or 5% of the provisioned storage size. Servers with more than 100 GB provisioned storage are marked read only when the free storage is less than 5 GB.

For example, if you have provisioned 110 GB of storage, and the actual utilization goes over 105 GB, the server is marked read-only. Alternatively, if you have provisioned 5 GB of storage, the server is marked read-only when the free storage reaches less than 512 MB.

While the service attempts to make the server read-only, all new write transaction requests are blocked and existing active transactions will continue to execute. When the server is set to read-only, all subsequent write operations and transaction commits fail. Read queries will continue to work uninterrupted. After you increase the provisioned storage, the server will be ready to accept write transactions again.

We recommend that you turn on storage auto-grow or to set up an alert to notify you when your server storage is approaching the threshold so you can avoid getting into the read-only state. For more information, see the documentation on [how to set up an alert](howto-alert-metric.md).

### Storage auto-grow

If storage auto grow is enabled, the storage automatically grows without impacting the workload. For servers with less than 100 GB provisioned storage, the provisioned storage size is increased by 5 GB as soon as the free storage is below the greater of 1 GB or 10% of the provisioned storage. For servers with more than 100 GB of provisioned storage, the provisioned storage size is increased by 5% when the free storage space is below 5% of the provisioned storage size. Maximum storage limits as specified above apply.

For example, if you have provisioned 1000 GB of storage, and the actual utilization goes over 950 GB, the server storage size is increased to 1050 GB. Alternatively, if you have provisioned 10 GB of storage, the storage size is increase to 15 GB when less than 1 GB of storage is free.

## Backup

The service automatically takes backups of your server. The minimum retention period for backups is seven days. You can set a retention period of up to 35 days. The retention can be adjusted at any point during the lifetime of the server. You can choose between locally redundant and geo-redundant backups. Geo-redundant backups also are stored in the [geo-paired region](https://docs.microsoft.com/azure/best-practices-availability-paired-regions) of the region where your server is created. This redundancy provides a level of protection in the event of a disaster. You also gain the ability to restore your server to any other Azure region in which the service is available with geo-redundant backups. It's not possible to change between the two backup storage options after the server is created.

## Scale resources

After you create your server, you can independently change the vCores, the pricing tier (except to and from Basic), the amount of storage, and the backup retention period. You can't change the backup storage type after a server is created. The number of vCores can be scaled up or down. The backup retention period can be scaled up or down from 7 to 35 days. The storage size can only be increased. Scaling of the resources can be done either through the portal or Azure CLI. 

<!--For an example of scaling by using Azure CLI, see [Monitor and scale an Azure Database for MariaDB server by using Azure CLI](scripts/sample-scale-server.md).-->

When you change the number of vCores, or the pricing tier, a copy of the original server is created with the new compute allocation. After the new server is up and running, connections are switched over to the new server. During the moment when the system switches over to the new server, no new connections can be established, and all uncommitted transactions are rolled back. This window varies, but in most cases, is less than a minute.

Scaling storage and changing the backup retention period are true online operations. There is no downtime, and your application isn't affected. As IOPS scale with the size of the provisioned storage, you can increase the IOPS available to your server by scaling up storage.

## Pricing

For the most up-to-date pricing information, see the service [pricing page](https://azure.microsoft.com/pricing/details/mariadb/). To see the cost for the configuration you want, the [Azure portal](https://portal.azure.com/#create/Microsoft.MariaDBServer) shows the monthly cost on the **Pricing tier** tab based on the options you select. If you don't have an Azure subscription, you can use the Azure pricing calculator to get an estimated price. On the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) website, select **Add items**, expand the **Databases** category, and choose **Azure Database for MariaDB** to customize the options.

## Next steps
- Learn about the [service limitations](concepts-limits.md).
- Learn how to [create a MariaDB server in the Azure portal](quickstart-create-mariadb-server-database-using-azure-portal.md).

<!--
- Learn how to [monitor and scale an Azure Database for MariaDB server by using Azure CLI](scripts/sample-scale-server.md).-->
