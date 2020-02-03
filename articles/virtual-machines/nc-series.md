---
 title: NC-series - Azure Virtual Machines
 description: Specifications for the NC-series VMs.
 services: virtual-machines
 author: jonbeck7
 ms.service: virtual-machines
 ms.topic: article
 ms.date: 02/03/2020
 ms.author: lahugh
---

# NC-series

NC-series VMs are powered by the [NVIDIA Tesla K80](https://www.nvidia.com/content/dam/en-zz/Solutions/Data-Center/tesla-product-literature/Tesla-K80-BoardSpec-07317-001-v05.pdf) card and the Intel Xeon E5-2690 v3 (Haswell) processor. Users can crunch through data faster by leveraging CUDA for energy exploration applications, crash simulations, ray traced rendering, deep learning, and more. The NC24r configuration provides a low latency, high-throughput network interface optimized for tightly coupled parallel computing workloads.

Premium Storage:  Not Supported

Premium Storage caching:  Not Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU | GPU memory: GiB | Max data disks | Max NICs |
|---|---|---|---|---|---|---|---|
| Standard_NC6    | 6  | 56  | 340  | 1 | 12 | 24 | 1 |
| Standard_NC12   | 12 | 112 | 680  | 2 | 24 | 48 | 2 |
| Standard_NC24   | 24 | 224 | 1440 | 4 | 48 | 64 | 4 |
| Standard_NC24r* | 24 | 224 | 1440 | 4 | 48 | 64 | 4 |

1 GPU = one-half K80 card.

*RDMA capable
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