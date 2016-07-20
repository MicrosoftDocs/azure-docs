<properties
	pageTitle="Create and upload a Windows Server VHD using Powershell | Microsoft Azure"
	description="Learn to create and upload a Windows Server based virtual hard disk (VHD) using the classic deployment model and Azure Powershell."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor="tysonn"
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/15/2016"
	ms.author="cynthn"/>

# Create and upload a Windows Server VHD to Azure

This article shows you how to upload a virtual hard disk (VHD) with an operating system so you can use it as an image to create virtual machines based on that image. For more details about disks and VHDs in Microsoft Azure, see [About Disks and VHDs for Virtual Machines](virtual-machines-linux-about-disks-vhds.md).


[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)]. You can also [capture](virtual-machines-windows-capture-image.md) and [upload](virtual-machines-windows-upload-image.md) a virtual machine using the Resource Manager model. 

## Prerequisites

This article assumes you have:

1. **An Azure subscription** - If you don't have one, you can [open an Azure account for free](/pricing/free-trial/?WT.mc_id=A261C142F).

2. **[Microsoft Azure PowerShell](../powershell-install-configure.md)** - You have the Microsoft Azure PowerShell module installed and configured to use your subscription. 

3. **A .VHD file** - supported Windows operating system stored in a .vhd file and attached to a virtual machine.

> [AZURE.IMPORTANT] The VHDX format is not supported in Microsoft Azure. You can convert the disk to VHD format using Hyper-V Manager or the [Convert-VHD cmdlet](http://technet.microsoft.com/library/hh848454.aspx). For details, see this [blogpost](http://blogs.msdn.com/b/virtual_pc_guy/archive/2012/10/03/using-powershell-to-convert-a-vhd-to-a-vhdx.aspx).

## Step 1: Prep the VHD 

Before you upload the VHD to Azure, it needs to be generalized by using the Sysprep tool. This prepares the VHD to be used as an image. For details about Sysprep, see [How to Use Sysprep: An Introduction](http://technet.microsoft.com/library/bb457073.aspx).

From the virtual machine that the operating system was installed to, complete the following procedure:

1. Sign in to the operating system.

2. Open a command prompt window as an administrator. Change the directory to **%windir%\system32\sysprep**, and then run `sysprep.exe`.

	![Open a Command Prompt window](./media/virtual-machines-windows-classic-createupload-vhd/sysprep_commandprompt.png)

3.	The **System Preparation Tool** dialog box appears.

	![Start Sysprep](./media/virtual-machines-windows-classic-createupload-vhd/sysprepgeneral.png)

4.  In the **System Preparation Tool**, select **Enter System Out of Box Experience (OOBE)** and make sure that **Generalize** is checked.

5.  In **Shutdown Options**, select **Shutdown**.

6.  Click **OK**.

## Step 2: Create or get info from your Azure storage account

You need a storage account in Azure so you have a place to upload the .vhd file. This step shows you how to create an account, or get the info you need from an existing account. Replace the variables in &lsaquo; brackets &rsaquo; with your own information.

### Option 1: Create a storage account

Use PowerShell to create a storage account and a container for your VHD. 

Set your Azure subscription.

    	Select-AzureSubscription -SubscriptionName <SubscriptionName> –Default

Create a new storage account. You need to specify a location like "West US"
    	
		New-AzureStorageAccount –StorageAccountName <StorageAccountName> -Location <Location

Set the new storage account as the default.
    	
		Set-AzureSubscription -CurrentStorageAccountName <StorageAccountName> -SubscriptionName <SubscriptionName>

Create a new container.

    	New-AzureStorageContainer -Name <ContainerName> -Permission Off

 

## Step 4: Upload the .vhd file

When you upload the .vhd file, you can place the .vhd file anywhere within your blob storage.

1. From the Azure PowerShell window you used in the previous step, type a command similar to this:

	`Add-AzureVhd -Destination "<BlobStorageURL>/<YourImagesFolder>/<VHDName>.vhd" -LocalFilePath <PathToVHDFile>`

	Where:
	- **BlobStorageURL** is the URL for the storage account
	- **YourImagesFolder** is the container within blob storage where you want to store your images
	- **VHDName** is the name you want the Azure classic portal to display to identify the virtual hard disk
	- **PathToVHDFile** is the full path and name of the .vhd file

	![PowerShell Add-AzureVHD](./media/virtual-machines-windows-classic-createupload-vhd/powershell_upload_vhd.png)

For more information about the Add-AzureVhd cmdlet, see [Add-AzureVhd](http://msdn.microsoft.com/library/dn495173.aspx).

## Step 5: Add the image to your list of custom images

Use Azure PowerShell to add the image, use the **Add-AzureVMImage** cmdlet.

	Add-AzureVMImage -ImageName <ImageName> -MediaLocation <VHDLocation> -OS <OSType>



[Step 1: Prepare the image to be uploaded]: #prepimage
[Step 2: Create a storage account in Azure]: #createstorage
[Step 3: Prepare the connection to Azure]: #prepAzure
[Step 4: Upload the .vhd file]: #upload
