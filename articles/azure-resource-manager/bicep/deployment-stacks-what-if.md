---
title: Preview deployment stack changes with what-if
description: Learn how to use the what-if operation to preview the changes a deployment stack makes before you create or update it.
ms.topic: how-to
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-bicep
ms.date: 08/12/2026
---

# Preview deployment stack changes by using what-if

Before you create or update an [Azure deployment stack](./deployment-stacks.md), preview the changes the stack makes by using the what-if operation. The what-if operation doesn't make any changes to existing resources. Instead, it predicts the changes that occur if you apply the stack with the specified template and parameters. Because a deployment stack manages a collection of resources as a single unit, previewing changes by using what-if is especially useful. You can confirm which resources are created, updated, or left unchanged. You can also catch resources that become *unmanaged* (detached or deleted) before you apply the change.


## What-if for Bicep deployments

The what-if operation is a feature of Azure Resource Manager template deployments that previews the changes a deployment makes before you apply them. It's available for standard Bicep deployments and for deployment stacks. For a full description of how the operation works, the change types it reports, and its limitations, see [Preview Bicep deployment changes by using what-if](./deploy-what-if.md). The rest of this article focuses on using what-if with deployment stacks.

## How stack what-if results differ from deployment what-if

If you're moving from deployments to deployment stacks, the most important difference is where the result lives.

For a standard deployment, what-if is an *operation*. You run it, Azure returns the predicted changes, and nothing is stored afterward.

For a deployment stack, what-if creates a *what-if result resource*. The result is a standalone Azure resource of type `Microsoft.Resources/deploymentStacksWhatIfResults` that you name yourself, and it references the stack it was evaluated against rather than being an operation on that stack. Because the result is its own resource, you can retrieve it, share its resource ID, and delete it later.

| Characteristic | Deployment what-if | Deployment stack what-if |
|---|---|---|
| Form | An operation that returns a result | A resource you create |
| Name | Not named | You supply a name |
| Resource type | Not applicable | `Microsoft.Resources/deploymentStacksWhatIfResults` |
| Link to the stack | Not applicable | `properties.deploymentStackResourceId` references the stack |
| Persistence | Not stored | Stored for the retention interval you set |

A result has a resource ID in this form:

```output
/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Resources/deploymentStacksWhatIfResults/{what-if-result-name}
```

The stack you evaluated doesn't need to exist yet. If it doesn't, what-if reports the stack itself as a new resource, which lets you preview the first run of a stack before you create it.

## Limitations

What-if for deployment stacks shares the underlying [what-if limitations](./deploy-what-if.md) of Azure Resource Manager template deployments, including [result accuracy](./deploy-what-if.md#change-types) for certain resource types and properties. Always review the predicted changes carefully before you apply a stack, particularly when `actionOnUnmanage` is set to a delete option.

- **Noise reduction doesn't remove every difference.** What-if filters many common differences that aren't real changes, but it doesn't filter all of them. For more information, see [Noise reduction](#noise-reduction).
- **Stored results persist until their retention interval elapses.** Each what-if result is a resource in the scope you create it in, and it counts toward that scope's resource limits. A result that uses a retention interval longer than `PT3H` isn't deleted automatically, so delete results you no longer need. For more information, see [Retrieve and delete stored results](#retrieve-and-delete-stored-results).

## How what-if works with deployment stacks

When you run what-if against a deployment stack, the operation evaluates the template against the current state of the resources managed by the stack and reports each resource as one of the following change types:

| Change type | Description |
|-------------|-------------|
| **Create** | The resource doesn't exist and is created. |
| **Modify** | The resource exists and some properties change. |
| **NoChange** | The resource exists and isn't changed. |
| **Delete** | Applies when `actionOnUnmanage` is set to delete. The resource is removed from the stack and deleted. |
| **Detach** | Applies when `actionOnUnmanage` is set to detach. The resource is removed from the stack's management but isn't deleted from Azure. |
| **Unsupported** | The resource isn't supported for what-if evaluation. |

> [!NOTE]
> When the resource provider ignores a read-only property (for example, `sku.tier` set to match `sku.name` for some resource types), what-if reports that property as **NoEffect**. Some clients display **NoEffect** as **NoChange**. This difference affects only display and doesn't affect the changes that the stack applies.

What-if also surfaces resources that are **detached** from the stack (no longer managed) based on the `actionOnUnmanage` behavior, so you can confirm that no managed resource is unintentionally removed.

## Noise reduction

What-if compares your template against the current state of the resources that the stack manages. Not every difference it finds is a change that you made. Resource providers add and normalize values after a resource is deployed, so a property can differ from your template even when nothing meaningful changed. These differences are noise, and they make a result harder to read.

Deployment stacks filter this noise for you. When you deploy or update a stack, Azure evaluates what-if for the stack at that moment and keeps the result as a baseline. When you run what-if against the stack later, any property that is unchanged between that baseline and the current evaluation is removed from the result as noise. What remains is closer to the set of changes that your template actually introduces.

Because the baseline is recorded when the stack is deployed, noise reduction applies to stacks that were created or updated after the feature became available. If a stack hasn't been deployed or updated since then, its what-if results still include noise. Deploy or update the stack once to establish the baseline.

> [!NOTE]
> Noise reduction removes many common differences, but it doesn't remove every one. Review the reported changes rather than assuming that every difference is a real change.

## Run what-if before you create or update a stack

Run the what-if command to preview the changes without applying them. You identify the target stack by its resource ID: use `--stack-id` in Azure CLI or `-StackResourceId` in Azure PowerShell. The `--name` (Azure CLI) or `-Name` (Azure PowerShell) value names the stored what-if result, and the operation keeps that result for the retention interval you set so you can retrieve it later.

The retention interval uses ISO 8601 duration format, such as `PT3H` for three hours or `P7D` for seven days.

> [!TIP]
> Set the retention interval to `PT3H` or less. Results that use a longer retention interval aren't deleted automatically, so you need to delete them yourself when you no longer need them.

# [Azure CLI](#tab/azure-cli)

To preview changes for a resource group stack, use the following command:

```azurecli
az stack-whatif group create \
  --name "<what-if-result-name>" \
  --resource-group "<resource-group-name>" \
  --stack-id "<deployment-stack-resource-id>" \
  --template-file "<bicep-file-name>" \
  --action-on-unmanage "detachAll" \
  --deny-settings-mode "none" \
  --retention-interval "PT3H"
```

To preview changes for a subscription stack, use the following command:

```azurecli
az stack-whatif sub create \
  --name "<what-if-result-name>" \
  --location "<location>" \
  --stack-id "<deployment-stack-resource-id>" \
  --template-file "<bicep-file-name>" \
  --action-on-unmanage "detachAll" \
  --deny-settings-mode "none" \
  --retention-interval "PT3H"
```

To preview changes for a management group stack, use the following command:

```azurecli
az stack-whatif mg create \
  --name "<what-if-result-name>" \
  --management-group-id "<management-group-id>" \
  --location "<location>" \
  --stack-id "<deployment-stack-resource-id>" \
  --template-file "<bicep-file-name>" \
  --action-on-unmanage "detachAll" \
  --deny-settings-mode "none" \
  --retention-interval "PT3H"
```

# [Azure PowerShell](#tab/azure-powershell)

To preview changes for a resource group stack, use the following command:

```azurepowershell
New-AzResourceGroupDeploymentStackWhatIfResult `
  -Name "<what-if-result-name>" `
  -ResourceGroupName "<resource-group-name>" `
  -StackResourceId "<deployment-stack-resource-id>" `
  -TemplateFile "<bicep-file-name>" `
  -ActionOnUnmanage "DetachAll" `
  -DenySettingsMode "None" `
  -RetentionInterval "PT3H"
```

To preview changes for a subscription stack, use the following command:

```azurepowershell
New-AzSubscriptionDeploymentStackWhatIfResult `
  -Name "<what-if-result-name>" `
  -Location "<location>" `
  -StackResourceId "<deployment-stack-resource-id>" `
  -TemplateFile "<bicep-file-name>" `
  -ActionOnUnmanage "DetachAll" `
  -DenySettingsMode "None" `
  -RetentionInterval "PT3H"
```

To preview changes for a management group stack, use the following command:

```azurepowershell
New-AzManagementGroupDeploymentStackWhatIfResult `
  -Name "<what-if-result-name>" `
  -ManagementGroupId "<management-group-id>" `
  -Location "<location>" `
  -StackResourceId "<deployment-stack-resource-id>" `
  -TemplateFile "<bicep-file-name>" `
  -ActionOnUnmanage "DetachAll" `
  -DenySettingsMode "None" `
  -RetentionInterval "PT3H"
```

---

To preview the effect of an update on an existing stack, run the same what-if command and pass that stack's resource ID. In Azure PowerShell, you can also use the corresponding `Set-Az*DeploymentStackWhatIfResult` cmdlets.

## Retrieve and delete stored results

Because each what-if result is its own resource, you can list, retrieve, and delete results at any scope. Delete results you no longer need, especially when you set a retention interval longer than `PT3H`.

# [Azure CLI](#tab/azure-cli)

```azurecli
# List the what-if results in a resource group
az stack-whatif group list --resource-group "<resource-group-name>"

# Get a single result
az stack-whatif group show --name "<what-if-result-name>" --resource-group "<resource-group-name>"

# Get a single result by resource ID
az stack-whatif group show --id "<what-if-result-resource-id>"

# Delete a result
az stack-whatif group delete --name "<what-if-result-name>" --resource-group "<resource-group-name>" --yes
```

Use `az stack-whatif sub` and `az stack-whatif mg` for subscription and management group scopes.

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
# Get a single result
Get-AzResourceGroupDeploymentStackWhatIfResult `
  -Name "<what-if-result-name>" `
  -ResourceGroupName "<resource-group-name>"

# Delete a result
Remove-AzResourceGroupDeploymentStackWhatIfResult `
  -Name "<what-if-result-name>" `
  -ResourceGroupName "<resource-group-name>"
```

For subscription and management group scopes, use the `Get-AzSubscriptionDeploymentStackWhatIfResult`, `Get-AzManagementGroupDeploymentStackWhatIfResult`, and the matching `Remove-Az*` cmdlets. Each `Get-Az*` and `Remove-Az*` cmdlet also accepts `-ResourceId` so you can pass the result's full resource ID instead of its name and scope.

---

## Get resource-level or property-level changes

A what-if result contains changes at two levels of detail: which resources change, and which individual properties change on those resources.

When you create a what-if result, the output includes the property-level changes. When you retrieve a stored result, the output includes the resource-level changes only. To include the property-level changes when you retrieve a result, use `--with-property-changes` in Azure CLI or `-WithPropertyChanges` in Azure PowerShell.

# [Azure CLI](#tab/azure-cli)

```azurecli
az stack-whatif group show \
  --name "<what-if-result-name>" \
  --resource-group "<resource-group-name>" \
  --with-property-changes true
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzResourceGroupDeploymentStackWhatIfResult `
  -Name "<what-if-result-name>" `
  -ResourceGroupName "<resource-group-name>" `
  -WithPropertyChanges
```

---

Retrieving a result without the option reports that the resource changes, but not what changes on it:

```output
Azure
  ~ /subscriptions/<subscription-id>/resourceGroups/demo-rg/providers/Microsoft.Storage/storageAccounts/examplestorage
    ~ Management Status: "notManaged" => "managed"
    = Deny Status: "none"
```

Retrieving the same result with the option adds the individual property changes:

```output
Azure
  ~ /subscriptions/<subscription-id>/resourceGroups/demo-rg/providers/Microsoft.Storage/storageAccounts/examplestorage [2023-01-01]
    ~ Management Status: "notManaged" => "managed"
    = Deny Status: "none"
    ~ sku.name: "Standard_LRS" => "Standard_GRS"
    - tags.myTag: "myValue"
    + tags.env: "demo"
```

The option applies when you retrieve a single result. Listing results doesn't return property changes.

## Confirm before applying

Use what-if as a confirmation step in interactive sessions and in pipelines:

- **Interactively**, run the what-if command, review the predicted changes, and then run the stack create command to apply them.
- **In automation**, capture the what-if result and gate the apply step on review or approval. This step is valuable for stacks because an update can detach or delete resources depending on the `actionOnUnmanage` setting.

