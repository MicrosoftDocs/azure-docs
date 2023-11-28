---
title: Azure virtual machine extensions and features 
description: Learn more about Azure VM extensions that provide post-deployment configuration and automation on Azure VMs.
ms.topic: overview
ms.service: virtual-machines
ms.subservice: extensions
ms.author: gabsta
author: GabstaMSFT
ms.reviewer: erd
ms.date: 03/30/2023

---

# Azure virtual machine extensions and features

Extensions are small applications that provide post-deployment configuration and automation on Azure virtual machines (VMs). The Azure platform hosts many extensions covering VM configuration, monitoring, security, and utility applications. Publishers take an application, wrap it into an extension, and simplify the installation. All you need to do is provide mandatory parameters.

## View available extensions

You can view available extensions for a VM in the Azure portal.

1. In the portal, go to the **Overview** page for a VM.
1. Under **Settings**, select **Extensions + Applications**.

The list of available extensions are displayed. To see the complete list of extensions, see [Discovering VM Extensions for Linux](features-linux.md) and [Discovering VM Extensions for Windows](features-windows.md).

## Install and use extensions

Azure VM extensions can be managed by using the Azure CLI, PowerShell, Azure Resource Manager (ARM) templates, and the Azure portal.

1. From the **Extensions + Applications** for the VM, on the **Extensions** tab, select **+ Add**.
1. Locate the **Custom Script Extension** option. Select the extension option, then select **Next**.

You can then pass in a command or script to run the extension.

For more information, see [Linux Custom Script Extension](custom-script-linux.md) and [Windows Custom Script Extension](custom-script-windows.md).

### Check for prerequisites

Some individual VM extension applications might have their own environmental prerequisites, such as access to an endpoint. Each extension has an article that explains any prerequisites, including which operating systems are supported.

### Manage extension application lifecycle

You don't need to connect to a VM directly to install or delete an extension. The Azure extension lifecycle is managed outside of the VM and integrated into the Azure platform.

## Troubleshoot extensions

If you're looking for general troubleshooting steps for Windows VM extensions, refer to [Troubleshooting Azure Windows VM extension failures
](troubleshoot.md).

Otherwise, specific troubleshooting information for each extension can be found in the **Troubleshoot and support** section in the overview for the extension. Here's a list of the troubleshooting information available:

| Namespace | Troubleshooting |
|-----------|-----------------|
| microsoft.azure.monitoring.dependencyagent.dependencyagentlinux | [Azure Monitor Dependency for Linux](agent-dependency-linux.md#troubleshoot-and-support) |
| microsoft.azure.monitoring.dependencyagent.dependencyagentwindows | [Azure Monitor Dependency for Windows](agent-dependency-windows.md#troubleshoot-and-support) |
| microsoft.azure.security.azurediskencryptionforlinux | [Azure Disk Encryption for Linux](azure-disk-enc-linux.md#troubleshoot-and-support) |
| microsoft.azure.security.azurediskencryption | [Azure Disk Encryption for Windows](azure-disk-enc-windows.md#troubleshoot-and-support) |
| microsoft.compute.customscriptextension | [Custom Script for Windows](custom-script-windows.md#troubleshoot-and-support) |
| microsoft.ostcextensions.customscriptforlinux |
| microsoft.powershell.dsc | [Desired State Configuration for Windows](dsc-windows.md#troubleshoot-and-support) |
| microsoft.hpccompute.nvidiagpudriverlinux | [NVIDIA GPU Driver Extension for Linux](hpccompute-gpu-linux.md#troubleshoot-and-support) |
| microsoft.hpccompute.nvidiagpudriverwindows | [NVIDIA GPU Driver Extension for Windows](hpccompute-gpu-windows.md#troubleshoot-and-support) |
| microsoft.azure.security.iaasantimalware | [Antimalware Extension for Windows](iaas-antimalware-windows.md#troubleshoot-and-support) |
| microsoft.enterprisecloud.monitoring.omsagentforlinux | [Azure Monitor for Linux](oms-linux.md#troubleshoot-and-support)
| microsoft.enterprisecloud.monitoring.microsoftmonitoringagent | [Azure Monitor for Windows](oms-windows.md#troubleshoot-and-support) |
| stackify.linuxagent.extension.stackifylinuxagentextension | [Stackify Retrace for Linux](stackify-retrace-linux.md#troubleshoot-and-support) |
| vmaccessforlinux.microsoft.ostcextensions | [VMAccess for Linux](vmaccess-linux.md#troubleshoot-and-support) |
| microsoft.recoveryservices.vmsnapshot | [Snapshot for Linux](vmsnapshot-linux.md#troubleshoot-and-support) |
| microsoft.recoveryservices.vmsnapshot | [Snapshot for Windows](vmsnapshot-windows.md#troubleshoot-and-support) |

## Next steps

* For more information about how the Linux Agent and extensions work, see [Azure VM extensions and features for Linux](features-linux.md).
* For more information about how the Windows Guest Agent and extensions work, see [Azure VM extensions and features for Windows](features-windows.md).
* To install the Linux Agent, see [Azure Linux Virtual Machine Agent overview](agent-linux.md).
* To install the Windows Guest Agent, see [Azure Windows Virtual Machine Agent overview](agent-windows.md).
