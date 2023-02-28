---
title: Reliability in Azure Database for PostgreSQL - Flexible Server
description: Find out about reliability in Azure Database for PostgreSQL - Flexible Server
author: anaharris-ms
ms.author: anaharris
ms.topic: conceptual
ms.service: azure-functions
ms.custom: references_regions, subject-reliability
ms.date: 02/28/2023
---

<!--#Customer intent:  I want to understand reliability support in Azure Database for PostgreSQL - Flexible Server so that I can respond to and/or avoid failures in order to minimize downtime and data loss. -->


# Reliability in Azure Database for PostgreSQL - Flexible Server

This article describes reliability support in Azure Database for PostgreSQL - Flexible Server and covers both intra-regional resiliency with [availability zones](#availability-zone-support) and links to information on [cross-region resiliency with disaster recovery](#disaster-recovery-cross-region-failover). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

Azure Database for PostgreSQL - Flexible Server offers both zonal and zone-redundant availability deployment models with automatic failover capabilities. The availability offering is designed to ensure that committed data is never lost in the case of failures and that the database won't be a single point of failure in your software architecture. When availability is configured, flexible server automatically provisions and manages a standby replica.


## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones are designed so that if one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.  Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Availability zone service and regional support](availability-zones-service-support.md).

There are three types of Azure services that support availability zones: zonal, zone-redundant, and always-available services. You can learn more about these types of services and how they promote resiliency in the [Azure services with availability zone support](availability-zones-service-support.md#azure-services-with-availability-zone-support).

Azure Database for PostgreSQL - Flexible Server supports both [zone-redundant and zonal models](availability-zones-service-support.md#azure-services-with-availability-zone-support).  

- **Zone-redundant**. This option provides a complete isolation and redundancy of infrastructure across multiple availability zones within a region. It provides the highest level of availability, but it requires you to configure application redundancy across zones. Zone-redundancy is preferred when you want protection from availability zone level failures and when latency across the availability zone is acceptable. A zone-redundant deployment enables Flexible server to be available across availability zones. You can choose both the region and the availability zones for the primary and standby servers. The standby replica server is provisioned in the chosen availability zone in the same region with similar compute, storage, and network configuration as the primary server. Data files and transaction log files (write-ahead logs a.k.a WAL) are stored on locally redundant storage (LRS) within each availability zone, which automatically stores **three** data copies. This provides physical isolation of the entire stack between primary and standby servers. 

    :::image type="content" source="../postgresql/flexible-server/media/business-continuity/concepts-zone-redundant-high-availability-architecture.png" alt-text="zone redundant availability"::: 

- **Zonal**. A zonal deployment is preferred when you want to achieve the highest level of availability within a single availability zone with the lowest network latency. You can choose the region and the availability zone in which to deploy your primary database server. A standby replica server is *automatically* provisioned and managed in the *same* availability zone in the same region with similar compute, storage, and network configuration as the primary server. Data files and transaction log files (write-ahead logs a.k.a WAL) are stored on locally redundant storage, which automatically stores as *three* data copies each for primary and standby. This provides physical isolation of the entire stack between primary and standby servers within the same availability zone. 


>[!IMPORTANT]
>In both zone-redundant and zonal models, automatic backups are performed periodically from the primary database server, while the transaction logs are continuously archived to the backup storage from the standby replica. If the region supports availability zones, then backup data is stored on zone-redundant storage (ZRS). In regions that doesn't support availability zones, backup data is stored on local redundant storage (LRS).   

:::image type="content" source="../postgresql/flexible-server/media/business-continuity/concepts-same-zone-high-availability-architecture.png" alt-text="Same-zone high availability"::: 

### Prerequisites

#### Zone redundancy

- The **zone-redundancy** option is only available in a [regions that support availability zones](../postgresql/flexible-server/overview.md#azure-regions).

Zone-redundancy zones are **not** supported for the following:

- Azure Database for PostgreSQL – Single Server SKU.  
- Burstable compute tier.
- Regions with single-zone availability

#### Zonal

- The **zonal** deployment option is available in all [Azure regions](../postgresql/flexible-server/overview.md#azure-regions) where you can deploy Flexible Server. 


### SLA

-  **Zone-Redundancy** model offers uptime [SLA of 99.95%](https://azure.microsoft.com/support/legal/sla/postgresql).

-  **Zonal** model offers uptime [SLA of 99.99%](https://azure.microsoft.com/support/legal/sla/postgresql).

### Create an Azure Database for PostgreSQL - Flexible Server with availability zone enabled

To learn how to create an Azure Database for PostgreSQL - Flexible Server, see [Quickstart: Create an Azure Database for PostgreSQL - Flexible Server in the Azure portal](/azure/postgresql/flexible-server/quickstart-create-server-portal).
## Disaster recovery: cross region failover

