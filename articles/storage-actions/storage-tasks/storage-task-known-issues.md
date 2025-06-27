---
title: Known issues and limitations with storage tasks
titleSuffix: Azure Storage Actions
description: Learn about limitations and known issues of storage tasks.
author: normesta
ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: conceptual
ms.date: 05/05/2025
ms.author: normesta
---

# Known issues and limitations with storage tasks

This article describes limitations and known issues of storage tasks. The issues that appear in this article reflect the current state of the service. This list will change over time as support continues to expand.

## Scale limits

| Scale factor | Supported limit |
|---|---|
| Storage tasks per subscription | 5,000 |
| Storage task assignments per storage task | 5,000 |
| Storage task assignments per subscription | 10,000 |
| Storage task assignments per storage account | 50 |
| Storage task nested grouping of clauses per condition | 10 |

Azure Storage Actions autoscales its processing tasks based on the volume of data in a storage account, subject to internal limits. The duration of execution depends on the number of blobs in the storage account, as well as their hierarchy in Azure Data Lake Storage Gen2. The first execution of a task over a path prefix might take longer than subsequent executions. Azure Storage Actions are also designed to be self-regulating and to allow application workloads on the storage account to take precedence. As a result, the scale and the duration of execution also depend on the available transaction capacity given the storage account's maximum request limit. The following are typical processing scales, which might be higher if you have more transaction capacity available, or might be lower for lesser spare transaction capacity on the storage account.

## Task assignments applied on storage accounts across regions

Task assignments can only be applied on storage accounts that are in the same region as the storage tasks.

## Billing doesn't show task assignment name 

Billing meters show up on the bill with only the storage account name. Subscription bill doesn't show the task assignment name for which the meter was emitted. To correlate the meter with the task assignment, you must look at the resource metrics for Storage Actions filtered by the storage account for that day.

## Propagation of task definition updates 

Task assignments aren't updated when changes are made to a task definition. New task assignments must be created after deleting the older ones to pick up any changes.  

## Stopping task assignments

You can stop an in-progress run by [removing the role assignment](/azure/role-based-access-control/role-assignments-remove) for the underlying managed identity.

## Move for storage account resource is blocked when a task assignment exists

The workaround is to delete the storage task assignment and then move the storage account resource.

## Restrictions on moving a storage task

You can't move a storage task to another region or to another subscription. You can't move a subscription that contains a storage task to another tenant.

## Concurrency limit for execution

Storage tasks have a limit on the number of task assignments that can be executed concurrently on each storage account. To ensure optimal performance, make sure that task assignments on a single storage account are scheduled to run with a reasonable time interval between them based on the objects targeted, to ensure task runs complete in time. Task assignment executions exceeding the concurrency limit for a storage account are paused until other assignments have completed.

## Scale dependence on transaction capacity available for the storage account

Storage task assignment execution is autoscaled depending on the transaction request capacity available on the storage account. Scale is higher when more transaction capacity is available and lower when less transaction capacity is available.

When the targeted storage account has lower available transaction capacity, storage task execution might be throttled resulting in longer than expected duration for completing the task assignment execution.

For more information about scale limits, see [Scalability and performance targets for Blob storage](../../storage/blobs/scalability-targets.md).

> [!NOTE]
> You can request higher capacity and ingress limits. To request an increase, contact [Azure Support](https://azure.microsoft.com/support/faq/).

## Storage task runs can write to the report export container without permission to the container

As you create a task assignment, you'll assign a role to the system-assigned managed identity of the storage task. When the storage task runs, it can operate only on containers where it's managed identity is assigned the required role. This isn't the case with the report export container that you choose during task assignment. While a storage task can't operate on existing blobs in that container, a task doesn't require the correct role to write reports to that container.

## String operators on container metadata, blob metadata, and blob index tags don't work if the values are numbers

You can't use string operators on container metadata, blob metadata, and blob index tags along with numbers as value. For example, equals(Tags.Value[Year], '2022') where the value '2022' is a number, along with string operator equals, doesn't evaluate correctly.

## Assignments fail when they reference a storage account name that starts with a digit

If you assign a storage task to a storage account that has a name, which starts with a digit, the storage task assignment fails.

## Whitespace characters in Blob index tags and metadata aren't yet supported

Whitespace characters in the key and value of blob tags are acceptable inputs. However, storage task conditions are unable to process the whitespace characters. If a key or value contains a whitespace character, an error appears when the task runs.

## Blob name property value contains or matches "." is unsupported

The string field input on blob name clause accepts ".doc" or ".pdf" as inputs but fails to deploy the task resource. The service resource provider validation catches it and throws the error. The value of the property 'Name' is '.doc' and it doesn't follow the pattern '^[a-zA-Z0-9]+$'"}]}.

## Storage task assignments operate on an incomplete list of blobs when used with multiple directory filters in accounts that have a hierarchical namespace

If multiple filters are used in storage task assignments, not all directory prefixes are scanned for blobs to be operated on.

## Using whitespace characters in the path prefix during task assignment isn't supported

Storage accounts that have a hierarchical namespace display location information as `container1 / subcontainer1` with a whitespace character between the string and the `/` character. An error appears if you copy and paste this information into the path prefix field during assignment.

## Moving storage tasks and task assignments
Moving storage tasks and task assignments across different resource groups and subscriptions isn't supported. This limitation means that any storage tasks and their associated task assignments can't be transferred between resource groups or subscriptions.

## Cleaning up task assignments before moving storage accounts
Task assignments must be cleaned up before moving storage accounts across resource groups and subscriptions. Specifically, before a storage account is moved from one resource group to another, or from one subscription to another, all task assignments applied to the storage account must be deleted to ensure a smooth transition.

## Cleaning up task assignments before deleting storage accounts
Task assignments must be cleaned up before deleting storage tasks or storage accounts. Specifically, before a storage account or storage tasks is deleted, all task assignments applied to the storage account must be deleted.

## Storage task runs are stuck in the in progress state

If during the assignment process, you assign a role which doesn't have the required permission, the storage task run will take 14 days to fail. To unblock the task run, you can add the required role to the managed identity of the storage task. Otherwise, the task assignment will be stuck in the **in progress** state until the task run ends in 14 days.

## Premium Block Blobs 

Creating assignments on premium block blobs storage accounts doesn't work.

## Soft deleted blobs are included in listing during scanning as objects targeted 

The workaround is to exclude the specific prefixes which are soft deleted.

## No option to choose priority when rehydrating blobs to an online tier 

When rehydrating archived blobs, there's no option to choose a priority. The blobs are rehydrated with the standard priority. 

## See Also

- [Azure Storage Actions overview](../overview.md)
