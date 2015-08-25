<properties
   pageTitle="Using Custom Script Extension Azure Resource Manager Templates"
   description="Automating Azure Virtual Machine configuration tasks using Custom script with ARM Templates"
   services="virtual-machines"
   documentationCenter=""
   authors="kundanap"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="07/01/2015"
   ms.author="kundanap"/>

# Using Custom Script Extension With Azure Resource Manager Templates

This article gives an overview of writing Azure Resource Manager Templates with Custom Script Extension for bootstrapping workloads on a Linux or a Windows VM.

For an overview of Custom Script Extension please refer to the article <a href="https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-extensions-customscript/" target="_blank">here</a>.

Ever since its launch, Custom Script Extension has been used widely to configure workloads on both Windows and Linux VMs. With the introduction of Azure Resource Manager Templates, users can now create a single template that not only provisions the VM but also configures the workloads on it.

## Overview of Azure Resource Manager Templates.

Azure Resource Manager Template allow you to declaratively specify the Azure IaaS infrastructure in Json language by defining the dependencies between resources. For a detailed overview of Azure Resource Manager Templates, please refer to the articles below:

<a href="https://azure.microsoft.com/en-us/documentation/articles/resource-group-overview/" target="_blank">Resource Group Overview</a>.
<br/>
<a href="https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-deploy-rmtemplates-azure-cli/" target="_blank">Deploying Templates with Azure CLI</a>.
<br/>
<a href="https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-deploy-rmtemplates-powershell/" target="_blank">Deploying Templates with Azure Powershell</a>.

### Pre-Requistes for running Custom Script Extension

1. Install the latest Azure PowerShell Cmdlets or Azure CLI from <a href="http://azure.microsoft.com/downloads" target="_blank">here</a>.
2. If the scripts will be run on an existing VM, make sure VM Agent is enabled on the VM, if not follow this <a href="https://msdn.microsoft.com/library/azure/dn832621.aspx" target="_blank">article</a> to install one.
3. Upload the scripts that you want to run on the VM to Azure Storage. The scripts can come from a single or multiple storage containers.
4. Alternatively the scripts can also be uploaded to a Github account.
5. The script should be authored in such a way that the entry script which is launched by the extension in turn launches other scripts.

## Overview of using Custom Script Extension with Templates:

For deploying with templates we use the same version of  Custom Script extension thats availale for Azure Service Management APIs. The extension supports the same parameters and scenarios like uploading files to Azure Storage account or Github location. The key difference while using with templates is the exact version of the extension should be specified, as opposed to specifying the version in majorversion.* format.

 ## Template Snippet for Custom Script Extension on a Linux VM

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
      "fileUris": [ "https: //raw.githubusercontent.com/Azure/azure-quickstart-templates/master/mongodb-on-ubuntu/mongo-install-ubuntu.sh                        ],
      "commandToExecute": "shmongo-install-ubuntu.sh"
      }
    }
    }

## Template Snippet for Custom Script Extension on a Windows VM

Define the following resource in the Resource section of the template

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
           "typeHandlerVersion": "1.4",
           "settings": {
               "fileUris": [
               "http://Yourstorageaccount.blob.core.windows.net/customscriptfiles/start.ps1"
           ],
           "commandToExecute": "powershell.exe -ExecutionPolicy Unrestricted -File start.ps1"
         }
       }
     }

In the examples above, replace the file URL and the file name with your own settings.

After authoring the template, you cna deploy them using Azure CLI or Azure Powershell.

Please refer to the examples below for complete samples of configuring applications on a VM using custom script extension.

<a href="https://github.com/Azure/azure-quickstart-templates/blob/b1908e74259da56a92800cace97350af1f1fc32b/mongodb-on-ubuntu/azuredeploy.json/" target="_blank">Custom Script Extension on a Linux VM</a>.
</br>
<a href="https://github.com/Azure/azure-quickstart-templates/blob/b1908e74259da56a92800cace97350af1f1fc32b/201-list-storage-keys-windows-vm/azuredeploy.json/" target="_blank">Custom Script Extension on a Windows VM</a>.
