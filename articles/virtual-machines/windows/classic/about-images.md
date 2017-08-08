---
title: About images for Windows virtual machines | Microsoft Docs
description: Learn about how images are used with Windows virtual machines in Azure.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: tysonn
tags: azure-service-management

ms.assetid: 66ff3fab-8e7f-4dff-b8da-ab1c9c9c9af8
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 03/20/2017
ms.author: cynthn

---
# About images for Windows virtual machines
> [!IMPORTANT]
> Azure has two different deployment models for creating and working with resources: [Resource Manager and Classic](../../../resource-manager-deployment-model.md). This article covers using the Classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model. For information about finding and using images in the Resource Manager model, see [here](../../virtual-machines-windows-cli-ps-findimage.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

[!INCLUDE [virtual-machines-common-classic-about-images](../../../../includes/virtual-machines-common-classic-about-images.md)]

## Working with images

You can use the Azure PowerShell module and the Azure portal to manage the images available to your Azure subscription. The Azure PowerShell module provides more command options, so you can pinpoint exactly what you want to see or do. The Azure portal provides a GUI for many of the everyday administrative tasks.

Here are some examples that use the Azure PowerShell module.

* **Get all images**:`Get-AzureVMImage`returns a list of all the images available in your current subscription: your images and those provided by Azure or partners. The resulting list could be large. The next examples show how to get a shorter list.
* **Get image families**:`Get-AzureVMImage | select ImageFamily` gets a list of image families by showing strings **ImageFamily** property.
* **Get all images in a specific family**: `Get-AzureVMImage | Where-Object {$_.ImageFamily -eq $family}`
* **Find VM Images**: `Get-AzureVMImage | where {(gm –InputObject $_ -Name DataDiskConfigurations) -ne $null} | Select -Property Label, ImageName` This cmdlet works by filtering the DataDiskConfiguration property, which only applies to VM Images. This example also filters the output to only the label and image name.
* **Save a generalized image**: `Save-AzureVMImage –ServiceName "myServiceName" –Name "MyVMtoCapture" –OSState "Generalized" –ImageName "MyVmImage" –ImageLabel "This is my generalized image"`
* **Save a specialized image**: `Save-AzureVMImage –ServiceName "mySvc2" –Name "MyVMToCapture2" –ImageName "myFirstVMImageSP" –OSState "Specialized" -Verbose`

  > [!TIP]
  > The OSState parameter is required to create a VM image, which includes the operating system disk and attached data disks. If you don’t use the parameter, the cmdlet creates an OS image. The value of the parameter indicates whether the image is generalized or specialized, based on whether the operating system disk has been prepared for reuse.

* **Delete an image**: `Remove-AzureVMImage –ImageName "MyOldVmImage"`

## Next Steps
You can also [create a Windows machine using the Azure portal](tutorial.md).
