---
title: Reliability in Azure Community Training
description: Find out about reliability in Azure Community Training.
author: atulsoni87AI
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: reliability
ms.date: 12/06/2023
---


# Reliability in Community Training

Community Training is an Azure-powered cloud-based solution that can deliver large-scale, far-spread training programs with high quality and efficiency. With Community Training, organizations of all sizes and types can run large scale training programs for their internal and external communities. Communities can include frontline workers, extended workforces, a partner ecosystem, a volunteer network, and program beneficiaries. 

This article describes reliability support in Community Training, and covers  both regional resiliency with [availability zones](/azure/reliability/availability-zones-overview?tabs=azure-clit) and [disaster recovery and business continuity](/azure/reliability/disaster-recovery-overview). For a more detailed overview of a reliability principle in Azure, see [Azure reliability](/azure/reliability/overview).

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Community Training uses Azure availability zones to provide high availability and fault tolerance within an Azure region. Community training offers both control and data plane availability zone support: 

- The [control plane](/azure/azure-resource-manager/management/control-plane-and-data-plane#control-plane) is zone redundant in the primary regions of availability. 

- The [data plane](/azure/azure-resource-manager/management/control-plane-and-data-plane#data-plane) can be either zonal or zone-redundant, depending on what you choose for your needs. However, it's highly recommended that you choose a zone-redundant deployment in order to avoid data loss and maintain service availability during a zone outage. 


### Prerequisites

- Availability zones are supported for the following Community Training SKUs:

    - Standard (lower scale of users)
    - Premium (high scale of users)

- Community Training is only supported in [paired regions](./cross-region-replication-azure.md#azure-paired-regions).  Each secondary region is deployed with a zonal configuration. The following table shows all regions that support availability zones for Community Training, along with their paired region.

| Primary Region | Paired Region  |
|--------------------|--------------------|
| UKSouth            | UKWest             |
| AustraliaEast      | AustraliaSoutheast |
| EastUS             | WestUS             |
| EastUS2            | CentralUS          |
| NorthEurope        | WestEurope         |
| WestUS3            | EastUS             |
| SwedenCentral      | SwedenSouth        |



### Zonal failover support

Community Training uses many dependency Azure services, such as App service and Azure SQL. When you choose a zone redundant deployment, Community Training also creates zonal redundant offerings of those underlying Azure service resources. If one zone fails, all resources, including dependency resources, fail over to one of the healthy zones.


#### Create a resource with availability zone enabled

Community Training provides configuration for availability zones only at the time of instance creation. If you wish to change your availability zone configuration after instance creation, you'll need to create a new instance. To learn how to create your Community Training instance, see [Create Community Training](). 

### Zone down experience

- **Zonal**. During a zone-wide outage, Community Training can have either complete or partial service disruption. The extent to which it's available depends on various factors, such as whether the entire datacenter is down, or whether a specific dependency service is no longer available in that zone. 

- **Zone redundant**. During a zone-wide outage, you shouldn't experience any impact on provisioned resources. However, you should be prepared for a brief interruption in communication with those resources. In a zone down situation, clients typically receive 409 error codes, as well as retry logic attempts to re-establish connections at appropriate intervals. New requests are directed to healthy nodes with zero impact on the user. During zone-wide outages, users are able to create new resources and successfully scale existing ones.

## Disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

The Microsoft Community Training team manages the entire disaster recovery procedure for Community Training. Disaster recovery isn't active-active or active passive, but is instead based on recovery from the most recent available backup of Azure services. The Community Training team manually creates all resources in the paired region from data backup.

>[!NOTE]
>Community Training disaster recovery is only supported in [paired regions](./cross-region-replication-azure.md#azure-paired-regions). 

### Disaster recovery in multi-region geography

- In a regional disaster, the **control plane** is manually failed over to the paired region. You should expect some service degradation in the time before the failover completes. After the failover, only read-only operations are supported until the disaster region is back online. The service is manually failed back to the original region once it's back online and all operations resume. Recovery Point Objective (RPO) is expected to be 10 minutes; Recovery Time Objective (RTO), 24 hours.

- For the **data plane**, Community Training offers microsoft managed disaster recovery. To use managed disaster recovery, you need to [enable disaster recovery]() during Community Training instance creation in Azure. Once you enable disaster recovery, Microsoft maintains the backup of storage and database in the paired region. Recovery Point Objective (RPO) is expected to be 12 hours; Recovery Time Objective (RTO), 48 hours.


>[!NOTE]
> RTO depends on database and storage size, latency between the paired region. Database or storage VM capacity (SKU). RPO depends on underlying Azure resources, such as [Azure SQL](/azure/azure-sql/database/recovery-using-backups?view=azuresql&tabs=azure-portal&preserve-view=true#geo-restore-considerations) and Azure storage. For more information on RTO and RPO, see [Overview of Disaster Recovery](./disaster-recovery-overview.md).


#### Outage detection, notification, and management

When a Community Training health check detects an outage of any service, and in any region, Microsoft requests your consent for failover to the paired region. Microsoft informs you which features are available during the disaster recovery procedure. Once Microsoft receives your consent, the Community Training team can then start the disaster recovery procedure.

>[!IMPORTANT]
> Learners will not be able to consume audio/video features until the primary region is operational. It's recommended that you avoid media upload operations until the primary site is operational.


### Capacity and proactive disaster recovery resiliency

Microsoft and its customers operate under the shared responsibility model. Once any region is down, not only is the Community Training instance migrated to the paired region, but also all product and customer workloads are also migrated to paired region.  This procedure can cause a shortage for resources in the paired region or datacenter. As a result, Disaster recovery availability depends on the available capacity of the underlying Azure resources.

## Next steps

- [Reliability in Azure](./overview.md)
