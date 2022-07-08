---
title: 'Tutorial: On-boarding users to your organization using Lifecycle workflows with Microsoft Graph (preview)'
description: Tutorial for onboarding users to an organization using Lifecycle workflows with Microsoft Graph (preview).
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
# On-boarding users to your organization using Lifecycle workflows with Microsoft Graph (preview)

This tutorial provides a step-by-step guide on how to automate pre-hire tasks with Lifecycle workflows using the GRAPH API. 

This pre-hire scenario will generate a temporary password for our new employee and send it via email to the user's new manager.  

:::image type="content" source="media/tutorial-lifecycle-workflows/arch-2.png" alt-text="Architectural overview" lightbox="media/tutorial-lifecycle-workflows/arch-2.png":::

## Before you begin

Two accounts are required for the tutorial, one account for the new hire and another account that acts as the manager of the new hire. The new hire account must have the following attributes set:

- employeeHireDate must be set to today
- department must be set to sales
- manager attribute must be set, and the manager account should have a mailbox to receive an email.


For more comprehensive instructions on how to complete these prerequisite steps, you may refer to [Preparing user accounts for Lifecycle workflows tutorial](tutorial-prepare-azuread-user-accounts.md). The [TAP policy](https://docs.microsoft.com/en-us/azure/active-directory/authentication/howto-authentication-temporary-access-pass#enable-the-temporary-access-pass-policy) must also be enabled to run this tutorial.

Detailed breakdown of the relevant attributes:

 | Attribute | Description |Set on|
 |:--- |:---:|-----|
 |mail|Used to notify manager of the new employees temporary access pass|Both|
 |manager|This attribute that is used by the lifecycle workflow|Employee|
 |employeeHireDate|Used to trigger the workflow|Employee|
 |department|Used to provide the scope for the workflow|Employee|

The pre-hire scenario can be broken down into the following:
  - **Prerequisite**: Create two user accounts, one to represent an employee and one to represent a manager
  - **Prerequisite**: Edit the manager attribute for this scenario using Microsoft Graph Explorer
  - **Prerequisite**: Enabling and using Temporary Access Pass (TAP)
  - Creating the lifecycle management workflow
  - Triggering the workflow
  - Verifying the workflow was successfully executed

## Create a pre-hire workflow using Graph API

Now that the pre-hire workflow attributes have been updated and correctly populated, a pre-hire workflow can then be created to generate a Temporary Access Pass (TAP) and send it via email to a user's manager. Before introducing the API call to create this workflow, you may want to review some of the parameters that are required for this workflow creation.

|Parameter  |Description  |
|---------|---------|
|taskDefinitionID     |  The unique ID corresponding to a supported task    |
|arguments     |  Used to specify the activation duration of the TAP and toggle between onetime use or multiple uses       |
|scope     |  Only rule based subject set supported       |
|trigger     |   Only time based attribute trigger supported      |
|Task     |  An argument in a workflow that has a unique displayName and a description. </br> It defines the specific tasks to be executed in the workflow. </br>The specified task is outlined by the taskDefinitionID and its parameters.  For a list of supported tasks, and their corresponding IDs, see [Supported Task Definitions](manage-lifecycle-workflows.md#supported-task-definitions).      |
|executionConditions     |    Defines for who (scope) and when (trigger) the workflow runs     |

The following POST API call will create a pre-hire workflow that will generate a TAP and send it via email to the user's manager.

 ```http
 POST https://graph.microsoft.com/beta/identityGovernance/lifecycleManagement/workflows

Content-type: application/json

{
   "displayName":"Onboard pre-hire employee", 
   "description":"Configure pre-hire tasks for onboarding employees before their first day", 
   "isEnabled":true, 
   "tasks":[ 
      {
         "isEnabled":true, 
         "category": "Joiner",
         "taskDefinitionId":"1b555e50-7f65-41d5-b514-5894a026d10d", 
         "displayName":"Generate TAP And Send Email", 
         "description":"Generate Temporary Access Pass and send via email to user's manager", 
         "arguments":[ 
                { 
                    "name": "tapLifetimeMinutes", 
                    "value": "480" 
                }, 
                { 
                    "name": "tapIsUsableOnce", 
                    "value": "true" 
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

## Run the workflow

Now that the workflow is created, it will automatically run the workflow every 3 hours. Lifecycle workflows will check every 3 hours for users in the associated execution condition and execute the configured tasks for those users. However, for the tutorial, we would like to run it immediately. To run a workflow immediately, we can use the on-demand feature.

>[!NOTE]
>Be aware that you currently cannot run a workflow on-demand if it is set to disabled.  You need to set the workflow to enabled to use the on-demand feature.

To run a workflow on-demand for users using the GRAPH API do the following steps:

1.  Still in [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).
2. Make sure the top is still set to **POST**, and **beta** and `https://graph.microsoft.com/beta/identityGovernance/lifecycleManagement/workflows/<id>/activate` is in the box.  Change `<id>` to the ID of workflows. 
 3. Copy the code below in to the **Request body** 
 4. Replace `<userid>` in the code below with the value of Melva Prince's ID.
 5. Select **Run query**
```Request body
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
- [On-boarding users to your organization using Lifecycle workflows with Azure portal (preview)](tutorial-onboard-custom-workflow-portal.md)
