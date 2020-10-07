---
title: Troubleshoot Azure Virtual Network NAT connectivity
titleSuffix: Azure Virtual Network
description: Troubleshoot issues with Virtual Network NAT.
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumudD
ms.service: virtual-network
Customer intent: As an IT administrator, I want to troubleshoot Virtual Network NAT.
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/20/2020
ms.author: allensu
---

# Troubleshoot Azure Virtual Network NAT connectivity

This article helps administrators diagnose and resolve connectivity problems when using Virtual Network NAT.

## Problems

* [SNAT exhaustion](#snat-exhaustion)
* [ICMP ping is failing](#icmp-ping-is-failing)
* [Connectivity failures](#connectivity-failures)
* [IPv6 coexistence](#ipv6-coexistence)
* [Connection doesn't originate from NAT gateway IP(s)](#connection-doesnt-originate-from-nat-gateway-ips)

To resolve these problems, follow the steps in the following section.

## Resolution

### SNAT exhaustion

A single [NAT gateway resource](nat-gateway-resource.md) supports from 64,000 up to 1 million concurrent flows.  Each IP address provides 64,000 SNAT ports to the available inventory. You can use up to 16 IP addresses per NAT gateway resource.  The SNAT mechanism is described [here](nat-gateway-resource.md#source-network-address-translation) in more detail.

Frequently the root cause of SNAT exhaustion is an anti-pattern for how outbound connectivity is established, managed, or configurable timers changed from their default values.  Review this section carefully.

#### Steps

1. Check if you have modified the default idle timeout to a value higher than 4 minutes.
2. Investigate how your application is creating outbound connectivity (for example, code review or packet capture). 
3. Determine if this activity is expected behavior or whether the application is misbehaving.  Use [metrics](nat-metrics.md) in Azure Monitor to substantiate your findings. Use "Failed" category for SNAT Connections metric.
4. Evaluate if appropriate patterns are followed.
5. Evaluate if SNAT port exhaustion should be mitigated with additional IP addresses assigned to NAT gateway resource.

#### Design patterns

Always take advantage of connection reuse and connection pooling whenever possible.  These patterns will avoid resource exhaustion problems and result in predictable behavior. Primitives for these patterns can be found in many development libraries and frameworks.

_**Solution:**_ Use appropriate patterns and best practices

- NAT gateway resources have a default TCP idle timeout of 4 minutes.  If this setting is changed to a higher value, NAT will hold on to flows longer and can cause [unnecessary pressure on SNAT port inventory](nat-gateway-resource.md#timers).
- Atomic requests (one request per connection) are a poor design choice. Such anti-pattern limits scale, reduces performance, and decreases reliability. Instead, reuse HTTP/S connections to reduce the numbers of connections and associated SNAT ports. The application scale will increase and performance improve due to reduced handshakes, overhead, and cryptographic operation cost  when using TLS.
- DNS can introduce many individual flows at volume when the client is not caching the DNS resolvers result. Use caching.
- UDP flows (for example DNS lookups) allocate SNAT ports for the duration of the idle timeout. The longer the idle timeout, the higher the pressure on SNAT ports. Use short idle timeout (for example 4 minutes).
- Use connection pools to shape your connection volume.
- Never silently abandon a TCP flow and rely on TCP timers to clean up flow. If you don't let TCP explicitly close the connection, state remains allocated at intermediate systems and endpoints and makes SNAT ports unavailable for other connections. This pattern can trigger application failures and SNAT exhaustion. 
- Don't change OS-level TCP close related timer values without expert knowledge of impact. While the TCP stack will recover, your application performance can be negatively impacted when the endpoints of a connection have mismatched expectations. The desire to change timers is usually a sign of an underlying design problem. Review following recommendations.

SNAT exhaustion can also be amplified with other anti-patterns in the underlying application. Review these additional patterns and best practices to improve the scale and reliability of your service.

- Explore impact of reducing [TCP idle timeout](nat-gateway-resource.md#timers) to lower values including default idle timeout of 4 minutes to free up SNAT port inventory earlier.
- Consider [asynchronous polling patterns](https://docs.microsoft.com/azure/architecture/patterns/async-request-reply) for long-running operations to free up connection resources for other operations.
- Long-lived flows (for example reused TCP connections) should use TCP keepalives or application layer keepalives to avoid intermediate systems timing out. Increasing the idle timeout is a last resort and may not resolve the root cause. A long timeout can cause low rate failures when timeout expires and introduce delay and unnecessary failures.
- Graceful [retry patterns](https://docs.microsoft.com/azure/architecture/patterns/retry) should be used to avoid aggressive retries/bursts during transient failure or failure recovery.
Creating a new TCP connection for every HTTP operation (also known as "atomic connections") is an anti-pattern.  Atomic connections will prevent your application from scaling well and waste resources.  Always pipeline multiple operations into the same connection.  Your application will benefit in transaction speed and resource costs.  When your application uses transport layer encryption (for example TLS), there's a significant cost associated with the processing of new connections.  Review [Azure Cloud Design Patterns](https://docs.microsoft.com/azure/architecture/patterns/) for additional best practice patterns.

#### Additional possible mitigations

_**Solution:**_ Scale outbound connectivity as follows:

| Scenario | Evidence |Mitigation |
|---|---|---|
| You're experiencing contention for SNAT ports and SNAT port exhaustion during periods of high usage. | "Failed" category for SNAT Connections [metric](nat-metrics.md) in Azure Monitor shows transient or persistent failures over time and high connection volume.  | Determine if you can add additional public IP address resources or public IP prefix resources. This addition will allow for up to 16 IP addresses in total to your NAT gateway. This addition will provide more inventory for available SNAT ports (64,000 per IP address) and allow you to scale your scenario further.|
| You've already given 16 IP addresses and still are experiencing SNAT port exhaustion. | Attempt to add additional IP address fails. Total number of IP addresses from public IP address resources or public IP prefix resources exceeds a total of 16. | Distribute your application environment across multiple subnets and provide a NAT gateway resource for each subnet.  Reevaluate your design pattern(s) to optimize based on preceding [guidance](#design-patterns). |

>[!NOTE]
>It is important to understand why SNAT exhaustion occurs. Make sure you are using the right patterns for scalable and reliable scenarios.  Adding more SNAT ports to a scenario without understanding the cause of the demand should be a last resort. If you do not understand why your scenario is applying pressure on SNAT port inventory, adding more SNAT ports to the inventory by adding more IP addresses will only delay the same exhaustion failure as your application scales.  You may be masking other inefficiencies and anti-patterns.

### ICMP ping is failing

[Virtual Network NAT](nat-overview.md) supports IPv4 UDP and TCP protocols. ICMP isn't supported and expected to fail.  

_**Solution:**_ Instead, use TCP connection tests (for example "TCP ping") and UDP-specific application layer tests to validate end to end connectivity.

The following table can be used a starting point for which tools to use to start tests.

| Operating system | Generic TCP connection test | TCP application layer test | UDP |
|---|---|---|---|
| Linux | nc (generic connection test) | curl (TCP application layer test) | application specific |
| Windows | [PsPing](https://docs.microsoft.com/sysinternals/downloads/psping) | PowerShell [Invoke-WebRequest](https://docs.microsoft.com/powershell/module/microsoft.powershell.utility/invoke-webrequest) | application specific |

### Connectivity failures

Connectivity issues with [Virtual Network NAT](nat-overview.md) can be caused by several different issues:

* permanent failures due to configuration mistakes.
* transient or persistent [SNAT exhaustion](#snat-exhaustion) of the NAT gateway,
* transient failures in the Azure infrastructure, 
* transient failures in the path between Azure and the public Internet destination, 
* transient or persistent failures at the public Internet destination.

Use tools like the following to validation connectivity. [ICMP ping isn't supported](#icmp-ping-is-failing).

| Operating system | Generic TCP connection test | TCP application layer test | UDP |
|---|---|---|---|
| Linux | nc (generic connection test) | curl (TCP application layer test) | application specific |
| Windows | [PsPing](https://docs.microsoft.com/sysinternals/downloads/psping) | PowerShell [Invoke-WebRequest](https://docs.microsoft.com/powershell/module/microsoft.powershell.utility/invoke-webrequest) | application specific |

#### Configuration

Check your configuration:
1. Does the NAT gateway resource have at least one public IP resource or one public IP prefix resource? You must at least have one IP address associated with the NAT gateway for it to be able to provide outbound connectivity.
2. Is the virtual network's subnet configured to use the NAT gateway?
3. Are you using UDR (user-defined route) and are you overriding the destination?  NAT gateway resources become the default route (0/0) on configured subnets.

#### SNAT exhaustion

Review section on [SNAT exhaustion](#snat-exhaustion) in this article.

#### Azure infrastructure

Azure monitors and operates its infrastructure with great care. Transient failures can occur, there's no guarantee that transmissions are lossless.  Use design patterns that allow for SYN retransmissions for TCP applications. Use connection timeouts large enough to permit TCP SYN retransmission to reduce transient impacts caused by a lost SYN packet.

_**Solution:**_

* Check for [SNAT exhaustion](#snat-exhaustion).
* The configuration parameter in a TCP stack that controls the SYN retransmission behavior is called RTO ([Retransmission Time-Out](https://tools.ietf.org/html/rfc793)). The RTO value is adjustable but typically 1 second or higher by default with exponential back-off.  If your application's connection time-out is too short (for example 1 second), you may see sporadic connection timeouts.  Increase the application connection time-out.
* If you observe longer, unexpected timeouts with default application behaviors, open a support case for further troubleshooting.

We don't recommend artificially reducing the TCP connection timeout or tuning the RTO parameter.

#### Public Internet transit

The chances of transient failures increases with a longer path to the destination and more intermediate systems. It's expected that transient failures can increase in frequency over [Azure infrastructure](#azure-infrastructure). 

Follow the same guidance as preceding [Azure infrastructure](#azure-infrastructure) section.

#### Internet endpoint

The previous sections apply, along with the Internet endpoint that communication is established with. Other factors that can impact connectivity success are:

* traffic management on destination side, including
- API rate limiting imposed by the destination side
- Volumetric DDoS mitigations or transport layer traffic shaping
* firewall or other components at the destination 

Usually packet captures at the source and the destination (if available) are required to determine what is taking place.

_**Solution:**_

* Check for [SNAT exhaustion](#snat-exhaustion). 
* Validate connectivity to an endpoint in the same region or elsewhere for comparison.  
* If you're creating high volume or transaction rate testing, explore if reducing the rate reduces the occurrence of failures.
* If changing rate impacts the rate of failures, check if API rate limits or other constraints on the destination side might have been reached.
* If your investigation is inconclusive, open a support case for further troubleshooting.

#### TCP Resets received

The NAT gateway generates TCP resets on the source VM for traffic that isn't recognized as in progress.

One possible reason is the TCP connection has idle timed out.  You can adjust the idle timeout from 4 minutes to up to 120 minutes.

TCP Resets aren't generated on the public side of NAT gateway resources. TCP resets on the destination side are generated by the source VM, not the NAT gateway resource.

_**Solution:**_

* Review [design patterns](#design-patterns) recommendations.  
* Open a support case for further troubleshooting if necessary.

### IPv6 coexistence

[Virtual Network NAT](nat-overview.md) supports IPv4 UDP and TCP protocols and deployment on a [subnet with an IPv6 prefix isn't supported](nat-overview.md#limitations).

_**Solution:**_ Deploy NAT gateway on a subnet without IPv6 prefix.

You can indicate interest in additional capabilities through [Virtual Network NAT UserVoice](https://aka.ms/natuservoice).

### Connection doesn't originate from NAT gateway IP(s)

You configure NAT gateway, IP address(es) to use, and which subnet should use a NAT gateway resource. However, connections from virtual machine instances that existed before the NAT gateway was deployed don't use the IP address(es).  They appear to be using IP address(es) not used with the NAT gateway resource.

_**Solution:**_

[Virtual Network NAT](nat-overview.md) replaces the outbound connectivity for the subnet it is configured on. When transitioning from default SNAT or load balancer outbound SNAT to using NAT gateways, new connections will immediately begin using the IP address(es) associated with the NAT gateway resource.  However, if a virtual machine still has an established connection during the switch to NAT gateway resource, the connection will continue using the old SNAT IP address that was assigned when the connection was established.  Make sure you are really establishing a new connection rather than reusing a connection that already existed because the OS or the browser was caching the connections in a connection pool.  For example, when using _curl_ in PowerShell, make sure to specify the _-DisableKeepalive_ parameter to force a new connection.  If you're using a browser, connections may also be pooled.

It's not necessary to reboot a virtual machine configuring a subnet for a NAT gateway resource.  However, if a virtual machine is rebooted, the connection state is flushed.  When the connection state has been flushed, all connections will begin using the NAT gateway resource's IP address(es).  However, this is a side effect of the virtual machine being rebooted and not an indicator that a reboot is required.

If you are still having trouble, open a support case for further troubleshooting.

## Next steps

* Learn about [Virtual Network NAT](nat-overview.md)
* Learn about [NAT gateway resource](nat-gateway-resource.md)
* Learn about [metrics and alerts for NAT gateway resources](nat-metrics.md).
* [Tell us what to build next for Virtual Network NAT in UserVoice](https://aka.ms/natuservoice).

