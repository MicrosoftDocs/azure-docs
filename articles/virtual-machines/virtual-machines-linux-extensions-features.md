---
title: Virtual machine extensions and features | Microsoft Docs
description: Learn what extensions are available for Azure virtual machines, grouped by what they provide or improve.
services: virtual-machines-linux
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: azure-service-management,azure-resource-manager

ms.assetid: 52f5d0ec-8f75-49e7-9e15-88d46b420e63
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 11/17/2016
ms.author: nepeters

---
# About virtual machine extensions and features

## Azure VM Extensions

Azure Virtual Machine extensions are small applications that perform post deployment configuration and automation task on Azure Virtual Machines. For example, if a Virtual Machine requires software to be installed, anti-virus protection, or Docker configuration, a VM extension can be used to complete these tasks. Azure VM extensions can be run using the Azure CLI, PowerShell, Resource Manage templates, and the Azure portal. Extensions can be bundled with a new virtual machine deployment, or run against an existing system.

This document provides an overview of Azure virtual machine extensions, prerequisites, and guidance on how to detect, manage, and remove virtual machine extensions. Additional in-depth documentation will be provided for several specific extensions.

## Use cases and samples

Several different Azure VM extensions are available, each with a specific use case. Some example are:

- Apply PowerShell Desired State Configurations to a virtual machine using the DSC extension for Linux. For more information, see [Azure Desired State configuration extension](https://github.com/Azure/azure-linux-extensions/tree/master/DSC).
- Configure monitoring of a virtual machine with the Microsoft Monitoring Agent VM extension. For more information, see [Enable or disable VM monitoring](virtual-machines-linux-vm-monitoring.md). 
- Configure monitoring of your Azure infrastructure with the Datadog extension. For more information, see [Datadog blog](https://www.datadoghq.com/blog/introducing-azure-monitoring-with-one-click-datadog-deployment/).
- Configure a Docker host on an Azure virtual machine using the Docker VM extension. For more information, see [Docker VM extension](virtual-machines-linux-dockerextension.md).

In addition to process specific extensions, a Custom Script extension is available for both Windows and Linux virtual machines. The Custom Script extension for Linux allows any bash script to be run on a virtual machine. This becomes very powerful when designing Azure deployments that require configuration beyond what native Azure tooling can provide. For more information, see [Linux VM Custom Script extension](virtual-machines-linux-extensions-customscript.md).

To see how a VM extension can be used in an end to end Azure deployment, check out [Automating application deployments to Azure Virtual Machines](virtual-machines-linux-dotnet-core-1-landing.md).

## Prerequisites

Each virtual machine extension may have its own set of prerequisites. For instance, the Docker VM extension has a prerequisite of a supported Linux distribution. Requirements for individual extension are detailed in the extension-specific documentation. 

### Azure VM Agent

The Azure VM Agent manages interacts between an Azure Virtual Machine and the Azure Fabric Controller. The VM agent is responsible for many functional aspects of deploying and managing Azure Virtual Machines, including running VM Extensions. The Azure VM Agent is pre-installed on Azure Gallery Images, and can be installed manually on supported operating systems.

For information on supported operating systems and installation instructions, see [Azure Virtual Machine Agent](virtual-machines-linux-classic-agents-and-extensions.md).

## Discover VM Extensions

Many different VM extensions are available for use with Azure Virtual Machines. To see a complete list, run the following command with the Azure CLI, replacing the location with the location of choice.

```none
azure vm extension-image list westus
```

## Running VM extensions

Azure virtual machine extensions can be run on existing virtual machines, or bundled with Azure Resource Manager template deployments.

The following methods can be used to run an extension against an existing virtual machine. 

### Azure CLI

<fill out>

```azurecli
azure vm extension set myResourceGroup myVM CustomScript Microsoft.Azure.Extensions 2.0 \
  --auto-upgrade-minor-version \
  --public-config '{"fileUris": ["https://gist.github.com/ahmetalpbalkan/b5d4a856fe15464015ae87d5587a4439/raw/466f5c30507c990a4d5a2f5c79f901fa89a80841/hello.sh"],"commandToExecute": "./hello.sh"}'
```

Which provides output similar to the following text:

```powershell
<fill out>
```

### Azure portal

VM extension can be applied to an existing virtual machine through the Azure portal. To do so, select the virtual machine > extensions > and click add. Doing so provides a list of available extensions. Select the one you want, which provides a wizard for configuration. 

The following image depicts the installation of the Linux custom script extion from the Azure portal.

![Antimalware Extension](./media/virtual-machines-linux-extensions-features/script-extension-linux.jpg)

### Azure Resource Manager templates

VM extensions can be added to an Azure Resource Manager template and executed with the deployment of the template. Deploying extension with a template is useful for creating fully configured Azure deployments. For example, the following JSON is taken from a Resource Manager template that deploys a set of load balanced virtual machines, an Azure SQL database, and then installs and configures a .Net Core application on each virtual machine. The VM extension takes care of the software installation. 

The full Resource Manager template can be found [here](https://github.com/Microsoft/dotnet-core-sample-templates/tree/master/dotnet-core-music-linux).

```json
{
    "apiVersion": "2015-06-15",
    "type": "extensions",
    "name": "config-app",
    "location": "[resourceGroup().location]",
    "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', concat(variables('vmName'),copyindex()))]"
    ],
    "tags": {
    "displayName": "config-app"
    },
    "properties": {
    "publisher": "Microsoft.Azure.Extensions",
    "type": "CustomScript",
    "typeHandlerVersion": "2.0",
    "autoUpgradeMinorVersion": true,
    "settings": {
        "fileUris": [
        "https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-linux/scripts/config-music.sh"
        ]
    },
    "protectedSettings": {
        "commandToExecute": "[concat('sudo sh config-music.sh ',variables('musicStoreSqlName'), ' ', parameters('adminUsername'), ' ', parameters('sqlAdminPassword'))]"
    }
    }
}
```

For more information, see [Authoring Azure Resource Manager templates with linux VM extensions](virtual-machines-linux-extensions-authoring-templates.md).

## Troubleshooting VM extension

Each VM extension may have troubleshooting steps specific to the extensions. For instance, when using the Custom Script Extension, script execution details can be found locally on the virtual machine on which the extension was run. Any extension-specific troubleshooting steps are detailed in extension-specific documentation. 

The following troubleshooting steps apply to all Virtual Machine extensions.

### Viewing extension status

Once a Virtual Machine extension has been run against a virtual machine, use the following Azure CLI command to return extension status. Replace example parameter names with your own values.

```azurecli
azure vm extension get myResourceGroup myVM
```

The output looks similar to the following text:

```bash
info:    Executing command vm extension get
+ Looking up the VM "myVM"
data:    Publisher                   Name             Version  State
data:    --------------------------  ---------------  -------  ---------
data:    Microsoft.Azure.Extensions  DockerExtension  1.0      Succeeded
info:    vm extension get command OK         :
```

### Rerunning VM Extension 

There may be cases where a virtual machine extension needs to be re-run. This can be accomplished by removing the extension, and then re-running the extension with an execution method of your choice. To remove an extension, run the following command with the Azure CLI. Replace example parameter names with your own values.

```azurecli
azure vm extension set myResourceGroup myVM --uninstall CustomScript Microsoft.Azure.Extensions 2.0
```

An extension can also be removed using the Azure portal. To do so, select a virtual machine > extensions > the desired extension > uninstall.

<br />

## Common VM Extensions
| Extension Name | Description | More Information |
| --- | --- | --- |
| Custom Script Extension for Linux |Run scripts against an Azure Virtual Machine |[Custom Script Extension for Linux](virtual-machines-linux-extensions-customscript.md) |
| Docker Extension |Installs the Docker daemon to support remote Docker commands. |[Docker VM Extension](virtual-machines-linux-dockerextension.md) |
| VM Access Extension |Regain access to Azure Virtual Machine |[VM Access Extension](https://github.com/Azure/azure-linux-extensions/tree/master/VMAccess) |
| Azure Diagnostics Extension |Manage Azure Diagnostics |[Azure Diagnostics Extension](https://azure.microsoft.com/blog/windows-azure-virtual-machine-monitoring-with-wad-extension/) |

