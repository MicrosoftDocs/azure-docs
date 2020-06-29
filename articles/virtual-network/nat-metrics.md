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
Customer intent: As an IT administrator, I want to understand available Azure Monitor metrics and alerts for Virtual Network NAT.
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/04/2020
ms.author: allensu
---

# Azure Virtual Network NAT metrics

Azure Virtual Network NAT gateway resources provide multi-dimensional metrics. You can use these metrics to observe the operation and for [troubleshooting](troubleshoot-nat.md).  Alerts can be configured for critical issues such as SNAT exhaustion.

<p align="center">
  <img src="media/nat-overview/flow-direction1.svg" width="256" title="Virtual Network NAT for outbound to Internet">
</p>

*Figure: Virtual Network NAT for outbound to Internet*

## Metrics

NAT gateway resources provide the following multi-dimensional metrics in Azure Monitor:

| Metric | Description | Recommended Aggregation | Dimensions |
|---|---|---|---|
| Bytes | Bytes processed inbound and outbound | Sum | Direction (In; Out), Protocol (6 TCP; 17 UDP) |
| Packets | Packets processed inbound and outbound | Sum | Direction (In; Out), Protocol (6 TCP; 17 UDP) |
| Dropped packets | Packets dropped by the NAT gateway | Sum | / |
| SNAT Connection Count | State transitions per interval | Sum | Connection State, Protocol (6 TCP; 17 UDP) |
| Total SNAT connection count | Current active SNAT connections (~ SNAT ports in use) | Sum | Protocol (6 TCP; 17 UDP) |


## Alerts

Alerts for metrics can be configured in Azure Monitor for each of the preceding [metrics](#metrics).

## Limitations

Resource Health isn't supported.

## Next steps

* Learn about [Virtual Network NAT](nat-overview.md)
* Learn about [NAT gateway resource](nat-gateway-resource.md)
* Learn about [Azure Monitor](../azure-monitor/overview.md)
* Learn about [troubleshooting NAT gateway resources](troubleshoot-nat.md).
* [Tell us what to build next for Virtual Network NAT in UserVoice](https://aka.ms/natuservoice).


