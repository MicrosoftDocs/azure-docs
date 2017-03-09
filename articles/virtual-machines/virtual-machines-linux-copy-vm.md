---
title: Copy a Linux VM using Azure CLI 2.0 | Microsoft Docs
description: Learn how to create a copy of your Azure Linux VM in the Resource Manager deployment model by using Azure CLI 2.0.
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
ms.date: 03/08/2017
ms.author: cynthn

---
# Create a copy of a Linux VM by using Azure CLI 2.0


This article shows you how to create a copy of your Azure virtual machine (VM)
running Linux using the Azure CLI 2.0 and the Azure Resource Manager deployment
model. You can also perform these steps with the [Azure CLI
1.0](virtual-machines-linux-copy-vm-nodejs.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

Copy the operating system and data disks to a new container, and then set up the
network resources and create the VM.

You can also [upload and create a VM from a custom disk
image](virtual-machines-linux-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

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
process creates a specialized VM that contains the same configuration and
settings as the source VM.

The process of copying a virtual disk differs between Azure Managed Disks and
unmanaged disks. Managed disks are handled by the Azure platform and do not
require any preparation or location to store them. Because managed disks are a
top-level resource, they are easier to work with - you can make a direct copy of
the disk resource.

For more information about Azure Managed Disks, see [Azure Managed Disks
overview](../storage/storage-managed-disks-overview.md). Choose one of the
appropriate following steps for the storage type of your source VM:

-   [Managed disks](#managed-disks)

-   [Unmanaged disks](#unmanaged-disks)

### Managed disks

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

1.  Copy the disk by creating a new managed disk with [az disk
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

### Unmanaged disks

1.  To create a copy of a virtual hard disk, you need the storage account keys
    and the URI of the disk. To view the storage account keys, use [az storage
    account keys list](/cli/azure/storage/account/keys#list).

	The following example lists the keys for the storage account named **mystorageaccount** in the resource group named **myResourceGroup**:

	```azurecli
	az storage account keys list --resource-group myResourceGroup \
    --account-name mystorageaccount --output table
	```

	The output is similar to the following example:

	```azurecli
	KeyName    Permissions    Value
	---------  -------------  ----------------------------------------------------------------------------------------
	key1       Full           gi7crXhD8PMs8DRWqAM7fAjQEFmENiGlOprNxZGbnpylsw/nq+lQQg0c4jiKoV3Nytr3dAiXZRpL8jflpAr2Ug==
	key2       Full           UMoyQjWuKCBUAVDr1ANRe/IWTE2o0ZdmQH2JSZzXKNmDKq83368Fw9nyTBcTEkSKI9cm5tlTL8J15ArbPMo8eA==
	```

1.  To view a list of VMs and their URIs, use [az vm list](/cli/azure/vm#list).
    The following example lists the VMs in the resource group named
    **myResourceGroup**:

	```azurecli
	az vm list -g myResourceGroup --query '[].{Name:name,URI:storageProfile.osDisk.vhd.uri}' --output table
	```

    The output is similar to the following example:

	```azurecli
	Name    URI
	------  -------------------------------------------------------------
	myVM    https://mystorageaccount.blob.core.windows.net/vhds/myVHD.vhd
	```

1.  Copy the VHD by using [az storage blob copy
    start](/cli/azure/storage/blob/copy#start). To provide the required storage
    account keys and virtual hard disk URI, use the information from the `az
    storage account keys list` and `az vm` lists.

	```azurecli
	az storage blob copy start \
		--account-name mystorageaccount \
		--account-key gi7crXhD8PMs8DRWqAM7fAjQEFmENiGlOprNxZGbnpylsw/nq+lQQg0c4jiKoV3Nytr3dAiXZRpL8jflpAr2Ug== \
		--source-uri https://mystorageaccount.blob.core.windows.net/vhds/myVHD.vhd \
		--destination-container vhds --destination-blob myCopiedVHD.vhd
	```

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
	az network nic create --resource-group myResourceGroup --location westeurope --name myNic \
		--vnet-name myVnet --subnet mySubnet
	```

Step 4: Create a VM
-------------------

You can now create a VM by using [az vm create](/cli/azure/vm#create). As when
you copy a disk, the process differs slightly between managed disks and
unmanaged disks. Depending on the storage type of your source VM, follow the
instructions in either of the next two sections.

### Managed disks

Create a VM by using [az vm create](/cli/azure/vm#create).

Specify the copied managed disk to use as the OS disk (--attach-os-disk), as
follows:

```azurecli
az vm create --resource-group myResourceGroup --name myCopiedVM \
    --admin-username azureuser --ssh-key-value ~/.ssh/id_rsa.pub \
    --nics myNic --size Standard_DS1_v2 --os-type Linux \
    --image UbuntuLTS
    --attach-os-disk myCopiedDisk
```

### Unmanaged disks

Create a VM with [az vm create](/cli/azure/vm#create). Specify the storage
account, container name, and VHD you used when creating the copied with `az
storage blob copy start` (--image) as follows:

Specify the storage account, container name, and virtual hard disk that you used
when you created the copied disk with `az storage blob copy start` (--image),
as follows:

```azurecli
az vm create --resource-group myResourceGroup --name myCopiedVM  \
    --admin-username azureuser --ssh-key-value ~/.ssh/id_rsa.pub \
    --nics myNic --size Standard_DS1_v2 --os-type Linux \
    --image https://mystorageaccount.blob.core.windows.net/vhds/myCopiedVHD.vhd \
    --use-unmanaged-disk
```

## Next steps

To learn how to use Azure CLI to manage your new VM, see [Azure CLI commands for
the Azure Resource Manager](azure-cli-arm-commands.md).
