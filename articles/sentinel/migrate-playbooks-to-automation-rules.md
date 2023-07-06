---
title: Migrate your Microsoft Sentinel alert-trigger playbooks to automation rules | Microsoft Docs
description: This article explains how (and why) to take your existing playbooks built on the alert trigger and migrate them from being invoked by analytics rules to being invoked by automation rules.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 05/09/2023
---

# Migrate your Microsoft Sentinel alert-trigger playbooks to automation rules

This article explains how (and why) to take your existing playbooks built on the alert trigger and migrate them from being invoked by **analytics rules** to being invoked by **automation rules**.

## Why migrate

If you have already created and built playbooks to respond to alerts (rather than incidents), and attached them to analytics rules, we strongly encourage you to move these playbooks to automation rules. Doing so will give you the following advantages:
- Manage all your automations from a single display, regardless of type<br>(“single pane of glass”).

- Define a single automation rule that can trigger playbooks for multiple analytics rules, instead of configuring each analytics rule independently.

- Define the order in which alert playbooks will be executed.

- Support scenarios that set an expiration date for running a playbook.

It's important to understand that the playbook itself won't change at all. Only the mechanism that invokes it to run will change.

Finally, the ability to invoke playbooks from analytics rules will be **deprecated effective March 2026**. Until then, playbooks already defined to be invoked from analytics rules will continue to run, but as of **June 2023** you can no longer add playbooks to the list of those invoked from analytics rules. The only remaining option is to invoke them from automation rules.

## How to migrate

- If you’re migrating a playbook that's used by only one analytics rule, follow the instructions under [Create an automation rule from an analytics rule](#create-an-automation-rule-from-an-analytics-rule).

- If you’re migrating a playbook that's used by more than one analytics rule, follow the instructions under [Create a new automation rule from the Automation portal](#create-a-new-automation-rule-from-the-automation-portal).

### Create an automation rule from an analytics rule

1. From the main navigation menu, select **Analytics**.

1. Under **Active rules**, find an analytics rule already configured to run a playbook.

1. Select **Edit**.

    :::image type="content" source="media/migrate-playbooks-to-automation-rules/find-analytics-rule.png" alt-text="Screenshot of finding and selecting an analytics rule.":::

1. Select the **Automated response** tab.

1. Playbooks directly configured to run from this analytics rule can be found under **Alert automation (classic)**. Notice the warning about deprecation.

    :::image type="content" source="media/migrate-playbooks-to-automation-rules/see-playbooks.png" alt-text="Screenshot of automation rules and playbooks screen.":::

1. Select **+ Add new** under **Automation rules** (in the upper half of the screen) to create a new automation rule.

1. In the **Create new automation rule** panel, under **Trigger**, select **When alert is created**.

    :::image type="content" source="media/migrate-playbooks-to-automation-rules/select-trigger.png" alt-text="Screenshot of creating automation rule in analytics rule screen.":::

1. Under **Actions**, see that the **Run playbook** action, being the only type of action available, is automatically selected and grayed out. Select your playbook from those available in the drop-down list in the line below.

    :::image type="content" source="media/migrate-playbooks-to-automation-rules/select-playbook.png" alt-text="Screenshot of selecting playbook as action in automation rule wizard.":::

1. Click **Apply**. You will now see the new rule in the automation rules grid.

1. Remove the playbook from the **Alert automation (classic)** section.

1. **Review and update** the analytics rule to save your changes.

### Create a new automation rule from the Automation portal

1. From the main navigation menu, select **Automation**.

1. From the top menu bar, select **Create -> Automation rule**.

1. In the **Create new automation rule** panel, in the **Trigger** drop-down, select **When alert is created**.

1. Under **Conditions**, select the analytics rules you want to run a particular playbook or a set of playbooks on.

1. Under **Actions**, for each playbook you want this rule to invoke, select **+ Add action**. The **Run playbook** action will be automatically selected and grayed out. Select from the list of available playbooks in the drop-down list in the line below. Order the actions according to the order in which you want the playbooks to run. You can change the order of actions by selecting the up/down arrows next to each action.

1. Select **Apply** to save the automation rule.

1. Edit the analytics rule or rules that invoked these playbooks (the rules you specified under **Conditions**), removing the playbook from the **Alert automation (classic)** section of the **Automated response** tab.

## Next steps
In this document, you learned how to migrate playbooks based on the alert trigger from analytics rules to automation rules.

- To learn more about automation rules, see [Automate threat response in Microsoft Sentinel with automation rules](automate-incident-handling-with-automation-rules.md)
- To create automation rules, see [Create and use Microsoft Sentinel automation rules to manage response](create-manage-use-automation-rules.md)
- To learn more about advanced automation options, see [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md).
- For help with implementing automation rules and playbooks, see [Tutorial: Use playbooks to automate threat responses in Microsoft Sentinel](tutorial-respond-threats-playbook.md).
