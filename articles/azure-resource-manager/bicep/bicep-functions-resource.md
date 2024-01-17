---
title: Bicep functions - resources
description: Describes the functions to use in a Bicep file to retrieve values about resources.
author: mumian
ms.author: jgao
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 11/03/2023
---

# Resource functions for Bicep

This article describes the Bicep functions for getting resource values.

To get values from the current deployment, see [Deployment value functions](./bicep-functions-deployment.md).

## extensionResourceId

`extensionResourceId(resourceId, resourceType, resourceName1, [resourceName2], ...)`

Returns the resource ID for an [extension resource](../management/extension-resource-types.md). An extension resource is a resource type that's applied to another resource to add to its capabilities.

Namespace: [az](bicep-functions.md#namespaces-for-functions).

The `extensionResourceId` function is available in Bicep files, but typically you don't need it. Instead, use the symbolic name for the resource and access the `id` property.

The basic format of the resource ID returned by this function is:

```json
{scope}/providers/{extensionResourceProviderNamespace}/{extensionResourceType}/{extensionResourceName}
```

The scope segment varies by the resource being extended.

When the extension resource is applied to a **resource**, the resource ID is returned in the following format:

```json
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{baseResourceProviderNamespace}/{baseResourceType}/{baseResourceName}/providers/{extensionResourceProviderNamespace}/{extensionResourceType}/{extensionResourceName}
```

When the extension resource is applied to a **resource group**, the format is:

```json
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{extensionResourceProviderNamespace}/{extensionResourceType}/{extensionResourceName}
```

When the extension resource is applied to a **subscription**, the format is:

```json
/subscriptions/{subscriptionId}/providers/{extensionResourceProviderNamespace}/{extensionResourceType}/{extensionResourceName}
```

When the extension resource is applied to a **management group**, the format is:

```json
/providers/Microsoft.Management/managementGroups/{managementGroupName}/providers/{extensionResourceProviderNamespace}/{extensionResourceType}/{extensionResourceName}
```

A custom policy definition deployed to a management group is implemented as an extension resource. To create and assign a policy, deploy the following Bicep file to a management group.

```bicep
targetScope = 'managementGroup'

@description('An array of the allowed locations, all other locations will be denied by the created policy.')
param allowedLocations array = [
  'australiaeast'
  'australiasoutheast'
  'australiacentral'
]

resource policyDefinition 'Microsoft.Authorization/policyDefinitions@2021-06-01' = {
  name: 'locationRestriction'
  properties: {
    policyType: 'Custom'
    mode: 'All'
    parameters: {}
    policyRule: {
      if: {
        not: {
          field: 'location'
          in: allowedLocations
        }
      }
      then: {
        effect: 'deny'
      }
    }
  }
}

resource policyAssignment 'Microsoft.Authorization/policyAssignments@2022-06-01' = {
  name: 'locationAssignment'
  properties: {
    policyDefinitionId: policyDefinition.id
  }
}
```

---

Built-in policy definitions are tenant level resources. For an example of deploying a built-in policy definition, see [tenantResourceId](#tenantresourceid).

## getSecret

`keyVaultName.getSecret(secretName)`

Returns a secret from an Azure Key Vault. Use this function to pass a secret to a secure string parameter of a Bicep module.

> [!NOTE]
> `az.getSecret(subscriptionId, resourceGroupName, keyVaultName, secretName, secretVersion)` function can be used in `.bicepparam` files to retrieve key vault secrets. For more information, see [getSecret](./bicep-functions-parameters-file.md#getsecret).

You can only use the `getSecret` function from within the `params` section of a module. You can only use it with a `Microsoft.KeyVault/vaults` resource.

```bicep
module sql './sql.bicep' = {
  name: 'deploySQL'
  params: {
    adminPassword: keyVault.getSecret('vmAdminPassword')
  }
}
```

You get an error if you attempt to use this function in any other part of the Bicep file. You also get an error if you use this function with string interpolation, even when used in the params section.

The function can be used only with a module parameter that has the `@secure()` decorator.

The key vault must have `enabledForTemplateDeployment` set to `true`. The user deploying the Bicep file must have access to the secret. For more information, see [Use Azure Key Vault to pass secure parameter value during Bicep deployment](key-vault-parameter.md).

A [namespace qualifier](bicep-functions.md#namespaces-for-functions) isn't needed because the function is used with a resource type.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| secretName | Yes | string | The name of the secret stored in a key vault. |

### Return value

The secret value for the secret name.

### Example

The following Bicep file is used as a module. It has an `adminPassword` parameter defined with the `@secure()` decorator.

```bicep
param sqlServerName string
param adminLogin string

@secure()
param adminPassword string

resource sqlServer 'Microsoft.Sql/servers@2022-08-01-preview' = {
  ...
}
```

The following Bicep file consumes the preceding Bicep file as a module. The Bicep file references an existing key vault, and calls the `getSecret` function to retrieve the key vault secret, and then passes the value as a parameter to the module.

```bicep
param sqlServerName string
param adminLogin string

param subscriptionId string
param kvResourceGroup string
param kvName string

resource keyVault 'Microsoft.KeyVault/vaults@2023-02-01' existing = {
  name: kvName
  scope: resourceGroup(subscriptionId, kvResourceGroup )
}

module sql './sql.bicep' = {
  name: 'deploySQL'
  params: {
    sqlServerName: sqlServerName
    adminLogin: adminLogin
    adminPassword: keyVault.getSecret('vmAdminPassword')
  }
}
```

<a id="listkeys"></a>
<a id="list"></a>

## list*

`resourceName.list([apiVersion], [functionValues])`

You can call a list function for any resource type with an operation that starts with `list`. Some common usages are `list`, `listKeys`, `listKeyValue`, and `listSecrets`.

The syntax for this function varies by the name of the list operation. The returned values also vary by operation. Bicep doesn't currently support completions and validation for `list*` functions.

With [Bicep CLI version 0.4.X or higher](./install.md), you call the list function by using the [accessor operator](operators-access.md#function-accessor). For example, `storageAccount.listKeys()`.

A [namespace qualifier](bicep-functions.md#namespaces-for-functions) isn't needed because the function is used with a resource type.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| apiVersion |No |string |If you don't provide this parameter, the API version for the resource is used. Only provide a custom API version when you need the function to be run with a specific version. Use the format, **yyyy-mm-dd**. |
| functionValues |No |object | An object that has values for the function. Only provide this object for functions that support receiving an object with parameter values, such as `listAccountSas` on a storage account. An example of passing function values is shown in this article. |

### Valid uses

The `list` functions can be used in the properties of a resource definition. Don't use a `list` function that exposes sensitive information in the outputs section of a Bicep file. Output values are stored in the deployment history and could be retrieved by a malicious user.

When used with an [iterative loop](loops.md), you can use the `list` functions for `input` because the expression is assigned to the resource property. You can't use them with `count` because the count must be determined before the `list` function is resolved.

If you use a `list` function in a resource that is conditionally deployed, the function is evaluated even if the resource isn't deployed. You get an error if the `list` function refers to a resource that doesn't exist. Use the [conditional expression **?:** operator](./operators-logical.md#conditional-expression--) to make sure the function is only evaluated when the resource is being deployed.

### Return value

The returned object varies by the list function you use. For example, the `listKeys` for a storage account returns the following format:

```json
{
  "keys": [
    {
      "keyName": "key1",
      "permissions": "Full",
      "value": "{value}"
    },
    {
      "keyName": "key2",
      "permissions": "Full",
      "value": "{value}"
    }
  ]
}
```

Other `list` functions have different return formats. To see the format of a function, include it in the outputs section as shown in the example Bicep file.

### List example

The following example deploys a storage account and then calls `listKeys` on that storage account. The key is used when setting a value for [deployment scripts](../templates/deployment-script-template.md).

```bicep
resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: 'dscript${uniqueString(resourceGroup().id)}'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

resource dScript 'Microsoft.Resources/deploymentScripts@2020-10-01' = {
  name: 'scriptWithStorage'
  location: location
  ...
  properties: {
    azCliVersion: '2.0.80'
    storageAccountSettings: {
      storageAccountName: storageAccount.name
      storageAccountKey: storageAccount.listKeys().keys[0].value
    }
    ...
  }
}
```

The next example shows a `list` function that takes a parameter. In this case, the function is `listAccountSas`. Pass an object for the expiry time. The expiry time must be in the future.

```bicep
param accountSasProperties object {
  default: {
    signedServices: 'b'
    signedPermission: 'r'
    signedExpiry: '2020-08-20T11:00:00Z'
    signedResourceTypes: 's'
  }
}
...
sasToken: storageAccount.listAccountSas('2021-04-01', accountSasProperties).accountSasToken
```

### Implementations

The possible uses of `list*` are shown in the following table.

| Resource type | Function name |
| ------------- | ------------- |
| Microsoft.Addons/supportProviders | listsupportplaninfo |
| Microsoft.AnalysisServices/servers | [listGatewayStatus](/rest/api/analysisservices/servers/listgatewaystatus) |
| Microsoft.ApiManagement/service/authorizationServers | [listSecrets](/rest/api/apimanagement/current-ga/authorization-server/list-secrets) |
| Microsoft.ApiManagement/service/gateways | [listKeys](/rest/api/apimanagement/current-ga/gateway/list-keys) |
| Microsoft.ApiManagement/service/identityProviders | [listSecrets](/rest/api/apimanagement/current-ga/identity-provider/list-secrets) |
| Microsoft.ApiManagement/service/namedValues | [listValue](/rest/api/apimanagement/current-ga/named-value/list-value) |
| Microsoft.ApiManagement/service/openidConnectProviders | [listSecrets](/rest/api/apimanagement/current-ga/openid-connect-provider/list-secrets) |
| Microsoft.ApiManagement/service/subscriptions | [listSecrets](/rest/api/apimanagement/current-ga/subscription/list-secrets) |
| Microsoft.AppConfiguration/configurationStores | [ListKeys](/rest/api/appconfiguration/stable/configuration-stores/list-keys) |
| Microsoft.AppPlatform/Spring | [listTestKeys](/rest/api/azurespringapps/services/list-test-keys) |
| Microsoft.Automation/automationAccounts | [listKeys](/rest/api/automation/keys/listbyautomationaccount) |
| Microsoft.Batch/batchAccounts | [listkeys](/rest/api/batchmanagement/batchaccount/getkeys) |
| Microsoft.BatchAI/workspaces/experiments/jobs | listoutputfiles |
| Microsoft.BotService/botServices/channels | [listChannelWithKeys](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/botservice/resource-manager/Microsoft.BotService/stable/2020-06-02/botservice.json#L553) |
| Microsoft.Cache/redis | [listKeys](/rest/api/redis/redis/list-keys) |
| Microsoft.CognitiveServices/accounts | [listKeys](/rest/api/cognitiveservices/accountmanagement/accounts/listkeys) |
| Microsoft.ContainerRegistry/registries | [listBuildSourceUploadUrl](/rest/api/containerregistry/registries%20(tasks)/get-build-source-upload-url) |
| Microsoft.ContainerRegistry/registries | [listCredentials](/rest/api/containerregistry/registries/listcredentials) |
| Microsoft.ContainerRegistry/registries | [listUsages](/rest/api/containerregistry/registries/listusages) |
| Microsoft.ContainerRegistry/registries/agentpools | listQueueStatus |
| Microsoft.ContainerRegistry/registries/buildTasks | listSourceRepositoryProperties |
| Microsoft.ContainerRegistry/registries/buildTasks/steps | listBuildArguments |
| Microsoft.ContainerRegistry/registries/taskruns | listDetails |
| Microsoft.ContainerRegistry/registries/webhooks | [listEvents](/rest/api/containerregistry/webhooks/listevents) |
| Microsoft.ContainerRegistry/registries/runs | [listLogSasUrl](/rest/api/containerregistry/runs/getlogsasurl) |
| Microsoft.ContainerRegistry/registries/tasks | [listDetails](/rest/api/containerregistry/tasks/getdetails) |
| Microsoft.ContainerService/managedClusters | [listClusterAdminCredential](/rest/api/aks/managedclusters/listclusteradmincredentials) |
| Microsoft.ContainerService/managedClusters | [listClusterMonitoringUserCredential](/rest/api/aks/managedclusters/listclustermonitoringusercredentials) |
| Microsoft.ContainerService/managedClusters | [listClusterUserCredential](/rest/api/aks/managedclusters/listclusterusercredentials) |
| Microsoft.ContainerService/managedClusters/accessProfiles | [listCredential](/rest/api/aks/managedclusters/getaccessprofile) |
| Microsoft.DataBox/jobs | listCredentials |
| Microsoft.DataFactory/datafactories/gateways | listauthkeys |
| Microsoft.DataFactory/factories/integrationruntimes | [listauthkeys](/rest/api/datafactory/integrationruntimes/listauthkeys) |
| Microsoft.DataLakeAnalytics/accounts/storageAccounts/Containers | [listSasTokens](/rest/api/datalakeanalytics/storageaccounts/listsastokens) |
| Microsoft.DataShare/accounts/shares | [listSynchronizations](/rest/api/datashare/2020-09-01/shares/listsynchronizations) |
| Microsoft.DataShare/accounts/shareSubscriptions | [listSourceShareSynchronizationSettings](/rest/api/datashare/2020-09-01/sharesubscriptions/listsourcesharesynchronizationsettings) |
| Microsoft.DataShare/accounts/shareSubscriptions | [listSynchronizationDetails](/rest/api/datashare/2020-09-01/sharesubscriptions/listsynchronizationdetails) |
| Microsoft.DataShare/accounts/shareSubscriptions | [listSynchronizations](/rest/api/datashare/2020-09-01/sharesubscriptions/listsynchronizations) |
| Microsoft.Devices/iotHubs | [listkeys](/rest/api/iothub/iothubresource/listkeys) |
| Microsoft.Devices/iotHubs/iotHubKeys | [listkeys](/rest/api/iothub/iothubresource/getkeysforkeyname) |
| Microsoft.Devices/provisioningServices/keys | [listkeys](/rest/api/iot-dps/iotdpsresource/listkeysforkeyname) |
| Microsoft.Devices/provisioningServices | [listkeys](/rest/api/iot-dps/iotdpsresource/listkeys) |
| Microsoft.DevTestLab/labs | [ListVhds](/rest/api/dtl/labs/listvhds) |
| Microsoft.DevTestLab/labs/schedules | [ListApplicable](/rest/api/dtl/schedules/listapplicable) |
| Microsoft.DevTestLab/labs/users/serviceFabrics | [ListApplicableSchedules](/rest/api/dtl/servicefabrics/listapplicableschedules) |
| Microsoft.DevTestLab/labs/virtualMachines | [ListApplicableSchedules](/rest/api/dtl/virtualmachines/listapplicableschedules) |
| Microsoft.DocumentDB/databaseAccounts | [listKeys](/rest/api/cosmos-db-resource-provider/2021-11-15-preview/database-accounts/list-keys?tabs=HTTP) |
| Microsoft.DocumentDB/databaseAccounts/notebookWorkspaces | [listConnectionInfo](/rest/api/cosmos-db-resource-provider/2023-03-15-preview/notebook-workspaces/list-connection-info?tabs=HTTP) |
| Microsoft.DomainRegistration | [listDomainRecommendations](/rest/api/appservice/domains/listrecommendations) |
| Microsoft.DomainRegistration/topLevelDomains | [listAgreements](/rest/api/appservice/topleveldomains/listagreements) |
| Microsoft.EventGrid/domains | [listKeys](/rest/api/eventgrid/controlplane/domains/list-shared-access-keys) |
| Microsoft.EventGrid/topics | [listKeys](/rest/api/eventgrid/controlplane/topics/list-shared-access-keys) |
| Microsoft.EventHub/namespaces/authorizationRules | [listkeys](/rest/api/eventhub) |
| Microsoft.EventHub/namespaces/disasterRecoveryConfigs/authorizationRules | [listkeys](/rest/api/eventhub) |
| Microsoft.EventHub/namespaces/eventhubs/authorizationRules | [listkeys](/rest/api/eventhub) |
| Microsoft.ImportExport/jobs | [listBitLockerKeys](/rest/api/storageimportexport/bitlockerkeys/list) |
| Microsoft.Kusto/Clusters/Databases | [ListPrincipals](/rest/api/azurerekusto/databases/listprincipals) |
| Microsoft.LabServices/labs/users | [list](/rest/api/labservices/users/list-by-lab) |
| Microsoft.LabServices/labs/virtualMachines | [list](/rest/api/labservices/virtual-machines/list-by-lab) |
| Microsoft.Logic/integrationAccounts/agreements | [listContentCallbackUrl](/rest/api/logic/agreements/listcontentcallbackurl) |
| Microsoft.Logic/integrationAccounts/assemblies | [listContentCallbackUrl](/rest/api/logic/integrationaccountassemblies/listcontentcallbackurl) |
| Microsoft.Logic/integrationAccounts | [listCallbackUrl](/rest/api/logic/integrationaccounts/getcallbackurl) |
| Microsoft.Logic/integrationAccounts | [listKeyVaultKeys](/rest/api/logic/integrationaccounts/listkeyvaultkeys) |
| Microsoft.Logic/integrationAccounts/maps | [listContentCallbackUrl](/rest/api/logic/maps/listcontentcallbackurl) |
| Microsoft.Logic/integrationAccounts/partners | [listContentCallbackUrl](/rest/api/logic/partners/listcontentcallbackurl) |
| Microsoft.Logic/integrationAccounts/schemas | [listContentCallbackUrl](/rest/api/logic/schemas/listcontentcallbackurl) |
| Microsoft.Logic/workflows | [listCallbackUrl](/rest/api/logic/workflows/listcallbackurl) |
| Microsoft.Logic/workflows | [listSwagger](/rest/api/logic/workflows/listswagger) |
| Microsoft.Logic/workflows/runs/actions | [listExpressionTraces](/rest/api/logic/workflowrunactions/listexpressiontraces) |
| Microsoft.Logic/workflows/runs/actions/repetitions | [listExpressionTraces](/rest/api/logic/workflowrunactionrepetitions/listexpressiontraces) |
| Microsoft.Logic/workflows/triggers | [listCallbackUrl](/rest/api/logic/workflowtriggers/listcallbackurl) |
| Microsoft.Logic/workflows/versions/triggers | [listCallbackUrl](/rest/api/logic/workflowversions/listcallbackurl) |
| Microsoft.MachineLearning/webServices | [listkeys](/rest/api/machinelearning/webservices/listkeys) |
| Microsoft.MachineLearning/Workspaces | listworkspacekeys |
| Microsoft.MachineLearningServices/workspaces/computes | [listKeys](/rest/api/azureml/compute/list-keys) |
| Microsoft.MachineLearningServices/workspaces/computes | [listNodes](/rest/api/azureml/compute/list-nodes) |
| Microsoft.MachineLearningServices/workspaces | [listKeys](/rest/api/azureml/workspaces/list-keys) |
| Microsoft.Maps/accounts | [listKeys](/rest/api/maps-management/accounts/listkeys) |
| Microsoft.Media/mediaservices/assets | [listContainerSas](/rest/api/media/assets/listcontainersas) |
| Microsoft.Media/mediaservices/assets | [listStreamingLocators](/rest/api/media/assets/liststreaminglocators) |
| Microsoft.Media/mediaservices/streamingLocators | [listContentKeys](/rest/api/media/streaminglocators/listcontentkeys) |
| Microsoft.Media/mediaservices/streamingLocators | [listPaths](/rest/api/media/streaminglocators/listpaths) |
| Microsoft.Network/applicationSecurityGroups | listIpConfigurations |
| Microsoft.NotificationHubs/Namespaces/authorizationRules | [listkeys](/rest/api/notificationhubs/namespaces/listkeys) |
| Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules | [listkeys](/rest/api/notificationhubs/notificationhubs/listkeys) |
| Microsoft.OperationalInsights/workspaces | [list](/rest/api/loganalytics/workspaces/list) |
| Microsoft.OperationalInsights/workspaces | listKeys |
| Microsoft.PolicyInsights/remediations | [listDeployments](/rest/api/policy/remediations/listdeploymentsatresourcegroup) |
| Microsoft.RedHatOpenShift/openShiftClusters | [listCredentials](/rest/api/openshift/openshiftclusters/listcredentials) |
| Microsoft.Relay/namespaces/disasterRecoveryConfigs/authorizationRules | listkeys |
| Microsoft.Search/searchServices | [listAdminKeys](/rest/api/searchmanagement/2021-04-01-preview/admin-keys/get) |
| Microsoft.Search/searchServices | [listQueryKeys](/rest/api/searchmanagement/2021-04-01-preview/query-keys/list-by-search-service) |
| Microsoft.SignalRService/SignalR | [listkeys](/rest/api/signalr/signalr/listkeys) |
| Microsoft.Storage/storageAccounts | [listAccountSas](/rest/api/storagerp/storageaccounts/listaccountsas) |
| Microsoft.Storage/storageAccounts | [listkeys](/rest/api/storagerp/storageaccounts/listkeys) |
| Microsoft.Storage/storageAccounts | [listServiceSas](/rest/api/storagerp/storageaccounts/listservicesas) |
| Microsoft.StorSimple/managers/devices | [listFailoverSets](/rest/api/storsimple/devices/listfailoversets) |
| Microsoft.StorSimple/managers/devices | [listFailoverTargets](/rest/api/storsimple/devices/listfailovertargets) |
| Microsoft.StorSimple/managers | [listActivationKey](/rest/api/storsimple/managers/getactivationkey) |
| Microsoft.StorSimple/managers | [listPublicEncryptionKey](/rest/api/storsimple/managers/getpublicencryptionkey) |
| Microsoft.Synapse/workspaces/integrationRuntimes | [listAuthKeys](/rest/api/synapse/integrationruntimeauthkeys/list) |
| Microsoft.Web/connectionGateways | ListStatus |
| microsoft.web/connections | listconsentlinks |
| Microsoft.Web/customApis | listWsdlInterfaces |
| microsoft.web/locations | listwsdlinterfaces |
| microsoft.web/apimanagementaccounts/apis/connections | listconnectionkeys |
| microsoft.web/apimanagementaccounts/apis/connections | listsecrets |
| microsoft.web/sites/backups | [list](/rest/api/appservice/webapps/listbackups) |
| Microsoft.Web/sites/config | [list](/rest/api/appservice/webapps/listconfigurations) |
| microsoft.web/sites/functions | [listkeys](/rest/api/appservice/webapps/listfunctionkeys)
| microsoft.web/sites/functions | [listsecrets](/rest/api/appservice/webapps/listfunctionsecrets) |
| microsoft.web/sites/hybridconnectionnamespaces/relays | [listkeys](/rest/api/appservice/appserviceplans/listhybridconnectionkeys) |
| microsoft.web/sites | [listsyncfunctiontriggerstatus](/rest/api/appservice/webapps/listsyncfunctiontriggers) |
| microsoft.web/sites/slots/functions | [listsecrets](/rest/api/appservice/webapps/listfunctionsecretsslot) |
| microsoft.web/sites/slots/backups | [list](/rest/api/appservice/webapps/listbackupsslot) |
| Microsoft.Web/sites/slots/config | [list](/rest/api/appservice/webapps/listconfigurationsslot) |
| microsoft.web/sites/slots/functions | [listsecrets](/rest/api/appservice/webapps/listfunctionsecretsslot) |

To determine which resource types have a list operation, you have the following options:

* View the [REST API operations](/rest/api/) for a resource provider, and look for list operations. For example, storage accounts have the [listKeys operation](/rest/api/storagerp/storageaccounts).
* Use the [Get-​AzProvider​Operation](/powershell/module/az.resources/get-azprovideroperation) PowerShell cmdlet. The following example gets all list operations for storage accounts:

  ```powershell
  Get-AzProviderOperation -OperationSearchString "Microsoft.Storage/*" | where {$_.Operation -like "*list*"} | FT Operation
  ```

* Use the following Azure CLI command to filter only the list operations:

  ```azurecli
  az provider operation show --namespace Microsoft.Storage --query "resourceTypes[?name=='storageAccounts'].operations[].name | [?contains(@, 'list')]"
  ```

## pickZones

`pickZones(providerNamespace, resourceType, location, [numberOfZones], [offset])`

Determines whether a resource type supports zones for a region. This function **only supports zonal resources**. Zone redundant services return an empty array. For more information, see [Azure Services that support Availability Zones](../../availability-zones/az-region.md).

Namespace: [az](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| providerNamespace | Yes | string | The resource provider namespace for the resource type to check for zone support. |
| resourceType | Yes | string | The resource type to check for zone support. |
| location | Yes | string | The region to check for zone support. |
| numberOfZones | No | integer | The number of logical zones to return. The default is 1. The number must be a positive integer from 1 to 3.  Use 1 for single-zoned resources. For multi-zoned resources, the value must be less than or equal to the number of supported zones. |
| offset | No | integer | The offset from the starting logical zone. The function returns an error if offset plus numberOfZones exceeds the number of supported zones. |

### Return value

An array with the supported zones. When using the default values for offset and `numberOfZones`, a resource type and region that supports zones returns the following array:

```json
[
    "1"
]
```

When the `numberOfZones` parameter is set to 3, it returns:

```json
[
    "1",
    "2",
    "3"
]
```

When the resource type or region doesn't support zones, an empty array is returned.

```json
[
]
```

### Remarks

There are different categories for Azure Availability Zones - zonal and zone-redundant.  The `pickZones` function can be used to return an availability zone for a zonal resource.  For zone redundant services (ZRS), the function returns an empty array.  Zonal resources typically have a `zones` property at the top level of the resource definition. To determine the category of support for availability zones, see [Azure Services that support Availability Zones](../../availability-zones/az-region.md).

To determine if a given Azure region or location supports availability zones, call the `pickZones` function with a zonal resource type, such as `Microsoft.Network/publicIPAddresses`.  If the response isn't empty, the region supports availability zones.

### pickZones example

The following Bicep file shows three results for using the `pickZones` function.

```bicep
output supported array = pickZones('Microsoft.Compute', 'virtualMachines', 'westus2')
output notSupportedRegion array = pickZones('Microsoft.Compute', 'virtualMachines', 'westus')
output notSupportedType array = pickZones('Microsoft.Cdn', 'profiles', 'westus2')
```

The output from the preceding examples returns three arrays.

| Name | Type | Value |
| ---- | ---- | ----- |
| supported | array | [ "1" ] |
| notSupportedRegion | array | [] |
| notSupportedType | array | [] |

You can use the response from `pickZones` to determine whether to provide null for zones or assign virtual machines to different zones.

## providers

**The providers function has been deprecated in Bicep.** We no longer recommend using it. If you used this function to get an API version for the resource provider, we recommend that you provide a specific API version in your Bicep file. Using a dynamically returned API version can break your template if the properties change between versions.

The [providers operation](/rest/api/resources/providers) is still available through the REST API. It can be used outside of a Bicep file to get information about a resource provider.

Namespace: [az](bicep-functions.md#namespaces-for-functions).

## reference

`reference(resourceName or resourceIdentifier, [apiVersion], ['Full'])`

Returns an object representing a resource's runtime state.

Namespace: [az](bicep-functions.md#namespaces-for-functions).

The Bicep files provide access to the reference function, although it is typically unnecessary. Instead, it is recommended to use the symbolic name of the resource. The reference function can only be used within the `properties` object of a resource and cannot be employed for top-level properties like `name` or `location`. The same generally applies to references using the symbolic name. However, for properties such as `name`, it is possible to generate a template without utilizing the reference function. Sufficient information about the resource name is known to directly emit the name. It is referred to as compile-time properties. Bicep validation can identify any incorrect usage of the symbolic name.

The following example deploys a storage account. The first two outputs give you the same results.

```bicep
param storageAccountName string = uniqueString(resourceGroup().id)
param location string = resourceGroup().location

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageAccountName
  location: location
  kind: 'Storage'
  sku: {
    name: 'Standard_LRS'
  }
}

output storageObjectSymbolic object = storageAccount.properties
output storageObjectReference object = reference('storageAccount')
output storageName string = storageAccount.name
output storageLocation string = storageAccount.location
```

To get a property from an existing resource that isn't deployed in the template, use the `existing` keyword:

```bicep
param storageAccountName string

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' existing = {
  name: storageAccountName
}

// use later in template as often as needed
output blobAddress string = storageAccount.properties.primaryEndpoints.blob
```

To reference a resource that is nested inside a parent resource, use the [nested accessor](operators-access.md#nested-resource-accessor) (`::`). You only use this syntax when you're accessing the nested resource from outside of the parent resource.

```bicep
vNet1::subnet1.properties.addressPrefix
```

If you attempt to reference a resource that doesn't exist, you get the `NotFound` error and your deployment fails.

## resourceId

`resourceId([subscriptionId], [resourceGroupName], resourceType, resourceName1, [resourceName2], ...)`

Returns the unique identifier of a resource.

Namespace: [az](bicep-functions.md#namespaces-for-functions).

The `resourceId` function is available in Bicep files, but typically you don't need it. Instead, use the symbolic name for the resource and access the `id` property.

You use this function when the resource name is ambiguous or not provisioned within the same Bicep file. The format of the returned identifier varies based on whether the deployment happens at the scope of a resource group, subscription, management group, or tenant.

For example:

```bicep
param storageAccountName string
param location string = resourceGroup().location

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageAccountName
  location: location
  kind: 'Storage'
  sku: {
    name: 'Standard_LRS'
  }
}

output storageID string = storageAccount.id
```

To get the resource ID for a resource that isn't deployed in the Bicep file, use the existing keyword.

```bicep
param storageAccountName string

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' existing = {
    name: storageAccountName
}

output storageID string = storageAccount.id
```

For more information, see the [JSON template resourceId function](../templates/template-functions-resource.md#resourceid)

## subscriptionResourceId

`subscriptionResourceId([subscriptionId], resourceType, resourceName1, [resourceName2], ...)`

Returns the unique identifier for a resource deployed at the subscription level.

Namespace: [az](bicep-functions.md#namespaces-for-functions).

The `subscriptionResourceId` function is available in Bicep files, but typically you don't need it. Instead, use the symbolic name for the resource and access the `id` property.

The identifier is returned in the following format:

```json
/subscriptions/{subscriptionId}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}
```

### Remarks

You use this function to get the resource ID for resources that are [deployed to the subscription](deploy-to-subscription.md) rather than a resource group. The returned ID differs from the value returned by the [resourceId](#resourceid) function by not including a resource group value.

### subscriptionResourceID example

The following Bicep file assigns a built-in role. You can deploy it to either a resource group or subscription. It uses the `subscriptionResourceId` function to get the resource ID for built-in roles.

```bicep
@description('Principal Id')
param principalId string

@allowed([
  'Owner'
  'Contributor'
  'Reader'
])
@description('Built-in role to assign')
param builtInRoleType string

var roleDefinitionId = {
  Owner: {
    id: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '8e3af657-a8ff-443c-a75c-2fe8c4bcb635')
  }
  Contributor: {
    id: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'b24988ac-6180-42a0-ab88-20f7382dd24c')
  }
  Reader: {
    id: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'acdd72a7-3385-48ef-bd42-f606fba81ae7')
  }
}

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(resourceGroup().id, principalId, roleDefinitionId[builtInRoleType].id)
  properties: {
    roleDefinitionId: roleDefinitionId[builtInRoleType].id
    principalId: principalId
  }
}
```

## managementGroupResourceId

`managementGroupResourceId(resourceType, resourceName1, [resourceName2], ...)`

Returns the unique identifier for a resource deployed at the management group level.

Namespace: [az](bicep-functions.md#namespaces-for-functions).

The `managementGroupResourceId` function is available in Bicep files, but typically you don't need it. Instead, use the symbolic name for the resource and access the `id` property.

The identifier is returned in the following format:

```json
/providers/Microsoft.Management/managementGroups/{managementGroupName}/providers/{resourceType}/{resourceName}
```

### Remarks

You use this function to get the resource ID for resources that are [deployed to the management group](deploy-to-management-group.md) rather than a resource group. The returned ID differs from the value returned by the [resourceId](#resourceid) function by not including a subscription ID and a resource group value.

### managementGroupResourceID example

The following template creates and assigns a policy definition. It uses the `managementGroupResourceId` function to get the resource ID for policy definition.

```bicep
targetScope = 'managementGroup'

@description('Target Management Group')
param targetMG string

@description('An array of the allowed locations, all other locations will be denied by the created policy.')
param allowedLocations array = [
  'australiaeast'
  'australiasoutheast'
  'australiacentral'
]

var mgScope = tenantResourceId('Microsoft.Management/managementGroups', targetMG)
var policyDefinitionName = 'LocationRestriction'

resource policyDefinition 'Microsoft.Authorization/policyDefinitions@2021-06-01' = {
  name: policyDefinitionName
  properties: {
    policyType: 'Custom'
    mode: 'All'
    parameters: {}
    policyRule: {
      if: {
        not: {
          field: 'location'
          in: allowedLocations
        }
      }
      then: {
        effect: 'deny'
      }
    }
  }
}

resource location_lock 'Microsoft.Authorization/policyAssignments@2021-06-01' = {
  name: 'location-lock'
  properties: {
    scope: mgScope
    policyDefinitionId: managementGroupResourceId('Microsoft.Authorization/policyDefinitions', policyDefinitionName)
  }
  dependsOn: [
    policyDefinition
  ]
}
```

## tenantResourceId

`tenantResourceId(resourceType, resourceName1, [resourceName2], ...)`

Returns the unique identifier for a resource deployed at the tenant level.

Namespace: [az](bicep-functions.md#namespaces-for-functions).

The `tenantResourceId` function is available in Bicep files, but typically you don't need it. Instead, use the symbolic name for the resource and access the `id` property.

The identifier is returned in the following format:

```json
/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}
```

Built-in policy definitions are tenant level resources. To deploy a policy assignment that references a built-in policy definition, use the `tenantResourceId` function.

```bicep
@description('Specifies the ID of the policy definition or policy set definition being assigned.')
param policyDefinitionID string = '0a914e76-4921-4c19-b460-a2d36003525a'

@description('Specifies the name of the policy assignment, can be used defined or an idempotent name as the defaultValue provides.')
param policyAssignmentName string = guid(policyDefinitionID, resourceGroup().name)

resource policyAssignment 'Microsoft.Authorization/policyAssignments@2022-06-01' = {
  name: policyAssignmentName
  properties: {
    scope: subscriptionResourceId('Microsoft.Resources/resourceGroups', resourceGroup().name)
    policyDefinitionId: tenantResourceId('Microsoft.Authorization/policyDefinitions', policyDefinitionID)
  }
}
```

## Next steps

* To get values from the current deployment, see [Deployment value functions](./bicep-functions-deployment.md).
* To iterate a specified number of times when creating a type of resource, see [Iterative loops in Bicep](loops.md).
