---
title: Create Linux VM from a specialized VHD in Azure | Microsoft Docs
description: Create a new Linux VM by attaching a specialized managed disk as the OS disk using in the Resource Manager deployment model.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 3b7d3cd5-e3d7-4041-a2a7-0290447458ea
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 06/06/2017
ms.author: cynthn

---
# Create a Linux VM from a specialized disk

Create a new Linux VM by attaching a specialized managed disk as the OS disk using the Azure CLI. A specialized disk is a copy of VHD from an existing VM that maintains the user accounts, applications and other state data from your original VM. 

You have two options:
* [Upload a VHD](#option-1-upload-a-specialized-vhd)
* [Copy the VHD of an existing Azure VM](#option-2-copy-the-vhd-from-an-existing-azure-vm)



## Before you begin

This topic requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

This topic also requires the AzCopy tool which you can use within Cloud Shell or download locally. See [AzCopy on Linux Preview](https://azure.microsoft.com/en-us/blog/announcing-azcopy-on-linux-preview/) for installation instructions.

## Option 1: Upload a specialized VHD

You can upload the VHD from a specialized VM created with an on-premises virtualization tool, like Hyper-V, or a VM exported from another cloud.

### Prepare the VM
If you intend to use the VHD as-is to create a new VM, ensure the following steps are completed. 
  
  * Remove any guest virtualization tools and agents that are installed on the VM (i.e. VMware tools).
  * Ensure the VM is configured to pull its IP address and DNS settings via DHCP. This ensures that the server obtains an IP address within the VNet when it starts up. 


### Get the storage account
You need a storage account in Azure to store the uploaded VHD. You can either use an existing storage account or create a new one. 

To show the available storage accounts in the myResourceGroup resource group, type:

```azurecli-interactive
az storage account list -g myResourceGroup
```

Or, to create a new storage account named *mystorageaccount* in the *West US* region in the *myResourceGroup* resource group, type the following:

```azurecli-interactive
az storage account create -n mystorageaccount -g MyResourceGroup -l westus --sku Standard_LRS
```

You also need the storage account key. 

```azurecli-interactive
az storage account keys list --account-name mystorageaccount --resource-group myResourceGroup
```

### Upload the VHD to your storage account 

Use [AzCopy](https://azure.microsoft.com/en-us/blog/announcing-azcopy-on-linux-preview/) to upload the VHD to the storage account. Replace *key1* with your storage account key.

```azurecli-interactive
azcopy --source /mnt --include "*.vhd" --destination "https://mystorageaccount.blob.core.windows.net/mycontainer/" --dest-key key1
```

Depending on your network connection and the size of your VHD file, this command may take a while to complete


## Option 2: Copy the VHD from an existing Azure VM

You can create a copy of the VHD for a VM in another storage account.

### Before you begin

Make sure that you:

* Have information about the **source and destination storage accounts**. For the source VM, you need to have the storage account and container names. Usually, the container name will be **vhds**. You also need to have a destination storage account. If you don't already have one, you can create one using either the portal (**More Services** > Storage accounts > Add) or using the [New-AzureRmStorageAccount](/powershell/module/azurerm.storage/new-azurermstorageaccount) cmdlet. 
* Have downloaded and installed the [AzCopy tool](../../storage/storage-use-azcopy.md). 

### Deallocate the VM
Deallocate the VM using [az vm deallocate](/cli/azure/vm#deallocate), which frees up the VHD to be copied. 

    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    ```


### Get the storage account URLs
You need the URLs of the source and destination storage accounts. The URLs look like: `https://<storageaccount>.blob.core.windows.net/<containerName>/`. If you already know the storage account and container name, you can just replace the information between the brackets to create your URL. 

```powershell
Get-AzureRmVM -ResourceGroupName "myResourceGroup" -Name "myVM"
``` 

## Get the storage access keys
Find the access keys for the source and destination storage accounts. For more information about access keys, see [About Azure storage accounts](../../storage/storage-create-storage-account.md).

* **Portal**: Click **More services** > **Storage accounts** > *storage account* > **Access keys**. Copy the key labeled as **key1**.
* **Powershell**: Use [Get-AzureRmStorageAccountKey](/powershell/module/azurerm.storage/get-azurermstorageaccountkey) to get the storage key for the storage account **mystorageaccount** in the resource group **myResourceGroup**. Copy the key labeled **key1**.

```powershell
Get-AzureRmStorageAccountKey -Name mystorageaccount -ResourceGroupName myResourceGroup
```

### Copy the VHD
You can copy files between storage accounts using AzCopy. For the destination container, if the specified container doesn't exist, it will be created for you. 

To use AzCopy, open a command prompt on your local machine and navigate to the folder where AzCopy is installed. It will be similar to *C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy*. 

To copy all of the files within a container, you use the **/S** switch. This can be used to copy the OS VHD and all of the data disks if they are in the same container. This example shows how to copy all of the files in the container **mysourcecontainer** in storage account **mysourcestorageaccount** to the container **mydestinationcontainer** in the **mydestinationstorageaccount** storage account. Replace the names of the storage accounts and containers with your own. Replace `<sourceStorageAccountKey1>` and `<destinationStorageAccountKey1>` with your own keys.

```
AzCopy /Source:https://mysourcestorageaccount.blob.core.windows.net/mysourcecontainer `
    /Dest:https://mydestinationatorageaccount.blob.core.windows.net/mydestinationcontainer `
    /SourceKey:<sourceStorageAccountKey1> /DestKey:<destinationStorageAccountKey1> /S
```

If you only want to copy a specific VHD in a container with multiple files, you can also specify the file name using the /Pattern switch. In this example, only the file named **myFileName.vhd** will be copied.

```
AzCopy /Source:https://mysourcestorageaccount.blob.core.windows.net/mysourcecontainer `
  /Dest:https://mydestinationatorageaccount.blob.core.windows.net/mydestinationcontainer `
  /SourceKey:<sourceStorageAccountKey1> /DestKey:<destinationStorageAccountKey1> `
  /Pattern:myFileName.vhd
```


When it is finished, you will get a message that looks something like:

```
Finished 2 of total 2 file(s).
[2016/10/07 17:37:41] Transfer summary:
-----------------
Total files transferred: 2
Transfer successfully:   2
Transfer skipped:        0
Transfer failed:         0
Elapsed time:            00.00:13:07
```

### Troubleshooting

When you use AZCopy, if you see the error "Server failed to authenticate the request", make sure the value of the Authorization header is formed correctly including the signature. If you are using Key 2 or the secondary storage key, try using the primary or 1st storage key.

## Create the new VM 

You need to create networking and other VM resources to be used by the new VM.



### Create the subNet and vNet

Create the vNet and subNet of the [virtual network](../../virtual-network/virtual-networks-overview.md).

Create the subNet. This example creates a subnet named **mySubNet**, in the resource group **myResourceGroup**, and sets the subnet address prefix to **10.0.0.0/24**.
   
```powershell
$rgName = "myResourceGroup"
$subnetName = "mySubNet"
$singleSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name $subnetName -AddressPrefix 10.0.0.0/24
```

Create the vNet. This example sets the virtual network name to be **myVnetName**, the location to **West US**, and the address prefix for the virtual network to **10.0.0.0/16**. 
   
```powershell
$location = "West US"
$vnetName = "myVnetName"
$vnet = New-AzureRmVirtualNetwork -Name $vnetName -ResourceGroupName $rgName -Location $location `
    -AddressPrefix 10.0.0.0/16 -Subnet $singleSubnet
```    

### Create a public IP address and NIC
To enable communication with the virtual machine in the virtual network, you need a [public IP address](../../virtual-network/virtual-network-ip-addresses-overview-arm.md) and a network interface.

Create the public IP. In this example, the public IP address name is set to **myIP**.
   
```powershell
$ipName = "myIP"
$pip = New-AzureRmPublicIpAddress -Name $ipName -ResourceGroupName $rgName -Location $location `
   -AllocationMethod Dynamic
```       

Create the NIC. In this example, the NIC name is set to **myNicName**.
   
```powershell
$nicName = "myNicName"
$nic = New-AzureRmNetworkInterface -Name $nicName -ResourceGroupName $rgName `
    -Location $location -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id
```

### Create the network security group and an RDP rule
To be able to log in to your VM using RDP, you need to have an security rule that allows RDP access on port 3389. Because the VHD for the new VM was created from an existing specialized VM, after the VM is created you can use an existing account from the source virtual machine that had permission to log on using RDP.
This example sets the NSG name to **myNsg** and the RDP rule name to **myRdpRule**.

```powershell
$nsgName = "myNsg"

$rdpRule = New-AzureRmNetworkSecurityRuleConfig -Name myRdpRule -Description "Allow RDP" `
    -Access Allow -Protocol Tcp -Direction Inbound -Priority 110 `
    -SourceAddressPrefix Internet -SourcePortRange * `
    -DestinationAddressPrefix * -DestinationPortRange 3389
$nsg = New-AzureRmNetworkSecurityGroup -ResourceGroupName $rgName -Location $location `
    -Name $nsgName -SecurityRules $rdpRule
	
```

For more information about endpoints and NSG rules, see [Opening ports to a VM in Azure using PowerShell](nsg-quickstart-powershell.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

### Set the VM name and size

This example sets the VM name to "myVM" and the VM size to "Standard_A2".

```powershell
$vmName = "myVM"
$vmConfig = New-AzureRmVMConfig -VMName $vmName -VMSize "Standard_A2"
```

### Add the NIC
	
```powershell
$vm = Add-AzureRmVMNetworkInterface -VM $vmConfig -Id $nic.Id
```
	
	
### Create a managed disk from the VHD

Create a managed disk from the specialized VHD in your storage account using [New-AzureRMDisk](/powershell/module/azurerm.compute/new-azurermdisk). This example uses **myOSDisk1** for the disk name, puts the disk in **StandardLRS** storage and uses **https://storageaccount.blob.core.windows.net/vhdcontainer/osdisk.vhd** as the URI for the source VHD that you uploaded or copied to a storage account.

convert the VHD to a managed disk with [az disk create](/cli/azure/disk/create):

```azurecli
az disk create --resource-group myResourceGroup --name myManagedDisk \
  --source https://mystorageaccount.blob.core.windows.net/mydisks/myDisk.vhd
```

Obtain the details of the managed disk you created with [az disk list](/cli/azure/disk/list):

```azurecli
az disk list --resource-group myResourceGroup \
  --query [].{Name:name,ID:id} --output table
```

The output is similar to the following example:

```azurecli
Name               ID
-----------------  ----------------------------------------------------------------------------------------------------
myManagedDisk    /subscriptions/mySubscriptionId/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/myManagedDisk
```

Now, create your VM with [az vm create](/cli/azure/vm#create) and specify the name of your managed disk (`--attach-os-disk`). The following example creates a VM named `myVM` using the managed disk created from your uploaded VHD:

```azurecli
az vm create --resource-group myResourceGroup --location westus \
    --name myVM --os-type linux \
    --admin-username azureuser --ssh-key-value ~/.ssh/id_rsa.pub \
    --attach-os-disk myManagedDisk
```

### Create the VM 


```azurecli-interactive
az vm create -g MyResourceGroup -n MyVm --attach-os-disk MyOsDisk --os-type linux
```

```

### Verify that the VM was created
You should see the newly created VM either in the [Azure portal](https://portal.azure.com), under **Browse** > **Virtual machines**, or by using the following PowerShell commands:

```powershell
$vmList = Get-AzureRmVM -ResourceGroupName $rgName
$vmList.Name
```

## Next steps
To sign in to your new virtual machine, browse to the VM in the [portal](https://portal.azure.com), click **Connect**, and open the Remote Desktop RDP file. Use the account credentials of your original virtual machine to sign in to your new virtual machine. For more information, see [How to connect and log on to an Azure virtual machine running Windows](connect-logon.md).

