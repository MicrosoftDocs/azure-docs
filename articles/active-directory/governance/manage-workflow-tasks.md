---
title: Manage workflow versions - Azure Active Directory
description: This article guides a user on managing workflow versions with Lifecycle Workflows
author: OWinfreyATL
ms.author: owinfrey
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to 
ms.date: 04/06/2022
ms.subservice: compliance
ms.custom: template-how-to 
---

# Manage workflow versions (Preview)

Workflows created with Lifecycle Workflows are able to grow and change with the needs of your organization. Workflows exist as versions from creation. When making changes to other than basic information, you create a new version of the workflow. For more information, see  [Manage a workflow's properties](manage-workflow-properties.md).

Changing a workflow's tasks or execution conditions requires the creation of a new version of that workflow. Tasks within workflows can be added, reordered, and removed at will. Updating a workflow's tasks or execution conditions within the Azure portal will trigger the creation of a new version of the workflow automatically. Making these updates in Microsoft Graph will require the new workflow version to be created manually.


## Edit the tasks of a workflow using the Azure portal


Tasks within workflows can be added, edited, reordered, and removed at will. To edit the tasks of a workflow using the Azure portal, you'll complete the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Azure Active Directory** and then select **Identity Governance**. 

1. In the left menu, select **Lifecycle workflows (Preview)**. 

1. In the left menu, select **workflows (Preview)**.
    
1. On the left side of the screen, select **Tasks (Preview)**.

1. You can add a task to the workflow by selecting the **Add task** button.

    :::image type="content" source="media/manage-workflow-tasks/manage-tasks.png" alt-text="Screenshot of adding a task to a workflow." lightbox="media/manage-workflow-tasks/manage-tasks.png":::

1. You can enable and disable tasks as needed by using the **Enable** and **Disable** buttons.

1. You can reorder the order in which tasks are executed in the workflow by selecting the **Reorder** button.

    :::image type="content" source="media/manage-workflow-tasks/manage-tasks-reorder.png" alt-text="Screenshot of reordering tasks in a workflow.":::

1. You can remove a task from a workflow by using the **Remove** button.       

1. After making changes, select **save** to capture changes to the tasks.


## Edit the execution conditions of a workflow using the Azure portal

To edit the execution conditions of a workflow using the Azure portal, you'll do the following steps:


1. On the left menu of Lifecycle Workflows, select **Workflows (Preview)**.

1. On the left side of the screen, select **Execution conditions (Preview)**.
    :::image type="content" source="media/manage-workflow-tasks/execution-conditions-details.png" alt-text="Screenshot of the execution condition details of a workflow." lightbox="media/manage-workflow-tasks/execution-conditions-details.png":::

1. On this screen you are presented with **Trigger details**. Here we have a trigger type and attribute details. In the template you can edit the attribute details to define when a workflow is run in relation to the attribute value measured in days. This attribute value can be from 0 to 60 days.
    

1. Select the **Scope** tab.
    :::image type="content" source="media/manage-workflow-tasks/execution-conditions-scope.png" alt-text="Screenshot of the execution scope page of a workflow." lightbox="media/manage-workflow-tasks/execution-conditions-scope.png":::

1. On this screen you can define rules for who the workflow will run. In the template **Scope type** is set as Rule-Based, and you define the rule using expressions on user properties. For more information on supported user properties. see: [supported queries on user properties](/graph/aad-advanced-queries#user-properties).

1. After making changes, select **save** to capture changes to the execution conditions.


## See versions of a workflow using the Azure portal

1. On the left menu of Lifecycle Workflows, select **Workflows (Preview)**.

1. On this page, you see a list of all of your current workflows. Select the workflow that you want to see versions of.
 
1. On the left side of the screen, select **Versions (Preview)**.

    :::image type="content" source="media/manage-workflow-tasks/manage-versions.png" alt-text="Screenshot of versions of a workflow." lightbox="media/manage-workflow-tasks/manage-versions.png":::

1. On this page you see a list of the workflow versions.    

    :::image type="content" source="media/manage-workflow-tasks/manage-versions-list.png" alt-text="Screenshot of managing version list of lifecycle workflows." lightbox="media/manage-workflow-tasks/manage-versions-list.png":::


## Create a new version of an existing workflow using Microsoft Graph

As stated above, creating a new version of a workflow is required to change any parameter that isn't "displayName", "description", or "isEnabled". Unlike in the Azure portal, to create a new version of a workflow using Microsoft Graph requires some additional steps. First, run the API call with the changes to the body of the workflow you want to update by doing the following:

- Get the body of the workflow you want to create a new version of by running the API call:
    ```http
    GET https://graph.microsoft.com/beta/identityGovernance/LifecycleWorkflows/workflows/<workflow id>
    ```
- Copy the body of the returned workflow excluding the **id**, **"odata.context**, and **tasks@odata.context** portions of the returned workflow body. 
- Make the changes in tasks and execution conditions you want for the new version of the workflow.
- Run the following **createNewVersion** API call along with the updated body of the workflow. The workflow body is wrapped in a **Workflow:{}** block.
    ```http
    POST https://graph.microsoft.com/beta/identityGovernance/LifecycleWorkflows/workflows/<id>/createNewVersion
    Content-type: application/json
    
    {
       "workflow": {
          "displayName":"New version of a workflow",
          "description":"This is a new created version of a workflow",
          "isEnabled":"true",
          "tasks":[
             {
                "isEnabled":"true",
                "taskTemplateId":"70b29d51-b59a-4773-9280-8841dfd3f2ea",
                "displayName":"Send welcome email to new hire",
                "description":"Sends welcome email to a new hire",
                "executionSequence": 1,
               "arguments":[]
             },
             {
                "isEnabled":"true",
                "taskTemplateId":"22085229-5809-45e8-97fd-270d28d66910",
                "displayName":"Add user to group",
                "description":"Adds user to a group.",
                "executionSequence": 2,
                "arguments":[
                   {
                      "name":"groupID",
                      "value":"<group id value>"
                   }
                ]
             }
          ],
          "executionConditions": {
           "@odata.type": "microsoft.graph.identityGovernance.triggerAndScopeBasedConditions",
            "scope": {
                "@odata.type": "microsoft.graph.identityGovernance.ruleBasedSubjectSet",
                "rule": "(department eq 'sales')"
            },
            "trigger": {
                "@odata.type": "microsoft.graph.identityGovernance.timeBasedAttributeTrigger",
                "timeBasedAttribute": "employeeHireDate",
                "offsetInDays": -2
            }
        }  
    } 
    ```
    

### List workflow versions using Microsoft Graph

Once a new version of a workflow is created, you can always find other versions by running the following call:
```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/workflows/<id>/versions
```
Or to get a specific version:

```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/workflows/<id>/versions/<version number> 
```

### Reorder Tasks in a workflow using Microsoft Graph

If you want to reorder tasks in a workflow, so that certain tasks run before others, you'll follow these steps:
 1. Use a GET call to return the body of the workflow in which you want to reorder the tasks. 
     ```http
      GET https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/workflows/<workflow id>
     ```
 1. Copy the body of the workflow and paste it in the body section for the new API call.
 
 1. Tasks are run in the order they appear within the workflow. To update the task copy the one you want to run first in the workflow body, and place it above the tasks you want to run after it in the workflow.
 
 1. Run the **createNewVersion** API call.
 


## Next steps


- [Check status of a workflows](check-status-workflow.md)
- [Customize workflow schedule](customize-workflow-schedule.md)
