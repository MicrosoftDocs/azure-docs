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

The Ubuntu on Azure kernel is the most optimized for network performance on Azure. Currently, all Ubuntu images by Canonical come by default with the optimized Azure kernel installed.

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

## Related content

- Deploy VMs close to each other for low latency with [proximity placement groups](/azure/virtual-machines/co-location).
- See the optimized result with [Bandwidth/Throughput testing](virtual-network-bandwidth-testing.md) for your scenario.
- Read about how [bandwidth is allocated to virtual machines](virtual-machine-network-throughput.md).
- Learn more with [Azure Virtual Network frequently asked questions](virtual-networks-faq.md).
