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

To get started with IaaS VMs for HPC, the simplest solution is to use the [CentOS-HPC 7.6 VM OS image](https://techcommunity.microsoft.com/t5/Azure-Compute/CentOS-HPC-VM-Image-for-SR-IOV-enabled-Azure-HPC-VMs/ba-p/665557), which is already configured with InfiniBand. Since this image is already configured with InfiniBand, you don't have to configure it manually. 

If you're using a custom VM image or a [GPU optimized](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-gpu) VM, you should configure it with InfiniBand by adding the InfiniBandDriverLinux or InfiniBandDriverWindows VM extension to your deployment. Learn how to use these VM extensions with [Linux](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-hpc#rdma-capable-instances) and [Windows](https://docs.microsoft.com/azure/virtual-machines/windows/sizes-hpc#rdma-capable-instances).

## Manually install Mellanox OFED

To manually configure InfiniBand with SR-IOV, use the following steps. The example in these steps shows syntax for RHEL/CentOS, but the steps are general and can be used for any compatible operating system such as Ubuntu (16.04, 18.04 19.04) and SLES (12 SP4 and 15). The inbox drivers work as well, but the Mellanox OpenFabrics drivers provide more features.

For more information on the supported distributions for the Mellanox driver, see the latest [Mellanox OpenFabrics drivers](https://www.mellanox.com/page/products_dyn?product_family=26). For more information on the Mellanox OpenFabrics driver, see the [Mellanox user guide](https://docs.mellanox.com/category/mlnxofedib). 

See the following example for how to configure InfiniBand on Linux:

```bash
sudo yum install -y kernel-devel python-devel
sudo yum install -y redhat-rpm-config rpm-build gcc-gfortran gcc-c++
sudo yum install -y gtk2 atk cairo tcl tk createrepo
wget <Link to driver> #Example: https://www.mellanox.com/downloads/ofed/MLNX_OFED-4.7-1.0.0.1/MLNX_OFED_LINUX-4.7-1.0.0.1-rhel7.6-x86_64.tgz
tar zxvf <.tgx file> #Example: MLNX_OFED_LINUX-4.7-1.0.0.1-rhel7.6-x86_64.tgz
sudo <Script> --add-kernel-support  #Example script: ./MLNX_OFED_LINUX-4.5-1.0.1.0-rhel7.6-x86_64/mlnxofedinstall
```

For Windows, download and install the [Mellanox OFED for Windows drivers](https://www.mellanox.com/page/products_dyn?product_family=32&menu_section=34).

## Enable IP over InfiniBand

Use the following commands to enable IP over InfiniBand.

```bash
sudo sed -i -e 's/# OS.EnableRDMA=y/OS.EnableRDMA=y/g' /etc/waagent.conf
sudo systemctl restart waagent
```

## Next steps

Learn more about [HPC](https://docs.microsoft.com/azure/architecture/topics/high-performance-computing/) on Azure.
