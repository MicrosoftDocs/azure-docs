---
title: Execute employee termination tasks by using lifecycle workflows
description: Learn how to remove users from an organization in real time on their last day of work by using lifecycle workflows in the Azure portal.
services: active-directory
author: owinfreyATL
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.subservice: compliance
ms.date: 06/22/2023
ms.author: owinfrey
ms.reviewer: krbain
ms.custom: template-tutorial
---

# Execute employee termination tasks by using lifecycle workflows

This tutorial provides a step-by-step guide on how to execute a real-time employee termination by using lifecycle workflows in the Azure portal.

This *leaver* scenario runs a workflow on demand and accomplishes the following tasks:

- Remove the user from all groups.
- Remove the user from all Microsoft Teams memberships.
- Delete the user account.

For more information, see [Run a workflow on demand](on-demand-workflow.md).

## Prerequisites

[!INCLUDE [Microsoft Entra ID Governance license](../../../includes/active-directory-entra-governance-license.md)]


## Before you begin

As part of the prerequisites for completing this tutorial, you need an account that has group and Teams memberships and that can be deleted during the tutorial. For comprehensive instructions on how to complete these prerequisite steps, see [Prepare user accounts for lifecycle workflows](tutorial-prepare-user-accounts.md).

The leaver scenario includes the following steps:

1. Prerequisite: Create a user account that represents an employee leaving your organization.
1. Prerequisite: Prepare the user account with group and Teams memberships.
1. Create the lifecycle management workflow.
1. Run the workflow on demand.
1. Verify that the workflow was successfully executed.

## Create a workflow by using the leaver template

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Use the following steps to create a leaver on-demand workflow that will execute a real-time employee termination by using lifecycle workflows in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the right, select **Azure Active Directory**.
3. Select **Identity Governance**.
4. Select **Lifecycle workflows**.
5. On the **Overview** tab, select **New workflow**.

    :::image type="content" source="media/tutorial-lifecycle-workflows/new-workflow.png" alt-text="Screenshot of the Overview tab and the button for creating a new workflow." lightbox="media/tutorial-lifecycle-workflows/new-workflow.png":::

6. From the collection of templates, choose **Select** under **Real-time employee termination**.

    :::image type="content" source="media/tutorial-lifecycle-workflows/select-template.png" alt-text="Screenshot of selecting a workflow template for real-time employee termination." lightbox="media/tutorial-lifecycle-workflows/select-template.png":::

7. Configure basic information about the workflow, and then select **Next: Review tasks**.

    :::image type="content" source="media/tutorial-lifecycle-workflows/real-time-leaver.png" alt-text="Screenshot of the tab for basic workflow information." lightbox="media/tutorial-lifecycle-workflows/real-time-leaver.png":::

8. Inspect the tasks if you want, but no additional configuration is needed. Select **Next: Select users** when you're finished.

    :::image type="content" source="media/tutorial-lifecycle-workflows/real-time-tasks.png" alt-text="Screenshot of the tab for reviewing template tasks." lightbox="media/tutorial-lifecycle-workflows/real-time-tasks.png":::

9. Choose the **Select users to run now** option. It allows you to select users for which the workflow will be executed immediately after creation. Regardless of the selection, you can run the workflow on demand later at any time, as needed.

    :::image type="content" source="media/tutorial-lifecycle-workflows/real-time-users.png" alt-text="Screenshot of the option for selecting users to run now." lightbox="media/tutorial-lifecycle-workflows/real-time-users.png":::

10. Select **Add users** to designate the users for this workflow.

    :::image type="content" source="media/tutorial-lifecycle-workflows/real-time-add-users.png" alt-text="Screenshot of the button for adding users." lightbox="media/tutorial-lifecycle-workflows/real-time-add-users.png":::

11. A panel with the list of available users appears on the right side of the window. Choose **Select** when you're done with your selection.

    :::image type="content" source="media/tutorial-lifecycle-workflows/real-time-user-list.png" alt-text="Screenshot of a list of available users." lightbox="media/tutorial-lifecycle-workflows/real-time-user-list.png":::

12. Select **Next: Review and create** when you're satisfied with your selection of users.

    :::image type="content" source="media/tutorial-lifecycle-workflows/real-time-review-users.png" alt-text="Screenshot of added users." lightbox="media/tutorial-lifecycle-workflows/real-time-review-users.png":::

13. Verify that the information is correct, and then select **Create**.

    :::image type="content" source="media/tutorial-lifecycle-workflows/real-time-create.png" alt-text="Screenshot of the tab for reviewing workflow choices, along with the button for creating the workflow." lightbox="media/tutorial-lifecycle-workflows/real-time-create.png":::

## Run the workflow

Now that you've created the workflow, it will automatically run every three hours. Lifecycle workflows check every three hours for users in the associated execution condition and execute the configured tasks for those users.

To run the workflow immediately, you can use the on-demand feature.

> [!NOTE]
> You currently can't run a workflow on demand if it's set to **Disabled**. You need to set the workflow to **Enabled** to use the on-demand feature.

To run a workflow on demand for users by using the Azure portal:

1. On the workflow screen, select the specific workflow that you want to run.
2. Select **Run on demand**.
3. On the **Select users** tab, select **Add users**.
4. Add users.
5. Select **Run workflow**.

## Check tasks and workflow status

At any time, you can monitor the status of workflows and tasks. Three data pivots, users runs, and tasks are currently available. You can learn more in the how-to guide [Check the status of a workflow](check-status-workflow.md). In this tutorial, you check the status by using the user-focused reports.

1. On the **Overview** page for the workflow, select **Workflow history**.  

   :::image type="content" source="media/tutorial-lifecycle-workflows/workflow-history-real-time.png" alt-text="Screenshot of the overview page for a workflow." lightbox="media/tutorial-lifecycle-workflows/workflow-history-real-time.png":::

   The **Workflow history** page appears.

   :::image type="content" source="media/tutorial-lifecycle-workflows/user-summary-real-time.png" alt-text="Screenshot of real-time workflow history." lightbox="media/tutorial-lifecycle-workflows/user-summary-real-time.png":::

1. Select **Total tasks** for a user to view the total number of tasks created and their statuses.

   :::image type="content" source="media/tutorial-lifecycle-workflows/total-tasks-real-time.png" alt-text="Screenshot of total tasks for a real-time workflow." lightbox="media/tutorial-lifecycle-workflows/total-tasks-real-time.png":::

1. To add an extra layer of granularity, select **Failed tasks** for a user to view the total number of failed tasks assigned to that user.

   :::image type="content" source="media/tutorial-lifecycle-workflows/failed-tasks-real-time.png" alt-text="Screenshot of failed tasks for a real-time workflow." lightbox="media/tutorial-lifecycle-workflows/failed-tasks-real-time.png":::

1. Select **Unprocessed tasks** for a user to view the total number of unprocessed or canceled tasks assigned to that user.

   :::image type="content" source="media/tutorial-lifecycle-workflows/canceled-tasks-real-time.png" alt-text="Screenshot of unprocessed tasks for a real-time workflow." lightbox="media/tutorial-lifecycle-workflows/canceled-tasks-real-time.png":::

## Next steps

- [Prepare user accounts for lifecycle workflows](tutorial-prepare-user-accounts.md)
- [Complete tasks in real time on an employee's last day of work by using lifecycle workflow APIs](/graph/tutorial-lifecycle-workflows-offboard-custom-workflow)
