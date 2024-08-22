---
title: NDm_A100_v4-series summary include file
description: Include file for NDm_A100_v4-series summary
author: mattmcinnes
ms.topic: include
ms.service: azure-virtual-machines
ms.subservice: sizes
ms.date: 07/31/2024
ms.author: mattmcinnes
ms.reviewer: mattmcinnes
ms.custom: include file
---
The NDm A100 v4 series virtual machine(VM) is a new flagship addition to the Azure GPU family. These sizes are designed for high-end Deep Learning training and tightly coupled scale-up and scale-out HPC workloads.

The NDm A100 v4 series starts with a single VM and eight NVIDIA Ampere A100 80GB Tensor Core GPUs. NDm A100 v4-based deployments can scale up to thousands of GPUs with an 1.6 TB/s of interconnect bandwidth per VM. Each GPU within the VM is provided with its own dedicated, topology-agnostic 200 GB/s NVIDIA Mellanox HDR InfiniBand connection. These connections are automatically configured between VMs occupying the same Azure Virtual Machine Scale Set, and support GPU Direct RDMA.

Each GPU features NVLINK 3.0 connectivity for communication within the VM with 96 physical 2nd-generation AMD Epyc™ 7V12 (Rome) CPU cores behind them.

These instances provide excellent performance for many AI, ML, and analytics tools that support GPU acceleration 'out-of-the-box,' such as TensorFlow, Pytorch, Caffe, RAPIDS, and other frameworks. Additionally, the scale-out InfiniBand interconnect supports a large set of existing AI and HPC tools that are built on NVIDIA's NCCL2 communication libraries for seamless clustering of GPUs.
