---
title: Pricing tiers in Azure Database for PostgreSQL
description: This article describes the pricing tiers in Azure Database for PostgreSQL.
services: postgresql
author: jan-eng
ms.author: janeng
manager: kfile
editor: jasonwhowell
ms.service: postgresql
ms.topic: article
ms.date: 02/28/2018
---

# Azure Database for PostgreSQL pricing tiers

An Azure Database for PostgreSQL server can be created in one of three different pricing tiers - Basic, General Purpose, and Memory Optimized. The pricing tiers are differentiated by the amount of compute in vCores that can be provisioned, memory per vCore, and the storage technology used to store the data. All resources are provisioned at the PostgreSQL server level. A server can have one or many databases.

|    | **Basic** | **General Purpose** | **Memory Optimized** |
|:---|:----------|:--------------------|:---------------------|
| Compute generation | Gen 4, Gen 5 | Gen 4, Gen 5 | Gen 5 |
| vCores | 1, 2 | 2, 4, 8, 16, 32 |2, 4, 8, 16, 32 |
| Memory per vCore | 1x | 2x Basic | 2x General Purpose |
| Storage Size | 5 GB to 1 TB | 5 GB to 1 TB | 5 GB to 1 TB |
| Storage Type | Azure Standard Storage | Azure Premium Storage | Azure Premium Storage |
| Database backup retention period | 7 - 35 days | 7 - 35 days | 7 - 35 days |

The following table can be used as a starting point for choosing a pricing tier:

| Pricing tier | Target workloads |
|:-------------|:-----------------|
| Basic | Workloads requiring light compute and I/O performance. Examples include servers used for development or testing, or small-scale infrequently used applications. |
| General Purpose | Most business workloads requiring balanced compute and memory with scalable I/O throughput. Examples include server for hosting Web and Mobile apps, and other enterprise applications.|
| Memory Optimized | High-performance database workloads requiring in-memory performance for faster transaction processing and higher concurrency. Examples include server for processing real-time data, and high performance transactional or analytical apps.|

After you create a server, the number of vCores can be changed up or down within seconds. You can also independently adjust the amount of storage up and the backup retention period up or down with no application downtime. See the scaling section below for more details.

## Compute generations, vCores, and memory

Compute resources are provided as vCores, representing the logical CPU of the underlying hardware. Currently, two compute generations, Gen 4 and Gen 5, are offered for you to choose from. Gen 4 logical CPUs are based on Intel E5-2673 v3 (Haswell) 2.4 GHz processors. Gen 5 logical CPUs are based on Intel E5-2673 v4 (Broadwell) 2.3 GHz processors.

Depending on the pricing tier, each vCore is provisioned with a specific amount of memory. When you increase or decrease the number of vCores for your server, the memory increases or decreases proportionally. The General Purpose tier provides double the amount of memory per vCore compared to the Basic tier. The Memory Optimized tier provides double the amount of memory compared to the General Purpose tier.

## Storage

The storage you provision is the amount of storage capacity available to your Azure Database for PostgreSQL server. The storage is used for the database files, temporary files, transaction logs, and the PostgreSQL server logs. The total amount of storage you provision also defines the I/O capacity available to your server:

|    | **Basic** | **General Purpose** | **Memory Optimized** |
|:---|:----------|:--------------------|:---------------------|
| Storage Type | Azure Standard Storage | Azure Premium Storage | Azure Premium Storage |
| Storage Size | 5 GB to 1 TB | 5 GB to 1 TB | 5 GB to 1 TB |
| Storage increment size | 1 GB | 1 GB | 1 GB |
| IOPS | Variable |3 IOPS/GB<br/>Min 100 IOPS | 3 IOPS/GB<br/>Min 100 IOPS |

Additional storage capacity can be added during and after the creation of the server. The Basic tier does not provide an IOPS guarantee. In the General Purpose and Memory Optimized pricing tiers, the IOPS scale with the provisioned storage size in a 3:1 ratio.

You can monitor your I/O consumption in the Azure portal or using Azure CLI commands. The relevant metrics to monitor are [Storage limit, Storage percentage, Storage used, and IO percent](concepts-monitoring.md).

## Backup

The service automatically takes backups of your server. The minimum retention period for backups is seven days. You can set a retention period of up to 35 days. The retention can be adjusted at any point during the lifetime of the server. You can choose between locally redundant and geo-redundant backups. Geo-redundant backups are also stored in the [geo-paired region](https://docs.microsoft.com/azure/best-practices-availability-paired-regions) of the region your server is created in. This provides a level of protection in the event of a disaster. You also gain the ability to restore your server to any other Azure region in which the service is available with geo-redundant backups. Note that it is not possible to change between the two backup storage options once the server is created.

## Scale resources

After creating your server, you can independently change the vCores, amount of storage, and backup retention period. You cannot change the pricing tier or the backup storage type after a server is created. vCores and the backup retention period can be scaled up or down. The storage size can only be increased. Scaling of the resources can be done either through the portal or Azure CLI. An example for scaling using CLI can be found [here](scripts/sample-scale-server-up-or-down.md).

When changing the number of vCores, a copy of the original server is created with the new compute allocation. Once the new server is up and running, connections are switched over to the new server. During the brief moment when the system switches over to the new server, no new connections can be established and all uncommitted transactions are rolled back. This window varies, but in most cases is less than a minute.

Scaling storage and changing the backup retention period are true on-line operations. There is no downtime or impact to your application. As IOPS scale with the size of the provisioned storage, you can increase the IOPS available to your server by scaling up storage.

## Pricing

Please review the service [pricing page](https://azure.microsoft.com/pricing/details/PostgreSQL/) for the most up-to-date pricing information. To see what your desired configuration costs, the [Azure portal](https://portal.azure.com/#create/Microsoft.PostgreSQLServer) shows the monthly cost in the **Pricing tier** tab based on the options you have selected. If you do not have an Azure subscription, you can use the Azure pricing calculator to get an estimated price. Visit the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) website, then click **Add items**, expand the **Databases** category, and choose **Azure Database for PostgreSQL** to customize the options.

## Next Steps

- Learn how to [create a PostgreSQL server in the portal](tutorial-design-database-using-azure-portal.md)
- Learn how to [monitor and scale an Azure Database for PostgreSQL server using Azure CLI](scripts/sample-scale-server-up-or-down.md)
- Learn about the [Service limitations](concepts-limits.md)
