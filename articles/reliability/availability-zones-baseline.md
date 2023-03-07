---
title: Availability zone migration baseline
description: Learn about availability zone migration baseline
author: anaharris-ms
ms.service: reliability
ms.subservice: availability-zones
ms.topic: conceptual
ms.date: 03/06/2023
ms.author: anaharris
ms.custom: references_regions
---

# Availability zone migration baseline


This article shows you how to assess the availability-zone readiness of your application for the purposes of migrating from non-availability zone to availability zone support. We'll take you through the steps you'll need to determine which how to take advantage of availability zone support in alignment with your application and regional requirements.  For more detailed information on availability zones and the regions that support them, see [What are Azure regions and availability zones?](availability-zones-overview.md).

Nearly all Azure services support availability zones. When creating your reliable workloads, you generally can choose at least one of the following availability zone configurations: 

 - **Zonal**. A zonal configuration provides a specific, self-selected availability zone.
 
 - **Zone-redundant**.  A zone-redundant configuration provides resources that are replicated or distributed across zones automatically.

In addition to the two availability zone options, zonal and zone-redundant, Azure offers **Global (always available) services**; these services are always available across geographies and so are resilient to region-wide outages. You do not need to configure or enable these services.
 

>[!NOTE] 
>Azure offers regional deployment where a resource is not pinned to any specific zone. In a regional deployment, Azure can place the resource in the zone of its choosing. The user will have no visibility in regards to which zone the resource is placed. If the region supports availability zones, Azure will place the resource in any one of the existing zones. If the region doesn't support availability zones, Azure will place the resource at regional level. It is important to know that regional level resources are zonal.

## Considerations for migrating to availability zone support

 There are a number of possible ways to create a reliable Azure application with availability zones, to meet both SLAs and reliability targets.  Follow the steps below to choose the right approach for your needs based on technical and regulatory considerations, service capabilities, data residency, compliance requirements, and latency. 

### Step 1: Check the product availability in the Azure region

In this first step, you'll need to [validate](availability-zones-service-support.md) that your selected Azure region support availability zones and the required Azure services for your application.

| For a zone-redundant scenario...| For a zonal scenario... |
| ------|-----|
 If your region supports availability zones, we highly recommended that you configure your workload with zone-redundancy.  | If your region doesn't support availability zones, you'll need to use [Azure Resource Mover guidance](/azure/resource-mover/move-region-availability-zone) to migrate to a region that offers availability zone support. |

>[!NOTE]
>For some services, availability zones can only be configured during deployment. If you want to include availability zones for existing services, you may need to redeploy. Please refer to service specific documentation in [Availability zone migration guidance overview for Microsoft Azure products and services](/azure/reliability/availability-zones-migration-overview). 


### Step 2: Check for SKU and service availability in the Azure region

In this step, you'll need to validate that the required Azure services and SKUs are available in the availability zones of your selected Azure region. 

To list the available SKUs by Azure region and zone, see [Check VM SKU availability](/azure/virtual-machines/windows/create-powershell-availability-zone#check-vm-sku-availability). 

To check for regional support of services, see [Products available by region](/explore/global-infrastructure/products-by-region/).

If your region doesn't support the services and SKUs that your application requires, you'll need to go back to [Step 1: Check the product availability in the Azure region](#step-1-check-the-product-availability-in-the-azure-region) to find a new region.  

 For a zone-redundant scenario...| For a zonal scenario... |
------|-----|
 If your region supports the services and SKUs that your application requires, we highly recommended that you configure your workload with with zone-redundancy. |  For zonal high availability of Azure IaaS Virtual Machines, use [VMSS Flex](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes). to spread VMs across multiple fault domains in a region or within an availability zone |


### Step 3: Consider your application requirements

Now that your region supports availability zones, and you have regional support for the required SKUs and services, you'll need to continue onto the next step to consider, based on application requirements, which kind of availability zone support is most suitable to your application.

Below are three important questions you'll need to answer in order to choose the correct availability zone deployment:

| Question |For a zone-redundant scenario...| For a zonal scenario... |
|---|------|-----|
| Are some of the components of your application latency sensitive? For example, applications like gaming, engineering simulations, and high-frequency trading (HFT) require low latency and tasks that can be completed quickly.| We highly recommended that you configure your workload with with zone-redundancy. Note that there is less than 2ms latency between availability zones in an Azure region. Zone redundancy is recommended to design critical and sensitive workloads with high availability. There is almost negligible (less than 2ms) latency between availability zones in any Azure region. | For critical application components that require physical proximity and low latency for high performance, we recommend that you use  [VMSS Flex](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes) in a zonal deployment, which provides aligned compute and storage fault domains. |
|Does your application code have the readiness to handle the [distributed model](/azure/architecture/guide/architecture-styles/microservices)? | If the Azure service supports availability zones, we highly recommend that you use zone-redundancy by spreading nodes across the zones to get higher uptime SLA and protection against zonal outages. <p> It's important to understand the state (state or stateless) of each tier in a 3-tier application (application, business, and data) in order to architect in alignment with best practices and guidance according to the type of workload. <p> For specialized workloads on Azure such as Oracle, SAP, Azure VMware Solution, Azure Kubernetes Service, and Azure Virtual Desktop, see their respective landing zones architecture guidance and best practices. |For a distributed microservices model and depending on your application, there is the possibility of ongoing data exchange between microservices across zones. This continual data exchange through APIs, could affect performance. To improve performance and maintain a reliable architecture, you can choose a zonal configuration. With a zonal deployment, you must co-locate compute, storage, networking, and data resources within a single availability zone, and replicate this arrangement in other availability zones. To load balance between the multiple zonal deployments, you can use standard or global load balancers.  |
|Do you want to achieve business continuity and disaster recovery (BCDR) in the **same** Azure region due to compliance, data residency, or governance requirements? | We highly recommended that you configure your workload with zone-redundancy to achieve BCDR within the same region and when there is **no regional pair**. <p> To learn how to replicate, failover, and failback Azure VMs from one availability zone to another, within the same Azure region, see [Enable Azure VM disaster recovery between availability zones](/azure/site-recovery/azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery). | For BCDR, we recommend that you use regional pairs. Regions are situated at far distance at around 100 miles apart. Multi-region deployments give you blast radius protection from regional level failures such as fire, flooding, earthquake and other natural or unforeseen calamities. For more information see [Cross-region replication in Azure: Business continuity and disaster recovery](/azure/reliability/cross-region-replication-azure).


>[!NOTE]
>There can be scenarios where a combination of zonal, zone-redundant, and global services works best to meet business and technical requirements. 

### Step 4: Pricing considerations

For a zone-redundant or cross-regional deployment, inter-zone bandwidth charges apply when traffic moves across zones. To learn more about bandwidth pricing, see [Bandwidth pricing](/pricing/details/bandwidth/).  
### Step 5: Test your availability zone enabled application

Need more info here....

Each data center in a region is assigned to a physical zone. Physical zones are mapped to the logical zones in your Azure subscription. Azure subscriptions are automatically assigned this mapping at the time a subscription is created. You can use the dedicated ARM API, [checkZonePeers](/rest/api/resources/subscriptions/check-zone-peers?tabs=HTTP) to compare zone mapping for resilient solutions that span across multiple subscriptions. 

## Next steps


> [!div class="nextstepaction"]
> [What are Azure regions and availability zones?](availability-zones-overview.md)

> [!div class="nextstepaction"]
> [IaaS: Web application with relational database](/azure/architecture/high-availability/ref-arch-iaas-web-and-db)

> [!div class="nextstepaction"]
> [Build solutions for high availability using availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability)

> [!div class="nextstepaction"]
> [Azure reliability documentation](overview.md)





