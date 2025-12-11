---
title: 'Bicep What-If: Preview Changes Before Deployment'
description: Determine what changes will happen to your resources before deploying a Bicep file.
ms.topic: article
ms.date: 12/10/2025
ms.custom:
  - devx-track-bicep, devx-track-azurecli, devx-track-azurepowershell
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:08/19/2025
  - sfi-image-nochange
---

# Bicep What-If: Preview Changes Before Deployment

Before deploying a Bicep file, you can preview the changes that will happen. Azure Resource Manager (ARM) provides the what-if operation to let you see how resources will change if you deploy the Bicep file. The what-if operation doesn't make any changes to existing resources. Instead, it predicts the changes if the specified Bicep file is deployed.

You can use the what-if operation with [Visual Studio Code](./visual-studio-code.md#deployment-pane), Azure PowerShell, Azure CLI, or REST API operations. What-if is supported for resource group, subscription, management group, and tenant level deployments.

During What-If operations, the evaluation and expansion of `templateLink` aren't supported. As a result, any resources deployed using template links within nested deployments, including template spec references, won't be visible in the What-If operation results.

## Prerequisites

[!INCLUDE [permissions](../../../includes/template-deploy-permissions.md)]

### Installation

# [Azure CLI](#tab/azure-cli)

To use what-if in Azure CLI, you must have Azure CLI 2.14.0 or later. If needed, [install the latest version of Azure CLI](/cli/azure/install-azure-cli).

# [PowerShell](#tab/azure-powershell)

To use what-if in PowerShell, you must have version **4.2 or later of the Az module**.

To install the module, use:

```powershell
Install-Module -Name Az -Force
```

For more information about installing modules, see [Install Azure PowerShell](/powershell/azure/install-azure-powershell).

---

## Limitations

What-if expands nested templates until these limits are reached:

- 500 nested templates.
- 800 resource groups in a cross resource-group deployment.
- 5 minutes taken for expanding the nested templates.

When one of the limits is reached, the remaining resources' [change type](#change-types) is set to **Ignore**.

### Short-circuiting

The what-if operation in Bicep deployments may encounter "short-circuiting," a scenario where the service cannot fully analyze a module or resource due to the deployment's structure or dependencies on external state. Short-circuiting of an individual resource occurs when its resource ID or API version cannot be calculated outside the deployment context, often due to unresolved expressions or external dependencies. For more information, see [Unevaluated expressions](#unevaluated-expressions). While rare, short-circuiting of modules or nested deployment resources can also happen, resulting in all resources within the module being excluded from the what-if analysis results. In such cases, the API response includes a diagnostic message to indicate the issue.

## Running the what-if operation

Using a recent version of the Az PowerShell module (13.1.0 or later) or the Azure CLI (2.75.0 or later) will provide diagnostics when what-if cannot analyze part of the deployment. Earlier versions of these tools behave the same way, but they do not display the diagnostics. For example, if you use CLI version 2.74.0, the issue still occurs-it just happens silently.

### What-if commands

# [Azure CLI](#tab/azure-cli)

To preview changes before deploying a Bicep file, use:

- [az deployment group what-if](/cli/azure/deployment/group#az-deployment-group-what-if) for resource group deployments
- [az deployment sub what-if](/cli/azure/deployment/sub#az-deployment-sub-what-if) for subscription level deployments
- [az deployment mg what-if](/cli/azure/deployment/mg#az-deployment-mg-what-if) for management group deployments
- [az deployment tenant what-if](/cli/azure/deployment/tenant#az-deployment-tenant-what-if) for tenant deployments

Azure CLI version **2.76.0 or later** introduces the `--validation-level` switch to determine how thoroughly ARM validates the Bicep template during this process. It accepts the following values:

- **Provider** (default): Performs full validation, including template syntax, resource definitions, dependencies, and permission checks to ensure you have sufficient permissions to deploy all resources in the template. 
- **ProviderNoRbac**: Performs full validation of the template and resources, similar to Provider, but only checks for read permissions on each resource instead of full deployment permissions. This is useful when you want to validate resource configurations without requiring full access.
- **Template**: Performs static validation only, checking template syntax and structure while skipping preflight checks (e.g., resource availability) and permission checks. This is less thorough, potentially missing issues that could cause deployment failures.

You can use the `--confirm-with-what-if` switch (or its short form `-c`) to preview the changes and get prompted to continue with the deployment. Add this switch to:

- [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create)
- [az deployment sub create](/cli/azure/deployment/sub#az-deployment-sub-create).
- [az deployment mg create](/cli/azure/deployment/mg#az-deployment-mg-create)
- [az deployment tenant create](/cli/azure/deployment/tenant#az-deployment-tenant-create)

For example, use `az deployment group create --confirm-with-what-if` or `-c` for resource group deployments.

The preceding commands return a text summary that you can manually inspect. To get a JSON object that you can programmatically inspect for changes, use the `--no-pretty-print` switch. For example, use `az deployment group what-if --no-pretty-print` for resource group deployments.

If you want to return the results without colors, open your [Azure CLI configuration](/cli/azure/azure-cli-configuration) file. Set **no_color** to **yes**.

# [PowerShell](#tab/azure-powershell)

To preview changes before deploying a Bicep file, use [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) or [New-AzSubscriptionDeployment](/powershell/module/az.resources/new-azdeployment). Add the `-Whatif` switch parameter to the deployment command.

- `New-AzResourceGroupDeployment -Whatif` for resource group deployments
- `New-AzSubscriptionDeployment -Whatif` and `New-AzDeployment -Whatif` for subscription level deployments

Azure PowerShell version **13.4.0 or later** introduces the `-ValidationLevel` switch to determine how thoroughly ARM validates the Bicep template during this process. It accepts the following values:

- **Provider** (default): Performs full validation, including template syntax, resource definitions, dependencies, and permission checks to ensure you have sufficient permissions to deploy all resources in the template.
- **ProviderNoRbac**: Performs full validation of the template and resources, similar to Provider, but only checks for read permissions on each resource instead of full deployment permissions. This is useful when you want to validate resource configurations without requiring full access.
- **Template**: Performs static validation only, checking template syntax and structure while skipping preflight checks (e.g., resource availability) and permission checks. This is less thorough, potentially missing issues that could cause deployment failures.

You can use the `-Confirm` switch parameter to preview the changes and get prompted to continue with the deployment.

- `New-AzResourceGroupDeployment -Confirm` for resource group deployments
- `New-AzSubscriptionDeployment -Confirm` and `New-AzDeployment -Confirm` for subscription level deployments

The preceding commands return a text summary that you can manually inspect. To get an object that you can programmatically inspect for changes, use [Get-AzResourceGroupDeploymentWhatIfResult](/powershell/module/az.resources/get-azresourcegroupdeploymentwhatifresult) or [Get-AzSubscriptionDeploymentWhatIfResult](/powershell/module/az.resources/get-azdeploymentwhatifresult).

- `$results = Get-AzResourceGroupDeploymentWhatIfResult` for resource group deployments
- `$results = Get-AzSubscriptionDeploymentWhatIfResult` or `$results = Get-AzDeploymentWhatIfResult` for subscription level deployments

---

For REST API, use:

- [Deployments - What If](/rest/api/resources/deployments/whatif) for resource group deployments
- [Deployments - What If At Subscription Scope](/rest/api/resources/deployments/whatifatsubscriptionscope) for subscription deployments
- [Deployments - What If At Management Group Scope](/rest/api/resources/deployments/whatifatmanagementgroupscope) for management group deployments
- [Deployments - What If At Tenant Scope](/rest/api/resources/deployments/whatifattenantscope) for tenant deployments.

You can use the what-if operation through the Azure SDKs.

- For Python, use [what-if](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2019_10_01.operations.deploymentsoperations#what-if-resource-group-name--deployment-name--properties--location-none--custom-headers-none--raw-false--polling-true----operation-config-).
- For Java, use [DeploymentWhatIf Class](/java/api/com.azure.resourcemanager.resources.models.deploymentwhatif).
- For .NET, use [DeploymentWhatIf Class](/dotnet/api/microsoft.azure.management.resourcemanager.models.deploymentwhatif).

### Set up environment

To see how what-if works, let's runs some tests. First, deploy a Bicep file that creates a virtual network. Save the following Bicep file as `what-if-before.bicep`:

```bicep
resource vnet 'Microsoft.Network/virtualNetworks@2025-01-01' = {
  name: 'vnet-001'
  location: resourceGroup().location
  tags: {
    CostCenter: '12345'
    Owner: 'Team A'
  }
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
    enableVmProtection: false
    enableDdosProtection: false
    subnets: [
      {
        name: 'subnet001'
        properties: {
          addressPrefix: '10.0.0.0/24'
        }
      }
      {
        name: 'subnet002'
        properties: {
          addressPrefix: '10.0.1.0/24'
        }
      }
    ]
  }
}
```

To deploy the Bicep file, use:

# [Azure CLI](#tab/azure-cli)

```azurecli
az group create \
  --name ExampleGroup \
  --location "Central US"
az deployment group create \
  --resource-group ExampleGroup \
  --template-file "what-if-before.bicep"
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup `
  -Name ExampleGroup `
  -Location centralus
New-AzResourceGroupDeployment `
  -ResourceGroupName ExampleGroup `
  -TemplateFile "what-if-before.bicep"
```

---

### Test modification

After the deployment completes, you're ready to test the what-if operation. This time you deploy a Bicep file that changes the virtual network. Comparing to the preceding example, the following example  misses one of the original tags, a subnet has been removed, and the address prefix has changed. Save the following Bicep file as `what-if-after.bicep`:

```bicep
resource vnet 'Microsoft.Network/virtualNetworks@2025-01-01' = {
  name: 'vnet-001'
  location: resourceGroup().location
  tags: {
    CostCenter: '12345'
  }
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/15'
      ]
    }
    enableVmProtection: false
    enableDdosProtection: false
    subnets: [
      {
        name: 'subnet002'
        properties: {
          addressPrefix: '10.0.1.0/24'
        }
      }
    ]
  }
}
```

To view the changes, use:

# [Azure CLI](#tab/azure-cli)

```azurecli
az deployment group what-if \
  --resource-group ExampleGroup \
  --template-file "what-if-after.bicep"
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Whatif `
  -ResourceGroupName ExampleGroup `
  -TemplateFile "what-if-after.bicep"
```

---

The what-if output appears similar to:

![Bicep deployment what-if operation output](./media/deploy-what-if/resource-manager-deployment-whatif-change-types.png)

The text output is:

```bash
Resource and property changes are indicated with these symbols:
  - Delete
  + Create
  ~ Modify

    - tags.Owner:                             "Team A"
    + properties.enableVmProtection:          false
    ~ properties.addressSpace.addressPrefixes: [
      - 0: "10.0.0.0/16"
      + 0: "10.0.0.0/15"
      ]
    ~ properties.subnets: [
      - 0:

          name:                                         "subnet001"
          properties.addressPrefix:                     "10.0.0.0/24"
          properties.defaultOutboundAccess:             false
          properties.privateEndpointNetworkPolicies:    "Disabled"
          properties.privateLinkServiceNetworkPolicies: "Enabled"

      ]

Resource changes: 1 to modify.
```

Notice at the top of the output that colors are defined to indicate the type of changes.

At the bottom of the output, it shows the tag Owner was deleted. The address prefix changed from 10.0.0.0/16 to 10.0.0.0/15. The subnet named subnet001 was deleted. Remember these changes weren't deployed. You see a preview of the changes that will happen if you deploy the Bicep file.

Some of the properties that are listed as deleted won't actually change. Properties can be incorrectly reported as deleted when they aren't in the Bicep file, but are automatically set during deployment as default values. This result is considered "noise" in the what-if response. The final deployed resource will have the values set for the properties. As the what-if operation matures, these properties will be filtered out of the result.

### Confirm deletion

To preview changes before deploying a Bicep file, use the confirm switch parameter with the deployment command. If the changes are as you expected, respond that you want the deployment to complete.

# [Azure CLI](#tab/azure-cli)

```azurecli
az deployment group create \
  --resource-group ExampleGroup \
  --confirm-with-what-if \
  --template-file "what-if-after.bicep"
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -ResourceGroupName ExampleGroup `
  -Confirm `
  -TemplateFile "what-if-after.bicep"
```

---

![Bicep deployment what-if operation output deployment mode complete](./media/deploy-what-if/resource-manager-deployment-whatif-output-confirm.png)

The text output is:

```bash
Resource and property changes are indicated with these symbols:
  - Delete
  + Create
  ~ Modify

The deployment will update the following scope:

Scope: /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/ExampleGroup

  ~ Microsoft.Network/virtualNetworks/vnet-001 [2024-07-01]
    - properties.privateEndpointVNetPolicies: "Disabled"
    - tags.Owner:                             "Team A"
    + properties.enableVmProtection:          false
    ~ properties.addressSpace.addressPrefixes: [
      - 0: "10.0.0.0/16"
      + 0: "10.0.0.0/15"
      ]
    ~ properties.subnets: [
      - 0:

          name:                                         "subnet001"
          properties.addressPrefix:                     "10.0.0.0/24"
          properties.defaultOutboundAccess:             false
          properties.privateEndpointNetworkPolicies:    "Disabled"
          properties.privateLinkServiceNetworkPolicies: "Enabled"

      ]

Resource changes: 1 to modify.

Are you sure you want to execute the deployment? (y/n):
```

You see the expected changes and can confirm that you want the deployment to run.

### Programmatically evaluate what-if results

Now, let's programmatically evaluate the what-if results by setting the command to a variable.

# [Azure CLI](#tab/azure-cli)

```azurecli
results=$(az deployment group what-if --resource-group ExampleGroup --template-file "what-if-after.bicep" --no-pretty-print)
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$results = Get-AzResourceGroupDeploymentWhatIfResult `
  -ResourceGroupName ExampleGroup `
  --template-file "what-if-after.bicep"
```

You can see a summary of each change.

```azurepowershell
foreach ($change in $results.Changes)
{
  $change.Delta
}
```

---

## Understand what-if results

### View results

When you use what-if in PowerShell or Azure CLI, the output includes color-coded results that help you see the different types of changes.

![Bicep deployment what-if operation fullresourcepayload and change types](./media/deploy-what-if/resource-manager-deployment-whatif-change-types.png)

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
> The what-if operation can't resolve the [reference function](./bicep-functions-resource.md#reference). Every time you set a property to a template expression that includes the reference function, what-if reports the property will change. This behavior happens because what-if compares the current value of the property (such as `true` or `false` for a boolean value) with the unresolved template expression. Obviously, these values will not match. When you deploy the Bicep file, the property will only change when the template expression resolves to a different value.

### Change types

The what-if operation lists seven different types of changes:

- **Create**: The resource doesn't currently exist but is defined in the Bicep file. The resource will be created.
- **Delete**: This change type only applies when using [complete mode](../templates/deployment-modes.md) for JSON template deployment. The resource exists, but isn't defined in the Bicep file. With complete mode, the resource will be deleted. Only resources that [support complete mode deletion](../templates/deployment-complete-mode-deletion.md) are included in this change type.
- **Ignore**: The resource exists, but isn't defined in the Bicep file. The resource won't be deployed or modified. When you reach the limits for expanding nested templates, you'll encounter this change type. See [What-if limits](#limitations).
- **NoChange**: The resource exists, and is defined in the Bicep file. The resource will be redeployed, but the properties of the resource won't change. This change type is returned when [ResultFormat](#result-format) is set to `FullResourcePayloads`, which is the default value.
- **NoEffect**: The property is ready-only and will be ignored by the service. For example, the `sku.tier` property is always set to match `sku.name` in the [`Microsoft.ServiceBus`](/azure/templates/microsoft.servicebus/namespaces) namespace.
- **Modify**: The resource exists, and is defined in the Bicep file. The resource will be redeployed, and the properties of the resource will change. This change type is returned when [ResultFormat](#result-format) is set to `FullResourcePayloads`, which is the default value.
- **Deploy**: The resource exists, and is defined in the Bicep file. The resource will be redeployed. The properties of the resource may or may not change. The operation returns this change type when it doesn't have enough information to determine if any properties will change. You only see this condition when [ResultFormat](#result-format) is set to `ResourceIdOnly`.

### Result format

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

### Unevaluated expressions

If an unevaluated expression appears in the output, it means what-if cannot evaluate it outside the context of a deployment. The expression is shown as-is to indicate the information that will be filled in when the deployment is executed.

```bicep
param now string = utcNow()

resource sa 'Microsoft.Storage/storageAccounts@2025-06-01' = {
  name: 'acct'
  location: resourceGroup().location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  tags: {
    lastDeployedOn: now
    lastDeployedBy: deployer().userPrincipalName
  }
}
```

In the preceding example, the `now` parameter uses the `utcNow()` function to get the current date and time. When you run what-if, these expressions are shown as-is because they can't be evaluated outside the context of a deployment. The what-if output will look similar to:

```console
Note: The result may contain false positive predictions (noise).
You can help us improve the accuracy of the result by opening an issue here: https://aka.ms/WhatIfIssues

Resource and property changes are indicated with this symbol:
  ~ Modify

The deployment will update the following scope:

Scope: /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/jgaotest

  ~ Microsoft.Storage/storageAccounts/acct0808 [2025-01-01]
    ~ tags.lastDeployedOn: "20250808T200145Z" => "[utcNow()]"

Resource changes: 1 to modify.
```

The following expressions are not evaluated during what-if:

- Non-deterministic functions, such as [newGuid()](./bicep-functions-string.md#newguid) and [utcNow()](./bicep-functions-date.md#utcnow)
- Any reference to a [secure parameter value](./parameters.md#secure-parameters).
- References to resources that are not deployed in the same template.
- References to resource properties that are not defined in the same template.
- Any resource function, such as [listKeys()](./bicep-functions-resource.md#listkeys).

## Clean up resources

When you no longer need the example resources, use Azure CLI or Azure PowerShell to delete the resource group.

# [CLI](#tab/CLI)

```azurecli
az group delete --name ExampleGroup
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
Remove-AzResourceGroup -Name ExampleGroup
```

---

## Next steps

- To use the what-if operation in a pipeline, see [Test ARM templates with What-If in a pipeline](https://4bes.nl/2021/03/06/test-arm-templates-with-what-if/).
- If you notice incorrect results from the what-if operation, report the issues at [https://aka.ms/whatifissues](https://aka.ms/whatifissues).
