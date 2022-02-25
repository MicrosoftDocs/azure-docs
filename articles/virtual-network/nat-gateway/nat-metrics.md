---
title: Metrics and alerts for Azure Virtual Network NAT
titleSuffix: Azure Virtual Network
description: Understand Azure Monitor metrics and alerts available for Virtual Network NAT.
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumudD
ms.service: virtual-network
ms.subservice: nat
# Customer intent: As an IT administrator, I want to understand available Azure Monitor metrics and alerts for Virtual Network NAT.
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/04/2020
ms.author: allensu
---

# Azure Virtual Network NAT metrics

Azure Virtual Network NAT gateway resources provide multi-dimensional metrics. You can use these metrics to observe the operation and for [troubleshooting](troubleshoot-nat.md).  Alerts can be configured for critical issues such as SNAT exhaustion.

:::image type="content" source="./media/nat-overview/flow-direction1.png" alt-text="Diagram depicts a NAT gateway resource that consumes all IP addresses for a public IP prefix and directs traffic to and from two subnets of VMs and a virtual machine scale set.":::

*Figure: Virtual Network NAT for outbound to Internet*

## Metrics

NAT gateway resources provide the following multi-dimensional metrics in Azure Monitor:

| Metric | Description | Recommended aggregation | Dimensions |
|---|---|---|---|
| Bytes | Bytes processed inbound and outbound | Sum | Direction (In; Out), Protocol (6 TCP; 17 UDP) |
| Packets | Packets processed inbound and outbound | Sum | Direction (In; Out), Protocol (6 TCP; 17 UDP) |
| Dropped packets | Packets dropped by the NAT gateway | Sum | / |
| SNAT Connection Count | Number of SNAT connections / State transitions per interval of time | Sum | Connection State, Protocol (6 TCP; 17 UDP) |
| Total SNAT connection count | Current active SNAT connections (~ SNAT ports currently in use by NAT gateway) | Sum | Protocol (6 TCP; 17 UDP) |
| Datapath availability (Preview) | Availability of the data path of the NAT gateway. Used to determine whether the NAT gateway endpoints are available for outbound traffic flow. | Avg | Availability (0, 100) |

## Alerts

Alerts for metrics can be configured in Azure Monitor for each of the preceding [metrics](#metrics).

## Limitations

Resource health isn't supported.

## Next steps

* Learn about [Virtual Network NAT](nat-overview.md)
* Learn about [NAT gateway resource](nat-gateway-resource.md)
* Learn about [Azure Monitor](../../azure-monitor/overview.md)
* Learn about [troubleshooting NAT gateway resources](troubleshoot-nat.md).
* [Tell us what to build next for Virtual Network NAT in UserVoice](https://aka.ms/natuservoice).
