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
Customer intent: As an IT administrator, I want to learn more about the Azure Load Balancer service and what I can use it for. 
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/21/2018
ms.author: kumud
ms.custom: mvc
---

# What is Azure Load Balancer?

Azure Load Balancer allows you to scale your applications and create high availability for your services. Load Balancer supports inbound as well as outbound scenarios, and provides low latency, high throughput, and scales up to millions of flows for all TCP and UDP applications.   

Load Balancer distributes new inbound flows arriving on the load balancer's frontend to backend pool instances according to rules and health probes.  

Additionally, a public Load Balancer can also provide outbound connections for virtual machines inside your virtual network by translating their private IP addresses to public IP addresses.

Azure Load Balancer is available in two different SKUs: Basic and Standard.  There are differences in scale, features, and pricing.  Any scenario that is possible with Basic Load Balancer can also be created with  Standard Load Balancer, although the approaches might differ slightly.  As you learn about Load Balancer, it is important to familiarize yourself with the fundamentals and SKU-specific differences.

## Why use Load Balancer? 

Azure Load Balancer can be used to:

* Load balance incoming Internet traffic to virtual machines. This configuration is known as a [public Load Balancer](#publicloadbalancer).
* Load balance traffic between virtual machines inside a virtual network. You can also reach a Load Balancer frontend from an on-premises network in a hybrid scenario. Both of these scenarios use a configuration that is known as an [internal Load Balancer](#internalloadbalancer).
* Port forward traffic to a specific port on specific virtual machines with inbound NAT rules.
* Provide [outbound connectivity](load-balancer-outbound-connections.md) for virtual machines inside your virtual network by using a public Load Balancer.


>[!NOTE]
> Azure provides a suite of fully managed load balancing solutions for your scenarios.  If you are looking for TLS termination ("SSL offload") or per HTTP/HTTPS request application layer processing, review [Application Gateway](../application-gateway/application-gateway-introduction.md).  If you are looking for global DNS load balancing, review [Traffic Manager](../traffic-manager/traffic-manager-overview.md).  Your end-to-end scenarios may benefit from combining these solutions as needed.

## What is Load Balancer?

A Load Balancer resource can exist as either a public Load Balancer or an internal Load Balancer. The Load Balancer resource's functions are expressed as a frontend, a rule, a health probe, and a backend pool definition. Virtual machines are placed into the backend pool by specifying the backend pool from the virtual machine.

Load Balancer resources are objects within which you can express how Azure should program its multi-tenant infrastructure to achieve the scenario you wish to create. There is no direct relationship between Load Balancer resources and actual infrastructure; creating a Load Balancer doesn't create an instance and capacity is always available. 

## Fundamental Load Balancer features

Load Balancer provides the following fundamental capabilities for TCP and UDP applications:

* **Load balancing**

    Azure Load Balancer allows you to create a load balancing rule to distribute traffic arriving at a frontend to backend pool instances. It uses a hash-based algorithm for distribution of inbound flows and rewrites the headers of flows to backend pool instances accordingly. A server is available to receive new flows when the health probe indicates a healthy backend endpoint.
    
    By default, it uses a 5-tuple hash composed of source IP address, source port, destination IP address, destination port, and IP protocol number to map flows to available servers. You can choose to create affinity to a specific source IP address by opting into a 2- or 3-tuple hash for a given rule. All packets of the same packet flow arrive on the same instance behind the load-balanced frontend. When the client initiates a new flow from the same source IP, the source port changes. The resulting 5-tuple may cause the traffic to go to a different backend endpoint as a result.

    For more information, see [Load balancer distribution mode](load-balancer-distribution-mode.md). The following graphic shows the hash-based distribution:

    ![Hash-based distribution](./media/load-balancer-overview/load-balancer-distribution.png)

    *Figure - Hash-based distribution*

* **Port forwarding**

    Azure Load Balancer allows you to create an inbound NAT rule to port forward traffic from a specific port of a specific frontend IP address to a specific port of a specific backend instance inside the virtual network. This is also accomplished by the same hash-based distribution as load balancing.  Common scenarios for this ability are Remote Desktop Protocol (RDP) or Secure Shell (SSH) sessions to individual virtual machine instances inside the Virtual Network. You can map multiple internal endpoints to the different ports on the same frontend IP address. You can use these  to remotely administer your virtual machines over the Internet without the need for an additional jump box.

* **Application agnostic and transparent**

    Load Balancer does not directly interact with TCP or UDP or the application layer and any TCP or UDP-based application scenario can be supported. For example, while Load Balancer does not terminate Transport Layer Security (TLS) itself, you can build and scale out TLS applications using Load Balancer and terminate the TLS connection on the virtual machine itself. Load Balancer does not terminate a flow and protocol handshakes are always directly between the client and the hash-selected backend pool instance. For example, a TCP handshake is always between the client and the selected backend virtual machine. And a response to  request to a frontend is a response generated from the backend virtual machine. Load Balancer's outbound network performance is only limited by the virtual machine SKU you choose and flows will remain alive for long periods of time if the idle timeout is never reached.

* **Automatic reconfiguration**

    Azure Load Balancer instantly reconfigures itself when you scale instances up or down. Adding or removing virtual machines from the backend pool reconfigures the load balancer without additional operations on the Load Balancer resource.

* **Health probes**

    Azure Load Balancer uses health probes that you define to determine the health of instances in the backend pool. When a probe fails to respond, the load balancer stops sending new connections to the unhealthy instances. Existing connections are not impacted and will continue until the application terminates the flow, an idle timeout occurs, or the virtual machine is shut down.

    Three types of probes are supported:

    - **HTTP custom probe:**  You can use it to create your own custom logic to determine the health of a backend pool instance. The load balancer will regularly probe your endpoint (every 15 seconds, by default). The instance is considered to be healthy if it responds with a HTTP 200 within the timeout period (default of 31 seconds). Any status other than HTTP 200 causes this probe to fail. This is also useful for implementing your own logic to remove instances from the load balancer's rotation. For example, you can configure the instance to return a non-200 status if the instance is above 90% CPU. This probe overrides the default guest agent probe.

    - **TCP custom probe:** This probe relies on successful TCP session establishment to a defined probe port.  As long as the specified listener on the virtual machine exists, this probe will succeed. If the connection is refused, the probe will fail. This probe overrides the default guest agent probe.

    - **Guest agent probe (on Platform as a Service Virtual Machines only):** The load balancer can also utilize the guest agent inside the virtual machine. The guest agent listens and responds with an HTTP 200 OK response only when the instance is in the ready state. If the agent fails to respond with an HTTP 200 OK, the load balancer marks the instance as unresponsive and stops sending traffic to that instance. The load balancer continues to attempt to reach the instance. If the guest agent responds with an HTTP 200, the load balancer will send traffic to that instance again. Guest agent probes are a last resort and should not be used when HTTP or TCP custom probe configurations are possible. 
    
* **Outbound connections (Source NAT)**

    All outbound flows from private IP addresses inside your Virtual Network to public IP addresses on the Internet can be translated to a frontend IP address of the Load Balancer. When a public frontend is tied to a backend virtual machine by way of a load balancing rule, Azure programs outbound connections to be automatically translated to the public frontend's IP address . This is also called Source NAT (SNAT). SNAT provides important benefits:

    + It enables easy upgrade and disaster recovery of services, since the frontend can be dynamically mapped to another instance of the service.
    + It makes access control list (ACL) management easier. ACLs expressed in terms of frontend IPs do not change as services scale up, down, or get redeployed.

    Refer to [outbound connections](load-balancer-outbound-connections.md) article for a detailed discussion of this ability.

Standard Load Balancer has additional SKU-specific abilities beyond these fundamentals.  Review the remainder of this article for details.

## <a name="skus"></a> Load Balancer SKU comparison

Azure Load Balancer supports two different SKUs: Basic and Standard. There are differences in scenario scale, features, and pricing. Any scenario that is possible with Basic Load Balancer can be created with Standard Load Balancer as well.  In fact, the APIs for both SKUs are similar and invoked through the specification of a SKU.  The API for supporting SKUs for Load Balancer and public IP is available starting with the 2017-08-01 API.  Both SKUs have the same general API and structure.

However, depending on which SKU is chosen, the complete scenario configuration detail may be slightly different. The Load Balancer documentation calls out when an article is applicable to a specific SKU only. Review the following table below to compare and understand the differences. Review [Standard Load Balancer Overview](load-balancer-standard-overview.md) for more information about Standard Load Balancer.

>[!NOTE]
> New designs should consider using Standard Load Balancer. 

Standalone virtual machines, availability sets, and virtual machine scale sets can only be connected to one SKU, never both. When used with public IP addresses, both Load Balancer and public IP address SKU must match. Load Balancer and Public IP SKUs are not mutable.

_It is a best practice to specify the SKUs explicitly, even though it is not yet mandatory._  At this time, required changes are being kept to a minimum. If a SKU is not specified, it is interpreted as the intention to use Basic SKU in the 2017-08-01 API version.

>[!IMPORTANT]
>Standard Load Balancer is a new Load Balancer product and largely a superset of Basic Load Balancer. There are important and deliberate differences between both products. Any end-to-end scenario possible with Basic Load Balancer can also be created with Standard Load Balancer. If you are already used to Basic Load Balancer, you should familiarize yourself with Standard Load Balancer to understand breaking changes in behavior between Standard and Basic and their impact. Review this section carefully.

| | [Standard SKU](load-balancer-standard-overview.md) | Basic SKU |
| --- | --- | --- |
| Backend pool size | up to 1000 instances | up to 100 instances |
| Backend pool endpoints | any virtual machine in a single virtual network, including blend of virtual machines, availability sets, virtual machine scale sets. | virtual machines in a single availability set or virtual machine scale set |
| Availability Zones | zone-redundant and zonal frontends for inbound and outbound, outbound flows mappings survive zone failure, cross-zone load balancing | / |
| Diagnostics | Azure Monitor, multi-dimensional metrics including byte and packet counters, health probe status, connection attempts (TCP SYN), outbound connection health (SNAT successful and failed flows), active data plane measurements | Azure Log Analytics for public Load Balancer only, SNAT exhaustion alert, backend pool health count |
| HA Ports | internal Load Balancer | / |
| Secure by default | default closed for public IP and Load Balancer endpoints and a network security group must be used to explicitly whitelist for traffic to flow | default open, network security group optional |
| Outbound connections | Multiple frontends with per rule opt-out. An outbound scenario _must_ be explicitly created for the virtual machine to be able to use outbound connectivity.  [VNet Service Endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) can be reached without outbound connectivity and do not count towards data processed.  Any public IP addresses, including Azure PaaS services not available as VNet Service Endpoints, must be reached via outbound connectivity and count towards data processed. When only an internal Load Balancer is serving a virtual machine, outbound connections via default SNAT are not available. Outbound SNAT programming is transport protocol specific based on protocol of the inbound load balancing rule. | Single frontend, selected at random when multiple frontends are present. When only internal Load Balancer is serving a virtual machine, default SNAT is used. |
| Multiple frontends | Inbound and outbound | Inbound only |
| Management Operations | Most operations < 30 seconds | 60-90+ seconds typical |
| SLA | 99.99% for data path with two healthy virtual machines | Implicit in VM SLA | 
| Pricing | Charged based on number of rules, data processed inbound or outbound associated with resource  | No charge |

Review [service limits for Load Balancer](https://aka.ms/lblimits). For Standard Load Balancer also review a more detailed [overview](load-balancer-standard-overview.md), [pricing](https://aka.ms/lbpricing), and [SLA](https://aka.ms/lbsla).

## Concepts

### <a name = "publicloadbalancer"></a>Public Load Balancer

Public Load Balancer maps the public IP address and port number of incoming traffic to the private IP address and port number of the virtual machine and vice versa for the response traffic from the virtual machine. Load balancing rules allow you to distribute specific types of traffic between multiple virtual machines or services. For example, you can spread the load of web request traffic across multiple web servers.

The following figure shows a load-balanced endpoint for web traffic that is shared among three virtual machines for the public and private TCP port of 80. These three virtual machines are in a load-balanced set.

![public load balancer example](./media/load-balancer-overview/IC727496.png)

*Figure : Load balancing web traffic using a public Load Balancer*

When Internet clients send web page requests to the public IP address of a web app on TCP port 80, the Azure Load Balancer distributes the requests between the three virtual machines in the load-balanced set. For more information about load balancer algorithms, see the [load balancer overview page](load-balancer-overview.md#load-balancer-features).

By default, Azure Load Balancer distributes network traffic equally among multiple virtual machine instances. You can also configure session affinity. For more information, see [load balancer distribution mode](load-balancer-distribution-mode.md).

### <a name = "internalloadbalancer"></a> Internal Load Balancer

Internal Load Balancer only directs traffic to resources that are inside a virtual network or that use a VPN to access Azure infrastructure. In this respect, internal Load Balancer differs from a public Load Balancer. Azure infrastructure restricts access to the load-balanced frontend IP addresses of a virtual network. Frontend IP addresses and virtual networks are never directly exposed to an internet endpoint. Internal line-of-business applications run in Azure and are accessed from within Azure or from on-premises resources.

Internal Load Balancer enables the following types of load balancing:

* Within a virtual network: Load balancing from VMs in the virtual network to a set of VMs that reside within the same virtual network.
* For a cross-premises virtual network: Load balancing from on-premises computers to a set of VMs that reside within the same virtual network. 
* For multi-tier applications: Load balancing for internet-facing multi-tier applications where the back-end tiers are not internet-facing. The back-end tiers require traffic load balancing from the internet-facing tier.
* For line-of-business applications: Load balancing for line-of-business applications that are hosted in Azure without additional load balancer hardware or software. This scenario includes on-premises servers that are in the set of computers whose traffic is load-balanced.

![internal load balancer example](./media/load-balancer-overview/IC744147.png)

*Figure - Load balancing multi-tier applications using both public and internal load balancers*

## Pricing
Standard Load Balancer is a charged product based on number of load balancing rules configured and all inbound and outbound data processed. For Standard Load Balancer pricing information, visit the [Load Balancer Pricing](https://azure.microsoft.com/pricing/details/load-balancer/) page.

Basic Load Balancer is offered at no charge.

## SLA

For information about the Standard Load Balancer SLA, visit the [Load Balancer SLA](https://aka.ms/lbsla) page. 

## Next steps

You now have an overview of Azure Load Balancer. To get started using a Load Balancer, create one, create VMs with a custom IIS extension installed, and load balance the web app between the VMs. To learn how, see [Create a Basic Load Balancer](quickstart-create-basic-load-balancer-portal.md) quickstart.

