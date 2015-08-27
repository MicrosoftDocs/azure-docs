<properties
   pageTitle="Authoring Templates with Azure VM Extensions | Microsoft Azure"
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

# Authoring Azure Resource Manager Templates with VM Extensions.

## Overview of Azure Resource Manager Templates.

Azure Resource Manager Template allows you to declaratively specify the Azure IaaS infrastructure in Json language by defining the dependencies between resources. For a detailed overview of Azure Resource Manager Templates, please refer to the articles below:

<a href="https://azure.microsoft.com/en-us/documentation/articles/resource-group-overview/" target="_blank">Resource Group Overview</a>.
<br/>
<a href="https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-deploy-rmtemplates-azure-cli/" target="_blank">Deploying Templates with Azure CLI</a>.
<br/>
<a href="https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-deploy-rmtemplates-powershell/" target="_blank">Deploying Templates with Azure Powershell</a>.

## Sample template snippet for VM Extensions.
The template snippet for Deploying extensions looks as following:

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

## Identifying the publisher, type and the typeHandlerVersion for any extension.

Azure VM Extensions are published by Microsoft and trusted 3rd party publishers and each extension is uniquely identified by its publisher,type and the typeHandlerVersion. These can be determined as following:

From Azure PowerShell, run the following Azure PowerShell cmdlet:

      Get-AzureVMAvailableExtension

From Azure CLI, run the following Azure PowerShell cmdlet:

      Azure VM Extension list

This cmdlet returns the publisher name, extension name and version as following:

       Publisher                   : Microsoft.Azure.Extensions  
      ExtensionName               : DockerExtension
      Version                     : 1.0

These three properties map to "publisher", "type" & "typeHandlerVersion" respectively in the above template snippet.
Note : Its always recommended to use the latest extension version to get the most updated functionality.

## Identifying the schema for the Extension configuration parameters

The next step with authoring extension template is to identify the format for providing configuration parameters. Each extension supports its own set of parameters.

To look at some sample configuration for Windows Extensions, click the documentation [Windows Extensions Samples](virtual-machines-extensions-configuration-samples-windows.md).

To look at some sample configuration for Linux Extensions, click the documentation for  [Linux Extensions Samples ](virtual-machines-extensions-configuration-samples-linux.md).

Please refer to the following to the VM Templates to get a fully complete Template with VM Extensions.

<a href="https://github.com/Azure/azure-quickstart-templates/blob/b1908e74259da56a92800cace97350af1f1fc32b/mongodb-on-ubuntu/azuredeploy.json/" target="_blank">Custom Script Extension on a Linux VM</a>.
</br>
<a href="https://github.com/Azure/azure-quickstart-templates/blob/b1908e74259da56a92800cace97350af1f1fc32b/201-list-storage-keys-windows-vm/azuredeploy.json/" target="_blank">Custom Script Extension on a Windows VM</a>.

After authoring the template, you can deploy them using Azure CLI or Azure Powershell.
