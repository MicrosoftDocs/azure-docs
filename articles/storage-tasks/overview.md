---
title: About Storage Tasks
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
> Storage Tasks is currently in PREVIEW and is available in the following regions: \<List regions here\>.
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

\<Show diagram here\>

By referring to diagram, describe the flow of activities

- You create a task and define the conditions
- You assign a task to operate on one or more storage accounts
  Perhaps describe the permissions model a bit here with managed identities
- Tasks run asynchronously. If the task lacks permission to perform operations on any of the storage accounts, then \<describe how the failure manifests to the user\>
- You can check on the results
- You can monitor task activity

See these articles for step-by-step guidance:

- [Quickstart: Create, assign, and run a Storage Task by using the Azure portal](storage-task-quickstart-portal.md)
- [Edit Storage Task Conditions](storage-task-condition-edit.md)
- [Manage Storage Task Assignments](storage-task-assignment-manage.md)
- [Monitor Storage Tasks](monitor-storage-tasks.md)

## Supported Regions

List supported regions here.

## Pricing and billing

Put any costs associated with using this service here.

## Next steps

- [Quickstart: Create, assign, and run a Storage Task by using the Azure portal](storage-task-quickstart-portal.md)
- [Known issues with Azure Storage Tasks](storage-task-known-issues.md)
