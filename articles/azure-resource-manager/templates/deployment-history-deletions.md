---
title: Deployment history deletions
description: Describes how Azure Resource Manager automatically deletes deployments from the deployment history. Deployments are deleted when the history is close to exceeding the limit of 800.
ms.topic: conceptual
ms.date: 03/20/2024
ms.custom: devx-track-azurecli, devx-track-arm-template
---

# Automatic deletions from deployment history

Every time you deploy a template, information about the deployment is written to the deployment history. Each resource group is limited to 800 deployments in its deployment history.

Azure Resource Manager automatically deletes deployments from your history as you near the limit. Automatic deletion is a change from past behavior. Previously, you had to manually delete deployments from the deployment history to avoid getting an error. This change was implemented on August 6, 2020.

**Automatic deletions are supported for resource group and subscription deployments. Currently, deployments in the history for [management group](deploy-to-management-group.md) and [tenant](deploy-to-tenant.md) deployments aren't automatically deleted.**

> [!NOTE]
> Deleting a deployment from the history doesn't affect any of the resources that were deployed.

## When deployments are deleted

Deployments are deleted from your history when you exceed 700 deployments. Azure Resource Manager deletes deployments until the history is down to 600. The oldest deployments are always deleted first.

:::image type="content" border="false" source="./media/deployment-history-deletions/deployment-history.png" alt-text="Diagram of deployment history deletion.":::

> [!IMPORTANT]
> If your resource group is already at the 800 limit, your next deployment fails with an error. The automatic deletion process starts immediately. You can try your deployment again after a short wait.

In addition to deployments, you also trigger deletions when you run the [what-if operation](./deploy-what-if.md) or validate a deployment.

When you give a deployment the same name as one in the history, you reset its place in the history. The deployment moves to the most recent place in the history. You also reset a deployment's place when you [roll back to that deployment](rollback-on-error.md) after an error.

## Remove locks that block deletions

If you have a [CanNotDelete lock](../management/lock-resources.md) on a resource group, the deployments for that resource group can't be deleted. You must remove the lock to take advantage of automatic deletions in the deployment history.

To use PowerShell to delete a lock, run the following commands:

```azurepowershell-interactive
$lockId = (Get-AzResourceLock -ResourceGroupName lockedRG).LockId
Remove-AzResourceLock -LockId $lockId
```

To use Azure CLI to delete a lock, run the following commands:

```azurecli-interactive
lockid=$(az lock show --resource-group lockedRG --name deleteLock --output tsv --query id)
az lock delete --ids $lockid
```

## Required permissions

The deletions are requested under the identity of the user who deployed the template. To delete deployments, the user must have access to the **Microsoft.Resources/deployments/delete** action. If the user doesn't have the required permissions, deployments aren't deleted from the history.

If the current user doesn't have the required permissions, automatic deletion is attempted again during the next deployment.

## Opt out of automatic deletions

You can opt out of automatic deletions from the history. **Use this option only when you want to manage the deployment history yourself.** The limit of 800 deployments in the history is still enforced. If you exceed 800 deployments, you'll receive an error and your deployment will fail.

To disable automatic deletions, register the `Microsoft.Resources/DisableDeploymentGrooming` feature flag. When you register the feature flag, you opt out of automatic deletions for the entire Azure subscription. You can't opt out for only a particular resource group. To reenable automatic deletions, unregister the feature flag.

# [PowerShell](#tab/azure-powershell)

For PowerShell, use [Register-AzProviderFeature](/powershell/module/az.resources/Register-AzProviderFeature).

```azurepowershell-interactive
Register-AzProviderFeature -ProviderNamespace Microsoft.Resources -FeatureName DisableDeploymentGrooming
```

To see the current status of your subscription, use:

```azurepowershell-interactive
Get-AzProviderFeature -ProviderNamespace Microsoft.Resources -FeatureName DisableDeploymentGrooming
```

To reenable automatic deletions, use Azure REST API or Azure CLI.

# [Azure CLI](#tab/azure-cli)

For Azure CLI, use [az feature register](/cli/azure/feature#az-feature-register).

```azurecli-interactive
az feature register --namespace Microsoft.Resources --name DisableDeploymentGrooming
```

To see the current status of your subscription, use:

```azurecli-interactive
az feature show --namespace Microsoft.Resources --name DisableDeploymentGrooming
```

To reenable automatic deletions, use [az feature unregister](/cli/azure/feature#az-feature-unregister).

```azurecli-interactive
az feature unregister --namespace Microsoft.Resources --name DisableDeploymentGrooming
```

# [REST](#tab/rest)

For REST API, use [Features - Register](/rest/api/resources/features/register).

```rest
POST https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Features/providers/Microsoft.Resources/features/DisableDeploymentGrooming/register?api-version=2015-12-01
```

To see the current status of your subscription, use:

```rest
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Features/providers/Microsoft.Resources/features/DisableDeploymentGrooming/register?api-version=2015-12-01
```

To reenable automatic deletions, use [Features - Unregister](/rest/api/resources/features/unregister)

```rest
POST https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Features/providers/Microsoft.Resources/features/DisableDeploymentGrooming/unregister?api-version=2015-12-01
```

---

## Next steps

* To learn about viewing the deployment history, see [View deployment history with Azure Resource Manager](deployment-history.md).
