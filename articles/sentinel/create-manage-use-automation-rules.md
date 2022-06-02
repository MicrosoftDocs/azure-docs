---
title: Create and use Microsoft Sentinel automation rules to manage incidents | Microsoft Docs
description: This article explains how to create and use automation rules in Microsoft Sentinel to manage and handle incidents, in order to maximize your SOC's efficiency and effectiveness in response to security threats.
author: yelevin
ms.topic: how-to
ms.date: 05/23/2022
ms.author: yelevin
---

# Create and use Microsoft Sentinel automation rules to manage incidents

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

This article explains how to create and use automation rules in Microsoft Sentinel to manage and handle incidents, in order to maximize your SOC's efficiency and effectiveness in response to security threats.

In this article you'll learn how to define the triggers and conditions that will determine when your automation rule will run, the various actions that you can have the rule perform, and the remaining features and functionalities.

## Design your automation rule

### Determine the scope

The first step in designing and defining your automation rule is figuring out which incidents you want it to apply to. This determination will directly impact how you create the rule.

You also want to determine your use case. What are you trying to accomplish with this automation? Consider the following options:

- Suppress noisy incidents (see [this article on handling false positives](false-positives.md#add-exceptions-by-using-automation-rules) instead)
- Triage new incidents by changing their status from New to Active and assigning an owner.
- Tag incidents to classify them.
- Escalate an incident by assigning a new owner.
- Close resolved incidents, specifying a reason and adding comments.
- Analyze the incident's contents (alerts, entities, and other properties) and take further action by calling a playbook.

### Determine the trigger

Do you want this automation to be activated when new incidents are created? Or any time an incident gets updated?

Automation rules are triggered **when an incident is created or updated** (the update trigger is now in **Preview**). Recall that incidents are created from alerts by analytics rules, of which there are several types, as explained in [Detect threats with built-in analytics rules in Microsoft Sentinel](detect-threats-built-in.md).

The following table shows the different possible ways that incidents can be created or updated that will cause an automation rule to run.

| Trigger type | Events that cause the rule to run |
| --------- | ------------ |
| **When incident is created** | - A new incident is created by an analytics rule.<br>- An incident is ingested from Microsoft 365 Defender.<br>- A new incident is created manually. |
| **When incident is updated**<br>(Preview) | - An incident's status is changed (closed/reopened/triaged).<br>- An incident's owner is assigned or changed.<br>- An incident's severity is raised or lowered.<br>- Alerts are added to an incident.<br>- Comments, tags, or tactics are added to an incident. |

## Create your automation rule

Most of the following instructions apply to any and all use cases for which you'll create automation rules.

- For the use case of suppressing noisy incidents, see [this article on handling false positives](false-positives.md#add-exceptions-by-using-automation-rules).
- For creating an automation rule that will apply to a single specific analytics rule, see [this article on configuring automated response in analytics rules](detect-threats-custom.md#set-automated-responses-and-create-the-rule).

1. From the **Automation** blade in the Microsoft Sentinel navigation menu, select **Create** from the top menu and choose **Automation rule**.

   :::image type="content" source="./media/create-manage-use-automation-rules/add-rule-automation.png" alt-text="Screenshot of creating a new automation rule in the Automation blade." lightbox="./media/create-manage-use-automation-rules/add-rule-automation.png":::

1. The **Create new automation rule** panel opens. Enter a name for your rule.

    :::image type="content" source="media/create-manage-use-automation-rules/create-automation-rule.png" alt-text="Screenshot of Create new automation rule wizard.":::

1. If you want the automation rule to take effect only on certain analytics rules, specify which ones by modifying the **If Analytics rule name** condition.

### Choose your trigger

From the **Trigger** drop-down, select **When incident is created** or **When incident is updated (Preview)** according to what you decided when designing your rule.

:::image type="content" source="media/create-manage-use-automation-rules/select-trigger.png" alt-text="Screenshot of selecting the incident create or incident update trigger.":::

### Add conditions

Add any other conditions you want this automation rule's activation to depend on. Select **+ Add condition** and choose conditions from the drop-down list. The list of conditions is populated by incident property and [entity property](entities-reference.md) fields.

1. Select a property from the first drop-down box on the left. You can begin typing any part of a property name in the search box to dynamically filter the list, so you can find what you're looking for quickly.
    :::image type="content" source="media/create-manage-use-automation-rules/filter-list.png" alt-text="Screenshot of typing in a search box to filter the list of choices.":::

1. Select an operator from the next drop-down box to the right.
    :::image type="content" source="media/create-manage-use-automation-rules/select-operator.png" alt-text="Screenshot of selecting a condition operator for automation rules.":::

    The list of operators you can choose from varies according to the selected trigger and property. Here's a summary of what's available:

    #### Conditions available with the create trigger

    | Property | Operator set |
    | -------- | -------- |
    | - Title<br>- Description<br>- Tag<br>- All listed entity properties | - Equals/Does not equal<br>- Contains/Does not contain<br>- Starts with/Does not start with<br>- Ends with/Does not end with |
    | - Severity<br>- Status<br>- Incident provider | - Equals/Does not equal |
    | - Tactics<br>- Alert product names | - Contains/Does not contain |

    #### Conditions available with the update trigger

    | Property | Operator set |
    | -------- | -------- |
    | - Title<br>- Description<br>- Tag<br>- All listed entity properties | - Equals/Does not equal<br>- Contains/Does not contain<br>- Starts with/Does not start with<br>- Ends with/Does not end with |
    | - Tag (in addition to above)<br>- Alerts<br>- Comments | - Added |
    | - Severity<br>- Status | - Equals/Does not equal<br>- Changed<br>- Changed from<br>- Changed to |
    | - Owner | - Changed |
    | - Incident provider<br>- Updated by | - Equals/Does not equal |
    | - Tactics | - Contains/Does not contain<br>- Added |
    | - Alert product names | - Contains/Does not contain |

1. Enter a value in the text box on the right. Depending on the property you chose, this might be a drop-down list from which you would select the values you choose. You might also be able to add several values by selecting the icon to the right of the text box (highlighted by the red arrow below).

    :::image type="content" source="media/create-manage-use-automation-rules/add-values-to-condition.png" alt-text="Screenshot of adding values to your condition in automation rules.":::

### Add actions

Choose the actions you want this automation rule to take. Available actions include **Assign owner**, **Change status**, **Change severity**, **Add tags**, and **Run playbook**. You can add as many actions as you like.

:::image type="content" source="media/create-manage-use-automation-rules/select-action.png" alt-text="Screenshot of list of actions to select in automation rule.":::

If you add a **Run playbook** action, you will be prompted to choose from the drop-down list of available playbooks. 

- Only playbooks that start with the **incident trigger** can be run from automation rules, so only they will appear in the list.

- <a name="explicit-permissions"></a>Microsoft Sentinel must be granted explicit permissions in order to run playbooks based on the incident trigger. If a playbook appears "grayed out" in the drop-down list, it means Sentinel does not have permission to that playbook's resource group. Click the **Manage playbook permissions** link to assign permissions.

    In the **Manage permissions** panel that opens up, mark the check boxes of the resource groups containing the playbooks you want to run, and click **Apply**.
        :::image type="content" source="./media/tutorial-respond-threats-playbook/manage-permissions.png" alt-text="Manage permissions":::

    You yourself must have **owner** permissions on any resource group to which you want to grant Microsoft Sentinel permissions, and you must have the **Logic App Contributor** role on any resource group containing playbooks you want to run.

- If you don't yet have a playbook that will take the action you have in mind, [create a new playbook](tutorial-respond-threats-playbook.md). You will have to exit the automation rule creation process and restart it after you have created your playbook.

### Finish creating your rule

1. Set an **expiration date** for your automation rule if you want it to have one.

1. Enter a number under **Order** to determine where in the sequence of automation rules this rule will run.

1. Click **Apply**. You're done!

## Audit automation rule activity

Find out what automation rules may have done to a given incident. You have a full record of incident chronicles available to you in the *SecurityIncident* table in the **Logs** blade. Use the following query to see all your automation rule activity:

```kusto
SecurityIncident
| where ModifiedBy contains "Automation"
```

## Automation rules execution

Automation rules are run sequentially, according to the order you determine. Each automation rule is executed after the previous one has finished its run. Within an automation rule, all actions are run sequentially in the order in which they are defined.

Playbook actions within an automation rule may be treated differently under some circumstances, according to the following criteria:

| Playbook run time | Automation rule advances to the next action... |
| ----------------- | --------------------------------------------------- |
| Less than a second | Immediately after playbook is completed |
| Less than two minutes | Up to two minutes after playbook began running,<br>but no more than 10 seconds after the playbook is completed |
| More than two minutes | Two minutes after playbook began running,<br>regardless of whether or not it was completed |

## Next steps

In this document, you learned how to use automation rules to manage your Microsoft Sentinel incidents queue and implement some basic incident-handling automation.

- To learn more about advanced automation options, see [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md).
- For help in implementing automation rules and playbooks, see [Tutorial: Use playbooks to automate threat responses in Microsoft Sentinel](tutorial-respond-threats-playbook.md).
