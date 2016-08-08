<properties
	pageTitle="Create and upload a VM image using Powershell | Microsoft Azure"
	description="Learn to create and upload a generalized Windows Server image (VHD) using the classic deployment model and Azure Powershell."
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
	ms.date="07/21/2016"
	ms.author="cynthn"/>

# Create and upload a Windows Server VHD to Azure

This article shows you how to upload your own generalized VM image as a virtual hard disk (VHD) so you can use it to create virtual machines. For more details about disks and VHDs in Microsoft Azure, see [About Disks and VHDs for Virtual Machines](virtual-machines-linux-about-disks-vhds.md).


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

## Step 2: Create a storage account and a container

You need a storage account in Azure so you have a place to upload the .vhd file. This step shows you how to create an account, or get the info you need from an existing account. Replace the variables in &lsaquo; brackets &rsaquo; with your own information.

1. Login

		Add-AzureAccount

1. Set your Azure subscription.

    	Select-AzureSubscription -SubscriptionName <SubscriptionName> 

2. Create a new storage account. The name of the storage account should be unique, 3-24 characters. The name can be any combination of letters and numbers. You also need to specify a location like "East US"
    	
		New-AzureStorageAccount –StorageAccountName <StorageAccountName> -Location <Location>

3. Set the new storage account as the default.
    	
		Set-AzureSubscription -CurrentStorageAccountName <StorageAccountName> -SubscriptionName <SubscriptionName>

4. Create a new container.

    	New-AzureStorageContainer -Name <ContainerName> -Permission Off

 

## Step 3: Upload the .vhd file

Use the [Add-AzureVhd](http://msdn.microsoft.com/library/dn495173.aspx) to upload the VHD.

From the Azure PowerShell window you used in the previous step, type the following command and replace the variables in &lsaquo; brackets &rsaquo; with your own information.

		Add-AzureVhd -Destination "https://<StorageAccountName>.blob.core.windows.net/<ContainerName>/<vhdName>.vhd" -LocalFilePath <LocalPathtoVHDFile>


## Step 4: Add the image to your list of custom images

Use the [Add-AzureVMImage])(https://msdn.microsoft.com/library/mt589167.aspx) cmdlet to add the image to the list of your custom images.

		Add-AzureVMImage -ImageName <ImageName> -MediaLocation "https://<StorageAccountName>.blob.core.windows.net/<ContainerName>/<vhdName>.vhd" -OS "Windows"


## Next steps

You can now [create a custom VM](virtual-machines-windows-classic-createportal.md) using the image you uploaded.

