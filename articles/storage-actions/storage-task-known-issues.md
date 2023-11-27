---
title: Known issues and limitations with Azure Storage Tasks
titleSuffix: Azure Storage Tasks
description: Learn about limitations and known issues of Azure Storage Tasks.
author: normesta

ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: conceptual
ms.date: 05/16/2023
ms.author: normesta
---

# Known issues and limitations with Azure Storage Tasks

This article describes limitations and known issues of Azure Storage Tasks. The issues that appear in this article reflect the current state of the service. This list will change over time as support continues to expand.

> [!IMPORTANT]
> Azure Storage Tasks is currently in PREVIEW and is available these [regions](overview.md#supported-regions).
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
| Maximum number of blobs that a storage task can process in a storage account | 5 billion |

## String operators on container metadata, blob metadata, and blob index tags don't work if the values are numbers

Using string operators on container metadata, blob metadata and blob index tags along with numbers as value doesn't work. For example, equals(Tags.Value[Year], '2022') where the value '2022' is a number, along with string operator equals, doesn't evaluate correctly.

## Assignments fail when they reference a storage account name that starts with a digit

If you assign a storage task to a storage account that has a name which starts with a digit, the storage task assignment fails.

## Storage task assignments fail on some storage accounts in supported regions

Storage tasks are supported on new storage accounts created after the subscription is allow-listed. They might not work on some existing storage accounts even thought those accounts are located in supported regions.

## Monitoring data does not appear unless the storage task and the storage account are in the same resource group

If the storage task and the storage account specified in the task assignment are in different resource groups, the aggregated monitoring data for the storage account doesn't show up correctly in the monitoring tab of the storage task blade.

## Storage tasks assignment execution gets stuck in an in-progress state with no blobs processed

In most cases, tasks execution progresses after 20 minutes. However, if the task gets stuck, then make sure that the target storage account has the necessary compatible configuration. For example, if the storage task sets the immutability policy, but the target account is not configured with versioning support, the storage task won't progress and will eventually fail. Make sure to test each operation on the target storage account by using a mechanism other than a storage task to ensure that the operation will succeed. Then, add the operation to the storage task.  

## Storage task fails with an internal error

If incompatible storage task operations are tried out on storage accounts, the task execution can fail with an error or it can be stuck in in-progress state. For example, an operation that attempts to set a blob index tag on an account that has a hierarchical namespace will not succeed. Make sure that the storage account configuration and the storage task operation are compatible.

## Whitespace characters in Blob index tags and metadata is not yet supported

Whitespace characters in the key and value of blob tags are acceptable inputs. However, storage task conditions are unable to process the whitespace characters. If a key or value contains a whitespace character, an error will appear when the task runs.

## Blob name property value contains or matches "." is unsupported

The string field input on blob name clause accepts ".doc" or ".pdf" as inputs but fails to deploy the task resource. The service resource provider validation catches it and throws the error. The value of the property 'Name' is '.doc' and it does not follow the pattern '^[a-zA-Z0-9]+$'"}]}.

## Storage task assignments operate on an incomplete list of blobs when used with multiple directory filters in accounts that have a hierarchical namespace

If multiple filters are used in storage task assignments, not all directory prefixes are scanned for blobs to be operated on.

## Using whitespace characters in the path prefix during task assignment is not supported

Storage accounts that have a hierarchical namespace display location information as `container1 / subcontainer1` with a whitespace character between the string and the `/` character. An error appears if you copy and paste this information into the path prefix field during assignment.

## See Also

- [Storage Tasks Overview](overview.md)
