<properties
	pageTitle="Upload a Windows VHD for Resource Manager | Microsoft Azure"
	description="Learn to upload a Windows virtual machine VHD from on-premises to Azure, using the Resource Manager deployment model. You can upload a VHD from either a generalized or a specialized VM."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor="tysonn"
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/22/2016"
	ms.author="cynthn"/>

# Upload a Windows VHD from an on-premises VM to Azure 


This article shows you how to create and upload a Windows virtual hard disk (VHD) to be used in creating an Azure Vm. You can upload a VHD from either a generalized VM or a specialized VM. 

For more details about disks and VHDs in Azure, see [About disks and VHDs for virtual machines](virtual-machines-linux-about-disks-vhds.md).


## Prepare the VM 

You can upload both generalized and specialized VHDs to Azure. Each type requires that you prepare the VM before starting.

- **Generalized VHD** - a generalized VHD has had all of your personal account information removed using Sysprep. If you intend to use the VHD as an image to create new VMs from, you should:
	- [Prepare a Windows VHD to upload to Azure](virtual-machines-windows-prepare-for-upload-vhd-image.md). 
	- [Generalize the virtual machine using Sysprep](virtual-machines-windows-generalize-vhd.md). 

- **Specialized VHD** - a specialized VHD maintains the user accounts, applications and other state data from your original VM. If you intend to use the VHD as-is to create a new VM, ensure the following steps are completed. 
	- [Prepare a Windows VHD to upload to Azure](virtual-machines-windows-prepare-for-upload-vhd-image.md). **Do not** generalize the VM using Sysprep.
	- Remove any guest virtualization tools and agents that are installed on the VM (i.e. VMware tools).
	- Ensure the VM is configured to pull its IP address and DNS settings via DHCP. This ensures that the server obtains an IP address within the VNet when it starts up. 

## Log in to Azure

If you don't already have PowerShell version 1.4 or above installed, read [How to install and configure Azure PowerShell](../powershell-install-configure.md).

1. Open Azure PowerShell and sign in to your Azure account.

```powershell
	Login-AzureRmAccount
```

A pop-up window opens for you to enter your Azure account credentials.

2. Get the subscription IDs for your available subscriptions.

```powershell
		Get-AzureRmSubscription
```

3. Set the correct subscription using the subscription ID.		

```powershell
	Select-AzureRmSubscription -SubscriptionId "<subscriptionID>"
```
	
## Get the storage account

You need a storage account in Azure house the uploaded VM image. You can either use an existing storage account or create a new one. 

Show the available storage accounts.

```powershell
		Get-AzureRmStorageAccount
```

If you want to use an existing storage account, proceed to the [Upload the VM image](#upload-the-vm-image-to-your-storage-account) section.

If you want to create a storage account, follow these steps:

1. You need the name of the resource group where the storage account should be created. To find out all the resource groups that are in your subscription, type:

```powershell
		Get-AzureRmResourceGroup
```

	To create a resource group, use this command:

```powershell
		New-AzureRmResourceGroup -Name <resourceGroupName> -Location <location>
```

2. Create a storage account in this resource group by using the [New-AzureRmStorageAccount](https://msdn.microsoft.com/library/mt607148.aspx) cmdlet:

```powershell
	New-AzureRmStorageAccount -ResourceGroupName <resourceGroupName> -Name <storageAccountName> -Location "<location>" -SkuName "<skuName>" -Kind "Storage"
```
			
Valid values for -SkuName are:

- **Standard_LRS** - Locally redundant storage. 
- **Standard_ZRS** - Zone redundant storage.
- **Standard_GRS** - Geo redundant storage. 
- **Standard_RAGRS** - Read access geo redundant storage. 
- **Premium_LRS** - Premium locally redundant storage. 



## Upload the VM image to your storage account

Use the [Add-AzureRmVhd](https://msdn.microsoft.com/library/mt603554.aspx) cmdlet to upload the image to a container in your storage account:

```powershell
		$rgName = "<resourceGroupName>"
		$urlOfUploadedImageVhd = "https://<storageAccount>.blob.core.windows.net/<blobContainer>/<targetVHDName>.vhd"
		Add-AzureRmVhd -ResourceGroupName $rgName -Destination $urlOfUploadedImageVhd -LocalFilePath <localPathOfVHDFile.vhd>
```

Where:

- **storageAccount** is the name of the storage account for the image. 

- **blobContainer** is the blob container where you want to store your image. If an existing blob container with this name isn't found, it's created for you.

- **targetVHDName** is the name that you want to use for the uploaded VHD file.

- **localPathOfVHDFile** is the full path and name of the .vhd file on your local machine.


If successful, you get a response that looks similar to this:

	C:\> Add-AzureRmVhd -ResourceGroupName testUpldRG -Destination https://testupldstore2.blob.core.windows.net/testblobs/WinServer12.vhd -LocalFilePath "C:\temp\WinServer12.vhd"
	MD5 hash is being calculated for the file C:\temp\WinServer12.vhd.
	MD5 hash calculation is completed.
	Elapsed time for the operation: 00:03:35
	Creating new page blob of size 53687091712...
	Elapsed time for upload: 01:12:49

	LocalFilePath           DestinationUri
	-------------           --------------
	C:\temp\WinServer12.vhd https://testupldstore2.blob.core.windows.net/testblobs/WinServer12.vhd

This command may take a while to complete, depending on your network connection and the size of your VHD file.


## Next steps

- Create a VM from a generalized VHD
- [Create a VM from a specialized VHD](virtual-machines-windows-create-vm-specialized) by attaching it as an OS disk when you create a new VM.


