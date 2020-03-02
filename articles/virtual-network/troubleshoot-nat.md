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

>[!NOTE] 
>Virtual Network NAT is available as public preview at this time. Currently it's only available in a limited set of [regions](nat-overview.md#region-availability). This preview is provided without a service level agreement and isn't recommended for production workloads. Certain features may not be supported or may have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms) for details.

## Problems

- [SNAT exhaustion](#snat-exhaustion).
- [ICMP ping is failing](#icmp-ping-is-failing).

To resolve these problems, follow the steps in the following section.

## Resolution

### SNAT exhaustion

[Virtual Network NAT](nat-overview.md) supports up to 1 million concurrent flows.  The mechanism is described [here](nat-gateway-resource.md#source-network-address-translation) in more detail.

Investigate whether your application is behaving properly and is using outbound connections in a scalable fashion.  Always use connection reuse and connection pooling whenever possible to avoid resource exhaustion problems outright.  

Creating a new TCP connection for every HTTP operation is an anti-pattern and will impact your scale and reliability.  Always pipeline multiple operations into the same connection.

If you are using the appropriate pattern, you can scale outbound connectivity as follows:

| Scenario | Action |
|---|---|
| You are experiencing contention for SNAT ports and SNAT port exhaustion during periods of high usage. | Check if you can add additional public IP address resources or public IP prefix resources for up to 16 IP addresses in total to your NAT gateway. This will provide more inventory for available SNAT ports (64,000 per IP address) and allow you to scale your scenario further.|
| You have already allocated 16 IP addresses and still are experiencing SNAT port exhaustion. | Distribute your application environment across multiple subnets and provide a NAT gateway resource for each subnet. |

>[!NOTE]
>It is important to understand why SNAT exhaustion occurs.  Make sure you are using the right patterns for scalable and reliable scenarios.  Adding more SNAT ports to a scenario without understanding the cause of the demand should be a last resort. If you do not understand why your scenario is applying pressure on SNAT port inventory, adding more SNAT ports to the inventory by adding more IP addresses will only delay the same exhaustion failure as your application scales.  You may be masking other inefficiencies and anti-patterns.

### ICMP ping is failing

[Virtual Network NAT](nat-overview.md) supports IPv4 UDP and TCP protocols. ICMP is not supported and expected to fail.  Instead, use TCP connection tests (for example "TCP ping") and UDP specific application layer tests to validate end to end connectivity.

The following table can be used a starting point for which tools to use to initiate tests.

| Operating system | Generic TCP connection test | TCP application layer test | UDP |
|---|---|---|---|
| Linux | nc (generic connection test) | curl (TCP application layer test) | application specific |
| Windows | [PsPing](https://docs.microsoft.com/sysinternals/downloads/psping) | PowerShell [Invoke-WebRequest](https://docs.microsoft.com/powershell/module/microsoft.powershell.utility/invoke-webrequest) | application specific |

## Next steps

- Learn about [Virtual Network NAT](nat-overview.md)
- Learn about [NAT gateway resource](nat-gateway-resource.md)
