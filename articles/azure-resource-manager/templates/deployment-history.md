---
title: Deployment history
description: Describes how to view Azure Resource Manager deployment operations with the portal, PowerShell, Azure CLI, and REST API.
tags: top-support-issue
ms.topic: conceptual
ms.date: 05/22/2023
ms.custom: devx-track-azurepowershell, devx-track-azurecli, devx-track-arm-template
---

# View deployment history with Azure Resource Manager

Azure Resource Manager enables you to view your deployment history. You can examine specific operations in past deployments and see which resources were deployed. This history contains information about any errors.

The deployment history for a resource group is limited to 800 deployments. As you near the limit, deployments are automatically deleted from the history. For more information, see [Automatic deletions from deployment history](deployment-history-deletions.md).

For help with resolving particular deployment errors, see [Troubleshoot common Azure deployment errors](../troubleshooting/common-deployment-errors.md).

## Correlation ID and support

Each deployment has a correlation ID, which is used to track related events. If you [create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md), support may ask you for the correlation ID. Support uses the correlation ID to identify the operations for the failed deployment.

The examples in this article show how to retrieve the correlation ID.

## Resource group deployments

You can view details about a resource group deployment through the Azure portal, PowerShell, Azure CLI, or REST API.

# [Portal](#tab/azure-portal)

1. Select the **resource group** you want to examine.

   :::image type="content" source="media/deployment-history/select-resource-group.png" alt-text="Screenshot of selecting resource group.":::

1. Select the link under **Deployments**.

   :::image type="content" source="media/deployment-history/select-deployment-history.png" alt-text="Screenshot of resource group overview that shows successful deployment.":::

1. Select one of the deployments from the deployment history.

   :::image type="content" source="media/deployment-history/select-details.png" alt-text="Screenshot of highlighted link for a resource deployment.":::

1. A summary of the deployment is displayed, including the correlation ID.

   :::image type="content" source="media/deployment-history/show-correlation-id.png" alt-text="Screenshot of resource group deployment history that highlights correlation ID.":::

# [PowerShell](#tab/azure-powershell)

To list all deployments for a resource group, use the [Get-AzResourceGroupDeployment](/powershell/module/az.resources/Get-AzResourceGroupDeployment) command.

```azurepowershell-interactive
Get-AzResourceGroupDeployment -ResourceGroupName ExampleGroup
```

To get a specific deployment from a resource group, add the `DeploymentName` parameter.

```azurepowershell-interactive
Get-AzResourceGroupDeployment -ResourceGroupName ExampleGroup -DeploymentName ExampleDeployment
```

To get the correlation ID, use:

```azurepowershell-interactive
(Get-AzResourceGroupDeployment -ResourceGroupName ExampleGroup -DeploymentName ExampleDeployment).CorrelationId
```

# [Azure CLI](#tab/azure-cli)

To list all the deployments for a resource group, use [az deployment group list](/cli/azure/deployment/group#az-deployment-group-list).

```azurecli-interactive
az deployment group list --resource-group ExampleGroup
```

To get a specific deployment, use the [az deployment group show](/cli/azure/deployment/group#az-deployment-group-show).

```azurecli-interactive
az deployment group show --resource-group ExampleGroup --name ExampleDeployment
```

To get the correlation ID, use:

```azurecli-interactive
az deployment group show --resource-group ExampleGroup --name ExampleDeployment --query properties.correlationId
```

# [HTTP](#tab/http)

To list the deployments for a resource group, use the following operation. For the latest API version number to use in the request, see  [Deployments - List By Resource Group](/rest/api/resources/deployments/listbyresourcegroup).

```rest
GET https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Resources/deployments/?api-version={api-version}
```

To get a specific deployment, use the following operation. For the latest API version number to use in the request, see [Deployments - Get](/rest/api/resources/deployments/get).

```rest
GET https://management.azure.com/subscriptions/{subscription-id}/resourcegroups/{resource-group-name}/providers/microsoft.resources/deployments/{deployment-name}?api-version={api-version}
```

The response includes the correlation ID.

```json
{
 ...
 "properties": {
   "mode": "Incremental",
   "provisioningState": "Failed",
   "timestamp": "2019-11-26T14:18:36.4518358Z",
   "duration": "PT26.2091817S",
   "correlationId": "11111111-1111-1111-1111-111111111111",
   ...
 }
}
```

---

## Subscription deployments

You can view the history of deployments to a subscription.

# [Portal](#tab/azure-portal)

1. Select the **subscription** you want to examine.

   :::image type="content" source="media/deployment-history/select-subscription.png" alt-text="Screenshot of selecting subscription.":::

1. In the left pane, select **Deployments**.

   :::image type="content" source="media/deployment-history/select-subscription-deployments.png" alt-text="Screenshot of subscription with deployments option.":::

1. Select one of the deployments from the deployment history.

   :::image type="content" source="media/deployment-history/select-deployment-from-subscription.png" alt-text="Screenshot of deployment history for a subscription.":::

1. A summary of the deployment is displayed, including the correlation ID.

   :::image type="content" source="media/deployment-history/subscription-deployment-details.png" alt-text="Screenshot of subscription deployment history that highlights correlation ID.":::

# [PowerShell](#tab/azure-powershell)

To list all deployments for the current subscription, use the `Get-AzSubscriptionDeployment` command. This command  is equivalent to [Get-AzDeployment](/powershell/module/az.resources/get-azdeployment).

```azurepowershell-interactive
Get-AzSubscriptionDeployment
```

To get a specific deployment from a subscription, add the `Name` parameter.

```azurepowershell-interactive
Get-AzSubscriptionDeployment -Name ExampleDeployment
```

To get the correlation ID, use:

```azurepowershell-interactive
(Get-AzSubscriptionDeployment -Name ExampleDeployment).CorrelationId
```

# [Azure CLI](#tab/azure-cli)

To list all the deployments for the current subscription, use [az deployment sub list](/cli/azure/deployment/sub?#az-deployment-sub-list).

```azurecli-interactive
az deployment sub list
```

To get a specific deployment, use the [az deployment sub show](/cli/azure/deployment/sub#az-deployment-sub-show).

```azurecli-interactive
az deployment sub show --name ExampleDeployment
```

To get the correlation ID, use:

```azurecli-interactive
az deployment sub show --name ExampleDeployment --query properties.correlationId
```

# [HTTP](#tab/http)

To list the deployments for a subscription, use the following operation. For the latest API version number to use in the request, see  [Deployments - List At Subscription Scope](/rest/api/resources/deployments/list-at-subscription-scope).

```rest
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Resources/deployments/?api-version={api-version}
```

To get a specific deployment, use the following operation. For the latest API version number to use in the request, see [Deployments - Get At Subscription Scope](/rest/api/resources/deployments/get-at-subscription-scope).

```rest
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Resources/deployments/{deploymentName}?api-version={api-version}
```

The response includes the correlation ID.

```json
{
 ...
 "properties": {
   "mode": "Incremental",
   "provisioningState": "Failed",
   "timestamp": "2019-11-26T14:18:36.4518358Z",
   "duration": "PT26.2091817S",
   "correlationId": "11111111-1111-1111-1111-111111111111",
   ...
 }
}
```

---

## Management group deployments

You can view the history of deployments to a management group.

# [Portal](#tab/azure-portal)

1. Select the **management group** you want to examine. If you don't have sufficient permissions to view details about the management group, you won't be able to select it.

   :::image type="content" source="media/deployment-history/select-management-group.png" alt-text="Screenshot of selecting management group.":::

1. In the left pane, select **Deployments**.

   :::image type="content" source="media/deployment-history/select-management-group-deployments.png" alt-text="Screenshot of management group overview that shows deployment option.":::

1. Select one of the deployments from the deployment history.

   :::image type="content" source="media/deployment-history/select-deployment-from-management-group.png" alt-text="Screenshot of deployment history for management group.":::

1. A summary of the deployment is displayed, including the correlation ID.

   :::image type="content" source="media/deployment-history/management-group-history.png" alt-text="Screenshot of management group deployment history that highlights correlation ID.":::

# [PowerShell](#tab/azure-powershell)

To list all deployments for a management group, use the [Get-AzManagementGroupDeployment](/powershell/module/az.resources/get-azmanagementgroupdeployment) command. If you don't have sufficient permissions to view deployments for the management group, you'll get an error.

```azurepowershell-interactive
Get-AzManagementGroupDeployment -ManagementGroupId examplemg
```

To get a specific deployment from a management group, add the `Name` parameter.

```azurepowershell-interactive
Get-AzManagementGroupDeployment -ManagementGroupId examplemg -Name ExampleDeployment
```

To get the correlation ID, use:

```azurepowershell-interactive
(Get-AzManagementGroupDeployment -ManagementGroupId examplemg -Name ExampleDeployment).CorrelationId
```

# [Azure CLI](#tab/azure-cli)

To list all the deployments for a management group, use [az deployment mg list](/cli/azure/deployment/mg#az-deployment-mg-list). If you don't have sufficient permissions to view deployments for the management group, you'll get an error.

```azurecli-interactive
az deployment mg list --management-group-id examplemg
```

To get a specific deployment, use the [az deployment mg show](/cli/azure/deployment/mg#az-deployment-mg-show).

```azurecli-interactive
az deployment mg show --management-group-id examplemg --name ExampleDeployment
```

To get the correlation ID, use:

```azurecli-interactive
az deployment mg show --management-group-id examplemg --name ExampleDeployment --query properties.correlationId
```

# [HTTP](#tab/http)

To list the deployments for a management group, use the following operation. For the latest API version number to use in the request, see  [Deployments - List At Management Group Scope](/rest/api/resources/deployments/list-at-management-group-scope). If you don't have sufficient permissions to view deployments for the management group, you'll get an error.

```rest
GET https://management.azure.com/providers/Microsoft.Management/managementGroups/{groupId}/providers/Microsoft.Resources/deployments/?api-version={api-version}
```

To get a specific deployment, use the following operation. For the latest API version number to use in the request, see [Deployments - Get At Management Group Scope](/rest/api/resources/deployments/get-at-management-group-scope).

```rest
GET https://management.azure.com/providers/Microsoft.Management/managementGroups/{groupId}/providers/Microsoft.Resources/deployments/{deploymentName}?api-version={api-version}
```

The response includes the correlation ID.

```json
{
 ...
 "properties": {
   "mode": "Incremental",
   "provisioningState": "Failed",
   "timestamp": "2019-11-26T14:18:36.4518358Z",
   "duration": "PT26.2091817S",
   "correlationId": "11111111-1111-1111-1111-111111111111",
   ...
 }
}
```

---

## Tenant deployments

You can view the history of deployments to a tenant.

# [Portal](#tab/azure-portal)

The portal doesn't currently show tenant deployments.

# [PowerShell](#tab/azure-powershell)

To list all deployments for the current tenant, use the [Get-AzTenantDeployment](/powershell/module/az.resources/get-aztenantdeployment) command. If you don't have sufficient permissions to view deployments for the tenant, you'll get an error.

```azurepowershell-interactive
Get-AzTenantDeployment
```

To get a specific deployment from the current tenant, add the `Name` parameter.

```azurepowershell-interactive
Get-AzTenantDeployment -Name ExampleDeployment
```

To get the correlation ID, use:

```azurepowershell-interactive
(Get-AzTenantDeployment -Name ExampleDeployment).CorrelationId
```

# [Azure CLI](#tab/azure-cli)

To list all the deployments for the current tenant, use [az deployment tenant list](/cli/azure/deployment/tenant#az-deployment-tenant-list). If you don't have sufficient permissions to view deployments for the tenant, you'll get an error.

```azurecli-interactive
az deployment tenant list
```

To get a specific deployment, use the [az deployment tenant show](/cli/azure/deployment/tenant#az-deployment-tenant-show).

```azurecli-interactive
az deployment tenant show --name ExampleDeployment
```

To get the correlation ID, use:

```azurecli-interactive
az deployment tenant show --name ExampleDeployment --query properties.correlationId
```

# [HTTP](#tab/http)

To list the deployments for the current tenant, use the following operation. For the latest API version number to use in the request, see  [Deployments - List At Tenant Scope](/rest/api/resources/deployments/list-at-tenant-scope). If you don't have sufficient permissions to view deployments for the tenant, you'll get an error.

```rest
GET https://management.azure.com/providers/Microsoft.Resources/deployments/?api-version={api-version}
```

To get a specific deployment, use the following operation. For the latest API version number to use in the request, see [Deployments - Get At Tenant Scope](/rest/api/resources/deployments/get-at-tenant-scope).

```rest
GET https://management.azure.com/providers/Microsoft.Resources/deployments/{deploymentName}?api-version={api-version}
```

The response includes the correlation ID.

```json
{
 ...
 "properties": {
   "mode": "Incremental",
   "provisioningState": "Failed",
   "timestamp": "2019-11-26T14:18:36.4518358Z",
   "duration": "PT26.2091817S",
   "correlationId": "11111111-1111-1111-1111-111111111111",
   ...
 }
}
```

---

## Deployment operations and error message

Each deployment can include multiple operations. To see more details about a deployment, view the deployment operations. When a deployment fails, the deployment operations include an error message.

# [Portal](#tab/azure-portal)

1. On the summary for a deployment, select **Operation details**.

   :::image type="content" source="media/deployment-history/get-operation-details.png" alt-text="Screenshot of failed deployment that highlights link for operation details.":::

1. You see the details for that step of the deployment. When an error occurs, the details include the error message.

   :::image type="content" source="media/deployment-history/see-operation-details.png" alt-text="Screenshot of failed deployment's operation details.":::

# [PowerShell](#tab/azure-powershell)

To view the deployment operations for deployment to a resource group, use the [Get-AzResourceGroupDeploymentOperation](/powershell/module/az.resources/get-azresourcegroupdeploymentoperation) command.

```azurepowershell-interactive
Get-AzResourceGroupDeploymentOperation -ResourceGroupName ExampleGroup -DeploymentName ExampleDeployment
```

To view failed operations, filter operations with **Failed** state.

```azurepowershell-interactive
Get-AzResourceGroupDeploymentOperation -ResourceGroupName ExampleGroup -Name ExampleDeployment | Where-Object { $_.ProvisioningState -eq "Failed" }
```

To get the status message of failed operations, use the following command:

```azurepowershell-interactive
(Get-AzResourceGroupDeploymentOperation -ResourceGroupName ExampleGroup -Name ExampleDeployment | Where-Object { $_.ProvisioningState -eq "Failed" }).StatusMessage
```

To view deployment operations for other scopes, use:

* [Get-AzDeploymentOperation](/powershell/module/az.resources/get-azdeploymentoperation)
* [Get-AzManagementGroupDeploymentOperation](/powershell/module/az.resources/get-azmanagementgroupdeploymentoperation)
* [Get-AzTenantDeploymentOperation](/powershell/module/az.resources/get-aztenantdeploymentoperation)

# [Azure CLI](#tab/azure-cli)

To view the deployment operations for deployment to a resource group, use the [az deployment operation group list](/cli/azure/deployment/operation/group#az-deployment-operation-group-list) command. You must have Azure CLI 2.6.0 or later.

```azurecli-interactive
az deployment operation group list --resource-group ExampleGroup --name ExampleDeployment
```

To view failed operations, filter operations with **Failed** state.

```azurecli-interactive
az deployment operation group list --resource-group ExampleGroup --name ExampleDeployment --query "[?properties.provisioningState=='Failed']"
```

To get the status message of failed operations, use the following command:

```azurecli-interactive
az deployment operation group list --resource-group ExampleGroup --name ExampleDeployment --query "[?properties.provisioningState=='Failed'].properties.statusMessage.error"
```

To view deployment operations for other scopes, use:

* [az deployment operation sub list](/cli/azure/deployment/operation/sub#az-deployment-operation-sub-list)
* [az deployment operation mg list](/cli/azure/deployment/operation/sub)
* [az deployment operation tenant list](/cli/azure/deployment/operation/sub).

# [HTTP](#tab/http)

To get deployment operations, use the following operation. For the latest API version number to use in the request, see [Deployment Operations - List](/rest/api/resources/deploymentoperations/list).

```rest
GET https://management.azure.com/subscriptions/{subscription-id}/resourcegroups/{resource-group-name}/providers/microsoft.resources/deployments/{deployment-name}/operations?$skiptoken={skiptoken}&api-version={api-version}
```

The response includes an error message.

```json
{
  "value": [
    {
      "id": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/examplegroup/providers/Microsoft.Resources/deployments/exampledeployment/operations/1234567890ABCDEF",
      "operationId": "1234567890ABCDEF",
      "properties": {
        "provisioningOperation": "Create",
        "provisioningState": "Failed",
        "timestamp": "2019-11-26T14:18:36.3177613Z",
        "duration": "PT21.0580179S",
        "trackingId": "11111111-1111-1111-1111-111111111111",
        "serviceRequestId": "11111111-1111-1111-1111-111111111111",
        "statusCode": "BadRequest",
        "statusMessage": {
          "error": {
            "code": "InvalidAccountType",
            "message": "The AccountType Standard_LRS1 is invalid. For more information, see - https://aka.ms/storageaccountskus"
          }
        },
        "targetResource": {
          "id": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/examplegroup/providers/Microsoft.Storage/storageAccounts/storage",
          "resourceType": "Microsoft.Storage/storageAccounts",
          "resourceName": "storage"
        }
      }
    },
    ...
  ]
}
```

To view deployment operations for other scopes, use:

* [Deployment Operations - List At Subscription Scope](/rest/api/resources/deployment-operations/list-at-subscription-scope)
* [Deployment Operations - List At Management Group Scope](/rest/api/resources/deployment-operations/list-at-management-group-scope)
* [Deployment Operations - List At Tenant Scope](/rest/api/resources/deployment-operations/list-at-tenant-scope)

---

## Next steps

- For help resolve specific deployment errors, see [Troubleshoot common Azure deployment errors](common-deployment-errors.md).
- To learn about how deployments are managed in the history, see [Automatic deletions from deployment history](deployment-history-deletions.md).
- To preview changes a template will make before you deploy, see [ARM template deployment what-if operation](deploy-what-if.md).
