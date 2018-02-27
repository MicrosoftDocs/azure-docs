---
title: Outbound connections in Azure | Microsoft Docs
description: This article explains how Azure enables VMs to communicate with public internet services.
services: load-balancer
documentationcenter: na
author: KumudD
manager: jeconnoc
editor: ''

ms.assetid: 5f666f2a-3a63-405a-abcd-b2e34d40e001
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/05/2018
ms.author: kumud
---

# Outbound connections in Azure

[!INCLUDE [load-balancer-basic-sku-include.md](../../includes/load-balancer-basic-sku-include.md)]


Azure provides outbound connectivity for customer deployments through several different mechanisms. This article describes what the scenarios are, when they apply, how they work, and how to manage them.

A deployment in Azure can communicate with endpoints outside Azure in the public IP address space. When an instance initiates an outbound flow to a destination in the public IP address space, Azure dynamically maps the private IP address to a public IP address. After this mapping is created, return traffic for this outbound originated flow can also reach the private IP address where the flow originated.

Azure uses source network address translation (SNAT) to perform this function. When multiple private IP addresses are masquerading behind a single public IP address, Azure uses [port address translation (PAT)](#pat) to masquerade private IP addresses. Ephemeral ports are used for PAT and are [preallocated](#preallocatedports) based on pool size.

There are multiple [outbound scenarios](#scenarios). You can combine these scenarios as needed. Review them carefully to understand the capabilities, constraints, and patterns as they apply to your deployment model and application scenario. Review guidance for [managing these scenarios](#snatexhaust).

## <a name="scenarios"></a>Scenario overview

Azure has two major deployment models: Azure Resource Manager and classic. Azure Load Balancer and related resources are explicitly defined when you're using [Azure Resource Manager](#arm). Classic deployments abstract the concept of a load balancer and express a similar function through the definition of endpoints of a [cloud service](#classic). The applicable [scenarios](#scenarios) for your deployment depend on which deployment model you use.

### <a name="arm"></a>Azure Resource Manager

Azure currently provides three different methods to achieve outbound connectivity for Azure Resource Manager resources. [Classic](#classic) deployments have a subset of these scenarios.

| Scenario | Method | Description |
| --- | --- | --- |
| [1. VM with an Instance Level Public IP address (with or without Load Balancer)](#ilpip) | SNAT, port masquerading not used |Azure uses the public IP assigned to the IP configuration of the instance's NIC. The instance has all ephemeral ports available. |
| [2. Public Load Balancer associated with a VM (no Instance Level Public IP address on the instance)](#lb) | SNAT with port masquerading (PAT) using the Load Balancer frontends |Azure shares the public IP address of the public Load Balancer frontends with multiple private IP addresses. Azure uses ephemeral ports of the frontends to PAT. |
| [3. Standalone VM (no Load Balancer, no Instance Level Public IP address)](#defaultsnat) | SNAT with port masquerading (PAT) | Azure automatically designates a public IP address for SNAT, shares this public IP address with multiple private IP addresses of the availability set, and uses ephemeral ports of this public IP address. This is a fallback scenario for the preceding scenarios. We don't recommend it if you need visibility and control. |

If you don't want a VM to communicate with endpoints outside Azure in public IP address space, you can use network security groups (NSGs) to block access as needed. The section [Preventing outbound connectivity](#preventoutbound) discusses NSGs in more detail. Guidance on designing, implementing, and managing a virtual network without any outbound access is outside the scope of this article.

### <a name="classic"></a>Classic (cloud services)

The scenarios available for classic deployments are a subset of the scenarios available for [Azure Resource Manager](#arm) deployments and Load Balancer Basic.

A classic virtual machine has the same three fundamental scenarios as described for Azure Resource Manager resources ([1](#ilpip), [2](#lb), [3](#defaultsnat)). A classic web worker role has only two scenarios ([2](#lb), [3](#defaultsnat)). [Mitigation strategies](#snatexhaust) also have the same differences.

The algorithm used for [preallocating ephemeral ports](#ephemeralprots) for PAT for classic deployments is the same as for Azure Resource Manager resource deployments.  

### <a name="ilpip"></a>Scenario 1: VM with an Instance Level Public IP address

In this scenario, the VM has an Instance Level Public IP (ILPIP) assigned to it. As far as outbound connections are concerned, it doesn't matter whether the VM is load balanced or not. This scenario takes precedence over the others. When an ILPIP is used, the VM uses the ILPIP for all outbound flows.  

Port masquerading (PAT) is not used, and the VM has all ephemeral ports available for use.

If your application initiates many outbound flows and you experience SNAT port exhaustion, consider assigning an [ILPIP to mitigate SNAT constraints](#assignilpip). Review [Managing SNAT exhaustion](#snatexhaust) in its entirety.

### <a name="lb"></a>Scenario 2: Load-balanced VM without an Instance Level Public IP address

In this scenario, the VM is part of a public Load Balancer backend pool. The VM does not have a public IP address assigned to it. The Load Balancer resource must be configured with a load balancer rule to create a link between the public IP frontend with the backend pool. 

If you do not complete this rule configuration, the behavior is as described in the scenario for [Standalone VM with no Instance Level Public IP](#defaultsnat). It is not necessary for the rule to have a working listener in the backend pool for the health probe to succeed.

When the load-balanced VM creates an outbound flow, Azure translates the private source IP address of the outbound flow to the public IP address of the public Load Balancer frontend. Azure uses SNAT to perform this function. Azure also uses [PAT](#pat) to masquerade multiple private IP addresses behind a public IP address. 

Ephemeral ports of the load balancer's public IP address frontend are used to distinguish individual flows originated by the VM. SNAT dynamically uses [preallocated ephemeral ports](#preallocatedports) when outbound flows are created. In this context, the ephemeral ports used for SNAT are called SNAT ports.

SNAT ports are preallocated as described in the [Understanding SNAT and PAT](#snat) section. They're a finite resource that can be exhausted. It's important to understand how they are [consumed](#pat). To understand how to design for this consumption and mitigate as necessary, review [Managing SNAT exhaustion](#snatexhaust).

When [multiple (public) IP addresses are associated with Load Balancer Basic](load-balancer-multivip-overview.md), any of these public IP addresses are a [candidate for outbound flows](#multivipsnat), and one is selected.  

To monitor the health of outbound connections with Load Balancer Basic, you can use [Log Analytics for Load Balancer](load-balancer-monitor-log.md) and [alert event logs](load-balancer-monitor-log.md#alert-event-log) to monitor for SNAT port exhaustion messages.

### <a name="defaultsnat"></a>Scenario 3: Standalone VM without an Instance Level Public IP address

In this scenario, the VM is not part of an Azure Load Balancer pool and does not have an ILPIP address assigned to it. When the VM creates an outbound flow, Azure translates the private source IP address of the outbound flow to a public source IP address. The public IP address used for this outbound flow is not configurable and does not count against the subscription's public IP resource limit. 

Azure uses SNAT with port masquerading ([PAT](#pat)) to perform this function. This scenario is similar to [scenario 2](#lb), except there is no control over the IP address used. This is a fallback scenario for when scenarios 1 and 2 do not exist. We don't recommend this scenario if you want control over the outbound address.

SNAT ports are preallocated as described in the [Understanding SNAT and PAT](#snat) section. They're a finite resource that can be exhausted. It's important to understand how they are [consumed](#pat). To understand how to design for this consumption and mitigate as necessary, review [Managing SNAT exhaustion](#snatexhaust).

### <a name="combinations"></a>Multiple, combined scenarios

You can combine the scenarios described in the preceding sections to achieve a particular outcome. When multiple scenarios are present, an order of precedence applies: [scenario 1](#ilpip) takes precedence over [scenario 2](#lb) and [3](#defaultsnat) (Azure Resource Manager only). [Scenario 2](#lb) overrides [scenario 3](#defaultsnat) (Azure Resource Manager and classic).

An example is an Azure Resource Manager deployment where the application relies heavily on outbound connections to a limited number of destinations but also receives inbound flows over a Load Balancer frontend. In this case, you can combine scenarios 1 and 2 for relief. For additional patterns, review [Managing SNAT exhaustion](#snatexhaust).

### <a name="multivipsnat"></a> Multiple frontends for outbound flows

Load Balancer Basic chooses a single frontend to be used for outbound flows when [multiple (public) IP frontends](load-balancer-multivip-overview.md) are candidates for outbound flows. This selection is not configurable, and you should consider the selection algorithm to be random. You can designate a specific IP address for outbound flows as described in [Multiple, combined scenarios](#combinations).

## <a name="snat"></a>Understanding SNAT and PAT

### <a name="pat"></a>Port masquerading SNAT (PAT)

When a public Load Balancer resource is associated with VM instances, each outbound connection source is rewritten. The source is rewritten from the virtual network private IP address space to the frontend Public IP address of the load balancer. In the public IP address space, the 5-tuple of the flow (source IP address, source port, IP transport protocol, destination IP address, destination port) must be unique.  

Ephemeral ports (SNAT ports) are used to achieve this after rewriting the private source IP address, because multiple flows originate from a single public IP address. 

One SNAT port is consumed per flow to a single destination IP address, port, and protocol. For multiple flows to the same destination IP address, port, and protocol, each flow consumes a single SNAT port. This ensures that the flows are unique when they originate from the same public IP address and go to the same destination IP address, port, and protocol. 

Multiple flows, each to a different destination IP address, port, and protocol, share a single SNAT port. The destination IP address, port, and protocol make flows unique without the need for additional source ports to distinguish flows in the public IP address space.

When SNAT port resources are exhausted, outbound flows fail until existing flows release SNAT ports. Load Balancer reclaims SNAT ports when the flow closes and uses a [4-minute idle timeout](#idletimeout) for reclaiming SNAT ports from idle flows.

For patterns to mitigate conditions that commonly lead to SNAT port exhaustion, review the [Managing SNAT](#snatexhaust) section.

### <a name="preallocatedports"></a>Ephemeral port preallocation for port masquerading SNAT (PAT)

Azure uses an algorithm to determine the number of preallocated SNAT ports available based on the size of the backend pool when using port masquerading SNAT ([PAT](#pat)). SNAT ports are ephemeral ports available for a particular public IP source address.

Azure preallocates SNAT ports to the IP configuration of the NIC of each VM. When an IP configuration is added to the pool, the SNAT ports are preallocated for this IP configuration based on the backend pool size. For classic web worker roles, the allocation is per role instance. When outbound flows are created, [PAT](#pat) dynamically consumes (up to the preallocated limit) and releases these ports when the flow closes or [idle timeouts](#ideltimeout) happen.

The following table shows the SNAT port preallocations for tiers of backend pool sizes:

| Pool size (VM instances) | Preallocated SNAT ports per IP configuration|
| --- | --- |
| 1-50 | 1,024 |
| 51-100 | 512 |
| 101-200 | 256 |
| 201-400 | 128 |
| 401-800 | 64 |
| 801-1,000 | 32 |

Remember that the number of SNAT ports available does not translate directly to number of flows. A single SNAT port can be reused for multiple unique destinations. Ports are consumed only if it's necessary to make flows unique. For design and mitigation guidance, refer to the section about [how to manage this exhaustible resource](#snatexhaust) and the section that describes [PAT](#pat).

Changing the size of your backend pool might affect some of your established flows. If the backend pool size increases and transitions into the next tier, half of your preallocated SNAT ports are reclaimed during the transition to the next larger backend pool tier. Flows that are associated with a reclaimed SNAT port will time out and must be reestablished. If a new flow is attempted, the flow will succeed immediately as long as preallocated ports are available.

If the backend pool size decreases and transitions into a lower tier, the number of available SNAT ports increases. In this case, existing allocated SNAT ports and their respective flows are not affected.

## <a name="snatexhaust"></a>Managing SNAT (PAT) port exhaustion

[Ephemeral ports](#preallocatedports) used for [PAT](#pat) are an exhaustible resource, as described in [Standalone VM without an Instance Level Public IP address](#defaultsnat) and [Load-balanced VM without an Instance Level Public IP address](#lb).

If you know that you're initiating many outbound TCP or UDP connections to the same destination IP address and port, and you observe failing outbound connections or are advised by support that you're exhausting SNAT ports (preallocated [ephemeral ports](#preallocatedports) used by [PAT](#pat)), you have several general mitigation options. Review these options and decide what is available and best for your scenario. It's possible that one or more can help manage this scenario.

If you are having trouble understanding the outbound connection behavior, you can use IP stack statistics (netstat). Or it can be helpful to observe connection behaviors by using packet captures. You can perform these packet captures in the guest OS of your instance or use [Network Watcher for packet capture](../network-watcher/network-watcher-packet-capture-manage-portal.md).

### <a name="connectionreuse"></a>Modify the application to reuse connections 
You can reduce demand for ephemeral ports that are used for SNAT by reusing connections in your application. This is especially true for protocols like HTTP/1.1, where connection reuse is the default. And other protocols that use HTTP as their transport (for example, REST) can benefit in turn. 

Reuse is always better than individual, atomic TCP connections for each request. Reuse results in more performant, very efficient TCP transactions.

### <a name="connection pooling"></a>Modify the application to use connection pooling
You can employ a connection pooling scheme in your application, where requests are internally distributed across a fixed set of connections (each reusing where possible). This scheme constrains the number of ephemeral ports in use and creates a more predictable environment. This scheme can also increase the throughput of requests by allowing multiple simultaneous operations when a single connection is blocking on the reply of an operation.  

Connection pooling might already exist within the framework that you're using to develop your application or the configuration settings for your application. You can combine connection pooling with connection reuse. Your multiple requests then consume a fixed, predictable number of ports to the same destination IP address and port. The requests also benefit from efficient use of TCP transactions reducing latency and resource utilization. UDP transactions can also benefit, because managing the number of UDP flows can in turn avoid exhaust conditions and manage the SNAT port utilization.

### <a name="retry logic"></a>Modify the application to use less aggressive retry logic
When [preallocated ephemeral ports](#preallocatedports) used for [PAT](#pat) are exhausted or application failures occur, aggressive or brute force retries without decay and backoff logic cause exhaustion to occur or persist. You can reduce demand for ephemeral ports by using a less aggressive retry logic. 

Ephemeral ports have a 4-minute idle timeout (not adjustable). If the retries are too aggressive, the exhaustion has no opportunity to clear up on its own. Therefore, considering how--and how often--your application retries transactions is a critical part of the design.

### <a name="assignilpip"></a>Assign an Instance Level Public IP to each VM
Assigning an ILPIP changes your scenario to [Instance Level Public IP to a VM](#ilpip). All ephemeral ports of the public IP that are used for each VM are available to the VM. (As opposed to scenarios where ephemeral ports of a public IP are shared with all the VMs associated with the respective backend pool.) There are trade-offs to consider, such as the additional cost of public IP addresses and the potential impact of whitelisting a large number of individual IP addresses.

>[!NOTE] 
>This option is not available for web worker roles.

### <a name="idletimeout"></a>Use keepalives to reset the outbound idle timeout

Outbound connections have a 4-minute idle timeout. This timeout is not adjustable. However, you can use transport (for example, TCP keepalives) or application-layer keepalives to refresh an idle flow and reset this idle timeout if necessary.

## <a name="discoveroutbound"></a>Discovering the public IP that a VM uses
There are many ways to determine the public source IP address of an outbound connection. OpenDNS provides a service that can show you the public IP address of your VM. 

By using the nslookup command, you can send a DNS query for the name myip.opendns.com to the OpenDNS resolver. The service returns the source IP address that was used to send the query. When you run the following query from your VM, the response is the public IP used for that VM:

    nslookup myip.opendns.com resolver1.opendns.com

## <a name="preventoutbound"></a>Preventing outbound connectivity
Sometimes it's undesirable for a VM to be allowed to create an outbound flow. Or there might be a requirement to manage which destinations can be reached with outbound flows, or which destinations can begin inbound flows. In this case, you can use [network security groups](../virtual-network/virtual-networks-nsg.md) to manage the destinations that the VM can reach. You can also use NSGs to manage which public destination can initiate inbound flows. 

When you apply an NSG to a load-balanced VM, pay attention to the [default tags](../virtual-network/virtual-networks-nsg.md#default-tags) and [default rules](../virtual-network/virtual-networks-nsg.md#default-rules). You must ensure that the VM can receive health probe requests from Azure Load Balancer. 

If an NSG blocks health probe requests from the AZURE_LOADBALANCER default tag, your VM health probe fails and the VM is marked down. Load Balancer stops sending new flows to that VM.

## Next steps

- Learn more about [Load Balancer Basic](load-balancer-overview.md).
- Learn more about [network security groups](../virtual-network/virtual-networks-nsg.md).
- Learn about some of the other key [networking capabilities](../networking/networking-overview.md) in Azure.
