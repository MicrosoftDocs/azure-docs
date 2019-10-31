---
title: Azure networking | Microsoft Docs
description: Learn about networking services in Azure and their capabilities.
services: networking
documentationcenter: na
author: KumudD
manager: mtillman
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/04/2019
ms.author: kumud

---


# Azure Network Round Trip Latency Statistics

Azure continuously monitors the latency (speed) of core areas of its network using internal monitoring tools as well as measurements collected by [ThousandEyes](https://thousandeyes.com), a third-party synthetic monitoring service.

## How are the measurements collected?

Measurements are collected from ThousandEyes agents hosted in Azure cloud regions world-wide, which continuously send network probes between themselves, in 1-minute intervals. Monthly latency statistics are derived from averaging collected samples for the month.

## October 2019 latency figures

For the 30 days ending on **October 30, 2019**, monthly latency figures (aggregated by region) are as follows:

- **36ms or less** for inter-region round trips within **North America**.
- **46ms or less** for inter-region round trips within **Europe**.
- **82ms or less** for inter-region round trips within **Asia**.

The following inter-region latency measurements are powered by [ThousandEyes](https://thousandeyes.com). The measurement unit in the table below is in milliseconds(ms)

![Azure inter-region latency statistics](media/azure-network-latency/azure-inter-region-latency.png)


<a href="https://www.thousandeyes.com"><img src="https://te-logo.s3-us-west-2.amazonaws.com/ThousandEyes-Main-Logo-150.png"></a>


## Next steps
- Learn how to monitor your Azure services using [Azure monitor](https://docs.microsoft.com/azure/azure-monitor/).