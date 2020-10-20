---
title: Deploy resources across scopes
description: Shows how to target more than one scope during a deployment. The scope can be a tenant, management groups, subscriptions, and resource groups.
ms.topic: conceptual
ms.date: 10/19/2020
---

# Deploy Azure resources across scopes

With Azure Resource Manager templates (ARM templates), you can deploy to more than one scope in a single deployment. The available scopes are a tenant, management groups, subscriptions, and resource groups. For example, you can deploy resources to one resource group, and in the same template deploy resources to another resource group. Or, you can deploy resources to a management group and also deploy resources to a resource group within that management group.

You use [nested or linked templates](linked-templates.md) to specify scopes that are different than the primary scope for the deployment operation.

## Available scopes

You can target your deployment to a resource group, subscription, management group, or tenant. In most cases, you'll target deployment to a resource group. To apply policies and role assignments across a larger scope, use subscription, management group, or tenant deployments. When deploying to a subscription, you can create a resource group and deploy resources to it.

Depending on the scope of the deployment, you use different commands.

* To deploy to a **resource group**, use [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment):

  ```azurepowershell
  New-AzResourceGroupDeployment -ResourceGroupName <resource-group-name> -TemplateFile <path-to-template>
  ```

* To deploy to a **subscription**, use New-AzSubscriptionDeployment:

  ```azurepowershell
  New-AzSubscriptionDeployment -Location <location> -TemplateFile <path-to-template>
  ```

  For more information about subscription level deployments, see [Create resource groups and resources at the subscription level](deploy-to-subscription.md).

* To deploy to a **management group**, use [New-AzManagementGroupDeployment](/powershell/module/az.resources/New-AzManagementGroupDeployment).

  ```azurepowershell
  New-AzManagementGroupDeployment -Location <location> -TemplateFile <path-to-template>
  ```

  For more information about management group level deployments, see [Create resources at the management group level](deploy-to-management-group.md).

* To deploy to a **tenant**, use [New-AzTenantDeployment](/powershell/module/az.resources/new-aztenantdeployment).

  ```azurepowershell
  New-AzTenantDeployment -Location <location> -TemplateFile <path-to-template>
  ```

  For more information about tenant level deployments, see [Create resources at the tenant level](deploy-to-tenant.md).

* To deploy to a **resource group**, use [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create):

  ```azurecli-interactive
  az deployment group create --resource-group <resource-group-name> --template-file <path-to-template>
  ```

* To deploy to a **subscription**, use [az deployment sub create](/cli/azure/deployment/sub#az-deployment-sub-create):

  ```azurecli-interactive
  az deployment sub create --location <location> --template-file <path-to-template>
  ```

  For more information about subscription level deployments, see [Create resource groups and resources at the subscription level](deploy-to-subscription.md).

* To deploy to a **management group**, use [az deployment mg create](/cli/azure/deployment/mg#az-deployment-mg-create):

  ```azurecli-interactive
  az deployment mg create --location <location> --template-file <path-to-template>
  ```

  For more information about management group level deployments, see [Create resources at the management group level](deploy-to-management-group.md).

* To deploy to a **tenant**, use [az deployment tenant create](/cli/azure/deployment/tenant#az-deployment-tenant-create):

  ```azurecli-interactive
  az deployment tenant create --location <location> --template-file <path-to-template>
  ```

  For more information about tenant level deployments, see [Create resources at the tenant level](deploy-to-tenant.md).

For every scope, the user deploying the template must have the required permissions to create resources.

## How functions resolve in scopes

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

* To understand how to define parameters in your template, see [Understand the structure and syntax of Azure Resource Manager templates](template-syntax.md).
* For tips on resolving common deployment errors, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](common-deployment-errors.md).
* For information about deploying a template that requires a SAS token, see [Deploy private template with SAS token](secure-template-with-sas-token.md).
