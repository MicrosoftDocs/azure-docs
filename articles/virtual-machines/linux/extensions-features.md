---
title: Virtual machine extensions and features for Linux | Microsoft Docs
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
ms.date: 04/26/2017
ms.author: nepeters

--
# Virtual machine extensions and features for Linux

Azure virtual machine extensions are small applications that provide post-deployment configuration and automation tasks on Azure virtual machines. For example, if a virtual machine requires software installation, anti-virus protection, or Docker configuration, a VM extension can be used to complete these tasks. Azure VM extensions can be run using the Azure CLI, PowerShell, Azure Resource Manager templates, and the Azure portal. Extensions can be bundled with a new virtual machine deployment, or run against any existing system.

This document provides an overview of VM extensions, prerequisites for using Azure VM extensions, and guidance on how to detect, manage, and remove VM extensions. This document provides generalized information because many VM extensions are available, each with a potentially unique configuration. Extension-specific details can be found in each document specific to the individual extension.

## Use cases and samples

Several different Azure VM extensions are available, each with a specific use case. Some examples are:

- Apply PowerShell Desired State configurations to a virtual machine using the DSC extension for Linux. For more information, see [Azure Desired State configuration extension](https://github.com/Azure/azure-linux-extensions/tree/master/DSC).
- Configure monitoring of a virtual machine with the Microsoft Monitoring Agent VM extension. For more information, see [Enable or disable VM monitoring](vm-monitoring.md).
- Configure monitoring of your Azure infrastructure with the Datadog extension. For more information, see the [Datadog blog](https://www.datadoghq.com/blog/introducing-azure-monitoring-with-one-click-datadog-deployment/).
- Configure a Docker host on an Azure virtual machine using the Docker VM extension. For more information, see [Docker VM extension](dockerextension.md).

In addition to process-specific extensions, a Custom Script extension is available for both Windows and Linux virtual machines. The Custom Script extension for Linux allows any Bash script to be run on a virtual machine. Custom scripts are useful for designing Azure deployments that require configuration beyond what native Azure tooling can provide. For more information, see [Linux VM Custom Script extension](extensions-customscript.md).

To work through an example where a VM extension is used in an end-to-end application deployment, see [Automating application deployments to Azure virtual machines](../linux/dotnet-core-1-landing.md).

## Prerequisites

Each virtual machine extension might have its own set of prerequisites. For instance, the Docker VM extension has a prerequisite of a supported Linux distribution. Requirements of individual extensions are detailed in the extension-specific documentation.

### Azure VM agent

The Azure VM agent manages interactions between an Azure virtual machine and the Azure fabric controller. The VM agent is responsible for many functional aspects of deploying and managing Azure virtual machines, including running VM extensions. The Azure VM agent is preinstalled on Azure Marketplace images and can be installed manually on supported operating systems.

For information on supported operating systems and installation instructions, see [Azure virtual machine agent](../windows/classic/agents-and-extensions.md).

## Discover VM extensions

Many different VM extensions are available for use with Azure virtual machines. To see a complete list, run the following command with the Azure CLI, replacing the example location with the location of your choice.

```azurecli
az vm extension image list --location westus -o table
```

## Run VM extensions

Azure virtual machine extensions can be run on existing virtual machines, which are useful when you need to make configuration changes or recover connectivity on an already deployed VM. VM extensions can also be bundled with Azure Resource Manager template deployments. By using extensions with Resource Manager templates, Azure virtual machines can be deployed and configured without post-deployment intervention.

The following methods can be used to run an extension against an existing virtual machine.

### Azure CLI

Azure virtual machine extensions can be run against an existing virtual machine by using the `az vm extension set` command. This example runs the custom script extension against a virtual machine.

```azurecli
az vm extension set `
  --resource-group exttest `
  --vm-name exttest `
  --name customScript `
  --publisher Microsoft.Azure.Extensions `
  --settings '{"fileUris": ["https://gist.github.com/ahmetalpbalkan/b5d4a856fe15464015ae87d5587a4439/raw/466f5c30507c990a4d5a2f5c79f901fa89a80841/hello.sh"],"commandToExecute": "./hello.sh"}'
```

The script produces output similar to the following text:

```azurecli
info:    Executing command vm extension set
+ Looking up the VM "myVM"
+ Installing extension "CustomScript", VM: "mvVM"
info:    vm extension set command OK
```

### Azure portal

VM extensions can be applied to an existing virtual machine through the Azure portal. To do so, select the virtual machine, choose **Extensions**, and click **Add**. Select the extension you want from the list of available extensions and follow the instructions in the wizard.

The following image shows the installation of the Linux Custom Script extension from the Azure portal.

![Install custom script extension](./media/extensions-features/installscriptextensionlinux.png)

### Azure Resource Manager templates

VM extensions can be added to an Azure Resource Manager template and executed with the deployment of the template. When you deploy an extension with a template, you can create fully configured Azure deployments. For example, the following JSON is taken from a Resource Manager template. The template deploys a set of load-balanced virtual machines and an Azure SQL database, and then installs a .NET Core application on each VM. The VM extension takes care of the software installation.

For more information, see the full [Resource Manager template](https://github.com/Microsoft/dotnet-core-sample-templates/tree/master/dotnet-core-music-linux).

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

For more information, see [Authoring Azure Resource Manager templates with Linux VM extensions](../linux/extensions-authoring-templates.md).

## Secure VM extension data

When you're running a VM extension, it may be necessary to include sensitive information such as credentials, storage account names, and storage account access keys. Many VM extensions include a protected configuration that encrypts data and only decrypts it inside the target virtual machine. Each extension has a specific protected configuration schema, and each is detailed in extension-specific documentation.

The following example shows an instance of the Custom Script extension for Linux. Notice that the command to execute includes a set of credentials. In this example, the command to execute will not be encrypted.


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
      ],
      "commandToExecute": "[concat('sudo sh config-music.sh ',variables('musicStoreSqlName'), ' ', parameters('adminUsername'), ' ', parameters('sqlAdminPassword'))]"
    }
  }
}
```

Moving the **command to execute** property to the **protected** configuration secures the execution string.

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

## Troubleshoot VM extensions

Each VM extension may have troubleshooting steps specific to the extension. For example, when you're using the Custom Script extension, script execution details can be found locally on the virtual machine on which the extension was run. Any extension-specific troubleshooting steps are detailed in extension-specific documentation.

The following troubleshooting steps apply to all virtual machine extensions.

### View extension status

After a virtual machine extension has been run against a virtual machine, use the following Azure CLI command to return extension status. Replace example parameter names with your own values.

```azurecli
az vm extension list --resource-group myResourceGroup --vm-name myVM -o table
```

The output looks like the following text:

```azurecli
AutoUpgradeMinorVersion    Location    Name          ProvisioningState    Publisher                   ResourceGroup      TypeHandlerVersion  VirtualMachineExtensionType
-------------------------  ----------  ------------  -------------------  --------------------------  ---------------  --------------------  -----------------------------
True                       westus      customScript  Succeeded            Microsoft.Azure.Extensions  exttest                             2  customScript
```

Extension execution status can also be found in the Azure portal. To view the status of an extension, select the virtual machine, choose **Extensions**, and select the desired extension.

### Rerun a VM extension

There may be cases in which a virtual machine extension needs to be rerun. You can rerun an extension by removing it, and then rerunning the extension with an execution method of your choice. To remove an extension, run the following command with the Azure CLI. Replace example parameter names with your own values.

```azurecli
az vm extension delete --name customScript --resource-group myResourceGroup --vm-name myVM
```

You can remove an extension by using the following steps in the Azure portal:

1. Select a virtual machine.
2. Choose **Extensions**.
3. Select the desired extension.
4. Choose **Uninstall**.

## Common VM extension reference
| Extension name | Description | More information |
| --- | --- | --- |
| Custom Script extension for Linux |Run scripts against an Azure virtual machine |[Custom Script extension for Linux](extensions-customscript.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) |
| Docker extension |Install the Docker daemon to support remote Docker commands. |[Docker VM extension](dockerextension.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) |
| VM Access extension |Regain access to an Azure virtual machine |[VM Access extension](https://github.com/Azure/azure-linux-extensions/tree/master/VMAccess) |
| Azure Diagnostics extension |Manage Azure Diagnostics |[Azure Diagnostics extension](https://azure.microsoft.com/blog/windows-azure-virtual-machine-monitoring-with-wad-extension/) |
| Azure VM Access extension |Manage users and credentials |[VM Access extension for Linux](https://azure.microsoft.com/en-us/blog/using-vmaccess-extension-to-reset-login-credentials-for-linux-vm/) |
