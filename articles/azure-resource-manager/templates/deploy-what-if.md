---
title: Template deployment what-if
description: Determine what changes will happen to your resources before deploying an Azure Resource Manager template.
ms.topic: conceptual
ms.date: 03/20/2024
ms.custom: devx-track-azurepowershell, devx-track-azurecli, devx-track-arm-template
ms.devlang: azurecli
---

# ARM template deployment what-if operation

Before deploying an Azure Resource Manager template (ARM template), you can preview the changes that will happen. Azure Resource Manager provides the what-if operation to let you see how resources will change if you deploy the template. The what-if operation doesn't make any changes to existing resources. Instead, it predicts the changes if the specified template is deployed.

You can use the what-if operation with Azure PowerShell, Azure CLI, or REST API operations. What-if is supported for resource group, subscription, management group, and tenant level deployments.

### Training resources

To learn more about what-if, and for hands-on guidance, see [Preview Azure deployment changes by using what-if](/training/modules/arm-template-whatif).

[!INCLUDE [permissions](../../../includes/template-deploy-permissions.md)]

## What-if limits

What-if expands nested templates until these limits are reached:

- 500 nested templates.
- 800 resource groups in a cross resource-group deployment.
- 5 minutes taken for expanding the nested templates.

When one of the limits is reached, the remaining resources' [change type](#change-types) is set to **Ignore**.

## Install Azure PowerShell module

To use what-if in PowerShell, you must have version **4.2 or later of the Az module**.

To install the module, use:

```powershell
Install-Module -Name Az -Force
```

For more information about installing modules, see [Install Azure PowerShell](/powershell/azure/install-azure-powershell).

## Install Azure CLI module

To use what-if in Azure CLI, you must have Azure CLI 2.14.0 or later. If needed, [install the latest version of Azure CLI](/cli/azure/install-azure-cli).

## See results

When you use what-if in PowerShell or Azure CLI, the output includes color-coded results that help you see the different types of changes.

:::image type="content" source="./media/template-deploy-what-if/resource-manager-deployment-whatif-change-types.png" alt-text="Screenshot of Resource Manager template deployment what-if operation with full resource payload and change types.":::

The text output is:

```powershell
Resource and property changes are indicated with these symbols:
  - Delete
  + Create
  ~ Modify

The deployment will update the following scope:

Scope: /subscriptions/./resourceGroups/ExampleGroup

  ~ Microsoft.Network/virtualNetworks/vnet-001 [2018-10-01]
    - tags.Owner: "Team A"
    ~ properties.addressSpace.addressPrefixes: [
      - 0: "10.0.0.0/16"
      + 0: "10.0.0.0/15"
      ]
    ~ properties.subnets: [
      - 0:

          name:                     "subnet001"
          properties.addressPrefix: "10.0.0.0/24"

      ]

Resource changes: 1 to modify.
```

> [!NOTE]
> The what-if operation can't resolve the [reference function](template-functions-resource.md#reference). Every time you set a property to a template expression that includes the reference function, what-if reports the property will change. This behavior happens because what-if compares the current value of the property (such as `true` or `false` for a boolean value) with the unresolved template expression. Obviously, these values will not match. When you deploy the template, the property will only change when the template expression resolves to a different value.

## What-if commands

### Azure PowerShell

To preview changes before deploying a template, use [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) or [New-AzSubscriptionDeployment](/powershell/module/az.resources/new-azdeployment). Add the `-Whatif` switch parameter to the deployment command.

- `New-AzResourceGroupDeployment -Whatif` for resource group deployments

- `New-AzSubscriptionDeployment -Whatif` and `New-AzDeployment -Whatif` for subscription level deployments

You can use the `-Confirm` switch parameter to preview the changes and get prompted to continue with the deployment.

- `New-AzResourceGroupDeployment -Confirm` for resource group deployments
- `New-AzSubscriptionDeployment -Confirm` and `New-AzDeployment -Confirm` for subscription level deployments

The preceding commands return a text summary that you can manually inspect. To get an object that you can programmatically inspect for changes, use [Get-AzResourceGroupDeploymentWhatIfResult](/powershell/module/az.resources/get-azresourcegroupdeploymentwhatifresult) or [Get-AzSubscriptionDeploymentWhatIfResult](/powershell/module/az.resources/get-azdeploymentwhatifresult).

- `$results = Get-AzResourceGroupDeploymentWhatIfResult` for resource group deployments
- `$results = Get-AzSubscriptionDeploymentWhatIfResult` or `$results = Get-AzDeploymentWhatIfResult` for subscription level deployments

### Azure CLI

To preview changes before deploying a template, use:

- [az deployment group what-if](/cli/azure/deployment/group#az-deployment-group-what-if) for resource group deployments
- [az deployment sub what-if](/cli/azure/deployment/sub#az-deployment-sub-what-if) for subscription level deployments
- [az deployment mg what-if](/cli/azure/deployment/mg#az-deployment-mg-what-if) for management group deployments
- [az deployment tenant what-if](/cli/azure/deployment/tenant#az-deployment-tenant-what-if) for tenant deployments

You can use the `--confirm-with-what-if` switch (or its short form `-c`) to preview the changes and get prompted to continue with the deployment. Add this switch to:

- [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create)
- [az deployment sub create](/cli/azure/deployment/sub#az-deployment-sub-create).
- [az deployment mg create](/cli/azure/deployment/mg#az-deployment-mg-create)
- [az deployment tenant create](/cli/azure/deployment/tenant#az-deployment-tenant-create)

For example, use `az deployment group create --confirm-with-what-if` or `-c` for resource group deployments.

The preceding commands return a text summary that you can manually inspect. To get a JSON object that you can programmatically inspect for changes, use the `--no-pretty-print` switch. For example, use `az deployment group what-if --no-pretty-print` for resource group deployments.

If you want to return the results without colors, open your [Azure CLI configuration](/cli/azure/azure-cli-configuration) file. Set **no_color** to **yes**.

### Azure REST API

For REST API, use:

- [Deployments - What If](/rest/api/resources/deployments/whatif) for resource group deployments
- [Deployments - What If At Subscription Scope](/rest/api/resources/deployments/whatifatsubscriptionscope) for subscription deployments
- [Deployments - What If At Management Group Scope](/rest/api/resources/deployments/whatifatmanagementgroupscope) for management group deployments
- [Deployments - What If At Tenant Scope](/rest/api/resources/deployments/whatifattenantscope) for tenant deployments.

## Change types

The what-if operation lists seven different types of changes:

- **Create**: The resource doesn't currently exist but is defined in the template. The resource will be created.
- **Delete**: This change type only applies when using [complete mode](deployment-modes.md) for deployment. The resource exists, but isn't defined in the template. With complete mode, the resource will be deleted. Only resources that [support complete mode deletion](./deployment-complete-mode-deletion.md) are included in this change type.
- **Ignore**: The resource exists, but isn't defined in the template. The resource won't be deployed or modified. When you reach the limits for expanding nested templates, you will encounter this change type. See [What-if limits](#what-if-limits).
- **NoChange**: The resource exists, and is defined in the template. The resource will be redeployed, but the properties of the resource won't change. This change type is returned when [ResultFormat](#result-format) is set to `FullResourcePayloads`, which is the default value.
- **NoEffect**: The property is ready-only and will be ignored by the service. For example, the `sku.tier` property is always set to match `sku.name` in the [`Microsoft.ServiceBus`](/azure/templates/microsoft.servicebus/namespaces) namespace.
- **Modify**: The resource exists, and is defined in the template. The resource will be redeployed, and the properties of the resource will change. This change type is returned when [ResultFormat](#result-format) is set to `FullResourcePayloads`, which is the default value.
- **Deploy**: The resource exists, and is defined in the template. The resource will be redeployed. The properties of the resource may or may not change. The operation returns this change type when it doesn't have enough information to determine if any properties will change. You only see this condition when [ResultFormat](#result-format) is set to `ResourceIdOnly`.

## Result format

You control the level of detail that is returned about the predicted changes. You have two options:

- **FullResourcePayloads** - returns a list of resources that will change and details about the properties that will change
- **ResourceIdOnly** - returns a list of resources that will change

The default value is **FullResourcePayloads**.

For PowerShell deployment commands, use the `-WhatIfResultFormat` parameter. In the programmatic object commands, use the `ResultFormat` parameter.

For Azure CLI, use the `--result-format` parameter.

The following results show the two different output formats:

- Full resource payloads

  ```powershell
  Resource and property changes are indicated with these symbols:
    - Delete
    + Create
    ~ Modify

  The deployment will update the following scope:

  Scope: /subscriptions/./resourceGroups/ExampleGroup

    ~ Microsoft.Network/virtualNetworks/vnet-001 [2018-10-01]
      - tags.Owner: "Team A"
      ~ properties.addressSpace.addressPrefixes: [
        - 0: "10.0.0.0/16"
        + 0: "10.0.0.0/15"
        ]
      ~ properties.subnets: [
        - 0:
          name:                     "subnet001"
          properties.addressPrefix: "10.0.0.0/24"

        ]

  Resource changes: 1 to modify.
  ```

- Resource ID only

  ```powershell
  Resource and property changes are indicated with this symbol:
    ! Deploy

  The deployment will update the following scope:

  Scope: /subscriptions/./resourceGroups/ExampleGroup

    ! Microsoft.Network/virtualNetworks/vnet-001

  Resource changes: 1 to deploy.
  ```

## Run what-if operation

### Set up environment

To see how what-if works, let's runs some tests. First, deploy a [template that creates a virtual network](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/what-if/what-if-before.json). You'll use this virtual network to test how changes are reported by what-if.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup `
  -Name ExampleGroup `
  -Location centralus
New-AzResourceGroupDeployment `
  -ResourceGroupName ExampleGroup `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/what-if/what-if-before.json"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az group create \
  --name ExampleGroup \
  --location "Central US"
az deployment group create \
  --resource-group ExampleGroup \
  --template-uri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/what-if/what-if-before.json"
```

---

### Test modification

After the deployment completes, you're ready to test the what-if operation. This time you deploy a [template that changes the virtual network](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/what-if/what-if-after.json). It's missing one the original tags, a subnet has been removed, and the address prefix has changed.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Whatif `
  -ResourceGroupName ExampleGroup `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/what-if/what-if-after.json"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az deployment group what-if \
  --resource-group ExampleGroup \
  --template-uri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/what-if/what-if-after.json"
```

---

The what-if output appears similar to:

:::image type="content" source="./media/template-deploy-what-if/resource-manager-deployment-whatif-change-types.png" alt-text="Screenshot of Resource Manager template deployment what-if operation output showing changes.":::

The text output is:

```powershell
Resource and property changes are indicated with these symbols:
  - Delete
  + Create
  ~ Modify

The deployment will update the following scope:

Scope: /subscriptions/./resourceGroups/ExampleGroup

  ~ Microsoft.Network/virtualNetworks/vnet-001 [2018-10-01]
    - tags.Owner: "Team A"
    ~ properties.addressSpace.addressPrefixes: [
      - 0: "10.0.0.0/16"
      + 0: "10.0.0.0/15"
      ]
    ~ properties.subnets: [
      - 0:

        name:                     "subnet001"
        properties.addressPrefix: "10.0.0.0/24"

      ]

Resource changes: 1 to modify.
```

Notice at the top of the output that colors are defined to indicate the type of changes.

At the bottom of the output, it shows the tag Owner was deleted. The address prefix changed from 10.0.0.0/16 to 10.0.0.0/15. The subnet named subnet001 was deleted. Remember these changes weren't deployed. You see a preview of the changes that will happen if you deploy the template.

Some of the properties that are listed as deleted won't actually change. Properties can be incorrectly reported as deleted when they aren't in the template, but are automatically set during deployment as default values. This result is considered "noise" in the what-if response. The final deployed resource will have the values set for the properties. As the what-if operation matures, these properties will be filtered out of the result.

## Programmatically evaluate what-if results

Now, let's programmatically evaluate the what-if results by setting the command to a variable.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$results = Get-AzResourceGroupDeploymentWhatIfResult `
  -ResourceGroupName ExampleGroup `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/what-if/what-if-after.json"
```

You can see a summary of each change.

```azurepowershell
foreach ($change in $results.Changes)
{
  $change.Delta
}
```

# [Azure CLI](#tab/azure-cli)

```azurecli
results=$(az deployment group what-if --resource-group ExampleGroup --template-uri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/what-if/what-if-after.json" --no-pretty-print)
```

---

## Confirm deletion

The what-if operation supports using [deployment mode](deployment-modes.md). When set to complete mode, resources not in the template are deleted. The following example deploys a [template that has no resources defined](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/what-if/azuredeploy.json) in complete mode.

To preview changes before deploying a template, use the confirm switch parameter with the deployment command. If the changes are as you expected, respond that you want the deployment to complete.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -ResourceGroupName ExampleGroup `
  -Mode Complete `
  -Confirm `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/what-if/azuredeploy.json"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az deployment group create \
  --resource-group ExampleGroup \
  --mode Complete \
  --confirm-with-what-if \
  --template-uri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/what-if/azuredeploy.json"
```

---

Because no resources are defined in the template and the deployment mode is set to complete, the virtual network will be deleted.

:::image type="content" source="./media/template-deploy-what-if/resource-manager-deployment-whatif-output-mode-complete.png" alt-text="Screenshot of Resource Manager template deployment what-if operation output in deployment mode complete.":::

The text output is:

```powershell
Resource and property changes are indicated with this symbol:
  - Delete

The deployment will update the following scope:

Scope: /subscriptions/./resourceGroups/ExampleGroup

  - Microsoft.Network/virtualNetworks/vnet-001

      id:
"/subscriptions/./resourceGroups/ExampleGroup/providers/Microsoft.Network/virtualNet
works/vnet-001"
      location:        "centralus"
      name:            "vnet-001"
      tags.CostCenter: "12345"
      tags.Owner:      "Team A"
      type:            "Microsoft.Network/virtualNetworks"

Resource changes: 1 to delete.

Are you sure you want to execute the deployment?
[Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "Y"):
```

You see the expected changes and can confirm that you want the deployment to run.

## SDKs

You can use the what-if operation through the Azure SDKs.

- For Python, use [what-if](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2019_10_01.operations.deploymentsoperations).
- For Java, use [DeploymentWhatIf Class](/java/api/com.azure.resourcemanager.resources.models.deploymentwhatif).

- For .NET, use [DeploymentWhatIf Class](/dotnet/api/microsoft.azure.management.resourcemanager.models.deploymentwhatif).

## Next steps

- [ARM Deployment Insights](https://marketplace.visualstudio.com/items?itemName=AuthorityPartnersInc.arm-deployment-insights) extension provides an easy way to integrate the what-if operation in your Azure DevOps pipeline.
- To use the what-if operation in a pipeline, see [Test ARM templates with What-If in a pipeline](https://4bes.nl/2021/03/06/test-arm-templates-with-what-if/).
- If you notice incorrect results from the what-if operation, please report the issues at [https://aka.ms/whatifissues](https://aka.ms/whatifissues).
- For a Learn module that covers using what if, see [Preview changes and validate Azure resources by using what-if and the ARM template test toolkit](/training/modules/arm-template-test/).
