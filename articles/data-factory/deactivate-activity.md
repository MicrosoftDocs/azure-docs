---
title: Deactivate an Activity in Azure Data Factory 
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to deactivate an activity to exclude from pipeline run and validation
author: chez-charlie
ms.author: chez
ms.service: data-factory
ms.subservice: orchestration
ms.custom: synapse
ms.topic: conceptual
ms.date: 07/01/2023
---

# Deactivate an Activity

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

You can now deactivate one or more activities from a pipeline, and we skip them during validation and during pipeline run. This feature significantly improves pipeline developer efficiency, allowing customers to comment out part of the pipeline, without deleting it from the canvas. You may choose to reactivate them at a later time.


:::image type="content" source="./media/deactivate-activity/deactivate-01-overview.png" alt-text="Screenshot showing an inactive activity in pipeline":::

## Deactivate and Reactivate

There are two ways to deactivate an activity.

First, you may deactivate a single activity from its **General** tab. 

- Select the activity you want to deactivate
- Under **General** tab, select _Inactive_ for _Activity state_
- Pick a state for _Mark activity as_. Choose from _Succeeded_, _Failed_ or _Skipped_


:::image type="content" source="./media/deactivate-activity/deactivate-03-setup-single.png" alt-text="Deactive one activity at a time":::

Alternatively, you can deactivate multiple activities with right click.

- Press down _Ctrl_ key to multi-select. Using your mouse, left click on all activities you want to deactivate
- Right click to bring up the drop down menu
- Select _Deactivate_ to deactivate them all
- To fine tune the settings for _Mark activity as_, go to **General** tab of the activity, and make appropriate changes

:::image type="content" source="./media/deactivate-activity/deactivate-04-setup-multiple.png" alt-text="Deactive multiple activities all at once":::

In both cases, you do need to deploy the changes to deactivate the parts during pipeline run.

To reactivate the activities, choose _Active_ for the _Activity State_, and they revert back to their previous behaviors, as expected.

## Behaviors


An inactive activity behaves differently in a pipeline. 

1. On canvas, the inactive activity is grayed out, with _Inactive sign_ placed next to the activity type
1. On canvas, a status sign (Succeeded, Failed or Skipped) is placed on the box, to visualize the _Mark activity as_ setting
1. The activity is excluded from pipeline validation. Hence, you don't need to provide all required fields for an inactive activity.
1. During debug run and pipeline run, the activity won't actually execute. Instead, it runs a place holder line item, with the reserved status **Inactive**
1. The branching option is controlled by _Mark activity as_ option. In other words:
    * if you mark the activity as _Succeeded_, the _UponSuccess_ or _UponCompletion_ branch runs
    * if you mark the activity as _Failed_, the _UponFailure_ or _UponCompletion_ branch runs
    * if you mark the activity as _Skipped_, the _UponSkip_ branch runs
    * for more information, please refer to [Conditional Execution](tutorial-pipeline-failure-error-handling.md#conditional-paths)

:::image type="content" source="./media/deactivate-activity/deactivate-02-run-status.png" alt-text="Screenshot showing activity run status of an inactive activity":::

## Best practices

Deactivation is a powerful tool for pipeline developer. It allows developers to "comment out" part of the code, without permanently deleting the activities. It shines in following scenarios:

- When developing a pipeline, developer can add place holder inactive activities before filling all the required fields. For instance, I need a Copy activity from SQL Server to Data warehouse, but I haven't set up all the connections yet. So I use an _inactive_ copy activity as the place holder for iterative development process.
- After deployment, developer can comment out certain activities that are constantly causing troubles to avoid costly retries. For instance, my on-premises SQL server is having network connection issues, and I know my copy activities fail for certain. I may want to deactivate the copy activity, to avoid retry requests from flooding the brittle system.

### Known limitations

An inactive activity never actually runs. This means the activity won't have an error field, or its typical output fields. Any references to missing fields may throw errors downstream.

## Next steps

Learn more about Azure Data Factory and Synapse pipelines.

-   [Conditional Execution](tutorial-pipeline-failure-error-handling.md)
