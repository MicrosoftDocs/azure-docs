---
title: Preview deployment stack changes with what-if
description: Learn how to use the what-if operation to preview the changes a deployment stack makes before you create or update it.
ms.topic: how-to
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-bicep
ms.date: 10/28/2026
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

- **Noise reduction doesn't remove every difference.** What-if filters many common differences that aren't real changes, but it doesn't filter all of them. For more information, see [Noise reduction in deployment stack what-if results](./deployment-stacks-what-if-noise-reduction.md).
- **A scope can contain up to 800 what-if results.** This limit is separate from the limits on deployments and deployment stacks, so running what-if doesn't consume the deployment history for the scope. Results are deleted automatically when their retention interval elapses. For more information, see [Retrieve and delete stored results](#retrieve-and-delete-stored-results).

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

What-if compares your template against the current state of the resources that the stack manages, and not every difference it finds is a change that deploying your template would actually make. Resource providers add and normalize values after a resource is deployed, so a property can differ from your template even when nothing meaningful changed. These differences are noise.

Deployment stacks filter noise for you. When you deploy or update a stack, Azure evaluates what-if for the stack at that moment and keeps the result as a baseline. When you run what-if against the stack later, any property that is unchanged between that baseline and the current evaluation is removed from the result. Noise reduction is enabled in all regions.

Because Azure records the baseline when you deploy the stack, noise reduction applies to stacks that you created or updated on or after August 13, 2026. If you haven't deployed or updated a stack since then, its what-if results still include noise. Deploy or update the stack once to establish the baseline.

> [!NOTE]
> Noise reduction removes many common differences, but it doesn't remove every one. Review the reported changes rather than assuming that every difference is a real change.

For where noise comes from, what the filtering removes, and what it doesn't, see [Noise reduction in deployment stack what-if results](./deployment-stacks-what-if-noise-reduction.md).

## Use what-if to investigate configuration drift

Configuration drift occurs when the current state of a resource differs from the intended configuration in your template and parameters. Because noise reduction filters out differences that were already present when you last deployed the stack, a later what-if run with the same template, parameters, and stack settings reports changes that were made outside the stack after that deployment, such as edits in the Azure portal or by a script. Each reported difference shows the change that reapplying the stack would make to restore the intended configuration.

What-if is a point-in-time check, not continuous drift monitoring. It reports what differs, but not who or what made the change. To find the source of a change, use the [activity log](/azure/azure-monitor/fundamentals/activity-log) or [resource changes in Azure Resource Graph](/azure/governance/resource-graph/changes/get-resource-changes).

### Before you begin

- Keep the Bicep file or ARM template and the parameter values that represent the intended configuration.
- Target the same deployment stack and scope that manage the resources.
- Use the same `actionOnUnmanage` and deny settings as the stack's intended configuration. Changing these inputs can change the what-if result.
- Make sure that the stack has a baseline, which means that you created or updated it on or after August 13, 2026. Without a baseline, the result also includes noise. Updating the stack establishes a baseline, but it can also revert existing drift, so review a what-if result first. For more information, see [Establish the baseline](./deployment-stacks-what-if-noise-reduction.md#establish-the-baseline).
- Make sure that you have permission to read the stack and the resources it manages, and permission to create the what-if result, which is the `Microsoft.Resources/deploymentStacksWhatIfResults/write` action.

### Check for drift

1. Run what-if against the stack by using the same template, parameters, and stack settings. The following example checks a resource group stack:

   ```azurecli
   az stack-whatif group create \
     --name "<what-if-result-name>" \
     --resource-group "<resource-group-name>" \
     --stack-id "<deployment-stack-resource-id>" \
     --template-file "main.bicep" \
     --parameters "@main.parameters.json" \
     --action-on-unmanage "detachAll" \
     --deny-settings-mode "none" \
     --retention-interval "PT3H"
   ```

   The example uses `detachAll` and `none` as placeholders. Use the `actionOnUnmanage` and deny settings that match your stack's intended configuration.

1. Review the property-level changes in the command output. To review the stored result later, include the property-level changes when you retrieve it:

   ```azurecli
   az stack-whatif group show \
     --name "<what-if-result-name>" \
     --resource-group "<resource-group-name>" \
     --with-property-changes true
   ```

### Interpret the results

The following example shows a result for a stack after changes were made outside the stack. On one managed network security group, a port and a tag value were changed and a tag was added. A second managed network security group was deleted.

```output
Changes to Managed Resources:

Azure
  ~ /subscriptions/<subscription-id>/resourceGroups/demo-rg/providers/Microsoft.Network/networkSecurityGroups/examplensg [2024-05-01]
    = Management Status: "managed"
    = Deny Status: "none"
    ~ properties.securityRules:
      ~ 0:
        ~ properties.destinationPortRange: "8443" => "443"
    ~ tags.env: "drifted" => "test"
    - tags.owner: "portal"
  + /subscriptions/<subscription-id>/resourceGroups/demo-rg/providers/Microsoft.Network/networkSecurityGroups/examplensg2 [2024-05-01]
    = Management Status: "managed"
    = Deny Status: "none"
```

Each change describes what reapplying the stack would do:

- **Modify** (`~`) on a property that your template sets means that the current value differs from your template. The value before `=>` is the current value, and the value after it is the value in your template.
- **Delete** (`-`) on a property or array item means that the resource has a value that your template doesn't define and that wasn't present when you last deployed the stack, such as a tag or a rule added outside the stack.
- **Create** (`+`) on a resource that the stack already manages means that the resource no longer exists, for example because it was deleted outside the stack.
- **NoChange** (`=`) means that what-if found no difference in the properties it evaluated.
- **Delete** or **Detach** on a resource usually reflects your template or `actionOnUnmanage` setting rather than drift. Review the template and stack settings.
- **Unsupported**, **Ignore**, or a diagnostic means that what-if couldn't fully evaluate that part of the stack, so the result doesn't show whether it drifted.

After you confirm a difference, either update the stack to restore the intended configuration, or update your template and parameters to keep the change.

> [!IMPORTANT]
> Confirm a reported difference against the live resource before you correct it. Not every difference comes from a change made outside the stack. For example, a resource provider can change a default value in a newer API version, and expressions that what-if can't evaluate, such as `reference()`, nondeterministic functions, and secure values, can appear as changes. What-if can also miss changes: it doesn't evaluate unsupported resource types, and expansion limits or [short-circuiting](./deploy-what-if.md#short-circuiting) can leave resources out of the result. For more information, see [What noise reduction doesn't remove](./deployment-stacks-what-if-noise-reduction.md#what-noise-reduction-doesnt-remove) and [Unevaluated expressions](./deploy-what-if.md#unevaluated-expressions).

## Run what-if before you create or update a stack

Run the what-if command to preview the changes without applying them. You identify the target stack by its resource ID: use `--stack-id` in Azure CLI or `-StackResourceId` in Azure PowerShell. The `--name` (Azure CLI) or `-Name` (Azure PowerShell) value names the stored what-if result, and the operation keeps that result for the retention interval you set so you can retrieve it later.

The retention interval uses ISO 8601 duration format and must be between `PT1H` (one hour) and `PT3H` (three hours). Azure deletes the result automatically when the retention interval elapses.

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

Because each what-if result is its own resource, you can list, retrieve, and delete results at any scope. A scope is limited to 800 what-if results. Azure automatically deletes results when their retention interval ends. You can delete a result before then when you no longer need it.

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

