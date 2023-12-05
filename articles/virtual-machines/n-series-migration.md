---
title: Migration Guide for GPU Compute Workloads in Azure
description: NC, ND, NCv2-series migration guide.
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 02/27/2023
---
 
# Migration Guide for GPU Compute Workloads in Azure

As more powerful GPUs become available in the marketplace and in Microsoft Azure datacenters, we recommend re-assessing the performance of your workloads and considering migrating to newer GPUs.

For the same reason, as well as to maintain a high-quality and reliable service offering, Azure periodically retires the hardware that powers older VM sizes. The first group of GPU products to be retired in Azure are the original NC, NC v2 and ND-series VMs, powered by NVIDIA Tesla K80, P100, and P40 datacenter GPU accelerators respectively. These products will be retired on August 31st 2023, and the oldest VMs in this series launched in 2016.

Since then, GPUs have made incredible strides alongside the entire deep learning and HPC industry, typically exceeding a doubling in performance between generations. Since the launch of NVIDIA K80, P40, and P100 GPUs, Azure has shipped multiple newer generations and categories of VM products geared at GPU-accelerated compute and AI, based around NVIDIA’s T4, V100, and A100 GPUs, and differentiated by optional features such as InfiniBand-based interconnect fabrics. These are all options we encourage customers to explore as migration paths.

In most cases, the dramatic increase in performance offered by newer generations of GPUs lowers overall TCO by decreasing the duration of job, for burstable jobs- or reducing the quantity of overall GPU-enabled VMs required to cover a fixed-size demand for compute resources, even though costs per GPU-hour may vary. In addition to these benefits, customers may improve Time-to-Solution via higher-performing VMs, and improve the health and supportability of their solution by adopting newer software, CUDA runtime, and driver versions.

## Migration vs. Optimization

Azure recognizes that customers have a multitude of requirements that may dictate the selection of a specific GPU VM product, including GPU architectural considerations, interconnects, TCO, Time to Solution, and regional availability based on compliance locality or latency requirements- and some of these even change over time.

At the same time, GPU acceleration is a new and rapidly evolving area.

Thus, there is no true one-size fits-all guidance for this product area, and a migration is a perfect time to re-evaluate potentially dramatic changes to a workload- like moving from a clustered deployment model to a single large 8-GPU VM or vice versa, leveraging reduced precision datatypes, adopting features like Multi-Instance GPU, and much more.

These sorts of considerations- when made the context of already dramatic per-generation GPU performance increases, where a feature such as the addition of TensorCores can increase performance by an order of magnitude, are extremely workload-specific.

Combining migration with application re-architecture can yield immense value and improvement in cost and time-to-solution.

However, these sorts of improvements are beyond the scope of this document, which aims to focus on direct equivalency classes for generalized workloads that may be run by customers today, to identify the most similar VM options in both price *and* performance per GPU to existing VM families undergoing retirement.

Thus, this document assumes that the user may not have any insight or control over workload-specific properties like the number of required VM instances, GPUs, interconnects, and more.

## Recommended Upgrade Paths

### NC-Series VMs featuring NVIDIA K80 GPUs

The [NC (v1)-Series](./nc-series.md) VMs are Azure’s oldest GPU-accelerated compute VM type, powered by 1 to 4 NVIDIA Tesla K80 datacenter GPU accelerators paired with Intel Xeon E5-2690 v3 (Haswell) processors. Once a flagship VM type for demanding AI, ML, and HPC applications, they remained a popular choice late into the product lifecycle (particularly via NC-series promotional pricing) for users who valued having a very low absolute cost per GPU-hour over GPUs with higher throughput-per-dollar.

Today, given the relatively low compute performance of the aging NVIDIA K80 GPU platform, in comparison to VM series featuring newer GPUs, a popular use case for the NC-series is real-time inference and analytics workloads, where an accelerated VM must be available in a steady state to serve request from applications as they arrive. In these cases the volume or batch size of requests may be insufficient to benefit from more performant GPUs. NC VMs are also popular for developers and students learning about, developing for, or experimenting with GPU acceleration, who need an inexpensive cloud-based CUDA deployment target upon which to iterate that doesn’t need to perform to production levels.

In general, NC-Series customers should consider moving directly across from NC sizes to [NC T4 v3](./nct4-v3-series.md) sizes, Azure’s new GPU-accelerated platform for light workloads powered by NVIDIA Tesla T4 GPUs.

| Current VM Size | Target VM Size | Difference in Specification | 
|---|---|---|
Standard_NC6 <br> Standard_NC6_Promo | Standard_NC4as_T4_v3 <br>or<br>Standard_NC8as_T4 | CPU: Intel Haswell vs AMD Rome<br>GPU count: 1 (same)<br>GPU generation: NVIDIA Keppler vs. Turing (+2 generations, ~2x FP32 FLOPs)<br>GPU memory (GiB per GPU): 16 (+4)<br>vCPU: 4 (-2) or 8 (+2)<br>Memory GiB: 16 (-40) or 56 (same)<br>Temp Storage (SSD) GiB: 180 (-160) or 360 (+20)<br>Max data disks: 8 (-4) or 16 (+4)<br>Accelerated Networking: Yes (+)<br>Premium Storage: Yes (+)| 
| Standard_NC12<br>Standard_NC12_Promo | Standard_NC16as_T4_v3 | CPU: Intel Haswell vs AMD Rome<br>GPU count: 1 (-1)<br>GPU generation: NVIDIA Keppler vs. Turing (+2 generations, ~2x FP32 FLOPs)<br>GPU memory (GiB per GPU): 16 (+4)<br>vCPU: 16 (+4)<br>Memory GiB: 110 (-2)<br>Temp Storage (SSD) GiB: 360 (-320)<br>Max data disks: 48 (+16)<br>Accelerated Networking: Yes (+)<br>Premium Storage: Yes (+) | 
| Standard_NC24<br>Standard_NC24_Promo | Standard_NC64as_T4_v3* | CPU: Intel Haswell vs AMD Rome<br>GPU count: 4 (same)<br>GPU generation: NVIDIA Keppler vs. Turing (+2 generations, ~2x FP32 FLOPs)<br>GPU memory (GiB per GPU): 16 (+4)<br>vCPU: 64 (+40)<br>Memory GiB: 440 (+216)<br>Temp Storage (SSD) GiB: 2880 (+1440)<br>Max data disks: 32 (-32)<br>Accelerated Networking: Yes (+)<br>Premium Storage: Yes (+) | 
| Standard_NC24r<br>Standard_NC24r_Promo | Standard_NC64as_T4_v3* | CPU: Intel Haswell vs AMD Rome<br>GPU count: 4 (same)<br>GPU generation: NVIDIA Keppler vs. Turing (+2 generations, ~2x FP32 FLOPs)<br>GPU memory (GiB per GPU): 16 (+4)<br>vCPU: 64 (+40)<br>Memory GiB: 440 (+216)<br>Temp Storage (SSD) GiB: 2880 (+1440)<br>Max data disks: 32 (-32)<br>Accelerated Networking: Yes (+)<br>Premium Storage: Yes (+) <br>InfiniBand interconnect: No  |  

### NC v2-Series VMs featuring NVIDIA Tesla P100 GPUs

The NC v2-series virtual machines are a flagship platform originally designed for AI and Deep Learning workloads. They offered excellent performance for Deep Learning training, with per-GPU performance roughly 2x that of the original NC-Series and are powered by NVIDIA Tesla P100 GPUs and Intel Xeon E5-2690 v4 (Broadwell) CPUs. Like the NC and ND -Series, the NC v2-Series offers a configuration with a secondary low-latency, high-throughput network through RDMA, and InfiniBand connectivity so you can run large-scale training jobs spanning many GPUs.

In general, NCv2-Series customers should consider moving directly across to [NC A100 v4](./nc-a100-v4-series.md) sizes, Azure’s new GPU-accelerated platform  powered by NVIDIA Ampere A100 PCIe GPUs.   

| Current VM Size | Target VM Size | Difference in Specification | 
|---|---|---|
| Standard_NC6s_v2 | Standard_NC24ads_A100_v4 | CPU: Intel Broadwell vs AMD Milan <br>GPU count: 1 (same)<br>GPU generation: NVIDIA Pascal vs. Ampere (+2 generation)<br>GPU memory (GiB per GPU): 80 (+64)<br>vCPU: 24 (+18)<br>Memory GiB: 220 (+108)<br>Temp Storage (SSD) GiB: 1123 (+387)<br>Max data disks: 12 (same)<br>Accelerated Networking: Yes (+)<br>Premium Storage: Yes (+) | 
| Standard_NC12s_v2 | Standard_NC48ads_A100_v4 | CPU: Intel Broadwell vs AMD Milan<br>GPU count: 2 (same)<br>GPU generation: NVIDIA Pascal vs. Ampere (+2 generations)<br>GPU memory (GiB per GPU): 80 (+64)<br>vCPU: 48 (+36)<br>Memory GiB: 440 (+216)<br>Temp Storage (SSD) GiB: 2246 (+772)<br>Max data disks: 24 (same)<br>Accelerated Networking: Yes (+)<br>Premium Storage: Yes (+) | 
| Standard_NC24s_v2 | Standard_NC96ads_A100_v4 | CPU: Intel Broadwell vs AMD Milan<br>GPU count: 4 (same)<br>GPU generation: NVIDIA Pascal vs. Ampere (+2 generations)<br>GPU memory (GiB per GPU): 80 (+64)<br>vCPU: 96 (+72)<br>Memory GiB: 880 (+432)<br>Temp Storage (SSD) GiB: 4492 (+1544)<br>Max data disks: 32 (same)<br>Accelerated Networking: Yes (+)<br>Premium Storage: Yes (+) | 
| Standard_NC24rs_v2 | Standard_NC96ads_A100_v4 | CPU: Intel Broadwell vs AMD Milan <br>GPU count: 4 (Same)<br>GPU generation: NVIDIA Pascal vs. Ampere (+2 generations)<br>GPU memory (GiB per GPU): 80 (+64)<br>vCPU: 96 (+72)<br>Memory GiB: 880 (+432)<br>Temp Storage (SSD) GiB: 4492 (+1544)<br>Max data disks: 32 (same)<br>Accelerated Networking: Yes (+)<br>Premium Storage: Yes (+)<br>InfiniBand interconnect: No (-)| 

### ND-Series VMs featuring NVIDIA Tesla P40 GPUs

The ND-series virtual machines are a midrange platform originally designed for AI and Deep Learning workloads. They offered excellent performance for batch inferencing via improved single-precision floating point operations over their predecessors and are powered by NVIDIA Tesla P40 GPUs and Intel Xeon E5-2690 v4 (Broadwell) CPUs. Like the NC and NC v2-Series, the ND-Series offers a configuration with a secondary low-latency, high-throughput network through RDMA, and InfiniBand connectivity so you can run large-scale training jobs spanning many GPUs.

| Current VM Size | Target VM Size | Difference in Specification | 
|---|---|---|
|Standard_ND6 | Standard_NC4as_T4_v3<br>or<br>Standard_NC8as_T4_v3 | CPU: Intel Broadwell vs AMD Rome<br>GPU count: 1 (same)<br>GPU generation: NVIDIA Pascal vs. Turing (+1 generation)<br>GPU memory (GiB per GPU): 16 (-8)<br>vCPU: 4 (-2) or 8 (+2)<br>Memory GiB: 16 (-40) or 56 (-56)<br>Temp Storage (SSD) GiB: 180 (-552) or 360 (-372)<br>Max data disks: 8 (-4) or 16 (+4)<br>Accelerated Networking: Yes (+)<br>Premium Storage: Yes (+) | 
| Standard_ND12 | Standard_NC16as_T4_v3	| CPU: Intel Broadwell vs AMD Rome<br>GPU count: 1 (-1)<br>GPU generation: NVIDIA Pascal vs. Turing (+1 generations)<br>GPU memory (GiB per GPU): 16 (-8)<br>vCPU: 16 (+4)<br>Memory GiB: 110 (-114)<br>Temp Storage (SSD) GiB: 360 (-1,114)<br>Max data disks: 48 (+16)<br>Accelerated Networking: Yes (+)<br>Premium Storage: Yes (+) | 
| Standard_ND24 | Standard_NC64as_T4_v3* | CPU: Intel Broadwell vs AMD Rome<br>GPU count: 4 (same)<br>GPU generation: NVIDIA Pascal vs. Turing (+1 generations)<br>GPU memory (GiB per GPU): 16 (-8)<br>vCPU: 64 (+40)<br>Memory GiB: 440 (same)<br>Temp Storage (SSD) GiB: 2880 (same)<br>Max data disks: 32 (same)<br>Accelerated Networking: Yes (+)<br>Premium Storage: Yes (+) | 
| Standard_ND24r |Standard_ND96amsr_A100_v4 | CPU: Intel Broadwell vs AMD Rome<br>GPU count: 8 (+4)<br>GPU generation: NVIDIA Pascal vs. Ampere (+2 generation)<br>GPU memory (GiB per GPU): 80 (+56)<br>vCPU: 96 (+72)<br>Memory GiB: 1900 (+1452)<br>Temp Storage (SSD) GiB: 6400 (+3452)<br>Max data disks: 32 (same)<br>Accelerated Networking: Yes (+)<br>Premium Storage: Yes (+)<br>InfiniBand interconnect: Yes (Same) | 




## Migration Steps

### General Changes

1.  Choose a series and size for migration. Leverage the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) for further insights.

2.  Get quota for the target VM series

3.  Resize the current N\* series VM size to the target size. This may also be a good time to update the operating system used by your Virtual Machine image, or adopt one of the HPC images with drivers pre-installed as your starting point.

    > [!IMPORTANT]
    > Your VM image may have been produced with an older version of the CUDA runtime, NVIDIA driver, and (if applicable, for RDMA-enabled sizes only) Mellanox OFED drivers than your new GPU VM series requires, which can be updated by [following the instructions in the Azure Documentation.](./sizes-gpu.md)

### Breaking Changes

#### Select target size for migration

After assessing your current usage, decide what type of GPU VM you need. Depending on the workload requirements you have few different choices.

> [!NOTE]
> A best practice is to select a VM size based on both cost and performance. The recommendations in this guide are based on a general-purpose, one-to-one comparison of performance metrics and the nearest match in another VM series. Before deciding on the right size, get a cost comparison using the Azure Pricing Calculator.

> [!IMPORTANT]
> All legacy NC, NC v2 and ND-Series sizes are available in multi-GPU sizes, including 4-GPU sizes with and without InfiniBand interconnect for scale-out, tightly-coupled workloads that demand more compute power than a single 4-GPU VM, or a single K80, P40, or P100 GPU can supply respectively. Although the recommendations above offer a straightforward path forward, users of these sizes should consider achieving their performance goals with more powerful NVIDIA V100 GPU-based VM series like the [NC v3-Series](./ncv3-series.md) and [ND v2-series](./ndv2-series.md), which typically enable the same level of workload performance at lower costs and with improved manageability by providing considerably greater performance per GPU and per VM before multi-GPU and multi-node configurations are required, respectively.
<br>

#### Get quota for the target VM family

Follow the guide to [request an increase in vCPU quota by VM family.](../azure-portal/supportability/per-vm-quota-requests.md) Select the target VM size you have selected for migration.

#### Resize the current virtual machine

You can [resize the virtual machine](resize-vm.md). 

## Next steps

For a full list of GPU enabled virtual machine sizes, see [GPU - accelerated compute overview](sizes-gpu.md)
