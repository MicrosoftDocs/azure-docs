---
title: Metrics and alerts for Azure Virtual Network NAT 
titleSuffix: Azure Monitor metrics and alerts for Azure Virtual Network NAT
description: Understand Azure Monitor metrics and alerts available for Virtual Network NAT.
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumudD
ms.service: virtual-network
Customer intent: As an IT administrator, I want to understand available Azure Monitor metrics and alerts for Virtual Network NAT.
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/03/2020
ms.author: allensu
---

# Azure Virtual Network NAT metrics

Azure Virtual Network NAT gateway resources provide multi-dimensional metrics. You can use these metrics to observe the operation and for [troubleshooting](nat-metrics.md).  Alerts can be configured for critical issues such as SNAT exhaustion.

<p align="center">
  <img src="media/nat-overview/flow-direction1.svg" width="256" title="Virtual Network NAT for outbound to Internet">
</p>

*Figure: Virtual Network NAT for outbound to Internet*

>[!NOTE] 
>Virtual Network NAT is available as public preview at this time. Currently it's only available in a limited set of [regions](nat-overview.md#region-availability). This preview is provided without a service level agreement and isn't recommended for production workloads. Certain features may not be supported or may have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms) for details.

## Available metrics

NAT gateway resources provide the following metrics in Azure Monitor:

| Metric | Description | Recommended Aggregation | Dimensions |
|---|---|---|---|
| Bytes | Provides a count of bytes processed inbound and outbound | Sum | |
| Packets | Provides a count of packets processed inbound and outbound | Sum | |
| | | | |
| | | | |
| | | | |

## Limitations

Resource Health is not supported.

## Next steps

- Learn about [Virtual Network NAT](nat-overview.md)
- Learn about [NAT gateway resource](nat-gateway-resource.md)
- Learn about [Azure Monitor](../azure-monitor/overview.md)
