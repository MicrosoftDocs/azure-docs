---
title: Availability zone migration fundamentals
description: Learn about Availability zone migration fundamentals
author: anaharris-ms
ms.service: reliability
ms.subservice: availability-zones
ms.topic: conceptual
ms.date: 03/06/2023
ms.author: anaharris
ms.custom: references_regions
---

# Availability zone migration fundamentals


This article shows you how to assess the availability-zone readiness of your application; helping you architect reliable and resilient solutions by taking advantage of availability zones. 

Nearly all Azure services support availability zones. When creating your reliable workloads, you can choose one of the following availability zone configurations: 

 - **Zonal**. A zonal configuration provides a specific, self-selected availability zone.
 
 - **Zone-redundant**.  A zone-redundant configuration provides resources that are replicated or distributed across zones automatically.
 
 For more information on availability zones and their configurations, see [What are Azure regions and availability zones?](availability-zones-overview.md).


## Considerations for migrating to availability zone support

 The table below lists specific questions for you to answer when considering a workload migration from non-availability zone support to availability zone support. Each question is answered in the context of both possible configurations: zonal and zone-redundancy. 

| | With zone-redundant configuration| With zonal configuration |
| ------------------------------------------------------|------|-----|
| Does your selected Azure region support availability zones and the required Azure services? <p> To validate, see [Azure services that support availability zones](availability-zones-service-support.md).| If **Yes**,  it's highly recommended that you configure your workload with availability zones enabled.  | If **No**, then, follow [Azure Resource Mover guidance](/azure/resource-mover/move-region-availability-zone) to learn how to migrate to a region that offers availability zone support. |
|Are the required Azure services and SKUs available across multiple availability zones in your selected Azure region? | If **Yes**, it is highly recommended that you configure a zone-redundant configuration. | If **No**,then, follow [Azure Resource Mover guidance](/azure/resource-mover/move-region-availability-zone) to learn how to migrate to a region that offers availability zone support. <p>Note: For zonal high availability of Azure IaaS Virtual Machines, use [VMSS Flex](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes). VMSS flexible orchestration offers high availability by spreading VMs across multiple fault domains in a region or within an availability zone. |
| Are some of the components of your application latency sensitive? For example, applications like gaming, engineering simulations, and high-frequency trading (HFT) require low latency and tasks that can be completed quickly.| If **Yes**, a zone-redundant configuration is the recommended solution, due to the fact that there is less than 2ms latency between availability zones in an Azure region. | The recommended approach with to achieving high availability is to spread instances across availability aones. For critical application components which require physical proximity and low latency for high performance, we recommend using VMSS Flex in a zonal deployment. 

