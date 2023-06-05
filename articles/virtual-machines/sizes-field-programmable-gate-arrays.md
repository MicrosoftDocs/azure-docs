---
title: Azure virtual machine sizes for field-programmable gate arrays (FPGA)
description: Lists the different FPGA optimized sizes available for virtual machines in Azure. Lists information about the number of vCPUs, data disks and NICs as well as storage throughput and network bandwidth for sizes in this series.
author: vikancha-MSFT
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 02/27/2023
ms.author: vikancha
---

# FPGA optimized virtual machine sizes

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

FPGA optimized VM sizes are specialized virtual machines available with single or multiple FPGAs. These sizes are designed for compute-intensive workloads. This article provides information about the number and type of FPGAs, vCPUs, data disks, and NICs. Storage throughput and network bandwidth are also included for each size in this grouping.

- The [NP-series](np-series.md) sizes are optimized for workloads including machine learning inference, video transcoding, and database search & analytics. The NP-series are powered by Xilinx U250 accelerators.


## Deployment considerations

- For availability of N-series VMs, see [Products available by region](https://azure.microsoft.com/regions/services/).

- N-series VMs can only be deployed in the Resource Manager deployment model.

- If you want to deploy more than a few N-series VMs, consider a pay-as-you-go subscription or other purchase options. If you're using an [Azure free account](https://azure.microsoft.com/free/), you can use only a limited number of Azure compute cores.

- You might need to increase the cores quota (per region) in your Azure subscription, and increase the separate quota for NP cores. To request a quota increase, [open an online customer support request](../azure-portal/supportability/how-to-create-azure-support-request.md) at no charge. Default limits may vary depending on your subscription category.

## Other sizes

- [General purpose](sizes-general.md)
- [Compute optimized](sizes-compute.md)
- [GPU accelerated compute](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
