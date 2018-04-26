---
title: Pricing tiers for Azure Database for PostgreSQL
description: This article describes the pricing tiers for Azure Database for PostgreSQL.
services: postgresql
author: jan-eng
ms.author: janeng
manager: kfile
editor: jasonwhowell
ms.service: postgresql
ms.topic: article
ms.date: 03/20/2018
---

# Azure Database for PostgreSQL pricing tiers

You can create an Azure Database for PostgreSQL server in one of three different pricing tiers: Basic, General Purpose, and Memory Optimized. The pricing tiers are differentiated by the amount of compute in vCores that can be provisioned, memory per vCore, and the storage technology used to store the data. All resources are provisioned at the PostgreSQL server level. A server can have one or many databases.

|    | **Basic** | **General Purpose** | **Memory Optimized** |
|:---|:----------|:--------------------|:---------------------|
| Compute generation | Gen 4, Gen 5 | Gen 4, Gen 5 | Gen 5 |
| vCores | 1, 2 | 2, 4, 8, 16, 32 |2, 4, 8, 16 |
| Memory per vCore | Baseline | 2x Basic | 2x General Purpose |
| Storage size | 5 GB to 1 TB | 5 GB to 2 TB | 5 GB to 2 TB |
| Storage type | Azure Standard Storage | Azure Premium Storage | Azure Premium Storage |
| Database backup retention period | 7 to 35 days | 7 to 35 days | 7 to 35 days |

To choose a pricing tier, use the following table as a starting point.

| Pricing tier | Target workloads |
|:-------------|:-----------------|
| Basic | Workloads that require light compute and I/O performance. Examples include servers used for development or testing or small-scale infrequently used applications. |
| General Purpose | Most business workloads that require balanced compute and memory with scalable I/O throughput. Examples include servers for hosting web and mobile apps and other enterprise applications.|
| Memory Optimized | High-performance database workloads that require in-memory performance for faster transaction processing and higher concurrency. Examples include servers for processing real-time data and high-performance transactional or analytical apps.|

After you create a server, the number of vCores can be changed up or down (within the same pricing tier) within seconds. You also can independently adjust the amount of storage up and the backup retention period up or down with no application downtime. You can't change the pricing tier or the backup storage type after a server is created. For more information, see the [Scale resources](#scale-resources) section.


## Compute generations, vCores, and memory

Compute resources are provided as vCores, which represent the logical CPU of the underlying hardware. Currently, you can choose from two compute generations, Gen 4 and Gen 5. Gen 4 logical CPUs are based on Intel E5-2673 v3 (Haswell) 2.4-GHz processors. Gen 5 logical CPUs are based on Intel E5-2673 v4 (Broadwell) 2.3-GHz processors. Gen 4 and Gen 5 are available in the following regions ("X" denotes available). 

| **Azure region** | **Gen 4** | **Gen 5** |
|:---|:----------:|:--------------------:|
| Central US |  | X |
| East US | X | X |
| East US 2 | X | X |
| North Central US | X |  |
| South Central US | X | X |
| West US | X | X |
| West US 2 |  | X |
| Canada Central | X | X |
| Canada East | X | X |
| Brazil South | X | X |
| North Europe | X | X |
| West Europe | X | X |
| UK West |  | X |
| UK South |  | X |
| East Asia | X |  |
| Southeast Asia | X | X |
| Australia East |  | X |
| Australia Southeast |  | X |
| Central India | X |  |
| West India | X |  |
| South India |  | X |
| Japan East | X | X |
| Japan West | X | X |
| Korea South |  | X |

Depending on the pricing tier, each vCore is provisioned with a specific amount of memory. When you increase or decrease the number of vCores for your server, the memory increases or decreases proportionally. The General Purpose tier provides double the amount of memory per vCore compared to the Basic tier. The Memory Optimized tier provides double the amount of memory compared to the General Purpose tier.

## Storage

The storage you provision is the amount of storage capacity available to your Azure Database for PostgreSQL server. The storage is used for the database files, temporary files, transaction logs, and the PostgreSQL server logs. The total amount of storage you provision also defines the I/O capacity available to your server.

|    | **Basic** | **General Purpose** | **Memory Optimized** |
|:---|:----------|:--------------------|:---------------------|
| Storage type | Azure Standard Storage | Azure Premium Storage | Azure Premium Storage |
| Storage size | 5 GB to 1 TB | 5 GB to 2 TB | 5 GB to 2 TB |
| Storage increment size | 1 GB | 1 GB | 1 GB |
| IOPS | Variable |3 IOPS/GB<br/>Min 100 IOPS | 3 IOPS/GB<br/>Min 100 IOPS |

You can add additional storage capacity during and after the creation of the server. The Basic tier does not provide an IOPS guarantee. In the General Purpose and Memory Optimized pricing tiers, the IOPS scale with the provisioned storage size in a 3:1 ratio.

You can monitor your I/O consumption in the Azure portal or by using Azure CLI commands. The relevant metrics to monitor are [storage limit, storage percentage, storage used, and IO percent](concepts-monitoring.md).

## Backup

The service automatically takes backups of your server. The minimum retention period for backups is seven days. You can set a retention period of up to 35 days. The retention can be adjusted at any point during the lifetime of the server. You can choose between locally redundant and geo-redundant backups. Geo-redundant backups also are stored in the [geo-paired region](https://docs.microsoft.com/azure/best-practices-availability-paired-regions) of the region where your server is created. This redundancy provides a level of protection in the event of a disaster. You also gain the ability to restore your server to any other Azure region in which the service is available with geo-redundant backups. It's not possible to change between the two backup storage options after the server is created.

## Scale resources

After you create your server, you can independently change the vCores, the amount of storage, and the backup retention period. You can't change the pricing tier or the backup storage type after a server is created. The number of vCores can be scaled up or down within the same pricing tier. The backup retention period can be scaled up or down from 7 to 35 days. The storage size can only be increased.  Scaling of the resources can be done either through the portal or Azure CLI. For an example of scaling using Azure CLI, see [Monitor and scale an Azure Database for PostgreSQL server by using Azure CLI](scripts/sample-scale-server-up-or-down.md).

When you change the number of vCores, a copy of the original server is created with the new compute allocation. After the new server is up and running, connections are switched over to the new server. During the moment when the system switches over to the new server, no new connections can be established, and all uncommitted transactions are rolled back. This window varies, but in most cases is less than a minute.

Scaling storage and changing the backup retention period are true online operations. There is no downtime, and your application isn't affected. As IOPS scale with the size of the provisioned storage, you can increase the IOPS available to your server by scaling up storage.

## Pricing

For the most up-to-date pricing information, see the service [pricing page](https://azure.microsoft.com/pricing/details/PostgreSQL/). To see the cost for the configuration you want, the [Azure portal](https://portal.azure.com/#create/Microsoft.PostgreSQLServer) shows the monthly cost on the **Pricing tier** tab based on the options you select. If you don't have an Azure subscription, you can use the Azure pricing calculator to get an estimated price. On the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) website, select **Add items**, expand the **Databases** category, and choose **Azure Database for PostgreSQL** to customize the options.

## Next steps

- Learn how to [create a PostgreSQL server in the portal](tutorial-design-database-using-azure-portal.md).
- Learn how to [monitor and scale an Azure Database for PostgreSQL server by using Azure CLI](scripts/sample-scale-server-up-or-down.md).
- Learn about the [service limitations](concepts-limits.md).
