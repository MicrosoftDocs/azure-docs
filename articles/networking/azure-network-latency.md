---
title: Azure network round-trip latency statistics
description: Learn about round-trip latency statistics between Azure regions.
services: networking
author: mbender-ms
ms.service: virtual-network
ms.topic: article
ms.date: 06/30/2022
ms.author: mbender
---

# Azure network round-trip latency statistics

Azure continuously monitors the latency (speed) of core areas of its network using internal monitoring tools as well as measurements collected by [ThousandEyes](https://thousandeyes.com), a third-party synthetic monitoring service.

## How are the measurements collected?

The latency measurements are collected from ThousandEyes agents, hosted in Azure cloud regions worldwide, that continuously send network probes between themselves in 1-minute intervals. The monthly latency statistics are derived from averaging the collected samples for the month.

## June 2022 round-trip latency figures

The monthly Percentile P50 round trip times between Azure regions for the past 30 days (ending on June 30, 2022) are shown below. The following measurements are powered by  [ThousandEyes](https://thousandeyes.com).

:::image type="content" source="media/azure-network-latency/azure-network-latency-thmb-july-2022.png" alt-text="Chart of the inter-region latency statistics as of June 30, 2022." lightbox="media/azure-network-latency/azure-network-latency-july-2022.png":::

> [!IMPORTANT]
> Monthly latency numbers across Azure regions do not change regulary. Given this, you can expect an update of this table every 6 to 9 months outside of the addition of new regions. When new regions come online, we will update this document as soon as data is available.

## Next steps

Learn about [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).


