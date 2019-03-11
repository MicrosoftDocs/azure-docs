---
title: Outbound connections in Azure (Classic)
titlesuffix: Azure Load Balancer
description: This article explains how Azure enables cloud services to communicate with public internet services.
services: load-balancer
documentationcenter: na
author: KumudD
ms.service: load-balancer
ms.custom: seodec18
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/13/2018
ms.author: kumud
---

# Outbound connections (Classic)

Azure provides outbound connectivity for customer deployments through several different mechanisms. This article describes what the scenarios are, when they apply, how they work, and how to manage them.

>[!NOTE]
>This article covers Classic deployments only.  Review [Outbound connections](load-balancer-outbound-connections.md) for all Resource Manager deployment scenarios in Azure.

A deployment in Azure can communicate with endpoints outside Azure in the public IP address space. When an instance initiates an outbound flow to a destination in the public IP address space, Azure dynamically maps the private IP address to a public IP address. After this mapping is created, return traffic for this outbound originated flow can also reach the private IP address where the flow originated.

Azure uses source network address translation (SNAT) to perform this function. When multiple private IP addresses are masquerading behind a single public IP address, Azure uses [port address translation (PAT)](#pat) to masquerade private IP addresses. Ephemeral ports are used for PAT and are [preallocated](#preallocatedports) based on pool size.

There are multiple [outbound scenarios](#scenarios). You can combine these scenarios as needed. Review them carefully to understand the capabilities, constraints, and patterns as they apply to your deployment model and application scenario. Review guidance for [managing these scenarios](#snatexhaust).

## <a name="scenarios"></a>Scenario overview

Azure provides three different methods to achieve outbound connectivity Classic deployments.  Not all Classic deployments have all three scenarios available to them:

| Scenario | Method | IP Protocols | Description | Web Worker Role | IaaS | 
| --- | --- | --- | --- | --- | --- |
| [1. VM with an Instance Level Public IP address](#ilpip) | SNAT, port masquerading not used | TCP, UDP, ICMP, ESP | Azure uses the public IP assigned Virtual Machine. The instance has all ephemeral ports available. | No | Yes |
| [2. public load-balanced endpoint](#publiclbendpoint) | SNAT with port masquerading (PAT) to the public endpoint | TCP, UDP | Azure shares the public IP address public endpoint with multiple private endpoints. Azure uses ephemeral ports of the public endpoint for PAT. | Yes | Yes |
| [3. Standalone VM](#defaultsnat) | SNAT with port masquerading (PAT) | TCP, UDP | Azure automatically designates a public IP address for SNAT, shares this public IP address with the entire deployment, and uses ephemeral ports of the public endpoint IP address for PAT. This is a fallback scenario for the preceding scenarios. We don't recommend it if you need visibility and control. | Yes | Yes |

This is a subset of outbound connection functionality available for Resource Manager deployments in Azure.  

Different deployments in Classic have different functionality:

| Classic deployment | Functionality available | 
| --- | --- |
| Virtual Machine | scenario [1](#ilpip), [2](#publiclbendpoint), or [3](#defaultsnat) |
| Web Worker Role | only scenario [2](#publiclbendpoint), [3](#defaultsnat) | 

[Mitigation strategies](#snatexhaust) also have the same differences.

The algorithm used for preallocating ephemeral ports for PAT for classic deployments is the same as for Azure Resource Manager resource deployments.

### <a name="ilpip"></a>Scenario 1: VM with an Instance Level Public IP address

In this scenario, the VM has an Instance Level Public IP (ILPIP) assigned to it. As far as outbound connections are concerned, it doesn't matter whether the VM has  load balanced endpoint or not. This scenario takes precedence over the others. When an ILPIP is used, the VM uses the ILPIP for all outbound flows.  

A public IP assigned to a VM is a 1:1 relationship (rather than 1:many) and implemented as a stateless 1:1 NAT.  Port masquerading (PAT) is not used, and the VM has all ephemeral ports available for use.

If your application initiates many outbound flows and you experience SNAT port exhaustion, consider assigning an [ILPIP to mitigate SNAT constraints](#assignilpip). Review [Managing SNAT exhaustion](#snatexhaust) in its entirety.

### <a name="publiclbendpoint"></a>Scenario 2: Public load-balanced endpoint

In this scenario, the VM or Web Worker Role is associated with a public IP address through the load-balanced endpoint. The VM does not have a public IP address assigned to it. 

When the load-balanced VM creates an outbound flow, Azure translates the private source IP address of the outbound flow to the public IP address of the public load-balanced endpoint. Azure uses SNAT to perform this function. Azure also uses [PAT](#pat) to masquerade multiple private IP addresses behind a public IP address. 

Ephemeral ports of the load balancer's public IP address frontend are used to distinguish individual flows originated by the VM. SNAT dynamically uses [preallocated ephemeral ports](#preallocatedports) when outbound flows are created. In this context, the ephemeral ports used for SNAT are called SNAT ports.

SNAT ports are preallocated as described in the [Understanding SNAT and PAT](#snat) section. They're a finite resource that can be exhausted. It's important to understand how they are [consumed](#pat). To understand how to design for this consumption and mitigate as necessary, review [Managing SNAT exhaustion](#snatexhaust).

When [multiple public load-balanced endpoints](load-balancer-multivip.md) exist, any of these public IP addresses are a candidate for outbound flows, and one is selected at random.  

### <a name="defaultsnat"></a>Scenario 3: No public IP address associated

In this scenario, the VM or Web Worker ROle is not part of a public load-balanced endpoint.  And in the case of VM, it does not have an ILPIP address assigned to it. When the VM creates an outbound flow, Azure translates the private source IP address of the outbound flow to a public source IP address. The public IP address used for this outbound flow is not configurable and does not count against the subscription's public IP resource limit.  Azure automatically allocates this address.

Azure uses SNAT with port masquerading ([PAT](#pat)) to perform this function. This scenario is similar to scenario 2, except there is no control over the IP address used. This is a fallback scenario for when scenarios 1 and 2 do not exist. We don't recommend this scenario if you want control over the outbound address. If outbound connections are a critical part of your application, you should chose another scenario.

SNAT ports are preallocated as described in the [Understanding SNAT and PAT](#snat) section.  The number of VMs or Web Worker Roles sharing the public IP address determines the number of preallocated ephemeral ports.   It's important to understand how they are [consumed](#pat). To understand how to design for this consumption and mitigate as necessary, review [Managing SNAT exhaustion](#snatexhaust).

## <a name="snat"></a>Understanding SNAT and PAT

### <a name="pat"></a>Port masquerading SNAT (PAT)

When a deployment makes an outbound connection, each outbound connection source is rewritten. The source is rewritten from the private IP address space to the public IP associated with the deployment (based on scenarios described above). In the public IP address space, the 5-tuple of the flow (source IP address, source port, IP transport protocol, destination IP address, destination port) must be unique.  

Ephemeral ports (SNAT ports) are used to achieve this after rewriting the private source IP address, because multiple flows originate from a single public IP address. 

One SNAT port is consumed per flow to a single destination IP address, port, and protocol. For multiple flows to the same destination IP address, port, and protocol, each flow consumes a single SNAT port. This ensures that the flows are unique when they originate from the same public IP address and go to the same destination IP address, port, and protocol. 

Multiple flows, each to a different destination IP address, port, and protocol, share a single SNAT port. The destination IP address, port, and protocol make flows unique without the need for additional source ports to distinguish flows in the public IP address space.

When SNAT port resources are exhausted, outbound flows fail until existing flows release SNAT ports. Load Balancer reclaims SNAT ports when the flow closes and uses a [4-minute idle timeout](#idletimeout) for reclaiming SNAT ports from idle flows.

For patterns to mitigate conditions that commonly lead to SNAT port exhaustion, review the [Managing SNAT](#snatexhaust) section.

### <a name="preallocatedports"></a>Ephemeral port preallocation for port masquerading SNAT (PAT)

Azure uses an algorithm to determine the number of preallocated SNAT ports available based on the size of the backend pool when using port masquerading SNAT ([PAT](#pat)). SNAT ports are ephemeral ports available for a particular public IP source address.

Azure preallocates SNAT ports when an instance is deployed based on how many VM or Web Worker Role instances share a given public IP address.  When outbound flows are created, [PAT](#pat) dynamically consumes (up to the preallocated limit) and releases these ports when the flow closes or idle timeouts happen.

The following table shows the SNAT port preallocations for tiers of backend pool sizes:

| Instances | Preallocated SNAT ports per instance |
| --- | --- |
| 1-50 | 1,024 |
| 51-100 | 512 |
| 101-200 | 256 |
| 201-400 | 128 |

Remember that the number of SNAT ports available does not translate directly to number of flows. A single SNAT port can be reused for multiple unique destinations. Ports are consumed only if it's necessary to make flows unique. For design and mitigation guidance, refer to the section about [how to manage this exhaustible resource](#snatexhaust) and the section that describes [PAT](#pat).

Changing the size of your deployment might affect some of your established flows. If the backend pool size increases and transitions into the next tier, half of your preallocated SNAT ports are reclaimed during the transition to the next larger backend pool tier. Flows that are associated with a reclaimed SNAT port will time out and must be reestablished. If a new flow is attempted, the flow will succeed immediately as long as preallocated ports are available.

If the deployment size decreases and transitions into a lower tier, the number of available SNAT ports increases. In this case, existing allocated SNAT ports and their respective flows are not affected.

If a cloud service is redeployed or changed, the infrastructure may temporarily report the backend pool to be up to twice as large as actual and Azure will in turn preallocate less SNAT ports per instance than expected.  This can temporarily increase the probability of SNAT port exhaustion. Eventually the pool size will transition to actual size and Azure will automatically increase preallocated SNAT ports to the expected number as per the table above.  This behavior is by design and is not configurable.

SNAT ports allocations are IP transport protocol specific (TCP and UDP are maintained separately) and are released under the following conditions:

### TCP SNAT port release

- If both server/client sends FIN/ACK, SNAT port will be released after 240 seconds.
- If a RST is seen, SNAT port will be released after 15 seconds.
- idle timeout has been reached

### UDP SNAT port release

- idle timeout has been reached

## <a name="problemsolving"></a> Problem solving 

This section is intended to help mitigate SNAT exhaustion and other scenarios which can occur with outbound connections in Azure.

### <a name="snatexhaust"></a> Managing SNAT (PAT) port exhaustion
[Ephemeral ports](#preallocatedports) used for [PAT](#pat) are an exhaustible resource, as described in [no public IP associated](#defaultsnat) and [public load-balanced endpoint](#publiclbendpoint).

If you know that you're initiating many outbound TCP or UDP connections to the same destination IP address and port, and you observe failing outbound connections or are advised by support that you're exhausting SNAT ports (preallocated [ephemeral ports](#preallocatedports) used by [PAT](#pat)), you have several general mitigation options. Review these options and decide what is available and best for your scenario. It's possible that one or more can help manage this scenario.

If you are having trouble understanding the outbound connection behavior, you can use IP stack statistics (netstat). Or it can be helpful to observe connection behaviors by using packet captures.

#### <a name="connectionreuse"></a>Modify the application to reuse connections 
You can reduce demand for ephemeral ports that are used for SNAT by reusing connections in your application. This is especially true for protocols like HTTP/1.1, where connection reuse is the default. And other protocols that use HTTP as their transport (for example, REST) can benefit in turn. 

Reuse is always better than individual, atomic TCP connections for each request. Reuse results in more performant, very efficient TCP transactions.

#### <a name="connection pooling"></a>Modify the application to use connection pooling
You can employ a connection pooling scheme in your application, where requests are internally distributed across a fixed set of connections (each reusing where possible). This scheme constrains the number of ephemeral ports in use and creates a more predictable environment. This scheme can also increase the throughput of requests by allowing multiple simultaneous operations when a single connection is blocking on the reply of an operation.  

Connection pooling might already exist within the framework that you're using to develop your application or the configuration settings for your application. You can combine connection pooling with connection reuse. Your multiple requests then consume a fixed, predictable number of ports to the same destination IP address and port. The requests also benefit from efficient use of TCP transactions reducing latency and resource utilization. UDP transactions can also benefit, because managing the number of UDP flows can in turn avoid exhaust conditions and manage the SNAT port utilization.

#### <a name="retry logic"></a>Modify the application to use less aggressive retry logic
When [preallocated ephemeral ports](#preallocatedports) used for [PAT](#pat) are exhausted or application failures occur, aggressive or brute force retries without decay and backoff logic cause exhaustion to occur or persist. You can reduce demand for ephemeral ports by using a less aggressive retry logic. 

Ephemeral ports have a 4-minute idle timeout (not adjustable). If the retries are too aggressive, the exhaustion has no opportunity to clear up on its own. Therefore, considering how--and how often--your application retries transactions is a critical part of the design.

#### <a name="assignilpip"></a>Assign an Instance Level Public IP to each VM
Assigning an ILPIP changes your scenario to [Instance Level Public IP to a VM](#ilpip). All ephemeral ports of the public IP that are used for each VM are available to the VM. (As opposed to scenarios where ephemeral ports of a public IP are shared with all the VMs associated with the respective deployment.) There are trade-offs to consider, such as the potential impact of whitelisting a large number of individual IP addresses.

>[!NOTE] 
>This option is not available for web worker roles.

### <a name="idletimeout"></a>Use keepalives to reset the outbound idle timeout

Outbound connections have a 4-minute idle timeout. This timeout is not adjustable. However, you can use transport (for example, TCP keepalives) or application-layer keepalives to refresh an idle flow and reset this idle timeout if necessary.  Check with the supplier of any packaged software on whether this is supported or how to enable it.  Generally only one side needs to generate keepalives to reset the idle timeout. 

## <a name="discoveroutbound"></a>Discovering the public IP that a VM uses
There are many ways to determine the public source IP address of an outbound connection. OpenDNS provides a service that can show you the public IP address of your VM. 

By using the nslookup command, you can send a DNS query for the name myip.opendns.com to the OpenDNS resolver. The service returns the source IP address that was used to send the query. When you run the following query from your VM, the response is the public IP used for that VM:

    nslookup myip.opendns.com resolver1.opendns.com


## Next steps

- Learn more about [Load Balancer](load-balancer-overview.md) used in Resource Manager deployments.
- Learn mode about [outbound connection](load-balancer-outbound-connections.md) scenarios available in Resource Manager deployments.
