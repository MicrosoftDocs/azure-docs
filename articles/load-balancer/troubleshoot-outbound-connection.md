---
title: Troubleshoot outbound connections in Azure Load Balancer
description: Resolutions for common problems with outbound connectivity through the Azure Load Balancer. 
services: load-balancer
author: erichrt
ms.service: load-balancer
ms.topic: troubleshooting
ms.date: 05/7/2020
ms.author: errobin
---
# <a name="obconnecttsg"></a> Troubleshooting outbound connections failures

This article is intended to provide resolutions for common problems that can occur with outbound connections from an Azure Load Balancer. Most problems with outbound connectivity that customers experience are due to SNAT port exhaustion and connection timeouts leading to dropped packets. This article provides steps for mitigating each of these issues.

## <a name="snatexhaust"></a> Managing SNAT (PAT) port exhaustion
[Ephemeral ports](load-balancer-outbound-connections.md) used for [PAT](load-balancer-outbound-connections.md) are an exhaustible resource, as described in [Standalone VM without a Public IP address](load-balancer-outbound-connections.md) and [Load-balanced VM without a Public IP address](load-balancer-outbound-connections.md). You can monitor your usage of ephemeral ports and compare with your current allocation to determine the risk of or to confirm SNAT exhaustion using [this](./load-balancer-standard-diagnostics.md#how-do-i-check-my-snat-port-usage-and-allocation) guide.

If you know that you're initiating many outbound TCP or UDP connections to the same destination IP address and port, and you observe failing outbound connections or are advised by support that you're exhausting SNAT ports (preallocated [ephemeral ports](load-balancer-outbound-connections.md#preallocatedports) used by [PAT](load-balancer-outbound-connections.md)), you have several general mitigation options. Review these options and decide what is available and best for your scenario. It's possible that one or more can help manage this scenario.

If you are having trouble understanding the outbound connection behavior, you can use IP stack statistics (netstat). Or it can be helpful to observe connection behaviors by using packet captures. You can perform these packet captures in the guest OS of your instance or use [Network Watcher for packet capture](../network-watcher/network-watcher-packet-capture-manage-portal.md). 

## <a name ="manualsnat"></a>Manually allocate SNAT ports to maximize SNAT ports per VM
As defined in [preallocated ports](load-balancer-outbound-connections.md#preallocatedports), the load balancer will automatically allocate ports based on the number of VMs in the backend. By default, this is done conservatively to ensure scalability. If you know the maximum number of VMs you will have in the backend, you can manually allocate SNAT ports in each outbound rule. For example, if you know you will have a maximum of 10 VMs you can allocate 6,400 SNAT ports per VM rather than the default 1,024. 

## <a name="connectionreuse"></a>Modify the application to reuse connections 
You can reduce demand for ephemeral ports that are used for SNAT by reusing connections in your application. Connection reuse is especially relevant for protocols like HTTP/1.1, where connection reuse is the default. And other protocols that use HTTP as their transport (for example, REST) can benefit in turn. 

Reuse is always better than individual, atomic TCP connections for each request. Reuse results in more performant, very efficient TCP transactions.

## <a name="connection pooling"></a>Modify the application to use connection pooling
You can employ a connection pooling scheme in your application, where requests are internally distributed across a fixed set of connections (each reusing where possible). This scheme constrains the number of ephemeral ports in use and creates a more predictable environment. This scheme can also increase the throughput of requests by allowing multiple simultaneous operations when a single connection is blocking on the reply of an operation.  

Connection pooling might already exist within the framework that you're using to develop your application or the configuration settings for your application. You can combine connection pooling with connection reuse. Your multiple requests then consume a fixed, predictable number of ports to the same destination IP address and port. The requests also benefit from efficient use of TCP transactions reducing latency and resource utilization. UDP transactions can also benefit, because managing the number of UDP flows can in turn avoid exhaust conditions and manage the SNAT port utilization.

## <a name="retry logic"></a>Modify the application to use less aggressive retry logic
When [preallocated ephemeral ports](load-balancer-outbound-connections.md#preallocatedports) used for [PAT](load-balancer-outbound-connections.md) are exhausted or application failures occur, aggressive or brute force retries without decay and backoff logic cause exhaustion to occur or persist. You can reduce demand for ephemeral ports by using a less aggressive retry logic. 

Ephemeral ports have a 4-minute idle timeout (not adjustable). If the retries are too aggressive, the exhaustion has no opportunity to clear up on its own. Therefore, considering how--and how often--your application retries transactions is a critical part of the design.

## <a name="assignilpip"></a>Assign a Public IP to each VM
Assigning a Public IP address changes your scenario to [Public IP to a VM](load-balancer-outbound-connections.md). All ephemeral ports of the public IP that are used for each VM are available to the VM. (As opposed to scenarios where ephemeral ports of a public IP are shared with all the VMs associated with the respective backend pool.) There are trade-offs to consider, such as the additional cost of public IP addresses and the potential impact of filtering a large number of individual IP addresses.

>[!NOTE] 
>This option is not available for web worker roles.

## <a name="multifesnat"></a>Use multiple frontends
When using public Standard Load Balancer, you assign [multiple frontend IP addresses for outbound connections](load-balancer-outbound-connections.md) and [multiply the number of SNAT ports available](load-balancer-outbound-connections.md#preallocatedports).  Create a frontend IP configuration, rule, and backend pool to trigger the programming of SNAT to the public IP of the frontend.  The rule does not need to function and a health probe does not need to succeed.  If you do use multiple frontends for inbound as well (rather than just for outbound), you should use custom health probes well to ensure reliability.

>[!NOTE]
>In most cases, exhaustion of SNAT ports is a sign of bad design.  Make sure you understand why you are exhausting ports before using more frontends to add SNAT ports.  You may be masking a problem which can lead to failure later.

## <a name="scaleout"></a>Scale out
[Preallocated ports](load-balancer-outbound-connections.md#preallocatedports) are assigned based on the backend pool size and grouped into tiers to minimize disruption when some of the ports have to be reallocated to accommodate the next larger backend pool size tier.  You may have an option to increase the SNAT port utilization for a given frontend by scaling your backend pool to the maximum size for a given tier.  Keeping in mind the default port allocation is required for the application to scale out efficiently without risk SNAT exhaustion.

For example, two virtual machines in the backend pool would have 1024 SNAT ports available per IP configuration, allowing a total of 2048 SNAT ports for the deployment.  If the deployment were to be increased to 50 virtual machines, even though the number of preallocated ports remains constant per virtual machine, a total of 51,200 (50 x 1024) SNAT ports can be used by the deployment.  If you wish to scale out your deployment, check the number of [preallocated ports](load-balancer-outbound-connections.md#preallocatedports) per tier to make sure you shape your scale-out to the maximum for the respective tier.  In the preceding example, if you had chosen to scale out to 51 instead of 50 instances, you would progress to the next tier and end up with fewer SNAT ports per VM as well as in total.

If you scale out to the next larger backend pool size tier, there is potential for some of your outbound connections to time out if allocated ports have to be reallocated.  If you are only using some of your SNAT ports, scaling out across the next larger backend pool size is inconsequential.  Half the existing ports will be reallocated each time you move to the next backend pool tier.  If you don't want this to take place, you need to shape your deployment to the tier size.  Or make sure your application can detect and retry as necessary.  TCP keepalives can assist in detect when SNAT ports no longer function due to being reallocated.

## <a name="idletimeout"></a>Use keepalives to reset the outbound idle timeout
Outbound connections have a 4-minute idle timeout. This timeout is adjustable via [Outbound rules](outbound-rules.md). You can also use transport (for example, TCP keepalives) or application-layer keepalives to refresh an idle flow and reset this idle timeout if necessary.  

When using TCP keepalives, it is sufficient to enable them on one side of the connection. For example, it is sufficient to enable them on the server side only to reset the idle timer of the flow and it is not necessary for both sides to initiated TCP keepalives.  Similar concepts exist for application layer, including database client-server configurations.  Check the server side for what options exist for application-specific keepalives.

## Next Steps
We are always looking to improve the experience of our customers. If you are experiencing issues with outbound connectivity that are not listed or resolved by this article, submit feedback through GitHub via the bottom of this page and we will address your feedback as soon as possible.
