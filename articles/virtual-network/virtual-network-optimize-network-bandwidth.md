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

For all other Windows VMs, using Receive Side Scaling (RSS) can reach higher maximal throughput than a VM without RSS. RSS might be disabled by default in a Windows VM. To determine whether RSS is enabled, and enable it if it's currently disabled, follow these steps:

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

RSS is always enabled by default in an Azure Linux VM. Linux kernels released since October 2017 include new network optimizations options that enable a Linux VM to achieve higher network throughput.

### Ubuntu for new deployments

The Ubuntu on Azure kernel is heavily optimized for excellent network performance on Azure. Currently, all Ubuntu images by Canonical come by default with the optimized Azure kernel installed.

Use the following command to make sure that you're using the Azure kernel, which is identified by `-azure` at the end of the version.

```bash
uname -r

#sample output on Azure kernel:
6.8.0-1017-azure
```

#### Ubuntu on Azure kernel upgrade for existing VMs

You can get significant throughput performance by upgrading to the Azure Linux kernel. To verify whether you have this kernel, check your kernel version. It should be the same or later than the example.

```bash
#Azure kernel name ends with "-azure"
uname -r

#sample output on Azure kernel:
#4.13.0-1007-azure
```

If your VM doesn't have the Azure kernel, the version number usually begins with 4.4. If the VM doesn't have the Azure kernel, run the following commands as root:

```bash
#run as root or preface with sudo
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get dist-upgrade -y
sudo apt-get install "linux-azure"
sudo reboot
```

### Other distributions

Most modern distributions should have significant improvements with kernels newer than 4.19+. Check the current kernel version to make sure that you're running a newer kernel.

## Optimizing cross-region transfer speeds in Azure Linux VMs

Azure Linux VMs often experience network performance issues, particularly when transferring large files (1GB to 50GB) between regions, such as West Europe and West US. These issues are caused by generic kernel configurations, network buffer settings, and default congestion control algorithms, which result in delayed packets, limited throughput, and inefficient resource usage. 

To enhance network performance, consider implementing the following optimizations that have been proven effective in a number of situations on Azure:

- **Network buffer settings**: Adjust kernel parameters to maximize read and write memory buffers. Add these configurations to `/etc/sysctl.d/99-azure-network-buffers.conf`: 

  ```plaintext
  net.core.rmem_max = 2147483647 
  net.core.wmem_max = 2147483647 
  net.ipv4.tcp_rmem = 4096 67108864 1073741824 
  net.ipv4.tcp_wmem = 4096 67108864 1073741824 
  ```
 
- **Congestion control**: Enabling BBR congestion control can often result in better throughput. Add this configuration to `/etc/sysctl.d/99-azure-congestion-control.conf`: 

- Ensure the BBR module is loaded by adding it to `/etc/modules-load.d/99-azure-tcp-bbr.conf`: 

  ```plaintext
  tcp_bbr 
  ```

  ```plaintext
  net.ipv4.tcp_congestion_control = bbr 
  ```

- **Queue discipline (qdisc)**: Packet processing in Azure is generally improved by setting the default qdisc to `fq`. Add this configuration to `/etc/sysctl.d/99-azure-qdisc.conf`: 

  ```plaintext
  net.core.default_qdisc = fq 
  ```

- Create a udev rule in `/etc/udev/rules.d/99-azure-qdisc.rules` to ensure the qdisc is applied to network interfaces: 

  ```plaintext
  ACTION=="add|change", SUBSYSTEM=="net", KERNEL=="enP*", PROGRAM="/sbin/tc qdisc replace dev \$env{INTERFACE} root noqueue" 
  ACTION=="add|change", SUBSYSTEM=="net", KERNEL=="eth*", PROGRAM="/sbin/tc qdisc replace dev \$env{INTERFACE} root fq“ 
  ```

- **IRQ scheduling**: Depending on your workload, you may wish to restrict the irqbalance service from scheduling IRQs on certain nodes. Update `/etc/default/irqbalance` to specify which CPUs should not have IRQs scheduled: 

  ```bash
  IRQBALANCE_BANNED_CPULIST=0-2 
  ```

- **udev rules**: Add rules to optimize queue length and manage device flags efficiently. Create the following rule in `/etc/udev/rules.d/99-azure-txqueue-len.rules`: 

  ```plaintext
  SUBSYSTEM=="net", ACTION=="add|change", KERNEL=="eth*", ATTR{tx_queue_len}="10000“ 
  ```

### For Packets delayed twice 

When it comes to Linux performance networking we use SR-IOV with Mellanox drivers (mlx4 or mlx5), something specific to Azure is that this creates two interfaces a synthetic and a virtual interface. [Learn More](/azure/virtual-network/accelerated-networking-how-it-works).  
 

### Additional Notes 

System administrators can implement these solutions by editing configuration files such as `/etc/sysctl.d/`, `/etc/modules-load.d/`, and `/etc/udev/rules.d/`. Ensure that kernel driver updates and systemd configurations are reviewed for potential regressions. 

For further details on specific configurations and troubleshooting, refer to Azure documentation on networking performance. 

## Related content

- Deploy VMs close to each other for low latency with [proximity placement groups](/azure/virtual-machines/co-location).
- See the optimized result with [Bandwidth/Throughput testing](virtual-network-bandwidth-testing.md) for your scenario.
- Read about how [bandwidth is allocated to virtual machines](virtual-machine-network-throughput.md).
- Learn more with [Azure Virtual Network frequently asked questions](virtual-networks-faq.md).