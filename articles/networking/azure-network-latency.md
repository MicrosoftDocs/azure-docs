---
title: Azure network round-trip latency statistics | Microsoft Docs
description: Learn about round-trip latency statistics between Azure regions.
services: networking
documentationcenter: na
author: nayak-mahesh
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/04/2019
ms.author: mnayak

---


# Azure network round-trip latency statistics

Azure continuously monitors the latency (speed) of core areas of its network using internal monitoring tools as well as measurements collected by [ThousandEyes](https://thousandeyes.com), a third-party synthetic monitoring service.

## How are the measurements collected?

The latency measurements are collected from ThousandEyes agents hosted in Azure cloud regions world-wide, which continuously send network probes between themselves, in 1-minute intervals. The monthly latency statistics are derived from averaging the collected samples for the month.

## November 2019 latency figures
November result includes three more regions - (1) Norway East (2) Norway West (3) Australia Central2

For the 30 days ending on November 30, 2019, the monthly average of round trip times between Azure regions are shown below (RTT in milliseconds).

The following inter-region latency measurements are powered by [ThousandEyes](https://thousandeyes.com).

![Azure inter-region latency statistics](media/azure-network-latency/azure-inter-region-latency.png)


## Next steps
- Learn about [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).
