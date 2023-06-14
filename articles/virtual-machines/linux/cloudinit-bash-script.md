---
title: Use cloud-init to run a bash script in a Linux VM on Azure 
description: How to use cloud-init to run a bash script in a Linux VM during creation with the Azure CLI
author: mattmcinnes
ms.service: virtual-machines
ms.collection: linux
ms.topic: how-to
ms.date: 03/29/2023
ms.author: mattmcinnes
ms.subservice: cloud-init
ms.custom: devx-track-azurecli
---
# Use cloud-init to run a bash script in a Linux VM in Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

This article shows you how to use [cloud-init](https://cloudinit.readthedocs.io) to run an existing bash script on a Linux virtual machine (VM) or virtual machine scale sets (VMSS) at provisioning time in Azure. These cloud-init scripts run on first boot once the resources have been provisioned by Azure. For more information about how cloud-init works natively in Azure and the supported Linux distros, see [cloud-init overview](using-cloud-init.md)

## Run a bash script with cloud-init

With cloud-init you do not need to convert your existing scripts into a cloud-config, cloud-init accepts multiple input types, one of which is a bash script.

If you have been using the Linux Custom Script Azure Extension to run your scripts, you can migrate them to use cloud-init. However, Azure Extensions have integrated reporting to alert to script failures, a cloud-init image deployment will NOT fail if the script fails.

To see this functionality in action, create a simple bash script for testing. Like the cloud-init `#cloud-config` file, this script must be local to where you will be running the AzureCLI commands to provision your virtual machine.  For this example, create the file in the Cloud Shell not on your local machine. You can use any editor you wish. Make sure that the whole cloud-init file is copied correctly, especially the first line.  

```bash
#!/bin/sh
echo "this has been written via cloud-init" + $(date) >> /tmp/myScript.txt
```

Before deploying this image, you need to create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Now, create a VM with [az vm create](/cli/azure/vm) and specify the bash script file with `--custom-data simple_bash.sh` as follows:

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name vmName \
  --image imageCIURN \
  --custom-data simple_bash.sh \
  --generate-ssh-keys 
```

> [!NOTE]
> Replace **myResourceGroup**, **vmName**, and **imageCIURN** values accordingly. Make sure an image with Cloud-init is chosen.

## Verify bash script has run

SSH to the public IP address of your VM shown in the output from the preceding command. Enter your own **user** and **publicIpAddress** as follows:

```bash
ssh <user>@<publicIpAddress>
```

Verify that `/tmp/myScript.txt` file exists and has the appropriate text inside of it.  

```bash
sudo cat /tmp/myScript
```

If it does not, you can check the `/var/log/cloud-init.log` for more details.  Search for the following entry:

```bash
sudo cat /var/log/cloud-init.log
```

```output
Running config-scripts-user using lock Running command ['/var/lib/cloud/instance/scripts/part-001']
```

## Next steps

For additional cloud-init examples of configuration changes, see the following:
 
- [Add an additional Linux user to a VM](cloudinit-add-user.md)
- [Run a package manager to update existing packages on first boot](cloudinit-update-vm.md)
- [Change VM local hostname](cloudinit-update-vm-hostname.md) 
- [Install an application package, update configuration files and inject keys](tutorial-automate-vm-deployment.md)
