---
title: Reliability in Azure Lab Services 
description: Learn about reliability in Azure Lab Services
ms.topic: overview
ms.custom: subject-resiliency
ms.date: 08/11/2022
---

# What is reliability in Azure Lab Services?

Reliability is a system’s ability to recover from failures and continue to function. It’s not only about avoiding failures but also involves responding to failures in a way that minimizes downtime or data loss. Because failures can occur at various levels, it’s important to have protection for all types based on service reliability requirements. Reliability in Azure supports and advances capabilities that respond to outages in real time to ensure continuous service and data protection assurance for mission-critical applications that require near-zero downtime and high customer confidence.

This article describes reliability support in Azure Lab Services, and covers regional resiliency with availability zones. For a more detailed overview of reliability in Azure, see [Azure resiliency](/azure/availability-zones/overview.md).

## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones are designed so that if the one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.  Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](/azure/availability-zones/az-overview.md).

Azure availability zones-enabled services are designed to provide the right level of resiliency and flexibility. They can be configured in two ways. They can be either zone redundant, with automatic replication across zones, or zonal, with instances pinned to a specific zone. You can also combine these approaches. For more information on zonal vs. zone-redundant architecture, see [Build solutions with availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability).

Azure Lab Services provide zone redundancy for service infrastructure for specific regions. Zone redundancy is provided automatically by Microsoft.

Currently, the service is not zonal. That is, you can’t configure a lab or the VMs in the lab to align to a specific zone. A lab and VMs may be distributed across zones in a region.

### SLA improvements

There are no increased SLAs for Azure Lab Services. For more information on the Azure Lab Services SLAs, see [SLA for Azure Lab Services](https://azure.microsoft.com/support/legal/sla/lab-services/v1_0/).

### Zone down experience

#### Azure Lab Services infrastructure

Azure Lab Services infrastructure is zone-redundant. The Azure Lab Services infrastructure uses Cosmos DB storage, which has redundancy enabled for the following regions:

- Australia East
- Canada Central
- France Central
- Korea Central
- East Asia

Resources apart from the Lab resources and virtual machines are zone redundant in these regions. The storage region is the same as the region where the lab plan is located.

In the event of a zone outage in these regions, you can still perform the following tasks:

- Access the Azure Lab Services website
- Create/manage lab plans
- Create Users
- Configure lab schedules
- Create new labs and VMs in regions unaffected by the zone outage.

Data loss may occur only with an unrecoverable disaster in the Cosmos DB region. For more information, see [Region Outages](/azure/cosmos-db/high-availability#region-outages).

For regions not listed, access to the Azure Lab Services infrastructure is not guaranteed when there is an outage in the region. You may not be able to access the Azure Lab Services website or perform any of the tasks listed previously.

> [!NOTE]
> Existing labs and VMs in regions unaffected by the zone outage aren't affected by a loss of infrastructure in the lab plan region. Existing labs and VMs in unaffected regions can still run and operate as normal.

#### Labs and VMs

Azure Lab Services is not currently zone aligned. So, VMs in a region may be distributed across zones in the region. Therefore, when a zone in a region experiences an outage, there are no guarantees that a lab or any VMs in the associated region will be available.

As a result, the following operations are not guaranteed in the event of a zone outage:

- Manage or access labs/VMs
- Start/stop/reset VMs
- Create/publish/delete labs
- Scale up/down labs
- Connect to VMs

If there's a zone outage in the region, there's no expectation that you can use any labs or VMs in the region.
Labs and VMs in other regions will be unaffected by the outage.

#### Zone outage preparation and recovery

Lab and VM services will be restored as soon as the zone availability is restored (the outage is resolved).

If infrastructure is impacted, it will be restored when the zone availability is resolved.

### Fault tolerance

If you want to preserve access to Azure Lab Services infrastructure during a zone outage, create the lab plan in one of the zone-redundant regions listed above.

## Next steps

> [!div class="nextstepaction"]
> [Resiliency in Azure](/azure/availability-zones/overview.md).