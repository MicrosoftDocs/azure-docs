---
title: Quickstart - Create a Linux VM with the Azure CLI 2.0 | Microsoft Docs
description: In this quickstart, you learn how to use the Azure CLI 2.0 to create a Linux virtual machine
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 04/24/2018
ms.author: cynthn
ms.custom: mvc
---

# Quickstart: Create a Linux virtual machine with the Azure CLI 2.0

The Azure CLI 2.0 is used to create and manage Azure resources from the command line or in scripts. This quickstart shows you how to use the Azure CLI 2.0 to deploy a Linux virtual machine (VM) in Azure that runs Ubuntu. To see your VM in action, you then SSH to the VM and install the NGINX web server.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#az_group_create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## Create virtual machine

Create a VM with the [az vm create](/cli/azure/vm#az_vm_create) command.

The following example creates a VM named *myVM*, adds a user account named *azureuser*, and generates SSH keys if they do not already exist in the default key location (*~/.ssh*). To use a specific set of keys, use the `--ssh-key-value` option:

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --image UbuntuLTS \
  --admin-username azureuser \
  --generate-ssh-keys
```

It takes a few minutes to create the VM and supporting resources. The following example output shows the VM create operation was successful.

```azurecli-interactive
{
  "fqdns": "",
  "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
  "location": "eastus",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "40.68.254.142",
  "resourceGroup": "myResourceGroup"
}
```

Note your own `publicIpAddress` in the output from your VM. This address is used to access the VM in the next steps.

## Open port 80 for web traffic

By default, only SSH connections are opened when you create a Linux VM in Azure. Use [az vm open-port](/cli/azure/vm#az_vm_open_port) to open TCP port 80 for use with the NGINX web server:

```azurecli-interactive
az vm open-port --port 80 --resource-group myResourceGroup --name myVM
```

## Connect to virtual machine

SSH to your VM as normal. Replace **publicIpAddress** with the public IP address of your VM as noted in the previous output from your VM:

```bash
ssh azureuser@publicIpAddress
```

## Install web server

To see your VM in action, install the NGINX web server. To update package sources and install the latest NGINX package, run the following commands from your SSH session:

```bash
# update packages
sudo apt-get -y update

# install NGINX
sudo apt-get -y install nginx
```

When done, `exit` the SSH session.

## View the web server in action

With NGINX installed and port 80 now open on your VM from the Internet, use a web browser of your choice to view the default NGINX welcome page. Use the public IP address of your VM obtained in a previous step. The following example shows the default NGINX web site:

![NGINX default site](./media/quick-create-cli/nginx.png)

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#az_group_delete) command to remove the resource group, VM, and all related resources. Make sure that you have exited the SSH session to your VM, then delete the resources as follows:

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

In this quickstart, you deployed a simple virtual machine, open a network port for web traffic, and installed a basic web server. To learn more about Azure virtual machines, continue to the tutorial for Linux VMs.


> [!div class="nextstepaction"]
> [Azure Linux virtual machine tutorials](./tutorial-manage-vm.md)
