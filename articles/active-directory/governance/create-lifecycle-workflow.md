---
title: Create a lifecycle workflow - Microsoft Entra ID
description: This article guides you in creating a lifecycle workflow. 
author: OWinfreyATL
ms.author: owinfrey
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to 
ms.date: 06/22/2023
ms.subservice: compliance
ms.custom: template-how-to 
---

# Create a lifecycle workflow

Lifecycle workflows allow for tasks associated with the lifecycle process to be run automatically for users as they move through their lifecycle in your organization. Workflows consist of:

- **Tasks**: Actions taken when a workflow is triggered.
- **Execution conditions**: The who and when of a workflow. These conditions define which users (scope) this workflow should run against, and when (trigger) the workflow should run.

You can create and customize workflows for common scenarios by using templates, or you can build a workflow from scratch without using a template. Currently, if you use the Microsoft Entra admin center, any workflow that you create must be based on a template. If you want to create a workflow without using a template, use Microsoft Graph.

## Prerequisites

[!INCLUDE [Microsoft Entra ID Governance license](../../../includes/active-directory-entra-governance-license.md)]


## Create a lifecycle workflow by using a template in the Microsoft Entra admin center

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

If you're using the Microsoft Entra admin center to create a workflow, you can customize existing templates to meet your organization's needs. These templates include one for pre-hire common scenarios.

To create a workflow based on a template:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Lifecycle Workflows Administrator](../roles/permissions-reference.md#lifecycle-workflows-administrator).

1. Browse to **Identity governance** > **Lifecycle workflows** > **Create a workflow**.

1. On the **Choose a workflow** page, select the workflow template that you want to use.

    :::image type="content" source="media/create-lifecycle-workflow/template-list.png" alt-text="Screenshot of a list of lifecycle workflow templates." lightbox="media/create-lifecycle-workflow/template-list.png":::
1. On the **Basics** tab, enter a unique display name and description for the workflow, and then select **Next**.

    :::image type="content" source="media/create-lifecycle-workflow/template-basics.png" alt-text="Screenshot of basic information about a workflow template.":::

1. On the **Configure scope** tab, select the trigger type and execution conditions to be used for this workflow. For more information on what you can configure, see [Configure scope](understanding-lifecycle-workflows.md#configure-scope).

1. Under **Rule**, enter values for **Property**, **Operator**, and **Value**. The following screenshot gives an example of a rule being set up for a sales department. For a full list of user properties that lifecycle workflows support, see [Supported user properties and query parameters](/graph/api/resources/identitygovernance-rulebasedsubjectset?view=graph-rest-beta&preserve-view=true#supported-user-properties-and-query-parameters).

    :::image type="content" source="media/create-lifecycle-workflow/template-scope.png" alt-text="Screenshot of scope configuration options for a lifecycle workflow template.":::

1. To view your rule syntax, select the **View rule syntax** button. You can copy and paste multiple user property rules on the panel that appears. For more information on which properties you can include, see [User properties](/graph/aad-advanced-queries?tabs=http#user-properties). When you finish adding rules, select **Next**.

    :::image type="content" source="media/create-lifecycle-workflow/template-syntax.png" alt-text="Screenshot of workflow rule syntax.":::

1. On the **Review tasks** tab, you can add a task to the template by selecting **Add task**. To enable an existing task on the list, select **Enable**. To disable a task, select **Disable**. To remove a task from the template, select **Remove**.

    When you're finished with tasks for your workflow, select **Next: Review and create**.

    :::image type="content" source="media/create-lifecycle-workflow/template-tasks.png" alt-text="Screenshot of adding tasks to templates.":::

1. On the **Review and create** tab, review the workflow's settings. You can also choose whether or not to enable the schedule for the workflow. Select **Create** to create the workflow.

    :::image type="content" source="media/create-lifecycle-workflow/template-review.png" alt-text="Screenshot of reviewing and creating a workflow.":::

> [!IMPORTANT]
> By default, a newly created workflow is disabled to allow for the testing of it first on smaller audiences. For more information about testing workflows before rolling them out to many users, see [Run an on-demand workflow](on-demand-workflow.md).

## Create a lifecycle workflow by using Microsoft Graph

To create a lifecycle workflow by using the Microsoft Graph API, see [Create workflow](/graph/api/identitygovernance-lifecycleworkflowscontainer-post-workflows).

## Next steps

- [Manage a workflow's properties](manage-workflow-properties.md)
- [Manage workflow versions](manage-workflow-tasks.md)
