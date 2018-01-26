---
title: Using Visual Studio from an Azure Virtual Machine
description: Using Visual Studio from an Azure Virtual Machine
keywords: visualstudio
author: phillee
ms.author: phillee
manager: sacalla
ms.date: 01/18/2018
ms.topic: release-article
ms.prod: vs-devops-alm
ms.technology: vs-devops-articles
ms.assetid: bf8efb38-36ba-44d8-b1f8-ac09465a359c
hide_comments: true
hideEdit: true
---

## <a id="top"> </a> Visual Studio Images on Azure
Using Visual Studio running in a preconfigured Azure virtual machine (VM) is the easiest and fastest way to go from nothing to an up-and-running development environment.  System images with different Visual Studio configurations are available in the [Azure Marketplace](https://portal.azure.com/). Just boot a VM and off you go.

New to Azure? [Create a free Azure account](https://azure.microsoft.com/free).

### What configurations and versions are available?
In the Azure Marketplace you’ll find images for the most recent major versions:  Visual Studio 2017 and Visual Studio 2015.  For each major version, you’ll see the originally released (aka ‘RTW’) version, and the “latest” updated versions.  For each of these different versions, you’ll find the Visual Studio Enterprise and Visual Studio Community editions.

<table>
<col width="20%">
<col width="26%">
<col width="26%">
<col width="26%">
<tr align="center" valign="middle">
  <td>**Major version**</td>
  <td>**Minor Version**</td>
  <td>**Editions**</td>
  <td>**Product Version**</td>
</tr>
<tr align="center" valign="middle">
  <td rowspan="2"><font size="2">Visual Studio 2017</font></td>
  <td><font size="2">Latest</font></td>
  <td><font size="2">Enterprise, Community</font></td>
  <td><font size="2">Version 15.5.3</font></td>
</tr>
<tr align="center" valign="middle">
  <td><font size="2">RTW</font></td>
  <td><font size="2">Enterprise, Community</font></td>
  <td><font size="2">Version 15.0.7</font></td>
</tr>
<tr align="center" valign="middle">
  <td rowspan="2"><font size="2">Visual Studio 2015</font></td>
  <td><font size="2">Latest<br>(Visual Studio Update 3)</font></td>
  <td><font size="2">Enterprise, Community</font></td>
  <td><font size="2">Version 14.0.25431.01</font></td>
</tr>
<tr align="center" valign="middle">
  <td><font size="2">RTW</font></td>
  <td><font size="2">None<br>(Expired for servicing)</font></td>
  <td><font size="2"> --- </font></td>
</tr>
</table>

> [!NOTE]
> In accordance with Microsoft servicing policy, the originally released (aka ‘RTW’) version of Visual Studio 2015 has expired for servicing.  Therefore, Visual Studio 2015 Update 3 is the only remaining version offered for the Visual Studio 2015 product line.

For more information, see the [Visual Studio Servicing Policy](https://www.visualstudio.com/en-us/productinfo/vs-servicing-vs).

### What features are installed?
Each image contains the recommended feature set for that Visual Studio edition.  Generally, this includes:

* All available workloads including that workload’s recommended optional components
* .NET 4.6.2 and .NET 4.7 SDKs, Targeting Packs, and Developer Tools
* Visual F#
* GitHub Extension for Visual Studio
* LINQ to SQL Tools

This is the command line that we use to install Visual Studio when building the images:

   * vs_enterprise.exe --allWorkloads --includeRecommended --passive ^
   * add Microsoft.Net.Component.4.7.SDK ^
   * add Microsoft.Net.Component.4.7.TargetingPack ^ 
   * add Microsoft.Net.Component.4.6.2.SDK ^
   * add Microsoft.Net.Component.4.6.2.TargetingPack ^
   * add Microsoft.Net.ComponentGroup.4.7.DeveloperTools ^
   * add Microsoft.VisualStudio.Component.FSharp ^
   * add Component.GitHub.VisualStudio ^
   * add Microsoft.VisualStudio.Component.LinqToSql

If we haven’t included a Visual Studio feature you require, please give us that feedback through the feedback tool (top-right corner of the page).

### What size VM should I choose?
Provisioning a new virtual machine is easy, and Azure offers a full range of virtual machine sizes.  As with any hardware acquisition, you’ll want to balance performance versus cost.  Since Visual Studio is a powerful, multi-threaded application, you’ll want a VM size that includes at least two processors and 7GB of memory.  In Azure that translates to at least these VM sizes:

   * Standard_D2_v3
   * Standard_D2s_v3
   * Standard_D4_v3
   * Standard_D4s_v3
   * Standard_D2_v2
   * Standard_D2S_v2
   * Standard_D3_v2

For more information, see [Sizes for Windows virtual machines in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes).

Of course, with Azure you’re not stuck with your first pick – you can rebalance your initial choice by resizing the VM.  You can either provision a new VM with a more appropriate size, or you can resize your existing VM to different underlying hardware.  For more information, see [Resizing a Windows VM](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/resize-vm).

### After I get the VM running, then what?
Visual Studio follows the “bring you own license” model in Azure.  So, similarly to an installation on proprietary hardware, one of the first steps will be licensing your Visual Studio installation.  You can unlock Visual Studio by either signing in with a Microsoft account that’s associated with a Visual Studio subscription, or you can unlock Visual Studio with the product key with your initial purchase.  For more information, see [Signing in to Visual Studio](https://docs.microsoft.com/en-us/visualstudio/ide/signing-in-to-visual-studio) and [How to unlock Visual Studio](https://docs.microsoft.com/en-us/visualstudio/ide/how-to-unlock-visual-studio).

### After I build out the dev VM, how do I save (capture) it for future or team use?

The spectrum of development environments is huge, and there’s real cost associated with building out the more complex environments.  However, regardless of your environment’s configuration, Azure makes this easy for you to preserve that investment by saving/capturing your perfectly configured VM as a ‘base image’ for future use – for yourself and/or for other members of your team.  Then, when booting a new VM, provision it from the base image rather than the Marketplace image.

As a quick summary, you’ll need to sysprep and shutdown the running VM, then *capture (Figure 1)* the VM as an image through the Azure portal’s UI.  The `.vhd/.vhdx` file that contains the image will be saved in the storage account of your choosing.  Then, the new image shows up as an Image resource in your subscription’s list of resources.

<img src="media/using-visual-studio-vm/capture-vm.png" alt="Capture an image through the Azure portal’s UI" style="border:3px solid Silver; display: block; margin: auto;"><center>*(Figure 1) Capture an image through the Azure portal’s UI.*</center>

For more information, see [Capturing a VM to an image](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/capture-image-resource).

  **Reminder:**  Don’t forget to sysprep the VM!  The image won’t provision to a VM if you miss that step.

> [!NOTE] You’ll still incur some cost for storage of the image(s), but that incremental cost will likely be insignificant compared to the manpower costs to rebuild the VM from scratch – for each person on your team who needs a VM.  For instance, it costs about $3/month to store a 127GB image and a D2v3 VM costs about $1 for 8 hours of compute time.  However, these costs are insignificant compared to hours each employee will invest to build out and validate a properly configured dev box.

Additionally, you might need more scale – like varieties of development configurations and multiple machine configurations.  You can use Azure DevTest Labs to create _recipes_ that automate the construction of your ‘golden image,' and to manage policies for your team’s running VMs.  [Using Azure DevTest Labs for developers](https://docs.microsoft.com/en-us/azure/devtest-lab/devtest-lab-developer-lab) is the best source for more information on DevTest Labs.

<center>[Top of Page](#top)</center>