---
title: 'Automate employee onboarding tasks before their first day of work with Microsoft Graph (preview)'
description: Tutorial for onboarding users to an organization using Lifecycle workflows with Microsoft Graph (preview).
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
# Automate employee onboarding tasks before their first day of work with Microsoft Graph (preview)

This tutorial provides a step-by-step guide on how to automate pre-hire tasks with Lifecycle workflows using the GRAPH API. 

This pre-hire scenario will generate a temporary password for our new employee and send it via email to the user's new manager.  
:::image type="content" source="media/tutorial-lifecycle-workflows/arch-2.png" alt-text="Screenshot of the Lifecycle Workflows scenario." lightbox="media/tutorial-lifecycle-workflows/arch-2.png":::

##  Before you begin

Two accounts are required for the tutorial, one account for the new hire and another account that acts as the manager of the new hire. The new hire account must have the following attributes set:
-	employeeHireDate must be set to today
-	department must be set to sales
-	manager attribute must be set, and the manager account should have a mailbox to receive an email.

For more comprehensive instructions on how to complete these prerequisite steps, you may refer to the [Preparing user accounts for Lifecycle workflows tutorial](tutorial-prepare-azure-ad-user-accounts.md). The [TAP policy](../authentication/howto-authentication-temporary-access-pass.md#enable-the-temporary-access-pass-policy) must also be enabled to run this tutorial.

Detailed breakdown of the relevant attributes:

 | Attribute | Description |Set on|
 |:--- |:---:|-----|
 |mail|Used to notify manager of the new employees temporary access pass|Both|
 |manager|This attribute that is used by the lifecycle workflow|Employee|
 |employeeHireDate|Used to trigger the workflow|Both|
 |department|Used to provide the scope for the workflow|Both|

The pre-hire scenario can be broken down into the following:
  - **Prerequisite:** Create two user accounts, one to represent an employee and one to represent a manager
  - **Prerequisite:** Edit the manager attribute for this scenario using Microsoft Graph Explorer
  - **Prerequisite:** Enabling and using Temporary Access Pass (TAP)
  - Creating the lifecycle management workflow
  - Triggering the workflow
  - Verifying the workflow was successfully executed

## Create a pre-hire workflow using Graph API

Now that the pre-hire workflow attributes have been updated and correctly populated, a pre-hire workflow can then be created to generate a Temporary Access Pass (TAP) and send it via email to a user's manager. Before introducing the API call to create this workflow, you may want to review some of the parameters that are required for this workflow creation.

|Parameter  |Description  |
|---------|---------|
|category     |  A string that identifies the category of the workflow. String is "joiner", "mover", or "leaver and can support multiple strings. Category of workflow must also contain the category of its tasks. For full task definitions, see: [Lifecycle workflow tasks and definitions](lifecycle-workflow-tasks.md)    |
|displayName     |  A unique string that identifies the workflow.       |
|description     |  A string that describes the purpose of the workflow for administrative use. (Optional)       |
|isEnabled     |   A boolean value that denotes whether the workflow is set to run or not.  If set to “true" then the workflow will run.      |
|isSchedulingEnabled     |   A Boolean value that denotes whether scheduling is enabled or not. Unlike isEnbaled, a workflow can still be run on demand if this value is set to false.      |
|executionConditions     |    An argument that contains: <br><br> A time-based attribute and an integer parameter defining when a workflow will run between -60 and 60 <br><br>a scope attribute defining who the workflow runs for.     |
|tasks    |  An argument in a workflow that has a unique displayName and a description. <br><br> It defines the specific tasks to be executed in the workflow. The specified task is outlined by the taskDefinitionID and its parameters.  For a list of supported tasks, and their corresponding IDs, see [Supported Task Definitions](lifecycle-workflow-tasks.md).      |

The following POST API call will create a pre-hire workflow that will generate a TAP and send it via email to the user's manager.

 ```http
 POST https://graph.microsoft.com/beta/identityGovernance/LifecycleWorkflows/workflows
Content-type: application/json

{
   "displayName":"Onboard pre-hire employee", 
   "description":"Configure pre-hire tasks for onboarding employees before their first day", 
   "isEnabled":true, 
   "isSchedulingEnabled": false,
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
    }, 
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
    ]     
} 
```

## Run the workflow 
Now that the workflow is created, it will automatically run the workflow every 3 hours. Lifecycle workflows will check every 3 hours for users in the associated execution condition and execute the configured tasks for those users.  However, for the tutorial, we would like to run it immediately. To run a workflow immediately, we can use the on-demand feature.

>[!NOTE]
>Be aware that you currently cannot run a workflow on-demand if it is set to disabled.  You need to set the workflow to enabled to use the on-demand feature.

To run a workflow on-demand for users using the GRAPH API do the following steps:

1.  Open [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).
2. Make sure the top is still set to **POST**, and **beta** and `https://graph.microsoft.com/beta/identityGovernance/LifecycleWorkflows/workflows/<id>/activate` is in the box.  Change `<id>` to the ID of workflows. 
 3. Copy the code below in to the **Request body** 
 4. Replace `<userid>` in the code below with the value of the user's ID.
 5. Select **Run query**
   ```json
 {
   "subjects":[
      {"id":"<userid>"}
      
   ]
}

```

## Check tasks and workflow status

At any time, you may monitor the status of the workflows and the tasks. As a reminder, there are three different data pivots, users runs, and tasks which are currently available in public preview. You may learn more in the how-to guide [Check the status of a workflow (preview)](check-status-workflow.md). In the course of this tutorial, we will look at the status using the user focused reports.

To begin, you will just need the ID of the workflow and the date range for which you want to see the summary of the status. You may obtain the workflow ID from the response code of the POST API call that was used to create the workflow.

This example will show you how to list the userProcessingResults for the last 7 days.

```http
GET https://graph.microsoft.com/beta/identityGovernance/LifecycleWorkflows/workflows/<workflow id>/userProcessingResults
```
Furthermore, it is possible to get a summary of the userProcessingResults to get a quicker overview of large amounts of data, but for this a time span must be specified.

```http
GET https://graph.microsoft.com/beta/identityGovernance/LifecycleWorkflows/workflows/<workflow id>/userProcessingResults/summary(startDateTime=2022-05-01T00:00:00Z,endDateTime=2022-05-30T00:00:00Z)
```
You may also check the full details about the tasks of a given userProcessingResults. You will need to provide the workflow ID of the workflow, as well as the userProcessingResult ID. You may obtain the userProcessingResult ID from the response of the userProcessingResults GET call above.

```http
GET https://graph.microsoft.com/beta/identityGovernance/LifecycleWorkflows/workflows/<workflow_id>/userProcessingResults/<userProcessingResult_id>/taskProcessingResults
```

## Enable the workflow schedule

After running your workflow on-demand and checking that everything is working fine, you may want to enable the workflow schedule. To enable the workflow schedule, you may run the following PATCH call.

```http
PATCH https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/workflows/<id> 
Content-type: application/json

{
   "displayName":"Onboard pre-hire employee",
   "description":"Configure pre-hire tasks for onboarding employees before their first day",
   "isEnabled": true,
   "isSchedulingEnabled": true
}

```

## Next steps
- [Preparing user accounts for Lifecycle workflows (preview)](tutorial-prepare-azure-ad-user-accounts.md)
- [Automate employee onboarding tasks before their first day of work with Azure portal (preview)](tutorial-onboard-custom-workflow-portal.md)