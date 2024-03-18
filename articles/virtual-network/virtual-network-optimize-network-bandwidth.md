---
title: Optimize Azure VM network throughput
description: Optimize network throughput for Microsoft Azure Windows and Linux virtual machines, including major distributions such as Ubuntu, CentOS, and Red Hat.
services: virtual-network
author: asudbring
manager: Gerald DeGrace
ms.service: virtual-network
ms.topic: how-to
ms.date: 03/24/2023
ms.author: allensu
---

# Optimize network throughput for Azure virtual machines

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

Azure Virtual Machines (VMs) have default network settings that can be further optimized for network throughput. This article describes how to optimize network throughput for Microsoft Azure Windows and Linux VMs, including major distributions such as Ubuntu, CentOS, and Red Hat.

## Windows virtual machines

If your Windows virtual machine supports *accelerated networking*, enable that feature for optimal throughput. For more information, see [Create a Windows VM with accelerated networking](create-vm-accelerated-networking-powershell.md).

For all other Windows virtual machines, using Receive Side Scaling (RSS) can reach higher maximal throughput than a VM without RSS. RSS might be disabled by default in a Windows VM. To determine whether RSS is enabled, and enable it if it's currently disabled, complete the following steps:

1. See if RSS is enabled for a network adapter with the [Get-NetAdapterRss](/powershell/module/netadapter/get-netadapterrss) PowerShell command. In the following example output returned from the `Get-NetAdapterRss`, RSS isn't enabled.

   ```powershell
   Name                    : Ethernet
   InterfaceDescription    : Microsoft Hyper-V Network Adapter
   Enabled                 : False
   ```

1. To enable RSS, enter the following command:

   ```powershell
   Get-NetAdapter | % {Enable-NetAdapterRss -Name $_.Name}
   ```

   This command doesn't have an output. The command changes NIC settings. It causes temporary connectivity loss for about one minute. A *Reconnecting* dialog appears during the connectivity loss. Connectivity is typically restored after the third attempt.

1. Confirm that RSS is enabled in the VM by entering the `Get-NetAdapterRss` command again. If successful, the following example output is returned:

   ```powershell
   Name                    : Ethernet
   InterfaceDescription    : Microsoft Hyper-V Network Adapter
   Enabled                 : True
   ```

## Linux virtual machines

RSS is always enabled by default in an Azure Linux VM. Linux kernels released since October 2017 include new network optimizations options that enable a Linux VM to achieve higher network throughput.

### Ubuntu for new deployments

The Ubuntu Azure kernel is the most optimized for network performance on Azure. To get the latest optimizations, first install the latest supported version of 18.04-LTS, as follows:

```json
"Publisher": "Canonical",
"Offer": "UbuntuServer",
"Sku": "18.04-LTS",
"Version": "latest"
```

After the creation is complete, enter the following commands to get the latest updates. These steps also work for VMs currently running the Ubuntu Azure kernel.

```bash
#run as root or preface with sudo
sudo apt-get -y update
sudo apt-get -y upgrade
sudo apt-get -y dist-upgrade
```

If an existing Ubuntu deployment already has the Azure kernel but fails to update with errors, this optional command set might be helpful.

```bash
#optional steps might be helpful in existing deployments with the Azure kernel
#run as root or preface with sudo
sudo apt-get -f install
sudo apt-get --fix-missing install
sudo apt-get clean
sudo apt-get -y update
sudo apt-get -y upgrade
sudo apt-get -y dist-upgrade
```

#### Ubuntu Azure kernel upgrade for existing VMs

You can get significant throughput performance by upgrading to the Azure Linux kernel. To verify whether you have this kernel, check your kernel version. It should be the same or later than the example.

```bash
#Azure kernel name ends with "-azure"
uname -r

#sample output on Azure kernel:
#4.13.0-1007-azure
```

If your virtual machine doesn't have the Azure kernel, the version number usually begins with "4.4." If the VM doesn't have the Azure kernel, run the following commands as root:

```bash
#run as root or preface with sudo
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get dist-upgrade -y
sudo apt-get install "linux-azure"
sudo reboot
```

### CentOS

In order to get the latest optimizations, we recommend that you create a virtual machine with the latest supported version by specifying the following parameters:

```json
"Publisher": "OpenLogic",
"Offer": "CentOS",
"Sku": "7.7",
"Version": "latest"
```

Both new and existing VMs can benefit from installing the latest Linux Integration Services (LIS). The throughput optimization is in LIS, starting from 4.2.2-2. Later versions contain further improvements. Enter the following
commands to install the latest LIS:

```bash
sudo yum update
sudo reboot
sudo yum install microsoft-hyper-v
```

### Red Hat

In order to get the optimizations, we recommend that you create a virtual machine with the latest supported version by specifying the following parameters:

```json
"Publisher": "RedHat"
"Offer": "RHEL"
"Sku": "7-RAW"
"Version": "latest"
```

Both new and existing VMs can benefit from installing the latest LIS. The throughput optimization is in LIS, starting from 4.2. Enter the following commands to download and install LIS:

```bash
wget https://aka.ms/lis
tar xvf lis
cd LISISO
sudo ./install.sh #or upgrade.sh if prior LIS was previously installed
```

Learn more about Linux Integration Services Version 4.3 for Hyper-V by viewing the [download page](https://www.microsoft.com/download/details.aspx?id=55106).

## Next steps

- Deploy VMs close to each other for low latency with [proximity placement groups](../virtual-machines/co-location.md).
- See the optimized result with [Bandwidth/Throughput testing](virtual-network-bandwidth-testing.md) for your scenario.
- Read about how [bandwidth is allocated to virtual machines](virtual-machine-network-throughput.md).
- Learn more with [Azure Virtual Network frequently asked questions](virtual-networks-faq.md).
