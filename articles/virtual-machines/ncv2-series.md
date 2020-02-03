---
 title: NCv2-series - Azure Virtual Machines
 description: Specifications for the NCv2-series VMs.
 services: virtual-machines
 author: jonbeck7
 ms.service: virtual-machines
 ms.topic: article
 ms.date: 02/03/2020
 ms.author: lahugh
---

# NCv2-series

NCv2-series VMs are powered by [NVIDIA Tesla P100](https://www.nvidia.com/en-us/data-center/tesla-p100/) GPUs. These GPUs can provide more than 2x the computational performance of the NC-series. Customers can take advantage of these updated GPUs for traditional HPC workloads such as reservoir modeling, DNA sequencing, protein analysis, Monte Carlo simulations, and others. In addition to the GPUs, the NCv2-series VMs are also powered by Intel Xeon E5-2690 v4 (Broadwell) CPUs.

The NC24rs v2 configuration provides a low latency, high-throughput network interface optimized for tightly coupled parallel computing workloads.

Premium Storage:  Supported

Premium Storage caching:  Supported

> [!IMPORTANT]
> For this VM series, the vCPU (core) quota in your subscription is initially set to 0 in each region. [Request a vCPU quota increase](../azure-supportability/resource-manager-core-quotas-request.md) for this series in an [available region](https://azure.microsoft.com/regions/services/).
>
| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU | GPU memory: GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max NICs |
|---|---|---|---|---|---|---|---|---|
| Standard_NC6s_v2    | 6  | 112 | 736  | 1 | 16 | 12 | 20000/200 | 4 |
| Standard_NC12s_v2   | 12 | 224 | 1474 | 2 | 32 | 24 | 40000/400 | 8 |
| Standard_NC24s_v2   | 24 | 448 | 2948 | 4 | 64 | 32 | 80000/800 | 8 |
| Standard_NC24rs_v2* | 24 | 448 | 2948 | 4 | 64 | 32 | 80000/800 | 8 |

1 GPU = one P100 card.

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