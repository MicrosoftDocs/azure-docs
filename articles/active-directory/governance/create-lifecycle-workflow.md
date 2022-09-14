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
 :::image type="content" source="media/create-lifecycle-workflow/template-list.png" alt-text="Screenshot of a list of lifecycle workflows templates.":::
1. Enter a display name and description for the workflow. The display name must be unique and not match the name of any other workflow you've created. 
 :::image type="content" source="media/create-lifecycle-workflow/template-basics.png" alt-text="Screenshot of workflow template basic information.":::

1. Select the **Trigger type** to be used for this workflow.

1. On **Days from event**, you enter a value of days when you want the workflow to go into effect. The valid values are 0 to 60.

1. **Event timing** allows you to choose if the days from event are either before or after.

1. **Event user attribute** is the event being used to trigger the workflow. For example, with the pre hire workflow template, an event user attribute is the employee hire date.   


1. Select the **Property**, **Operator**, and give it a **value**. The following picture gives an example of a rule being set up for a sales department.

    :::image type="content" source="media/create-lifecycle-workflow/template-scope.png" alt-text="Screenshot of Lifecycle Workflows template scope configuration options.":::

1. To view your rule syntax, select the **View rule syntax** button.
    :::image type="content" source="media/create-lifecycle-workflow/template-syntax.png" alt-text="Screenshot of workflow rule syntax.":::

1. You can copy and paste multiple user property rules on this screen. For more detailed information on which properties that can be included see: [User Properties](/graph/aad-advanced-queries?tabs=http#user-properties) 

1. To Add a task to the template, select **Add task**.

    :::image type="content" source="media/create-lifecycle-workflow/template-tasks.png" alt-text="Screenshot of adding tasks to templates.":::

1. To enable an existing task on the list, select **enable**. You're also able to disable a task by selecting **disable**.

1. To remove a task from the template, select **Remove** on the selected task.

1. Review the workflow's settings.

    :::image type="content" source="media/create-lifecycle-workflow/template-review.png" alt-text="Screenshot of reviewing and creating a template.":::

1. Select **Create** to create the workflow.


> [!IMPORTANT]
> By default, a newly created workflow is disabled to allow for the testing of it first on smaller audiences. For more information about testing workflows before rolling them out to many users, see: [run an on-demand workflow](on-demand-workflow.md).

## Create a workflow using Microsoft Graph

Workflows can be created using Microsoft Graph API. Creating a workflow using the Graph API allows you to automatically set it to enabled. Setting it to enabled is done using the `isEnabled` parameter.

The table below shows the parameters that must be defined during workflow creation:

|Parameter  |Description  |
|---------|---------|
|category     |  A string that identifies the category of the workflow. String is "joiner", "mover", or "leaver. Category of tasks within a workflow must also contain the category of the workflow to run. For full task definitions, see: [Lifecycle workflow tasks and definitions](lifecycle-workflow-tasks.md)    |
|displayName     |  A unique string that identifies the workflow.       |
|description     |  A string that describes the purpose of the workflow for administrative use. (Optional)       |
|isEnabled     |   A boolean value that denotes whether the workflow is set to run or not.  If set to “true" then the workflow will run.      |
|IsSchedulingEnabled     |   A Boolean value that denotes whether scheduling is enabled or not. Unlike isEnbaled, a workflow can still be run on demand if this value is set to false.     |
|executionConditions     |  An argument that contains: A time-based attribute and an integer parameter defining when a workflow will run between -60 and a scope attribute defining who the workflow runs for.   |
|tasks     |  An argument in a workflow that has a unique displayName and a description. It defines the specific tasks to be executed in the workflow. The specified task is outlined by the taskDefinitionID and its parameters. For a list of supported tasks, and their corresponding IDs, see  [Lifecycle Workflow tasks and definitions](lifecycle-workflow-tasks.md).      |




To create a joiner workflow, in Microsoft Graph, use the following request and body:
```http
POST https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/workflows 
Content-type: application/json
```

```Request body
{ 
    "category": "joiner",   
    "displayName": "<Unique workflow name string>",
   "description": "<Unique workflow description>", 
   "isEnabled":true, 
   "tasks":[ 
      { 
         "category": "joiner",
         "isEnabled": true, 
         "taskTemplateId": "<Unique Task template>", 
         "displayName": "<Unique task name>", 
         "description": "<Task template description>", 
         "arguments": "<task arguments>"
      } 
   ], 
   "executionConditions": { 
         "@odata.type" : "microsoft.graph.identityGovernance.scopeAndTriggerBasedCondition",
         "trigger": {
            "@odata.type" : "microsoft.graph.identityGovernance.timeBasedAttributeTrigger",
            "timeBasedAttribute":"<time-based trigger argument>",
            "arguments": -7
       },
        "scope": {
            "@odata.type" : "microsoft.graph.identityGovernance.ruleBasedScope",
            "rule": "employeeType eq '<Employee type attribute>' AND department -eq '<department attribute>'"
        }
   } 
} 

> [!NOTE]
> time based trigger arguments can be from -60 to 60. The negative value denotes **Before** a time based argument, while a positive value denotes **After**. For example the -7 in the workflow example above denotes the workflow will run 1 week before the time-based argument happens.

```

To change this workflow from joiner to leaver, replace the category parameters to "leaver". To get a list of the task definitions that can be added to your workflow run the following call:

```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/taskDefinitions
```

The response to the code will look like:

```Response body
{
    "@odata.context": "https://graph.microsoft-ppe.com/testppebetalcwpp4/$metadata#identityGovernance/lifecycleWorkflows/taskDefinitions",
    "@odata.count": 13,
    "value": [
        {
            "category": "joiner,leaver",
            "description": "Add user to a group",
            "displayName": "Add User To Group",
            "id": "22085229-5809-45e8-97fd-270d28d66910",
            "version": 1,
            "parameters": [
                {
                    "name": "groupID",
                    "values": [],
                    "valueType": "string"
                }
            ]
        },
        {
            "category": "joiner,leaver",
            "description": "Disable user account in the directory",
            "displayName": "Disable User Account",
            "id": "1dfdfcc7-52fa-4c2e-bf3a-e3919cc12950",
            "version": 1,
            "parameters": []
        },
        {
            "category": "joiner,leaver",
            "description": "Enable user account in the directory",
            "displayName": "Enable User Account",
            "id": "6fc52c9d-398b-4305-9763-15f42c1676fc",
            "version": 1,
            "parameters": []
        },
        {
            "category": "joiner,leaver",
            "description": "Run a custom task extension",
            "displayName": "run a Custom Task Extension",
            "id": "4262b724-8dba-4fad-afc3-43fcbb497a0e",
            "version": 1,
            "parameters":
                {
                    "name": "customtaskextensionID",
                    "values": [],
                    "valueType": "string"
                }
            ]
        },
        {
            "category": "joiner,leaver",
            "description": "Remove user from membership of selected Azure AD groups",
            "displayName": "Remove user from selected groups",
            "id": "1953a66c-751c-45e5-8bfe-01462c70da3c",
            "version": 1,
            "parameters": [
                {
                    "name": "groupID",
                    "values": [],
                    "valueType": "string"
                }
            ]
        },
        {
            "category": "joiner",
            "description": "Generate Temporary Access Password and send via email to user's manager",
            "displayName": "Generate TAP And Send Email",
            "id": "1b555e50-7f65-41d5-b514-5894a026d10d",
            "version": 1,
            "parameters": [
                {
                    "name": "tapLifetimeMinutes",
                    "values": [],
                    "valueType": "string"
                },
                {
                    "name": "tapIsUsableOnce",
                    "values": [
                        "true",
                        "false"
                    ],
                    "valueType": "enum"
                }
            ]
        },
        {
            "category": "joiner",
            "description": "Send welcome email to new hire",
            "displayName": "Send Welcome Email",
            "id": "70b29d51-b59a-4773-9280-8841dfd3f2ea",
            "version": 1,
            "parameters": []
        },
        {
            "category": "joiner,leaver",
            "description": "Add user to a team",
            "displayName": "Add User To Team",
            "id": "e440ed8d-25a1-4618-84ce-091ed5be5594",
            "version": 1,
            "parameters": [
                {
                    "name": "teamID",
                    "values": [],
                    "valueType": "string"
                }
            ]
        },
        {
            "category": "leaver",
            "description": "Delete user account in Azure AD",
            "displayName": "Delete User Account",
            "id": "8d18588d-9ad3-4c0f-99d0-ec215f0e3dff",
            "version": 1,
            "parameters": []
        },
        {
            "category": "joiner,leaver",
            "description": "Remove user from membership of selected Teams",
            "displayName": "Remove user from selected Teams",
            "id": "06aa7acb-01af-4824-8899-b14e5ed788d6",
            "version": 1,
            "parameters": [
                {
                    "name": "teamID",
                    "values": [],
                    "valueType": "string"
                }
            ]
        },
        {
            "category": "leaver",
            "description": "Remove user from all Azure AD groups memberships",
            "displayName": "Remove user from all groups",
            "id": "b3a31406-2a15-4c9a-b25b-a658fa5f07fc",
            "version": 1,
            "parameters": []
        },
        {
            "category": "leaver",
            "description": "Remove user from all Teams memberships",
            "displayName": "Remove user from all Teams",
            "id": "81f7b200-2816-4b3b-8c5d-dc556f07b024",
            "version": 1,
            "parameters": []
        },
        {
            "category": "leaver",
            "description": "Remove all licenses assigned to the user",
            "displayName": "Remove all licenses for user",
            "id": "8fa97d28-3e52-4985-b3a9-a1126f9b8b4e",
            "version": 1,
            "parameters": []
        }
    ]
}

```
For further details on task definitions and their parameters, see [Lifecycle Workflow Tasks](lifecycle-workflow-tasks.md).


## Next steps

- [Create workflow (lifecycle workflow)](/graph/api/identitygovernance-lifecycleworkflowscontainer-post-workflows?view=graph-rest-beta)
- [Manage a workflow's properties](manage-workflow-properties.md)
- [Manage Workflow Versions](manage-workflow-tasks.md)
