---
title: Copy a Linux VM using Azure CLI  
description: Learn how to create a copy of your Azure Linux VM using Azure CLI and Managed Disks. 
author: cynthn
ms.service: virtual-machines-linux
ms.topic: article
ms.date: 10/17/2018
ms.author: cynthn
ms.custom: legacy
---

# Create a copy of a Linux VM by using Azure CLI and Managed Disks

This article shows you how to create a copy of your Azure virtual machine (VM) running Linux by using the Azure CLI. To copy, create, store and share VM images at scale, see [Shared Image Galleries](shared-images.md).

You can also [upload and create a VM from a VHD](upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

## Prerequisites

-   Install the [Azure CLI](/cli/azure/install-az-cli2).

-   Sign in to an Azure account with [az login](/cli/azure/reference-index#az-login).

-   Have an Azure VM to use as the source for your copy.

## Stop the source VM

Deallocate the source VM by using [az vm deallocate](/cli/azure/vm#az-vm-deallocate).
The following example deallocates the VM named *myVM* in the resource group
*myResourceGroup*:

```azurecli
az vm deallocate \
    --resource-group myResourceGroup \
	--name myVM
```

## Copy the source VM

To copy a VM, you create a copy of the underlying virtual hard disk. This
process creates a specialized virtual hard disk (VHD) as a Managed Disk that contains the same configuration and
settings as the source VM.

For more information about Azure Managed Disks, see [Azure Managed Disks
overview](../windows/managed-disks-overview.md). 

1.  List each VM and the name of its OS disk with [az vm
    list](/cli/azure/vm#az-vm-list). The following example lists all VMs in the
    resource group named *myResourceGroup*:
	
	```azurecli
	az vm list -g myResourceGroup \
	     --query '[].{Name:name,DiskName:storageProfile.osDisk.name}' \
		 --output table
	```

    The output is similar to the following example:

	```azurecli
	Name    DiskName
	------  --------
	myVM    myDisk
	```

1.  Copy the disk by creating a new managed disk and by using [az disk
    create](/cli/azure/disk#az-disk-create). The following example creates a disk named
    *myCopiedDisk* from the managed disk named *myDisk*:

	```azurecli
	az disk create --resource-group myResourceGroup \
	     --name myCopiedDisk --source myDisk
	``` 

1.  Verify the managed disks now in your resource group by using [az disk
    list](/cli/azure/disk#az-disk-list). The following example lists the managed disks
    in the resource group named *myResourceGroup*:

	```azurecli
	az disk list --resource-group myResourceGroup --output table
	```


## Set up a virtual network

The following optional steps create a new virtual network, subnet, public IP
address, and virtual network interface card (NIC).

If you are copying a VM for troubleshooting purposes or additional deployments,
you might not want to use a VM in an existing virtual network.

If you want to create a virtual network infrastructure for your copied VMs,
follow the next few steps. If you don't want to create a virtual network, skip
to [Create a VM](#create-a-vm).

1.  Create the virtual network by using [az network vnet
    create](/cli/azure/network/vnet#az-network-vnet-create). The following example creates a
    virtual network named *myVnet* and a subnet named *mySubnet*:

	```azurecli
	az network vnet create --resource-group myResourceGroup \
	    --location eastus --name myVnet \
		--address-prefix 192.168.0.0/16 \
		--subnet-name mySubnet \
		--subnet-prefix 192.168.1.0/24
	```

1.  Create a public IP by using [az network public-ip
    create](/cli/azure/network/public-ip#az-network-public-ip-create). The following example creates
    a public IP named *myPublicIP* with the DNS name of *mypublicdns*. (Because the DNS
    name must be unique, provide a unique name.)

	```azurecli
	az network public-ip create --resource-group myResourceGroup \
	    --location eastus --name myPublicIP --dns-name mypublicdns \
		--allocation-method static --idle-timeout 4
	```

1.  Create the NIC by using [az network nic create](/cli/azure/network/nic#az-network-nic-create).
    The following example creates a NIC named *myNic* that's attached to the
    *mySubnet* subnet:

	```azurecli
	az network nic create --resource-group myResourceGroup \
	    --location eastus --name myNic \
		--vnet-name myVnet --subnet mySubnet \
		--public-ip-address myPublicIP
	```

## Create a VM

Create a VM by using [az vm create](/cli/azure/vm#az-vm-create).

Specify the copied managed disk to use as the OS disk (`--attach-os-disk`), as
follows:

```azurecli
az vm create --resource-group myResourceGroup \
    --name myCopiedVM --nics myNic \
	--size Standard_DS1_v2 --os-type Linux \
    --attach-os-disk myCopiedDisk
```

## Next steps

To learn how to use a [shared image gallery](shared-images.md) to manage VM images.
