---
title: Azure virtual machine extensions and features | Microsoft Docs
description: Learn what Azure VM extensions anre how to use them with Azure virtual machines
services: virtual-machines-linux
documentationcenter: ''
author: roiyz-msft
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 03/30/2018
ms.author: roiyz
---

# Azure virtual machine extensions and features
Azure virtual machine (VM) extensions are small applications that provide post-deployment configuration and automation tasks on Azure VMs, you can use existing images and then customize them as part of your deployments, getting you out of the business of custom image building.

The Azure platform hosts many extensions that range from VM configuration, monitoring, security, and utility applications. Publishers take an application, then wrap it into an extension, and simplify the installation, so all you need to do is provide mandatory parameters. 

 There is a large choice of first and third party extensions, if the application in the extension repository does not exist, then you can use the Custom Script extension and configure your VM with your own scripts and commands.

Examples of key scenarios that extensions are used for:
* VM configuration, you can use Powershell DSC (Desired State Configuration), Chef, Puppet and Custom Script Extensions to install VM configuration agents and configure your VM. 
* AV products, such as Symantec, ESET.
* VM vulnerability tool, such as Qualys, Rapid7, HPE.
* VM and App monitoring tooling, such as DynaTrace, Azure Network Watcher, Site24x7, and Stackify.

Extensions can be bundled with a new VM deployment. For example, they can be part of a larger deployment, configuring applications on VM provision, or run against any supported extension operated systems post deployment.

## How can I find What extensions are available?
You can view available extensions in the VM blade in the Portal, under extensions, this represents just a small amount, for the full list, you can use the CLI tools, see [Discovering VM Extensions for Linux](features-linux.md) and [Discovering VM Extensions for Windows](features-windows.md).

## How can I install an extension?
Azure VM extensions can be managed using either the Azure CLI, Azure PowerShell, Azure Resource Manager templates, and the Azure portal. To try an extension, you can go to the Azure portal, select the Custom Script Extension, then pass in a command / script and run the extensions.

If you want to same extension you added in the portal by CLI or Resource Manager template, see different extension documentation, such as [Windows Custom Script Extension](custom-script-windows.md) and [Linux Custom Script Extension](custom-script-linux.md).

## How do I manage extension application lifecycle?
You do not need to connect to a VM directly to install or delete the extension. As the Azure extension application lifecycle is managed outside of the VM and integrated into the Azure platform, you also get integrated status of the extension.

## Anything else I should be thinking about for extensions?
Extensions install applications, like any applications there are some requirements, for extensions there is a list of supported Windows and Linux OSes, and you need to have the Azure VM agents installed. Some individual VM extension applications may have their own environmental prerequisites, such as access to an endpoint.

## Next steps
* For more information about how the Linux Agent and Extensions work, see [Azure VM extensions and features for Linux](features-linux.md).
* For more information about how the Windows Guest Agent and Extensions work, see [Azure VM extensions and features for Windows](features-windows.md).  
* To install the Windows Guest Agent, see [Azure Windows Virtual Machine Agent Overview ](agent-windows.md).  
* To install the Linux Agent, see [Azure Linux Virtual Machine Agent Overview ](agent-linux.md).  

