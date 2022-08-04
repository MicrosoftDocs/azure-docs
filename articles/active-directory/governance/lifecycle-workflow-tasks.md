---
title: Lifecycle Workflows tasks and definitions - Azure Active Directory
description: This article guides a user on Workflow task definitions and task parameters.
author: OWinfreyATL
ms.author: owinfrey
ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 03/23/2022
ms.subservice: compliance
---
# Lifecycle Workflow built-in tasks (preview)

Lifecycle Workflows come with many pre-configured tasks that are designed to automate common lifecycle management scenarios. These pre-configured tasks can be paired together to make customized workflows to suit your organization's needs. While each task has common parameters that must be filled out such as a category, displayName, description, if a task error stops a workflow from running, and whether it's enabled, some tasks also have unique parameters which must be completed to run them in a workflow. In this article you'll get the complete list of tasks, information on common parameters each task has, and a list of unique parameters needed for each specific task.


## Supported tasks (preview)
 
Lifecycle Workflow's built-in tasks each include an identifier, known as **taskDefinitionID**, and can be used to create either new workflows from scratch, or inserted into workflow templates so that they fit the needs of your organization. For more information on templates available for use with Lifecycle Workflows, see: [Lifecycle Workflow Templates](lifecycle-workflow-templates.md).

Lifecycle Workflows currently support the following tasks:

|Task  |taskDefinitionID  |
|---------|---------|
|[Send welcome email to new hire](lifecycle-workflow-tasks.md#send-welcome-email-to-new-hire)     |   70b29d51-b59a-4773-9280-8841dfd3f2ea      |
|[Generate Temporary Access Password and send via email to user's manager](lifecycle-workflow-tasks.md#generate-temporary-access-password-and-send-via-email-to-users-manager)     |  1b555e50-7f65-41d5-b514-5894a026d10d       |
|[Add user to group](lifecycle-workflow-tasks.md#add-user-to-group)     |    22085229-5809-45e8-97fd-270d28d66910     |
|[Add user to team](lifecycle-workflow-tasks.md#add-user-to-team)      |  e440ed8d-25a1-4618-84ce-091ed5be5594       |
|[Enable user account](lifecycle-workflow-tasks.md#enable-user-account)     |    6fc52c9d-398b-4305-9763-15f42c1676fc     |
|[Run a custom task extension](lifecycle-workflow-tasks.md#run-a-custom-task-extension)    |    4262b724-8dba-4fad-afc3-43fcbb497a0e    |
|[Disable user account](lifecycle-workflow-tasks.md#disable-user-account)     |   1dfdfcc7-52fa-4c2e-bf3a-e3919cc12950      |
|[Remove user from group](lifecycle-workflow-tasks.md#remove-user-from-groups)     |   1953a66c-751c-45e5-8bfe-01462c70da3c      |
|[Remove users from all groups](lifecycle-workflow-tasks.md#remove-users-from-all-groups)     |    b3a31406-2a15-4c9a-b25b-a658fa5f07fc     |
|[Remove user from teams](lifecycle-workflow-tasks.md#remove-user-from-teams)    |    06aa7acb-01af-4824-8899-b14e5ed788d6     |
|[Remove user from all teams](lifecycle-workflow-tasks.md#remove-users-from-all-teams)     |    81f7b200-2816-4b3b-8c5d-dc556f07b024     |
|[Remove all license assignments from user](lifecycle-workflow-tasks.md#remove-all-license-assignments-from-user)     |    8fa97d28-3e52-4985-b3a9-a1126f9b8b4e     |
|[Delete user](lifecycle-workflow-tasks.md#delete-user)    |    8d18588d-9ad3-4c0f-99d0-ec215f0e3dff     |


## Common task parameters (preview)

Common task parameters are the non-unique parameters contained in every task. When adding tasks to a new workflow, or a workflow template, you can customize and configure these parameters so that they match your requirements.


|Parameter  |Definition  |
|---------|---------|
|category     |  A  read-only string that identifies the category or categories of the task. Automatically determined when the taskDefinitionID is chosen.     |
|taskDefinitionId     | A string referencing a taskDefinition which determines which task to run.       |
|isEnabled     | A boolean value that denotes whether the task is set to run or not. If set to “true" then the task will run.       |
|displayName     |  A unique string that identifies the task.       |
|description     | A string that describes the purpose of the task for administrative use. (Optional)         |
|executionSequence     | An integer that is read-only which states in what order the task will run in a workflow. For more information about executionSequence and workflow order, see: [Execution conditions](lifecycle-workflows-concept-parts.md#execution-conditions).       |
|continueOnError     |  A boolean value that determines if the failure of this task stops the subsequent workflows from running.        |
|arguments     |  Contains unique parameters relevant for the given task       |



## Task details (preview)

Below are each specific task, and detailed information such as parameters and prerequisites, required for them to run successfully. The parameters are noted as they appear both in the Azure portal, and within Microsoft Graph. For information about editing Lifecycle Workflow tasks in general, see: [Manage workflow Versions](manage-workflow-tasks.md).


### Send welcome email to new hire


Lifecycle Workflows allow you to automate the sending of welcome emails to new hires in your organization. You're able to customize the task name and description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/lcw-email-task.png" alt-text="LCW Email task":::


The Azure AD prerequisite to run the **Send welcome email to new hire** task is:

- A populated mail attribute for the user.


For Microsoft Graph the parameters for the **Send welcome email to new hire** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  joiner      |
|displayName     | Send Welcome Email (Customizable by user)        |
|description     | Send welcome email to new hire (Customizable by user)      |
|taskDefinitionId     |   70b29d51-b59a-4773-9280-8841dfd3f2ea     |



```Example for usage within the workflow
{
            "category": "joiner",
            "description": "Send welcome email to new hire",
            "displayName": "Send Welcome Email",
            "isEnabled": true,
            "taskDefinitionId": "70b29d51-b59a-4773-9280-8841dfd3f2ea",
            "arguments": []
        }

```

### Generate Temporary Access Password and send via email to user's manager

When a user joins your organization, Lifecycle Workflows allow you to automatically generate a Temporary Access Password(TAP) and have it sent to the new user's manager.

With this task in the Azure portal, you're able to give the task a name and description. You must also set the following:

**Activation duration**- How long the password is active.
**One time use**- If the password is one use only.
:::image type="content" source="media/lifecycle-workflow-task/lcw-TAP-task.png" alt-text="TAP LCW task":::
 

The Azure AD prerequisites to run the **Generate Temporary Access Password and send via email to user's manager** task are:

- A populated manager attribute for the user.
- A populated manager's mail attribute for the user.
 


For Microsoft Graph the parameters for the **Generate Temporary Access Password and send via email to user's manager** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  joiner      |
|displayName     | GenerateTAPAndSendEmail (Customizable by user)      |
|description     | Generate Temporary Access Password and send via email to user's manager (Customizable by user)       |
|taskDefinitionId     |   1b555e50-7f65-41d5-b514-5894a026d10d     |
|arguments     |  Argument contains the name parameter "tapLifetimeInMinutes", which is the lifetime of the temporaryAccessPass in minutes starting at startDateTime. Minimum 10, Maximum 43200 (equivalent to 30 days). The argument also contains the tapIsUsableOnce parameter, which determines whether the password is limited to a one time use. If true, the pass can be used once; if false, the pass can be used multiple times within the temporaryAccessPass lifetime.    |


```Example for usage within the workflow
{
    "category": "joiner",
    "description": "Generate Temporary Access Password and send via email to user's manager",
    "displayName": "GenerateTAPAndSendEmail",
    "isEnabled": true,
    "taskDefinitionId": "1b555e50-7f65-41d5-b514-5894a026d10d",
        "arguments": [
            {
                "name": "tapLifetimeMinutes",
                "value": "60"
            },
            {
                "name": "tapIsUsableOnce",
                "value": "true"
            }
        ]
    }

```

> [!NOTE]
> The employee hire date is the same as the startDateTime used for the tapLifetimeInMinutes parameter.


### Add user to group

You're able to add a user to an Azure AD security or Microsoft 365 group. You're able to customize the task name and description for this task.

:::image type="content" source="media/lifecycle-workflow-task/lcw-add-group-task.png" alt-text="LCW Add user to group task":::


The Azure AD prerequisites to run the **Add user to group** task are:

- Azure AD must be the authority source for the group.
- The group cannot be a Privileged Access group.
- The group cannot be a dynamic group.

For Microsoft Graph the parameters for the **Add user to group** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  joiner,leaver      |
|displayName     |  AddUserToGroup (Customizable by user)        |
|description     |  Add user to group (Customizable by user)       |
|taskDefinitionId     |   22085229-5809-45e8-97fd-270d28d66910      |
|arguments     |  Argument contains a name parameter that is the "groupID", and a value parameter which is the group ID of the group you are adding the user to.    |


```Example for usage within the workflow
{
            "category": "joiner,leaver",
            "description": "Add user to group",
            "displayName": "AddUserToGroup",
            "isEnabled": true,
            "taskDefinitionId": "22085229-5809-45e8-97fd-270d28d66910",
            "arguments": [
                {
                    "name": "groupID",
                    "value": "0732f92d-6eb5-4560-80a4-4bf242a7d501"
                }
            ]
        }

```


### Add user to team

You're able to add a user to an existing team. You're able to customize the task name and description for this task.
:::image type="content" source="media/lifecycle-workflow-task/lcw-add-team-task.png" alt-text="LCW add user to team":::


For Microsoft Graph the parameters for the **Add user to team** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  joiner,leaver      |
|displayName     |  AddUserToTeam (Customizable by user)       |
|description     |  Add user to team (Customizable by user)        |
|taskDefinitionId     |   e440ed8d-25a1-4618-84ce-091ed5be5594      |
|argument     |  Argument contains a name parameter that is the "teamID", and a value parameter which is the team ID of the existing team you are adding a user to.    |



```Example for usage within the workflow
{
            "category": "joiner,leaver",
            "description": "Add user to team",
            "displayName": "AddUserToTeam",
            "isEnabled": true,
            "taskDefinitionId": "e440ed8d-25a1-4618-84ce-091ed5be5594",
            "arguments": [
                {
                    "name": "teamID",
                    "value": "e3cc382a-c4b6-4a8c-b26d-a9a3855421bd"
                }
            ]
        }

```

### Enable user account

Allows user accounts to be enabled. You're able to customize the task name and description for this task in the Azure portal.

:::image type="content" source="media/lifecycle-workflow-task/lcw-enable-task.png" alt-text="LCW enable user account":::


For Microsoft Graph the parameters for the **Enable user account** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  joiner,leaver      |
|displayName     |  EnableUserAccount (Customizable by user)       |
|description     |  Enable user account (Customizable by user)        |
|taskDefinitionId     |   6fc52c9d-398b-4305-9763-15f42c1676fc      |



```Example for usage within the workflow
 {
            "category": "joiner,leaver",
            "description": "Enable user account",
            "displayName": "EnableUserAccount",
            "isEnabled": true,
            "taskDefinitionId": "6fc52c9d-398b-4305-9763-15f42c1676fc",
            "arguments": []
        }

```

### Run a Custom Task Extension

Workflows can be configured to launch a custom task extension. You're able to customize the task name and description for this task using the Azure portal.

:::image type="content" source="media/lifecycle-workflow-task/lcw-custom-extension-task.png" alt-text="LCW custom extension task":::

The Azure AD prerequisite to run the **Run a Custom Task Extension** task is:

- A Logic App that is compatible with the custom task extension. For more information, see: [Lifecycle workflow extensibility](lifecycle-workflow-extensibility.md).

For Microsoft Graph the parameters for the **Run a Custom Task Extension** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  joiner,leaver      |
|displayName     | Run a Custom Task Extension (Customizable by user)        |
|description     |  Run a custom Task Extension (Customizable by user)      |
|taskDefinitionId     |   "d79d1fcc-16be-490c-a865-f4533b1639ee      |
|argument     |  Argument contains a name parameter that is the "LogicAppURL", and a value parameter which is the Logic App HTTP trigger.     |




```Example for usage within the workflow
{
             "category": "joiner,leaver",
            "description": "Launch Logic App URL",
            "displayName": "Launch Logic App",
            "isEnabled": true,
            "taskDefinitionId": "d79d1fcc-16be-490c-a865-f4533b1639ee",
            "arguments": [
                {
                    "name": "logicAppURL",
                    "value": "https://testurl.com"
                }
            ]
        }

```

For more information on setting up a Logic app to run with Lifecycle Workflows, see:[Trigger Logic Apps with custom Lifecycle Workflow tasks](trigger-custom-task.md).

### Disable user account

User accounts can be disabled. You're able to customize the task name and description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/lcw-disable-task.png" alt-text="LCW disable user account":::


For Microsoft Graph the parameters for the **Disable user account** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  joiner,leaver      |
|displayName     |  DisableUserAccount (Customizable by user)       |
|description     |  Disable user account (Customizable by user)       |
|taskDefinitionId     |   1dfdfcc7-52fa-4c2e-bf3a-e3919cc12950      |


```Example for usage within the workflow
{
            "category": "joiner,leaver",
            "description": "Disable user account",
            "displayName": "DisableUserAccount",
            "isEnabled": true,
            "taskDefinitionId": "1dfdfcc7-52fa-4c2e-bf3a-e3919cc12950",
            "arguments": []
        }

```



### Remove user from groups

 Allows users to be removed from an Azure AD security or Microsoft 365 group. You're able to customize the task name and description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/lcw-remove-group-task.png" alt-text="LCW Remove user from select groups":::

The Azure AD prerequisites to run the **Remove user from groups** task are:

- Azure AD must be the authority source for the group.
- The group cannot be a Privileged Access group.
- The group cannot be a dynamic group.

For Microsoft Graph the parameters for the **Remove user from groups** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  leaver      |
|displayName     |  Remove user from selected groups (Customizable by user)        |
|description     |  Remove user from membership of selected Azure AD groups (Customizable by user)      |
|taskDefinitionId     |   1953a66c-751c-45e5-8bfe-01462c70da3c      |
|argument     |  Argument contains a name parameter that is the "groupID", and a value parameter which is the group Id(s) of the group or groups you are removing the user from.   |



```Example for usage within the workflow
{
            "category": "leaver",
            "continueOnError": true,
            "displayName": "Remove user from selected groups",
            "description": "Remove user from membership of selected Azure AD groups",
            "isEnabled": true,
            "taskDefinitionId": "1953a66c-751c-45e5-8bfe-01462c70da3c",
            "arguments": [
                {
                    "name": "groupID",
                    "value": "GroupId1, GroupId2, GroupId3, ..."
                }
            ]
        }

```

### Remove users from all groups

Allows users to be removed from every group they are a member of. You're able to customize the task name and description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/lcw-remove-all-groups-task.png" alt-text="LCW remove user from all groups":::

The Azure AD prerequisites to run the **Remove user from all groups** task are:

- Azure AD must be the authority source for the group.
- The group cannot be a Privileged Access group.
- The group cannot be a dynamic group.

For Microsoft Graph the parameters for the **Remove users from all groups** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  leaver      |
|displayName     |  Remove user from all groups (Customizable by user)       |
|description     |  Remove user from all Azure AD groups memberships (Customizable by user)        |
|taskDefinitionId     |   b3a31406-2a15-4c9a-b25b-a658fa5f07fc      |



```Example for usage within the workflow
 {
            "category": "leaver",
            "continueOnError": true,
            "displayName": "Remove user from all groups",
            "description": "Remove user from all Azure AD groups memberships",
            "isEnabled": true,
            "taskDefinitionId": "b3a31406-2a15-4c9a-b25b-a658fa5f07fc",
            "arguments": []
        }

```

### Remove User from Teams

Allows a user to be removed from one or multiple teams. You're able to customize the task name and description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/lcw-remove-user-team-task.png" alt-text="LCW remove user from teams":::

For Microsoft Graph the parameters for the **Remove User from Teams** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  joiner,leaver      |
|displayName     |  Remove user from selected Teams (Customizable by user)       |
|description     |  Remove user from membership of selected Teams (Customizable by user)       |
|taskDefinitionId     |   06aa7acb-01af-4824-8899-b14e5ed788d6     |
|arguments     |  Argument contains a name parameter that is the "teamID", and a value parameter which is the Teams ID of the Teams you are removing the user from.   |


```Example for usage within the workflow
 {
            "category": "joiner,leaver",
            "continueOnError": true,
            "displayName": "Remove user from selected Teams",
            "description": "Remove user from membership of selected Teams",
            "isEnabled": true,
            "taskDefinitionId": "06aa7acb-01af-4824-8899-b14e5ed788d6",
            "arguments": [
                {
                    "name": "teamID",
                    "value": "TeamId1, TeamId2, TeamId3, ..."
                }
            ]
        }

```

### Remove users from all teams

Allows users to be removed from every team they are a member of. You're able to customize the task name and description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/lcw-remove-user-all-team-task.png" alt-text="LCW remove user from all teams":::

For Microsoft Graph the parameters for the **Remove users from all teams** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  leaver      |
|displayName     |  Remove user from all Teams memberships (Customizable by user)       |
|description     |  Remove user from all Teams (Customizable by user)        |
|taskDefinitionId     |   81f7b200-2816-4b3b-8c5d-dc556f07b024      |



```Example for usage within the workflow
 {
            "category": "leaver",
            "continueOnError": true,
            "description": "Remove user from all Teams",
            "displayName": "Remove user from all Teams memberships",
            "isEnabled": true,
            "taskDefinitionId": "81f7b200-2816-4b3b-8c5d-dc556f07b024",
            "arguments": []
        }

```

### Remove all license assignments from User

Allows all license assignments to be removed from a user. You're able to customize the task name and description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/lcw-remove-license-assignment-task.png" alt-text="LCW remove all licenses from users":::

For Microsoft Graph the parameters for the **Remove all license assignment from user** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  leaver      |
|displayName     |  Remove all licenses for user (Customizable by user)        |
|description     |  Remove all licenses assigned to the user (Customizable by user)        |
|taskDefinitionId     |   8fa97d28-3e52-4985-b3a9-a1126f9b8b4e      |



```Example for usage within the workflow
 {
            "category": "leaver",
            "continueOnError": true,
            "displayName": "Remove all licenses for user",
            "description": "Remove all licenses assigned to the user",
            "isEnabled": true,
            "taskDefinitionId": "8fa97d28-3e52-4985-b3a9-a1126f9b8b4e",
            "arguments": []
        }

```

### Delete User

Allows user accounts to be deleted. You're able to customize the task name and description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/lcw-delete-user-task.png" alt-text="LCW Delete user account":::

The Azure AD prerequisite to run the **Delete User** task is:

- Azure AD must be the authority source for the account.

For Microsoft Graph the parameters for the **Delete User** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  leaver      |
|displayName     |  Delete user account (Customizable by user)      |
|description     |  Delete user account in Azure AD (Customizable by user)      |
|taskDefinitionId     |   8d18588d-9ad3-4c0f-99d0-ec215f0e3dff      |



```Example for usage within the workflow
 {
            "category": "leaver",
            "continueOnError": true,
            "displayName": "Delete user account",
            "description": "Delete user account in Azure AD",
            "isEnabled": true,
            "taskDefinitionId": "8d18588d-9ad3-4c0f-99d0-ec215f0e3dff",
            "arguments": []
        }

```



## Next steps

- [Manage lifecycle workflows properties](manage-workflow-properties.md)
- [Manage lifecycle workflow versions](delete-lifecycle-workflow.md)