---
title: Implement the Azure VM extension for SAP solutions | Microsoft Docs
description: Learn how to deploy the VM Extension for SAP.
services: virtual-machines-linux,virtual-machines-windows
documentationcenter: ''
author: OliverDoll
manager: juergent
editor: ''
tags: azure-resource-manager
keywords: ''
ms.assetid: 1c4f1951-3613-4a5a-a0af-36b85750c84e
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 06/22/2021
ms.author: oldoll
---

# Implement the Azure VM extension for SAP solutions

[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[2178632]:https://launchpad.support.sap.com/#/notes/2178632
[1409604]:https://launchpad.support.sap.com/#/notes/1409604
[2191498]:https://launchpad.support.sap.com/#/notes/2191498
[2243692]:https://launchpad.support.sap.com/#/notes/2243692
[1999351]:https://launchpad.support.sap.com/#/notes/1999351

[sap-resources]:vm-extension-for-sap.md#42ee2bdb-1efc-4ec7-ab31-fe4c22769b94 (SAP resources)
[new-monitoring]:vm-extension-for-sap.md#38d9f33f-d0af-4b8f-8134-f1f97d656fb6 (New Version of VM Extension for SAP)
[std-extension]:vm-extension-for-sap-standard.md (Standard Version of Azure VM extension for SAP solutions)
[new-extension]:vm-extension-for-sap-new.md (New Version of Azure VM extension for SAP solutions )
[azure-ps]:/powershell/azure/
[azure-cli]:/cli/azure/install-classic-cli
[azure-cli-2]:/cli/azure/install-azure-cli

[deployment-guide-3]:deployment-guide.md#b3253ee3-d63b-4d74-a49b-185e76c4088e (Deployment scenarios of VMs for SAP on Microsoft Azure)
[planning-guide-9.1]:planning-guide.md#6f0a47f3-a289-4090-a053-2521618a28c3 (Azure Monitoring Solution for SAP)

> [!NOTE]
> General Support Statement:
> Support for the Azure Extension for SAP is provided through SAP support channels. If you need assistance with the Azure VM extension for SAP solutions, please open a support case with SAP Support.
 
When you've prepared the VM as described in [Deployment scenarios of VMs for SAP on Azure][deployment-guide-3], the Azure VM Agent is installed on the virtual machine. The next step is to deploy the Azure Extension for SAP, which is available in the Azure Extension Repository in the global Azure datacenters.
 
To be sure SAP supports your environment, enable the Azure VM extension for SAP solutions as described in Configure the Azure Extension for SAP.

## <a name="42ee2bdb-1efc-4ec7-ab31-fe4c22769b94"></a>SAP resources

When you are setting up your SAP software deployment, you need the following SAP resources:

* SAP Note [1928533], which has:
  * List of Azure VM sizes that are supported for the deployment of SAP software
  * Important capacity information for Azure VM sizes
  * Supported SAP software, and operating system (OS) and database combinations
  * Required SAP kernel version for Windows and Linux on Microsoft Azure

* SAP Note [2015553] lists prerequisites for SAP-supported SAP software deployments in Azure.
* SAP Note [2178632] has detailed information about all monitoring metrics reported for SAP in Azure.
* SAP Note [1409604] has the required SAP Host Agent version for Windows in Azure.
* SAP Note [2191498] has the required SAP Host Agent version for Linux in Azure.
* SAP Note [2243692] has information about SAP licensing on Linux in Azure.
* SAP Note [1999351] has additional troubleshooting information for the Azure Extension for SAP.
* SAP-specific PowerShell cmdlets that are part of [Azure PowerShell][azure-ps].
* SAP-specific Azure CLI commands that are part of [Azure CLI][azure-cli-2].
 
## Differences between the two versions of the Azure VM extension for SAP solutions

There are two versions of the VM Extension for SAP. Check the prerequisites for SAP and required minimum versions of SAP Kernel and SAP Host Agent in the resources listed in [SAP resources][sap-resources].

### Standard Version of VM Extension for SAP

This version is the current standard VM Extension for SAP. There are some exceptions where Microsoft recommends installing the new VM Extension for SAP. In addition, when opening a support case, SAP Support is able to request to install the new VM Extension. For more details on when to use the new version of the VM Extension for SAP, see chapter [New Version of VM Extension for SAP][new-monitoring]
 
### <a name="38d9f33f-d0af-4b8f-8134-f1f97d656fb6"></a>New Version of VM Extension for SAP

This version is the new Azure VM extension for SAP solutions. With further improvements and new Azure Offerings the new extension was built to be able to monitor all Azure resources of a virtual machine. This extension needs internet access to the URL "management.azure.com". It supports additional storage options, for example Standard Disks and operating systems. Please choose the new version of the VM Extension if one of the following applies:
 
* You want to install the VM extension with Terraform, Azure Resource Manager Templates or with other means than Azure CLI or Azure PowerShell
* You want to install the extension on SUSE SLES 15 or higher.
* You want to install the extension on Red Hat Enterprise Linux 8.1 or higher.
* You want to use Azure Ultra Disk or Standard Managed Disks
* Microsoft or SAP support asks you to install the new extension
 
## Recommendation

We currently recommend using the standard version of the extension for each installation where none of the use cases for the new version of the extension applies. We are currently working on improving the new version of the VM extension to be able to make it the default and deprecate the standard version of the extension. During this time, you can use the new version. However, you need to make sure the VM Extension can access management.azure.com.
 
> [!NOTE]
> Make sure to uninstall the VM Extension before switching between the two versions.

## Next steps
* [Standard Version of Azure VM extension for SAP solutions][std-extension]
* [New Version of Azure VM extension for SAP solutions][new-extension]

