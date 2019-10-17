---
title: Enable InifinBand with SR-IOV - Azure Virtual Machines | Microsoft Docs
description: Learn how to enable InfiniBand with SR-IOV. 
services: virtual-machines
documentationcenter: ''
author: vermagit
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 10/17/2019
ms.author: amverma
---

# Enable InfiniBand with SR-IOV

InfiniBand with SR-IOV is available for all RDMA enabled VMs on Azure. RDMA capable VMs include [GPU optimized](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-gpu) and [High-performance compute (HPC)](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-hpc) VMs.

To get started with IaaS VMs for HPC, the simplest solution is to use the CentOS-HPC 7.6 VM OS image, which is already configured with InfiniBand. Since this image is already configured with InfiniBand, you don't have to [configure it manually](#manually-install-ofed). 

If you're using a custom VM image or a [GPU optimized](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-gpu) VM, you should configure it with InfiniBand by adding the InfiniBandDriverLinux or InfiniBandDriverWindows VM extension to your deployment. Learn how to use these VM extensions with [Linux](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-hpc#rdma-capable-instances) and [Windows](https://docs.microsoft.com/azure/virtual-machines/windows/sizes-hpc#rdma-capable-instances).


## Manually install OFED

To manually configure InfiniBand with SR-IOV, use the following steps. These steps are general and can be used for any compatible operating system (OS). 

These steps are for RHEL/CentOS only. For Ubuntu (16.04 and 18.04), and SLES (12 SP4 and 15), the inbox drivers work well.

For more information on the supported distributions for the Mellanox driver, see the latest [Mellanox OpenFabrics drivers for ConnectX-5](https://www.mellanox.com/page/products_dyn?product_family=26).

See the following example for how to configure InfiniBand on Linux:

```bash
sudo yum install -y kernel-devel python-devel
sudo yum install -y redhat-rpm-config rpm-build gcc-gfortran gcc-c++
sudo yum install -y gtk2 atk cairo tcl tk createrepo
wget --retry-connrefused --tries=3 --waitretry=5 <Link to driver> #Example: http://content.mellanox.com/ofed/MLNX_OFED-4.5-1.0.1.0/MLNX_OFED_LINUX-4.5-1.0.1.0-rhel7.6-x86_64.tgz
tar zxvf <.tgx file> #Example: MLNX_OFED_LINUX-4.5-1.0.1.0-rhel7.6-x86_64.tgz
sudo <Location of driver> --add-kernel-support  #Example driver location: ./MLNX_OFED_LINUX-4.5-1.0.1.0-rhel7.6-x86_64/mlnxofedinstall
```

For Windows, download and install the WinOF-2 drivers for ConnectX-5 from [Mellanox](https://www.mellanox.com/page/products_dyn?product_family=32&menu_section=34).

## Next steps

Learn more about [HPC](https://docs.microsoft.com/azure/architecture/topics/high-performance-computing/) on Azure.
