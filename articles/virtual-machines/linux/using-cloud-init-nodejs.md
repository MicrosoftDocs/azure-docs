---
title: Using cloud-init to customize a Linux VM during creation in Azure | Microsoft Docs
description: How to use cloud-init to customize a Linux VM during creation with the Azure CLI 1.0
services: virtual-machines-linux
documentationcenter: ''
author: vlivech
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 10/26/2016
ms.author: v-livech

---
# Use cloud-init to customize a Linux VM during creation with the Azure CLI 1.0
This article shows how to make a cloud-init script to set the hostname, update installed packages, and manage user accounts.  The cloud-init scripts are called during the VM creation from Azure CLI.  The article requires:

* an Azure account ([get a free trial](https://azure.microsoft.com/pricing/free-trial/)).
* the [Azure CLI](../../cli-install-nodejs.md) logged in with `azure login`.
* the Azure CLI *must be in* Azure Resource Manager mode `azure config mode arm`.

## CLI versions to complete the task
You can complete the task using one of the following CLI versions:

- [Azure CLI 1.0](#quick-commands) – our CLI for the classic and resource management deployment models (this article)
- [Azure CLI 2.0](using-cloud-init.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) - our next generation CLI for the resource management deployment model

## Quick Commands
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
Create a resource group to launch VMs into.

```azurecli
azure group create myResourceGroup westus
```

Create a Linux VM using cloud-init to configure it during boot.

```azurecli
azure vm create \
  -g myResourceGroup \
  -n myVM \
  -l westus \
  -y Linux \
  -f myVMnic \
  -F myVNet \
  -P 10.0.0.0/22 \
  -j mySubnet \
  -k 10.0.0.0/24 \
  -Q canonical:ubuntuserver:14.04.2-LTS:latest \
  -M ~/.ssh/id_rsa.pub \
  -u myAdminUser \
  -C cloud-init.txt
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

## Adding a cloud-init script to the VM creation with the Azure CLI
To launch a cloud-init script when creating a VM in Azure, specify the cloud-init file using the Azure CLI `--custom-data` switch.

Create a resource group to launch VMs into.

```azurecli
azure group create myResourceGroup westus
```

Create a Linux VM using cloud-init to configure it during boot.

```azurecli
azure vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --location westus \
  --os-type Linux \
  --nic-name myVMnic \
  --vnet-name myVNet \
  --vnet-address-prefix 10.0.0.0/22 \
  --vnet-subnet-name mySubnet \
  --vnet-subnet-address-prefix 10.0.0.0/24 \
  --image-urn canonical:ubuntuserver:14.04.2-LTS:latest \
  --ssh-publickey-file ~/.ssh/id_rsa.pub \
  --admin-username myAdminUser \
  --custom-data cloud-init.txt
```

## Creating a cloud-init script to set the hostname of a Linux VM
One of the simplest and most important settings for any Linux VM would be the hostname. We can easily set this using cloud-init with this script.  

### Example cloud-init script named `cloud_config_hostname.txt`.
```sh
#cloud-config
hostname: myservername
```

During the initial startup of the VM, this cloud-init script sets the hostname to `myservername`.

```azurecli
azure vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --location westus \
  --os-type Linux \
  --nic-name myVMnic \
  --vnet-name myVNet \
  --vnet-address-prefix 10.0.0.0/22 \
  --vnet-subnet-name mySubNet \
  --vnet-subnet-address-prefix 10.0.0.0/24 \
  --image-urn canonical:ubuntuserver:14.04.2-LTS:latest \
  --ssh-publickey-file ~/.ssh/id_rsa.pub \
  --admin-username myAdminUser \
  --custom-data cloud_config_hostname.txt
```

Login and verify the hostname of the new VM.

```bash
ssh myVM
hostname
myservername
```

## Creating a cloud-init script to update Linux
For security, you want your Ubuntu VM to update on the first boot.  Using cloud-init we can do that with the follow script, depending on the Linux distribution you are using.

### Example cloud-init script `cloud_config_apt_upgrade.txt` for the Debian Family
```sh
#cloud-config
apt_upgrade: true
```

After Linux has booted, all the installed packages are updated via `apt-get`.

```azurecli
azure vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --location westus \
  --os-type Linux \
  --nic-name myVMnic \
  --vnet-name myVNet \
  --vnet-address-prefix 10.0.0.0/22 \
  --vnet-subnet-name mySubNet \
  --vnet-subnet-address-prefix 10.0.0.0/24 \
  --image-urn canonical:ubuntuserver:14.04.2-LTS:latest \
  --ssh-publickey-file ~/.ssh/id_rsa.pub \
  --admin-username myAdminUser \
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

## Creating a cloud-init script to add a user to Linux
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

After Linux has booted, all the listed users are created and added to the sudo group.

```azurecli
azure vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --location westus \
  --os-type Linux \
  --nic-name myVMnic \
  --vnet-name myVNet \
  --vnet-address-prefix 10.0.0.0/22 \
  --vnet-subnet-name mySubNet \
  --vnet-subnet-address-prefix 10.0.0.0/24 \
  --image-urn canonical:ubuntuserver:14.04.2-LTS:latest \
  --ssh-publickey-file ~/.ssh/id_rsa.pub \
  --admin-username myAdminUser \
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

## Next Steps
Cloud-init is becoming one standard way to modify your Linux VM on boot. Azure also has VM extensions, which allow you to modify your LinuxVM on boot or while it is running. For example, you can use the Azure VMAccessExtension to reset SSH or user information while the VM is running. With cloud-init, you would need a reboot to reset the password.

[About virtual machine extensions and features](../windows/extensions-features.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

[Manage users, SSH, and check or repair disks on Azure Linux VMs using the VMAccess Extension](using-vmaccess-extension.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

