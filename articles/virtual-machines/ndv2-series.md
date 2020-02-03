---
 title: NDv2-series - Azure Virtual Machines
 description: Specifications for the NDv2-series VMs.
 services: virtual-machines
 author: jonbeck7
 ms.service: virtual-machines
 ms.topic: article
 ms.date: 02/03/2020
 ms.author: lahugh
---

# NDv2-series (Preview)

NDv2-series virtual machine is a new addition to the GPU family designed for the needs of the HPC, AI, and machine learning workloads. It’s powered by 8 NVIDIA Tesla V100 NVLINK interconnected GPUs and 40 Intel Xeon Platinum 8168 (Skylake) cores and 672 GiB of system memory. NDv2 instance provides excellent FP32 and FP64 performance for HPC and AI workloads utilizing CUDA, TensorFlow, Pytorch, Caffe, and other frameworks.

[Sign-up and get access to these machines during preview](https://aka.ms/ndv2signup).

Premium Storage:  Supported

Premium Storage caching:  Supported

Infiniband: Not supported

NDv2-series virtual machine is a new addition to the GPU family designed for the needs of the HPC, AI, and machine learning workloads. It’s powered by 8 NVIDIA Tesla V100 NVLINK interconnected GPUs and 40 Intel Xeon Platinum 8168 (Skylake) cores and 672 GiB of system memory. NDv2 instance provides excellent FP32 and FP64 performance for HPC and AI workloads utilizing Cuda, TensorFlow, Pytorch, Caffe, and other frameworks.

[Sign-up and get access to these machines during preview](https://aka.ms/ndv2signup).
<br>

| Size | vCPU | GPU | Memory | NICs (Max) | Temp Storage (SSD) GiB | Max. data disks | Max uncached disk throughput: IOPS/MBps | Max network bandwidth |
|---|---|---|---|---|---|---|---|---|
| Standard_ND40s_v2 | 40 | 8 V100 (NVLink) | 672 GiB | 8 | 2948 | 32 | 80000/800 | 24000 Mbps |

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