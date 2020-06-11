---
title: DC-series - Azure Virtual Machines
description: Specifications for the DC-series VMs.
author: susaxen
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: article
ms.date: 02/20/2020
ms.author: jushiman
---

# DCsv2-series


The DCsv2-series can help protect the confidentiality and integrity of your data and code while it’s processed in the public cloud. These machines are backed by the latest generation of Intel XEON E-2288G Processor with SGX technology. With the Intel Turbo Boost Technology these machines can go up to 5.0GHz. DCsv2 series instances enable customers to build secure enclave-based applications to protect their code and data while it’s in use.

Example use cases include: confidential multiparty data sharing, fraud detection, anti-money laundering, blockchain, confidential usage analytics, intelligence analysis and confidential machine learning.

Premium Storage: Supported*

Premium Storage caching: Supported*

Live Migration: Not Supported

Memory Preserving Updates: Not Supported

*Except for Standard_DC8_v2



| Size             | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS / MBps (cache size in GiB) | Max NICs / Expected network bandwidth (MBps) | EPC Memory (MiB) |
|------------------|------|-------------|------------------------|----------------|-------------------------------------------------------------------------|----------------------------------------------|---------------------|
| Standard_DC1s_v2 | 1    | 4           | 50                     | 1              | 2000/16                                                                                               | 2   | 28                                      |
| Standard_DC2s_v2 | 2    | 8           | 100                    | 2              | 4000/32                                                                                               | 2  | 56                                          |
| Standard_DC4s_v2 | 4    | 16          | 200                    | 4              | 8000/64                                                                                               | 2  | 112                                          |
| Standard_DC8_v2  | 8   | 32          | 400                    | 8              | 16000/128                                                                                         | 2   | 168                                         |

- DCsv2-series VMs are [generation 2 VMs](./linux/generation-2.md#creating-a-generation-2-vm) and only support `Gen2` images.
- Currently available in UK South, Canada Central, and US East only.
- Previous generation of Confidential Compute VMs: [DC series](sizes-previous-gen.md#preview-dc-series)
- Create DCsv2 VMs using the [Azure portal](./linux/quick-create-portal.md) or [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-azure-compute.acc-virtual-machine-v2?tab=overview)



## Other sizes

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
