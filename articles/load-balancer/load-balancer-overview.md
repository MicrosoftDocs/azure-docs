---
title: Azure Load Balancer overview | Microsoft Docs
description: Overview of Azure Load Balancer features, architecture, and implementation. Learn how the load balancer works and leverage it in the cloud.
services: load-balancer
documentationcenter: na
author: KumudD
manager: jeconnoc
editor: ''
ms.assetid: 
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/21/2018
ms.author: kumud
---

# Azure Load Balancer overview

With Azure Load Balancer you can scale your applications and create high availability for your services. Load Balancer supports inbound and outbound scenarios, provides low latency and high throughput, and scales up to millions of flows for all TCP and UDP applications.  

Load Balancer distributes new inbound flows that arrive on your load balancer's front-end to back-end pool instances, according to rules and health probes. 

Additionally, a public load balancer can provide outbound connections for virtual machines (VMs) inside your virtual network by translating their private IP addresses to public IP addresses.

Azure Load Balancer is available in two SKUs: Basic and Standard. There are differences in scale, features, and pricing. Any scenario that's possible with Basic Load Balancer can also be created with Standard Load Balancer, although the approach might differ slightly. As you learn about Load Balancer, it is important to familiarize yourself with the fundamentals and SKU-specific differences.

## Why use Load Balancer? 

You can use Azure Load Balancer to:

* Load-balance incoming internet traffic to your VMs. This configuration is known as a [public load balancer](#publicloadbalancer).
* Load-balance traffic across VMs inside a virtual network. You can also reach a load balancer front end from an on-premises network in a hybrid scenario. Both scenarios use a configuration that is known as an [internal load balancer](#internalloadbalancer).
* Port forward traffic to a specific port on specific VMs with inbound network address translation (NAT) rules.
* Provide [outbound connectivity](load-balancer-outbound-connections.md) for VMs inside your virtual network by using a public load balancer.


>[!NOTE]
> Azure provides a suite of fully managed load-balancing solutions for your scenarios. If you are looking for Transport Layer Security (TLS) protocol termination ("SSL offload") or per-HTTP/HTTPS request, application-layer processing, review [Application Gateway](../application-gateway/application-gateway-introduction.md). If you are looking for global DNS load balancing, review [Traffic Manager](../traffic-manager/traffic-manager-overview.md). Your end-to-end scenarios might benefit from combining these solutions as needed.

## What are load balancer resources?

A load balancer resource can exist as either a public load balancer or an internal load balancer. The load balancer resource's functions are expressed as a front end, a rule, a health probe, and a back-end pool definition. You place VMs into the back-end pool by specifying the back-end pool from the VM.

Load balancer resources are objects within which you can express how Azure should program its multi-tenant infrastructure to achieve the scenario you want to create. There is no direct relationship between load balancer resources and actual infrastructure. Creating a load balancer doesn't create an instance, and capacity is always available. 

## Fundamental Load Balancer features

Load Balancer provides the following fundamental capabilities for TCP and UDP applications:

* **Load balancing**

    With Azure Load Balancer, you can create a load-balancing rule to distribute traffic that arrives at front-end to back-end pool instances. The rule uses a hash-based algorithm for distribution of inbound flows and rewrites the headers of flows to back-end pool instances accordingly. A server is available to receive new flows when a health probe indicates a healthy back-end endpoint.
    
    By default, the load-balancing rule uses a 5-tuple hash composed of source IP address, source port, destination IP address, destination port, and IP protocol number to map flows to available servers. You can choose to create affinity to a specific source IP address by opting into a 2- or 3-tuple hash for a given rule. All packets of the same packet flow arrive on the same instance behind the load-balanced front end. When the client initiates a new flow from the same source IP, the source port changes. The 5-tuple hash might cause the traffic to go to a different back-end endpoint as a result.

    For more information, see [Load balancer distribution mode](load-balancer-distribution-mode.md). The following graphic shows the hash-based distribution:

    ![Hash-based distribution](./media/load-balancer-overview/load-balancer-distribution.png)

    *Figure: Hash-based distribution*

* **Port forwarding**

    With Load Balancer, you can create an inbound NAT rule to port forward traffic from a specific port of a specific front-end IP address to a specific port of a specific back-end instance inside the virtual network. This is also accomplished by the same hash-based distribution as load balancing. Common scenarios for this capability are Remote Desktop Protocol (RDP) or Secure Shell (SSH) sessions to individual VM instances inside the virtual network. You can map multiple internal endpoints to the different ports on the same front-end IP address. You can use them to remotely administer your VMs over the internet without the need for an additional jump box.

* **Application agnostic and transparent**

    Load Balancer does not directly interact with TCP or UDP or the application layer, and any TCP or UDP-based application scenario can be supported. For example, while Load Balancer does not terminate TLS itself, you can build and scale out TLS applications by using Load Balancer and terminate the TLS connection on the VM itself. Load Balancer does not terminate a flow, and protocol handshakes are always directly between the client and the hash-selected back-end pool instance. For example, a TCP handshake is always between the client and the selected back-end VM. A response to a request to a front end is a response generated from the back-end VM. Load Balancer outbound network performance is limited only by the VM SKU you choose, and flows remain alive for lengthy periods if the idle timeout is never reached.

* **Automatic reconfiguration**

    Load Balancer instantly reconfigures itself when you scale instances up or down. Adding or removing VMs from the back-end pool reconfigures the load balancer without additional operations on the load balancer resource.

* **Health probes**

    Load Balancer uses health probes that you define to determine the health of instances in the back-end pool. When a probe fails to respond, your load balancer stops sending new connections to the unhealthy instances. Existing connections are not affected, and they continue until the application terminates the flow, an idle timeout occurs, or the VM is shut down.

    Three types of probes are supported:

    - **HTTP custom probe**: You can use this probe to create your own custom logic to determine the health of a back-end pool instance. Your load balancer regularly probes your endpoint (every 15 seconds, by default). The instance is considered to be healthy if it responds with an HTTP 200 within the timeout period (default of 31 seconds). Any status other than HTTP 200 causes this probe to fail. This probe is also useful for implementing your own logic to remove instances from the load balancer's rotation. For example, you can configure the instance to return a non-200 status if the instance is greater than 90 percent CPU.  This probe overrides the default guest agent probe.

    - **TCP custom probe**: This probe relies on establishing a successful TCP session to a defined probe port. As long as the specified listener on the VM exists, this probe succeeds. If the connection is refused, the probe fails. This probe overrides the default guest agent probe.

    - **Guest agent probe (on platform as a service [PaaS] VMs only)**: The load balancer can also utilize the guest agent inside the VM. The guest agent listens and responds with an HTTP 200 OK response only when the instance is in the ready state. If the agent fails to respond with an HTTP 200 OK, the load balancer marks the instance as unresponsive and stops sending traffic to that instance. The load balancer continues to attempt to reach the instance. If the guest agent responds with an HTTP 200, the load balancer sends traffic to that instance again. Guest agent probes are a last resort and should not be used when HTTP or TCP custom probe configurations are possible. 
    
* **Outbound connections (source NAT)**

    All outbound flows from private IP addresses inside your virtual network to public IP addresses on the internet can be translated to a front-end IP address of the Load Balancer. When a public front end is tied to a back-end VM by way of a load balancing rule, Azure programs outbound connections to be automatically translated to the public front-end IP address. This is also called source NAT (SNAT). SNAT provides important benefits:

    * It enables easy upgrade and disaster recovery of services, because the front end can be dynamically mapped to another instance of the service.
    * It makes access control list (ACL) management easier. ACLs expressed in terms of front-end IPs do not change as services scale up or down or get redeployed.

    For more information, see [outbound connections](load-balancer-outbound-connections.md).

Standard Load Balancer has additional SKU-specific capabilities beyond these fundamentals. Review the remainder of this article for details.

## <a name="skus"></a> Load Balancer SKU comparison

Load Balancer supports both Basic and Standard SKUs, each differing in scenario scale, features, and pricing. Any scenario that's possible with Basic Load Balancer can be created with Standard Load Balancer as well. In fact, the APIs for both SKUs are similar and invoked through the specification of a SKU. The API for supporting SKUs for Load Balancer and public IP is available starting with the 2017-08-01 API. Both SKUs have the same general API and structure.

However, depending on which SKU you choose, the complete scenario configuration might differ slightly. Load Balancer documentation calls out when an article is applicable to a specific SKU only. To compare and understand the differences, see the following table. For more information, see [Standard Load Balancer overview](load-balancer-standard-overview.md).

>[!NOTE]
> If you are using a newer design scenario, consider using Standard Load Balancer. 

Standalone VMs, availability sets, and VM scale sets can be connected to only one SKU, never both. When you use them with public IP addresses, both Load Balancer and the public IP address SKU must match. Load Balancer and public IP SKUs are not mutable.

_It is a best practice to specify the SKUs explicitly, even though it is not yet mandatory._  At this time, required changes are being kept to a minimum. If a SKU is not specified, it is interpreted as an intention to use the 2017-08-01 API version of the Basic SKU.

>[!IMPORTANT]
>Standard Load Balancer is a new Load Balancer product and largely a superset of Basic Load Balancer. There are important and deliberate differences between the two products. Any end-to-end scenario that's possible with Basic Load Balancer can be created with Standard Load Balancer. If you are already used to Basic Load Balancer, you should familiarize yourself with Standard Load Balancer to understand the latest changes in behavior between Standard and Basic and their impact. Review this section carefully.

| | [Standard SKU](load-balancer-standard-overview.md) | Basic SKU |
| --- | --- | --- |
| Back-end pool size | Up to 1000 instances. | Up to 100 instances. |
| Back-end pool endpoints | Any VM in a single virtual network, including a blend of VMs, availability sets, and VM scale sets. | Virtual machines in a single availability set or VM scale set. |
| Azure Availability Zones | Zone-redundant and zonal front ends for inbound and outbound, outbound flow mappings survive zone failure, cross-zone load balancing. | / |
| Diagnostics | Azure Monitor, multi-dimensional metrics including byte and packet counters, health probe status, connection attempts (TCP SYN), outbound connection health (SNAT successful and failed flows), active data plane measurements. | Azure Log Analytics for public load balancer only, SNAT exhaustion alert, back-end pool health count. |
| HA Ports | Internal load balancer. | / |
| Secure by default | By default, closed for public IP and load balancer endpoints. For traffic to flow, a network security group must be used to explicitly whitelist entities. | Default open, network security group optional. |
| Outbound connections | Multiple front ends with per-rule opt-out. An outbound scenario _must_ be explicitly created for the VM to be able to use outbound connectivity. [Virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) can be reached without outbound connectivity and do not count toward data processed. Any public IP addresses, including Azure PaaS services not available as virtual network service endpoints, must be reached via outbound connectivity and count toward data processed. When only an internal load balancer is serving a VM, outbound connections via default SNAT are not available. Outbound SNAT programming is transport-protocol specific, based on protocol of the inbound load-balancing rule. | Single front end, selected at random when multiple front ends are present. When only an internal load balancer is serving a VM, the default SNAT is used. |
| Multiple front ends | Inbound and outbound. | Inbound only. |
| Management Operations | Most operations < 30 seconds. | 60-90+ seconds typical. |
| SLA | 99.99 percent for a data path with two healthy VMs. | Implicit in the VM SLA. | 
| Pricing | Charges are based on the number of rules and data processed inbound or outbound that are associated with the resource.  | No charge. |

For more information, see [service limits for Load Balancer](https://aka.ms/lblimits). For Standard Load Balancer details, see [overview](load-balancer-standard-overview.md), [pricing](https://aka.ms/lbpricing), and [SLA](https://aka.ms/lbsla).

## Concepts

### <a name = "publicloadbalancer"></a>Public load balancer

A public load balancer maps the public IP address and port number of incoming traffic to the private IP address and port number of the VM, and vice versa for the response traffic from the VM. By applying load-balancing rules, you can distribute specific types of traffic across multiple VMs or services. For example, you can spread the load of web request traffic across multiple web servers.

The following figure shows a load-balanced endpoint for web traffic that is shared among three VMs for the public and private TCP port 80. These three VMs are in a load-balanced set.

![Public load balancer example](./media/load-balancer-overview/IC727496.png)

*Figure: Load balancing web traffic by using a public load balancer*

When internet clients send webpage requests to the public IP address of a web app on TCP port 80, Azure Load Balancer distributes the requests across the three VMs in the load-balanced set. For more information about load balancer algorithms, see the [load balancer overview page](load-balancer-overview.md#load-balancer-features).

By default, Azure Load Balancer distributes network traffic equally among multiple VM instances. You can also configure session affinity. For more information, see [load balancer distribution mode](load-balancer-distribution-mode.md).

### <a name = "internalloadbalancer"></a> Internal load balancer

An internal load balancer directs traffic only to resources that are inside a virtual network or that use a VPN to access Azure infrastructure. In this respect, an internal load balancer differs from a public load balancer. Azure infrastructure restricts access to the load-balanced front-end IP addresses of a virtual network. Front-end IP addresses and virtual networks are never directly exposed to an internet endpoint. Internal line-of-business applications run in Azure and are accessed from within Azure or from on-premises resources.

An internal load balancer enables the following types of load balancing:

* **Within virtual networks**: Load balancing from VMs in the virtual network to a set of VMs that reside within the same virtual network.
* **For cross-premises virtual networks**: Load balancing from on-premises computers to a set of VMs that reside within the same virtual network. 
* **For multi-tier applications**: Load balancing for internet-facing multi-tier applications where the back-end tiers are not internet-facing. The back-end tiers require traffic load-balancing from the internet-facing tier (see the next figure).
* **For line-of-business applications**: Load balancing for line-of-business applications that are hosted in Azure without additional load balancer hardware or software. This scenario includes on-premises servers that are in the set of computers whose traffic is load-balanced.

![Internal load balancer example](./media/load-balancer-overview/IC744147.png)

*Figure: Load balancing multi-tier applications by using both public and internal load balancers*

## Pricing
Standard Load Balancer usage is charged based on the number of configured load-balancing rules and the amount of processed inbound and outbound data. For Standard Load Balancer pricing information, go to the [Load Balancer pricing](https://azure.microsoft.com/pricing/details/load-balancer/) page.

Basic Load Balancer is offered at no charge.

## SLA

For information about the Standard Load Balancer SLA, go to the [Load Balancer SLA](https://aka.ms/lbsla) page. 

## Next steps

To learn more about Load Balancer, see:
- [Standard Load Balancer overview](load-balancer-standard-overview.md)
- [Standard Load Balancer and Availability Zones](load-balancer-standard-availability-zones.md)
- [Load Balancer for outbound connections](load-balancer-outbound-connections.md)
- [Load Balancer HA ports](load-balancer-ha-ports-overview.md)
- [Load Balancer with multiple front ends](load-balancer-multivip-overview.md)
- [Virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md)
- [Create a basic public load balancer](load-balancer-get-started-internet-portal.md)

