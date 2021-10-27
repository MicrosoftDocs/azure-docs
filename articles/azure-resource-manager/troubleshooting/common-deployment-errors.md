---
title: Troubleshoot common deployment errors
description: Describes how to resolve common errors when you deploy Azure resources using Azure Resource Manager templates (ARM templates) or Bicep files.
tags: top-support-issue
ms.topic: troubleshooting
ms.date: 10/26/2021
ms.custom: devx-track-azurepowershell
---

# Troubleshoot common Azure deployment errors

This article describes some common Azure deployment errors, and provides information to resolve the errors. Azure resources can be deployed with Azure Resource Manager templates (ARM templates) or Bicep files. If you can't find the error code for your deployment error, see [Find error code](#find-error-code).

If you're looking for information about an error code and that information isn't provided in this article, let us know. At the bottom of this page, you can leave feedback. The feedback is tracked with GitHub Issues.

To run PowerShell and Azure CLI commands from the portal, use [Azure Cloud Shell](../../cloud-shell/overview.md). To run commands from your computer, install [Azure PowerShell](/powershell/azure/install-az-ps) or [Azure CLI](/cli/azure/install-azure-cli).

## Error codes

| Error code | Mitigation | More information |
| ---------- | ---------- | ---------------- |
| AccountNameInvalid | Follow naming restrictions for storage accounts. | [Resolve storage account name](error-storage-account-name.md) |
| AccountPropertyCannotBeSet | Check available storage account properties. | [storageAccounts](/azure/templates/microsoft.storage/storageaccounts) |
| AllocationFailed | The cluster or region doesn't have resources available or can't support the requested VM size. Retry the request at a later time, or request a different VM size. | [Provisioning and allocation issues for Linux](/troubleshoot/azure/virtual-machines/troubleshoot-deployment-new-vm-linux) <br><br> [Provisioning and allocation issues for Windows](/troubleshoot/azure/virtual-machines/troubleshoot-deployment-new-vm-windows) <br><br> [Troubleshoot allocation failures](/troubleshoot/azure/virtual-machines/allocation-failure)|
| AnotherOperationInProgress | Wait for concurrent operation to complete. | |
| AuthorizationFailed | Your account or service principal doesn't have sufficient access to complete the deployment. Check the role your account belongs to, and its access for the deployment scope.<br><br>You might receive this error when a required resource provider isn't registered. | [Azure role-based access control (Azure RBAC)](../../role-based-access-control/role-assignments-portal.md)<br><br>[Resolve registration](error-register-resource-provider.md) |
| BadRequest | You sent deployment values that don't match what is expected by Resource Manager. Check the inner status message for help with troubleshooting. | [Template reference](/azure/templates/) and [Supported locations](../templates/resource-location.md) |
| Conflict | You're requesting an operation that isn't allowed in the resource's current state. For example, disk resizing is allowed only when creating a VM or when the VM is deallocated. | |
| DeploymentActiveAndUneditable | Wait for concurrent deployment to this resource group to complete. | |
| DeploymentFailedCleanUp | When you deploy in complete mode, any resources that aren't in the template are deleted. You get this error when you don't have adequate permissions to delete all of the resources not in the template. To avoid the error, change the deployment mode to incremental. | [Azure Resource Manager deployment modes](../templates/deployment-modes.md) |
| DeploymentNameInvalidCharacters | The deployment name can only contain letters, digits, hyphen `(-)`, dot `(.)` or underscore `(_)`. | |
| DeploymentNameLengthLimitExceeded | The deployment names are limited to 64 characters.  | |
| DeploymentFailed | The DeploymentFailed error is a general error that doesn't provide the details you need to solve the error. Look in the error details for an error code that provides more information. | [Find error code](#find-error-code) |
| DeploymentQuotaExceeded | If you reach the limit of 800 deployments per resource group, delete deployments from the history that are no longer needed. | [Resolve error when deployment count exceeds 800](deployment-quota-exceeded.md) |
| DeploymentJobSizeExceeded | Simplify your template to reduce size. | [Resolve template size errors](error-job-size-exceeded.md) |
| DnsRecordInUse | The DNS record name must be unique. Enter a different name. | |
| ImageNotFound | Check VM image settings. |  |
| InternalServerError | Caused by a temporary problem. Retry the deployment. | |
| InUseSubnetCannotBeDeleted | You might get this error when trying to update a resource, and the request is processed by deleting and creating the resource. Make sure to specify all unchanged values. | [Update resource](/azure/architecture/guide/azure-resource-manager/advanced-templates/update-resource) |
| InvalidAuthenticationTokenTenant | Get access token for the appropriate tenant. You can only get the token from the tenant that your account belongs to. | |
| InvalidContentLink | You've most likely attempted to link to a nested template that isn't available. Double check the URI you provided for the nested template. If the template exists in a storage account, make sure the URI is accessible. You might need to pass a SAS token. Currently, you can't link to a template that is in a storage account behind an [Azure Storage firewall](../../storage/common/storage-network-security.md). Consider moving your template to another repository, like GitHub. | [Linked templates](../templates/linked-templates.md) |
| InvalidDeploymentLocation | When deploying at the subscription level, you've provided a different location for a previously used deployment name. | [Subscription level deployments](../templates/deploy-to-subscription.md) |
| InvalidParameter | One of the values you provided for a resource doesn't match the expected value. This error can result from many different conditions. For example, a password may be insufficient, or a blob name may be incorrect. The error message should indicate which value needs to be corrected. | |
| InvalidRequestContent | The deployment values either include values that aren't recognized, or required values are missing. Confirm the values for your resource type. | [Template reference](/azure/templates/) |
| InvalidRequestFormat | Enable debug logging when running the deployment, and verify the contents of the request. | [Debug logging](#enable-debug-logging) |
| InvalidResourceLocation | Provide a unique name for the storage account. | [Resolve storage account name](error-storage-account-name.md) |
| InvalidResourceNamespace | Check the resource namespace you specified in the **type** property. | [Template reference](/azure/templates/) |
| InvalidResourceReference | The resource either doesn't yet exist or is incorrectly referenced. Check whether you need to add a dependency. Verify that your use of the **reference** function includes the required parameters for your scenario. | [Resolve dependencies](error-not-found.md) |
| InvalidResourceType | Check the resource type you specified in the **type** property. | [Template reference](/azure/templates/) |
| InvalidSubscriptionRegistrationState | Register your subscription with the resource provider. | [Resolve registration](error-register-resource-provider.md) |
| InvalidTemplateDeployment <br> InvalidTemplate | Check your template syntax for errors. | [Resolve invalid template](error-invalid-template.md) |
| InvalidTemplateCircularDependency | Remove unnecessary dependencies. | [Resolve circular dependencies](error-invalid-template.md#circular-dependency) |
| JobSizeExceeded | Simplify your template to reduce size. | [Resolve template size errors](error-job-size-exceeded.md) |
| LinkedAuthorizationFailed | Check if your account belongs to the same tenant as the resource group that you're deploying to. | |
| LinkedInvalidPropertyId | The resource ID for a resource isn't resolving correctly. Check that you provide all required values for the resource ID, including subscription ID, resource group name, resource type, parent resource name (if needed), and resource name. | |
| LocationRequired | Provide a location for the resource. | [Set location](../templates/resource-location.md) |
| MismatchingResourceSegments | Make sure a nested resource has the correct number of segments in name and type. | [Resolve resource segments](error-invalid-template.md#incorrect-segment-lengths) |
| MissingRegistrationForLocation | Check resource provider registration status and supported locations. | [Resolve registration](error-register-resource-provider.md) |
| MissingSubscriptionRegistration | Register your subscription with the resource provider. | [Resolve registration](error-register-resource-provider.md) |
| NoRegisteredProviderFound | Check resource provider registration status. | [Resolve registration](error-register-resource-provider.md) |
| NotFound | You might be attempting to deploy a dependent resource in parallel with a parent resource. Check if you need to add a dependency. | [Resolve dependencies](error-not-found.md) |
| OperationNotAllowed | The deployment is attempting an operation that exceeds the quota for the subscription, resource group, or region. If possible, revise your deployment to stay within the quotas. Otherwise, consider requesting a change to your quotas. | [Resolve quotas](error-resource-quota.md) |
| ParentResourceNotFound | Make sure a parent resource exists before creating the child resources. | [Resolve parent resource](error-parent-resource.md) |
| PasswordTooLong | You might have selected a password with too many characters, or converted your password value to a secure string before passing it as a parameter. If the template includes a **secure string** parameter, you don't need to convert the value to a secure string. Provide the password value as text. |  |
| PrivateIPAddressInReservedRange | The specified IP address includes an address range required by Azure. Change IP address to avoid reserved range. | [IP addresses](../../virtual-network/ip-services/public-ip-addresses.md) |
| PrivateIPAddressNotInSubnet | The specified IP address is outside of the subnet range. Change IP address to fall within subnet range. | [IP addresses](../../virtual-network/ip-services/public-ip-addresses.md) |
| PropertyChangeNotAllowed | Some properties can't be changed on a deployed resource. When updating a resource, limit your changes to permitted properties. | [Update resource](/azure/architecture/guide/azure-resource-manager/advanced-templates/update-resource) |
| RequestDisallowedByPolicy | Your subscription includes a resource policy that prevents an action you're trying to do during deployment. Find the policy that blocks the action. If possible, change your deployment to meet the limitations from the policy. | [Resolve policies](error-policy-requestdisallowedbypolicy.md) |
| ReservedResourceName | Provide a resource name that doesn't include a reserved name. | [Reserved resource names](error-reserved-resource-name.md) |
| ResourceGroupBeingDeleted | Wait for deletion to complete. | |
| ResourceGroupNotFound | Check the name of the target resource group for the deployment. The target resource group must already exist in your subscription. Check your subscription context. | [Azure CLI](/cli/azure/account?#az_account_set) [PowerShell](/powershell/module/Az.Accounts/Set-AzContext) |
| ResourceNotFound | Your deployment references a resource that can't be resolved. Verify that your use of the **reference** function includes the parameters required for your scenario. | [Resolve references](error-not-found.md) |
| ResourceQuotaExceeded | The deployment is trying to create resources that exceed the quota for the subscription, resource group, or region. If possible, revise your infrastructure to stay within the quotas. Otherwise, consider requesting a change to your quotas. | [Resolve quotas](error-resource-quota.md) |
| SkuNotAvailable | Select SKU (such as VM size) that is available for the location you've selected. | [Resolve SKU](error-sku-not-available.md) |
| StorageAccountAlreadyExists <br> StorageAccountAlreadyTaken | Provide a unique name for the storage account. | [Resolve storage account name](error-storage-account-name.md)  |
| StorageAccountNotFound | Check the subscription, resource group, and name of the storage account that you're trying to use. | |
| SubnetsNotInSameVnet | A virtual machine can only have one virtual network. When deploying several NICs, make sure they belong to the same virtual network. | [Multiple NICs](../../virtual-machines/windows/multiple-nics.md) |
| SubscriptionNotFound | A specified subscription for deployment can't be accessed. It could be the subscription ID is wrong, the user deploying the template doesn't have adequate permissions to deploy to the subscription, or the subscription ID is in the wrong format. When using nested deployments to [deploy across scopes](../templates/deploy-to-resource-group.md), provide the GUID for the subscription. | |
| SubscriptionNotRegistered | When deploying a resource, the resource provider must be registered for your subscription. When you use an Azure Resource Manager template for deployment, the resource provider is automatically registered in the subscription. Sometimes, the automatic registration doesn't complete in time. To avoid this intermittent error, register the resource provider before deployment. | [Resolve registration](error-register-resource-provider.md) |
| TemplateResourceCircularDependency | Remove unnecessary dependencies. | [Resolve circular dependencies](error-invalid-template.md#circular-dependency) |
| TooManyTargetResourceGroups | Reduce number of resource groups for a single deployment. | [Cross scope deployment](../templates/deploy-to-resource-group.md) |

## Find error code

There are two types of errors you can receive:

- Validation errors
- Deployment errors

Validation errors arise from scenarios that can be determined before deployment. For example, template syntax errors, or trying to deploy resources that would exceed your subscription quotas. Deployment errors arise from conditions that occur during the deployment process. They include trying to access a resource that's being deployed in parallel.

For ARM templates, both types of errors return an error code that you use to troubleshoot the deployment. Both types of errors appear in the [activity log](../../azure-monitor/essentials/activity-log.md). However, validation errors don't appear in your deployment history because the deployment never started. Bicep file validation errors don't appear in your activity log or deployment history. It takes a few minutes for the activity log to display the latest deployment information.

### Validation errors

You can upload an ARM template to the portal and deploy resources. If the template has syntax errors, you'll see a validation error when you attempt to run the deployment. For more information, see [deploy resources from custom template](../templates/deploy-portal.md#deploy-resources-from-custom-template).

The following example attempts to deploy a storage account and a validation error occurs.

:::image type="content" source="media/common-deployment-errors/validation-error.png" alt-text="Screenshot of an Azure portal validation error.":::

Select the message for more details. The template has a syntax error with error code `InvalidTemplate`. The **Summary** shows an expression is missing a closing parenthesis.

:::image type="content" source="media/common-deployment-errors/validation-details.png" alt-text="Screenshot of a validation error message that shows a syntax error.":::

### Deployment errors

When the operation passes validation, but fails during deployment, you get a deployment error.

To view the deployment error in the portal, go to the resource group and select **Settings** > **Deployments**. Select **Error details**.

:::image type="content" source="media/common-deployment-errors/deployment-error-details.png" alt-text="Screenshot of a resource group's link to error details for a failed deployment.":::

The error message and error code `NoRegisteredProviderFound` are shown.

:::image type="content" source="media/common-deployment-errors/deployment-error-summary.png" alt-text="Screenshot of a message that shows deployment error details.":::

### PowerShell

To see deployment error codes and messages with PowerShell, use [Get-AzResourceGroupDeployment](/powershell/module/az.resources/get-azresourcegroupdeployment).

```azurepowershell
(Get-AzResourceGroupDeploymentOperation -DeploymentName exampledeployment -ResourceGroupName examplegroup).StatusMessage
```

### Azure CLI

To see deployment error codes and messages with Azure CLI, use [az deployment operation group list](/cli/azure/deployment/operation/group#az_deployment_operation_group_list).

```azurecli
az deployment operation group list --name exampledeployment --resource-group examplegroup --query "[*].properties.statusMessage"
```

## Enable debug logging

Sometimes you need more information about the request and response to learn what went wrong. During deployment, you can request that additional information is logged during a deployment.

### PowerShell

In PowerShell, use [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) to set the `DeploymentDebugLogLevel` parameter to `All`, `ResponseContent`, or `RequestContent`.

> [!NOTE]
> When debug logging is enabled, a warning is displayed that secrets like passwords or listKeys can be logged by commands like [Get-AzResourceGroupDeploymentOperation](/powershell/module/az.resources/get-azresourcegroupdeploymentoperation).
>
> Use Azure CLI to get the debug `request` and `response` information because `Get-AzResourceGroupDeploymentOperation` in Az module versions 4.8 and later doesn't include `properties` in output.  For more information, see [GitHub issue 14706](https://github.com/Azure/azure-powershell/issues/14706).


```azurepowershell
New-AzResourceGroupDeployment `
  -Name exampledeployment `
  -ResourceGroupName examplegroup `
  -TemplateFile c:\Azure\Templates\storage.json `
  -DeploymentDebugLogLevel All
```

Examine the request content with the following cmdlet:

```azurepowershell
(Get-AzResourceGroupDeploymentOperation `
-DeploymentName exampledeployment `
-ResourceGroupName examplegroup).Properties.request `
| ConvertTo-Json
```

Or, the response content with:

```azurepowershell
(Get-AzResourceGroupDeploymentOperation `
-DeploymentName exampledeployment `
-ResourceGroupName examplegroup).Properties.response `
| ConvertTo-Json
```

This information can help you determine whether a value in the template is being incorrectly set.

### Azure CLI

Currently, Azure CLI doesn't support turning on debug logging, but you can retrieve debug logging.

Examine the deployment operations with the following command:

```azurecli
az deployment operation group list \
  --resource-group examplegroup \
  --name exampledeployment
```

Examine the request content with the following command:

```azurecli
az deployment operation group list \
  --name exampledeployment \
  --resource-group examplegroup \
  --query [].properties.request
```

Examine the response content with the following command:

```azurecli
az deployment operation group list \
  --name exampledeployment \
  --resource-group examplegroup \
  --query [].properties.response
```

### Nested template

To log debug information for a [nested](../templates/linked-templates.md#nested-template) ARM template, use the `debugSetting` element.

```json
{
  "type": "Microsoft.Resources/deployments",
  "apiVersion": "2020-10-01",
  "name": "nestedTemplate",
  "properties": {
    "mode": "Incremental",
    "templateLink": {
      "uri": "{template-uri}",
      "contentVersion": "1.0.0.0"
    },
    "debugSetting": {
       "detailLevel": "requestContent, responseContent"
    }
  }
}
```

Bicep uses [modules](../bicep/modules.md) rather than [Microsoft.Resources/deployments](/azure/templates/microsoft.resources/deployments). With modules, you can reuse your code to deploy a Bicep file from another Bicep file.

## Create a troubleshooting template

In some cases, the easiest way to troubleshoot your template is to test parts of it. You can create a simplified template that enables you to focus on the part that you believe is causing the error. For example, suppose you're receiving an error when referencing a resource. Rather than dealing with an entire template, create a template that returns the part that may be causing your problem. It can help you determine whether you're passing in the right parameters, using template functions correctly, and getting the resource you expect.

The following ARM template and Bicep file examples use an existing storage account. The parameters specify the storage account's name and resource group. You can use Azure Cloud Shell to deploy the [ARM template](../templates/deploy-cloud-shell.md#deploy-local-template) or [Bicep file](../bicep/deploy-cloud-shell.md). The output is an object with the storage account's property names and values.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageName": {
      "type": "string"
    },
    "storageResourceGroup": {
      "type": "string"
    }
  },
  "variables": {},
  "resources": [],
  "outputs": {
    "exampleOutput": {
      "value": "[reference(resourceId(parameters('storageResourceGroup'), 'Microsoft.Storage/storageAccounts', parameters('storageName')), '2021-04-01')]",
      "type": "object"
    }
  }
}
```

For the Bicep sample, run the deployment command from the resource group where the storage account exists.

```bicep
param storageName string

resource stg 'Microsoft.Storage/storageAccounts@2021-04-01' existing = {
  name: storageName
}

output exampleOutput object = stg.properties
```

Or, suppose you're getting deployment errors that you believe are related to incorrectly set dependencies. Test your template by breaking it into simplified templates. First, create a template that deploys only a single resource (like a SQL Server). When you're sure you have that resource correctly defined, add a resource that depends on it (like a SQL Database). When you have those two resources correctly defined, add other dependent resources (like auditing policies). In between each test deployment, delete the resource group to make sure you're adequately testing the dependencies.

## Next steps

- To learn more about ARM template troubleshooting, see [Quickstart: Troubleshoot ARM template deployments](quickstart-troubleshoot-arm-deployment.md).
- To learn more about Bicep file troubleshooting, see [Quickstart: Troubleshoot Bicep file deployments](quickstart-troubleshoot-bicep-deployment.md).
- To learn about actions to determine the errors during deployment, see [View deployment operations](../templates/deployment-history.md).
