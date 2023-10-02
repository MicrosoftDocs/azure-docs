---
title: 'Check execution user scope of a workflow - Microsoft Entra ID'
description: Describes how to check the users who fall into the execution scope of a Lifecycle Workflow.
services: active-directory
author: owinfreyATL
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 05/31/2023
ms.subservice: compliance
ms.author: owinfrey
ms.reviewer: krbain
ms.collection: M365-identity-device-management
---

# Check execution user scope of a workflow 


Workflow scheduling will automatically process the workflow for users meeting the workflows execution conditions. This article walks you through the steps to check the users who fall into the execution scope of a workflow. For more information about execution conditions, see: [workflow basics](../governance/understanding-lifecycle-workflows.md#workflow-basics).

## Check execution user scope of a workflow using the Microsoft Entra admin center

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To check the users who fall under the execution scope of a workflow, you'd follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Lifecycle Workflows Administrator](../roles/permissions-reference.md#lifecycle-workflows-administrator).

1. Browse to **Identity governance** > **Lifecycle workflows** > **workflows**.

1. From the list of workflows, select the workflow you want to check the execution scope of.

1. On the workflow overview page, select **Execution conditions**.

1. On the Execution conditions page, select the **Execution User Scope** tab.

1. On this page you're presented with a list of users who currently meet the scope for execution for the workflow.
    :::image type="content" source="media/check-workflow-execution-scope/execution-user-scope-list.png" alt-text="Screenshot of users under scope of workflow execution." lightbox="media/check-workflow-execution-scope/execution-user-scope-list.png":::

> [!NOTE]
> The workflow engine routinely evaluates the users that meet the execution conditions. The results will not be up to date if the execution conditions have been changed recently, relevant attributes on the user have been changed recently, or the time based trigger has recently passed.

## Check execution user scope of a workflow using Microsoft Graph

To check execution user scope of a workflow using API via Microsoft Graph, see: [List executionScope](/graph/api/workflow-list-executionscope). 

## Next steps

- [Manage workflow properties](manage-workflow-properties.md)
- [Delete Lifecycle Workflows](delete-lifecycle-workflow.md)
