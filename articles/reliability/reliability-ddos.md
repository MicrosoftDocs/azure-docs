---
title: Reliability in Azure DDoS Network Protection
description: Learn about reliability in Azure DDoS Network Protection
author: AbdullahBell
ms.author: abell
ms.topic: reliability-article
ms.workload: infrastructure-services
ms.custom: subject-reliability, references_regions
ms.service: ddos-protection
ms.date: 03/14/2024 
---

# Reliability in Azure DDoS Network Protection


This article describes reliability support in [Azure DDoS Network Protection](../ddos-protection/ddos-protection-overview.md), and both regional resiliency with availability zones and [cross-region recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).


## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Azure DDoS Protection is [zone-redundant](./availability-zones-overview.md#zonal-and-zone-redundant-services) by default and is managed by the service itself. You don't need to configure or setup zone redundancy yourself.

### Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]



#### Disaster recovery in multi-region geography


You can choose one of two approaches to managing business continuity for DDoS Protection over your VNets. The first approach is reactive and the second approach is proactive. 


- **Reactive business continuity plan**. Virtual networks are fairly lightweight resources. In the case of a regional outage, you can invoke Azure APIs to create a VNet with the same address space, but in a different region. To recreate the same environment that was present in the affected region, you'll need to make API calls to redeploy primary region VNet resources. If on-premises connectivity is available, such as in a hybrid deployment, you must deploy a new VPN Gateway, and connect to your on-premises network.

>[!NOTE]
>A reactive approach to maintaining business continuity always runs the risk that you may not have access to the primary region's resources, due the extent of the disaster. In that case, you'll need to recreate all of the primary region's resources.


- **Proactive business continuity plan**. You can create two VNets using the same private IP address space and resources in two different regions ahead of time. If you are hosting internet-facing services in the VNet, you could set up Traffic Manager to geo-route traffic to the region that is active. However, you cannot connect two VNets with the same address space to your on-premises network, as it would cause routing issues. At the time of a disaster and loss of a VNet in one region, you can connect the other VNet in the available region, with the matching address space to your on-premises network.


To create a virtual network, see [Create a virtual network](/azure/virtual-network/manage-virtual-network#create-a-virtual-network).


### Disaster recovery in single-region geography

For single region geographies in a disaster scenario, the virtual network and the resources in the affected region remains inaccessible during the time of the service disruption.

## Next steps

- [Reliability in Azure](/azure/availability-zones/overview)
