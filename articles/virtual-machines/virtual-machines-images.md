<properties
	pageTitle="About images for virtual machines"
	description="Learn about how images are used with virtual machines in Azure."
	services="virtual-machines"
	documentationCenter=""
	authors="KBDAzure"
	manager="timlt"
	editor="tysonn"
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/13/2015"
	ms.author="kathydav"/>

# About images for virtual machines

Images are used in Azure to provide a new virtual machine with an operating system. An image might also have one or more data disks. Images are available from several sources:

-	Azure offers images in the [Marketplace](http://azure.microsoft.com/gallery/virtual-machines/). You’ll find recent versions of Windows Server and distributions of the Linux operating system. Some images also contain applications, such as SQL Server. MSDN Benefit and MSDN Pay-as-You-Go subscribers have access to additional images.
-	The open source community offers images through [VM Depot](http://vmdepot.msopentech.com/List/Index).
-	You also can store and use your own images in Azure, by either capturing an existing Azure virtual machine for use as an image or uploading an image.

## About VM images and OS images

Two types of images can be used in Azure: *VM image* and *OS image*. A VM image includes an operating system and all disks attached to a virtual machine when the image is created. This is the newer type of image. Before VM images were introduced, an image in Azure could have only a generalized operating system and no additional disks. A VM image that contains only a generalized operating system is basically the same as the original type of image, the OS image.

You can create your own images, based on a virtual machine in Azure, or a virtual machine running elsewhere that you copy and upload. If you want to use an image to create more than one virtual machine, you’ll need to prepare it for use as an image by generalizing it. To create a Windows Server image, run the Sysprep command on the server to generalize it before you upload the .vhd file. For details about Sysprep, see [How to Use Sysprep: An Introduction](http://go.microsoft.com/fwlink/p/?LinkId=392030). To create a Linux image, depending on the software distribution, you’ll need to run a set of commands that are specific to the distribution, as well as run the Azure Linux Agent.

## Working with images

You can use the Azure Command-Line Interface (CLI) for Mac, Linux, and Windows or Azure PowerShell module to manage the images available to your Azure subscription. You also can use the Azure portal for some image tasks, but the command line gives you more options.

For information about using these tools with Resource Manager deployments, see [Navigating and Selecting Azure Virtual Machine images with PowerShell and the Azure CLI](resource-groups-vm-searching.md).

For examples of using the tools in a classic deployment:

- For CLI, see "Commands to manage your Azure virtual machine images" in [Using the Azure CLI for Mac, Linux, and Windows with Azure Service Management](virtual-machines-command-line-tools.md)
- For Azure PowerShell, see the following list of commands. For an example of finding an image to create a VM, see "Step 3: Determine the ImageFamily" in [Use Azure PowerShell to create and preconfigure Windows-based Virtual Machines](virtual-machines-ps-create-preconfigure-windows-vms.md)

-	**Get all images**:`Get-AzureVMImage`returns a list of all the images available in your current subscription: your images as well as those provided by Azure or partners. This means you might get a large list. The next examples show how to get a shorter list.
-	**Get image families**:`Get-AzureVMImage | select ImageFamily` gets a list of image families by showing strings **ImageFamily** property.
-	**Get all images in a specific family**: `Get-AzureVMImage | Where-Object {$_.ImageFamily -eq $family}`
-	**Find VM Images**: `Get-AzureVMImage | where {(gm –InputObject $_ -Name DataDiskConfigurations) -ne $null} | Select -Property Label, ImageName` this works by filtering the DataDiskConfiguration property, which only applies to VM Images. This example also filters the output to only the label and image name.
-	**Save a generalized image**: `Save-AzureVMImage –ServiceName "myServiceName" –Name "MyVMtoCapture" –OSState "Generalized" –ImageName "MyVmImage" –ImageLabel "This is my generalized image"`
-	**Save a specialized image**: `Save-AzureVMImage –ServiceName "mySvc2" –Name "MyVMToCapture2" –ImageName "myFirstVMImageSP" –OSState "Specialized" -Verbose`
>[Azure.Tip] The OSState parameter is required if you want to create a VM image, which includes data disks as well as the operating system disk. If you don’t use the parameter, the cmdlet creates an OS image. The value of the parameter indicates whether the image is generalized or specialized, based on whether the operating system disk has been prepared for reuse.
-	**Delete an image**: `Remove-AzureVMImage –ImageName "MyOldVmImage"`

## Additional resources

[Different Ways to Create a Linux Virtual Machine](virtual-machines-linux-choices-create-vm.md)

[Different ways to create a Windows virtual machine](virtual-machines-windows-choices-create-vm.md)
