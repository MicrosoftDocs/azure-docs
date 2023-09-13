---
title: Microsoft Azure Network Adapter (MANA) overview
description: Learn how the Microsoft Azure Network Adapter can improve the networking performance of Azure VMs.
author: mattmcinnes
ms.service: virtual-network
ms.topic: how-to
ms.date: 07/10/2023
ms.author: mattmcinnes
---

# Microsoft Azure Network Adapter (MANA) overview

Learn how to use the Microsoft Azure Network Adapter (MANA) to improve the performance and availability of virtual machines in Azure. MANA is a next-generation network interface that provides stable forward-compatible device drivers for Windows and Linux operating systems. MANA hardware and software are engineered by Microsoft and take advantage of the latest advancements in cloud networking technology.

> [!IMPORTANT]
> Azure MANA is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Compatibility
Azure MANA supports several VM operating systems. While your VM might be running a supported OS, you may need to update the kernel (Linux) or install drivers (Windows). 

MANA maintains feature-parity with previous Azure networking features. VMs run on hardware with both Mellanox and MANA NICs, so existing 'mlx4' and 'mlx5' support still need to be present.

### Supported Marketplace Images
Several [Azure Marketplace](/marketplace/azure-marketplace-overview) images have built-in support for Azure MANA's ethernet driver. 

#### Linux:
- Ubuntu 20.04 LTS
- Ubuntu 22.04 LTS
- Red Hat Enterprise Linux 8.8
- Red Hat Enterprise Linux 9.2
- SUSE Linux Enterprise Server 15 SP4
- Debian 12 “Bookworm”
- Oracle Linux 9.0

>[!NOTE]
>None of the current Linux distros in Azure Marketplace are on a 6.2 or later kernel, which is required for RDMA/InfiniBand and DPDK. If you use an existing Marketplace Linux image, you will need to update the kernel.

#### Windows:
- Windows Server 2016
- Windows Server 2019
- Windows Server 2022

### Custom images and legacy VMs
We recommend using an operating system with support for MANA to maximize performance. In instances where the operating system doesn't or can't support MANA, network connectivity is provided through the hypervisor’s virtual switch. The virtual switch is also used during some infrastructure servicing events where the Virtual Function (VF) is revoked. 

### Using DPDK
For information about DPDK on MANA hardware, see [Microsoft Azure Network Adapter (MANA) and DPDK on Linux](setup-dpdk-mana.md)

## Evaluating performance
Differences in VM SKUs, operating systems, applications, and tuning parameters can all affect network performance on Azure. For this reason, we recommend that you benchmark and test your workloads to ensure you achieve the expected network performance. 
See the following documents for information on testing and optimizing network performance in Azure.
Look into [TCP/IP performance tuning](/azure/virtual-network/virtual-network-tcpip-performance-tuning) and more info on [VM network throughput](/azure/virtual-network/virtual-machine-network-throughput)

## Start using Azure MANA
Tutorials for each supported OS type are available for you to get started:

For Linux support, see [Linux VMs with Azure MANA](./accelerated-networking-mana-linux.md)

For Windows support, see [Windows VMs with Azure MANA](./accelerated-networking-mana-windows.md)

## Next Steps

- [TCP/IP Performance Tuning for Azure VMs](./virtual-network-tcpip-performance-tuning.md)
- [Proximity Placement Groups](../virtual-machines/co-location.md)
- [Monitor Virtual Network](./monitor-virtual-network.md)
