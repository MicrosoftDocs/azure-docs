---
title: Deploy Azure resources to multiple resource groups | Microsoft Docs
description: Shows how to target more than one Azure resource group during deployment.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: ''

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/03/2017
ms.author: tomfitz

---

# Deploy Azure resources to more than one resource group

Typically, you deploy all the resources in your template to a single resource group. However, there are scenarios where you want to deploy a set of resources together but place them in different resource groups. For example, you may want to deploy the backup virtual machine for Azure Site Recovery to a separate resource group and location. Resource Manager enables you to use nested templates to target different resource groups than the resource group used for the parent template.

The resource group is the lifecycle container for the application and its collection of resources. You create the resource group outside of the template, and specify the resource group to target during deployment. For an introduction to resource groups, see [Azure Resource Manager overview](resource-group-overview.md).

## Example template

To target a different resource, you must use a nested or linked template during deployment. The `Microsoft.Resources/deployments` resource type provides a `resourceGroup` parameter that enables you to specify a different resource group for the nested deployment. All the resource groups must exist before running the deployment. The following example deploys two storage accounts - one in the resource group specified during deployment, and one in a resource group named `crossResourceGroupDeployment`:

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "name": "[concat('storage', uniqueString(resourceGroup().id))]",
            "type": "Microsoft.Storage/storageAccounts",
            "apiVersion": "2016-05-01",
            "sku": {
                "name": "Standard_LRS"
            },
            "kind": "Storage",
            "location": "[resourceGroup().location]",
            "tags": {},
            "properties": {}
        },
        {
            "apiVersion": "2017-05-10",
            "name": "nestedTemplate",
            "type": "Microsoft.Resources/deployments",
            "resourceGroup": "differentResourceGroup",
            "properties": {
                "mode": "incremental",
                "template": {
                    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
                    "contentVersion": "1.0.0.0",
                    "resources": [
                        {
                            "name": "[concat('storage', uniqueString(resourceGroup().id))]",
                            "type": "Microsoft.Storage/storageAccounts",
                            "apiVersion": "2016-05-01",
                            "sku": {
                                "name": "Standard_LRS"
                            },
                            "kind": "Storage",
                            "location": "[resourceGroup().location]",
                            "tags": {},
                            "properties": {}
                        }
                    ],
                    "outputs": {}
                }
            }
        }
    ],
    "outputs": {}
}
```

If you set `resourceGroup` to the name of a resource group that does not exist, the deployment fails. If you do not provide a value for `resourceGroup`, Resource Manager uses the parent resource group.  

## Deploy the template

To deploy the example template, you can use either Azure PowerShell or Azure CLI. The examples assume you have saved the template locally as a file named **crossrgdeployment.json**.

For PowerShell:

```powershell
Login-AzureRmAccount

New-AzureRmResourceGroup -Name mainResourceGroup -Location "South Central US"
New-AzureRmResourceGroup -Name differentResourceGroup -Location "Central US"
New-AzureRmResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName mainResourceGroup `
  -TemplateFile c:\MyTemplates\crossrgdeployment.json
```

For Azure CLI:

```azurecli
az login

az group create --name mainResourceGroup --location "South Central US"
az group create --name differentResourceGroup --location "Central US"
az group deployment create \
    --name ExampleDeployment \
    --resource-group mainResourceGroup \
    --template-file crossrgdeployment.json
```

After deployment completes, you see two resource groups. Each resource group contains a storage account.

## Next steps

* To understand how to define parameters in your template, see [Understand the structure and syntax of Azure Resource Manager templates](resource-group-authoring-templates.md).
* For tips on resolving common deployment errors, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](resource-manager-common-deployment-errors.md).
* For information about deploying a template that requires a SAS token, see [Deploy private template with SAS token](resource-manager-powershell-sas-token.md).
