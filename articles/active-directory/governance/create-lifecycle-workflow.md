---
title: Create a Lifecycle Workflow- Azure AD (preview)
description: This article guides a user to creating a workflow using Lifecycle Workflows 
author: OWinfreyATL
ms.author: owinfrey
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to 
ms.date: 02/15/2022
ms.subservice: compliance
ms.custom: template-how-to 
---

# Create a Lifecycle workflow (Preview)
Lifecycle Workflows allows for tasks associated with the lifecycle process to be run automatically for users as they move through their life cycle in your organization. Workflows are made up of:
 - tasks - Actions taken when a workflow is triggered.
 - execution conditions - Define the who and when of a workflow. That is, who (scope) should this workflow run against, and when (trigger) should it run.

Workflows can be created and customized for common scenarios using templates, or you can build a template from scratch without using a template. Currently if you use the Azure portal, a created workflow must be based off a template. If you wish to create a workflow without using a template, you must create it using Microsoft Graph.

## Prerequisites

[!INCLUDE [Azure AD Premium P2 license](../../../includes/active-directory-p2-license.md)]

## Create a Lifecycle workflow using a template in the Azure portal

If you are using the Azure portal to create a workflow, you can customize existing templates to meet your organization's needs. This means you can customize the pre-hire common scenario template. To create a workflow based on one of these templates using the Azure portal do the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Azure Active Directory** and then select **Identity Governance**.

1. In the left menu, select **Lifecycle Workflows (Preview)**.

1. select **Workflows (Preview)** 

1. On the workflows screen, select the workflow template that you want to use. 
 :::image type="content" source="media/create-lifecycle-workflow/template-list.png" alt-text="Screenshot of a list of lifecycle workflows templates." lightbox="media/create-lifecycle-workflow/template-list.png":::
1. Enter a unique display name and description for the workflow and select **Next**.
 :::image type="content" source="media/create-lifecycle-workflow/template-basics.png" alt-text="Screenshot of workflow template basic information.":::

1. On the **configure scope** page select the **Trigger type** and execution conditions to be used for this workflow. For more information on what can be configured, see: [Configure scope](understanding-lifecycle-workflows.md#configure-scope).

1. Under rules, select the **Property**, **Operator**, and give it a **value**. The following picture gives an example of a rule being set up for a sales department. For a full list of user properties supported by Lifecycle Workflows, see [Supported user properties and query parameters](/graph/api/resources/identitygovernance-rulebasedsubjectset?view=graph-rest-beta#supported-user-properties-and-query-parameters?toc=/azure/active-directory/governance/toc.json&bc=/azure/active-directory/governance/breadcrumb/toc.json)

    :::image type="content" source="media/create-lifecycle-workflow/template-scope.png" alt-text="Screenshot of Lifecycle Workflows template scope configuration options.":::

1. To view your rule syntax, select the **View rule syntax** button. You can copy and paste multiple user property rules on this screen. For more detailed information on which properties that can be included see: [User Properties](/graph/aad-advanced-queries?tabs=http#user-properties). When you are finished adding rules, select **Next**.
    :::image type="content" source="media/create-lifecycle-workflow/template-syntax.png" alt-text="Screenshot of workflow rule syntax.":::

1. On the **Review tasks** page you can add a task to the template by selecting **Add task**. To enable an existing task on the list, select **enable**. You're also able to disable a task by selecting **disable**. To remove a task from the template, select **Remove** on the selected task. When you are finished with tasks for your workflow, select **Next**.

    :::image type="content" source="media/create-lifecycle-workflow/template-tasks.png" alt-text="Screenshot of adding tasks to templates.":::

1. On the **Review+create** page you are able to review the workflow's settings. You can also choose whether or not to enable the schedule for the workflow. Select **Create** to create the workflow.

    :::image type="content" source="media/create-lifecycle-workflow/template-review.png" alt-text="Screenshot of reviewing and creating a template.":::



> [!IMPORTANT]
> By default, a newly created workflow is disabled to allow for the testing of it first on smaller audiences. For more information about testing workflows before rolling them out to many users, see: [run an on-demand workflow](on-demand-workflow.md).

## Create a workflow using Microsoft Graph

To create a workflow using Microsoft Graph API, see [Create workflow (lifecycle workflow)](/graph/api/identitygovernance-lifecycleworkflowscontainer-post-workflows)

## Next steps

- [Manage a workflow's properties](manage-workflow-properties.md)
- [Manage Workflow Versions](manage-workflow-tasks.md)
