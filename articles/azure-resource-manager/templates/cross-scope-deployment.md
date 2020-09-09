---
title: Deploy resources across scopes
description: Shows how to target more than one scope during a deployment. The scope can be a tenant, management groups, subscriptions, and resource groups.
ms.topic: conceptual
ms.date: 07/28/2020
---

# Deploy Azure resources across scopes

With Azure Resource Manager templates (ARM templates), you can deploy to more than one scope in a single deployment. The available scopes are a tenant, management groups, subscriptions, and resource groups. For example, you can deploy resources to one resource group, and in the same template deploy resources to another resource group. Or, you can deploy resources to a management group and also deploy resources to a resource group within that management group.

You use [nested or linked templates](linked-templates.md) to specify scopes that are different than the primary scope for the deployment operation.

## Available scopes

The scope that you use for the deployment operation determines which other scopes are available. You can deploy to the [tenant](deploy-to-tenant.md), [management group](deploy-to-management-group.md), [subscription](deploy-to-subscription.md), or [resource group](deploy-powershell.md). From the primary deployment level, you can't go up levels in the hierarchy. For example, if you deploy to a subscription, you can't step up a level to deploy resources to a management group. However, you can deploy to the management group and step down levels to deploy to a subscription or resource group.

For every scope, the user deploying the template must have the required permissions to create resources.

## Cross resource groups

To target a resource group that is different than the one for parent template, use a [nested or linked template](linked-templates.md). Within the deployment resource type, specify values for the subscription ID and resource group that you want the nested template to deploy to. The resource groups can exist in different subscriptions.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/crosssubscription.json" range="38-43" highlight="5-6":::

If you don't specify the subscription ID or resource group, the subscription and resource group from the parent template are used. All the resource groups must exist before running the deployment.

> [!NOTE]
> You can deploy to **800 resource groups** in a single deployment. Typically, this limitation means you can deploy to one resource group specified for the parent template, and up to 799 resource groups in nested or linked deployments. However, if your parent template contains only nested or linked templates and does not itself deploy any resources, then you can include up to 800 resource groups in nested or linked deployments.

The following example deploys two storage accounts. The first storage account is deployed to the resource group specified in the deployment operation. The second storage account is deployed to the resource group specified in the `secondResourceGroup` and `secondSubscriptionID` parameters:

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/crosssubscription.json":::

If you set `resourceGroup` to the name of a resource group that doesn't exist, the deployment fails.

To test the preceding template and see the results, use PowerShell or Azure CLI.

# [PowerShell](#tab/azure-powershell)

To deploy two storage accounts to two resource groups in the **same subscription**, use:

```azurepowershell-interactive
$firstRG = "primarygroup"
$secondRG = "secondarygroup"

New-AzResourceGroup -Name $firstRG -Location southcentralus
New-AzResourceGroup -Name $secondRG -Location eastus

New-AzResourceGroupDeployment `
  -ResourceGroupName $firstRG `
  -TemplateUri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/crosssubscription.json `
  -storagePrefix storage `
  -secondResourceGroup $secondRG `
  -secondStorageLocation eastus
```

To deploy two storage accounts to **two subscriptions**, use:

```azurepowershell-interactive
$firstRG = "primarygroup"
$secondRG = "secondarygroup"

$firstSub = "<first-subscription-id>"
$secondSub = "<second-subscription-id>"

Select-AzSubscription -Subscription $secondSub
New-AzResourceGroup -Name $secondRG -Location eastus

Select-AzSubscription -Subscription $firstSub
New-AzResourceGroup -Name $firstRG -Location southcentralus

New-AzResourceGroupDeployment `
  -ResourceGroupName $firstRG `
  -TemplateUri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/crosssubscription.json `
  -storagePrefix storage `
  -secondResourceGroup $secondRG `
  -secondStorageLocation eastus `
  -secondSubscriptionID $secondSub
```

# [Azure CLI](#tab/azure-cli)

To deploy two storage accounts to two resource groups in the **same subscription**, use:

```azurecli-interactive
firstRG="primarygroup"
secondRG="secondarygroup"

az group create --name $firstRG --location southcentralus
az group create --name $secondRG --location eastus
az deployment group create \
  --name ExampleDeployment \
  --resource-group $firstRG \
  --template-uri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/crosssubscription.json \
  --parameters storagePrefix=tfstorage secondResourceGroup=$secondRG secondStorageLocation=eastus
```

To deploy two storage accounts to **two subscriptions**, use:

```azurecli-interactive
firstRG="primarygroup"
secondRG="secondarygroup"

firstSub="<first-subscription-id>"
secondSub="<second-subscription-id>"

az account set --subscription $secondSub
az group create --name $secondRG --location eastus

az account set --subscription $firstSub
az group create --name $firstRG --location southcentralus

az deployment group create \
  --name ExampleDeployment \
  --resource-group $firstRG \
  --template-uri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/crosssubscription.json \
  --parameters storagePrefix=storage secondResourceGroup=$secondRG secondStorageLocation=eastus secondSubscriptionID=$secondSub
```

---

## Cross subscription, management group, and tenant

When specifying different scopes for subscription, management group and tenant level deployments, you use nested deployments like the example for resource groups. The properties that you use for specifying scope can differ. Those scenarios are covered in the articles about the levels of deployments. For more information, see:

* [Create resource groups and resources at the subscription level](deploy-to-subscription.md)
* [Create resources at the management group level](deploy-to-management-group.md)
* [Create resources at the tenant level](deploy-to-tenant.md)

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
