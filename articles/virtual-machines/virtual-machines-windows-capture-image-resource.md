---
title: Capture an image of a VM in Azure | Microsoft Docs
description: Capture an image of a generalized VM in Azure for using with managed disks. 
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
ms.date: 1/19/2017
ms.author: cynthn

---
# How to capture an image of a generalized VM in Azure

An image resource can be created from a generalized VM that is stored as either a managed disk or a storage account based VHD. The image can then be used to create multiple VMs that use managed disks for storage. The image includes all of the disks that are attached to the VM.


## Prerequisites
You need to have already [generalized the VM](virtual-machines-windows-generalize-vhd.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) and Stop\deallocatted the VM. Generalizing a VM removes all your personal account information, among other things, and prepares the machine to be used as an image.

## Portal 

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
11. In **Storage blob** type the URI for the VHD file you want to use or click **Browse** to look for the VHD in Azure storage.
12. In **Account type** choose Standard_LRS or Premium_LRS. Standard uses hard-disk drives and Premium uses solid-state drives. Both use locally-redundant storage.
13. In **Disk caching** select the appropriate disk caching option. The options are **None**, **Read-only** and ** Read\write**.
14. Optional: You can also add an existing data disk to the image.  
15. When you are done making your selections, click **Create**.
16. After the image is created, you will see it as an **Image** resource in the list of resources in the resource group you chose.



## PowerShell

You will need to URI of the OS disk and any data disks that you want to be included in the image. You can get the URIs by using the [Get-AzureRMVM](/powershell/get-azurermvm.md) cmdlet.

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

## Next steps
- Now you can [create a VM from the image](virtual-machines-windows-create-vm-generalized.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

