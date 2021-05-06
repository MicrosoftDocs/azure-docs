---
title: System variables in Azure Data Factory 
description: This article describes system variables supported by Azure Data Factory. You can use these variables in expressions when defining Data Factory entities.
author: chez-charlie
ms.author: chez
ms.reviewer: jburchel
ms.service: data-factory
ms.topic: conceptual
ms.date: 06/12/2018
---

# System variables supported by Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes system variables supported by Azure Data Factory. You can use these variables in expressions when defining Data Factory entities.

## Pipeline scope

These system variables can be referenced anywhere in the pipeline JSON.

| Variable Name | Description |
| --- | --- |
| @pipeline().DataFactory |Name of the data factory the pipeline run is running in |
| @pipeline().Pipeline |Name of the pipeline |
| @pipeline().RunId |ID of the specific pipeline run |
| @pipeline().TriggerType |The type of trigger that invoked the pipeline (for example, `ScheduleTrigger`, `BlobEventsTrigger`). For a list of supported trigger types, see [Pipeline execution and triggers in Azure Data Factory](concepts-pipeline-execution-triggers.md). A trigger type of `Manual` indicates that the pipeline was triggered manually. |
| @pipeline().TriggerId|ID of the trigger that invoked the pipeline |
| @pipeline().TriggerName|Name of the trigger that invoked the pipeline |
| @pipeline().TriggerTime|Time of the trigger run that invoked the pipeline. This is the time at which the trigger **actually** fired to invoke the pipeline run, and it may differ slightly from the trigger's scheduled time.  |

>[!NOTE]
>Trigger-related date/time system variables (in both pipeline and trigger scopes) return UTC dates in ISO 8601 format, for example, `2017-06-01T22:20:00.4061448Z`.

## Schedule trigger scope

These system variables can be referenced anywhere in the trigger JSON for triggers of type [ScheduleTrigger](concepts-pipeline-execution-triggers.md#schedule-trigger).

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
| @triggerBody().folderName  |Path to the folder that contains the file specified by `@triggerBody().fileName`. The first segment of the folder path is the name of the Azure Blob Storage container.  |
| @trigger().startTime |Time at which the trigger fired to invoke the pipeline run. |

## Custom event trigger scope

These system variables can be referenced anywhere in the trigger JSON for triggers of type [CustomEventsTrigger](concepts-pipeline-execution-triggers.md#event-based-trigger).

>[!NOTE]
>Azure Data Factory expects custom event to be formatted with [Azure Event Grid event schema](../event-grid/event-schema.md).

| Variable Name | Description
| --- | --- |
| @triggerBody().event.eventType | Type of events that triggered the Custom Event Trigger run. Event type is customer defined field and take on any values of string type. |
| @triggerBody().event.subject | Subject of the custom event that caused the trigger to fire. |
| @triggerBody().event.data._keyName_ | Data field in custom event is a free from JSON blob, which customer can use to send messages and data. Please use data._keyName_ to reference each field. For example, @triggerBody().event.data.callback returns the value for the _callback_ field stored under _data_. |
| @trigger().startTime | Time at which the trigger fired to invoke the pipeline run. |

## Next steps

* For information about how these variables are used in expressions, see [Expression language & functions](control-flow-expression-language-functions.md).
* To use trigger scope system variables in pipeline, see [Reference trigger metadata in pipeline](how-to-use-trigger-parameterization.md)
