---
 title: DC-series - Azure Virtual Machines
 description: Specifications for the DC-series VMs.
 services: virtual-machines
 author: susaxen
 ms.service: virtual-machines
 ms.topic: article
 ms.date: 02/20/2020
 ms.author: lahugh
---

# Preview: DCsv2-series


The DCsv2-series can help protect the confidentiality and integrity of your data and code while it’s processed in the public cloud. These machines are backed by the latest generation of Intel XEON E-2288G Processor with SGX technology. With the Intel Turbo Boost Technology these machines can go up to 5.0GHz. DCsv2 series instances enable customers to build secure enclave-based applications to protect their code and data while it’s in use.

Example use cases include confidential multiparty data sharing, fraud detection, anti-money laundering, blockchain, confidential usage analytics, intelligence analysis and confidential machine learning.

Premium Storage: Supported*

Premium Storage caching: Supported*

Live Migration: Not Supported

Memory Preserving Updates: Not Supported

*Except for Standard_DC8_v2



| Size             | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Expected network bandwidth (MBps) |
|------------------|------|-------------|------------------------|----------------|-------------------------------------------------------------------------|-------------------------------------------|----------------------------------------------|
| Standard_DC1s_v2 | 1    | 4           | 50                     | 1              | 2000/16 (21)                                                            | 1600/24                                   | 2                                            |
| Standard_DC2s_v2 | 2    | 8           | 100                    | 2              | 4000/32 (43)                                                            | 3200/48                                   | 2                                            |
| Standard_DC4s_v2 | 4    | 16          | 200                    | 4              | 8000/64 (86)                                                            | 6400/96                                   | 2                                            |
| Standard_DC8_v2  | 8   | 32          | 400                    | 8              | 16000/128 (172)                                                         | 12800/192                                 | 2                                            |

- DCsv2-series VMs are [generation 2 VMs](./linux/generation-2.md#creating-a-generation-2-vm) and only support `Gen2` images.
- Currently available in UK South and Canada Central only.
- Previous generation of Confidential Compute VMs: [DC Series](sizes-previous-gen.md)
- Create DCsv2 VMs using Azure Portal [Create VM - Portal](./linux/quick-create-portal.md)



## Other sizes

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
