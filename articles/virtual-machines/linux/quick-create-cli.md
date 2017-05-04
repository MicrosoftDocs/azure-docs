---
title: Azure Quick Start - Create VM CLI | Microsoft Docs
description: Quickly learn to create virtual machines with the Azure CLI.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: neilpeterson
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: hero-article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/02/2017
ms.author: nepeters
---

# Create a Linux virtual machine with the Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This guide details using the Azure CLI to deploy a virtual machine running Ubuntu server. Once the server is deployed, an SSH connection is created, and an NGINX webserver is installed.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

This tutorial requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Log in to Azure 

Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions.

```azurecli
az login
```

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli
az group create --name myResourceGroup --location eastus
```

## Create virtual machine

Create a VM with the [az vm create](/cli/azure/vm#create) command. 

The following example creates a VM named *myVM* and creates SSH keys if they do not already exist in a default key location. To use a specific set of keys, use the `--ssh-key-value` option.  

```azurecli
az vm create --resource-group myResourceGroup --name myVM --image UbuntuLTS --generate-ssh-keys
```

When the VM has been created, the Azure CLI shows information similar to the following example. Take note of the `publicIpAddress`. This address is used to access the VM.

```azurecli
{
  "fqdns": "",
  "id": "/subscriptions/d5b9d4b7-6fc1-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
  "location": "eastus",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "40.68.254.142",
  "resourceGroup": "myResourceGroup"
}
```

## Open port 80 for web traffic 

By default only SSH connections are allowed into Linux virtual machines deployed in Azure. If this VM is going to be a webserver, you need to open port 80 from the Internet. Use the [az vm open-port](/cli/azure/vm#open-port)] command to open the desired port.  
 
 ```azurecli 
az vm open-port --port 80 --resource-group myResourceGroup --name myVM
```

## SSH into your VM

Use the following command to create an SSH session with the virtual machine. Make sure to replace *<publicIpAddress>* with the correct public IP address of your virtual machine.  In our example above our IP address was *40.68.254.142*.

```bash 
ssh <publicIpAddress>
```

## Install NGINX

Use the following bash script to update package sources and install the latest NGINX package. 

```bash 
#!/bin/bash

# update package source
apt-get -y update

# install NGINX
apt-get -y install nginx
```

## View the NGIX welcome page

With NGINX installed and port 80 now open on your VM from the Internet - you can use a web browser of your choice to view the default NGINX welcome page. Be sure to use the *publicIpAddress* you documented above to visit the default page. 

![NGINX default site](./media/quick-create-cli/nginx.png) 


## Delete virtual machine

When no longer needed, you can use the [az group delete](/cli/azure/group#delete) command to remove the resource group, VM, and all related resources.

```azurecli
az group delete --name myResourceGroup
```

## Next steps

In this quick start, you’ve deployed a simple virtual machine, a network security group rule, and installed a web server. To learn more about Azure virtual machines, continue to the tutorial for Linux VMs.

[Azure Linux virtual machine tutorials](./tutorial-manage-vm.md)