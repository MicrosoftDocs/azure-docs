---
title: Known issues for deployment stacks
description: Learn about the known limitations and known issues for Azure deployment stacks, and the recommended workarounds.
ms.topic: troubleshooting-known-issue
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-bicep
ms.date: 06/11/2026
---

# Known issues for deployment stacks

This article lists known limitations and known issues for [Azure deployment stacks](./deployment-stacks.md),
along with recommended workarounds when available.

## Known limitations

- You can create up to **800 deployment stacks** within a single scope.
- You can have up to **2,000 deny-assignments** at any given scope.
- The deployment stack doesn't manage implicitly created resources. As a result, you can't use
  [deny-assignments](/azure/role-based-access-control/deny-assignments) or cleanup for these
  resources.
- Deny-assignments don't support tags.
- Deny-assignments aren't supported at the management group scope. However, they're supported in a
  management group stack when the deployment is pointed at the subscription scope.
- Deployment stacks can't delete Key Vault secrets. If you're removing Key Vault secrets from a
  template, also run the deployment stack update or delete command with detach mode. The latest
  versions of Azure PowerShell and Azure CLI include an option to detach non-deletable resources,
  which prevents accidental failures.

## Known issues

- **Deleting a resource group bypasses deny-assignments.** Deployment stacks created at the
  resource group scope don't manage the parent resource group, because the resource group isn't
  defined in the Bicep file. As a result, even though the deployment stack creates deny
  assignments, you can still delete the resource group. Deleting the resource group deletes the deployment stack
  and its managed resources. The recommended guidance is to deploy to the subscription scope and
  include the resource group in the Bicep file. Alternatively, if a
  [lock](/azure/azure-resource-manager/management/lock-resources) is active on any resource in the
  group, the delete operation fails.
- **Moving a managed resource removes its stack protection.** Deny assignments are evaluated at the
  resource group scope for Move operations, not at the individual resource scope. As a result, a
  resource can be moved out of its resource group even when a deny assignment protects that
  individual resource, and a deployment stack's protections don't transfer with the resource after
  it's moved. The moved resource is no longer protected by the stack and can be managed outside its
  original boundary. As an interim mitigation, apply a read-only
  [lock](/azure/azure-resource-manager/management/lock-resources) on the resource group to block
  Move operations. Deployment stack operations continue to work with the read-only lock in place -
  for example, reading the stack and the stack's deny-delete protection still function. To update
  the stack, temporarily remove the lock for the duration of the change and reapply it afterward.
- **A management group-scoped stack can't deploy to another management group.** It can only deploy
  to the management group of the stack itself, or to a child subscription.
- **`DeleteResourcesAndResourceGroups` value is being removed.** The Azure PowerShell command help
  lists a `DeleteResourcesAndResourceGroups` value for the `ActionOnUnmanage` switch. When you use
  this value, the command detaches the managed resources and the resource groups. This value is
  being removed in an upcoming update. Don't use this value.
- **Generic template validation error.** In some cases, the `New-*` and `Set-*` Azure PowerShell
  cmdlets might return a generic template validation error that isn't clearly actionable. If the
  error isn't clear, rerun the cmdlet in debug mode to see a more detailed error in the raw
  response.
- **Microsoft Graph provider isn't supported.** The [Microsoft Graph provider](https://aka.ms/graphbicep)
  doesn't support deployment stacks.
- **What-if isn't yet available.** The [what-if operation](./deploy-what-if.md) isn't yet supported for
  deployment stacks.

## Handle the stack-out-of-sync error

When updating or deleting a deployment stack, you might encounter a stack-out-of-sync error
indicating the stack's resource list isn't correctly synchronized:

```error
The deployment stack '{0}' might not have an accurate list of managed resources. To prevent resources from being accidentally deleted, check that the managed resource list doesn't have any additional values. If there is any uncertainty, it's recommended to redeploy the stack with the same template and parameters as the current iteration. To bypass this warning, specify the 'BypassStackOutOfSyncError' flag.
```

Review the managed resource list from the Azure portal, or redeploy the currently deployed Bicep
file with the same parameters to obtain the list of managed resources. After you verify the list,
rerun the command with the `BypassStackOutOfSyncError` switch in Azure PowerShell (or
`--bypass-stack-out-of-sync-error` in Azure CLI). Use this switch only after thoroughly reviewing
the resource list. Don't use it by default.

## Next steps

- [Create and deploy Azure deployment stacks in Bicep](./deployment-stacks.md)
- [Known issues for template specs](./template-specs-known-issues.md)
