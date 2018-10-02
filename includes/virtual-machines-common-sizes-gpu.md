---
 title: include file
 description: include file
 services: virtual-machines-windows, virtual-machines-linux
 author: dlepow
 ms.service: multiple
 ms.topic: include
 ms.date: 09/10/2018
 ms.author: danlep;azcspmt;jonbeck
 ms.custom: include file
---

GPU optimized VM sizes are specialized virtual machines available with single or multiple NVIDIA GPUs. These sizes are designed for compute-intensive, graphics-intensive, and visualization workloads. This article provides information about the number and type of GPUs, vCPUs, data disks, and NICs. Storage throughput and network bandwidth are also included for each size in this grouping. 

* **NC, NCv2, NCv3, and ND** sizes are optimized for compute-intensive and network-intensive applications and algorithms. Some examples are CUDA- and OpenCL-based applications and simulations, AI, and Deep Learning. The NCv3-series is focused on high-performance computing workloads featuring NVIDIA’s Tesla V100 GPU.  The ND-series is focused on training and inference scenarios for deep learning. It uses the NVIDIA Tesla P40 GPU.
* **NV and NVv2** sizes are optimized and designed for remote visualization, streaming, gaming, encoding, and VDI scenarios using frameworks such as OpenGL and DirectX.  These VMs are backed by the NVIDIA Tesla M60 GPU.


## NC-series

Premium Storage:  Not Supported

Premium Storage Caching:  Not Supported

NC-series VMs are powered by the [NVIDIA Tesla K80](http://images.nvidia.com/content/pdf/kepler/Tesla-K80-BoardSpec-07317-001-v05.pdf) card. Users can crunch through data faster by leveraging CUDA for energy exploration applications, crash simulations, ray traced rendering, deep learning and more. The NC24r configuration provides a low latency, high-throughput network interface optimized for tightly coupled parallel computing workloads.


| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU | Max data disks | Max NICs |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_NC6 |6 |56 | 340 | 1 | 24 | 1 |
| Standard_NC12 |12 |112 | 680 | 2 | 48 | 2 |
| Standard_NC24 |24 |224 | 1440 | 4 | 64 | 4 |
| Standard_NC24r* |24 |224 | 1440 | 4 | 64 | 4 |

1 GPU = one-half K80 card.

*RDMA capable

## NCv2-series

Premium Storage:  Supported

Premium Storage Caching:  Supported

NCv2-series VMs are powered by [NVIDIA Tesla P100](http://images.nvidia.com/content/tesla/pdf/nvidia-tesla-p100-datasheet.pdf) GPUs. These GPUs can provide more than 2x the computational performance of the NC-series. Customers can take advantage of these updated GPUs for traditional HPC workloads such as reservoir modeling, DNA sequencing, protein analysis, Monte Carlo simulations, and others. The NC24rs v2 configuration provides a low latency, high-throughput network interface optimized for tightly coupled parallel computing workloads.

> [!IMPORTANT]
> For this size family, the vCPU (core) quota in your subscription is initially set to 0 in each region. [Request a vCPU quota increase](../articles/azure-supportability/resource-manager-core-quotas-request.md) for this family in an [available region](https://azure.microsoft.com/regions/services/).
>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU | Max data disks | Max NICs |
| --- | --- | --- | --- | --- | --- | ---  |
| Standard_NC6s_v2 |6 |112 | 736 | 1 | 12 | 4 |
| Standard_NC12s_v2 |12 |224 | 1474 | 2 | 24 | 8 |
| Standard_NC24s_v2 |24 |448 | 2948 | 4 | 32 | 8 |
| Standard_NC24rs_v2* |24 |448 | 2948 | 4 | 32 | 8 |

1 GPU = one P100 card.

*RDMA capable

## NCv3-series

Premium Storage:  Supported

Premium Storage Caching:  Supported

NCv3-series VMs are powered by [NVIDIA Tesla V100](http://www.nvidia.com/content/PDF/Volta-Datasheet.pdf) GPUs. These GPUs can provide 1.5x the computational performance of the NCv2-series. Customers can take advantage of these updated GPUs for traditional HPC workloads such as reservoir modeling, DNA sequencing, protein analysis, Monte Carlo simulations, and others. The NC24rs v3 configuration provides a low latency, high-throughput network interface optimized for tightly coupled parallel computing workloads.

> [!IMPORTANT]
> For this size family, the vCPU (core) quota in your subscription is initially set to 0 in each region. [Request a vCPU quota increase](../articles/azure-supportability/resource-manager-core-quotas-request.md) for this family in an [available region](https://azure.microsoft.com/regions/services/).
>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU | Max data disks | Max NICs |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_NC6s_v3 |6 |112 | 736 | 1 | 12 | 4 |
| Standard_NC12s_v3 |12 |224 | 1474 | 2 | 24 | 8 |
| Standard_NC24s_v3 |24 |448 | 2948 | 4 | 32 | 8 | 
| Standard_NC24rs_v3* |24 |448 | 2948 | 4 | 32 | 8 |

1 GPU = one V100 card.

*RDMA capable

## ND-series

Premium Storage:  Supported

Premium Storage Caching:  Supported

The ND-series virtual machines are a new addition to the GPU family designed for AI and Deep Learning workloads. They offer excellent performance for training and inference. ND instances are powered by [NVIDIA Tesla P40](http://images.nvidia.com/content/pdf/tesla/184427-Tesla-P40-Datasheet-NV-Final-Letter-Web.pdf) GPUs. These instances provide excellent performance for single-precision floating point operations, for AI workloads utilizing Microsoft Cognitive Toolkit, TensorFlow, Caffe, and other frameworks. The ND-series also offers a much larger GPU memory size (24 GB), enabling to fit much larger neural net models. Like the NC-series, the ND-series offers a configuration with a secondary low-latency, high-throughput network through RDMA, and InfiniBand connectivity so you can run large-scale training jobs spanning many GPUs.

> [!IMPORTANT]
> For this size family, the vCPU (core) quota per region in your subscription is initially set to 0. [Request a vCPU quota increase](../articles/azure-supportability/resource-manager-core-quotas-request.md) for this family in an [available region](https://azure.microsoft.com/regions/services/).
>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU | Max data disks | Max NICs |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_ND6s |6 |112 | 736 | 1 | 12 | 4 |
| Standard_ND12s |12 |224 | 1474 | 2 | 24 | 8 | 
| Standard_ND24s |24 |448 | 2948 | 4 | 32 | 8 |
| Standard_ND24rs* |24 |448 | 2948 | 4 | 32 | 8 |

1 GPU = one P40 card.

*RDMA capable

## NV-series

Premium Storage:  Not Supported

Premium Storage Caching:  Not Supported

The NV-series virtual machines are powered by [NVIDIA Tesla M60](http://images.nvidia.com/content/tesla/pdf/188417-Tesla-M60-DS-A4-fnl-Web.pdf) GPUs and NVIDIA GRID technology for desktop accelerated applications and virtual desktops where customers are able to visualize their data or simulations. Users are able to visualize their graphics intensive workflows on the NV instances to get superior graphics capability and additionally run single precision workloads such as encoding and rendering. 

Each GPU in NV instances comes with a GRID license. This license gives you the flexibility to use an NV instance as a virtual workstation for a single user, or 25 concurrent users can connect to the VM for a virtual application scenario.

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU | Max data disks | Max NICs | Virtual Workstations | Virtual Applications | 
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_NV6 |6 |56 |340 | 1 | 24 | 1 | 1 | 25 |
| Standard_NV12 |12 |112 |680 | 2 | 48 | 2 | 2 | 50 |
| Standard_NV24 |24 |224 |1440 | 4 | 64 | 4 | 4 | 100 |

1 GPU = one-half M60 card.

## NVv2-series (Preview)

Premium Storage:  Supported

Premium Storage Caching:  Supported

The NVv2-series virtual machines are powered by [NVIDIA Tesla M60](http://images.nvidia.com/content/tesla/pdf/188417-Tesla-M60-DS-A4-fnl-Web.pdf) GPUs and NVIDIA GRID technology with Intel Broadwell CPUs. These virtual machines are targeted for GPU accelerated graphics applications and virtual desktops where customers want to visualize their data, simulate results to view, work on CAD, or render and stream content. Additionally, these virtual machines can run single precision workloads such as encoding and rendering. NVv2 virtual machines support Premium Storage and come with twice the system memory (RAM) when compared with its predecessor NV-series.  

Each GPU in NVv2 instances comes with a GRID license. This license gives you the flexibility to use an NV instance as a virtual workstation for a single user, or 25 concurrent users can connect to the VM for a virtual application scenario.

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU | Max data disks | Max NICs | Virtual Workstations | Virtual Applications | 
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_NV6s_v2 |6 |112 |320 | 1 | 12 | 4 | 1 | 25 |
| Standard_NV12s_v2 |12 |224 |640 | 2 | 24 | 8 | 2 | 50 |
| Standard_NV24s_v2 |24 |448 |1280 | 4 | 32 | 8 | 4 | 100 |

1 GPU = one-half M60 card.

 
