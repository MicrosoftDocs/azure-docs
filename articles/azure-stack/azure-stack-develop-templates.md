---
title: Develop templates for Azure Stack | Microsoft Docs
description: Learn Azure Stack template best practices
services: azure-stack
documentationcenter: ''
author: HeathL17
manager: byronr
editor: ''

ms.assetid: 8a5bc713-6f51-49c8-aeed-6ced0145e07b
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/10/2017
ms.author: helaw

---
# Azure Resource Manager template considerations
As you develop your application, it is important to ensure template portability between Azure and Azure Stack.  This topic provides considerations for developing Azure Resource Manager [templates](http://download.microsoft.com/download/E/A/4/EA4017B5-F2ED-449A-897E-BD92E42479CE/Getting_Started_With_Azure_Resource_Manager_white_paper_EN_US.pdf), so you can prototype your application and test deployment in Azure without access to an Azure Stack environment.

## Public namespaces
Because Azure Stack is hosted in your datacenter, it has different service endpoint namespaces than the Azure public cloud. As a result, hardcoded public endpoints in Resource Manager templates fail when you try to deploy them to Azure Stack. Instead, you can use the *reference* and *concatenate* function to dynamically build the service endpoint based on values retrieved from the resource provider during deployment. For example, rather than specifying *blob.core.windows.net* in your template, retrieve the [primaryEndpoints.blob](https://github.com/Azure/AzureStack-QuickStart-Templates/blob/master/101-simple-windows-vm/azuredeploy.json#L201) to dynamically set the *osDisk.URI* endpoint:

     "osDisk": {"name": "osdisk","vhd": {"uri": 
     "[concat(reference(concat('Microsoft.Storage/storageAccounts/', variables('storageAccountName')), '2015-06-15').primaryEndpoints.blob, variables('vmStorageAccountContainerName'),
      '/',variables('OSDiskName'),'.vhd')]"}}

## API versioning
Azure service versions may differ between Azure and Azure Stack. Each resource requires the apiVersion attribute, which defines the capabilities offered. To ensure API version compatibility in Azure Stack, the following are valid API versions for each Resource Provider:

| Resource Provider | apiVersion |
| --- | --- |
| Compute |`'2015-06-15'` |
| Network |`'2015-06-15'`, `'2015-05-01-preview'` |
| Storage |`'2016-01-01'`, `'2015-06-15'`, `'2015-05-01-preview'` |
| KeyVault | `'2015-06-01'` |
| App Service |`'2015-08-01'` |
| MySQL |`'2015-09-01'` |
| SQL |`'2014-04-01-preview'` |

## Template functions
Resource Manager [functions](../azure-resource-manager/resource-group-template-functions.md) provide capabilities required to build dynamic templates. As an example, you can use functions for tasks like:

* Concatenating or trimming strings 
* Reference values from other resources
* Iterating on resources to deploy multiple instances 

As you build your templates, some functions are not available in Azure Stack TP3, and should not be used. These functions are:

* Skip
* Take

## Resource location
Resource Manager templates use a location attribute to place resources during deployment. In Azure, locations refer to a region like West US or South America. In Azure Stack, locations are different because Azure Stack is in your datacenter.  To ensure templates are transferrable between Azure and Azure Stack, you should reference the resource group location as you deploy individual resources. You can do this using `[resourceGroup().Location]` to ensure all resources inherit the resource group location.  The following Resource Manager template excerpt is an example of using this function while deploying a storage account:

    "resources": [
    {
      "name": "[variables('storageAccountName')]",
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "[variables('apiVersionStorage')]",
      "location": "[resourceGroup().location]",
      "comments": "This storage account is used to store the VM disks",
      "properties": {
      "accountType": "Standard_GRS"
      }
    }
    ]


## Next steps
* [Deploy templates with PowerShell](azure-stack-deploy-template-powershell.md)
* [Deploy templates with Azure CLI](azure-stack-deploy-template-command-line.md)
* [Deploy templates with Visual Studio](azure-stack-deploy-template-visual-studio.md)

