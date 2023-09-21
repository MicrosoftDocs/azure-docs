---
title: Pass trigger information to pipeline
description: Learn how to reference trigger metadata in pipeline
ms.service: data-factory
ms.subservice: orchestration
author: chez-charlie
ms.author: chez
ms.reviewer: 
ms.topic: conceptual
ms.date: 07/20/2023
---

# Reference trigger metadata in pipeline runs

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes how trigger metadata, such as trigger start time, can be used in pipeline run.

Pipeline sometimes needs to understand and reads metadata from trigger that invokes it. For instance, with Tumbling Window Trigger run, based upon window start and end time, pipeline will process different data slices or folders. In Azure Data Factory, we use Parameterization and [System Variable](control-flow-system-variables.md) to pass meta data from trigger to pipeline.

This pattern is especially useful for [Tumbling Window Trigger](how-to-create-tumbling-window-trigger.md), where trigger provides window start and end time, and [Custom Event Trigger](how-to-create-custom-event-trigger.md), where trigger parse and process values in [custom defined _data_ field](../event-grid/event-schema.md).

> [!NOTE]
> Different trigger type provides different meta data information. For more information, see [System Variable](control-flow-system-variables.md)

## Data Factory UI

This section shows you how to pass meta data information from trigger to pipeline, within the Azure Data Factory User Interface.

1. Go to the **Authoring Canvas** and edit a pipeline

1. Select on the blank canvas to bring up pipeline settings. Don’t select any activity. You may need to pull up the setting panel from the bottom of the canvas, as it may have been collapsed

1. Select **Parameters** section and select **+ New** to add parameters

    :::image type="content" source="media/how-to-use-trigger-parameterization/01-create-parameter.png" alt-text="Screen shot of pipeline setting showing how to define parameters in pipeline.":::

1. Add triggers to pipeline, by clicking on **+ Trigger**.

1. Create or attach a trigger to the pipeline, and select **OK**

1. After selecting **OK**, another **New trigger** page is presented with a list of the parameters specified for the pipeline, as shown in the following screenshot. On that page, fill in trigger meta data for each parameter. Use format defined in [System Variable](control-flow-system-variables.md) to retrieve trigger information. You don't need to fill in the information for all parameters, just the ones that will assume trigger metadata values. For instance, here we assign trigger run start time to *parameter_1*.

    :::image type="content" source="media/how-to-use-trigger-parameterization/02-pass-in-system-variable.png" alt-text="Screenshot of trigger definition page showing how to pass trigger information to pipeline parameters.":::

1. To use the values in pipeline, utilize parameters _@pipeline().parameters.parameterName_, __not__ system variable, in pipeline definitions. For instance, in our case, to read trigger start time, we'll reference @pipeline().parameters.parameter_1.

## JSON schema

To pass in trigger information to pipeline runs, both the trigger and the pipeline json need to be updated with _parameters_ section.

### Pipeline definition

Under **properties** section, add parameter definitions to **parameters** section

```json
{
    "name": "demo_pipeline",
    "properties": {
        "activities": [
            {
                "name": "demo_activity",
                "type": "WebActivity",
                "dependsOn": [],
                "policy": {
                    "timeout": "7.00:00:00",
                    "retry": 0,
                    "retryIntervalInSeconds": 30,
                    "secureOutput": false,
                    "secureInput": false
                },
                "userProperties": [],
                "typeProperties": {
                    "url": {
                        "value": "@pipeline().parameters.parameter_2",
                        "type": "Expression"
                    },
                    "method": "GET"
                }
            }
        ],
        "parameters": {
            "parameter_1": {
                "type": "string"
            },
            "parameter_2": {
                "type": "string"
            },
            "parameter_3": {
                "type": "string"
            },
            "parameter_4": {
                "type": "string"
            },
            "parameter_5": {
                "type": "string"
            }
        },
        "annotations": [],
        "lastPublishTime": "2021-02-24T03:06:23Z"
    },
    "type": "Microsoft.DataFactory/factories/pipelines"
}
```

### Trigger definition

Under **pipelines** section, assign parameter values in **parameters** section. You don't need to fill in the information for all parameters, just the ones that will assume trigger metadata values.

```json
{
    "name": "trigger1",
    "properties": {
        "annotations": [],
        "runtimeState": "Started",
        "pipelines": [
            {
                "pipelineReference": {
                    "referenceName": "demo_pipeline",
                    "type": "PipelineReference"
                },
                "parameters": {
                    "parameter_1": "@trigger().startTime"
                }
            }
        ],
        "type": "ScheduleTrigger",
        "typeProperties": {
            "recurrence": {
                "frequency": "Minute",
                "interval": 15,
                "startTime": "2021-03-03T04:38:00Z",
                "timeZone": "UTC"
            }
        }
    }
}
```

### Use trigger information in pipeline

To use the values in pipeline, utilize parameters _@pipeline().parameters.parameterName_, __not__ system variable, in pipeline definitions.

## Next steps

For detailed information about triggers, see [Pipeline execution and triggers](concepts-pipeline-execution-triggers.md#trigger-execution-with-json).
