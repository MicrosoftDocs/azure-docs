---
title: About Azure Storage Actions
titleSuffix: Azure Storage Actions
description: Learn how to perform operations on blobs in Azure Storage accounts based on a set of conditions that you define. 
services: storage
author: normesta

ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: overview
ms.date: 02/20/2025
ms.author: normesta

---

# What is Azure Storage Actions?

Azure Storage Actions is a fully managed platform designed to automate data management tasks for Azure Blob Storage and Azure Data Lake Storage. This service addresses the challenges of managing large data estates by providing efficient and scalable solutions. You can use Azure Storage Actions to perform common data operations on millions of objects across multiple storage accounts without provisioning additional compute capacity and without requiring you to write code. 

## Key features

Azure Storage Actions offers several key features that streamline data management and enhance efficiency. 

**Serverless infrastructure**: Azure Storage Actions operates on a serverless infrastructure. Azure Storage Actions can manage data at scale because there's no need to provision or manage resources other than a storage task. 

**No-code experience**: You don't need any programming expertise. You can define conditional logic for processing objects by using a visual designer or by using JSON.

**Monitoring and management**: Azure Storage Actions minimizes the effort involved in managing and monitoring by providing summery views, filters, and report drill downs. 

## Use cases

Azure Storage Actions supports a variety of use cases to enhance data management efficiency and effectiveness. 

**Cost optimization**: Azure Storage Actions can help optimize costs by managing the tier, expiration date, and retention of blobs based on various attributes such as path-prefix, naming conventions, or file type.

**Data protection**: Azure Storage actions can help to protect data by managing the retention and lifecycle for versions and snapshots of sensitive datasets.

**Rehydration from archive**: Azure Storage actions can rehydrate large datasets from the archive tier to ensure that data is available when it is needed.

**Tagging and metadata management**: Azure Storage Actions allows for the initialization and management of blob tags and metadata which facilitates better organization and retrieval of data.

## Storage tasks

To use Azure Storage Actions, create a _storage task_. See [Create a storage task](storage-tasks/storage-task-create.md). A storage task contains a set of _conditions_, _operations_. The following table describes each component of a storage task.

| Component | Description |
|---|---|
| Conditions | A _condition_ a collection of one or more _clauses_. Each clause contains a property, a value, and an operator. When the storage task runs, it uses the operator to compare a property with a value to determine whether a clause is met by the target object. For example, a clause might evaluate whether a `creation-time` property of a blob is greater than five days ago. To learn more, see [Storage task conditions](storage-tasks/storage-task-conditions.md)|
| Operations | An operation is the action a storage task performs on each object that meets the defined set of conditions. Deleting a blob is an example of an operation. To learn more, see [Storage task operations](storage-tasks/storage-task-operations.md).|

## Composition

You can compose conditions and operations by using a visual designer in the Azure portal. You can validate those conditions and operations by testing them against data in any storage account. The built-in preview capability in the Azure portal simplifies validation and helps you find and fix issues in your task definition before you use the storage task against production data. See [Define storage task conditions and operations](storage-tasks/storage-task-conditions-operations-edit.md).

> [!NOTE]
> You can also create and manage a storage task by using REST APIs, SDKs, PowerShell, Azure CLI, and by using Bicep, Terraform or Azure Resource Manager (ARM) templates.

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

## Pricing and billing

You can try the feature for free during the preview, paying only for transactions invoked on your storage account. Pricing information for the feature will be published before general availability.

> [!NOTE]
> General-purpose v1 accounts don't support the latest features and hence Azure Storage Actions is not supported either. If you have a general-purpose v1 account, we recommend you to upgrade to [general-purpose v2 accounts](/azure/well-architected/service-guides/storage-accounts/operational-excellence#design-considerations) to use all the latest features.

## Next steps

- [Quickstart: Create, assign, and run a storage task by using the Azure portal](storage-tasks/storage-task-quickstart-portal.md)
- [Known issues with storage tasks](storage-tasks/storage-task-known-issues.md)