---
title: Use cloud-init in a Linux VM on Azure 
description: How to use cloud-init to update and install packages in a Linux VM during creation with the Azure CLI
author: cynthn
ms.service: virtual-machines
ms.collection: linux
ms.topic: how-to
ms.date: 06/01/2021
ms.author: cynthn
ms.subservice: cloud-init
---
# Use cloud-init to update and install packages in a Linux VM in Azure
This article shows you how to use [cloud-init](https://cloudinit.readthedocs.io) to update packages on a Linux virtual machine (VM) or virtual machine scale sets at provisioning time in Azure. These cloud-init scripts run on first boot once the resources have been provisioned by Azure. For more information about how cloud-init works natively in Azure and the supported Linux distros, see [cloud-init overview](using-cloud-init.md)

## Update a VM with cloud-init
For security purposes, you may want to configure a VM to apply the latest updates on first boot. As cloud-init works across different Linux distros, there is no need to specify `apt` or `yum` for the package manager. Instead, you define `package_upgrade` and let the cloud-init process determine the appropriate mechanism for the distro in use. 

For this example, we will be using the Azure Cloud Shell. To see the upgrade process in action, create a file named *cloud_init_upgrade.txt* and paste the following configuration. 

Select the **Try it** button on the code block below to open the Cloud Shell. To create the file and see a list of available editors in the Cloud Shell, type the following:

```azurecli-interactive
sensible-editor cloud_init_upgrade.txt 
```

Copy the text below and paste it into the `cloud_init_upgrade.txt` file. Make sure that the whole cloud-init file is copied correctly, especially the first line.  

```yaml
#cloud-config
package_upgrade: true
packages:
- httpd
```

Before deploying, you need to create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

Now, create a VM with [az vm create](/cli/azure/vm) and specify the cloud-init file with the `--custom-data` parameter as follows:

```azurecli-interactive 
az vm create \
  --resource-group myResourceGroup \
  --name centos74 \
  --image OpenLogic:CentOS:7-CI:latest \
  --custom-data cloud_init_upgrade.txt \
  --generate-ssh-keys 
```

SSH to the public IP address of your VM shown in the output from the preceding command. Enter your own **publicIpAddress** as follows:

```bash
ssh <publicIpAddress>
```

Run the package management tool and check for updates.

```bash
sudo yum update
```

As cloud-init checked for and installed updates on boot, there should be no additional updates to apply.  You see the update process, number of altered packages as well as the installation of `httpd` by running `yum history` and review the output similar to the one below.

```bash
Loaded plugins: fastestmirror, langpacks
ID     | Command line             | Date and time    | Action(s)      | Altered
-------------------------------------------------------------------------------
     3 | -t -y install httpd      | 2018-04-20 22:42 | Install        |    5
     2 | -t -y upgrade            | 2018-04-20 22:38 | I, U           |   65
     1 |                          | 2017-12-12 20:32 | Install        |  522
```

## Next steps
For additional cloud-init examples of configuration changes, see the following:
 
- [Add an additional Linux user to a VM](cloudinit-add-user.md)
- [Run a package manager to update existing packages on first boot](cloudinit-update-vm.md)
- [Change VM local hostname](cloudinit-update-vm-hostname.md) 
- [Install an application package, update configuration files and inject keys](tutorial-automate-vm-deployment.md)
