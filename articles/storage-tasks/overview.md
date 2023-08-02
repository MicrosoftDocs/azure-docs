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

The Azure Storage Task service can process millions of objects in a storage account without provisioning any additional compute capacity and without requiring you to write code. A storage task can perform common data management, protection, and movement operations on containers and blobs in Azure Storage accounts based on a set of conditions that you specify. Define the conditions and operations of a storage task by using an intuitive, easy-to-use visual designer, and then deploy that task to dozens of storage accounts across the organization.

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

Storage tasks provide a framework and the compute infrastructure to process millions of objects in a storage account. A storage task performs operations on containers and blobs in an Azure Storage account based on a set of conditions that you define. A *condition* contains a property, a value, and an operator. The storage tasks uses the operator to compare a property with a value to determine whether the condition is met by the target object. An *operation* is the action a storage task performs on each object that meets the defined conditions. For more information, see [Storage task conditions and operations](storage-task-conditions-operation.md).

When you want to use the task to process objects in a storage account, you must create a task *assignment*. An assignment identifies a storage account and a subset of objects in that account that the task will target. An assignment also defines when the task runs and where execution reports are stored.

You can monitor the status of the storage task after it has been executed. You can view charts and metrics that summarize how many objects met the task condition, and the result of the operations attempted by the storage task on each object. The charts enable you to quickly drill into a specific execution instance. The execution process also produces a storage task report that details the specific failures encountered during execution. See [Storage task runs](storage-task-runs.md)

### Getting started

Start by creating a storage task. See [Create a storage task]( storage-task-create.md). You must define at least one condition and one operation. After you create the task, a system-assigned managed identity is generated automatically for the storage task. That system identity becomes important at assignment time. If need to define more conditions and operations or change the ones that you added when you created the task, you can do so by using a visual designer. See [Define storage task conditions and operations]( storage-task-conditions-operations-edit.md).

You can assign the task to any storage accounts that you own and that you'd like task to target. As part of that assignment, you assign the system-assigned managed identity of the task the role required for the operations in that task to run. This auto adds the system identity to the AIM of the storage account with the assigned role. See [Create and manage a storage task assignment](storage-task-assignment-create.md).

If the task that you define is useful to owners of other storage accounts, you can make your task available to them by assigning their user identities a role which provides them with access to the task. See [Storage task authorization](storage-task-authorization.md). Then, that user can open the assignment pane of the task and assign that task to a storage account that they own.

Tasks run asynchronously. The task authorizes access to the storage account by using the task's system identity and the role assigned to that identity in the assignment phase. Account owners can check the results of a run by using an execution report. They can also monitor task activity in the overview page of the task. See [Storage task runs](storage-task-runs.md)

## Supported Regions

List supported regions here.

## Pricing and billing

A Task invocation charge for every instance in which a task is triggered on an account.

A meter based on the count of objects targeted (for which object properties are accessed, and conditions are evaluated).

The cost of the underlying operations invoked by the task will be passed through to the storage account as part of the account’s overall transaction cost. This should be reflected on the bill with the Task as the user agent for the transaction.

## Next steps

- [Quickstart: Create, assign, and run a storage task by using the Azure portal](storage-task-quickstart-portal.md)
- [Known issues with Azure Storage Tasks](storage-task-known-issues.md)
