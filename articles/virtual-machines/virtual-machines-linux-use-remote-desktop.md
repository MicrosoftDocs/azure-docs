---
title: Use Remote Desktop to a Linux VM in Azure | Microsoft Docs
description: Learn how to install and configure Remote Desktop (xrdp) to connect to a Linux VM in Azure using graphical tools
services: virtual-machines-linux
documentationcenter: ''
author: iainfoulds
manager: timlt
editor: ''

ms.assetid: 
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 12/01/2016
ms.author: iainfou

---
# Install and configure Remote Desktop (xrdp) to connect to a Linux VM in Azure
Typically, Linux VMs are managed from the command line using a secure shell (SSH) connection. Xrdp is an open source Remote Desktop Protocol (RDP) server that allows you to connect your Linux VM with a Remote Desktop client. This article details how to install a window manager for your Linux VM and configure xrdp for remote connections.


## Prerequisites
This article provides the steps to install and configure xrdp on an existing Linux VM in Azure. If you need to create a VM, you can do so using one of the following methods:

- The [Azure CLI (azure.js)](virtual-machines-linux-quick-create-cli-nodejs.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) or [Azure CLI 2.0 Preview (az.py)](virtual-machines-linux-quick-create-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- The [Azure portal](virtual-machines-linux-quick-create-portal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)


## Install graphical environment on Linux VM
Most Linux VMs in Azure do not have a graphical interface (windowmanager) installed by default. Linux VMs are commonly managed using SSH connections rather than a graphical interface. Different Linux distributions have different default packages that are installed when you elect to install a graphical interface. Depending on the choice of graphical interface, the install may consume one to two gigabytes of disk space and take five to ten minutes to install and configure all the required packages.

The following examples install and configure the lightweight xfce4 desktop environment on an Ubuntu VM. Other distributions will vary slightly (use `yum` to install on Red Hat Enterprise Linux and configure `selinux` rules accordingly, or use `zypper` to install on SUSE, for example).

```bash
sudo apt-get update
sudo apt-get install xfce4
```

## Install and configure xrdp

Install `xrdp` as follows:

```bash
sudo apt-get install xrdp
```

Configure xrdp to use xfce as your graphical interface as follows:

```bash
echo xfce4-session >~/.xsession
```

Restart xrdp for the changes to take effect as follows:

```bash
sudo service xrdp restart
```


## Set a local user account password
If you only use SSH key authentication and do not have a local account password set, you need to create a password. The following example sets a password for the username `ops`:

```bash
sudo passwd ops
```


## Create a Network Security Group rule for Remote Desktop
To allow Remote Desktop traffic to reach your Linux VM, a network security group rule needs to be created that allows TCP on port 3389 to your VM. You can create a Network Security Group rule using the [Azure CLI](virtual-machines-linux-nsg-quickstart.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). For more information about network security group rules, see [What is a Network Security Group?](../virtual-network/virtual-networks-nsg?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

The following example creates a network security group rule named `myNetworkSecurityGroupRule` to allow TCP traffic on port 3389:

```azurecli
azure network nsg rule create --resource-group myResourceGroup \
    --nsg-name myNetworkSecurityGroup --name myNetworkSecurityGroupRule \
    --protocol tcp --direction inbound --priority 1010 \
    --destination-port-range 3389 --access allow
```


## Connect your Linux VM using a Remote Desktop client
Open your Remote Desktop client and connect to the IP address or DNS name of your Linux VM.


## Troubleshooting
If you cannot connect to your Linux VM using a Remote Desktop client, verify that your VM is listening for RDP connections using `netstat` as follows:

```bash
sudo netstat -plnt | grep rdp
```

The following example shows the VM listening on TCP port 3389 as expected:

```bash
tcp     0     0      127.0.0.1:3350     0.0.0.0:*     LISTEN     53192/xrdp-sesman
tcp     0     0      0.0.0.0:3389       0.0.0.0:*     LISTEN     53188/xrdp
```

## Next
For more information to use xrdp, you could refer [here](http://www.xrdp.org/).

