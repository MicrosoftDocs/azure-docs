---
title: Linux VMs with Azure MANA
description: Learn how the Microsoft Azure Network Adapter can improve the networking performance of Linux VMs on Azure.
author: mattmcinnes
ms.service: virtual-network
ms.topic: how-to
ms.date: 07/10/2023
ms.author: mattmcinnes
---

# Linux VMs with Azure MANA

Learn how to use the Microsoft Azure Network Adapter (MANA) to improve the performance and availability of Linux virtual machines in Azure.

For Windows support, see [Windows VMs with Azure MANA](./accelerated-networking-mana-windows.md)

For more info regarding Azure MANA, see [Microsoft Azure Network Adapter (MANA) overview](./accelerated-networking-mana-overview.md)

> [!IMPORTANT]
> Azure MANA is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Supported Marketplace Images
Several [Azure marketplace](/marketplace/azure-marketplace-overview) Linux images have built-in support for Azure MANA's ethernet driver.

- Ubuntu 20.04 LTS
- Ubuntu 22.04 LTS
- Red Hat Enterprise Linux 8.8
- Red Hat Enterprise Linux 9.2
- SUSE Linux Enterprise Server 15 SP4
- Debian 12 “Bookworm”
- Oracle Linux 9.0

>[!NOTE]
>None of the current Linux distros in Azure Marketplace are on a 6.2 or later kernel, which is required for RDMA/InfiniBand and DPDK. If you use an existing Marketplace Linux image, you will need to update the kernel.

## Check status of MANA support
Because Azure MANA's feature set requires both host hardware and VM software components, there are several checks required to ensure MANA is working properly

### Azure portal check

Ensure that you have Accelerated Networking enabled on at least one of your NICs:
1.	From the Azure portal page for the VM, select Networking from the left menu.
1.	On the Networking settings page, select the Network Interface.
1.	On the NIC Overview page, under Essentials, note whether Accelerated networking is set to Enabled or Disabled.

### Hardware check

When Accelerated Networking is enabled, the underlying MANA NIC can be identified as a PCI device in the Virtual Machine.

```
$ lspci
7870:00:00.0 Ethernet controller: Microsoft Corporation Device 00ba
```

### Kernel version check
Verify your VM has a MANA Ethernet driver installed.

```
$ grep /mana*.ko /lib/modules/$(uname -r)/modules.builtin || find /lib/modules/$(uname -r)/kernel -name mana*.ko*

kernel/drivers/net/ethernet/microsoft/mana/mana.ko
```

## Kernel update

Ethernet drivers for MANA are included in kernel 5.15 and up. Linux support for features such as InfiniBand/RDMA and DPDK are included in kernel 6.2. Prior or forked kernel versions (5.15 and 6.1) require backported support.

To update your VM's Linux kernel, check the docs for your specific distro.

## Verify traffic is flowing through the MANA adapter

Each vNIC configured for the VM with Accelerated Networking enabled will result in two network interfaces in the VM. For example, eth0 and enP30832p0s0 a single-NIC configuration:

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

The eth0 interface is the primary port serviced by the netvsc driver and the routable interface for the vNIC. The associated enP* interface represents the MANA Virtual Function (VF) and is bound to the eth0 interface in this case. You can get packet and byte count of the MANA Virtual Function (VF) from the routable ethN interface:
```
$ ethtool -S eth0 | grep -E "^[ \t]+vf"
     vf_rx_packets: 226418
     vf_rx_bytes: 99557501
     vf_tx_packets: 300422
     vf_tx_bytes: 76231291
     vf_tx_dropped: 0
```

## Next Steps

- [TCP/IP Performance Tuning for Azure VMs](./virtual-network-tcpip-performance-tuning.md)
- [Proximity Placement Groups](../virtual-machines/co-location.md)
- [Monitor Virtual Network](./monitor-virtual-network.md)
