--- 
title: Using Visual Studio on an Azure Virtual Machine | Microsoft Docs
description: Using Visual Studio on an Azure Virtual Machine.
services: virtual-machines-windows
documentationcenter: virtual-machines
author: "PhilLee-MSFT"
manager: sacalla
editor: tysonn
tags: azure-resource-manager

ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.prod: vs-devops-alm 
ms.date: 01/30/2018
ms.author: phillee
keywords: visualstudio 
---

# <a id="top"> </a> Visual Studio images on Azure
Using Visual Studio running in a preconfigured Azure virtual machine (VM) is the easiest and fastest way to go from nothing to an up-and-running development environment.  System images with different Visual Studio configurations are available in the [Azure Marketplace](https://portal.azure.com/). Just boot a VM and off you go.

New to Azure? [Create a free Azure account](https://azure.microsoft.com/free).

## What configurations and versions are available?
In the Azure Marketplace, you find images for the most recent major versions:  Visual Studio 2017 and Visual Studio 2015.  For each major version, you see the originally released (aka ‘RTW’) version, and the “latest” updated versions.  For each of these different versions, you find the Visual Studio Enterprise and Visual Studio Community editions.  We update these images at least every month to include the latest Visual Studio and Windows updates.  While the names of the images remain the same, each image's desription includes the installed product version and the image's 'as of' date.

|               Release version              |          Editions            |     Product Version     |
|:------------------------------------------:|:----------------------------:|:-----------------------:|
| Visual Studio 2017 - Latest (version 15.5) |    Enterprise, Community     |      Version 15.5.3     |
|         Visual Studio 2017 - RTW           |    Enterprise, Community     |      Version 15.0.7     |
|   Visual Studio 2015 - Latest (Update 3)   |    Enterprise, Community     |  Version 14.0.25431.01  |
|         Visual Studio 2015 - RTW           |              None            | (Expired for servicing) |

> [!NOTE]
> In accordance with Microsoft servicing policy, the originally released (aka ‘RTW’) version of Visual Studio 2015 has expired for servicing.  Therefore, Visual Studio 2015 Update 3 is the only remaining version offered for the Visual Studio 2015 product line.

For more information, see the [Visual Studio Servicing Policy](https://www.visualstudio.com/en-us/productinfo/vs-servicing-vs).

## What features are installed?
Each image contains the recommended feature set for that Visual Studio edition.  Generally, the installation includes:

* All available workloads including that workload’s recommended optional components
* .NET 4.6.2 and .NET 4.7 SDKs, Targeting Packs, and Developer Tools
* Visual F#
* GitHub Extension for Visual Studio
* LINQ to SQL Tools

This is the command line that we use to install Visual Studio when building the images:

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

If the images don't include a Visual Studio feature you require, provide that feedback through the feedback tool (top-right corner of the page).

## What size VM should I choose?
Provisioning a new virtual machine is easy, and Azure offers a full range of virtual machine sizes.  As with any hardware acquisition, you want to balance performance versus cost.  Since Visual Studio is a powerful, multi-threaded application, you want a VM size that includes at least 2 processors and 7 GB of memory.  These are the recommended VM sizes for the Visual Studio images:

   * Standard_D2_v3
   * Standard_D2s_v3
   * Standard_D4_v3
   * Standard_D4s_v3
   * Standard_D2_v2
   * Standard_D2S_v2
   * Standard_D3_v2
    
For more information on the latest machine sizes, see [Sizes for Windows virtual machines in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes).

With Azure, you’re not stuck with your first pick – you can rebalance your initial choice by resizing the VM.  You can either provision a new VM with a more appropriate size, or you can resize your existing VM to different underlying hardware.  For more information, see [Resizing a Windows VM](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/resize-vm).

## After I get the VM running, then what?
Visual Studio follows the “bring you own license” model in Azure.  So, similarly to an installation on proprietary hardware, one of the first steps is licensing your Visual Studio installation.  You can unlock Visual Studio by either signing in with a Microsoft account that’s associated with a Visual Studio subscription, or you can unlock Visual Studio with the product key with your initial purchase.  For more information, see [Signing in to Visual Studio](https://docs.microsoft.com/en-us/visualstudio/ide/signing-in-to-visual-studio) and [How to unlock Visual Studio](https://docs.microsoft.com/en-us/visualstudio/ide/how-to-unlock-visual-studio).

## After I build out the dev VM, how do I save (capture) it for future or team use?

The spectrum of development environments is huge, and there’s real cost associated with building out the more complex environments.  However, regardless of your environment’s configuration, Azure makes preserving that investment easy by saving/capturing your perfectly configured VM as a ‘base image’ for future use – for yourself and/or for other members of your team.  Then, when booting a new VM, provision it from the base image rather than the Marketplace image.

As a quick summary, you’ll need to sysprep and shutdown the running VM, then *capture (Figure 1)* the VM as an image through the Azure portal’s UI.  Azure saves the `.vhd` file that contains the image in the storage account of your choosing.  Then, the new image shows up as an Image resource in your subscription’s list of resources.

<img src="media/using-visual-studio-vm/capture-vm.png" alt="Capture an image through the Azure portal’s UI" style="border:3px solid Silver; display: block; margin: auto;"><center>*(Figure 1) Capture an image through the Azure portal’s UI.*</center>

For more information, see [Capturing a VM to an image](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/capture-image-resource).

  **Reminder:**  Don’t forget to sysprep the VM!  If you miss that step, Azure can't provision a VM from the image.

> [!NOTE]
> You still incur some cost for storage of the image(s), but that incremental cost is likely insignificant compared to the manpower costs to rebuild the VM from scratch – for each person on your team who needs a VM.  For instance, it costs a few dollars to create and store a 127-GB image for a month that's reusable by all members of your team.  However, these costs are insignificant compared to hours each employee invests to build out and validate a properly configured dev box for thier individual use.

Additionally, your development tasks or technologies might need more scale – like varieties of development configurations and multiple machine configurations.  You can use Azure DevTest Labs to create _recipes_ that automate the construction of your ‘golden image,' and to manage policies for your team’s running VMs.  [Using Azure DevTest Labs for developers](https://docs.microsoft.com/en-us/azure/devtest-lab/devtest-lab-developer-lab) is the best source for more information on DevTest Labs.

## Next steps
Now that you know about the pre-configured Visual Studio images, the next step is to create a new VM:

* [Create a VM through the Azure portal](quick-create-portal.md)
* [Windows Virtual Machines overview](overview.md)
