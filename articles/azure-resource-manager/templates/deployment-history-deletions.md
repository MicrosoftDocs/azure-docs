---
title: Deployment history deletions
description: Describes how Azure Resource Manager automatically deletes deployments from the deployment history. Deployments are deleted when the history is close to exceeding the limit of 800.
ms.topic: conceptual
ms.date: 06/25/2020
---
# Automatic deletions from deployment history

Every time you deploy a template, information about the deployment is written to the deployment history. Each resource group is limited to 800 deployments in its deployment history.

Azure Resource Manager will soon start automatically deleting deployments from your history as you near the limit. Automatic deletion is a change from past behavior. Previously, you had to manually delete deployments from the deployment history to avoid getting an error.

> [!NOTE]
> Deleting a deployment from the history doesn't affect any of the resources that were deployed.
>
> If you have a [CanNotDelete lock](../management/lock-resources.md) on a resource group, the deployments for that resource group can't be deleted. You must remove the lock to take advantage of automatic deletions in the deployment history.

## When deployments are deleted

Deployments are deleted from your deployment history when you reach 790 deployments. Azure Resource Manager deletes a small set of the oldest deployments to clear space for future deployments. Most of your history remains unchanged. The oldest deployments are always deleted first.

:::image type="content" border="false" source="./media/deployment-history-deletions/deployment-history.svg" alt-text="Deletions from deployment history":::

In addition to deployments, you also trigger deletions when you run the [what-if operation](template-deploy-what-if.md) or validate a deployment.

When you give a deployment the same name as one in the history, you reset its place in the history. The deployment moves to the most recent place in the history. You also reset a deployment's place when you [roll back to that deployment](rollback-on-error.md) after an error.

> [!NOTE]
> If your resource group is already at the 800 limit, your next deployment fails with an error. The automatic deletion process starts immediately. You can try your deployment again after a short wait.

## Opt out of automatic deletions

You can opt out of automatic deletions from the history. **Use this option only when you want to manage the deployment history yourself.** The limit of 800 deployments in the history is still enforced. If you exceed 800 deployments, you'll receive an error and your deployment will fail.

To disable automatic deletions, register the `Microsoft.Resources/DisableDeploymentGrooming` feature flag. When you register the feature flag, you opt out of automatic deletions for the entire Azure subscription. You can't opt out for only a particular resource group.

# [PowerShell](#tab/azure-powershell)

For PowerShell, use [Register-AzProviderFeature](/powershell/module/az.resources/Register-AzProviderFeature).

```azurepowershell-interactive
Register-AzProviderFeature -ProviderNamespace Microsoft.Resources -FeatureName DisableDeploymentGrooming
```

To see the current status of your subscription, use:

```azurepowershell-interactive
Get-AzProviderFeature -ProviderNamespace Microsoft.Resources -FeatureName DisableDeploymentGrooming
```

# [Azure CLI](#tab/azure-cli)

For Azure CLI, use [az feature register](/cli/azure/feature#az-feature-register).

```azurecli-interactive
az feature register --namespace Microsoft.Resources --name DisableDeploymentGrooming
```

To see the current status of your subscription, use:

```azurecli-interactive
az feature show --namespace Microsoft.Resources --name DisableDeploymentGrooming
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

---

## Next steps

* To learn about viewing the deployment history, see [View deployment history with Azure Resource Manager](deployment-history.md).
