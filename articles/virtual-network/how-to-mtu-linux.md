---
title: Configure MTU for Linux Virtual Machines in Azure
titleSuffix: Azure Virtual Network
description: Get started with this how-to article to configure Maximum Transmission Unit (MTU) for Linux in Azure.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.topic: how-to
ms.date: 02/27/2024

#customer intent: As a network administrator, I want to change the MTU for my Linux or Windows virtual machine so that I can optimize network performance.

---

# Configure Maximum Transmission Unit (MTU) for Linux Virtual Machines in Azure

The Maximum Transmission Unit, or MTU, is a measurement representing the largest size ethernet frame (packet) that can be transmitted by a network device or interface. If a packet exceeds the largest size accepted by the device, it is fragmented into multiple smaller packets, then later reassembled at the destination. 

Fragmentation and reassembly can introduce performance and ordering issues, resulting in a suboptimal experience. Optimizing MTU for your solution can provide network bandwidth performance benefits by reducing the total number of packets required to send a dataset.  

The MTU is a configurable setting in a virtual machine's operating system. The default value MTU setting in Azure is 1500 bytes. 

VMs in Azure can support larger MTUs than the 1500 byte default only for traffic that stays within the virtual network.

The following table shows the largest MTU size supported on the Azure Network Interfaces available in Azure:

| Operating System | Network Interface | Largest MTU for inter virtual network traffic |
|------------------|-------------------|-----------------------------------------------|
| Linux | Mellanox Cx3, Cx4, Cx5 | 3900 |
| Linux | (Preview) Microsoft Azure Network Adapter | 9000 |

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

- Two Linux virtual machines in the same virtual network in Azure. For more information about creating a Linux virtual machine, see [Create a Linux virtual machine in the Azure portal](/azure/virtual-machines/linux/quick-create-portal).

    - For the purposes of this article, the virtual machines are named **vm-1** and **vm-2**. Replace these values with your values.

## Precautions

- Virtual machines in Azure can support larger MTUs than the 1500 byte default only for traffic that stays within the virtual network. Larger MTUs are not supported for scenarios outside of inter-virtual network and VM-to-VM traffic, such as traffic traversing through gateways, peering’s, or to the internet. Configuring a larger MTU may result in fragmentation and reduction in performance. For traffic utilizing these scenarios we recommend utilizing the default 1500 byte MTU or testing to ensure that a larger MTU is supported across the entire network path. 

- Optimal MTU is Operating System, network, and application specific. The maximal supported MTU may not be optimal for your use case.

- Always test MTU settings changes in a non-critical environment first before applying broadly or to critical environments.

## Path MTU discovery

A shell script is used to determine the largest MTU size that can be used for a specific network path. The script uses ICMP ping to determine the maximum frame size that can be sent between the source and destination.

Use the following steps to determine the largest MTU size that can be used for a specific network path:

1. Sign-in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **Virtual machines** and select **Virtual machines** from the search results.

1. Select **vm-2**.

1. In the **Overview** of **vm-2**, determine the private IP address of the virtual machine. 


## Change MTU size on a Linux virtual machine

Use the following steps to change the MTU size on a Linux virtual machine:

1. Sign-in to your Linux virtual machine.

1. Use the `ip` commmand to show the current network interfaces and their MTU settings:

```bash
ip link show
```

```output
azureuser@vm-linux:~$ ip link show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP mode DEFAULT group default qlen 1000
    link/ether 00:0d:3a:00:bd:77 brd ff:ff:ff:ff:ff:ff
3: enP1328s1: <BROADCAST,MULTICAST,SLAVE,UP,LOWER_UP> mtu 1500 qdisc mq master eth0 state UP mode DEFAULT group default qlen 1000
    link/ether 00:0d:3a:00:bd:77 brd ff:ff:ff:ff:ff:ff
    altname enP1328p0s2
```

In this example the MTU is set at 1500 and the name of the network interface is **eth0**.

1. Execute the script you copy and pasted earlier to determine the MTU size:

```bash
./LinuxVmUtilities.sh
```

1. 

## Related content

* [Related article title](link.md)
* [Related article title](link.md)
* [Related article title](link.md)
