---
title: Use cloud-init to set hostname for a Linux VM
description: How to use cloud-init to customize a Linux VM during creation with the Azure CLI
author: mattmcinnes
ms.service: virtual-machines
ms.collection: linux
ms.topic: how-to
ms.date: 03/29/2023
ms.author: mattmcinnes
ms.subservice: cloud-init

---
# Use cloud-init to set hostname for a Linux VM in Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets

This article shows you how to use [cloud-init](https://cloudinit.readthedocs.io) to configure a specific hostname on a virtual machine (VM) or virtual machine scale sets (VMSS) at provisioning time in Azure. These cloud-init scripts run on first boot once the resources have been provisioned by Azure. For more information about how cloud-init works natively in Azure and the supported Linux distros, see [cloud-init overview](using-cloud-init.md)

## Set the hostname with cloud-init

By default, the hostname is the same as the VM name when you create a new virtual machine in Azure.  To run a cloud-init script to change this default hostname when you create a VM in Azure with [az vm create](/cli/azure/vm), specify the cloud-init file with the `--custom-data` switch.  

To see upgrade process in action, create a file in your current shell named *cloud_init_hostname.txt* and paste the following configuration. For this example, create the file in the Cloud Shell not on your local machine. You can use any editor you wish. Make sure that the whole cloud-init file is copied correctly, especially the first line.  

```yaml
#cloud-config
fqdn: myhostname
```

Before deploying this image, you need to create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Now, create a VM with [az vm create](/cli/azure/vm) and specify the cloud-init file with `--custom-data cloud_init_hostname.txt` as follows:

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name vmName \
  --image imageCIURN \
  --custom-data cloud_init_hostname.txt \
  --generate-ssh-keys 
```

> [!NOTE]
> Replace **myResourceGroup**, **vmName**, and **imageCIURN** values accordingly. Make sure an image with Cloud-init is chosen.

Once created, the Azure CLI shows information about the VM. Use the `publicIpAddress` to SSH to your VM. Enter your own address as follows:

```bash
ssh <user>@<publicIpAddress>
```

To see the VM name, use the `hostname` command as follows:

```bash
sudo hostname
```

The VM should report the hostname as that value set in the cloud-init file, as shown in the following example output:

```output
myhostname
```

## Next steps

For additional cloud-init examples of configuration changes, see the following:

- [Add an additional Linux user to a VM](cloudinit-add-user.md)
- [Run a package manager to update existing packages on first boot](cloudinit-update-vm.md)
- [Change VM local hostname](cloudinit-update-vm-hostname.md) 
- [Install an application package, update configuration files and inject keys](tutorial-automate-vm-deployment.md)
