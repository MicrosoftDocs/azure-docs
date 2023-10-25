---
title: Enable accelerated networking for Azure VM disaster recovery with Azure Site Recovery
description: Describes how to enable Accelerated Networking with Azure Site Recovery for Azure virtual machine disaster recovery
services: site-recovery
documentationcenter: ''
author: ankitaduttaMSFT
manager: gaggupta
ms.service: site-recovery
ms.topic: conceptual
ms.date: 03/27/2023
ms.author: ankitadutta
ms.custom: engagement-fy23

---
# Accelerated Networking with Azure virtual machine disaster recovery

Accelerated Networking enables single root I/O virtualization (SR-IOV) to a VM, greatly improving its networking performance. This high-performance path bypasses the host from the datapath, reducing latency, jitter, and CPU utilization, for use with the most demanding network workloads on supported VM types. The following picture shows communication between two VMs with and without accelerated networking:

:::image type="content" source="./media/azure-vm-disaster-recovery-with-accelerated-networking/accelerated-networking-benefit.png" alt-text="Screenshot of difference between accelerated and non-accelerated networking." lightbox="./media/azure-vm-disaster-recovery-with-accelerated-networking/accelerated-networking-benefit.png":::

Azure Site Recovery enables you to utilize the benefits of Accelerated Networking, for Azure virtual machines that are failed over to a different Azure region. This article describes how you can enable Accelerated Networking for Azure virtual machines replicated with Azure Site Recovery.

## Prerequisites

Before you begin, ensure that you understand:
-	Azure virtual machine [replication architecture](azure-to-azure-architecture.md)
-	[Setting up replication](azure-to-azure-tutorial-enable-replication.md) for Azure virtual machines
-	[Failing over](azure-to-azure-tutorial-failover-failback.md) Azure virtual machines

## Accelerated Networking with Windows VMs

Azure Site Recovery supports enabling Accelerated Networking for replicated virtual machines only if the source virtual machine has Accelerated Networking enabled. If your source virtual machine does not have Accelerated Networking enabled, you can learn how to enable Accelerated Networking for Windows virtual machines [here](../virtual-network/create-vm-accelerated-networking-powershell.md#enable-accelerated-networking-on-existing-vms).

### Supported operating systems
The following distributions are supported out of the box from the Azure Gallery:
* **Windows Server 2016 Datacenter**
* **Windows Server 2012 R2 Datacenter**

### Supported VM instances
Accelerated Networking is supported on most general purpose and compute-optimized instance sizes with 2 or more vCPUs.  These supported series are: D/DSv2 and F/Fs

On instances that support hyperthreading, Accelerated Networking is supported on VM instances with 4 or more vCPUs. Supported series are: D/DSv3, E/ESv3, Fsv2, and Ms/Mms

For more information on VM instances, see [Windows VM sizes](../virtual-machines/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

## Accelerated Networking with Linux VMs

Azure Site Recovery supports enabling Accelerated Networking for replicated virtual machines only if the source virtual machine has Accelerated Networking enabled. If your source virtual machine does not have Accelerated Networking enabled, you can learn how to enable Accelerated Networking for Linux virtual machines [here](../virtual-network/create-vm-accelerated-networking-cli.md#enable-accelerated-networking-on-existing-vms).

### Supported operating systems
The following distributions are supported out of the box from the Azure Gallery:
* **Ubuntu 16.04**
* **SLES 12 SP3**
* **RHEL 7.4**
* **CentOS 7.4**
* **CoreOS Linux**
* **Debian "Stretch" with backports kernel**
* **Oracle Linux 7.4**

### Supported VM instances
Accelerated Networking is supported on most general purpose and compute-optimized instance sizes with 2 or more vCPUs.  These supported series are: D/DSv2 and F/Fs

On instances that support hyperthreading, Accelerated Networking is supported on VM instances with 4 or more vCPUs. Supported series are: D/DSv3, E/ESv3, Fsv2, and Ms/Mms.

For more information on VM instances, see [Linux VM sizes](../virtual-machines/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

## Enabling Accelerated Networking for replicated VMs

When you [enable replication](azure-to-azure-tutorial-enable-replication.md) for Azure virtual machines, Site Recovery will automatically detect whether the virtual machine network interfaces have Accelerated Networking enabled. If Accelerated Networking is already enabled, Site Recovery will automatically configure Accelerated Networking on the network interfaces of the replicated virtual machine.

The status of Accelerated Networking can be verified under the respective NIC's Tab in the **Network** settings for the replicated virtual machine.

:::image type="content" source="./media/azure-vm-disaster-recovery-with-accelerated-networking/compute-network-accelerated-networking.png" alt-text="Screenshot of Accelerated Networking setting." lightbox="./media/azure-vm-disaster-recovery-with-accelerated-networking/compute-network-accelerated-networking.png":::



If you have enabled Accelerated Networking on the source virtual machine after enabling replication, you can enable Accelerated Networking for the replicated virtual machine's network interfaces by the following process:
1. Open **Network** settings for the replicated virtual machine
2. Click on the name of the network interface under the **Network interfaces** section
3. Select **Enabled** from the dropdown for Accelerated Networking under the **Target** column

:::image type="content" source="./media/azure-vm-disaster-recovery-with-accelerated-networking/network-interface-accelerated-networking-enabled.png" alt-text="Screenshot of Enable Accelerated Networking." lightbox="./media/azure-vm-disaster-recovery-with-accelerated-networking/network-interface-accelerated-networking-enabled.png":::


The above process should also be followed for existing replicated virtual machines, that did not previously have Accelerated Networking enabled automatically by Site Recovery.

## Next steps
- Learn more about [benefits of Accelerated Networking](../virtual-network/accelerated-networking-overview.md#benefits).
- Learn more about limitations and constraints of Accelerated Networking for [Windows virtual machines](../virtual-network/accelerated-networking-overview.md#limitations-and-constraints) and [Linux virtual machines](../virtual-network/accelerated-networking-overview.md#limitations-and-constraints).
- Learn more about [recovery plans](site-recovery-create-recovery-plans.md) to automate application failover.
