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
ms.date: 04/21/2017
ms.author: nepeters
---

# Create and Manage Linux VMs with the Azure CLI

In this tutorial, you will learn about basic Azure Virtual Machine creation operations such as selecting a VM size, selecting an image for the VM, and how to deploy the virtual machine. The tutorial will cover basic management operations such and stopping, starting, deleting and resizing a VM 

The steps demonstrated in this tutorial can be completed using the latest [Azure CLI 2.0](/cli/azure/install-azure-cli).

## Create resource group

Create a resource group with the [az group create](https://docs.microsoft.com/cli/azure/group#create) command. 

An Azure resource group is a logical container into which Azure resources are deployed and managed. A resource group must be created before a virtual machine. In this example, a resource group named `myTutorial1` is created in the `westus` region. 

```azurecli
az group create --name myTutorial1 --location westus
```

## Create virtual machine

Create a virtual machine with the [az vm create](https://docs.microsoft.com/cli/azure/vm#create) command. 

When creating a virtual machine, several options are available such as operating system image, disk sizing, and administrative credentials. In this example, a virtual machine is created with a name of `myVM` running Ubuntu Server. 

```azurecli
az vm create --resource-group myTutorial1 --name myVM --image UbuntuLTS --generate-ssh-keys
```

Once the VM has been created, the Azure CLI outputs information about the VM. Take note of the `publicIpAddress`, this address can be used to access the virtual machine.. 

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

## Connect to VM

You can now connect to the VM using SSH. Replace the example IP address with the `publicIpAddress` noted in the previous step.

```bash
ssh 52.174.34.95
```

Once finished with the VM, close the SSH session. 

```bash
exit
```

## Understand VM images

The Azure marketplace includes many virtual machine images that can be used to create a new virtual machine. In the previous steps, a virtual machine was created using an Ubuntu image. In this step, the Azure CLI is used to search the marketplace for a Red Hat image, which is then used to deploy a second virtual machine.  

To see a list of the most commonly used images, use the [az vm image list](/cli/azure/vm/image#list) command.

```azurecli
az vm image list
```

Output:

```bash
Offer          Publisher               Sku                 Urn                                                             UrnAlias             Version
-------------  ----------------------  ------------------  --------------------------------------------------------------  -------------------  ---------
WindowsServer  MicrosoftWindowsServer  2016-Datacenter     MicrosoftWindowsServer:WindowsServer:2016-Datacenter:latest     Win2016Datacenter    latest
WindowsServer  MicrosoftWindowsServer  2012-R2-Datacenter  MicrosoftWindowsServer:WindowsServer:2012-R2-Datacenter:latest  Win2012R2Datacenter  latest
WindowsServer  MicrosoftWindowsServer  2008-R2-SP1         MicrosoftWindowsServer:WindowsServer:2008-R2-SP1:latest         Win2008R2SP1         latest
WindowsServer  MicrosoftWindowsServer  2012-Datacenter     MicrosoftWindowsServer:WindowsServer:2012-Datacenter:latest     Win2012Datacenter    latest
UbuntuServer   Canonical               16.04-LTS           Canonical:UbuntuServer:16.04-LTS:latest                         UbuntuLTS            latest
CentOS         OpenLogic               7.3                 OpenLogic:CentOS:7.3:latest                                     CentOS               latest
openSUSE-Leap  SUSE                    42.2                SUSE:openSUSE-Leap:42.2:latest                                  openSUSE-Leap        latest
RHEL           RedHat                  7.3                 RedHat:RHEL:7.3:latest                                          RHEL                 latest
SLES           SUSE                    12-SP2              SUSE:SLES:12-SP2:latest                                         SLES                 latest
Debian         credativ                8                   credativ:Debian:8:latest                                        Debian               latest
CoreOS         CoreOS                  Stable              CoreOS:CoreOS:Stable:latest                                     CoreOS               latest
```

When searching for an image, the list can be filtered by different values such as image publisher. To see a list of image publishers, use the [az vm image list-publishers](/cli/azure/vm/image#list-publishers) command.

```azurecli
az vm image list-publishers -l westus --query [].name -o table
```

To return a list of all standard images for a publisher, use the [az vm image list](/cli/azure/vm/image#list) command. In this example, the publisher filter is Scalegrid. 

```azurecli
az vm image list --publisher OpenLogic --all -o table
```

Output:

```azurecli
Offer       Publisher    Sku    Urn                                    Version
----------  -----------  -----  -------------------------------------  ------------
CentOS      OpenLogic    6.5    OpenLogic:CentOS:6.5:6.5.201501        6.5.201501
CentOS      OpenLogic    6.5    OpenLogic:CentOS:6.5:6.5.201503        6.5.201503
CentOS      OpenLogic    6.5    OpenLogic:CentOS:6.5:6.5.201506        6.5.201506
CentOS      OpenLogic    6.5    OpenLogic:CentOS:6.5:6.5.20150904      6.5.20150904
CentOS      OpenLogic    6.5    OpenLogic:CentOS:6.5:6.5.20160309      6.5.20160309
CentOS      OpenLogic    6.5    OpenLogic:CentOS:6.5:6.5.20170207      6.5.20170207
```

Finally, to deploy a virtual machine using a particular image, take note of the image found in the `Urn` column, and run the [az vm create](https://docs.microsoft.com/cli/azure/vm#create) command. When doing so, the version number can be replaced with `latest` which will use the latest version of the distribution.  

```azurecli
az vm create --resource-group myTutorial1 --name myVM2 --image OpenLogic:CentOS:6.5:latest --generate-ssh-keys
```

## Understand VM sizes

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
az vm create --resource-group myTutorial1 --resource-group myVM3 --image UbuntuLTS --size Standard_F4s --generate-ssh-keys
```

## Resize a VM

After a VM has been deployed, it can be resized to increase or decrease resource allocation.

Before resizing a VM, check if the desired size is available on the current VM cluster. The [az vm list-vm-resize-options](/cli/azure/vm#list-vm-resize-options) command will return the list of sizes. 

```azurecli
az vm list-vm-resize-options -g tuttest -n myVM --query [].name
```
If the desired size is available, the VM can be resized from a powered-on state, however it will be rebooted during the operation. Use the [az vm resize]( /cli/azure/vm#resize) command to perform the resize.

```azurecli
az vm resize --resource-group myTutorial1 --name myVM --size Standard_F4s
```

If the desired sate is not on the current cluster, the VM will need to be deallocated before the resize operation can occur. Use the [az vm deallocate]( /cli/azure/vm#deallocate) command to stop and deallocate the VM. Note, when the VM is powered back on, any data on the temp disk will be removed, and the public IP address will change unless a static IP address is being used. 

```azurecli
az vm deallocate --resource-group myTutorial1 --name myVM
```

Once deallocated, the resize can occur. 

```azurecli
az vm resize --resource-group myTutorial1 --name myVM --size Standard_A7
```

After the resize, the VM can be started.

```azurecli
az vm start --resource-group myTutorial1 --name myVM
```

## Management tasks

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