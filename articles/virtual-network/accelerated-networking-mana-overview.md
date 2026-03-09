---
title: Microsoft Azure Network Adapter (MANA) overview
description: Learn how the Microsoft Azure Network Adapter can improve the networking performance of Azure VMs.
author: mattmcinnes
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 09/04/2025
ms.author: mattmcinnes
# Customer intent: As a cloud administrator, I want to implement the Azure Network Adapter to optimize networking performance for my virtual machines, so that I can ensure better stability and availability in our cloud infrastructure.
---

# Microsoft Azure Network Adapter overview

Learn how to use the Microsoft Azure Network Adapter (MANA) component of Azure Boost to improve the performance and availability of virtual machines (VMs) in Azure. MANA is a next-generation network interface that provides stable forward-compatible device drivers for Windows and Linux operating systems. MANA hardware and software are engineered by Microsoft and take advantage of the latest advancements in cloud networking technology.

## Compatibility

MANA supports several VM operating systems. Although your VM might be running a supported operating system, you might need to update the kernel (Linux) or install drivers (Windows) to leverage MANA or the latest features. 

MANA maintains feature parity with previous Azure networking features. VMs run on hardware with both Mellanox and MANA NICs, so existing `mlx4` and `mlx5` support still needs to be present.

For operating system support see [Azure Accelerated Networking Overview](accelerated-networking-overview.md).

### Custom images and legacy VMs

To maximize performance, we recommend using an operating system that supports MANA. If the operating system doesn't support MANA, network connectivity is provided through the hypervisor's virtual switch. The virtual switch is also used during some infrastructure servicing events where the Virtual Function (VF) is revoked.

### DPDK on MANA hardware

For information about using DPDK on MANA hardware, see [Microsoft Azure Network Adapter and DPDK on Linux](setup-dpdk-mana.md).

> [!NOTE]
> A 6.2 or later kernel is required for RDMA/InfiniBand and Data Plane Development Kit (DPDK). If you use an earlier Linux image from Azure Marketplace, you need to update the kernel.

## Evaluating performance

Differences in VM types, operating systems, applications, and tuning parameters can affect network performance in Azure. For this reason, we recommend that you benchmark and test your workloads to achieve the expected network performance.

For information on testing and optimizing network performance in Azure, see [TCP/IP performance tuning for Azure VMs](/azure/virtual-network/virtual-network-tcpip-performance-tuning) and [Virtual machine network bandwidth](/azure/virtual-network/virtual-machine-network-throughput).

## Getting started with MANA

Tutorials for each supported OS type are available to help you get started:

- For Linux support, see [Linux VMs with Azure MANA](./accelerated-networking-mana-linux.md).
- For Windows support, see [Windows VMs with Azure MANA](./accelerated-networking-mana-windows.md).

## Next steps

- [TCP/IP performance tuning for Azure VMs](./virtual-network-tcpip-performance-tuning.md)
- [Proximity placement groups](/azure/virtual-machines/co-location)
- [Monitoring Azure virtual networks](./monitor-virtual-network.md)
