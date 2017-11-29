---
title: Use cloud-init to set hostname for a Linux VM | Microsoft Docs
description: How to use cloud-init to customize a Linux VM during creation with the Azure CLI 2.0
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
# Use cloud-init to set hostname for a Linux VM in Azure

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
