---
title: VM extension management with Azure Arc for servers
description: Azure Arc for servers (preview) can manage deployment of virtual machine extensions that provide post-deployment configuration and automation tasks on non-Azure VMs.
ms.date: 05/13/2020
ms.topic: conceptual
ms.service: azure-arc
ms.subservice: azure-arc-servers
author: mgoedtel
ms.author: magoedte
---

# Virtual machine extension management with Azure Arc for servers (preview)

Virtual machine (VM) extensions are small applications that provide post-deployment configuration and automation tasks on Azure VMs. For example, if a virtual machine requires software installation, anti-virus protection, or to run a script inside of it, a VM extension can be used. Azure Arc for servers (preview) enables you to deploy Azure VM extensions to non-Azure Windows and Linux VMs. Now you can use Azure Resource Manager templates or Azure policies to manage the extension deployment to hybrid servers managed by Arc for servers (preview).

In this preview, we are supporting the following VM extensions on Windows and Linux machines.

|Extension |Publisher |Additional information |
|----------|----------|-----------------------|
|CustomScriptExtension |Microsoft.Compute |[Windows Custom Script Extension](../../virtual-machines/extensions/custom-script-windows.md)<br> [Linux Custom Script Extension Version 2](../../virtual-machines/extensions/custom-script-linux.md) |
|DSC |Microsoft.PowerShell|[Windows PowerShell DSC Extension](../../virtual-machines/extensions/dsc-windows.md)<br> [PowerShell DSC Extension for Linux](../../virtual-machines/extensions/dsc-linux.md) |
|MicrosoftMonitoringAgent |Microsoft.EnterpriseCloud.Monitoring |[Log Analytics VM extension for Windows](../../virtual-machines/extensions/oms-windows.md)<br> [Log Analytics VM extension for Linux](../../virtual-machines/extensions/oms-linux.md) |

>[!NOTE]
> VM extension functionality is available only in the following regions:
> * EastUS
> * WestUS2
> * WestEurope 
>
> Ensure you onboard your machine in one of these regions.

## Prerequisite

This feature depends on the following Azure resource providers in your subscription:

* **Microsoft.HybridCompute**
* **Microsoft.GuestConfiguration**

If they are not already registered, follow the steps under [Register Azure resource providers] (overview.md#register-azure-resource-providers). 

### Connected Machine agent

The minimum version of the Connected Machine agent that is supported with this feature is:

* Windows - 0.7.*.*
* Linux - 0.8.*.*

