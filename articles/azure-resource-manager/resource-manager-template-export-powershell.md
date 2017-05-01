---
title: Export Resource Manager template with Azure PowerShell | Microsoft Docs
description: Use Azure Resource Manager and Azure PowerShell to export a template from a resource group.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/01/2017
ms.author: tomfitz

---
# Export Azure Resource Manager templates with PowerShell

Resource Manager enables you to export a Resource Manager template from existing resources in your subscription. You can use that generated template to learn about the template syntax or to automate the redeployment of your solution as needed.

It is important to note that there are two different ways to export a template:

* You can export the actual template that you used for a deployment. The exported template includes all the parameters and variables exactly as they appeared in the original template. This approach is helpful when you need to retrieve a template.
* You can export a template that represents the current state of the resource group. The exported template is not based on any template that you used for deployment. Instead, it creates a template that is a snapshot of the resource group. The exported template has many hard-coded values and probably not as many parameters as you would typically define. This approach is useful when you have modified the resource group. Now, you need to capture the resource group as a template.

This topic shows both approaches.

## Deploy a solution

To illustrate both approaches for exporting a template, let's start by deploying a solution to your subscription. If you already have a resource group in your subscription that you want to export, you do not have to deploy this solution. However, the remainder of this article refers to the template for this solution. The example script deploys a Linux virtual machine, storage account, two disks, virtual network, public IP address, and network interface.

```powershell
New-AzureRmResourceGroup -Name ExampleVMGroup -Location "South Central US"
New-AzureRmResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleVMGroup `
  -TemplateFile c:\MyTemplates\storage.json -storageNamePrefix contoso -storageSKU Standard_GRS
```  

## Export Resource Manager template
For an existing resource group (deployed through PowerShell or one of the other methods like the portal), you can view the Resource Manager template for the resource group. Exporting the template offers two benefits:

1. You can easily automate future deployments of the solution because all the infrastructure is defined in the template.
2. You can become familiar with template syntax by looking at the JavaScript Object Notation (JSON) that represents your solution.

To view the template for a resource group, run the [Export-AzureRmResourceGroup](/powershell/module/azurerm.resources/export-azurermresourcegroup) cmdlet.

```powershell
Export-AzureRmResourceGroup -ResourceGroupName ExampleResourceGroup
```

For more information, see [Export an Azure Resource Manager template from existing resources](resource-manager-export-template.md).

## Next steps
* For a complete sample script that deploys a template, see [Resource Manager template deployment script](resource-manager-samples-powershell-deploy.md).
* To define parameters in template, see [Authoring templates](resource-group-authoring-templates.md#parameters).
* For tips on resolving common deployment errors, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](resource-manager-common-deployment-errors.md).
* For information about deploying a template that requires a SAS token, see [Deploy private template with SAS token](resource-manager-powershell-sas-token.md).
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

