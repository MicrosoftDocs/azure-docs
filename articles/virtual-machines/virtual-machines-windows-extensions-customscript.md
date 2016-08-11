<properties
   pageTitle="Custom scripts on Windows VMs using templates | Microsoft Azure"
   description="Automate Windows VM configuration tasks by using the Custom Script extension with Resource Manager templates"
   services="virtual-machines-windows"
   documentationCenter=""
   authors="kundanap"
   manager="timlt"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="virtual-machines-windows"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows"
   ms.workload="infrastructure-services"
   ms.date="03/29/2016"
   ms.author="kundanap"/>

# Windows VM Custom Script extensions with Azure Resource Manager templates

[AZURE.INCLUDE [virtual-machines-common-extensions-customscript](../../includes/virtual-machines-common-extensions-customscript.md)]

## Template example for a Windows VM

Define the following resource in the Resource section of the template.

       {
       "type": "Microsoft.Compute/virtualMachines/extensions",
       "name": "MyCustomScriptExtension",
       "apiVersion": "2015-05-01-preview",
       "location": "[parameters('location')]",
       "dependsOn": [
           "[concat('Microsoft.Compute/virtualMachines/',parameters('vmName'))]"
       ],
       "properties": {
           "publisher": "Microsoft.Compute",
           "type": "CustomScriptExtension",
           "typeHandlerVersion": "1.7",
           "autoUpgradeMinorVersion":true,
           "settings": {
               "fileUris": [
               "http://Yourstorageaccount.blob.core.windows.net/customscriptfiles/start.ps1"
           ],
           "commandToExecute": "powershell.exe -ExecutionPolicy Unrestricted -File start.ps1"
         }
       }
     }

In the preceding example, replace the file URL and the file name with your own settings.
After authoring the template, you can deploy it using Azure PowerShell.

If you want to keep script URLs and parameters private, you can set the script URL as **private**. If the script URL is set as **private**, it can only be accessed with a storage account name and key sent as protected settings. The script parameters can also be provided as protected settings with version 1.7 or later of the Custom Script extension.

## Template example for a Windows VM with protected settings

        {
        "publisher": "Microsoft.Compute",
        "type": "CustomScriptExtension",
        "typeHandlerVersion": "1.7",
        "settings": {
        "fileUris": [
        "http: //Yourstorageaccount.blob.core.windows.net/customscriptfiles/start.ps1"
        ]
        },
        "protectedSettings": {
        "commandToExecute": "powershell.exe -ExecutionPolicy Unrestricted -start.ps1",
        "storageAccountName": "yourStorageAccountName",
        "storageAccountKey": "yourStorageAccountKey"
        }
        }
For information about the schema of the latest versions of the Custom Script extension, see [Azure Windows VM Extension Configuration Samples](virtual-machines-windows-extensions-configuration-samples.md).

For samples of application configuration on a VM using the Custom Script extension, see [Custom Script extension on a Windows VM](https://github.com/Azure/azure-quickstart-templates/blob/b1908e74259da56a92800cace97350af1f1fc32b/201-list-storage-keys-windows-vm/azuredeploy.json/).
