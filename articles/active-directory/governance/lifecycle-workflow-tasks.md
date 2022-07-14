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
# Lifecycle Workflow tasks and definitions (preview)

Lifecycle Workflows come with many pre-configured tasks that are designed to automate common lifecycle management scenarios. These pre-configured tasks, or task definitions, can be paired together to make customized workflows to suit your organization's needs. While each task has common parameters that must be filled out such as a category, displayName, description, if a task error stops a workflow from running, and whether it's enabled, some tasks also have unique parameters which must be completed to run them in a workflow. In this article you'll get the complete list of task definitions, information on common parameters each task has, and a list of unique parameters needed for each specific task.


## Supported task definitions (preview)
Lifecycle Workflows currently support the following task definitions:

|Task  |taskDefinitionID  |
|---------|---------|
|Send welcome email to new hire     |   70b29d51-b59a-4773-9280-8841dfd3f2ea      |
|Generate Temporary Access Password and send via email to user's manager     |  1b555e50-7f65-41d5-b514-5894a026d10d       |
|Add user to group     |    22085229-5809-45e8-97fd-270d28d66910     |
|Add user to team      |  e440ed8d-25a1-4618-84ce-091ed5be5594       |
|Enable user account     |    6fc52c9d-398b-4305-9763-15f42c1676fc     |
|Run a custom task extension    |    4262b724-8dba-4fad-afc3-43fcbb497a0e    |
|Disable user account     |   1dfdfcc7-52fa-4c2e-bf3a-e3919cc12950      |
|Remove user from group     |   1953a66c-751c-45e5-8bfe-01462c70da3c      |
|Remove users from all groups     |    b3a31406-2a15-4c9a-b25b-a658fa5f07fc     |
|Remove user from teams    |    06aa7acb-01af-4824-8899-b14e5ed788d6     |
|Remove user from all teams     |    81f7b200-2816-4b3b-8c5d-dc556f07b024     |
|Remove all license assignments from user     |    8fa97d28-3e52-4985-b3a9-a1126f9b8b4e     |
|Delete user    |    8d18588d-9ad3-4c0f-99d0-ec215f0e3dff     |


## Common task parameters (preview)


|Parameter  |Definition  |
|---------|---------|
|category     |  A string that identifies the category or categories of the task. The parameter can be a single or multiple string that is "joiner", "mover", or "leaver. Category of tasks must also contain a matching parameter as its workflow to run.      |
|taskDefinitionId     | A string that allows built-in workflow tasks to run.       |
|isEnabled     | A boolean value that denotes whether the task is set to run or not. If set to “true" then the task will run.       |
|displayName     |  A unique string that identifies the task.       |
|description     | A string that describes the purpose of the task for administrative use. (Optional)         |
|executionSequence     | An integer that states in what order the task will run in a workflow .       |
|continueOnError     |  A boolean value that determines if the failure of this task stops the subsequent workflows from running.        |
|arguments     |  Contains unique parameters relevant for the given task       |



## Specific task parameters and arguments (preview)

Below are the parameters for each task currently supported by Lifecycle Workflows. The parameters are noted as they appear both in the Azure portal, and within Microsoft Graph. For information about editing Lifecycle Workflow tasks in general, see: [Manage workflow Versions](manage-workflow-tasks.md).


### Send welcome email to new hire


Lifecycle Workflows allow you to automate the sending of welcome emails to new hires in your organization. You're able to customize the task name and description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/lcw-email-task.png" alt-text="LCW Email task":::

For Microsoft Graph the parameters for the **Send welcome email to new hire** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  "joiner"      |
|displayName     | "Send Welcome Email"         |
|description     | "Send welcome email to new hire"      |
|taskDefinitionId     |   "70b29d51-b59a-4773-9280-8841dfd3f2ea"     |



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
 

For Microsoft Graph the parameters for the **Generate Temporary Access Password and send via email to user's manager** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  "joiner"      |
|displayName     | "GenerateTAPAndSendEmail"         |
|description     | "Generate Temporary Access Password and send via email to user's manager"        |
|taskDefinitionId     |   "1b555e50-7f65-41d5-b514-5894a026d10d"     |
|tapLifetimeInMinutes     | The lifetime of the temporaryAccessPass in minutes starting at startDateTime. Minimum 10, Maximum 43200 (equivalent to 30 days).   |
|tapIsUsableOnce     |  Determines whether the pass is limited to a one time use. If true, the pass can be used once; if false, the pass can be used multiple times within the temporaryAccessPass lifetime.   |


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

### Add user to group

You're able to add a user to an Azure AD security or Microsoft 365 group. You're able to customize the task name and description for this task.

:::image type="content" source="media/lifecycle-workflow-task/lcw-add-group-task.png" alt-text="LCW Add user to group task":::


For Microsoft Graph the parameters for the **Add user to group** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  "joiner,leaver"      |
|displayName     |  "AddUserToGroup"       |
|description     |  "Add user to group"      |
|taskDefinitionId     |   "22085229-5809-45e8-97fd-270d28d66910"      |
|name     |  "groupID"    |
|values     |  The group id value surrounded by ""    |
|valueType     |  "string"    |


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
|category    |  "joiner,leaver"      |
|displayName     |  "AddUserToTeam"      |
|description     |  "Add user to team"       |
|taskDefinitionId     |   "e440ed8d-25a1-4618-84ce-091ed5be5594"      |
|name     |  "teamID"    |
|values     |  The team id value surrounded by ""    |
|valueType     |  "string"    |

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
|category    |  "joiner,leaver"      |
|displayName     |  "EnableUserAccount"      |
|description     |  "Enable user account"       |
|taskDefinitionId     |   "6fc52c9d-398b-4305-9763-15f42c1676fc"      |



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

For Microsoft Graph the parameters for the **Run a Custom Task Extension** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  "joiner,leaver"      |
|displayName     | "Launch Logic App"       |
|description     |  "Launch Logic App URL"      |
|taskDefinitionId     |   "d79d1fcc-16be-490c-a865-f4533b1639ee"      |
|name     |  "logicAppURL"     |
|values     |  The endpoint URL for the Logic App     |
|valueType     |  "string"    |


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
|category    |  "joiner,leaver"      |
|displayName     |  "DisableUserAccount"       |
|description     |  "Disable user account"       |
|taskDefinitionId     |   "1dfdfcc7-52fa-4c2e-bf3a-e3919cc12950"      |


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

For Microsoft Graph the parameters for the **Remove user from groups** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  "leaver"      |
|displayName     |  "Remove user from selected groups"       |
|description     |  "Remove user from membership of selected Azure AD groups"       |
|taskDefinitionId     |   "1953a66c-751c-45e5-8bfe-01462c70da3c"      |
|name     |  "groupID"    |
|values     |  The group id value surrounded by ""    |


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

For Microsoft Graph the parameters for the **Remove users from all groups** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  "leaver"      |
|displayName     |  "Remove user from all groups"      |
|description     |  "Remove user from all Azure AD groups memberships"       |
|taskDefinitionId     |   "b3a31406-2a15-4c9a-b25b-a658fa5f07fc"      |



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
|category    |  "joiner,leaver"      |
|displayName     |  "Remove user from selected Teams"       |
|description     |  "Remove user from membership of selected Teams"       |
|taskDefinitionId     |   "06aa7acb-01af-4824-8899-b14e5ed788d6"      |
|name     |  "teamID"    |
|values     |  The team id value surrounded by ""    |

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
|category    |  "leaver"      |
|displayName     |  "Remove user from all Teams memberships"      |
|description     |  "Remove user from all Teams"       |
|taskDefinitionId     |   "81f7b200-2816-4b3b-8c5d-dc556f07b024"      |



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
|category    |  "leaver"      |
|displayName     |  "Remove all licenses for user"       |
|description     |  "Remove all licenses assigned to the user"       |
|taskDefinitionId     |   "8fa97d28-3e52-4985-b3a9-a1126f9b8b4e"      |



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

For Microsoft Graph the parameters for the **Delete User** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  "leaver"      |
|displayName     |  "Delete user account"       |
|description     |  "Delete user account in Azure AD"       |
|taskDefinitionId     |   "8d18588d-9ad3-4c0f-99d0-ec215f0e3dff"      |



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