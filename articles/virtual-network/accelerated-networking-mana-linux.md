---
title: Linux VMs with the Microsoft Azure Network Adapter
description: Learn how the Microsoft Azure Network Adapter can improve the networking performance of Linux VMs in Azure.
author: mattmcinnes
ms.service: virtual-network
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 07/10/2023
ms.author: mattmcinnes
---

# Linux VMs with the Microsoft Azure Network Adapter

Learn how to use the Microsoft Azure Network Adapter (MANA) to improve the performance and availability of Linux virtual machines (VMs) in Azure.

For Windows support, see [Windows VMs with the Microsoft Azure Network Adapter](./accelerated-networking-mana-windows.md).

For more info about MANA, see [Microsoft Azure Network Adapter overview](./accelerated-networking-mana-overview.md).

> [!IMPORTANT]
> MANA is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Supported Azure Marketplace images

Several Linux images from [Azure Marketplace](/marketplace/azure-marketplace-overview) have built-in support for the Ethernet driver in MANA:

- Ubuntu 20.04 LTS
- Ubuntu 22.04 LTS
- Red Hat Enterprise Linux 8.8
- Red Hat Enterprise Linux 9.2
- SUSE Linux Enterprise Server 15 SP4
- Debian 12 "Bookworm"
- Oracle Linux 9.0

> [!NOTE]
> None of the current Linux distributions in Azure Marketplace are on a 6.2 or later kernel, which is required for RDMA/InfiniBand and Data Plane Development Kit (DPDK). If you use an existing Linux image from Azure Marketplace, you need to update the kernel.

## Check the status of MANA support

Because the MANA feature set requires both host hardware and VM software components, you must perform the following checks to ensure that MANA is working properly on your VM.

### Azure portal check

Ensure that Accelerated Networking is enabled on at least one of your NICs:

1. On the Azure portal page for the VM, select **Networking** from the left menu.
1. On the **Networking settings** page, for **Network Interface**, select your NIC.
1. On the **NIC Overview** pane, under **Essentials**, note whether **Accelerated Networking** is set to **Enabled** or **Disabled**.

### Hardware check

When you enable Accelerated Networking, you can identify the underlying MANA NIC as a PCI device in the virtual machine:

```
$ lspci
7870:00:00.0 Ethernet controller: Microsoft Corporation Device 00ba
```

### Kernel version check

Verify that your VM has a MANA Ethernet driver installed:

```
$ grep /mana*.ko /lib/modules/$(uname -r)/modules.builtin || find /lib/modules/$(uname -r)/kernel -name mana*.ko*

kernel/drivers/net/ethernet/microsoft/mana/mana.ko
```

## Update the kernel

Ethernet drivers for MANA are included in kernel version 5.15 and later. Kernel version 6.2 includes Linux support for features such as InfiniBand/RDMA and DPDK. Earlier or forked kernel versions (5.15 and 6.1) require backported support.

To update your VM's Linux kernel, check the documentation for your specific distribution.

## Verify that traffic is flowing through MANA

Each virtual NIC (vNIC) that you configure for the VM, with Accelerated Networking enabled, results in two network interfaces in the VM. The following example shows `eth0` and `enP30832p0s0` in a single-NIC configuration:

```
$ ip link
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP mode DEFAULT group default qlen 1000
    link/ether 00:22:48:71:c2:8c brd ff:ff:ff:ff:ff:ff
    alias Network Device
3: enP30832p0s0: <BROADCAST,MULTICAST,CHILD,UP,LOWER_UP> mtu 1500 qdisc mq master eth0 state UP mode DEFAULT group default qlen 1000
    link/ether 00:22:48:71:c2:8c brd ff:ff:ff:ff:ff:ff
    altname enP30832s1296119428
```

The `eth0` interface is the primary port serviced by the Network Virtual Service Client (NetVSC) driver and the routable interface for the vNIC. The associated `enP*` interface represents the MANA Virtual Function (VF) and is bound to the `eth0` interface in this case. You can get the packet and byte count of the MANA VF from the routable `ethN` interface:

```
$ ethtool -S eth0 | grep -E "^[ \t]+vf"
     vf_rx_packets: 226418
     vf_rx_bytes: 99557501
     vf_tx_packets: 300422
     vf_tx_bytes: 76231291
     vf_tx_dropped: 0
```

## Next steps

- [TCP/IP performance tuning for Azure VMs](./virtual-network-tcpip-performance-tuning.md)
- [Proximity placement groups](../virtual-machines/co-location.md)
- [Monitoring Azure virtual networks](./monitor-virtual-network.md)
