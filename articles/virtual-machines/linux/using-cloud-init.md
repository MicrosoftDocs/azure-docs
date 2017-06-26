---
title: Use cloud-init to customize a Linux VM | Microsoft Docs
description: How to use cloud-init to customize a Linux VM during creation with the Azure CLI 2.0 Preview
services: virtual-machines-linux
documentationcenter: ''
author: iainfoulds
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 195c22cd-4629-4582-9ee3-9749493f1d72
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: article
ms.date: 02/10/2017
ms.author: iainfou

---
# Use cloud-init to customize a Linux VM during creation
This article shows you how to make a cloud-init script to set the hostname, update installed packages, and manage user accounts with the Azure CLI 2.0.  The cloud-init scripts are called when you create a VM from Azure CLI.  You can also perform these steps with the [Azure CLI 1.0](using-cloud-init-nodejs.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

## Quick commands
Create a cloud-init.txt script that sets the hostname, updates all packages, and adds a sudo user to Linux.

```sh
#cloud-config
hostname: myVMhostname
apt_upgrade: true
users:
  - name: myNewAdminUser
    groups: sudo
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    ssh-authorized-keys:
      - ssh-rsa AAAAB3<snip>==myAdminUser@myVM
```

Create a resource group to launch VMs into with [az group create](/cli/azure/group#create). The following example creates the resource group named `myResourceGroup`:

```azurecli
az group create --name myResourceGroup --location westus
```

Create a Linux VM with [az vm create](/cli/azure/vm#create) using cloud-init to configure it during boot.

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --image UbuntuLTS \
    --admin-username azureuser \
    --ssh-key-value ~/.ssh/id_rsa.pub \
    --custom-data cloud-init.txt
```

## Detailed walkthrough
### Introduction
When you launch a new Linux VM, you are getting a standard Linux VM with nothing customized or ready for your needs. [Cloud-init](https://cloudinit.readthedocs.org) is a standard way to inject a script or configuration settings into that Linux VM as it is booting up for the first time.

On Azure, there are a three different ways to make changes onto a Linux VM as it is being deployed or booted.

* Inject scripts using cloud-init.
* Inject scripts using the Azure [VMAccess Extension](using-vmaccess-extension.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
* An Azure template using cloud-init.
* An Azure template using [CustomScriptExtention](extensions-customscript.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

To inject scripts at any time after boot:

* SSH to run commands directly
* Inject scripts using the Azure [VMAccess Extension](using-vmaccess-extension.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json), either imperatively or in an Azure template
* Configuration management tools like Ansible, Salt, Chef, and Puppet.

> [!NOTE]
> : VMAccess Extension executes a script as root in the same way using SSH can.  However, using the VM extension enables several features that Azure offers that can be useful depending upon your scenario.
> 
> 

## Cloud-init availability on Azure VM quick-create image aliases:
| Alias | Publisher | Offer | SKU | Version | cloud-init |
|:--- |:--- |:--- |:--- |:--- |:--- |
| CentOS |OpenLogic |Centos |7.2 |latest |no |
| CoreOS |CoreOS |CoreOS |Stable |latest |yes |
| Debian |credativ |Debian |8 |latest |no |
| openSUSE |SUSE |openSUSE |13.2 |latest |no |
| RHEL |Redhat |RHEL |7.2 |latest |no |
| UbuntuLTS |Canonical |UbuntuServer |14.04.4-LTS |latest |yes |

Microsoft is working with our partners to get cloud-init included and working in the images that they provide to Azure.

## Add a cloud-init script to the VM creation with the Azure CLI
To launch a cloud-init script when creating a VM in Azure, specify the cloud-init file using the Azure CLI `--custom-data` switch.

Create a resource group to launch VMs into.

Create a resource group to launch VMs into with [az group create](/cli/azure/group#create). The following example creates the resource group named `myResourceGroup`:

```azurecli
az group create --name myResourceGroup --location westus
```

Create a Linux VM with [az vm create](/cli/azure/vm#create) using cloud-init to configure it during boot.

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --image UbuntuLTS \
    --admin-username azureuser \
    --ssh-key-value ~/.ssh/id_rsa.pub \
    --custom-data cloud-init.txt
```

## Create a cloud-init script to set the hostname of a Linux VM
One of the simplest and most important settings for any Linux VM would be the hostname. We can easily set this using cloud-init with this script.  

### Example cloud-init script named `cloud_config_hostname.txt`.
```sh
#cloud-config
hostname: myservername
```

During the initial startup of the VM, this cloud-init script sets the hostname to `myservername`. Create a Linux VM with [az vm create](/cli/azure/vm#create) using cloud-init to configure it during boot.

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --image UbuntuLTS \
    --admin-username azureuser \
    --ssh-key-value ~/.ssh/id_rsa.pub \
    --custom-data cloud-init.txt
```

Login and verify the hostname of the new VM.

```bash
ssh myVM
hostname
myservername
```

## Create a cloud-init script to update Linux
For security, you want your Ubuntu VM to update on the first boot.  Using cloud-init we can do that with the follow script, depending on the Linux distribution you are using.

### Example cloud-init script `cloud_config_apt_upgrade.txt` for the Debian Family
```sh
#cloud-config
apt_upgrade: true
```

After Linux has booted, all the installed packages are updated via `apt-get`. Create a Linux VM with [az vm create](/cli/azure/vm#create) using cloud-init to configure it during boot.

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --image UbuntuLTS \
    --admin-username azureuser \
    --ssh-key-value ~/.ssh/id_rsa.pub \
    --custom-data cloud_config_apt_upgrade.txt
```

Login and verify all packages are updated.

```bash
ssh myUbuntuVM
sudo apt-get upgrade
Reading package lists... Done
Building dependency tree
Reading state information... Done
Calculating upgrade... Done
The following packages have been kept back:
  linux-generic linux-headers-generic linux-image-generic
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
```

## Create a cloud-init script to add a user to Linux
One of the first tasks on any new Linux VM is to add a user for yourself or to avoid using `root`. SSH keys are best practice for security and for usability and they are added to the `~/.ssh/authorized_keys` file with this cloud-init script.

### Example cloud-init script `cloud_config_add_users.txt` for Debian Family
```sh
#cloud-config
users:
  - name: myCloudInitAddedAdminUser
    groups: sudo
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    ssh-authorized-keys:
      - ssh-rsa AAAAB3<snip>==myAdminUser@myUbuntuVM
```

After Linux has booted, all the listed users are created and added to the sudo group. Create a Linux VM with [az vm create](/cli/azure/vm#create) using cloud-init to configure it during boot.

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --image UbuntuLTS \
    --admin-username azureuser \
    --ssh-key-value ~/.ssh/id_rsa.pub \
    --custom-data cloud_config_add_users.txt
```

Login and verify the newly created user.

```bash
ssh myVM
cat /etc/group
```

Output

```bash
root:x:0:
<snip />
sudo:x:27:myCloudInitAddedAdminUser
<snip />
myCloudInitAddedAdminUser:x:1000:
```

## Next steps
Cloud-init is becoming one standard way to modify your Linux VM on boot. Azure also has VM extensions, which allow you to modify your LinuxVM on boot or while it is running. For example, you can use the Azure VMAccessExtension to reset SSH or user information while the VM is running. With cloud-init, you would need a reboot to reset the password.

[About virtual machine extensions and features](../windows/extensions-features.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

[Manage users, SSH, and check or repair disks on Azure Linux VMs using the VMAccess Extension](using-vmaccess-extension.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

