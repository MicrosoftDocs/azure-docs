---
title: Pipeline failure and error message
description: Understand how pipeline failure status and error message are determined
ms.service: data-factory
ms.subservice: orchestration
author: chez-charlie
ms.author: chez
ms.reviewer: jburchel
ms.topic: tutorial
ms.date: 09/22/2022
---

# Understanding pipeline failure

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

## Error handling

Azure Data Factory and Synapse Pipeline orchestration allows conditional logic and enables user to take different based upon outcomes of a previous activity. Using different paths allow users to build robust pipelines and incorporates error handling in ETL/ELT logic. In total, we allow four conditional paths,

* Upon Success (default pass)
* Upon Failure
* Upon Completion
* Upon Skip

:::image type="content" source="media/tutorial-pipeline-failure-error-handling/pipeline-error-1-four-branches.png" alt-text="Screenshot showing the four branches out of an activity.":::

### Common error handling mechanism

#### Try Catch block

In this approach, customer defines the business logic, and only defines the _Upon Failure_ path to catch any error from previous activity. This approach renders pipeline succeeds, if _Upon Failure_ path succeeds.

:::image type="content" source="media/tutorial-pipeline-failure-error-handling/pipeline-error-2-try-catch-definition.png" alt-text="Screenshot showing definition and outcome of a try catch block.":::

#### Do If Else block

In this approach, customer defines the business logic, and defines both the _Upon Failure_ and _Upon Success_ paths. This approach renders pipeline fails, even if _Upon Failure_ path succeeds.

:::image type="content" source="media/tutorial-pipeline-failure-error-handling/pipeline-error-3-do-if-else-definition.png" alt-text="Screenshot showing definition and outcome of do if else block.":::

#### Do If Skip Else block

In this approach, customer defines the business logic, and defines both the _Upon Failure_ path, and _Upon Success_ path, with a dummy _Upon Skipped_ activity attached. This approach renders pipeline succeeds, if _Upon Failure_ path succeeds.

:::image type="content" source="media/tutorial-pipeline-failure-error-handling/pipeline-error-4-do-if-skip-else-definition.png" alt-text="Screenshot showing definition and outcome of do if skip else block.":::

### Summary table

Approach | Defines | When activity succeeds, overall pipeline shows | When activity fails, overall pipeline shows
---------------------------- | ------------------- | ------------------- | -------------------
[Try-Catch](#try-catch-block) | Only _Upon Failure_ path | Success |  Success
[Do-If-Else](#do-if-else-block) | _Upon Failure_ path + _Upon Success_ paths | Success |  Failure
[Do-If-Skip-Else](#do-if-skip-else-block) |  _Upon Failure_ path + _Upon Success_ path (with a _Dummy Upon Skip_ at the end) | Success |  Success

### How pipeline failure are determined

Different error handling mechanisms will lead to different status for the pipeline: while some pipelines fail, others succeed. We determine pipeline success and failures as follows:

* Evaluate outcome for all leaves activities. If a leaf activity was skipped, we evaluate its parent activity instead
* Pipeline result is success if and only if all nodes evaluated succeed

Assuming _Upon Failure_ activity and _Dummy Upon Failure_ activity succeed,

* In [Try-Catch](#try-catch-block) approach,

  * When previous activity succeeds: node _Upon Failure_ is skipped and its parent node succeeds; overall pipeline succeeds
  * When previous activity fails: node _Upon Failure_ is enacted; overall pipeline succeeds

* In [Do-If-Else](#do-if-else-block) approach,

  * When previous activity succeeds: node _Upon Success_ succeeds and node _Upon Failure_ is skipped (and its parent node succeeds); overall pipeline succeeds
  * When previous activity fails: node _Upon Success_ is skipped and its parent node failed; overall pipeline fails

* In [Do-If-Skip-Else](#do-if-skip-else-block) approach,

  * When previous activity succeeds: node _Dummy Upon Skip_ is skipped and its parent node _Upon Success_ succeeds; the other node activity, _Upon Failure_, is skipped and its parent node succeeds; overall pipeline succeeds
  * When previous activity fails: node _Upon Failure_ succeeds and _Dummy Upon Skip_ succeeds; overall pipeline succeeds

## Next steps

[Data Factory metrics and alerts](monitor-metrics-alerts.md)

[Monitor Visually](monitor-visually.md#alerts)
