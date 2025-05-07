---
title: Microsoft Azure Network Adapter (MANA) and DPDK on Linux
description: Learn about MANA and DPDK for Linux Azure VMs.
author: mcgov
ms.service: azure-virtual-network
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 07/10/2023
ms.author: mamcgove
---

# Microsoft Azure Network Adapter (MANA) and DPDK on Linux

The Microsoft Azure Network Adapter (MANA) is new hardware for Azure virtual machines to enables higher throughput and reliability. 
To make use of MANA, users must modify their DPDK initialization routines. MANA requires two changes compared to legacy hardware:
- [MANA EAL arguments](#mana-dpdk-eal-arguments) for the poll-mode driver (PMD) differ from previous hardware.
- The Linux kernel must release control of the MANA network interfaces before DPDK initialization begins.

The setup procedure for MANA DPDK is outlined in the [example code.](#example-testpmd-setup-and-netvsc-test).

## Introduction

Legacy Azure Linux VMs rely on the mlx4 or mlx5 drivers and the accompanying hardware for accelerated networking. Azure DPDK users would select specific interfaces to include or exclude by passing bus addresses to the DPDK EAL. The setup procedure for MANA DPDK differs slightly, since the assumption of one bus address per Accelerated Networking interface no longer holds true. Rather than using a PCI bus address, the MANA PMD uses the MAC address to determine which interface it should bind to.

## MANA DPDK EAL Arguments
The MANA PMD probes all devices and ports on the system when no `--vdev` argument is present; the `--vdev` argument isn't mandatory. In testing environments, it's often desirable to leave one (primary) interface available for servicing the SSH connection to the VM. To use DPDK with a subset of the available VFs, users should pass both the bus address of the MANA device and the MAC address of the interfaces in the `--vdev` argument. For more detail, example code is available to demonstrate [DPDK EAL initialization on MANA](#example-testpmd-setup-and-netvsc-test).

For general information about the DPDK Environment Abstraction Layer (EAL):
- [DPDK EAL Arguments for Linux](https://doc.dpdk.org/guides/prog_guide/env_abstraction_layer.html#eal-in-a-linux-userland-execution-environment)
- [DPDK EAL Overview](https://doc.dpdk.org/guides/prog_guide/env_abstraction_layer.html)

## DPDK requirements for MANA

Utilizing DPDK on MANA hardware requires the Linux kernel 6.2 or later or a backport of the Ethernet and InfiniBand drivers from the latest Linux kernel. It also requires specific versions of DPDK and user-space drivers.

MANA DPDK requires the following set of drivers:
1.	[Linux kernel Ethernet driver](https://github.com/torvalds/linux/tree/master/drivers/net/ethernet/microsoft/mana) (5.15 kernel and later)
1.	[Linux kernel InfiniBand driver](https://github.com/torvalds/linux/tree/master/drivers/infiniband/hw/mana) (6.2 kernel and later)
1.	[DPDK MANA poll-mode driver](https://github.com/DPDK/dpdk/tree/main/drivers/net/mana) (DPDK 22.11 and later)
1.	[Libmana user-space drivers](https://github.com/linux-rdma/rdma-core/tree/master/providers/mana) (rdma-core v44 and later)

### Supported Marketplace Images
A nonexhaustive list of images with backported patches for DPDK with MANA:
- Red Hat Enterprise Linux 8.9
- Red Hat Enterprise Linux 9.4
- Canonical Ubuntu Server 20.04 (5.15.0-1045-azure)
- Canonical Ubuntu Server 22.04 (5.15.0-1045-azure)

>[!NOTE]
>MANA DPDK is not available for Windows; it will only work on Linux VMs.

## Example: Check for MANA

>[!NOTE] 
>This article assumes the pciutils package containing the lspci command is installed on the system.

```bash
# check for pci devices with ID:
#   vendor: Microsoft Corporation (1414)
#   class:  Ethernet Controller (0200)
#   device: Microsoft Azure Network Adapter VF (00ba)
if [[ -n `lspci -d 1414:00ba:0200` ]]; then
    echo "MANA device is available."
else
    echo "MANA was not detected."
fi

```

## Example: DPDK installation (Ubuntu 22.04)

>[!NOTE] 
>This article assumes compatible kernel and rdma-core are installed on the system.

```bash
DEBIAN_FRONTEND=noninteractive sudo apt-get install -q -y build-essential libudev-dev libnl-3-dev libnl-route-3-dev ninja-build libssl-dev libelf-dev python3-pip meson libnuma-dev

pip3 install pyelftools

# Try latest LTS DPDK, example uses DPDK tag v23.07-rc3
git clone https://github.com/DPDK/dpdk.git -b v23.07-rc3 --depth 1
pushd dpdk
meson build
cd build
ninja
sudo ninja install
popd
```

## Example: Testpmd setup and netvsc test

Note the following example code for running DPDK with MANA. The direct-to-vf 'netvsc' configuration on Azure is recommended for maximum performance with MANA.

>[!NOTE]
>DPDK requires either 2MB or 1GB hugepages to be enabled.
>Example assumes an Azure VM with 2 accelerated networking NICs attached.

```bash
# Enable 2MB hugepages.
echo 1024 | tee /sys/devices/system/node/node*/hugepages/hugepages-2048kB/nr_hugepages

# Assuming use of eth1 for DPDK in this demo
PRIMARY="eth1"

# $ ip -br link show master eth1 
# > enP30832p0s0     UP             f0:0d:3a:ec:b4:0a <... # truncated
# grab interface name for device bound to primary
SECONDARY="`ip -br link show master $PRIMARY | awk '{ print $1 }'`"
# Get mac address for MANA interface (should match primary)
MANA_MAC="`ip -br link show master $PRIMARY | awk '{ print $3 }'`"


# $ ethtool -i enP30832p0s0 | grep bus-info
# > bus-info: 7870:00:00.0
# get MANA device bus info to pass to DPDK
BUS_INFO="`ethtool -i $SECONDARY | grep bus-info | awk '{ print $2 }'`"

# Set MANA interfaces DOWN before starting DPDK
ip link set $PRIMARY down
ip link set $SECONDARY down


## Move synthetic channel to user mode and allow it to be used by NETVSC PMD in DPDK
DEV_UUID=$(basename $(readlink /sys/class/net/$PRIMARY/device))
NET_UUID="f8615163-df3e-46c5-913f-f2d2f965ed0e"
modprobe uio_hv_generic
echo $NET_UUID > /sys/bus/vmbus/drivers/uio_hv_generic/new_id
echo $DEV_UUID > /sys/bus/vmbus/drivers/hv_netvsc/unbind
echo $DEV_UUID > /sys/bus/vmbus/drivers/uio_hv_generic/bind

# MANA single queue test
dpdk-testpmd -l 1-3 --vdev="$BUS_INFO,mac=$MANA_MAC" -- --forward-mode=txonly --auto-start --txd=128 --rxd=128 --stats 2

# MANA multiple queue test (example assumes > 9 cores)
dpdk-testpmd -l 1-6 --vdev="$BUS_INFO,mac=$MANA_MAC" -- --forward-mode=txonly --auto-start --nb-cores=4  --txd=128 --rxd=128 --txq=8 --rxq=8 --stats 2

```

## Troubleshooting

### Fail to set interface down.
Failure to set the MANA bound device to DOWN can result in low or zero packet throughput. 
The failure to release the device can result the EAL error message related to transmit queues.
```log
mana_start_tx_queues(): Failed to create qp queue index 0
mana_dev_start(): failed to start tx queues -19
```

### Failure to enable huge pages.

Try enabling huge pages and ensuring the information is visible in meminfo.
```log
EAL: No free 2048 kB hugepages reported on node 0
EAL: FATAL: Cannot get hugepage information.
EAL: Cannot get hugepage information.
EAL: Error - exiting with code: 1
Cause: Cannot init EAL: Permission denied
```

### Low throughput with use of `--vdev="net_vdev_netvsc0,iface=eth1"`

Failover configuration of either the `net_failsafe` or `net_vdev_netvsc` poll-mode-drivers isn't recommended for high performance on Azure. The netvsc configuration with DPDK version 20.11 or higher may give better results. For optimal performance, ensure your Linux kernel, rdma-core, and DPDK packages meet the listed requirements for DPDK and MANA.

### Version mismatch for rdma-core
Mismatches in rdma-core and the linux kernel can occur anytime; often they occur when a user is building some combination of rdma-core, DPDK, and the linux kernel from source. This type of version mismatch can cause a failed probe of the MANA virtual function (VF).

```log
EAL: Probe PCI driver: net_mana (1414:ba) device: 7870:00:00.0 (socket 0)
mana_arg_parse_callback(): key=mac value=00:0d:3a:76:3b:d0 index=0
mana_init_once(): MP INIT PRIMARY
mana_pci_probe_mac(): Probe device name mana_0 dev_name uverbs0 ibdev_path /sys/class/infiniband/mana_0
mana_probe_port(): device located port 2 address 00:0D:3A:76:3B:D0
mana_probe_port(): ibv_alloc_parent_domain failed port 2
mana_pci_probe_mac(): Probe on IB port 2 failed -12
EAL: Requested device 7870:00:00.0 cannot be used
EAL: Bus (pci) probe failed.
hn_vf_attach(): Couldn't find port for VF
hn_vf_add(): RNDIS reports VF but device not found, retrying

```
This likely results from using a kernel with backported patches for mana_ib with a newer version of rdma-core. The root cause is an interaction between the kernel RDMA drivers and user space rdma-core libraries.

The Linux kernel uapi for RDMA has a list of RDMA provider IDs, in backported versions of the kernel this ID value can differ from the version in the rdma-core libraries.
> {!NOTE}
> Example snippets are from [Ubuntu 5.150-1045 linux-azure](https://git.launchpad.net/~canonical-kernel/ubuntu/+source/linux-azure/+git/focal/tree/include/uapi/rdma/ib_user_ioctl_verbs.h?h=azure-5.15-next) and [rdma-core v46.0](https://github.com/linux-rdma/rdma-core/blob/4cce53f5be035137c9d31d28e204502231a56382/kernel-headers/rdma/ib_user_ioctl_verbs.h#L220)
```c
// Linux kernel header
// include/uapi/rdma/ib_user_ioctl_verbs.h
enum rdma_driver_id {
	RDMA_DRIVER_UNKNOWN,
	RDMA_DRIVER_MLX5,
	RDMA_DRIVER_MLX4,
	RDMA_DRIVER_CXGB3,
	RDMA_DRIVER_CXGB4,
	RDMA_DRIVER_MTHCA,
	RDMA_DRIVER_BNXT_RE,
	RDMA_DRIVER_OCRDMA,
	RDMA_DRIVER_NES,
	RDMA_DRIVER_I40IW,
	RDMA_DRIVER_IRDMA = RDMA_DRIVER_I40IW,
	RDMA_DRIVER_VMW_PVRDMA,
	RDMA_DRIVER_QEDR,
	RDMA_DRIVER_HNS,
	RDMA_DRIVER_USNIC,
	RDMA_DRIVER_RXE,
	RDMA_DRIVER_HFI1,
	RDMA_DRIVER_QIB,
	RDMA_DRIVER_EFA,
	RDMA_DRIVER_SIW,
	RDMA_DRIVER_MANA, //<- MANA added as last member of enum after backporting
};

// Example mismatched rdma-core ioctl verbs header
// on github: kernel-headers/rdma/ib_user_ioctl_verbs.h
// or in release tar.gz: include/rdma/ib_user_ioctl_verbs.h
enum rdma_driver_id {
	RDMA_DRIVER_UNKNOWN,
	RDMA_DRIVER_MLX5,
	RDMA_DRIVER_MLX4,
	RDMA_DRIVER_CXGB3,
	RDMA_DRIVER_CXGB4,
	RDMA_DRIVER_MTHCA,
	RDMA_DRIVER_BNXT_RE,
	RDMA_DRIVER_OCRDMA,
	RDMA_DRIVER_NES,
	RDMA_DRIVER_I40IW,
	RDMA_DRIVER_IRDMA = RDMA_DRIVER_I40IW,
	RDMA_DRIVER_VMW_PVRDMA,
	RDMA_DRIVER_QEDR,
	RDMA_DRIVER_HNS,
	RDMA_DRIVER_USNIC,
	RDMA_DRIVER_RXE,
	RDMA_DRIVER_HFI1,
	RDMA_DRIVER_QIB,
	RDMA_DRIVER_EFA,
	RDMA_DRIVER_SIW,
	RDMA_DRIVER_ERDMA,  // <- This upstream has two additional providers
	RDMA_DRIVER_MANA,   // <- So MANA's ID in the enum does not match
};
```

This mismatch results in the MANA provider code failing to load. Use `gdb` to trace the execution of `dpdk-testpmd` to confirm the ERDMA provider is loaded instead of the MANA provider. The MANA driver_id must be consistent for both the kernel and rdma-core. The MANA PMD loads correctly when those IDs match.