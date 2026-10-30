---
title: Known issues and limitations with storage tasks
titleSuffix: Azure Storage Actions
description: Learn about limitations and known issues of storage tasks.
author: normesta
ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: limits-and-quotas
ms.date: 10/30/2026
ms.author: normesta
---

# Known issues and limitations with storage tasks

This article describes limitations and known issues of storage tasks. The issues that appear in this article reflect the current state of the service. This list will change over time as support continues to expand.

## Resource limits

| Scale factor | Supported limit |
|---|---|
| Storage tasks per subscription | 5,000 |
| Storage task assignments per storage task | 5,000 |
| Storage task assignments per subscription | 10,000 |
| Storage task assignments per storage account | 50 |
| Storage task nested grouping of clauses per condition | 10 |

Azure Storage Actions autoscales its processing tasks based on the volume of data in a storage account, subject to internal limits. The duration of execution depends on the number of blobs in the storage account, as well as their hierarchy in Azure Data Lake Storage Gen2. The first execution of a task over a path prefix might take longer than subsequent executions. Azure Storage Actions are also designed to be self-regulating and to allow application workloads on the storage account to take precedence. As a result, the scale and the duration of execution also depend on the available transaction capacity given the storage account's maximum request limit. The following are typical processing scales, which might be higher if you have more transaction capacity available, or might be lower for lesser spare transaction capacity on the storage account.

## Task assignments applied on storage accounts across regions

Task assignments can only be applied on storage accounts that are in the same region where the Storage Actions resource was created.

## Billing doesn't show task assignment name 

Billing meters show up on the bill with only the storage account name. Subscription bill doesn't show the task assignment name for which the meter was emitted. To correlate the meter with the task assignment, you must look at the resource metrics for Storage Actions filtered by the storage account for that day.

## Propagation of task definition updates may break task assignments

When you update an Azure Storage Actions task definition, the changes automatically apply to all its task assignments. Updates to task assignments only validate the consistency of the task definition, but don't validate the changes against existing task assignments. The updates can hence cause task assignments to become invalid if the task definition refers to features that are unsupported on that storage account. For example, a Storage Actions task definition might initially be applied to both FNS and HNS storage accounts. If you make an update to the task definition that adds a condition or operation that's specific to FNS, such as blob versioning, the task definition becomes invalid on HNS storage accounts.

## Stop task assignments

You can stop a single task assignment or all task assignments from the **Task Runs** page of the Azure Storage Actions portal. This interface isn't currently available through the Storage Actions page of the storage account portal.

## Move for storage account resource is blocked when a task assignment exists

Delete the storage task assignment, and then move the storage account resource.

## Restrictions on moving a storage task across Microsoft Entra directories

You can move storage tasks across resource groups and subscriptions. However, because storage tasks rely on managed identities, moving a subscription that contains a storage task to a different Microsoft Entra directory breaks the managed identity and causes the storage task to stop working. For more information, see [Known issues with managed identities for Azure resources: Transferring a subscription between Microsoft Entra directories](/entra/identity/managed-identities-azure-resources/known-issues#transferring-a-subscription-between-microsoft-entra-directories).

## Concurrency limit for execution

Storage tasks have a limit on the number of task assignments that they can execute concurrently on each storage account. To ensure optimal performance, ensure that task assignments on a single storage account are scheduled to run with a reasonable time interval between them based on the targeted objects, to ensure task runs complete in time. Pause task assignment executions that exceed the concurrency limit for a storage account until other assignments complete.

## Scale dependence on transaction capacity available for the storage account

Storage task assignment execution autoscales depending on the transaction request capacity available on the storage account. Scale is higher when more transaction capacity is available and lower when less transaction capacity is available.

When the targeted storage account has lower available transaction capacity, storage task execution might be throttled, resulting in longer than expected duration for completing the task assignment execution.

For more information about scale limits, see [Scalability and performance targets for Blob storage](../../storage/blobs/scalability-targets.md).

> [!NOTE]
> You can request higher capacity and ingress limits. To request an increase, contact [Azure Support](https://azure.microsoft.com/support/faq/).

## Storage task runs can write to the report export container without permission to the container

As you create a task assignment, you assign a role to the system-assigned managed identity of the storage task. When the storage task runs, it can operate only on containers where its managed identity has the required role. This rule doesn't apply to the report export container that you choose during task assignment. While a storage task can't operate on existing blobs in that container, a task doesn't require the correct role to write reports to that container.

## String operators on container metadata, blob metadata, and blob index tags don't work if the values are numbers

You can't use string operators on container metadata, blob metadata, and blob index tags when the value is a number. For example, `equals(Tags.Value[Year], '2022')` where the value `2022` is a number, doesn't work correctly with the string operator `equals`.

## Assignments fail when they reference a storage account name that starts with a digit

If you assign a storage task to a storage account that has a name starting with a digit, the storage task assignment fails.

## Whitespace characters in Blob index tags and metadata aren't supported

You can use whitespace characters in the key and value of blob tags. However, storage task conditions can't process whitespace characters. If a key or value contains a whitespace character, an error appears when the task runs.

## Blob name property value contains or matches "." is unsupported

The string field input on the blob name clause accepts `.doc` or `.pdf` as inputs but fails to deploy the task resource. The service resource provider validation catches it and throws the error. The value of the property `Name` is `.doc` and it doesn't follow the pattern `^[a-zA-Z0-9]+"}]}.

## Storage task assignments operate on an incomplete list of blobs when used with multiple directory filters in accounts that have a hierarchical namespace

If you use multiple filters in storage task assignments, the task doesn't scan all directory prefixes for blobs to operate on.

## Using whitespace characters in the path prefix during task assignment isn't supported

Storage accounts that have a hierarchical namespace display location information as `container1 / subcontainer1` with a whitespace character between the string and the `/` character. An error appears if you copy and paste this information into the path prefix field during assignment.

## Cleaning up task assignments before deleting storage accounts or storage tasks

- Before deleting a storage account, delete all task assignments associated with that storage account.
- Before deleting a storage task, delete all task assignments referencing that storage task.

## Operating on storage accounts in a private network

You can apply storage task assignments to storage accounts in private networks when the networking configuration includes an option that permit trusted Microsoft services to access the account. This setting ensures that tasks have the necessary access during execution, even when firewall or virtual network rules are in place. If you don't enable this option, task execution fails because network restrictions block access. For detailed steps on enabling this setting, see [Manage network security exceptions for Azure Storage](/azure/storage/common/storage-network-security-manage-exceptions).

## Storage task runs are stuck in the in progress state

If you assign a role that doesn't have the required permission during the assignment process, the storage task run takes 14 days to fail. To unblock the task run, add the required role to the managed identity of the storage task. Otherwise, the task assignment stays in the **in progress** state until the task run ends in 14 days.

## Premium block blobs 

Creating assignments on premium block blobs storage accounts doesn't work.

## Soft deleted blobs are included in listing during scanning as objects targeted 

Exclude the specific prefixes that are soft deleted.

## No option to choose priority when rehydrating blobs to an online tier 

When rehydrating archived blobs, you can't choose a priority. The blobs are rehydrated with the standard priority. 

## Delay in task assignment runs

Task assignment runs can take around 20 minutes to change status to `In Progress` after being queued. Until then, no updates appear. This delay is expected and there's no workaround to shorten it.

## Mock run limitations

### Only one run (mock or real) can execute per storage account at a time

If a real task run or another mock run is already in progress on the target storage account, a newly enabled mock run is queued until the current run completes. This concurrency behavior is the same as real task runs.

### Completed mock runs can't be restarted

Once a mock run finishes, you can't restart it. To run another mock simulation with the same configuration, create a new assignment or duplicate the existing one.

### Can't create mock run assignments on enabled task assignments

You can't create a mock run on a task assignment that is already enabled. Disable the assignment first, or create a new assignment with the mock run trigger type.

### Mock run reports don't include operation results

Because no operations are performed during a mock run, the report doesn't include operation success or failure details. The report shows what operations _would have been_ performed and which condition block each blob matched.

### Delay in mock run start

Like real task assignment runs, mock runs can take about 20 minutes to transition from queued to in-progress status. This delay is expected behavior.

## See Also

- [Azure Storage Actions overview](../overview.md)
