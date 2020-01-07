---
title: Azure network round-trip latency statistics | Microsoft Docs
description: Learn about round-trip latency statistics between Azure regions.
services: networking
author: nayak-mahesh
ms.service: virtual-network
ms.topic: article
ms.date: 12/04/2019
ms.author: mnayak

---

# Azure network round-trip latency statistics

Azure continuously monitors the latency (speed) of core areas of its network using internal monitoring tools as well as measurements collected by [ThousandEyes](https://thousandeyes.com), a third-party synthetic monitoring service.

## How are the measurements collected?

The latency measurements are collected from ThousandEyes agents, hosted in Azure cloud regions worldwide, that continuously send network probes between themselves in 1-minute intervals. The monthly latency statistics are derived from averaging the collected samples for the month.

## November 2019 latency figures

**November update:** Added 3 regions.

* Norway East
* Norway West
* Australia

The monthly average round-trip times between Azure regions for past 30 days (ending on November 30, 2019) are shown below. The following measurements are powered by [ThousandEyes](https://thousandeyes.com).

![Azure inter-region latency statistics](media/azure-network-latency/latency-nov-2019.png)

## Next steps

Learn about [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).
