---
title: Optimize VM network throughput | Microsoft Docs
description: Learn how to optimize Azure virtual machine network throughput.
services: virtual-network
documentationcenter: na
author: steveesp
manager: Gerald DeGrace
editor: ''

ms.assetid:
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/15/2017
ms.author: steveesp

---

# Optimize network throughput for Azure virtual machines

Azure virtual machines (VM) have default network settings that can be further optimized for network throughput. This article describes how to optimize network throughput for Microsoft Azure Windows and Linux VMs, including major distributions such as Ubuntu, CentOS, and Red Hat.

## Windows VM

If your Windows VM is supported with [Accelerated Networking](virtual-network-create-vm-accelerated-networking.md), enabling that feature would be the optimal configuration for throughput. For all other Windows VMs, using Receive Side Scaling (RSS) can reach higher maximal throughput than a VM without RSS. RSS may be disabled by default in a Windows VM. Complete the following steps to determine whether RSS is enabled and to enable it if it's disabled.

1. Enter the `Get-NetAdapterRss` PowerShell command to see if RSS is enabled for a network adapter. In the following example output returned from the `Get-NetAdapterRss`, RSS is not enabled.

	```powershell
	Name					: Ethernet
	InterfaceDescription	: Microsoft Hyper-V Network Adapter
	Enabled				 	: False
	```
2. Enter the following command to enable RSS:

	```powershell
	Get-NetAdapter | % {Enable-NetAdapterRss -Name $_.Name}
	```
	The previous command does not have an output. The command changed NIC settings, causing temporary connectivity loss for about one minute. A Reconnecting dialog box appears during the connectivity loss. Connectivity is typically restored after the third attempt.
3. Confirm that RSS is enabled in the VM by entering the `Get-NetAdapterRss` command again. If successful, the following example output is returned:

	```powershell
	Name					: Ethernet
	InterfaceDescription	: Microsoft Hyper-V Network Adapter
	Enabled				 : True
	```

## Linux VM

RSS is always enabled by default in an Azure Linux VM. Linux kernels released since October 2017 include new network optimizations options that enable a Linux VM to achieve higher network throughput.

### Ubuntu for new deployments

The Ubuntu Azure kernel provides the best network performance on Azure and has been the default kernel since September 21, 2017. In order to get this kernel, first install latest supported version of 16.04-LTS, as described below:
```json
"Publisher": "Canonical",
"Offer": "UbuntuServer",
"Sku": "16.04-LTS",
"Version": "latest"
```
After the creation is complete, enter the following commands to get the latest updates. These steps also work for VMs currently running the Ubuntu Azure kernel.

```bash
#run as root or preface with sudo
apt-get -y update
apt-get -y upgrade
apt-get -y dist-upgrade
```

The following optional command set may be helpful for existing Ubuntu deployments that already have the Azure kernel but that have failed to further updates with errors.

```bash
#optional steps may be helpful in existing deployments with the Azure kernel
#run as root or preface with sudo
apt-get -f install
apt-get --fix-missing install
apt-get clean
apt-get -y update
apt-get -y upgrade
apt-get -y dist-upgrade
```

#### Ubuntu Azure kernel upgrade for existing VMs

Significant throughput performance can be achieved by upgrading to the Azure Linux kernel. To verify whether you have this kernel, check your kernel version.

```bash
#Azure kernel name ends with "-azure"
uname -r

#sample output on Azure kernel:
#4.11.0-1014-azure
```

If your VM does not have the Azure kernel, the version number will usually begin with "4.4". In those cases, run the following commands as root.
```bash
#run as root or preface with sudo
apt-get update
apt-get upgrade -y
apt-get dist-upgrade -y
apt-get install "linux-azure"
reboot
```

### CentOS

In order to get the latest optimizations, it is best to create a VM with the latest supported version by specifying the following parameters:
```json
"Publisher": "OpenLogic",
"Offer": "CentOS",
"Sku": "7.4",
"Version": "latest"
```
New and existing VMs can benefit from installing the latest Linux Integration Services (LIS).
The throughput optimization is in LIS, starting from 4.2.2-2, although later versions contain further improvements. Enter the following
commands to install the latest LIS:

```bash
sudo yum update
sudo reboot
sudo yum install microsoft-hyper-v
```

### Red Hat

In order to get the optimizations, it is best to create a VM with the latest supported version by specifying the following parameters:
```json
"Publisher": "RedHat"
"Offer": "RHEL"
"Sku": "7-RAW"
"Version": "latest"
```
New and existing VMs can benefit from installing the latest Linux Integration Services (LIS).
The throughput optimization is in LIS, starting from 4.2. Enter the following commands to download and install LIS:

```bash
mkdir lis4.2.3-1
cd lis4.2.3-1
wget https://download.microsoft.com/download/6/8/F/68FE11B8-FAA4-4F8D-8C7D-74DA7F2CFC8C/lis-rpms-4.2.3-1.tar.gz
tar xvzf lis-rpms-4.2.3-1.tar.gz
cd LISISO
install.sh #or upgrade.sh if prior LIS was previously installed
```

Learn more about Linux Integration Services Version 4.2 for Hyper-V by viewing the [download page](https://www.microsoft.com/download/details.aspx?id=55106).

## Next steps
* Now that the VM is optimized, see the result with [Bandwidth/Throughput testing Azure VM](virtual-network-bandwidth-testing.md) for your scenario.
* Learn more with [Azure Virtual Network frequently asked questions (FAQ)](virtual-networks-faq.md)
