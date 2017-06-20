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
ms.date: 02/01/2017
ms.author: steveesp

---

# Optimize network throughput for Azure virtual machines

Azure virtual machines (VM) have default network settings that can be further optimized for network throughput. This article describes how to optimize network throughput for Microsoft Azure Windows and Linux VMs, including major distributions such as Ubuntu, CentOS and Red Hat.

## Windows VM

A VM using Receive Side Scaling (RSS) can reach higher maximal throughput than a VM without RSS. RSS may be disabled by default in a Windows VM. Complete the following steps to determine whether RSS is enabled and to enable it if it's disabled.

1. Enter the `Get-NetAdapterRss` PowerShell command to see if RSS is enabled for a network adapter. In the following example output returned from the `Get-NetAdapterRss`, RSS is not enabled.

	```powershell
	Name					: Ethernet
	InterfaceDescription	: Microsoft Hyper-V Network Adapter
	Enabled				 : False
	```
2. Enter the following command to enable RSS:

	```powershell
	Get-NetAdapter | % {Enable-NetAdapterRss -Name $_.Name}
	```
	The previous command does not have an output. The command changed NIC settings, causing temporary connectivity loss for about one minute. A Reconnecting dialog box appears during the connectivity loss. Connectivity is typically restored after the third attempt.
3. Confirm that RSS is enabled in the VM by entering the `Get-NetAdapterRss` command again. If successful, the following example output is returned:

	```powershell
	Name					:Ethernet
	InterfaceDescription	: Microsoft Hyper-V Network Adapter
	Enabled				 : True
	```

## Linux VM

RSS is always enabled by default in an Azure Linux VM. Linux kernels released since January, 2017 include new network optimization options that enable a Linux VM to achieve higher network throughput.

### Ubuntu

In order to get the optimization, first update to the latest supported version, as of January 2017, which is:
```json
"Publisher": "Canonical",
"Offer": "UbuntuServer",
"Sku": "16.04-LTS",
"Version": "latest"
```
After the update is complete, enter the following commands to get the latest kernel:

```bash
apt-get -f install
apt-get --fix-missing install
apt-get clean
apt-get -y update
apt-get -y upgrade
```

Optional command:

`apt-get -y dist-upgrade`

### CentOS

In order to get the optimization, first update to the latest supported version, as of January 2017, which is:
```json
"Publisher": "OpenLogic",
"Offer": "CentOS",
"Sku": "7.3",
"Version": "latest"
```
After the update is complete, install the latest Linux Integration Services (LIS).
The throughput optimization is in LIS, starting from 4.1.3. Enter the following
commands to install LIS:

```bash
sudo yum update
sudo reboot
sudo yum install microsoft-hyper-v
```

### Red Hat

In order to get the optimization, first update to the latest supported version, as of January 2017, which is:

"Publisher": "RedHat"
"Offer": "RHEL"
"Sku": "7.3"
"Version": "7.3.20161104"

After the update is complete, install the latest Linux Integration Services (LIS).
The throughput optimization is in LIS, starting from 4.1.3. Enter the following commands to download and install LIS:

```bash
mkdir lis4.1.3
cd lis4.1.3
wget https://download.microsoft.com/download/7/6/B/76BE7A6E-E39F-436C-9353-F4B44EF966E9/lis-rpms-4.1.3.tar.gz
tar xvzf lis-rpms-4.1.3.tar.gz
cd LISISO
install.sh #or upgrade.sh if previous LIS was previously installed
```
 
Learn more about Linux Integration Services Version 4.1 for Hyper-V by viewing the [download page](https://www.microsoft.com/download/details.aspx?id=51612).
