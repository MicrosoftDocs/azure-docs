---
title: Troubleshoot common Azure deployment errors | Microsoft Docs
description: Describes how to resolve common errors when you deploy resources to Azure using Azure Resource Manager.
services: azure-resource-manager
documentationcenter: ''
tags: top-support-issue
author: tfitzmac
manager: timlt
editor: tysonn
keywords: deployment error, azure deployment, deploy to azure

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/16/2018
ms.author: tomfitz

---
# Troubleshoot common Azure deployment errors with Azure Resource Manager

This article describes some common Azure deployment errors you may encounter, and provides information to resolve the errors. If you cannot find the error code for your deployment error, see [Find error code](#find-error-code).

## Error codes

| Error code | Mitigation | More information |
| ---------- | ---------- | ---------------- |
| AccountNameInvalid | Follow naming restrictions for storage accounts. | [Resolve storage account name](resource-manager-storage-account-name-errors.md) |
| AccountPropertyCannotBeSet | Check available storage account properties. | [storageAccounts](/azure/templates/microsoft.storage/storageaccounts) |
| AllocationFailed | The cluster or region does not have resources available or cannot support the requested VM size. Retry the request at a later time, or request a different VM size. | [Provisioning and allocation issues for Linux](../virtual-machines/linux/troubleshoot-deployment-new-vm.md), [Provisioning and allocation issues for Windows](../virtual-machines/windows/troubleshoot-deployment-new-vm.md) and [Troubleshoot allocation failures](../virtual-machines/troubleshooting/allocation-failure.md)|
| AnotherOperationInProgress | Wait for concurrent operation to complete. | |
| AuthorizationFailed | Your account or service principal does not have sufficient access to complete the deployment. Check the role your account belongs to, and its access for the deployment scope. | [Azure Role-Based Access Control](../role-based-access-control/role-assignments-portal.md) |
| BadRequest | You sent deployment values that do not match what is expected by Resource Manager. Check the inner status message for help with troubleshooting. | [Template reference](/azure/templates/) and [Supported locations](resource-manager-templates-resources.md#location) |
| Conflict | You are requesting an operation that is not permitted in the resource's current state. For example, disk resizing is allowed only when creating a VM or when the VM is deallocated. | |
| DeploymentActive | Wait for concurrent deployment to this resource group to complete. | |
| DeploymentFailed | The DeploymentFailed error is a general error that does not provide the details you need to solve the error. Look in the error details for an error code that provides more information. | [Find error code](#find-error-code) |
| DeploymentQuotaExceeded | If you reach the limit of 800 deployments per resource group, delete deployments from the history that are no longer needed. You can delete entries from the history with [az group deployment delete](/cli/azure/group/deployment#az-group-deployment-delete) for Azure CLI, or [Remove-AzureRmResourceGroupDeployment](/powershell/module/azurerm.resources/remove-azurermresourcegroupdeployment) in PowerShell. Deleting an entry from the deployment history does not affect the deploy resources. | |
| DnsRecordInUse | The DNS record name must be unique. Either provide a different name, or modify the existing record. | |
| ImageNotFound | Check VM image settings. |  |
| InUseSubnetCannotBeDeleted | You may encounter this error when attempting to update a resource, but the request is processed by deleting and creating the resource. Make sure to specify all unchanged values. | [Update resource](/azure/architecture/building-blocks/extending-templates/update-resource) |
| InvalidAuthenticationTokenTenant | Get access token for the appropriate tenant. You can only get the token from the tenant that your account belongs to. | |
| InvalidContentLink | You have most likely attempted to link to a nested template that is not available. Double check the URI you provided for the nested template. If the template exists in a storage account, make sure the URI is accessible. You may need to pass a SAS token. | [Linked templates](resource-group-linked-templates.md) |
| InvalidParameter | One of the values you provided for a resource does not match the expected value. This error can result from many different conditions. For example, a password may be insufficient, or a blob name may be incorrect. Check the error message to determine which value needs to be corrected. | |
| InvalidRequestContent | Your deployment values either include values that are not expected or are missing required values. Confirm the values for your resource type. | [Template reference](/azure/templates/) |
| InvalidRequestFormat | Enable debug logging when executing the deployment, and verify the contents of the request. | [Debug logging](#enable-debug-logging) |
| InvalidResourceNamespace | Check the resource namespace you specified in the **type** property. | [Template reference](/azure/templates/) |
| InvalidResourceReference | The resource either does not yet exist or is incorrectly referenced. Check whether you need to add a dependency. Verify that your use of the **reference** function includes the required parameters for your scenario. | [Resolve dependencies](resource-manager-not-found-errors.md) |
| InvalidResourceType | Check the resource type you specified in the **type** property. | [Template reference](/azure/templates/) |
| InvalidSubscriptionRegistrationState | Register your subscription with the resource provider. | [Resolve registration](resource-manager-register-provider-errors.md) |
| InvalidTemplate | Check your template syntax for errors. | [Resolve invalid template](resource-manager-invalid-template-errors.md) |
| InvalidTemplateCircularDependency | Remove unnecessary dependencies. | [Resolve circular dependencies](resource-manager-invalid-template-errors.md#circular-dependency) |
| LinkedAuthorizationFailed | Check if your account belongs to the same tenant as the resource group you are deploying to. | |
| LinkedInvalidPropertyId | The resource ID for a resource is not resolving correctly. Check that you provide all required values for the resource ID, including subscription ID, resource group name, resource type, parent resource name (if needed), and resource name. | |
| LocationRequired | Provide a location for your resource. | [Set location](resource-manager-templates-resources.md#location) |
| MismatchingResourceSegments | Make sure nested resource has correct number of segments in name and type. | [Resolve resource segments](resource-manager-invalid-template-errors.md#incorrect-segment-lengths)
| MissingRegistrationForLocation | Check resource provider registration status, and supported locations. | [Resolve registration](resource-manager-register-provider-errors.md) |
| MissingSubscriptionRegistration | Register your subscription with the resource provider. | [Resolve registration](resource-manager-register-provider-errors.md) |
| NoRegisteredProviderFound | Check resource provider registration status. | [Resolve registration](resource-manager-register-provider-errors.md) |
| NotFound | You may be attempting to deploy a dependent resource in parallel with a parent resource. Check if you need to add a dependency. | [Resolve dependencies](resource-manager-not-found-errors.md) |
| OperationNotAllowed | The deployment is attempting an operation that exceeds the quota for the subscription, resource group, or region. If possible, revise your deployment to stay within the quotas. Otherwise, consider requesting a change to your quotas. | [Resolve quotas](resource-manager-quota-errors.md) |
| ParentResourceNotFound | Make sure a parent resource exists before creating the child resources. | [Resolve parent resource](resource-manager-parent-resource-errors.md) |
| PrivateIPAddressInReservedRange | The specified IP address includes an address range required by Azure. Change IP address to avoid reserved range. | [IP addresses](../virtual-network/virtual-network-ip-addresses-overview-arm.md) |
| PrivateIPAddressNotInSubnet | The specified IP address is outside of the subnet range. Change IP address to fall within subnet range. | [IP addresses](../virtual-network/virtual-network-ip-addresses-overview-arm.md) |
| PropertyChangeNotAllowed | Some properties cannot be changed on a deployed resource. When updating a resource, limit your changes to permitted properties. | [Update resource](/azure/architecture/building-blocks/extending-templates/update-resource) |
| RequestDisallowedByPolicy | Your subscription includes a resource policy that prevents an action you are trying to perform during deployment. Find the policy that blocks the action. If possible, modify your deployment to meet the limitations from the policy. | [Resolve policies](resource-manager-policy-requestdisallowedbypolicy-error.md) |
| ReservedResourceName | Provide a resource name that does not include a reserved name. | [Reserved resource names](resource-manager-reserved-resource-name.md) |
| ResourceGroupBeingDeleted | Wait for deletion to complete. | |
| ResourceGroupNotFound | Check the name of the target resource group for the deployment. It must already exist in your subscription. Check your subscription context. | [Azure CLI](/cli/azure/account?#az-account-set) [PowerShell](/powershell/module/azurerm.profile/set-azurermcontext) |
| ResourceNotFound | Your deployment references a resource that cannot be resolved. Verify that your use of the **reference** function includes the parameters required for your scenario. | [Resolve references](resource-manager-not-found-errors.md) |
| ResourceQuotaExceeded | The deployment is attempting to create resources that exceed the quota for the subscription, resource group, or region. If possible, revise your infrastructure to stay within the quotas. Otherwise, consider requesting a change to your quotas. | [Resolve quotas](resource-manager-quota-errors.md) |
| SkuNotAvailable | Select SKU (such as VM size) that is available for the location you have selected. | [Resolve SKU](resource-manager-sku-not-available-errors.md) |
| StorageAccountAlreadyExists | Provide a unique name for the storage account. | [Resolve storage account name](resource-manager-storage-account-name-errors.md)  |
| StorageAccountAlreadyTaken | Provide a unique name for the storage account. | [Resolve storage account name](resource-manager-storage-account-name-errors.md) |
| StorageAccountNotFound | Check the subscription, resource group, and name of the storage account you are attempting to use. | |
| SubnetsNotInSameVnet | A virtual machine can only have one virtual network. When deploying multiple NICs, make sure they belong to the same virtual network. | [Multiple NICs](../virtual-machines/windows/multiple-nics.md) |
| TemplateResourceCircularDependency | Remove unnecessary dependencies. | [Resolve circular dependencies](resource-manager-invalid-template-errors.md#circular-dependency) |
| TooManyTargetResourceGroups | Reduce number of resource groups for a single deployment. | [Cross resource group deployment](resource-manager-cross-resource-group-deployment.md) |

## Find error code

There are two types of errors you can receive:

* validation errors
* deployment errors

Validation errors arise from scenarios that can be determined before deployment. They include syntax errors in your template, or trying to deploy resources that would exceed your subscription quotas. Deployment errors arise from conditions that occur during the deployment process. They include trying to access a resource that is being deployed in parallel.

Both types of errors return an error code that you use to troubleshoot the deployment. Both types of errors appear in the [activity log](resource-group-audit.md). However, validation errors do not appear in your deployment history because the deployment never started.

### Validation errors

When deploying through the portal, you see a validation error after submitting your values.

![show portal validation error](./media/resource-manager-common-deployment-errors/validation-error.png)

Select the message for more details. In the following image, you see an **InvalidTemplateDeployment** error and a message that indicates a policy blocked deployment.

![show validation details](./media/resource-manager-common-deployment-errors/validation-details.png)

### Deployment errors

When the operation passes validation, but fails during deployment, you get a deployment error.

To see deployment error codes and messages with PowerShell, use:

```azurepowershell-interactive
(Get-AzureRmResourceGroupDeploymentOperation -DeploymentName exampledeployment -ResourceGroupName examplegroup).Properties.statusMessage
```

To see deployment error codes and messages with Azure CLI, use:

```azurecli-interactive
az group deployment operation list --name exampledeployment -g examplegroup --query "[*].properties.statusMessage"
```

In the portal, select the notification.

![notification error](./media/resource-manager-common-deployment-errors/notification.png)

You see more details about the deployment. Select the option to find more information about the error.

![deployment failed](./media/resource-manager-common-deployment-errors/deployment-failed.png)

You see the error message and error codes. Notice there are two error codes. The first error code (**DeploymentFailed**) is a general error that doesn't provide the details you need to solve the error. The second error code (**StorageAccountNotFound**) provides the details you need. 

![error details](./media/resource-manager-common-deployment-errors/error-details.png)

## Enable debug logging

Sometimes you need more information about the request and response to learn what went wrong. During deployment, you can request that additional information is logged during a deployment. 

### PowerShell

In PowerShell, set the **DeploymentDebugLogLevel** parameter to All, ResponseContent, or RequestContent.

```powershell
New-AzureRmResourceGroupDeployment `
  -Name exampledeployment `
  -ResourceGroupName examplegroup `
  -TemplateFile c:\Azure\Templates\storage.json `
  -DeploymentDebugLogLevel All
```

Examine the request content with the following cmdlet:

```powershell
(Get-AzureRmResourceGroupDeploymentOperation `
-DeploymentName exampledeployment `
-ResourceGroupName examplegroup).Properties.request `
| ConvertTo-Json
```

Or, the response content with:

```powershell
(Get-AzureRmResourceGroupDeploymentOperation `
-DeploymentName exampledeployment `
-ResourceGroupName examplegroup).Properties.response `
| ConvertTo-Json
```

This information can help you determine whether a value in the template is being incorrectly set.

### Azure CLI

Currently, Azure CLI doesn't support turning on debug logging, but you can retrieve debug logging.

Examine the deployment operations with the following command:

```azurecli
az group deployment operation list \
  --resource-group examplegroup \
  --name exampledeployment
```

Examine the request content with the following command:

```azurecli
az group deployment operation list \
  --name exampledeployment \
  -g examplegroup \
  --query [].properties.request
```

Examine the response content with the following command:

```azurecli
az group deployment operation list \
  --name exampledeployment \
  -g examplegroup \
  --query [].properties.response
```

### Nested template

To log debug information for a nested template, use the **debugSetting** element.

```json
{
    "apiVersion": "2016-09-01",
    "name": "nestedTemplate",
    "type": "Microsoft.Resources/deployments",
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

## Create a troubleshooting template

In some cases, the easiest way to troubleshoot your template is to test parts of it. You can create a simplified template that enables you to focus on the part that you believe is causing the error. For example, suppose you are receiving an error when referencing a resource. Rather than dealing with an entire template, create a template that returns the part that may be causing your problem. It can help you determine whether you are passing in the right parameters, using template functions correctly, and getting the resource you expect.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
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
        "value": "[reference(resourceId(parameters('storageResourceGroup'), 'Microsoft.Storage/storageAccounts', parameters('storageName')), '2016-05-01')]",
        "type" : "object"
    }
  }
}
```

Or, suppose you are encountering deployment errors that you believe are related to incorrectly set dependencies. Test your template by breaking it into simplified templates. First, create a template that deploys only a single resource (like a SQL Server). When you are sure you have that resource correctly defined, add a resource that depends on it (like a SQL Database). When you have those two resources correctly defined, add other dependent resources (like auditing policies). In between each test deployment, delete the resource group to make sure you adequately testing the dependencies.


## Next steps
* To learn about auditing actions, see [Audit operations with Resource Manager](resource-group-audit.md).
* To learn about actions to determine the errors during deployment, see [View deployment operations](resource-manager-deployment-operations.md).
