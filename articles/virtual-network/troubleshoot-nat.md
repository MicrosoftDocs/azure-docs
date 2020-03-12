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
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/05/2020
ms.author: allensu
---

# Troubleshoot Azure Virtual Network NAT connectivity

This article helps administrators diagnose and resolve connectivity problems when using Virtual Network NAT.

>[!NOTE] 
>Virtual Network NAT is available as a public preview. Currently it's available in a limited set of [regions](nat-overview.md#region-availability). This preview is provided without a service level agreement and isn't recommended for production workloads. Certain features may not be supported or may have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms) for details.

## Problems

* [SNAT exhaustion](#snat-exhaustion)
* [ICMP ping is failing](#icmp-ping-is-failing)
* [Connectivity failures](#connectivity-failures)
* [IPv6 coexistence](#ipv6-coexistence)

To resolve these problems, follow the steps in the following section.

## Resolution

### SNAT exhaustion

A single [NAT gateway resource](nat-gateway-resource.md) supports from 64,000 up to 1 million concurrent flows.  Each IP address provides 64,000 SNAT ports to the available inventory. You can use up to 16 IP addresses per NAT gateway resource.  The SNAT mechanism is described [here](nat-gateway-resource.md#source-network-address-translation) in more detail.

Frequently the root cause of SNAT exhaustion is an anti-pattern for how outbound connectivity is established and managed.  Review this section carefully.

#### Steps

1. Investigate how your application is creating outbound connectivity (for example, code review or packet capture). 
2. Determine if this activity is expected behavior or whether the application is misbehaving.  Use [metrics](nat-metrics.md) in Azure Monitor to substantiate your findings. Use "Failed" category for SNAT Connections metric.
3. Evaluate if appropriate patterns are followed.
4. Evaluate if SNAT port exhaustion should be mitigated with additional IP addresses assigned to NAT gateway resource.

#### Design patterns

Always take advantage of connection reuse and connection pooling whenever possible.  These patterns will avoid resource exhaustion problems outright and result in predictable, reliable, and scalable behavior. Primitives for these patterns can be found in many development libraries and frameworks.

_**Solution:**_ Use appropriate patterns

- Consider [asynchronous polling patterns](https://docs.microsoft.com/azure/architecture/patterns/async-request-reply) for long-running operations to free up connection resources for other operations.
- Long-lived flows (for example reused TCP connections) should use TCP keepalives or application layer keepalives to avoid intermediate systems timing out.
- Graceful [retry patterns](https://docs.microsoft.com/azure/architecture/patterns/retry) should be used to avoid aggressive retries/bursts during transient failure or failure recovery.
Creating a new TCP connection for every HTTP operation (also known as "atomic connections") is an anti-pattern.  Atomic connections will prevent your application from scaling well and waste resources.  Always pipeline multiple operations into the same connection.  Your application will benefit in transaction speed and resource costs.  When your application uses transport layer encryption (for example TLS), there's a significant cost associated with the processing of new connections.  Review [Azure Cloud Design Patterns](https://docs.microsoft.com/azure/architecture/patterns/) for additional best practice patterns.

#### Possible mitigations

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

Connectivity issues with [Virtual Network NAT](nat-overview.md) can be due to several different issues:

* transient or persistent [SNAT exhaustion](#snat-exhaustion) of the NAT gateway,
* transient failures in the Azure infrastructure, 
* transient failures in the path between Azure and the public Internet destination, 
* transient or persistent failures at the public Internet destination.

Use tools like the following to validation connectivity. [ICMP ping is not supported](#icmp-ping-is-failing).

| Operating system | Generic TCP connection test | TCP application layer test | UDP |
|---|---|---|---|
| Linux | nc (generic connection test) | curl (TCP application layer test) | application specific |
| Windows | [PsPing](https://docs.microsoft.com/sysinternals/downloads/psping) | PowerShell [Invoke-WebRequest](https://docs.microsoft.com/powershell/module/microsoft.powershell.utility/invoke-webrequest) | application specific |

#### SNAT exhaustion

Review section on [SNAT exhaustion](#snat-exhaustion) in this article.

#### Azure infrastructure

Even though Azure monitors and operates its infrastructure with great care, transient failures can occur as there is no guarantee that transmissions are lossless.  Use design patterns that allow for SYN retransmissions for TCP applications. Use connection timeouts large enough to permit TCP SYN retransmission to reduce transient impacts caused by a lost SYN packet.

_**Solution:**_

* Check for [SNAT exhaustion](#snat-exhaustion).
* The configuration parameter in a TCP stack that controls the SYN retransmission behavior is called RTO ([Retransmission Time-Out](https://tools.ietf.org/html/rfc793)). The RTO value is adjustable but typically 1 second or higher by default with exponential back-off.  If your application's connection time-out is too short (for example 1 second), you may see sporadic connection timeouts.  Increase the application connection time-out.
* If you observe longer, unexpected timeouts with default application behaviors, open a support case for further troubleshooting.

We do not recommend artificially reducing the TCP connection timeout or tuning the RTO parameter.

#### public Internet transit

The probability of transient failures increases with a longer path to the destination and more intermediate systems. It is expected that transient failures can increase in frequency over [Azure infrastructure](#azure-infrastructure). 

Follow the same guidance as preceding [Azure infrastructure](#azure-infrastructure) section.

#### Internet endpoint

The preceding sections apply in addition to considerations related to the Internet endpoint your communication is established with. Other factors that can impact connectivity success are:

* traffic management on destination side, including
- API rate limiting imposed by the destination side
- Volumetric DDoS mitigations or transport layer traffic shaping
* firewall or other components at the destination 

Usually packet captures at the source as well as destination (if available) are required to determine what is taking place.

_**Solution:**_

* Check for [SNAT exhaustion](#snat-exhaustion). 
* Validate connectivity to an endpoint in the same region or elsewhere for comparison.  
* If you're creating high volume or transaction rate testing, explore if reducing the rate reduces the occurrence of failures.
* If changing rate impacts the rate of failures, check if API rate limits or other constraints on the destination side might have been reached.
* If your investigation is inconclusive, open a support case for further troubleshooting.

#### TCP Resets received

If you observe TCP Resets (TCP RST packets) received on the source VM, they can be generated by the NAT gateway on the private side for flows that are not recognized as in progress.  One possible reason is the TCP connection has idle timed out.  You can adjust the idle timeout from 4 minutes to up to 120 minutes.

TCP Resets are not generated on the public side of NAT gateway resources. If you receive TCP Resets on the destination side, they are generated by the source VM's stack and not the NAT gateway resource.

_**Solution:**_

* Review [design patterns](#design-patterns) recommendations.  
* Open a support case for further troubleshooting if necessary.

### IPv6 coexistence

[Virtual Network NAT](nat-overview.md) supports IPv4 UDP and TCP protocols and deployment on a [subnet with IPv6 prefix is not supported](nat-overview.md#limitations).

_**Solution:**_ Deploy NAT gateway on a subnet without IPv6 prefix.

You can indicate interest in additional capabilities through [Virtual Network NAT UserVoice](https://aka.ms/natuservoice).

## Next steps

* Learn about [Virtual Network NAT](nat-overview.md)
* Learn about [NAT gateway resource](nat-gateway-resource.md)
* Learn about [metrics and alerts for NAT gateway resources](nat-metrics.md).
* [Tell us what to build next for Virtual Network NAT in UserVoice](https://aka.ms/natuservoice).

