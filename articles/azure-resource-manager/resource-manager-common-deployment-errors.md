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
ms.topic: support-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/14/2017
ms.author: tomfitz

---
# Troubleshoot common Azure deployment errors with Azure Resource Manager

This topic describes some common Azure deployment errors you may encounter, and provides information to resolve the errors. If you cannot find the error code for your deployment error, see [Find error code](#find-error-code).

## Error codes

| Error code | Mitigation | More information |
| ---------- | ---------- | ---------------- |
| AccountNameInvalid | Follow naming restrictions for storage accounts. | [Resolve storage account name](resource-manager-storage-account-name-errors.md) |
| AccountPropertyCannotBeSet | Check available storage account properties. | [storageAccounts](/azure/templates/microsoft.storage/storageaccounts) |
| AnotherOperationInProgress | Wait for concurrent operation to complete. | |
| AuthorizationFailed | Your account or service principal does not have sufficient access to complete the deployment. Check the role your account belongs to, and its access for the deployment scope. | [Azure Role-Based Access Control](../active-directory/role-based-access-control-configure.md) |
| BadRequest | You sent deployment values that do not match what is expected by Resource Manager. Check the inner status message for help with troubleshooting. | [Template reference](/azure/templates/) and [Supported locations](resource-manager-template-location.md) |
| Conflict | You are requesting an operation that is not permitted in the resource's current state. For example, disk resizing is allowed only when creating a VM or when the VM is deallocated. | |
| DeploymentActive | Wait for concurrent deployment to this resource group to complete. | |
| DnsRecordInUse | The DNS record name must be unique. Either provide a different name, or modify the existing record. | |
| ImageNotFound | Check VM image settings. | [Troubleshoot Linux images](../virtual-machines/linux/troubleshoot-deployment-new-vm.md) and [Troubleshoot Windows images](../virtual-machines/windows/troubleshoot-deployment-new-vm.md) |
| InUseSubnetCannotBeDeleted | You may encounter this error when attempting to update a resource, but the request is processed by deleting and creating the resource. Make sure to specify all unchanged values. | [Update resource](/azure/architecture/building-blocks/extending-templates/update-resource) |
| InvalidAuthenticationTokenTenant | Get access token for the appropriate tenant. You can only get the token from the tenant that your account belongs to. | |
| InvalidContentLink | You have most likely attempted to link to a nested template that is not available. Double check the URI you provided for the nested template. If the template exists in a storage account, make sure the URI is accessible. You may need to pass a SAS token. | [Linked templates](resource-group-linked-templates.md) |
| InvalidParameter | One of the values you provided for a resource does not match the expected value. This error can result from many different conditions. For example, a password may be insufficient, or a blob name may be incorrect. Check the error message to determine which value needs to be corrected. | |
| InvalidRequestContent | Your deployment values either include values that are not expected or are missing required values. Confirm the values for your resource type. | [Template reference](/azure/templates/) |
| InvalidRequestFormat | Enable debug logging when executing the deployment, and verify the contents of the request. | [Debug logging](resource-manager-troubleshoot-tips.md#enable-debug-logging) |
| InvalidResourceNamespace | Check the resource namespace you specified in the **type** property. | [Template reference](/azure/templates/) |
| InvalidResourceReference | The resource either does not yet exist or is incorrectly referenced. Check whether you need to add a dependency. Verify that your use of the **reference** function includes the required parameters for your scenario. | [Resolve dependencies](resource-manager-not-found-errors.md) |
| InvalidResourceType | Check the resource type you specified in the **type** property. | [Template reference](/azure/templates/) |
| InvalidTemplate | Check your template syntax for errors. | [Resolve invalid template](resource-manager-invalid-template-errors.md) |
| LinkedAuthorizationFailed | Check if your account belongs to the same tenant as the resource group you are deploying to. | |
| LinkedInvalidPropertyId | The resource ID for a resource is not resolving correctly. Check that you provide all required values for the resource ID, including subscription ID, resource group name, resource type, parent resource name (if needed), and resource name. | |
| LocationRequired | Provide a location for your resource. | [Set location](resource-manager-template-location.md) |
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
| ResourceGroupBeingDeleted | Wait for deletion to complete. | |
| ResourceGroupNotFound | Check the name of the target resource group for the deployment. It must already exist in your subscription. Check your subscription context. | [Azure CLI](/cli/azure/account?#az_account_set) [PowerShell](/powershell/module/azurerm.profile/set-azurermcontext) |
| ResourceNotFound | Your deployment references a resource that cannot be resolved. Verify that your use of the **reference** function includes the parameters required for your scenario. | [Resolve references](resource-manager-not-found-errors.md) |
| ResourceQuotaExceeded | The deployment is attempting to create resources that exceed the quota for the subscription, resource group, or region. If possible, revise your infrastructure to stay within the quotas. Otherwise, consider requesting a change to your quotas. | [Resolve quotas](resource-manager-quota-errors.md) |
| SkuNotAvailable | Select SKU (such as VM size) that is available for the location you have selected. | [Resolve SKU](resource-manager-sku-not-available-errors.md) |
| StorageAccountAlreadyExists | Provide a unique name for the storage account. | [Resolve storage account name](resource-manager-storage-account-name-errors.md)  |
| StorageAccountAlreadyTaken | Provide a unique name for the storage account. | [Resolve storage account name](resource-manager-storage-account-name-errors.md) |
| StorageAccountNotFound | Check the subscription, resource group, and name of the storage account you are attempting to use. | |
| SubnetsNotInSameVnet | A virtual machine can only have one virtual network. When deploying multiple NICs, make sure they belong to the same virtual network. | [Multiple NICs](../virtual-machines/windows/multiple-nics.md) |

## Find error code

When you encounter an error during deployment, Resource Manager returns an error code. You can see the error message through the portal, PowerShell, or Azure CLI. The outer error message may be too general for troubleshooting. Look for the inner message that contains detailed information about the error. For more information, see [Determine error code](resource-manager-troubleshoot-tips.md#determine-error-code).

## Next steps
* To learn about auditing actions, see [Audit operations with Resource Manager](resource-group-audit.md).
* To learn about actions to determine the errors during deployment, see [View deployment operations](resource-manager-deployment-operations.md).
