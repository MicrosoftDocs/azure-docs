---
title: How Accelerated Networking works in Linux and FreeBSD VMs
description: Learn how Accelerated Networking works in Linux and FreeBSD VMs.
author: steveesp
ms.service: virtual-network
ms.topic: how-to
ms.tgt_pltfrm: vm-linux
ms.custom: devx-track-linux
ms.workload: infrastructure
ms.date: 04/18/2023
ms.author: steveesp
---

# How Accelerated Networking works in Linux and FreeBSD VMs

When a virtual machine (VM) is created in Azure, a synthetic network interface is created for each virtual NIC in its configuration. The synthetic interface is a VMbus device and uses the netvsc driver. Network packets that use this synthetic interface flow through the virtual switch in the Azure host and onto the datacenter's physical network.

If the VM is configured with Accelerated Networking, a second network interface is created for each virtual NIC that's configured. The second interface is an SR-IOV virtual function (VF) offered by the physical network's NIC in the Azure host. The VF interface shows up in the Linux guest as a PCI device. It uses the Mellanox mlx4 or mlx5 driver in Linux, because Azure hosts use physical NICs from Mellanox.

Most network packets go directly between the Linux guest and the physical NIC without traversing the virtual switch or any other software that runs on the host. Because of the direct access to the hardware, network latency is lower and less CPU time is used to process network packets, when compared with the synthetic interface.

Different Azure hosts use different models of Mellanox physical NIC. Linux automatically determines whether to use the mlx4 or mlx5 driver. The Azure infrastructure controls the placement of the VM on the Azure host. With no customer option to specify which physical NIC a VM deployment uses, the VMs must include both drivers. If a VM is stopped or deallocated and then restarted, it might be redeployed on hardware with a different model of Mellanox physical NIC. Therefore, it might use the other Mellanox driver.

If a VM image doesn't include a driver for the Mellanox physical NIC, networking capabilities continue to work at the slower speeds of the virtual NIC. The portal, the Azure CLI, and Azure PowerShell display the Accelerated Networking feature as _enabled_.

FreeBSD provides the same support for Accelerated Networking as Linux when it's running in Azure. The remainder of this article describes Linux and uses Linux examples, but the same functionality is available in FreeBSD.

> [!NOTE]
> This article contains references to the term *slave*, a term that Microsoft no longer uses. When this term is removed from the software, we'll remove it from this article.

## Bonding

The synthetic network interface and VF interface are automatically paired and act as a single interface in most aspects used by applications. The netvsc driver does the bonding. Depending on the Linux distribution, udev rules and scripts might help in naming the VF interface and in configuring the network.

If the VM is configured with multiple virtual NICs, the Azure host provides a unique serial number for each one. It allows Linux to do the proper pairing of synthetic and VF interfaces for each virtual NIC.

The synthetic and VF interfaces have the same MAC address. Together, they constitute a single NIC from the standpoint of other network entities that exchange packets with the virtual NIC in the VM. Other entities don't take any special action because of the existence of both the synthetic interface and the VF interface.

Both interfaces are visible via the `ifconfig` or `ip addr` command in Linux. Here's an example `ifconfig` output:

```output
U1804:~$ ifconfig 
enP53091s1np0: flags=6211<UP,BROADCAST,RUNNING,SLAVE,MULTICAST>  mtu 1500 
ether 00:0d:3a:f5:76:bd  txqueuelen 1000  (Ethernet) 
RX packets 365849  bytes 413711297 (413.7 MB) 
RX errors 0  dropped 0  overruns 0  frame 0 
TX packets 9447684  bytes 2206536829 (2.2 GB) 
TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0 
 
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500 
inet 10.1.19.4  netmask 255.255.255.0  broadcast 10.1.19.255 
inet6 fe80::20d:3aff:fef5:76bd  prefixlen 64  scopeid 0x20<link> 
ether 00:0d:3a:f5:76:bd  txqueuelen 1000  (Ethernet) 
RX packets 8714212  bytes 4954919874 (4.9 GB) 
RX errors 0  dropped 0  overruns 0  frame 0 
TX packets 9103233  bytes 2183731687 (2.1 GB) 
TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0 
```

The synthetic interface always has a name in the form `eth\<n\>`. Depending on the Linux distribution, the VF interface might have a name in the form `eth\<n\>`. Or it might have a name in a different form because of a udev rule that does renaming.

You can determine whether a particular interface is the synthetic interface or the VF interface by using the shell command line that shows the device driver that the interface uses:

```output
$ ethtool -i <interface name> | grep driver 
```

If the driver is `hv_netvsc`, it's the synthetic interface. The VF interface has a driver name that contains "mlx." The VF interface is also identifiable because its `flags` field includes `SLAVE`. This flag indicates that it's under the control of the synthetic interface that has the same MAC address.

IP addresses are assigned only to the synthetic interface. The output of `ifconfig` or `ip addr` also shows this distinction.

## Application usage

Applications should interact only with the synthetic interface, just like in any other networking environment. Outgoing network packets are passed from the netvsc driver to the VF driver and then transmitted through the VF interface.

Incoming packets are received and processed on the VF interface before being passed to the synthetic interface. Exceptions are incoming TCP SYN packets and broadcast/multicast packets processed by the synthetic interface only.

You can verify that packets are flowing over the VF interface from the output of `ethtool -S eth\<n\>`. The output lines that contain `vf` show the traffic over the VF interface. For example:

```output
U1804:~# ethtool -S eth0 | grep ' vf_' 
 vf_rx_packets: 111180 
 vf_rx_bytes: 395460237 
 vf_tx_packets: 9107646 
 vf_tx_bytes: 2184786508 
 vf_tx_dropped: 0 
```

If these counters are incrementing on successive execution of the `ethtool` command, network traffic is flowing over the VF interface.

You can verify the existence of the VF interface as a PCI device by using the `lspci` command. For example, on the Generation 1 VM, you might get output similar to the following output. (Generation 2 VMs don't have the legacy PCI devices.)

```output
U1804:~# lspci 
0000:00:00.0 Host bridge: Intel Corporation 440BX/ZX/DX - 82443BX/ZX/DX Host bridge (AGP disabled) (rev 03) 
0000:00:07.0 ISA bridge: Intel Corporation 82371AB/EB/MB PIIX4 ISA (rev 01) 
0000:00:07.1 IDE interface: Intel Corporation 82371AB/EB/MB PIIX4 IDE (rev 01) 
0000:00:07.3 Bridge: Intel Corporation 82371AB/EB/MB PIIX4 ACPI (rev 02) 
0000:00:08.0 VGA compatible controller: Microsoft Corporation Hyper-V virtual VGA 
cf63:00:02.0 Ethernet controller: Mellanox Technologies MT27710 Family [ConnectX-4 Lx Virtual Function] (rev 80) 
```

In this example, the last line of output identifies a VF from the Mellanox ConnectX-4 physical NIC.

The `ethtool -l` or `ethtool -L` command (to get and set the number of transmit and receive queues) is an exception to the guidance to interact with the `eth<n>` interface. You can use this command directly against the VF interface to control the number of queues for the VF interface. The number of queues for the VF interface is independent of the number of queues for the synthetic interface.

## Interpreting startup messages

During startup, Linux shows many messages related to the initialization and configuration of the VF interface. It also shows information about the bonding with the synthetic interface. Understanding these messages can be helpful in identifying any problems in the process.  

Here's example output from the `dmesg` command, trimmed to just the lines that are relevant to the VF interface. Depending on the Linux kernel version and distribution in your VM, the messages might vary slightly, but the overall flow is the same.

```output
[    2.327663] hv_vmbus: registering driver hv_netvsc 
[    3.918902] hv_netvsc 000d3af5-76bd-000d-3af5-76bd000d3af5 eth0: VF slot 1 added 
```

The netvsc driver for `eth0` has been registered.

```output
[    6.944883] hv_vmbus: registering driver hv_pci 
```

The VMbus virtual PCI driver has been registered. This driver provides core PCI services in a Linux VM in Azure. You must register it before the VF interface can be detected and configured.

```output
[    6.945132] hv_pci e9ac9b28-cf63-4466-9ae3-4b849c3ee03b: PCI VMBus probing: Using version 0x10002 
[    6.947953] hv_pci e9ac9b28-cf63-4466-9ae3-4b849c3ee03b: PCI host bridge to bus cf63:00 
[    6.947955] pci_bus cf63:00: root bus resource [mem 0xfe0000000-0xfe00fffff window] 
[    6.948805] pci cf63:00:02.0: [15b3:1016] type 00 class 0x020000 
[    6.957487] pci cf63:00:02.0: reg 0x10: [mem 0xfe0000000-0xfe00fffff 64bit pref] 
[    7.035464] pci cf63:00:02.0: enabling Extended Tags 
[    7.040811] pci cf63:00:02.0: 0.000 Gb/s available PCIe bandwidth, limited by Unknown x0 link at cf63:00:02.0 (capable of 63.008 Gb/s with 8.0 GT/s PCIe x8 link) 
[    7.041264] pci cf63:00:02.0: BAR 0: assigned [mem 0xfe0000000-0xfe00fffff 64bit pref] 
```

The PCI device with the listed GUID (assigned by the Azure host) has been detected. It's assigned a PCI domain ID (0xcf63 in this case) based on the GUID. The PCI domain ID must be unique across all PCI devices available in the VM. This uniqueness requirement spans other Mellanox VF interfaces, GPUs, NVMe devices, and other devices that might be present in the VM.

```output
[    7.128515] mlx5_core cf63:00:02.0: firmware version: 14.25.8362 
[    7.139925] mlx5_core cf63:00:02.0: handle_hca_cap:524:(pid 12): log_max_qp value in current profile is 18, changing it to HCA capability limit (12) 
[    7.342391] mlx5_core cf63:00:02.0: MLX5E: StrdRq(0) RqSz(1024) StrdSz(256) RxCqeCmprss(0) 
```

A Mellanox VF that uses the mlx5 driver has been detected. The mlx5 driver begins its initialization of the device.

```output
[    7.465085] hv_netvsc 000d3af5-76bd-000d-3af5-76bd000d3af5 eth0: VF registering: eth1 
[    7.465119] mlx5_core cf63:00:02.0 eth1: joined to eth0 
```

The corresponding synthetic interface that's using the netvsc driver has detected a matching VF. The mlx5 driver recognizes that it has been bonded with the synthetic interface.

```output
[    7.466064] mlx5_core cf63:00:02.0 eth1: Disabling LRO, not supported in legacy RQ 
[    7.480575] mlx5_core cf63:00:02.0 eth1: Disabling LRO, not supported in legacy RQ 
[    7.480651] mlx5_core cf63:00:02.0 enP53091s1np0: renamed from eth1 
```

The Linux kernel initially named the VF interface `eth1`. An udev rule renamed it to avoid confusion with the names given to the synthetic interfaces.

```output
[    8.087962] mlx5_core cf63:00:02.0 enP53091s1np0: Link up 
```

The Mellanox VF interface is now up and active.

```output
[    8.090127] hv_netvsc 000d3af5-76bd-000d-3af5-76bd000d3af5 eth0: Data path switched to VF: enP53091s1np0 
[    9.654979] hv_netvsc 000d3af5-76bd-000d-3af5-76bd000d3af5 eth0: Data path switched from VF: enP53091s1np0 
```

These messages indicate that the data path for the bonded pair has switched to use the VF interface. About 1.6 seconds later, it switches back to the synthetic interface. Such switches might occur two or three times during the startup process and are normal behavior as the configuration is initialized.

```output
[    9.909128] mlx5_core cf63:00:02.0 enP53091s1np0: Link up 
[    9.910595] hv_netvsc 000d3af5-76bd-000d-3af5-76bd000d3af5 eth0: Data path switched to VF: enP53091s1np0 
[   11.411194] hv_netvsc 000d3af5-76bd-000d-3af5-76bd000d3af5 eth0: Data path switched from VF: enP53091s1np0 
[   11.532147] mlx5_core cf63:00:02.0 enP53091s1np0: Disabling LRO, not supported in legacy RQ 
[   11.731892] mlx5_core cf63:00:02.0 enP53091s1np0: Link up 
[   11.733216] hv_netvsc 000d3af5-76bd-000d-3af5-76bd000d3af5 eth0: Data path switched to VF: enP53091s1np0 
```

The final message indicates that the data path has switched to using the VF interface. It's expected during normal operation of the VM.

## Azure host servicing

During Azure host servicing, all VF interfaces might be temporarily removed from the VM. When the servicing is complete, the VF interfaces are added back to the VM. Normal operation continues. While the VM is operating without the VF interfaces, network traffic continues to flow through the synthetic interface without any disruption to applications.

In this context, Azure host servicing might include updating the components of the Azure network infrastructure or fully upgrading the Azure host hypervisor software. Such servicing events occur at time intervals that depend on the operational needs of the Azure infrastructure. These events typically happen several times over the course of a year.

The automatic switching between the VF interface and the synthetic interface ensures that servicing events don't disturb workloads if applications interact only with the synthetic interface. Latencies and CPU load might be higher during these periods because of the use of the synthetic interface. The duration of such periods is typically about 30 seconds but sometimes might be as long as a few minutes.

The removal and readd of the VF interface during a servicing event is visible in the `dmesg` output in the VM.  Here's typical output:

```output
[   8160.911509] hv_netvsc 000d3af5-76bd-000d-3af5-76bd000d3af5 eth0: Data path switched from VF: enP53091s1np0 
[   8160.912120] hv_netvsc 000d3af5-76bd-000d-3af5-76bd000d3af5 eth0: VF unregistering: enP53091s1np0 
[   8162.020138] hv_netvsc 000d3af5-76bd-000d-3af5-76bd000d3af5 eth0: VF slot 1 removed 
```

The data path has been switched away from the VF interface, and the VF interface has been unregistered. At this point, Linux has removed all knowledge of the VF interface and is operating as if Accelerated Networking wasn't enabled.  

```output
[   8225.557263] hv_netvsc 000d3af5-76bd-000d-3af5-76bd000d3af5 eth0: VF slot 1 added 
[   8225.557867] hv_pci e9ac9b28-cf63-4466-9ae3-4b849c3ee03b: PCI VMBus probing: Using version 0x10002 
[   8225.566794] hv_pci e9ac9b28-cf63-4466-9ae3-4b849c3ee03b: PCI host bridge to bus cf63:00 
[   8225.566797] pci_bus cf63:00: root bus resource [mem 0xfe0000000-0xfe00fffff window] 
[   8225.571556] pci cf63:00:02.0: [15b3:1016] type 00 class 0x020000 
[   8225.584903] pci cf63:00:02.0: reg 0x10: [mem 0xfe0000000-0xfe00fffff 64bit pref] 
[   8225.662860] pci cf63:00:02.0: enabling Extended Tags 
[   8225.667831] pci cf63:00:02.0: 0.000 Gb/s available PCIe bandwidth, limited by Unknown x0 link at cf63:00:02.0 (capable of 63.008 Gb/s with 8.0 GT/s PCIe x8 link) 
[   8225.667978] pci cf63:00:02.0: BAR 0: assigned [mem 0xfe0000000-0xfe00fffff 64bit pref] 
```

When the VF interface is readded after servicing is complete, a new PCI device with the specified GUID is detected. It's assigned the same PCI domain ID (0xcf63) as before. The handling of the readd VF interface is like the handling during the initial startup.

```output
[   8225.679672] mlx5_core cf63:00:02.0: firmware version: 14.25.8362 
[   8225.888476] mlx5_core cf63:00:02.0: MLX5E: StrdRq(0) RqSz(1024) StrdSz(256) RxCqeCmprss(0) 
[   8226.021016] hv_netvsc 000d3af5-76bd-000d-3af5-76bd000d3af5 eth0: VF registering: eth1 
[   8226.021058] mlx5_core cf63:00:02.0 eth1: joined to eth0 
[   8226.021968] mlx5_core cf63:00:02.0 eth1: Disabling LRO, not supported in legacy RQ 
[   8226.026631] mlx5_core cf63:00:02.0 eth1: Disabling LRO, not supported in legacy RQ 
[   8226.026699] mlx5_core cf63:00:02.0 enP53091s1np0: renamed from eth1 
[   8226.265256] mlx5_core cf63:00:02.0 enP53091s1np0: Link up 
```

The mlx5 driver initializes the VF interface, and the interface is now functional. The output is similar to the output during the initial startup.

```output
[   8226.267380] hv_netvsc 000d3af5-76bd-000d-3af5-76bd000d3af5 eth0: Data path switched to VF: enP53091s1np0 
```

The data path has been switched back to the VF interface.

## Disabling or enabling Accelerated Networking in a nonrunning VM

You can disable or enable Accelerated Networking on a virtual NIC in a nonrunning VM by using the Azure CLI. For example:

```output
$ az network nic update --name u1804895 --resource-group testrg --accelerated-network false 
```

Disabling Accelerated Networking that's enabled in the guest VM produces a `dmesg` output. It's the same as when the VF interface is removed for Azure host servicing. Enabling Accelerated Networking produces the same `dmesg` output as when the VF interface is readded after Azure host servicing.

You can use these Azure CLI commands to simulate Azure host servicing. You can then verify that your applications don't incorrectly depend on direct interaction with the VF interface.

## Next steps

* Learn how to [create a VM with Accelerated Networking in PowerShell](../virtual-network/create-vm-accelerated-networking-powershell.md).
* Learn how to [create a VM with Accelerated Networking by using the Azure CLI](../virtual-network/create-vm-accelerated-networking-cli.md).
* Improve latency with an [Azure proximity placement group](../virtual-machines/co-location.md).
