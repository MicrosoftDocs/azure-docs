---
title: Template functions in scoped deployments
description: Describes how template functions are resolved in scoped deployments. The scope can be a tenant, management groups, subscriptions, and resource groups.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 06/23/2023
---

# ARM template functions in deployment scopes

With Azure Resource Manager templates (ARM templates), you can deploy to resource groups, subscriptions, management groups, or tenants. Generally, [ARM template functions](template-functions.md) work the same for all scopes. This article describes the differences that exist for some functions depending on the scope.

## Supported functions

When deploying to different scopes, there are some important considerations:

* The [resourceGroup()](template-functions-resource.md#resourcegroup) function is **supported** for resource group deployments.
* The [subscription()](template-functions-resource.md#subscription) function is **supported** for resource group and subscription deployments.
* The [reference()](template-functions-resource.md#reference) and [list()](template-functions-resource.md#list) functions are **supported** for all scopes.
* Use [resourceId()](template-functions-resource.md#resourceid) to get the ID for a resource deployed at the resources group.

  ```json
  "subnet": {
    "id": "[resourceId(parameters('virtualNetworkResourceGroup'), 'Microsoft.Network/virtualNetworks/subnets', parameters('virtualNetworkName'), parameters('subnet1Name'))]"
  }
  ```

* Use the [subscriptionResourceId()](template-functions-resource.md#subscriptionresourceid) function to get the ID for a resource deployed at the subscription.

  For example, to get the resource ID for a policy definition that is deployed to a subscription, use:

  ```json
  "roleDefinitionId": "[subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'acdd72a7-3385-48ef-bd42-f606fba81ae7')]"
  ```

* Use the [extensionResourceId()](template-functions-resource.md#extensionresourceid) function for resources that are implemented as extensions of the management group. Custom policy definitions that are deployed to the management group are extensions of the management group.

  To get the resource ID for a custom policy definition at the management group level, use:

  ```json
  "policyDefinitionId": "[extensionResourceId(variables('mgScope'), 'Microsoft.Authorization/policyDefinitions', parameters('policyDefinitionID'))]"
  ```

* Use the [tenantResourceId()](template-functions-resource.md#tenantresourceid) function to get the ID for a resource deployed at the tenant. Built-in policy definitions are tenant level resources. When assigning a built-in policy at the management group level, use the tenantResourceId function.

  To get the resource ID for a built-in policy definition, use:

  ```json
  "policyDefinitionId": "[tenantResourceId('Microsoft.Authorization/policyDefinitions', parameters('policyDefinitionID'))]"
  ```

## Function resolution in scopes

When you deploy to more than one scope, the [resourceGroup()](template-functions-resource.md#resourcegroup) and [subscription()](template-functions-resource.md#subscription) functions resolve differently based on how you specify the template. When you link to an external template, the functions always resolve to the scope for that template. When you nest a template within a parent template, use the `expressionEvaluationOptions` property to specify whether the functions resolve to the resource group and subscription for the parent template or the nested template. Set the property to `inner` to resolve to the scope for the nested template. Set the property to `outer` to resolve to the scope of the parent template.

The following table shows whether the functions resolve to the parent or embedded resource group and subscription.

| Template type | Scope | Resolution |
| ------------- | ----- | ---------- |
| nested        | outer (default) | Parent resource group |
| nested        | inner | Sub resource group |
| linked        | N/A   | Sub resource group |

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/crossresourcegroupproperties.json) shows:

* nested template with default (outer) scope
* nested template with inner scope
* linked template

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/crossresourcegroupproperties.json":::

To test the preceding template and see the results, use PowerShell or Azure CLI.

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzResourceGroup -Name parentGroup -Location southcentralus
New-AzResourceGroup -Name inlineGroup -Location southcentralus
New-AzResourceGroup -Name linkedGroup -Location southcentralus

New-AzResourceGroupDeployment `
  -ResourceGroupName parentGroup `
  -TemplateUri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/crossresourcegroupproperties.json
```

The output from the preceding example is:

```output
 Name             Type                       Value
 ===============  =========================  ==========
 parentRG         String                     Parent resource group is parentGroup
 defaultScopeRG   String                     Default scope resource group is parentGroup
 innerScopeRG     String                     Inner scope resource group is inlineGroup
 linkedRG         String                     Linked resource group is linkedgroup
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group create --name parentGroup --location southcentralus
az group create --name inlineGroup --location southcentralus
az group create --name linkedGroup --location southcentralus

az deployment group create \
  --name ExampleDeployment \
  --resource-group parentGroup \
  --template-uri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/crossresourcegroupproperties.json
```

The output from the preceding example is:

```output
"outputs": {
  "defaultScopeRG": {
    "type": "String",
    "value": "Default scope resource group is parentGroup"
  },
  "innerScopeRG": {
    "type": "String",
    "value": "Inner scope resource group is inlineGroup"
  },
  "linkedRG": {
    "type": "String",
    "value": "Linked resource group is linkedGroup"
  },
  "parentRG": {
    "type": "String",
    "value": "Parent resource group is parentGroup"
  }
},
```

---

## Next steps

* To understand how to define parameters in your template, see [Understand the structure and syntax of ARM templates](./syntax.md).
* For tips on resolving common deployment errors, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](common-deployment-errors.md).
* For information about deploying a template that requires a SAS token, see [Deploy private ARM template with SAS token](secure-template-with-sas-token.md).
