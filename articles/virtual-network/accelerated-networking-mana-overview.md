---
title: Microsoft Azure Network Adapter (MANA) overview
description: Learn how the Microsoft Azure Network Adapter can improve the networking performance of Azure VMs.
author: mattmcinnes
ms.service: virtual-network
ms.topic: how-to
ms.date: 07/10/2023
ms.author: mattmcinnes
---

# Microsoft Azure Network Adapter overview

Learn how to use the Microsoft Azure Network Adapter (MANA) component of Azure Boost to improve the performance and availability of virtual machines (VMs) in Azure. MANA is a next-generation network interface that provides stable forward-compatible device drivers for Windows and Linux operating systems. MANA hardware and software are engineered by Microsoft and take advantage of the latest advancements in cloud networking technology.

> [!IMPORTANT]
> MANA is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Compatibility

MANA supports several VM operating systems. Although your VM might be running a supported operating system, you might need to update the kernel (Linux) or install drivers (Windows).

MANA maintains feature parity with previous Azure networking features. VMs run on hardware with both Mellanox and MANA NICs, so existing `mlx4` and `mlx5` support still need to be present.

### Supported Azure Marketplace images

Several [Azure Marketplace](/marketplace/azure-marketplace-overview) images have built-in support for the Ethernet driver in MANA.

#### Linux

- Ubuntu 20.04 LTS
- Ubuntu 22.04 LTS
- Red Hat Enterprise Linux 8.8
- Red Hat Enterprise Linux 9.2
- SUSE Linux Enterprise Server 15 SP4
- Debian 12 "Bookworm"
- Oracle Linux 9.0

> [!NOTE]
> None of the current Linux distributions in Azure Marketplace are on a 6.2 or later kernel, which is required for RDMA/InfiniBand and Data Plane Development Kit (DPDK). If you use an existing Linux image from Azure Marketplace, you need to update the kernel.

#### Windows

- Windows Server 2016
- Windows Server 2019
- Windows Server 2022

### Custom images and legacy VMs

To maximize performance, we recommend using an operating system that supports MANA. If the operating system doesn't support MANA, network connectivity is provided through the hypervisor's virtual switch. The virtual switch is also used during some infrastructure servicing events where the Virtual Function (VF) is revoked.

### DPDK on MANA hardware

For information about using DPDK on MANA hardware, see [Microsoft Azure Network Adapter and DPDK on Linux](setup-dpdk-mana.md).

## Evaluating performance

Differences in VM types, operating systems, applications, and tuning parameters can affect network performance in Azure. For this reason, we recommend that you benchmark and test your workloads to achieve the expected network performance.

For information on testing and optimizing network performance in Azure, see [TCP/IP performance tuning for Azure VMs](/azure/virtual-network/virtual-network-tcpip-performance-tuning) and [Virtual machine network bandwidth](/azure/virtual-network/virtual-machine-network-throughput).

## Getting started with MANA

Tutorials for each supported OS type are available to help you get started:

- For Linux support, see [Linux VMs with Azure MANA](./accelerated-networking-mana-linux.md).
- For Windows support, see [Windows VMs with Azure MANA](./accelerated-networking-mana-windows.md).

## Next steps

- [TCP/IP performance tuning for Azure VMs](./virtual-network-tcpip-performance-tuning.md)
- [Proximity placement groups](../virtual-machines/co-location.md)
- [Monitoring Azure virtual networks](./monitor-virtual-network.md)
