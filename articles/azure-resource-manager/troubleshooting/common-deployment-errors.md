---
title: Troubleshoot common Azure deployment errors
description: Troubleshoot common Azure deployment errors for resources that are deployed with Bicep files or Azure Resource Manager templates (ARM templates).
tags: top-support-issue
ms.custom: devx-track-arm-template, devx-track-bicep
ms.topic: troubleshooting
ms.date: 04/05/2023
---

# Troubleshoot common Azure deployment errors

This article describes how to troubleshoot common Azure deployment errors, and provides information about solutions. Azure resources can be deployed with Bicep files or Azure Resource Manager templates (ARM templates). If you can't find the error code for your deployment error, see [Find error code](find-error-code.md).

If your error code isn't listed, submit a GitHub issue. On the right side of the page, select **Feedback**. At the bottom of the page, under **Feedback** select **This page**. Provide your documentation feedback but **don't include confidential information** because GitHub issues are public.

## Error codes

| Error code | Mitigation | More information |
| ---------- | ---------- | ---------------- |
| AccountNameInvalid | Follow naming guidelines for storage accounts. | [Resolve errors for storage account names](error-storage-account-name.md) |
| AccountPropertyCannotBeSet | Check available storage account properties. | [storageAccounts](/azure/templates/microsoft.storage/storageaccounts) |
| AllocationFailed | The cluster or region doesn't have resources available or can't support the requested VM size. Retry the request at a later time, or request a different VM size. | [Provisioning and allocation issues for Linux](/troubleshoot/azure/virtual-machines/troubleshoot-deployment-new-vm-linux) <br><br> [Provisioning and allocation issues for Windows](/troubleshoot/azure/virtual-machines/troubleshoot-deployment-new-vm-windows) <br><br> [Troubleshoot allocation failures](/troubleshoot/azure/virtual-machines/allocation-failure)|
| AnotherOperationInProgress | Wait for concurrent operation to complete. | |
| AuthorizationFailed | Your account or service principal doesn't have sufficient access to complete the deployment. Check the role your account belongs to, and its access for the deployment scope.<br><br>You might receive this error when a required resource provider isn't registered. | [Azure role-based access control (Azure RBAC)](../../role-based-access-control/role-assignments-portal.md)<br><br>[Resolve registration](error-register-resource-provider.md) |
| BadRequest | You sent deployment values that don't match what is expected by Resource Manager. Check the inner status message for help with troubleshooting. <br><br> Validate the template's syntax to resolve deployment errors when using a template that was exported from an existing Azure resource. | [Template reference](/azure/templates/) <br><br> [Resource location in ARM template](../templates/resource-location.md) <br><br> [Resource location in Bicep file](../bicep/resource-declaration.md#location) <br><br> [Resolve invalid template](error-invalid-template.md)|
| Conflict | You're requesting an operation that isn't allowed in the resource's current state. For example, disk resizing is allowed only when creating a VM or when the VM is deallocated. | |
| DeploymentActiveAndUneditable | Wait for concurrent deployment to this resource group to complete. | |
| DeploymentFailedCleanUp | When you deploy in complete mode, any resources that aren't in the template are deleted. You get this error when you don't have adequate permissions to delete all of the resources not in the template. To avoid the error, change the deployment mode to incremental. | [Azure Resource Manager deployment modes](../templates/deployment-modes.md) |
| DeploymentNameInvalidCharacters | The deployment name can only contain letters, digits, hyphen `(-)`, dot `(.)` or underscore `(_)`. | |
| DeploymentNameLengthLimitExceeded | The deployment names are limited to 64 characters.  | |
| DeploymentFailed | The DeploymentFailed error is a general error that doesn't provide the details you need to solve the error. Look in the error details for an error code that provides more information. | [Find error code](find-error-code.md) |
| DeploymentQuotaExceeded | If you reach the limit of 800 deployments per resource group, delete deployments from the history that are no longer needed. | [Resolve error when deployment count exceeds 800](deployment-quota-exceeded.md) |
| DeploymentJobSizeExceeded | Simplify your template to reduce size. | [Resolve template size errors](error-job-size-exceeded.md) |
| DnsRecordInUse | The DNS record name must be unique. Enter a different name. | |
| ImageNotFound | Check VM image settings. |  |
| InaccessibleImage | Azure Container Instance deployment fails. You might need to include the image's tag with the syntax `registry/image:tag` to deploy the container. For a private registry, verify your credentials are correct. | [Find error code](find-error-code.md) |
| InternalServerError | Caused by a temporary problem. Retry the deployment. | |
| InUseSubnetCannotBeDeleted | This error can occur when you try to update a resource, if the request process deletes and creates the resource. Make sure to specify all unchanged values. | [Update resource](/azure/architecture/guide/azure-resource-manager/advanced-templates/update-resource) |
| InvalidAuthenticationTokenTenant | Get access token for the appropriate tenant. You can only get the token from the tenant that your account belongs to. | |
| InvalidContentLink | You've most likely attempted to link to a nested template that isn't available. Double check the URI you provided for the nested template. If the template exists in a storage account, make sure the URI is accessible. You might need to pass a SAS token. Currently, you can't link to a template that is in a storage account behind an [Azure Storage firewall](../../storage/common/storage-network-security.md). Consider moving your template to another repository, like GitHub. | [Linked and nested ARM templates](../templates/linked-templates.md) <br><br> [Bicep modules](../bicep/modules.md) |
| InvalidDeploymentLocation | When deploying at the subscription level, you've provided a different location for a previously used deployment name. | [ARM template subscription deployment](../templates/deploy-to-subscription.md) <br><br> [Bicep subscription deployment](../bicep/deploy-to-subscription.md) |
| InvalidParameter | One of the values you provided for a resource doesn't match the expected value. This error can result from many different conditions. For example, a password may be insufficient, or a blob name may be incorrect. The error message should indicate which value needs to be corrected. | [ARM template parameters](../templates/parameters.md) <br><br> [Bicep parameters](../bicep/parameters.md) |
| InvalidRequestContent | The deployment values either include values that aren't recognized, or required values are missing. Confirm the values for your resource type. | [Template reference](/azure/templates/) |
| InvalidRequestFormat | Enable debug logging when running the deployment, and verify the contents of the request. | [Debug logging](enable-debug-logging.md) |
| InvalidResourceLocation | Provide a unique name for the storage account. | [Resolve errors for storage account names](error-storage-account-name.md) |
| InvalidResourceNamespace | Check the resource namespace you specified in the **type** property. | [Template reference](/azure/templates/) |
| InvalidResourceReference | The resource either doesn't yet exist or is incorrectly referenced. Check whether you need to add a dependency. Verify that your use of the **reference** function includes the required parameters for your scenario. | [Resolve dependencies](error-not-found.md) |
| InvalidResourceType | Check the resource type you specified in the **type** property. | [Template reference](/azure/templates/) |
| InvalidSubscriptionRegistrationState | Register your subscription with the resource provider. | [Resolve registration](error-register-resource-provider.md) |
| InvalidTemplateDeployment <br> InvalidTemplate | Check your template syntax for errors. | [Resolve invalid template](error-invalid-template.md) |
| InvalidTemplateCircularDependency | Remove unnecessary dependencies. | [Resolve circular dependencies](error-invalid-template.md#circular-dependency) |
| JobSizeExceeded | Simplify your template to reduce size. | [Resolve template size errors](error-job-size-exceeded.md) |
| LinkedAuthorizationFailed | Check if your account belongs to the same tenant as the resource group that you're deploying to. | |
| LinkedInvalidPropertyId | The resource ID for a resource isn't resolved. Check that you provided all required values for the resource ID. For example, subscription ID, resource group name, resource type, parent resource name (if needed), and resource name. | [Resolve errors for resource name and type](../troubleshooting/error-invalid-name-segments.md) |
| LocationRequired | Provide a location for the resource. | [Resource location in ARM template](../templates/resource-location.md) <br><br> [Resource location in Bicep file](../bicep/resource-declaration.md#location) |
| MismatchingResourceSegments | Make sure a nested resource has the correct number of segments in name and type. | [Resolve resource segments](error-invalid-template.md#incorrect-segment-lengths) |
| MissingRegistrationForLocation | Check resource provider registration status and supported locations. | [Resolve registration](error-register-resource-provider.md) |
| MissingSubscriptionRegistration | Register your subscription with the resource provider. | [Resolve registration](error-register-resource-provider.md) |
| NoRegisteredProviderFound | Check resource provider registration status. | [Resolve registration](error-register-resource-provider.md) |
| NotFound | You might be attempting to deploy a dependent resource in parallel with a parent resource. Check if you need to add a dependency. | [Resolve dependencies](error-not-found.md) |
| OperationNotAllowed | There can be several reasons for this error message.<br><br>1. The deployment is attempting an operation which is not allowed on spcecified SKU.<br><br>2. The deployment is attempting an operation that exceeds the quota for the subscription, resource group, or region. If possible, revise your deployment to stay within the quotas. Otherwise, consider requesting a change to your quotas. | [Resolve quotas](error-resource-quota.md) |
| OperationNotAllowedOnVMImageAsVMsBeingProvisioned | You might be attempting to delete an image that is currently being used to provision VMs. You cannot delete an image that is being used by any virtual machine during the deployment process. Retry the image delete operation after the deployment of the VM is complete. |  |
| ParentResourceNotFound | Make sure a parent resource exists before creating the child resources. | [Resolve parent resource](error-parent-resource.md) |
| PasswordTooLong | You might have selected a password with too many characters, or converted your password value to a secure string before passing it as a parameter. If the template includes a **secure string** parameter, you don't need to convert the value to a secure string. Provide the password value as text. |  |
| PrivateIPAddressInReservedRange | The specified IP address includes an address range required by Azure. Change IP address to avoid reserved range. | [Private IP addresses](../../virtual-network/ip-services/private-ip-addresses.md)
| PrivateIPAddressNotInSubnet | The specified IP address is outside of the subnet range. Change IP address to fall within subnet range. | [Private IP addresses](../../virtual-network/ip-services/private-ip-addresses.md) |
| PropertyChangeNotAllowed | Some properties can't be changed on a deployed resource. When updating a resource, limit your changes to permitted properties. | [Update resource](/azure/architecture/guide/azure-resource-manager/advanced-templates/update-resource) |
| PublicIPCountLimitReached | You've reached the limit for the number of running public IPs. Shut down unneeded resources or contact Azure support to request an increase. For example, in Azure Databricks, see [Unexpected cluster termination](/azure/databricks/kb/clusters/termination-reasons) and [IP address limit prevents cluster creation](/azure/databricks/kb/clusters/azure-ip-limit). | [Public IP address limits](../management/azure-subscription-service-limits.md#publicip-address) |
| RegionDoesNotAllowProvisioning | Select a different region or submit a quota support request for **Region access**. | |
| RequestDisallowedByPolicy | Your subscription includes a resource policy that prevents an action you're trying to do during deployment. Find the policy that blocks the action. If possible, change your deployment to meet the limitations from the policy. | [Resolve policies](error-policy-requestdisallowedbypolicy.md) |
| ReservedResourceName | Provide a resource name that doesn't include a reserved name. | [Reserved resource names](error-reserved-resource-name.md) |
| ResourceGroupBeingDeleted | Wait for deletion to complete. | |
| ResourceGroupNotFound | Check the name of the target resource group for the deployment. The target resource group must already exist in your subscription. Check your subscription context. | [Azure CLI](/cli/azure/account#az-account-set) [PowerShell](/powershell/module/Az.Accounts/Set-AzContext) |
| ResourceNotFound | Your deployment references a resource that can't be resolved. Verify that your use of the **reference** function includes the parameters required for your scenario. | [Resolve references](error-not-found.md) |
| ResourceQuotaExceeded | The deployment is trying to create resources that exceed the quota for the subscription, resource group, or region. If possible, revise your infrastructure to stay within the quotas. Otherwise, consider requesting a change to your quotas. | [Resolve quotas](error-resource-quota.md) |
| SkuNotAvailable | Select SKU (such as VM size) that is available for the location you've selected. | [Resolve SKU](error-sku-not-available.md) |
| StorageAccountAlreadyTaken <br> StorageAccountAlreadyExists | Provide a unique name for the storage account. | [Resolve errors for storage account names](error-storage-account-name.md)  |
| StorageAccountInAnotherResourceGroup | Provide a unique name for the storage account. | [Resolve errors for storage account names](error-storage-account-name.md)  |
| StorageAccountNotFound | Check the subscription, resource group, and name of the storage account that you're trying to use. | |
| SubnetsNotInSameVnet | A virtual machine can only have one virtual network. When deploying several NICs, make sure they belong to the same virtual network. | [Windows VM multiple NICs](../../virtual-machines/windows/multiple-nics.md) <br><br> [Linux VM multiple NICs](../../virtual-machines/linux/multiple-nics.md) |
| SubnetIsFull | There aren't enough available addresses in the subnet to deploy resources. You can release addresses from the subnet, use a different subnet, or create a new subnet. | [Manage subnets](../../virtual-network/virtual-network-manage-subnet.md) and [Virtual network FAQ](../../virtual-network/virtual-networks-faq.md#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets) <br><br> [Private IP addresses](../../virtual-network/ip-services/private-ip-addresses.md) |
| SubscriptionNotFound | A specified subscription for deployment can't be accessed. It could be the subscription ID is wrong, the user deploying the template doesn't have adequate permissions to deploy to the subscription, or the subscription ID is in the wrong format. When using ARM template nested deployments to deploy across scopes, provide the subscription's GUID. | [ARM template deploy across scopes](../templates/deploy-to-resource-group.md) <br><br> [Bicep file deploy across scopes](../bicep/deploy-to-resource-group.md) |
| SubscriptionNotRegistered | When a resource is deployed, the resource provider must be registered for your subscription. When you use an Azure Resource Manager template for deployment, the resource provider is automatically registered in the subscription. Sometimes, the automatic registration doesn't complete in time. To avoid this intermittent error, register the resource provider before deployment. | [Resolve registration](error-register-resource-provider.md) |
| SubscriptionRequestsThrottled | Azure Resource Manager throttles requests at the subscription level or tenant level. Resource providers like `Microsoft.Compute` also throttle requests specific to its operations. <br><br> When a limit is reached, you get a message and a value with the amount of time you should wait before sending a new request. For example: `Number of requests for subscription '<subscription-id-guid>' and operation '<resource provider>' exceeded the backend storage limit. Please try again after '6' seconds.` <br><br> An HTTP response returns a message like `HTTP status code 429 Too Many Requests` with a `Retry-After` value that specifies the number of seconds to wait before you send another request. | [Throttling Resource Manager requests](../management/request-limits-and-throttling.md) <br><br> [Troubleshooting API throttling errors - virtual machines](/troubleshoot/azure/virtual-machines/troubleshooting-throttling-errors) <br><br> [Azure Kubernetes Service throttling](/troubleshoot/azure/azure-kubernetes/error-code-subscriptionrequeststhrottled) |
| TemplateResourceCircularDependency | Remove unnecessary dependencies. | [Resolve circular dependencies](error-invalid-template.md#circular-dependency) |
| TooManyTargetResourceGroups | Reduce number of resource groups for a single deployment. | [ARM template deploy across scopes](../templates/deploy-to-resource-group.md) <br><br> [Bicep file deploy across scopes](../bicep/deploy-to-resource-group.md) |

## Next steps

- For information about validation or deployment errors, see [Find error codes](find-error-code.md).
- To get more details to troubleshoot a deployment, see [Enable debug logging](enable-debug-logging.md).
- To isolate the cause of a deployment error, see [Create a troubleshooting template](create-troubleshooting-template.md).
