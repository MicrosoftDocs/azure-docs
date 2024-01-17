---
title: Azure availability zone migration baseline
description: Learn how to assess the availability-zone readiness of your application for the purposes of migrating from non-availability zone to availability zone support.
author: sonmitt
ms.service: reliability
ms.subservice: availability-zones
ms.topic: conceptual
ms.date: 04/06/2023
ms.author: anaharris
ms.custom: references_regions
---

# Azure availability zone migration baseline

This article shows you how to assess the availability-zone readiness of your application for the purposes of migrating from non-availability zone to availability zone support. We'll take you through the steps you'll need to determine how you can take advantage of availability zone support in alignment with your application and regional requirements. For more detailed information on availability zones and the regions that support them, see [What are Azure regions and availability zones](availability-zones-overview.md).

When creating reliable workloads, you can choose at least one of the following availability zone configurations: 

 - **Zonal**. A zonal configuration provides a specific, self-selected availability zone.
 
 - **Zone-redundant**.  A zone-redundant configuration provides resources that are replicated or distributed across zones automatically.


In addition to the two availability zone options, zonal and zone-redundant, Azure offers **Global services**, meaning that they're available globally regardless of region. Because these services are always available across regions, they're resilient to both regional and zonal outages.

To see which Azure services support availability zones, see [Availability zone service and regional support](availability-zones-service-support.md).
 

>[!NOTE] 
>When you don't select a zone configuration for your resource, either zonal or zone-redundant, the resource and its sub-components won't be zone resilient and can go down during a zonal outage in that region.

## Considerations for migrating to availability zone support


There are a number of possible ways to create a reliable Azure application with availability zones that meet both SLAs and reliability targets. Follow the steps below to choose the right approach for your needs based on technical and regulatory considerations, service capabilities, data residency, compliance requirements, and latency. 

### Step 1: Check if the Azure region supports availability zones

In this first step, you'll need to [validate](availability-zones-service-support.md) that your selected Azure region support availability zones as well as the required Azure services for your application.


If your region supports availability zones, we highly recommended that you configure your workload for availability zones.  If your region doesn't support availability zones, you'll need to use [Azure Resource Mover guidance](/azure/resource-mover/move-region-availability-zone) to migrate to a region that offers availability zone support.

>[!NOTE]
>For some services, availability zones can only be configured during deployment. If you want to include availability zones for existing services, you may need to redeploy. Please refer to service specific documentation in [Availability zone migration guidance overview for Microsoft Azure products and services](/azure/reliability/availability-zones-migration-overview). 


### Step 2: Check for product and SKU availability in the Azure region

In this step, you'll validate that the required Azure services and SKUs are available in the availability zones of your selected Azure region. 

To check for regional support of services, see [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).

To list the available VM SKUs by Azure region and zone, see [Check VM SKU availability](/azure/virtual-machines/windows/create-powershell-availability-zone#check-vm-sku-availability). 

If your region doesn't support the services and SKUs that your application requires, you'll need to go back to [Step 1: Check the product availability in the Azure region](#step-1-check-if-the-azure-region-supports-availability-zones) to find a new region that supports the services and SKUs that your application requires. We highly recommended that you configure your workload with zone-redundancy. 

For zonal high availability of Azure IaaS Virtual Machines, use [Virtual Machine Scale Sets (VMSS) Flex](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes) to spread VMs across multiple availability zones.


### Step 3: Consider your application requirements

In this final step, you'll determine, based on application requirements, which kind of availability zone support is most suitable to your application.

Below are three important questions that will help you choose the correct availability zone deployment:

#### Does your application include latency sensitive components?

Azure availability zones within the same Azure region are connected by a high-performance network [with a round-trip latency of less than 2 ms](/azure/reliability/availability-zones-overview#availability-zones). 

The recommended approach to achieving high availability, if low latency isn't a strict requirement, is to configure your workload with a zone redundant deployment.

For critical application components that require physical proximity and low latency, such as gaming, engineering simulation, and high-frequency trading (HFT), we recommend that you configure a zonal deployment. [Virtual Machine Scale Sets Flex](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes) provides zone aligned compute along with attached storage disks. 


#### Does your application code have the readiness to handle a distributed model?

For a [distributed microservices model](/azure/architecture/guide/architecture-styles/microservices) and depending on your application, there's the possibility of ongoing data exchange between microservices across zones. This continual data exchange through APIs, could affect performance. To improve performance and maintain a reliable architecture, you can choose zonal deployment. 

With a zonal deployment, you must:

1. Identify latency sensitive resources or services in your architecture.

1. Confirm that the latency sensitive resources or services support zonal deployment.

1. Co-locate the latency sensitive resources or services in same zone. Other services in your architecture may continue to remain zone redundant. 

1. Replicate the latency sensitive zonal services across multiple availability zones to ensure zone resiliency. 

1. Load balance between the multiple zonal deployments with a standard or global load balancers. 

If the Azure service supports availability zones, we highly recommend that you use zone-redundancy by spreading nodes across the zones to get higher uptime SLA and protection against zonal outages.  


For a 3-tier application it is important to understand the application, business, and data tiers; as well as their state (stateful or stateless) to architect in alignment with the best practices and guidance according to the type of workload. 

For specialized workloads on Azure as below examples, please refer to the respective landing zone architecture guidance and best practices. 


- SAP  
    - [SAP workload configurations with Azure Availability Zones](/azure/sap/workloads/high-availability-zones)
    - [Azure availability sets vs. availability zones](/azure/cloud-adoption-framework/scenarios/sap/eslz-business-continuity-and-disaster-recovery#azure-availability-sets-vs-availability-zones)

- Azure Virtual Desktop 
    - [Business continuity and disaster recovery considerations for Azure Virtual Desktop](/azure/cloud-adoption-framework/scenarios/wvd/eslz-business-continuity-and-disaster-recovery)
    - [General availability of support for Azure availability zones in the host pool deployment](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-general-availability-of-support-for-azure/ba-p/3636262)

- Azure Kubernetes Service 
    - [Create an Azure Kubernetes Service (AKS) cluster that uses availability zones](/azure/aks/availability-zones)
    - [Operations management considerations for Azure Kubernetes Service](/azure/cloud-adoption-framework/scenarios/app-platform/aks/management)
    - [Migrate Azure Kubernetes Service (AKS) and MySQL Flexible Server workloads to availability zone support](/azure/reliability/migrate-workload-aks-mysql)

- Oracle  
    - [Oracle on Azure architecture design](/azure/architecture/solution-ideas/articles/oracle-on-azure-start-here)


#### Do you want to achieve Business Continuity and Disaster Recovery in the same Azure region due to compliance, data residency, or governance requirements? 

To achieve business continuity and disaster recovery within the same region and when there **is no regional pair**, we highly recommend that you configure your workload with zone-redundancy. A single-region approach is also applicable to certain industries that have strict data residency and governance requirements within the same Azure region.  To learn how to replicate, failover, and failback Azure virtual machines from one availability zone to another within the same Azure region, see [Enable Azure VM disaster recovery between availability zones](/azure/site-recovery/azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery).

If you require multi-region, or if your Azure region doesn't support availability zones, we recommend that you use regional pairs.  Regional pairs are situated at far distance at around 100 miles apart, and give you blast radius protection from regional level failures such as fire, flooding, earthquake and other natural or unforeseen calamities. For more information, see [Cross-region replication in Azure: Business continuity and disaster recovery](/azure/reliability/cross-region-replication-azure).

>[!NOTE]
>There can be scenarios where a combination of zonal, zone-redundant, and global services works best to meet business and technical requirements. 

### Other points to consider

- To learn about testing your applications for availability and resiliency, see [Testing applications for availability and resiliency](/azure/architecture/framework/resiliency/testing).

- Each data center in a region is assigned to a physical zone. Physical zones are mapped to the logical zones in your Azure subscription. Azure subscriptions are automatically assigned this mapping at the time a subscription is created. You can use the dedicated ARM REST API, [listLocations](/rest/api/resources/subscriptions/list-locations?tabs=HTTP) and set the API version to 2022-12-01 to list the logical zone mapping to physical zone for your subscription. This information is important for critical application components that require co-location with Azure resources categorized as [Strategic services](/azure/reliability/availability-service-by-category#strategic-services) that may not be available in all physical zones.

- Inter-zone bandwidth charges apply when traffic moves across zones. To learn more about bandwidth pricing, see [Bandwidth pricing](https://azure.microsoft.com/pricing/details/bandwidth/).  

## Next steps


> [!div class="nextstepaction"]
> [What are Azure regions and availability zones?](availability-zones-overview.md)

> [!div class="nextstepaction"]
> [IaaS: Web application with relational database](/azure/architecture/high-availability/ref-arch-iaas-web-and-db)

> [!div class="nextstepaction"]
> [Build solutions for high availability using availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability)

> [!div class="nextstepaction"]
> [Azure reliability documentation](overview.md)





