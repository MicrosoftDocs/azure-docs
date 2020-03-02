---
title: Troubleshoot Azure Virtual Network NAT connectivity problems
titleSuffix: Azure Virtual Network NAT troubleshooting
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
ms.date: 03/02/2020
ms.author: allensu
---

# Troubleshoot Azure Virtual Network NAT connectivity problems

This article helps administrators diagnose and resolve connectivity problems when using Virtual Network NAT.

## Problems

- [SNAT exhaustion](#snat-exhaustion).
- [ICMP ping is failing](#icmp-ping-is-failing).

To resolve these problems, follow the steps in the following section.

## Resolution

### SNAT exhaustion

[Virtual Network NAT](nat-overview.md) supports up to 1 million concurrent flows.  The mechanism is described [here](nat-gateway-resource.md#source-network-address-translation) in more detail.

First, investigate whether your application is behaving properly and is using outbound connections in a scalable fashion.  You should always use connection reuse and connection pooling whenever possible to avoid resource exhaustion problems outright.  If you aren't optimizing outbound connections, e.g. every outbound connection is an atomic operation rather than pipelining multiple operations into the same connection, you're using an anti-pattern that will impact your scale and reliability.

If you have already optimized your application and are reusing connections and pooling connections, you can scale outbound connectivity as follows:

If you are experiencing contention for SNAT ports and SNAT port exhaustion during periods of high usage, you can add additional public IP address resources or public IP prefix resources for up to 16 IP addresses in total to your NAT gateway.

If you have already allocated 16 IP addresses and still are experiencing SNAT port exhaustion, you need to distribute your deployment across multiple subnets and provide a NAT gateway resource for each subnet.


### ICMP ping is failing

[Virtual Network NAT](nat-overview.md) supports IPv4 UDP and TCP protocols. ICMP is not supported and expected to fail.  Instead, use TCP connection tests (e.g. "TCP ping") and UDP specific application layer tests to validate end to end connectivity.

Depending on whether you use Linux or Windows operating systems, the tool of choice may be slightly different.  The following table has a couple of examples:

| Operating system | Generic TCP connection test | Application layer test |
|---|---|---|
| Linux | nc (generic connection test) | curl (TCP application layer test) |
| Windows | [PsPing](https://docs.microsoft.com/sysinternals/downloads/psping) | Invoke-WebRequest |

## Next steps

- Learn about [Virtual Network NAT](nat-overview.md)
- Learn about [NAT gateway resource](nat-gateway-resource.md)
