---
title: Reliability in Azure Image Builder
description: Find out about reliability in Azure Image Builder
author: ericd-mst-github
ms.author: kofiforson
ms.topic: overview 
ms.custom: subject-reliability
ms.service: virtual-machines
ms.subservice: image-builder
ms.date: 02/03/2023
---

# Reliability in Azure Image Builder

This article describes reliability support in Azure Image Builder, and covers both regional resiliency with availability zones. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

Azure Image Builder (AIB) is a regional service with cluster serving single regions. The AIB regional setup keeps data and resources within the regional boundary. AIB as a service doesn't do fail over for cluster and SQL database in region down scenarios.


## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the event of a local zone failure, availability zones are designed so that if the one zone is affected. Regional services, capacity, and high availability are supported by the remaining two zones.  Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](/azure/availability-zones/az-overview).

Azure availability zones-enabled services are designed to provide the right level of reliability and flexibility. They can be configured in two ways. They can be either zone redundant, with automatic replication across zones, or zonal, with instances pinned to a specific zone. You can also combine these approaches. For more information on zonal vs. zone-redundant architecture, see [Build solutions with availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability).

> [!NOTE]
> Azure Image Builder doesn't currently support availability zones at this time. Availability zone outage within a region is considered Regional outage for Azure Image Builder and customers are recommended to follow guidance as per the Disaster Recovery and failover to backup region.



## Disaster recovery: cross-region failover

In the event of a region-wide disaster, Azure can provide protection from regional or large geography disasters with disaster recovery by making use of another region. For more information on Azure disaster recovery architecture, see [Azure to Azure disaster recovery architecture](../site-recovery/azure-to-azure-architecture.md).

To ensure fast and easy recovery for Azure Image Builder (AIB), it's recommended to run an image template in region pairs or multiple regions when designing your AIB solution. You'll also want to replicate resources from the start when you're setting up your image templates.


### Cross-region disaster recovery in multi-region geography

Microsoft will be responsible for outage detection, notifications, and support in the event of disaster recovery scenarios for Azure Image Builder. Customers will need to set up disaster recovery for the control plane (service side) and data plane.


#### Outage detection, notification, and management

Microsoft will send a notification if there's an outage for the Azure Image Builder (AIB) Service. The common outage symptom includes image templates getting 500 errors when attempting to run. Customers can review Azure Image Builder outage notifications and status updates through [support request management.](../azure-portal/supportability/how-to-manage-azure-support-request.md)


#### Set up disaster recovery and outage detection

Customers are responsible for setting up disaster recovery for their Azure Image Builder (AIB) environment, as there isn't a region failover at the AIB service side. Both the control plane (service side) and data plane will need to configure by the customer.

The high level guidelines include creating a AIB resource in another region close by and replicating your resources. For more information, see the [supported regions](./image-builder-overview.md#regions) and what resources are involved in [AIB]( /azure/virtual-machines/image-builder-overview#how-it-works) creation.

### Single-region geography disaster recovery

On supporting single-region geography for Azure Image Builder, the challenge will be to get the image template resource since the region isn't available. For those cases, customers can either maintain a copy of an image template locally or can use [Azure Resource Graph](../governance/resource-graph/index.yml) from the Azure portal or Azure CLI to get an Image template resource.

Below are instructions on how to get an image template resource using Resource Graph from the Azure portal:

1. Go to the search bar in Azure portal and search for *resource graph explorer*.

    ![Screenshot of Azure Resource Graph Explorer in the portal](./media/image-builder-reliability/resource-graph-explorer-portal.png#lightbox)

1. Use the search bar on the far left to search resource by type and name to see how the details will give you properties of the image template. The *See details* option on the bottom right will show the image template's properties attribute and tags separately. Template name, location, ID, and tenant ID can be used to get the correct image template resource.

    ![Screenshot of using Azure Resource Graph Explorer search](./media/image-builder-reliability/resource-graph-explorer-search.png#lightbox)


### Capacity and proactive disaster recovery resiliency

Microsoft and its customers operate under the Shared responsibility model. This means that for customer-enabled DR (customer-responsible services), the customer must address DR for any service they deploy and control. To ensure that recovery is proactive, customers should always pre-deploy secondaries because there's no guarantee of capacity at time of impact for those who haven't pre-allocated.

When planning where to replicate a template, consider:

- AIB region availability:
    - Choose [AIB supported regions](./image-builder-overview.md#regions) close to your users.
    - AIB continually expands into new regions.
- Azure paired regions:
    - For your geographic area, choose two regions paired together.
    - Recovery efforts for paired regions where prioritization is needed.

## Additional guidance

In regards to customer data processing information, refer to the Azure Image Builder [data residency](./linux/image-builder-json.md#data-residency) details.


## Next steps

> [!div class="nextstepaction"]
> [Reliability in Azure](../reliability/overview.md)
> [Enable Azure VM disaster recovery between availability zones](../site-recovery/azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery.md)
> [Azure Image Builder overview](./image-builder-overview.md)
