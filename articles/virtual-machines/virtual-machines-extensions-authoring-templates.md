<properties
   pageTitle="Authoring Templates with Azure VM Extensions"
   description="Learn more about authoring Templates with Extensions"
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
   ms.date="09/01/2015"
   ms.author="kundanap"/>

## Overview of Azure Resource Manager Templates.

Azure Resource Manager Template allow you to declaratively specify the Azure IaaS infrastructure in Json language by defining the dependencies between resources. For a detailed overview of Azure Resource Manager Templates, please refer to the articles below:

<a href="https://azure.microsoft.com/en-us/documentation/articles/resource-group-overview/" target="_blank">Resource Group Overview</a>.
<br/>
<a href="https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-deploy-rmtemplates-azure-cli/" target="_blank">Deploying Templates with Azure CLI</a>.
<br/>
<a href="https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-deploy-rmtemplates-powershell/" target="_blank">Deploying Templates with Azure Powershell</a>.

### Sample template snippet for VM Extension.
The template snippet for Deploying extensions looks as below:

      {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "name": "MyExtension",
      "apiVersion": "2015-05-01-preview",
      "location": "[parameters('location')]",
      "dependsOn": ["[concat('Microsoft.Compute/virtualMachines/',parameters('vmName'))]"],
      "properties":
      {
      "publisher": "Publisher Namespace",
      "type": "extension Name",
      "typeHandlerVersion": "extension version",
      "settings": {
      // Extension specific configuration goes in here.
      }
      }
      }

### How to identify the publisher, type and the typeHandlerVersion for any extension?

Azure VM Extensions are published by Microsoft and trusted 3rd party publishers and each extension is uniquely identified by its publisher,type and the typeHandlerVersion. These can be determined as following:

### From Azure PowerShell:

Run the following Azure PowerShell cmdlet:

      Get-AzureVMAvailableExtension

This cmdlet returns the publisher name, extension name and version as following:

      Publisher                   : Microsoft.Azure.Extensions  
      ExtensionName               : DockerExtension
      Version                     : 1.0

These three properties map to "publisher", "type" & "typeHandlerVersion" respectively in the above template snippet.
Note : Its always recommended to use the latest extension version to get the most updated functionality.


In the examples above, replace the file URL and the file name with your own settings.

After authoring the template, you cna deploy them using Azure CLI or Azure Powershell.

Please refer to the examples below for complete samples of configuring applications on a VM using custom script extension.

<a href="https://github.com/Azure/azure-quickstart-templates/blob/b1908e74259da56a92800cace97350af1f1fc32b/mongodb-on-ubuntu/azuredeploy.json/" target="_blank">Custom Script Extension on a Linux VM</a>.
</br>
<a href="https://github.com/Azure/azure-quickstart-templates/blob/b1908e74259da56a92800cace97350af1f1fc32b/201-list-storage-keys-windows-vm/azuredeploy.json/" target="_blank">Custom Script Extension on a Windows VM</a>.
