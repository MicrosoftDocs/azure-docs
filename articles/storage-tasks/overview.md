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

## Key capabilities

- Capability 1
- Capability 2
- Capability 3

## How it works

Maybe a diagram?

- You create a task and define the conditions
- You assign a task to operate on one or more storage accounts
  Perhaps describe the permissions model a bit here with managed identities
- Tasks run asynchronously. If the task lacks permission to perform operations on any of the storage accounts, then \<describe how the failure manifests to the user\>
- You can check on the results
- You can monitor task activity
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
