---
title: 'Tutorial: Off-boarding users from your organization using Lifecycle workflows with Azure portal (preview)'
description: Tutorial for off-boarding users from an organization using Lifecycle workflows with Azure portal (preview).
services: active-directory
author: amsliu
manager: rkarlin
ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.subservice: compliance
ms.date: 06/06/2022
ms.author: amsliu
ms.reviewer: krbain
ms.custom: template-tutorial
---

# Off-boarding users from your organization using Lifecycle workflows with Azure portal (preview)

This tutorial provides a step-by-step guide on how to execute a real-time employee termination with Lifecycle workflows using the Azure portal.

This off-boarding scenario will run a workflow on-demand and accomplish the following tasks:
 
1. Remove user from all groups
2. Remove user from all Teams
3. Delete user account

You may learn more about running a workflow on-demand [here](on-demand-workflow.md).

## Before you begin

As part of the prerequisites for completing this tutorial, you will need an account that has group and Teams memberships that can be deleted during the tutorial. For more comprehensive instructions on how to complete these prerequisite steps, you may refer to [Preparing user accounts for Lifecycle workflows tutorial](tutorial-prepare-azuread-user-accounts.md).

The leaver scenario can be broken down into the following:

  - **Prerequisite**: Create a user account that represents an employee leaving your organization
  - **Prerequisite**: Prepare the user account with groups and Teams memberships
  - Create the lifecycle management workflow
  - Run the workflow on-demand
  - Verify that the workflow was successfully executed

## Create a workflow using leaver template
Use the following steps to create a leaver on-demand workflow that will execute a real-time employee termination with Lifecycle workflows using the Azure portal.

 1.  Sign in to [Azure portal](https://portal.azure.com).
 2.  On the right, select **Azure Active Directory**.
 3.  Select **Identity Governance**.
 4.  Select **Lifecycle workflows (Preview)**.
 5.  On the **Overview (Preview)** page, select **New workflow**. 
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-2-1.png" alt-text="New workflow" lightbox="media/tutorial-lifecycle-workflows/portal-1.png":::

 6. From the templates, select **Select** under **Real-time employee termination**.
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-2-2.png" alt-text="Leaver workflow" lightbox="media/tutorial-lifecycle-workflows/portal-2-2.png":::

 7. Next, you will configure the workflow details and trigger details. Select **Next:Review tasks** when you are done with this step. 
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-2-3.png" alt-text="Configure workflow" lightbox="media/tutorial-lifecycle-workflows/portal-2-3.png":::
 
 8. On the following page, you may inspect the tasks if desired but no additional configuration is needed.
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-2-4.png" alt-text="Review workflow task" lightbox="media/tutorial-lifecycle-workflows/portal-2-4.png":::

 9. Once you are satisfied with the settings for the task, select **Save** to save your configurations.
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-2-5.png" alt-text="Save workflow task" lightbox="media/tutorial-lifecycle-workflows/portal-2-5.png":::

 10. Select **Next: Select users** when you are finished.
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-2-6.png" alt-text="Select next" lightbox="media/tutorial-lifecycle-workflows/portal-2-6.png":::

 11. For the user selection, select **Select users**. This allows you to select users for which the workflow will be executed immediately after creation. Regardless of the selection, you can run the workflow on-demand later at any time as needed.
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-2-7.png" alt-text="Select users" lightbox="media/tutorial-lifecycle-workflows/portal-2-7.png":::
 
 12. Next, select on **+Add users** to designate the users to be executed on this workflow.
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-2-8.png" alt-text="Add users" lightbox="media/tutorial-lifecycle-workflows/portal-2-8.png":::
 
 13. A panel with the list of available users will pop-up on the right side of the screen. Select **Select** when you are done with your selection.
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-2-10.png" alt-text="Selected users" lightbox="media/tutorial-lifecycle-workflows/portal-2-10.png":::

 14. Select **Next: Review and create** when you are satisfied with your selection.
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-2-11.png" alt-text="Select next" lightbox="media/tutorial-lifecycle-workflows/portal-2-11.png":::

 15. Finally, review the workflow and select **Create** when you are ready to create the workflow.
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-2-12.png" alt-text="Create workflow" lightbox="media/tutorial-lifecycle-workflows/portal-2-12.png":::

## Check tasks and workflow status

At any time, you may monitor the status of the workflows and the tasks. As a reminder, there are two different data pivots, users and runs, which are currently available in private preview. You may learn more in the how-to guide [Check the status of a workflow (preview)](check-status-workflow).

To begin, select the **Workflow history (Preview)** tab to view the user summary and associated workflow tasks and statuses. Once the **Workflow history (Preview)** tab has been selected, you will land on the workflow history page as shown.

  :::image type="content" source="media/tutorial-lifecycle-workflows/portal-2-13.png" alt-text="Workflow history" lightbox="media/tutorial-lifecycle-workflows/portal-2-13.png":::

You may then select the desired run and monitor the status of the users and tasks of the run from the panel that appears on the right.

 :::image type="content" source="media/tutorial-lifecycle-workflows/portal-2-14.png" alt-text="Workflow history details" lightbox="media/tutorial-lifecycle-workflows/portal-2-14.png":::

This panel will show you the details about the users including their name, complete date, status, total tasks, failed tasks, unprocessed tasks, and more.

## Next steps
- [Tutorial: Preparing user accounts for Lifecycle workflows (preview)](tutorial-prepare-azuread-user-accounts.md)
- [Tutorial: Off-boarding users from your organization using Lifecycle workflows with Microsoft Graph (preview)](tutorial-offboard-custom-workflow-graph.md)