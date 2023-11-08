---
title: Reliability in Azure Image Builder
description: Find out about reliability in Azure Image Builder
author: ericd-mst-github
ms.author: kofiforson
ms.topic: overview 
ms.custom: subject-reliability
ms.service: virtual-machines
ms.subservice: image-builder
ms.date: 08/22/2023
---

# Reliability in Azure Image Builder (AIB)

This article contains [specific reliability recommendations for Image Builder](#reliability-recommendations) and [cross-region disaster recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). 


Azure Image Builder (AIB) is a regional service with a cluster that serves single regions. The AIB regional setup keeps data and resources within the regional boundary. AIB as a service doesn't do fail over for cluster and SQL database in region down scenarios.


For an architectural overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).


>[!NOTE]
> Azure Image Builder doesn't support [availability zones](./availability-zones-overview.md).

## Reliability recommendations

[!INCLUDE [Reliability recommendations](includes/reliability-recommendations-include.md)]
 
### Reliability recommendations summary


| Category | Priority |Recommendation |  
|---------------|--------|---|
| [**High Availability**](#high-availability) |:::image type="icon" source="media/icon-recommendation-low.svg":::| [Use generation 2 virtual machine source images](#-use-generation-2-virtual-machine-vm-source-images) |
|[**Disaster Recovery**](#disaster-recovery)|:::image type="icon" source="media/icon-recommendation-low.svg"::: |[Replicate image templates to a secondary region](#-replicate-image-templates-to-a-secondary-region) | 


### High availability
 
#### :::image type="icon" source="media/icon-recommendation-low.svg"::: **Use generation 2 virtual machine (VM) source images** 

When building your image templates, use source images that support generation 2 VMs. Generation 2 VMs support key features that aren’t supported in generation 1 VMs such as:

- Increased memory
- Support for disks greater than 2TB
- New UEFI-based boot architecture instead, which can improve boot and installation times
- Intel Software Guard Extensions (Intel SGX)
- Virtualized persistent memory (vPMEM)


For more information on generation 2 VM features and capabilities, see [Generation 2 VMs: Features and capabilities](/azure/virtual-machines/generation-2#features-and-capabilities).

### Disaster recovery

#### :::image type="icon" source="media/icon-recommendation-low.svg"::: **Replicate image templates to a secondary region** 

The Azure Image Builder service that's used to deploy Image Templates doesn’t currently support availability zones. Therefore, when building your image templates, you should replicate them to a secondary region, preferably to your primary region’s [paired region](./availability-zones-overview.md#paired-and-unpaired-regions). With a secondary region, you can quickly recover from a region failure and continue to deploy virtual machines from your image templates. For more information, see [Cross-region disaster recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity).


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/image-templates/code/it-2/it-2.kql":::

----

## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

To ensure fast and easy recovery for Azure Image Builder (AIB), it's recommended that you run an image template in region pairs or multiple regions when designing your AIB solution. You should also replicate resources from the start when you're setting up your image templates.


### Multi-region geography disaster recovery

When a regional disaster occurs, Microsoft is responsible for outage detection, notifications, and support for AIB. However, you're responsible for setting up disaster recovery for the control (service side) and data planes.


#### Outage detection, notification, and management

Microsoft sends a notification if there's an outage in the Azure Image Builder (AIB) Service. One common outage symptom is image templates getting 500 errors when attempting to run. You can review Azure Image Builder outage notifications and status updates through [support request management.](../azure-portal/supportability/how-to-manage-azure-support-request.md)


#### Set up disaster recovery and outage detection

You're responsible for setting up disaster recovery for your Azure Image Builder (AIB) environment, as there isn't a region failover at the AIB service side. You need to configure both the control plane (service side) and data plane.

It's recommended that you create an AIB resource in another nearby region, into which you can replicate your resources. For more information, see the [supported regions](../virtual-machines/image-builder-overview.md#regions) and what resources are included in an [AIB creation](/azure/virtual-machines/image-builder-overview#how-it-works).

### Single-region geography disaster recovery

In the case of a diaster for single-region, you still need to get an image template resource from that region even when that region isn't available. You can either maintain a copy of an image template locally or can use [Azure Resource Graph](../governance/resource-graph/index.yml) from the Azure portal to get an image template resource.

To get an image template resource using Resource Graph from the Azure portal:

1. Go to the search bar in Azure portal and search for *resource graph explorer*.

    ![Screenshot of Azure Resource Graph Explorer in the portal.](../virtual-machines//media/image-builder-reliability/resource-graph-explorer-portal.png#lightbox)

1. Use the search bar on the far left to search resource by type and name to see how the details give you properties of the image template. The *See details* option on the bottom right shows the image template's properties attribute and tags separately. Template name, location, ID, and tenant ID can be used to get the correct image template resource.

    ![Screenshot of using Azure Resource Graph Explorer search.](../virtual-machines//media/image-builder-reliability/resource-graph-explorer-search.png#lightbox)


### Capacity and proactive disaster recovery resiliency

Microsoft and its customers operate under the [shared responsibility model](./business-continuity-management-program.md#shared-responsibility-model). In customer-enabled DR (customer-responsible services), you're responsible for addressing DR for any service you deploy and control. To ensure that recovery is proactive, you should always pre-deploy secondaries. Without pre-deployed secondaries, there's no guarantee of capacity at time of impact.

When planning where to replicate a template, consider:

- AIB region availability:
    - Choose [AIB supported regions](../virtual-machines//image-builder-overview.md#regions) close to your users.
    - AIB continually expands into new regions.
- Azure paired regions:
    - For your geographic area, choose two regions paired together.
    - Recovery efforts for paired regions where prioritization is needed.

## Additional guidance

In regards to your data processing information, refer to the Azure Image Builder [data residency](../virtual-machines//linux/image-builder-json.md#data-residency) details.


## Next steps

- [Reliability in Azure](overview.md)
- [Enable Azure VM disaster recovery between availability zones](../site-recovery/azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery.md)
- [Azure Image Builder overview](../virtual-machines//image-builder-overview.md)
