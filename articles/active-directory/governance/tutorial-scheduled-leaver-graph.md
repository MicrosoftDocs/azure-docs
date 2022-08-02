---
title: 'Post off-boarding users from your organization using Lifecycle workflows with Microsoft Graph (preview)'
description: Tutorial for post off-boarding users from an organization using Lifecycle workflows with Microsoft Graph (preview).
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
# Post off-boarding users from your organization using Lifecycle workflows with Microsoft Graph (preview)

This tutorial provides a step-by-step guide on how to configure off-boarding tasks for employees after their last day of work with Lifecycle workflows using the GRAPH API.

This post off-boarding scenario will run a scheduled workflow and accomplish the following tasks:
 
1. Remove all licenses for user
2. Remove user from all Teams
3. Delete user account

##  Before you begin

As part of the prerequisites for completing this tutorial, you will need an account that has licenses and Teams memberships that can be deleted during the tutorial. For more comprehensive instructions on how to complete these prerequisite steps, you may refer to  the [Preparing user accounts for Lifecycle workflows tutorial](tutorial-prepare-azuread-user-accounts.md).

The scheduled leaver scenario can be broken down into the following:
- **Prerequisite:** Create a user account that represents an employee leaving your organization
- **Prerequisite:** Prepare the user account with licenses and Teams memberships
- Create the lifecycle management workflow
- Run the scheduled workflow after last day of work
- Verify that the workflow was successfully executed

## Create a scheduled leaver workflow using Graph API

Before introducing the API call to create this workflow, you may want to review some of the parameters that are required for this workflow creation.

|Parameter  |Description  |
|---------|---------|
|category     |  A string that identifies the category of the workflow. String is "joiner", "mover", or "leaver and can support multiple strings. Category of workflow must also contain the category of its tasks. For full task definitions, see: [Lifecycle workflow tasks and definitions](lifecycle-workflow-tasks.md)    |
|displayName     |  A unique string that identifies the workflow.       |
|description     |  A string that describes the purpose of the workflow for administrative use. (Optional)       |
|isEnabled     |   A boolean value that denotes whether the workflow is set to run or not.  If set to “true" then the workflow will run.      |
|IsSchedulingEnabled     |   A Boolean value that denotes whether scheduling is enabled or not. Unlike isEnbaled, a workflow can still be run on demand if this value is set to false.      |
|executionConditions     |    An argument that contains: </br><li>a time-based attribute and an integer parameter defining when a workflow will run between -60 and 60 </br></li><li>a scope attribute defining who the workflow runs for.</li>     |
|tasks    |  An argument in a workflow that has a unique displayName and a description. </br> It defines the specific tasks to be executed in the workflow. </br>The specified task is outlined by the taskDefinitionID and its parameters.  For a list of supported tasks, and their corresponding IDs, see [Supported Task Definitions](manage-lifecycle-workflows.md#supported-task-definitions).      |

For the purpose of this tutorial, there are three tasks that will be introduced in this workflow:

#### Remove all licenses for user

```msgraph-interactive
"tasks":[
       {
            "category": "leaver",
            "description": "Remove all licenses assigned to the user",
            "displayName": "Remove all licenses for user",
            "id": "8fa97d28-3e52-4985-b3a9-a1126f9b8b4e",
            "version": 1,
            "parameters": []
        }
   ]
```
#### Remove user from all Teams task

```msgraph-interactive
"tasks":[
       {
            "category": "leaver",
            "description": "Remove user from all Teams memberships",
            "displayName": "Remove user from all Teams",
            "id": "81f7b200-2816-4b3b-8c5d-dc556f07b024",
            "version": 1,
            "parameters": []
        }
   ]
```
#### Delete user account

```msgraph-interactive
"tasks":[
        {
            "category": "leaver",
            "description": "Delete user account in Azure AD",
            "displayName": "Delete User Account",
            "id": "8d18588d-9ad3-4c0f-99d0-ec215f0e3dff",
            "version": 1,
            "parameters": []
        }
   ]
```
#### Scheduled leaver workflow

The following POST API call will create a scheduled leaver workflow to configure off-boarding tasks for employees after their last day of work.

```http
 POST https://graph.microsoft.com/beta/identityGovernance/lifecycleManagement/workflows
 ```

```msgraph-interactive
        {
            "category": "leaver",
            "description": "Configure offboarding tasks for employees after their last day of work",
            "displayName": "Post-Offboarding of an employee",
            "id": "50149a4a-7c2d-4fd8-8018-761f4eb915cb",
            "executionConditions": {
                "@odata.type": "#microsoft.graph.identityGovernance.triggerAndScopeBasedConditions",
                "scope": {
                    "@odata.type": "#microsoft.graph.identityGovernance.ruleBasedSubjectSet",
                    "rule": "department eq 'Marketing'"
                },
                "trigger": {
                    "@odata.type": "#microsoft.graph.identityGovernance.timeBasedAttributeTrigger",
                    "timeBasedAttribute": "employeeLeaveDateTime",
                    "offsetInDays": 7
                }
            },
            "tasks@odata.context": "https://graph.microsoft-ppe.com/beta/$metadata#identityGovernance/lifecycleWorkflows/workflowTemplates('50149a4a-7c2d-4fd8-8018-761f4eb915cb')/tasks",
            "tasks": [
                {
                    "category": "leaver",
                    "continueOnError": false,
                    "description": "Remove all licenses assigned to the user",
                    "displayName": "Remove all licenses for user",
                    "executionSequence": 1,
                    "id": "760ab754-8249-4bce-9315-1ad06488e434",
                    "isEnabled": true,
                    "taskDefinitionId": "8fa97d28-3e52-4985-b3a9-a1126f9b8b4e",
                    "arguments": []
                },
                {
                    "category": "leaver",
                    "continueOnError": false,
                    "description": "Remove user from all Teams memberships",
                    "displayName": "Remove user from all Teams",
                    "executionSequence": 2,
                    "id": "17b4e37b-c50b-4e04-a11c-93479f487d1d",
                    "isEnabled": true,
                    "taskDefinitionId": "81f7b200-2816-4b3b-8c5d-dc556f07b024",
                    "arguments": []
                },
                {
                    "category": "leaver",
                    "continueOnError": false,
                    "description": "Delete user account in Azure AD",
                    "displayName": "Delete User Account",
                    "executionSequence": 3,
                    "id": "46849618-30e7-4b67-abf0-f8c7f0d54b95",
                    "isEnabled": true,
                    "taskDefinitionId": "8d18588d-9ad3-4c0f-99d0-ec215f0e3dff",
                    "arguments": []
                }
            ]
        }
    ]
}
```

## Check tasks and workflow status

At any time, you may monitor the status of the workflows and the tasks. As a reminder, there are two different data pivots, users and runs, which are currently available in private preview. You may learn more in the how-to guide [Check the status of a workflow (preview)](check-status-workflow). In the course of this tutorial, we will look at the status using the user focused reports.

To begin, you will just need the ID of the workflow and the date range for which you want to see the summary of the status. You may obtain the workflow ID from the response code of the POST API call that was used to create the workflow.

This example will show you how to list the userProcessingResults for the last 7 days.

```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleManagement/workflows/<workflow id>/userProcessingResults
```
Furthermore, it is possible to get a summary of the userProcessingResults to get a quicker overview of large amounts of data, but for this a time span must be specified.

```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleManagement/workflows/<workflow id>/userProcessingResults/summary(startDateTime=2022-05-01T00:00:00Z,endDateTime=2022-05-30T00:00:00Z)
```
You may also check the full details about the tasks of a given userProcessingResults. You will need to provide the workflow ID of the workflow, as well as the userProcessingResult ID. You may obtain the userProcessingResult ID from the response of the userProcessingResults GET call above.

```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleManagement/workflows/<workflow_id>/userProcessingResults/<userProcessingResult_id>/taskProcessingResults
```

## Next steps
- [Preparing user accounts for Lifecycle workflows (preview)](tutorial-prepare-azuread-user-accounts.md)
- [Post off-boarding users from your organization using Lifecycle workflows with Azure portal (preview)](tutorial-scheduled-leaver-portal.md)