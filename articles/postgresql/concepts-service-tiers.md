---
title: "Pricing Tiers in Azure Database for PosgreSQL | Microsoft Docs"
description: "Pricing Tiers in Azure Database for PosgreSQL"
services: postgresql
author: kamathsun
ms.author: sukamat
manager: jhubbard
editor: jasonh
ms.assetid:
ms.service: postgresql-database
ms.tgt_pltfrm: portal
ms.topic: article
ms.date: 05/17/2017
---
# Azure Database for PostgreSQL options and performance: Understand what’s available in each Pricing tier
When you create an Azure Database for PostgreSQL server, you decide upon three main choices to set the resources allocated for that server. These choices impact the performance level of the server.
- Pricing tier
- Compute Units
- Storage (GB)

While in preview, Azure Database for PostgreSQL offers two pricing tiers: Basic and Standard. Premium tier is not yet available, but is coming soon. In the future, it will be possible to upgrade or downgrade from one pricing tier to another dynamically.

Each pricing tier has multiple performance levels (Compute Units) to handle different types of workloads requirements. Higher performance levels provide additional resources designed to deliver higher throughput. You can change performance levels within a pricing tier without application downtime.  

> [!IMPORTANT]
> While the service is in public preview, there is not a guaranteed Service Level Agreement (SLA).

Within the server, you can choose to create a single database to use those selected resources in a dedicated fashion, or you can create multiple databases to share the resources within the same server. 

For more on Compute Units and storage, see [Explaining Compute Units and storage](concepts-compute-unit-and-storage.md)

## Choose a pricing tier
The following table provides examples of the tiers best suited for different application workloads.

| Pricing tier | Target workloads |
| :----------- | :----------------|
| Basic | Best suited for small workloads that require scalable compute and storage without IOPS guarantee. Examples include servers used for development or testing, or small-scale infrequently used applications. |
| Standard | The go-to option for cloud applications that need IOPS guarantee with an ability to scale to higher compute and storage independently for high throughput. Examples include web or analytical applications. |
| Premium | Best suited for workloads that need very brief latencies for transactions and IO, along with high IO and workload throughput. Provides the best support for many concurrent users. Applicable to databases which support mission critical applications.<br />The Premium service tier is not available in preview. |

To decide on a pricing tier, first start by determining if your workload need IOPS guarantee. Then determine the minimum features that you need. The database backup retention period varies in each pricing tier.

| **Pricing tier features** | **Basic** | **Standard** |
| :------------------------ | :-------- | :----------- |
| Maximum Compute Units | 100 | 800 | 
| Maximum total storage | 1 TB | 1 TB | 
| Storage IOPS guarantee | N/A | Yes | 
| Maximum storage IOPS | N/A | 3,000 | 
| Database backup retention period | 7 days | 35 days | 

The Standard pricing tier in preview currently supports up to 800 Compute Units, and a maximum of 1 TB of storage and 3,000 IOPS.
Within the Standard pricing tier, the IOPS scales proportionally to provisioned storage size in a fixed 3:1 ratio. The included storage of 125 GB guarantees for 375 provisioned IOPS, each with an IO size of up to 256 KB. You can select additional storage up to 1 TB, to guarantee 3,000 provisioned IOPS. Monitor the server compute units consumption, and scale up as needed to fully utilize the available provisioned IOPS.

During the preview timeframe, you cannot change pricing tier once the server is created. 

## Choose a performance level (Compute Units)
Once you have determined the pricing tier for your Azure Database for PostgreSQL server, you are ready to determine the performance level by selecting the number of Compute Units needed. A good starting point is 200 or 400 Compute Units for applications that require higher user concurrency for their web or analytical workloads. 

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

## Scaling a server up or down
After initially choosing the pricing tier and performance level when you create your Azure Database for PostgreSQL, later you can scale the Compute Units up or down dynamically within the same pricing tier. In the Azure portal, slide the Compute Units on the server's Pricing tier blade, or script it by following this example: [Monitor and scale a single PostgreSQL server using Azure CLI](scripts/sample-scale-server-up-or-down.md)

Scaling the Compute Units is done independently of the maximum storage size you have chosen. While in preview, changing the storage size  is not supported. You must choose the amount of storage at the time when the server is first created.

Behing the scenes, changing the performance level of a database creates a replica of the original database at the new performance level, and then switches connections over to the replica. No data is lost during this process. During the brief moment when we switch over to the replica, connections to the database are disabled, so some transactions in flight may be rolled back. This window varies, but is on average under 4 seconds, and in more than 99% of cases is less than 30 seconds. If there are large numbers of transactions in flight at the moment connections are disabled, this window may be longer.

The duration of the entire scale process depends on both the size and pricing tier of the server before and after the change. For example, a server that is changing Compute Units within the Standard pricing tier, should complete within few minutes. The new properties for the server are not applied until the changes are complete.
