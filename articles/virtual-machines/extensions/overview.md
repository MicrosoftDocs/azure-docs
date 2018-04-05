---
title: Azure virtual machine extensions and features | Microsoft Docs
description: Learn what Azure VM extensions anre how to use them with Azure virtual machines
services: virtual-machines-linux
documentationcenter: ''
author: danielsollondon
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
ms.author: danis
---

# Azure virtual machine extensions and features
Azure virtual machine (VM) extensions are small applications that provide post-deployment configuration and automation tasks on Azure VMs. You can use existing images and then customize them as part of your deployments, getting you out of the business of image publishing.

The Azure platform hosts many extensions that range from VM configuration, monitoring, security, and utility applications. If the application in the extension repository does not exist, then you can use the Custom Script extension and configure your VM with your own scripts and commands.

Azure VM extensions can be managed using either the Azure CLI 2.0, Azure PowerShell, Azure Resource Manager templates, and the Azure portal. You do not need to connect to a VM directly to install or delete the extension. As the Azure extension application lifecycle is managed outside of the VM and integrated into the Azure platform, you also get integrated status of the extension.

Extensions can be bundled with a new VM deployment. For example, they can be part of a larger deployment, configuring applications on VM provision, or run against any supported extension operated systems post deployment.

In order to use extensions on Windows and Linux OSes, you need to have the Azure VM agents installed. Individual VM extension applications may have their own environmental prerequisites.

This article provides an overview of VM extensions, prerequisites for using Azure VM extensions, and guidance on how to detect, manage, and remove VM extensions. This article provides generalized information because many VM extensions are available, each with a potentially unique configuration. Extension-specific details can be found in each document specific to the individual extension.

## Next steps
* For more information about how the Linux Agent and Extensions work, see [Azure VM extensions and features for Linux](features-linux.md).
* For more information about how the Windows Guest Agent and Extensions work, see [Azure VM extensions and features for Linux](features-windows.md).  
* To install the Windows Guest Agent, see [Azure Windows Virtual Machine Agent Overview ](agent-windows.md).  
* To install the Linux Agent, see [Azure Linux Virtual Machine Agent Overview ](agent-linux.md).  

