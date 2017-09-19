---
title: Monitor data factories using Azure Monitor | Microsoft Docs
description: Learn how to use Azure Monitor to monitor Data Factory pipelines by enabling diagnostic logs with information from Azure Data Factory.
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/10/2017
ms.author: shlo

---
# Monitor data factories using Azure Monitor  
Cloud applications are complex with many moving parts. Monitoring provides data to ensure that your application stays up and running in a healthy state. It also helps you to stave off potential problems or troubleshoot past ones. In addition, you can use monitoring data to gain deep insights about your application. This knowledge can help you to improve application performance or maintainability, or automate actions that would otherwise require manual intervention.

Azure Monitor provides base level infrastructure metrics and logs for most services in Microsoft Azure. For details, see [monitoring overview](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview-azure-monitor). Azure Diagnostic logs are logs emitted by a resource that provide rich, frequent data about the operation of that resource. Data Factory outputs diagnostic logs in Azure Monitor. 

## Diagnostic logs

* Save them to a **Storage Account** for auditing or manual inspection. You can specify the retention time (in days) using the diagnostic settings.
* Stream them to **Event Hubs** for ingestion by a third-party service or custom analytics solution such as PowerBI.
* Analyze them with **Operations Management Suite (OMS) Log Analytics**

You can use a storage account or event hub namespace that is not in the same subscription as the resource that is emitting logs. The user who configures the setting must have the appropriate role-based access control (RBAC) access to both subscriptions.

## Set up diagnostic logs

### Diagnostic Settings
Diagnostic Logs for non-compute resources are configured using diagnostic settings. Diagnostic settings for a resource control:

* Where diagnostic logs are sent (Storage Account, Event Hubs, and/or OMS Log Analytics).
* Which log categories are sent.
* How long each log category should be retained in a storage account
* A retention of zero days means logs are kept forever. Otherwise, the value can be any number of days between 1 and 2147483647.
* If retention policies are set but storing logs in a storage account is disabled (for example, only Event Hubs or OMS options are selected), the retention policies have no effect.
* Retention policies are applied per-day, so at the end of a day (UTC), logs from the day that is now beyond the retention policy are deleted. For example, if you had a retention policy of one day, at the beginning of the day today the logs from the day before yesterday would be deleted.

### Enable diagnostic logs via REST APIs

Create or update a diagnostics setting in Azure Monitor REST API

**Request**
```
PUT
https://management.azure.com/{resource-id}/providers/microsoft.insights/diagnosticSettings/service?api-version={api-version}
```

**Headers**
* Replace `{api-version}` with `2016-09-01`.
* Replace `{resource-id}` with the resource ID of the resource for which you would like to edit diagnostic settings. For more information [Using Resource groups to manage your Azure resources](../azure-resource-manager/resource-group-portal.md).
* Set the `Content-Type` header to `application/json`.
* Set the authorization header to a JSON web token that you obtain from Azure Active Directory. For more information, see [Authenticating requests](../active-directory/develop/active-directory-authentication-scenarios.md).

**Body**
```json
{
    "properties": {
        "storageAccountId": "/subscriptions/<subID>/resourceGroups/<resourceGroupName>/providers/Microsoft.Storage/storageAccounts/<storageAccountName>",
        "serviceBusRuleId": "/subscriptions/<subID>/resourceGroups/<resourceGroupName>/providers/Microsoft.EventHub/namespaces/<eventHubName>/authorizationrules/RootManageSharedAccessKey",
        "workspaceId": "/subscriptions/<subID>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<OMSName>",
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
| storageAccountId |String | The resource ID of the storage account to which you would like to send Diagnostic Logs |
| serviceBusRuleId |String | The service bus rule ID of the service bus namespace in which you would like to have Event Hubs created for streaming Diagnostic Logs. The rule ID is of the format: “{service bus resource ID}/authorizationrules/{key name}”.|
| workspaceId | Complex Type | Array of metric time grains and their retention policies. _This property is currently empty as there's no supported metrics in Azure Data Factory Resource Manager deployment model yet._ |
|metrics| Parameter values of the pipeline run to be passed to the invoked pipeline| A JSON object mapping parameter names to argument values | 
| logs| Complex Type| Name of a Diagnostic Log category for a resource type. To obtain the list of Diagnostic Log categories for a resource, first perform a GET diagnostic settings operation. |
| category| String| Array of log categories and their retention policies |
| timeGrain | String | The granularity of metrics that are captured in ISO 8601 duration format. Must be PT1M (one minute)|
| enabled| Boolean | Specifies whether collection of that metric or log category is enabled for this resource|
| retentionPolicy| Complex Type| Describes the retention policy for a metric or log category. Used for storage account option only.|
| days| Int| Number of days to retain the metrics or logs. A value of 0 retains the logs indefinitely. Used for storage account option only. |

**Response**

200 OK


```json
{
    "id": "/subscriptions/1e42591f-1f0c-4c5a-b7f2-a268f6105ec5/resourcegroups/adf/providers/microsoft.datafactory/factories/shloadobetest2/providers/microsoft.insights/diagnosticSettings/service",
    "type": null,
    "name": "service",
    "location": null,
    "kind": null,
    "tags": null,
    "properties": {
        "storageAccountId": "/subscriptions/<subID>/resourceGroups/<resourceGroupName>//providers/Microsoft.Storage/storageAccounts/<storageAccountName>",
        "serviceBusRuleId": "/subscriptions/<subID>/resourceGroups/<resourceGroupName>//providers/Microsoft.EventHub/namespaces/<eventHubName>/authorizationrules/RootManageSharedAccessKey",
        "workspaceId": "/subscriptions/<subID>/resourceGroups/<resourceGroupName>//providers/Microsoft.OperationalInsights/workspaces/<OMSName>",
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

Get information about diagnostics setting in Azure Monitor REST API

**Request**
```
GET
https://management.azure.com/{resource-id}/providers/microsoft.insights/diagnosticSettings/service?api-version={api-version}
```

**Headers**
* Replace `{api-version}` with `2016-09-01`.
* Replace `{resource-id}` with the resource ID of the resource for which you would like to edit diagnostic settings. For more information Using Resource groups to manage your Azure resources.
* Set the `Content-Type` header to `application/json`.
* Set the authorization header to a JSON Web Token that you obtain from Azure Active Directory. For more information, see Authenticating requests.

**Response**

200 OK

```json
{
    "id": "/subscriptions/1e42591f-1f0c-4c5a-b7f2-a268f6105ec5/resourcegroups/adf/providers/microsoft.datafactory/factories/shloadobetest2/providers/microsoft.insights/diagnosticSettings/service",
    "type": null,
    "name": "service",
    "location": null,
    "kind": null,
    "tags": null,
    "properties": {
        "storageAccountId": "/subscriptions/1e42591f-1f0c-4c5a-b7f2-a268f6105ec5/resourceGroups/shloprivate/providers/Microsoft.Storage/storageAccounts/azmonlogs",
        "serviceBusRuleId": "/subscriptions/1e42591f-1f0c-4c5a-b7f2-a268f6105ec5/resourceGroups/shloprivate/providers/Microsoft.EventHub/namespaces/shloeventhub/authorizationrules/RootManageSharedAccessKey",
        "workspaceId": "/subscriptions/0ee78edb-a0ad-456c-a0a2-901bf542c102/resourceGroups/ADF/providers/Microsoft.OperationalInsights/workspaces/mihaipie",
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
More info here](https://msdn.microsoft.com/en-us/library/azure/dn931932.aspx)

## Schema of Logs & Events

### Activity Run Logs Attributes

```json
{  
   "Level": "",
   "correlationId":"",
   "time":"",
   "activityRunId":"",
   "pipelineRunId":"",
   "resourceId":"",
   "category":"ActivityRuns",
   "level":"Informational",
   "operationName":"",
   "pipelineName":"",
   "activityName":"",
   "start":"",
   "end":"",
   "properties:" 
       {
          "Input": "{
              "source": {
                "type": "BlobSource"
              },
              "sink": {
                "type": "BlobSink"
              }
           }",
          "Output": "{"dataRead":121,"dataWritten":121,"copyDuration":5,
               "throughput":0.0236328132,"errors":[]}",
          "Error": "{
              "errorCode": "null",
              "message": "null",
              "failureType": "null",
              "target": "CopyBlobtoBlob"
        }
    }
}
```

| Property | Type | Description | Example |
| --- | --- | --- | --- |
| Level |String | Level of the diagnostic logs. Level 4 always is the case for activity run logs. | `4`  |
| correlationId |String | Unique ID to track a particular request end-to-end | `319dc6b4-f348-405e-b8d7-aafc77b73e77` |
| time | String | Time of the event in timespan, UTC format | `YYYY-MM-DDTHH:MM:SS.00000Z` | `2017-06-28T21:00:27.3534352Z` |
|activityRunId| String| ID of the activity run | `3a171e1f-b36e-4b80-8a54-5625394f4354` |
|pipelineRunId| String| ID of the pipeline run | `9f6069d6-e522-4608-9f99-21807bfc3c70` |
|resourceId| String | Associated resource ID for the data factory resource | `/SUBSCRIPTIONS/<subID>/RESOURCEGROUPS/<resourceGroupName>/PROVIDERS/MICROSOFT.DATAFACTORY/FACTORIES/<dataFactoryName>` |
|category| String | Category of Diagnostic Logs. Set this property to "ActivityRuns" | `ActivityRuns` |
|level| String | Level of the diagnostic logs. Set this property to "Informational" | `Informational` |
|operationName| String |Name of the activity with status. If the status is the start heartbeat, it is `MyActivity -`. If the status is the end heartbeat, it is `MyActivity - Succeeded` with final status | `MyActivity - Succeeded` |
|pipelineName| String | Name of the pipeline | `MyPipeline` |
|activityName| String | Name of the activity | `MyActivity` |
|start| String | Start of the activity run in timespan, UTC format | `2017-06-26T20:55:29.5007959Z`|
|end| String | Ends of the activity run in timespan, UTC format. If the activity has not ended yet (diagnostic log for an activity starting), a default value of `1601-01-01T00:00:00Z` is set.  | `2017-06-26T20:55:29.5007959Z` |


### Pipeline Run Logs Attributes

```json
{  
   "Level": "",
   "correlationId":"",
   "time":"",
   "runId":"",
   "resourceId":"",
   "category":"PipelineRuns",
   "level":"Informational",
   "operationName":"",
   "pipelineName":"",
   "start":"",
   "end":"",
   "status":"",
   "properties": 
    {
      "Parameters": {
        "<parameter1Name>": "<parameter1Value>"
      },
      "SystemParameters": {
        "ExecutionStart": "",
        "TriggerId": "",
        "SubscriptionId": ""
      }
    }
}
```

| Property | Type | Description | Example |
| --- | --- | --- | --- |
| Level |String | Level of the diagnostic logs. Level 4 is the case for activity run logs. | `4`  |
| correlationId |String | Unique ID to track a particular request end-to-end | `319dc6b4-f348-405e-b8d7-aafc77b73e77` |
| time | String | Time of the event in timespan, UTC format | `YYYY-MM-DDTHH:MM:SS.00000Z` | `2017-06-28T21:00:27.3534352Z` |
|runId| String| ID of the pipeline run | `9f6069d6-e522-4608-9f99-21807bfc3c70` |
|resourceId| String | Associated resource ID for the data factory resource | `/SUBSCRIPTIONS/<subID>/RESOURCEGROUPS/<resourceGroupName>/PROVIDERS/MICROSOFT.DATAFACTORY/FACTORIES/<dataFactoryName>` |
|category| String | Category of Diagnostic Logs. Set this property to "PipelineRuns" | `PipelineRuns` |
|level| String | Level of the diagnostic logs. Set this property to  "Informational" | `Informational` |
|operationName| String |Name of the pipeline with status. "Pipeline - Succeeded" with final status when pipeline run is completed| `MyPipeline - Succeeded` |
|pipelineName| String | Name of the pipeline | `MyPipeline` |
|start| String | Start of the activity run in timespan, UTC format | `2017-06-26T20:55:29.5007959Z`|
|end| String | End of the activity runs in timespan, UTC format. If the activity has not ended yet (diagnostic log for an activity starting), a default value of `1601-01-01T00:00:00Z` is set.  | `2017-06-26T20:55:29.5007959Z` |
|status| String | Final status of the pipeline run (Succeeded or Failed) | `Succeeded`|


### Trigger Run Logs Attributes

```json
{ 
   "Level": "",
   "correlationId":"",
   "time":"",
   "triggerId":"",
   "resourceId":"",
   "category":"TriggerRuns",
   "level":"Informational",
   "operationName":"",
   "triggerName":"",
   "triggerType":"",
   "triggerEvent":"",
   "start":"",
   "status":"",
   "properties":
   {
      "Parameters": {
        "TriggerTime": "",
       "ScheduleTime": ""
      },
      "SystemParameters": {}
    }
} 

```

| Property | Type | Description | Example |
| --- | --- | --- | --- |
| Level |String | Level of the diagnostic logs. Set to level 4 for activity run logs. | `4`  |
| correlationId |String | Unique ID to track a particular request end-to-end | `319dc6b4-f348-405e-b8d7-aafc77b73e77` |
| time | String | Time of the event in timespan, UTC format | `YYYY-MM-DDTHH:MM:SS.00000Z` | `2017-06-28T21:00:27.3534352Z` |
|triggerId| String| ID of the trigger run | `08587023010602533858661257311` |
|resourceId| String | Associated resource ID for the data factory resource | `/SUBSCRIPTIONS/<subID>/RESOURCEGROUPS/<resourceGroupName>/PROVIDERS/MICROSOFT.DATAFACTORY/FACTORIES/<dataFactoryName>` |
|category| String | Category of Diagnostic Logs. Set this property to "PipelineRuns" | `PipelineRuns` |
|level| String | Level of the diagnostic logs. Set this property to "Informational" | `Informational` |
|operationName| String |Name of the trigger with final status whether it successfully fired. "MyTrigger - Succeeded" if the heartbeat was successful| `MyTrigger - Succeeded` |
|triggerName| String | Name of the trigger | `MyTrigger` |
|triggerType| String | Type of the trigger (Manual trigger or Schedule Trigger) | `ScheduleTrigger` |
|triggerEvent| String | Event of the trigger | `ScheduleTime - 2017-07-06T01:50:25Z` |
|start| String | Start of trigger fire in timespan, UTC format | `2017-06-26T20:55:29.5007959Z`|
|status| String | Final status of whether trigger successfully fired (Succeeded or Failed) | `Succeeded`|

### Metrics

Azure Monitor enables you to consume telemetry to gain visibility into the performance and health of your workloads on Azure. The most important type of Azure telemetry data is the metrics (also called performance counters) emitted by most Azure resources. Azure Monitor provides several ways to configure and consume these metrics for monitoring and troubleshooting.

ADFV2 emits the following metrics

| **Metric**           | **Metric Display Name**         | **Unit** | **Aggregation Type** | **Description**                                       |
|----------------------|---------------------------------|----------|----------------------|-------------------------------------------------------|
| PipelineSucceededRun | Succeeded pipeline runs metrics | Count    | Total                | Total pipelines runs succeeded within a minute window |
| PipelineFailedRuns   | Failed pipeline runs metrics    | Count    | Total                | Total pipelines runs failed within a minute window    |
| ActiviySucceededRuns | Succeeded activity runs metrics | Count    | Total                | Total activity runs succeeded within a minute window  |
| ActivityFailedRuns   | Failed activity runs metrics    | Count    | Total                | Total activity runs failed within a minute window     |
| TriggerSucceededRuns | Succeeded trigger runs metrics  | Count    | Total                | Total trigger runs succeeded within a minute window   |
| TriggerFailedRuns    | Failed trigger runs metrics     | Count    | Total                | Total trigger runs failed within a minute window      |

To access the metrics, follow the instructions in the article - https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview-metrics 

## Next steps
See [Monitor and manage pipelines programmatically](monitor-programmatically.md) article to learn about monitoring and managing pipelines by running . 