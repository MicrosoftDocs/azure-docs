---
title: Enable InifinBand with SRIOV in Azure | Microsoft Docs
description: Learn how to enable InfiniBand with SRIOV. 
services: virtual-machines
documentationcenter: ''
author: githubname
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 02/28/2019
ms.author: msalias
---


# Enable InfiniBand with SRIOV


The simplest and recommend way to configure your VM with InfiniBand (IB) is to add the InfiniBandDriverLinux or InfiniBandDriverWindows VM extension to your deployment.

Example, for Linux VM with RHEL/CentOS (ver 7.4-7.6):

```bash
"properties":{
"publisher": "Microsoft.HpcCompute",
"type": "InfiniBandDriverLinux",
"typeHandlerVersion": "1.0",
} 
```


## Manully install OFED

To manually configure InfiniBand for RHEL/CentOS 7.6, install latest Mellanox OFED drivers for ConnectX-5.

```bash
sudo yum install -y kernel-devel python-devel
sudo yum install -y redhat-rpm-config rpm-build gcc-gfortran gcc-c++
sudo yum install -y gtk2 atk cairo tcl tk createrepo
wget --retry-connrefused --tries=3 --waitretry=5 http://content.mellanox.com/ofed/MLNX_OFED-4.5-1.0.1.0/MLNX_OFED_LINUX-4.5-1.0.1.0-rhel7.6-x86_64.tgz
tar zxvf MLNX_OFED_LINUX-4.5-1.0.1.0-rhel7.6-x86_64.tgz
sudo ./MLNX_OFED_LINUX-4.5-1.0.1.0-rhel7.6-x86_64/mlnxofedinstall --add-kernel-support
```


## Assign an IP address

Assign an IP address to the ib0 interface, using either:

- Manually assign IP Address to the ib0 Interface (as root).

	```bash
	ifconfig ib0 $(sed '/rdmaIPv4Address=/!d;s/.*rdmaIPv4Address="\([0-9.]*\)".*/\1/' /var/lib/waagent/SharedConfig.xml)/16
	```

OR

- Use WALinuxAgent to assign IP address and make it persist.

	```bash
	yum install -y epel-release
	yum install -y python-pip
	python -m pip install --upgrade pip setuptools wheel
	wget "https://github.com/Azure/WALinuxAgent/archive/release-2.2.36.zip"
	unzip release-2.2.36.zip
	cd WALinuxAgent*
	python setup.py install --register-service --force
	sed -i -e 's/# OS.EnableRDMA=y/OS.EnableRDMA=y/g' /etc/waagent.conf
	sed -i -e 's/# AutoUpdate.Enabled=y/AutoUpdate.Enabled=y/g' /etc/waagent.conf
	systemctl restart waagent
	```

## Next steps

Learn more about [HPC](https://docs.microsoft.com/azure/architecture/topics/high-performance-computing/) on Azure.
