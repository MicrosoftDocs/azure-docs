<properties
	pageTitle="Create a copy of your Windows VM | Microsoft Azure"
	description="Learn how to create a copy of your Azure virtual machine running Windows, in the Resource Manager deployment model, by creating a *specialized image*."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/26/2016"
	ms.author="cynthn"/>

# Create a copy of a Windows virtual machine in the Azure Resource Manager deployment model


This article shows you how to create a copy of your Azure virtual machine (VM) running Windows. Specifically, it covers how to do this in the Azure Resource Manager deployment model, by using the Azure PowerShell and the Azure portal. It shows you how to create a *specialized* image of your Azure VM, which maintains the user accounts and other state data from your original VM. A specialized image is useful for porting your Windows VM from the classic deployment model to the Resource Manager deployment model, or creating a backup copy of your Windows VM created in the Resource Manager deployment model. You can copy over the operating system and data disks this way, and then set up the network resources to create the new virtual machine.

If you need to create mass deployments of similar Windows VMs, you should use a *generalized* image. For that, see [How to capture a Windows virtual machine](virtual-machines-windows-capture-image.md).



## Before you begin

Ensure that you meet the following prerequisites before you start the steps:

- **You have an Azure virtual machine running Windows**, created by using either the classic or the Resource Manager deployment model. You have configured the operating system, attached data disks, and made other customizations like installing required applications. You'll use this VM to create the copy. If you need help creating the source VM, see [How to create a Windows VM with Resource Manager](virtual-machines-windows-ps-create.md).

- You have **Azure PowerShell 1.0 (or later)** installed on your machine, and you are signed in to your Azure subscription. For more information, see [How to install and configure PowerShell](../powershell-install-configure.md).

- You have downloaded and installed the **AzCopy tool**. For more information about this tool, see [Transfer data with AzCopy commandline tool](../storage/storage-use-azcopy.md).

- You have a **resource group**, a **storage account**, and a **blob container** created in that resource group to copy the VHDs to. For steps to use an existing storage account or create a new one, see [Create or find an Azure storage account](virtual-machines-windows-upload-image.md#createstorage).

> [AZURE.NOTE] Similar steps apply for a VM created by using either of the two deployment models as the source image. Where applicable, this article notes the minor differences.


## Copy VHDs to your Resource Manager storage account


1. Free up the VHDs used by the source VM, by doing either of the following:

	- If you want to copy your source virtual machine, stop and deallocate it.

		- For a VM created by using classic deployment model, you can either use the [portal](https://portal.azure.com), and click **Browse** > **Virtual machines (classic)** > *your VM* > **Stop**, or the PowerShell command `Stop-AzureVM -ServiceName <yourServiceName> -Name <yourVmName>`.

		- For a VM created by using the Resource Manager deployment model, you can sign in to the portal and click **Browse** > **Virtual machines** > *your VM* > **Stop**, or use the PowerShell command `Stop-AzureRmVM -ResourceGroupName <yourResourceGroup> -Name <yourVmName>`. Notice that the status of the VM in the portal changes from **Running** to **Stopped (deallocated)**.

	- If you want to migrate your source virtual machine, delete that VM and use the VHD left behind. Browse to your virtual machine in the [portal](https://portal.azure.com), and click **Delete**.

1. Find the access keys for the storage account that contains your source VHD, as well as the storage account where you will copy your VHD to create the new VM. The key for the account from where we are copying the VHD is called the *Source Key*, and that for the account to which it will be copied is called the *Destination Key*. For more information about access keys, see [About Azure storage accounts](../storage/storage-create-storage-account.md).

	- If your source VM was created by using the classic deployment model, click **Browse** > **Storage accounts (classic)** > *your storage account* > **All Settings** > **Keys**. Copy the key labeled as **PRIMARY ACCESS KEY**.

	- If your source VM was created by using the Resource Manager deployment model, or for the storage account that you will use for your new VM, click **Browse** > **Storage accounts** > *your storage account* > **All Settings** > **Access keys**. Copy the key labeled as **key1**.

1. Get the URLs to access your source and destination storage accounts. In the portal, browse to your storage account and click **Blobs**. Then click the container that hosts your source VHD (for example, *vhds* for the classic deployment model), or the container that you want the VHD to be copied to. Click **Properties** for the container, and copy the text labeled **URL**. You'll need the URLs of both the source and destination containers. The URLs will look similar to `https://myaccount.blob.core.windows.net/mycontainer`.

1. On your local computer, open a command window and browse to the folder where AzCopy is installed. (It will be similar to *C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy*.) From there, run the following command:
</br>

		AzCopy /Source:<URL_of_the_source_blob_container> /Dest:<URL_of_the_destination_blob_container> /SourceKey:<Access_key_for_the_source_storage> /DestKey:<Access_key_for_the_destination_storage> /Pattern:<File_name_of_the_VHD_you_are_copying>
</br>

>[AZURE.NOTE] You should copy the operating system and data disks separately, by using AzCopy as described in the preceding step.


## Create a VM by using the copied VHD

By using the VHD copied in the preceding steps, you can now use Azure PowerShell to create a Resource Manager-based Windows VM in a new virtual network. The VHD should be present in the same storage account as the new virtual machine that will be created.


Set up a virtual network and NIC for your new VM, similar to following script. Use values for the variables (represented by the **$** sign) as appropriate to your application.

	$pip = New-AzureRmPublicIpAddress -Name $pipName -ResourceGroupName $rgName -Location $location -AllocationMethod Dynamic

	$subnetconfig = New-AzureRmVirtualNetworkSubnetConfig -Name $subnet1Name -AddressPrefix $vnetSubnetAddressPrefix

	$vnet = New-AzureRmVirtualNetwork -Name $vnetName -ResourceGroupName $rgName -Location $location -AddressPrefix $vnetAddressPrefix -Subnet $subnetconfig

	$nic = New-AzureRmNetworkInterface -Name $nicname -ResourceGroupName $rgName -Location $location -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id


Now set up the VM configurations, and use the copied VHDs to create a new virtual machine.
</br>

	#Set the VM name and size
	$vmConfig = New-AzureRmVMConfig -VMName $vmName -VMSize "Standard_A2"

	#Add the NIC
	$vm = Add-AzureRmVMNetworkInterface -VM $vmConfig -Id $nic.Id

	#Add the OS disk by using the URL of the copied OS VHD
	$osDiskName = $vmName + "osDisk"
	$vm = Set-AzureRmVMOSDisk -VM $vm -Name $osDiskName -VhdUri $osDiskUri -CreateOption attach -Windows

	#Add data disks by using the URLs of the copied data VHDs at the appropriate Logical Unit Number (Lun)
	$dataDiskName = $vmName + "dataDisk"
	$vm = Add-AzureRmVMDataDisk -VM $vm -Name $dataDiskName -VhdUri $dataDiskUri -Lun 0 -CreateOption attach

The data and operating system disk URLs look something like this: `https://StorageAccountName.blob.core.windows.net/BlobContainerName/DiskName.vhd`. You can find this on the portal by browsing to the target storage container, clicking the operating system or data VHD that was copied, and then copying the contents of the URL.

	#Create the new VM
	New-AzureRmVM -ResourceGroupName $rgName -Location $location -VM $vm

If this command was successful, you'll see output like this:

	RequestId IsSuccessStatusCode StatusCode ReasonPhrase
	--------- ------------------- ---------- ------------
	                         True         OK OK


You should see the newly created VM either in the [Azure portal](https://portal.azure.com), under **Browse** > **Virtual machines**, or by using the following PowerShell commands:

	$vmList = Get-AzureRmVM -ResourceGroupName $rgName
	$vmList.Name

To sign in to your new virtual machine, browse to the VM in the [portal](https://portal.azure.com), click **Connect**, and open the Remote Desktop RDP file. Use the account credentials of your original virtual machine to sign in to your new virtual machine.


## Next steps

To manage your new virtual machine with Azure PowerShell, see [Manage virtual machines using Azure Resource Manager and PowerShell](virtual-machines-windows-ps-manage.md).
