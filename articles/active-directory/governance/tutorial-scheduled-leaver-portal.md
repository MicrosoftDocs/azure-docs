---
title: 'Post off-boarding users from your organization using Lifecycle workflows with Azure portal (preview)'
description: Tutorial for post off-boarding users from an organization using Lifecycle workflows with Azure portal (preview).
services: active-directory
author: amsliu
manager: rkarlin
ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.subservice: compliance
ms.date: 08/01/2022
ms.author: amsliu
ms.reviewer: krbain
ms.custom: template-tutorial
---
# Post off-boarding users from your organization using Lifecycle workflows with Azure portal (preview)

This tutorial provides a step-by-step guide on how to configure off-boarding tasks for employees after their last day of work with Lifecycle workflows using the Azure portal.

This post off-boarding scenario will run a scheduled workflow and accomplish the following tasks:
 
1. Remove all licenses for user
2. Remove user from all Teams
3. Delete user account

##  Before you begin

As part of the prerequisites for completing this tutorial, you will need an account that has licenses and Teams memberships that can be deleted during the tutorial. For more comprehensive instructions on how to complete these prerequisite steps, you may refer to  the [Preparing user accounts for Lifecycle workflows tutorial](tutorial-prepare-azuread-user-accounts.md).

The scheduled leaver scenario can be broken down into the following:
-	**Prerequisite:** Create a user account that represents an employee leaving your organization
-	**Prerequisite:** Prepare the user account with licenses and Teams memberships
- Create the lifecycle management workflow
-	Run the scheduled workflow after last day of work
-	Verify that the workflow was successfully executed

## Create a workflow using scheduled leaver template
Use the following steps to create a scheduled leaver workflow that will configure off-boarding tasks for employees after their last day of work with Lifecycle workflows using the Azure portal.

 1.  Sign in to Azure portal
 2.  On the right, select **Azure Active Directory**.
 3.  Select **Identity Governance**.
 4.  Select **Lifecycle workflows (Preview)**.
 5.  On the **Overview (Preview)** page, select **New workflow**. 
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-2-1.png" alt-text="New workflow" lightbox="media/tutorial-lifecycle-workflows/portal-1.png":::

 6. From the templates, select **Select** under **Post-offboarding of an employee**.
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-3-1.png" alt-text="Leaver workflow" lightbox="media/tutorial-lifecycle-workflows/portal-3-1.png":::

 7. Next, you will configure the workflow details and trigger details. Select **Next: Configure Scope** when you are done with this step. 
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-3-2.png" alt-text="Configure workflow" lightbox="media/tutorial-lifecycle-workflows/portal-3-2.png":::
 
 8. On the following page, you may inspect the scope details if desired but no additional configuration is needed. Select **Next: Review tasks** when you are done with this step.
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-3-3.png" alt-text="Review scope details" lightbox="media/tutorial-lifecycle-workflows/portal-3-3.png":::

 9. You may then inspect the tasks if desired but no additional configuration is needed.
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-3-4.png" alt-text="Review workflow task" lightbox="media/tutorial-lifecycle-workflows/portal-3-4.png":::

10. Once you are satisfied with the settings for the task, select **Save** to save your configurations. 
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-3-5.png" alt-text="Save workflow task" lightbox="media/tutorial-lifecycle-workflows/portal-3-5.png":::

11. Select **Enable schedule** under **Schedule Workflow** when you are finished.
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-3-6.png" alt-text="Select enable" lightbox="media/tutorial-lifecycle-workflows/portal-3-6.png":::

12. Finally, review the workflow and select **Create** when you are ready to create the workflow.
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-3-7.png" alt-text="Create workflow" lightbox="media/tutorial-lifecycle-workflows/portal-3-7.png":::
 
 ## Check tasks and workflow status

At any time, you may monitor the status of the workflows and the tasks. As a reminder, there are two different data pivots, users and runs, which are currently available in private preview. You may learn more in the how-to guide [Check the status of a workflow (preview)](check-status-workflow).

To begin, select the **Workflow history (Preview)** tab to view the user summary and associated workflow tasks and statuses. Once the **Workflow history (Preview)** tab has been selected, you will land on the workflow history page as shown.

  :::image type="content" source="media/tutorial-lifecycle-workflows/portal-3-9.png" alt-text="Workflow history" lightbox="media/tutorial-lifecycle-workflows/portal-2-13.png":::

You may then select the desired run and monitor the status of the users and tasks of the run from the panel that appears on the right.

 :::image type="content" source="media/tutorial-lifecycle-workflows/portal-3-10.png" alt-text="Workflow history details" lightbox="media/tutorial-lifecycle-workflows/portal-2-14.png":::

This panel will show you the details about the users including their name, complete date, status, total tasks, failed tasks, unprocessed tasks, and more.

## Next steps
- [Preparing user accounts for Lifecycle workflows (preview)](tutorial-prepare-azuread-user-accounts.md)
- [Post off-boarding users from your organization using Lifecycle workflows with Microsoft Graph (preview)](tutorial-scheduled-leaver-graph.md)







