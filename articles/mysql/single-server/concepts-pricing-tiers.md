---
title: Azure Database for MySQL - Single Server service tiers
description: Learn about the various service tiers for Azure Database for MySQL including compute generations, storage types, storage size, vCores, memory, and backup retention periods.
ms.service: mysql
ms.subservice: single-server
ms.topic: conceptual
author: SudheeshGH
ms.author: sunaray
ms.date: 06/20/2022
---

# Azure Database for MySQL - Single Server service tiers

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

You can create an Azure Database for MySQL server in one of three different service tiers: Basic, General Purpose, and Memory Optimized. The service tiers are differentiated by the amount of compute in vCores that can be provisioned, memory per vCore, and the storage technology used to store the data. All resources are provisioned at the MySQL server level. A server can have one or many databases.

| Attribute | **Basic** | **General Purpose** | **Memory Optimized** |
|:---|:----------|:--------------------|:---------------------|
| Compute generation | Gen 4, Gen 5 | Gen 4, Gen 5 | Gen 5 |
| vCores | 1, 2 | 2, 4, 8, 16, 32, 64 |2, 4, 8, 16, 32 |
| Memory per vCore | 2 GB | 5 GB | 10 GB |
| Storage size | 5 GB to 1 TB | 5 GB to 16 TB | 5 GB to 16 TB |
| Database backup retention period | 7 to 35 days | 7 to 35 days | 7 to 35 days |

To choose a pricing tier, use the following table as a starting point.

| Service tier | Target workloads |
|:-------------|:-----------------|
| Basic | Workloads that require light compute and I/O performance. Examples include servers used for development or testing or small-scale infrequently used applications. |
| General Purpose | Most business workloads that require balanced compute and memory with scalable I/O throughput. Examples include servers for hosting web and mobile apps and other enterprise applications.|
| Memory Optimized | High-performance database workloads that require in-memory performance for faster transaction processing and higher concurrency. Examples include servers for processing real-time data and high-performance transactional or analytical apps.|

> [!NOTE]
> Dynamic scaling to and from the Basic service tiers is currently not supported. Basic Tier SKUs servers can't be scaled up to General Purpose or Memory Optimized Tiers.

After you create a General Purpose or Memory Optimized server, the number of vCores, hardware generation, and pricing tier can be changed up or down within seconds. You also can independently adjust the amount of storage up and the backup retention period up or down with no application downtime. You can't change the backup storage type after a server is created. For more information, see the [Scale resources](#scale-resources) section.

## Compute generations and vCores

Compute resources are provided as vCores, which represent the logical CPU of the underlying hardware. China East 1, China North 1, US DoD Central, and US DoD East utilize Gen 4 logical CPUs that are based on Intel E5-2673 v3 (Haswell) 2.4-GHz processors. All other regions utilize Gen 5 logical CPUs that are based on Intel E5-2673 v4 (Broadwell) 2.3-GHz processors.

## Storage

The storage you provision is the amount of storage capacity available to your Azure Database for MySQL server. The storage is used for the database files, temporary files, transaction logs, and the MySQL server logs. The total amount of storage you provision also defines the I/O capacity available to your server.

Azure Database for MySQL – Single Server supports the following the backend storage for the servers. 

| Storage type   | Basic | General purpose v1 | General purpose v2 |
|:---|:----------|:--------------------|:---------------------|
| Storage size | 5 GB to 1 TB | 5 GB to 4 TB | 5 GB to 16 TB |
| Storage increment size | 1 GB | 1 GB | 1 GB |
| IOPS | Variable |3 IOPS/GB<br/>Min 100 IOPS<br/>Max 6000 IOPS | 3 IOPS/GB<br/>Min 100 IOPS<br/>Max 20,000 IOPS |

>[!NOTE]
> Basic storage does not provide an IOPS guarantee. In General Purpose storage, the IOPS scale with the provisioned storage size in a 3:1 ratio.

### Basic storage 
Basic storage is the backend storage supporting Basic pricing tier servers. Basic storage uses Azure standard storage in the backend where iops provisioned are not guaranteed and latency is variable. Basic tier is best suited for workloads that require light compute, low cost and I/O performance for development or small-scale infrequently used applications.

### General purpose storage 
General purpose storage is the backend storage supporting General Purpose and Memory Optimized tier server. In General Purpose storage, the IOPS scale with the provisioned storage size in a 3:1 ratio. There are two generations of general purpose storage as described below:

#### General purpose storage v1 (Supports up to 4-TB)
General purpose storage v1 is based on the legacy storage technology which can support up to 4-TB storage and 6000 IOPs per server. General purpose storage v1 is optimized to leverage memory from the compute nodes running MySQL engine for local caching and backups. The backup process on general purpose storage v1 reads from the data and log files in the memory of the compute nodes and copies it to the target backup storage for retention up to 35 days. As a result, the memory and io consumption of storage during backups is relatively higher. 

All Azure regions supports General purpose storage v1

For General Purpose or Memory Optimized server on general purpose storage v1, we recommend you consider

*	Plan for compute sku tier accounting for 10-30% excess memory for storage caching and backup buffers 
*	Provision 10% higher IOPs than required by the database workload to account for backup IOs 
*	Alternatively, migrate to general purpose storage v2 described below that supports up to 16-TB storage if the underlying storage infrastructure is available in your preferred Azure regions shared below. 

#### General purpose storage v2 (Supports up to 16-TB storage)
General purpose storage v2 is based on the latest storage infrastructure which can support up to 16-TB and 20000 IOPs. In a subset of Azure regions where the infrastructure is available, all newly provisioned servers land on general purpose storage v2 by default. General purpose storage v2 does not consume any memory from the compute node of MySQL and provides better predictable IO latencies compared to general purpose v1 storage. Backups on the general purpose v2 storage servers are snapshot-based with no additional IO overhead. On general purpose v2 storage, the MySQL server performance is expected to higher compared to general purpose storage v1 for the same storage and iops provisioned.There is no additional cost for general purpose storage that supports up to 16-TB storage. For assistance with migration to 16-TB storage, please open a support ticket from Azure portal.

General purpose storage v2 is supported in the following Azure regions: 

| Region | General purpose storage v2 availability | 
| --- | --- | 
| Australia East | :heavy_check_mark: | 
| Australia South East | :heavy_check_mark: | 
| Brazil South | :heavy_check_mark: | 
| Canada Central | :heavy_check_mark: |
| Canada East | :heavy_check_mark: |
| Central US | :heavy_check_mark: | 
| East US | :heavy_check_mark: | 
| East US 2 | :heavy_check_mark: |
| East Asia | :heavy_check_mark: | 
| Japan East | :heavy_check_mark: | 
| Japan West | :heavy_check_mark: | 
| Korea Central | :heavy_check_mark: |
| Korea South | :heavy_check_mark: |
| North Europe | :heavy_check_mark: | 
| North Central US | :heavy_check_mark: | 
| South Central US | :heavy_check_mark: | 
| Southeast Asia | :heavy_check_mark: | 
| UK South | :heavy_check_mark: | 
| UK West | :heavy_check_mark: | 
| West Central US | :heavy_check_mark: | 
| West US | :heavy_check_mark: | 
| West US 2 | :heavy_check_mark: | 
| West Europe | :heavy_check_mark: | 
| Central India | :heavy_check_mark: | 
| France Central* | :heavy_check_mark: | 
| UAE North* | :heavy_check_mark: | 
| South Africa North* | :heavy_check_mark: |

> [!NOTE] 
> *Regions where Azure Database for MySQL has General purpose storage v2 in Public Preview <br /> 
> *For these Azure regions, you will have an option to create server in both General purpose storage v1 and v2. For the servers created with General purpose storage v2 in public preview, following are the limitations, <br /> 
> * Geo-Redundant Backup will not be supported<br /> 
> * The replica server should be in the regions which support General purpose storage v2. <br /> 

### How can I determine which storage type my server is running on?

You can find the storage type of your server by going to **Settings** > **Compute + storage** page 
* If the server is provisioned using Basic SKU, the storage type is Basic storage.
* If the server is provisioned using General Purpose or Memory Optimized SKU, the storage type is General Purpose storage
   *  If the maximum storage that can be provisioned on your server is up to 4-TB, the storage type is General Purpose storage v1.
   *  If the maximum storage that can be provisioned on your server is up to 16-TB, the storage type is General Purpose storage v2.

### Can I move from general purpose storage v1 to general purpose storage v2? if yes, how and is there any additional cost?
Yes, migration to general purpose storage v2 from v1 is supported if the underlying storage infrastructure is available in the Azure region of the source server. The migration and v2 storage is available at no additional cost.

### Can I grow storage size after server is provisioned?
You can add additional storage capacity during and after the creation of the server, and allow the system to grow storage automatically based on the storage consumption of your workload. 

> [!IMPORTANT]
> Storage can only be scaled up, not down.

### Monitoring IO consumption
You can monitor your I/O consumption in the Azure portal or by using Azure CLI commands. The relevant metrics to monitor are [storage limit, storage percentage, storage used, and IO percent](concepts-monitoring.md).The monitoring metrics for the MySQL server with general purpose storage v1 reports the memory and IO consumed by the MySQL engine but may not capture the memory and IO consumption of the storage layer which is a limitation.

### Reaching the storage limit

Servers with less than or equal to 100 GB provisioned storage are marked read-only if the free storage is less than 5% of the provisioned storage size. Servers with more than 100 GB provisioned storage are marked read only when the free storage is less than 5 GB.

For example, if you have provisioned 110 GB of storage, and the actual utilization goes over 105 GB, the server is marked read-only. Alternatively, if you have provisioned 5 GB of storage, the server is marked read-only when the free storage reaches less than 256 MB.

While the service attempts to make the server read-only, all new write transaction requests are blocked and existing active transactions will continue to execute. When the server is set to read-only, all subsequent write operations and transaction commits fail. Read queries will continue to work uninterrupted. After you increase the provisioned storage, the server will be ready to accept write transactions again.

We recommend that you turn on storage auto-grow or to set up an alert to notify you when your server storage is approaching the threshold so you can avoid getting into the read-only state. For more information, see the documentation on [how to set up an alert](how-to-alert-on-metric.md).

### Storage auto-grow

Storage auto-grow prevents your server from running out of storage and becoming read-only. If storage auto grow is enabled, the storage automatically grows without impacting the workload. For servers with less than or equal to 100 GB provisioned storage, the provisioned storage size is increased by 5 GB when the free storage is below 10% of the provisioned storage. For servers with more than 100 GB of provisioned storage, the provisioned storage size is increased by 5% when the free storage space is below 10 GB of the provisioned storage size. Maximum storage limits as specified above apply.

For example, if you have provisioned 1000 GB of storage, and the actual utilization goes over 990 GB, the server storage size is increased to 1050 GB. Alternatively, if you have provisioned 10 GB of storage, the storage size is increase to 15 GB when less than 1 GB of storage is free.

Remember that storage can only be scaled up, not down.

## Backup storage 

Azure Database for MySQL provides up to 100% of your provisioned server storage as backup storage at no additional cost. Any backup storage you use in excess of this amount is charged in GB per month. For example, if you provision a server with 250 GB of storage, you’ll have 250 GB of additional storage available for server backups at no charge. Storage for backups in excess of the 250 GB is charged as per the [pricing model](https://azure.microsoft.com/pricing/details/mysql/). To understand factors influencing backup storage usage, monitoring and controlling backup storage cost, you can refer to the [backup documentation](concepts-backup.md).

## Scale resources

After you create your server, you can independently change the vCores, the hardware generation, the pricing tier (except to and from Basic), the amount of storage, and the backup retention period. You can't change the backup storage type after a server is created. The number of vCores can be scaled up or down. The backup retention period can be scaled up or down from 7 to 35 days. The storage size can only be increased. Scaling of the resources can be done either through the portal or Azure CLI. For an example of scaling by using Azure CLI, see [Monitor and scale an Azure Database for MySQL server by using Azure CLI](../scripts/sample-scale-server.md).

When you change the number of vCores, the hardware generation, or the pricing tier, a copy of the original server is created with the new compute allocation. After the new server is up and running, connections are switched over to the new server. During the moment when the system switches over to the new server, no new connections can be established, and all uncommitted transactions are rolled back. This downtime during scaling can be around 60-120 seconds. The downtime during scaling is dependent on database recovery time, which can cause the database to come online longer if you have heavy transactional activity on the server at the time of scaling operation. To avoid longer restart time, it is recommended to perform scaling operations during periods of low transactional activity on the server.

Scaling storage and changing the backup retention period are true online operations. There is no downtime, and your application isn't affected. As IOPS scale with the size of the provisioned storage, you can increase the IOPS available to your server by scaling up storage.

## Pricing

For the most up-to-date pricing information, see the service [pricing page](https://azure.microsoft.com/pricing/details/mysql/). To see the cost for the configuration you want, the [Azure portal](https://portal.azure.com/#create/Microsoft.MySQLServer) shows the monthly cost on the **Pricing tier** tab based on the options you select. If you don't have an Azure subscription, you can use the Azure pricing calculator to get an estimated price. On the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) website, select **Add items**, expand the **Databases** category, and choose **Azure Database for MySQL** to customize the options.

## Next steps

- Learn how to [create a MySQL server in the portal](how-to-create-manage-server-portal.md).
- Learn about [service limits](concepts-limits.md).
- Learn how to [scale out with read replicas](how-to-read-replicas-portal.md).
