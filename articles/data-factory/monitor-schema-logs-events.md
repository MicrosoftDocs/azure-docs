---
title: Schema of logs and events 
description: Learn about the schema used by Azure Data Factory logs and events for monitoring.
author: nabhishek
ms.author: abnarain
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: monitoring
ms.topic: conceptual
ms.date: 10/25/2022
---

# Schema of logs and events

This article describes the schema used by Azure Data Factory logs and events for monitoring.

## Monitor schema
The following lists of attributes are used for monitoring.

### Activity-run log attributes

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
   "properties":
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
| **Level** |String | The level of the diagnostic logs. For activity-run logs, set the property value to 4. | `4` |
| **correlationId** |String | The unique ID for tracking a particular request. | `319dc6b4-f348-405e-b8d7-aafc77b73e77` |
| **time** | String | The time of the event in the timespan UTC format `YYYY-MM-DDTHH:MM:SS.00000Z`. | `2017-06-28T21:00:27.3534352Z` |
|**activityRunId**| String| The ID of the activity run. | `3a171e1f-b36e-4b80-8a54-5625394f4354` |
|**pipelineRunId**| String| The ID of the pipeline run. | `9f6069d6-e522-4608-9f99-21807bfc3c70` |
|**resourceId**| String | The ID associated with the data factory resource. | `/SUBSCRIPTIONS/<subID>/RESOURCEGROUPS/<resourceGroupName>/PROVIDERS/MICROSOFT.DATAFACTORY/FACTORIES/<dataFactoryName>` |
|**category**| String | The category of the diagnostic logs. Set the property value to `ActivityRuns`. | `ActivityRuns` |
|**level**| String | The level of the diagnostic logs. Set the property value to `Informational`. | `Informational` |
|**operationName**| String | The name of the activity with its status. If the activity is the start heartbeat, the property value is `MyActivity -`. If the activity is the end heartbeat, the property value is `MyActivity - Succeeded`. | `MyActivity - Succeeded` |
|**pipelineName**| String | The name of the pipeline. | `MyPipeline` |
|**activityName**| String | The name of the activity. | `MyActivity` |
|**start**| String | The start time of the activity runs in timespan UTC format. | `2017-06-26T20:55:29.5007959Z`|
|**end**| String | The end time of the activity runs in timespan UTC format. If the diagnostic log shows that an activity has started but not yet ended, the property value is `1601-01-01T00:00:00Z`. | `2017-06-26T20:55:29.5007959Z` |

### Pipeline-run log attributes

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
   "location": "",
   "properties":
    {
      "Parameters": {
        "<parameter1Name>": "<parameter1Value>"
      },
      "SystemParameters": {
        "ExecutionStart": "",
        "TriggerId": "",
        "SubscriptionId": ""
      },
      "Predecessors": [
            {
                "Name": "",
                "Id": "",
                "InvokedByType": ""
            }
        ]
    }
}
```

| Property | Type | Description | Example |
| --- | --- | --- | --- |
| **Level** |String | The level of the diagnostic logs. For activity-run logs, set the property value to 4. | `4` |
| **correlationId** |String | The unique ID for tracking a particular request. | `319dc6b4-f348-405e-b8d7-aafc77b73e77` |
| **time** | String | The time of the event in the timespan UTC format `YYYY-MM-DDTHH:MM:SS.00000Z`. | `2017-06-28T21:00:27.3534352Z` |
|**runId**| String| The ID of the pipeline run. | `9f6069d6-e522-4608-9f99-21807bfc3c70` |
|**resourceId**| String | The ID associated with the data factory resource. | `/SUBSCRIPTIONS/<subID>/RESOURCEGROUPS/<resourceGroupName>/PROVIDERS/MICROSOFT.DATAFACTORY/FACTORIES/<dataFactoryName>` |
|**category**| String | The category of the diagnostic logs. Set the property value to `PipelineRuns`. | `PipelineRuns` |
|**level**| String | The level of the diagnostic logs. Set the property value to `Informational`. | `Informational` |
|**operationName**| String | The name of the pipeline along with its status. After the pipeline run is finished, the property value is `Pipeline - Succeeded`. | `MyPipeline - Succeeded`. |
|**pipelineName**| String | The name of the pipeline. | `MyPipeline` |
|**start**| String | The start time of the activity runs in timespan UTC format. | `2017-06-26T20:55:29.5007959Z`. |
|**end**| String | The end time of the activity runs in timespan UTC format. If the diagnostic log shows an activity has started but not yet ended, the property value is `1601-01-01T00:00:00Z`.  | `2017-06-26T20:55:29.5007959Z` |
|**status**| String | The final status of the pipeline run. Possible property values are `Succeeded` and `Failed`. | `Succeeded`|
|**location**| String | The Azure region of the pipeline run. | `eastasia`|
|**predecessors**| String | The calling object of the pipeline along with ID. | `Manual`|

### Trigger-run log attributes

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
| **Level** |String | The level of the diagnostic logs. For activity-run logs, set the property value to 4. | `4` |
| **correlationId** |String | The unique ID for tracking a particular request. | `319dc6b4-f348-405e-b8d7-aafc77b73e77` |
| **time** | String | The time of the event in the timespan UTC format `YYYY-MM-DDTHH:MM:SS.00000Z`. | `2017-06-28T21:00:27.3534352Z` |
|**triggerId**| String| The ID of the trigger run. | `08587023010602533858661257311` |
|**resourceId**| String | The ID associated with the data factory resource. | `/SUBSCRIPTIONS/<subID>/RESOURCEGROUPS/<resourceGroupName>/PROVIDERS/MICROSOFT.DATAFACTORY/FACTORIES/<dataFactoryName>` |
|**category**| String | The category of the diagnostic logs. Set the property value to `PipelineRuns`. | `PipelineRuns` |
|**level**| String | The level of the diagnostic logs. Set the property value to `Informational`. | `Informational` |
|**operationName**| String | The name of the trigger with its final status, which indicates whether the trigger successfully fired. If the heartbeat was successful, the property value is `MyTrigger - Succeeded`. | `MyTrigger - Succeeded` |
|**triggerName**| String | The name of the trigger. | `MyTrigger` |
|**triggerType**| String | The type of the trigger. Possible property values are `Manual Trigger` and `Schedule Trigger`. | `ScheduleTrigger` |
|**triggerEvent**| String | The event of the trigger. | `ScheduleTime - 2017-07-06T01:50:25Z` |
|**start**| String | The start time of the trigger firing in timespan UTC format. | `2017-06-26T20:55:29.5007959Z`|
|**status**| String | The final status showing whether the trigger successfully fired. Possible property values are `Succeeded` and `Failed`. | `Succeeded`|

### SSIS integration runtime log attributes

Here are the log attributes of SQL Server Integration Services (SSIS) integration runtime (IR) start, stop, and maintenance operations.

```json
{
   "time": "",
   "operationName": "",
   "category": "",
   "correlationId": "",
   "dataFactoryName": "",
   "integrationRuntimeName": "",
   "level": "",
   "resultType": "",
   "properties": {
      "message": ""
   },
   "resourceId": ""
}
```

| Property                   | Type   | Description                                                   | Example                        |
| -------------------------- | ------ | ------------------------------------------------------------- | ------------------------------ |
| **time**                   | String | The time of event in UTC format: `YYYY-MM-DDTHH:MM:SS.00000Z` | `2017-06-28T21:00:27.3534352Z` |
| **operationName**          | String | The name of your SSIS IR operation                            | `Start/Stop/Maintenance/Heartbeat` |
| **category**               | String | The category of diagnostic logs                               | `SSISIntegrationRuntimeLogs` |
| **correlationId**          | String | The unique ID for tracking a particular operation             | `f13b159b-515f-4885-9dfa-a664e949f785Deprovision0059035558` |
| **dataFactoryName**        | String | The name of your data factory                                          | `MyADFv2` |
| **integrationRuntimeName** | String | The name of your SSIS IR                                      | `MySSISIR` |
| **level**                  | String | The level of diagnostic logs                                  | `Informational` |
| **resultType**             | String | The result of your SSIS IR operation                          | `Started/InProgress/Succeeded/Failed/Healthy/Unhealthy` |
| **message**                | String | The output message of your SSIS IR operation                  | `The stopping of your SSIS integration runtime has succeeded.` |
| **resourceId**             | String | The unique ID of your data factory resource                            | `/SUBSCRIPTIONS/<subscriptionID>/RESOURCEGROUPS/<resourceGroupName>/PROVIDERS/MICROSOFT.DATAFACTORY/FACTORIES/<dataFactoryName>` |

### SSIS event message context log attributes

Here are the log attributes of conditions related to event messages that are generated by SSIS package executions on your SSIS IR. They convey similar information as an [SSIS catalog (SSISDB) event message context table or view](/sql/integration-services/system-views/catalog-event-message-context) that shows runtime values of many SSIS package properties. They're generated when you select `Basic/Verbose` logging level and useful for debugging or compliance checking.

```json
{
   "time": "",
   "operationName": "",
   "category": "",
   "correlationId": "",
   "dataFactoryName": "",
   "integrationRuntimeName": "",
   "level": "",
   "properties": {
      "operationId": "",
      "contextDepth": "",
      "packagePath": "",
      "contextType": "",
      "contextSourceName": "",
      "contextSourceId": "",
      "propertyName": "",
      "propertyValue": ""
   },
   "resourceId": ""
}
```

| Property                   | Type   | Description                                                          | Example                        |
| -------------------------- | ------ | -------------------------------------------------------------------- | ------------------------------ |
| **time**                   | String | The time of event in UTC format: `YYYY-MM-DDTHH:MM:SS.00000Z`        | `2017-06-28T21:00:27.3534352Z` |
| **operationName**          | String | Set to `YourSSISIRName-SSISPackageEventMessageContext`       | `mysqlmissisir-SSISPackageEventMessageContext` |
| **category**               | String | The category of diagnostic logs                                      | `SSISPackageEventMessageContext` |
| **correlationId**          | String | The unique ID for tracking a particular operation                    | `e55700df-4caf-4e7c-bfb8-78ac7d2f28a0` |
| **dataFactoryName**        | String | The name of your data factory                                                 | `MyADFv2` |
| **integrationRuntimeName** | String | The name of your SSIS IR                                             | `MySSISIR` |
| **level**                  | String | The level of diagnostic logs                                         | `Informational` |
| **operationId**            | String | The unique ID for tracking a particular operation in SSISDB          | `1` (1 signifies operations related to packages *not* stored in SSISDB/invoked via T-SQL.) |
| **contextDepth**           | String | The depth of your event message context                              | `0` (0 signifies the context before package execution starts, 1 signifies the context when an error occurs, and it increases as the context is further from the error.) |
| **packagePath**            | String | The path of package object as your event message context source      | `\Package` |
| **contextType**            | String | The type of package object as your event message context source      | `60` (See [more context types](/sql/integration-services/system-views/catalog-event-message-context#remarks).) |
| **contextSourceName**      | String | The name of package object as your event message context source      | `MyPackage` |
| **contextSourceId**        | String | The unique ID of package object as your event message context source | `{E2CF27FB-EA48-41E9-AF6F-3FE938B4ADE1}` |
| **propertyName**           | String | The name of package property for your event message context source   | `DelayValidation` |
| **propertyValue**          | String | The value of package property for your event message context source  | `False` |
| **resourceId**             | String | The unique ID of your data factory resource                                   | `/SUBSCRIPTIONS/<subscriptionID>/RESOURCEGROUPS/<resourceGroupName>/PROVIDERS/MICROSOFT.DATAFACTORY/FACTORIES/<dataFactoryName>` |

### SSIS event messages log attributes

Here are the log attributes of event messages that are generated by SSIS package executions on your SSIS IR. They convey similar information as an [SSISDB event messages table or view](/sql/integration-services/system-views/catalog-event-messages) that shows the detailed text or metadata of event messages. They're generated at any logging level except `None`.

```json
{
   "time": "",
   "operationName": "",
   "category": "",
   "correlationId": "",
   "dataFactoryName": "",
   "integrationRuntimeName": "",
   "level": "",
   "properties": {
      "operationId": "",
      "messageTime": "",
      "messageType": "",
      "messageSourceType": "",
      "message": "",
      "packageName": "",
      "eventName": "",
      "messageSourceName": "",
      "messageSourceId": "",
      "subcomponentName": "",
      "packagePath": "",
      "executionPath": "",
      "threadId": ""
   }
}
```

| Property                   | Type   | Description                                                        | Example                        |
| -------------------------- | ------ | ------------------------------------------------------------------ | ------------------------------ |
| **time**                   | String | The time of event in UTC format: `YYYY-MM-DDTHH:MM:SS.00000Z`      | `2017-06-28T21:00:27.3534352Z` |
| **operationName**          | String | Set to `YourSSISIRName-SSISPackageEventMessages`           | `mysqlmissisir-SSISPackageEventMessages` |
| **category**               | String | The category of diagnostic logs                                    | `SSISPackageEventMessages` |
| **correlationId**          | String | The unique ID for tracking a particular operation                  | `e55700df-4caf-4e7c-bfb8-78ac7d2f28a0` |
| **dataFactoryName**        | String | The name of your data factory                                               | `MyADFv2` |
| **integrationRuntimeName** | String | The name of your SSIS IR                                           | `MySSISIR` |
| **level**                  | String | The level of diagnostic logs                                       | `Informational` |
| **operationId**            | String | The unique ID for tracking a particular operation in SSISDB        | `1` (1 signifies operations related to packages *not* stored in SSISDB/invoked via T-SQL.) |
| **messageTime**            | String | The time when your event message is created in UTC format          | `2017-06-28T21:00:27.3534352Z` |
| **messageType**            | String | The type of your event message                                     | `70` (See [more message types](/sql/integration-services/system-views/catalog-operation-messages-ssisdb-database#remarks).) |
| **messageSourceType**      | String | The type of your event message source                              | `20` (See [more message source types](/sql/integration-services/system-views/catalog-operation-messages-ssisdb-database#remarks).) |
| **message**                | String | The text of your event message                                     | `MyPackage:Validation has started.` |
| **packageName**            | String | The name of your executed package file                             | `MyPackage.dtsx` |
| **eventName**              | String | The name of related run-time event                                 | `OnPreValidate` |
| **messageSourceName**      | String | The name of package component as your event message source         | `Data Flow Task` |
| **messageSourceId**        | String | The unique ID of package component as your event message source    | `{1a45a5a4-3df9-4f02-b818-ebf583829ad2}    ` |
| **subcomponentName**       | String | The name of data flow component as your event message source       | `SSIS.Pipeline` |
| **packagePath**            | String | The path of package object as your event message source            | `\Package\Data Flow Task` |
| **executionPath**          | String | The full path from parent package to executed component            | `\Transformation\Data Flow Task` (This path also captures component iterations.) |
| **threadId**               | String | The unique ID of thread executed when your event message is logged | `{1a45a5a4-3df9-4f02-b818-ebf583829ad2}    ` |

### SSIS executable statistics log attributes

Here are the log attributes of executable statistics that are generated by SSIS package executions on your SSIS IR, where executables are containers or tasks in the control flow of packages. They convey similar information as an [SSISDB executable statistics table or view](/sql/integration-services/system-views/catalog-executable-statistics) that shows a row for each running executable, including its iterations. They're generated at any logging level except `None` and useful for identifying task-level bottlenecks or failures.

```json
{
   "time": "",
   "operationName": "",
   "category": "",
   "correlationId": "",
   "dataFactoryName": "",
   "integrationRuntimeName": "",
   "level": "",
   "properties": {
      "executionId": "",
      "executionPath": "",
      "startTime": "",
      "endTime": "",
      "executionDuration": "",
      "executionResult": "",
      "executionValue": ""
   },
   "resourceId": ""
}
```

| Property                   | Type   | Description                                                      | Example                        |
| -------------------------- | ------ | ---------------------------------------------------------------- | ------------------------------ |
| **time**                   | String | The time of event in UTC format: `YYYY-MM-DDTHH:MM:SS.00000Z`    | `2017-06-28T21:00:27.3534352Z` |
| **operationName**          | String | Set to `YourSSISIRName-SSISPackageExecutableStatistics`  | `mysqlmissisir-SSISPackageExecutableStatistics` |
| **category**               | String | The category of diagnostic logs                                  | `SSISPackageExecutableStatistics` |
| **correlationId**          | String | The unique ID for tracking a particular operation                | `e55700df-4caf-4e7c-bfb8-78ac7d2f28a0` |
| **dataFactoryName**        | String | The name of your data factory                                             | `MyADFv2` |
| **integrationRuntimeName** | String | The name of your SSIS IR                                         | `MySSISIR` |
| **level**                  | String | The level of diagnostic logs                                     | `Informational` |
| **executionId**            | String | The unique ID for tracking a particular execution in SSISDB      | `1` (1 signifies executions related to packages *not* stored in SSISDB/invoked via T-SQL.) |
| **executionPath**          | String | The full path from parent package to executed component          | `\Transformation\Data Flow Task` (This path also captures component iterations.) |
| **startTime**              | String | The time when executable enters pre-execute phase in UTC format  | `2017-06-28T21:00:27.3534352Z` |
| **endTime**                | String | The time when executable enters post-execute phase in UTC format | `2017-06-28T21:00:27.3534352Z` |
| **executionDuration**      | String | The running time of executable in milliseconds                   | `1,125` |
| **executionResult**        | String | The result of running executable                                 | `0` (0 signifies success, 1 signifies failure, 2 signifies completion, and 3 signifies cancellation.) |
| **executionValue**         | String | The user-defined value returned by running executable            | `1` |
| **resourceId**             | String | The unique ID of your data factory resource                               | `/SUBSCRIPTIONS/<subscriptionID>/RESOURCEGROUPS/<resourceGroupName>/PROVIDERS/MICROSOFT.DATAFACTORY/FACTORIES/<dataFactoryName>` |

### SSIS execution component phases log attributes

Here are the log attributes of runtime statistics for data flow components that are generated by SSIS package executions on your SSIS IR. They convey similar information as an [SSISDB execution component phases table or view](/sql/integration-services/system-views/catalog-execution-component-phases) that shows the time spent by data flow components in all their execution phases. They're generated when you select `Performance/Verbose` logging level and useful for capturing data flow execution statistics.

```json
{
   "time": "",
   "operationName": "",
   "category": "",
   "correlationId": "",
   "dataFactoryName": "",
   "integrationRuntimeName": "",
   "level": "",
   "properties": {
      "executionId": "",
      "packageName": "",
      "taskName": "",
      "subcomponentName": "",
      "phase": "",
      "startTime": "",
      "endTime": "",
      "executionPath": ""
   },
   "resourceId": ""
}
```

| Property                   | Type   | Description                                                         | Example                        |
| -------------------------- | ------ | ------------------------------------------------------------------- | ------------------------------ |
| **time**                   | String | The time of event in UTC format: `YYYY-MM-DDTHH:MM:SS.00000Z`       | `2017-06-28T21:00:27.3534352Z` |
| **operationName**          | String | Set to `YourSSISIRName-SSISPackageExecutionComponentPhases` | `mysqlmissisir-SSISPackageExecutionComponentPhases` |
| **category**               | String | The category of diagnostic logs                                     | `SSISPackageExecutionComponentPhases` |
| **correlationId**          | String | The unique ID for tracking a particular operation                   | `e55700df-4caf-4e7c-bfb8-78ac7d2f28a0` |
| **dataFactoryName**        | String | The name of your data factory                                                | `MyADFv2` |
| **integrationRuntimeName** | String | The name of your SSIS IR                                            | `MySSISIR` |
| **level**                  | String | The level of diagnostic logs                                        | `Informational` |
| **executionId**            | String | The unique ID for tracking a particular execution in SSISDB         | `1` (1 signifies executions related to packages *not* stored in SSISDB/invoked via T-SQL.) |
| **packageName**            | String | The name of your executed package file                              | `MyPackage.dtsx` |
| **taskName**               | String | The name of executed data flow task                                 | `Data Flow Task` |
| **subcomponentName**       | String | The name of data flow component                                     | `Derived Column` |
| **phase**                  | String | The name of execution phase                                         | `AcquireConnections` |
| **startTime**              | String | The time when execution phase starts in UTC format                  | `2017-06-28T21:00:27.3534352Z` |
| **endTime**                | String | The time when execution phase ends in UTC format                    | `2017-06-28T21:00:27.3534352Z` |
| **executionPath**          | String | The path of execution for data flow task                            | `\Transformation\Data Flow Task` |
| **resourceId**             | String | The unique ID of your data factory resource                                  | `/SUBSCRIPTIONS/<subscriptionID>/RESOURCEGROUPS/<resourceGroupName>/PROVIDERS/MICROSOFT.DATAFACTORY/FACTORIES/<dataFactoryName>` |

### SSIS execution data statistics log attributes

Here are the log attributes of data movements through each leg of data flow pipelines, from upstream to downstream components, that are generated by SSIS package executions on your SSIS IR. They convey similar information as an [SSISDB execution data statistics table or view](/sql/integration-services/system-views/catalog-execution-data-statistics) that shows row counts of data moved through data flow tasks. They're generated when you select `Verbose` logging level and useful for computing data flow throughput.

```json
{
   "time": "",
   "operationName": "",
   "category": "",
   "correlationId": "",
   "dataFactoryName": "",
   "integrationRuntimeName": "",
   "level": "",
   "properties": {
      "executionId": "",
      "packageName": "",
      "taskName": "",
      "dataflowPathIdString": "",
      "dataflowPathName": "",
      "sourceComponentName": "",
      "destinationComponentName": "",
      "rowsSent": "",
      "createdTime": "",
      "executionPath": ""
   },
   "resourceId": ""
}
```

| Property                     | Type   | Description                                                        | Example                        |
| ---------------------------- | ------ | ------------------------------------------------------------------ | ------------------------------ |
| **time**                     | String | The time of event in UTC format: `YYYY-MM-DDTHH:MM:SS.00000Z`      | `2017-06-28T21:00:27.3534352Z` |
| **operationName**            | String | Set to `YourSSISIRName-SSISPackageExecutionDataStatistics` | `mysqlmissisir-SSISPackageExecutionDataStatistics` |
| **category**                 | String | The category of diagnostic logs                                    | `SSISPackageExecutionDataStatistics` |
| **correlationId**            | String | The unique ID for tracking a particular operation                  | `e55700df-4caf-4e7c-bfb8-78ac7d2f28a0` |
| **dataFactoryName**          | String | The name of your data factory                                               | `MyADFv2` |
| **integrationRuntimeName**   | String | The name of your SSIS IR                                           | `MySSISIR` |
| **level**                    | String | The level of diagnostic logs                                       | `Informational` |
| **executionId**              | String | The unique ID for tracking a particular execution in SSISDB        | `1` (1 signifies executions related to packages *not* stored in SSISDB/invoked via T-SQL.) |
| **packageName**              | String | The name of your executed package file                             | `MyPackage.dtsx` |
| **taskName**                 | String | The name of executed data flow task                                | `Data Flow Task` |
| **dataflowPathIdString**     | String | The unique ID for tracking data flow path                          | `Paths[SQLDB Table3.ADO NET Source Output]` |
| **dataflowPathName**         | String | The name of data flow path                                         | `ADO NET Source Output` |
| **sourceComponentName**      | String | The name of data flow component that sends data                    | `SQLDB Table3` |
| **destinationComponentName** | String | The name of data flow component that receives data                 | `Derived Column` |
| **rowsSent**                 | String | The number of rows sent by source component                        | `500` |
| **createdTime**              | String | The time when row values are obtained in UTC format                | `2017-06-28T21:00:27.3534352Z` |
| **executionPath**            | String | The path of execution for data flow task                           | `\Transformation\Data Flow Task` |
| **resourceId**               | String | The unique ID of your data factory resource                                 | `/SUBSCRIPTIONS/<subscriptionID>/RESOURCEGROUPS/<resourceGroupName>/PROVIDERS/MICROSOFT.DATAFACTORY/FACTORIES/<dataFactoryName>` |

## Log Analytics schema

Log Analytics inherits the schema from Azure Monitor with the following exceptions:

* The first letter in each column name is capitalized. For example, the column name "correlationId" in Monitor is "CorrelationId" in Log Analytics.
* There's no "Level" column.
* The dynamic "properties" column is preserved as the following dynamic JSON blob type.

    | Azure Monitor column | Log Analytics column | Type |
    | --- | --- | --- |
    | $.properties.UserProperties | UserProperties | Dynamic |
    | $.properties.Annotations | Annotations | Dynamic |
    | $.properties.Input | Input | Dynamic |
    | $.properties.Output | Output | Dynamic |
    | $.properties.Error.errorCode | ErrorCode | int |
    | $.properties.Error.message | ErrorMessage | string |
    | $.properties.Error | Error | Dynamic |
    | $.properties.Predecessors | Predecessors | Dynamic |
    | $.properties.Parameters | Parameters | Dynamic |
    | $.properties.SystemParameters | SystemParameters | Dynamic |
    | $.properties.Tags | Tags | Dynamic |

## Next steps

[Monitor programmatically using SDKs](monitor-programmatically.md)
