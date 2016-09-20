<properties
	pageTitle="Upload a Windows VHD for Resource Manager | Microsoft Azure"
	description="Learn to upload a Windows virtual machine image to use with the Resource Manager deployment model."
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
	ms.date="09/19/2016"
	ms.author="cynthn"/>

# Upload a Windows VM image to Azure for Resource Manager deployments


This article shows you how to create and upload a Windows virtual hard disk (VHD) as an image or attach it as the OS disk so you can quickly create VMs. For more details about disks and VHDs in Azure, see [About disks and VHDs for virtual machines](virtual-machines-linux-about-disks-vhds.md).


## Prerequisites

This article assumes that you have:

- **An Azure subscription** - If you don't already have one, [open an Azure account for free](/pricing/free-trial/?WT.mc_id=A261C142F), or [activate MSDN subscriber benefits](/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F).

- **Azure PowerShell version 1.4 or above** - If you don't already have it installed, read [How to install and configure Azure PowerShell](../powershell-install-configure.md).

- **A virtual machine running Windows** - There are many tools for creating virtual machines on-premises. For example, see [Install the Hyper-V Role and configure a virtual machine](http://technet.microsoft.com/library/hh846766.aspx). For information about which Windows operating systems are supported on Azure, see [Microsoft server software support for Microsoft Azure virtual machines](https://support.microsoft.com/kb/2721672). For Linux virtual machines see [Creating and Uploading a Virtual Hard Disk that Contains the Linux Operating System](../virtual-machines/virtual-machines-linux-classic-create-upload-vhd.md) for similar instructions.

- Make sure the server roles running on the VM support sysprep. For more information, see [Sysprep Support for Server Roles](https://msdn.microsoft.com/windows/hardware/commercialize/manufacture/desktop/sysprep-support-for-server-roles).


## Make sure that the VM is in the right file format

In Azure, you can only use [generation 1 virtual machines](http://blogs.technet.com/b/ausoemteam/archive/2015/04/21/deciding-when-to-use-generation-1-or-generation-2-virtual-machines-with-hyper-v.aspx) that are in the VHD file format. The VHD must be a fixed size and be a whole number of megabytes, that is, a number divisible by 8. The maximum size allowed for the VHD is 1,023 GB.

- If you have a Windows VM image in VHDX format, convert it to a VHD using either of the following:

	- Hyper-V: Open Hyper-V and select your local computer on the left. Then in the menu above it, click **Action** > **Edit Disk...**. Navigate through the screens by clicking **Next** and entering these options: *Path for your VHDX file* > **Convert** > **VHD** > **Fixed size** > *Path for the new VHD file*. Click **Finish** to close.

	- [Convert-VHD PowerShell cmdlet](http://technet.microsoft.com/library/hh848454.aspx): Read the blog post [Converting Hyper-V .vhdx to .vhd file formats](https://blogs.technet.microsoft.com/cbernier/2013/08/29/converting-hyper-v-vhdx-to-vhd-file-formats-for-use-in-windows-azure/) for more information.

- If you have a Windows VM image in the [VMDK file format](https://en.wikipedia.org/wiki/VMDK), convert it to a VHD by using the [Microsoft Virtual Machine Converter](https://www.microsoft.com/download/details.aspx?id=42497). Read the blog [How to Convert a VMware VMDK to Hyper-V VHD](http://blogs.msdn.com/b/timomta/archive/2015/06/11/how-to-convert-a-vmware-vmdk-to-hyper-v-vhd.aspx) for more information.


## Prepare the VM for uploading

You can upload both generalized and specialized VHDs to Azure. 

- **Generalized VHD** - a generalized image has had all of your personal account information removed using Sysprep. If you intend to use the VHD as an image to create new VMs from, you should generalize the VHD by following the instructions in [Prepare a Windows VHD to upload to Azure](virtual-machines-windows-prepare-for-upload-vhd-image.md) and then [Generalize a Windows virtual machine using Sysprep](virtual-machines-windows-generalize-vhd.md). 
 - **Specialized VHD** - a specialized VHD maintains the user accounts, applications and other state data from your original VM. If you intend to use the VHD as-is to create a new VM, ensure the following steps are completed. 
	- Remove any guest tools agents that are installed on the VM (i.e. VMware tools).
	- Ensure the VM is configured to pull its IP address and DNS settings via DHCP. This ensures that the server obtains an IP address within the VNet when it starts up. 

## Log in to Azure

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

1. Make sure that you have a resource group for this storage account. Find out all the resource groups that are in your subscription by using:

```powershell
		Get-AzureRmResourceGroup
```

2. To create a resource group, use this command:

```powershell
		New-AzureRmResourceGroup -Name <resourceGroupName> -Location <location>
```

3. Create a storage account in this resource group by using the [New-AzureRmStorageAccount](https://msdn.microsoft.com/library/mt607148.aspx) cmdlet:

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
		$urlOfUploadedImageVhd = "<storageAccount>/<blobContainer>/<targetVHDName>.vhd"
		Add-AzureRmVhd -ResourceGroupName $rgName -Destination $urlOfUploadedImageVhd -LocalFilePath <localPathOfVHDFile>
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
- Create a VM from a specialized VHD


