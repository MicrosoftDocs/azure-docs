---
title: Migrate your Microsoft Sentinel alert-trigger playbooks to automation rules | Microsoft Docs
description: This article explains how (and why) to take your existing playbooks built on the alert trigger and migrate them from being invoked by analytics rules to being invoked by automation rules.
ms.topic: how-to
author: batamig
ms.author: bagol
ms.date: 03/14/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#customerIntent: As a SOC engineer, I want to understand how to migrate alert-trigger playbooks to automation rules, and why I might want to do so.
---

# Migrate your Microsoft Sentinel alert-trigger playbooks to automation rules

We recommend that you migrate existing playbooks built on alert triggers and migrate them from being invoked by **analytics rules** to being invoked by **automation rules**. This article explains why we recommend this action, and how to migrate your playbooks.

- If you're migrating a playbook that's used by only one analytics rule, follow the instructions under [Create an automation rule from an analytics rule](#create-an-automation-rule-from-an-analytics-rule).

- If you’re migrating a playbook that's used by multiple analytics rules, follow the instructions under [Create a new automation rule from the Automation page](#create-a-new-automation-rule-from-the-automation-page).

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

## Why migrate

Playbooks that are invoked by automation rules instead of analytics rules have the following advantages:

- Automation management from a single display, regardless of type (“single pane of glass”).

- Use a single automation rule triggering playbooks for multiple analytics rules, instead of configuring each analytics rule separately.

- Define the order in which alert playbooks are to be executed.

- Support for scenarios that set an expiration date for running a playbook.

Migrating your playbook trigger doesn't change the playbook at all, and only changes the mechanism that invokes the playbook to run changes.

The ability to invoke playbooks from analytics rules will be **deprecated effective March 2026**. Until then, playbooks already defined as from analytics rules will continue to run, but as of **June 2023** you can no longer add playbooks to the list of those invoked from analytics rules. The only remaining option is to invoke them from automation rules.

## Prerequisites

You'll need the:

- **Logic Apps Contributor** role to create and edit playbooks

- **Microsoft Sentinel Contributor** role to attach a playbook to an automation rule

For more information, see [Microsoft Sentinel playbook prerequisites](automate-responses-with-playbooks.md#prerequisites).

## Create an automation rule from an analytics rule

Use this procedure if you're migrating a playbook that's used by only one analytics rule. Otherwise, use [Create a new automation rule from the Automation page](#create-a-new-automation-rule-from-the-automation-page).

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), select the **Configuration** > **Analytics** page. For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Configuration** > **Analytics**.

1. Under **Active rules**, find an analytics rule already configured to run a playbook, and select **Edit**.

    :::image type="content" source="../media/migrate-playbooks-to-automation-rules/find-analytics-rule.png" alt-text="Screenshot of finding and selecting an analytics rule.":::

1. Select the **Automated response** tab. Playbooks directly configured to run from this analytics rule can be found under **Alert automation (classic)**. Notice the warning about deprecation.

    :::image type="content" source="../media/migrate-playbooks-to-automation-rules/see-playbooks.png" alt-text="Screenshot of automation rules and playbooks screen.":::

1. In the upper half of the screen, select **+ Add new** under **Automation rules** to create a new automation rule.

1. In the **Create new automation rule** panel, under **Trigger**, select **When alert is created**.

    :::image type="content" source="../media/migrate-playbooks-to-automation-rules/select-trigger.png" alt-text="Screenshot of creating automation rule in analytics rule screen.":::

1. Under **Actions**, see that the **Run playbook** action, being the only type of action available, is automatically selected and grayed out. Select your playbook from those available in the drop-down list in the line below.

    :::image type="content" source="../media/migrate-playbooks-to-automation-rules/select-playbook.png" alt-text="Screenshot of selecting playbook as action in automation rule wizard.":::

1. Select **Apply**. The new rule shows in the automation rules grid.

1. Remove the playbook from the **Alert automation (classic)** section.

1. **Review and update** the analytics rule to save your changes.

## Create a new automation rule from the Automation page

Use this procedure if you’re migrating a playbook that's used by multiple analytics rules. Otherwise, use [Create an automation rule from an analytics rule](#create-an-automation-rule-from-an-analytics-rule)

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), select the **Configuration** > **Analytics** page. For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Configuration** > **Analytics**.

1. From the top menu bar, select **Create -> Automation rule**.

1. In the **Create new automation rule** panel, in the **Trigger** drop-down, select **When alert is created**.

1. Under **Conditions**, select the analytics rules you want to run a particular playbook or a set of playbooks on.

1. Under **Actions**, for each playbook you want this rule to invoke, select **+ Add action**. The **Run playbook** action is automatically selected and grayed out. 

1. Select from the list of available playbooks in the drop-down list in the line below. Order the actions according to the order in which you want the playbooks to run by selecting the up/down arrows next to each action.

1. Select **Apply** to save the automation rule.

1. Edit the analytics rule or rules that invoked these playbooks (the rules you specified under **Conditions**), removing the playbook from the **Alert automation (classic)** section of the **Automated response** tab.

## Related content

For more information, see:

- [Automate threat response in Microsoft Sentinel with automation rules](../automate-incident-handling-with-automation-rules.md)
- [Authenticate playbooks to Microsoft Sentinel](authenticate-playbooks-to-sentinel.md)
- [Create and manage Microsoft Sentinel playbooks](create-playbooks.md)
