<properties
	pageTitle="About images for Windows virtual machines | Microsoft Azure"
	description="Learn about how images are used with Windows virtual machines in Azure."
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

# About images for Windows virtual machines

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)]

[AZURE.INCLUDE [virtual-machines-common-classic-about-images](../../includes/virtual-machines-common-classic-about-images.md)]



## Working with images

You can use the Azure PowerShell module to manage the images available to your Azure subscription. You also can use the Azure classic portal for some image tasks, but the command line gives you more options.


-	**Get all images**:`Get-AzureVMImage`returns a list of all the images available in your current subscription: your images as well as those provided by Azure or partners. This means you might get a large list. The next examples show how to get a shorter list.
-	**Get image families**:`Get-AzureVMImage | select ImageFamily` gets a list of image families by showing strings **ImageFamily** property.
-	**Get all images in a specific family**: `Get-AzureVMImage | Where-Object {$_.ImageFamily -eq $family}`
-	**Find VM Images**: `Get-AzureVMImage | where {(gm –InputObject $_ -Name DataDiskConfigurations) -ne $null} | Select -Property Label, ImageName` this works by filtering the DataDiskConfiguration property, which only applies to VM Images. This example also filters the output to only the label and image name.
-	**Save a generalized image**: `Save-AzureVMImage –ServiceName "myServiceName" –Name "MyVMtoCapture" –OSState "Generalized" –ImageName "MyVmImage" –ImageLabel "This is my generalized image"`
-	**Save a specialized image**: `Save-AzureVMImage –ServiceName "mySvc2" –Name "MyVMToCapture2" –ImageName "myFirstVMImageSP" –OSState "Specialized" -Verbose`
>[Azure.Tip] The OSState parameter is required if you want to create a VM image, which includes data disks as well as the operating system disk. If you don’t use the parameter, the cmdlet creates an OS image. The value of the parameter indicates whether the image is generalized or specialized, based on whether the operating system disk has been prepared for reuse.
-	**Delete an image**: `Remove-AzureVMImage –ImageName "MyOldVmImage"`


## Next Steps

You can also [create a Windows machine using the classic portal](virtual-machines-windows-classic-tutorial.md)

