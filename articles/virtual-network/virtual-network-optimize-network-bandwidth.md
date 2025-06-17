---
title: Optimize Azure VM network throughput
description: Optimize network throughput for Windows and Linux virtual machines, including major distributions such as Ubuntu and Red Hat.
services: virtual-network
author: asudbring
manager: Gerald DeGrace
ms.service: azure-virtual-network
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 08/02/2024
ms.author: allensu
---

# Optimize network throughput for Azure virtual machines

Azure virtual machines (VMs) have default network settings that can be further optimized for network throughput. This article describes how to optimize network throughput for Windows and Linux VMs, including major distributions such as Ubuntu and Red Hat.

## Windows virtual machines

If your Windows VM supports *accelerated networking*, enable that feature for optimal throughput. For more information, see [Create a Windows VM with accelerated networking](create-vm-accelerated-networking-powershell.md).

For all other Windows VMs, using Receive Side Scaling (RSS) can reach higher maximal throughput than a VM without RSS. RSS might be disabled by default in a Windows VM. To check if RSS is enabled and enable it, follow these steps:

1. See if RSS is enabled for a network adapter with the [Get-NetAdapterRss](/powershell/module/netadapter/get-netadapterrss) PowerShell command. In the following example, output returned from the `Get-NetAdapterRss` RSS isn't enabled.

   ```powershell
   Name                    : Ethernet
   InterfaceDescription    : Microsoft Hyper-V Network Adapter
   Enabled                 : False
   ```

1. To enable RSS, enter the following command:

   ```powershell
   Get-NetAdapter | % {Enable-NetAdapterRss -Name $_.Name}
   ```

   This command doesn't have an output. The command changes network interface card (NIC) settings. It causes temporary connectivity loss for about one minute. A **Reconnecting** dialog appears during the connectivity loss. Connectivity is typically restored after the third attempt.

1. Confirm that RSS is enabled in the VM by entering the `Get-NetAdapterRss` command again. If successful, the following example output is returned:

   ```powershell
   Name                    : Ethernet
   InterfaceDescription    : Microsoft Hyper-V Network Adapter
   Enabled                 : True
   ```

## Linux virtual machines

RSS is always enabled by default in a Linux Virtual Machine (VM) in Azure. Linux kernels released since October 2017 include new network optimizations options that enable a Linux VM to achieve higher network throughput.

### Enable Azure Accelerated Networking for optimal throughput

Azure provides accelerated networking which can really improve network performance, latency, jitter. There are currently two different technologies that are used depending on the virtual machine size, [Mellanox](/azure/virtual-network/accelerated-networking-how-it-works) which is wide available and [MANA](/azure/virtual-network/accelerated-networking-mana-overview) which is developed by Microsoft.

### Azure Tuned Kernels

Some distributions such as Ubuntu (Canonical) and SUSE have [Azure tuned kernels](/azure/virtual-machines/linux/endorsed-distros#azure-tuned-kernels).

Use the following command to make sure that you're using the Azure kernel, which has usually the `azure` string in the naming.

```bash
uname -r

#sample output on Azure kernel on a Ubuntu Linux VM
6.8.0-1017-azure
```

### Other Linux distributions

Most modern distributions have significant improvements with newer kernels. Check the current kernel version to make sure that you're running a kernel that is newer than 4.19, which includes some great improvements in networking, for example support for the *BBR Congestion-Based Congestion Control*.

## Achieving consistent transfer speeds in Linux VMs in Azure

Linux VMs often experience network performance issues, particularly when transferring large files (1 GB to 50 GB) between regions, such as West Europe and West US. These issues are caused by older kernel versions as well as, default kernel configurations, default network buffer settings and default congestion control algorithms, which result in delayed packets, limited throughput, and inefficient resource usage. 

To get consistent network performance, consider implementing the following optimizations that are proven effective in many situations on Azure:

- **Network buffer settings**: Adjust kernel parameters to maximize read and write memory buffers. Add these configurations to `/etc/sysctl.d/99-azure-network-buffers.conf`: 

```plaintext
net.ipv4.tcp_mem = 4096 87380 67108864
net.ipv4.udp_mem = 4096 87380 33554432
net.ipv4.tcp_rmem = 4096 87380 67108864
net.ipv4.tcp_wmem = 4096 65536 67108864
net.core.rmem_default = 33554432
net.core.wmem_default = 33554432
net.ipv4.udp_wmem_min = 16384
net.ipv4.udp_rmem_min = 16384
net.core.wmem_max = 134217728
net.core.rmem_max = 134217728
net.core.busy_poll = 50
net.core.busy_read = 50
```
 
- **Congestion-Based Congestion control for kernels 4.19 and above**: Enabling Bottleneck Bandwidth and Round-trip propagation time (BBR) congestion control can often result in better throughput. Add this configuration to `/etc/sysctl.d/99-azure-congestion-control.conf`: 

```plaintext
net.ipv4.tcp_congestion_control = bbr 
```
- **Extra TCP parameters that will usually help with better consistency, throughput**: Add these configurations to `/etc/sysctl.d/99-azure-network-extras.conf`:

````plaintext
# For deployments where the Linux VM is BEHIND an Azure Load Balancer, timestamps MUST be set to 0
net.ipv4.tcp_timestamps = 1

# Reuse does require tcp_timestamps to be enabled. If tcp_timestamps are disabled because of load balancers, you should set reuse to 2.
net.ipv4.tcp_tw_reuse = 1

# Allowed local port range. This will increase the number of locally available ports (source ports)
net.ipv4.ip_local_port_range = 1024 65535

# Maximum number of packets taken from all interfaces in one polling cycle (NAPI poll). In one polling cycle interfaces which are # registered to polling are probed in a round-robin manner.
net.core.netdev_budget = 1000

# For high-performance environments, it's recommended to increase from the default 20KB to 65KB, in some extreme cases, for environments that support 100G+ networking, you can 
# increase it to 1048576
net.core.optmem_max = 65535

# F-RTO is not recommended on wired networks. 
net.ipv4.tcp_frto = 0

# Increase the number of incoming connections / number of connections backlog
net.core.somaxconn = 32768
net.core.netdev_max_backlog = 32768
net.core.dev_weight = 64
````

- **Queue discipline (qdisc)**: Packet processing in Azure is improved by setting the default qdisc to `fq`. Add this configuration to `/etc/sysctl.d/99-azure-qdisc.conf`: 

```plaintext
net.core.default_qdisc = fq 
```

- **Optimize NIC ring buffers for TX/RX**: Create an udev rule in `/etc/udev/rules.d/99-azure-ring-buffer.rules` to ensure they're applied to network interfaces:

````plaintext
# Setup Accelerated Interface ring buffers (Mellanox / Mana) 
SUBSYSTEM=="net", DRIVERS=="hv_pci", ACTION=="add",  RUN+="/usr/sbin/ethtool -G $env{INTERFACE} rx 1024 tx 1024"

# Setup Synthetic interface ring buffers (hv_netvsc)
SUBSYSTEM=="net", DRIVERS=="hv_netvsc*", ACTION=="add",  RUN+="/usr/sbin/ethtool -G $env{INTERFACE} rx 1024 tx 1024"
````
  
- Create an udev rule in `/etc/udev/rules.d/99-azure-qdisc.rules` to ensure the qdisc is applied to network interfaces: 

```plaintext
ACTION=="add|change", SUBSYSTEM=="net", KERNEL=="enP*", PROGRAM="/sbin/tc qdisc replace dev \$env{INTERFACE} root noqueue" 
ACTION=="add|change", SUBSYSTEM=="net", KERNEL=="eth*", PROGRAM="/sbin/tc qdisc replace dev \$env{INTERFACE} root fq“ 
```

- **Interrupt Request (IRQ) scheduling**: Depending on your workload, you may wish to restrict the irqbalance service from scheduling IRQs on certain nodes. When using IRQBalance, you can update `/etc/default/irqbalance` to specify which CPUs shouldn't have IRQs scheduled you will need to determine [the mask](https://manpages.debian.org/testing/irqbalance/irqbalance.1.en.html#IRQBALANCE_BANNED_CPUS) that will exclude the CPUs that need exclusion.

More information about how to calculate the mask available [here](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux_for_real_time/7/html/tuning_guide/interrupt_and_process_binding).

The example below would assume that you want to exclude CPUs 8-15

```bash
IRQBALANCE_BANNED_CPULIST=0000ff00
```

- **UDEV rules**: Add rules to optimize queue length and manage device flags efficiently. Create the following rule in `/etc/udev/rules.d/99-azure-txqueue-len.rules`: 

```plaintext
SUBSYSTEM=="net", ACTION=="add|change", KERNEL=="eth*", ATTR{tx_queue_len}="10000“ 
```

### For Packets delayed twice

When it comes to Linux performance networking we use SR-IOV with Mellanox drivers (mlx4 or mlx5), something specific to Azure is that this creates two interfaces a synthetic and a virtual interface. [Learn More](/azure/virtual-network/accelerated-networking-how-it-works).  
 

### Additional Notes 

System administrators can implement these solutions by editing configuration files such as `/etc/sysctl.d/`, `/etc/modules-load.d/`, and `/etc/udev/rules.d/`. Ensure that kernel driver updates and systemd configurations are reviewed for potential regressions. 

For more information on specific configurations and troubleshooting, refer to Azure documentation on networking performance. 

## Related content

- Deploy VMs close to each other for low latency with [proximity placement groups](/azure/virtual-machines/co-location).
- See the optimized result with [Bandwidth/Throughput testing](virtual-network-bandwidth-testing.md) for your scenario.
- Read about how [bandwidth is allocated to virtual machines](virtual-machine-network-throughput.md).
- Learn more with [Azure Virtual Network frequently asked questions](virtual-networks-faq.md).
