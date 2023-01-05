---
title: Create and perform incident tasks in Microsoft Sentinel using playbooks
description: This article explains how to use playbooks to create (and optionally perform) incident tasks, in order to manage complex analyst workflow processes in Microsoft Sentinel.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 11/24/2022
---

# Create and perform incident tasks in Microsoft Sentinel using playbooks

This article explains how to use playbooks to create (and optionally perform) incident tasks, in order to manage complex analyst workflow processes in Microsoft Sentinel.

[Incident tasks](incident-tasks.md) can be created automatically not only by playbooks, but also by automation rules, and also manually, ad-hoc, from within an incident.

> [!IMPORTANT]
>
> The **Incident tasks** feature is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Use cases for different roles

This article addresses the following scenarios that apply to SOC managers, senior analysts, and automation engineers:

- [Use a playbook to add a task and perform it](#use-a-playbook-to-add-a-task-and-perform-it)
- [Use a playbook to add a task conditionally](#use-a-playbook-to-add-a-task-conditionally)

Other scenarios for this audience are addressed in the following companion article:

- [View automation rules with incident task actions](create-tasks-automation-rule.md#view-automation-rules-with-incident-task-actions)
- [Add tasks to incidents with automation rules](create-tasks-automation-rule.md#add-tasks-to-incidents-with-automation-rules)

Another article, at the following links, addresses scenarios that apply more to SOC analysts:

- [View and follow incident tasks](work-with-tasks.md#view-and-follow-incident-tasks)
- [Manually add an ad-hoc task to an incident](work-with-tasks.md#manually-add-an-ad-hoc-task-to-an-incident)

## Prerequisites

The **Microsoft Sentinel Responder** role is required to view and edit incidents, which is necessary to add, view, and edit tasks.

The **Logic Apps Contributor** role is required to create and edit playbooks.

## Add tasks to incidents with playbooks

Use the **Add task** action in a playbook (in the Microsoft Sentinel connector) to automatically add a task to the incident that triggered the playbook.

[Follow these instructions](tutorial-respond-threats-playbook.md#create-a-playbook) to create a **playbook** based on the **incident trigger**. (You can use either a Standard workflow or a Consumption workflow.)

There are two ways to work with playbooks to generate tasks:

### Use a playbook to add a task and perform it

In this example we're going to add a playbook action that adds a task to the incident to reset a compromised user's password, and we'll add another playbook action that sends a signal to Azure Active Directory Identity Protection (AADIP) to actually reset the password. Then we'll add a final playbook action to mark the task in the incident complete.

To add and configure these actions, take the following steps:

1. From the **Microsoft Sentinel** connector, add the **Add task to incident (Preview)** action.  
    Choose the **Incident ARM ID** dynamic content item for the **Incident ARM id** field. Enter **Reset user password** as the **Title**. Add a description if you want.

    :::image type="content" source="media/create-tasks-playbook/add-task-reset-password.png" alt-text="Screenshot shows playbook actions to add a task to reset a user's password.":::

1. Add the **Entities - Get Accounts (Preview)** action.  
    Add the **Entities** dynamic content item (from the Microsoft Sentinel incident schema) to the **Entities list** field.

    :::image type="content" source="media/create-tasks-playbook/get-entities-accounts.png" alt-text="Screenshot shows playbook actions to get the account entities in the incident.":::

1. Add a **For each** loop from the **Control** actions library.  
    Add the **Accounts** dynamic content item from the **Entities - Get Accounts** output to the **Select an output from previous steps** field.

    :::image type="content" source="media/create-tasks-playbook/for-each-accounts.png" alt-text="Screenshot shows how to add a for-each loop action to a playbook in order to perform an action on each discovered account.":::

1. Inside the **For each** loop, select **Add an action**.  
    Search for and select the  **Azure AD Identity Protection** connector, and select the **Confirm a risky user as compromised (Preview)** action.  
    Add the **Accounts AAD user ID** dynamic content item to the **userIds Item - 1** field.

    > [!NOTE]
    > This field (Accounts AAD user ID) is one way to identify a user in AADIP. It might not necessarily be the best way in every scenario, but is brought here just as an example. For assistance, consult other playbooks that handle compromised users, or the [Azure AD Identity Protection documentation](../active-directory/identity-protection/overview-identity-protection.md).

    This action sets in motion processes inside Azure AD Identity Protection that will reset the user's password.

    :::image type="content" source="media/create-tasks-playbook/confirm-compromised.png" alt-text="Screenshot shows sending entities to AADIP to confirm compromise.":::

1. Add the **Mark a task as completed (Preview)** action from the Microsoft Sentinel connector.  
    Add the **Incident task ID** dynamic content item to the **Task ARM id** field.

    :::image type="content" source="media/create-tasks-playbook/mark-complete.png" alt-text="Screenshot shows how to add a playbook action to mark an incident task complete.":::

### Use a playbook to add a task conditionally

In this example we're going to add a playbook action that researches an IP address that appears in an incident. If the results of this research are that the IP address is malicious, the playbook will create a task for the analyst to disable the user using that IP address. If the IP address is not a known malicious address, the playbook will create a different task, for the analyst to contact the user to verify the activity.

1. From the Microsoft Sentinel connector, add the **Entities - Get IPs** action.  
    Add the **Entities** dynamic content item (from the Microsoft Sentinel incident schema) to the **Entities list** field.

    :::image type="content" source="media/create-tasks-playbook/get-entities-ips.png" alt-text="Screenshot shows playbook actions to get the IP address entities in the incident.":::

1. Add a **For each** loop from the **Control** actions library.  
    Add the **IPs** dynamic content item from the **Entities - Get IPs** output to the **Select an output from previous steps** field.

    :::image type="content" source="media/create-tasks-playbook/for-each-ips.png" alt-text="Screenshot shows how to add a for-each loop action to a playbook in order to perform an action on each discovered IP address.":::

1. Inside the **For each** loop, select **Add an action**.  
    Search for and select the  **Virus Total** connector, and select the **Get an IP report (Preview)** action.  
    Add the **IPs Address** dynamic content item from the **Entities - Get IPs** output to the **IP Address** field.

    :::image type="content" source="media/create-tasks-playbook/get-virus-total-report.png" alt-text="Screenshot shows sending request to Virus Total for IP address report.":::

1. Inside the **For each** loop, select **Add an action**.  
    Add a **Condition** from the **Control** actions library.  
    Add the **Last analysis statistics Malicious** dynamic content item from the **Get an IP report** output (you may have to select "See more" to find it), select the **is greater than** operator, and enter `0` as the value. This condition asks the question "Did the Virus Total IP report have any results?"

    :::image type="content" source="media/create-tasks-playbook/set-condition.png" alt-text="Screenshot shows how to set a true-false condition in a playbook.":::

1. Inside the **True** option, select **Add an action**.  
    Select the **Add task to incident (Preview)** action from the **Microsoft Sentinel** connector.  
    Choose the **Incident ARM ID** dynamic content item for the **Incident ARM id** field.  
    Enter **Mark user as compromised** as the **Title**. Add a description if you want.

    :::image type="content" source="media/create-tasks-playbook/condition-true.png" alt-text="Screenshot shows playbook actions to add a task to mark a user as compromised.":::

1. Inside the **False** option, select **Add an action**.  
    Select the **Add task to incident (Preview)** action from the **Microsoft Sentinel** connector.  
    Choose the **Incident ARM ID** dynamic content item for the **Incident ARM id** field.  
    Enter **Reach out to the user to confirm the activity** as the **Title**. Add a description if you want.

    :::image type="content" source="media/create-tasks-playbook/condition-false.png" alt-text="Screenshot shows playbook actions to add a task to have user confirm activity.":::



## Next steps

- Learn more about [incident tasks](incident-tasks.md).
- Learn how to [investigate incidents](investigate-cases.md).
- Learn how to add tasks to groups of incidents automatically using [automation rules](create-tasks-automation-rule.md).
- Learn how to [use tasks to handle incident workflow in Microsoft Sentinel](work-with-tasks.md).
- Learn more about [playbooks](automate-responses-with-playbooks.md), how to [create them](tutorial-respond-threats-playbook.md), and especially about [working with actions](playbook-triggers-actions.md).
