--- 
title: Copy a Linux VM by using Azure CLI 2.0 | Microsoft Docs 
description: Learn how to create a copy of your Azure Linux VM by using Azure CLI 2.0 and Managed Disks. 
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: timlt
tags: azure-resource-manager

ms.assetid: 770569d2-23c1-4a5b-801e-cddcd1375164
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: article
ms.date: 03/10/2017
ms.author: cynthn

---                    
			   
# Create a copy of a Linux VM by using Azure CLI 2.0 and Managed Disks


This article shows you how to create a copy of your Azure virtual machine (VM)
running Linux using the Azure CLI 2.0 and the Azure Resource Manager deployment
model. You can also perform these steps with the [Azure CLI
1.0](copy-vm-nodejs.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

You can also [upload and create a VM from a VHD](upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

## Prerequisites


-   Install [Azure CLI 2.0](/cli/azure/install-az-cli2)

-   Sign in to an Azure account with [az login](/cli/azure/#login).

-   Have an Azure VM to use as the source for your copy.

## Step 1: Stop the source VM


Deallocate the source VM by using [az vm deallocate](/cli/azure/vm#deallocate).
The following example deallocates the VM named **myVM** in the resource group
**myResourceGroup**:

```azurecli
az vm deallocate --resource-group myResourceGroup --name myVM
```

## Step 2: Copy the source VM


To copy a VM, you create a copy of the underlying virtual hard disk. This
process creates a specialized VHD as a Managed Disk that contains the same configuration and
settings as the source VM.

For more information about Azure Managed Disks, see [Azure Managed Disks
overview](../../storage/storage-managed-disks-overview.md). 

1.  List each VM and the name of its OS disk with [az vm
    list](/cli/azure/vm#list). The following example lists all VMs in the
    resource group named **myResourceGroup**:
	
	```azurecli
	az vm list -g myTestRG --query '[].{Name:name,DiskName:storageProfile.osDisk.name}' --output table
	```

    The output is similar to the following example:

	```azurecli
	Name    DiskName
	------  --------
	myVM    myDisk
	```

1.  Copy the disk by creating a new managed disk using [az disk
    create](/cli/azure/disk#create). The following example creates a disk named
    **myCopiedDisk** from the managed disk named **myDisk**:

	```azurecli
	az disk create --resource-group myResourceGroup --name myCopiedDisk --source myDisk
	``` 

1.  Verify the managed disks now in your resource group by using [az disk
    list](/cli/azure/disk#list). The following example lists the managed disks
    in the resource group named **myResourceGroup**:

	```azurecli
	az disk list --resource-group myResourceGroup --output table
	```

1.  Skip to ["Step 3: Set up a virtual
    network"](#step-3-set-up-a-virtual-network).


## Step 3: Set up a virtual network


The following optional steps create a new virtual network, subnet, public IP
address, and virtual network interface card (NIC).

If you are copying a VM for troubleshooting purposes or additional deployments,
you might not want to use a VM in an existing virtual network.

If you want to create a virtual network infrastructure for your copied VMs,
follow the next few steps. If you don't want to create a virtual network, skip
to [Step 4: Create a VM](#step-4-create-a-vm).

1.  Create the virtual network by using [az network vnet
    create](/cli/azure/network/vnet#create). The following example creates a
    virtual network named **myVnet** and a subnet named **mySubnet**:

	```azurecli
	az network vnet create --resource-group myResourceGroup --location westus --name myVnet \
		--address-prefix 192.168.0.0/16 --subnet-name mySubnet --subnet-prefix 192.168.1.0/24
	```

1.  Create a public IP by using [az network public-ip
    create](/cli/azure/network/public-ip#create). The following example creates
    a public IP named **myPublicIP** with the DNS name of **mypublicdns**. (The DNS
    name must be unique, so provide a unique name.)

	```azurecli
	az network public-ip create --resource-group myResourceGroup --location westus \
		--name myPublicIP --dns-name mypublicdns --allocation-method static --idle-timeout 4
	```

1.  Create the NIC using [az network nic create](/cli/azure/network/nic#create).
    The following example creates a NIC named **myNic** that's attached to the
    **mySubnet** subnet:

	```azurecli
	az network nic create --resource-group myResourceGroup --location westus --name myNic \
		--vnet-name myVnet --subnet mySubnet --public-ip-address myPublicIP
	```

## Step 4: Create a VM

You can now create a VM by using [az vm create](/cli/azure/vm#create).

Specify the copied managed disk to use as the OS disk (--attach-os-disk), as
follows:

```azurecli
az vm create --resource-group myResourceGroup --name myCopiedVM \
    --admin-username azureuser --ssh-key-value ~/.ssh/id_rsa.pub \
    --nics myNic --size Standard_DS1_v2 --os-type Linux \
    --attach-os-disk myCopiedDisk
```

## Next steps

To learn how to use Azure CLI to manage your new VM, see [Azure CLI commands for
the Azure Resource Manager](../azure-cli-arm-commands.md).
