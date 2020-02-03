---
 title: DC-series - Azure Virtual Machines
 description: Specifications for the DC-series VMs.
 services: virtual-machines
 author: jonbeck7
 ms.service: virtual-machines
 ms.topic: article
 ms.date: 02/03/2020
 ms.author: lahugh
---

# DC-series

The [DC-series](#dc-series) is a family of virtual machines in Azure that helps protect the confidentiality and integrity of your data and code while it’s processed in the public cloud. These machines are backed by the 3.7GHz Intel XEON E-2176G Processor with SGX technology. With the Intel Turbo Boost Technology these machines can go up to 4.7GHz. DC series instances enable customers to build secure enclave-based applications to protect their code and data while it’s in use.

Premium Storage: Supported

Premium Storage caching: Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Expected network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_DC2s | 2 | 8  | 100 | 2 | 4000 / 32 (43) | 3200 /48 | 2 / 1500 |
| Standard_DC4s | 4 | 16 | 200 | 4 | 8000 / 64 (86) | 6400 /96 | 2 / 3000 |

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.