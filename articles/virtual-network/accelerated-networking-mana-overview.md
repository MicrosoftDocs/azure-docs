---
title: Azure Boost - Microsoft Azure Network Adapter (MANA) overview
description: Learn how Azure Boost (MANA) Accelerated Networking can improve the networking performance of Azure VMs.
author: mattmcinnes
ms.service: virtual-network
ms.topic: how-to
ms.date: 07/05/2023
ms.author: mattmcinnes
---

# Azure Boost - Microsoft Azure Network Adapter (MANA) overview

Learn how to use the Microsoft Azure Network Adapter (MANA) to improve the performance and availability of virtual machines in Azure. MANA is a next-generation network interface that provides stable forward-compatible device drivers for Windows and Linux operating systems. MANA hardware and software are engineered by Microsoft and take advantage of the latest advancements in cloud networking technology.

>[!NOTE]
>Azure Boost (MANA) is currently part of the Azure Boost Preview. See the [preview announcement](https://aka.ms/azureboostpreview) for more information and to join.

## Compatibility
Azure Boost (MANA) supports several VM operating systems. While your VM might be running a supported OS, you need to update the kernel (Linux), update the OS (FreeBSD) or install drivers (Windows). 

MANA maintains feature-parity with previous Azure networking features. VMs can still run on hardware with both Mellanox and MANA NICs, so existing 'mlx4' and 'mlx5' drivers still need to be installed.

### Supported Marketplace Images
Several [Azure Marketplace](https://learn.microsoft.com/en-us/marketplace/azure-marketplace-overview) images have built-in support for Azure MANA's ethernet driver. 

>[!NOTE]
>None of the current Linux distros in Azure are on a 6.2 or later kernel, which is required for RDMA/InfiniBand and DPDK support. If you use an existing Marketplace Linux image, you will need to update the kernel.

#### Linux:
- Ubuntu 20.04 LTS, 22.04 LTS
- Red Hat Enterprise Linux 8.8
- Red Hat Enterprise Linux 9.2
- SUSE Linux Enterprise Server 15 SP4
- Debian 12 “Bookworm”
- Oracle Linux 9.0

#### Windows:
- Windows Server 2016
- Windows Server 2019
- Windows Server 2022

### Custom images and legacy VMs
We recommend using an operating system with support for MANA to maximize performance with Azure Boost. However, in instances where the operating system doesn't or can't support MANA, network connectivity is provided through the hypervisor’s virtual switch. The virtual switch is also used during some infrastructure servicing events where the Virtual Function (VF) is revoked. 

### DPDK Support
Utilizing DPDK on MANA hardware requires the Linux kernel 6.2 or later or a backport of the Ethernet and InfiniBand drivers from the latest Linux kernel. It also requires specific versions of DPDK and user-space drivers.

DPDK requires the following set of drivers:
1.	[Linux kernel Ethernet driver](https://github.com/torvalds/linux/tree/master/drivers/net/ethernet/microsoft/mana) (5.15 kernel and later)
1.	[Linux kernel InfiniBand driver](https://github.com/torvalds/linux/tree/master/drivers/infiniband/hw/mana) (6.2 kernel and later)
1.	[DPDK MANA poll-mode driver](https://github.com/DPDK/dpdk/tree/main/drivers/net/mana) (DPDK 22.11 and later)
1.	[Libmana user-space drivers](https://github.com/linux-rdma/rdma-core/tree/master/providers/mana) (rdma-core v44 and later)

Microsoft only supports DPDK on Linux.

## Evaluating performance
Differences in VM SKUs, operating systems, applications, and tuning parameters can all affect network performance on Azure. For this reason, we recommend that you benchmark and test your workloads to ensure you achieve the expected network performance. 
See the following documents for information on testing and optimizing network performance in Azure.
Look into [TCP/IP performance tuning](/azure/virtual-network/virtual-network-tcpip-performance-tuning) and more info on [VM network throughput](/azure/virtual-network/virtual-machine-network-throughput)
