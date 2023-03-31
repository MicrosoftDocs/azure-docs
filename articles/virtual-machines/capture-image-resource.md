---
title: Create a legacy managed image in Azure 
description: Create a legacy managed image of a generalized VM or VHD in Azure. 
author: cynthn
ms.service: virtual-machines
ms.subservice: imaging
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 03/15/2023
ms.author: cynthn
ms.custom: legacy, devx-track-azurepowershell
---
# Create a legacy managed image of a generalized VM in Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets 

> [!IMPORTANT]
> This article covers the older managed image technology. For the most current technology, customers are encouraged to use [Azure Compute Gallery](azure-compute-gallery.md). All new features, like ARM64, Trusted Launch, and Confidential VM  are only supported through Azure Compute Gallery.  If you have an existing managed image, you can use it as a source and create an Azure Compute Gallery image.  For more information, see [Create an image definition and image version](image-version.md).
>
> One managed image supports up to 20 simultaneous deployments. Attempting to create more than 20 VMs concurrently, from the same managed image, may result in provisioning timeouts due to the storage performance limitations of a single VHD. To create more than 20 VMs concurrently, use an [Azure Compute Gallery](shared-image-galleries.md) (formerly known as Shared Image Gallery) image configured with 1 replica for every 20 concurrent VM deployments.

For information on how managed images are billed, see [Managed Disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/).

## Prerequisites

You need a [generalized](generalize.md) VM in order to create an image.


## CLI: Create a legacy managed image of a VM

Create a managed image of the VM with [az image create](/cli/azure/image#az-image-create). The following example creates an image named *myImage* in the resource group named *myResourceGroup* using the VM resource named *myVM*.

```azurecli
az image create \
   --resource-group myResourceGroup \
   --name myImage --source myVM
```
   
   > [!NOTE]
   > The image is created in the same resource group as your source VM. You can create VMs in any resource group within your subscription from this image. From a management perspective, you may wish to create a specific resource group for your VM resources and images.
   >
   > If you are capturing an image of a generation 2 VM, also use the `--hyper-v-generation V2` parameter. for more information, see [Generation 2 VMs](generation-2.md).
   > 
   > If you would like to store your image in zone-resilient storage, you need to create it in a region that supports [availability zones](../availability-zones/az-overview.md) and include the `--zone-resilient true` parameter.
   
This command returns JSON that describes the VM image. Save this output for later reference.


## PowerShell: Create a legacy managed image of a VM

Creating an image directly from the VM ensures that the image includes all of the disks associated with the VM, including the OS disk and any data disks. This example shows how to create a managed image from a VM that uses managed disks.

Before you begin, make sure that you have the latest version of the Azure PowerShell module. To find the version, run `Get-Module -ListAvailable Az` in PowerShell. If you need to upgrade, see [Install Azure PowerShell on Windows with PowerShellGet](/powershell/azure/install-az-ps). If you are running PowerShell locally, run `Connect-AzAccount` to create a connection with Azure.


> [!NOTE]
> If you would like to store your image in zone-redundant storage, you need to create it in a region that supports [availability zones](../availability-zones/az-overview.md) and include the `-ZoneResilient` parameter in the image configuration (`New-AzImageConfig` command).

To create a VM image, follow these steps:

1. Create some variables.

    ```azurepowershell-interactive
	$vmName = "myVM"
	$rgName = "myResourceGroup"
	$location = "EastUS"
	$imageName = "myImage"
	```
2. Make sure the VM has been deallocated.

    ```azurepowershell-interactive
	Stop-AzVM -ResourceGroupName $rgName -Name $vmName -Force
	```
	
3. Set the status of the virtual machine to **Generalized**. 
   
    ```azurepowershell-interactive
    Set-AzVm -ResourceGroupName $rgName -Name $vmName -Generalized
	```
	
4. Get the virtual machine. 

    ```azurepowershell-interactive
	$vm = Get-AzVM -Name $vmName -ResourceGroupName $rgName
	```

5. Create the image configuration.

    ```azurepowershell-interactive
	$image = New-AzImageConfig -Location $location -SourceVirtualMachineId $vm.Id 
	```
6. Create the image.

    ```azurepowershell-interactive
    New-AzImage -Image $image -ImageName $imageName -ResourceGroupName $rgName
    ```	

## PowerShell: Create a legacy managed image from a managed disk 

If you want to create an image of only the OS disk, specify the managed disk ID as the OS disk:

	
1. Create some variables. 

    ```azurepowershell-interactive
	$vmName = "myVM"
	$rgName = "myResourceGroup"
	$location = "EastUS"
	$imageName = "myImage"
	```

2. Get the VM.

   ```azurepowershell-interactive
   $vm = Get-AzVm -Name $vmName -ResourceGroupName $rgName
   ```

3. Get the ID of the managed disk.

    ```azurepowershell-interactive
	$diskID = $vm.StorageProfile.OsDisk.ManagedDisk.Id
	```
   
3. Create the image configuration.

    ```azurepowershell-interactive
	$imageConfig = New-AzImageConfig -Location $location
	$imageConfig = Set-AzImageOsDisk -Image $imageConfig -OsState Generalized -OsType Windows -ManagedDiskId $diskID
	```
	
4. Create the image.

    ```azurepowershell-interactive
    New-AzImage -ImageName $imageName -ResourceGroupName $rgName -Image $imageConfig
    ```	


## PowerShell: Create a legacy managed image from a snapshot

You can create a managed image from a snapshot of a generalized VM by following these steps:

	
1. Create some variables. 

    ```azurepowershell-interactive
	$rgName = "myResourceGroup"
	$location = "EastUS"
	$snapshotName = "mySnapshot"
	$imageName = "myImage"
	```

2. Get the snapshot.

   ```azurepowershell-interactive
   $snapshot = Get-AzSnapshot -ResourceGroupName $rgName -SnapshotName $snapshotName
   ```
   
3. Create the image configuration.

    ```azurepowershell-interactive
	$imageConfig = New-AzImageConfig -Location $location
	$imageConfig = Set-AzImageOsDisk -Image $imageConfig -OsState Generalized -OsType Windows -SnapshotId $snapshot.Id
	```
4. Create the image.

    ```azurepowershell-interactive
    New-AzImage -ImageName $imageName -ResourceGroupName $rgName -Image $imageConfig
    ```	


## PowerShell: Create a legacy managed image from a VM that uses a storage account

To create a managed image from a VM that doesn't use managed disks, you need the URI of the OS VHD in the storage account, in the following format: https://*mystorageaccount*.blob.core.windows.net/*vhdcontainer*/*vhdfilename.vhd*. In this example, the VHD is in *mystorageaccount*, in a container named *vhdcontainer*, and the VHD filename is *vhdfilename.vhd*.


1.  Create some variables.

    ```azurepowershell-interactive
	$vmName = "myVM"
	$rgName = "myResourceGroup"
	$location = "EastUS"
	$imageName = "myImage"
	$osVhdUri = "https://mystorageaccount.blob.core.windows.net/vhdcontainer/vhdfilename.vhd"
    ```
2. Stop/deallocate the VM.

    ```azurepowershell-interactive
	Stop-AzVM -ResourceGroupName $rgName -Name $vmName -Force
	```
	
3. Mark the VM as generalized.

    ```azurepowershell-interactive
	Set-AzVm -ResourceGroupName $rgName -Name $vmName -Generalized	
	```
4.  Create the image by using your generalized OS VHD.

    ```azurepowershell-interactive
	$imageConfig = New-AzImageConfig -Location $location
	$imageConfig = Set-AzImageOsDisk -Image $imageConfig -OsType Windows -OsState Generalized -BlobUri $osVhdUri
	$image = New-AzImage -ImageName $imageName -ResourceGroupName $rgName -Image $imageConfig
    ```


## CLI: Create a VM from a legacy managed image
Create a VM by using the image you created with [az vm create](/cli/azure/vm). The following example creates a VM named *myVMDeployed* from the image named *myImage*.

```azurecli
az vm create \
   --resource-group myResourceGroup \
   --name myVMDeployed \
   --image myImage\
   --admin-username azureuser \
   --ssh-key-value ~/.ssh/id_rsa.pub
```

## CLI: Create a VM in another resource group from a legacy managed image

You can create VMs from an image in any resource group within your subscription. To create a VM in a different resource group than the image, specify the full resource ID to your image. Use [az image list](/cli/azure/image#az-image-list) to view a list of images. The output is similar to the following example.

```json
"id": "/subscriptions/guid/resourceGroups/MYRESOURCEGROUP/providers/Microsoft.Compute/images/myImage",
   "location": "westus",
   "name": "myImage",
```

The following example uses [az vm create](/cli/azure/vm#az-vm-create) to create a VM in a resource group other than the source image, by specifying the image resource ID.

```azurecli
az vm create \
   --resource-group myOtherResourceGroup \
   --name myOtherVMDeployed \
   --image "/subscriptions/guid/resourceGroups/MYRESOURCEGROUP/providers/Microsoft.Compute/images/myImage" \
   --admin-username azureuser \
   --ssh-key-value ~/.ssh/id_rsa.pub
```


## Portal: Create a VM from a legacy managed image

1. Go to the [Azure portal](https://portal.azure.com) to find a managed image. Search for and select **Images**.
3. Select the image you want to use from the list. The image **Overview** page opens.
4. Select **Create VM** from the menu.
5. Enter the virtual machine information. The user name and password entered here will be used to log in to the virtual machine. When complete, select **OK**. You can create the new VM in an existing resource group, or choose **Create new** to create a new resource group to store the VM.
6. Select a size for the VM. To see more sizes, select **View all** or change the **Supported disk type** filter. 
7. Under **Settings**, make changes as necessary and select **OK**. 
8. On the summary page, you should see your image name listed as a **Private image**. Select **Ok** to start the virtual machine deployment.


## PowerShell: Create a VM from a legacy managed image

You can use PowerShell to create a VM from an image by using the simplified parameter set for the [New-AzVm](/powershell/module/az.compute/new-azvm) cmdlet. The image needs to be in the same resource group where you'll create the VM.

 

The simplified parameter set for [New-AzVm](/powershell/module/az.compute/new-azvm) only requires that you provide a name, resource group, and image name to create a VM from an image. New-AzVm will use the value of the **-Name** parameter as the name of all of the resources that it creates automatically. In this example, we provide more detailed names for each of the resources but let the cmdlet create them automatically. You can also create resources beforehand, such as the virtual network, and pass the resource name into the cmdlet. New-AzVm will use the existing resources if it can find them by their name.

The following example creates a VM named *myVMFromImage*, in the *myResourceGroup* resource group, from the image named *myImage*. 


```azurepowershell-interactive
New-AzVm `
    -ResourceGroupName "myResourceGroup" `
    -Name "myVMfromImage" `
	-ImageName "myImage" `
    -Location "East US" `
    -VirtualNetworkName "myImageVnet" `
    -SubnetName "myImageSubnet" `
    -SecurityGroupName "myImageNSG" `
    -PublicIpAddressName "myImagePIP" 
```


	
## Next steps

- Learn more about using an [Azure Compute Gallery](shared-image-galleries.md) (formerly known as Shared Image Gallery)
