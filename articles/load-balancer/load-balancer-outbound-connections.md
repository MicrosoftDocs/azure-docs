---
title: Understanding outbound connections in Azure | Microsoft Docs
description: This article explains how Azure enables VMs to communicate with public Internet services.
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

# Understanding outbound connections in Azure

[!INCLUDE [load-balancer-basic-sku-include.md](../../includes/load-balancer-basic-sku-include.md)]


Azure provides outbound connectivity for customer deployments through several different mechanisms.  This article describes what the scenarios are, when they apply, how they work, and how to manage them.

A deployment in Azure can communicate with endpoints outside of Azure in public IP address space. When an instance initiates an outbound flow to a destination in public IP address space, Azure dynamically maps the private IP address to a public IP address.  Once this mapping has been created, return traffic for this outbound originated flow can also reach the private IP address where the flow originated.

Azure uses source network address translation (SNAT) to perform this function.  When multiple private IP addresses are masquerading behind a single public IP address, Azure uses [port address translation (PAT)](#pat) to masquerade private IP addresses.  Ephemeral ports are used for PAT and are [preallocated](#preallocatedports) based on pool size.

There are multiple [outbound scenarios](#scenarios). These scenarios can be combined as needed. Review them carefully to understand the capabilities, constraints, and patterns as they apply to your deployment model and application scenario.  Review guidance for [managing these scenarios](#snatexhaust).

## <a name="scenarios"></a>Scenario overview

Azure has two major deployment models: Azure Resource Manager and Classic. Load Balancer and related resources are explicitly defined when using [Azure Resource Manager resources](#arm).  Classic deployments abstract the concept of a load balancer and express a similar function through the definition of endpoints of a [cloud service](#classic). The applicable [scenarios](#scenarios) for your deployment dependent on which deployment model is used.

### <a name="arm"></a>Azure Resource Manager

Azure currently provides three different methods to achieve outbound connectivity for Azure Resource Manager resources.  [Classic](#classic) deployments have a subset of these scenarios.

| Scenario | Method | Description |
| --- | --- | --- |
| [1. VM  with Instance Level Public IP address (with or without load balancer)](#ilpip) | SNAT, port masquerading not used |Azure uses the public IP assigned to the IP configuration of the instance's NIC.  The instance has all ephemeral ports available. |
| [2. Public Load Balancer associated with VM (no Instance Level Public IP address on instance)](#lb) | SNAT with port masquerading (PAT) using the Load Balancer frontend(s) |Azure shares the public IP address of the public Load Balancer frontend(s) with multiple private IP addresses and uses ephemeral ports of the frontend(s) to PAT. |
| [3. Standalone VM (no load balancer, no Instance Level Public IP address)](#defaultsnat) | SNAT with port masquerading (PAT) | Azure automatically designates a public IP address for SNAT, shares this public IP address with multiple private IP addresses of the Availability Set and uses ephemeral ports of this public IP address.  This scenario is a fallback scenario for the preceeding scenarios 1 & 2 and not recommended if you need visibility and control. |

If you do not want a VM to communicate with endpoints outside of Azure in public IP address space, you can use Network Security Groups (NSG) to block access as needed.  Using NSGs is discussed in more detail in [preventing outbound connectivity](#preventoutbound).  Design guidance and implementation detail for how to design and manage a Virtual Network without any outbound access is outside of the scope of this article.

### <a name="classic"></a>Classic (cloud services)

The scenarios available for Classic deployments are a subset of scenarios available for [Azure Resource Manager](#arm) deployments and Load Balancer Basic.

A Classic Virtual Machine has the same three fundamental scenarios as described for Azure Resource Manager resources ([1](#ilpip), [2](#lb), [3](#defaultsnat)). A Classic Web Worker Role only has two scenarios ([2](#lb), [3](#defaultsnat)).  [Mitigation strategies](#snatexhaust) also have the same differences.

The algorithm used for [preallocating ephemeral ports](#ephemeralprots) for PAT for Classic deployments is the same as for Azure Resource Manager resource deployments.  

### <a name="ilpip"></a>Scenario 1: VM with an Instance Level Public IP address

In this scenario, the VM has an Instance Level Public IP (ILPIP) assigned to it. As far as outbound connections are concerned, it does not matter whether the VM is load balanced or not.  This scenario takes precedence over the others. When an ILPIP is used, the VM uses the ILPIP for all outbound flows.  

Port masquerading (PAT) is not used and the VM has all ephemeral ports available for use.

If your application initiates many outbound flows and you experience SNAT port exhaustion, you can consider assigning an [ILPIP to mitigate SNAT constraints](#assignilpip). Review [Managing SNAT exhaustion](#snatexhaust) it its entirety.

### <a name="lb"></a>Scenario 2: Load-balanced VM without Instance Level Public IP address

In this scenario, the VM is part of a public Load Balancer backend pool.  The VM does not have a public IP address assigned to it. The Load Balancer resource must be configured with a load balancer rule to create a link between the public IP frontend with the backend pool. If you do not complete this rule configuration, the behavior is as described in the scenario for [Standalone VM with no Instance Level Public IP](#defaultsnat).  It is not necessary for the rule to have a working listener in the backend pool or the health probe to succeed.

When the load-balanced VM creates an outbound flow, Azure translates the private source IP address of the outbound flow to the public IP address of the public Load Balancer frontend. Azure uses Source Network Address Translation (SNAT) to perform this function as well as [port address translation (PAT)](#pat) to masquerade multiple private IP addresses behind a public IP address. Ephemeral ports of the Load Balancer's public IP address frontend are used to distinguish individual flows originated by the VM. SNAT dynamically uses [preallocated ephemeral ports](#preallocatedports) when outbound flows are created. In this context, the ephemeral ports used for SNAT are referred to as SNAT ports.

SNAT ports are preallocated as described in the [Understanding SNAT and PAT](#snat) section and are a finite resource that can be exhausted. It is important to understand how they are [consumed](#pat). Review [Managing SNAT exhaustion](#snatexhaust) to understand how to design for and mitigate as necessary.

When [multiple (public) IP addresses are associated with a Load Balancer Basic](load-balancer-multivip-overview.md), any of these public IP addresses are a [candidate for outbound flows and one is selected](#multivipsnat).  

You can use [Log Analytics for Load Balancer](load-balancer-monitor-log.md) and [Alert event logs to monitor for SNAT port exhaustion messages](load-balancer-monitor-log.md#alert-event-log) to monitor health of outbound connections with Load Balancer Basic.

### <a name="defaultsnat"></a>Scenario 3: Standalone VM without Instance Level Public IP address

The VM is not part of an Azure Load Balancer pool and does not have an Instance Level Public IP (ILPIP) address assigned to it. When the VM creates an outbound flow, Azure translates the private source IP address of the outbound flow to a public source IP address. The public IP address used for this outbound flow is not configurable and does not count against the subscription's public IP resource limit. Azure uses Source Network Address Translation (SNAT) with port masquerading ([PAT](#pat)) to perform this function. This scenario is similar to [scenario 2](#lb), except there is no control over the IP address used.  This is a fallback scenario for when scenarios 1 and scenario 2 do not exist.  This scenario is not recommended if control over the outbound address is desired.

SNAT ports are preallocated as described in the [Understanding SNAT and PAT](#snat) section and are a finite resource that can be exhausted. It is important to understand how they are [consumed](#pat). Review [Managing SNAT exhaustion](#snatexhaust) to understand how to design for and mitigate as necessary.

### <a name="combinations"></a>Multiple, combined scenarios

The scenarios described in the preceeding sections can be combined to achieve a particular outcome.  When multiple scenarios are present, an order of precedence applies: [scenario 1](#ilpip) takes precedence over [scenario 2](#lb) and [3](#defaultsnat) (Azure Resource Manager only), and [scenario 2](#lb) overrides [scenario 3](#defaultsnat) (Azure Resource Manager & Classic).

An example is an Azure Resource Manager deployment where the application relies heavily on outbound connections to a limited number of destinations but also receives inbound flows over a Load Balancer frontend. In this case, you could combine scenarios 1 & 2 for relief.  Review [Managing SNAT exhaustion](#snatexhaust) for additional patterns.

### <a name="multivipsnat"></a> Multiple frontends for outbound flows

Load Balancer Basic will choose a single frontend to be used outbound flows when [multiple (public) IP frontends](load-balancer-multivip-overview.md) are candidates for outbound flows.  This selection is not configurable and the selection algorithm should be considered to be random.  You can designate a specific IP address for outbound as described in [combined scenarios](#combinations).

## <a name="snat"></a>Understanding SNAT and PAT

### <a name="pat"></a>Port masquerading SNAT (PAT)

When a public Load Balancer resource is associated with VM instances, each outbound connection source is rewritten. The source is rewritten from the virtual network private IP address space to the front-end Public IP address of the load balancer. In the public IP address space, the 5-tuple of the flow (source IP address, source port, IP transport protocol, destination IP address, destination port) must be unique.  Ephemeral ports are used to achieve this after rewriting the private source IP address since multiple flows originate from a single public IP address.  These ephemeral ports are called SNAT ports. 

One SNAT port is consumed per flow to a single destination IP address, port, and protocol. For multiple flows to the same destination IP address, port, and protocol, each flow consumes a single SNAT port. This ensures that the flows are unique when originated from the same public IP address to the same destination IP address, port, and protocol. 

Multiple flows, each to a different destination IP address, port, and protocol, will share a single SNAT port. The destination IP address, port, and protocol makes flows unique without the need for additional source ports to be used to distinguish flows in public IP address space.

When SNAT port resources are exhausted, outbound flows fail until SNAT ports are released by existing flows. Load Balancer reclaims SNAT ports when the flow closes and uses a [4-minute idle timeout](#idletimeout) for reclaiming SNAT ports from idle flows.

Review the [Managing SNAT](#snatexhaust) section for patterns to mitigate conditions which commonly lead to SNAT port exhaustion.

### <a name="preallocatedports"></a>Ephemeral port preallocation for port masquerading SNAT (PAT)

Azure uses an algorithm to determine the number of preallocated SNAT ports available based on the size of the backend pool when using port masquerading SNAT ([PAT](#pat)).  SNAT ports are ephemeral ports available for a given public IP source address.

Azure preallocates SNAT ports to the IP configuration of the NIC of each VM. When an IP configuration is added to the pool, the SNAT ports are preallocated for this IP configuration based on the backend pool size. For Classic Web Worker Roles, the allocation is per role instance.  When outbound flows are created, [PAT](#pat) dynamically consumes (up to the preallocated limit) and releases these ports when the flow closes or [idle timeouts](#ideltimeout).

The following table shows the SNAT port preallocations for tiers of back-end pool sizes:

| Pool size (VM instances) | Preallocated SNAT ports per IP configuration|
| --- | --- |
| 1 - 50 | 1024 |
| 51 - 100 | 512 |
| 101 - 200 | 256 |
| 201 - 400 | 128 |
| 401 - 800 | 64 |
| 801 - 1,000 | 32 |

It is important to remember that the number of SNAT ports available does not translate directly to number of connections. A single SNAT port can be reused for multiple unique destinations. Ports are only consumed if it is necessary to make flows unique. Refer to [how to manage this exhaustible resource](#snatexhaust) for design and mitigation guidance as well as the section describing [PAT](#pat).

Changing the size of your backend pool may impact some of your established flows. If the back-end pool size increases and transitions into the next tier, half of your preallocated SNAT ports are reclaimed during the transition to the next larger backend pool tier. Flows which are associated with a reclaimed SNAT port will timeout and must be reestablished. New connection attempts succeed immediately as long as preallocated ports are available.

If the back-end pool size decreases and transitions into a lower tier, the number of available SNAT ports increases. In this case, existing allocated SNAT ports and their respective flows are not affected.

## <a name="snatexhaust"></a>Managing SNAT (PAT) port exhaustion

[Ephemeral ports](#preallocatedports) used for [PAT](#pat) are an exhaustible resource as described in [Standalone VM without Instance Level Public IP address](#defaultsnat) and [Load-balanced VM without Instance Level Public IP address](#lb).

If you know you are initiating many outbound TCP or UDP connections to the same destination IP address and port, and observe failing outbound connections or are advised by support you are exhausting SNAT ports (preallocated [ephemeral ports](#preallocatedports) used by [PAT](#pat)), you have several general mitigation options.  Review these options and decide what is available and best for your scenario.  It is possible one or more can help manage this scenario.

If you are having trouble understanding the outbound connection behavior, you can use IP stack statistics (netstat) or it can be helpful to observe connection behaviors using packet captures.  You can perform these packet captures in the guest OS of your instance or use [Network Watcher for packet capture](../network-watcher/network-watcher-packet-capture-manage-portal.md).

### <a name="connectionreuse"></a>Modify application to reuse connections 
You can reduce demand for ephemeral ports used for SNAT by reusing connections in your application.  This is especially true for protocols like HTTP/1.1 where connection reuse is the default.  And other protocols using HTTP as their transport (i.e. REST) can benefit in turn.  Reuse is always better than individual, atomic TCP connections for each request, and results in more performant, very efficient TCP transactions.

### <a name="connection pooling"></a>Modify application to use connection pooling
You can employ a connection pooling scheme in your application, where requests are internally distributed across a fixed set of connections (each reusing where possible).  This constraints the number of ephemeral ports in use and creates a more predictable environment.  This can also increase the throughput of requests by allowing multiple simultaneous operations when a single connection is blocking on the reply of an operation.  Connection pooling may already exist within the framework you are using to develop your application or the configurations settings for your application.  You can combine this with connection reuse and your multiple requests consume a fixed, predictable number of ports to the same destination IP address and port while also benefiting from very efficient use of TCP transactions reducing latency and resource utilization.  UDP transactions can also benefit as managing the number of UDP flows can in turn avoid exhaust conditions and manage the SNAT port utilization.

### <a name="retry logic"></a>Modify application to use less aggressive retry logic
When [preallocated ephemeral ports](#preallocatedports) used for [PAT](#pat) are exhausted or application failures occur, aggressive or brute force retries without decay and backoff logic cause exhaustion to occur or persist. You can reduce demand for ephemeral ports by using a less aggressive retry logic.   Ephemeral ports have a 4-minute idle timeout (not adjustable) and if the retries are too aggressive, the exhaustion has no opportunity to clear up on its own.  Therefore, considering how and how often your application retries transactions is a critical consideration of the design.

### <a name="assignilpip"></a>Assign an Instance-Level Public IP to each VM
This changes your scenario to [Instance-Level Public IP to a VM](#ilpip).  All ephemeral ports of the Public IP used for each VM are available to the VM (as opposed to scenarios where ephemeral ports of a Public IP are shared with all the VM's associated with the respective backend pool).  There are trade-offs to consider, such as additional cost of public IP addresses and potential impact of whitelisting a large number of individual IP addresses.

>[!NOTE] 
>This option is not available for Web Worker Roles.

### <a name="idletimeout"></a>Use keepalives to reset outbound idle timeout

Outbound connections have a 4-minute idle timeout. This is not adjustable. However, you can use transport (i.e. TCP keep-alives) or application layer keepalives to refresh an idle flow and reset this idle timeout if required.

## <a name="discoveroutbound"></a>Discovering the public IP used by a given VM
There are many ways to determine the public source IP address of an outbound connection. OpenDNS provides a service that can show you the public IP address of your VM. Using the nslookup command, you can send a DNS query for the name myip.opendns.com to the OpenDNS resolver. The service returns the source IP address that was used to send the query. When you execute the following query from your VM, the response is the public IP used for that VM.

    nslookup myip.opendns.com resolver1.opendns.com

## <a name="preventoutbound"></a>Preventing outbound connectivity
Sometimes it is undesirable for a VM to be allowed to create an outbound flow or there may be a requirement to manage which destinations can be reached with outbound flows or which destinations may begin inbound flows. In this case, you use [Network Security Groups (NSG)](../virtual-network/virtual-networks-nsg.md) to manage the destinations that the VM can reach as well as which public destination can initiate inbound flows. When you apply an NSG to a load-balanced VM, you need to pay attention to the [default tags](../virtual-network/virtual-networks-nsg.md#default-tags) and [default rules](../virtual-network/virtual-networks-nsg.md#default-rules).

You must ensure that the VM can receive health probe requests from Azure Load Balancer. If an NSG blocks health probe requests from the AZURE_LOADBALANCER default tag, your VM health probe fails and the VM is marked down. Load Balancer stops sending new flows to that VM.

## Next steps

- Learn more about [Load Balancer Basic](load-balancer-overview.md).
- Learn more about [Network Security Groups](../virtual-network/virtual-networks-nsg.md).
- Learn about some of the other key [networking capabilities](../networking/networking-overview.md) in Azure.
