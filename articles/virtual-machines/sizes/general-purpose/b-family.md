---
title: B family VM size series
description: Overview of the 'B' family and sub families of virtual machine sizes
author: mattmcinnes
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 04/16/2024
ms.author: mattmcinnes
---

# B family general purpose VM size series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The 'B' family of VM size series are one of Azure's general purpose VM instances. While traditional Azure virtual machines provide fixed CPU performance, B-series virtual machines are the only VM type that use credits for CPU performance provisioning. B-series VMs utilize a CPU credit model to track how much CPU is consumed - the virtual machine accumulates CPU credits when a workload is operating below the base CPU performance threshold and, uses credits when running above the base CPU performance threshold until all of its credits are consumed. Upon consuming all the CPU credits, a B-series virtual machine is throttled back to its base CPU performance until it accumulates the credits to CPU burst again.

Read more about the [B-series CPU credit model](../../b-series-cpu-credit-model/b-series-cpu-credit-model).

## Workloads and use cases

B-series VMs are ideal for workloads that do not need the full performance of the CPU continuously, like web servers, proof of concepts, small databases and development build environments. These workloads typically have burstable performance requirements.

## Series in family

### B-series V1
[!INCLUDE [bv1-series-summary](./includes/bv1-series-summary.md)]

[View the full B-series V1 page](../../sizes-b-series-burstable.md).

[!INCLUDE [bv1-series-specs](./includes/bv1-series-specs.md)]

### Bsv2-series
[!INCLUDE [bsv2-series-summary](./includes/bsv2-series-summary.md)]

[View the full Bsv2-series page](../../bsv2-series.md).

[!INCLUDE [bsv2-series-specs](./includes/bsv2-series-specs.md)]


### Basv2-series
[!INCLUDE [basv2-series-summary](./includes/basv2-series-summary.md)]

[View the full Basv2-series page](../../basv2-series.md).

[!INCLUDE [basv2-series-specs](./includes/basv2-series-specs.md)]


### Bpsv2-series
[!INCLUDE [bpsv2-series-summary](./includes/bpsv2-series-summary.md)]

[View the full Bpsv2-series page](../../bpsv2-series.md).

[!INCLUDE [bpsv2-series-specs](./includes/bpsv2-series-specs.md)]


[!INCLUDE [sizes-footer](../includes/sizes-footer.md)]