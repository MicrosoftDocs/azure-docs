---
title: Deployment history deletions
description: Describes how Azure Resource Manager automatically deletes deployments from the deployment history. Deployments are deleted when the history is close to exceeding the limit of 800.
ms.topic: conceptual
ms.date: 05/22/2025
ms.custom: devx-track-azurecli, devx-track-arm-template
---

# Automatic deletions from deployment history

When you deploy resources to Azure, the deployment details are recorded in the deployment history at the scope where the deployment occurs. Each scope — whether it's a resource group, subscription, or management group—can store up to **800 deployments** in its history. Once this limit is reached, Azure **automatically deletes the oldest deployments** to make space for new ones. This automatic cleanup process has been in effect since **August 6, 2020**.

> [!NOTE]
> Deleting a deployment from the history doesn't affect any of the resources that were deployed.

## How automatic deployment deletions work

Deployments are deleted from your history when you exceed 700 deployments. Azure Resource Manager deletes deployments until the history is down to 600. The oldest deployments are always deleted first.

:::image type="content" border="false" source="./media/deployment-history-deletions/deployment-history.png" alt-text="Diagram of deployment history deletion.":::

> [!IMPORTANT]
> If your scope is already at the 800 limit, your next deployment fails with an error. The automatic deletion process starts immediately. You can try your deployment again after a short wait.

In addition to deployments, you also trigger deletions when you run the [what-if operation](./deploy-what-if.md) or validate a deployment.

When you give a deployment the same name as one in the history, you reset its place in the history. The deployment moves to the most recent place in the history. You also reset a deployment's place when you [roll back to that deployment](rollback-on-error.md) after an error.

## Permissions required for automatic deletions

The deletions are requested under the identity of the user who deployed the template. To delete deployments, the user must have access to the **Microsoft.Resources/deployments/delete** action. If the user doesn't have the required permissions, deployments aren't deleted from the history.

If the current user doesn't have the required permissions, automatic deletion is attempted again during the next deployment.

## Removing locks that block deletions

If you have a [CanNotDelete lock](../management/lock-resources.md) on a resource group or a subscription, the deployments for that scope can't be automatically deleted. To enable automatic cleanup of the deployment history, you'll need to remove the lock.

To delete a resource group lock using Azure PowerShell, run the following commands:

```azurepowershell-interactive
$lockId = (Get-AzResourceLock -ResourceGroupName lockedRG).LockId
Remove-AzResourceLock -LockId $lockId
```

To delete a resource group lock using Azure CLI, run the following commands:

```azurecli-interactive
lockid=$(az lock show --resource-group lockedRG --name deleteLock --output tsv --query id)
az lock delete --ids $lockid
```

## How to opt out of automatic deletions

You can opt out of automatic deletions from the history. **Use this option only when you want to manage the deployment history yourself.** The limit of 800 deployments in the history is still enforced. If you exceed 800 deployments, you'll receive an error and your deployment will fail.

To disable automatic deletions at the tenant or the management group scope, open a support ticket. For the instructions, see [Request support](./overview.md#get-support).

To disable automatic deletions at the subscription scope, register the `Microsoft.Resources/DisableDeploymentGrooming` feature flag. When you register the feature flag, you opt out of automatic deletions for the entire Azure subscription. You can't opt out for only a particular resource group. To reenable automatic deletions, unregister the feature flag.

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
