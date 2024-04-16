---
title: Deployment quota exceeded
description: Describes how to resolve the error of having more than 800 deployments in the resource group history.
ms.topic: troubleshooting
ms.date: 04/05/2023
---

# Resolve error when deployment count exceeds 800

Each resource group is limited to 800 deployments in its deployment history. This article describes the error you receive when a deployment fails because it would exceed the allowed 800 deployments. To resolve this error, delete deployments from the resource group history. Deleting a deployment from the history doesn't affect any of the resources that were deployed.

Azure Resource Manager automatically deletes deployments from your history as you near the limit. You may still see this error for one of the following reasons:

1. You have a [CanNotDelete](../management/lock-resources.md) lock on the resource group that prevents deletions from the deployment history.
1. You opted out of automatic deletions.
1. You have a large number of deployments running concurrently and the automatic deletions aren't processed fast enough to reduce the total number.

For information about how to remove a lock or opt in to automatic deletions, see [Automatic deletions from deployment history](../templates/deployment-history-deletions.md).

This article describes how to manually delete deployments from the history.

## Symptom

During deployment, you receive an error that states the current deployment will exceed the quota of 800 deployments.

## Solution

# [Azure CLI](#tab/azure-cli)

Use the [az deployment group delete](/cli/azure/deployment/group#az-deployment-group-delete) command to delete deployments from the history.

```azurecli-interactive
az deployment group delete --resource-group exampleGroup --name deploymentName
```

To delete all deployments older than five days, use:

```azurecli-interactive
startdate=$(date +%F -d "-5days")
deployments=$(az deployment group list --resource-group exampleGroup --query "[?properties.timestamp<'$startdate'].name" --output tsv)

for deployment in $deployments
do
  az deployment group delete --resource-group exampleGroup --name $deployment
done
```

You can get the current count in the deployment history with the following command. This example requires a Bash environment.

```azurecli-interactive
az deployment group list --resource-group exampleGroup --query "length(@)"
```

# [PowerShell](#tab/azure-powershell)

Use the [Remove-AzResourceGroupDeployment](/powershell/module/az.resources/remove-azresourcegroupdeployment) command to delete deployments from the history.

```azurepowershell-interactive
Remove-AzResourceGroupDeployment -ResourceGroupName exampleGroup -Name deploymentName
```

To delete all deployments older than five days, use:

```azurepowershell-interactive
$deployments = Get-AzResourceGroupDeployment -ResourceGroupName exampleGroup | Where-Object -Property Timestamp -LT -Value ((Get-Date).AddDays(-5))

foreach ($deployment in $deployments) {
  Remove-AzResourceGroupDeployment -ResourceGroupName exampleGroup -Name $deployment.DeploymentName
}
```

You can get the current count in the deployment history with the following command:

```azurepowershell-interactive
(Get-AzResourceGroupDeployment -ResourceGroupName exampleGroup).Count
```

---
