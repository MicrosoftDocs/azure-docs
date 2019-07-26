---
title: Enable InifinBand with SR-IOV - Azure Virtual Machines | Microsoft Docs
description: Learn how to enable InfiniBand with SR-IOV. 
services: virtual-machines
documentationcenter: ''
author: vermagit
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 05/15/2019
ms.author: amverma
---

# Enable InfiniBand with SR-IOV

The simplest and recommended way to configure your custom VM image with InfiniBand (IB) is to add the InfiniBandDriverLinux or InfiniBandDriverWindows VM extension to your deployment.
Learn how to use these VM extensions with [Linux](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-hpc#rdma-capable-instances) and [Windows](https://docs.microsoft.com/azure/virtual-machines/windows/sizes-hpc#rdma-capable-instances)

To manually configure InfiniBand on SR-IOV enabled VMs (currently HB and HC series), follow the steps below. These steps are for RHEL/CentOS only. For Ubuntu (16.04 and 18.04), and SLES (12 SP4 and 15), the inbox drivers work well.

## Manually install OFED

Install the latest MLNX_OFED drivers for ConnectX-5 from [Mellanox](https://www.mellanox.com/page/products_dyn?product_family=26).

For RHEL/CentOS (example below for 7.6):

```bash
sudo yum install -y kernel-devel python-devel
sudo yum install -y redhat-rpm-config rpm-build gcc-gfortran gcc-c++
sudo yum install -y gtk2 atk cairo tcl tk createrepo
wget --retry-connrefused --tries=3 --waitretry=5 http://content.mellanox.com/ofed/MLNX_OFED-4.5-1.0.1.0/MLNX_OFED_LINUX-4.5-1.0.1.0-rhel7.6-x86_64.tgz
tar zxvf MLNX_OFED_LINUX-4.5-1.0.1.0-rhel7.6-x86_64.tgz
sudo ./MLNX_OFED_LINUX-4.5-1.0.1.0-rhel7.6-x86_64/mlnxofedinstall --add-kernel-support
```

For Windows, download and install the WinOF-2 drivers for ConnectX-5 from [Mellanox](https://www.mellanox.com/page/products_dyn?product_family=32&menu_section=34)

## Enable IPoIB

```bash
sudo sed -i 's/LOAD_EIPOIB=no/LOAD_EIPOIB=yes/g' /etc/infiniband/openib.conf
sudo /etc/init.d/openibd restart
if [ $? -eq 1 ]
then
  sudo modprobe -rv  ib_isert rpcrdma ib_srpt
  sudo /etc/init.d/openibd restart
fi
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
