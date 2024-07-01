---
title: Create and perform incident tasks in Microsoft Sentinel using playbooks
description: This article explains how to use playbooks to create (and optionally perform) incident tasks, in order to manage complex analyst workflow processes in Microsoft Sentinel.
ms.topic: how-to
author: batamig
ms.author: bagol
ms.date: 03/14/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#customerIntent: As a SOC analyst, I want to understand how to use playbooks to manage complex analysis processes in Microsoft Sentinel.
---

# Create and perform incident tasks in Microsoft Sentinel using playbooks

This article explains how to use playbooks to create, and optionally perform, incident tasks to manage complex analyst workflow processes in Microsoft Sentinel.

Use the **Add task** action in a playbook, in the Microsoft Sentinel connector, to automatically add a task to the incident that triggered the playbook. Both Standard and Consumption workflows are supported.

> [!TIP]
> Incident tasks can be created automatically not only by playbooks, but also by automation rules, and also manually, ad-hoc, from within an incident.
>

For more information, see [Use tasks to manage incidents in Microsoft Sentinel](../incident-tasks.md).

## Prerequisites

- The **Microsoft Sentinel Responder** role is required to view and edit incidents, which is necessary to add, view, and edit tasks.

- The **Logic Apps Contributor** role is required to create and edit playbooks.

For more information, see [Microsoft Sentinel playbook prerequisites](automate-responses-with-playbooks.md#prerequisites).

## Use a playbook to add a task and perform it

This section provides a sample procedure for adding a playbook action that does the following:

- Adds a task to the incident, resetting a compromised user's password
- Adds another playbook action to send a signal to Microsoft Entra ID Protection (AADIP) to actually reset the password
- Adds a final playbook action to mark the task in the incident complete.

To add and configure these actions, take the following steps:

1. From the **Microsoft Sentinel** connector, add the **Add task to incident** action and then:

    1. Select the **Incident ARM ID** dynamic content item for the **Incident ARM id** field. 

    1. Enter **Reset user password** as the **Title**.

    1. Add an optional description.

    For example:

    :::image type="content" source="../media/create-tasks-playbook/add-task-reset-password.png" alt-text="Screenshot shows playbook actions to add a task to reset a user's password.":::

1. Add the **Entities - Get Accounts (Preview)** action. Add the **Entities** dynamic content item (from the Microsoft Sentinel incident schema) to the **Entities list** field. For example:

    :::image type="content" source="../media/create-tasks-playbook/get-entities-accounts.png" alt-text="Screenshot shows playbook actions to get the account entities in the incident.":::

1. Add a **For each** loop from the **Control** actions library. Add the **Accounts** dynamic content item from the **Entities - Get Accounts** output to the **Select an output from previous steps** field. For example:

    :::image type="content" source="../media/create-tasks-playbook/for-each-accounts.png" alt-text="Screenshot shows how to add a for-each loop action to a playbook in order to perform an action on each discovered account.":::

1. Inside the **For each** loop, select **Add an action**. Then:

    1. Search for and select the  **Microsoft Entra ID Protection** connector
    1. Select the **Confirm a risky user as compromised (Preview)** action.  
    1. Add the **Accounts Microsoft Entra user ID** dynamic content item to the **userIds Item - 1** field.

    This action sets in motion processes inside Microsoft Entra ID Protection to reset the user's password.

    :::image type="content" source="../media/create-tasks-playbook/confirm-compromised.png" alt-text="Screenshot shows sending entities to AADIP to confirm compromise.":::

    > [!NOTE]
    > The **Accounts Microsoft Entra user ID** field is one way to identify a user in AADIP. It might not necessarily be the best way in every scenario, but is brought here just as an example.
    >
    > For assistance, consult other playbooks that handle compromised users, or the [Microsoft Entra ID Protection documentation](/azure/active-directory/identity-protection/overview-identity-protection).

1. Add the **Mark a task as completed** action from the Microsoft Sentinel connector and add the **Incident task ID** dynamic content item to the **Task ARM id** field. For example:

    :::image type="content" source="../media/create-tasks-playbook/mark-complete.png" alt-text="Screenshot shows how to add a playbook action to mark an incident task complete.":::

## Use a playbook to add a task conditionally

This section provides a sample procedure for adding a playbook action that researches an IP address that appears in an incident.

- If the results of this research are that the IP address is malicious, the playbook creates a task for the analyst to disable the user using that IP address.
- If the IP address isn't a known malicious address, the playbook creates a different task, for the analyst to contact the user to verify the activity.

To add and configure these actions, take the following steps:

1. From the Microsoft Sentinel connector, add the **Entities - Get IPs** action. Add the **Entities** dynamic content item (from the Microsoft Sentinel incident schema) to the **Entities list** field. For example:

    :::image type="content" source="../media/create-tasks-playbook/get-entities-ips.png" alt-text="Screenshot shows playbook actions to get the IP address entities in the incident.":::

1. Add a **For each** loop from the **Control** actions library.  Add the **IPs** dynamic content item from the **Entities - Get IPs** output to the **Select an output from previous steps** field. For example:

    :::image type="content" source="../media/create-tasks-playbook/for-each-ips.png" alt-text="Screenshot shows how to add a for-each loop action to a playbook in order to perform an action on each discovered IP address.":::

1. Inside the **For each** loop, select **Add an action**, and then:

    1. Search for and select the  **Virus Total** connector.
    1. Select the **Get an IP report (Preview)** action.  
    1. Add the **IPs Address** dynamic content item from the **Entities - Get IPs** output to the **IP Address** field.

    For example:

    :::image type="content" source="../media/create-tasks-playbook/get-virus-total-report.png" alt-text="Screenshot shows sending request to Virus Total for IP address report.":::

1. Inside the **For each** loop, select **Add an action**, and then:

    1. Add a **Condition** from the **Control** actions library.  
    1. Add the **Last analysis statistics Malicious** dynamic content item from the **Get an IP report** output. You might have to select **See more** to find it.
    1. Select the **is greater than** operator and enter `0` as the value. 
    
    This condition asks the question "Did the Virus Total IP report have any results?" For example:

    :::image type="content" source="../media/create-tasks-playbook/set-condition.png" alt-text="Screenshot shows how to set a true-false condition in a playbook." border="false":::

1. Inside the **True** option, select **Add an action**, and then:

    1. Select the **Add task to incident** action from the **Microsoft Sentinel** connector.  
    1. Select the **Incident ARM ID** dynamic content item for the **Incident ARM id** field.  
    1. Enter **Mark user as compromised** as the **Title**.
    1. Add an optional description.

    For example:

    :::image type="content" source="../media/create-tasks-playbook/condition-true.png" alt-text="Screenshot shows playbook actions to add a task to mark a user as compromised.":::

1. Inside the **False** option, select **Add an action**, and then:

    1. Select the **Add task to incident** action from the **Microsoft Sentinel** connector.  
    1. Select the **Incident ARM ID** dynamic content item for the **Incident ARM id** field.  
    1. Enter **Reach out to the user to confirm the activity** as the **Title**.
    1. Add an optional description.

    For example:

    :::image type="content" source="../media/create-tasks-playbook/condition-false.png" alt-text="Screenshot shows playbook actions to add a task to have user confirm activity.":::


## Related content

For more information, see:

- [Investigate incidents with Microsoft Sentinel](../investigate-cases.md)
- [Create incident tasks in Microsoft Sentinel using automation rules](../create-tasks-automation-rule.md)
- [Work with incident tasks in Microsoft Sentinel](../work-with-tasks.md)

