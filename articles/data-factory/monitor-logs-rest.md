---
title: Set up diagnostic logs via the Azure Monitor REST API 
description: Learn how to set up diagnostic logs for Azure Data Factory by using the Azure Monitor REST API.
author: nabhishek
ms.author: abnarain
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: monitoring
ms.topic: conceptual
ms.date: 01/18/2023
---

# Set up diagnostic logs via the Azure Monitor REST API

This article describes how to set up diagnostic logs for Azure Data Factory by using the Azure Monitor REST API.

## Diagnostic settings

Use diagnostic settings to configure diagnostic logs for noncompute resources. The settings for a resource control have the following features:

* They specify where diagnostic logs are sent. Examples include an Azure storage account, an Azure event hub, or Monitor logs.
* They specify which log categories are sent.
* They specify how long each log category should be kept in a storage account.
* A retention of zero days means logs are kept forever. Otherwise, the value can be any number of days from 1 through 2,147,483,647.
* If retention policies are set but storing logs in a storage account is disabled, the retention policies have no effect. For example, this condition can happen when only event hubs or Monitor logs options are selected.
* Retention policies are applied per day. The boundary between days occurs at midnight Coordinated Universal Time (UTC). At the end of a day, logs from days that are beyond the retention policy are deleted. For example, if you have a retention policy of one day, at the beginning of today the logs from before yesterday are deleted.

## Enable diagnostic logs via the Monitor REST API

Use the Monitor REST API to enable diagnostic logs.

### Create or update a diagnostics setting in the Monitor REST API

#### Request

```
PUT
https://management.azure.com/{resource-id}/providers/microsoft.insights/diagnosticSettings/service?api-version={api-version}
```

#### Headers

* Replace `{api-version}` with `2016-09-01`.
* Replace `{resource-id}` with the ID of the resource for which you want to edit diagnostic settings. For more information, see [Using resource groups to manage your Azure resources](../azure-resource-manager/management/manage-resource-groups-portal.md).
* Set the `Content-Type` header to `application/json`.
* Set the authorization header to the JSON web token that you got from Microsoft Entra ID. For more information, see [Authenticating requests](../active-directory/develop/authentication-vs-authorization.md).

#### Body

```json
{
    "properties": {
        "storageAccountId": "/subscriptions/<subID>/resourceGroups/<resourceGroupName>/providers/Microsoft.Storage/storageAccounts/<storageAccountName>",
        "serviceBusRuleId": "/subscriptions/<subID>/resourceGroups/<resourceGroupName>/providers/Microsoft.EventHub/namespaces/<eventHubName>/authorizationrules/RootManageSharedAccessKey",
        "workspaceId": "/subscriptions/<subID>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<LogAnalyticsName>",
        "metrics": [
        ],
        "logs": [
                {
                    "category": "PipelineRuns",
                    "enabled": true,
                    "retentionPolicy": {
                        "enabled": false,
                        "days": 0
                    }
                },
                {
                    "category": "TriggerRuns",
                    "enabled": true,
                    "retentionPolicy": {
                        "enabled": false,
                        "days": 0
                    }
                },
                {
                    "category": "ActivityRuns",
                    "enabled": true,
                    "retentionPolicy": {
                        "enabled": false,
                        "days": 0
                    }
                }
            ]
    },
    "location": ""
}
```

| Property | Type | Description |
| --- | --- | --- |
| **storageAccountId** |String | The resource ID of the storage account to which you want to send diagnostic logs. |
| **serviceBusRuleId** |String | The service-bus rule ID of the service-bus namespace in which you want to have event hubs created for streaming diagnostic logs. The rule ID has the format `{service bus resource ID}/authorizationrules/{key name}`.|
| **workspaceId** | String | The workspace ID of the workspace where the logs will be saved. |
|**metrics**| Parameter values of the pipeline run to be passed to the invoked pipeline| A JSON object that maps parameter names to argument values. |
| **logs**| Complex Type| The name of a diagnostic log category for a resource type. To get the list of diagnostic log categories for a resource, perform a GET diagnostic settings operation. |
| **category**| String| An array of log categories and their retention policies. |
| **timeGrain** | String | The granularity of metrics, which are captured in ISO 8601 duration format. The property value must be `PT1M`, which specifies one minute. |
| **enabled**| Boolean | Specifies whether collection of the metric or log category is enabled for this resource. |
| **retentionPolicy**| Complex Type| Describes the retention policy for a metric or log category. This property is used for storage accounts only. |
|**days**| Int| The number of days to keep the metrics or logs. If the property value is 0, the logs are kept forever. This property is used for storage accounts only. |

#### Response

200 OK.

```json
{
    "id": "/subscriptions/<subID>/resourcegroups/adf/providers/microsoft.datafactory/factories/shloadobetest2/providers/microsoft.insights/diagnosticSettings/service",
    "type": null,
    "name": "service",
    "location": null,
    "kind": null,
    "tags": null,
    "properties": {
        "storageAccountId": "/subscriptions/<subID>/resourceGroups/<resourceGroupName>//providers/Microsoft.Storage/storageAccounts/<storageAccountName>",
        "serviceBusRuleId": "/subscriptions/<subID>/resourceGroups/<resourceGroupName>//providers/Microsoft.EventHub/namespaces/<eventHubName>/authorizationrules/RootManageSharedAccessKey",
        "workspaceId": "/subscriptions/<subID>/resourceGroups/<resourceGroupName>//providers/Microsoft.OperationalInsights/workspaces/<LogAnalyticsName>",
        "eventHubAuthorizationRuleId": null,
        "eventHubName": null,
        "metrics": [],
        "logs": [
            {
                "category": "PipelineRuns",
                "enabled": true,
                "retentionPolicy": {
                    "enabled": false,
                    "days": 0
                }
            },
            {
                "category": "TriggerRuns",
                "enabled": true,
                "retentionPolicy": {
                    "enabled": false,
                    "days": 0
                }
            },
            {
                "category": "ActivityRuns",
                "enabled": true,
                "retentionPolicy": {
                    "enabled": false,
                    "days": 0
                }
            }
        ]
    },
    "identity": null
}
```

### Get information about diagnostics settings in the Monitor REST API

#### Request

```
GET
https://management.azure.com/{resource-id}/providers/microsoft.insights/diagnosticSettings/service?api-version={api-version}
```

#### Headers

* Replace `{api-version}` with `2016-09-01`.
* Replace `{resource-id}` with the ID of the resource for which you want to edit diagnostic settings. For more information, see [Using resource groups to manage your Azure resources](../azure-resource-manager/management/manage-resource-groups-portal.md).
* Set the `Content-Type` header to `application/json`.
* Set the authorization header to a JSON web token that you got from Microsoft Entra ID. For more information, see [Authenticating requests](../active-directory/develop/authentication-vs-authorization.md).

#### Response

200 OK.

```json
{
    "id": "/subscriptions/<subID>/resourcegroups/adf/providers/microsoft.datafactory/factories/shloadobetest2/providers/microsoft.insights/diagnosticSettings/service",
    "type": null,
    "name": "service",
    "location": null,
    "kind": null,
    "tags": null,
    "properties": {
        "storageAccountId": "/subscriptions/<subID>/resourceGroups/shloprivate/providers/Microsoft.Storage/storageAccounts/azmonlogs",
        "serviceBusRuleId": "/subscriptions/<subID>/resourceGroups/shloprivate/providers/Microsoft.EventHub/namespaces/shloeventhub/authorizationrules/RootManageSharedAccessKey",
        "workspaceId": "/subscriptions/<subID>/resourceGroups/ADF/providers/Microsoft.OperationalInsights/workspaces/mihaipie",
        "eventHubAuthorizationRuleId": null,
        "eventHubName": null,
        "metrics": [],
        "logs": [
            {
                "category": "PipelineRuns",
                "enabled": true,
                "retentionPolicy": {
                    "enabled": false,
                    "days": 0
                }
            },
            {
                "category": "TriggerRuns",
                "enabled": true,
                "retentionPolicy": {
                    "enabled": false,
                    "days": 0
                }
            },
            {
                "category": "ActivityRuns",
                "enabled": true,
                "retentionPolicy": {
                    "enabled": false,
                    "days": 0
                }
            }
        ]
    },
    "identity": null
}
```
For more information, see [Diagnostic settings](/rest/api/monitor/diagnosticsettings).

## Next steps

[Monitor SSIS operations with Azure Monitor](monitor-ssis.md)
