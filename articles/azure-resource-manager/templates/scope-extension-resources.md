---
title: Scope on extension resource types
description: Describes how to use the scope property when deploying extension resource types.
ms.topic: how-to
ms.date: 07/15/2025
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# How to set scope for extension resources in ARM templates

Learn how to use the `scope` property with extension resource types in Azure Resource Manager (ARM) templates. Extension resources let you modify or add capabilities to other resources, such as assigning a role or applying a lock.

Extension resources are a powerful way to manage permissions, policies, and other settings on Azure resources. For a full list, see [Resource types that extend capabilities of other resources](../management/extension-resource-types.md).

The `scope` property is only available to extension resource types. To specify a different scope for a resource type that isn't an extension type, use a nested or linked deployment. For more information, see:

- [Resource group deployments](deploy-to-resource-group.md)
- [Subscription deployments](deploy-to-subscription.md)
- [Management group deployments](deploy-to-management-group.md)
- [Tenant deployments](deploy-to-tenant.md)

## Apply at deployment scope

To apply an extension resource type at the target deployment scope, you add the resource to your template, as would with any resource type. The available scopes are:

- Resource group
- Subscription
- Management group
- Tenant

The following template deploys a lock.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Authorization/locks",
      "apiVersion": "2020-05-01",
      "name": "rgLock",
      "properties": {
        "level": "CanNotDelete",
        "notes": "Resource Group should not be deleted."
      }
    }
  ]
}
```

When deployed to a resource group, it locks the resource group.

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az deployment group create \
  --resource-group ExampleGroup \
  --template-uri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/scope/locktargetscope.json"
```

### [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
 New-AzResourceGroupDeployment `
  -ResourceGroupName ExampleGroup `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/scope/locktargetscope.json"
```

---

The next example assigns a role.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
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
      "allowedValues": [
        "Owner",
        "Contributor",
        "Reader"
      ],
      "metadata": {
        "description": "Built-in role to assign"
      }
    },
    "roleNameGuid": {
      "type": "string",
      "metadata": {
        "description": "The role assignment name"
      }
    }
  },
  "variables": {
    "roleDefinitionIds": {
      "Owner": "[format('/subscriptions/{0}/providers/Microsoft.Authorization/roleDefinitions/8e3af657-a8ff-443c-a75c-2fe8c4bcb635', subscription().subscriptionId)]",
      "Contributor": "[format('/subscriptions/{0}/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c', subscription().subscriptionId)]",
      "Reader": "[format('/subscriptions/{0}/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7', subscription().subscriptionId)]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Authorization/roleAssignments",
      "apiVersion": "2022-04-01",
      "name": "[parameters('roleNameGuid')]",
      "properties": {
        "roleDefinitionId": "[variables('roleDefinitionIds')[parameters('builtInRoleType')]]",
        "principalId": "[parameters('principalId')]"
      }
    }
  ]
}
```

When deployed to a subscription, it assigns the role to the subscription.

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az deployment sub create \
  --name demoSubDeployment \
  --location centralus \
  --template-uri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/scope/roletargetscope.json"
```

### [PowerShell](#tab/azure-powershell)

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
      "allowedValues": [
        "Owner",
        "Contributor",
        "Reader"
      ],
      "metadata": {
        "description": "Built-in role to assign"
      }
    },
    "roleNameGuid": {
      "type": "string",
      "defaultValue": "[newGuid()]",
      "metadata": {
        "description": "A new GUID used to identify the role assignment"
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "The location for the resources"
      }
    }
  },
  "variables": {
    "roleDefinitionIds": {
      "Owner": "[format('/subscriptions/{0}/providers/Microsoft.Authorization/roleDefinitions/8e3af657-a8ff-443c-a75c-2fe8c4bcb635', subscription().subscriptionId)]",
      "Contributor": "[format('/subscriptions/{0}/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c', subscription().subscriptionId)]",
      "Reader": "[format('/subscriptions/{0}/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7', subscription().subscriptionId)]"
    },
    "storageName": "[format('storage{0}', uniqueString(resourceGroup().id))]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2025-01-01",
      "name": "[variables('storageName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "properties": {}
    },
    {
      "type": "Microsoft.Authorization/roleAssignments",
      "apiVersion": "2022-04-01",
      "scope": "[format('Microsoft.Storage/storageAccounts/{0}', variables('storageName'))]",
      "name": "[parameters('roleNameGuid')]",
      "properties": {
        "roleDefinitionId": "[variables('roleDefinitionIds')[parameters('builtInRoleType')]]",
        "principalId": "[parameters('principalId')]"
      },
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', variables('storageName'))]"
      ]
    }
  ]
}
```

The resourceGroup and subscription properties are only allowed on nested or linked deployments. These properties aren't allowed on individual resources. Use nested or linked deployments if you want to deploy an extension resource with the scope set to a resource in a different resource group.

## Next steps

- To understand how to define parameters in your template, see [Understand the structure and syntax of ARM templates](./syntax.md).
- For tips on resolving common deployment errors, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](common-deployment-errors.md).
- For information about deploying a template that requires a SAS token, see [Deploy private ARM template with SAS token](secure-template-with-sas-token.md).
