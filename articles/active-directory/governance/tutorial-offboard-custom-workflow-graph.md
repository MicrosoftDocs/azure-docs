---
title: 'Tutorial: Off-boarding users from your organization using Lifecycle workflows with Microsoft Graph (preview)'
description: Tutorial for off-boarding users from an organization using Lifecycle workflows with Microsoft Graph (preview).
services: active-directory
author: amsliu
manager: rkarlin
ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.subservice: compliance
ms.date: 06/07/2022
ms.author: amsliu
ms.reviewer: krbain
ms.custom: template-tutorial
---
# Off-boarding users from your organization using Lifecycle workflows with Microsoft Graph (preview)

This tutorial provides a step-by-step guide on how to execute a real-time employee termination with Lifecycle workflows using the GRAPH API.

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

## Create a leaver workflow on-demand using Graph API

Before introducing the API call to create this workflow, you may want to review some of the parameters that are required for this workflow creation.

|Parameter  |Description  |
|---------|---------|
|category     |  A string that identifies the category of the workflow. String is "joiner",
"mover", or "leaver.   |
|displayName     |  A unique string that identifies the workflow.       |
|description     |  A string that describes the purpose of the workflow for administrative use. (Optional)       |
|isEnabled     |   A boolean value that denotes whether the workflow is set to run or not. If set to “true" then the workflow can run as on schedule, or be run on demand.      |
|IsSchedulingEnabled     |  A Boolean value that denotes whether scheduling is enabled or not. Unlike isEnbaled, a workflow can still be run on demand if this value is set to false.      |
|executionConditions     |    Defines when and for who the workflow will run    |
|tasks     |  An argument in a workflow that has a unique displayName and a description. It defines the specific tasks to be executed in the workflow. The specified task is outlined by the taskDefinitionID and its parameters. For a list of supported tasks, and their corresponding IDs, see [Supported Task Definitions](manage-lifecycle-workflows.md#supported-task-definitions).      |

For the purpose of this tutorial, the following three tasks will be introduced in this workflow:

### Remove user from all groups task

```Example
"tasks":[
       {
            "continueOnError": true,
            "displayName": "Remove user from all groups",
            "description": "Remove user from all Azure AD groups memberships",
            "isEnabled": true,
            "taskDefinitionId": "b3a31406-2a15-4c9a-b25b-a658fa5f07fc",
            "arguments": []
        }
   ]
```
> [!NOTE]
> The task does not support removing users from Privileged Access Groups, Dynamic Groups, and synchronized Groups.

### Remove user from all Teams task

```Example
"tasks":[
       {
            "continueOnError": true,
            "description": "Remove user from all Teams",
            "displayName": "Remove user from all Teams memberships",
            "isEnabled": true,
            "taskDefinitionId": "81f7b200-2816-4b3b-8c5d-dc556f07b024",
            "arguments": []
        }
   ]
```

### Delete user task

```Example
"tasks":[
       {
            "continueOnError": true,
            "displayName": "Delete user account",
            "description": "Delete user account in Azure AD",
            "isEnabled": true,
            "taskDefinitionId": "8d18588d-9ad3-4c0f-99d0-ec215f0e3dff",
            "arguments": []
        }
   ]
```

## Leaver workflow on-demand

The following POST API call will create a leaver workflow that can be executed on-demand for real-time employee terminations. 

```http
 POST https://graph.microsoft.com/beta/identityGovernance/lifecycleManagement/workflows
 Content-type: application/json

{
    "category": "Leaver",
    "description": "Execute real-time termination tasks for employees on their last day of work",
    "displayName": "Real-time employee termination",
    "isEnabled": true,
    "isSchedulingEnabled": false,
    "executionConditions":{
        "@odata.type":"#microsoft.graph.identityGovernance.onDemandExecutionOnly"
    },
    "tasks": [
        {
            "continueOnError": false,
            "description": "Remove user from all Azure AD groups memberships",
            "displayName": "Remove user from all groups",
            "isEnabled": true,
            "taskDefinitionId": "b3a31406-2a15-4c9a-b25b-a658fa5f07fc",
            "arguments": []
        },
        {
            "continueOnError": false,
            "description": "Remove user from all Teams memberships",
            "displayName": "Remove user from all Teams",
            "isEnabled": true,
            "taskDefinitionId": "81f7b200-2816-4b3b-8c5d-dc556f07b024",
            "arguments": []
        },
        {
            "continueOnError": false,
            "description": "Delete user account in Azure AD",
            "displayName": "Delete User Account",
            "isEnabled": true,
            "taskDefinitionId": "8d18588d-9ad3-4c0f-99d0-ec215f0e3dff",
            "arguments": []
        }
    ]
}
```

## Run the workflow

Now that the workflow is created, we would like to run it immediately. To run a workflow immediately, we can use the on-demand feature.

>[!NOTE]
>Be aware that you currently cannot run a workflow on-demand if it is set to disabled.  You need to set the workflow to enabled to use the on-demand feature.

To run a workflow on-demand for users using the GRAPH API do the following steps:

1.  Still in [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).
2. Make sure the top is still set to **POST**, and **beta** and `https://graph.microsoft.com/beta/identityGovernance/lifecycleManagement/workflows/<id>/activate` is in the box.  Change `<id>` to the ID of workflows. 
 3. Copy the code below in to the **Request body** 
 4. Replace `<userid>` in the code below with the value of Melva Prince's ID.
 5. Select **Run query**
```Example
 {
   "subjects":[
      {"id":"<userid>"}
      
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
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleManagement/workflo ws/<workflow id>/userProcessingResults/summary(startDateTime=2022-05-01T00:00:00Z,endDateTime=2022-05-30T00:00:00Z)
```

You may also check the full details about the tasks of a given userProcessingResults. You will need to provide the workflow ID of the workflow, as well as the userProcessingResult ID. You may obtain the userProcessingResult ID from the response of the userProcessingResults GET call above.

```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleManagement/workflows/<workflow_id>/userProcessingResults/<userProcessingResult_id>/taskProcessingResults
```

## Next steps
- [Tutorial: Preparing user accounts for Lifecycle workflows (preview)](tutorial-prepare-azuread-user-accounts.md)
- [Tutorial: Off-boarding users from your organization using Lifecycle workflows with Azure portal (preview)](tutorial-offboard-custom-workflow-portal.md)