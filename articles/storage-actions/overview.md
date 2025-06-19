---
title: About Azure Storage Actions
titleSuffix: Azure Storage Actions
description: Learn how to perform operations on blobs in Azure Storage accounts based on a set of conditions that you define. 
services: storage
author: normesta

ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update, references_regions
ms.topic: overview
ms.date: 05/05/2025
ms.author: normesta

---

# What is Azure Storage Actions

Azure Storage Actions is a fully managed platform designed to automate data management tasks for Azure Blob Storage and Azure Data Lake Storage. You can use it to perform common data operations on millions of objects across multiple storage accounts without provisioning extra compute capacity and without requiring you to write code.

You can use Azure Storage Actions to automate tasks such as moving data to more cost-effective tiers, manage the retention of versions, snapshots or sensitive data sets, rehydrating data from archive storage so that it is available for immediate use, or manage blob index tags and metadata for better organization and data retrieval.

> [!IMPORTANT]
> Azure Storage Actions is generally available in these [regions](#supported-regions). Some regions remain in PREVIEW. For a list, see [Regions supported at the preview level](#regions-supported-at-the-preview-level).

## Terms and definitions

The resource that you provision to perform data operations is called a _storage task_. A _storage task_ can perform operations on blobs in Azure Storage accounts based on a set of conditions that you define.

A storage task contains a set of _conditions_, _operations_. To execute a storage task, you must create and _assignment_. The following table describes each term.

| Component | Description |
|---|---|
| Conditions | A _condition_ a collection of one or more _clauses_. Each clause contains a property, a value, and an operator. When the storage task runs, it uses the operator to compare a property with a value to determine whether a clause is met by the target object. For example, a clause might evaluate whether a `creation-time` property of a blob is greater than five days ago. |
| Operations | An operation is the action a storage task performs on each object that meets the defined set of conditions. Deleting a blob is an example of an operation. |
| Assignments | An assignment identifies a storage account and a subset of objects to target in that account. It also specifies when the task runs and where execution reports are stored. |

## Composition

Start by creating a storage task. To provision a storage task, you must define at least one condition and one operation. The easiest way to compose conditions is by using a visual designer in the Azure portal. You can use a built-in preview capability in that designer to see the impact of your conditions against test data. See [Define storage task conditions and operations](storage-tasks/storage-task-conditions-operations-edit.md).

> [!NOTE]
> You can also create storage task definitions by using REST, SDKs, PowerShell, Azure CLI, Bicep, Terraform, or ARM templates.
  
See these articles to learn how to define a storage task:

- [Create a storage task](storage-tasks/storage-task-create.md)
- [Define storage task conditions and operations](storage-tasks/storage-task-conditions-operations-edit.md)
- [Storage task conditions](storage-tasks/storage-task-conditions.md)
- [Storage task operations](storage-tasks/storage-task-operations.md)

## Execution

To use a storage task, you must create a storage task assignment. An assignment identifies a storage account and a subset of objects to target in that account. It also specifies when the task runs and where execution reports are stored. See [Storage task assignment](storage-tasks/storage-task-assignment.md).

Tasks run asynchronously according to the schedule that you specify in the assignment. An execution report is created when the run completes. That report itemizes the results of the task run on each object that was targeted by the task. See [Analyze storage task runs](storage-tasks/storage-task-runs.md).

The overview page of the task presents metrics and visualizations that summarize how many objects met the task condition, and the result of the operations attempted by the storage task on each object. The charts enable you to quickly drill into a specific execution instance. See [Monitor Azure Storage Actions](storage-tasks/monitor-storage-tasks.md).

See these articles to learn how to assign a storage task:

- [Create and manage a storage task assignment](storage-tasks/storage-task-assignment-create.md)
- [Azure roles for storage task assignments](storage-tasks/storage-task-authorization-roles.md)

> [!NOTE]
> Storage task assignment can't target general-purpose v1 & Legacy Blob Storage accounts because those accounts don't support the latest features. If you have a general-purpose v1 or Legacy Blob Storage account, we recommend you to upgrade to [general-purpose v2 accounts](/azure/well-architected/service-guides/storage-accounts/operational-excellence#design-considerations) to use all the latest features.

## Events

Azure Storage Actions events allow applications to react to events, such as the completion of a storage task run. It does so without the need for complicated code or expensive and inefficient polling services.

Azure Storage Actions events are pushed using [Azure Event Grid](https://azure.microsoft.com/services/event-grid/) to subscribers such as Azure Functions, Azure Logic Apps, or even to your own http listener. Event Grid provides reliable event delivery to your applications through rich retry policies and dead-lettering. Event Grid uses [event subscriptions](../event-grid/concepts.md#event-subscriptions) to route event messages to subscribers. First, subscribe an endpoint to an event. Then, when an event is triggered, the Event Grid service sends data about that event to the endpoint.

See the [Azure Storage Actions events schema](../event-grid/event-schema-storage-actions.md?toc=/azure/storage-actions/toc.json) article to view the full list of the events that Azure Storage Actions supports.

## Pricing and billing

Pricing is based on the execution of storage task assignments. Each time your storage task assignment executes, you're billed a task execution instance charge. You also incur a charge based on the count of objects scanned and evaluated against the conditions of the storage task. That charge is based on a single price per million objects scanned. The final meter applies to the count of operations performed on objects in the storage account. This charge is also based on a single price per million objects. Meters are applied to each executing instance. If a storage task assignment is scheduled to execute repeatedly, then you're billed for each separate instance. 

At the end of your billing cycle, the charges for each meter are summed. Your bill or invoice shows a section for all Azure Storage Actions costs. There's a separate line item for each meter. These charges appear in the subscription of the storage account where the task assignment is configured. To learn more about Azure Storage Actions billing meters along with example calculations for common scenarios, see [Plan to manage costs for Azure Storage Actions](storage-actions-plan-manage-costs.md)

## Supported Regions

Azure Storage tasks are generally available in the following public regions:

- West US 3

- West Central US

- UK West

- UK South

- UAE North

- Sweden Central

- Spain Central

- South India

- South Africa North

- Norway East

- Korea South

- Korea Central

- Jio India Central

- Japan West

- Japan East

- Italy North

- Israel Central

- East US 2

- Australia Central

## Regions supported at the preview level

Azure Storage Actions is currently in PREVIEW and is available in the following region.
See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This list is temporary and will change over time as GA support continues to expand.

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

## Next steps

- [Quickstart: Create, assign, and run a storage task by using the Azure portal](storage-tasks/storage-task-quickstart-portal.md)
- [Known issues with storage tasks](storage-tasks/storage-task-known-issues.md)
