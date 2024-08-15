---
title: Create tumbling window trigger dependencies
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to create dependency on a tumbling window trigger in Azure Data Factory and Synapse Analytics.
ms.author: makromer
author: kromerm
ms.subservice: orchestration
ms.topic: conceptual
ms.custom: synapse
ms.date: 10/20/2023
---

# Create a tumbling window trigger dependency
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides steps to create a dependency on a tumbling window trigger. For general information about tumbling window triggers, see [Create a tumbling window trigger](how-to-create-tumbling-window-trigger.md).

To build a dependency chain and make sure that a trigger is executed only after the successful execution of another trigger within the service, use this advanced feature to create a tumbling window dependency.

For a demonstration on how to create dependent pipelines by using a tumbling window trigger, watch the following video:

> [!VIDEO https://learn.microsoft.com/Shows/Azure-Friday/Create-dependent-pipelines-in-your-Azure-Data-Factory/player]

## Create a dependency in the UI

To create dependency on a trigger, select **Trigger** > **Advanced** > **New**. Then choose the trigger to depend on with the appropriate offset and size. Select **Finish** and publish the changes for the dependencies to take effect.

:::image type="content" source="media/tumbling-window-trigger-dependency/tumbling-window-dependency-01.png" alt-text="Screenshot that shows the dependency creation window." lightbox="media/tumbling-window-trigger-dependency/tumbling-window-dependency-01.png":::

## Tumbling window dependency properties

A tumbling window trigger with a dependency has the following properties:

```json
{
    "name": "MyTriggerName",
    "properties": {
        "type": "TumblingWindowTrigger",
        "runtimeState": <<Started/Stopped/Disabled - readonly>>,
        "typeProperties": {
            "frequency": <<Minute/Hour>>,
            "interval": <<int>>,
            "startTime": <<datetime>>,
            "endTime": <<datetime - optional>>,
            "delay": <<timespan - optional>>,
            "maxConcurrency": <<int>> (required, max allowed: 50),
            "retryPolicy": {
                "count": <<int - optional, default: 0>>,
                "intervalInSeconds": <<int>>,
            },
            "dependsOn": [
                {
                    "type": "TumblingWindowTriggerDependencyReference",
                    "size": <<timespan - optional>>,
                    "offset": <<timespan - optional>>,
                    "referenceTrigger": {
                        "referenceName": "MyTumblingWindowDependency1",
                        "type": "TriggerReference"
                    }
                },
                {
                    "type": "SelfDependencyTumblingWindowTriggerReference",
                    "size": <<timespan - optional>>,
                    "offset": <<timespan>>
                }
            ]
        }
    }
}
```

The following table provides the list of attributes needed to define a tumbling window dependency.

| Property name | Description  | Type | Required |
|---|---|---|---|
| `type`  | All the existing tumbling window triggers are displayed in this dropdown list. Choose the trigger to take dependency on.  | `TumblingWindowTriggerDependencyReference` or `SelfDependencyTumblingWindowTriggerReference` | Yes |
| `offset` | Offset of the dependency trigger. Provide a value in the timespan format. Both negative and positive offsets are allowed. This property is mandatory if the trigger is depending on itself. In all other cases, it's optional. Self-dependency should always be a negative offset. If no value is specified, the window is the same as the trigger itself. | Timespan<br/>(hh:mm:ss) | Self-Dependency: Yes<br/>Other: No |
| `size` | Size of the dependency tumbling window. Provide a positive timespan value. This property is optional. | Timespan<br/>(hh:mm:ss) | No  |

> [!NOTE]
> A tumbling window trigger can depend on a maximum of five other triggers.

## Tumbling window self-dependency properties

In scenarios where the trigger shouldn't proceed to the next window until the preceding window is successfully completed, build a self-dependency. A self-dependency trigger that's dependent on the success of earlier runs of itself within the preceding hour has the properties indicated in the following code.

> [!NOTE]
> If your triggered pipeline relies on the output of pipelines in previously triggered windows, we recommend using only tumbling window trigger self-dependency. To limit parallel trigger runs, set the maximum trigger concurrency.

```json
{
    "name": "DemoSelfDependency",
    "properties": {
        "runtimeState": "Started",
        "pipeline": {
            "pipelineReference": {
                "referenceName": "Demo",
                "type": "PipelineReference"
            }
        },
        "type": "TumblingWindowTrigger",
        "typeProperties": {
            "frequency": "Hour",
            "interval": 1,
            "startTime": "2018-10-04T00:00:00Z",
            "delay": "00:01:00",
            "maxConcurrency": 50,
            "retryPolicy": {
                "intervalInSeconds": 30
            },
            "dependsOn": [
                {
                    "type": "SelfDependencyTumblingWindowTriggerReference",
                    "size": "01:00:00",
                    "offset": "-01:00:00"
                }
            ]
        }
    }
}
```

## Usage scenarios and examples

The following scenarios show the use of tumbling window dependency properties.

### Dependency offset

:::image type="content" source="media/tumbling-window-trigger-dependency/tumbling-window-dependency-02.png" alt-text="Diagram that shows an offset example.":::

### Dependency size

:::image type="content" source="media/tumbling-window-trigger-dependency/tumbling-window-dependency-03.png" alt-text="Diagram that shows a size example.":::

### Self-dependency

:::image type="content" source="media/tumbling-window-trigger-dependency/tumbling-window-dependency-04.png" alt-text="Diagram that shows a self-dependency example.":::

### Dependency on another tumbling window trigger

The following example shows a daily telemetry processing job that depends on another daily job aggregating the last seven days of output and generates seven-day rolling window streams.

:::image type="content" source="media/tumbling-window-trigger-dependency/tumbling-window-dependency-05.png" alt-text="Diagram that shows a dependency example.":::

### Dependency on itself

The following example shows a daily job with no gaps in the output streams of the job.

:::image type="content" source="media/tumbling-window-trigger-dependency/tumbling-window-dependency-06.png" alt-text="Diagram that shows a self-dependency example with no gaps in the output streams.":::

## Monitor dependencies

You can monitor the dependency chain and the corresponding windows from the trigger run monitoring page. Go to **Monitoring** > **Trigger Runs**. If a tumbling window trigger has dependencies, the trigger name bears a hyperlink to a dependency monitoring view.

:::image type="content" source="media/tumbling-window-trigger-dependency/tumbling-window-dependency-07.png" alt-text="Screenshot that shows Monitor trigger runs.":::

Click through the trigger name to view trigger dependencies. The pane on the right shows trigger run information such as the run ID, window time, and status.

:::image type="content" source="media/tumbling-window-trigger-dependency/tumbling-window-dependency-08.png" alt-text="Screenshot that shows the Monitor dependencies list view.":::

You can see the status of the dependencies and windows for each dependent trigger. If one of the dependencies triggers fails, you must successfully rerun it for the dependent trigger to run.

A tumbling window trigger waits on dependencies for _seven days_ before timing out. After seven days, the trigger run fails.

> [!NOTE]
> A tumbling window trigger can't be canceled while it's in the **Waiting on dependency** state. The dependent activity must finish before the tumbling window trigger can be canceled. This restriction is by design to ensure that dependent activities can complete once they're started. It also helps to reduce the likelihood of unexpected results.

For a more visual way to view the trigger dependency schedule, select the Gantt view.

:::image type="content" source="media/tumbling-window-trigger-dependency/tumbling-window-dependency-09.png" alt-text="Screenshot that shows a monitor dependencies Gantt chart.":::

Transparent boxes show the dependency windows for each downstream-dependent trigger. Solid-colored boxes shown in the preceding image show individual window runs. Here are some tips for interpreting the Gantt chart view:

* Transparent boxes render blue when dependent windows are in a **Pending** or **Running** state.
* After all windows succeed for a dependent trigger, the transparent box turns green.
* Transparent boxes render red when a dependent window fails. Look for a solid red box to identify the failure window run.

To rerun a window in the Gantt chart view, select the solid color box for the window. An action pane pops up with information and rerun options.

## Related content

- [Create a tumbling window trigger](how-to-create-tumbling-window-trigger.md)
