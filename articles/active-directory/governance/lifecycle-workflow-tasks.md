---
title: Lifecycle Workflows tasks and definitions
description: This article guides a user on Workflow task definitions and task parameters.
author: OWinfreyATL
ms.author: owinfrey
manager: amycolannino
ms.service: active-directory
ms.subservice: compliance
ms.workload: identity
ms.topic: conceptual
ms.date: 01/26/2023
---
# Lifecycle Workflow built-in tasks

Lifecycle Workflows come with many pre-configured tasks that are designed to automate common lifecycle management scenarios. These built-in tasks can be utilized to make customized workflows to suit your organization's needs. These tasks can be configured within seconds to create new workflows. These tasks also have categories based on the Joiner-Mover-Leaver model so that they can be easily placed into workflows based on need. In this article you get the complete list of tasks, information on common parameters each task has, and a list of unique parameters needed for each specific task.


## Supported tasks
 
Lifecycle Workflow's built-in tasks each include an identifier, known as **taskDefinitionID**, and can be used to create either new workflows from scratch, or inserted into workflow templates so that they fit the needs of your organization. For more information on templates available for use with Lifecycle Workflows, see: [Lifecycle Workflow Templates](lifecycle-workflow-templates.md).


[!INCLUDE [Lifecylce Workflows tasks table](../../../includes/lifecycle-workflows-tasks-table.md)]

## Common task parameters

Common task parameters are the non-unique parameters contained in every task. When adding tasks to a new workflow, or a workflow template, you can customize and configure these parameters so that they match your requirements.

|Parameter  |Definition  |
|---------|---------|
|category     |  A  read-only string that identifies the category or categories of the task. Automatically determined when the taskDefinitionID is chosen.     |
|taskDefinitionId     | A string referencing a taskDefinition that determines which task to run.       |
|isEnabled     | A boolean value that denotes whether the task is set to run or not. If set to “true" then the task runs. Defaults to true.       |
|displayName     |  A unique string that identifies the task.       |
|description     | A string that describes the purpose of the task for administrative use. (Optional)         |
|executionSequence     | A read-only integer that states in what order the task runs in a workflow. For more information about executionSequence and workflow order, see: [Configure Scope](understanding-lifecycle-workflows.md#configure-scope).       |
|continueOnError     |  A boolean value that determines if the failure of this task stops the subsequent workflows from running.        |
|arguments     |  Contains unique parameters relevant for the given task.       |

## Common email task parameters

Emails, sent from tasks, are able to be customized. If you choose to customize the email, you're able to set the following arguments:

- **Subject:** Customizes the subject of emails.
- **Message body:** Customizes the body of the emails being sent out.
- **Email language translation:** Overrides the email recipient's language settings. Custom text isn't customized, and it's recommended to set this language to the same language as the custom text. 

:::image type="content" source="media/lifecycle-workflow-task/customize-email-concept.png" alt-text="Screenshot of the customization email options.":::

For a step by step guide on this, see: [Customize emails sent out by workflow tasks](customize-workflow-email.md).

### Dynamic attributes within email

With customized emails, you're able to include dynamic attributes within the subject and body to personalize these emails. The list of dynamic attributes that can be included are as follows:


|Attribute  |Definition  |
|---------|---------|
|userDisplayName     | The user’s display name.        |
|userEmployeeHireDate     | The user’s employee hire date.        |
|userEmployeeLeaveDateTime     | The user’s employee leave date time.        |
|managerDisplayName     |  The display name of the user’s manager.        |
|temporaryAccessPass     |  The generated Temporary Access Pass. Only available with the **Generate TAP And Send Email** task.       |
|userPrincipalName     |  The user’s userPrincipalName.       |
|managerEmail     |  The manager’s email.        |
|userSurname     |  User’s last name.       |
|userGivenName     | User’s first name.        |


> [!NOTE]
> When adding these attributes to a customized email, or subject, they must be properly embedded. For a step by step guide on doing this, see: [Format attributes within customized emails](customize-workflow-email.md).

## Task details

In this section is each specific task, and detailed information such as parameters and prerequisites, required for them to run successfully. The parameters are noted as they appear both in the Azure portal, and within Microsoft Graph. For information about editing Lifecycle Workflow tasks in general, see: [Manage workflow Versions](manage-workflow-tasks.md).


### Send welcome email to new hire


Lifecycle Workflows allow you to automate the sending of welcome emails to new hires in your organization. You're able to customize the task name and description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/welcome-email-task.png" alt-text="Screenshot of Workflows task: Welcome email task.":::


The Azure AD prerequisite to run the **Send welcome email to new hire** task is:

- A populated mail attribute for the user.


For Microsoft Graph, the parameters for the **Send welcome email to new hire** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  joiner      |
|displayName     | Send Welcome Email (Customizable by user)        |
|description     | Send welcome email to new hire (Customizable by user)      |
|taskDefinitionId     |   70b29d51-b59a-4773-9280-8841dfd3f2ea     |
|arguments     |  The optional common email task parameters can be specified; if they are not included, the default behavior takes effect.    |


Example of usage within the workflow:

```json
{
    "category": "joiner",
    "continueOnError": false,
    "description": "Send welcome email to new hire",
    "displayName": "Send Welcome Email",
    "isEnabled": true,
    "taskDefinitionId": "70b29d51-b59a-4773-9280-8841dfd3f2ea",
    "arguments": [
        {
            "name": "cc",
            "value": "e94ad2cd-d590-4b39-8e46-bb4f8e293f85,ac17d108-60cd-4eb2-a4b4-084cacda33f2"
        },
        {
            "name": "customSubject",
            "value": "Welcome to the organization {{userDisplayName}}!"
        },
        {
            "name": "customBody",
            "value": "Welcome to our organization {{userGivenName}} {{userSurname}}.\n\nFor more information, reach out to your manager {{managerDisplayName}} at {{managerEmail}}."
        },
        {
            "name": "locale",
            "value": "en-us"
        }
    ]
}
```

### Send onboarding reminder email


Lifecycle Workflows allow you to automate the sending of onboarding reminder emails to managers of new hires in your organization. You're able to customize the task name and description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/send-onboarding-reminder-email.png" alt-text="Screenshot of Workflows task: Send onboarding reminder email task.":::


The Azure AD prerequisite to run the **Send onboarding reminder email** task is:

- A populated manager attribute for the user.
- A populated manager's mail attribute for the user.


For Microsoft Graph, the parameters for the **Send onboarding reminder email** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  joiner      |
|displayName     | Send onboarding reminder email (Customizable by user)        |
|description     | Send onboarding reminder email to user’s manager (Customizable by user)      |
|taskDefinitionId     |   3C860712-2D37-42A4-928F-5C93935D26A1     |
|arguments     |  The optional common email task parameters can be specified; if they are not included, the default behavior takes effect.    |

Example of usage within the workflow:

```json
{
    "category": "joiner",
    "continueOnError": false,
    "description": "Send onboarding reminder email to user\u2019s manager",
    "displayName": "Send onboarding reminder email",
    "isEnabled": true,
    "taskDefinitionId": "3C860712-2D37-42A4-928F-5C93935D26A1",
    "arguments": [
        {
            "name": "cc",
            "value": "e94ad2cd-d590-4b39-8e46-bb4f8e293f85,068fa0c1-fa00-4f4f-8411-e968d921c3e7"
        },
        {
            "name": "customSubject",
            "value": "Reminder: {{userDisplayName}} is starting soon"
        },
        {
            "name": "customBody",
            "value": "Hello {{managerDisplayName}}\n\nthis is a reminder that {{userDisplayName}} is starting soon.\n\nRegards\nYour IT department"
        },
        {
            "name": "locale",
            "value": "en-us"
        }
    ]
}
```

### Generate Temporary Access Pass and send via email to user's manager

When a compatible user joins your organization, Lifecycle Workflows allow you to automatically generate a Temporary Access Pass (TAP), and have it sent to the new user's manager. You're also able to customize the email that is sent to the user's manager.

> [!NOTE]
> The user's employee hire date is used as the start time for the Temporary Access Pass. Please make sure that the TAP lifetime task setting and the [time portion of your user's hire date](how-to-lifecycle-workflow-sync-attributes.md#importance-of-time) are set appropriately so that the TAP is still valid when the user starts their first day. If the hire date at the time of workflow execution is already in the past, the current time is used as the start time.

With this task in the Azure portal, you're able to give the task a name and description. You must also set:

- **Activation duration**- How long the passcode is active.
- **One time use**- If the passcode can only be used once.
:::image type="content" source="media/lifecycle-workflow-task/tap-task.png" alt-text="Screenshot of Workflows task: TAP task.":::

The Azure AD prerequisites to run the **Generate Temporary Access Pass and send via email to user's manager** task are:

- A populated manager attribute for the user.
- A populated manager's mail attribute for the user.
- The TAP tenant policy must be enabled and the selected values for activation duration and one time use must be within the allowed range of the policy. For more information, see [Enable the Temporary Access Pass policy](../authentication/howto-authentication-temporary-access-pass.md#enable-the-temporary-access-pass-policy)

> [!IMPORTANT]
> A user having this task run for them in a workflow must also not have any other authentication methods, sign-ins, or AAD role assignments for this task to work for them.

For Microsoft Graph, the parameters for the **Generate Temporary Access Pass and send via email to user's manager** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  joiner      |
|displayName     | GenerateTAPAndSendEmail (Customizable by user)      |
|description     | Generate Temporary Access Pass and send via email to user's manager (Customizable by user)       |
|taskDefinitionId     |   1b555e50-7f65-41d5-b514-5894a026d10d     |
|arguments     |  Argument contains the name parameter "tapLifetimeInMinutes", which is the lifetime of the temporaryAccessPass in minutes starting at startDateTime. Minimum 10, Maximum 43200 (equivalent to 30 days). The argument also contains the tapIsUsableOnce parameter, which determines whether the passcode is limited to a one time use. If true, the pass can be used once; if false, the pass can be used multiple times within the temporaryAccessPass lifetime. Additionally, the optional common email task parameters can be specified; if they are not included, the default behavior takes effect.    |

Example of usage within the workflow:

```json
{
    "category": "joiner",
    "continueOnError": false,
    "description": "Generate Temporary Access Pass and send via email to user's manager",
    "displayName": "Generate TAP and Send Email",
    "isEnabled": true,
    "taskDefinitionId": "1b555e50-7f65-41d5-b514-5894a026d10d",
    "arguments": [
        {
            "name": "tapLifetimeMinutes",
            "value": "480"
        },
        {
            "name": "tapIsUsableOnce",
            "value": "false"
        },
        {
            "name": "cc",
            "value": "068fa0c1-fa00-4f4f-8411-e968d921c3e7,9d208c40-7eb6-46ff-bebd-f30148c39b47"
        },
        {
            "name": "customSubject",
            "value": "Temporary access pass for your new employee {{userDisplayName}}"
        },
        {
            "name": "customBody",
            "value": "Hello {{managerDisplayName}}\n\nPlease find the temporary access pass for your new employee {{userDisplayName}} below:\n\n{{temporaryAccessPass}}\n\nRegards\nYour IT department"
        },
        {
            "name": "locale",
            "value": "en-us"
        }
    ]
}
```

### Send email to notify manager of user move

When a user moves within your organization Lifecycle Workflows allow you to send an email to the users manager notifying them of the move. You're also able to customize the email that is sent to the user's manager.

:::image type="content" source="media/lifecycle-workflow-task/notify-user-move-task.png" alt-text="Screenshot of the notify manager of user move task.":::

The Azure AD prerequisite to run the **Send email to notify manager of user move** task are:

- A populated manager attribute for the user.
- A populated manager's mail attribute for the user.

For Microsoft Graph the parameters for the **Send email to notify manager of user move** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  Mover      |
|displayName     |  Send email to notify manager of user move (Customizable by user)       |
|description     |  Send email to notify user’s manager of user move (Customizable by user)        |
|taskDefinitionId     |   aab41899-9972-422a-9d97-f626014578b7      |
|arguments     |  The optional common email task parameters can be specified; if they are not included, the default behavior takes effect.    |

Example of usage within the workflow:

```json
{
    "category": "mover",
    "continueOnError": false,
    "description": "Send email to notify user\u2019s manager of user move",
    "displayName": "Send email to notify manager of user move",
    "isEnabled": true,
    "taskDefinitionId": "aab41899-9972-422a-9d97-f626014578b7",
    "arguments": [
        {
            "name": "cc",
            "value": "ac17d108-60cd-4eb2-a4b4-084cacda33f2,7d3ee937-edcc-46b0-9e2c-f832e01231ea"
        },
        {
            "name": "customSubject",
            "value": "{{userDisplayName}} has moved"
        },
        {
            "name": "customBody",
            "value": "Hello {{managerDisplayName}}\n\nwe are reaching out to let you know {{userDisplayName}} has moved in the organization.\n\nRegards\nYour IT department"
        },
        {
            "name": "locale",
            "value": "en-us"
        }
    ]
}
```

### Request user access package assignment

Allows you to request an access package assignment for users. For more information on access packages, see [What are access packages and what resources can I manage with them?](entitlement-management-overview.md#what-are-access-packages-and-what-resources-can-i-manage-with-them).

You're able to customize the task name and task description for this task. You must also select the access package and policy that is being requested for the user.
:::image type="content" source="media/lifecycle-workflow-task/request-user-access-package-assignment-task.png" alt-text="Screenshot of the request user access package assignment task.":::

For Microsoft Graph, the parameters for the **Request user access package assignment** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  joiner      |
|displayName     |  Request user access package assignment (Customizable by user)        |
|description     |  Request user assignment to selected access package (Customizable by user)       |
|taskDefinitionId     |   c1ec1e76-f374-4375-aaa6-0bb6bd4c60be      |
|arguments     |  Argument contains two name parameter that is the "assignmentPolicyId", and "accessPackageId".    |

Example of usage within the workflow:

```json
{
    "category": "joiner,mover",
    "continueOnError": false,
    "description": "Request user assignment to selected access package",
    "displayName": "Request user access package assignment",
    "isEnabled": true,
    "taskDefinitionId": "c1ec1e76-f374-4375-aaa6-0bb6bd4c60be",
    "arguments": [
        {
            "name": "assignmentPolicyId",
            "value": "00d6fd25-6695-4f4a-8186-e4c6f901d2c1"
        },
        {
            "name": "accessPackageId",
            "value": "2ae5d6e5-6cbe-4710-82f2-09ef6ffff0d0"
        }
    ]
}
```

### Add user to groups


Allows users to be added to Microsoft 365 and cloud-only security groups. Mail-enabled, distribution, dynamic and role-assignable groups aren't supported. To control access to on-premises applications and resources, you need to enable group writeback. For more information, see [Azure AD Connect group writeback](../hybrid/how-to-connect-group-writeback-v2.md). 


You're able to customize the task name and description for this task.
:::image type="content" source="media/lifecycle-workflow-task/add-group-task.png" alt-text="Screenshot of Workflows task: Add user to group task.":::


For Microsoft Graph, the parameters for the **Add user to groups** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  joiner, leaver      |
|displayName     |  AddUserToGroup (Customizable by user)        |
|description     |  Add user to groups (Customizable by user)       |
|taskDefinitionId     |   22085229-5809-45e8-97fd-270d28d66910      |
|arguments     |  Argument contains a name parameter that is the "groupID", and a value parameter that is the group ID of the group you're adding the user to.    |


```Example for usage within the workflow
{
            "category": "joiner,leaver",
            "description": "Add user to groups",
            "displayName": "AddUserToGroup",
            "isEnabled": true,
            "continueOnError": true,
            "taskDefinitionId": "22085229-5809-45e8-97fd-270d28d66910",
            "arguments": [
                {
                    "name": "groupID",
                    "value": "0732f92d-6eb5-4560-80a4-4bf242a7d501"
                }
            ]
}

```


### Add user to teams

You're able to add a user to an existing static team. You're able to customize the task name and description for this task.
:::image type="content" source="media/lifecycle-workflow-task/add-team-task.png" alt-text="Screenshot of Workflows task: add user to team.":::


For Microsoft Graph, the parameters for the **Add user to teams** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  joiner, leaver      |
|displayName     |  AddUserToTeam (Customizable by user)       |
|description     |  Add user to teams (Customizable by user)        |
|taskDefinitionId     |   e440ed8d-25a1-4618-84ce-091ed5be5594      |
|argument     |  Argument contains a name parameter that is the "teamID", and a value parameter that is the team ID of the existing team you're adding a user to.    |



```Example for usage within the workflow
{
            "category": "joiner,leaver",
            "description": "Add user to team",
            "displayName": "AddUserToTeam",
            "isEnabled": true,
            "continueOnError": true,
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

Allows cloud-only user accounts to be enabled. Users with Azure AD role assignments aren't supported, nor are users with membership or ownership of role-assignable groups. You can utilize Azure Active Directory's HR driven provisioning to on-premises Active Directory to disable and enable synchronized accounts with an attribute mapping to `accountDisabled` based on data from your HR source. For more information, see: [Workday Configure attribute mappings](../saas-apps/workday-inbound-tutorial.md#part-4-configure-attribute-mappings) and [SuccessFactors Configure attribute mappings](../saas-apps/sap-successfactors-inbound-provisioning-tutorial.md#part-4-configure-attribute-mappings). You're able to customize the task name and description for this task in the Azure portal.

:::image type="content" source="media/lifecycle-workflow-task/enable-task.png" alt-text="Screenshot of Workflows task: enable user account.":::


For Microsoft Graph, the parameters for the **Enable user account** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  joiner, leaver      |
|displayName     |  EnableUserAccount (Customizable by user)       |
|description     |  Enable user account (Customizable by user)        |
|taskDefinitionId     |   6fc52c9d-398b-4305-9763-15f42c1676fc      |



```Example for usage within the workflow
 {
            "category": "joiner,leaver",
            "description": "Enable user account",
            "displayName": "EnableUserAccount",
            "isEnabled": true,
            "continueOnError": true,
            "taskDefinitionId": "6fc52c9d-398b-4305-9763-15f42c1676fc",
            "arguments": []
}

```

### Run a Custom Task Extension

Workflows can be configured to launch a custom task extension. You're able to customize the task name and description for this task using the Azure portal.

:::image type="content" source="media/lifecycle-workflow-task/custom-extension-task.png" alt-text="Screenshot of Workflows task: custom extension task.":::

The Azure AD prerequisite to run the **Run a Custom Task Extension** task is:

- A Logic App that is compatible with the custom task extension. For more information, see: [Lifecycle workflow extensibility](lifecycle-workflow-extensibility.md).

For Microsoft Graph, the parameters for the **Run a Custom Task Extension** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  joiner, leaver      |
|displayName     | Run a Custom Task Extension (Customizable by user)        |
|description     |  Run a Custom Task Extension to call-out to an external system. (Customizable by user)      |
|taskDefinitionId     |   d79d1fcc-16be-490c-a865-f4533b1639ee      |
|argument     |  Argument contains a name parameter that is the "customTaskExtensionID", and a value parameter that is the ID of the previously created extension that contains information about the Logic App.    |




```Example for usage within the workflow
{
            "category": "joiner,leaver",
            "description": "Run a Custom Task Extension to call-out to an external system.",
            "displayName": "Run a Custom Task Extension",
            "isEnabled": true,
            "continueOnError": true,
            "taskDefinitionId": "d79d1fcc-16be-490c-a865-f4533b1639ee",
            "arguments": [
                {
                    "name": "customTaskExtensionID",
                    "value": "<ID of your Custom Task Extension>"
                }
            ]
}

```

For more information on setting up a Logic app to run with Lifecycle Workflows, see:[Trigger Logic Apps with custom Lifecycle Workflow tasks](trigger-custom-task.md).

### Disable user account

Allows cloud-only user accounts to be disabled. Users with Azure AD role assignments aren't supported, nor are users with membership or ownership of role-assignable groups. You can utilize Azure Active Directory's HR driven provisioning to on-premises Active Directory to disable and enable synchronized accounts with an attribute mapping to `accountDisabled` based on data from your HR source. For more information, see: [Workday Configure attribute mappings](../saas-apps/workday-inbound-tutorial.md#part-4-configure-attribute-mappings) and [SuccessFactors Configure attribute mappings](../saas-apps/sap-successfactors-inbound-provisioning-tutorial.md#part-4-configure-attribute-mappings). You're able to customize the task name and description for this task in the Azure portal.

:::image type="content" source="media/lifecycle-workflow-task/disable-task.png" alt-text="Screenshot of Workflows task: disable user account.":::


For Microsoft Graph, the parameters for the **Disable user account** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  joiner, leaver      |
|displayName     |  DisableUserAccount (Customizable by user)       |
|description     |  Disable user account (Customizable by user)       |
|taskDefinitionId     |   1dfdfcc7-52fa-4c2e-bf3a-e3919cc12950      |


```Example for usage within the workflow
{
            "category": "joiner,leaver",
            "description": "Disable user account",
            "displayName": "DisableUserAccount",
            "isEnabled": true,
            "continueOnError": true,
            "taskDefinitionId": "1dfdfcc7-52fa-4c2e-bf3a-e3919cc12950",
            "arguments": []
}

```

### Remove user from selected groups

Allows users to be removed from Microsoft 365 and cloud-only security groups. Mail-enabled, distribution, dynamic and role-assignable groups aren't supported. To control access to on-premises applications and resources, you need to enable group writeback. For more information, see [Azure AD Connect group writeback](../hybrid/how-to-connect-group-writeback-v2.md). 


You're able to customize the task name and description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/remove-group-task.png" alt-text="Screenshot of Workflows task: Remove user from select groups.":::



For Microsoft Graph, the parameters for the **Remove user from selected groups** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  leaver      |
|displayName     |  Remove user from selected groups (Customizable by user)        |
|description     |  Remove user from membership of selected Azure AD groups (Customizable by user)      |
|taskDefinitionId     |   1953a66c-751c-45e5-8bfe-01462c70da3c      |
|argument     |  Argument contains a name parameter that is the "groupID", and a value parameter that is the group Id(s) of the group or groups you're removing the user from.   |



```Example for usage within the workflow
{
            "category": "leaver",
            "displayName": "Remove user from selected groups",
            "description": "Remove user from membership of selected Azure AD groups",
            "isEnabled": true,
            "continueOnError": true,
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

Allows users to be removed from every Microsoft 365 and cloud-only security group they're a member of. Mail-enabled, distribution, dynamic and role-assignable groups aren't supported. To control access to on-premises applications and resources, you need to enable group writeback. For more information, see [Azure AD Connect group writeback](../hybrid/how-to-connect-group-writeback-v2.md).



You're able to customize the task name and description for this task in the Azure portal.

 :::image type="content" source="media/lifecycle-workflow-task/remove-all-groups-task.png" alt-text="Screenshot of Workflows task: remove user from all groups.":::


For Microsoft Graph, the parameters for the **Remove users from all groups** task are as follows:

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

Allows a user to be removed from one or multiple static teams. You're able to customize the task name and description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/remove-user-team-task.png" alt-text="Screenshot of Workflows task: remove user from teams.":::

For Microsoft Graph, the parameters for the **Remove User from Teams** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  joiner, leaver      |
|displayName     |  Remove user from selected Teams (Customizable by user)       |
|description     |  Remove user from membership of selected Teams (Customizable by user)       |
|taskDefinitionId     |   06aa7acb-01af-4824-8899-b14e5ed788d6     |
|arguments     |  Argument contains a name parameter that is the "teamID", and a value parameter that is the Teams ID of the Teams you're removing the user from.   |


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

Allows users to be removed from every static team they're a member of. You're able to customize the task name and description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/remove-user-all-team-task.png" alt-text="Screenshot of Workflows task: remove user from all teams.":::

For Microsoft Graph, the parameters for the **Remove users from all teams** task are as follows:

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

### Remove access package assignment for user

Allows you to remove an access package assignment for users. For more information on access packages, see [What are access packages and what resources can I manage with them?](entitlement-management-overview.md#what-are-access-packages-and-what-resources-can-i-manage-with-them).

You're able to customize the task name and description for this task in the Azure portal. You also need to select the access package for which you want to remove the assignment.
:::image type="content" source="media/lifecycle-workflow-task/remove-access-package-assignment-user-task.png" alt-text="Screenshot of the remove access package assignment for user task.":::

For Microsoft Graph, the parameters for the **Remove access package assignment for user** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  leaver      |
|displayName     |  Remove access package assignment for user (Customizable by user)        |
|description     |  Remove user assignment of selected access package (Customizable by user)        |
|taskDefinitionId     |   4a0b64f2-c7ec-46ba-b117-18f262946c50      |
|arguments     |  Argument contains a name parameter that is the "accessPackageId".   |


```Example for usage within the workflow
{
    "category": "leaver,mover",
    "continueOnError": false,
    "description": "Remove user assignment of selected access package",
    "displayName": "Remove access package assignment for user",
    "isEnabled": true,
    "taskDefinitionId": "4a0b64f2-c7ec-46ba-b117-18f262946c50",
    "arguments": [
        {
            "name": "accessPackageId",
            "value": "2ae5d6e5-6cbe-4710-82f2-09ef6ffff0d0"
        }
    ]
}
```

### Remove all access package assignments for user

Allows you to remove all access package assignments for users. For more information on access packages, see [What are access packages and what resources can I manage with them?](entitlement-management-overview.md#what-are-access-packages-and-what-resources-can-i-manage-with-them).

You're able to customize the task name and description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/remove-all-access-package-assignment-user-task.png" alt-text="Screenshot of the remove all user access package assignment task.":::

For Microsoft Graph, the parameters for the **Remove all access package assignments for user** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  leaver      |
|displayName     |  Remove all access package assignments for user (Customizable by user)        |
|description     |  Remove all access packages assigned to the user (Customizable by user)        |
|taskDefinitionId     |   42ae2956-193d-4f39-be06-691b8ac4fa1d      |

Example of usage within the workflow:

```json
{
    "category": "leaver",
    "continueOnError": false,
    "description": "Remove all access packages assigned to the user",
    "displayName": "Remove all access package assignments for user",
    "isEnabled": true,
    "taskDefinitionId": "42ae2956-193d-4f39-be06-691b8ac4fa1d",
    "arguments": []
}
```


### Cancel all pending access package assignment requests for user

Allows you to cancel all pending access package assignment requests for user. For more information on access packages, see [What are access packages and what resources can I manage with them?](entitlement-management-overview.md#what-are-access-packages-and-what-resources-can-i-manage-with-them).

You're able to customize the task name and description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/cancel-all-pending-access-package-assignments-task.png" alt-text="Screenshot of the cancel all pending access package assignments requests for a user task.":::

For Microsoft Graph, the parameters for the **Cancel all pending access package assignment requests for user** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  leaver      |
|displayName     |  Cancel pending access package assignment requests for user (Customizable by user)        |
|description     |  Cancel all pending access packages assignment requests for the user (Customizable by user)        |
|taskDefinitionId     |   498770d9-bab7-4e4c-b73d-5ded82a1d0b3      |


Example of usage within the workflow:

```json
{
    "category": "leaver",
    "continueOnError": false,
    "description": "Cancel all access package assignment requests pending for the user",
    "displayName": "Cancel all pending access package assignment requests for user",
    "isEnabled": true,
    "taskDefinitionId": "498770d9-bab7-4e4c-b73d-5ded82a1d0b3",
    "arguments": []
}
```


### Remove all license assignments from User

Allows all direct license assignments to be removed from a user. For group-based license assignments, you would run a task to remove the user from the group the license assignment is part of.

You're able to customize the task name and description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/remove-license-assignment-task.png" alt-text="Screenshot of Workflows task: remove all licenses from users.":::

For Microsoft Graph, the parameters for the **Remove all license assignment from user** task are as follows:

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

Allows cloud-only user accounts to be deleted. Users with Azure AD role assignments aren't supported, nor are users with membership or ownership of role-assignable groups. You're able to customize the task name and description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/delete-user-task.png" alt-text="Screenshot of Workflows task: Delete user account.":::


For Microsoft Graph, the parameters for the **Delete User** task are as follows:

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

### Send email to manager before user's last day

Allows an email to be sent to a user's manager before their last day. You're able to customize the task name and the description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/send-email-before-last-day.png" alt-text="Screenshot of Workflows task: send email before user last day task.":::


The Azure AD prerequisite to run the **Send email before user's last day** task are:

- A populated manager attribute for the user.
- A populated manager's mail attribute for the user.

For Microsoft Graph the parameters for the **Send email before user's last day** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  leaver      |
|displayName     |  Send email before user’s last day (Customizable by user)       |
|description     |  Send offboarding email to user’s manager before the last day of work (Customizable by user)        |
|taskDefinitionId     |   52853a3e-f4e5-4eb8-bb24-1ac09a1da935      |
|arguments     |  The optional common email task parameters can be specified; if they are not included, the default behavior takes effect.    |

Example of usage within the workflow:

```
{
    "category": "leaver",
    "continueOnError": false,
    "description": "Send offboarding email to user’s manager before the last day of work",
    "displayName": "Send email before user’s last day",
    "isEnabled": true,
    "taskDefinitionId": "52853a3e-f4e5-4eb8-bb24-1ac09a1da935",
    "arguments": [
        {
            "name": "cc",
            "value": "068fa0c1-fa00-4f4f-8411-e968d921c3e7,e94ad2cd-d590-4b39-8e46-bb4f8e293f85"
        },
        {
            "name": "customSubject",
            "value": "Reminder that {{userDisplayName}}'s last day is coming up"
        },
        {
            "name": "customBody",
            "value": "Hello {{managerDisplayName}}\n\nthis is a reminder that {{userDisplayName}}'s last day is coming up.\n\nRegards\nYour IT department"
        },
        {
            "name": "locale",
            "value": "en-us"
        }
    ]
}
```

### Send email on user's last day

Allows an email to be sent to a user's manager on their last day. You're able to customize the task name and the description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/send-email-last-day.png" alt-text="Screenshot of Workflows task: task to send email last day.":::

The Azure AD prerequisite to run the **Send email on user last day** task are:

- A populated manager attribute for the user.
- A populated manager's mail attribute for the user.

For Microsoft Graph, the parameters for the **Send email on user last day** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  leaver      |
|displayName     |  Send email on user’s last day (Customizable by user)       |
|description     |  Send offboarding email to user’s manager on the last day of work (Customizable by user)        |
|taskDefinitionId     |   9c0a1eaf-5bda-4392-9d9e-6e155bb57411      |
|arguments     |  The optional common email task parameters can be specified; if they are not included, the default behavior takes effect.    |

Example of usage within the workflow:

```json
{
    "category": "leaver",
    "continueOnError": false,
    "description": "Send offboarding email to user’s manager on the last day of work",
    "displayName": "Send email on user’s last day",
    "isEnabled": true,
    "taskDefinitionId": "9c0a1eaf-5bda-4392-9d9e-6e155bb57411",
    "arguments": [
        {
            "name": "cc",
            "value": "068fa0c1-fa00-4f4f-8411-e968d921c3e7,e94ad2cd-d590-4b39-8e46-bb4f8e293f85"
        },
        {
            "name": "customSubject",
            "value": "{{userDisplayName}}'s last day"
        },
        {
            "name": "customBody",
            "value": "Hello {{managerDisplayName}}\n\nthis is a reminder that {{userDisplayName}}'s last day is today and their access will be revoked.\n\nRegards\nYour IT department"
        },
        {
            "name": "locale",
            "value": "en-us"
        }
    ]
}
```

### Send email to user's manager after their last day

Allows an email containing off-boarding information to be sent to the user's manager after their last day. You're able to customize the task name and description for this task in the Azure portal.
:::image type="content" source="media/lifecycle-workflow-task/offboard-email-manager.png" alt-text="Screenshot of Workflows task: send off-boarding email to users manager after their last day.":::

The Azure AD prerequisite to run the **Send email to users manager after their last day** task are:

- A populated manager attribute for the user.
- A populated manager's mail attribute for the user.


For Microsoft Graph, the parameters for the **Send email to users manager after their last day** task are as follows:

|Parameter |Definition  |
|---------|---------|
|category    |  leaver      |
|displayName     |  Send email to users manager after their last day      |
|description     |  Send offboarding email to user’s manager after the last day of work (Customizable by user)        |
|taskDefinitionId     |   6f22ddd4-b3a5-47a4-a846-0d7c201a49ce      |
|arguments     |  The optional common email task parameters can be specified; if they are not included, the default behavior takes effect.    |

Example of usage within the workflow:

```json
{
    "category": "leaver",
    "continueOnError": false,
    "description": "Send offboarding email to user’s manager after the last day of work",
    "displayName": "Send email after user’s last day",
    "isEnabled": true,
    "taskDefinitionId": "6f22ddd4-b3a5-47a4-a846-0d7c201a49ce",
    "arguments": [
        {
            "name": "cc",
            "value": "ac17d108-60cd-4eb2-a4b4-084cacda33f2,7d3ee937-edcc-46b0-9e2c-f832e01231ea"
        },
        {
            "name": "customSubject",
            "value": "{{userDisplayName}}'s accounts will be deleted today"
        },
        {
            "name": "customBody",
            "value": "Hello {{managerDisplayName}}\n\nthis is a reminder that {{userDisplayName}} left the organization a while ago and today their disabled accounts will be deleted.\n\nRegards\nYour IT department"
        },
        {
            "name": "locale",
            "value": "en-us"
        }
    ]
}
```

## Next steps

- [Manage lifecycle workflows properties](manage-workflow-properties.md)
- [Manage lifecycle workflow versions](manage-workflow-tasks.md)

