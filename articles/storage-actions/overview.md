---
title: About Azure Storage Tasks
titleSuffix: Azure Storage Tasks
description: Learn how to perform operations on blobs in Azure Storage accounts based on a set of conditions that you define. 
services: storage
author: normesta

ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: overview
ms.date: 08/03/2023
ms.author: normesta

---

# What is Azure Storage Tasks?

Azure Storage Tasks can perform operations on blobs in Azure Storage accounts based on a set of conditions that you define. Azure Storage Tasks can process millions of objects in a storage account without provisioning additional compute capacity and without requiring you to write code.

> [!IMPORTANT]
> Azure Storage Tasks is currently in PREVIEW and is available these [regions](#supported-regions).
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Anatomy of a storage task

Azure Storage Tasks is a service that manages *storage tasks*. A storage task contains a set of *conditions*, *operations*, and *assignments*. The following table describes each component of a task.

| Component | Description |
|---|---|
| Conditions | A *condition* a collection of one or more *clauses*. Each clause contains a property, a value, and an operator. When the storage task runs, it uses the operator to compare a property with a value to determine whether a clause is met by the target object. For example, a clause might evaluate whether a `creation-time` property of a blob is greater than five days ago. |
| Operations | An operation is the action a storage task performs on each object that meets the defined set of conditions. Deleting a blob is an example of an operation. |
| Assignments | An assignment identifies a storage account and a subset of objects to target in that account. It also specifies when the task runs and where execution reports are stored. |

## How to use a storage task

First, define the conditions and operations of a task. Then, assign that task to one or more storage accounts. Monitor task runs by using metrics, charts, and reports.

### Define a task

Start by creating a task. To provision a task, you must define at least one condition and one operation. After the task is created, you can edit those conditions and operations or add more of them by using a visual designer.  

See these articles to learn how to define a task:

- [Create a storage task](storage-task-create.md)
- [Define storage task conditions and operations]( storage-task-conditions-operations-edit.md)
- [Properties, operators, and operations in storage task conditions](storage-task-properties-operators-operations.md)

### Assign a task

You can assign a task to any storage account that you own. As you create an assignment, you'll select a storage account, and assign a role to the system-assigned managed identity of the task. That identity is created for you automatically when the task is provisioned. The role that you assign that identity must enable it to perform the operations that are defined in the task.

A storage task can be assigned to a storage account only by an owner of that account. Therefore, if the task that you define is useful to an owner of another storage account, you must grant that user access to the storage task. Then, that user can assign your task to their storage account. You can grant a user access to your storage task by assigning an Azure role to their user identity.

See these articles to learn how to assign a task:

- [Create and manage a storage task assignment](storage-task-assignment-create.md)
- [Azure roles for storage task assignments](storage-task-authorization-roles.md)

### Monitor task runs

Tasks run asynchronously according to the schedule that you specify in the assignment. An execution report is created when the run completes. That report itemizes the results of the task run on each object that was targeted by the task.

The overview page of the task presents metrics and visualizations that summarize how many objects met the task condition, and the result of the operations attempted by the storage task on each object. The charts enable you to quickly drill into a specific execution instance.

See these articles to learn how to monitor task runs:

- [Analyze Azure Storage Task runs](storage-task-runs.md)
- [Monitor Azure Storage Tasks](monitor-storage-tasks.md)

### Handle task events

Azure Storage Tasks events allow applications to react to events, such as the completion of a storage task run. It does so without the need for complicated code or expensive and inefficient polling services.

Azure Storage Tasks events are pushed using [Azure Event Grid](https://azure.microsoft.com/services/event-grid/) to subscribers such as Azure Functions, Azure Logic Apps, or even to your own http listener. Event Grid provides reliable event delivery to your applications through rich retry policies and dead-lettering. Event Grid uses [event subscriptions](../event-grid/concepts.md#event-subscriptions) to route event messages to subscribers. First, subscribe an endpoint to an event. Then, when an event is triggered, the Event Grid service will send data about that event to the endpoint.

See the [Azure Storage Tasks events schema](../event-grid/event-schema-storage-actions.md?toc=/azure/storage-actions/toc.json) article to view the full list of the events that Azure Storage Tasks supports.

## Supported Regions

Azure Storage tasks are supported in the following public regions:

- France Central
- Canada Central

## Pricing and billing

List pricing information here.

## Next steps

- [Quickstart: Create, assign, and run a storage task by using the Azure portal](storage-task-quickstart-portal.md)
- [Known issues with Azure Storage Tasks](storage-task-known-issues.md)
