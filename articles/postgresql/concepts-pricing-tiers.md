---
title: "Pricing Tiers in Azure Database for PostreSQL | Microsoft Docs"
description: "Pricing Tiers in Azure Database for PostreSQL"
services: postresql
author: jan-eng
ms.author: janeng
manager: jhubbard
editor: jasonwhowell
ms.service: PostreSQL-database
ms.topic: article
ms.date: 2/20/2017
---

# Azure Database for PostreSQL pricing tiers

An Azure Database for PostreSQL server can be created in one of three different pricing tiers - Basic, General Purpose, and Memory Optimized. The pricing tiers are differentiated in the amount of compute in vCores that can be provisioned, the amount of memory that is provisioned together with each vCore and the storage technology used to store the data. All resources are provisioned at the server level. A server can have one or multiple databases.

|    | **Basic** | **General Purpose** | **Memory Optimized** |
| :- | :-------- | :------------------ |:-------------------- |
| Compute generation | Gen4, Gen5 | Gen4, Gen5 | Gen5 |
| vCores | 1, 2 | 2, 4, 8, 16, 32 |2, 4, 8, 16, 32 |
| Memory per vCore | 1x | 2x Basic | 2x General Purpose |
| Storage Size | 5 GB to 2 TB |
| Storage Type | Azure Standard Storage | Azure Premium Storage | Azure Premium Storage |
| Database backup retention period | 7 - 35 days |

The following table can be used as a starting point for choosing a pricing tier based on different sample application workloads:

| Pricing tier | Target workloads |
| :----------- | :----------------|
| Basic | Workloads with light compute needs and variable IO performance. Examples include servers used for development or testing, or small-scale infrequently used applications. |
| General Purpose | Most business workloads offering balanced compute and memory with scalable IO throughput.  Examples include server for hosting Web and Mobile apps, and other enterprise applications.|
| Memory Optimized | High performance and in-memory databases to cache more data for faster transaction processing and higher concurrency. Examples include server for processing real-time data, and high performance transactional or analytical apps.|

After you create a server, the number of vCores can be changed up or down within seconds. You can also independently adjust the amount of storage up and the backup retention period up or down with no application downtime. See the scaling section below for more details.

## Understanding compute generations, vCores and Memory

Compute resources are provided as vCores, representing the logical CPU of the underlying hardware. Currently, two compute generations, Gen4 and Gen5, are offered for you to choose from. Gen4 logical CPUs are based on Intel E5-2673 v3 (Haswell) 2.4 GHz processors. Gen5 logical CPUs are based on Intel E5-2673 v4 (Broadwell) 2.3 GHz processors.

Each vCore is provisioned with a specific amount of memory depending on the pricing tier selected. The General Purpose tier provides double the amount of memory per vCore compared to the Basic tier. The Memory Optimized tier provides double the amount of memory compared to the General Purpose tier. When you increase or decrease the number of vCores for your server, the memory increases or decreases proportionally with it.

## Storage

The storage you provision is the amount of storage capacity available to your Azure Database for PostreSQL server. The storage is used for the database files, transaction logs, and the PostreSQL server logs. The total amount of storage you provision also defines the I/O capacity available to your database:

|    | **Basic** | **General Purpose** | **Memory Optimized** |
| :- | :-------- | :------------------ |:-------------------- |
| Storage Type | Azure Standard Storage | Azure Premium Storage | Azure Premium Storage |
| Storage Size | 5 GB to 1 TB |
| Storage increment size | 1GB |
| IOPS | Variable | 3 IOPS/GB | 3 IOPS/GB |

Additional storage capacity can be added during and after the creation of the server. The amount of allocated storage can also be reduced if it is not used by the server. The Basic tier does not provide an IOPS guarantee. In the General Purpose and Memory Optimized pricing tiers, the IOPS scale with the maximum storage size in a 3:1 ratio.

You can monitor your I/O consumption in the Azure portal or using Azure CLI commands. The relevant metrics to monitor are Storage limit, Storage percentage, Storage used, and IO percent.

## Backup

The service automatically takes backups of your server. The minimum retention period for backups is 7 days. You can set a retention period of up to 35 days. The retention can be adjusted at any point during the lifetime of the server. You can choose between locally redundant and geo-redundant backups. Geographically redundant backups are also stored in the geo-paired region to the region you server is created in ([click here](https://docs.microsoft.com/azure/best-practices-availability-paired-regions) for more details on geo-paired regions). In the event of a disaster, this gives you a level of protection. You also gain the ability to restore your server to any other Azure region in which the service is available with geographically redundant backups. Note that it is not possible to change between the two backups storage options ones the server is created.

## Scaling of resources

After creating your server, you can independently change the vCores, amount storage, and backup retention period. You cannot change the pricing tier or the backup storage type after a server is created. vCores and the backup retention period can be scaled up and down while the storage size can only be increased. Scaling of the resources can be done both through the portal or via Azure CLI. An example for scaling using CLI can be found [here](scripts/sample-scale-server.md).

When changing the number of vCores, a copy of the original server is created with the new compute allocation. Once the new server is up and running, connections are switched over to the new server. During the brief moment when the system switches over to the new the server, no new connections can be established and all uncommitted transactions are rolled back. This window varies, but in most cases is less than a minute and typically only lasts a few seconds.

Scaling storage and the backups retention is a true online operation and there is no downtime or impact to your application. As IOPS scale with the size of the storage that is provisioned, you can increase the IOPS available to your database by scaling up the allocated storage.

## Understand pricing

Please review the service [pricing page](https://azure.microsoft.com/pricing/details/PostreSQL/) for the most up-to-date pricing information. To see what your desired configuration will cost, the [Azure portal](https://portal.azure.com/#create/Microsoft.PostreSQLServer) shows the monthly cost in the **Pricing tier** tab based on the options you have selected. If you do not have an Azure subscription, you can use the Azure pricing calculator to get an estimated price. Visit the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) website, then click **Add items**, expand the **Databases** category, and choose **Azure Database for PostreSQL** to customize the options.

## Next Steps

- Learn how to [create a PostreSQL server in the portal](howto-create-manage-server-portal.md)
- Learn how to [monitor and scale an Azure Database for PostreSQL server using Azure CLI](scripts/sample-scale-server.md)
- Learn about the [Service limitations](concepts-limits.md)
