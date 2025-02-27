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

Azure Storage Actions is a fully managed platform designed to automate data management tasks for Azure Blob Storage and Azure Data Lake Storage. This service addresses the challenges of managing large data estates by providing efficient and scalable solutions.

You can use Azure Storage Actions to perform common data operations on millions of objects across multiple storage accounts. The current release of Azure Storage Actions enables you to create _storage tasks_ that can perform operations on blobs in Azure Storage accounts based on a set of conditions that you define. Storage tasks can process millions of objects in a storage account without provisioning additional compute capacity and without requiring you to write code. 

## Key Features

- **Serverless infrastructure** - Azure Storage Actions operates on a serverless infrastructure, eliminating the need for provisioning or managing resources. This ensures scalability to meet your data management needs.

- **No-code experience** - The platform offers a no-code experience, allowing users to define conditional logic for processing objects without programming expertise. Tasks can be composed to securely operate on multiple datasets with similar requirements.

- **Monitoring and management** - Azure Storage Actions minimizes monitoring overhead through summarized views, filters, and drill downs. This makes it easier to manage and monitor data management tasks.

## Use Cases

- **Cost optimization** - Azure Storage Actions supports cost optimization by managing the tiering, expiry, and retention of blobs based on various attributes such as path-prefix, naming conventions, or file type.

- **Data protection** - The platform helps in maintaining data protection by managing the retention and lifecycle of versions and snapshots for sensitive datasets.

- **Rehydration from archive** - Tasks can be defined to rehydrate large datasets from the archive tier, ensuring data is readily available when needed.

- **Tagging and metadata management** - Azure Storage Actions allows for the initialization and management of blob tags and metadata, facilitating better organization and retrieval of data.

## How Azure Storage Actions works

Azure Storage Actions allows you to compose, validate, and deploy data management tasks quickly. These tasks can be scheduled or executed on demand.

### Composing and validating tasks

Using the Azure portal, you can create conditions to identify the blobs you want to manage and specify the operations to perform. The integrated validation feature lets you verify these conditions against your production data without executing any actions. This shows which blobs meet the conditions and the operations that would be performed if the task were executed.

### Task execution

Tasks can be executed across any storage accounts within the same Microsoft Entra ID tenant. Azure Storage Actions automatically provisions, scales, and optimizes resources for both recurring and one-off task executions. Aggregate metrics and dashboards provide visual summaries of operations, with detailed reports available for further analysis.

### Programmatic Management

Azure Storage Actions can also be managed programmatically through REST APIs and the Azure SDK. It supports PowerShell, Azure Command-Line Interface (CLI), and Azure Resource Manager (ARM) templates.

### Supported Operations

The current release supports several built-in operations for Azure Blob Storage and Azure Data Lake Storage, including:

- Setting time-based retention

- Managing legal holds

- Changing tiers

- Managing blob expiry

- Setting blob tags

- Deleting or undeleting blobs

For a complete list, see [Supported operations](/storage-tasks/storage-task-operations.md#supported-operations)

## Anatomy of a storage task

A storage task contains a set of _conditions_, _operations_. The following table describes each component of a storage task.

| Component | Description |
|---|---|
| Conditions | A _condition_ a collection of one or more _clauses_. Each clause contains a property, a value, and an operator. When the storage task runs, it uses the operator to compare a property with a value to determine whether a clause is met by the target object. For example, a clause might evaluate whether a `creation-time` property of a blob is greater than five days ago. To learn more, see [Storage task conditions](storage-tasks/storage-task-conditions.md)|
| Operations | An operation is the action a storage task performs on each object that meets the defined set of conditions. Deleting a blob is an example of an operation. To learn more, see [Storage task operations](storage-tasks/storage-task-operations.md).|

## Defining a storage task

Start by creating a storage task. To provision a storage task, you must define at least one condition and one operation. You also must choose whether you want the storage task to be authorized by the system-managed identity of the task or by a user-assigned managed identity. After the task is created, you can edit those conditions and operations or add more of them by using a visual designer. 

See these articles to learn how to define a storage task:

- [Create a storage task](storage-tasks/storage-task-create.md)
- [Define storage task conditions and operations](storage-tasks/storage-task-conditions-operations-edit.md)

### Assigning a storage task

An assignment identifies a storage account and a subset of objects to target in that account. It also specifies when the task runs and where execution reports are stored.

You can assign a storage task to any storage account in which your identity is assigned the [Storage Blob Data Owner](../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role. As you create an assignment, you'll select a storage account, and assign a role to the system-assigned managed identity of the task. That identity is created for you automatically when the task is provisioned. The role that you assign that identity must enable it to perform the operations that are defined in the task.

A storage task can be assigned to a storage account only by an owner of that account. Therefore, if the task that you define is useful to an owner of another storage account, you must grant that user access to the storage task. Then, that user can assign your task to their storage account. You can grant a user access to your storage task by assigning an Azure role to their user identity.

See these articles to learn how to assign a storage task:

- [Create and manage a storage task assignment](storage-tasks/storage-task-assignment-create.md)
- [Azure roles for storage task assignments](storage-tasks/storage-task-authorization-roles.md)

### Monitoring storage task runs

Tasks run asynchronously according to the schedule that you specify in the assignment. An execution report is created when the run completes. That report itemizes the results of the task run on each object that was targeted by the task.

The overview page of the task presents metrics and visualizations that summarize how many objects met the task condition, and the result of the operations attempted by the storage task on each object. The charts enable you to quickly drill into a specific execution instance.

See these articles to learn how to monitor task runs:

- [Analyze storage task runs](storage-tasks/storage-task-runs.md)
- [Monitor Azure Storage Actions](storage-tasks/monitor-storage-tasks.md)

### Handling storage task events

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

## Next steps

- [Quickstart: Create, assign, and run a storage task by using the Azure portal](storage-tasks/storage-task-quickstart-portal.md)
- [Known issues with storage tasks](storage-tasks/storage-task-known-issues.md)
