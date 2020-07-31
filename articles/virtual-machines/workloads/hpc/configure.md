---
title: High-performance computing on InfiniBand enabled H-series and N-series VMs - Configuration and Optimization of Azure Virtual Machines
description: Learn about configuring and optimizing the InfiniBand enabled H-series and N-series VMs for HPC.
services: virtual-machines
documentationcenter: ''
author: vermagit
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 07/30/2020
ms.author: amverma
ms.reviewer: cynthn
---

# Configure and Optimize VMs

This article shares known techniques to configure and optimize the InfiniBand-enabled [H-series](../../sizes-hpc.md) and [N-series](../../sizes-gpu.md) VMs for HPC.

## VM Images
On InfiniBand enabled VMs, the appropriate drivers are required to enable RDMA. On Linux, the CentOS-HPC VM images in the Marketplace come pre-configured with the appropriate drivers. The Ubuntu VM images can be configured with the right drivers using the [instructions here](https://techcommunity.microsoft.com/t5/azure-compute/configuring-infiniband-for-ubuntu-hpc-and-gpu-vms/ba-p/1221351). It is also recommended to create [custom VM images](https://docs.microsoft.com/azure/virtual-machines/linux/tutorial-custom-images) with the appropriate drivers and configuration and re-use those recurringly.

### CentOS-HPC VM Images
For non-SR-IOV enabled [RDMA capable VMs](../../sizes-hpc.md#rdma-capable-instances), CentOS-HPC version 6.5 or a later version, up to 7.5 in the Marketplace are suitable. As an example, for [H16-series VMs](../../h-series.md), versions 7.1 to 7.5 are recommended. These VM images come pre-loaded with the Network Direct drivers for RDMA and Intel MPI version 5.1.

  For SR-IOV enabled [RDMA capable VMs](../../sizes-hpc.md#rdma-capable-instances), CentOS-HPC version 7.6 or a later version in the Marketplace are suitable. These VM images come optimized and pre-loaded with the OFED drivers for RDMA and various commonly used MPI libraries and scientific computing packages.

  Example of scripts used in the creation of the CentOS-HPC version 7.6 and later VM images are on the [azhpc-images repo](https://github.com/Azure/azhpc-images/tree/master/centos).

### Ubuntu VM Images
Ubuntu Server 16.04 LTS, 18.04 LTS and 20.04 LTS VM images in the Marketplace are supported for both SR-IOV and non-SR-IOV [RDMA capable VMs](../../sizes-hpc.md#rdma-capable-instances). Learn more about [enabling InfiniBand](enable-infiniband.md) and [setting up MPI](setup-mpi.md) on the VMs.

  Example of scripts that can be used in the creation of the Ubuntu 18.04 LTS based HPC VM images are on the [azhpc-images repo](https://github.com/Azure/azhpc-images/tree/master/ubuntu/ubuntu-18.x/ubuntu-18.04-hpc).

### SUSE Linux Enterprise Server VM Images
SLES 12 SP3 for HPC, SLES 12 SP3 for HPC (Premium), SLES 12 SP1 for HPC, SLES 12 SP1 for HPC (Premium), SLES 12 SP4 and SLES 15 VM images in the Marketplace are supported. These VM images come pre-loaded with the Network Direct drivers for RDMA and Intel MPI version 5.1. Learn more about [setting up MPI](setup-mpi.md) on the VMs.

## Optimize VMs

### Update LIS

If required for functionality or performance, [Linux Integration Services (LIS) drivers](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros) can be installed or updated on supported OS distros, especially is deploying using a custom image or an older OS version such as CentOS/RHEL 6.x or earlier version of 7.x.

```bash
wget https://aka.ms/lis
tar xzf lis
pushd LISISO
./upgrade.sh
```

### Reclaim memory

Improve performance by automatically reclaiming memory to avoid remote memory access.

```bash
echo 1 >/proc/sys/vm/zone_reclaim_mode
```

To make this persist after VM reboots:

```bash
echo "vm.zone_reclaim_mode = 1" >> /etc/sysctl.conf sysctl -p
```

### Disable firewall and SELinux

```bash
systemctl stop iptables.service
systemctl disable iptables.service
systemctl mask firewalld
systemctl stop firewalld.service
systemctl disable firewalld.service
iptables -nL
sed -i -e's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
```

### Disable cpupower

```bash
service cpupower status
if enabled, disable it:
service cpupower stop
sudo systemctl disable cpupower
```

### Configure WALinuxAgent

```bash
sed -i -e 's/# OS.EnableRDMA=y/OS.EnableRDMA=y/g' /etc/waagent.conf
```
Optionally, the WALinuxAgent may be diasbled as a pre-job step and enabled back post-job for maximum VM resource availability to the HPC workload.


## Next steps

- Learn more about [enabling InfiniBand](enable-infiniband.md) on the InfiniBand-enabled [H-series](../../sizes-hpc.md) and [N-series](../../sizes-gpu.md) VMs.
- Learn more about installing various [supported MPI libraries](setup-mpi.md) and their optimal configuration on the VMs.
- Review the [HB-series overview](hb-series-overview.md) and [HC-series overview](hc-series-overview.md) to learn about optimally configuring workloads for performance and scalability.
- Read about the latest announcements and some HPC examples and results at the [Azure Compute Tech Community Blogs](https://techcommunity.microsoft.com/t5/azure-compute/bg-p/AzureCompute).
- For a higher level architectural view of running HPC workloads, see [High Performance Computing (HPC) on Azure](/azure/architecture/topics/high-performance-computing/).
