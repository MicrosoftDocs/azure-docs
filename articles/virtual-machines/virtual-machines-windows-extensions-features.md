<properties
 pageTitle="Virtual machine extensions and features | Microsoft Azure"
 description="Learn what extensions are available for Azure virtual machines, grouped by what they provide or improve."
 services="virtual-machines-windows"
 documentationCenter=""
 authors="neilpeterson"
 manager="timlt"
 editor=""
 tags="azure-service-management,azure-resource-manager"/>

<tags
 ms.service="virtual-machines-windows"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="vm-windows"
 ms.workload="infrastructure-services"
 ms.date="09/30/2016"
 ms.author="nepeters"/>

# About virtual machine extensions and features

## Azure VM Extensions

Azure Virtual Machine extensions are small applications that provide post deployment configuration and automation task on Azure Virtual Machines. For example, if a Virtual Machine requires software to be installed, anti-virus protection, or Docker configuration, a VM extension can be used to complete these tasks. Azure VM extensions can be run using the Azure CLI, PowerShell, Resource Manage templates, and the Azure portal. Extensions can be bundled with a new virtual machine deployment, or run against any existing system.

This document provides prerequisites for Azure Virtual Machine extension, and guidance on how to detect available VM extensions. 

## Azure VM Agent

The Azure VM Agent manages interaction between an Azure Virtual Machine and the Azure Fabric Controller. The VM agent is responsible for many functional aspects of deploying and managing Azure Virtual Machines, including running VM Extensions. The Azure VM Agent is pre-installed on Azure Gallery Images, and can be installed on supported operating systems. 

For information on supported operating systems and installation instructions, see [Azure Virtual Machine Agent](./virtual-machines-windows-classic-agents-and-extensions.md).

## Discover VM Extensions

Many different VM extensions are available for use with Azure Virtual Machines. To see a complete list, run the following command with the Azure CLI, replacing the location with the location of choice.

```none
Get-AzureVMAvailableExtension | Select ExtensionName, Version
```

<br />

## Common VM Extensions

|Extension Name   |Description   |More Information   |
|---|---|---|
|Custom Script Extension for Windows  | Run scripts against an Azure Virtual Machine  |[Custom Script Extension for Windows](./virtual-machines-windows-extensions-customscript.md)   |
|DSC Extension for Windows | PowerShell DSC (Desired State Configuration) Extension.  | [Docker VM Extension](./virtual-machines-windows-extensions-dsc-overview.md)  |
|Azure Diagnostics Extension | Manage Azure Diagnostics |[Azure Diagnostics Extension](https://azure.microsoft.com/blog/windows-azure-virtual-machine-monitoring-with-wad-extension/) |
