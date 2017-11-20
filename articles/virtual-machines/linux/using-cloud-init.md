---
title: Use cloud-init to customize a Linux VM | Microsoft Docs
description: How to use cloud-init to customize a Linux VM during creation with the Azure CLI 2.0
services: virtual-machines-linux
documentationcenter: ''
author: iainfoulds
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 195c22cd-4629-4582-9ee3-9749493f1d72
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: article
ms.date: 10/03/2017
ms.author: iainfou

---
# Use cloud-init to customize a Linux VM in Azure
This article shows you how to use [cloud-init](https://cloudinit.readthedocs.io) to set the hostname, update packages, and manage user accounts on a virtual machine (VM) in Azure. These cloud-init scripts run on boot when you create a VM with the Azure CLI 2.0. For a more in-depth overview on how to install applications, write configuration files, and inject keys from Key Vault, see [this tutorial](tutorial-automate-vm-deployment.md). You can also perform these steps with the [Azure CLI 1.0](using-cloud-init-nodejs.md).


## Cloud-init overview
[Cloud-init](https://cloudinit.readthedocs.io) is a widely used approach to customize a Linux VM as it boots for the first time. You can use cloud-init to install packages and write files, or to configure users and security. As cloud-init runs during the initial boot process, there are no additional steps or required agents to apply your configuration.

Cloud-init also works across distributions. For example, you don't use **apt-get install** or **yum install** to install a package. Instead you can define a list of packages to install. Cloud-init automatically uses the native package management tool for the distro you select.

We are working with our partners to get cloud-init included and working in the images that they provide to Azure. The following table outlines the current cloud-init availability on Azure platform images:

| Alias | Publisher | Offer | SKU | Version |
|:--- |:--- |:--- |:--- |:--- |:--- |
| UbuntuLTS |Canonical |UbuntuServer |16.04-LTS |latest |
| UbuntuLTS |Canonical |UbuntuServer |14.04.5-LTS |latest |
| CoreOS |CoreOS |CoreOS |Stable |latest |


## Set the hostname with cloud-init
Cloud-init files are written in [YAML](http://www.yaml.org). To run a cloud-init script when you create a VM in Azure with [az vm create](/cli/azure/vm#create), specify the cloud-init file with the `--custom-data` switch. Let's look at some examples of what you can configure with a cloud-init file. A common scenario is to set the hostname of a VM. By default, the hostname is the same as the VM name. 

First, create a resource group with [az group create](/cli/azure/group#create). The following example creates the resource group named *myResourceGroup* in the *eastus* location:

```azurecli
az group create --name myResourceGroup --location eastus
```

In your current shell, create a file named *cloud_init_hostname.txt* and paste the following configuration. For example, create the file in the Cloud Shell not on your local machine. You can use any editor you wish. In the Cloud Shell, enter `sensible-editor cloud_init_hostname.txt` to create the file and see a list of available editors. Make sure that the whole cloud-init file is copied correctly, especially the first line:

```yaml
#cloud-config
hostname: myhostname
```

Now, create a VM with [az vm create](/cli/azure/vm#create) and specify the cloud-init file with `--custom-data cloud_init_hostname.txt` as follows:

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVMHostname \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys \
    --custom-data cloud_init_hostname.txt
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
myhostname
```

## Update a VM with cloud-init
For security purposes, you may want to configure a VM to apply the latest updates on first boot. As cloud-init works across different Linux distros, there is no need to specify `apt` or `yum` for the package manager. Instead, you define `package_upgrade` and let the cloud-init process determine the appropriate mechanism for the distro in use. This workflow allows you to use the same cloud-init scripts across distros.

To see upgrade process in action, create a cloud-init file named *cloud_init_upgrade.txt* and paste the following configuration:

```yaml
#cloud-config
package_upgrade: true
```

Now, create a VM with [az vm create](/cli/azure/vm#create) and specify the cloud-init file with `--custom-data cloud_init_upgrade.txt` as follows:

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVMUpgrade \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys \
    --custom-data cloud_init_upgrade.txt
```

SSH to the public IP address of your VM shown in the output from the preceding command. Enter your own public IP address as follows:

```bash
ssh azureuser@publicIpAddress
```

Run the package management tool and check for updates. The following example uses `apt-get` on an Ubuntu VM:

```bash
sudo apt-get upgrade
```

As cloud-init checked for and installed updates on boot, there are no updates to apply, as shown in the following example output:

```bash
Reading package lists... Done
Building dependency tree
Reading state information... Done
Calculating upgrade... Done
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
```

## Add a user to a VM with cloud-init
One of the first tasks on any new Linux VM is to add a user for yourself to avoid the use of *root*. SSH keys are best practice for security and usability. Keys are added to the *~/.ssh/authorized_keys* file with this cloud-init script.

To add a user to a Linux VM, create a cloud-init file named *cloud_init_add_user.txt* and paste the following configuration. Provide your own public key (such as the contents of *~/.ssh/id_rsa.pub*) for *ssh-authorized-keys*:

```yaml
#cloud-config
users:
  - name: myadminuser
    groups: sudo
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    ssh-authorized-keys:
      - ssh-rsa AAAAB3<snip>
```

Now, create a VM with [az vm create](/cli/azure/vm#create) and specify the cloud-init file with `--custom-data cloud_init_add_user.txt` as follows:

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVMUser \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys \
    --custom-data cloud_init_add_user.txt
```

SSH to the public IP address of your VM shown in the output from the preceding command. Enter your own public IP address as follows:

```bash
ssh myadminuser@publicIpAddress
```

To confirm your user was added to the VM and the specified groups, view the contents of the */etc/group* file as follows:

```bash
cat /etc/group
```

The following example output shows the user from the *cloud_init_add_user.txt* file has been added to the VM and the appropriate group:

```bash
root:x:0:
<snip />
sudo:x:27:myadminuser
<snip />
myadminuser:x:1000:
```

## Next steps
Cloud-init is one of standard ways to modify your Linux VMs on boot. In Azure, you can also use VM extensions to modify your Linux VM on boot or once it is running. For example, you can use the Azure VM extension to execute a script on a running VM, not just on first boot. For more information about VM extensions, see [VM extensions and features](extensions-features.md), or for examples on how to use the extension, see [Manage users, SSH, and check or repair disks on Azure Linux VMs using the VMAccess Extension](using-vmaccess-extension.md).