---
title: Azure HPC VM images
description: HPC VM images to be used on InfiniBand enabled H-series and GPU enabled N-series VMs.
ms.service: virtual-machines
ms.subservice: hpc
ms.custom: linux-related-content
ms.topic: article
ms.date: 05/17/2024
ms.reviewer: padmalathas
ms.author: litan2
author: litan2
---

# Azure HPC VM images

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

This article shares some information on HPC VM images to be used to launch InfiniBand enabled [H-series](sizes-hpc.md) and GPU enabled [N-series](sizes-gpu.md) VMs.

The Azure HPC team is pleased to announce the availability of optimized and pre-configured Linux VM images for HPC and AI workloads. These VM images are:

- Based on the vanilla Ubuntu and AlmaLinux marketplace VM images.
- Pre-configured with NVIDIA Mellanox OFED driver for InfiniBand, NVIDIA GPU drivers, popular MPI libraries, vendor tuned HPC libraries, and recommended performance optimizations.
- Including optimizations and recommended configurations to deliver optimal performance, consistency, and reliability. 

## Availability on Azure

You may use the HPC images when creating a VM from either Azure Marketplace or Azure CLI. For other deployment methods, refer to the section of Deploying HPC VM Images.

### Azure Marketplace

Search for `Ubuntu HPC` by the publisher `Microsoft-DSVM`, or `AlmaLinux HPC` by the publisher `AlmaLinux`.

### Azure CLI

Run the following commands to find image URNs of the HPC images:

#### Ubuntu-HPC

```
az vm image list --publisher microsoft-dsvm --offer ubuntu-hpc --output table --all
```

All images support [Gen 2 VMs](generation-2.md).

#### AlmaLinux-HPC

```
az vm image list --publisher almalinux --offer almalinux-hpc --output table --all
```

All images support both Gen 1 and Gen 2 VMs.

## Supported VM sizes

The HPC VM images support the following VM sizes:

- Standard_HB60rs
- Standard_HB120rs_v2     
- Standard_HB120rs_v3
- Standard_HB120rs_v4
- Standard_HC44rs
- Standard_ND40rs_v2
- Standard_ND96asr_v4
- Standard_ND96amsr_A100_v4
- Standard_ND96isr_H100_v5

Refer to [Azure VM sizes](sizes.md) for the latest H- and N-series VM size support matrix.

## Installed software packages

- Mellanox OFED 24.01-0.3.3.1
- Pre-configured IPoIB (IP-over-InfiniBand)
- Popular InfiniBand based MPI Libraries
    - HPC-X v2.18 with/without PMIx-4
    - Intel MPI 2021.12.0
    - MVAPICH2 2.3.7-1
    - OpenMPI 5.0.2 with PMIx-4
-	Communication Runtimes
    - Libfabric
    - OpenUCX
    - NCCL 2.21.5-1
    - NCCL RDMA Sharp Plugin
- Optimized libraries
    - AMD Optimizing C/C++ and Fortran Compilers 4.0.0-1
    - Intel MKL 2024.0.0.49673
- GPU Drivers
    - NVIDIA GPU Driver 535.161.08
    - NVIDIA Peer Memory (GPU Direct RDMA)
    - NVIDIA Fabric Manager
    - CUDA 12.4
- GDRCopy 2.3
- Data Center GPU Manager 3.3.3
- Azure HPC Diagnostics Tool
- SKU based customizations
    - Topology files
    - NCCL configuration
- Moby 24.0.7-ubuntu22.04u1
- NVIDIA Docker container 24.0.7-1
- Azure Managed Lustre 2.15.4-42-gd6d405d
- Moneo v0.3.5
- Azure HPC Health Checks v0.4.2

An installed version index within the VM image is located at this location: ```/opt/azurehpc/component_versions.txt```.

MPI libraries and software packages are available as environment modules. To load an MPI library/package, run:

```
module load <package-name>
```

## Configuration and optimization

Refer to the [azhpc-images](https://github.com/Azure/azhpc-images) repo at GitHub for the latest details on what packages and configuration is included in each VM image. The included configurations are based on optimization recommendations from vendors and partners, as well as learnings from common HPC workloads and usage practices in traditional HPC systems.

- Azure Linux Agent (WAAgent)
    - Limit waagent's (VM agent running on every Azure Linux VM) usage of CPU/memory resources.
    - Optionally, consider disabling waagent at the beginning of your job script, and enabling it back at the end, for CPU sensitive workloads as follows:
    
    ```
    sudo systemctl stop waagent
    <HPC job>
    sudo systemctl restart waagent
    ```

- Higher Memory Limits
    - Set max-locked-memory limit to unlimited
    - Set number of open files limit to 65535

- Zone Reclaim mode
    - Set zone_reclaim_mode to 1

- Disable firewall daemon to help MPI job launchers

## Deploying HPC VM images

As shown, the HPC VM images are available from Azure Marketplace and Azure CLI. They can be deployed through a variety of deployment vehicles on Azure (Azure CycleCloud, Azure Batch, ARM templates, etc.). [AzureHPC scripts](https://github.com/Azure/azurehpc/) provide an easy way to quickly deploy an HPC cluster using these images.
