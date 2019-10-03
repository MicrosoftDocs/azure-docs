---
title: DPDK in an Azure Linux VM | Microsoft Docs
description: Learn how to setup DPDK in a Linux virtual machine.
services: virtual-network
documentationcenter: na
author: laxmanrb
manager: gedegrac
editor: ''

ms.assetid: 
ms.service: virtual-network
ms.devlang: NA
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/27/2018
ms.author: labattul

---
# Set up DPDK in a Linux virtual machine

Data Plane Development Kit (DPDK) on Azure offers a faster user-space packet processing framework for performance-intensive applications. This framework bypasses the virtual machine’s kernel network stack.

In typical packet processing that uses the kernel network stack, the process is interrupt-driven. When the network interface receives incoming packets, there is a kernel interrupt to process the packet and a context switch from the kernel space to the user space. DPDK eliminates context switching and the interrupt-driven method in favor of a user-space implementation that uses poll mode drivers for fast packet processing.

DPDK consists of sets of user-space libraries that provide access to lower-level resources. These resources can include hardware, logical cores, memory management, and poll mode drivers for network interface cards.

DPDK can run on Azure virtual machines that are supporting multiple operating system distributions. DPDK provides key performance differentiation in driving network function virtualization implementations. These implementations can take the form of network virtual appliances (NVAs), such as virtual routers, firewalls, VPNs, load balancers, evolved packet cores, and denial-of-service (DDoS) applications.

## Benefit

**Higher packets per second (PPS)**: Bypassing the kernel and taking control of packets in the user space reduces the cycle count by eliminating context switches. It also improves the rate of packets that are processed per second in Azure Linux virtual machines.


## Supported operating systems

The following distributions from the Azure Gallery are supported:

| Linux OS     | Kernel version        |
|--------------|----------------       |
| Ubuntu 16.04 | 4.15.0-1015-azure     |
| Ubuntu 18.04 | 4.15.0-1015-azure     |
| SLES 15      | 4.12.14-5.5-azure     |
| RHEL 7.5     | 3.10.0-862.9.1.el7    |
| CentOS 7.5   | 3.10.0-862.3.3.el7    |

**Custom kernel support**

For any Linux kernel version that's not listed, see [Patches for building an Azure-tuned Linux kernel](https://github.com/microsoft/azure-linux-kernel). For more information, you can also contact [azuredpdk@microsoft.com](mailto:azuredpdk@microsoft.com). 

## Region support

All Azure regions support DPDK.

## Prerequisites

Accelerated networking must be enabled on a Linux virtual machine. The virtual machine should have at least two network interfaces, with one interface for management. Learn how to [create a Linux virtual machine with accelerated networking enabled](create-vm-accelerated-networking-cli.md).

## Install DPDK dependencies

### Ubuntu 16.04

```bash
sudo add-apt-repository ppa:canonical-server/dpdk-azure -y
sudo apt-get update
sudo apt-get install -y librdmacm-dev librdmacm1 build-essential libnuma-dev libmnl-dev
```

### Ubuntu 18.04

```bash
sudo apt-get update
sudo apt-get install -y librdmacm-dev librdmacm1 build-essential libnuma-dev libmnl-dev
```

### RHEL7.5/CentOS 7.5

```bash
yum -y groupinstall "Infiniband Support"
sudo dracut --add-drivers "mlx4_en mlx4_ib mlx5_ib" -f
yum install -y gcc kernel-devel-`uname -r` numactl-devel.x86_64 librdmacm-devel libmnl-devel
```

### SLES 15

**Azure kernel**

```bash
zypper  \
  --no-gpg-checks \
  --non-interactive \
  --gpg-auto-import-keys install kernel-azure kernel-devel-azure gcc make libnuma-devel numactl librdmacm1 rdma-core-devel
```

**Default kernel**

```bash
zypper \
  --no-gpg-checks \
  --non-interactive \
  --gpg-auto-import-keys install kernel-default-devel gcc make libnuma-devel numactl librdmacm1 rdma-core-devel
```

## Set up the virtual machine environment (once)

1. [Download the latest DPDK](https://core.dpdk.org/download). Version 18.02 or higher is required for Azure.
2. Build the default config with `make config T=x86_64-native-linuxapp-gcc`.
3. Enable Mellanox PMDs in the generated config with `sed -ri 's,(MLX._PMD=)n,\1y,' build/.config`.
4. Compile with `make`.
5. Install with `make install DESTDIR=<output folder>`.

## Configure the runtime environment

After restarting, run the following commands once:

1. Hugepages

   * Configure hugepage by running the following command, once for all numanodes:

     ```bash
     echo 1024 | sudo tee
     /sys/devices/system/node/node*/hugepages/hugepages-2048kB/nr_hugepages
     ```

   * Create a directory for mounting with `mkdir /mnt/huge`.
   * Mount hugepages with `mount -t hugetlbfs nodev /mnt/huge`.
   * Check that hugepages are reserved with `grep Huge /proc/meminfo`.

     > [!NOTE]
     > There is a way to modify the grub file so that hugepages are reserved on boot by following the [instructions](https://dpdk.org/doc/guides/linux_gsg/sys_reqs.html#use-of-hugepages-in-the-linux-environment) for the DPDK. The instructions are at the bottom of the page. When you're using an Azure Linux virtual machine, modify files under **/etc/config/grub.d** instead, to reserve hugepages across reboots.

2. MAC & IP addresses: Use `ifconfig –a` to view the MAC and IP address of the network interfaces. The *VF* network interface and *NETVSC* network interface have the same MAC address, but only the *NETVSC* network interface has an IP address. VF interfaces are running as subordinate interfaces of NETVSC interfaces.

3. PCI addresses

   * Use `ethtool -i <vf interface name>` to find out which PCI address to use for *VF*.
   * If *eth0* has accelerated networking enabled, make sure that testpmd doesn’t accidentally take over the VF pci device for *eth0*. If the DPDK application accidentally takes over the management network interface and causes you to lose your SSH connection, use the serial console to stop the DPDK application. You can also use the serial console to stop or start the virtual machine.

4. Load *ibuverbs* on each reboot with `modprobe -a ib_uverbs`. For SLES 15 only, also load *mlx4_ib* with `modprobe -a mlx4_ib`.

## Failsafe PMD

DPDK applications must run over the failsafe PMD that is exposed in Azure. If the application runs directly over the VF PMD, it doesn't receive **all** packets that are destined to the VM, since some packets show up over the synthetic interface. 

If you run a DPDK application over the failsafe PMD, it guarantees that the application receives all packets that are destined to it. It also makes sure that the application keeps running in DPDK mode, even if the VF is revoked when the host is being serviced. For more information about failsafe PMD, see [Fail-safe poll mode driver library](https://doc.dpdk.org/guides/nics/fail_safe.html).

## Run testpmd

To run testpmd in root mode, use `sudo` before the *testpmd* command.

### Basic: Sanity check, failsafe adapter initialization

1. Run the following commands to start a single port testpmd application:

   ```bash
   testpmd -w <pci address from previous step> \
     --vdev="net_vdev_netvsc0,iface=eth1" \
     -- -i \
     --port-topology=chained
    ```

2. Run the following commands to start a dual port testpmd application:

   ```bash
   testpmd -w <pci address nic1> \
   -w <pci address nic2> \
   --vdev="net_vdev_netvsc0,iface=eth1" \
   --vdev="net_vdev_netvsc1,iface=eth2" \
   -- -i
   ```

   If you're running testpmd with more than two NICs, the `--vdev` argument follows this pattern: `net_vdev_netvsc<id>,iface=<vf’s pairing eth>`.

3.  After it's started, run `show port info all` to check port information. You should see one or two DPDK ports that are net_failsafe (not *net_mlx4*).
4.  Use `start <port> /stop <port>` to start traffic.

The previous commands start *testpmd* in interactive mode, which is recommended for trying out  testpmd commands.

### Basic: Single sender/single receiver

The following commands periodically print the packets per second statistics:

1. On the TX side, run the following command:

   ```bash
   testpmd \
     -l <core-list> \
     -n <num of mem channels> \
     -w <pci address of the device you plan to use> \
     --vdev="net_vdev_netvsc<id>,iface=<the iface to attach to>" \
     -- --port-topology=chained \
     --nb-cores <number of cores to use for test pmd> \
     --forward-mode=txonly \
     --eth-peer=<port id>,<receiver peer MAC address> \
     --stats-period <display interval in seconds>
   ```

2. On the RX side, run the following command:

   ```bash
   testpmd \
     -l <core-list> \
     -n <num of mem channels> \
     -w <pci address of the device you plan to use> \
     --vdev="net_vdev_netvsc<id>,iface=<the iface to attach to>" \
     -- --port-topology=chained \
     --nb-cores <number of cores to use for test pmd> \
     --forward-mode=rxonly \
     --eth-peer=<port id>,<sender peer MAC address> \
     --stats-period <display interval in seconds>
   ```

When you're running the previous commands on a virtual machine, change *IP_SRC_ADDR* and *IP_DST_ADDR* in `app/test-pmd/txonly.c` to match the actual IP address of the virtual machines before you compile. Otherwise, the packets are dropped before reaching the receiver.

### Advanced: Single sender/single forwarder
The following commands periodically print the packets per second statistics:

1. On the TX side, run the following command:

   ```bash
   testpmd \
     -l <core-list> \
     -n <num of mem channels> \
     -w <pci address of the device you plan to use> \
     --vdev="net_vdev_netvsc<id>,iface=<the iface to attach to>" \
     -- --port-topology=chained \
     --nb-cores <number of cores to use for test pmd> \
     --forward-mode=txonly \
     --eth-peer=<port id>,<receiver peer MAC address> \
     --stats-period <display interval in seconds>
    ```

2. On the FWD side, run the following command:

   ```bash
   testpmd \
     -l <core-list> \
     -n <num of mem channels> \
     -w <pci address NIC1> \
     -w <pci address NIC2> \
     --vdev="net_vdev_netvsc<id>,iface=<the iface to attach to>" \
     --vdev="net_vdev_netvsc<2nd id>,iface=<2nd iface to attach to>" (you need as many --vdev arguments as the number of devices used by testpmd, in this case) \
     -- --nb-cores <number of cores to use for test pmd> \
     --forward-mode=io \
     --eth-peer=<recv port id>,<sender peer MAC address> \
     --stats-period <display interval in seconds>
    ```

When you're running the previous commands on a virtual machine, change *IP_SRC_ADDR* and *IP_DST_ADDR* in `app/test-pmd/txonly.c` to match the actual IP address of the virtual machines before you compile. Otherwise, the packets are dropped before reaching the forwarder. You won’t be able to have a third machine receive forwarded traffic, because the *testpmd* forwarder doesn’t modify the layer-3 addresses, unless you make some code changes.

## References

* [EAL options](https://dpdk.org/doc/guides/testpmd_app_ug/run_app.html#eal-command-line-options)
* [Testpmd commands](https://dpdk.org/doc/guides/testpmd_app_ug/run_app.html#testpmd-command-line-options)
