---
title: About Azure Storage Actions Preview
titleSuffix: Azure Storage Actions Preview
description: Learn how to perform operations on blobs in Azure Storage accounts based on a set of conditions that you define. 
services: storage
author: normesta

ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: overview
ms.date: 03/27/2025
ms.author: normesta

---

# What is Azure Storage Actions Preview?

Azure Storage Actions is a serverless framework that you can use to perform common data operations on millions of objects across multiple storage accounts. 

> [!IMPORTANT]
> Azure Storage Actions is currently in PREVIEW and is available in these [regions](#supported-regions).
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The preview release of Azure Storage Actions enables you to create _storage tasks_ that can perform operations on blobs in Azure Storage accounts based on a set of conditions that you define. Storage tasks can process millions of objects in a storage account without provisioning additional compute capacity and without requiring you to write code.

## Anatomy of a storage task

A storage task contains a set of _conditions_, _operations_, and _assignments_. The following table describes each component of a storage task.

| Component | Description |
|---|---|
| Conditions | A _condition_ a collection of one or more _clauses_. Each clause contains a property, a value, and an operator. When the storage task runs, it uses the operator to compare a property with a value to determine whether a clause is met by the target object. For example, a clause might evaluate whether a `creation-time` property of a blob is greater than five days ago. |
| Operations | An operation is the action a storage task performs on each object that meets the defined set of conditions. Deleting a blob is an example of an operation. |
| Assignments | An assignment identifies a storage account and a subset of objects to target in that account. It also specifies when the task runs and where execution reports are stored. |

## How to use a storage task

First, define the conditions and operations of a storage task. Then, assign that task to one or more storage accounts. Monitor task runs by using metrics, charts, and reports.

### Define a storage task

Start by creating a storage task. To provision a storage task, you must define at least one condition and one operation. After the task is created, you can edit those conditions and operations or add more of them by using a visual designer.  

See these articles to learn how to define a storage task:

- [Create a storage task](storage-tasks/storage-task-create.md)
- [Define storage task conditions and operations](storage-tasks/storage-task-conditions-operations-edit.md)
- [Storage task conditions](storage-tasks/storage-task-conditions.md)
- [Storage task operations](storage-tasks/storage-task-operations.md)

### Assign a storage task

You can assign a storage task to any storage account in which your identity is assigned the [Storage Blob Data Owner](../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role. As you create an assignment, you'll select a storage account, and assign a role to the system-assigned managed identity of the task. That identity is created for you automatically when the task is provisioned. The role that you assign that identity must enable it to perform the operations that are defined in the task.

A storage task can be assigned to a storage account only by an owner of that account. Therefore, if the task that you define is useful to an owner of another storage account, you must grant that user access to the storage task. Then, that user can assign your task to their storage account. You can grant a user access to your storage task by assigning an Azure role to their user identity.

See these articles to learn how to assign a storage task:

- [Create and manage a storage task assignment](storage-tasks/storage-task-assignment-create.md)
- [Azure roles for storage task assignments](storage-tasks/storage-task-authorization-roles.md)

### Monitor storage task runs

Tasks run asynchronously according to the schedule that you specify in the assignment. An execution report is created when the run completes. That report itemizes the results of the task run on each object that was targeted by the task.

The overview page of the task presents metrics and visualizations that summarize how many objects met the task condition, and the result of the operations attempted by the storage task on each object. The charts enable you to quickly drill into a specific execution instance.

See these articles to learn how to monitor task runs:

- [Analyze storage task runs](storage-tasks/storage-task-runs.md)
- [Monitor Azure Storage Actions](storage-tasks/monitor-storage-tasks.md)

## Supported Regions

Azure Storage tasks are supported in the following public regions:

- Australia East

- Australia Southeast

- Brazil south

- Canada Central

- Central India

- Central US

- France Central
- Germany West Central

- North Central US

- North Europe

- South Central Us

- Southeast Asia

- Switzerland North

- West Europe

- West US

- West US 2

> [!NOTE]
> General-purpose v1 accounts don't support the latest features and hence Azure Storage Actions is not supported either. If you have a general-purpose v1 account, we recommend you to upgrade to [general-purpose v2 accounts](/azure/well-architected/service-guides/storage-accounts/operational-excellence#design-considerations) to use all the latest features.

## Pricing and billing

Pricing is based on the execution of storage task assignments. Each time your storage task assignment executes, you are billed a task execution instance charge. You also incur a charge based on the count of objects scanned and evaluated against the conditions of the storage task. That charge is based on a single price per million objects scanned. The final meter applies to the count of operations performed on objects in the storage account. This charge is also based on a single price per million objects. All three meters apply only to a single executing instance. If a storage task assignment is scheduled to execute repeatedly, you're billed for each separate instance. 

At the end of your billing cycle, the charges for each meter are summed. Your bill or invoice shows a section for all Azure Storage Actions costs. There's a separate line item for each meter. These charges appear in the subscription of the storage account where the task assignment is configured. To find the price of each meter, see [Azure Storage Actions Preview pricing](https://azure.microsoft.com/pricing/details/storage-actions/).

You can use the following formula to estimate the cost of a **each** storage task assignment execution:

Task execution instance charge + (Objects targeted charge * Objects targeted in millions) + (Operations invoked charge * Operations on objects in millions). 

In addition to the Azure Storage Actions charges for the task assignment execution, you might also be billed for the cost of operations performed on the storage account. For example, if a storage task adds an index tag to a blob, then you'll incur the cost of a [Set Blob Tags](/rest/api/storageservices/set-blob-tags) operation on the target storage account. 

> [!NOTE]
> Pricing for Azure Storage Actions will start rolling out across the different preview regions starting from April 1, 2025. Charges for Azure Storage Actions might appear on your subscription if a task assignment was executed after the effective date. During the roll out period, charges for objects targeted and operations executed might not appear on your bill until later in the cycle. Because of this delay, your bill might seem lower than expected during the first part of the month. 

## Next steps

- [Quickstart: Create, assign, and run a storage task by using the Azure portal](storage-tasks/storage-task-quickstart-portal.md)
- [Known issues with storage tasks](storage-tasks/storage-task-known-issues.md)
