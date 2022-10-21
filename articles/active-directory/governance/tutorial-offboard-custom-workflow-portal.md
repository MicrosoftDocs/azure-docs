---
title: 'Execute employee offboarding tasks in real-time on their last day of work with Azure portal (preview)'
description: Tutorial for off-boarding users from an organization using Lifecycle workflows with Azure portal (preview).
services: active-directory
author: amsliu
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.subservice: compliance
ms.date: 08/18/2022
ms.author: amsliu
ms.reviewer: krbain
ms.custom: template-tutorial
---

# Execute employee offboarding tasks in real-time on their last day of work with Azure portal (preview)

This tutorial provides a step-by-step guide on how to execute a real-time employee termination with Lifecycle workflows using the Azure portal.

This off-boarding scenario will run a workflow on-demand and accomplish the following tasks:
 
1. Remove user from all groups
2. Remove user from all Teams
3. Delete user account

You may learn more about running a workflow on-demand [here](on-demand-workflow.md).

##  Before you begin

As part of the prerequisites for completing this tutorial, you will need an account that has group and Teams memberships and that can be deleted during the tutorial. For more comprehensive instructions on how to complete these prerequisite steps, you may refer to  the [Preparing user accounts for Lifecycle workflows tutorial](tutorial-prepare-azure-ad-user-accounts.md).

The leaver scenario can be broken down into the following:
-	**Prerequisite:** Create a user account that represents an employee leaving your organization
-	**Prerequisite:** Prepare the user account with groups and Teams memberships
-	Create the lifecycle management workflow
-	Run the workflow on-demand
-	Verify that the workflow was successfully executed

## Create a workflow using leaver template
Use the following steps to create a leaver on-demand workflow that will execute a real-time employee termination with Lifecycle workflows using the Azure portal.

 1.  Sign in to Azure portal
 2.  On the right, select **Azure Active Directory**.
 3.  Select **Identity Governance**.
 4.  Select **Lifecycle workflows (Preview)**.
 5.  On the **Overview (Preview)** page, select **New workflow**. 
    :::image type="content" source="media/tutorial-lifecycle-workflows/new-workflow.png" alt-text="Screenshot of selecting new workflow." lightbox="media/tutorial-lifecycle-workflows/new-workflow.png":::

 6. From the templates, select **Select** under **Real-time employee termination**.
   :::image type="content" source="media/tutorial-lifecycle-workflows/select-template.png" alt-text="Screenshot of selecting template leaver workflow." lightbox="media/tutorial-lifecycle-workflows/select-template.png":::

 7. Next, you will configure the basic information about the workflow. Select **Next:Review tasks** when you are done with this step. 
   :::image type="content" source="media/tutorial-lifecycle-workflows/real-time-leaver.png" alt-text="Screenshot of review template tasks." lightbox="media/tutorial-lifecycle-workflows/real-time-leaver.png":::

 8. On the following page, you may inspect the tasks if desired but no additional configuration is needed. Select **Next: Select users** when you are finished.
   :::image type="content" source="media/tutorial-lifecycle-workflows/real-time-tasks.png" alt-text="Screenshot of template tasks." lightbox="media/tutorial-lifecycle-workflows/real-time-tasks.png":::

 9. For the user selection, select **Select users**. This allows you to select users for which the workflow will be executed immediately after creation. Regardless of the selection, you can run the workflow on-demand later at any time as needed.
   :::image type="content" source="media/tutorial-lifecycle-workflows/real-time-users.png" alt-text="Select real time leaver template users." lightbox="media/tutorial-lifecycle-workflows/real-time-users.png":::
 
 10. Next, select on **+Add users** to designate the users to be executed on this workflow.
   :::image type="content" source="media/tutorial-lifecycle-workflows/real-time-add-users.png" alt-text="Screenshot of real time leaver add users." lightbox="media/tutorial-lifecycle-workflows/real-time-add-users.png":::
 
 11. A panel with the list of available users will pop-up on the right side of the screen. Select **Select** when you are done with your selection.
   :::image type="content" source="media/tutorial-lifecycle-workflows/real-time-user-list.png" alt-text="Screenshot of real time leaver template selected users." lightbox="media/tutorial-lifecycle-workflows/real-time-user-list.png":::

 12. Select **Next: Review and create** when you are satisfied with your selection.
   :::image type="content" source="media/tutorial-lifecycle-workflows/real-time-review-users.png" alt-text="Screenshot of reviewing template users." lightbox="media/tutorial-lifecycle-workflows/real-time-review-users.png":::

 13. On the review blade, verify the information is correct and select **Create**.
   :::image type="content" source="media/tutorial-lifecycle-workflows/real-time-create.png" alt-text="Screenshot of creating real time leaver workflow." lightbox="media/tutorial-lifecycle-workflows/real-time-create.png":::

## Run the workflow 
Now that the workflow is created, it will automatically run the workflow every 3 hours. Lifecycle workflows will check every 3 hours for users in the associated execution condition and execute the configured tasks for those users.  However, for the tutorial, we would like to run it immediately. To run a workflow immediately, we can use the on-demand feature.

>[!NOTE]
>Be aware that you currently cannot run a workflow on-demand if it is set to disabled.  You need to set the workflow to enabled to use the on-demand feature.

To run a workflow on-demand, for users using the Azure portal, do the following steps:

 1. On the workflow screen, select the specific workflow you want to run.
 2. Select **Run on demand**.
 3. On the **select users** tab, select **add users**.
 4. Add a user.
 5. Select **Run workflow**.
 
## Check tasks and workflow status

At any time, you may monitor the status of the workflows and the tasks. As a reminder, there are three different data pivots, users runs, and tasks which are currently available in public preview. You may learn more in the how-to guide [Check the status of a workflow (preview)](check-status-workflow.md). In the course of this tutorial, we will look at the status using the user focused reports.

 1. To begin, select the **Workflow history (Preview)** tab on the left to view the user summary and associated workflow tasks and statuses.  
 :::image type="content" source="media/tutorial-lifecycle-workflows/workflow-history-real-time.png" alt-text="Screenshot of real time history overview." lightbox="media/tutorial-lifecycle-workflows/workflow-history-real-time.png":::

1. Once the **Workflow history (Preview)** tab has been selected, you will land on the workflow history page as shown.
 :::image type="content" source="media/tutorial-lifecycle-workflows/user-summary-real-time.png" alt-text="Screenshot of real time workflow history." lightbox="media/tutorial-lifecycle-workflows/user-summary-real-time.png":::

1. Next, you may select **Total tasks** for the user Jane Smith to view the total number of tasks created and their statuses. In this example, there are three total tasks assigned to the user Jane Smith.  
 :::image type="content" source="media/tutorial-lifecycle-workflows/total-tasks-real-time.png" alt-text="Screenshot of total tasks for real time workflow." lightbox="media/tutorial-lifecycle-workflows/total-tasks-real-time.png":::

1. To add an extra layer of granularity, you may select **Failed tasks** for the user Wade Warren to view the total number of failed tasks assigned to the user Wade Warren.
 :::image type="content" source="media/tutorial-lifecycle-workflows/failed-tasks-real-time.png" alt-text="Screenshot of failed tasks for real time workflow." lightbox="media/tutorial-lifecycle-workflows/failed-tasks-real-time.png":::

1. Similarly, you may select **Unprocessed tasks** for the user Wade Warren to view the total number of unprocessed or canceled tasks assigned to the user Wade Warren.
 :::image type="content" source="media/tutorial-lifecycle-workflows/canceled-tasks-real-time.png" alt-text="Screenshot of unprocessed tasks for real time workflow." lightbox="media/tutorial-lifecycle-workflows/canceled-tasks-real-time.png":::

## Next steps
- [Preparing user accounts for Lifecycle workflows (preview)](tutorial-prepare-azure-ad-user-accounts.md)
- [Complete employee offboarding tasks in real-time on their last day of work using Lifecycle Workflows APIs](/graph/tutorial-lifecycle-workflows-offboard-custom-workflow)