---
title: 'Azure Premium Storage: Design for performance on Windows VMs | Microsoft Docs'
description: Design high-performance applications using Azure Premium Storage. Premium Storage offers high-performance, low-latency disk support for I/O-intensive workloads running on Azure Virtual Machines.
services: "virtual-machines-linux,storage"
author: roygara
ms.service: virtual-machines-linux
ms.tgt_pltfrm: linux
ms.topic: article
ms.date: 06/27/2017
ms.author: rogarana
ms.subservice: disks
---
[!INCLUDE [virtual-machines-common-premium-storage-introduction](../../../includes/virtual-machines-common-premium-storage-introduction.md)]

> [!NOTE]
> Sometimes, what appears to be a disk performance issue is actually a network bottleneck. In these situations, you should optimize your [network performance](../../virtual-network/virtual-network-optimize-network-bandwidth.md).
>
> If you are looking to benchmark your disk, see our article on [Benchmarking a disk](disks-benchmarks.md).
>
> If your VM supports accelerated networking, you should make sure it is enabled. If it is not enabled, you can enable it on already deployed VMs on both [Windows](../../virtual-network/create-vm-accelerated-networking-powershell.md#enable-accelerated-networking-on-existing-vms) and [Linux](../../virtual-network/create-vm-accelerated-networking-cli.md#enable-accelerated-networking-on-existing-vms).

Before you begin, if you are new to Premium Storage, first read the [Select an Azure disk type for IaaS VMs](disks-types.md) and [Azure Storage scalability and performance targets for storage accounts](../../storage/common/storage-scalability-targets.md).


[!INCLUDE [virtual-machines-common-premium-storage-performance.md](../../../includes/virtual-machines-common-premium-storage-performance.md)]
