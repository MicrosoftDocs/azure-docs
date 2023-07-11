---
title: Storage Task assignment
titleSuffix: Azure Storage
description: Description of Azure Storage Task assignment goes here.
services: storage
author: normesta

ms.service: storage-tasks
ms.topic: conceptual
ms.date: 05/10/2023
ms.author: normesta

---

# Storage Task assignment

Put something here.

> [!IMPORTANT]
> Storage Tasks is currently in PREVIEW and is available in the following regions: \<List regions here\>.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> To enroll, see \<sign-up form link here\>.

Explain what an assignment is.

To create an assignment, see [Create and manage a Storage Task assignment](storage-task-assignment-create.md).

## Status

Enabled/disabled.

## Execution context

Something here about storage account targets, number of accounts supported and other constraints along with blob prefix and other details.
There is a maximum of 10 tasks per storage account.

## Trigger

What sets it off - run now? on a schedule?

## Task runs

Task runs generate an execution report as well as events that other applications can subscribe to through the event grid. Task runs also generate Azure Monitor metrics that you can view in the overview page of the storage task.

### Execution reports

When a run completes, an execution report is generated. Explain how to access this report.

The report is formatted as a CSV file. Each row of the report contains the details about the execution of the operation on each object that is targeted by the task. The completion report is stored at the path specified by the report element of the task definition and follows the naming convention of `<taskId>-<completionTimestamp>.csv`.

The following table describes the columns of information that appear in the execution report:

| Name | Description |
|--|--|
| Blob path | The fully qualified name of the blob. |
| Version ID / Snapshot | The ID of the version or snapshot of this task. This field is empty if the object is a base blob. |
| Condition effect | This field contains a value of `true` if the application of the defined conditions on the object evaluates true; otherwise `false`. |
| Operation status | This field contains a value of `Success` or `Failed`. This field is empty if the application of the defined conditions on the object evaluates to false. |
| Status code | This field is empty if the application of the defined conditions on the object evaluates to false. |
| Error message | This field is empty if the application of the defined conditions on the object evaluates to false. |

The following example shows an execution report:

`Put example here`

### Events

Task runs generate `Task Started` and `Task Completed` events which other applications can subscribe through Event Grid.

Link to the schema for these events and any other information about how to subscribe to events.

### Metrics

Each task execution produces the following metrics that users can view:

- Count of objects targeted

- Count of operations attempted

- Count of operations succeeded

Link to information about how to view these metrics

## See also

- [Create and manage an assignment](storage-task-assignment-create.md)