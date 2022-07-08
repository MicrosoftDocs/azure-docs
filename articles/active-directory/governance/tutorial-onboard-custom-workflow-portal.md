---
title: 'Tutorial: On-boarding users to your organization using Lifecycle workflows with Azure portal (preview)'
description: Tutorial for onboarding users to an organization using Lifecycle workflows with Azure portal (preview).
services: active-directory
author: amsliu
manager: rkarlin
ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.subservice: compliance
ms.date: 04/26/2022
ms.author: amsliu
ms.reviewer: krbain
ms.custom: template-tutorial
---

# On-boarding users to your organization using Lifecycle workflows with Azure portal (preview)

This tutorial provides a step-by-step guide on how to automate pre-hire tasks with Lifecycle workflows using the Azure portal. 

This pre-hire scenario will generate a temporary access pass for our new employee and send it via email to the user's new manager.  
:::image type="content" source="media/tutorial-lifecycle-workflows/arch-2.png" alt-text="Architectural overview" lightbox="media/tutorial-lifecycle-workflows/arch-2.png":::

## Before you begin

For more comprehensive instructions on how to complete these prerequisite steps, you may refer to [Preparing user accounts for Lifecycle workflows tutorial](tutorial-prepare-azuread-user-accounts.md). The [TAP policy](/azure/active-directory/authentication/howto-authentication-temporary-access-pass#enable-the-temporary-access-pass-policy) must also be enabled to run this tutorial.

Detailed breakdown of the relevant attributes:

 | Attribute | Description |Set on|
 |:--- |:---:|-----|
 |mail|Used to notify manager of the new employees temporary access pass|Both|
 |manager|This attribute that is used by the lifecycle workflow|Employee|
 |employeeHireDate|Used to trigger the workflow|Employee|
 |department|Used to provide the scope for the workflow|Employee|

For the tutorial, the **mail** attribute only needs to be set on the manager account and the **manager** attribute set on the employee account.  We set the **mail** attribute on both users just to keep the code consistent.  Use the following steps below to create the users.

For this scenario, we will simulate users that are provisioned from on-premises or an HR system.  We're going to create them and populate the data that is required to successfully execute the lifecycle workflow.   This action will be done automatically using a PowerShell script.

The pre-hire scenario can be broken down into the following:
  - Create two user accounts, one to represent an employee and one to represent a manager
  - Editing the attributes required for this scenario in the portal
  - Edit the attributes for this scenario using Microsoft Graph Explorer
  - Enabling and using Temporary Access Pass (TAP)
  - Creating the lifecycle management workflow
  - Triggering the workflow
  - Verifying the workflow was successfully executed

## Create a workflow using pre-hire template

Use the following steps to create a pre-hire workflow that will generate a TAP and send it via email to the user's manager using the Azure portal.

 1.  Sign in to [Azure portal](https://portal.azure.com).
 2.  On the right, select **Azure Active Directory**.
 3.  Select **Identity Governance**.
 4.  Select **Lifecycle workflows (Preview)**.
 5.  On the **Overview (Preview)** page, select **New workflow**.
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-1.png" alt-text="New workflow" lightbox="media/tutorial-lifecycle-workflows/portal-1.png":::

 6. From the templates, select **select** under **Onboard pre-hire employee**.
  :::image type="content" source="media/tutorial-lifecycle-workflows/portal-2.png" alt-text="Select workflow" lightbox="media/tutorial-lifecycle-workflows/portal-2.png":::
    
 7.  Next, you will configure the basic information about the workflow.  This information includes when the workflow will trigger, known as **Days from event**.  So in this case, the workflow will trigger two days before the employee's hire date.  On the onboard pre-hire employee screen, provide the following and then select **Next: Configure Scope**.
        - **Name**:  Pre-hire employee
        - **Description**: Configure pre-hire tasks for onboarding employees before their first day
        - **Days from event**: 2 
     :::image type="content" source="media/tutorial-lifecycle-workflows/portal-3.png" alt-text="Configure workflow" lightbox="media/tutorial-lifecycle-workflows/portal-3.png":::

   8.  Next, you will configure the scope. The scope determines which users this workflow will run against.  In this case, it will be on all users in the Sales department.  On the configure scope screen, under **Rule** add the following and then select **Next: Review tasks**
		- **Property**:  department
		- **Operator**:  equal
		- **Value**:  Sales
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-5.png" alt-text="Scope workflow" lightbox="media/tutorial-lifecycle-workflows/portal-5.png":::

   9. On the **Review tasks** screen, then select **Next: Review + Create**.
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-6.png" alt-text="Review workflow" lightbox="media/tutorial-lifecycle-workflows/portal-6.png":::

   10.  On the review blade, verify the information is correct and select **Create**.
   :::image type="content" source="media/tutorial-lifecycle-workflows/portal-4.png" alt-text="Create workflow" lightbox="media/tutorial-lifecycle-workflows/portal-4.png":::

   11.  Back on the **Lifecycle workflows** screen, place a check in the new workflow (Pre-hire employee) and select **Enable** at the top.
 
## Run the workflow 

Now that the workflow is created, it will automatically run the workflow every 3 hours. Lifecycle workflows will check every 3 hours for users in the associated execution condition and execute the configured tasks for those users. However, for the tutorial, we would like to run it immediately. To run a workflow immediately, we can use the on-demand feature.

>[!NOTE]
>Be aware that you currently cannot run a workflow on-demand if it is set to disabled.  You need to set the workflow to enabled to use the on-demand feature.

To run a workflow on-demand, for users using the Azure portal, do the following steps:

 1. On the workflow screen, select the specific workflow you want to run.
 2. Select **Run on demand**.
 3. On the **select users** tab, select **add users**.
 4. Add **Melva Prince**
 5. Select **Run workflow**.


## Check tasks and workflow status

At any time, you may monitor the status of the workflows and the tasks. As a reminder, there are two different data pivots, users and runs, which are currently available in private preview. You may learn more in the how-to guide [Check the status of a workflow](check-status-workflow.md).

 To begin, select the **Workflow history (Preview)** tab on the left to view the user summary and associated workflow tasks and statuses.  
 :::image type="content" source="media/tutorial-lifecycle-workflows/workflow-history.png" alt-text="Workflow 1" lightbox="media/tutorial-lifecycle-workflows/workflow-history.png":::

Once the **Workflow history (Preview)** tab has been selected, you will land on the workflow history page as shown.
 :::image type="content" source="media/tutorial-lifecycle-workflows/user-summary.png" alt-text="Workflow 2" lightbox="media/tutorial-lifecycle-workflows/user-summary.png":::

Next, you may select **Total tasks** for the user Jane Smith to view the total number of tasks created and their statuses. In this example, there are three total tasks assigned to the user Jane Smith.  
 :::image type="content" source="media/tutorial-lifecycle-workflows/total-tasks.png" alt-text="Workflow 3" lightbox="media/tutorial-lifecycle-workflows/total-tasks.png":::

To add an extra layer of granularity, you may select **Failed tasks** for the user Jeff Smith to view the total number of failed tasks assigned to the user Jeff Smith.
 :::image type="content" source="media/tutorial-lifecycle-workflows/failed-tasks.png" alt-text="Workflow 4" lightbox="media/tutorial-lifecycle-workflows/failed-tasks.png":::

Similarly, you may select **Unprocessed tasks** for the user Jeff Smith to view the total number of unprocessed or canceled tasks assigned to the user Jeff Smith.
 :::image type="content" source="media/tutorial-lifecycle-workflows/canceled-tasks.png" alt-text="Workflow 5" lightbox="media/tutorial-lifecycle-workflows/canceled-tasks.png":::

## Next steps
- [Tutorial: Preparing user accounts for Lifecycle workflows (preview)](tutorial-prepare-azuread-user-accounts.md)
- [On-boarding users to your organization using Lifecycle workflows with Microsoft Graph (preview)](tutorial-onboard-custom-workflow-graph.md)
