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
ms.date: 12/02/2016
ms.author: iainfou

---
# Install and configure Remote Desktop (xrdp) to connect to a Linux VM in Azure
Typically, Linux VMs are managed from the command line using a secure shell (SSH) connection. [Xrdp](http://www.xrdp.org/) is an open source Remote Desktop Protocol (RDP) server that allows you to connect your to Linux VM with a graphical Remote Desktop client. This article details how to install a window manager for your Linux VM and configure xrdp for remote connections.


## Prerequisites
This article provides the steps to install and configure xrdp on an existing Linux VM in Azure. If you need to create a VM, use one of the following methods:

- The [Azure CLI (azure.js)](virtual-machines-linux-quick-create-cli-nodejs.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) or [Azure CLI 2.0 Preview (az.py)](virtual-machines-linux-quick-create-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- The [Azure portal](virtual-machines-linux-quick-create-portal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

You also need the [latest Azure CLI](../xplat-cli-install.md) installed and logged in to an [active Azure account](https://azure.microsoft.com/pricing/free-trial/).


## Quick commands
If you need to quickly accomplish the task, the following section details the base commands to install and configure remote desktop on your VM. More detailed information and context for each step can be found the rest of the document, [starting here](#install-graphical-environment-on-linux-vm).

The following examples install and configure the lightweight [xfce4](https://www.xfce.org/) desktop environment on an Ubuntu VM. Other distributions vary slightly (use `yum` to install on Red Hat Enterprise Linux and configure appropriate `selinux` rules, or use `zypper` to install on SUSE, for example).

SSH to your VM and install xfce as follows:

```bash
sudo apt-get update
sudo apt-get install xfce4
```

Install xrdp as follows:

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

Set a password for your user account if currently only using SSH key for authentication:

```bash
sudo passwd ops
```

Exit the SSH session to your Linux VM. Use the Azure CLI on your local computer to create a network security group rule to allow the remote desktop traffic. The following example creates a rule named `myNetworkSecurityGroupRule` within `myNetworkSecurityGroup` to `allow` traffic on `tcp` port `3389`:

```azurecli
azure network nsg rule create --resource-group myResourceGroup \
    --nsg-name myNetworkSecurityGroup --name myNetworkSecurityGroupRule \
    --protocol tcp --direction inbound --priority 1010 \
    --destination-port-range 3389 --access allow
```

## Install graphical environment on Linux VM
Most Linux VMs in Azure do not have a graphical environment installed by default. Linux VMs are commonly managed using SSH connections rather than a graphical environment. There are various graphical environments in Linux that you can choose. Depending on your choice of graphical environment, it may consume one to 2 GB of disk space, and take 5 to 10 minutes to install and configure all the required packages.

The following examples install and configure the lightweight [xfce4](https://www.xfce.org/) desktop environment on an Ubuntu VM. Commands for other distributions vary slightly (use `yum` to install on Red Hat Enterprise Linux and configure appropriate `selinux` rules, or use `zypper` to install on SUSE, for example).

```bash
sudo apt-get update
sudo apt-get install xfce4
```

## Install and configure xrdp
xrdp is available on most Linux distributions, and works well with xfce. Install xrdp on your Ubuntu VM as follows:

```bash
sudo apt-get install xrdp
```

Tell xrdp what graphical environment to use when you start your session. Configure xrdp to use xfce as your graphical environment as follows:

```bash
echo xfce4-session >~/.xsession
```

Restart xrdp for the changes to take effect as follows:

```bash
sudo service xrdp restart
```


## Set a local user account password
If you created a password for your user account when you created your VM, skip this step. If you only use SSH key authentication and do not have a local account password set, specify a password before you use xrdp to log in to your VM. xrdp cannot accept SSH keys for authentication. The following example specifies a password for the user account `ops`:

```bash
sudo passwd ops
```

> [!NOTE]
> Specifying a password does not update your sshd configuration to permit password logins. From a security perspective, you may wish to connect to your VM with an SSH tunnel using key-based authentication and then connect to xrdp. If so, skip the following step on creating a network security group rule to allow remote desktop traffic.


## Create a Network Security Group rule for Remote Desktop traffic
To allow Remote Desktop traffic to reach your Linux VM, a network security group rule needs to be created that allows TCP on port 3389 to reach your VM. For more information about network security group rules, see [What is a Network Security Group?](../virtual-network/virtual-networks-nsg?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) You can also [use the Azure portal to create a network security group rule](virtual-machines-windows-nsg-quickstart-portal?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

The following example creates a network security group rule named `myNetworkSecurityGroupRule` to `allow` traffic on `tcp` port `3389`.

- Use the Azure CLI (azure.js):

    ```azurecli
    azure network nsg rule create --resource-group myResourceGroup \
        --nsg-name myNetworkSecurityGroup --name myNetworkSecurityGroupRule \
        --protocol tcp --direction inbound --priority 1010 \
        --destination-port-range 3389 --access allow
    ```

- Use the Azure CLI 2.0 Preview (az.py):
    
    ```azurecli
    az network nsg rule create --resource-group myResourceGroup \
    --nsg-name myNetworkSecurityGroup --name myNetworkSecurityGroupRule \
    --protocol tcp --direction inbound --priority 1010 \
    --source-address-prefix '*' --source-port-range '*' \
    --destination-address-prefix '*' --destination-port-range 3389 \
    --access allow
    ```


## Connect your Linux VM with a Remote Desktop client
Open your Remote Desktop client and connect to the IP address or DNS name of your Linux VM. Enter the username and password for the user account on your VM as follows:

![Connect to xrdp using your Remote Desktop client](./media/virtual-machines-linux-use-remote-desktop/remote-desktop-client.png)

After authenticating, the xfce desktop environment will load and look similar to the following example:

![xfce desktop environment through xrdp](./media/virtual-machines-linux-use-remote-desktop/xfce-desktop-environment.png)


## Troubleshoot
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
For more information about creating and using SSH keys with Linux VMs, see [Create SSH keys for Linux VMs in Azure](virtual-machines-linux-mac-create-ssh-keys?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

For information on using SSH from Windows, see [How to use SSH keys with Windows](virtual-machines-linux-ssh-from-windows?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

