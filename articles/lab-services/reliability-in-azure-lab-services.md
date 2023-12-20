---
title: Reliability in Azure Lab Services 
description: Learn about reliability in Azure Lab Services
ms.topic: overview
ms.custom: subject-resiliency, references_regions, ignite-2022
ms.date: 08/18/2022
---

# What is reliability in Azure Lab Services?

This article describes reliability support in Azure Lab Services, and covers regional resiliency with availability zones. For a more detailed overview of reliability in Azure, see [Azure resiliency](../availability-zones/overview.md).

## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones allow the services to fail over to the other availability zones to provide continuity in service with minimal interruption. Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](../availability-zones/az-overview.md).

Azure availability zones-enabled services are designed to provide the right level of resiliency and flexibility. They can be configured in two ways. They can be either zone redundant, with automatic replication across zones, or zonal, with instances pinned to a specific zone. You can also combine these approaches. For more information on zonal vs. zone-redundant architecture, see [Build solutions with availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability).

Azure Lab Services provide availability zone redundancy automatically in all regions listed in this article. While the service infrastructure is zone redundant, customer labs and VMs are not zone redundant.

Currently, the service is not zonal. That is, you can’t configure a lab or the VMs in the lab to align to a specific zone. A lab and VMs may be distributed across zones in a region.

### SLA improvements

There are no increased SLAs available for availability in Azure Lab Services. For the monthly uptime SLAs for Azure Lab Services, see [SLA for Azure Lab Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

The Azure Lab Services infrastructure uses Azure Cosmos DB storage. The Azure Cosmos DB storage region is the same as the region where the lab plan is located. All the regional Azure Cosmos DB accounts are single region. In the zone-redundant regions listed in this article, the Azure Cosmos DB accounts are single region with Availability Zones. In the other regions, the accounts are single region without Availability Zones. For high availability capabilities for these account types, see [SLAs for Azure Cosmos DB](../cosmos-db/high-availability.md#slas).

### Zone down experience

#### Azure Lab Services infrastructure

Azure Lab Services infrastructure is zone-redundant in the following regions:

- Australia East
- Canada Central
- France Central
- Korea Central
- East Asia

Resources apart from the Lab resources and virtual machines are zone redundant in these regions.

In the event of a zone outage in these regions, you can still perform the following tasks:

- Access the Azure Lab Services website
- Create/manage lab plans
- Create Users
- Configure lab schedules
- Create/manage labs and VMs in regions unaffected by the zone outage.

Data loss may occur only with an unrecoverable disaster in the Azure Cosmos DB region. For more information, see [Region outages](../cosmos-db/high-availability.md#region-outages).

For regions not listed, access to the Azure Lab Services infrastructure is not guaranteed when there is a zone outage in the region containing the lab plan. You will only be able to perform the following tasks:

- Access the Azure Lab Services website
- Create/manage lab plans, labs, and VMs in regions unaffected by the zone outage

> [!NOTE]
> Existing labs and VMs in regions unaffected by the zone outage aren't affected by a loss of infrastructure in the lab plan region. Existing labs and VMs in unaffected regions can still run and operate as normal.

#### Labs and VMs

Azure Lab Services is not currently zone aligned. So, VMs in a region may be distributed across zones in the region. Therefore, when a zone in a region experiences an outage, there are no guarantees that a lab or any VMs in the associated region will be available.

As a result, the following operations are not guaranteed in the event of a zone outage:

- Manage or access labs/VMs
- Start/stop/reimage VMs
- Create/publish/delete labs
- Scale up/down labs
- Connect to VMs

If there's a zone outage in the region, there's no expectation that you can use any labs or VMs in the region.
Labs and VMs in other regions will be unaffected by the outage.

#### Zone outage preparation and recovery

Lab and VM services will be restored as soon as the zone availability is restored (the outage is resolved).

If infrastructure is impacted, it will be restored when the zone availability is resolved.

### Region down experience

#### Azure Lab Services infrastructure

In a regional outage, in most scenarios you will only be able to perform the following tasks related to Azure Lab Services infrastructure:

- Access the Azure Lab Services website
- Create/manage lab plans, labs, and VMs in regions unaffected by the zone outage

Typically, labs are in the same region as the lab plan. However, if the outage is in the lab plan region and an existing lab is in an unaffected region, you can still perform the following tasks for the existing lab in the unaffected region:

- Create Users
- Configure lab schedules

#### Labs and VMs

In a regional outage, labs and VMs in the region are unavailable, so you will not be able to use or manage them.

Existing labs and VMs in regions unaffected by the outage aren't affected by a loss of infrastructure in the lab plan region. Existing labs and VMs in unaffected regions can still run and operate as normal.

#### Regional outage preparation and recovery

Lab and VM services will be restored as soon as the regional outage is restored (the outage is resolved).

If infrastructure is impacted, it will be restored when the regional outage is resolved.

### Fault tolerance

If you want to preserve maximum access to Azure Lab Services infrastructure during a zone outage, create the lab plan in one of the zone-redundant regions listed.

- Australia East
- Canada Central
- France Central
- Korea Central
- East Asia

## Disaster recovery

Azure Lab Services does not provide regional failover support. If you want to preserve maximum access to the Azure Lab Services infrastructure during a zone outage, create the lab plan in one of the [zone-redundant regions](#fault-tolerance).

### Outage detection, notification, and management

Azure Lab Services does not provide any service-specific signals about an outage, but is dependent on Azure communications that inform customers about outages. For more information on service health, see [Resource health overview](../service-health/resource-health-overview.md).

## Next steps

> [!div class="nextstepaction"]
> [Resiliency in Azure](../availability-zones/overview.md)
