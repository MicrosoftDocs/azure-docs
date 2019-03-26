---
title: What is Azure Load Balancer?
titlesuffix: Azure Load Balancer
description: Overview of Azure Load Balancer features, architecture, and implementation. Learn how the Load Balancer works and leverage it in the cloud.
services: load-balancer
documentationcenter: na
author: KumudD
ms.service: load-balancer
Customer intent: As an IT administrator, I want to learn more about the Azure Load Balancer service and what I can use it for. 
ms.devlang: na
ms.topic: overview
ms.custom: seodec18
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/11/2019
ms.author: kumud

---

# What is Azure Load Balancer?

With Azure Load Balancer, you can scale your applications and create high availability for your services. Load Balancer supports inbound and outbound scenarios, provides low latency and high throughput, and scales up to millions of flows for all TCP and UDP applications.  

Load Balancer distributes new inbound flows that arrive on the Load Balancer's frontend to backend pool instances, according to rules and health probes. 

Additionally, a public Load Balancer can provide outbound connections for virtual machines (VMs) inside your virtual network by translating their private IP addresses to public IP addresses.

Azure Load Balancer is available in two SKUs: Basic and Standard. There are differences in scale, features, and pricing. Any scenario that's possible with Basic Load Balancer can also be created with Standard Load Balancer, although the approaches might differ slightly. As you learn about Load Balancer, it is important to familiarize yourself with the fundamentals and SKU-specific differences.

## Why use Load Balancer? 

You can use Azure Load Balancer to:

* Load-balance incoming internet traffic to your VMs. This configuration is known as a [Public Load Balancer](#publicloadbalancer).
* Load-balance traffic across VMs inside a virtual network. You can also reach a Load Balancer front end from an on-premises network in a hybrid scenario. Both scenarios use a configuration that is known as an [Internal Load Balancer](#internalloadbalancer).
* Port forward traffic to a specific port on specific VMs with inbound network address translation (NAT) rules.
* Provide [outbound connectivity](load-balancer-outbound-connections.md) for VMs inside your virtual network by using a public Load Balancer.


>[!NOTE]
> Azure provides a suite of fully managed load-balancing solutions for your scenarios. If you are looking for Transport Layer Security (TLS) protocol termination ("SSL offload") or per-HTTP/HTTPS request, application-layer processing, review [Application Gateway](../application-gateway/application-gateway-introduction.md). If you are looking for global DNS load balancing, review [Traffic Manager](../traffic-manager/traffic-manager-overview.md). Your end-to-end scenarios might benefit from combining these solutions as needed.

## What are Load Balancer resources?

A Load Balancer resource can exist as either a public Load Balancer or an internal Load Balancer. The Load Balancer resource's functions are expressed as a front end, a rule, a health probe, and a backend pool definition. You place VMs into the backend pool by specifying the backend pool from the VM.

Load Balancer resources are objects within which you can express how Azure should program its multi-tenant infrastructure to achieve the scenario that you want to create. There is no direct relationship between Load Balancer resources and actual infrastructure. Creating a Load Balancer doesn't create an instance, and capacity is always available. 

## Fundamental Load Balancer features

Load Balancer provides the following fundamental capabilities for TCP and UDP applications:

* **Load balancing**

    With Azure Load Balancer, you can create a load-balancing rule to distribute traffic that arrives at frontend to backend pool instances. Load Balancer uses a hash-based algorithm for distribution of inbound flows and rewrites the headers of flows to backend pool instances accordingly. A server is available to receive new flows when a health probe indicates a healthy backend endpoint.
    
    By default, Load Balancer uses a 5-tuple hash composed of source IP address, source port, destination IP address, destination port, and IP protocol number to map flows to available servers. You can choose to create affinity to a specific source IP address by opting into a 2- or 3-tuple hash for a given rule. All packets of the same packet flow arrive on the same instance behind the load-balanced front end. When the client initiates a new flow from the same source IP, the source port changes. As a result, the 5-tuple might cause the traffic to go to a different backend endpoint.

    For more information, see [Load Balancer distribution mode](load-balancer-distribution-mode.md). The following image displays the hash-based distribution:

    ![Hash-based distribution](./media/load-balancer-overview/load-balancer-distribution.png)

    *Figure: Hash-based distribution*

* **Port forwarding**

    With Load Balancer, you can create an inbound NAT rule to port forward traffic from a specific port of a specific frontend IP address to a specific port of a specific backend instance inside the virtual network. This is also accomplished by the same hash-based distribution as load balancing. Common scenarios for this capability are Remote Desktop Protocol (RDP) or Secure Shell (SSH) sessions to individual VM instances inside the Azure Virtual Network. You can map multiple internal endpoints to the various ports on the same frontend IP address. You can use the frontend IP addresses to remotely administer your VMs over the internet without the need for an additional jump box.

* **Application agnostic and transparent**

    Load Balancer does not directly interact with TCP or UDP or the application layer, and any TCP or UDP application scenario can be supported.  Load Balancer does not terminate or originate flows, interact with the payload of the flow, provides no application layer gateway function, and protocol handshakes always occur directly between the client and the backend pool instance.  A response to an inbound flow is always a response from a virtual machine.  When the flow arrives on the virtual machine, the original source IP address is also preserved.  A couple of examples to further illustrate transparency:
    - Every endpoint is only answered by a VM.  For example, a TCP handshake always occurs between the client and the selected backend VM.  A response to a request to a front end is a response generated by backend VM. When you successfully validate connectivity to a frontend, you are validating the end to end connectivity to at least one backend virtual machine.
    - Application payloads are transparent to Load Balancer and any UDP or TCP application can be supported. For workloads which require per HTTP request processing or manipulation of application layer payloads (for example, parsing of HTTP URLs), you should use a layer 7 load balancer like [Application Gateway](https://azure.microsoft.com/services/application-gateway).
    - Because Load Balancer is agnostic to the TCP payload and TLS offload ("SSL") is not provided, you can build end to end encrypted scenarios using Load Balancer and gain large scale-out for TLS applications by terminating the TLS connection on the VM itself.  For example, your TLS session keying capacity is only limited by the type and number of VMs you add to the backend pool.  If you require  "SSL offloading", application layer treatment, or wish to delegate certificate management to Azure, you should use Azure's layer 7 load balancer [Application Gateway](https://azure.microsoft.com/services/application-gateway) instead.
        

* **Automatic reconfiguration**

    Load Balancer instantly reconfigures itself when you scale instances up or down. Adding or removing VMs from the backend pool reconfigures the Load Balancer without additional operations on the Load Balancer resource.

* **Health probes**

    To determine the health of instances in the backend pool, Load Balancer uses health probes that you define. When a probe fails to respond, the Load Balancer stops sending new connections to the unhealthy instances. Existing connections are not affected, and they continue until the application terminates the flow, an idle timeout occurs, or the VM is shut down.
     
    Load Balancer provides [different health probe types](load-balancer-custom-probe-overview.md#types) for TCP, HTTP, and HTTPS endpoints.

    Additionally, when using Classic cloud services, an additional type is allowed:  [Guest agent](load-balancer-custom-probe-overview.md#guestagent).  This should be considered to be a health probe of last resort and is not recommended when other options are viable.
    
* **Outbound connections (SNAT)**

    All outbound flows from private IP addresses inside your virtual network to public IP addresses on the internet can be translated to a frontend IP address of the Load Balancer. When a public front end is tied to a backend VM by way of a load balancing rule, Azure programs outbound connections to be automatically translated to the public frontend IP address.

  * Enable easy upgrade and disaster recovery of services, because the front end can be dynamically mapped to another instance of the service.
  * Easier access control list (ACL) management to. ACLs expressed in terms of frontend IPs do not change as services scale up or down or get redeployed.  Translating outbound connections to a smaller number of IP addresses than machines can reduce the burden of whitelisting.

    For more information, see [outbound connections](load-balancer-outbound-connections.md).

Standard Load Balancer has additional SKU-specific capabilities beyond these fundamentals. Review the remainder of this article for details.

## <a name="skus"></a> Load Balancer SKU comparison

Load Balancer supports both Basic and Standard SKUs, each differing in scenario scale, features, and pricing. Any scenario that's possible with Basic Load Balancer can be created with Standard Load Balancer as well. In fact, the APIs for both SKUs are similar and invoked through the specification of a SKU. The API for supporting SKUs for Load Balancer and the public IP is available starting with the 2017-08-01 API. Both SKUs have the same general API and structure.

However, depending on which SKU you choose, the complete scenario configuration might differ slightly. Load Balancer documentation calls out when an article applies only to a specific SKU. To compare and understand the differences, see the following table. For more information, see [Standard Load Balancer overview](load-balancer-standard-overview.md).

>[!NOTE]
> New designs should adopt Standard Load Balancer. 

Standalone VMs, availability sets, and virtual machine scale sets can be connected to only one SKU, never both. When you use them with public IP addresses, both Load Balancer and the public IP address SKU must match. Load Balancer and public IP SKUs are not mutable.

_It is a best practice to specify the SKUs explicitly, even though it is not yet mandatory._  At this time, required changes are being kept to a minimum. If a SKU is not specified, it is interpreted as an intention to use the 2017-08-01 API version of the Basic SKU.

>[!IMPORTANT]
>Standard Load Balancer is a new Load Balancer product and largely a superset of Basic Load Balancer. There are important and deliberate differences between the two products. Any end-to-end scenario that's possible with Basic Load Balancer can also be created with Standard Load Balancer. If you're already used to Basic Load Balancer, you should familiarize yourself with Standard Load Balancer to understand the latest changes in behavior between Standard and Basic and their impact. Review this section carefully.

[!INCLUDE [comparison table](../../includes/load-balancer-comparison-table.md)]

For more information, see [service limits for Load Balancer](https://aka.ms/lblimits). For Standard Load Balancer details, see [overview](load-balancer-standard-overview.md), [pricing](https://aka.ms/lbpricing), and [SLA](https://aka.ms/lbsla).

## Concepts

### <a name = "publicloadbalancer"></a>Public Load Balancer

A public Load Balancer maps the public IP address and port number of incoming traffic to the private IP address and port number of the VM, and vice versa for the response traffic from the VM. By applying load-balancing rules, you can distribute specific types of traffic across multiple VMs or services. For example, you can spread the load of web request traffic across multiple web servers.

The following figure shows a load-balanced endpoint for web traffic that is shared among three VMs for the public and  TCP port 80. These three VMs are in a load-balanced set.

![Public Load Balancer example](./media/load-balancer-overview/IC727496.png)

*Figure: Load balancing web traffic by using a public Load Balancer*

When internet clients send webpage requests to the public IP address of a web app on TCP port 80, Azure Load Balancer distributes the requests across the three VMs in the load-balanced set. For more information about Load Balancer algorithms, see the [Load Balancer features](load-balancer-overview.md##fundamental-load-balancer-features) section of this article.

By default, Azure Load Balancer distributes network traffic equally among multiple VM instances. You can also configure session affinity. For more information, see [Load Balancer distribution mode](load-balancer-distribution-mode.md).

### <a name = "internalloadbalancer"></a> Internal Load Balancer

An internal Load Balancer directs traffic only to resources that are inside a virtual network or that use a VPN to access Azure infrastructure. In this respect, an internal Load Balancer differs from a public Load Balancer. Azure infrastructure restricts access to the load-balanced frontend IP addresses of a virtual network. Frontend IP addresses and virtual networks are never directly exposed to an internet endpoint. Internal line-of-business applications run in Azure and are accessed from within Azure or from on-premises resources.

An internal Load Balancer enables the following types of load balancing:

* **Within a virtual network**: Load balancing from VMs in the virtual network to a set of VMs that reside within the same virtual network.
* **For a cross-premises virtual network**: Load balancing from on-premises computers to a set of VMs that reside within the same virtual network. 
* **For multi-tier applications**: Load balancing for internet-facing multi-tier applications where the backend tiers are not internet-facing. The backend tiers require traffic load-balancing from the internet-facing tier (see the next figure).
* **For line-of-business applications**: Load balancing for line-of-business applications that are hosted in Azure without additional load balancer hardware or software. This scenario includes on-premises servers that are in the set of computers whose traffic is load-balanced.

![Internal Load Balancer example](./media/load-balancer-overview/IC744147.png)

*Figure: Load balancing multi-tier applications by using both public and internal Load Balancer*

## Pricing

Standard Load Balancer usage is charged.

- Number of configured load-balancing and outbound rules (inbound NAT rules do not count against the total number of rules)
- Amount of data processed inbound and outbound irrespective of rule. 

For Standard Load Balancer pricing information, go to the [Load Balancer pricing](https://azure.microsoft.com/pricing/details/load-balancer/) page.

Basic Load Balancer is offered at no charge.

## SLA

For information about the Standard Load Balancer SLA, go to the [Load Balancer SLA](https://aka.ms/lbsla) page. 

## Limitations

- Load Balancer is a TCP or UDP product for load balancing and port forwarding for these specific IP protocols.  Load balancing rules and inbound NAT rules are supported for TCP and UDP and not supported for other IP protocols including ICMP. Load Balancer does not terminate, respond, or otherwise interact with the payload of a UDP or TCP flow. It is not a proxy. Successful validation of connectivity to a frontend must take place in-band with the same protocol used in a load balancing or inbound NAT rule (TCP or UDP) _and_ at least one of your virtual machines must generate a response for a client to see a response from a frontend.  Not receiving an in-band response from the Load Balancer frontend indicates no virtual machines were able to respond.  It is not possible to interact with a Load Balancer frontend without a virtual machine able to respond.  This also applies to outbound connections where [port masquerade SNAT](load-balancer-outbound-connections.md#snat) is only supported for TCP and UDP; any other IP protocols including ICMP  will also fail.  Assign an instance-level Public IP address to mitigate.
- Unlike public Load Balancers which provide [outbound connections](load-balancer-outbound-connections.md) when transitioning from private IP addresses inside the virtual network to public IP addresses, internal Load Balancers do not translate outbound originated connections to the frontend of an internal Load Balancer as both are in private IP address space.  This avoids potential for SNAT port exhaustion inside unique internal IP address space where translation is not required.  The side effect is that if an outbound flow from a VM in the backend pool attempts a flow to frontend of the internal Load Balancer in which pool it resides _and_ is mapped back to itself, both legs of the flow don't match and the flow will fail.  If the flow did not map back to the same VM in the backend pool which created the flow to the frontend, the flow will succeed.   When the flow maps back to itself the outbound flow appears to originate from the VM to the frontend and the corresponding inbound flow appears to originate from the VM to itself. From the guest OS's point of view, the inbound and outbound parts of the same flow don't match inside the virtual machine. The TCP stack will not recognize these halves of the same flow as being part of the same flow as the source and destination don't match.  When the flow maps to any other VM in the backend pool, the halves of the flow will match and the VM can successfully respond to the flow.  The symptom for this scenario is intermittent connection timeouts when the flow returns to the same backend which originated the flow. There are several common workarounds for reliably achieving this scenario (originating flows from a backend pool to the backend pools respective internal Load Balancer frontend) which include either insertion of a proxy layer behind the internal Load Balancer or [using DSR style rules](load-balancer-multivip-overview.md).  Customers can combine an internal Load Balancer with any 3rd party proxy or substitute internal [Application Gateway](../application-gateway/application-gateway-introduction.md) for proxy scenarios limited to HTTP/HTTPS. While you could use a public Load Balancer to mitigate, the resulting scenario is prone to [SNAT exhaustion](load-balancer-outbound-connections.md#snat) and should be avoided unless carefully managed.

## Next steps

You now have an overview of Azure Load Balancer. To get started with using a Load Balancer, create one, create VMs with a custom IIS extension installed, and load-balance the web app between the VMs. To learn how, see the [Create a Basic Load Balancer](quickstart-create-basic-load-balancer-portal.md) quickstart.
