---
title: System variables
titleSuffix: Azure Data Factory & Azure Synapse
description: This article describes system variables supported by Azure Data Factory and Azure Synapse Analytics. You can use these variables in expressions when defining entities within either service.
author: chez-charlie
ms.author: chez
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: orchestration
ms.custom: synapse
ms.topic: conceptual
ms.date: 10/20/2023
---

# System variables supported by Azure Data Factory and Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes system variables supported by Azure Data Factory and Azure Synapse. You can use these variables in expressions when defining entities within either service.

## Pipeline scope

These system variables can be referenced anywhere in the pipeline JSON.

| Variable Name | Description |
| --- | --- |
| @pipeline().DataFactory |Name of the data  or Synapse workspace the pipeline run is running in |
| @pipeline().Pipeline |Name of the pipeline |
| @pipeline().RunId |ID of the specific pipeline run |
| @pipeline().TriggerType |The type of trigger that invoked the pipeline (for example, `ScheduleTrigger`, `BlobEventsTrigger`). For a list of supported trigger types, see [Pipeline execution and triggers](concepts-pipeline-execution-triggers.md). A trigger type of `Manual` indicates that the pipeline was triggered manually. |
| @pipeline().TriggerId|ID of the trigger that invoked the pipeline |
| @pipeline().TriggerName|Name of the trigger that invoked the pipeline |
| @pipeline().TriggerTime|Time of the trigger run that invoked the pipeline. This is the time at which the trigger **actually** fired to invoke the pipeline run, and it may differ slightly from the trigger's scheduled time.  |
| @pipeline().GroupId | ID of the group to which pipeline run belongs. |
| @pipeline()?.TriggeredByPipelineName | Name of the pipeline that triggers the pipeline run. Applicable when the pipeline run is triggered by an ExecutePipeline activity. Evaluate to _Null_ when used in other circumstances. Note the question mark after @pipeline() |
| @pipeline()?.TriggeredByPipelineRunId | Run ID of the pipeline that triggers the pipeline run. Applicable when the pipeline run is triggered by an ExecutePipeline activity. Evaluate to _Null_ when used in other circumstances. Note the question mark after @pipeline() |

>[!NOTE]
>Trigger-related date/time system variables (in both pipeline and trigger scopes) return UTC dates in ISO 8601 format, for example, `2017-06-01T22:20:00.4061448Z`.

## Schedule trigger scope

These system variables can be referenced anywhere in the trigger JSON for triggers of type [ScheduleTrigger](concepts-pipeline-execution-triggers.md#schedule-trigger-with-json).

| Variable Name | Description |
| --- | --- |
| @trigger().scheduledTime |Time at which the trigger was scheduled to invoke the pipeline run. |
| @trigger().startTime |Time at which the trigger **actually** fired to invoke the pipeline run. This may differ slightly from the trigger's scheduled time. |

## Tumbling window trigger scope

These system variables can be referenced anywhere in the trigger JSON for triggers of type [TumblingWindowTrigger](concepts-pipeline-execution-triggers.md#tumbling-window-trigger).

| Variable Name | Description |
| --- | --- |
| @trigger().outputs.windowStartTime |Start of the window associated with the trigger run. |
| @trigger().outputs.windowEndTime |End of the window associated with the trigger run. |
| @trigger().scheduledTime |Time at which the trigger was scheduled to invoke the pipeline run. |
| @trigger().startTime |Time at which the trigger **actually** fired to invoke the pipeline run. This may differ slightly from the trigger's scheduled time. |

## Storage event trigger scope

These system variables can be referenced anywhere in the trigger JSON for triggers of type [BlobEventsTrigger](concepts-pipeline-execution-triggers.md#event-based-trigger).

| Variable Name | Description |
| --- | --- |
| @triggerBody().fileName  |Name of the file whose creation or deletion caused the trigger to fire.   |
| @triggerBody().folderPath  |Path to the folder that contains the file specified by `@triggerBody().fileName`. The first segment of the folder path is the name of the Azure Blob Storage container.  |
| @trigger().startTime |Time at which the trigger fired to invoke the pipeline run. |

   > [!NOTE]
   > If you are creating your pipeline and trigger in [Azure Synapse Analytics](../synapse-analytics/overview-what-is.md), you must use `@trigger().outputs.body.fileName` and `@trigger().outputs.body.folderPath` as parameters. Those two properties capture blob information. Use those properties instead of using `@triggerBody().fileName` and `@triggerBody().folderPath`.

## Custom event trigger scope

These system variables can be referenced anywhere in the trigger JSON for triggers of type [CustomEventsTrigger](concepts-pipeline-execution-triggers.md#event-based-trigger).

>[!NOTE]
>The service expects custom events to be formatted with [Azure Event Grid event schema](../event-grid/event-schema.md).

| Variable Name | Description
| --- | --- |
| @triggerBody().event.eventType | Type of events that triggered the Custom Event Trigger run. Event type is customer-defined field and take on any values of string type. |
| @triggerBody().event.subject | Subject of the custom event that caused the trigger to fire. |
| @triggerBody().event.data._keyName_ | Data field in custom event is a free from JSON blob, which customer can use to send messages and data. Please use data._keyName_ to reference each field. For example, @triggerBody().event.data.callback returns the value for the _callback_ field stored under _data_. |
| @trigger().startTime | Time at which the trigger fired to invoke the pipeline run. |

## Next steps

* For information about how these variables are used in expressions, see [Expression language & functions](control-flow-expression-language-functions.md).
* To use trigger scope system variables in pipeline, see [Reference trigger metadata in pipeline](how-to-use-trigger-parameterization.md)
