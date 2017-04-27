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
ms.date: 05/10/2017
---
# Azure Database for PostgreSQL options and performance: Understand what’s available in each service tier
Azure Database for PostgreSQL offers three service tiers: Basic, Standard, and Premium. Each service tier has multiple performance levels to handle different workloads. Higher performance levels provide additional resources designed to deliver increasingly higher throughput. You can change performance levels within a service tier dynamically without application downtime. 

In addition, it is also possible to change service tiers, for example, upgrade from Basic to Standard service tier and vice versa without application downtime, however, this feature will be available in the future. Basic, Standard, and Premium service tiers all have an uptime SLA of 99.99%, flexible business continuity options, security features, and hourly billing. 

>[!IMPORTANT]
>The service, currently in public preview service does not provide an SLA.

You can create single PostgreSQL server with dedicated resources within a service tier at a specific performance level. You can then create one to several databases within the server in which the resources are shared across multiple databases. The resources available for single PostgreSQL server are expressed in terms of Compute Units and Storage Units. For more on Compute Units and Storage, see [Explaining Compute Unit and Storage Unit](concepts-compute-unit-and-storage.md)

## Choosing a service tier
The following table provides examples of the tiers best suited for different application workloads.
| Service tier | Target workloads |
|--------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Basic** | Best suited for small workloads that require scalable compute and storage without IOPS guarantee. Examples include servers used for development or testing, or small-scale infrequently used applications. |
| **Standard** | The go-to option for cloud applications that need IOPS guarantee with an ability to scale to higher compute and storage independently for high throughput. Examples include web or analytical applications. |
| **Premium** | Best suited for workloads that need very low transaction and IO latency along with high IO and workload throughput. Designed for high transactional and analytical workload volume with low latency requirements, supporting many concurrent users. Examples are databases supporting mission critical applications. |

To decide on a service tier, first start by determining if your workload need IOPS guarantee. Then determine the minimum features that you need:
| **Service tier features** | **Basic** | **Standard** | **Premium\*** |
|----------------------------------|-----------|--------------|---------------|
| Maximum Compute Units | 100 | 2000 | 2000 |
| Maximum total storage | 1050 GB | 10000 GB | 4000 GB |
| Storage IOPS guarantee | N/A | Yes | Yes |
| Maximum storage IOPS | N/A | 30,000 | 40,000 |
| Database backup retention period | 7 days | 35 days | 35 days |

>[!IMPORTANT]
>Standard service tier is currently supported up to 1000 GB. If you need to provision > 1000 GB storage, please call support. Premium service tier is currently not yet supported and will be available in the future.

Once you have determined the minimum service tier, you are ready to determine the performance level for the PostgreSQL server (the Compute Units). The standard 200 and 400 Compute Units are often a good starting point for applications that require higher user concurrency for their web or analytical workloads. 

However, you can scale up or down the Compute Units independent of Storage Units based on the requirements of the workload. If the workload need more or less compute resources, you can dynamically increase or decrease the Compute Units. If your workload needs more IOPS or storage, then you can also scale Storage Units.

>[!IMPORTANT]
>With Standard service tier, IOPS scales proportionally to provisioned storage size in a fixed 3:1 ratio. The included storage of 125 GB provides guarantee for 375 provisioned IOPS, each with IO size of up to 256KB. You can incrementally add storage in 125 GB chunks, up to the maximum allowed. Each incremental 125 GB chunk provides an additional 375 provisioned IOPS. You have to monitor the server compute units consumption and scale up to fully utilize the available provisioned IOPS.

For databases with high compute and very low latency requirements, the Premium performance levels is the right starting point. Premium offers more memory and up to 10x more very low latency IOPS per GB compared to the standard service tier.

## Service tiers and performance levels
Azure Database for PostgreSQL offers multiple performance levels within each service tier. You have the flexibility to choose the level that best meets your workload’s demands.

Regardless of the number of databases hosted within each PostgreSQL server, your database gets a guaranteed set of resources and the expected performance characteristics of your server are not affected.
Basic service tier
| **Performance level** | **50** | **100** |
|---------------------------|---------|---------|
| Max Compute Units | 50 | 100 |
| Included Storage size | 50 GB |
| Max server storage size\* | 1050 GB | 1050 GB |
| Max concurrent logins | | |
| Max connections | | |

Standard service tier
| **Performance level** | **100** | **200** | **400** | **800** | **1600** | **2000** |
|--------------------------------------------|---------------------|---------|---------|---------|----------|----------|
| Max Compute Units | 100 | 200 | 400 | 800 | 1600 | 2000 |
| Included storage size and provisioned IOPS | 125 GB, 375 IOPS |
| Max server storage size\* | 10000 GB |
| Max server provisioned IOPS | 30,000 IOPS |
| Max server provisioned IOPS per GB | Fixed 3 IOPS per GB |
| Max concurrent logins | | | | | | |
| Max connections | | | | | | |

Premium service tier
| **Performance level** | **100** | **200** | **400** | **800** | **1600** | **2000** |
|--------------------------------------------|----------------|---------|---------|---------|----------|----------|
| **Max Compute Units** | **100** | **200** | **400** | **800** | **1600** | **2000** |
| Included storage size and provisioned IOPS | 250 GB, 1000 |
| Max server storage size\* | 4000 GB |
| Max server provisioned IOPS | 40,000 IOPS |
| Max server provisioned IOPS per GB | 10 IOPS per GB |
| Max concurrent logins | | | | | | |
| Max concurrent sessions | | | | | | |

*Max server storage size refers to the maximum provisioned storage size for your server.

## Scaling up or down a single server
After initially picking a service tier and performance level, you can scale the server up or down dynamically based on workload requirements. If you need to scale up or down, you can easily change the tier of your database using the Azure portal, Azure CLI, or Rest API.

See also, [Scale up your server using Azure CLI](scripts/sample-scale-server-up-or-down.md)

Changing the service tier and/or performance level of a database creates a replica of the original database at the new performance level, and then switches connections over to the replica. No data is lost during this process but during the brief moment when we switch over to the replica, connections to the database are disabled, so some transactions in flight may be rolled back. This window varies, but is on average under 4 seconds, and in more than 99% of cases is less than 30 seconds. If there are large numbers of transactions in flight at the moment connections are disabled, this window may be longer.

The duration of the entire scale-up process depends on both the size and service tier of the server before and after the change. For example, a server that is changing Compute Units to, from, or within a Standard service tier, should complete within few minutes. For the server of the same size that is changing performance levels between service tiers, for example, Basic to Standard will take longer time.
- To downgrade a server, the server Storage Units should be smaller than the maximum allowed size of the target service tier.
- The restore service offerings are different for the various service tiers. If you are downgrading you may lose the ability to restore to a point in time, or have a lower backup retention period. For more information, see [How To Backup and Restore Azure Database for PostgreSQL server using the Azure portal](howto-restore-server-portal.md)
- The new properties for the server are not applied until the changes are complete.

## Next Steps
[Scale up your server using Azure CLI](scripts/sample-scale-server-up-or-down.md)
