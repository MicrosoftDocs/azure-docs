---
title: Roll back on error to successful deployment
description: Specify that a failed deployment should roll back to a successful deployment.
ms.topic: conceptual
ms.date: 03/20/2024
ms.custom: devx-track-azurecli
---

# Rollback on error to successful deployment

When a deployment fails, you can automatically redeploy an earlier, successful deployment from your deployment history. This functionality is useful if you've got a known good state for your infrastructure deployment and want to revert to this state. You can specify either a particular earlier deployment or the last successful deployment.

> [!IMPORTANT]
> This feature rollbacks a failed deployment by redeploying an earlier deployment. This result may be different than what you would expect from undoing the failed deployment. Make sure you understand how the earlier deployment is redeployed.

## Considerations for redeploying

Before using this feature, consider these details about how the redeployment is handled:

- The previous deployment is run using the [complete mode](./deployment-modes.md#complete-mode), even if you used [incremental mode](./deployment-modes.md#incremental-mode) during the earlier deployment. Redeploying in complete mode could produce unexpected results when the earlier deployment used incremental. The complete mode means that any resources not included in the previous deployment are deleted. Specify an earlier deployment that represents all of the resources and their states that you want to exist in the resource group. For more information, see [deployment modes](./deployment-modes.md).
- The redeployment is run exactly as it was run previously with the same parameters. You can't change the parameters.
- The redeployment only affects the resources, any data changes aren't affected.
- You can use this feature only with resource group deployments. It doesn't support subscription, management group, or tenant level deployments. For more information about subscription level deployment, see [Create resource groups and resources at the subscription level](./deploy-to-subscription.md).
- You can only use this option with root level deployments. Deployments from a nested template aren't available for redeployment.

To use this option, your deployments must have unique names in the deployment history. It's only with unique names that a specific deployment can be identified. If you don't have unique names, a failed deployment might overwrite a successful deployment in the history.

If you specify an earlier deployment that doesn't exist in the deployment history, the rollback returns an error.

## PowerShell

To redeploy the last successful deployment, add the `-RollbackToLastDeployment` parameter as a flag.

```azurepowershell-interactive
New-AzResourceGroupDeployment -Name ExampleDeployment02 `
  -ResourceGroupName $resourceGroupName `
  -TemplateFile c:\MyTemplates\azuredeploy.json `
  -RollbackToLastDeployment
```

To redeploy a specific deployment, use the `-RollBackDeploymentName` parameter and provide the name of the deployment. The specified deployment must have succeeded.

```azurepowershell-interactive
New-AzResourceGroupDeployment -Name ExampleDeployment02 `
  -ResourceGroupName $resourceGroupName `
  -TemplateFile c:\MyTemplates\azuredeploy.json `
  -RollBackDeploymentName ExampleDeployment01
```

## Azure CLI

To redeploy the last successful deployment, add the `--rollback-on-error` parameter as a flag.

```azurecli-interactive
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --template-file storage.json \
  --parameters storageAccountType=Standard_GRS \
  --rollback-on-error
```

To redeploy a specific deployment, use the `--rollback-on-error` parameter and provide the name of the deployment. The specified deployment must have succeeded.

```azurecli-interactive
az deployment group create \
  --name ExampleDeployment02 \
  --resource-group ExampleGroup \
  --template-file storage.json \
  --parameters storageAccountType=Standard_GRS \
  --rollback-on-error ExampleDeployment01
```

## REST API

To redeploy the last successful deployment if the current deployment fails, use:

```json
{
  "properties": {
    "templateLink": {
      "uri": "http://mystorageaccount.blob.core.windows.net/templates/template.json",
      "contentVersion": "1.0.0.0"
    },
    "mode": "Incremental",
    "parametersLink": {
      "uri": "http://mystorageaccount.blob.core.windows.net/templates/parameters.json",
      "contentVersion": "1.0.0.0"
    },
    "onErrorDeployment": {
      "type": "LastSuccessful",
    }
  }
}
```

To redeploy a specific deployment if the current deployment fails, use:

```json
{
  "properties": {
    "templateLink": {
      "uri": "http://mystorageaccount.blob.core.windows.net/templates/template.json",
      "contentVersion": "1.0.0.0"
    },
    "mode": "Incremental",
    "parametersLink": {
      "uri": "http://mystorageaccount.blob.core.windows.net/templates/parameters.json",
      "contentVersion": "1.0.0.0"
    },
    "onErrorDeployment": {
      "type": "SpecificDeployment",
      "deploymentName": "<deploymentname>"
    }
  }
}
```

The specified deployment must have succeeded.

## Next steps

- To understand complete and incremental modes, see [Azure Resource Manager deployment modes](deployment-modes.md).
- To understand how to define parameters in your template, see [Understand the structure and syntax of Azure Resource Manager templates](./syntax.md).
