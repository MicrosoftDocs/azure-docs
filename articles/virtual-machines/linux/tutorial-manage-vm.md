---
title: Create and Manage Linux VMs with the Azure CLI | Microsoft Docs
description: Tutorial - Create and Manage Linux VMs with the Azure CLI
services: virtual-machines-linux
documentationcenter: virtual-machines
author: neilpeterson
manager: timlt
editor: tysonn
tags: azure-service-management

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 04/14/2017
ms.author: nepeters
---

# Create and Manage Linux VMs with the Azure CLI

In this tutorial an Azure virtual machine is created. Basic management operations are then completed such as connecting to the VM, managing VM state, and resizing the virtual machine.

To complete this tutorial, make sure that you have installed the latest [Azure CLI 2.0](/cli/azure/install-azure-cli).

## Step 1 – Log in to Azure

First, open up a terminal and log in to your Azure subscription with the [az login](/cli/azure/#login) command.

```azurecli
az login
```

## Step 2 – Create resource group

Create a resource group with the [az group create](https://docs.microsoft.com/cli/azure/group#create) command. 

An Azure resource group is a logical container into which Azure resources are deployed and managed. A resource group must be created before a virtual machine. In this example, a resource group named `myTutorial1` is created in the `westus` region. 

```azurecli
az group create --name myTutorial1 --location westus
```

## Step 3 - Create virtual machine

Create a virtual machine with the [az vm create](https://docs.microsoft.com/cli/azure/vm#create) command. 

When creating a virtual machine, several options are available such as operating system image, disk sizing, and administrative credentials. In this example, a virtual machine is created with a name of `myVM` running Ubuntu Server. 

```azurecli
az vm create --resource-group myTutorial1 --name myVM --image UbuntuLTS --generate-ssh-keys
```

Once the VM has been created, the Azure CLI outputs information about the VM. Take note of the public IP address, this address is used when accessing the virtual machine. 

```azurecli
{
  "fqdns": "",
  "id": "/subscriptions/d5b9d4b7-6fc1-0000-0000-000000000000/resourceGroups/myTutorial1/providers/Microsoft.Compute/virtualMachines/myVM",
  "location": "westus",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "52.174.34.95",
  "resourceGroup": "myTutorial1"
}
```

## Step 4 - Connect to VM

You can now connect to the VM using SSH. Replace the example IP address with the public IP address noted in the previous step.

```bash
ssh 52.174.34.95
```

Once finished with the VM, close the SSH session. 

```bash
exit
```

## Step 5 - Understand VM images

The Azure marketplace includes many virtual machine images that can be used to create a new virtual machine. In the previous steps, a virtual machine was created using an Ubuntu image. In this step, the Azure CLI is used to search the marketplace for a Red Hat image, which is then used to deploy a second virtual machine.  

To see a list of the most commonly used images, use the [az vm image list](/cli/azure/vm/image#list) command.

```azurecli
az vm image list
```

When searching for an image, the list can be filtered by different values such as image publisher. To see a list of image publishers, use the [az vm image list-publishers](/cli/azure/vm/image#list-publishers) command.

```azurecli
az vm image list-publishers -l westus --query [].name -o table
```

To return a list of all Marketplace images for a publisher, use the [az vm image list](/cli/azure/vm/image#list) command. In this example, the publisher filter is Red Hat. 

```azurecli
az vm image list --publisher redhat --all -o table
```

Finally, to deploy a virtual machine using a particular Red Hat image, take note of the image found in the `Urn` column, and run the [az vm create](https://docs.microsoft.com/cli/azure/vm#create) command.

```azurecli
az vm create --resource-group myTutorial1 --name myVM2 --image RedHat:RHEL:7.3:7.3.2017032021 --generate-ssh-keys
```

## Step 6 - Understand VM sizes

A virtual machine size determines the amount of compute resources such as CPU, GPU, and memory that are made available to the virtual machine. Virtual machines need to be created with a size appropriate for the expect work load. If workload increases, an existing virtual machine can be resized.

### VM Sizes

The following table categorizes sizes into use cases.  

| Type                     | Sizes           |    Description       |
|--------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------|
| General purpose         |DSv2, Dv2, DS, D, Av2, A0-7| Balanced CPU-to-memory. Ideal for dev / test and small to medium applications and data solutions.  |
| Compute optimized      | Fs, F             | High CPU-to-memory. Good for medium traffic applications, network appliances, and batch processes.        |
| Memory optimized       | GS, G, DSv2, DS, Dv2, D   | High memory-to-core. Great for relational databases, medium to large caches, and in-memory analytics.                 |
| Storage optimized       | Ls                | High disk throughput and IO. Ideal for Big Data, SQL, and NoSQL databases.                                                         |
| GPU           | NV, NC            | Specialized VMs targeted for heavy graphic rendering and video editing.       |
| High performance | H, A8-11          | Our most powerful CPU VMs with optional high-throughput network interfaces (RDMA). 


### Find available VM sizes

To see a list of VM sizes available in a particular region, use the [az vm list-sizes]( /cli/azure/vm#list-sizes) command. 

```azurecli
az vm list-sizes --location westus -o table
```

### Create VM with specific size

In the previous VM creation example, a size was not provided, which results in a default size. A VM size can be selected at creation time using [az vm create](/cli/azure/vm#create) and the `size` argument. 

```azurecli
az vm create --resource-group myTutorial1 --name myVM3 --image UbuntuLTS --size Standard_F4s --generate-ssh-keys
```

### Resize VM

After a VM has been deployed, it can be resized using the [az vm resize](https://docs.microsoft.com/cli/azure/vm#resize) command. 

```azurecli
az vm resize -g myTutorial1 -n myVM --size Standard_F4s
```

## Step 7 – Management tasks

During the life-cycle of a virtual machine, you may want to run management tasks such as starting, stopping, or deleting a virtual machine. Additionally, you may want to create scripts to automate repetitive or complex tasks. Using the Azure CLI, many common management tasks can be run from the command line or in scripts. 

### Get IP address

This command returns the private and public IP addresses of a virtual machine.  

```azurecli
az vm list-ip-addresses --resource-group myTutorial1 --name myVM
```

### Stop virtual machine

```azurecli
az vm stop --resource-group myTutorial1 --name myVM
```

### Start virtual machine

```azurecli
az vm start --resource-group myTutorial1 --name myVM
```

### Delete resource group

Deleting a resource group also deletes all resources contained within.

```azurecli
az group delete --name myTutorial1 --no-wait --yes
```

## Next steps

Tutorial - [Create and Manage VM networks](./tutorial-virtual-network.md)

Further reading - [VM sizes](./sizes.md)