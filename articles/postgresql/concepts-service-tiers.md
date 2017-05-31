---
title: "Service Tiers in Azure Database for PosgreSQL | Microsoft Docs"
description: "Service Tiers in Azure Database for PosgreSQL"
services: postgresql
author: kamathsun
ms.author: sukamat
manager: jhubbard
editor: jasonh
ms.assetid:
ms.service: postgresql-database
ms.tgt_pltfrm: portal
ms.topic: article
ms.date: 05/16/2017
---
# Azure Database for PostgreSQL options and performance: Understand what’s available in each service tier

While in preview, Azure Database for PostgreSQL offers only the Basic and Standard service tiers. Premium is not yet available.

Each service tier has multiple performance levels to handle different types of workloads requirements. Higher performance levels provide additional resources designed to deliver increasingly higher throughput. You can change performance levels within a service tier dynamically without application downtime.

In the future, it will be possible to upgrade or downgrade from one service tier to another.

> [!IMPORTANT]
> The service is currently in public preview, and so does not yet provide a Service Level Agreement (SLA).

You can create single PostgreSQL server with dedicated resources within a service tier at a specific performance level. You can then create one to several databases within the server in which the resources are shared across multiple databases. The resources available for single PostgreSQL server are expressed in terms of Compute Units and Storage Units. For more on Compute Units and Storage, see [Explaining Compute Unit and Storage Unit](concepts-compute-unit-and-storage.md)

## Choosing a service tier

The following table provides examples of the tiers best suited for different application workloads.

| Service tier | Target workloads |
| :----------- | :----------------|
| Basic | Best suited for small workloads that require scalable compute and storage without IOPS guarantee. Examples include servers used for development or testing, or small-scale infrequently used applications. |
| Standard | The go-to option for cloud applications that need IOPS guarantee with an ability to scale to higher compute and storage independently for high throughput. Examples include web or analytical applications. |
| Premium | Best suited for workloads that need very brief latencies for transactions and IO, along with high IO and workload throughput. Provides the best support for many concurrent users. Applicable to databases which support mission critical applications.<br />The Premium service tier is not available in preview. |
| &nbsp; | &nbsp; |

To decide on a service tier, first start by determining if your workload need IOPS guarantee. Then determine the minimum features that you need:

| **Service tier features** | **Basic** | **Standard** | **Premium** * |
| :------------------------ | :-------- | :----------- | :------------ |
| Maximum Compute Units | 100 | 2,000 | Not available in preview |
| Maximum total storage | 1,050 GB | 10,000 GB | Not available in preview |
| Storage IOPS guarantee | N/A | Yes | Not available in preview |
| Maximum storage IOPS | N/A | 3,000 | Not available in preview |
| Database backup retention period | 7 days | 35 days | 35 days |


> [!NOTE]
> The Standard service tier in preview currently supports up to 800 Compute Units, and a maximum of 1,000 GB of storage.

Once you have determined the minimum service tier, you are ready to determine the performance level for the PostgreSQL server (the Compute Units). The standard 200 and 400 Compute Units are often a good starting point for applications that require higher user concurrency for their web or analytical workloads. 

However, you can scale up or down the Compute Units independent of Storage Units, based on the requirements of the workload. If the workload needs an adjustment of compute resources, you can dynamically increase or decrease the Compute Units. If your workload needs more IOPS or storage, then you can also scale Storage.

> [!NOTE]
> In preview, the Basic and Standard tiers currently do not support the dynamic scaling of storage. We plan to add the feature in the future.

> [!NOTE]
> At the Standard service tier, IOPS scales proportionally to provisioned storage size in a fixed 3:1 ratio. The included storage of 125 GB guarantees for 375 provisioned IOPS, each with an IO size of up to 256 KB. If you provision 1,000 GB, you will get 3,000 provisioned IOPS. You must monitor the server compute units consumption, and scale up, to fully utilize the available provisioned IOPS.

## Service tiers and performance levels

Azure Database for PostgreSQL offers multiple performance levels within each service tier. You have the flexibility to choose the level that best meets your workload’s demands, by using one of the following:

- [Azure portal](quickstart-create-server-database-portal.md), located at [http://portal.azure.com](http://portal.azure.com)
- [Azure CLI](quickstart-create-server-database-azure-cli.md)

Regardless of the number of databases hosted within each PostgreSQL server, your database gets a guaranteed set of resources and the expected performance characteristics of your server are not affected.

### Basic service tier:

| **Performance level** | **50** | **100** |
| --------------------: | :----- | :------ |
| Max Compute Units | 50 | 100 |
| Included Storage size | 50 GB | 50 GB |
| Max server storage size\* | 1,050 GB | 1,050 GB |

### Standard service tier:

| **Performance level** | **100** | **200** | **400** | **800** |
| --------------------: | :------ | :------ | :------ | :------ |
| Max Compute Units | 100 | 200 | 400 | 800 |
| Included storage size and provisioned IOPS | 125 GB,<br/> 375 IOPS | 125 GB,<br/> 375 IOPS | 125 GB,<br/> 375 IOPS | 125 GB,<br/> 375 IOPS |
| Max server storage size\* | 1 TB | 1 TB | 1 TB | 1 TB |
| Max server provisioned IOPS | 3,000 IOPS | 3,000 IOPS | 3,000 IOPS | 3,000 IOPS |
| Max server provisioned IOPS per GB | Fixed 3 IOPS per GB | Fixed 3 IOPS per GB | Fixed 3 IOPS per GB | Fixed 3 IOPS per GB |

\* Max server storage size refers to the maximum provisioned storage size for your server.

## Scaling up or down a server

After initially choosing a service tier and performance level, you can scale the server up or down dynamically based on workload requirements. If you need to scale up or down, you can easily change the tier of your database by using the Azure portal or the Azure CLI.

Changing the service tier and/or performance level of a database creates a replica of the original database at the new performance level, and then switches connections over to the replica. No data is lost during this process but during the brief moment when we switch over to the replica, connections to the database are disabled, so some transactions in flight may be rolled back. This window varies, but is on average under 4 seconds, and in more than 99% of cases is less than 30 seconds. If there are large numbers of transactions in flight at the moment connections are disabled, this window may be longer.

The duration of the entire scale-up process depends on both the size and service tier of the server before and after the change. For example, a server that is changing Compute Units, to or from or within a Standard service tier, should complete within few minutes. The new properties for the server are not applied until the changes are complete.

You can use the Azure portal to scale up and down, or use Azure CLI to monitor and scale your server. See: [Monitor and scale a single PostgreSQL server using Azure CLI](scripts/sample-scale-server-up-or-down.md)

### Details about scaling up or down

- To downgrade a server, the server Storage Units should be smaller than the maximum allowed size of the target service tier.
- The restore service offerings are different for the various service tiers. If you are downgrading you may lose the ability to restore to a point in time, or have a lower backup retention period. For more information, see [How To Backup and Restore Azure Database for PostgreSQL server using the Azure portal](howto-restore-server-portal.md)
- The new properties for the server are not applied until the changes are complete.
