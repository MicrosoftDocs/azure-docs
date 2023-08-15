---
title: Analyze Azure Storage Task runs
titleSuffix: Azure Storage Tasks
description: Learn how to view lists of runs and review run reports.
author: normesta
ms.service: storage-tasks
ms.topic: how-to
ms.author: normesta
ms.date: 05/10/2023
---

# Analyze Azure Storage Task runs

View task runs and use Azure Monitor metrics to access success.

## Execution reports

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

### Metrics

Each task execution produces the following metrics that users can view:

- Count of objects targeted

- Count of operations attempted

- Count of operations succeeded

Link to information about how to view these metrics

## View task runs

Each task execution produces the following metrics that users can view:

- Count of objects targeted

- Count of operations attempted

- Count of operations succeeded

## View metrics in storage tasks view

For more information about the task report see [Storage Task Monitoring](monitor-storage-tasks.md).

## View metrics in Storage Accounts view

For more information about the task report see [Storage Task Monitoring](monitor-storage-tasks.md).

## See also

- [Storage Tasks Overview](overview.md)
- [Define conditions and operations](storage-task-conditions-operations-edit.md)
- [Create and manage an assignment](storage-task-assignment-create.md)
