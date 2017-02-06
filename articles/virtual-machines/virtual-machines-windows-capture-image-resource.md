---
title: Create a managed image in Azure | Microsoft Docs
description: Create a managed image of a generalized VM or VHD in Azure. Images can be used to create multiple VMs that use managed disks. 
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 02/04/2017
ms.author: cynthn

---
# How to capture a managed image of a generalized VM in Azure

A managed image resource can be created from a generalized VM that is stored as either a managed disk or an unmanaged disks in a storage account. The image can then be used to create multiple VMs that use managed disks for storage. 


## Prerequisites
You need to have already [generalized the VM](virtual-machines-windows-generalize-vhd.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) and Stop\deallocatted the VM. Generalizing a VM removes all your personal account information, among other things, and prepares the machine to be used as an image.

## Create a managed image in the portal 

1. Open the [portal](https://portal.azure.com).
2. Click the plus sign to create a new resource.
3. In the filter search, type **Image**.
4. Select **Image** from the results.
5. In the **Image** blade, click **Create**.
6. In **Name**, type a name for the image.
7. In **Resource Group** either select **Create new** and type in a name or select **From existing** and select a resource group to use from the drop-down list.
8. in **Location, choose the location of your resource group.
9. In **OS type** select the type of operating system, either Windows or Linux.
10. In **OS state** select either specialized or generalized. 
11. In **Storage blob**, click **Browse** to look for the VHD in Azure storage.
12. In **Account type** choose Standard_LRS or Premium_LRS. Standard uses hard-disk drives and Premium uses solid-state drives. Both use locally-redundant storage.
13. In **Disk caching** select the appropriate disk caching option. The options are **None**, **Read-only** and ** Read\write**.
14. Optional: You can also add an existing data disk to the image.  
15. When you are done making your selections, click **Create**.
16. After the image is created, you will see it as an **Image** resource in the list of resources in the resource group you chose.



## Create a managed image of a VM using Powershell

Creating an image directly from the VM ensures that the image includes all of the disks associated with the VM, including the OS Disk and any data disks.

1. Open Azure PowerShell and sign in to your Azure account.
   
    ```powershell
    Login-AzureRmAccount
    ```
   
    A pop-up window opens for you to enter your Azure account credentials.
2. Get the subscription IDs for your available subscriptions.
   
    ```powershell
    Get-AzureRmSubscription
    ```
3. If you have more than one subscription and the one you want to use is not select, set the correct subscription.
   
    ```powershell
    Select-AzureRmSubscription -SubscriptionName "My Subscription"
    ```
	
4. Create some variables. 
    ```powershell
	$vmName = "myVM"
	$rgName = "myResourceGroup"
	$location = "EastUS"
	$imageName = "myImage"
	```
5. Make sure the VM has been deallocated.

    ```powershell
	Stop-AzureRmVM -ResourceGroupName $rgName -VMName $vmName -Force
	```
	
6. Set the status of the virtual machine to **Generalized**. 
   
    ```powershell
    Set-AzureRmVm -ResourceGroupName $rgName -Name $vmName -Generalized
	```
	
7. Get the virtual machine. 

    ```powershell
	$vm = Get-AzureRmVM -Name $vmName -ResourceGroupName $rgName
	```

8. Create the image configuration.

    ```powershell
	$image = New-AzureRmImageConfig -Location $location -SourceVirtualMachineId $vm.ID 
	```
9. Create the image.

    ```powershell
    New-AzureRmImage -Image $image -ImageName $imageName -ResourceGroupName $rgName
    ```	



## Create a managed image of a VHD in PowerShell

Create a managed image using your generalized OS VHD.


1.  First, set the common parameters:

    ```powershell
	$rgName = 'myResourceGroupName'
	$vmName = 'myVM'
	$location = 'West Central US' 
	$imageName = 'yourImageName'
	$osVhdUri = 'https://storageaccount.blob.core.windows.net/vhdcontainer/osdisk.vhd'
    ```
2. Step\deallocate the VM.

    ```powershell
	Stop-AzureRmVM -ResourceGroupName $rgName -VMName $vmName -Force
	```
	
3. Mark the VM as generalized.

    ```powershell
	Set-AzureRmVm -ResourceGroupName $rgName -Name $vmName -Generalized	
	```
2.  Create the image using your generalized OS VHD.

    ```powershell
	$imageConfig = New-AzureRmImageConfig -Location $location
	$imageConfig = Set-AzureRmImageOsDisk -Image $imageConfig -OsType Windows -OsState Generalized -BlobUri $osVhdUri
	$image = New-AzureRmImage -ImageName $imageName -ResourceGroupName $rgName -Image $imageConfig
    ```

## Next steps
- Now you can [create a VM from the generalized managed image](virtual-machines-windows-create-vm-generalized-managed.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).	
	