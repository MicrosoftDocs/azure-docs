<properties
   pageTitle="Custom scripts on Linux VMs using templates | Microsoft Azure"
   description="Automate Linux VM configuration tasks by using the Custom Script extension with Resource Manager templates"
   services="virtual-machines-linux"
   documentationCenter=""
   authors="kundanap"
   manager="timlt"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure-services"
   ms.date="03/29/2016"
   ms.author="kundanap"/>

# Using the Custom Script extension for Linux VMs With Azure Resource Manager templates

This article gives an overview of writing Azure Resource Manager templates with the Custom Script extension for bootstrapping workloads on a Linux VM.

[AZURE.INCLUDE [virtual-machines-common-extensions-customscript](../../includes/virtual-machines-common-extensions-customscript.md)]

## Template example for a Linux VM

Define the following extension resource in the Resource section of the template

      {
    "type": "Microsoft.Compute/virtualMachines/extensions",
    "name": "MyCustomScriptExtension",
    "apiVersion": "2015-05-01-preview",
    "location": "[parameters('location')]",
    "dependsOn": ["[concat('Microsoft.Compute/virtualMachines/',parameters('vmName'))]"],
    "properties":
    {
      "publisher": "Microsoft.OSTCExtensions",
      "type": "CustomScriptForLinux",
      "typeHandlerVersion": "1.2",
      "settings": {
      "fileUris": [ "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/mongodb-on-ubuntu/mongo-install-ubuntu.sh"],
      "commandToExecute": "sh mongo-install-ubuntu.sh"
      }
    }
    }

In the example above, replace the file URL and the file name with your own settings.

After authoring the template, you can deploy it using the Azure CLI.

Please refer to the example below for a complete sample of configuring applications on a VM using Custom Script extension.

* [Custom Script extension on a Linux VM](https://github.com/Azure/azure-quickstart-templates/blob/b1908e74259da56a92800cace97350af1f1fc32b/mongodb-on-ubuntu/azuredeploy.json/)
