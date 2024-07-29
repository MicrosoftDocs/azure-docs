---
title: ND H100 v5-series summary include
description: Include file containing a summary of the ND H100 v5-series size family.
services: virtual-machines
author: mattmcinnes
ms.topic: include
ms.service: virtual-machines
ms.subservice: sizes
ms.date: 04/18/2024
ms.author: mattmcinnes
ms.custom: include file
---
The ND H100 v5 series virtual machine (VM) is a new flagship addition to the Azure GPU family. It’s designed for high-end Deep Learning training and tightly coupled scale-up and scale-out Generative AI and HPC workloads. The ND H100 v5 series starts with a single VM and eight NVIDIA H100 Tensor Core GPUs. ND H100 v5-based deployments can scale up to thousands of GPUs with 3.2Tb/s of interconnect bandwidth per VM. Each GPU within the VM is provided with its own dedicated, topology-agnostic 400 Gb/s NVIDIA Quantum-2 CX7 InfiniBand connection. These connections are automatically configured between VMs occupying the same virtual machine scale set, and support GPUDirect RDMA. Each GPU features NVLINK 4.0 connectivity for communication within the VM, and the instance is backed by 96 physical 4th Gen Intel Xeon Scalable processor cores. These instances provide excellent performance for many AI, ML, and analytics tools that support GPU acceleration ‘out-of-the-box,’ such as TensorFlow, Pytorch, Caffe, RAPIDS, and other frameworks. Additionally, the scale-out InfiniBand interconnect is supported by a large set of existing AI and HPC tools that are built on NVIDIA’s NCCL communication libraries for seamless clustering of GPUs.