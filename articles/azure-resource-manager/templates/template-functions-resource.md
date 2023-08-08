---
title: Template functions - resources
description: Describes the functions to use in an Azure Resource Manager template (ARM template) to retrieve values about resources.
ms.topic: conceptual
ms.date: 08/02/2023
ms.custom: ignite-2022, devx-track-arm-template
---

# Resource functions for ARM templates

Resource Manager provides the following functions for getting resource values in your Azure Resource Manager template (ARM template):

* [extensionResourceId](#extensionresourceid)
* [list*](#list)
* [pickZones](#pickzones)
* [providers (deprecated)](#providers)
* [reference](#reference)
* [references](#references)
* [resourceId](#resourceid)
* [subscriptionResourceId](#subscriptionresourceid)
* [managementGroupResourceId](#managementgroupresourceid)
* [tenantResourceId](#tenantresourceid)

To get values from parameters, variables, or the current deployment, see [Deployment value functions](template-functions-deployment.md).

To get deployment scope values, see [Scope functions](template-functions-scope.md).

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [resource](../bicep/bicep-functions-resource.md) functions.

## extensionResourceId

`extensionResourceId(baseResourceId, resourceType, resourceName1, [resourceName2], ...)`

Returns the resource ID for an [extension resource](../management/extension-resource-types.md). An extension resource is a resource type that's applied to another resource to add to its capabilities.

In Bicep, use the [extensionResourceId](../bicep/bicep-functions-resource.md#extensionresourceid) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| baseResourceId |Yes |string |The resource ID for the resource that the extension resource is applied to. |
| resourceType |Yes |string |Type of the extension resource including resource provider namespace. |
| resourceName1 |Yes |string |Name of the extension resource. |
| resourceName2 |No |string |Next resource name segment, if needed. |

Continue adding resource names as parameters when the resource type includes more segments.

### Return value

The basic format of the resource ID returned by this function is:

```json
{scope}/providers/{extensionResourceProviderNamespace}/{extensionResourceType}/{extensionResourceName}
```

The scope segment varies by the base resource being extended. For example, the ID for a subscription has different segments than the ID for a resource group.

When the extension resource is applied to a **resource**, the resource ID is returned in the following format:

```json
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{baseResourceProviderNamespace}/{baseResourceType}/{baseResourceName}/providers/{extensionResourceProviderNamespace}/{extensionResourceType}/{extensionResourceName}
```

When the extension resource is applied to a **resource group**, the returned format is:

```json
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{extensionResourceProviderNamespace}/{extensionResourceType}/{extensionResourceName}
```

An example of using this function with a resource group is shown in the next section.

When the extension resource is applied to a **subscription**, the returned format is:

```json
/subscriptions/{subscriptionId}/providers/{extensionResourceProviderNamespace}/{extensionResourceType}/{extensionResourceName}
```

When the extension resource is applied to a **management group**, the returned format is:

```json
/providers/Microsoft.Management/managementGroups/{managementGroupName}/providers/{extensionResourceProviderNamespace}/{extensionResourceType}/{extensionResourceName}
```

An example of using this function with a management group is shown in the next section.

### extensionResourceId example

The following example returns the resource ID for a resource group lock.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/resource/extensionresourceid.json":::

A custom policy definition deployed to a management group is implemented as an extension resource. To create and assign a policy, deploy the following template to a management group.

:::code language="json" source="~/quickstart-templates/managementgroup-deployments/mg-policy/azuredeploy.json":::

Built-in policy definitions are tenant level resources. For an example of deploying a built-in policy definition, see [tenantResourceId](#tenantresourceid).

<a id="listkeys"></a>
<a id="list"></a>

## list*

`list{Value}(resourceName or resourceIdentifier, apiVersion, functionValues)`

The syntax for this function varies by name of the list operations. Each implementation returns values for the resource type that supports a list operation. The operation name must start with `list` and may have a suffix. Some common usages are `list`, `listKeys`, `listKeyValue`, and `listSecrets`.

In Bicep, use the [list*](../bicep/bicep-functions-resource.md#list) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| resourceName or resourceIdentifier |Yes |string |Unique identifier for the resource. |
| apiVersion |Yes |string |API version of resource runtime state. Typically, in the format, **yyyy-mm-dd**. |
| functionValues |No |object | An object that has values for the function. Only provide this object for functions that support receiving an object with parameter values, such as `listAccountSas` on a storage account. An example of passing function values is shown in this article. |

### Valid uses

The list functions can be used in the properties of a resource definition. Don't use a list function that exposes sensitive information in the outputs section of a template. Output values are stored in the deployment history and could be retrieved by a malicious user.

When used with [property iteration](copy-properties.md), you can use the list functions for `input` because the expression is assigned to the resource property. You can't use them with `count` because the count must be determined before the list function is resolved.

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
| Microsoft.Batch/batchAccounts | [listKeys](/rest/api/batchmanagement/batchaccount/getkeys) |
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
| Microsoft.Devices/iotHubs | [listKeys](/rest/api/iothub/iothubresource/listkeys) |
| Microsoft.Devices/iotHubs/iotHubKeys | [listKeys](/rest/api/iothub/iothubresource/getkeysforkeyname) |
| Microsoft.Devices/provisioningServices/keys | [listKeys](/rest/api/iot-dps/iotdpsresource/listkeysforkeyname) |
| Microsoft.Devices/provisioningServices | [listKeys](/rest/api/iot-dps/iotdpsresource/listkeys) |
| Microsoft.DevTestLab/labs | [ListVhds](/rest/api/dtl/labs/listvhds) |
| Microsoft.DevTestLab/labs/schedules | [ListApplicable](/rest/api/dtl/schedules/listapplicable) |
| Microsoft.DevTestLab/labs/users/serviceFabrics | [ListApplicableSchedules](/rest/api/dtl/servicefabrics/listapplicableschedules) |
| Microsoft.DevTestLab/labs/virtualMachines | [ListApplicableSchedules](/rest/api/dtl/virtualmachines/listapplicableschedules) |
| Microsoft.DocumentDB/databaseAccounts | [listKeys](/rest/api/cosmos-db-resource-provider/2021-11-15-preview/database-accounts/list-keys?tabs=HTTP) |
| Microsoft.DocumentDB/databaseAccounts/notebookWorkspaces | [listConnectionInfo](/rest/api/cosmos-db-resource-provider/2023-03-15-preview/notebook-workspaces/list-connection-info?tabs=HTTP) |
| Microsoft.DomainRegistration/topLevelDomains | [listAgreements](/rest/api/appservice/topleveldomains/listagreements) |
| Microsoft.EventGrid/domains | [listKeys](/rest/api/eventgrid/controlplane-version2022-06-15/domains/list-shared-access-keys) |
| Microsoft.EventGrid/topics | [listKeys](/rest/api/eventgrid/controlplane-version2022-06-15/topics/list-shared-access-keys) |
| Microsoft.EventHub/namespaces/authorizationRules | [listKeys](/rest/api/eventhub) |
| Microsoft.EventHub/namespaces/disasterRecoveryConfigs/authorizationRules | [listKeys](/rest/api/eventhub) |
| Microsoft.EventHub/namespaces/eventhubs/authorizationRules | [listKeys](/rest/api/eventhub) |
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
| Microsoft.MachineLearningServices/workspaces/computes | [listKeys](/rest/api/azureml/2023-04-01/compute/list-keys) |
| Microsoft.MachineLearningServices/workspaces/computes | [listNodes](/rest/api/azureml/2023-04-01/compute/list-nodes) |
| Microsoft.MachineLearningServices/workspaces | [listKeys](/rest/api/azureml/2023-04-01/workspaces/list-keys) |
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
| Microsoft.Relay/namespaces/authorizationRules | [listKeys](/rest/api/relay/namespaces/listkeys) |
| Microsoft.Relay/namespaces/disasterRecoveryConfigs/authorizationRules | listKeys |
| Microsoft.Relay/namespaces/HybridConnections/authorizationRules | [listKeys](/rest/api/relay/hybridconnections/listkeys) |
| Microsoft.Relay/namespaces/WcfRelays/authorizationRules | [listkeys](/rest/api/relay/wcfrelays/listkeys) |
| Microsoft.Search/searchServices | [listAdminKeys](/rest/api/searchmanagement/2021-04-01-preview/admin-keys/get) |
| Microsoft.Search/searchServices | [listQueryKeys](/rest/api/searchmanagement/2021-04-01-preview/query-keys/list-by-search-service) |
| Microsoft.ServiceBus/namespaces/authorizationRules | [listKeys](/rest/api/servicebus/controlplane-stable/namespaces-authorization-rules/list-keys) |
| Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/authorizationRules | [listKeys](/rest/api/servicebus/controlplane-stable/disaster-recovery-configs/list-keys) |
| Microsoft.ServiceBus/namespaces/queues/authorizationRules | [listKeys](/rest/api/servicebus/controlplane-stable/queues-authorization-rules/list-keys) |
| Microsoft.ServiceBus/namespaces/topics/authorizationRules | [listKeys](/rest/api/servicebus/controlplane-stable/topics%20–%20authorization%20rules/list-keys) |
| Microsoft.SignalRService/SignalR | [listKeys](/rest/api/signalr/signalr/listkeys) |
| Microsoft.Storage/storageAccounts | [listAccountSas](/rest/api/storagerp/storageaccounts/listaccountsas) |
| Microsoft.Storage/storageAccounts | [listKeys](/rest/api/storagerp/storageaccounts/listkeys) |
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
| microsoft.web/sites/functions | [listKeys](/rest/api/appservice/webapps/listfunctionkeys)
| microsoft.web/sites/functions | [listSecrets](/rest/api/appservice/webapps/listfunctionsecrets) |
| microsoft.web/sites/hybridconnectionnamespaces/relays | [listKeys](/rest/api/appservice/appserviceplans/listhybridconnectionkeys) |
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

The returned object varies by the `list` function you use. For example, the `listKeys` for a storage account returns the following format:

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

Other `list` functions have different return formats. To see the format of a function, include it in the outputs section as shown in the example template.

### Remarks

Specify the resource by using either the resource name or the [resourceId function](#resourceid). When using a `list` function in the same template that deploys the referenced resource, use the resource name.

If you use a `list` function in a resource that is conditionally deployed, the function is evaluated even if the resource isn't deployed. You get an error if the `list` function refers to a resource that doesn't exist. Use the `if` function to make sure the function is only evaluated when the resource is being deployed. See the [if function](template-functions-logical.md#if) for a sample template that uses `if` and `list` with a conditionally deployed resource.

### List example

The following example uses `listKeys` when setting a value for [deployment scripts](deployment-script-template.md).

```json
"storageAccountSettings": {
  "storageAccountName": "[variables('storageAccountName')]",
  "storageAccountKey": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName')), '2019-06-01').keys[0].value]"
}
```

The next example shows a `list` function that takes a parameter. In this case, the function is `listAccountSas`. Pass an object for the expiry time. The expiry time must be in the future.

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

Determines whether a resource type supports zones for the specified location or region. This function **only supports zonal resources**. Zone redundant services return an empty array. For more information, see [Azure Services that support Availability Zones](../../availability-zones/az-region.md).

In Bicep, use the [pickZones](../bicep/bicep-functions-resource.md#pickzones) function.

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

When the resource type or region doesn't support zones, an empty array is returned.  An empty array is also returned for zone redundant services.

```json
[
]
```

### Remarks

There are different categories for Azure Availability Zones - zonal and zone-redundant.  The `pickZones` function can be used to return an availability zone for a zonal resource.  For zone redundant services (ZRS), the function returns an empty array.  Zonal resources typically have a `zones` property at the top level of the resource definition. To determine the category of support for availability zones, see [Azure Services that support Availability Zones](../../availability-zones/az-region.md).

To determine if a given Azure region or location supports availability zones, call the `pickZones` function with a zonal resource type, such as `Microsoft.Network/publicIPAddresses`.  If the response isn't empty, the region supports availability zones.

### pickZones example

The following template shows three results for using the `pickZones` function.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/resource/pickzones.json":::

The output from the preceding examples returns three arrays.

| Name | Type | Value |
| ---- | ---- | ----- |
| supported | array | [ "1" ] |
| notSupportedRegion | array | [] |
| notSupportedType | array | [] |

You can use the response from `pickZones` to determine whether to provide null for zones or assign virtual machines to different zones. The following example sets a value for the zone based on the availability of zones.

```json
"zones": {
  "value": "[if(not(empty(pickZones('Microsoft.Compute', 'virtualMachines', 'westus2'))), string(add(mod(copyIndex(),3),1)), json('null'))]"
},
```

Azure Cosmos DB isn't a zonal resource, but you can use the `pickZones` function to determine whether to enable zone redundancy for georeplication. Pass the **Microsoft.Storage/storageAccounts** resource type to determine whether to enable zone redundancy.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/resource/pickzones-cosmosdb.json":::

## providers

**The providers function has been deprecated in ARM templates.** We no longer recommend using it. If you used this function to get an API version for the resource provider, we recommend that you provide a specific API version in your template. Using a dynamically returned API version can break your template if the properties change between versions.

In Bicep, the [providers](../bicep/bicep-functions-resource.md#providers) function is deprecated.

The [providers operation](/rest/api/resources/providers) is still available through the REST API. It can be used outside of an ARM template to get information about a resource provider.

## reference

`reference(resourceName or resourceIdentifier, [apiVersion], ['Full'])`

Returns an object representing a resource's runtime state.

Bicep provide the reference function, but in most cases, the reference function isn't required. It's recommended to use the symbolic name for the resource instead. See [reference](../bicep/bicep-functions-resource.md#reference).

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

The `reference` function can only be used in the outputs section of a template or deployment and properties object of a resource definition. It cannot be used for resource properties such as `type`, `name`, `location` and other top level properties of the resource definition. When used with [property iteration](copy-properties.md), you can use the `reference` function for `input` because the expression is assigned to the resource property.

You can't use the `reference` function to set the value of the `count` property in a copy loop. You can use to set other properties in the loop. Reference is blocked for the count property because that property must be determined before the `reference` function is resolved.

To use the `reference` function or any `list*` function in the outputs section of a nested template, you must set the `expressionEvaluationOptions` to use [inner scope](linked-templates.md#expression-evaluation-scope-in-nested-templates) evaluation or use a linked instead of a nested template.

If you use the `reference` function in a resource that is conditionally deployed, the function is evaluated even if the resource isn't deployed.  You get an error if the `reference` function refers to a resource that doesn't exist. Use the `if` function to make sure the function is only evaluated when the resource is being deployed. See the [if function](template-functions-logical.md#if) for a sample template that uses `if` and `reference` with a conditionally deployed resource.

### Implicit dependency

By using the `reference` function, you implicitly declare that one resource depends on another resource if the referenced resource is provisioned within same template and you refer to the resource by its name (not resource ID). You don't need to also use the `dependsOn` property. The function isn't evaluated until the referenced resource has completed deployment.

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

`"[reference(resourceId(<resource-provider-namespace>, <resource-name>), <API-version>, 'Full').Identity.propertyName]"`

For example, to get the principal ID for a managed identity that is applied to a virtual machine, use:

```json
"[reference(resourceId('Microsoft.Compute/virtualMachines', variables('vmName')),'2019-12-01', 'Full').identity.principalId]",
```

Or, to get the tenant ID for a managed identity that is applied to a virtual machine scale set, use:

```json
"[reference(resourceId('Microsoft.Compute/virtualMachineScaleSets',  variables('vmNodeType0Name')), 2019-12-01, 'Full').Identity.tenantId]"
```

### Reference example

The following example deploys a resource, and references that resource.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/resource/referencewithstorage.json":::

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
  "apiVersion":"2022-09-01",
  "location":"southcentralus",
  "sku": {
    "name":"Standard_LRS",
    "tier":"Standard"
  },
  "tags":{},
  "kind":"Storage",
  "properties": {
    "creationTime":"2021-10-09T18:55:40.5863736Z",
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
  "referenceApiVersion":"2021-04-01",
  "condition":true,
  "isConditionTrue":true,
  "isTemplateResource":false,
  "isAction":false,
  "provisioningOperation":"Read"
}
```

The following example template references a storage account that isn't deployed in this template. The storage account already exists within the same subscription.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/resource/reference.json":::

## references

`references(symbolic name of a resource collection, ['Full', 'Properties])`

The `references` function works similarly as [`reference`](#reference). Instead of returning an object presenting a resource's runtime state, the `references` function returns an array of objects representing a collection of resource's runtime states. This function requires ARM template language version `1.10-experimental` and with [symbolic name](../bicep/file.md#resources) enabled:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "languageVersion": "1.10-experimental",
  "contentVersion": "1.0.0.0",
  ...
}
```

In Bicep, there is no explicit `references` function. Instead, symbolic collection usage is employed directly, and during code generation, Bicep translates it to an ARM template that utilizes the ARM template `references` function. The forthcoming release of Bicep will include the translation feature that converts symbolic collections to ARM templates using the `references` function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| Symbolic name of a resource collection |Yes |string |Symbolic name of a resource collection that is defined in the current template. The `references` function does not support referencing resources external to the current template. |
| 'Full', 'Properties' |No |string |Value that specifies whether to return an array of the full resource objects. The default value is `'Properties'`. If you don't specify `'Full'`, only the properties objects of the resources are returned. The full object includes values such as the resource ID and location. |

### Return value

An array of the resource collection. Every resource type returns different properties for the `reference` function. Also, the returned value differs based on the value of the `'Full'` argument. For more information, see [reference](#reference).

The output order of `references` is always arranged in ascending order based on the copy index. Therefore, the first resource in the collection with index 0 is displayed first, followed by index 1, and so on. For instance, *[worker-0, worker-1, worker-2, ...]*.

In the preceding example, if *worker-0* and *worker-2* are deployed while *worker-1* is not due to a false condition, the output of `references` will omit the non-deployed resource and display the deployed ones, ordered by their numbers. The output of `references` will be *[worker-0, worker-2, ...]*. If all of the resources are omitted, the function returns an empty array.

### Valid uses

The `references` function can't be used within [resource copy loops](./copy-resources.md) or [Bicep for loop](../bicep/loops.md). For example, `references` is not allowed in the following scenario:

```json
{
  resources: {
    "resourceCollection": {
       "copy": { ... },
       "properties": {
         "prop": "[references(...)]"
       }
    }
  }
}
```

To use the `references` function or any `list*` function in the outputs section of a nested template, you must set the `expressionEvaluationOptions` to use [inner scope](linked-templates.md#expression-evaluation-scope-in-nested-templates) evaluation or use a linked instead of a nested template.

### Implicit dependency

By using the `references` function, you implicitly declare that one resource depends on another resource. You don't need to also use the `dependsOn` property. The function isn't evaluated until the referenced resource has completed deployment.

### Reference example

The following example deploys a resource collection, and references that resource collection.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "languageVersion": "1.10-experimental",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for all resources."
      }
    },
    "numWorkers": {
      "type": "int",
      "defaultValue": 4,
      "metadata": {
        "description": "The number of workers"
      }
    }
  },
  "resources": {
    "containerWorkers": {
      "copy": {
        "name": "containerWorkers",
        "count": "[length(range(0, parameters('numWorkers')))]"
      },
      "type": "Microsoft.ContainerInstance/containerGroups",
      "apiVersion": "2022-09-01",
      "name": "[format('worker-{0}', range(0, parameters('numWorkers'))[copyIndex()])]",
      "location": "[parameters('location')]",
      "properties": {
        "containers": [
          {
            "name": "[format('worker-container-{0}', range(0, parameters('numWorkers'))[copyIndex()])]",
            "properties": {
              "image": "mcr.microsoft.com/azuredocs/aci-helloworld",
              "ports": [
                {
                  "port": 80,
                  "protocol": "TCP"
                }
              ],
              "resources": {
                "requests": {
                  "cpu": 1,
                  "memoryInGB": 2
                }
              }
            }
          }
        ],
        "osType": "Linux",
        "restartPolicy": "Always",
        "ipAddress": {
          "type": "Public",
          "ports": [
            {
              "port": 80,
              "protocol": "TCP"
            }
          ]
        }
      }
    },
    "containerController": {
      "type": "Microsoft.ContainerInstance/containerGroups",
      "apiVersion": "2022-09-01",
      "name": "controller",
      "location": "[parameters('location')]",
      "properties": {
        "containers": [
          {
            "name": "controller-container",
            "properties": {
              "command": [
                "echo",
                "[format('Worker IPs are {0}', join(map(references('containerWorkers', 'full'), lambda('w', lambdaVariables('w').properties.ipAddress.ip)), ','))]"
              ],
              "image": "mcr.microsoft.com/azuredocs/aci-helloworld",
              "ports": [
                {
                  "port": 80,
                  "protocol": "TCP"
                }
              ],
              "resources": {
                "requests": {
                  "cpu": 1,
                  "memoryInGB": 2
                }
              }
            }
          }
        ],
        "osType": "Linux",
        "restartPolicy": "Always",
        "ipAddress": {
          "type": "Public",
          "ports": [
            {
              "port": 80,
              "protocol": "TCP"
            }
          ]
        }
      },
      "dependsOn": [
        "containerWorkers"
      ]
    }
  },
  "outputs": {
    "workerIpAddresses": {
      "type": "string",
      "value": "[join(map(references('containerWorkers', 'full'), lambda('w', lambdaVariables('w').properties.ipAddress.ip)), ',')]"
    },
    "containersFull": {
      "type": "array",
      "value": "[references('containerWorkers', 'full')]"
    },
    "container": {
      "type": "array",
      "value": "[references('containerWorkers')]"
    }
  }
}
```

The preceding example returns the three objects.

```json
"outputs": {
  "workerIpAddresses": {
    "type": "String",
    "value": "20.66.74.26,20.245.100.10,13.91.86.58,40.83.249.30"
  },
  "containersFull": {
    "type": "Array",
    "value": [
      {
        "apiVersion": "2022-09-01",
        "condition": true,
        "copyContext": {
          "copyIndex": 0,
          "copyIndexes": {
            "": 0,
            "containerWorkers": 0
          },
          "name": "containerWorkers"
        },
        "copyLoopSymbolicName": "containerWorkers",
        "deploymentResourceLineInfo": {
          "lineNumber": 30,
          "linePosition": 25
        },
        "existing": false,
        "isAction": false,
        "isConditionTrue": true,
        "isTemplateResource": true,
        "location": "westus",
        "properties": {
          "containers": [
            {
              "name": "worker-container-0",
              "properties": {
                "environmentVariables": [],
                "image": "mcr.microsoft.com/azuredocs/aci-helloworld",
                "instanceView": {
                  "currentState": {
                    "detailStatus": "",
                    "startTime": "2023-07-31T19:25:31.996Z",
                    "state": "Running"
                  },
                  "restartCount": 0
                },
                "ports": [
                  {
                    "port": 80,
                    "protocol": "TCP"
                  }
                ],
                "resources": {
                  "requests": {
                    "cpu": 1.0,
                    "memoryInGB": 2.0
                  }
                }
              }
            }
          ],
          "initContainers": [],
          "instanceView": {
            "events": [],
            "state": "Running"
          },
          "ipAddress": {
            "ip": "20.66.74.26",
            "ports": [
              {
                "port": 80,
                "protocol": "TCP"
              }
            ],
            "type": "Public"
          },
          "isCustomProvisioningTimeout": false,
          "osType": "Linux",
          "provisioningState": "Succeeded",
          "provisioningTimeoutInSeconds": 1800,
          "restartPolicy": "Always",
          "sku": "Standard"
        },
        "provisioningOperation": "Create",
        "references": [],
        "resourceGroupName": "demoRg",
        "resourceId": "Microsoft.ContainerInstance/containerGroups/worker-0",
        "scope": "",
        "subscriptionId": "",
        "symbolicName": "containerWorkers[0]"
      },
      ...
    ]
  },
  "containers": {
    "type": "Array",
    "value": [
      {
        "containers": [
          {
            "name": "worker-container-0",
            "properties": {
              "environmentVariables": [],
              "image": "mcr.microsoft.com/azuredocs/aci-helloworld",
              "instanceView": {
                "currentState": {
                  "detailStatus": "",
                  "startTime": "2023-07-31T19:25:31.996Z",
                  "state": "Running"
                },
                "restartCount": 0
              },
              "ports": [
                {
                  "port": 80,
                  "protocol": "TCP"
                }
              ],
              "resources": {
                "requests": {
                  "cpu": 1.0,
                  "memoryInGB": 2.0
                }
              }
            }
          }
        ],
        "initContainers": [],
        "instanceView": {
          "events": [],
          "state": "Running"
        },
        "ipAddress": {
          "ip": "20.66.74.26",
          "ports": [
            {
              "port": 80,
              "protocol": "TCP"
            }
          ],
          "type": "Public"
        },
        "isCustomProvisioningTimeout": false,
        "osType": "Linux",
        "provisioningState": "Succeeded",
        "provisioningTimeoutInSeconds": 1800,
        "restartPolicy": "Always",
        "sku": "Standard"
      },
      ...
    ]
  }
}
```

## resourceGroup

See the [resourceGroup scope function](template-functions-scope.md#resourcegroup).

In Bicep, use the [resourcegroup](../bicep/bicep-functions-scope.md#resourcegroup) scope function.

## resourceId

`resourceId([subscriptionId], [resourceGroupName], resourceType, resourceName1, [resourceName2], ...)`

Returns the unique identifier of a resource. You use this function when the resource name is ambiguous or not provisioned within the same template. The format of the returned identifier varies based on whether the deployment happens at the scope of a resource group, subscription, management group, or tenant.

In Bicep, use the [resourceId](../bicep/bicep-functions-resource.md#resourceid) function.

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

The resource ID is returned in different formats at different scopes:

* Resource group scope:

    ```json
    /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}
    ```

* Subscription scope:

    ```json
    /subscriptions/{subscriptionId}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}
    ```

* Management group or tenant scope:

    ```json
    /providers/{resourceProviderNamespace}/{resourceType}/{resourceName}
    ```

To avoid confusion, we recommend that you don't use `resourceId` when working with resources deployed to the subscription, management group, or tenant. Instead, use the ID function that is designed for the scope.

* For [subscription-level resources](deploy-to-subscription.md), use the [subscriptionResourceId](#subscriptionresourceid) function.
* For [management group-level resources](deploy-to-management-group.md), use the [managementGroupResourceId](#managementgroupresourceid) function. Use the [extensionResourceId](#extensionresourceid) function to reference a resource that is implemented as an extension of a management group. For example, custom policy definitions that are deployed to a management group are extensions of the management group. Use the [tenantResourceId](#tenantresourceid) function to reference resources that are deployed to the tenant but available in your management group. For example, built-in policy definitions are implemented as tenant level resources.
* For [tenant-level resources](deploy-to-tenant.md), use the [tenantResourceId](#tenantresourceid) function. Use `tenantResourceId` for built-in policy definitions because they're implemented at the tenant level.

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

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/resource/resourceid-external.json":::

### Resource ID example

The following example returns the resource ID for a storage account in the resource group:

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/resource/resourceid.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| sameRGOutput | String | /subscriptions/{current-sub-id}/resourceGroups/examplegroup/providers/Microsoft.Storage/storageAccounts/examplestorage |
| differentRGOutput | String | /subscriptions/{current-sub-id}/resourceGroups/otherResourceGroup/providers/Microsoft.Storage/storageAccounts/examplestorage |
| differentSubOutput | String | /subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/otherResourceGroup/providers/Microsoft.Storage/storageAccounts/examplestorage |
| nestedResourceOutput | String | /subscriptions/{current-sub-id}/resourceGroups/examplegroup/providers/Microsoft.SQL/servers/serverName/databases/databaseName |

## subscription

See the [subscription scope function](template-functions-scope.md#subscription).

In Bicep, use the [subscription](../bicep/bicep-functions-scope.md#subscription) scope function.

## subscriptionResourceId

`subscriptionResourceId([subscriptionId], resourceType, resourceName1, [resourceName2], ...)`

Returns the unique identifier for a resource deployed at the subscription level.

In Bicep, use the [subscriptionResourceId](../bicep/bicep-functions-resource.md#subscriptionresourceid) function.

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

The following template assigns a built-in role. You can deploy it to either a resource group or subscription. It uses the `subscriptionResourceId` function to get the resource ID for built-in roles.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/resource/subscriptionresourceid.json":::

## managementGroupResourceId

`managementGroupResourceId([managementGroupResourceId],resourceType, resourceName1, [resourceName2], ...)`

Returns the unique identifier for a resource deployed at the management group level.

In Bicep, use the [managementGroupResourceId](../bicep/bicep-functions-resource.md#managementgroupresourceid) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| managementGroupResourceId |No |string (in GUID format) |Default value is the current management group. Specify this value when you need to retrieve a resource in another management group. |
| resourceType |Yes |string |Type of resource including resource provider namespace. |
| resourceName1 |Yes |string |Name of resource. |
| resourceName2 |No |string |Next resource name segment, if needed. |

Continue adding resource names as parameters when the resource type includes more segments.

### Return value

The identifier is returned in the following format:

```json
/providers/Microsoft.Management/managementGroups/{managementGroupName}/providers/{resourceType}/{resourceName}
```

### Remarks

You use this function to get the resource ID for resources that are [deployed to the management group](deploy-to-management-group.md) rather than a resource group. The returned ID differs from the value returned by the [resourceId](#resourceid) function by not including a subscription ID and a resource group value.

### managementGroupResourceID example

The following template creates and assigns a policy definition. It uses the `managementGroupResourceId` function to get the resource ID for policy definition.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/managementGroupDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "targetMG": {
      "type": "string",
      "metadata": {
        "description": "Target Management Group"
      }
    },
    "allowedLocations": {
      "type": "array",
      "defaultValue": [
        "australiaeast",
        "australiasoutheast",
        "australiacentral"
      ],
      "metadata": {
        "description": "An array of the allowed locations, all other locations will be denied by the created policy."
      }
    }
  },
  "variables": {
    "mgScope": "[tenantResourceId('Microsoft.Management/managementGroups', parameters('targetMG'))]",
    "policyDefinitionName": "LocationRestriction"
  },
  "resources": [
    {
      "type": "Microsoft.Authorization/policyDefinitions",
      "apiVersion": "2021-06-01",
      "name": "[variables('policyDefinitionName')]",
      "properties": {
        "policyType": "Custom",
        "mode": "All",
        "parameters": {},
        "policyRule": {
          "if": {
            "not": {
              "field": "location",
              "in": "[parameters('allowedLocations')]"
            }
          },
          "then": {
            "effect": "deny"
          }
        }
      }
    },
    "location_lock": {
      "type": "Microsoft.Authorization/policyAssignments",
      "apiVersion": "2022-06-01",
      "name": "location-lock",
      "properties": {
        "scope": "[variables('mgScope')]",
        "policyDefinitionId": "[managementGroupResourceId('Microsoft.Authorization/policyDefinitions', variables('policyDefinitionName'))]"
      },
      "dependsOn": [
        "[format('Microsoft.Authorization/policyDefinitions/{0}', variables('policyDefinitionName'))]"
      ]
    }
  ]
}
```

## tenantResourceId

`tenantResourceId(resourceType, resourceName1, [resourceName2], ...)`

Returns the unique identifier for a resource deployed at the tenant level.

In Bicep, use the [tenantResourceId](../bicep/bicep-functions-resource.md#tenantresourceid) function.

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

Built-in policy definitions are tenant level resources. To deploy a policy assignment that references a built-in policy definition, use the `tenantResourceId` function.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/resource/tenantresourceid.json":::

## Next steps

* For a description of the sections in an ARM template, see [Understand the structure and syntax of ARM templates](./syntax.md).
* To merge multiple templates, see [Using linked and nested templates when deploying Azure resources](linked-templates.md).
* To iterate a specified number of times when creating a type of resource, see [Resource iteration in ARM templates](copy-resources.md).
* To see how to deploy the template you've created, see [Deploy resources with ARM templates and Azure PowerShell](deploy-powershell.md).
