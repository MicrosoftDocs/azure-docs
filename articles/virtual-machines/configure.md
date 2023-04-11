---
title: Configuration and Optimization of InfiniBand enabled H-series and N-series Azure Virtual Machines
description: Learn about configuring and optimizing the InfiniBand enabled H-series and N-series VMs for HPC.
ms.service: virtual-machines
ms.subservice: hpc
ms.topic: article
ms.date: 03/28/2023
ms.reviewer: cynthn, mattmcinnes
ms.author: mamccrea
author: mamccrea
---

# Configure and optimize VMs

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

This article shares some guidance on configuring and optimizing the InfiniBand-enabled [HB-series](sizes-hpc.md) and [N-series](sizes-gpu.md) VMs for HPC.

## VM images
On InfiniBand (IB) enabled VMs, the appropriate drivers are required to enable RDMA.
- The [CentOS-HPC VM images](#centos-hpc-vm-images) in the Marketplace come preconfigured with the appropriate IB drivers.
  - The CentOS-HPC version 7.9 VM image additionally comes preconfigured with the NVIDIA GPU drivers. 
- The [Ubuntu-HPC VM images](#ubuntu-hpc-vm-images) in the Marketplace come preconfigured with the appropriate IB drivers and GPU drivers.

These VM images are based on the base CentOS and Ubuntu marketplace VM images. Scripts used in the creation of these VM images from their base CentOS Marketplace image are on the [azhpc-images repo](https://github.com/Azure/azhpc-images/tree/master/centos).

On GPU enabled [N-series](sizes-gpu.md) VMs, the appropriate GPU drivers are additionally required. This can be available by the following methods:
- Use the [Ubuntu-HPC VM images](#ubuntu-hpc-vm-images) and [CentOS-HPC VM image](#centos-hpc-vm-images) version 7.9 that come preconfigured with the NVIDIA GPU drivers and GPU compute software stack (CUDA, NCCL).
- Add the GPU drivers through the [VM extensions](./extensions/hpccompute-gpu-linux.md).
- Install the GPU drivers [manually](./linux/n-series-driver-setup.md).
- Some other VM images on the Marketplace also come preinstalled with the NVIDIA GPU drivers, including some VM images from NVIDIA.

Depending on the workloads' Linux distro and version needs, both the [CentOS-HPC VM images](#centos-hpc-vm-images) and [Ubuntu-HPC VM images](#ubuntu-hpc-vm-images) in the Marketplace are the easiest way to get started with HPC and AI workloads on Azure.
It's also recommended to create [custom VM images](./linux/tutorial-custom-images.md) with workload specific customization and configuration for reuse.

### VM sizes supported by the HPC VM images

#### InfiniBand OFED support
The latest Azure HPC marketplace images come with Mellanox OFED 5.1 and above, which do not support ConnectX3-Pro InfiniBand cards. ConnectX-3 Pro InfiniBand cards require MOFED 4.9 LTS version. These VM images only support ConnextX-5 and newer InfiniBand cards. The following VM size support matrix for the InfiniBand OFED in these HPC VM images:
- [HB-series](sizes-hpc.md): HB, HC, HBv2, HBv3, HBv4
- [N-series](sizes-gpu.md): NDv2, NDv4

#### GPU driver support
Currently only the [Ubuntu-HPC VM images](#ubuntu-hpc-vm-images)  and [CentOS-HPC VM images](#centos-hpc-vm-images) version 7.9 come preconfigured with the NVIDIA GPU drivers and GPU compute software stack (CUDA, NCCL).

The VM size support matrix for the GPU drivers in supported HPC VM images is as follows:
- [N-series](sizes-gpu.md): NDv2, NDv4 VM sizes are supported with the NVIDIA GPU drivers and GPU compute software stack (CUDA, NCCL).
- The other 'NC' and 'ND' VM sizes in the [N-series](sizes-gpu.md) are supported with the NVIDIA GPU drivers.

All of the VM sizes in the N-series support [Gen 2 VMs](generation-2.md), though some older ones also support Gen 1 VMs. Gen 2 support is also indicated with a "01" at the end of the image URN or version.

### CentOS-HPC VM images

#### SR-IOV enabled VMs
For SR-IOV enabled [RDMA capable VMs](sizes-hpc.md#rdma-capable-instances), [Ubuntu-HPC VM images](#ubuntu-hpc-vm-images) and CentOS-HPC VM images version 7.6 and later are suitable. These VM images come preconfigured with the Mellanox OFED drivers for RDMA and commonly used MPI libraries and scientific computing packages. Refer to the [VM size support matrix](#vm-sizes-supported-by-the-hpc-vm-images).
- The available or latest versions of the VM images can be listed with the following information using [CLI](/cli/azure/vm/image#az-vm-image-list) or [Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/openlogic.centos-hpc?tab=Overview).
   ```bash
   "publisher": "OpenLogic",
   "offer": "CentOS-HPC",
   ```
- Scripts used in the creation of the [Ubuntu-HPC VM images](#ubuntu-hpc-vm-images) and CentOS-HPC version 7.6 and later VM images from a base CentOS Marketplace image are on the [azhpc-images repo](https://github.com/Azure/azhpc-images/tree/master/centos).
- Additionally, details on what's included in the [Ubuntu-HPC VM images](#ubuntu-hpc-vm-images) and CentOS-HPC version 7.6 and later VM images, and how to deploy them are in a [TechCommunity article](https://techcommunity.microsoft.com/t5/azure-compute/azure-hpc-vm-images/ba-p/977094).

> [!NOTE] 
> Among the CentOS-HPC VM images, currently only the version 7.9 VM image additionally comes preconfigured with the NVIDIA GPU drivers and GPU compute software stack (CUDA, NCCL).

> [!NOTE] 
> SR-IOV enabled N-series VM sizes with FDR InfiniBand (e.g. NCv3 and older) will be able to use the following CentOS-HPC VM image or older versions from the Marketplace:
>- OpenLogic:CentOS-HPC:7.6:7.6.2020062900
>- OpenLogic:CentOS-HPC:7_6gen2:7.6.2020062901
>- OpenLogic:CentOS-HPC:7.7:7.7.2020062600
>- OpenLogic:CentOS-HPC:7_7-gen2:7.7.2020062601
>- OpenLogic:CentOS-HPC:8_1:8.1.2020062400
>- OpenLogic:CentOS-HPC:8_1-gen2:8.1.2020062401

### Ubuntu-HPC VM images
For SR-IOV enabled [RDMA capable VMs](sizes-hpc.md#rdma-capable-instances), Ubuntu-HPC VM images versions 18.04 and 20.04 are suitable. These VM images come preconfigured with the Mellanox OFED drivers for RDMA, NVIDIA GPU drivers, GPU compute software stack (CUDA, NCCL), and commonly used MPI libraries and scientific computing packages. Refer to the [VM size support matrix](#vm-sizes-supported-by-the-hpc-vm-images).
- The available or latest versions of the VM images can be listed with the following information using [CLI](/cli/azure/vm/image#az-vm-image-list) or [Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-hpc?tab=overview).
   ```bash
   "publisher": "Microsoft-DSVM",
   "offer": "Ubuntu-HPC",
   ```
- Scripts used in the creation of the Ubuntu-HPC VM images from a base Ubuntu Marketplace image are on the [azhpc-images repo](https://github.com/Azure/azhpc-images/tree/master/ubuntu).
- Additionally, details on what's included in the Ubuntu-HPC VM images, and how to deploy them are in a [TechCommunity article](https://techcommunity.microsoft.com/t5/azure-compute/azure-hpc-vm-images/ba-p/977094).

### RHEL/CentOS VM images
The base RHEL or CentOS-based non-HPC VM images on the Marketplace can be configured for use on the SR-IOV enabled [RDMA capable VMs](sizes-hpc.md#rdma-capable-instances). Learn more about [enabling InfiniBand](./extensions/enable-infiniband.md) and [setting up MPI](setup-mpi.md) on the VMs.
- Scripts used in the creation of the CentOS-HPC version 7.6 and later VM images from a base CentOS Marketplace image from the [azhpc-images repo](https://github.com/Azure/azhpc-images/tree/master/centos) can also be used.
 
### Ubuntu VM images
The base Ubuntu Server 16.04 LTS, 18.04 LTS, and 20.04 LTS VM images in the Marketplace are supported for both SR-IOV and non-SR-IOV [RDMA capable VMs](sizes-hpc.md#rdma-capable-instances). Learn more about [enabling InfiniBand](./extensions/enable-infiniband.md) and [setting up MPI](setup-mpi.md) on the VMs.
- Instructions for enabling InfiniBand on the Ubuntu VM images are in a [TechCommunity article](https://techcommunity.microsoft.com/t5/azure-compute/configuring-infiniband-for-ubuntu-hpc-and-gpu-vms/ba-p/1221351).
- Scripts used in the creation of the Ubuntu 18.04 and 20.04 LTS based HPC VM images from a base Ubuntu Marketplace image are on the [azhpc-images repo](https://github.com/Azure/azhpc-images/tree/master/ubuntu).

> [!NOTE]
> Mellanox OFED 5.1 and above don't support ConnectX3-Pro InfiniBand cards on SR-IOV enabled N-series VM sizes with FDR InfiniBand (e.g. NCv3). Please use LTS Mellanox OFED version 4.9-0.1.7.0 or older on the N-series VM's with ConnectX3-Pro cards. For more information, see [Linux InfiniBand Drivers](https://www.mellanox.com/products/infiniband-drivers/linux/mlnx_ofed).

### SUSE Linux Enterprise Server VM images
SLES 12 SP3 for HPC, SLES 12 SP3 for HPC (Premium), SLES 12 SP1 for HPC, SLES 12 SP1 for HPC (Premium), SLES 12 SP4 and SLES 15 VM images in the Marketplace are supported. These VM images come preloaded with the Network Direct drivers for RDMA (on the non-SR-IOV VM sizes) and Intel MPI version 5.1. Learn more about [setting up MPI](setup-mpi.md) on the VMs.

## Optimize VMs

The following are some optional optimization settings for improved performance on the VM.

### Update LIS

If necessary for functionality or performance, [Linux Integration Services (LIS) drivers](./linux/endorsed-distros.md) can be installed or updated on supported OS distros, especially is deploying using a custom image or an older OS version such as CentOS/RHEL 6.x or earlier version of 7.x.

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

Keep reclaim memory mode persistent after VM reboots:

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
Optionally, the WALinuxAgent may be disabled before running a job then enabled post-job for maximum VM resource availability to the HPC workload.


## Next steps

- Learn more about [enabling InfiniBand](./extensions/enable-infiniband.md) on the InfiniBand-enabled [HB-series](sizes-hpc.md) and [N-series](sizes-gpu.md) VMs.
- Learn more about installing and running various [supported MPI libraries](setup-mpi.md) on the VMs.
- Review the [HBv3-series overview](hbv3-series-overview.md) and [HC-series overview](hc-series-overview.md).
- Read about the latest announcements, HPC workload examples, and performance results at the [Azure Compute Tech Community Blogs](https://techcommunity.microsoft.com/t5/azure-compute/bg-p/AzureCompute).
- For a higher level architectural view of running HPC workloads, see [High Performance Computing (HPC) on Azure](/azure/architecture/topics/high-performance-computing/).
