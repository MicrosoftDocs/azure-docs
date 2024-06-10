---
title: Known issues and limitations with storage tasks
titleSuffix: Azure Storage Actions Preview
description: Learn about limitations and known issues of storage tasks.
author: normesta

ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: conceptual
ms.date: 01/17/2024
ms.author: normesta
---

# Known issues and limitations with storage tasks

This article describes limitations and known issues of storage tasks. The issues that appear in this article reflect the current state of the service. This list will change over time as support continues to expand.

> [!IMPORTANT]
> Azure Storage Actions is currently in PREVIEW and is available these [regions](../overview.md#supported-regions).
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Storage account regions

During the public preview, you can target only storage accounts that are in the same region as the storage tasks.

## Scale limits

| Scale factor | Supported limit |
|---|---|
| Storage tasks per subscription | 100 |
| Storage task assignments per storage task | 50 |
| Storage task assignments per storage account | 50 |
| Storage task definition versions | 50 |

Azure Storage Actions autoscales its processing tasks based on the volume of data in a storage account, subject to internal limits. The duration of execution depends on the number of blobs in the storage account, as well as their hierarchy in Azure Data Lake Storage Gen2. The first execution of a task over a path prefix might take longer than subsequent executions. Azure Storage Actions are also designed to be self-regulating and to allow application workloads on the storage account to take precedence. As a result, the scale and the duration of execution also depend on the available transaction capacity given the storage account's maximum request limit. The following are typical processing scales, which might be higher if you have more transaction capacity available, or might be lower for lesser spare transaction capacity on the storage account.

During the preview, Azure Storage Actions can invoke up to 200 million operations per day for a maximum of seven days on a flat-namespace storage account. Depending on the proportion of blobs targeted that meet the condition for operations, a task assignment might process between 200 million and four billion blobs in a day.

For storage accounts with a hierarchical namespace, Azure Storage Actions can invoke up to 35 million operations per day for a maximum of seven days during the preview. Depending on the proportion of blobs targeted that meet the condition for operations, a task assignment might process between 35 million to 400 million blobs in a day.

## Overlapping prefix for assignments

Storage tasks don't prevent execution of task assignments on overlapping prefixes. If there are multiple task assignments with overlapping prefixes, blobs might be processed by these task assignments in any order. If the execution order of operations across these task assignments is important, then as you configure the task, ensure that the prefix for assignments doesn't overlap.

## Concurrency limit for execution

Storage tasks have a limit on the number of task assignments that can be executed concurrently on each storage account. To ensure optimal performance, make sure that task assignments on a single storage account are scheduled to run with a reasonable time interval between them based on the objects targeted, to ensure task runs complete in time. Task assignment executions exceeding the concurrency limit for a storage account are paused until other assignments have completed.

## Scale dependence on transaction capacity available for the storage account

Storage task assignment execution is autoscaled depending on the transaction request capacity available on the storage account. Scale is higher when more transaction capacity is available and lower when less transaction capacity is available.

When the targeted storage account has lower available transaction capacity, storage task execution might be throttled resulting in longer than expected duration for completing the task assignment execution.

For more information about scale limits, see [Scalability and performance targets for Blob storage](../../storage/blobs/scalability-targets.md).

> [!NOTE]
> You can request higher capacity and ingress limits. To request an increase, contact [Azure Support](https://azure.microsoft.com/support/faq/).

## Storage task runs can write to the report export container without permission to the container

As you create a task assignment, you'll assign a role to the system-assigned managed identity of the storage task. When the storage task runs, it can operate only on containers where it's managed identity is assigned the required role. This is not the case with the report export container that you choose during task assignment. While a storage task can't operate on existing blobs in that container, a task does not require the correct role to write reports to that container.

## String operators on container metadata, blob metadata, and blob index tags don't work if the values are numbers

You can't use string operators on container metadata, blob metadata and blob index tags along with numbers as value. For example, equals(Tags.Value[Year], '2022') where the value '2022' is a number, along with string operator equals, doesn't evaluate correctly.

## Assignments fail when they reference a storage account name that starts with a digit

If you assign a storage task to a storage account that has a name, which starts with a digit, the storage task assignment fails.

## Monitoring data doesn't appear unless the storage task and the storage account are in the same resource group

If the storage task and the storage account specified in the task assignment are in different resource groups, the aggregated monitoring data for the storage account doesn't show up correctly in the monitoring tab of the storage task pane.

## Storage tasks assignment execution gets stuck in an in-progress state with no blobs processed

In most cases, tasks execution progresses after 20 minutes. However, if the task gets stuck, then make sure that the target storage account has the necessary compatible configuration. For example, if the storage task sets the immutability policy, but the target account isn't configured with versioning support, the storage task won't progress and will eventually fail. Make sure to test each operation on the target storage account by using a mechanism other than a storage task to ensure that the operation succeeds. Then, add the operation to the storage task.  

## Storage task fails with an internal error

If incompatible storage task operations are tried out on storage accounts, the task execution can fail with an error, or it can be stuck in in-progress state. For example, an operation that attempts to set a blob index tag on an account that has a hierarchical namespace won't succeed. Make sure that the storage account configuration and the storage task operation are compatible.

## Whitespace characters in Blob index tags and metadata isn't yet supported

Whitespace characters in the key and value of blob tags are acceptable inputs. However, storage task conditions are unable to process the whitespace characters. If a key or value contains a whitespace character, an error appears when the task runs.

## Blob name property value contains or matches "." is unsupported

The string field input on blob name clause accepts ".doc" or ".pdf" as inputs but fails to deploy the task resource. The service resource provider validation catches it and throws the error. The value of the property 'Name' is '.doc' and it doesn't follow the pattern '^[a-zA-Z0-9]+$'"}]}.

## Storage task assignments operate on an incomplete list of blobs when used with multiple directory filters in accounts that have a hierarchical namespace

If multiple filters are used in storage task assignments, not all directory prefixes are scanned for blobs to be operated on.

## Using whitespace characters in the path prefix during task assignment isn't supported

Storage accounts that have a hierarchical namespace display location information as `container1 / subcontainer1` with a whitespace character between the string and the `/` character. An error appears if you copy and paste this information into the path prefix field during assignment.

## Slow performance when processing blobs in accounts that have a hierarchical namespace

Storage Actions operate on blobs in a hierarchical namespace-enabled account at a reduced capacity. This is a known issue that is being addressed. This issue reduces the rate at which blobs are processed by storage task run.

## Operating on storage accounts in a private network is unsupported

When you apply storage task assignments to storage accounts that have IP or network rules for access control, the task execution might fail. This is because the storage task assignments needs to access the storage account through the public endpoint, which might be blocked by the firewall or virtual network rules. To avoid this issue, you need to configure the network access to your storage account properly.

## Storage Tasks won't be trigger on regional account migrated in GRS / GZRS accounts

If you migrate your storage account from a GRS or GZRS primary region to a secondary region or vice versa, then any storage tasks that target the storage account won't be triggered and any existing task executions might fail. 

## See Also

- [Azure Storage Actions overview](../overview.md)
