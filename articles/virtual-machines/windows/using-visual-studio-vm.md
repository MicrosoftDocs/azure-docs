---
title: Using Visual Studio on an Azure virtual machine 
description: Using Visual Studio on an Azure virtual machine.
author: cathysull
manager: cathys
ms.service: virtual-machines-windows
ms.custom: vs-azure
ms.workload: azure-vs
ms.topic: conceptual
ms.date: 04/23/2020
ms.author: cathys
keywords: visualstudio
---

# Visual Studio images on Azure
Using Visual Studio in a preconfigured Azure virtual machine (VM) is a quick, easy way to go from nothing to an up-and-running development environment. System images with different Visual Studio configurations are available in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/compute?filters=virtual-machine-images%3Bmicrosoft%3Bwindows&page=1&subcategories=application-infrastructure).

New to Azure? [Create a free Azure account](https://azure.microsoft.com/free).

> [!NOTE]
> Not all subscriptions are eligible to deploy Windows 10 images. For more information see [Use Windows client in Azure for dev/test scenarios](https://docs.microsoft.com/azure/virtual-machines/windows/client-images)

## What configurations and versions are available?
Images for the most recent major versions, Visual Studio 2019, Visual Studio 2017 and Visual Studio 2015, can be found in the Azure Marketplace.  For each released major version, you see the originally "released to web" (RTW) version and the latest updated versions.  Each of these versions offers the Visual Studio Enterprise and the Visual Studio Community editions.  These images are updated at least every month to include the latest Visual Studio and Windows updates.  While the names of the images remain the same, each image's description includes the installed product version and the image's "as of" date.

| Release version                                                                                                                                                | Editions              | Product version   |
|:--------------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------:|:-----------------:|
| [Visual Studio 2019: Latest (Version 16.5)](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftvisualstudio.visualstudio2019latest?tab=Overview) | Enterprise, Community | Version 16.5.4    |
| Visual Studio 2019: RTW                         | Enterprise | Version 16.0.13    |
| Visual Studio 2017: Latest (Version 15.9)           | Enterprise, Community | Version 15.9.22   |
| Visual Studio 2017: RTW                             | Enterprise, Community | Version 15.0.28  |
| Visual Studio 2015: Latest (Update 3)               | Enterprise, Community | Version 14.0.25431.01 |

> [!NOTE]
> In accordance with Microsoft servicing policy, the originally released (RTW) version of Visual Studio 2015 has expired for servicing. Visual Studio 2015 Update 3 is the only remaining version offered for the Visual Studio 2015 product line.

For more information, see the [Visual Studio Servicing Policy](https://www.visualstudio.com/productinfo/vs-servicing-vs).

## What features are installed?
Each image contains the recommended feature set for that Visual Studio edition. Generally, the installation includes:

* All available workloads, including each workload’s recommended optional components
* .NET 4.6.2 and .NET 4.7 SDKs, Targeting Packs, and Developer Tools
* Visual F#
* GitHub Extension for Visual Studio
* LINQ to SQL Tools

The command line used to install Visual Studio when building the images is as follows:

```
    vs_enterprise.exe --allWorkloads --includeRecommended --passive ^
       add Microsoft.Net.Component.4.7.SDK ^
       add Microsoft.Net.Component.4.7.TargetingPack ^ 
       add Microsoft.Net.Component.4.6.2.SDK ^
       add Microsoft.Net.Component.4.6.2.TargetingPack ^
       add Microsoft.Net.ComponentGroup.4.7.DeveloperTools ^
       add Microsoft.VisualStudio.Component.FSharp ^
       add Component.GitHub.VisualStudio ^
       add Microsoft.VisualStudio.Component.LinqToSql
```

If the images don't include a Visual Studio feature that you require, provide feedback through the feedback tool in the upper-right corner of the page.

## What size VM should I choose?
Azure offers a full range of virtual machine sizes. Because Visual Studio is a powerful, multi-threaded application, you want a VM size that includes at least two processors and 7 GB of memory. We recommend the following VM sizes for the Visual Studio images:

   * Standard_D2_v3
   * Standard_D2s_v3
   * Standard_D4_v3
   * Standard_D4s_v3
   * Standard_D2_v2
   * Standard_D2S_v2
   * Standard_D3_v2
    
For more information on the latest machine sizes, see [Sizes for Windows virtual machines in Azure](/azure/virtual-machines/windows/sizes).

With Azure, you can rebalance your initial choice by resizing the VM. You can either provision a new VM with a more appropriate size, or resize your existing VM to different underlying hardware. For more information, see [Resize a Windows VM](/azure/virtual-machines/windows/resize-vm).

## After the VM is running, what's next?
Visual Studio follows the “bring your own license” model in Azure. As with an installation on proprietary hardware, one of the first steps is licensing your Visual Studio installation. To unlock Visual Studio, either:
- Sign in with a Microsoft account that’s associated with a Visual Studio subscription 
- Unlock Visual Studio with the product key that came with your initial purchase

For more information, see [Sign in to Visual Studio](/visualstudio/ide/signing-in-to-visual-studio) and [How to unlock Visual Studio](/visualstudio/ide/how-to-unlock-visual-studio).

## How do I save the development VM for future or team use?

The spectrum of development environments is huge, and there’s real cost associated with building out the more complex environments. Regardless of your environment’s configuration, you can save, or capture, your configured VM as a "base image" for future use or for other members of your team. Then, when booting a new VM, you provision it from the base image rather than the Azure Marketplace image.

A quick summary: Use the System Preparation tool (Sysprep) and shut down the running VM, and then capture *(Figure 1)* the VM as an image through the UI in the Azure portal. Azure saves the `.vhd` file that contains the image in the storage account of your choosing. The new image then shows up as an Image resource in your subscription’s list of resources.

<img src="media/using-visual-studio-vm/capture-vm.png" alt="Capture an image through the Azure portal UI" style="border:3px solid Silver; display: block; margin: auto;"><center>*(Figure 1) Capture an image through the Azure portal UI.*</center>

For more information, see [Create a managed image of a generalized VM in Azure](/azure/virtual-machines/windows/capture-image-resource).

> [!IMPORTANT]
> Don’t forget to use Sysprep to prepare the VM. If you miss that step, Azure can't provision a VM from the image.

> [!NOTE]
> You still incur some cost for storage of the images, but that incremental cost can be insignificant compared to the overhead costs to rebuild the VM from scratch for each team member who needs one. For instance, it costs a few dollars to create and store a 127-GB image for a month that's reusable by your entire team. However, these costs are insignificant compared to hours each employee invests to build out and validate a properly configured dev box for their individual use.

Additionally, your development tasks or technologies might need more scale, like varieties of development configurations and multiple machine configurations. You can use Azure DevTest Labs to create _recipes_ that automate construction of your "golden image." You can also use DevTest Labs to manage policies for your team’s running VMs. [Using Azure DevTest Labs for developers](/azure/devtest-lab/devtest-lab-developer-lab) is the best source for more information on DevTest Labs.

## Next steps
Now that you know about the preconfigured Visual Studio images, the next step is to create a new VM:

* [Create a VM through the Azure portal](quick-create-portal.md)
* [Windows Virtual Machines overview](overview.md)
