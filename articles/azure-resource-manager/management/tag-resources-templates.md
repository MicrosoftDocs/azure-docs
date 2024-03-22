---
title: Tag resources, resource groups, and subscriptions with ARM templates
description: Shows how to use ARM templates to apply tags to Azure resources.
ms.topic: conceptual
ms.date: 03/19/2024
---

# Apply tags with ARM templates

This article describes how to use Azure Resource Manager templates (ARM templates) to tag resources, resource groups, and subscriptions during deployment. For tag recommendations and limitations, see [Use tags to organize your Azure resources and management hierarchy](tag-resources.md).

> [!NOTE]
> The tags you apply through an ARM template or Bicep file overwrite any existing tags.

## Apply values

The following example deploys a storage account with three tags. Two of the tags (`Dept` and `Environment`) are set to literal values. One tag (`LastDeployed`) is set to a parameter that defaults to the current date.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "utcShort": {
      "type": "string",
      "defaultValue": "[utcNow('d')]"
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-04-01",
      "name": "[concat('storage', uniqueString(resourceGroup().id))]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "tags": {
        "Dept": "Finance",
        "Environment": "Production",
        "LastDeployed": "[parameters('utcShort')]"
      },
      "properties": {}
    }
  ]
}
```

## Apply an object

You can define an object parameter that stores several tags and apply that object to the tag element. This approach provides more flexibility than the previous example because the object can have different properties. Each property in the object becomes a separate tag for the resource. The following example has a parameter named `tagValues` that's applied to the tag element.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "tagValues": {
      "type": "object",
      "defaultValue": {
        "Dept": "Finance",
        "Environment": "Production"
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-04-01",
      "name": "[concat('storage', uniqueString(resourceGroup().id))]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "tags": "[parameters('tagValues')]",
      "properties": {}
    }
  ]
}
```

## Apply a JSON string

To store many values in a single tag, apply a JSON string that represents the values. The entire JSON string is stored as one tag that can't exceed 256 characters. The following example has a single tag named `CostCenter` that contains several values from a JSON string:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-04-01",
      "name": "[concat('storage', uniqueString(resourceGroup().id))]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "tags": {
        "CostCenter": "{\"Dept\":\"Finance\",\"Environment\":\"Production\"}"
      },
      "properties": {}
    }
  ]
}
```

## Apply tags from resource group

To apply tags from a resource group to a resource, use the [resourceGroup()](../templates/template-functions-resource.md#resourcegroup) function. When you get the tag value, use the `tags[tag-name]` syntax instead of the `tags.tag-name` syntax, because some characters aren't parsed correctly in the dot notation.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-04-01",
      "name": "[concat('storage', uniqueString(resourceGroup().id))]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "tags": {
        "Dept": "[resourceGroup().tags['Dept']]",
        "Environment": "[resourceGroup().tags['Environment']]"
      },
      "properties": {}
    }
  ]
}
```

## Apply tags to resource groups or subscriptions

You can add tags to a resource group or subscription by deploying the `Microsoft.Resources/tags` resource type. You can apply the tags  to the target resource group or subscription you want to deploy. Each time you deploy the template you replace any previous tags.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "tagName": {
      "type": "string",
      "defaultValue": "TeamName"
    },
    "tagValue": {
      "type": "string",
      "defaultValue": "AppTeam1"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Resources/tags",
      "name": "default",
      "apiVersion": "2021-04-01",
      "properties": {
        "tags": {
          "[parameters('tagName')]": "[parameters('tagValue')]"
        }
      }
    }
  ]
}
```

To apply the tags to a resource group, use either Azure PowerShell or Azure CLI. Deploy to the resource group that you want to tag.

```azurepowershell-interactive
New-AzResourceGroupDeployment -ResourceGroupName exampleGroup -TemplateFile https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/tags.json
```

```azurecli-interactive
az deployment group create --resource-group exampleGroup --template-uri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/tags.json
```

To apply the tags to a subscription, use either PowerShell or Azure CLI. Deploy to the subscription that you want to tag.

```azurepowershell-interactive
New-AzSubscriptionDeployment -name tagresourcegroup -Location westus2 -TemplateUri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/tags.json
```

```azurecli-interactive
az deployment sub create --name tagresourcegroup --location westus2 --template-uri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/tags.json
```

For more information about subscription deployments, see [Create resource groups and resources at the subscription level](../templates/deploy-to-subscription.md).

The following template adds the tags from an object to either a resource group or subscription.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "tags": {
      "type": "object",
      "defaultValue": {
        "TeamName": "AppTeam1",
        "Dept": "Finance",
        "Environment": "Production"
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Resources/tags",
      "apiVersion": "2021-04-01",
      "name": "default",
      "properties": {
        "tags": "[parameters('tags')]"
      }
    }
  ]
}
```

## Next steps

* Not all resource types support tags. To determine if you can apply a tag to a resource type, see [Tag support for Azure resources](tag-support.md).
* For recommendations on how to implement a tagging strategy, see [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json).
* For tag recommendations and limitations, see [Use tags to organize your Azure resources and management hierarchy](tag-resources.md).
