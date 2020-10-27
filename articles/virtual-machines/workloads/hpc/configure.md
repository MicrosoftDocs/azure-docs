---
title: Configuration and Optimization of InfiniBand enabled H-series and N-series Azure Virtual Machines
description: Learn about configuring and optimizing the InfiniBand enabled H-series and N-series VMs for HPC.
author: vermagit
ms.service: virtual-machines
ms.topic: article
ms.date: 10/23/2020
ms.author: amverma
ms.reviewer: cynthn

---

# Configure and optimize VMs

This article shares known techniques to configure and optimize the InfiniBand-enabled [H-series](../../sizes-hpc.md) and [N-series](../../sizes-gpu.md) VMs for HPC.

## VM images
On InfiniBand enabled VMs, the appropriate drivers are required to enable RDMA. On Linux, the CentOS-HPC VM images in the Marketplace come pre-configured with the appropriate drivers. The Ubuntu VM images can be configured with the right drivers using the [instructions here](https://techcommunity.microsoft.com/t5/azure-compute/configuring-infiniband-for-ubuntu-hpc-and-gpu-vms/ba-p/1221351). It is also recommended to create [custom VM images](../../linux/tutorial-custom-images.md) with the appropriate drivers and configuration and reuse those recurringly.

> [!NOTE]
> On GPU enabled [N-series](../../sizes-gpu.md) VMs, the appropriate GPU drivers are additionally required which can be added through the [VM extensions](../../extensions/hpccompute-gpu-linux.md) or [manually](../../linux/n-series-driver-setup.md). Some VM images on the Marketplace also come pre-installed with the Nvidia GPU drivers.

### CentOS-HPC VM images

#### Non SR-IOV enabled VMs
For non-SR-IOV enabled [RDMA capable VMs](../../sizes-hpc.md#rdma-capable-instances), CentOS-HPC version 6.5 or a later version, up to 7.5 in the Marketplace are suitable. As an example, for [H16-series VMs](../../h-series.md), versions 7.1 to 7.5 are recommended. These VM images come pre-loaded with the Network Direct drivers for RDMA and Intel MPI version 5.1.

> [!NOTE]
> On these CentOS-based HPC images for non-SR-IOV enabled VMs, kernel updates are disabled in the **yum** configuration file. This is because the NetworkDirect Linux RDMA drivers are distributed as an RPM package, and driver updates might not work if the kernel is updated.

#### SR-IOV enabled VMs
  For SR-IOV enabled [RDMA capable VMs](../../sizes-hpc.md#rdma-capable-instances), [CentOS-HPC version 7.6 or a later](https://techcommunity.microsoft.com/t5/Azure-Compute/CentOS-HPC-VM-Image-for-SR-IOV-enabled-Azure-HPC-VMs/ba-p/665557) version VM images in the Marketplace are suitable. These VM images come optimized and pre-loaded with the OFED drivers for RDMA and various commonly used MPI libraries and scientific computing packages and are the easiest way to get started.

  Example of scripts used in the creation of the CentOS-HPC version 7.6 and later VM images from a base CentOS Marketplace image are on the [azhpc-images repo](https://github.com/Azure/azhpc-images/tree/master/centos).
  
  > [!NOTE] 
  > The latest Azure HPC marketplace images have Mellanox OFED 5.1 and above, which do not support ConnectX3-Pro InfiniBand cards. SR-IOV enabled N-series VM sizes with FDR InfiniBand (e.g. NCv3) will be able to use the following CentOS-HPC VM image versions or older:
  >- OpenLogic:CentOS-HPC:7.6:7.6.2020062900
  >- OpenLogic:CentOS-HPC:7_6gen2:7.6.2020062901
  >- OpenLogic:CentOS-HPC:7.7:7.7.2020062600
  >- OpenLogic:CentOS-HPC:7_7-gen2:7.7.2020062601
  >- OpenLogic:CentOS-HPC:8_1:8.1.2020062400
  >- OpenLogic:CentOS-HPC:8_1-gen2:8.1.2020062401


### RHEL/CentOS VM images
RHEL or CentOS-based non-HPC VM images on the Marketplace can be configured for use on the SR-IOV enabled [RDMA capable VMs](../../sizes-hpc.md#rdma-capable-instances). Learn more about [enabling InfiniBand](enable-infiniband.md) and [setting up MPI](setup-mpi.md) on the VMs.

  Example of scripts used in the creation of the CentOS-HPC version 7.6 and later VM images from a base CentOS Marketplace image are on the [azhpc-images repo](https://github.com/Azure/azhpc-images/tree/master/centos).
  
  > [!NOTE]
  > Mellanox OFED 5.1 and above do not support ConnectX3-Pro InfiniBand cards on SR-IOV enabled N-series VM sizes with FDR InfiniBand (e.g. NCv3). Please use LTS Mellanox OFED version 4.9-0.1.7.0 or older on the N-series VM's with ConnectX3-Pro cards. Please see more details [here](https://www.mellanox.com/products/infiniband-drivers/linux/mlnx_ofed).

### Ubuntu VM images
Ubuntu Server 16.04 LTS, 18.04 LTS, and 20.04 LTS VM images in the Marketplace are supported for both SR-IOV and non-SR-IOV [RDMA capable VMs](../../sizes-hpc.md#rdma-capable-instances). Learn more about [enabling InfiniBand](enable-infiniband.md) and [setting up MPI](setup-mpi.md) on the VMs.

  Example of scripts that can be used in the creation of the Ubuntu 18.04 LTS based HPC VM images are on the [azhpc-images repo](https://github.com/Azure/azhpc-images/tree/master/ubuntu/ubuntu-18.x/ubuntu-18.04-hpc).

### SUSE Linux Enterprise Server VM images
SLES 12 SP3 for HPC, SLES 12 SP3 for HPC (Premium), SLES 12 SP1 for HPC, SLES 12 SP1 for HPC (Premium), SLES 12 SP4 and SLES 15 VM images in the Marketplace are supported. These VM images come pre-loaded with the Network Direct drivers for RDMA and Intel MPI version 5.1. Learn more about [setting up MPI](setup-mpi.md) on the VMs.

## Optimize VMs

The following are some optional optimization settings for improved performance on the VM.

### Update LIS

If necessary for functionality or performance, [Linux Integration Services (LIS) drivers](../../linux/endorsed-distros.md) can be installed or updated on supported OS distros, especially is deploying using a custom image or an older OS version such as CentOS/RHEL 6.x or earlier version of 7.x.

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
Optionally, the WALinuxAgent may be disabled as a pre-job step and enabled back post-job for maximum VM resource availability to the HPC workload.


## Next steps

- Learn more about [enabling InfiniBand](enable-infiniband.md) on the InfiniBand-enabled [H-series](../../sizes-hpc.md) and [N-series](../../sizes-gpu.md) VMs.
- Learn more about installing various [supported MPI libraries](setup-mpi.md) and their optimal configuration on the VMs.
- Review the [HB-series overview](hb-series-overview.md) and [HC-series overview](hc-series-overview.md) to learn about optimally configuring workloads for performance and scalability.
- Read about the latest announcements and some HPC examples and results at the [Azure Compute Tech Community Blogs](https://techcommunity.microsoft.com/t5/azure-compute/bg-p/AzureCompute).
- For a higher level architectural view of running HPC workloads, see [High Performance Computing (HPC) on Azure](/azure/architecture/topics/high-performance-computing/).
