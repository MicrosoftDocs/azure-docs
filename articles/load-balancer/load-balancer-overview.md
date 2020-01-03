---
title: What is Azure Load Balancer?
titleSuffix: Azure Load Balancer
description: Overview of Azure Load Balancer features, architecture, and implementation. Learn how the Load Balancer works and how to leverage it in the cloud.
services: load-balancer
documentationcenter: na
author: asudbring
ms.service: load-balancer
Customer intent: As an IT administrator, I want to learn more about the Azure Load Balancer service and what I can use it for. 
ms.devlang: na
ms.topic: overview
ms.custom: seodec18
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/05/2019
ms.author: allensu

---

# What is Azure Load Balancer?

*Load balancing* refers to efficiently distributing load or incoming network traffic across a group of backend resources or servers. Azure offers a [variety of load balancing options](https://docs.microsoft.com/azure/architecture/guide/technology-choices/load-balancing-overview) that you can choose from based on your need. This document covers the Azure Load Balancer.

Azure Load Balancer operates at layer four of the Open Systems Interconnection (OSI) model. It is the single point of contact for clients. Load Balancer distributes new inbound flows that arrive at the Load Balancer's front end to back-end pool instances, according to specified load balancing rules and health probes. The back-end pool instances can be Azure Virtual Machines or instances in a virtual machine scale set. 

With Azure Load Balancer, you can scale your applications and create high available services. 
Load Balancer supports both, inbound and outbound scenarios, provides low latency and high throughput, and scales up to millions of flows for all TCP and UDP applications.

A **[public Load Balancer](#publicloadbalancer)** can provide outbound connections for virtual machines (VMs) inside your virtual network by translating their private IP addresses to public IP addresses. Public Load Balancers are used to load balancer internet traffic to your VMs.

An **[internal (or private) Load Balancer](#internalloadbalancer)** can be used for scenarios where only private IP addresses are needed at the frontend. Internal Load Balancers are used to load balance traffic inside a virtual network. You can also reach a Load Balancer frontend from an on-premises network in a hybrid scenario.

## Load Balancer components
* **Frontend IP configurations**: The IP address of the Load Balancer. It is the point of contact for clients. These can be either public or private IP addresses, thus creating either Public or Internal Load Balancers respectively.
* **Backend pool**: The group of Virtual Machines or instances in the Virtual Machine Scale Set that are going to serve the incoming request. To scale cost-effectively in order to meet high volumes of incoming traffic computing best practices generally recommends adding more instances to the backend pool. Load Balancer instantly reconfigures itself via automatic reconfiguration when you scale instances up or down. Adding or removing VMs from the backend pool reconfigures the Load Balancer without additional operations on the Load Balancer resource.
* **Health probes**: A health probe is used to determine the health of the instances in the backend pool. You can define the unhealthy threshold for your health probes. When a probe fails to respond, the Load Balancer stops sending new connections to the unhealthy instances. A probe failure doesn't affect existing connections. The connection continues until the application terminates the flow, an idle timeout occurs, or the VM shuts down. Load Balancer provides different health probe types for TCP, HTTP, and HTTPS endpoints. For more information, see [Probe types](load-balancer-custom-probe-overview.md#types).
* **Load balancing rules**: Load Balancing rules are the ones that tell the Load Balancer what needs to be done when. 
* **Inbound NAT rules**: An Inbound NAT rule forwards traffic from a specific port of a specific frontend IP address to a specific port of a specific backend instance inside the virtual network. Port forwarding is done by the same hash-based distribution as load balancing. Common scenarios for this capability are Remote Desktop Protocol (RDP) or Secure Shell (SSH) sessions to individual VM instances inside an Azure Virtual Network. You can map multiple internal endpoints to ports on the same front-end IP address. You can use the front-end IP addresses to remotely administer your VMs without an additional jump box.
* **Outbound rules**: An outbound rule configures outbound Network Address Translation (NAT) for all virtual machines or instances identified by the backend pool to be translated to the frontend.

## Load Balancer concepts

Load Balancer provides the following fundamental capabilities for TCP and UDP applications:

* **Load balancing algorithm**: With Azure Load Balancer, you can create a load-balancing rule to distribute traffic that arrives at the frontend to backend pool instances. Load Balancer uses a hashing algorithm for distribution of inbound flows and rewrites the headers of flows to backend pool instances. A server is available to receive new flows when a health probe indicates a healthy back-end endpoint.
By default, Load Balancer uses a 5-tuple hash. The hash includes source IP address, source port, destination IP address, destination port, and IP protocol number to map flows to available servers. You can create affinity to a source IP address by using a 2- or 3-tuple hash for a given rule. All packets of the same packet flow arrive on the same instance behind the load-balanced front end. When the client initiates a new flow from the same source IP, the source port is changed. As a result, the 5-tuple hash might cause the traffic to go to a different backend endpoint.
For more information, see [Configure the distribution mode for Azure Load Balancer](load-balancer-distribution-mode.md). The following image displays the hash-based distribution:

  ![Hash-based distribution](./media/load-balancer-overview/load-balancer-distribution.png)

  *Figure: Hash-based distribution*

* **Application independence and transparency**: Load Balancer doesn't directly interact with TCP or UDP or the application layer. Any TCP or UDP application scenario can be supported. Load Balancer doesn't terminate or originate flows, interact with the payload of the flow, or provide any application layer gateway function. Protocol handshakes always occur directly between the client and the back-end pool instance. A response to an inbound flow is always a response from a virtual machine. When the flow arrives on the virtual machine, the original source IP address is also preserved.
  * Every endpoint is only answered by a VM. For example, a TCP handshake always occurs between the client and the selected back-end VM. A response to a request to a front end is a response generated by a back-end VM. When you successfully validate connectivity to a front end, you're validating the end-to-end connectivity to at least one back-end virtual machine.
  * Application payloads are transparent to Load Balancer. Any UDP or TCP application can be supported.
  * Because Load Balancer doesn't interact with the TCP payload and provide TLS offload, you can build end-to-end encrypted scenarios. Using Load Balancer gains large scale-out for TLS applications by terminating the TLS connection on the VM itself. For example, your TLS session keying capacity is only limited by the type and number of VMs you add to the back-end pool.

* **Outbound connections (SNAT)**: All outbound flows from private IP addresses inside your virtual network to public IP addresses on the internet can be translated to a front-end IP address of the Load Balancer. When a public front end is tied to a back-end VM by way of a load-balancing rule, Azure translates outbound connections to the public front-end IP address. This configuration has the following advantages:
  * Easy upgrade and disaster recovery of services, because the front end can be dynamically mapped to another instance of the service.
  * Easier access control list (ACL) management. ACLs expressed as front-end IPs don't change as services scale up or down or get redeployed. Translating outbound connections to a smaller number of IP addresses than machines reduces the burden of implementing safe recipient lists.
For more information, see [Outbound connections in Azure](load-balancer-outbound-connections.md).
Standard Load Balancer has additional SKU-specific capabilities beyond these fundamentals, as described below.

## <a name="skus"></a> Load Balancer SKU comparison

Load Balancer supports both Basic and Standard SKUs. These SKUs differ in scenario scale, features, and pricing. Any scenario that's possible with Basic Load Balancer can be created with Standard Load Balancer. The APIs for both SKUs are similar and are invoked through the specification of a SKU. The API for supporting SKUs for Load Balancer and the public IP is available starting with the `2017-08-01` API. Both SKUs share the same general API and structure.

The complete scenario configuration might differ slightly depending on SKU. Load Balancer documentation calls out when an article applies only to a specific SKU. To compare and understand the differences, see the following table. For more information, see [Azure Standard Load Balancer overview](load-balancer-standard-overview.md).

>[!NOTE]
> Microsoft reccomends Standard Load Balancer.
Standalone VMs, availability sets, and virtual machine scale sets can be connected to only one SKU, never both. Load Balancer and the public IP address SKU must match when you use them with public IP addresses. Load Balancer and public IP SKUs aren't mutable.

[!INCLUDE [comparison table](../../includes/load-balancer-comparison-table.md)]

For more information, see [Load balancer limits](https://aka.ms/lblimits). For Standard Load Balancer details, see [overview](load-balancer-standard-overview.md), [pricing](https://aka.ms/lbpricing), and [SLA](https://aka.ms/lbsla).

## Load Balancer types

### <a name = "publicloadbalancer"></a>Public Load Balancer

A public Load Balancer maps the public IP address and port of incoming traffic to the private IP address and port of the VM. Load Balancer maps traffic the other way around for the response traffic from the VM. You can distribute specific types of traffic across multiple VMs or services by applying load-balancing rules. For example, you can spread the load of web request traffic across multiple web servers.

>[!NOTE]
>You can implement only one public Load Balancer and one internal Load Balancer per availability set.

The following figure shows a load-balanced endpoint for web traffic that is shared among three VMs for the public and TCP port 80. These three VMs are in a load-balanced set.

![Public Load Balancer example](./media/load-balancer-overview/IC727496.png)

*Figure: Balancing web traffic by using a public Load Balancer*

Internet clients send webpage requests to the public IP address of a web app on TCP port 80. Azure Load Balancer distributes the requests across the three VMs in the load-balanced set. For more information about Load Balancer algorithms, see [Load Balancer concepts](load-balancer-overview.md##load-balancer-concepts).

Azure Load Balancer distributes network traffic equally among multiple VM instances by default. You can also configure session affinity. For more information, see [Configure the distribution mode for Azure Load Balancer](load-balancer-distribution-mode.md).

### <a name = "internalloadbalancer"></a> Internal Load Balancer

An internal Load Balancer directs traffic only to resources that are inside a virtual network or that use a VPN to access Azure infrastructure, in contrast to a public Load Balancer. Azure infrastructure restricts access to the load-balanced front-end IP addresses of a virtual network. Front-end IP addresses and virtual networks are never directly exposed to an internet endpoint. Internal line-of-business applications run in Azure and are accessed from within Azure or from on-premises resources.

An internal Load Balancer enables the following types of load balancing:

* **Within a virtual network**: Load balancing from VMs in the virtual network to a set of VMs that are in the same virtual network.
* **For a cross-premises virtual network**: Load balancing from on-premises computers to a set of VMs that are in the same virtual network.
* **For multi-tier applications**: Load balancing for internet-facing multi-tier applications where the back-end tiers aren't internet-facing. The back-end tiers require traffic load balancing from the internet-facing tier. See the next figure.
* **For line-of-business applications**: Load balancing for line-of-business applications that are hosted in Azure without additional load balancer hardware or software. This scenario includes on-premises servers that are in the set of computers whose traffic is load balanced.

![Internal Load Balancer example](./media/load-balancer-overview/IC744147.png)

*Figure: Balancing multi-tier applications by using both public and internal Load Balancer*

## Pricing

Standard Load Balancer usage is charged.

* Number of configured load-balancing and outbound rules. Inbound NAT rules don't count in the total number of rules.
* Amount of data processed inbound and outbound independent of rules.

For Standard Load Balancer pricing information, see [Load Balancer pricing](https://azure.microsoft.com/pricing/details/load-balancer/).

Basic Load Balancer is offered at no charge.

## SLA

For information about the Standard Load Balancer SLA, see [SLA for Load Balancer](https://aka.ms/lbsla).

## Limitations

* Load Balancer provides load balancing and port forwarding for specific TCP or UDP protocols. Load-balancing rules and inbound NAT rules support TCP and UDP, but not other IP protocols including ICMP.

  Load Balancer doesn't terminate, respond, or otherwise interact with the payload of a UDP or TCP flow. It's not a proxy. Successful validation of connectivity to a front end must take place in-band with the same protocol used in a load balancing or inbound NAT rule. At least one of your virtual machines must generate a response for a client to see a response from a front end.

  Not receiving an in-band response from the Load Balancer front end indicates no virtual machines could respond. Nothing can interact with a Load Balancer front end without a virtual machine able to respond. This principle also applies to outbound connections where port masquerade SNAT is only supported for TCP and UDP. Any other IP protocols, including ICMP, fail. Assign an instance-level public IP address to mitigate this issue. For more information, see [Understanding SNAT and PAT](load-balancer-outbound-connections.md#snat).

* Internal Load Balancers don't translate outbound originated connections to the front end of an internal Load Balancer because both are in private IP address space. Public Load Balancers provide [outbound connections](load-balancer-outbound-connections.md) from private IP addresses inside the virtual network to public IP addresses. For internal Load Balancers, this approach avoids potential SNAT port exhaustion inside a unique internal IP address space, where translation isn't required.

  A side effect is that if an outbound flow from a VM in the back-end pool attempts a flow to front end of the internal Load Balancer in its pool _and_ is mapped back to itself, the two legs of the flow don't match. Because they don't match, the flow fails. The flow succeeds if the flow didn't map back to the same VM in the back-end pool that created the flow to the front end.

  When the flow maps back to itself, the outbound flow appears to originate from the VM to the front end and the corresponding inbound flow appears to originate from the VM to itself. From the guest operating system's point of view, the inbound and outbound parts of the same flow don't match inside the virtual machine. The TCP stack won't recognize these halves of the same flow as being part of the same flow. The source and destination don't match. When the flow maps to any other VM in the back-end pool, the halves of the flow do match and the VM can respond to the flow.

  The symptom for this scenario is intermittent connection timeouts when the flow returns to the same back end that originated the flow. Common workarounds include insertion of a proxy layer behind the internal Load Balancer and using Direct Server Return (DSR) style rules. For more information, see [Multiple Front ends for Azure Load Balancer](load-balancer-multivip-overview.md).

  You can combine an internal Load Balancer with any third-party proxy or use internal [Application Gateway](../application-gateway/application-gateway-introduction.md) for proxy scenarios with HTTP/HTTPS. While you could use a public Load Balancer to mitigate this issue, the resulting scenario is prone to [SNAT exhaustion](load-balancer-outbound-connections.md#snat). Avoid this second approach unless carefully managed.

* In general, forwarding IP fragments isn't supported on load-balancing rules. IP fragmentation of UDP and TCP packets isn't supported on load-balancing rules. High availability ports load-balancing rules can be used to forward existing IP fragments. For more information, see [High availability ports overview](load-balancer-ha-ports-overview.md).

## Next steps

See [Create a public Standard Load Balancer](quickstart-load-balancer-standard-public-portal.md) to get started with using a Load Balancer: create one, create VMs with a custom IIS extension installed, and load balance the web app between the VMs.
