---
title: Use cloud-init to configure a swap partition on a Linux VM 
description: How to use cloud-init to configure a swap partition in a Linux VM during creation with the Azure CLI
author: rickstercdn
manager: gwallace
ms.service: virtual-machines-linux
ms.topic: article
ms.date: 11/29/2017
ms.author: rclaus

---
# Use cloud-init to configure a swap partition on a Linux VM
This article shows you how to use [cloud-init](https://cloudinit.readthedocs.io) to configure the swap partition on various Linux distributions. The swap partition was traditionally configured by the Linux Agent (WALA) based on which distributions required one.  This document will outline the process for building the swap partition on demand during provisioning time using cloud-init.  For more information about how cloud-init works natively in Azure and the supported Linux distros, see [cloud-init overview](using-cloud-init.md)

## Create swap partition for Ubuntu based images
By default on Azure, Ubuntu gallery images do not create swap partitions. To enable swap partition configuration during VM provisioning time using cloud-init - please see the [AzureSwapPartitions document](https://wiki.ubuntu.com/AzureSwapPartitions) on the Ubuntu wiki.

## Create swap partition for Red Hat and CentOS based images

Create a file in your current shell named *cloud_init_swappart.txt* and paste the following configuration. For this example, create the file in the Cloud Shell not on your local machine. You can use any editor you wish. Enter `sensible-editor cloud_init_swappart.txt` to create the file and see a list of available editors. Choose #1 to use the **nano** editor. Make sure that the whole cloud-init file is copied correctly, especially the first line.  

```yaml
#cloud-config
disk_setup:
  ephemeral0:
    table_type: gpt
    layout: [66, [33,82]]
    overwrite: true
fs_setup:
  - device: ephemeral0.1
    filesystem: ext4
  - device: ephemeral0.2
    filesystem: swap
mounts:
  - ["ephemeral0.1", "/mnt"]
  - ["ephemeral0.2", "none", "swap", "sw", "0", "0"]
```

Before deploying this image, you need to create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

Now, create a VM with [az vm create](/cli/azure/vm) and specify the cloud-init file with `--custom-data cloud_init_swappart.txt` as follows:

```azurecli-interactive 
az vm create \
  --resource-group myResourceGroup \
  --name centos74 \
  --image OpenLogic:CentOS:7-CI:latest \
  --custom-data cloud_init_swappart.txt \
  --generate-ssh-keys 
```

## Verify swap partition was created
SSH to the public IP address of your VM shown in the output from the preceding command. Enter your own **publicIpAddress** as follows:

```bash
ssh <publicIpAddress>
```

Once you have SSH'ed into the vm, check if the swap partition was created

```bash
swapon -s
```

The output from this command should look like this:

```text
Filename                Type        Size    Used    Priority
/dev/sdb2  partition   2494440 0   -1
```

> [!NOTE] 
> If you have an existing Azure image that has a swap partition configured and you want to change the swap partition configuration for new images, you should remove the existing swap partition. Please see 'Customize Images to provision by cloud-init' document for more details.

## Next steps
For additional cloud-init examples of configuration changes, see the following:
 
- [Add an additional Linux user to a VM](cloudinit-add-user.md)
- [Run a package manager to update existing packages on first boot](cloudinit-update-vm.md)
- [Change VM local hostname](cloudinit-update-vm-hostname.md) 
- [Install an application package, update configuration files and inject keys](tutorial-automate-vm-deployment.md)
