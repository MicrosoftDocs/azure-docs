---
title: Pipeline failure and error message
description: Understand how pipeline failure status and error message are determined
ms.service: data-factory
ms.subservice: orchestration
author: chez-charlie
ms.author: chez
ms.reviewer: jburchel
ms.topic: tutorial
ms.date: 01/09/2023
---

# Errors and Conditional execution

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

## Conditional paths

Azure Data Factory and Synapse Pipeline orchestration allows conditional logic and enables the user to take a different path based upon outcomes of a previous activity. Using different paths allow users to build robust pipelines and incorporates error handling in ETL/ELT logic. In total, we allow four conditional paths,

|  Name | Explanation |
|  --- | --- |
| Upon Success | (Default Pass) Execute this path if the current activity succeeded | 
| Upon Failure | Execute this path if the current activity failed | 
| Upon Completion | Execute this path after the current activity completed, regardless if it succeeded or not | 
| Upon Skip | Execute this path if the activity itself didn't run |

:::image type="content" source="media/tutorial-pipeline-failure-error-handling/pipeline-error-1-four-branches.png" alt-text="Screenshot showing the four branches out of an activity.":::

You may add multiple branches following an activity, with one exception: _Upon Completion_ path can't coexist with either _Upon Success_ or _Upon Failure_ path. For each pipeline run, at most one path is activated, based on the execution outcome of the activity.

## Error Handling

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

Different error handling mechanisms lead to different status for the pipeline: while some pipelines fail, others succeed. We determine pipeline success and failures as follows:

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


## Conditional execution

As we develop more complicated and resilient pipelines, it's sometimes required to introduced conditional executions to our logic: execute a certain activity only if certain conditions are met. The use cases are plenty, for instance:

* run a follow-up activity, such as sending an email notification, if previous copy jobs succeeded
* run an error handling job, if any of the previous activities failed
* proceed to the next step if either the activity itself or its corresponding error handling activity succeeds
* etc.

Here we explain some common logics and how to implement them in ADF.

### Single activity
Here are some common patterns following a single activity. We can use these patterns as building blocks to construct complicated work flows.

#### Error handling
The pattern is the most common condition logic in ADF. An error handling activity is defined for the "Upon Failure" path, and will be invoked if the main activity fails. It should be incorporated as best practice for all mission critical steps that needs fall-back alternatives or logging.

:::image type="content" source="media/tutorial-pipeline-failure-error-handling/conditional-simple-1.png" alt-text="Screenshot showcasing error handling for mission critical steps.":::

#### Best effort steps
Certain steps, such as informational logging, are less critical, and their failures shouldn't block the whole pipeline. In such cases, we should adopt the best effort strategies: adding next steps to the "Upon Completion" path, to unblock the work flow.

:::image type="content" source="media/tutorial-pipeline-failure-error-handling/conditional-simple-2.png" alt-text="Screenshot showcasing best effort attempt to log.":::

### And
First and most common scenarios are conditional "and": continue the pipeline if and only if the previous activities succeed. For instance, you may have multiple copy activities that need to succeed first before moving onto next stage of data processing. In ADF, the behavior can be achieved easily: declare multiple dependencies for the next step. Graphically, that means multiple lines pointing into the next activity. You can choose either "Upon Success" path to ensure the dependency have succeeded, or "Upon Completion" path to allow best effort execution.

Here, the follow-up wait activity will only execute when both web activities were successful.

:::image type="content" source="media/tutorial-pipeline-failure-error-handling/conditional-and-1.png" alt-text="Screenshot showcasing pipeline proceeds only if both web activities succeed.":::

And here, the follow-up wait activity executes when _ActivitySucceeded_ passes and _ActivityFailed_ completed. Note, with "Upon Success" path  _ActivitySucceeded_ has to succeed, whereas _ActivityFailed_ on the "Upon Completion" path runs with best effort, that is, may fail.


:::image type="content" source="media/tutorial-pipeline-failure-error-handling/conditional-and-2.png" alt-text="Screenshot showcasing pipeline proceeds when first web activity succeeds and second web activity completes.":::

### Or
Second common scenarios are conditional "or": run an activity if any of the dependencies succeeds or fails. Here we need to use "Upon Completion" paths, [If Condition activity](control-flow-if-condition-activity.md) and [expression language](control-flow-expression-language-functions.md).

Before we dive deep into code, we need to understand one more thing. After an activity ran and completed, you may reference its status with _@activity('ActivityName').Status_. It's either "Succeeded"_ or _"Failed"_. We use this property to build conditional or logic.

#### Shared error handling logging step
In some cases, you may want to invoke a shared error handling or logging step, if any of the previous activities failed. You can build your pipeline like this:
* run multiple activities in parallel
* add an if condition to contain the error handling steps, in True branch
* connect activities to the condition activity using _"Upon Completion"_ path
* logical expression for condition activity reads 
```json
@or(equals(activity('ActivityFailed').Status, 'Failed'), equals(activity('ActivitySucceeded').Status, 'Failed'))
```
* Note: you need concatenated or if you have more than two dependency activities, for instance, 
```json
@or(or(equals(activity('ActivityFailed').Status, 'Failed'), equals(activity('ActivitySucceeded1').Status, 'Failed')),equals(activity('ActivitySucceeded1').Status, 'Failed'))
```

:::image type="content" source="media/tutorial-pipeline-failure-error-handling/conditional-or-1.png" alt-text="Screenshot showcasing how to execute a shared error handling step if any of the previous activities failed.":::

#### Greenlight if any activity succeeded
When all your activities are best effort, you may want to proceed to next step if any of the previous activities succeeded. You can build your pipeline like this:
* run multiple activities in parallel
* add an if condition to contain next steps, in True branch
* connect activities to the condition activity using _"Upon Completion"_ path
* logical expression for condition activity reads 
```json
@or(equals(activity('ActivityFailed').Status, 'Succeeded'), equals(activity('ActivitySucceeded').Status, 'Succeeded'))
```
* Note: the graph looks exactly like the previous scenario. The only difference is the expression language used

:::image type="content" source="media/tutorial-pipeline-failure-error-handling/conditional-or-2.png" alt-text="Screenshot showcasing pipeline proceeds to next step if any of the activities pass.":::

### Complex scenarios
#### All activities need to succeed to proceed
The pattern is a combination of two: conditional and + error handling. The pipeline proceeds to next steps if all proceeding activities succeed, or else it runs a shared error logging step. You can build the pipeline like this:
* run multiple activities in parallel
* add an if condition. Add next steps in True branch, and add error handling code in False branch
* connect activities to the condition activity using _"Upon Completion"_ path
* logical expression for condition activity reads 
```json
@and(equals(activity('ActivityFailed').Status, 'Succeeded'), equals(activity('ActivitySucceeded').Status, 'Succeeded'))
```

:::image type="content" source="media/tutorial-pipeline-failure-error-handling/conditional-complex-1.png" alt-text="Screenshot showcasing pipeline proceeds to next step if any of the activities pass, or else runs error handling code.":::

## Common patterns

### Try-Catch-Proceed 
The pattern is equivalent to try catch block in coding. An activity might fail in a pipeline. When it fails, customer needs to run an error handling job to deal with it. However, the single activity failure shouldn't block next activities in the pipeline. For instance, I attempt to run a copy job, moving files into storage. However it might fail half way through. And in that case, I want to delete the partially copied, unreliable files from the storage account (my error handling step). But I'm OK to proceed with other activities afterwards.

To set up the pattern:

* Add first activity
* Add error handling to the UponFailure path
* Add second activity, but don't connect to the first activity
* Connect both UponFailure and UponSkip paths from the error handling activity to the second activity

:::image type="content" source="media/tutorial-pipeline-failure-error-handling/error-handling-1-try-catch.png" alt-text="Screenshot showcasing pipeline with try catch block.":::

Error Handling job runs only when First Activity fails. Next Activity will run regardless if First Activity succeeds or not.

### Generic error handling
Commonly, we have multiple activities running sequentially in the pipeline. If any fails, I need to run an error handling job to clear the state, and/or log the error. For instance, I have sequential copy activities in the pipeline. If any of these fails, I need to run a script job to log the pipeline failure.

To set up the pattern:

* Build sequential data processing pipeline
* Add generic error handling step to the end of the pipeline
* Connect both UponFailure and UponSkip paths from the last activity to the error handling activity

:::image type="content" source="media/tutorial-pipeline-failure-error-handling/error-handling-3-generic-no-branching.png" alt-text="Screenshot showcasing pipeline with generic error handling in a pipeline with no branching.":::

The last step, Generic Error Handling, will only run if any of the previous activities fails. It will not run if they all succeed.

You can add multiple activities for error handling.

:::image type="content" source="media/tutorial-pipeline-failure-error-handling/error-handling-4-generic-no-branching-multiple.png" alt-text="Screenshot showcasing pipeline with generic error handling in a pipeline with no branching and multiple activities.":::



## Next steps

[Data Factory metrics and alerts](monitor-metrics-alerts.md)

[Monitor Visually](monitor-visually.md#alerts)
