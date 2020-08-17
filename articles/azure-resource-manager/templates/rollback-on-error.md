---
title: Roll back on error to successful deployment
description: Specify that a failed deployment should roll back to a successful deployment.
ms.topic: conceptual
ms.date: 10/04/2019
---
# Rollback on error to successful deployment

When a deployment fails, you can automatically redeploy an earlier, successful deployment from your deployment history. This functionality is useful if you've got a known good state for your infrastructure deployment and want to revert to this state. There are a number of caveats and restrictions:

- The redeployment is run exactly as it was run previously with the same parameters. You can't change the parameters.
- The previous deployment is run using the [complete mode](./deployment-modes.md#complete-mode). Any resources not included in the previous deployment are deleted, and any resource configurations are set to their previous state. Make sure you fully understand the [deployment modes](./deployment-modes.md).
- The redeployment only affects the resources, any data changes aren't affected.
- You can use this feature only with resource group deployments, not subscription or management group level deployments. For more information about subscription level deployment, see [Create resource groups and resources at the subscription level](./deploy-to-subscription.md).
- You can only use this option with root level deployments. Deployments from a nested template aren't available for redeployment.

To use this option, your deployments must have unique names so they can be identified in the history. If you don't have unique names, the current failed deployment might overwrite the previously successful deployment in the history.

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

- To safely roll out your service to more than one region, see [Azure Deployment Manager](deployment-manager-overview.md).
- To specify how to handle resources that exist in the resource group but aren't defined in the template, see [Azure Resource Manager deployment modes](deployment-modes.md).
- To understand how to define parameters in your template, see [Understand the structure and syntax of Azure Resource Manager templates](template-syntax.md).
- For information about deploying a template that requires a SAS token, see [Deploy private template with SAS token](secure-template-with-sas-token.md).
