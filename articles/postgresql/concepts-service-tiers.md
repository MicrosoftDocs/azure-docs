---
title: "Pricing Tiers in Azure Database for PostgreSQL"
description: "Pricing Tiers in Azure Database for PostgreSQL"
services: postgresql
author: kamathsun
ms.author: sukamat
manager: jhubbard
editor: jasonwhowell
ms.custom: mvc
ms.service: postgresql-database
ms.topic: article
ms.date: 05/31/2017
---
# Azure Database for PostgreSQL options and performance: Understand what’s available in each pricing tier
When you create an Azure Database for PostgreSQL server, you decide upon three main choices to configure the resources allocated for that server. These choices impact the performance and scale of the server.
- Pricing tier
- Compute Units
- Storage (GB)

Each pricing tier has a range of performance levels (Compute Units) to choose from, depending on your workloads requirements. Higher performance levels provide additional resources for your server designed to deliver higher throughput. You can change the server's performance level within a pricing tier with virtually no application downtime.

> [!IMPORTANT]
> While the service is in public preview, there is not a guaranteed Service Level Agreement (SLA).

Within an Azure Database for PostgreSQL server, you can have one or multiple databases. You can opt to create a single database per server to utilize all the resources, or create multiple databases to share the resources. 

## Choose a pricing tier
While in preview, Azure Database for PostgreSQL offers two pricing tiers: Basic and Standard. Premium tier is not yet available, but is coming soon. 

The following table provides examples of the pricing tiers best suited for different application workloads.

| Pricing tier | Target workloads |
| :----------- | :----------------|
| Basic | Best suited for small workloads that require scalable compute and storage without IOPS guarantee. Examples include servers used for development or testing, or small-scale infrequently used applications. |
| Standard | The go-to option for cloud applications that need IOPS guarantee with high throughput. Examples include web or analytical applications. |
| Premium | Best suited for workloads that need low latency for transactions and IO. Provides the best support for many concurrent users. Applicable to databases that support mission critical applications.<br />The Premium pricing tier is not available in preview. |

To decide on a pricing tier, first start by determining if your workload needs an IOPS guarantee. If so, use Standard pricing tier.

| **Pricing tier features** | **Basic** | **Standard** |
| :------------------------ | :-------- | :----------- |
| Maximum Compute Units | 100 | 800 | 
| Maximum total storage | 1 TB | 1 TB | 
| Storage IOPS guarantee | N/A | Yes | 
| Maximum storage IOPS | N/A | 3,000 | 
| Database backup retention period | 7 days | 35 days | 

During the preview timeframe, you cannot change pricing tier once the server is created. In the future, it will be possible to upgrade or downgrade a server from one pricing tier to another tier.

## Choose a performance level (Compute Units)
Once you have determined the pricing tier for your Azure Database for PostgreSQL server, you are ready to determine the performance level by selecting the number of Compute Units needed. A good starting point is 200 or 400 Compute Units for applications that require higher user concurrency for their web or analytical workloads, and adjust incrementally as needed. 

Compute Units are a measure of CPU processing throughput that is guaranteed to be available to a single Azure Database for PostgreSQL server. A Compute Unit is a blended measure of CPU and memory resources.  For more information, see [Explaining Compute Units](concepts-compute-unit-and-storage.md)

### Basic pricing tier performance levels:

| **Performance level** | **50** | **100** |
| :-------------------- | :----- | :------ |
| Max Compute Units | 50 | 100 |
| Included storage size | 50 GB | 50 GB |
| Max server storage size\* | 1 TB | 1 TB |

### Standard pricing tier performance levels:

| **Performance level** | **100** | **200** | **400** | **800** |
| :-------------------- | :------ | :------ | :------ | :------ |
| Max Compute Units | 100 | 200 | 400 | 800 |
| Included storage size and provisioned IOPS | 125 GB,<br/> 375 IOPS | 125 GB,<br/> 375 IOPS | 125 GB,<br/> 375 IOPS | 125 GB,<br/> 375 IOPS |
| Max server storage size\* | 1 TB | 1 TB | 1 TB | 1 TB |
| Max server provisioned IOPS | 3,000 IOPS | 3,000 IOPS | 3,000 IOPS | 3,000 IOPS |
| Max server provisioned IOPS per GB | Fixed 3 IOPS per GB | Fixed 3 IOPS per GB | Fixed 3 IOPS per GB | Fixed 3 IOPS per GB |

\* Max server storage size refers to the maximum provisioned storage size for your server.

## Storage 
The storage configuration defines the amount of storage capacity available to an Azure Database for PostgreSQL server. The storage used by the service includes the database files, transaction logs, and the PostgreSQL server logs. Consider the size of storage needed to host your databases and the performance requirements (IOPS) when selecting the storage configuration.

Some storage capacity is included at a minimum with each pricing tier, noted in the preceding table as "Included storage size." Additional storage capacity can be added when the server is created, in increments of 125 GB, up to the maximum allowed storage. The additional storage capacity can be configured independently of the Compute Units configuration. The price changes based on the amount of storage selected.

The IOPS configuration in each performance level relates to the pricing tier and the storage size chosen. Basic tier does not provide an IOPS guarantee. Within the Standard pricing tier, the IOPS scale proportionally to maximum storage size in a fixed 3:1 ratio. The included storage of 125 GB guarantees for 375 provisioned IOPS, each with an IO size of up to 256 KB. You can choose additional storage up to 1 TB maximum, to guarantee 3,000 provisioned IOPS.

Monitor the Metrics graph in the Azure portal or write Azure CLI commands to measure the consumption of storage and IOPS. Relevant metrics to monitor are Storage limit, Storage percentage, Storage used, and IO percent.

>[!IMPORTANT]
> While in preview, choose the amount of storage at the time when the server is created. Changing the storage size on an existing server is not yet supported. 

## Scaling a server up or down
You initially choose the pricing tier and performance level when you create your Azure Database for PostgreSQL. Later, you can scale the Compute Units up or down dynamically, within the range of the same pricing tier. In the Azure portal, slide the Compute Units on the server's Pricing tier blade, or script it by following this example: [Monitor and scale a single PostgreSQL server using Azure CLI](scripts/sample-scale-server-up-or-down.md)

Scaling the Compute Units is done independently of the maximum storage size you have chosen.

Behind the scenes, changing the performance level of a database creates a replica of the original database at the new performance level, and then switches connections over to the replica. No data is lost during this process. During the brief moment when we switch over to the replica, connections to the database are disabled, so some transactions in flight may be rolled back. This window varies, but is on average under 4 seconds, and in more than 99% of cases is less than 30 seconds. If there are large numbers of transactions in flight at the moment connections are disabled, this window may be longer.

The duration of the entire scale process depends on both the size and pricing tier of the server before and after the change. For example, a server that is changing Compute Units within the Standard pricing tier, should complete within few minutes. The new properties for the server are not applied until the changes are complete.

## Next steps
- For more on Compute Units, see [Explaining Compute Units](concepts-compute-unit-and-storage.md)
- Learn how to [Monitor and scale a single PostgreSQL server using Azure CLI](scripts/sample-scale-server-up-or-down.md)
