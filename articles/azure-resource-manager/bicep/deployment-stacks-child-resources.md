---
title: Manage child resources with deployment stacks
description: Learn how deployment stack deny settings apply to child resources and to managed resource groups, and how to protect child resources step by step.
ms.topic: how-to
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-bicep
ms.date: 11/24/2026
---

# Manage child resources with deployment stacks

A child resource exists within another resource, such as a database on a SQL server, a subnet in a virtual network, or a security rule in a network security group. This article explains how the [deny settings](./deployment-stacks.md#protect-managed-resources) of a deployment stack apply to child resources and to the resource groups that the stack manages, and how to protect child resources step by step.

To learn how to declare child resources in Bicep, see [Set name and type for child resources in Bicep](./child-resource-name-type.md).

## How deny settings apply to child resources

A deployment stack applies its deny settings to the resources that it manages. Whether the deny settings protect a child resource depends on whether the stack manages the child resource and whether the stack applies its deny settings to child scopes.

- **The stack manages the child resource.** When you declare a child resource in the template, the stack manages it like any other resource, and the deny settings apply to it.
- **The stack doesn't manage the child resource.** A child resource that isn't in the template, such as one that a person or a script adds later, isn't protected by default. The deny settings on its parent resource don't apply to it.
- **The stack applies deny settings to child scopes.** When you turn on this setting, the deny settings on each managed resource also apply to its child resources, including the child resources that the stack doesn't manage.
- **The stack manages a resource group.** The deny settings on a managed resource group never apply to its child scopes, even when you turn on child scopes. They don't protect the resources in the resource group that the stack doesn't manage. For more information, see [Deny settings on managed resource groups](#deny-settings-on-managed-resource-groups).

The following table shows what happens for a stack that uses the `denyWriteAndDelete` mode. Excluded principals and excluded actions apply in both columns.

| Change | Child scopes off (default) | Child scopes on |
| --- | --- | --- |
| Update or delete a resource that the stack manages | Blocked | Blocked |
| Update or delete a child resource that's declared in the template | Blocked | Blocked |
| Add, update, or delete a child resource that isn't in the template | Allowed | Blocked |
| Update or delete a resource group that the stack manages | Blocked | Blocked |
| Add, update, or delete a resource that isn't in the template, in a resource group that the stack manages | Allowed | Allowed |

Child scopes are off by default in Azure CLI, Azure PowerShell, and the REST API. In the REST API, `denySettings.applyToChildScopes` is optional, and the stack uses `false` if you leave it out.

## Why child resources aren't protected by default

A stack enforces its deny settings through [deny assignments](/azure/role-based-access-control/deny-assignments). By default, these deny assignments cover the resources that the stack manages, but not their child scopes. The stack locks only what it manages, so people and processes can keep adding and changing child resources that aren't in the template, such as databases on a SQL server that the stack manages, without updating the stack.

If you want the stack to lock those child resources too, [apply deny settings to child scopes](#apply-deny-settings-to-child-scopes).

## Choose how to protect child resources

You can protect child resources in two ways, and you can use both in the same stack.

| Approach | What it protects | Consider |
| --- | --- | --- |
| [Declare child resources in the template](#declare-child-resources-in-the-template) | The child resources that you declare | People can still add child resources that aren't in the template. |
| [Apply deny settings to child scopes](#apply-deny-settings-to-child-scopes) | Every child resource of every managed resource, except the resources in a managed resource group | Only excluded principals and excluded actions can add or change child resources, including routine changes such as adding a database to a server. |

### Declare child resources in the template

If you know which child resources you need, declare them in the template. The stack manages them, applies its deny settings to them, and handles them with its [actionOnUnmanage](./deployment-stacks.md#control-detachment-and-deletion) behavior when you remove them from the template.

The following Bicep file declares a network security group and one of its security rules as separate resources:

```bicep
param location string = resourceGroup().location

resource nsg 'Microsoft.Network/networkSecurityGroups@2024-01-01' = {
  name: 'nsg-app'
  location: location
}

resource allowHttps 'Microsoft.Network/networkSecurityGroups/securityRules@2024-01-01' = {
  parent: nsg
  name: 'allow-https'
  properties: {
    priority: 100
    direction: 'Inbound'
    access: 'Allow'
    protocol: 'Tcp'
    sourceAddressPrefix: '*'
    sourcePortRange: '*'
    destinationAddressPrefix: '*'
    destinationPortRange: '443'
  }
}
```

With `denyWriteAndDelete`, the stack blocks updates to the `allow-https` rule and blocks deleting it. If child scopes are off, someone can still add another security rule to `nsg-app`.

### Apply deny settings to child scopes

To protect every child resource of the resources that the stack manages, apply deny settings to child scopes when you create or update the stack. Use this approach when child resources that aren't in the template must not change, such as the security rules of a network security group.

With child scopes on, only excluded principals and excluded actions can add, change, or delete the child resources of the resources that the stack manages. For example, if the stack manages a SQL server, nobody else can add a database to it. To let specific identities or operations through, use [excluded principals](./deployment-stacks.md#exclude-principals-from-deny-settings) or excluded actions. Child scopes don't apply to a resource group that the stack manages. For more information, see [Deny settings on managed resource groups](#deny-settings-on-managed-resource-groups).

The following steps use a stack at the resource group scope.

# [Azure PowerShell](#tab/azure-powershell)

1. Preview the change with [what-if](./deployment-stacks-what-if.md). Use the template, parameters, and deny settings that you plan to deploy, and include `-DenySettingsApplyToChildScopes`:

   ```azurepowershell
   New-AzResourceGroupDeploymentStackWhatIfResult `
     -Name "<what-if-result-name>" `
     -ResourceGroupName "<resource-group-name>" `
     -StackResourceId "<deployment-stack-resource-id>" `
     -TemplateFile "<bicep-file-name>" `
     -ActionOnUnmanage "DetachAll" `
     -DenySettingsMode "DenyWriteAndDelete" `
     -DenySettingsApplyToChildScopes `
     -RetentionInterval "PT1H"
   ```

1. In the what-if output, check the changes to the stack. For a new stack, the changes include `+ DenySettings.ApplyToChildScopes: "True"`. If the stack already applies deny settings to child scopes, they don't include this setting. For an existing stack that doesn't apply deny settings to child scopes yet, the changes include the following line:

   ```output
   ~ DenySettings.ApplyToChildScopes: "False" => "True"
   ```

1. Create or update the stack with the same deny settings by running the following command. To update an existing stack, you can also run `Set-AzResourceGroupDeploymentStack` with the same parameters.

   ```azurepowershell
   New-AzResourceGroupDeploymentStack `
     -Name "<deployment-stack-name>" `
     -ResourceGroupName "<resource-group-name>" `
     -TemplateFile "<bicep-file-name>" `
     -ActionOnUnmanage "detachAll" `
     -DenySettingsMode "denyWriteAndDelete" `
     -DenySettingsApplyToChildScopes
   ```

1. Check that `ApplyToChildScopes` is `True` in the stack's deny settings, and check the deny assignment on each managed resource. For the commands, see [Check the deny settings of a stack](#check-the-deny-settings-of-a-stack).

1. Include `-DenySettingsApplyToChildScopes` every time you update the stack. If you leave it out, the update turns off child scopes, and what-if shows `~ DenySettings.ApplyToChildScopes: "True" => "False"`.

# [Azure CLI](#tab/azure-cli)

1. Preview the change with [what-if](./deployment-stacks-what-if.md). Use the template, parameters, and deny settings that you plan to deploy, and include `--deny-settings-apply-to-child-scopes`:

   ```azurecli
   az stack-whatif group create \
     --name '<what-if-result-name>' \
     --resource-group '<resource-group-name>' \
     --stack-id '<deployment-stack-resource-id>' \
     --template-file '<bicep-file-name>' \
     --action-on-unmanage 'detachAll' \
     --deny-settings-mode 'denyWriteAndDelete' \
     --deny-settings-apply-to-child-scopes \
     --retention-interval 'PT1H'
   ```

1. In the what-if output, check the changes to the stack. For a new stack, the changes include `+ DenySettings.ApplyToChildScopes: "True"`. If the stack already applies deny settings to child scopes, they don't include this setting. For an existing stack that doesn't apply deny settings to child scopes yet, the changes include the following line:

   ```output
   ~ DenySettings.ApplyToChildScopes: "False" => "True"
   ```

1. Create or update the stack with the same deny settings by running the following command. To update an existing stack, run the same command again.

   ```azurecli
   az stack group create \
     --name '<deployment-stack-name>' \
     --resource-group '<resource-group-name>' \
     --template-file '<bicep-file-name>' \
     --action-on-unmanage 'detachAll' \
     --deny-settings-mode 'denyWriteAndDelete' \
     --deny-settings-apply-to-child-scopes
   ```

1. Check that `applyToChildScopes` is `true` in the stack's deny settings, and check the deny assignment on each managed resource. For the commands, see [Check the deny settings of a stack](#check-the-deny-settings-of-a-stack).

1. Include `--deny-settings-apply-to-child-scopes` every time you update the stack. If you leave it out, the update turns off child scopes, and what-if shows `~ DenySettings.ApplyToChildScopes: "True" => "False"`.

---

For stacks at the subscription or management group scope, use the matching commands, such as `New-AzSubscriptionDeploymentStackWhatIfResult` and `New-AzSubscriptionDeploymentStack` in Azure PowerShell, or `az stack-whatif sub create` and `az stack sub create` in Azure CLI.

If you use the REST API, set `denySettings.applyToChildScopes` to `true` in every create or update request. The stack uses `false` if you leave it out.

### Child resources that are part of the parent's configuration

For some resource types, you can declare a child resource either as a separate resource or as a property of its parent. For example, you can declare the security rules of a network security group in its `securityRules` property, and the subnets of a virtual network in its `subnets` property.

If you declare these settings inside the parent resource, the stack manages the parent but not each child resource. With child scopes off, someone can still change the settings through the child resource. For example, `az network nsg rule update` can change a security rule that you declared in the `securityRules` property, and the deny settings on the parent don't block it.

When you update the stack, the deployment applies the parent's configuration from the template again, which can revert changes made through child resources. To find these changes before you update, see [Use what-if to investigate configuration drift](./deployment-stacks-what-if.md#use-what-if-to-investigate-configuration-drift). To block them, [apply deny settings to child scopes](#apply-deny-settings-to-child-scopes).

## Deny settings on managed resource groups

A stack manages a resource group when the resource group is defined in the stack's template. For example, a subscription-scoped stack can define a resource group and the resources in it. For an example template, see [Create resource group and resources](./create-resource-group.md#create-resource-group-and-resources).

The stack creates a separate deny assignment for each resource that it manages, including the resource group. The resources in a resource group are in the child scope of the resource group. The deny assignment on a managed resource group never applies to its child scopes, even when the stack applies deny settings to child scopes. A resource in the resource group is protected only if the stack manages it. In that case, the resource's own deny assignment protects it.

The following table shows which deny assignments apply to child scopes:

| Deny assignment | Applies to child scopes |
| --- | --- |
| On a resource group that the stack manages | Never |
| On any other resource that the stack manages | Only when the stack applies deny settings to child scopes |

To see the deny assignments of your stack and their `doNotApplyToChildScopes` values, see [Check the deny assignments](#check-the-deny-assignments).

This behavior is by design. Deny settings protect the individual resources that a stack manages. They don't lock the whole resource group, so you can deploy resources to the same resource group from more than one stack or deployment. If the deny settings on a resource group applied to its child scopes, every resource in the resource group would need to be in the same stack.

For example, a subscription-scoped stack defines a resource group and a network security group in it. The stack uses `denyWriteAndDelete` and applies deny settings to child scopes:

- Updating or deleting the resource group is blocked.
- Updating or deleting the network security group is blocked.
- Adding a security rule to the network security group is blocked, because the deny settings on the network security group apply to its child scopes.
- Creating another network security group in the resource group is allowed, because the stack doesn't manage it. Adding a security rule to that network security group and deleting it are also allowed.

### Protect the resources in a managed resource group

To protect the resources in a resource group that the stack manages:

1. Define each resource that must not change in the stack's template, so the stack manages it and creates a deny assignment for it.
1. Apply deny settings to child scopes to protect the child resources of those resources. For more information, see [Apply deny settings to child scopes](#apply-deny-settings-to-child-scopes).
1. Use [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview) to limit who can create resources in the resource group. Assign roles that allow writes at the resource group scope only to the people and identities that need to deploy to it.

### Preview the behavior with what-if

When you run [what-if](./deployment-stacks-what-if.md) for a stack that manages a resource group and applies deny settings to child scopes, the result includes the following diagnostic:

```output
INFO: [RGDenyAssignmentNeverAppliesToChildScopes]
  Message: Even though the deny setting `ApplyToChildScopes` was set to true, child scopes will not be applied to any resource group with a deny assignment.
```

The diagnostic is informational and doesn't block the deployment. In the REST API, the what-if result lists it in `properties.diagnostics`, with `level` set to `info` and `code` set to `RGDenyAssignmentNeverAppliesToChildScopes`.

## Check the deny settings of a stack

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
(Get-AzResourceGroupDeploymentStack `
  -ResourceGroupName "<resource-group-name>" `
  -Name "<deployment-stack-name>").denySettings
```

The output looks like the following example:

```output
Mode               ExcludedPrincipals ExcludedActions ApplyToChildScopes
----               ------------------ --------------- ------------------
denyWriteAndDelete {}                 {}                           False
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az stack group show \
  --name '<deployment-stack-name>' \
  --resource-group '<resource-group-name>' \
  --query denySettings
```

The output looks like the following example:

```json
{
  "applyToChildScopes": false,
  "excludedActions": [],
  "excludedPrincipals": [],
  "mode": "denyWriteAndDelete"
}
```

---

For stacks at the subscription or management group scope, use `Get-AzSubscriptionDeploymentStack` or `Get-AzManagementGroupDeploymentStack` in Azure PowerShell, and `az stack sub show` or `az stack mg show` in Azure CLI.

### Check the deny assignments

The stack enforces its deny settings through one deny assignment for each managed resource. The `doNotApplyToChildScopes` property of each deny assignment shows whether it applies to child scopes. The description of each deny assignment that a stack creates starts with `Created by Deployment Stack`, followed by the resource ID of the stack.

To list the deny assignments in a resource group, including the deny assignments on the resources in it:

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzDenyAssignment -ResourceGroupName "<resource-group-name>" |
  Format-List Scope, DoNotApplyToChildScopes
```

The following example output is for a stack that manages a resource group and a network security group in it, and applies deny settings to child scopes:

```output
Scope                   : /subscriptions/<subscription-id>/resourceGroups/rg-app
DoNotApplyToChildScopes : True

Scope                   : /subscriptions/<subscription-id>/resourceGroups/rg-app/providers/Microsoft.Network/networkSecurityGroups/nsg-app
DoNotApplyToChildScopes : False
```

# [Azure CLI](#tab/azure-cli)

The `az role deny-assignment` commands require Azure CLI version 2.88.0 or later.

```azurecli
az role deny-assignment list \
  --scope '/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>' \
  --query "[].{scope:scope, doNotApplyToChildScopes:doNotApplyToChildScopes}"
```

The following example output is for a stack that manages a resource group and a network security group in it, and applies deny settings to child scopes:

```json
[
  {
    "doNotApplyToChildScopes": true,
    "scope": "/subscriptions/<subscription-id>/resourceGroups/rg-app"
  },
  {
    "doNotApplyToChildScopes": false,
    "scope": "/subscriptions/<subscription-id>/resourceGroups/rg-app/providers/Microsoft.Network/networkSecurityGroups/nsg-app"
  }
]
```

---

The deny assignment on a managed resource group always has `doNotApplyToChildScopes` set to `true`. For each other managed resource, `doNotApplyToChildScopes` is `false` when the stack applies deny settings to child scopes, and `true` when it doesn't. The list can also include deny assignments that other stacks or services created.

## Give feedback

If the default doesn't fit your scenario, or you have a scenario for protecting child resources that this article doesn't cover, open an issue in the [Azure/deployment-stacks](https://github.com/Azure/deployment-stacks/issues) repository. Include the resource types involved and why the child resources aren't declared in the template.

## Related content

- [Create and deploy Azure deployment stacks in Bicep](./deployment-stacks.md)
- [Known issues for deployment stacks](./deployment-stacks-known-issues.md)
- [Preview deployment stack changes by using what-if](./deployment-stacks-what-if.md)
- [Understand Azure deny assignments](/azure/role-based-access-control/deny-assignments)
