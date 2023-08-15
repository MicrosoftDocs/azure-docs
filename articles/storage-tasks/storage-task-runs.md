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

You can view a list of task runs.

## View the task runs of a storage task

1. Steps to open the list from the Azure portal.
2. Steps to use the report time filter
3. Steps to select tiles to filter list.
   Description of each column in the list table.

## View task runs of a specific storage account

1. Steps to open the list from the Azure portal.
2. Steps to use the report time filter
3. Steps to select tiles to filter list.
   Description of each column in the list table.

## Drill into execution reports

After a task runs, an execution report is generated and then stored in the container that you specified when you created the assignment.

1. Steps to open the execution report - click link, open CSV file etc.

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

## See also

- [Monitor Azure Storage Tasks](monitor-storage-tasks)
- [Storage Tasks Overview](overview.md)
