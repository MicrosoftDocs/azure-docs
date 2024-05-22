---
title: ND MI300X v5-series summary include
description: Include file containing a summary of the ND MI300X v5-series size family.
services: virtual-machines
author: marccharest
ms.topic: include
ms.service: virtual-machines
ms.subservice: sizes
ms.date: 05/21/2024
ms.author: marccharest
ms.custom: include file, build-2024
---
The ND MI300X v5 series virtual machine (VM) is a new flagship addition to the Azure GPU family. It was designed for high-end Deep Learning training and tightly coupled scale-up and scale-out Generative AI and HPC workloads.

The ND MI300X v5 series VM starts with eight AMD Instinct MI300 GPUs and two fourth Gen Intel Xeon Scalable processors for a total 96 physical cores. Each GPU within the VM is then connected to one another via 4th-Gen AMD Infinity Fabric links with 128 GB/s bandwidth per GPU and 896 GB/s aggregate bandwidth.

ND MI300X v5-based deployments can scale up to thousands of GPUs with 3.2 Tb/s of interconnect bandwidth per VM. Each GPU within the VM is provided with its own dedicated, topology-agnostic 400 Gb/s NVIDIA Quantum-2 CX7 InfiniBand connection. These connections are automatically configured between VMs occupying the same virtual machine scale set, and support GPUDirect RDMA.

These instances provide excellent performance for many AI, ML, and analytics tools that support GPU acceleration "out-of-the-box," such as TensorFlow, Pytorch, and other frameworks. Additionally, the scale-out InfiniBand interconnect supports a large set of existing AI and HPC tools that are built on AMD’s ROCm Communication Collectives Library (RCCL) for seamless clustering of GPUs. 
