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

Put something here.

> [!IMPORTANT]
> Azure Storage Tasks is currently in PREVIEW and is available in the following regions: \<List regions here\>.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> To enroll, see \<sign-up form link here\>.

## When to use

Give customers some example of tasks they might accomplish by using tasks. For example:

- Move data to different tiers
- Set tags on blobs
- Parameterized queries so that account owners can set up metadata that task creators can leverage in condition design.

## Key capabilities

- Capability 1
- Capability 2
- Capability 3

## How it works

Storage task creator and storage account owner are separate roles in this process.

Storage task creator

- Storage task creator designs and creates the conditions of a task.
- A system-assigned managed identity is created automatically for the storage task when the task is created. That system identity becomes important at assignment time.
- Storage task creator gives access permission to the each storage account owner who wants to assign the task to their account. Permission is AAD (standard experience).

Storage task owner

- Storage account owner is responsible for opening a task and assigning that task to the account that they own. The task assigner must be the account owner.
- Storage account owner selects the Azure role to assign the system identity of the storage task. This auto adds the system identity to the AIM of the storage account with the assigned role.

Task runs

- Tasks run asynchronously. The task authorizes access to the storage account by using the task's system identity and the role assigned to that identity in the assignment phase.
- Account owners can check the results of a run by using an execution report. They can also monitor task activity in the overview page of the task.
- Storage tasks are versioned. When you save a task, the previous version of that task is saved for future.

## Supported Regions

List supported regions here.

## Pricing and billing

A Task invocation charge for every instance in which a task is triggered on an account.

A meter based on the count of objects targeted (for which object properties are accessed, and conditions are evaluated).

The cost of the underlying operations invoked by the task will be passed through to the storage account as part of the account’s overall transaction cost. This should be reflected on the bill with the Task as the user agent for the transaction.

## Next steps

- [Quickstart: Create, assign, and run a storage task by using the Azure portal](storage-task-quickstart-portal.md)
- [Known issues with Azure Storage Tasks](storage-task-known-issues.md)
