---
title: About Azure Storage Actions
titleSuffix: Azure Storage Actions
description: Learn how to perform operations on blobs in Azure Storage accounts based on a set of conditions that you define. 
services: storage
author: normesta

ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: overview
ms.date: 03/27/2025
ms.author: normesta

---

# What is Azure Storage Actions?

Azure Storage Actions is a fully managed platform designed to automate data management tasks for Azure Blob Storage and Azure Data Lake Storage. This service provides an efficient and scalable solution to address the challenges of managing large data estates. You can use Azure Storage Actions to perform common data operations on millions of objects across multiple storage accounts without provisioning additional compute capacity and without having to write code. 

## Key features

Azure Storage Actions offers several key features that streamline data management. 

**Serverless infrastructure**: Azure Storage Actions operates on a serverless infrastructure. Azure Storage Actions can manage data at scale because there's no need to provision or manage resources other than a storage task. 

**No-code experience**: You don't need any programming expertise. You can define conditional logic for processing objects by using a visual designer or by using JSON.

**Monitoring and management**: Azure Storage Actions minimizes the effort involved in managing and monitoring by providing summery views, filters, and report drill downs. 

## Use cases

Azure Storage Actions supports a variety of data management use cases.

**Cost optimization**: Azure Storage Actions can help optimize costs by managing the tier, expiration date, and retention of blobs based on various attributes such as path-prefix, naming conventions, or file type.

**Data protection**: Azure Storage actions can help to protect data by managing the retention and lifecycle for versions and snapshots of sensitive datasets.

**Rehydration from archive**: Azure Storage actions can rehydrate large datasets from the archive tier to ensure that data is available when it is needed.

**Tagging and metadata management**: Azure Storage Actions allows for the initialization and management of blob tags and metadata which facilitates better organization and data retrieval.

## Composition

To use Azure Storage Actions, create a _storage task_ and define a set of _conditions_. A _condition_ a collection of one or more _clauses_. Each clause contains a property, a value, and an operator. When the storage task runs, it uses the operator to compare a property with a value to determine whether a clause is met by the target object. For example, a clause might evaluate whether a `creation-time` property of a blob is greater than five days ago. To learn more, see [Storage task conditions](storage-tasks/storage-task-conditions.md)

As part of the task definition, you'll also specify one or more _operations_. An _operation_ is the action a storage task performs on each object that meets the defined set of conditions. Deleting a blob is an example of an operation. To learn more, see [Storage task operations](storage-tasks/storage-task-operations.md).

The easiest way to compose conditions is by using a visual designer in the Azure portal. You can use a built-in preview capability in that designer to see the impact of your conditions against test data. See [Define storage task conditions and operations](storage-tasks/storage-task-conditions-operations-edit.md).

> [!NOTE]
> You can also create storage task definitions by using REST, SDKs, PowerShell, Azure CLI, Bicep, Terraform or ARM templates.

## Execution

To use a storage task, you must create a storage task assignment. An assignment identifies a storage account and a subset of objects to target in that account. It also specifies when the task runs and where execution reports are stored. See [Storage task assignment](storage-tasks/storage-task-assignment.md).

Tasks run asynchronously according to the schedule that you specify in the assignment. An execution report is created when the run completes. That report itemizes the results of the task run on each object that was targeted by the task. See [Analyze storage task runs](storage-tasks/storage-task-runs.md).

The overview page of the task presents metrics and visualizations that summarize how many objects met the task condition, and the result of the operations attempted by the storage task on each object. The charts enable you to quickly drill into a specific execution instance. See [Monitor Azure Storage Actions](storage-tasks/monitor-storage-tasks.md). 

## Events

Azure Storage Actions events allow applications to react to events, such as the completion of a storage task run. It does so without the need for complicated code or expensive and inefficient polling services.

Azure Storage Actions events are pushed using [Azure Event Grid](https://azure.microsoft.com/services/event-grid/) to subscribers such as Azure Functions, Azure Logic Apps, or even to your own http listener. Event Grid provides reliable event delivery to your applications through rich retry policies and dead-lettering. Event Grid uses [event subscriptions](../event-grid/concepts.md#event-subscriptions) to route event messages to subscribers. First, subscribe an endpoint to an event. Then, when an event is triggered, the Event Grid service will send data about that event to the endpoint.

See the [Azure Storage Actions events schema](../event-grid/event-schema-storage-actions.md?toc=/azure/storage-actions/toc.json) article to view the full list of the events that Azure Storage Actions supports.

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

Pricing is based on the execution of storage task assignments. Each time your storage task assignment executes, you are billed a task execution instance charge. You also incur a charge based on the count of objects scanned and evaluated against the conditions of the storage task. That charge is based on a single price per million objects scanned. The final meter applies to the count of operations performed on objects in the storage account. This charge is also based on a single price per million objects. Meters are applied to each executing instance. If a storage task assignment is scheduled to execute repeatedly, then you're billed for each separate instance. 

At the end of your billing cycle, the charges for each meter are summed. Your bill or invoice shows a section for all Azure Storage Actions costs. There's a separate line item for each meter. These charges appear in the subscription of the storage account where the task assignment is configured. To learn more about Azure Storage Actions billing meters along with example calculations for common scenarios, see [Plan to manage costs for Azure Storage Actions](storage-actions-plan-manage-costs.md)

> [!NOTE]
> Pricing for Azure Storage Actions will start rolling out across the different preview regions starting from April 1, 2025. Charges for Azure Storage Actions might appear on your subscription if a task assignment was executed after the effective date. During the rollout period, charges for objects targeted and operations executed might not appear on your bill until later in the cycle. Because of this delay, your bill might seem lower than expected during the first part of the month. 

## Next steps

- [Quickstart: Create, assign, and run a storage task by using the Azure portal](storage-tasks/storage-task-quickstart-portal.md)
- [Known issues with storage tasks](storage-tasks/storage-task-known-issues.md)