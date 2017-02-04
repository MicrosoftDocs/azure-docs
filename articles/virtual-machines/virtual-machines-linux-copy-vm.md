---
title: Copy a Linux VM using the Azure CLI 2.0 (Preview) | Microsoft Docs
description: Learn how to create a copy of your Azure Linux virtual machine in the Resource Manager deployment model with the Azure CLI 2.0 (Preview)
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: timlt
tags: azure-resource-manager

ms.assetid: 770569d2-23c1-4a5b-801e-cddcd1375164
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 02/02/2017
ms.author: cynthn

---
# Create a copy of a Linux virtual machine with the Azure CLI 2.0 (Preview)
This article shows you how to create a copy of your Azure virtual machine (VM) running Linux using the Resource Manager deployment model. First you copy over the operating system and data disks to a new container, then set up the network resources and create the virtual machine.

You can also [upload and create a VM from custom disk image](virtual-machines-linux-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

## CLI versions to complete the task
You can complete the task using one of the following CLI versions:

- [Azure CLI 1.0](virtual-machines-linux-copy-vm-nodejs.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) – our CLI for the classic and resource management deployment models
- Azure CLI 2.0 (Preview) - our next generation CLI for the resource management deployment model (this article)

## Prerequisites
- You need the latest [Azure CLI 2.0 (Preview)](/cli/azure/install-az-cli2) installed and logged in to an Azure account using [az login](/cli/azure/#login).
- You need an Azure VM to use as your source when you create a copy.

## Stop the VM
Deallocate the source VM with [az vm deallocate](/cli/azure/vm#deallocate). The following example deallocates the VM named `myVM` in the resource group named `myResourceGroup`:

```azurecli
az vm deallocate --resource-group myResourceGroup --name myVM
```

## Copy the VHD
To create a copy of a VHD, you need the storage account keys and the URI of the disk. Use [az storage account keys list](/cli/azure/storage/account/keys#list) to view the storage account keys. The following example list the keys for the storage account named `mystorageaccount` in the resource group named `myResourceGroup`

```azurecli
az storage account keys list --resource-group myResourceGroup \
    --name mystorageaccount --output table
```

The output is similar to the following example:

```azurecli
KeyName    Permissions    Value
---------  -------------  ----------------------------------------------------------------------------------------
key1       Full           gi7crXhD8PMs8DRWqAM7fAjQEFmENiGlOprNxZGbnpylsw/nq+lQQg0c4jiKoV3Nytr3dAiXZRpL8jflpAr2Ug==
key2       Full           UMoyQjWuKCBUAVDr1ANRe/IWTE2o0ZdmQH2JSZzXKNmDKq83368Fw9nyTBcTEkSKI9cm5tlTL8J15ArbPMo8eA==
```

Use [az vm list](/cli/azure/vm#list) to see a list of VMs and their URIs. The following example lists the VMs in the resource group named `myResourceGroup`:

```azurecli
az vm list -g myResourceGroup --query '[].{Name:name,URI:storageProfile.osDisk.vhd.uri}' --output table
```

The output is similar to the following example:

```azurecli
Name    URI
------  -------------------------------------------------------------
myVM    https://mystorageaccount.blob.core.windows.net/vhds/myVHD.vhd
```

Copy the VHD with [az storage blob copy start](/cli/azure/storage/blob/copy#start). Use the information from **az storage account keys list** and **az vm list** to provide the required storage account keys and VHD URI.

```azurecli
az storage blob copy start \
    --account-name mystorageaccount \
    --account-key gi7crXhD8PMs8DRWqAM7fAjQEFmENiGlOprNxZGbnpylsw/nq+lQQg0c4jiKoV3Nytr3dAiXZRpL8jflpAr2Ug== \
    --source-uri https://mystorageaccount.blob.core.windows.net/vhds/myVHD.vhd \
    --destination-container vhds --destination-blob myCopiedVHD.vhd
```

## Set up the virtual network for your new VM
The following steps create a new virtual network, subnet, public IP address, and virtual network interface card (NIC). These steps are optional. If you are copying a VM for troubleshooting purposes or additional deployments, you may not wish to use a VM in an existing virtual network. If you wish to create a virtual network infrastructure for your copied VMs, follow these next few steps, otherwise skip ahead to [create a VM](#create-a-vm).

Create the virtual network with [az network vnet create](/cli/azure/network/vnet#create). The following example creates a virtual network named `myVnet` and subnet named `mySubnet`:

```azurecli
az network vnet create --resource-group myResourceGroup --location westus --name myVnet \
    --address-prefix 192.168.0.0/16 --subnet-name mySubnet --subnet-prefix 192.168.1.0/24
```

Create a public IP with [az network public-ip create](/cli/azure/network/public-ip#create). The following example creates a public IP named `myPublicIP` with the DNS name of `mypublicdns`. (The DNS name must be unique, so provide your own unique name.)

```azurecli
az network public-ip create --resource-group myResourceGroup --location westus \
    --name myPublicIP --dns-name mypublicdns --allocation-method static --idle-timeout 4
```

Create the network interface card (NIC) with [az network nic create](/cli/azure/network/nic#create). The following example creates a NIC named `myNic` attached to the `mySubnet` subnet:

```azurecli
az network nic create --resource-group myResourceGroup --location westeurope --name myNic \
    --vnet-name myVnet --subnet mySubnet
```

## Create a VM
You can now create a VM with [az vm create](/cli/azure/vm#create). Specify the storage account, container name, and VHD you used when creating the copied with **az storage blob copy start**.

```azurecli
az vm create --resource-group myResourceGroup --name myCopiedVM 
    --nics myNic --size Standard_DS1_v2 --os-type Linux \
    --image https://mystorageaccount.blob.core.windows.net/vhds/myCopiedVHD.vhd 
```

## Next steps
To learn how to use Azure CLI to manage your new virtual machine, see [Azure CLI commands for the Azure Resource Manager](azure-cli-arm-commands.md).

