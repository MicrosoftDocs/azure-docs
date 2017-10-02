---
title: Use cloud-init to customize a Linux VM | Microsoft Docs
description: How to use cloud-init to customize a Linux VM during creation with the Azure CLI 2.0
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
ms.date: 10/02/2017
ms.author: iainfou

---
# Use cloud-init to customize a Linux VM during creation
This article shows you how to make a cloud-init script to set the hostname, update installed packages, and manage user accounts with the Azure CLI 2.0. The cloud-init scripts are called when you create a virtual machine (VM) from Azure CLI. For a more in-depth overview on installing applications, writing configuration files, and injecting keys from Key Vault, see [this tutorial](tutorial-automate-vm-deployment.md). You can also perform these steps with the [Azure CLI 1.0](using-cloud-init-nodejs.md).


## Cloud-init overview
[Cloud-init](https://cloudinit.readthedocs.io) is a widely used approach to customize a Linux VM as it boots for the first time. You can use cloud-init to install packages and write files, or to configure users and security. As cloud-init runs during the initial boot process, there are no additional steps or required agents to apply your configuration.

Cloud-init also works across distributions. For example, you don't use **apt-get install** or **yum install** to install a package. Instead you can define a list of packages to install. Cloud-init automatically uses the native package management tool for the distro you select.

We are working with our partners to get cloud-init included and working in the images that they provide to Azure. The following table outlines the current cloud-init availability on Azure platform images:

| Alias | Publisher | Offer | SKU | Version |
|:--- |:--- |:--- |:--- |:--- |:--- |
| UbuntuLTS |Canonical |UbuntuServer |16.04-LTS |latest |
| UbuntuLTS |Canonical |UbuntuServer |14.04.5-LTS |latest |
| CoreOS |CoreOS |CoreOS |Stable |latest |


## Create a VM and specify a cloud-init file
Cloud-init files are writted in [YAML](http://www.yaml.org). To run a cloud-init script when you create a VM in Azure with [az vm create](/cli/azure/vm#create), specify the cloud-init file with the `--custom-data` switch. The following example passes a cloud-init file named `cloud-init.txt` to a VM. 

First, create a resource group to launch VMs into with [az group create](/cli/azure/group#create). The following example creates the resource group named *myResourceGroup*:

```azurecli
az group create --name myResourceGroup --location eastus
```

Create a Linux VM with [az vm create](/cli/azure/vm#create) and specify the cloud-init file with `--custom-data cloud-init.txt` as follows:

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys \
    --custom-data cloud-init.txt
```

## Create a cloud-init script to set the hostname of a Linux VM
Let's look at some examples of what you can configure with a cloud-init file. A common scenario is to set the hostname of a VM. By default, the hostname is the same as the VM name. 

In your current shell, create a file named *cloud-init-hostname.txt* and paste the following configuration. For example, create the file in the Cloud Shell not on your local machine. You can use any editor you wish. In the Cloud Shell, enter `sensible-editor cloud-init-hostname.txt` to create the file and see a list of available editors. Make sure that the whole cloud-init file is copied correctly, especially the first line:

```yaml
#cloud-config
hostname: myhostname
```

Now, create a VM with [az vm create](/cli/azure/vm#create) and specify the cloud-init file with `--custom-data cloud-init-hostname.txt` as follows:

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys \
    --custom-data cloud-init.txt
```

Once created, the Azure CLI shows information about the VM. Use the `publicIpAddress` to SSH to your VM. Enter your own address as follows:

```bash
ssh azureuser@publicIpAddress
```

To see the VM name, use the `hostname` command as follows:

```bash
hostname
```

The VM should report the hostname as that value set in the cloud-init file, as shown in the following example output:

```bash
$ myservername
```

## Create a cloud-init script
For security purposes, you can configure your VM to update on the first boot. As cloud-init works across different Linux distros, you don't need to specify if `apt` or `yum` shuold be used.

```yaml
#cloud-config
package_upgrade: true
```

After Linux has booted, all the installed packages are updated via **apt-get**. Create a Linux VM with [az vm create](/cli/azure/vm#create) using cloud-init to configure it during boot.

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys \
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
One of the first tasks on any new Linux VM is to add a user for yourself or to avoid using *root*. SSH keys are best practice for security and for usability and they are added to the *~/.ssh/authorized_keys* file with this cloud-init script.

### Example cloud-init script `cloud_config_add_users.txt` for Debian Family
```yaml
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
    --generate-ssh-keys \
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

[About virtual machine extensions and features](extensions-features.md)

[Manage users, SSH, and check or repair disks on Azure Linux VMs using the VMAccess Extension](using-vmaccess-extension.md)