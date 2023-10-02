---
title: Resource providers and resource types
description: Describes the resource providers that support Azure Resource Manager. It describes their schemas, available API versions, and the regions that can host the resources.
ms.topic: conceptual
ms.date: 07/14/2023 
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-arm-template, devx-track-python
content_well_notification: 
  - AI-contribution
---

# Azure resource providers and types

An Azure resource provider is a set of REST operations that enable functionality for a specific Azure service. For example, the Key Vault service consists of a resource provider named **Microsoft.KeyVault**. The resource provider defines [REST operations](/rest/api/keyvault/) for managing vaults, secrets, keys, and certificates.

The resource provider defines the Azure resources you can deploy to your account. A resource type's name follows the format: **{resource-provider}/{resource-type}**. The resource type for a key vault is **Microsoft.KeyVault/vaults**.

In this article, you learn how to:

* View all resource providers in Azure
* Check registration status of a resource provider
* Register a resource provider
* View resource types for a resource provider
* View valid locations for a resource type
* View valid API versions for a resource type

For a list that maps resource providers to Azure services, see [Resource providers for Azure services](azure-services-resource-providers.md).

## Register resource provider

Before you use a resource provider, you must make sure your Azure subscription is registered for the resource provider. Registration configures your subscription to work with the resource provider. 

> [!IMPORTANT]
> Register a resource provider only when you're ready to use it. This registration step helps maintain least privileges within your subscription. A malicious user can't use unregistered resource providers.
>
> Registering unnecessary resource providers may result in unrecognized apps appearing in your Azure Active Directory tenant. Microsoft adds the app for a resource provider when you register it. These apps are typically added by the Windows Azure Service Management API. To prevent unnecessary apps in your tenant, only register needed resource providers.

Some resource providers are registered by default. For a list of resource providers registered by default, see [Resource providers for Azure services](azure-services-resource-providers.md).

Other resource providers are registered automatically when you take certain actions. When you create a resource through the portal, the resource provider is typically registered for you. When you deploy an Azure Resource Manager template or Bicep file, resource providers defined in the template are registered automatically. Sometimes, a resource in the template requires supporting resources that aren't in the template. Common examples are monitoring or security resources. You need to register those resource providers manually.

For other scenarios, you may need to manually register a resource provider.

> [!IMPORTANT]
> Your application code **shouldn't block the creation of resources** for a resource provider that is in the **registering** state. When you register the resource provider, the operation is done individually for each supported region. To create resources in a region, the registration only needs to be completed in that region. By not blocking a resource provider in the registering state, your application can continue much sooner than waiting for all regions to complete.

You must have permission to do the `/register/action` operation for the resource provider. The permission is included in the Contributor and Owner roles.

You can't unregister a resource provider when you still have resource types from that resource provider in your subscription.

Reregister a resource provider when the resource provider supports new locations that you need to use.

## Azure portal

### Register resource provider

To see all resource providers, and the registration status for your subscription:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the Azure portal menu, search for **Subscriptions**. Select it from the available options.

   :::image type="content" source="./media/resource-providers-and-types/search-subscriptions.png" alt-text="Screenshot of searching for subscriptions in the Azure portal.":::

1. Select the subscription you want to view.

   :::image type="content" source="./media/resource-providers-and-types/select-subscription.png" alt-text="Screenshot of selecting a subscription in the Azure portal.":::

1. On the left menu, under **Settings**, select **Resource providers**.

   :::image type="content" source="./media/resource-providers-and-types/select-resource-providers.png" alt-text="Screenshot of selecting resource providers in the Azure portal.":::

1. Find the resource provider you want to register, and select **Register**. To maintain least privileges in your subscription, only register those resource providers that you're ready to use.

   :::image type="content" source="./media/resource-providers-and-types/register-resource-provider.png" alt-text="Screenshot of registering a resource provider in the Azure portal.":::

   > [!IMPORTANT]
   > As [noted earlier](#register-resource-provider), **don't block the creation of resources** for a resource provider that is in the **registering** state. By not blocking a resource provider in the registering state, your application can continue much sooner than waiting for all regions to complete.

1. **Re-register** a resource provider to use locations that have been added since the previous registration.

   :::image type="content" source="./media/resource-providers-and-types/re-register-resource-provider.png" alt-text="Screenshot of reregistering a resource provider in the Azure portal.":::

### View resource provider

To see information for a particular resource provider:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the Azure portal menu, select **All services**.
1. In the **All services** box, enter **resource explorer**, and then select **Resource Explorer**.

    :::image type="content" source="./media/resource-providers-and-types/select-resource-explorer.png" alt-text="Screenshot of selecting All services in the Azure portal to access Resource Explorer.":::

1. Expand **Providers** by selecting the right arrow.

    :::image type="content" source="./media/resource-providers-and-types/select-providers.png" alt-text="Screenshot of expanding the Providers section in the Azure Resource Explorer.":::

1. Expand a resource provider and resource type that you want to view.

    :::image type="content" source="./media/resource-providers-and-types/select-resource-type.png" alt-text="Screenshot of expanding a resource provider and resource type in the Azure Resource Explorer.":::

1. Resource Manager is supported in all regions, but the resources you deploy might not be supported in all regions. Also, there may be limitations on your subscription that prevent you from using some regions that support the resource. The resource explorer displays valid locations for the resource type.

    :::image type="content" source="./media/resource-providers-and-types/show-locations.png" alt-text="Screenshot of displaying valid locations for a resource type in the Azure Resource Explorer.":::

1. The API version corresponds to a version of the resource provider's REST API operations. As a resource provider enables new features, it releases a new version of the REST API. The resource explorer displays valid API versions for the resource type.

    :::image type="content" source="./media/resource-providers-and-types/show-api-versions.png" alt-text="Screenshot of displaying valid API versions for a resource type in the Azure Resource Explorer.":::

## Azure PowerShell

To see all resource providers in Azure, and the registration status for your subscription, use:

```azurepowershell-interactive
Get-AzResourceProvider -ListAvailable | Select-Object ProviderNamespace, RegistrationState
```

The command returns:

```output
ProviderNamespace                RegistrationState
-------------------------------- ------------------
Microsoft.ClassicCompute         Registered
Microsoft.ClassicNetwork         Registered
Microsoft.ClassicStorage         Registered
Microsoft.CognitiveServices      Registered
...
```

To see all registered resource providers for your subscription, use:

```azurepowershell-interactive
 Get-AzResourceProvider -ListAvailable | Where-Object RegistrationState -eq "Registered" | Select-Object ProviderNamespace, RegistrationState | Sort-Object ProviderNamespace
```

To maintain least privileges in your subscription, only register those resource providers that you're ready to use. To register a resource provider, use:

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.Batch
```

The command returns:

```output
ProviderNamespace : Microsoft.Batch
RegistrationState : Registering
ResourceTypes     : {batchAccounts, operations, locations, locations/quotas}
Locations         : {West Europe, East US, East US 2, West US...}
```

> [!IMPORTANT]
> As [noted earlier](#register-resource-provider), **don't block the creation of resources** for a resource provider that is in the **registering** state. By not blocking a resource provider in the registering state, your application can continue much sooner than waiting for all regions to complete.

Reregister a resource provider to use locations that have been added since the previous registration. To reregister, run the registration command again.

To see information for a particular resource provider, use:

```azurepowershell-interactive
Get-AzResourceProvider -ProviderNamespace Microsoft.Batch
```

The command returns:

```output
{ProviderNamespace : Microsoft.Batch
RegistrationState : Registered
ResourceTypes     : {batchAccounts}
Locations         : {West Europe, East US, East US 2, West US...}

...
```

To see the resource types for a resource provider, use:

```azurepowershell-interactive
(Get-AzResourceProvider -ProviderNamespace Microsoft.Batch).ResourceTypes.ResourceTypeName
```

The command returns:

```output
batchAccounts
operations
locations
locations/quotas
```

The API version corresponds to a version of the resource provider's REST API operations. As a resource provider enables new features, it releases a new version of the REST API.

To get the available API versions for a resource type, use:

```azurepowershell-interactive
((Get-AzResourceProvider -ProviderNamespace Microsoft.Batch).ResourceTypes | Where-Object ResourceTypeName -eq batchAccounts).ApiVersions
```

The command returns:

```output
2023-05-01
2022-10-01
2022-06-01
2022-01-01
2021-06-01
2021-01-01
...
```

Resource Manager is supported in all regions, but the resources you deploy might not be supported in all regions. Also, there may be limitations on your subscription that prevent you from using some regions that support the resource.

To get the supported locations for a resource type, use.

```azurepowershell-interactive
((Get-AzResourceProvider -ProviderNamespace Microsoft.Batch).ResourceTypes | Where-Object ResourceTypeName -eq batchAccounts).Locations
```

The command returns:

```output
West Europe
East US
East US 2
West US
...
```

## Azure CLI

To see all resource providers in Azure, and the registration status for your subscription, use:

```azurecli-interactive
az provider list --query "[].{Provider:namespace, Status:registrationState}" --out table
```

The command returns:

```output
Provider                         Status
-------------------------------- ----------------
Microsoft.ClassicCompute         Registered
Microsoft.ClassicNetwork         Registered
Microsoft.ClassicStorage         Registered
Microsoft.CognitiveServices      Registered
...
```

To see all registered resource providers for your subscription, use:

```azurecli-interactive
az provider list --query "sort_by([?registrationState=='Registered'].{Provider:namespace, Status:registrationState}, &Provider)" --out table
```

To maintain least privileges in your subscription, only register those resource providers that you're ready to use. To register a resource provider, use:

```azurecli-interactive
az provider register --namespace Microsoft.Batch
```

The command returns a message that registration is on-going.

To see information for a particular resource provider, use:

```azurecli-interactive
az provider show --namespace Microsoft.Batch
```

The command returns:

```output
{
    "id": "/subscriptions/####-####/providers/Microsoft.Batch",
    "namespace": "Microsoft.Batch",
    "registrationsState": "Registering",
    "resourceTypes:" [
        ...
    ]
}
```

> [!IMPORTANT]
> As [noted earlier](#register-resource-provider), **don't block the creation of resources** for a resource provider that is in the **registering** state. By not blocking a resource provider in the registering state, your application can continue much sooner than waiting for all regions to complete.

To see the resource types for a resource provider, use:

```azurecli-interactive
az provider show --namespace Microsoft.Batch --query "resourceTypes[*].resourceType" --out table
```

The command returns:

```output
Result
---------------
batchAccounts
operations
locations
locations/quotas
```

The API version corresponds to a version of the resource provider's REST API operations. As a resource provider enables new features, it releases a new version of the REST API.

To get the available API versions for a resource type, use:

```azurecli-interactive
az provider show --namespace Microsoft.Batch --query "resourceTypes[?resourceType=='batchAccounts'].apiVersions | [0]" --out table
```

The command returns:

```output
Result
---------------
2023-05-01
2022-10-01
2022-06-01
2022-01-01
...
```

Resource Manager is supported in all regions, but the resources you deploy might not be supported in all regions. Also, there may be limitations on your subscription that prevent you from using some regions that support the resource.

To get the supported locations for a resource type, use.

```azurecli-interactive
az provider show --namespace Microsoft.Batch --query "resourceTypes[?resourceType=='batchAccounts'].locations | [0]" --out table
```

The command returns:

```output
Result
---------------
West Europe
East US
East US 2
West US
...
```

## Python

To see all resource providers in Azure, and the registration status for your subscription, use:

```python
import os  
from azure.identity import DefaultAzureCredential  
from azure.mgmt.resource import ResourceManagementClient  
  
# Authentication  
credential = DefaultAzureCredential()  
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]  
  
# Initialize Resource Management client  
resource_management_client = ResourceManagementClient(credential, subscription_id)  
  
# List available resource providers and select ProviderNamespace and RegistrationState  
providers = resource_management_client.providers.list()  
  
for provider in providers:  
    print(f"ProviderNamespace: {provider.namespace}, RegistrationState: {provider.registration_state}")  
```

The command returns:

```output
ProviderNamespace: Microsoft.AlertsManagement, RegistrationState: Registered
ProviderNamespace: Microsoft.AnalysisServices, RegistrationState: Registered
ProviderNamespace: Microsoft.ApiManagement, RegistrationState: Registered
ProviderNamespace: Microsoft.Authorization, RegistrationState: Registered
ProviderNamespace: Microsoft.Batch, RegistrationState: Registered
...
```

To see all registered resource providers for your subscription, use:

```python
# List available resource providers with RegistrationState "Registered" and select ProviderNamespace and RegistrationState  
providers = resource_management_client.providers.list()  
registered_providers = [provider for provider in providers if provider.registration_state == "Registered"]  
  
# Sort by ProviderNamespace  
sorted_registered_providers = sorted(registered_providers, key=lambda x: x.namespace)  
  
for provider in sorted_registered_providers:  
    print(f"ProviderNamespace: {provider.namespace}, RegistrationState: {provider.registration_state}")  
```

To maintain least privileges in your subscription, only register those resource providers that you're ready to use. To register a resource provider, use:

```python
import os  
from azure.identity import DefaultAzureCredential  
from azure.mgmt.resource import ResourceManagementClient  
  
# Authentication  
credential = DefaultAzureCredential()  
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]  
  
# Initialize Resource Management client  
resource_management_client = ResourceManagementClient(credential, subscription_id)  
  
# Register resource provider  
provider_namespace = "Microsoft.Batch"  
registration_result = resource_management_client.providers.register(provider_namespace)  
  
print(f"ProviderNamespace: {registration_result.namespace}, RegistrationState: {registration_result.registration_state}")  
```

The command returns:

```output
ProviderNamespace: Microsoft.Batch, RegistrationState: Registered
```

> [!IMPORTANT]
> As [noted earlier](#register-resource-provider), **don't block the creation of resources** for a resource provider that is in the **registering** state. By not blocking a resource provider in the registering state, your application can continue much sooner than waiting for all regions to complete.

Reregister a resource provider to use locations that have been added since the previous registration. To reregister, run the registration command again.

To see information for a particular resource provider, use:

```python
import os  
from azure.identity import DefaultAzureCredential  
from azure.mgmt.resource import ResourceManagementClient  
  
# Authentication  
credential = DefaultAzureCredential()  
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]  
  
# Initialize Resource Management client  
resource_management_client = ResourceManagementClient(credential, subscription_id)  
  
# Get resource provider by ProviderNamespace  
provider_namespace = "Microsoft.Batch"  
provider = resource_management_client.providers.get(provider_namespace)  
  
print(f"ProviderNamespace: {provider.namespace}, RegistrationState: {provider.registration_state}\n")  
  
# Add resource types, locations, and API versions with new lines to separate results  
for resource_type in provider.resource_types:  
    print(f"ResourceType: {resource_type.resource_type}\nLocations: {', '.join(resource_type.locations)}\nAPIVersions: {', '.join(resource_type.api_versions)}\n")  

```

The command returns:

```output
ProviderNamespace: Microsoft.Batch, RegistrationState: Registered

ResourceType: batchAccounts
Locations: West Europe, East US, East US 2, West US, North Central US, Brazil South, North Europe, Central US, East Asia, Japan East, Australia Southeast, Japan West, Korea South, Korea Central, Southeast Asia, South Central US, Australia East, Jio India West, South India, Central India, West India, Canada Central, Canada East, UK South, UK West, West Central US, West US 2, France Central, South Africa North, UAE North, Australia Central, Germany West Central, Switzerland North, Norway East, Brazil Southeast, West US 3, Sweden Central, Qatar Central, Poland Central, East US 2 EUAP, Central US EUAP
APIVersions: 2023-05-01, 2022-10-01, 2022-06-01, 2022-01-01, 2021-06-01, 2021-01-01, 2020-09-01, 2020-05-01, 2020-03-01-preview, 2020-03-01, 2019-08-01, 2019-04-01, 2018-12-01, 2017-09-01, 2017-05-01, 2017-01-01, 2015-12-01, 2015-09-01, 2015-07-01, 2014-05-01-privatepreview

...
```

To see the resource types for a resource provider, use:

```python
# Get resource provider by ProviderNamespace  
provider_namespace = "Microsoft.Batch"  
provider = resource_management_client.providers.get(provider_namespace)  
  
# Get ResourceTypeName of the resource types  
resource_type_names = [resource_type.resource_type for resource_type in provider.resource_types]  
  
for resource_type_name in resource_type_names:  
    print(resource_type_name)  
```

The command returns:

```output
batchAccounts
batchAccounts/pools
batchAccounts/detectors
batchAccounts/certificates
operations
locations
locations/quotas
locations/checkNameAvailability
locations/accountOperationResults
locations/virtualMachineSkus
locations/cloudServiceSkus
```

The API version corresponds to a version of the resource provider's REST API operations. As a resource provider enables new features, it releases a new version of the REST API.

To get the available API versions for a resource type, use:

```python
# Get resource provider by ProviderNamespace  
provider_namespace = "Microsoft.Batch"  
provider = resource_management_client.providers.get(provider_namespace)  
  
# Filter resource type by ResourceTypeName and get its ApiVersions  
resource_type_name = "batchAccounts"  
api_versions = [  
    resource_type.api_versions  
    for resource_type in provider.resource_types  
    if resource_type.resource_type == resource_type_name  
]  
  
for api_version in api_versions[0]:  
    print(api_version)  

```

The command returns:

```output
2023-05-01
2022-10-01
2022-06-01
2022-01-01
...
```

Resource Manager is supported in all regions, but the resources you deploy might not be supported in all regions. Also, there may be limitations on your subscription that prevent you from using some regions that support the resource.

To get the supported locations for a resource type, use.

```python
# Get resource provider by ProviderNamespace  
provider_namespace = "Microsoft.Batch"  
provider = resource_management_client.providers.get(provider_namespace)  
  
# Filter resource type by ResourceTypeName and get its Locations  
resource_type_name = "batchAccounts"  
locations = [  
    resource_type.locations  
    for resource_type in provider.resource_types  
    if resource_type.resource_type == resource_type_name  
]  
  
for location in locations[0]:  
    print(location)  
```

The command returns:

```output
West Europe
East US
East US 2
West US
...
```


## Next steps

* To learn about creating Resource Manager templates, see [Authoring Azure Resource Manager templates](../templates/syntax.md). 
* To view the resource provider template schemas, see [Template reference](/azure/templates/).
* For a list that maps resource providers to Azure services, see [Resource providers for Azure services](azure-services-resource-providers.md).
* To view the operations for a resource provider, see [Azure REST API](/rest/api/).
