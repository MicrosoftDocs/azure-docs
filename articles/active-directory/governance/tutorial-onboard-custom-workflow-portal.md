---
title: 'Automate employee onboarding tasks before their first day of work with Azure portal'
description: Tutorial for onboarding users to an organization using Lifecycle workflows with Azure portal.
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

# Automate employee onboarding tasks before their first day of work with Azure portal

This tutorial provides a step-by-step guide on how to automate prehire tasks with Lifecycle workflows using the Azure portal. 

This prehire scenario generates a temporary access pass for our new employee and sends it via email to the user's new manager.  

:::image type="content" source="media/tutorial-lifecycle-workflows/arch-2.png" alt-text="Screenshot of the lifecycle workflow scenario." lightbox="media/tutorial-lifecycle-workflows/arch-2.png":::

## Prerequisites

[!INCLUDE [Microsoft Entra ID Governance license](../../../includes/active-directory-entra-governance-license.md)]


##  Before you begin

Two accounts are required for this tutorial, one account for the new hire and another account that acts as the manager of the new hire. The new hire account must have the following attributes set:

-	employeeHireDate must be set to today
-	Department must be set to sales
-	Manager attribute must be set, and the manager account should have a mailbox to receive an email

For more comprehensive instructions on how to complete these prerequisite steps, you may refer to the [Preparing user accounts for Lifecycle workflows tutorial](tutorial-prepare-user-accounts.md). The [TAP policy](../authentication/howto-authentication-temporary-access-pass.md#enable-the-temporary-access-pass-policy) must also be enabled to run this tutorial.

Detailed breakdown of the relevant attributes:

 | Attribute | Description |Set on|
 |:--- |:---:|-----|
 |mail|Used to notify manager of the new employees temporary access pass|Both|
 |manager|This attribute that is used by the lifecycle workflow|Employee|
 |employeeHireDate|Used to trigger the workflow|Employee|
 |department|Used to provide the scope for the workflow|Employee|

The pre-hire scenario can be broken down into the following:
  - **Prerequisite:** Create two user accounts, one to represent an employee and one to represent a manager
  - **Prerequisite:** Editing the attributes required for this scenario in the portal
  - **Prerequisite:** Edit the attributes for this scenario using Microsoft Graph Explorer
  - **Prerequisite:** Enabling and using Temporary Access Pass (TAP)
  - Creating the lifecycle management workflow
  - Triggering the workflow
  - Verifying the workflow was successfully executed

## Create a workflow using prehire template

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Use the following steps to create a pre-hire workflow that generates a TAP and send it via email to the user's manager using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the right, select **Azure Active Directory**.
3. Select **Identity Governance**.
4. Select **Lifecycle workflows**.
5. On the **Overview** page, select **New workflow**.
    :::image type="content" source="media/tutorial-lifecycle-workflows/new-workflow.png" alt-text="Screenshot of selecting a new workflow." lightbox="media/tutorial-lifecycle-workflows/new-workflow.png":::

6. From the templates, select **select** under **Onboard pre-hire employee**.
    :::image type="content" source="media/tutorial-lifecycle-workflows/select-template.png" alt-text="Screenshot of selecting workflow template." lightbox="media/tutorial-lifecycle-workflows/select-template.png":::

7. Next, you configure the basic information about the workflow.  This information includes when the workflow triggers, known as **Days from event**.  So in this case, the workflow triggers two days before the employee's hire date.  On the onboard pre-hire employee screen, add the following settings and then select **Next: Configure Scope**.

    :::image type="content" source="media/tutorial-lifecycle-workflows/configure-scope.png" alt-text="Screenshot of selecting a configuration scope." lightbox="media/tutorial-lifecycle-workflows/configure-scope.png":::

8. Next, you configure the scope. The scope determines which users this workflow runs against.  In this case, it is on all users in the Sales department.  On the configure scope screen, under **Rule** add the following settings and then select **Next: Review tasks**. For a full list of supported user properties, see [Supported user properties and query parameters](/graph/api/resources/identitygovernance-rulebasedsubjectset?view=graph-rest-beta&preserve-view=true#supported-user-properties-and-query-parameters).

    :::image type="content" source="media/tutorial-lifecycle-workflows/review-tasks.png" alt-text="Screenshot of selecting review tasks." lightbox="media/tutorial-lifecycle-workflows/review-tasks.png":::

9. On the following page, you may inspect the task if desired but no additional configuration is needed. Select **Next: Review + Create** when you're finished.
    :::image type="content" source="media/tutorial-lifecycle-workflows/onboard-review-create.png" alt-text="Screenshot of reviewing an on-board workflow." lightbox="media/tutorial-lifecycle-workflows/onboard-review-create.png":::

10. On the review blade, verify the information is correct and select **Create**.
    :::image type="content" source="media/tutorial-lifecycle-workflows/onboard-create.png" alt-text="Screenshot of creating an onboard workflow." lightbox="media/tutorial-lifecycle-workflows/onboard-create.png":::

## Run the workflow 
Now that the workflow is created, it will automatically run the workflow every 3 hours. Lifecycle workflows check every 3 hours for users in the associated execution condition and execute the configured tasks for those users.  However, for the tutorial, we would like to run it immediately. To run a workflow immediately, we can use the on-demand feature.

>[!NOTE]
>Be aware that you currently cannot run a workflow on-demand if it is set to disabled.  You need to set the workflow to enabled to use the on-demand feature.

To run a workflow on-demand, for users using the Azure portal, do the following steps:

 1. On the workflow screen, select the specific workflow you want to run.
 2. Select **Run on demand**.
 3. On the **select users** tab, select **add users**.
 4. Add a user.
 5. Select **Run workflow**.


## Check tasks and workflow status

At any time, you may monitor the status of the workflows and the tasks. As a reminder, there are three different data pivots, users runs, and tasks that are currently available. You may learn more in the how-to guide [Check the status of a workflow](check-status-workflow.md). In the course of this tutorial, we look at the status using the user focused reports.

 1. To begin, select the **Workflow history** tab to view the user summary and associated workflow tasks and statuses.  
 :::image type="content" source="media/tutorial-lifecycle-workflows/workflow-history.png" alt-text="Screenshot of workflow History status." lightbox="media/tutorial-lifecycle-workflows/workflow-history.png":::

1. Once the **Workflow history** tab has been selected, you land on the workflow history page as shown.
 :::image type="content" source="media/tutorial-lifecycle-workflows/user-summary.png" alt-text="Screenshot of workflow history overview" lightbox="media/tutorial-lifecycle-workflows/user-summary.png":::

1. Next, you may select **Total tasks** for the user Jane Smith to view the total number of tasks created and their statuses. In this example, there are three total tasks assigned to the user Jane Smith.  
 :::image type="content" source="media/tutorial-lifecycle-workflows/total-tasks.png" alt-text="Screenshot of workflow total task summary." lightbox="media/tutorial-lifecycle-workflows/total-tasks.png":::

1. To add an extra layer of granularity, you may select **Failed tasks** for the user Jeff Smith to view the total number of failed tasks assigned to the user Jeff Smith.
 :::image type="content" source="media/tutorial-lifecycle-workflows/failed-tasks.png" alt-text="Screenshot of workflow failed tasks." lightbox="media/tutorial-lifecycle-workflows/failed-tasks.png":::

1. Similarly, you may select **Unprocessed tasks** for the user Jeff Smith to view the total number of unprocessed or canceled tasks assigned to the user Jeff Smith.
 :::image type="content" source="media/tutorial-lifecycle-workflows/canceled-tasks.png" alt-text="Screenshot of workflow unprocessed tasks summary." lightbox="media/tutorial-lifecycle-workflows/canceled-tasks.png":::

## Enable the workflow schedule

After running your workflow on-demand and checking that everything is working fine, you may want to enable the workflow schedule. To enable the workflow schedule, you may select the **Enable Schedule** checkbox on the Properties page.

:::image type="content" source="media/tutorial-lifecycle-workflows/enable-schedule.png" alt-text="Screenshot of enabling workflow schedule." lightbox="media/tutorial-lifecycle-workflows/enable-schedule.png":::

## Next steps
- [Tutorial: Preparing user accounts for Lifecycle workflows](tutorial-prepare-user-accounts.md)
- [Automate employee onboarding tasks before their first day of work using Lifecycle Workflows APIs](/graph/tutorial-lifecycle-workflows-onboard-custom-workflow)
