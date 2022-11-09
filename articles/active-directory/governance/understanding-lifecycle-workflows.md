---
title: 'Understanding lifecycle workflows- Azure Active Directory'
description: Describes an overview of Lifecycle workflows and the various parts.
services: active-directory
author: owinfrey
manager: billmath
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 01/20/2022
ms.subservice: compliance
ms.author: owinfrey
ms.collection: M365-identity-device-management
---
# Understanding lifecycle workflows 

The following reference document provides an overview of a workflow created using Lifecycle Workflows. Lifecycle Workflows allow you to create workflows that automate common tasks associated with user lifecycle in organizations. Lifecycle Workflows automate tasks based on the joiner-mover-leaver cycle of lifecycle management, and splits tasks for users up into categories of where they are in the lifecycle of an organization. These categories extend into templates where they can be quickly customized to suit the needs of users in your organization. For more information, see: [What are Lifecycle Workflows?](what-are-lifecycle-workflows.md).

  [![Diagram of a lifecycle workflow](media/understanding-lifecycle-workflows/workflow-2.png)](media/understanding-lifecycle-workflows/workflow-2.png#lightbox)

## Licenses and Permissions


[!INCLUDE [Azure AD Premium P2 license](../../../includes/active-directory-p2-license.md)]

|Parameter  |Display String  |Description  |Admin Consent Required  |
|---------|---------|---------|---------|
|LifecycleWorkflows.Read.All     | Read all lifecycle workflows and tasks.| Allows the app to list and read all workflows and tasks related to lifecycle workflows on behalf of the signed-in user.| Yes
|LifecycleWorkflows.ReadWrite.All     | Read and write all lifecycle workflows and tasks.| Allows the app to create, update, list, read and delete all workflows and tasks related to lifecycle workflows on behalf of the signed-in user.| Yes

## Parts of a workflow 
A workflow can be broken down in to the following three main parts.

|Workflow part|Description|
|-----|-----|
|General information|This portion of a workflow covers basic information such as display name and a description of what the workflow does.|
|Tasks|Tasks are the actions that will be taken when a workflow is executed.|
|Execution conditions| The execution condition section of a workflow sets up<br><br>- Who(scope) the workflow runs against  <br><br>- When(trigger) the workflow runs|

## Templates
Creating a workflow via the portal requires the use of a template. A Lifecycle Workflow template is a framework that is used for pre-defined tasks and helps automate the creation of a workflow.  

  [![Understanding workflow template diagram.](media/understanding-lifecycle-workflows/workflow-3.png)](media/understanding-lifecycle-workflows/workflow-3.png#lightbox)

The template will define the task that is to be used and then guide you through the creation of the workflow.   The template provides input for description information and execution condition information.  

>[!NOTE]
>Depending on the template you select, the options that will be available may vary.  This document uses the **Onboarding pre-hire employee** template to illustrate the parts of a workflow.

For more information, see [Lifecycle workflow templates.](lifecycle-workflow-templates.md)

## Workflow basics

After selecting a template, on the basics screen:
 - Provide the information that will be used in the description portion of the workflow.
 - The trigger, defines when of the execution condition.

 [![Basics of a workflow.](media/understanding-lifecycle-workflows/workflow-4.png)](media/understanding-lifecycle-workflows/workflow-4.png#lightbox)

### Workflow details
Under the workflow details section, you can provide the following information:

 |Name|Description|
 |-----|-----|
 |Name|The name of the workflow.|
 |Description|A brief description that describes the workflow.|

### Trigger details
Under the trigger details section, you can provide the following information.

 |Name|Description|
 |-----|-----|
 |Days for event|The number of days before or after the date specified in the **Event user attribute**.|

This section defines **when** the workflow will run.  Currently, there are two supported types of triggers:
  
- Trigger and scope based - runs the task on all users in scope once the workflow is triggered.
- On-demand - can be run immediately.  Typically used for real-time employee terminations.

## Configure scope
After you define the basics tab, on the configure scope screen:
 - Provide the information that will be used in the execution condition, to determine who the workflow will run against.  
 - Add more expressions to create more complex filtering.

The configure scope section determines **who** the workflow will run against.

 [![Screenshot showing the rule section](media/understanding-lifecycle-workflows/workflow-5.png)](media/understanding-lifecycle-workflows/workflow-5.png#lightbox)

You can add extra expressions using **And/Or** to create complex conditionals, and apply the workflow more granularly across your organization.

 [![Extra expressions.](media/understanding-lifecycle-workflows/workflow-8.png)](media/understanding-lifecycle-workflows/workflow-8.png#lightbox)

> [!NOTE]
> For a full list of user properties supported by Lifecycle Workflows, see [Supported user properties and query parameters](/graph/api/resources/identitygovernance-rulebasedsubjectset?view=graph-rest-beta#supported-user-properties-and-query-parameters?toc=/azure/active-directory/governance/toc.json&bc=/azure/active-directory/governance/breadcrumb/toc.json)

For more information, see [Create a lifecycle workflow.](create-lifecycle-workflow.md)


## Review tasks
After defining the scope the review tasks screen will allow you to:
 - Verify that the correct template was selected, and the tasks associated with the workflow are correct.  
 - Add more tasks other than the ones in the template.

[![Screenshot showing the review tasks screen.](media/understanding-lifecycle-workflows/workflow-6.png)](media/understanding-lifecycle-workflows/workflow-6.png#lightbox)

You can use the **Add task** button to add extra tasks for the workflow. Select the additional tasks from the list provided.

 [![Screenshot showing additional tasks section.](media/understanding-lifecycle-workflows/workflow-6.png)](media/understanding-lifecycle-workflows/workflow-6.png#lightbox)

For more information, see: [Lifecycle workflow tasks](lifecycle-workflow-tasks.md)

## Review and create

After reviewing the tasks on the review and create screen, you:
 - Verify all of the information is correct, and create the workflow.

 Based on what was defined in the previous sections our workflow will now show:
- It's named **on-board pre-hire employee**.
- Based on the date in the **EmployeeHireDate** attribute, it will trigger **seven** (7) days prior to the date.
- It will run against users who have **marketing** for the **department** attribute value.
- It will generate a **TAP (temporary access password)**, and send an email to the user in the **manager** attribute of the pre-hire employee.

 [![Review and create workflow template.](media/understanding-lifecycle-workflows/workflow-7.png)](media/understanding-lifecycle-workflows/workflow-7.png#lightbox)

## Scheduling
A workflow isn't scheduled to run by default. To enable the workflow, it needs to be scheduled.

To verify whether the workflow is scheduled, you can view the **Scheduled** column.  

To enable the workflow, select the **Enable schedule** option for the workflow.

Once scheduled, the workflow will be evaluated every 3 hours to determine whether or not it should run based on the execution conditions.

 [![Workflow template schedule.](media/understanding-lifecycle-workflows/workflow-10.png)](media/understanding-lifecycle-workflows/workflow-10.png#lightbox)


### On-demand scheduling

A workflow can be run on-demand for testing or in situations where it's required.

Use the **Run on demand** feature to execute the workflow immediately. The workflow must be enabled before you can run it on demand.

>[!NOTE]
> A workflow that is run on demand for any user does not take into account whether or not a user meets the workflow's execution. It will apply the task regardless of whether the execution conditions are met or not.

For more information, see [Run a workflow on-demand](on-demand-workflow.md)

## Managing the workflow

By selecting on a workflow you created, you can manage the workflow.

You can select which portion of the workflow you wish to update or change using the left navigation bar. Select the section you wish to update.

[![Update manage workflow section review.](media/understanding-lifecycle-workflows/workflow-11.png)](media/understanding-lifecycle-workflows/workflow-11.png#lightbox)

For more information, see [Manage lifecycle workflow properties](manage-workflow-properties.md)

## Versioning

Workflow versions are separate workflows built using the same information of an original workflow, but with updated parameters so that they're reported differently within logs. Workflow versions can change the actions or even scope of an existing workflow.

You can view versioning information by selecting **Versions** under **Manage** from the left.

[![Manage workflow versioning selection.](media/understanding-lifecycle-workflows/workflow-12.png)](media/understanding-lifecycle-workflows/workflow-12.png#lightbox)

For more information, see [Lifecycle Workflow versioning](lifecycle-workflow-versioning.md)

## Developer information
This document covers the parts of a lifecycle workflow 

For more information, see the [Workflow API Reference](lifecycle-workflows-developer-reference.md)

## Next steps
- [Create a custom workflow using the Azure portal](tutorial-onboard-custom-workflow-portal.md)
- [Create a Lifecycle workflow](create-lifecycle-workflow.md)
