---
title: Deploy multiple network virtual appliances in a Virtual WAN hub
titleSuffix: Azure Virtual WAN
description: Learn how to deploy and route traffic through multiple third-party solutions in the same Azure Virtual WAN hub.
author: cfields475
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 11/06/2026
ms.author: cfields
---

# Deploy multiple third-party solutions in a Virtual WAN hub

Azure Virtual WAN supports multiple third-party solutions in the same Virtual WAN hub, including network virtual appliances (NVAs) and SaaS solutions. This article describes common considerations for deploying multiple third-party solutions in a single hub.

## Virtual WAN hub address space considerations

The following table describes the behavior of Virtual WAN hubs when third-party solutions are deployed in existing and newly created Virtual WAN hubs. 

|Hub type| Subnet allocation| Capacity behavior | Service chaining| NVA and SaaS solution coexistence|
|--|--|--|--|--|
|Existing Virtual WAN hub| All NVAs deployed in the Virtual WAN hub share the same set of subnets.| The number of allocatable IP addresses in each subnet is based on the size of the hub address space. See [IP addresses consumed by NVA](about-nva-hub.md#ipconsumed) for more information.| Not supported| The virtual hub can be used for one or more NVAs or a SaaS solution, but not both. |
|New Virtual WAN hub| Each NVA or SaaS solution is deployed into a dedicated set of subnets.| The number of allocatable IP addresses in each subnet is based on the size of the hub address space. See [IP addresses consumed by NVA](about-nva-hub.md#ipconsumed) for more information. There is also a maximum number of NVA/SaaS solutions in each Virtual WAN hub based on the hub address space.| Supported| The virtual hub can be used for both NVAs and SaaS solutions.|

### Number of third-party solutions supported in a Virtual WAN hub

The following table describes the maximum number of third-party solutions supported in a Virtual WAN hub based on the configured virtual hub address space and the number of interfaces assigned to each deployed NVA or SaaS solution. If you use a mixture of 2-NIC and 3-NIC solutions in the same hub, the maximum number of third-party solutions is based on the maximum number of 3-NIC NVAs or SaaS solutions that can be deployed in the Virtual WAN hub.
 
|Hub address space| Maximum number of 2-NIC NVA or SaaS solutions| Maximum number of 3-NIC NVA or SaaS solutions|
|--|--|--|
|/24| 1| 1|
|/23| 2| 1|
|/22| 2|3|
|/21|5|3|
|/20 or larger |9|6|

## Considerations for using multiple third-party solutions in a Virtual WAN hub

* **Routing intent configurations**
    * You can configure routing intent to use one NVA or SaaS solution for private traffic between on-premises sites and virtual networks and another NVA or SaaS solution for internet-bound traffic. The solution used for internet-bound traffic can't terminate on-premises SD-WAN or VPN tunnels. Otherwise, traffic is routed asymmetrically because outbound traffic from Azure to on-premises is routed through the NVA used for the private routing policy.
* **SaaS solutions**
    * You can deploy multiple SaaS solutions in newly created Virtual WAN hubs. You can configure one SaaS solution as the next hop for private traffic and another as the next hop for internet traffic. Existing Virtual WAN hubs support only one SaaS solution.
* **Service chaining**
    * See [Service chaining SD-WAN and firewall solutions](#service-chaining-sd-wan-and-firewall-solutions) for more information and considerations related to service chaining between third-party solutions in the same Virtual WAN hub.

## Service chaining SD-WAN and firewall solutions

> [!NOTE]
> Service chaining between SD-WAN and firewall NVAs is supported only in newly deployed Virtual WAN hubs. Existing hubs support multiple NVAs in the same hub, but don't support service chaining between them. Attempting to route traffic between an SD-WAN NVA and a firewall NVA in an existing hub results in a routing loop at the firewall NVA.

Service chaining allows traffic from an on-premises site connected to an NVA in the Virtual WAN hub to be routed through another firewall NVA in the same hub for inspection. This configuration allows inspection of north-south, east-west, and internet-bound traffic.

The following service chaining scenarios are supported in Virtual WAN hubs. To determine the capabilities of your deployed third-party solution, refer to [NVA partners](about-nva-hub.md#partners).

> [!NOTE]
> The source NVA in a service chaining scenario can't be used as the next hop NVA for internet routing intent.

| Source NVA | Chained destination NVA | 
| --|--|
| SD-WAN NVA or dual-role NVA | Dual-role NVA or firewall NVA |
| SD-WAN NVA or dual-role NVA | SaaS solution |

In the preceding table, the chained destination is the next hop for traffic received from the source NVA. The chained destination is configured as the next hop in the Virtual WAN hub's routing intent private or internet routing policy. Service chaining can only be implemented by using routing intent.

### Configuration

Deploy both source NVA and chained destination NVA in the same Virtual WAN hub. Configure routing intent with the next hop resource as the chained destination NVA. Virtual WAN automatically configures routing to ensure the source NVA forwards traffic to the chained destination NVA for inspection. 

### Key considerations for service chaining

* The source NVA must preserve the original source IP address of the on-premises traffic. Performing source network address translation (SNAT) to the private IP address of a source NVA instance results in asymmetric routing because return traffic bypasses the SD-WAN NVA. 
    * As a result, any dual-role NVA that you use as a source NVA can't use the [destination NAT capability](how-to-network-virtual-appliance-inbound.md).  
* Service chaining with routing intent supports a **single** chained destination NVA per Virtual WAN hub for each routing intent destination type (private or internet). All NVAs that aren't specified as a next hop in routing intent are configured to route traffic to the chained destination. 
* An NVA that is the next hop for internet routing intent can't be service chained to a firewall NVA configured as the next hop for private routing intent. As a result, the internet routing intent NVA can't terminate VPN or SD-WAN tunnels. Otherwise, traffic is routed asymmetrically because outbound traffic from Azure to on-premises is routed through the NVA used for the private routing policy.

## Next steps

To learn more about NVAs in a Virtual WAN hub, see the [About NVAs in a Virtual WAN hub](about-nva-hub.md) article.
