---
title: Template functions - resources
description: Describes the functions to use in an Azure Resource Manager template (ARM template) to retrieve values about resources.
ms.topic: conceptual
ms.date: 08/09/2021
ms.custom: devx-track-azurepowershell
---

# Resource functions for ARM templates

Resource Manager provides the following functions for getting resource values in your Azure Resource Manager template (ARM template):

* [extensionResourceId](#extensionresourceid)
* [list*](#list)
* [pickZones](#pickzones)
* [reference](#reference)
* [resourceGroup](#resourcegroup)
* [resourceId](#resourceid)
* [subscription](#subscription)
* [subscriptionResourceId](#subscriptionresourceid)
* [tenantResourceId](#tenantresourceid)

To get values from parameters, variables, or the current deployment, see [Deployment value functions](template-functions-deployment.md).

## extensionResourceId

`extensionResourceId(resourceId, resourceType, resourceName1, [resourceName2], ...)`

Returns the resource ID for an [extension resource](../management/extension-resource-types.md), which is a resource type that is applied to another resource to add to its capabilities.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| resourceId |Yes |string |The resource ID for the resource that the extension resource is applied to. |
| resourceType |Yes |string |Type of resource including resource provider namespace. |
| resourceName1 |Yes |string |Name of resource. |
| resourceName2 |No |string |Next resource name segment, if needed. |

Continue adding resource names as parameters when the resource type includes more segments.

### Return value

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

### extensionResourceId example

The following example returns the resource ID for a resource group lock.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "lockName": {
      "type": "string"
    }
  },
  "variables": {},
  "resources": [],
  "outputs": {
    "lockResourceId": {
      "type": "string",
      "value": "[extensionResourceId(resourceGroup().Id , 'Microsoft.Authorization/locks', parameters('lockName'))]"
    }
  }
}
```

A custom policy definition deployed to a management group is implemented as an extension resource. To create and assign a policy, deploy the following template to a management group.

:::code language="json" source="~/quickstart-templates/managementgroup-deployments/mg-policy/azuredeploy.json":::

Built-in policy definitions are tenant level resources. For an example of deploying a built-in policy definition, see [tenantResourceId](#tenantresourceid).

<a id="listkeys"></a>
<a id="list"></a>

## list*

`list{Value}(resourceName or resourceIdentifier, apiVersion, functionValues)`

The syntax for this function varies by name of the list operations. Each implementation returns values for the resource type that supports a list operation. The operation name must start with `list` and may have a suffix. Some common usages are `list`, `listKeys`, `listKeyValue`, and `listSecrets`.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| resourceName or resourceIdentifier |Yes |string |Unique identifier for the resource. |
| apiVersion |Yes |string |API version of resource runtime state. Typically, in the format, **yyyy-mm-dd**. |
| functionValues |No |object | An object that has values for the function. Only provide this object for functions that support receiving an object with parameter values, such as **listAccountSas** on a storage account. An example of passing function values is shown in this article. |

### Valid uses

The list functions can be used in the properties of a resource definition. Don't use a list function that exposes sensitive information in the outputs section of a template. Output values are stored in the deployment history and could be retrieved by a malicious user.

When used with [property iteration](copy-properties.md), you can use the list functions for `input` because the expression is assigned to the resource property. You can't use them with `count` because the count must be determined before the list function is resolved.

### Implementations

The possible uses of list* are shown in the following table.

| Resource type | Function name |
| ------------- | ------------- |
| Microsoft.Addons/supportProviders | listsupportplaninfo |
| Microsoft.AnalysisServices/servers | [listGatewayStatus](/rest/api/analysisservices/servers/listgatewaystatus) |
| Microsoft.ApiManagement/service/authorizationServers | [listSecrets](/rest/api/apimanagement/2020-06-01-preview/authorization-server/list-secrets) |
| Microsoft.ApiManagement/service/gateways | [listKeys](/rest/api/apimanagement/2020-06-01-preview/gateway/list-keys) |
| Microsoft.ApiManagement/service/identityProviders | [listSecrets](/rest/api/apimanagement/2020-06-01-preview/identity-provider/list-secrets) |
| Microsoft.ApiManagement/service/namedValues | [listValue](/rest/api/apimanagement/2020-06-01-preview/named-value/list-value) |
| Microsoft.ApiManagement/service/openidConnectProviders | [listSecrets](/rest/api/apimanagement/2020-06-01-preview/openid-connect-provider/list-secrets) |
| Microsoft.ApiManagement/service/subscriptions | [listSecrets](/rest/api/apimanagement/2020-06-01-preview/subscription/list-secrets) |
| Microsoft.AppConfiguration/configurationStores | [ListKeys](/rest/api/appconfiguration/configurationstores/listkeys) |
| Microsoft.AppPlatform/Spring | [listTestKeys](/rest/api/azurespringcloud/services/listtestkeys) |
| Microsoft.Automation/automationAccounts | [listKeys](/rest/api/automation/keys/listbyautomationaccount) |
| Microsoft.Batch/batchAccounts | [listkeys](/rest/api/batchmanagement/batchaccount/getkeys) |
| Microsoft.BatchAI/workspaces/experiments/jobs | listoutputfiles |
| Microsoft.Blockchain/blockchainMembers | [listApiKeys](/rest/api/blockchain/2019-06-01-preview/blockchainmembers/listapikeys) |
| Microsoft.Blockchain/blockchainMembers/transactionNodes | [listApiKeys](/rest/api/blockchain/2019-06-01-preview/transactionnodes/listapikeys) |
| Microsoft.BotService/botServices/channels | [listChannelWithKeys](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/botservice/resource-manager/Microsoft.BotService/stable/2020-06-02/botservice.json#L553) |
| Microsoft.Cache/redis | [listKeys](/rest/api/redis/redis/listkeys) |
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
| Microsoft.DocumentDB/databaseAccounts | [listConnectionStrings](/rest/api/cosmos-db-resource-provider/2021-04-15/database-accounts/list-connection-strings) |
| Microsoft.DocumentDB/databaseAccounts | [listKeys](/rest/api/cosmos-db-resource-provider/2021-04-15/database-accounts/list-keys) |
| Microsoft.DocumentDB/databaseAccounts/notebookWorkspaces | [listConnectionInfo](/rest/api/cosmos-db-resource-provider/2021-04-15/notebook-workspaces/list-connection-info) |
| Microsoft.DomainRegistration | [listDomainRecommendations](/rest/api/appservice/domains/listrecommendations) |
| Microsoft.DomainRegistration/topLevelDomains | [listAgreements](/rest/api/appservice/topleveldomains/listagreements) |
| Microsoft.EventGrid/domains | [listKeys](/rest/api/eventgrid/version2020-06-01/domains/listsharedaccesskeys) |
| Microsoft.EventGrid/topics | [listKeys](/rest/api/eventgrid/version2020-06-01/topics/listsharedaccesskeys) |
| Microsoft.EventHub/namespaces/authorizationRules | [listkeys](/rest/api/eventhub) |
| Microsoft.EventHub/namespaces/disasterRecoveryConfigs/authorizationRules | [listkeys](/rest/api/eventhub) |
| Microsoft.EventHub/namespaces/eventhubs/authorizationRules | [listkeys](/rest/api/eventhub) |
| Microsoft.ImportExport/jobs | [listBitLockerKeys](/rest/api/storageimportexport/bitlockerkeys/list) |
| Microsoft.Kusto/Clusters/Databases | [ListPrincipals](/rest/api/azurerekusto/databases/listprincipals) |
| Microsoft.LabServices/users | [ListEnvironments](/rest/api/labservices/globalusers/listenvironments) |
| Microsoft.LabServices/users | [ListLabs](/rest/api/labservices/globalusers/listlabs) |
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
| Microsoft.Relay/namespaces/authorizationRules | [listkeys](/rest/api/relay/namespaces/listkeys) |
| Microsoft.Relay/namespaces/disasterRecoveryConfigs/authorizationRules | listkeys |
| Microsoft.Relay/namespaces/HybridConnections/authorizationRules | [listkeys](/rest/api/relay/hybridconnections/listkeys) |
| Microsoft.Relay/namespaces/WcfRelays/authorizationRules | [listkeys](/rest/api/relay/wcfrelays/listkeys) |
| Microsoft.Search/searchServices | [listAdminKeys](/rest/api/searchmanagement/2021-04-01-preview/admin-keys/get) |
| Microsoft.Search/searchServices | [listQueryKeys](/rest/api/searchmanagement/2021-04-01-preview/query-keys/list-by-search-service) |
| Microsoft.ServiceBus/namespaces/authorizationRules | [listkeys](/rest/api/servicebus/stable/namespaces-authorization-rules/list-keys) |
| Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/authorizationRules | [listkeys](/rest/api/servicebus/stable/disasterrecoveryconfigs/listkeys) |
| Microsoft.ServiceBus/namespaces/queues/authorizationRules | [listkeys](/rest/api/servicebus/stable/queues-authorization-rules/list-keys) |
| Microsoft.ServiceBus/namespaces/topics/authorizationRules | [listkeys](/rest/api/servicebus/stable/topics%20%E2%80%93%20authorization%20rules/list-keys) |
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
| microsoft.web/apimanagementaccounts/apis/connections | `listSecrets` |
| microsoft.web/sites/backups | [list](/rest/api/appservice/webapps/listbackups) |
| Microsoft.Web/sites/config | [list](/rest/api/appservice/webapps/listconfigurations) |
| microsoft.web/sites/functions | [listkeys](/rest/api/appservice/webapps/listfunctionkeys)
| microsoft.web/sites/functions | [listSecrets](/rest/api/appservice/webapps/listfunctionsecrets) |
| microsoft.web/sites/hybridconnectionnamespaces/relays | [listkeys](/rest/api/appservice/appserviceplans/listhybridconnectionkeys) |
| microsoft.web/sites | [listsyncfunctiontriggerstatus](/rest/api/appservice/webapps/listsyncfunctiontriggers) |
| microsoft.web/sites/slots/functions | [listSecrets](/rest/api/appservice/webapps/listfunctionsecretsslot) |
| microsoft.web/sites/slots/backups | [list](/rest/api/appservice/webapps/listbackupsslot) |
| Microsoft.Web/sites/slots/config | [list](/rest/api/appservice/webapps/listconfigurationsslot) |
| microsoft.web/sites/slots/functions | [listSecrets](/rest/api/appservice/webapps/listfunctionsecretsslot) |

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

### Return value

The returned object varies by the list function you use. For example, the listKeys for a storage account returns the following format:

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

Other list functions have different return formats. To see the format of a function, include it in the outputs section as shown in the example template.

### Remarks

Specify the resource by using either the resource name or the [resourceId function](#resourceid). When using a list function in the same template that deploys the referenced resource, use the resource name.

If you use a `list` function in a resource that is conditionally deployed, the function is evaluated even if the resource isn't deployed. You get an error if the `list` function refers to a resource that doesn't exist. Use the `if` function to make sure the function is only evaluated when the resource is being deployed. See the [if function](template-functions-logical.md#if) for a sample template that uses if and list with a conditionally deployed resource.

### List example

The following example uses listKeys when setting a value for [deployment scripts](deployment-script-template.md).

```json
"storageAccountSettings": {
  "storageAccountName": "[variables('storageAccountName')]",
  "storageAccountKey": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName')), '2019-06-01').keys[0].value]"
}
```

The next example shows a list function that takes a parameter. In this case, the function is **listAccountSas**. Pass an object for the expiry time. The expiry time must be in the future.

```json
"parameters": {
  "accountSasProperties": {
    "type": "object",
    "defaultValue": {
      "signedServices": "b",
      "signedPermission": "r",
      "signedExpiry": "2020-08-20T11:00:00Z",
      "signedResourceTypes": "s"
    }
  }
},
...
"sasToken": "[listAccountSas(parameters('storagename'), '2018-02-01', parameters('accountSasProperties')).accountSasToken]"
```

## pickZones

`pickZones(providerNamespace, resourceType, location, [numberOfZones], [offset])`

Determines whether a resource type supports zones for the specified location or region.  This function only supports zonal resources, zone redundant services will return an empty array.  For more information see [Azure Services that support Availability Zones](../../availability-zones/az-region).  To use the pickZones function with zone redundant services, see the examples below.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| providerNamespace | Yes | string | The resource provider namespace for the resource type to check for zone support. |
| resourceType | Yes | string | The resource type to check for zone support. |
| location | Yes | string | The region to check for zone support. |
| numberOfZones | No | integer | The number of logical zones to return. The default is 1. The number must be a positive integer from 1 to 3.  Use 1 for single-zoned resources. For multi-zoned resources, the value must be less than or equal to the number of supported zones. |
| offset | No | integer | The offset from the starting logical zone. The function returns an error if offset plus numberOfZones exceeds the number of supported zones. |

### Return value

An array with the supported zones. When using the default values for offset and numberOfZones, a resource type and region that supports zones returns the following array:

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

When the resource type or region doesn't support zones an empty array is returned.  An empty array is also returned for zone redundant services.

```json
[
]
```

### Remarks

There are different categories for Azure Availability Zones, zonal and zone-redundant.  The pickZones function can be used to return an availability zone number or numbers for a zonal resource.  For zone redundant services (ZRS), the function will return an empty array.  Zonal resources can typically be identified by the use of a `zones` property on the resource header.  Zone redundant services have different ways for identifying and using availability zones per resource, use the documentation for a specific service to determine the category of support for availability zones.  For more information see [Azure Services that support Availability Zones](../../availability-zones/az-region).

To determine if a given Azure region or location supports availability zones, simply call the pickZones() function with a zonal resource type, for example `Microsoft.Storage/storageAccounts`.  If the response is non-empty, the region supports availability zones.

### pickZones example

The following template shows three results for using the pickZones function.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {},
  "functions": [],
  "variables": {},
  "resources": [],
  "outputs": {
    "supported": {
      "type": "array",
      "value": "[pickZones('Microsoft.Compute', 'virtualMachines', 'westus2')]"
    },
    "notSupportedRegion": {
      "type": "array",
      "value": "[pickZones('Microsoft.Compute', 'virtualMachines', 'northcentralus')]"
    },
    "notSupportedType": {
      "type": "array",
      "value": "[pickZones('Microsoft.Cdn', 'profiles', 'westus2')]"
    }
  }
}
```

The output from the preceding examples returns three arrays.

| Name | Type | Value |
| ---- | ---- | ----- |
| supported | array | [ "1" ] |
| notSupportedRegion | array | [] |
| notSupportedType | array | [] |

You can use the response from pickZones to determine whether to provide null for zones or assign virtual machines to different zones. The following example sets a value for the zone based on the availability of zones.

```json
"zones": {
  "value": "[if(not(empty(pickZones('Microsoft.Compute', 'virtualMachines', 'westus2'))), string(add(mod(copyIndex(),3),1)), json('null'))]"
},
```

The following example shows how to use the pickZones function to enable zone redundancy for Cosmos DB.

```json
"resources": [
  {
    "type": "Microsoft.DocumentDB/databaseAccounts",
    "apiVersion": "2021-04-15",
    "name": "[variables('accountName_var')]",
    "location": "[parameters('location')]",
    "kind": "GlobalDocumentDB",
    "properties": {
      "consistencyPolicy": "[variables('consistencyPolicy')[parameters('defaultConsistencyLevel')]]",
      "locations": [
      {
        "locationName": "[parameters('primaryRegion')]",
        "failoverPriority": 0,
        "isZoneRedundant": "[if(empty(pickZones('Microsoft.Storage', 'storageAccounts', parameters('primaryRegion'))), bool('false'), bool('true'))]",
      },
      {
        "locationName": "[parameters('secondaryRegion')]",
        "failoverPriority": 1,
        "isZoneRedundant": "[if(empty(pickZones('Microsoft.Storage', 'storageAccounts', parameters('secondaryRegion'))), bool('false'), bool('true'))]",
      }
    ],
      "databaseAccountOfferType": "Standard",
      "enableAutomaticFailover": "[parameters('automaticFailover')]"
    }
  }
]
```

## reference

`reference(resourceName or resourceIdentifier, [apiVersion], ['Full'])`

Returns an object representing a resource's runtime state.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| resourceName or resourceIdentifier |Yes |string |Name or unique identifier of a resource. When referencing a resource in the current template, provide only the resource name as a parameter. When referencing a previously deployed resource or when the name of the resource is ambiguous, provide the resource ID. |
| apiVersion |No |string |API version of the specified resource. **This parameter is required when the resource isn't provisioned within same template.** Typically, in the format, **yyyy-mm-dd**. For valid API versions for your resource, see [template reference](/azure/templates/). |
| 'Full' |No |string |Value that specifies whether to return the full resource object. If you don't specify `'Full'`, only the properties object of the resource is returned. The full object includes values such as the resource ID and location. |

### Return value

Every resource type returns different properties for the reference function. The function doesn't return a single, predefined format. Also, the returned value differs based on the value of the `'Full'` argument. To see the properties for a resource type, return the object in the outputs section as shown in the example.

### Remarks

The reference function retrieves the runtime state of either a previously deployed resource or a resource deployed in the current template. This article shows examples for both scenarios.

Typically, you use the `reference` function to return a particular value from an object, such as the blob endpoint URI or fully qualified domain name.

```json
"outputs": {
  "BlobUri": {
    "type": "string",
    "value": "[reference(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))).primaryEndpoints.blob]"
  },
  "FQDN": {
    "type": "string",
    "value": "[reference(resourceId('Microsoft.Network/publicIPAddresses', parameters('ipAddressName'))).dnsSettings.fqdn]"
  }
}
```

Use `'Full'` when you need resource values that aren't part of the properties schema. For example, to set key vault access policies, get the identity properties for a virtual machine.

```json
{
  "type": "Microsoft.KeyVault/vaults",
  "apiVersion": "2019-09-01",
  "name": "vaultName",
  "properties": {
    "tenantId": "[subscription().tenantId]",
    "accessPolicies": [
      {
        "tenantId": "[reference(resourceId('Microsoft.Compute/virtualMachines', variables('vmName')), '2019-03-01', 'Full').identity.tenantId]",
        "objectId": "[reference(resourceId('Microsoft.Compute/virtualMachines', variables('vmName')), '2019-03-01', 'Full').identity.principalId]",
        "permissions": {
          "keys": [
            "all"
          ],
          "secrets": [
            "all"
          ]
        }
      }
    ],
    ...
```

### Valid uses

The reference function can only be used in the properties of a resource definition and the outputs section of a template or deployment. When used with [property iteration](copy-properties.md), you can use the reference function for `input` because the expression is assigned to the resource property.

You can't use the reference function to set the value of the `count` property in a copy loop. You can use to set other properties in the loop. Reference is blocked for the count property because that property must be determined before the reference function is resolved.

To use the `reference` function or any `list*` function in the outputs section of a nested template, you must set the `expressionEvaluationOptions` to use [inner scope](linked-templates.md#expression-evaluation-scope-in-nested-templates) evaluation or use a linked instead of a nested template.

If you use the `reference` function in a resource that is conditionally deployed, the function is evaluated even if the resource isn't deployed.  You get an error if the `reference` function refers to a resource that doesn't exist. Use the `if` function to make sure the function is only evaluated when the resource is being deployed. See the [if function](template-functions-logical.md#if) for a sample template that uses if and reference with a conditionally deployed resource.

### Implicit dependency

By using the reference function, you implicitly declare that one resource depends on another resource if the referenced resource is provisioned within same template and you refer to the resource by its name (not resource ID). You don't need to also use the dependsOn property. The function isn't evaluated until the referenced resource has completed deployment.

### Resource name or identifier

When referencing a resource that is deployed in the same template, provide the name of the resource.

```json
"value": "[reference(parameters('storageAccountName'))]"
```

When referencing a resource that isn't deployed in the same template, provide the resource ID and `apiVersion`.

```json
"value": "[reference(resourceId(parameters('storageResourceGroup'), 'Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2018-07-01')]"
```

To avoid ambiguity about which resource you're referencing, you can provide a fully qualified resource identifier.

```json
"value": "[reference(resourceId('Microsoft.Network/publicIPAddresses', parameters('ipAddressName')))]"
```

When constructing a fully qualified reference to a resource, the order to combine segments from the type and name isn't simply a concatenation of the two. Instead, after the namespace, use a sequence of *type/name* pairs from least specific to most specific:

`{resource-provider-namespace}/{parent-resource-type}/{parent-resource-name}[/{child-resource-type}/{child-resource-name}]`

For example:

`Microsoft.Compute/virtualMachines/myVM/extensions/myExt` is correct
`Microsoft.Compute/virtualMachines/extensions/myVM/myExt` is not correct

To simplify the creation of any resource ID, use the `resourceId()` functions described in this document instead of the `concat()` function.

### Get managed identity

[Managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md) are [extension resource types](../management/extension-resource-types.md) that are created implicitly for some resources. Because the managed identity isn't explicitly defined in the template, you must reference the resource that the identity is applied to. Use `Full` to get all of the properties, including the implicitly created identity.

The pattern is:

`"[reference(resourceId(<resource-provider-namespace>, <resource-name>, <API-version>, 'Full').Identity.propertyName]"`

For example, to get the principal ID for a managed identity that is applied to a virtual machine, use:

```json
"[reference(resourceId('Microsoft.Compute/virtualMachines', variables('vmName')),'2019-12-01', 'Full').identity.principalId]",
```

Or, to get the tenant ID for a managed identity that is applied to a virtual machine scale set, use:

```json
"[reference(resourceId('Microsoft.Compute/virtualMachineScaleSets',  variables('vmNodeType0Name')), 2019-12-01, 'Full').Identity.tenantId]"
```

### Reference example

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/referencewithstorage.json) deploys a resource, and references that resource.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountName": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2016-12-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[resourceGroup().location]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "tags": {},
      "properties": {
      }
    }
  ],
  "outputs": {
      "referenceOutput": {
        "type": "object",
        "value": "[reference(parameters('storageAccountName'))]"
      },
      "fullReferenceOutput": {
        "type": "object",
        "value": "[reference(parameters('storageAccountName'), '2016-12-01', 'Full')]"
      }
    }
}
```

The preceding example returns the two objects. The properties object is in the following format:

```json
{
   "creationTime": "2017-10-09T18:55:40.5863736Z",
   "primaryEndpoints": {
     "blob": "https://examplestorage.blob.core.windows.net/",
     "file": "https://examplestorage.file.core.windows.net/",
     "queue": "https://examplestorage.queue.core.windows.net/",
     "table": "https://examplestorage.table.core.windows.net/"
   },
   "primaryLocation": "southcentralus",
   "provisioningState": "Succeeded",
   "statusOfPrimary": "available",
   "supportsHttpsTrafficOnly": false
}
```

The full object is in the following format:

```json
{
  "apiVersion":"2016-12-01",
  "location":"southcentralus",
  "sku": {
    "name":"Standard_LRS",
    "tier":"Standard"
  },
  "tags":{},
  "kind":"Storage",
  "properties": {
    "creationTime":"2017-10-09T18:55:40.5863736Z",
    "primaryEndpoints": {
      "blob":"https://examplestorage.blob.core.windows.net/",
      "file":"https://examplestorage.file.core.windows.net/",
      "queue":"https://examplestorage.queue.core.windows.net/",
      "table":"https://examplestorage.table.core.windows.net/"
    },
    "primaryLocation":"southcentralus",
    "provisioningState":"Succeeded",
    "statusOfPrimary":"available",
    "supportsHttpsTrafficOnly":false
  },
  "subscriptionId":"<subscription-id>",
  "resourceGroupName":"functionexamplegroup",
  "resourceId":"Microsoft.Storage/storageAccounts/examplestorage",
  "referenceApiVersion":"2016-12-01",
  "condition":true,
  "isConditionTrue":true,
  "isTemplateResource":false,
  "isAction":false,
  "provisioningOperation":"Read"
}
```

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/reference.json) references a storage account that isn't deployed in this template. The storage account already exists within the same subscription.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageResourceGroup": {
      "type": "string"
    },
    "storageAccountName": {
      "type": "string"
    }
  },
  "resources": [],
  "outputs": {
    "ExistingStorage": {
      "type": "object",
      "value": "[reference(resourceId(parameters('storageResourceGroup'), 'Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2018-07-01')]"
    }
  }
}
```

## resourceGroup

`resourceGroup()`

Returns an object that represents the current resource group.

### Return value

The returned object is in the following format:

```json
{
  "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}",
  "name": "{resourceGroupName}",
  "type":"Microsoft.Resources/resourceGroups",
  "location": "{resourceGroupLocation}",
  "managedBy": "{identifier-of-managing-resource}",
  "tags": {
  },
  "properties": {
    "provisioningState": "{status}"
  }
}
```

The **managedBy** property is returned only for resource groups that contain resources that are managed by another service. For Managed Applications, Databricks, and AKS, the value of the property is the resource ID of the managing resource.

### Remarks

The `resourceGroup()` function can't be used in a template that is [deployed at the subscription level](deploy-to-subscription.md). It can only be used in templates that are deployed to a resource group. You can use the `resourceGroup()` function in a [linked or nested template (with inner scope)](linked-templates.md) that targets a resource group, even when the parent template is deployed to the subscription. In that scenario, the linked or nested template is deployed at the resource group level. For more information about targeting a resource group in a subscription level deployment, see [Deploy Azure resources to more than one subscription or resource group](./deploy-to-resource-group.md).

A common use of the resourceGroup function is to create resources in the same location as the resource group. The following example uses the resource group location for a default parameter value.

```json
"parameters": {
  "location": {
    "type": "string",
    "defaultValue": "[resourceGroup().location]"
  }
}
```

You can also use the `resourceGroup` function to apply tags from the resource group to a resource. For more information, see [Apply tags from resource group](../management/tag-resources.md#apply-tags-from-resource-group).

When using nested templates to deploy to multiple resource groups, you can specify the scope for evaluating the `resourceGroup` function. For more information, see [Deploy Azure resources to more than one subscription or resource group](./deploy-to-resource-group.md).

### Resource group example

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/resourcegroup.json) returns the properties of the resource group.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [],
  "outputs": {
    "resourceGroupOutput": {
      "type" : "object",
      "value": "[resourceGroup()]"
    }
  }
}
```

The preceding example returns an object in the following format:

```json
{
  "id": "/subscriptions/{subscription-id}/resourceGroups/examplegroup",
  "name": "examplegroup",
  "type":"Microsoft.Resources/resourceGroups",
  "location": "southcentralus",
  "properties": {
    "provisioningState": "Succeeded"
  }
}
```

## resourceId

`resourceId([subscriptionId], [resourceGroupName], resourceType, resourceName1, [resourceName2], ...)`

Returns the unique identifier of a resource. You use this function when the resource name is ambiguous or not provisioned within the same template. The format of the returned identifier varies based on whether the deployment happens at the scope of a resource group, subscription, management group, or tenant.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| subscriptionId |No |string (In GUID format) |Default value is the current subscription. Specify this value when you need to retrieve a resource in another subscription. Only provide this value when deploying at the scope of a resource group or subscription. |
| resourceGroupName |No |string |Default value is current resource group. Specify this value when you need to retrieve a resource in another resource group. Only provide this value when deploying at the scope of a resource group. |
| resourceType |Yes |string |Type of resource including resource provider namespace. |
| resourceName1 |Yes |string |Name of resource. |
| resourceName2 |No |string |Next resource name segment, if needed. |

Continue adding resource names as parameters when the resource type includes more segments.

### Return value

When the template is deployed at the scope of a resource group, the resource ID is returned in the following format:

```json
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}
```

You can use the resourceId function for other deployment scopes, but the format of the ID changes.

If you use resourceId while deploying to a subscription, the resource ID is returned in the following format:

```json
/subscriptions/{subscriptionId}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}
```

If you use resourceId while deploying to a management group or tenant, the resource ID is returned in the following format:

```json
/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}
```

To avoid confusion, we recommend that you don't use `resourceId` when working with resources deployed to the subscription, management group, or tenant. Instead, use the ID function that is designed for the scope.

For [subscription-level resources](deploy-to-subscription.md), use the [subscriptionResourceId](#subscriptionresourceid) function.

For [management group-level resources](deploy-to-management-group.md), use the [extensionResourceId](#extensionresourceid) function to reference a resource that is implemented as an extension of a management group. For example, custom policy definitions that are deployed to a management group are extensions of the management group. Use the [tenantResourceId](#tenantresourceid) function to reference resources that are deployed to the tenant but available in your management group. For example, built-in policy definitions are implemented as tenant level resources.

For [tenant-level resources](deploy-to-tenant.md), use the [tenantResourceId](#tenantresourceid) function. Use tenantResourceId for built-in policy definitions because they are implemented at the tenant level.

### Remarks

The number of parameters you provide varies based on whether the resource is a parent or child resource, and whether the resource is in the same subscription or resource group.

To get the resource ID for a parent resource in the same subscription and resource group, provide the type and name of the resource.

```json
"[resourceId('Microsoft.ServiceBus/namespaces', 'namespace1')]"
```

To get the resource ID for a child resource, pay attention to the number of segments in the resource type. Provide a resource name for each segment of the resource type. The name of the segment corresponds to the resource that exists for that part of the hierarchy.

```json
"[resourceId('Microsoft.ServiceBus/namespaces/queues/authorizationRules', 'namespace1', 'queue1', 'auth1')]"
```

To get the resource ID for a resource in the same subscription but different resource group, provide the resource group name.

```json
"[resourceId('otherResourceGroup', 'Microsoft.Storage/storageAccounts', 'examplestorage')]"
```

To get the resource ID for a resource in a different subscription and resource group, provide the subscription ID and resource group name.

```json
"[resourceId('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'otherResourceGroup', 'Microsoft.Storage/storageAccounts','examplestorage')]"
```

Often, you need to use this function when using a storage account or virtual network in an alternate resource group. The following example shows how a resource from an external resource group can easily be used:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string"
    },
    "virtualNetworkName": {
      "type": "string"
    },
    "virtualNetworkResourceGroup": {
      "type": "string"
    },
    "subnet1Name": {
      "type": "string"
    },
    "nicName": {
      "type": "string"
    }
  },
  "variables": {
    "subnet1Ref": "[resourceId(parameters('virtualNetworkResourceGroup'), 'Microsoft.Network/virtualNetworks/subnets', parameters('virtualNetworkName'), parameters('subnet1Name'))]"
  },
  "resources": [
    {
      "type": "Microsoft.Network/networkInterfaces",
      "apiVersion": "2015-05-01-preview",
      "name": "[parameters('nicName')]",
      "location": "[parameters('location')]",
      "properties": {
        "ipConfigurations": [
          {
            "name": "ipconfig1",
            "properties": {
              "privateIPAllocationMethod": "Dynamic",
              "subnet": {
                "id": "[variables('subnet1Ref')]"
              }
            }
          }
        ]
      }
    }
  ]
}
```

### Resource ID example

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/resourceid.json) returns the resource ID for a storage account in the resource group:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [],
  "outputs": {
    "sameRGOutput": {
      "type": "string",
      "value": "[resourceId('Microsoft.Storage/storageAccounts','examplestorage')]"
    },
    "differentRGOutput": {
      "type": "string",
      "value": "[resourceId('otherResourceGroup', 'Microsoft.Storage/storageAccounts','examplestorage')]"
    },
    "differentSubOutput": {
      "type": "string",
      "value": "[resourceId('11111111-1111-1111-1111-111111111111', 'otherResourceGroup', 'Microsoft.Storage/storageAccounts','examplestorage')]"
    },
    "nestedResourceOutput": {
      "type": "string",
      "value": "[resourceId('Microsoft.SQL/servers/databases', 'serverName', 'databaseName')]"
    }
  }
}
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| sameRGOutput | String | /subscriptions/{current-sub-id}/resourceGroups/examplegroup/providers/Microsoft.Storage/storageAccounts/examplestorage |
| differentRGOutput | String | /subscriptions/{current-sub-id}/resourceGroups/otherResourceGroup/providers/Microsoft.Storage/storageAccounts/examplestorage |
| differentSubOutput | String | /subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/otherResourceGroup/providers/Microsoft.Storage/storageAccounts/examplestorage |
| nestedResourceOutput | String | /subscriptions/{current-sub-id}/resourceGroups/examplegroup/providers/Microsoft.SQL/servers/serverName/databases/databaseName |

## subscription

`subscription()`

Returns details about the subscription for the current deployment.

### Return value

The function returns the following format:

```json
{
  "id": "/subscriptions/{subscription-id}",
  "subscriptionId": "{subscription-id}",
  "tenantId": "{tenant-id}",
  "displayName": "{name-of-subscription}"
}
```

### Remarks

When using nested templates to deploy to multiple subscriptions, you can specify the scope for evaluating the subscription function. For more information, see [Deploy Azure resources to more than one subscription or resource group](./deploy-to-resource-group.md).

### Subscription example

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/subscription.json) shows the subscription function called in the outputs section.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [],
  "outputs": {
    "subscriptionOutput": {
      "value": "[subscription()]",
      "type" : "object"
    }
  }
}
```

## subscriptionResourceId

`subscriptionResourceId([subscriptionId], resourceType, resourceName1, [resourceName2], ...)`

Returns the unique identifier for a resource deployed at the subscription level.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| subscriptionId |No |string (in GUID format) |Default value is the current subscription. Specify this value when you need to retrieve a resource in another subscription. |
| resourceType |Yes |string |Type of resource including resource provider namespace. |
| resourceName1 |Yes |string |Name of resource. |
| resourceName2 |No |string |Next resource name segment, if needed. |

Continue adding resource names as parameters when the resource type includes more segments.

### Return value

The identifier is returned in the following format:

```json
/subscriptions/{subscriptionId}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}
```

### Remarks

You use this function to get the resource ID for resources that are [deployed to the subscription](deploy-to-subscription.md) rather than a resource group. The returned ID differs from the value returned by the [resourceId](#resourceid) function by not including a resource group value.

### subscriptionResourceID example

The following template assigns a built-in role. You can deploy it to either a resource group or subscription. It uses the subscriptionResourceId function to get the resource ID for built-in roles.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "principalId": {
      "type": "string",
      "metadata": {
        "description": "The principal to assign the role to"
      }
    },
    "builtInRoleType": {
      "type": "string",
      "allowedValues": [
        "Owner",
        "Contributor",
        "Reader"
      ],
      "metadata": {
        "description": "Built-in role to assign"
      }
    },
    "roleNameGuid": {
      "type": "string",
      "defaultValue": "[newGuid()]",
      "metadata": {
        "description": "A new GUID used to identify the role assignment"
      }
    }
  },
  "variables": {
    "Owner": "[subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '8e3af657-a8ff-443c-a75c-2fe8c4bcb635')]",
    "Contributor": "[subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'b24988ac-6180-42a0-ab88-20f7382dd24c')]",
    "Reader": "[subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'acdd72a7-3385-48ef-bd42-f606fba81ae7')]"
  },
  "resources": [
    {
      "type": "Microsoft.Authorization/roleAssignments",
      "apiVersion": "2018-09-01-preview",
      "name": "[parameters('roleNameGuid')]",
      "properties": {
        "roleDefinitionId": "[variables(parameters('builtInRoleType'))]",
        "principalId": "[parameters('principalId')]"
      }
    }
  ]
}
```

## tenantResourceId

`tenantResourceId(resourceType, resourceName1, [resourceName2], ...)`

Returns the unique identifier for a resource deployed at the tenant level.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| resourceType |Yes |string |Type of resource including resource provider namespace. |
| resourceName1 |Yes |string |Name of resource. |
| resourceName2 |No |string |Next resource name segment, if needed. |

Continue adding resource names as parameters when the resource type includes more segments.

### Return value

The identifier is returned in the following format:

```json
/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}
```

### Remarks

You use this function to get the resource ID for a resource that is deployed to the tenant. The returned ID differs from the values returned by other resource ID functions by not including resource group or subscription values.

### tenantResourceId example

Built-in policy definitions are tenant level resources. To deploy a policy assignment that references a built-in policy definition, use the tenantResourceId function.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "policyDefinitionID": {
      "type": "string",
      "defaultValue": "0a914e76-4921-4c19-b460-a2d36003525a",
      "metadata": {
        "description": "Specifies the ID of the policy definition or policy set definition being assigned."
      }
    },
    "policyAssignmentName": {
      "type": "string",
      "defaultValue": "[guid(parameters('policyDefinitionID'), resourceGroup().name)]",
      "metadata": {
        "description": "Specifies the name of the policy assignment, can be used defined or an idempotent name as the defaultValue provides."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Authorization/policyAssignments",
      "name": "[parameters('policyAssignmentName')]",
      "apiVersion": "2019-09-01",
      "properties": {
        "scope": "[subscriptionResourceId('Microsoft.Resources/resourceGroups', resourceGroup().name)]",
        "policyDefinitionId": "[tenantResourceId('Microsoft.Authorization/policyDefinitions', parameters('policyDefinitionID'))]"
      }
    }
  ]
}
```

## Next steps

* For a description of the sections in an ARM template, see [Understand the structure and syntax of ARM templates](./syntax.md).
* To merge multiple templates, see [Using linked and nested templates when deploying Azure resources](linked-templates.md).
* To iterate a specified number of times when creating a type of resource, see [Resource iteration in ARM templates](copy-resources.md).
* To see how to deploy the template you've created, see [Deploy resources with ARM templates and Azure PowerShell](deploy-powershell.md).
