---
title: Deploying high availability network virtual appliances | Microsoft Docs
description: How to deploy network virtual appliances in high availability.
services: ''
documentationcenter: na
author: telmosampaio
manager: christb
editor: ''
tags: ''

ms.assetid: d78ea9a8-a8f2-457b-a918-16341a377f5c
ms.service: guidance
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/31/2016
ms.author: telmos

---
# Deploying high availability network virtual appliances
[!INCLUDE [pnp-header](../../includes/guidance-pnp-header-include.md)]

This article provides best practices to deploy a set of network virtual appliances (NVAs) for high availability in Azure. An NVA is typically used to control the flow of network traffic from a perimeter network, also known as a DMZ, to other networks or subnets. If you are unfamiliar with the implementation of a DMZ in Azure, see [Microsoft cloud services and network security][cloud-security]. If you are familiar with using a DMZ in Azure and your requirements include an NVA, this article includes several example architectures for ingress only, egress only, and both ingress and egress. These architectures use Azure load balancers and user-defined routes (UDRs) so it's recommended that you familarize yourself with these before proceeding.

## Architecture Diagrams

An NVA can be deployed to a DMZ in many different architectures. For example, the following figure illustrates the use of a [single NVA][nva-scenario] for ingress. 

![[0]][0]

This architecture includes the following resources:

- A VPN gateway providing connectivity between the an on-premises network and the Azure virtual network.
- A gateway subnet in Azure that includes the inbound virtual network gateway.
- An inbound public DMZ subnet that includes a network security group (NSG).
- A UDR to route inbound traffic from the virtual network gateway to the NVA. 
- An NVA with a public IP address (PIP) deployed in the inbound public DMZ subnet.
- A web tier subnet including a NSG, a load balancer, and a set of virtual machines (VMs) hosting web services deployed into an availability set. 
- A UDR to route outbound requests from the web tier subnet VMs to the NVA.

Note that all inbound and outbound network traffic passes through the NVA, and the NVA determines whether or not to pass the traffic based on its security rules. This provides a very secure network boundary for both the web tier subnet and the on-premises network. However, this also creates a single point of failure for the network because if the NVA fails it will no longer forward inbound and outbound network traffic all the back-end subnets will be completely unavailable.

To make an NVA highly available, deploy more than one NVA into an availability set. Deploying the NVAs in an availability set provides a service level agreement (SLA) that guarantees the uptimes for the NVA VMs. While this provides high availability of the NVA VMs, there are some issues particular to the NVA services running on the NVA VMs that require more resources and configuration to ensure high availability.  

The following architectures provide highly available NVAs:

| Solution | Benefits | Considerations |
| --- | --- | --- |
| [Ingress with layer 7 NVAs][ingress-with-layer-7] |All NVA nodes are active |Requires an NVA that can terminate connections and use SNAT</br> Requires a separate set of NVAs for traffic coming from the Internet and from Azure </br> Can only be used for traffic originating outside Azure |
| [Egress with layer 7 NVAs][egress-with-layer-7] |All NVA nodes are active | Requires an NVA that can terminate connections and implements source network address translation (SNAT)
| [Ingress-Egress with layer 7 NVAs][ingress-egress-with-layer-7] |All nodes are active<br/>Able to handle traffic originated in Azure |Requires an NVA that can terminate connections and use SNAT<br/>Requires a separate set of NVAs for traffic coming from the Internet and from Azure |
| [PIP-UDR switch][pip-udr-switch] |Single set of NVAs for all traffic<br/>Can handle all traffic (no limit on port rules) |Active-passive<br/>Requires a failover process |

### Ingress with layer 7 NVAs

The following figure shows a high availablity architecture that implements an ingress DMZ behind a internet-facing load balancer. This architecture is designed to provide connectivity to Azure workloads for layer 7 traffic, such as HTTP or HTTPS:

![[1]][1]

This architecture includes the following resources:

- An internet-facing load balancer.
- A public DMZ subnet with an NSG. Note that this subnet is configured to be the back-end address pool for the internet-facing load balancer.
- A pair of NVAs in the public DMZ subnet deployed into an availability set.
- A web tier subnet with an NSG. 
- An internal load balancer deployed into the web tier subnet. Note that the NVAs are configured to forward network traffic meeting security rules to this load balancer. Also note that the web tier subnet is configured to be the back-end address pool for the internal load balancer.
- A set of VMs hosting web services deployed in an availability set in the web tier subnet. 

The benefit of this architecture is that all NVAs are active, and if one fails the load balancer will direct network traffic to the other NVA. Both NVAs route traffic to the internal load balancer so as long as one NVA is active, traffic will continue to flow. Note that the NVAs must be able to terminate SSL traffic intended for the web tier VMs. Also note that this architecture cannot be extended to handle on-premises traffic, on-premises traffic requires another dedicated set of NVAs with their own network routes.

<!--You can use a set of NVAs behind an Azure load balancer to provide connectivity to Azure workloads behind a small set of server-side ports (such as HTTP and HTTPS). The following figure highlights how to provide high availability in this scenario at the NVA level.
In this scenario, the network virtual appliance used must terminate all connections, and pass them to the workload subnet. The workload virtual machines (VMs) respond to the NVA they received a request from, and traffic flows without issues.-->

### Egress with layer 7 NVAs

The previous achitecture can be expanded to provide an egress DMZ for requests originating in the Azure workload. The following architecture is designed to provide high availability of the NVAs in the DMZ for layer 7 traffic, such as HTTP or HTTPS:

![[2]][2]

This architecture includes the following resources:

- A web tier subnet.
- Web tier VMs deployed in an availability set in the web tier subnet. 
- An egress DMZ subnet.
- An internal load balancer deployed in the egress DMZ subnet.
- NVA VMs deployed in the back-end pool of the internal load balancer.
- A UDR in the web tier subnet to forward requests from the web tier VMs to the internal load balancer in the DMZ subnet.

In this architecture, all traffic originating in Azure is routed to an internal load balancer. The load balancer distributes outgoing requests between a set of NVAs. These NVAs direct traffic to the Internet using their individual public IP addresses. 

<!-- Q: how do the NVAs handle proxying SSL requests from the workload VMs? -->

## Ingress-egress with layer 7 NVAs

Note that in the two previous architectures, there was a separate DMZ for ingress and egress. The following architecture demonstrates how to create a DMZ that can be used for both ingress and egress for layer 7 traffic, such as HTTP or HTTPS: 

<!--link to diagram-->

This architecture includes the following resources:

- A web tier subnet with an NSG.
- Web tier VMs in the web tier subnet deployed in an availability set.
- A DMZ subnet with an NSG. 
- An internal load balancer deployed in the DMZ subnet.
- A UDR to forward outbound network traffic from the web tier VMs to the internal load balancer.
- NVA VMs in the DMZ subnet deployed in an availability set. Note that the NVAs are deployed in the back-end pool of the internal load balancer.
- An internet-facing application gateway with the NVA VMs added to the back-end pool.

In this architecture, the NVAs accept incoming requests from the application gateway as well as outgoing requests from the workload VMs in the web tier subnet. Note that because incoming traffic is routed with an application gateway and outgoing traffic is routed with a load balancer, the NVAs are responsible for maintaining session affinity. That is, the application gateway maintains a mapping of inbound and outbound requests so it can forward the correct response to the original requestor. However, the load balancer does not have access to the application gateway mappings, and will use its own logic to send responses to the NVAs. It's possible the load balancer could send a reponse to an NVA that did not initially receive the request. In this case, the NVAs will have to communicate and transfer the response between them so the correct NVA can forward the response to the application gateway. 

## PIP-UDR switch with layer 4 NVAs

The following architecture demonstrates an architecture with one active and one passive NVA. This architecture handles both ingress and egress for layer 4 traffic: 

<!--You can avoid creating multiple NVA stacks by using two NVAs in active-passive mode. In this scenario, you can switch the public IP address (PIP) and user-defined routes (UDRs) when the active node stops.-->  

![[3]][3]

This architecture includes the following resources:

- A public IP address.
- An external DMZ subnet with an NSG.
- An internal DMZ subnet with an NSG. 
- One active NVA with one NIC assigned to the external DMZ subnet and one NIC assigned to the internal DMZ subnet.
- One passive NVA with one NIC assigned to the external DMZ subnet and one NIC assigned to the internal DMZ subnet.
- A ZooKeeper cluster deployed in the internal DMZ subnet, with a health probe monitoring the active NVA.
- A web tier subnet with an NSG.
- An internal load balancer assigned to the web tier subnet.
- A set of web tier VMS assigned to the back-end pool of the internal load balancer.
- A UDR to forward outgoing requests from the web tier VMs to the NVA NIC assigned to the internal DMZ subnet.

This architecture is similar to the first architecture discussed in this article. That architecture included a single NVA accepting and filtering incoming requests. This architecture adds a second passive NVA to provide high availability. If the active NVA fails, the passive NVA is made active and the UDR and PIP are changed to point to the NICs on the now active NVA. 

These changes to the UDR and PIP can be done either manually or using an automated process. The automated process can be a daemon or other monitoring service running in Azure that queries a health probe on the active NVA and performs the UDR and PIP switch when necessary. The figure shows an example [ZooKeeper][zookeeper] daemon on the NVAs to determine which NVA is active, also known as leader election. Once a leader is elected, it calls the Azure REST API to remove the PIP from the failed node and attach it to the leader. The leader then modifies the UDR to point to the new leader's IP internal address. 

<!--This scenario is similar to the single NVA scenario. The only difference is that the PIP and UDRs must be changed to switch traffic between the NVAs. These changes can be done manually, or you can also automate them. To automate, you can deploy an application to both NVAs that checks for the health of the active node. Once the active node is down, your application can change the PIP and UDRs to link to the passive node.-->

## Next steps
* Learn how to [implement a DMZ between Azure and your on-premises datacenter][dmz-on-prem] using layer-7 NVAs.
* Learn how to [implement a DMZ between Azure and the Internet][dmz-internet] using layer-7 NVAs.

<!-- links -->
[cloud-security]: ../best-practices-network-security.md
[dmz-on-prem]: guidance-iaas-ra-secure-vnet-hybrid.md
[dmz-internet]: guidance-iaas-ra-secure-vnet-dmz.md
[egress-with-layer-7]: #engress-with-layer-7-nvas
[ingress-with-layer-7]: #ingress-with-layer-7-nvas
[ingress-egress-with-layer-7]: #ingress-egress-with-layer-7-nvas
[lb-overview]: ../load-balancer/load-balancer-overview.md
[nva-scenario]: ../virtual-network/virtual-network-scenario-udr-gw-nva.md
[pip-udr-switch]: #pip-udr-switch
[udr-overview]: ../virtual-network/virtual-networks-udr-overview.md
[zookeeper]: https://zookeeper.apache.org/

<!-- images -->
[0]: ./media/guidance-nva-ha/single-nva.png "Single NVA architecture"
[1]: ./media/guidance-nva-ha/l7-ingress.png "Layer 7 ingress"
[2]: ./media/guidance-nva-ha/l7-ingress-egress.png "Layer 7 ingress and egress"
[3]: ./media/guidance-nva-ha/active-passive.png "Active-Passive cluster"
