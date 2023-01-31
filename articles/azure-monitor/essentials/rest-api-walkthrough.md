---
title: Azure monitoring REST API walkthrough
description: How to authenticate requests and use the Azure Monitor REST API to retrieve available metric definitions and metric values.
author: EdB-MSFT
ms.topic: conceptual
ms.date: 01/30/2023
ms.custom: has-adal-ref, devx-track-azurepowershell
ms.reviewer: edbaynash
---

# Azure monitoring REST API walkthrough

This article shows you how to perform authentication so your code can use the [Azure Monitor REST API reference](/rest/api/monitor/).

The Azure Monitor API makes it possible to programmatically retrieve the available default metric definitions, dimension values, and metric values. The data can be saved in a separate data store such as Azure SQL Database, Azure Cosmos DB, or Azure Data Lake. From there, more analysis can be performed as needed.

The Azure Monitor API also makes it possible to list alert rules, view activity logs. For a full list of available operations, see the [Azure Monitor REST API reference](/rest/api/monitor/).

## Authenticate Azure Monitor requests

Tasks executed using the Azure Monitor API use the Azure Resource Manager authentication model. All requests must be authenticated with Azure Active Directory (Azure Active Directory). One approach to authenticating the client application is to create an Azure Active Directory service principal and retrieve the authentication (JWT) token.

## Create an Azure Active Directory service principal

### [Azure Portal](#tab/portal)

To create an Azure Active Directory service principal using the Azure Portal see [Register an App to request authorization tokens and work with APIs](../logs/api/register-app-for-token)

### [Azure CLI](#tab/cli)


Run the following script to create a service principal and app. 

```azurecli
az ad sp create-for-rbac -n <Service principal display name> 

```
The response looks as follows:
```JSON
{
  "appId": "0a123b56-c987-1234-abcd-1a2b3c4d5e6f",
  "displayName": "AzMonAPIApp",
  "password": "123456.ABCDE.~XYZ876123ABcEdB7169",
  "tenant": "a1234bcd-5849-4a5d-a2eb-5267eae1bbc7"
}

```
>[!Important]
> The output includes credentials that you must protect. Be sure that you do not include these credentials in your code or check the credentials into your source control.

Add a role and scope for the resouces that you want to access using the API

```azurecli
az role assignment create --assignee <`appId`> --role <Role> --scope <resource URI>
```

The example below assigns the `Reader` role to the service principal for all resources in the `rg-001`resource group:
```azurecli
 az role assignment create --assignee 0a123b56-c987-1234-abcd-1a2b3c4d5e6f --role Reader --scope '\/subscriptions/a1234bcd-5849-4a5d-a2eb-5267eae1bbc7/resourceGroups/rg-001'
```
For more information on creating a service principal using Azure CLI, see [Create an Azure service principal with the Azure CLI](https://learn.microsoft.com/cli/azure/create-an-azure-service-principal-azure-cli)


### [Powershell](#tab/powershell) 

To create an Azure Active Directory service principal using thePowershell see [using Azure PowerShell to create a service principal to access resources](/powershell/azure/create-azure-service-principal-azureps). It's also possible to [create a service principal via the Azure portal](../../active-directory/develop/howto-create-service-principal-portal.md).

---

## Retrieve a token

To retrieve an access token using a REST call submit the following request using the `appId` and `password` for your servide pricipal and app:

```HTTP

    POST /<appId>/oauth2/v2.0/token
    Host: https://login.microsoftonline.com
    Content-Type: application/x-www-form-urlencoded
    
    grant_type=client_credentials
    &client_id=<app-client-id>
    &resource=https://management.azure.com
    &client_secret=<password>

```

For example

```bash
curl --location --request POST 'https://login.microsoftonline.com/a1234bcd-5849-4a5d-a2eb-5267eae1bbc7/oauth2/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'client_id=0a123b56-c987-1234-abcd-1a2b3c4d5e6f' \
--data-urlencode 'client_secret123456.ABCDE.~XYZ876123ABceDb0000' \
--data-urlencode 'resource=https://management.azure.com'

```
A successful request receives an access token in the response:

```HTTP
{
   token_type": "Bearer",
   "expires_in": "86399",
   "ext_expires_in": "86399",
   "access_token": ""eyJ0eXAiOiJKV1QiLCJ.....Ax"
}
```



After authenticating and retrieving a token, use the access token in your Azure Monitor API requests. 

> [!NOTE]
> For more information on working with the Azure REST API, see the [Azure REST API reference](/rest/api/azure/).
>

## Retrieve metric definitions

Use the [Azure Monitor Metric Definitions REST API](/rest/api/monitor/metricdefinitions) to access the list of metrics that are available for a service.

```HTTP
GET /subscriptions/<subscription id>/resourcegroups/<resourceGroupName>/providers/<resourceProviderNamespace>/<resourceType>/<resourceName>/providers/microsoft.insights/metricDefinitions?api-version=<apiVersion>
Host: management.azure.com
Content-Type: application/json
Authorization: Bearer <access token>

```

For example, The request below retrieves the metric definitions for an Azure Storage account

```curl
curl --location --request GET 'https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/azmon-rest-api-walkthrough/providers/Microsoft.Storage/storageAccounts/ContosoStorage/providers/microsoft.insights/metricDefinitions?api-version=2018-01-01'
--header 'Authorization: Bearer eyJ0eXAiOi...xYz
```

The following JSON shows an example response body. 
In this example, only the second metric has dimensions.

```json
{
    "value": [
        {
            "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/azmon-rest-api-walkthrough/providers/Microsoft.Storage/storageAccounts/ContosoStorage/providers/microsoft.insights/metricdefinitions/UsedCapacity",
            "resourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/azmon-rest-api-walkthrough/providers/Microsoft.Storage/storageAccounts/ContosoStorage",
            "namespace": "Microsoft.Storage/storageAccounts",
            "category": "Capacity",
            "name": {
                "value": "UsedCapacity",
                "localizedValue": "Used capacity"
            },
            "isDimensionRequired": false,
            "unit": "Bytes",
            "primaryAggregationType": "Average",
            "supportedAggregationTypes": [
                "Total",
                "Average",
                "Minimum",
                "Maximum"
            ],
            "metricAvailabilities": [
                {
                    "timeGrain": "PT1H",
                    "retention": "P93D"
                },
                {
                    "timeGrain": "PT6H",
                    "retention": "P93D"
                },
                {
                    "timeGrain": "PT12H",
                    "retention": "P93D"
                },
                {
                    "timeGrain": "P1D",
                    "retention": "P93D"
                }
            ]
        },
        {
            "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/azmon-rest-api-walkthrough/providers/Microsoft.Storage/storageAccounts/ContosoStorage/providers/microsoft.insights/metricdefinitions/Transactions",
            "resourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/azmon-rest-api-walkthrough/providers/Microsoft.Storage/storageAccounts/ContosoStorage",
            "namespace": "Microsoft.Storage/storageAccounts",
            "category": "Transaction",
            "name": {
                "value": "Transactions",
                "localizedValue": "Transactions"
            },
            "isDimensionRequired": false,
            "unit": "Count",
            "primaryAggregationType": "Total",
            "supportedAggregationTypes": [
                "Total"
            ],
            "metricAvailabilities": [
                {
                    "timeGrain": "PT1M",
                    "retention": "P93D"
                },
                {
                    "timeGrain": "PT5M",
                    "retention": "P93D"
                },
                {
                    "timeGrain": "PT15M",
                    "retention": "P93D"
                },
                {
                    "timeGrain": "PT30M",
                    "retention": "P93D"
                },
                {
                    "timeGrain": "PT1H",
                    "retention": "P93D"
                },
                {
                    "timeGrain": "PT6H",
                    "retention": "P93D"
                },
                {
                    "timeGrain": "PT12H",
                    "retention": "P93D"
                },
                {
                    "timeGrain": "P1D",
                    "retention": "P93D"
                }
            ],
            "dimensions": [
                {
                    "value": "ResponseType",
                    "localizedValue": "Response type"
                },
                {
                    "value": "GeoType",
                    "localizedValue": "Geo type"
                },
                {
                    "value": "ApiName",
                    "localizedValue": "API name"
                }
            ]
        },
        ...
    ]
}
```
> [!NOTE]
> We recommend using API version "2018-01-01" or later. Older versions of the metric definitions API don't support dimensions.  

## Retrieve dimension values

After the retrieving the available metric definitions for metrics with dimensions, retrieve the range of values for the dimensions. Use the  dimension values to filter or segment the metrics based in your queries. Use the [Azure Monitor Metrics REST API](/rest/api/monitor/metrics) to find all the possible values for a given metric dimension.

Use the metric's name `value` (not `localizedValue`) for any filtering requests. If no filters are specified, the default metric is returned. The use of this API only allows one dimension to have a wildcard filter. The key difference between a dimension values request and a metric data request is specifying the `"resultType=metadata"` query parameter.

> [!NOTE]
> To retrieve dimension values by using the Azure Monitor REST API, use the API version "2019-07-01" or later.
>

```HTTP
GET /subscriptions/<subscription-id>/resourceGroups/  
<resource-group-name>/providers/<resource-provider-namespace>/  
<resource-type>/<resource-name>/providers/microsoft.insights/  
metrics?metricnames=<metric>  
&timespan=<starttime/endtime>  
&$filter=<filter>  
&resultType=metadata  
&api-version=<apiVersion>   HTTP/1.1
Host: management.azure.com
Content-Type: application/json
Authorization: Bearer <access token>
```
For example, to retrieve the list of dimension values that were emitted for the `API Name` dimension for the `Transactions` metric, where the GeoType dimension = `Primary` during the specified time range, the request would be: 

```curl
curl --location --request GET 'https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/azmon-rest-api-walkthrough/providers/Microsoft.Storage/storageAccounts/ContosoStorage/providers/microsoft.insights/metrics?metricnames=Transactions&timespan=2018-03-01T00:00:00Z/2018-03-02T00:00:00Z&resultType=metadata&$filter=GeoType eq \'Primary\' and ApiName eq \'*\'&api-version=2019-07-01'
-header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJ0e..meG1lWm9Y
```
The following JSON shows an example response body. 

```json
{
  "timespan": "2018-03-01T00:00:00Z/2018-03-02T00:00:00Z",
  "value": [
    {
      "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/azmon-rest-api-walkthrough/providers/Microsoft.Storage/storageAccounts/ContosoStorage/providers/Microsoft.Insights/metrics/Transactions",
      "type": "Microsoft.Insights/metrics",
      "name": {
        "value": "Transactions",
        "localizedValue": "Transactions"
      },
      "unit": "Count",
      "timeseries": [
        {
          "metadatavalues": [
            {
              "name": {
                "value": "apiname",
                "localizedValue": "apiname"
              },
              "value": "DeleteBlob"
            }
          ]
        },
        {
          "metadatavalues": [
            {
              "name": {
                "value": "apiname",
                "localizedValue": "apiname"
              },
              "value": "SetBlobProperties"
            }
          ]
        },
        ...
      ]
    }
  ],
  "namespace": "Microsoft.Storage/storageAccounts",
  "resourceregion": "eastus"
}
```

## Retrieve metric values

After the available metric definitions and possible dimension values are known, it's then possible to retrieve the related metric values. Use the [Azure Monitor Metrics REST API](/rest/api/monitor/metrics) to retrieve the metric values.

Use the metric's name `value` (not `localizedValue`) for any filtering requests. If no dimension filters are specified, the rolled up aggregated metric is returned. To fetch multiple time series with specific dimension values, specify a filter query parameter that specifies both dimension values such as `"&$filter=ApiName eq 'ListContainers' or ApiName eq 'GetBlobServiceProperties'"`. To return a time series for every value of a given dimension, use an `*` filter such as `"&$filter=ApiName eq '*'"`. The `Top` and `OrderBy` query parameters can be used to limit and order the number of time series returned.

> [!NOTE]
> To retrieve multi-dimensional metric values using the Azure Monitor REST API, use the API version "2019-07-01" or later.
>

```HTTP
GET /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/<resource-provider-namespace>/<resource-type>/<resource-name>/providers/microsoft.insights/metrics?metricnames=<metric>&timespan=<starttime/endtime>&$filter=<filter>&interval=<timeGrain>&aggregation=<aggreation>&api-version=<apiVersion>
Host: management.azure.com
Content-Type: application/json
Authorization: Bearer <access token>
```

**Method**: GET

**Request URI**: 

For example, to retrieve the top three APIs, in descending value, by the number of `Transactions` during a 5-minute range, where the GeoType was `Primary`, the request would be:

```powershell
$filter = "APIName eq '*' and GeoType eq 'Primary'"
$request = "https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/azmon-rest-api-walkthrough/providers/Microsoft.Storage/storageAccounts/ContosoStorage/providers/microsoft.insights/metrics?metricnames=Transactions&timespan=2018-03-01T02:00:00Z/2018-03-01T02:05:00Z&`$filter=apiname eq 'GetBlobProperties'&interval=PT1M&aggregation=Total&top=3&orderby=Total desc&api-version=2019-07-01"
Invoke-RestMethod -Uri $request `
    -Headers $authHeader `
    -Method Get `
    -OutFile ".\contosostorage-metric-values.json" `
    -Verbose
```

The resulting JSON response body would be similar to the following example:

```json
{
  "cost": 0,
  "timespan": "2018-03-01T02:00:00Z/2018-03-01T02:05:00Z",
  "interval": "PT1M",
  "value": [
    {
      "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/azmon-rest-api-walkthrough/providers/Microsoft.Storage/storageAccounts/ContosoStorage/providers/Microsoft.Insights/metrics/Transactions",
      "type": "Microsoft.Insights/metrics",
      "name": {
        "value": "Transactions",
        "localizedValue": "Transactions"
      },
      "unit": "Count",
      "timeseries": [
        {
          "metadatavalues": [
            {
              "name": {
                "value": "apiname",
                "localizedValue": "apiname"
              },
              "value": "GetBlobProperties"
            }
          ],
          "data": [
            {
              "timeStamp": "2017-09-19T02:00:00Z",
              "total": 2
            },
            {
              "timeStamp": "2017-09-19T02:01:00Z",
              "total": 1
            },
            {
              "timeStamp": "2017-09-19T02:02:00Z",
              "total": 3
            },
            {
              "timeStamp": "2017-09-19T02:03:00Z",
              "total": 7
            },
            {
              "timeStamp": "2017-09-19T02:04:00Z",
              "total": 2
            }
          ]
        },
        ...
      ]
    }
  ],
  "namespace": "Microsoft.Storage/storageAccounts",
  "resourceregion": "eastus"
}
```

### Use ARMClient

Another approach is to use [ARMClient](https://github.com/projectkudu/armclient) on your Windows machine. ARMClient handles the Azure Active Directory authentication (and resulting JWT token) automatically. The following steps outline the use of ARMClient for retrieving metric data:

1. Install [Chocolatey](https://chocolatey.org/) and [ARMClient](https://github.com/projectkudu/armclient).
1. In a terminal window, enter **armclient.exe login**. Doing so prompts you to sign in to Azure.
1. Enter **armclient GET [your_resource_id]/providers/microsoft.insights/metricdefinitions?api-version=2016-03-01**.
1. Enter **armclient GET [your_resource_id]/providers/microsoft.insights/metrics?api-version=2016-09-01**.

For example, to retrieve the metric definitions for a specific logic app, issue the following command:

```console
armclient GET /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/azmon-rest-api-walkthrough/providers/Microsoft.Logic/workflows/ContosoTweets/providers/microsoft.insights/metricDefinitions?api-version=2016-03-01
```

## Retrieve the resource ID

Using the REST API can help you to understand the available metric definitions, granularity, and related values. That information is helpful when you use the [Azure Management Library](/previous-versions/azure/reference/mt417623(v=azure.100)).

For the preceding code, the resource ID to use is the full path to the desired Azure resource. For example, to query against an Azure Web App, the resource ID would be:

*/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Web/sites/{site-name}/*

The following list contains a few examples of resource ID formats for various Azure resources:

* **Azure IoT Hub**: /subscriptions/*{subscription-id}*/resourceGroups/*{resource-group-name}*/providers/Microsoft.Devices/IotHubs/*{iot-hub-name}*
* **Elastic SQL pool**: /subscriptions/*{subscription-id}*/resourceGroups/*{resource-group-name}*/providers/Microsoft.Sql/servers/*{pool-db}*/elasticpools/*{sql-pool-name}*
* **Azure SQL Database (v12)**: /subscriptions/*{subscription-id}*/resourceGroups/*{resource-group-name}*/providers/Microsoft.Sql/servers/*{server-name}*/databases/*{database-name}*
* **Azure Service Bus**: /subscriptions/*{subscription-id}*/resourceGroups/*{resource-group-name}*/providers/Microsoft.ServiceBus/*{namespace}*/*{servicebus-name}*
* **Azure Virtual Machine Scale Sets**: /subscriptions/*{subscription-id}*/resourceGroups/*{resource-group-name}*/providers/Microsoft.Compute/virtualMachineScaleSets/*{vm-name}*
* **Azure Virtual Machines**: /subscriptions/*{subscription-id}*/resourceGroups/*{resource-group-name}*/providers/Microsoft.Compute/virtualMachines/*{vm-name}*
* **Azure Event Hubs**: /subscriptions/*{subscription-id}*/resourceGroups/*{resource-group-name}*/providers/Microsoft.EventHub/namespaces/*{eventhub-namespace}*

There are alternative approaches to retrieving the resource ID. You can use Azure Resource Explorer, view the desired resource in the Azure portal, and use PowerShell or the Azure CLI.

### Azure Resource Explorer

To find the resource ID for a desired resource, one helpful approach is to use the [Azure Resource Explorer](https://resources.azure.com) tool. Go to the desired resource and then look at the ID shown, as in the following screenshot:

![Screenshot that shows Azure Resource Explorer.](./media/rest-api-walkthrough/azure_resource_explorer.png)

### Azure portal

The resource ID can also be obtained from the Azure portal. To do so, go to the desired resource and then select **Properties**. The resource ID appears in the **Properties** section, as seen in the following screenshot:

![Screenshot that shows resource ID displayed in the Properties pane in the Azure portal.](./media/rest-api-walkthrough/resourceid_azure_portal.png)

### Azure PowerShell

The resource ID can be retrieved by using Azure PowerShell cmdlets too. For example, to obtain the resource ID for an Azure logic app, execute the `Get-AzureLogicApp` cmdlet, as in the following example:

```powershell
Get-AzLogicApp -ResourceGroupName azmon-rest-api-walkthrough -Name contosotweets
```

The result should be similar to the following example:

```output
Id             : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/azmon-rest-api-walkthrough/providers/Microsoft.Logic/workflows/ContosoTweets
Name           : ContosoTweets
Type           : Microsoft.Logic/workflows
Location       : centralus
ChangedTime    : 8/21/2017 6:58:57 PM
CreatedTime    : 8/18/2017 7:54:21 PM
AccessEndpoint : https://prod-08.centralus.logic.azure.com:443/workflows/f3a91b352fcc47e6bff989b85446c5db
State          : Enabled
Definition     : {$schema, contentVersion, parameters, triggers...}
Parameters     : {[$connections, Microsoft.Azure.Management.Logic.Models.WorkflowParameter]}
SkuName        :
AppServicePlan :
PlanType       :
PlanId         :
Version        : 08586982649483762729
```

### Azure CLI

To retrieve the resource ID for an Azure Storage account by using the Azure CLI, execute the `az storage account show` command, as shown in the following example:

```azurecli
az storage account show -g azmon-rest-api-walkthrough -n contosotweets2017
```

The result should be similar to the following example:

```json
{
  "accessTier": null,
  "creationTime": "2017-08-18T19:58:41.840552+00:00",
  "customDomain": null,
  "enableHttpsTrafficOnly": false,
  "encryption": null,
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/azmon-rest-api-walkthrough/providers/Microsoft.Storage/storageAccounts/contosotweets2017",
  "identity": null,
  "kind": "Storage",
  "lastGeoFailoverTime": null,
  "location": "centralus",
  "name": "contosotweets2017",
  "networkAcls": null,
  "primaryEndpoints": {
    "blob": "https://contosotweets2017.blob.core.windows.net/",
    "file": "https://contosotweets2017.file.core.windows.net/",
    "queue": "https://contosotweets2017.queue.core.windows.net/",
    "table": "https://contosotweets2017.table.core.windows.net/"
  },
  "primaryLocation": "centralus",
  "provisioningState": "Succeeded",
  "resourceGroup": "azmon-rest-api-walkthrough",
  "secondaryEndpoints": null,
  "secondaryLocation": "eastus2",
  "sku": {
    "name": "Standard_GRS",
    "tier": "Standard"
  },
  "statusOfPrimary": "available",
  "statusOfSecondary": "available",
  "tags": {},
  "type": "Microsoft.Storage/storageAccounts"
}
```

> [!NOTE]
> Azure logic apps aren't yet available via the Azure CLI. For this reason, an Azure Storage account is shown in the preceding example.
>

## Retrieve activity log data

In addition to metric definitions and related values, it's also possible to use the Azure Monitor REST API to retrieve other interesting insights related to Azure resources. As an example, it's possible to query [activity log](/rest/api/monitor/activitylogs) data. The following sample requests use the Azure Monitor REST API to query an activity log.

Get activity logs with filter:

``` HTTP
GET https://management.azure.com/subscriptions/089bd33f-d4ec-47fe-8ba5-0753aa5c5b33/providers/microsoft.insights/eventtypes/management/values?api-version=2015-04-01&$filter=eventTimestamp ge '2018-01-21T20:00:00Z' and eventTimestamp le '2018-01-23T20:00:00Z' and resourceGroupName eq 'MSSupportGroup'
```

Get activity logs with filter and select:

```HTTP
GET https://management.azure.com/subscriptions/089bd33f-d4ec-47fe-8ba5-0753aa5c5b33/providers/microsoft.insights/eventtypes/management/values?api-version=2015-04-01&$filter=eventTimestamp ge '2015-01-21T20:00:00Z' and eventTimestamp le '2015-01-23T20:00:00Z' and resourceGroupName eq 'MSSupportGroup'&$select=eventName,id,resourceGroupName,resourceProviderName,operationName,status,eventTimestamp,correlationId,submissionTimestamp,level
```

Get activity logs with select:

```HTTP
GET https://management.azure.com/subscriptions/089bd33f-d4ec-47fe-8ba5-0753aa5c5b33/providers/microsoft.insights/eventtypes/management/values?api-version=2015-04-01&$select=eventName,id,resourceGroupName,resourceProviderName,operationName,status,eventTimestamp,correlationId,submissionTimestamp,level
```

Get activity logs without filter or select:

```HTTP
GET https://management.azure.com/subscriptions/089bd33f-d4ec-47fe-8ba5-0753aa5c5b33/providers/microsoft.insights/eventtypes/management/values?api-version=2015-04-01
```

## Troubleshooting

If you receive a 429, 503, or 504 error, retry the API in one minute.

## Next steps

* Review the [overview of monitoring](../overview.md).
* View the [supported metrics with Azure Monitor](./metrics-supported.md).
* Review the [Microsoft Azure Monitor REST API reference](/rest/api/monitor/).
* Review the [Azure Management Library](/previous-versions/azure/reference/mt417623(v=azure.100)).