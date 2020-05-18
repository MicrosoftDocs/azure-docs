---
title: Deploy resources cross subscription & resource group
description: Shows how to target more than one Azure subscription and resource group during deployment.
ms.topic: conceptual
ms.date: 05/18/2020
---

# Deploy Azure resources across subscriptions or resource groups

Resource Manager enables you to deploy to more than one resource group in a single deployment. You use nested templates to specify resource groups that are different than the resource group in the deployment operation. The resource groups can exist in different subscriptions.

> [!NOTE]
> You can deploy to **800 resource groups** in a single deployment. Typically, this limitation means you can deploy to one resource group specified for the parent template, and up to 799 resource groups in nested or linked deployments. However, if your parent template contains only nested or linked templates and does not itself deploy any resources, then you can include up to 800 resource groups in nested or linked deployments.

## Specify subscription and resource group

To target a resource group that is different than the one for parent template, use a [nested or linked template](linked-templates.md). Within the deployment resource type, specify values for the subscription ID and resource group that you want the nested template to deploy to.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/crosssubscription.json" range="38-43" highlight="5-6":::

If you don't specify the subscription ID or resource group, the subscription and resource group from the parent template are used. All the resource groups must exist before running the deployment.

The account that deploys the template must have permission to deploy to the specified subscription ID. If the specified subscription exists in a different Azure Active Directory tenant, you must [add guest users from another directory](../../active-directory/active-directory-b2b-what-is-azure-ad-b2b.md).

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

## Use functions

The [resourceGroup()](template-functions-resource.md#resourcegroup) and [subscription()](template-functions-resource.md#subscription) functions resolve differently based on how you specify the template. When you link to an external template, the functions always resolve to the scope for that template. When you nest a template within a parent template, use the `expressionEvaluationOptions` property to specify whether the functions resolve to the resource group and subscription for the parent template or the nested template. Set the property to `inner` to resolve to the scope for the nested template. Set the property to `outer` to resolve to the scope of the parent template.

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
