---
title: Use cloud-init to configure a swap partition on a Linux VM
description: How to use cloud-init to configure a swap partition in a Linux VM during creation with the Azure CLI
author: mattmcinnes
ms.service: virtual-machines
ms.collection: linux
ms.topic: how-to
ms.date: 03/29/2023
ms.author: mattmcinnes
ms.subservice: cloud-init
ms.custom: devx-track-azurecli, linux-related-content
---
# Use cloud-init to configure a swap partition on a Linux VM

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets

This article shows you how to use [cloud-init](https://cloudinit.readthedocs.io) to configure the swap partition on various Linux distributions. The swap partition was traditionally configured by the Linux Agent (WALA) based on which distributions required one.  This document outlines the process for building the swap partition on demand during provisioning time using cloud-init.  For more information about how cloud-init works natively in Azure and the supported Linux distros, see [cloud-init overview](using-cloud-init.md)

## Create swap partition for Ubuntu based images

By default on Azure, Ubuntu gallery images do not create swap partitions. To enable swap partition configuration during VM provisioning time using cloud-init - please see the [AzureSwapPartitions document](https://wiki.ubuntu.com/AzureSwapPartitions) on the Ubuntu wiki.

## Create swap partition for Red Hat and CentOS based images

Create a file in your current shell named *cloud_init_swappart.txt* and paste the following configuration. For this example, create the file in the Cloud Shell not on your local machine. You can use any editor you wish. Make sure that the whole cloud-init file is copied correctly, especially the first line.

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
  - ["ephemeral0.2", "none", "swap", "sw,nofail,x-systemd.requires=cloud-init.service", "0", "0"]
```

The mount is created with the `nofail` option to ensure that the boot process continues even if the mount is not completed successfully.

Before deploying this image, you need to create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Now, create a VM with [az vm create](/cli/azure/vm) and specify the cloud-init file with `--custom-data cloud_init_swappart.txt` as follows:

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name vmName \
  --image imageCIURN \
  --custom-data cloud_init_swappart.txt \
  --generate-ssh-keys
```

> [!NOTE]
> Replace **myResourceGroup**, **vmName**, and **imageCIURN** values accordingly. Make sure an image with Cloud-init is chosen.

## Modify an already running machine

If you already provisioned your server and wish to modify the mount point of the ephemeral storage and want to configure a part of the disk as swap space, use the following steps.

Create cloud-init configuration file named `00-azure-swap.cfg` in the `/etc/cloud/cloud.cfg.d` directory with the following content:

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
  - ["ephemeral0.2", "none", "swap", "sw,nofail,x-systemd.requires=cloud-init.service", "0", "0"]
```

Next, append a line to the `/etc/systemd/system.conf` file with following content:

```config
DefaultEnvironment="CLOUD_CFG=/etc/cloud/cloud.cfg.d/00-azure-swap.cfg"
```

> [!NOTE]
> The name of the file is totally arbitrary, it can be replaced with any particular name of your preference, it just needs the .cfg suffix and make sure to reflect the changes in the CLOUD_CFG parameter line as well.

After the changes are done, the machine needs to be deallocated or re-deployed for the changes to take effect.


## Verify swap partition was created

SSH to the public IP address of your VM shown in the output from the preceding command. Enter your own **user** and **publicIpAddress** as follows:

```bash
ssh <user>@<publicIpAddress>
```

Once you have SSH'ed into the vm, check if the swap partition was created

```bash
sudo swapon -s
```

The output from this command should look like this:

```output
Filename                Type        Size    Used    Priority
/dev/sdb2  partition   2494440 0   -1
```

> [!NOTE]
> If you have an existing Azure image that has a swap partition configured and you want to change the swap partition configuration for new images, you should remove the existing swap partition. Please see [Customize Images to provision by cloud-init](/azure/virtual-machines/linux/tutorial-automate-vm-deployment) document for more details.

## Next steps

For more cloud-init examples of configuration changes, see the following:

- [Add an additional Linux user to a VM](cloudinit-add-user.md)
- [Run a package manager to update existing packages on first boot](cloudinit-update-vm.md)
- [Change VM local hostname](cloudinit-update-vm-hostname.md)
- [Install an application package, update configuration files and inject keys](tutorial-automate-vm-deployment.md)
