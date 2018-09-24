---
title: Create a managed image in Azure | Microsoft Docs
description: Create a managed image of a generalized VM or VHD in Azure. Images can be used to create multiple VMs that use managed disks. 
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 04/10/2018
ms.author: cynthn

---
# Create a managed image of a generalized VM in Azure

A managed image resource can be created from a generalized VM that is stored as either a managed disk or an unmanaged disk in a storage account. The image can then be used to create multiple VMs. 

## Generalize the Windows VM using Sysprep

Sysprep removes all your personal account information, among other things, and prepares the machine to be used as an image. For details about Sysprep, see [How to Use Sysprep: An Introduction](http://technet.microsoft.com/library/bb457073.aspx).

Make sure the server roles running on the machine are supported by Sysprep. For more information, see [Sysprep Support for Server Roles](https://msdn.microsoft.com/windows/hardware/commercialize/manufacture/desktop/sysprep-support-for-server-roles)

> [!IMPORTANT]
> Once you have run sysprep on an VM it is considered *generalized* and it cannot be restarted. The process of generalizing a VM is not reversible. If you need to keep the original VM functioning, you should take a [copy of the VM](create-vm-specialized.md#option-3-copy-an-existing-azure-vm) and generalize the copy. 
>
> If you are running Sysprep before uploading your VHD to Azure for the first time, make sure you have [prepared your VM](prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) before running Sysprep.  
> 
> 

1. Sign in to the Windows virtual machine.
2. Open the Command Prompt window as an administrator. Change the directory to **%windir%\system32\sysprep**, and then run `sysprep.exe`.
3. In the **System Preparation Tool** dialog box, select **Enter System Out-of-Box Experience (OOBE)**, and make sure that the **Generalize** check box is selected.
4. In **Shutdown Options**, select **Shutdown**.
5. Click **OK**.
   
    ![Start Sysprep](./media/upload-generalized-managed/sysprepgeneral.png)
6. When Sysprep completes, it shuts down the virtual machine. Do not restart the VM.


## Create a managed image in the portal 

1. Open the [portal](https://portal.azure.com).
2. In the menu on the left, click Virtual Machines and then select the VM from the list.
3. In the page for the VM, on the upper menu, click **Capture**.
3. In **Name**, type the name that you would like to use for the image.
4. In **Resource group** either select **Create new** and type in a name, or select **Use existing** and select a resource group to use from the drop-down list.
5. If you want to delete the source VM after the image has been created, select **Automatically delete this virtual machine after creating the image**.
6. When you are done, click **Create**.
16. After the image is created, you will see it as an **Image** resource in the list of resources in the resource group.



## Create an image of a VM using Powershell

Creating an image directly from the VM ensures that the image includes all of the disks associated with the VM, including the OS Disk and any data disks. This example shows how to create a managed image from a VM that uses managed disks.


Before you begin, make sure that you have the latest version of the AzureRM.Compute PowerShell module. This article requires the AzureRM module version 5.7.0 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.


> [!NOTE]
> If you would like to store your image in zone-resilient storage, you need to create it in a region that supports [availability zones](../../availability-zones/az-overview.md) and include the `-ZoneResilient` parameter in the image configuration.


1. Create some variables.

    ```azurepowershell-interactive
	$vmName = "myVM"
	$rgName = "myResourceGroup"
	$location = "EastUS"
	$imageName = "myImage"
	```
2. Make sure the VM has been deallocated.

    ```azurepowershell-interactive
	Stop-AzureRmVM -ResourceGroupName $rgName -Name $vmName -Force
	```
	
3. Set the status of the virtual machine to **Generalized**. 
   
    ```azurepowershell-interactive
    Set-AzureRmVm -ResourceGroupName $rgName -Name $vmName -Generalized
	```
	
4. Get the virtual machine. 

    ```azurepowershell-interactive
	$vm = Get-AzureRmVM -Name $vmName -ResourceGroupName $rgName
	```

5. Create the image configuration.

    ```azurepowershell-interactive
	$image = New-AzureRmImageConfig -Location $location -SourceVirtualMachineId $vm.ID 
	```
6. Create the image.

    ```azurepowershell-interactive
    New-AzureRmImage -Image $image -ImageName $imageName -ResourceGroupName $rgName
    ```	
## Create an image from a managed disk using PowerShell

If you only want to create an image of the OS disk, you can also create an image by specifying the managed disk ID as the OS disk.

	
1. Create some variables. 

    ```azurepowershell-interactive
	$vmName = "myVM"
	$rgName = "myResourceGroup"
	$location = "EastUS"
	$snapshotName = "mySnapshot"
	$imageName = "myImage"
	```

2. Get the VM.

   ```azurepowershell-interactive
   $vm = Get-AzureRmVm -Name $vmName -ResourceGroupName $rgName
   ```

3. Get the ID of the managed disk.

    ```azurepowershell-interactive
	$diskID = $vm.StorageProfile.OsDisk.ManagedDisk.Id
	```
   
3. Create the image configuration.

    ```azurepowershell-interactive
	$imageConfig = New-AzureRmImageConfig -Location $location
	$imageConfig = Set-AzureRmImageOsDisk -Image $imageConfig -OsState Generalized -OsType Windows -ManagedDiskId $diskID
	```
	
4. Create the image.

    ```azurepowershell-interactive
    New-AzureRmImage -ImageName $imageName -ResourceGroupName $rgName -Image $imageConfig
    ```	


## Create an image from a snapshot using Powershell

You can create a managed image from a snapshot of a generalized VM.

	
1. Create some variables. 

    ```azurepowershell-interactive
	$rgName = "myResourceGroup"
	$location = "EastUS"
	$snapshotName = "mySnapshot"
	$imageName = "myImage"
	```

2. Get the snapshot.

   ```azurepowershell-interactive
   $snapshot = Get-AzureRmSnapshot -ResourceGroupName $rgName -SnapshotName $snapshotName
   ```
   
3. Create the image configuration.

    ```azurepowershell-interactive
	$imageConfig = New-AzureRmImageConfig -Location $location
	$imageConfig = Set-AzureRmImageOsDisk -Image $imageConfig -OsState Generalized -OsType Windows -SnapshotId $snapshot.Id
	```
4. Create the image.

    ```azurepowershell-interactive
    New-AzureRmImage -ImageName $imageName -ResourceGroupName $rgName -Image $imageConfig
    ```	


## Create image from a VHD in a storage account

Create a managed image from a generalized OS VHD in a storage account. You need the URI of the VHD in the storage account, which is in the format https://*mystorageaccount*.blob.core.windows.net/*container*/*vhd_filename.vhd*. In this example, the VHD that we are using is in *mystorageaccount* in a container named *vhdcontainer* and the VHD filename is *osdisk.vhd*.


1.  First, set the common parameters:

    ```azurepowershell-interactive
	$vmName = "myVM"
	$rgName = "myResourceGroup"
	$location = "EastUS"
	$imageName = "myImage"
	$osVhdUri = "https://mystorageaccount.blob.core.windows.net/vhdcontainer/osdisk.vhd"
    ```
2. Step\deallocate the VM.

    ```azurepowershell-interactive
	Stop-AzureRmVM -ResourceGroupName $rgName -Name $vmName -Force
	```
	
3. Mark the VM as generalized.

    ```azurepowershell-interactive
	Set-AzureRmVm -ResourceGroupName $rgName -Name $vmName -Generalized	
	```
4.  Create the image using your generalized OS VHD.

    ```azurepowershell-interactive
	$imageConfig = New-AzureRmImageConfig -Location $location
	$imageConfig = Set-AzureRmImageOsDisk -Image $imageConfig -OsType Windows -OsState Generalized -BlobUri $osVhdUri
	$image = New-AzureRmImage -ImageName $imageName -ResourceGroupName $rgName -Image $imageConfig
    ```

	
## Next steps
- Now you can [create a VM from the generalized managed image](create-vm-generalized-managed.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).	

