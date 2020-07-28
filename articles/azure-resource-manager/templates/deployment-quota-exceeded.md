---
title: Deployment quota exceeded
description: Describes how to resolve the error of having more than 800 deployments in the resource group history.
ms.topic: troubleshooting
ms.date: 06/25/2020
---

# Resolve error when deployment count exceeds 800

Each resource group is limited to 800 deployments in its deployment history. This article describes the error you receive when a deployment fails because it would exceed the allowed 800 deployments. To resolve this error, delete deployments from the resource group history. Deleting a deployment from the history doesn't affect any of the resources that were deployed.

> [!NOTE]
> Azure Resource Manager will soon start automatically deleting deployments from your history as you near the limit. You may still see this error if you've opted out of automatic deletions. For more information, see [Automatic deletions from deployment history](deployment-history-deletions.md).

## Symptom

During deployment, you receive an error stating that the current deployment will exceed the quota of 800 deployments.

## Solution

### Azure CLI

Use the [az deployment group delete](/cli/azure/group/deployment) command to delete deployments from the history.

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

You can get the current count in the deployment history with the following command:

```azurecli-interactive
az deployment group list --resource-group exampleGroup --query "length(@)"
```

### Azure PowerShell

Use the [Remove-AzResourceGroupDeployment](/powershell/module/az.resources/remove-azresourcegroupdeployment) command to delete deployments from the history.

```azurepowershell-interactive
Remove-AzResourceGroupDeployment -ResourceGroupName exampleGroup -Name deploymentName
```

To delete all deployments older than five days, use:

```azurepowershell-interactive
$deployments = Get-AzResourceGroupDeployment -ResourceGroupName exampleGroup | Where-Object Timestamp -lt ((Get-Date).AddDays(-5))

foreach ($deployment in $deployments) {
  Remove-AzResourceGroupDeployment -ResourceGroupName exampleGroup -Name $deployment.DeploymentName
}
```

You can get the current count in the deployment history with the following command:

```azurepowershell-interactive
(Get-AzResourceGroupDeployment -ResourceGroupName exampleGroup).Count
```

## Third-party solutions

The following external solutions address specific scenarios:

* [Azure Logic Apps and PowerShell solutions](https://devkimchi.com/2018/05/30/managing-excessive-arm-deployment-histories-with-logic-apps/)
* [AzDevOps Extension](https://github.com/christianwaha/AzureDevOpsExtensionCleanRG)
