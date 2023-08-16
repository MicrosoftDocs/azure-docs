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

You can view a list of task runs. Each item in that list shows metrics which describe the run along with a link to a detailed execution report. That report provides information about each object that was targeted by the task run.

## View task runs

After a task run completes, metrics that describe that run appear in a list that you can open and review.

## View the task runs of a storage task

You can see all of the runs attempted by a storage task by opening a list of runs from the storage task menu. You'll only see runs that targeted accounts to which you have read permission.

1. Steps to open the list from the Azure portal.

   Metrics appear as tiles that you can select to view a list of the task runs which comprise the metric. These metrics include runs from multiple storage task assignments, but only assignments that target storage accounts to which you have read permission.

## View task runs of a specific storage account

You can see all of the runs against a specific storage account by opening a list of runs from the storage account menu.

1. Steps to open the list from the Azure portal.

   Metrics appear as tiles that you can select to view a list of the task runs which comprise the metric. These metrics include runs from multiple storage task assignments.

## Review metrics for each task run

1. Steps to use the report time filter.

2. Steps to select tiles to filter list.

   For example, to view list of task runs where at least one operation failed, select the **Objects on which the operation failed** tile. Then, a filtered list of task runs will appear. In that list appears metrics specific to each task run.

   Description of each column in the list table.

   Each listed task also provides a link to a detailed execution report.

## Review metrics for each targeted object

After a task runs, an execution report is generated and then stored in a container within the targeted storage account. The name of that container is specified when the assignment is created.  A link to that report appears next to each run in the task run list. Use that link to open a report which contains status information about each object that was targeted by the run.

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
