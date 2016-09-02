<properties
	pageTitle="Create a copy of your Windows VM | Microsoft Azure"
	description="Learn how to create a copy of your specialized Azure VM running Windows, in the Resource Manager deployment model."
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

# Create a copy of a specialized Windows Azure VM in the Azure Resource Manager deployment model


This article shows you how to create a copy of your **specialized** Azure virtual machine (VM) running Windows. A ***specialized** VM maintains the user accounts and other state data from your original VM. We will use the AzCopy tool to copy the VHD and then we will create a new VM and attach the copy of the VHD.

If you need to create mass deployments of similar Windows VMs, you should use an image that has been ***generalized** using Sysprep. To create generalized image and use that image to create a VM, see [How to capture a Windows virtual machine](virtual-machines-windows-capture-image.md).


## Before you begin

Make sure that you:

- Have information about the **source and destination storage accounts**. For the source VM, you need to storage account and container names. In most cases, the container name will be **vhds**. You also need to have a destination storage account. If you don't already have one, you can create one using either the portal (**More Services** > Storage accounts > Add or using the [New-AzureRmStorageAccount](https://msdn.microsoft.com/library/mt607148.aspx) cmdlet. 

- Have Azure [PowerShell 1.0](../powershell-install-configure.md) (or later) installed.

- Have downloaded and installed the [AzCopy tool](../storage/storage-use-azcopy.md). 

## Deallocate the VM

Deallocate the VM, which frees up the VHD to be copied.

- **Portal**: Click **Virtual machines** > <vmName> > Stop
- **Powershell**: Stop-AzureRmVM -ResourceGroupName <resourceGroup> -Name <vmName>


The *Status* for the VM in the Azure portal changes from **Stopped** to **Stopped (deallocated)**.

## Get the storage account URLs

You need the URLs of the source and destination storage accounts. The URLs look like: https://<storageaccount>.blob.core.windows.net/<containerName>. If you already know the storage account and container name, you can just replace the information between the brackets to create your URL. 

You can also use the Azure portal or Azure Powershell to get the URL:

- **Portal**:  **More services** > **Storage accounts** > <storage account> **Blobs** and your source VHD file is probably in the **vhds** container. Click **Properties** for the container, and copy the text labeled **URL**. You'll need the URLs of both the source and destination containers. 

- **Powershell**: Get-AzureRmVM -ResourceGroupName "resource_group_name" -Name "vm_name". In the results, look in the **Storage profile** section for the **Vhd Uri**. The first part of the Uri is the URL to the container and the last part is the OS VHD name for the VM.

## Get the storage access keys

Find the access keys for the source and destination storage accounts. For more information about access keys, see [About Azure storage accounts](../storage/storage-create-storage-account.md).

- **Portal**: Click **More services** > **Storage accounts** > <storage account> **All Settings** > **Access keys**. Copy the key labeled as **key1**.
- **Powershell**: Get-AzureRmStorageAccountKey -Name <storageAccount> -ResourceGroupName <resourceGroupName>. Copy the key labeled as **key1**.

## Copy the VHD 

You can copy files between storage accounts using AzCopy. For the destination container, if the specified container doesn't exist, it will be created for you. 

To use AzCopy, open a command prompt on your local machine and navigate to the folder where AzCopy is installed. It will be similar to *C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy*. 

To copy all of the files within a container, you use the **/S** switch. This can be used to copy the VMs OS VHD and all of the data disks if they are in the same container.

	AzCopy /Source:https://<sourceStorageAccountName>.blob.core.windows.net/<sourceContainerName> /Dest:https://<destinationStorageAccount>.blob.core.windows.net/<destinationContainerName> /SourceKey:<sourceStorageAccountKey1> /DestKey:<destinationStorageAccountKey1> /S

If you only want to copy a specific VHD in a container with multiple files, you can also specify the file name using the /Pattern switch.

 	AzCopy /Source:<URL_of_the_source_blob_container> /Dest:<URL_of_the_destination_blob_container> /SourceKey:<Access_key_for_the_source_storage> /DestKey:<Access_key_for_the_destination_storage> /Pattern:<File_name_of_the_VHD_you_are_copying.vhd>


## Log in to Azure PowerShell

1. Open Azure PowerShell and sign in to your Azure account.

		Login-AzureRmAccount

	A pop-up window opens for you to enter your Azure account credentials.

2. Get the subscription IDs for your available subscriptions.

		Get-AzureRmSubscription

3. Set the correct subscription using the subscription ID.		

		Select-AzureRmSubscription -SubscriptionId "<subscriptionID>"




## Create variables

$sourceRG = "<sourceResourceGroupName>"
$destinationRG = "<destinationResourceGroupName>"

$vm = Get-AzureRmResource -ResourceGroupName $sourceRG -ResourceType "Microsoft.Compute/virtualMachines" -ResourceName "<vmName>"
$storageAccount = Get-AzureRmResource -ResourceGroupName $sourceRG -ResourceType "Microsoft.Storage/storageAccounts" -ResourceName "<storageAccountName>"

$diagStorageAccount = Get-AzureRmResource -ResourceGroupName $sourceRG -ResourceType "Microsoft.Storage/storageAccounts" -ResourceName "<diagnosticStorageAccountName>"


$vNet = Get-AzureRmResource -ResourceGroupName $sourceRG -ResourceType "Microsoft.Network/virtualNetworks" -ResourceName "<vNetName>"
$nic = Get-AzureRmResource -ResourceGroupName $sourceRG -ResourceType "Microsoft.Network/networkInterfaces" -ResourceName "<nicName>"
$ip = Get-AzureRmResource -ResourceGroupName $sourceRG -ResourceType "Microsoft.Network/publicIPAddresses" -ResourceName "<ipName>"
$nsg = Get-AzureRmResource -ResourceGroupName $sourceRG -ResourceType "Microsoft.Network/networkSecurityGroups" -ResourceName "<nsgName>"



## Create a VM by using the copied VHD

By using the VHD copied in the preceding steps, you can now use Azure PowerShell to create a Resource Manager-based Windows VM in a new virtual network. The VHD should be present in the same storage account as the new virtual machine that will be created.


Set up a virtual network and NIC for your new VM, similar to following script. Use values for the variables (represented by the **$** sign) as appropriate to your application.

	$pip = New-AzureRmPublicIpAddress -Name $pipName -ResourceGroupName $rgName -Location $location -AllocationMethod Dynamic

	$subnetconfig = New-AzureRmVirtualNetworkSubnetConfig -Name $subnet1Name -AddressPrefix $vnetSubnetAddressPrefix

	$vnet = New-AzureRmVirtualNetwork -Name $vnetName -ResourceGroupName $rgName -Location $location -AddressPrefix $vnetAddressPrefix -Subnet $subnetconfig

	$nic = New-AzureRmNetworkInterface -Name $nicname -ResourceGroupName $rgName -Location $location -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id


Now set up the VM configurations, create a new VM and attach the copied VHD as the OS VHD.
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
