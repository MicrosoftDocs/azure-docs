---
title: Azure virtual machine extensions and features 
description: Learn what Azure VM extensions are and how to use them with Azure virtual machines
services: virtual-machines-linux
documentationcenter: ''
author: axayjo
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-linux
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 09/12/2019
ms.author: akjosh
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

## Troubleshoot extensions

Troubleshooting information for each extension can be found in the **Troubleshoot and support** section in the overview for the extension. Here is a list of the troubleshooting information available:

| Namespace | Troubleshooting |
|-----------|-----------------|
| microsoft.azure.monitoring.dependencyagent.dependencyagentlinux | [Azure Monitor Dependency for Linux](agent-dependency-linux.md#troubleshoot-and-support) |
| microsoft.azure.monitoring.dependencyagent.dependencyagentwindows | [Azure Monitor Dependency for Windows](agent-dependency-windows.md#troubleshoot-and-support) |
| microsoft.azure.security.azurediskencryptionforlinux | [Azure Disk Encryption for Linux](azure-disk-enc-linux.md#troubleshoot-and-support) |
| microsoft.azure.security.azurediskencryption | [Azure Disk Encryption for Windows](azure-disk-enc-windows.md#troubleshoot-and-support) |
| microsoft.compute.customscriptextension | [Custom Script for Windows](custom-script-windows.md#troubleshoot-and-support) |
| microsoft.ostcextensions.customscriptforlinux | [Desired State Configuration for Linux](dsc-linux.md#troubleshoot-and-support) |
| microsoft.powershell.dsc | [Desired State Configuration for Windows](dsc-windows.md#troubleshoot-and-support) |
| microsoft.hpccompute.nvidiagpudriverlinux | [NVIDIA GPU Driver Extension for Linux](hpccompute-gpu-linux.md#troubleshoot-and-support) |
| microsoft.hpccompute.nvidiagpudriverwindows | [NVIDIA GPU Driver Extension for Windows](hpccompute-gpu-windows.md#troubleshoot-and-support) |
| microsoft.azure.security.iaasantimalware | [Antimalware Extension for Windows](iaas-antimalware-windows.md#troubleshoot-and-support) |
| microsoft.enterprisecloud.monitoring.omsagentforlinux | [Azure Monitor for Linux](oms-linux.md#troubleshoot-and-support)
| microsoft.enterprisecloud.monitoring.microsoftmonitoringagent | [Azure Monitor for Windows](oms-windows.md#troubleshoot-and-support) |
| stackify.linuxagent.extension.stackifylinuxagentextension | [Stackify Retrace for Linux](stackify-retrace-linux.md#troubleshoot-and-support) |
| vmaccessforlinux.microsoft.ostcextensions | [Reset password (VMAccess) for Linux](vmaccess.md#troubleshoot-and-support) |
| microsoft.recoveryservices.vmsnapshot | [Snapshot for Linux](vmsnapshot-linux.md#troubleshoot-and-support) |
| microsoft.recoveryservices.vmsnapshot | [Snapshot for Windows](vmsnapshot-windows.md#troubleshoot-and-support) |


## Next steps
* For more information about how the Linux Agent and Extensions work, see [Azure VM extensions and features for Linux](features-linux.md).
* For more information about how the Windows Guest Agent and Extensions work, see [Azure VM extensions and features for Windows](features-windows.md).  
* To install the Windows Guest Agent, see [Azure Windows Virtual Machine Agent Overview](agent-windows.md).  
* To install the Linux Agent, see [Azure Linux Virtual Machine Agent Overview](agent-linux.md).  

