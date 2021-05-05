---
title: Azure virtual machine extensions and features 
description: Learn more about Azure VM extensions
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
author: amjads1
ms.author: amjads
ms.date: 08/03/2020

---

# Azure virtual machine extensions and features
Extensions are small applications that provide post-deployment configuration and automation on Azure VMs. The Azure platform hosts many extensions covering VM configuration, monitoring, security, and utility applications. Publishers take an application, wrap it into an extension, and simplify the installation. All you need to do is provide mandatory parameters. 

## How can I find what extensions are available?
You can view available extensions by selecting a VM, the selecting **Extensions** in the left menu. To pull a full list of extensions, see [Discovering VM Extensions for Linux](features-linux.md) and [Discovering VM Extensions for Windows](features-windows.md).

## How can I install an extension?
Azure VM extensions can be managed using the Azure CLI, PowerShell, Resource Manager templates, and the Azure portal. To try an extension, go to the Azure portal, select the Custom Script Extension, then pass in a command or script to run the extension.

For more information, see [Windows Custom Script Extension](custom-script-windows.md) and [Linux Custom Script Extension](custom-script-linux.md).

## How do I manage extension application lifecycle?
You do not need to connect to a VM directly to install or delete an extension. The Azure extension lifecycle is managed outside of the VM and integrated into the Azure platform.

## Anything else I should be thinking about for extensions?
Some individual VM extension applications may have their own environmental prerequisites, such as access to an endpoint. Each extension has an article that explains any pre-requisites, including which operating systems are supported.

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
| vmaccessforlinux.microsoft.ostcextensions | [Reset password for Linux](vmaccess.md#troubleshoot-and-support) |
| microsoft.recoveryservices.vmsnapshot | [Snapshot for Linux](vmsnapshot-linux.md#troubleshoot-and-support) |
| microsoft.recoveryservices.vmsnapshot | [Snapshot for Windows](vmsnapshot-windows.md#troubleshoot-and-support) |


## Next steps
* For more information about how the Linux Agent and extensions work, see [Azure VM extensions and features for Linux](features-linux.md).
* For more information about how the Windows Guest Agent and extensions work, see [Azure VM extensions and features for Windows](features-windows.md).  
* To install the Windows Guest Agent, see [Azure Windows Virtual Machine Agent Overview](agent-windows.md).  
* To install the Linux Agent, see [Azure Linux Virtual Machine Agent Overview](agent-linux.md).  

