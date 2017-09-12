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
ms.date: 09/11/2017
ms.author: tomfitz

---
# Troubleshoot common Azure deployment errors with Azure Resource Manager

This topic describes some common Azure deployment errors you may encounter, and provides information to resolve the errors.

## Error codes

| Error code | Mitigation | More information |
| ---------- | ---------- | ---------------- |
| AccountNameInvalid | Follow naming restrictions for the resource, particularly storage accounts. | [Troubleshoot](#accountnameinvalid) |
| AccountPropertyCannotBeSet | Check available storage account properties. | [storageAccounts](/azure/templates/microsoft.storage/storageaccounts) |
| AnotherOperationInProgress | Wait for concurrent operation to complete. | |
| AuthorizationFailed | Your account or service principal does not have sufficient access to complete the deployment. Check the role your account belongs to, and its access for the deployment scope. | [Azure Role-Based Access Control](../active-directory/role-based-access-control-configure.md) |
| BadRequest | You sent deployment values that do not match what is expected by Resource Manager. Check the inner status message for help with troubleshooting. | [Template reference](/azure/templates/) and [Supported locations](resource-manager-template-location.md) |
| CannotSetProperty |  | |
| Conflict | You are requesting an operation that is not permitted in the resource's current state. For example, disk resizing is allowed only when creating a VM or when the VM is deallocated. | |
| DeploymentActive | Wait for concurrent deployment to this resource group to complete. | |
| DnsRecordInUse | The DNS record name must be unique. Either provide a different name, or modify the existing record. | |
| GatewayTimeout |  | |
| ImageNotFound |  | |
| InternalServerError |  | |
| InUseSubnetCannotBeDeleted | You may encounter this error when attempting to update a resource, but the request is processed by deleting and creating the resource. Make sure to specify all unchanged values. | [Update resource](/azure/architecture/building-blocks/extending-templates/update-resource) |
| InvalidAuthenticationTokenTenant | Get access token for the appropriate tenant. You can only get the token from the tenant that your account belongs to. | |
| InvalidContentLink | You have most likely attempted to link to a nested template that is not available. Double check the URI you provided for the nested template. If the template exists in a storage account, make sure the URI is accessible. You may need to pass a SAS token. | [Linked templates](resource-group-linked-templates.md) |
| InvalidParameter |  | |
| InvalidRequestContent | Your deployment values either include values that are not expected or are missing required values. Confirm the values for your resource type. | [Template reference](/azure/templates/) |
| InvalidRequestFormat |  | |
| InvalidResourceNamespace | Check the resource namespace you specified in the **type** property. | [Template reference](/azure/templates/) |
| InvalidResourceReference |  | |
| InvalidResourceType | Check the resource type you specified in the **type** property. | [Template reference](/azure/templates/) |
| InvalidTemplate | Check your template syntax for errors. | [Troubleshoot](#invalidtemplate) |
| LinkedAuthorizationFailed | Check if your account belongs to the same tenant as the resource group you are deploying to. | |
| LinkedInvalidPropertyId |  | |
| LocationRequired | Provide a location for your resource. | [Set location](resource-manager-template-location.md) |
| MethodNotAllowed |  | |
| MissingRegistrationForLocation |  | |
| MissingSubscriptionRegistration | Register your subscription with the resource provider. | [Troubleshoot](#noregisteredproviderfound) |
| NoRegisteredProviderFound |  | [Troubleshoot](#noregisteredproviderfound) |
| NotFound | You may be attempting to deploy a dependent resource in parallel with a parent resource. Check if you need to add a dependency. | [Troubleshoot](#notfound) |
| OperationNotAllowed |  | |
| ParentResourceNotFound | Make sure a parent resource exists before creating the child resources. | [Troubleshoot](#parentresourcenotfound) |
| PrivateIPAddressInReservedRange | The specified IP address includes an address range required by Azure. Change IP address to avoid reserved range. | [IP addresses](../virtual-network/virtual-network-ip-addresses-overview-arm.md) |
| PrivateIPAddressNotInSubnet | The specified IP address is outside of the subnet range. Change IP address to fall within subnet range. | [IP addresses](../virtual-network/virtual-network-ip-addresses-overview-arm.md) |
| PropertyChangeNotAllowed |  | |
| RequestDisallowedByPolicy | Your subscription includes a resource policy that prevents an action you are trying to perform during deployment. Find the policy that blocks the action. If possible, modify your deployment to meet the limitations from the policy. | [Troubleshoot](resource-manager-policy-requestdisallowedbypolicy-error.md) |
| ResourceDeploymentFailure |  | |
| ResourceGroupBeingDeleted | Wait for deletion to complete. | |
| ResourceGroupNotFound | Check the name of the target resource group for the deployment. It must already exist in your subscription. Check your subscription context. | [Azure CLI](cli/azure/account?#az_account_set) [PowerShell](/powershell/module/azurerm.profile/set-azurermcontext) |
| ResourceNotFound |  | |
| ResourceQuotaExceeded |  | |
| RoleAssignmentExists |  | |
| SkuNotAvailable | Select SKU (such as VM size) that is available for the location you have selected. | |
| StorageAccountAlreadyExists | Provide a unique name for the storage account. | [Troubleshoot](#storagenamenotunique)  |
| StorageAccountAlreadyTaken | Provide a unique name for the storage account. | [Troubleshoot](#storagenamenotunique) |
| StorageAccountNotFound | Check the subscription, resource group, and name of the storage account you are attempting to use. | |
| SubnetIsFull |  | |
| SubnetsNotInSameVnet | A virtual machine can only have one virtual network. When deploying multiple NICs, make sure they belong to the same virtual network. | [Multiple NICs](../virtual-machines/windows/multiple-nics.md) |

The following error codes are described in this topic:

* [DeploymentFailed](#deploymentfailed)
* [NoRegisteredProviderFound](#noregisteredproviderfound)
* [OperationNotAllowed](#quotaexceeded)
* [QuotaExceeded](#quotaexceeded)
* [ResourceNotFound](#notfound)
* [SkuNotAvailable](#skunotavailable)

## DeploymentFailed

This error code indicates a general deployment error, but it is not the error code you need to start troubleshooting. The error code that actually helps you resolve the issue is usually one level below this error. For example, the following image shows the **RequestDisallowedByPolicy** error code that is under the deployment error.

![show error code](./media/resource-manager-common-deployment-errors/error-code.png)

## SkuNotAvailable

When deploying a resource (typically a virtual machine), you may receive the following error code and error message:

```
Code: SkuNotAvailable
Message: The requested tier for resource '<resource>' is currently not available in location '<location>' 
for subscription '<subscriptionID>'. Please try another tier or deploy to a different location.
```

You receive this error when the resource SKU you have selected (such as VM size) is not available for the location you have selected. To resolve this issue, you need to determine which SKUs are available in a region. You can use PowerShell, the portal, or a REST operation to find available SKUs.

- For PowerShell, use [Get-AzureRmComputeResourceSku](/powershell/module/azurerm.compute/get-azurermcomputeresourcesku) and filter by location. You must have the latest version of PowerShell for this command.

  ```powershell
  Get-AzureRmComputeResourceSku | where {$_.Locations.Contains("southcentralus")}
  ```

  The results include a list of SKUs for the location and any restrictions for that SKU.

  ```powershell
  ResourceType                Name      Locations Restriction                      Capability Value
  ------------                ----      --------- -----------                      ---------- -----
  availabilitySets         Classic southcentralus             MaximumPlatformFaultDomainCount     3
  availabilitySets         Aligned southcentralus             MaximumPlatformFaultDomainCount     3
  virtualMachines      Standard_A0 southcentralus
  virtualMachines      Standard_A1 southcentralus
  virtualMachines      Standard_A2 southcentralus
  ```

- To use the [portal](https://portal.azure.com), log in to the portal and add a resource through the interface. As you set the values, you see the available SKUs for that resource. You do not need to complete the deployment.

    ![available SKUs](./media/resource-manager-common-deployment-errors/view-sku.png)

- To use the REST API for virtual machines, send the following request:

  ```HTTP 
  GET
  https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Compute/skus?api-version=2016-03-30
  ```

  It returns available SKUs and regions in the following format:

  ```json
  {
    "value": [
      {
        "resourceType": "virtualMachines",
        "name": "Standard_A0",
        "tier": "Standard",
        "size": "A0",
        "locations": [
          "eastus"
        ],
        "restrictions": []
      },
      {
        "resourceType": "virtualMachines",
        "name": "Standard_A1",
        "tier": "Standard",
        "size": "A1",
        "locations": [
          "eastus"
        ],
        "restrictions": []
      },
      ...
    ]
  }    
  ```

If you are unable to find a suitable SKU in that region or an alternative region that meets your business needs, submit a [SKU request](https://aka.ms/skurestriction) to Azure Support.

## InvalidTemplate
This error can result from several different types of errors.

- Syntax error

   If you receive an error message that indicates the template failed validation, you may have a syntax problem in your template.

  ```
  Code=InvalidTemplate
  Message=Deployment template validation failed
  ```

   This error is easy to make because template expressions can be intricate. For example, the following name assignment for a storage account contains one set of brackets, three functions, three sets of parentheses, one set of single quotes, and one property:

  ```json
  "name": "[concat('storage', uniqueString(resourceGroup().id))]",
  ```

   If you do not provide the matching syntax, the template produces a value that is different than your intention.

   When you receive this type of error, carefully review the expression syntax. Consider using a JSON editor like [Visual Studio](vs-azure-tools-resource-groups-deployment-projects-create-deploy.md) or [Visual Studio Code](resource-manager-vs-code.md), which can warn you about syntax errors.

- Incorrect segment lengths

   Another invalid template error occurs when the resource name is not in the correct format.

  ```
  Code=InvalidTemplate
  Message=Deployment template validation failed: 'The template resource {resource-name}'
  for type {resource-type} has incorrect segment lengths.
  ```

   A root level resource must have one less segment in the name than in the resource type. Each segment is differentiated by a slash. In the following example, the type has two segments and the name has one segment, so it is a **valid name**.

  ```json
  {
    "type": "Microsoft.Web/serverfarms",
    "name": "myHostingPlanName",
    ...
  }
  ```

   But the next example is **not a valid name** because it has the same number of segments as the type.

  ```json
  {
    "type": "Microsoft.Web/serverfarms",
    "name": "appPlan/myHostingPlanName",
    ...
  }
  ```

   For child resources, the type and name have the same number of segments. This number of segments makes sense because the full name and type for the child includes the parent name and type. Therefore, the full name still has one less segment than the full type.

  ```json
  "resources": [
      {
          "type": "Microsoft.KeyVault/vaults",
          "name": "contosokeyvault",
          ...
          "resources": [
              {
                  "type": "secrets",
                  "name": "appPassword",
                  ...
              }
          ]
      }
  ]
  ```

   Getting the segments right can be tricky with Resource Manager types that are applied across resource providers. For example, applying a resource lock to a web site requires a type with four segments. Therefore, the name is three segments:

  ```json
  {
      "type": "Microsoft.Web/sites/providers/locks",
      "name": "[concat(variables('siteName'),'/Microsoft.Authorization/MySiteLock')]",
      ...
  }
  ```

- Copy index is not expected

   You encounter this **InvalidTemplate** error when you have applied the **copy** element to a part of the template that does not support this element. You can only apply the copy element to a resource type. You cannot apply copy to a property within a resource type. For example, you apply copy to a virtual machine, but you cannot apply it to the OS disks for a virtual machine. In some cases, you can convert a child resource to a parent resource to create a copy loop. For more information about using copy, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md).

- Parameter is not valid

   If the template specifies permitted values for a parameter, and you provide a value that is not one of those values, you receive a message similar to the following error:

  ```
  Code=InvalidTemplate;
  Message=Deployment template validation failed: 'The provided value {parameter value}
  for the template parameter {parameter name} is not valid. The parameter value is not
  part of the allowed values
  ``` 

   Double check the allowed values in the template, and provide one during deployment.

- Circular dependency detected

   You receive this error when resources depend on each other in a way that prevents the deployment from starting. A combination of interdependencies makes two or more resource wait for other resources that are also waiting. For example, resource1 depends on resource3, resource2 depends on resource1, and resource3 depends on resource2. You can usually solve this problem by removing unnecessary dependencies. 

<a id="notfound" />
### NotFound and ResourceNotFound
When your template includes the name of a resource that cannot be resolved, you receive an error similar to:

```
Code=NotFound;
Message=Cannot find ServerFarm with name exampleplan.
```

If you are attempting to deploy the missing resource in the template, check whether you need to add a dependency. Resource Manager optimizes deployment by creating resources in parallel, when possible. If one resource must be deployed after another resource, you need to use the **dependsOn** element in your template to create a dependency on the other resource. For example, when deploying a web app, the App Service plan must exist. If you have not specified that the web app depends on the App Service plan, Resource Manager creates both resources at the same time. You receive an error stating that the App Service plan resource cannot be found, because it does not exist yet when attempting to set a property on the web app. You prevent this error by setting the dependency in the web app.

```json
{
  "apiVersion": "2015-08-01",
  "type": "Microsoft.Web/sites",
  "dependsOn": [
    "[variables('hostingPlanName')]"
  ],
  ...
}
```

For suggestions on troubleshooting dependency errors, see [Check deployment sequence](#check-deployment-sequence).

You also see this error when the resource exists in a different resource group than the one being deployed to. In that case, use the [resourceId function](resource-group-template-functions-resource.md#resourceid) to get the fully qualified name of the resource.

```json
"properties": {
    "name": "[parameters('siteName')]",
    "serverFarmId": "[resourceId('plangroup', 'Microsoft.Web/serverfarms', parameters('hostingPlanName'))]"
}
```

If you attempt to use the [reference](resource-group-template-functions-resource.md#reference) or [listKeys](resource-group-template-functions-resource.md#listkeys) functions with a resource that cannot be resolved, you receive the following error:

```
Code=ResourceNotFound;
Message=The Resource 'Microsoft.Storage/storageAccounts/{storage name}' under resource
group {resource group name} was not found.
```

Look for an expression that includes the **reference** function. Double check that the parameter values are correct.

## ParentResourceNotFound

When one resource is a parent to another resource, the parent resource must exist before creating the child resource. If it does not yet exist, you receive the following error:

```
Code=ParentResourceNotFound;
Message=Can not perform requested operation on nested resource. Parent resource 'exampleserver' not found."
```

The name of the child resource includes the parent name. For example, a SQL Database might be defined as:

```json
{
  "type": "Microsoft.Sql/servers/databases",
  "name": "[concat(variables('databaseServerName'), '/', parameters('databaseName'))]",
  ...
```

But, if you do not specify a dependency on the parent resource, the child resource may get deployed before the parent. To resolve this error, include a dependency.

```json
"dependsOn": [
    "[variables('databaseServerName')]"
]
```

<a id="storagenamenotunique" />

## StorageAccountAlreadyExists and StorageAccountAlreadyTaken
For storage accounts, you must provide a name for the resource that is unique across Azure. If you do not provide a unique name, you receive an error like:

```
Code=StorageAccountAlreadyTaken
Message=The storage account named mystorage is already taken.
```

You can create a unique name by concatenating your naming convention with the result of the [uniqueString](resource-group-template-functions-string.md#uniquestring) function.

```json
"name": "[concat('storage', uniqueString(resourceGroup().id))]",
"type": "Microsoft.Storage/storageAccounts",
```

If you deploy a storage account with the same name as an existing storage account in your subscription, but provide a different location, you receive an error indicating the storage account already exists in a different location. Either delete the existing storage account, or provide the same location as the existing storage account.

## AccountNameInvalid
You see the **AccountNameInvalid** error when attempting to give a storage account a name that includes prohibited characters. Storage account names must be between 3 and 24 characters in length and use numbers and lower-case letters only. The [uniqueString](resource-group-template-functions-string.md#uniquestring) function returns 13 characters. If you concatenate a prefix to the **uniqueString** result, provide a prefix that is 11 characters or less.

<a id="noregisteredproviderfound" />

## NoRegisteredProviderFound and MissingSubscriptionRegistration
When deploying resource, you may receive the following error code and message:

```
Code: NoRegisteredProviderFound
Message: No registered resource provider found for location {location}
and API version {api-version} for type {resource-type}.
```

Or, you may receive a similar message that states:

```
Code: MissingSubscriptionRegistration
Message: The subscription is not registered to use namespace {resource-provider-namespace}
```

You receive these errors for one of three reasons:

1. The resource provider has not been registered for your subscription
2. API version not supported for the resource type
3. Location not supported for the resource type

The error message should give you suggestions for the supported locations and API versions. You can change your template to one of the suggested values. Most providers are registered automatically by the Azure portal or the command-line interface you are using, but not all. If you have not used a particular resource provider before, you may need to register that provider. You can discover more about resource providers through PowerShell or Azure CLI.

**Portal**

You can see the registration status and register a resource provider namespace through the portal.

1. For your subscription, select **Resource providers**.

   ![select resource providers](./media/resource-manager-common-deployment-errors/select-resource-provider.png)

2. Look at the list of resource providers, and if necessary, select the **Register** link to register the resource provider of the type you are trying to deploy.

   ![list resource providers](./media/resource-manager-common-deployment-errors/list-resource-providers.png)

**PowerShell**

To see your registration status, use **Get-AzureRmResourceProvider**.

```powershell
Get-AzureRmResourceProvider -ListAvailable
```

To register a provider, use **Register-AzureRmResourceProvider** and provide the name of the resource provider you wish to register.

```powershell
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Cdn
```

To get the supported locations for a particular type of resource, use:

```powershell
((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).Locations
```

To get the supported API versions for a particular type of resource, use:

```powershell
((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).ApiVersions
```

**Azure CLI**

To see whether the provider is registered, use the `azure provider list` command.

```azurecli
az provider list
```

To register a resource provider, use the `azure provider register` command, and specify the *namespace* to register.

```azurecli
az provider register --namespace Microsoft.Cdn
```

To see the supported locations and API versions for a resource type, use:

```azurecli
az provider show -n Microsoft.Web --query "resourceTypes[?resourceType=='sites'].locations"
```

<a id="quotaexceeded" />

## QuotaExceeded and OperationNotAllowed
You might have issues when deployment exceeds a quota, which could be per resource group, subscriptions, accounts, and other scopes. For example, your subscription may be configured to limit the number of cores for a region. If you attempt to deploy a virtual machine with more cores than the permitted amount, you receive an error stating the quota has been exceeded.
For complete quota information, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).

To examine your subscription's quotas for cores, you can use the `azure vm list-usage` command in the Azure CLI. The following example illustrates that the core quota for a free trial account is 4:

```azurecli
az vm list-usage --location "South Central US"
```

Which returns:

```azurecli
[
  {
    "currentValue": 0,
    "limit": 2000,
    "name": {
      "localizedValue": "Availability Sets",
      "value": "availabilitySets"
    }
  },
  ...
]
```

If you deploy a template that creates more than four cores in the West US region, you get a deployment error that looks like:

```
Code=OperationNotAllowed
Message=Operation results in exceeding quota limits of Core.
Maximum allowed: 4, Current in use: 4, Additional requested: 2.
```

Or in PowerShell, you can use the **Get-AzureRmVMUsage** cmdlet.

```powershell
Get-AzureRmVMUsage
```

Which returns:

```powershell
...
CurrentValue : 0
Limit        : 4
Name         : {
                 "value": "cores",
                 "localizedValue": "Total Regional Cores"
               }
Unit         : null
...
```

In these cases, you should go to the portal and file a support issue to raise your quota for the region into which you want to deploy.

> [!NOTE]
> Remember that for resource groups, the quota is for each individual region, not for the entire subscription. If you need to deploy 30 cores in West US, you have to ask for 30 Resource Manager cores in West US. If you need to deploy 30 cores in any of the regions to which you have access, you should ask for 30 Resource Manager cores in all regions.
>
>

## Next steps
* To learn about auditing actions, see [Audit operations with Resource Manager](resource-group-audit.md).
* To learn about actions to determine the errors during deployment, see [View deployment operations](resource-manager-deployment-operations.md).
