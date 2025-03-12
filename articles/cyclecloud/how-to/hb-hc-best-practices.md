---
title: HB/HC Cluster Best Practices
description: Best practices for using Azure CycleCloud with HB and HC series Virtual Machines.
author: anhoward
ms.date: 06/11/2019
ms.author: anhoward
---

# Best Practices for using HB and HC VMs

## Overview

The [H-series virtual machines](/azure/virtual-machines/windows/sizes-hpc) (VMs) are the latest HPC offerings on Azure. HB-series VMs offer 60-core AMD EPYC processors, optimized for running applications with high memory-bandwidth requirements, such as explicit finite element analysis, fluid dynamics, and weather modeling. The HC-series VMs have 44-core Intel Xeon Skylake processors and are optimized for applications requiring intensive CPU calculations, like molecular dynamics and implicit finite element analysis. HB and HC VMs feature 100 Gb/s EDR InfiniBand and support the latest MPI types and versions. The [Scaling HPC Applications Guide](/azure/virtual-machines/workloads/hpc/compiling-scaling-applications) has more information on how to scale HPC applications on HB and HC VMs.

Azure CycleCloud supports the new H-series VMs out of the box, but for the best experience and performance, follow the guidelines and best practices on this page.

## CentOS 7.6 HPC Marketplace Image

The CentOS 7.6 HPC Marketplace image contains all of the drivers to enable the InfiniBand interface as well as pre-compiled versions of all of the common MPI variants installed in */opt*. For details on what exactly the image has to offer see [this blog post](https://techcommunity.microsoft.com/t5/Azure-Compute/CentOS-HPC-VM-Image-for-SR-IOV-enabled-Azure-HPC-VMs/ba-p/665557). 

To use the CentOS 7.6 HPC image when creating your cluster, check the **Custom Image** box on the **Advanced Settings** parameter and enter the value `OpenLogic:CentOS-HPC:7.6:latest`.

![CentOS HPC Image](~/articles/cyclecloud/images/hc-marketplace-image.png)

In order to support the older H16r VM series and keep cluster head nodes locked to the same version of CentOS, the default "Cycle CentOS 7" image in the Base OS dropdown deploys CentOS 7.4. While this is fine for most VM series, HB/HC VMs require CentOS 7.6 or newer and a different Mellanox driver. 

## Disable SElinux in CycleCloud < 7.7.4

By default, SElinux only considers */root* and */home* to be valid paths for home directories. Any users with home directories outside of these paths cause SElinux to block SSH from using any SSH keypairs in the user's home directory. In CycleCloud clusters, user home directories are created in */shared/home*. While CycleCloud versions newer than 7.7.4 automatically set the */shared/home* path as a valid SElinux homedir context, older versions don't support this. In order to make sure SSH works properly for users on the cluster, you need to disable SElinux in the cluster template:
```ini
[[node defaults]]
    [[[configuration]]]
    cyclecloud.selinux.policy = permissive
```

## Running MPI jobs with Slurm

MPI jobs running on HB/HC VMs need to run in the same VM Scaleset (VMSS). To ensure proper autoscale placement of VMs for MPI jobs running with Slurm, make sure to set the following attribute in your cluster template:

```ini
[[nodearray execute]]
Azure.SingleScaleset = true
Azure.MaxScalesetSize = 300
Azure.Overprovision = true
```

## Getting pkeys for use with OpenMPI and MPICH

Some MPI variants require you to specify the InfiniBand PKEY when running the job. The following Bash function can be used to determine the PKEY:

```bash
get_ib_pkey()
{
    key0=$(cat /sys/class/infiniband/mlx5_0/ports/1/pkeys/0)
    key1=$(cat /sys/class/infiniband/mlx5_0/ports/1/pkeys/1)

    if [ $(($key0 - $key1)) -gt 0 ]; then
        export IB_PKEY=$key0
    else
        export IB_PKEY=$key1
    fi

    export UCX_IB_PKEY=$(printf '0x%04x' "$(( $IB_PKEY & 0x0FFF ))")
}
```
