---
title: 'Check execution user scope of a workflow - Azure Active Directory'
description: Describes how to check the users who fall into the execution scope of a Lifecycle Workflow.
services: active-directory
author: owinfreyATL
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/09/2023
ms.subservice: compliance
ms.author: owinfrey
ms.reviewer: krbain
ms.collection: M365-identity-device-management
---

# Check execution user scope of a workflow

Lifecycle workflows can be scheduled to run as frequently as 1 hour or as infrequently as 24 hours. When a workflow is scheduled to run users, who fall under its execution conditions, are processed by the workflow. For more information about execution conditions, see: [workflow basics](../governance/understanding-lifecycle-workflows.md#workflow-basics). This article walks you through the steps to check the users who fall into the execution scope of a workflow.

## Check execution user scope of a workflow using the Azure portal

To check the users who fall under the execution scope of a workflow, you'd follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Type in **Identity Governance** on the search bar near the top of the page and select it.

1. In the left menu, select **Lifecycle workflows (Preview)**.

1. From the list of workflows, select the workflow you want to check the execution scope of.

1. On the workflow overview page, select **Execution conditions (Preview)**.

1. On the Execution conditions page, select the **Execution User Scope** tab.

1. On this page you're presented with a list of users who currently meet the scope for execution for the workflow.
    :::image type="content" source="media/check-workflow-execution-scope/execution-user-scope-list.png" alt-text="Screenshot of users under scope of execution conditions.":::

> [!NOTE]
> Users that fall under the scope of the execution conditions only show up on the list after the system evaluates them. If you have just added a user that falls under scope of the workflow's execution scope, there will be a delay until they show up here.

## Check execution user scope of a workflow using Microsoft Graph

To check execution user scope of a workflow using API via Microsoft Graph, see: [List executionScope](/graph/api/workflow-list-executionscope).

## Next steps

- [Manage workflow properties](manage-workflow-properties.md)
- [Delete Lifecycle Workflows](delete-lifecycle-workflow.md)