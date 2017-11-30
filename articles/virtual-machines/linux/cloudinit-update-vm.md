---
title: Use cloud-init to update a Linux VM | Microsoft Docs
description: How to use cloud-init to update a Linux VM during creation with the Azure CLI 2.0
services: virtual-machines-linux
documentationcenter: ''
author: rickstercdn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: article
ms.date: 11/29/2017
ms.author: rclaus

---
# Use cloud-init to update a Linux VM in Azure
This article shows you how to use [cloud-init](https://cloudinit.readthedocs.io) to update packages on a Linux virtual machine (VM) or virtual machine scale sets (VMSS) at provisioning time in Azure. These cloud-init scripts run on first boot once the resources have been provisioned by Azure. For more information about how cloud-init works natively in Azure and the supported Linux distros, see [cloud-init overview](using-cloud-init.md)

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

## Next steps
For additional cloud-init examples of configuration changes, see the following:
 
- [Add an additional Linux user to a VM](cloudinit-add-user.md)
- [Run a package manager to update existing packages on first boot](cloudinit-update-vm.md)
- [Change VM local hostname](cloudinit-update-vm-hostname.md) 
- [Install an application package, update configuration files and inject keys](tutorial-automate-vm-deployment.md)