---
title: Find error codes
description: Describes how to find error codes to troubleshoot Azure resources deployed with Azure Resource Manager templates (ARM templates) or Bicep files.
tags: top-support-issue
ms.topic: troubleshooting
ms.custom: devx-track-azurepowershell, devx-track-arm-template, devx-track-bicep, devx-track-azurecli
ms.date: 04/05/2023
---

# Find error codes

When an Azure resource deployment fails using Azure Resource Manager templates (ARM templates) or Bicep files, an error code is received. This article describes how to find error codes so you can troubleshoot the problem. For more information about error codes, see [common deployment errors](common-deployment-errors.md).

## Error types

There are three types of errors that are related to a deployment:

- **Validation errors** occur before a deployment begins and are caused by syntax errors in your file. A code editor like Visual Studio Code can identify these errors.
- **Preflight validation errors** occur when a deployment command is run but resources aren't deployed. These errors are found without starting the deployment. For example, if a parameter value is incorrect, the error is found in preflight validation.
- **Deployment errors** occur during the deployment process and can only be found by assessing the deployment's progress in your Azure environment.

All types of errors return an error code that you use to troubleshoot the deployment. Validation and preflight errors are shown in the activity log but don't appear in your deployment history. A Bicep file with syntax errors doesn't compile into JSON and isn't shown in the activity log.

To identify syntax errors, you can use [Visual Studio Code](https://code.visualstudio.com) with the latest [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep) or [Azure Resource Manager Tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools).

## Validation errors

Templates are validated during the deployment process and error codes are displayed. Before you run a deployment, you can identify validation and preflight errors by running validation tests with Azure PowerShell or Azure CLI.

# [Portal](#tab/azure-portal)

An ARM template can be deployed from the portal. If the template has syntax errors, you'll see a validation error when you try to run the deployment. For more information about portal deployments, see [deploy resources from custom template](../templates/deploy-portal.md#deploy-resources-from-custom-template).

The following example attempts to deploy a storage account and a validation error occurs.

:::image type="content" source="media/find-error-code/validation-error.png" alt-text="Screenshot of a validation error in the Azure portal for a storage account deployment attempt.":::

Select the message for more details. The template has a syntax error with error code `InvalidTemplate`. The **Summary** shows an expression is missing a closing parenthesis.

:::image type="content" source="media/find-error-code/validation-details.png" alt-text="Screenshot of a validation error message in the Azure portal, showing a syntax error with error code InvalidTemplate.":::

# [PowerShell](#tab/azure-powershell)

To validate an ARM template before deployment run [Test-AzResourceGroupDeployment](/powershell/module/az.resources/test-azresourcegroupdeployment).

```azurepowershell
Test-AzResourceGroupDeployment `
  -ResourceGroupName examplegroup `
  -TemplateFile azuredeploy.json
```

The output displays error codes like `InvalidTemplateDeployment` or `AccountNameInvalid` that you can use to troubleshoot and fix the template.

For a Bicep file, the output for a syntax validation problem shows a parameter error.

```Output
Test-AzResourceGroupDeployment: Cannot retrieve the dynamic parameters for the cmdlet.
Cannot find path '/tmp/11111111-1111-1111-1111-111111111111/main.json' because it does not exist.
```

To get more troubleshooting information, use the Bicep [build](../bicep/bicep-cli.md) command. The output shows each error's line and column number in parentheses, and the error message.

```bicep
bicep build main.bicep
```

```Output
/azuredeploy.bicep(22,51) : Error BCP064: Found unexpected tokens in interpolated expression.
/azuredeploy.bicep(22,51) : Error BCP004: The string at this location is not terminated due to an
  unexpected new line character.
```

### Other scopes

There are Azure PowerShell cmdlets to validate deployment templates for the subscription, management group, and tenant scopes.

| Scope | Cmdlets |
| ---- | ---- |
| Subscription | [Test-AzDeployment](/powershell/module/az.resources/test-azdeployment) |
| Management group | [Test-AzManagementGroupDeployment](/powershell/module/az.resources/test-azmanagementgroupdeployment) |
| Tenant | [Test-AzTenantDeployment](/powershell/module/az.resources/test-aztenantdeployment) |

# [Azure CLI](#tab/azure-cli)

To validate an ARM template before deployment, run [az deployment group validate](/cli/azure/deployment/group#az-deployment-group-validate).

```azurecli
az deployment group validate \
  --resource-group examplegroup \
  --template-file azuredeploy.json
```

The output displays error codes like `InvalidTemplateDeployment` or `AccountNameInvalid` that you can use to troubleshoot and fix the template.

For a Bicep file, the output shows each error's line and column number in parentheses, and the error message.

```azurecli
az deployment group validate \
  --resource-group examplegroup \
  --template-file main.bicep
```

```Output
/azuredeploy.bicep(22,51) : Error BCP064: Found unexpected tokens in interpolated expression.
/azuredeploy.bicep(22,51) : Error BCP004: The string at this location is not terminated due to an
  unexpected new line character.
```

### Other scopes

There are Azure CLI commands to validate deployment templates for the subscription, management group, and tenant scopes.

| Scope | Commands |
| ---- | ---- |
| Subscription | [az deployment sub validate](/cli/azure/deployment/sub#az-deployment-sub-validate) |
| Management group | [az deployment mg validate](/cli/azure/deployment/mg#az-deployment-mg-validate) |
| Tenant | [az deployment tenant validate](/cli/azure/deployment/tenant#az-deployment-tenant-validate) |


---

## Deployment errors

Several operations are processed to deploy an Azure resource. Deployment errors occur when an operation passes validation but fails during deployment. You can view messages about each deployment operation and each deployment for a resource group.

# [Portal](#tab/azure-portal)

To see messages about a deployment's operations, use the resource group's **Activity log**:

1. Sign in to [Azure portal](https://portal.azure.com).
1. Go to **Resource groups** and select the deployment's resource group name.
1. Select **Activity log**.
1. Use the filters to find an operation's error log.

    :::image type="content" source="./media/find-error-code/activity-log.png" alt-text="Screenshot of the Azure portal's resource group activity log, emphasizing a failed deployment with an error log.":::

1. Select the error log to see the operation's details.

    :::image type="content" source="./media/find-error-code/activity-log-details.png" alt-text="Screenshot of the activity log details in the Azure portal, showing a failed deployment's error message and operation details.":::

To view a deployment's result:

1. Go to the resource group.
1. Select **Settings** > **Deployments**.
1. Select **Error details** for the deployment.

    :::image type="content" source="media/find-error-code/deployment-error-details.png" alt-text="Screenshot of a resource group's deployments section in the Azure portal, displaying a link to error details for a failed deployment.":::

1. The error message and error code `NoRegisteredProviderFound` are shown.

    :::image type="content" source="media/find-error-code/deployment-error-summary.png" alt-text="Screenshot of a deployment error summary in the Azure portal, showing the error message and error code NoRegisteredProviderFound.":::

# [PowerShell](#tab/azure-powershell)

To see a deployment's operations messages with PowerShell, use [Get-AzResourceGroupDeploymentOperation](/powershell/module/az.resources/get-azresourcegroupdeploymentoperation).

To show all the operations for a deployment:

```azurepowershell
Get-AzResourceGroupDeploymentOperation `
  -DeploymentName exampledeployment `
  -ResourceGroupName examplegroup
```

To specify a specific property type:

```azurepowershell
(Get-AzResourceGroupDeploymentOperation `
  -DeploymentName exampledeployment `
  -ResourceGroupName examplegroup).StatusCode
```

To get a deployment's result, use [Get-AzResourceGroupDeployment](/powershell/module/az.resources/get-azresourcegroupdeployment).

```azurepowershell
Get-AzResourceGroupDeployment `
  -DeploymentName exampledeployment `
  -ResourceGroupName examplegroup
```

### Other scopes

There are Azure PowerShell cmdlets to get deployment information for the subscription, management group, and tenant scopes.

| Scope | Cmdlets |
| ---- | ---- |
| Subscription | [Get-AzDeploymentOperation](/powershell/module/az.resources/get-azdeploymentoperation) <br> [Get-AzDeployment](/powershell/module/az.resources/get-azdeployment) |
| Management group | [Get-AzManagementGroupDeploymentOperation](/powershell/module/az.resources/get-azmanagementgroupdeploymentoperation) <br> [Get-AzManagementGroupDeployment](/powershell/module/az.resources/get-azmanagementgroupdeployment) |
| Tenant | [Get-AzTenantDeploymentOperation](/powershell/module/az.resources/get-aztenantdeploymentoperation) <br> [Get-AzTenantDeployment](/powershell/module/az.resources/get-aztenantdeployment) |


# [Azure CLI](#tab/azure-cli)

To see a deployment's operations messages with Azure CLI, use [az deployment operation group list](/cli/azure/deployment/operation/group#az-deployment-operation-group-list).

To show all the operations for a deployment:

```azurecli
az deployment operation group list \
  --name exampledeployment \
  --resource-group examplegroup \
  --query "[*].properties"
```

To specify a specific property type:

```azurecli
az deployment operation group list \
  --name exampledeployment \
  --resource-group examplegroup \
  --query "[*].properties.statusCode"
```

To get a deployment's result, use [az deployment group show](/cli/azure/deployment/group#az-deployment-group-show).

```azurecli
az deployment group show \
  --resource-group examplegroup \
  --name exampledeployment
```

### Other scopes

There are Azure CLI commands to get deployment information for the subscription, management group, and tenant scopes.

| Scope | Commands |
| ---- | ---- |
| Subscription | [az deployment operation sub list](/cli/azure/deployment/operation/sub#az-deployment-operation-sub-list) <br> [az deployment sub show](/cli/azure/deployment/sub#az-deployment-sub-show) |
| Management group | [az deployment operation mg list](/cli/azure/deployment/operation/mg#az-deployment-operation-mg-list) <br> [az deployment mg show](/cli/azure/deployment/mg#az-deployment-mg-show) |
| Tenant | [az deployment operation tenant list](/cli/azure/deployment/operation/tenant#az-deployment-operation-tenant-list) <br> [az deployment tenant show](/cli/azure/deployment/tenant#az-deployment-tenant-show) |

---

## Next steps

- [Common deployment errors](common-deployment-errors.md)
- [Enable debug logging](enable-debug-logging.md)
- [Create troubleshooting template](create-troubleshooting-template.md)
