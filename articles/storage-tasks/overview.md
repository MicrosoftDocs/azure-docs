---
title: About Azure Storage Tasks
titleSuffix: Azure Storage
description: Description of Azure Storage Tasks goes here  
services: storage
author: normesta

ms.service: storage-tasks
ms.topic: overview
ms.date: 05/10/2023
ms.author: normesta

---

# What is Azure Storage Tasks?

Use Azure Storage tasks to perform operations on containers and blobs in Azure Storage accounts based on a set of conditions that you define. Other summary information goes here.

> [!IMPORTANT]
> Azure Storage Tasks is currently in PREVIEW and is available in the following regions: \<List regions here\>.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> To enroll, see \<sign-up form link here\>.

## When to use

Include some scenarios here.

Common actions include:

- Move data to different tiers

- Set tags on blobs

- Parameterized queries so that account owners can set up metadata that task creators can leverage in condition design.

## Key capabilities

- Define conditions and operations by using a visual designer.

- Assign a task to one or more storage accounts. Add filters to narrow the scope of objects to target and specify when and how often a task should run against that account.

- Monitor task runs by using metrics, visual charts, and execution reports. You can drill into this data in the Azure portal from either the Storage Task or the assigned storage account.

## How it works

Anyone can create a storage task, but only storage account owners can assign one.

### Creating tasks

You or someone in your organization creates a Storage task. See [Create a storage task]( storage-task-create.md). You must define at least one condition and one operation to create a task. A system-assigned managed identity is created automatically for the storage task when the task is created. That system identity becomes important at assignment time. If need to define more conditions and operations or change the ones that you added when you created the task, you can do so by using a visual designer. See [Define storage task conditions and operations]( storage-task-conditions-operations-edit.md).

### Assigning tasks

You can assign the task to any storage accounts that you own and that you'd like task to target. As part of that assignment, you assign the system-assigned managed identity of the task the role required for the operations in that task to run. This auto adds the system identity to the AIM of the storage account with the assigned role. See [Create and manage a storage task assignment](storage-task-assignment-create.md).

If the task that you define is useful to owners of other storage accounts, you can make your task available to them by assigning their user identities a role which provides them with access to the task. See [Storage task authorization](storage-task-authorization.md). Then, that user can open the assignment pane of the task and assign that task to a storage account that they own.

### Monitoring task execution

- Tasks run asynchronously. The task authorizes access to the storage account by using the task's system identity and the role assigned to that identity in the assignment phase.

- Account owners can check the results of a run by using an execution report. They can also monitor task activity in the overview page of the task.

- Storage tasks are versioned. When you save a task, the previous version of that task is saved for the future.

## Supported Regions

List supported regions here.

## Pricing and billing

A Task invocation charge for every instance in which a task is triggered on an account.

A meter based on the count of objects targeted (for which object properties are accessed, and conditions are evaluated).

The cost of the underlying operations invoked by the task will be passed through to the storage account as part of the account’s overall transaction cost. This should be reflected on the bill with the Task as the user agent for the transaction.

## Next steps

- [Quickstart: Create, assign, and run a storage task by using the Azure portal](storage-task-quickstart-portal.md)
- [Known issues with Azure Storage Tasks](storage-task-known-issues.md)
