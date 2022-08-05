---
title: Scope on extension resource types
description: Describes how to use the scope property when deploying extension resource types.
ms.topic: conceptual
ms.date: 07/11/2022
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Setting scope for extension resources in ARM templates

An extension resource is a resource that modifies another resource. For example, you can assign a role to a resource. The role assignment is an extension resource type.

For a full list of extension resource types, see [Resource types that extend capabilities of other resources](../management/extension-resource-types.md).

This article shows how to set the scope for an extension resource type when deployed with an Azure Resource Manager template (ARM template). It describes the scope property that is available for extension resources when applying to a resource.

> [!NOTE]
> The scope property is only available to extension resource types. To specify a different scope for a resource type that isn't an extension type, use a nested or linked deployment. For more information, see [resource group deployments](deploy-to-resource-group.md), [subscription deployments](deploy-to-subscription.md), [management group deployments](deploy-to-management-group.md), and [tenant deployments](deploy-to-tenant.md).

## Apply at deployment scope

To apply an extension resource type at the target deployment scope, you add the resource to your template, as would with any resource type. The available scopes are [resource group](deploy-to-resource-group.md), [subscription](deploy-to-subscription.md), [management group](deploy-to-management-group.md), and [tenant](deploy-to-tenant.md). The deployment scope must support the resource type.

The following template deploys a lock.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/locktargetscope.json":::

When deployed to a resource group, it locks the resource group.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az deployment group create \
  --resource-group ExampleGroup \
  --template-uri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/scope/locktargetscope.json"
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
 New-AzResourceGroupDeployment `
  -ResourceGroupName ExampleGroup `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/scope/locktargetscope.json"
```

---

The next example assigns a role.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/roletargetscope.json":::

When deployed to a subscription, it assigns the role to the subscription.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az deployment sub create \
  --name demoSubDeployment \
  --location centralus \
  --template-uri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/scope/roletargetscope.json"
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzSubscriptionDeployment `
  -Name demoSubDeployment `
  -Location centralus `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/scope/roletargetscope.json"
```

---

## Apply to resource

To apply an extension resource to a resource, use the `scope` property. Set the scope property to the name of the resource you're adding the extension to. The scope property is a root property for the extension resource type.

The following example creates a storage account and applies a role to it.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "principalId": {
      "type": "string",
      "metadata": {
        "description": "The principal to assign the role to"
      }
    },
    "builtInRoleType": {
      "type": "string",
      "metadata": {
        "description": "Built-in role to assign",
        "allowedValues": [ "Owner", "Contributor", "Reader" ]
      }
    },
    "location": {
      "type": "string",
      "metadata": {
        "description": "The resource region"
      },
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "variables": {
    "role": [
      {
        "Owner": "[concat('/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/8e3af657-a8ff-443c-a75c-2fe8c4bcb635')]"
      },
      {
        "Contributor": "[concat('/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c')]"
      },
      {
        "Reader": "[concat('/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7')]"
      }
    ],
    "uniqueStorageName": "[concat('storage', guid(resourceGroup().id))]",
    "storageApiVersion": "2019-04-01"
  },
  "resources": [
    {
      "name": "[variables('uniqueStorageName')]",
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "[variables('storageApiVersion')]",
      "sku": {
        "name": "Standard_GRS",
        "tier": "Standard"
      },
      "kind": "StorageV2",
      "location": "[parameters('location')]",
      "properties": {}
    },
    {
      "type": "Microsoft.Authorization/roleAssignments",
      "apiVersion": "2018-09-01-preview",
      "name": "[guid(concat(parameters('principalId'),  variables('role')[parameters('builtInRoleType')]))]",
      "scope": "[variables('uniqueStorageName')]",
      "properties": {
        "roleDefinitionId": "[variables('role')[parameters('builtInRoleType')]]",
        "principalId": "[parameters('principalId')]"
      }
    }
  ]
}

```

The resourceGroup and subscription properties are only allowed on nested or linked deployments. These properties are not allowed on individual resources. Use nested or linked deployments if you want to deploy an extension resource with the scope set to a resource in a different resource group.

## Next steps

* To understand how to define parameters in your template, see [Understand the structure and syntax of ARM templates](./syntax.md).
* For tips on resolving common deployment errors, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](common-deployment-errors.md).
* For information about deploying a template that requires a SAS token, see [Deploy private ARM template with SAS token](secure-template-with-sas-token.md).
