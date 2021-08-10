---
title: Automate incident handling in Azure Sentinel | Microsoft Docs
description: This article explains how to use automation rules to automate incident handling, in order to maximize your SOC's efficiency and effectiveness in response to security threats.
services: sentinel
cloud: na
documentationcenter: na
author: yelevin
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 03/14/2021
ms.author: yelevin
---
# Automate incident handling in Azure Sentinel with automation rules

This article explains what Azure Sentinel automation rules are, and how to use them to implement your Security Orchestration, Automation and Response (SOAR) operations, increasing your SOC's effectiveness and saving you time and resources.

> [!IMPORTANT]
>
> - The **automation rules** feature is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## What are automation rules?

Automation rules are a new concept in Azure Sentinel. This feature allows users to centrally manage the automation of incident handling. Besides letting you assign playbooks to incidents (not just to alerts as before), automation rules also allow you to automate responses for multiple analytics rules at once, automatically tag, assign, or close incidents without the need for playbooks, and control the order of actions that are executed. Automation rules will streamline automation use in Azure Sentinel and will enable you to simplify complex workflows for your incident orchestration processes.

## Components

Automation rules are made up of several components:

### Trigger

Automation rules are triggered by the creation of an incident. 

To review – incidents are created from alerts by analytics rules, of which there are several types, as explained in the tutorial [Detect threats with built-in analytics rules in Azure Sentinel](detect-threats-built-in.md).

### Conditions

Complex sets of conditions can be defined to govern when actions (see below) should run. These conditions are typically based on the states or values of attributes of incidents and their entities, and they can include `AND`/`OR`/`NOT`/`CONTAINS` operators.

### Actions

Actions can be defined to run when the conditions (see above) are met. You can define many actions in a rule, and you can choose the order in which they’ll run (see below). The following actions can be defined using automation rules, without the need for the [advanced functionality of a playbook](automate-responses-with-playbooks.md):

- Changing the status of an incident, keeping your workflow up to date.

  - When changing to “closed,” specifying the [closing reason](investigate-cases.md#closing-an-incident) and adding a comment. This helps you keep track of your performance and effectiveness, and fine-tune to reduce [false positives](false-positives.md).

- Changing the severity of an incident – you can reevaluate and reprioritize based on the presence, absence, values, or attributes of entities involved in the incident.

- Assigning an incident to an owner – this helps you direct types of incidents to the personnel best suited to deal with them, or to the most available personnel.

- Adding a tag to an incident – this is useful for classifying incidents by subject, by attacker, or by any other common denominator.

Also, you can define an action to [**run a playbook**](tutorial-respond-threats-playbook.md), in order to take more complex response actions, including any that involve external systems. **Only** playbooks activated by the [**incident trigger**](automate-responses-with-playbooks.md#azure-logic-apps-basic-concepts) are available to be used in automation rules. You can define an action to include multiple playbooks, or combinations of playbooks and other actions, and the order in which they will run.

### Expiration date

You can define an expiration date on an automation rule. The rule will be disabled after that date. This is useful for handling (that is, closing) "noise" incidents caused by planned, time-limited activities such as penetration testing.

### Order

You can define the order in which automation rules will run. Later automation rules will evaluate the conditions of the incident according to its state after being acted on by previous automation rules.

For example, if "First Automation Rule" changed an incident's severity from Medium to Low, and "Second Automation Rule" is defined to run only on incidents with Medium or higher severity, it won't run on that incident.

## Common use cases and scenarios

### Incident-triggered automation

Until now, only alerts could trigger an automated response, through the use of playbooks. With automation rules, incidents can now trigger automated response chains, which can include new incident-triggered playbooks ([special permissions are required](#permissions-for-automation-rules-to-run-playbooks)), when an incident is created. 

### Trigger playbooks for Microsoft providers

Automation rules provide a way to automate the handling of Microsoft security alerts by applying these rules to incidents created from the alerts. The automation rules can call playbooks ([special permissions are required](#permissions-for-automation-rules-to-run-playbooks)) and pass the incidents to them with all their details, including alerts and entities. In general, Azure Sentinel best practices dictate using the incidents queue as the focal point of security operations.

Microsoft security alerts include the following:

- Microsoft Cloud App Security (MCAS)
- Azure AD Identity Protection
- Azure Defender (ASC)
- Defender for IoT (formerly ASC for IoT)
- Microsoft Defender for Office 365 (formerly Office 365 ATP)
- Microsoft Defender for Endpoint (formerly MDATP)
- Microsoft Defender for Identity (formerly Azure ATP)

### Multiple sequenced playbooks/actions in a single rule

You can now have near-complete control over the order of execution of actions and playbooks in a single automation rule. You also control the order of execution of the automation rules themselves. This allows you to greatly simplify your playbooks, reducing them to a single task or a small, straightforward sequence of tasks, and combine these small playbooks in different combinations in different automation rules.

### Assign one playbook to multiple analytics rules at once

If you have a task you want to automate on all your analytics rules – say, the creation of a support ticket in an external ticketing system – you can apply a single playbook to any or all of your analytics rules – including any future rules – in one shot. This makes simple but repetitive maintenance and housekeeping tasks a lot less of a chore.

### Automatic assignment of incidents

You can assign incidents to the right owner automatically. If your SOC has an analyst who specializes in a particular platform, any incidents relating to that platform can be automatically assigned to that analyst.

### Incident suppression

You can use rules to automatically resolve incidents that are known false/benign positives without the use of playbooks. For example, when running penetration tests, doing scheduled maintenance or upgrades, or testing automation procedures, many false-positive incidents may be created that the SOC wants to ignore. A time-limited automation rule can automatically close these incidents as they are created, while tagging them with a descriptor of the cause of their generation.

### Time-limited automation

You can add expiration dates for your automation rules. There may be cases other than incident suppression that warrant time-limited automation. You may want to assign a particular type of incident to a particular user (say, an intern or a consultant) for a specific time frame. If the time frame is known in advance, you can effectively cause the rule to be disabled at the end of its relevancy, without having to remember to do so.

### Automatically tag incidents

You can automatically add free-text tags to incidents to group or classify them according to any criteria of your choosing.

## Automation rules execution

Automation rules are run sequentially, according to the order you determine. Each automation rule is executed after the previous one has finished its run. Within an automation rule, all actions are run sequentially in the order in which they are defined.

For playbook actions, there is a two-minute delay between the beginning of the playbook action and the next action on the list.

### Permissions for automation rules to run playbooks

When an Azure Sentinel automation rule runs a playbook, it uses a special Azure Sentinel service account specifically authorized for this action. The use of this account (as opposed to your user account) increases the security level of the service.

In order for an automation rule to run a playbook, this account must be granted explicit permissions to the resource group where the playbook resides. At that point, any automation rule will be able to run any playbook in that resource group.

When you're configuring an automation rule and adding a **run playbook** action, a drop-down list of playbooks will appear. Playbooks to which Azure Sentinel does not have permissions will show as unavailable ("grayed out"). You can grant Azure Sentinel permission to the playbooks' resource groups on the spot by selecting the **Manage playbook permissions** link.

#### Permissions in a multi-tenant architecture

Automation rules fully support cross-workspace and [multi-tenant deployments](extend-sentinel-across-workspaces-tenants.md#managing-workspaces-across-tenants-using-azure-lighthouse) (in the case of multi-tenant, using [Azure Lighthouse](../lighthouse/index.yml)).

Therefore, if your Azure Sentinel deployment uses a multi-tenant architecture, you can have an automation rule in one tenant run a playbook that lives in a different tenant, but permissions for Sentinel to run the playbooks must be defined in the tenant where the playbooks reside, not in the tenant where the automation rules are defined.

In the specific case of a Managed Security Service Provider (MSSP), where a service provider tenant manages an Azure Sentinel workspace in a customer tenant, there are two particular scenarios that warrant your attention:

- **An automation rule created in the customer tenant is configured to run a playbook located in the service provider tenant.** 

    This approach is normally used to protect intellectual property in the playbook. Nothing special is required for this scenario to work. When defining a playbook action in your automation rule, and you get to the stage where you grant Azure Sentinel permissions on the relevant resource group where the playbook is located (using the **Manage playbook permissions** panel), you'll see the resource groups belonging to the service provider tenant among those you can choose from. [See the whole process outlined here](tutorial-respond-threats-playbook.md#respond-to-incidents).

- **An automation rule created in the customer workspace (while signed into the service provider tenant) is configured to run a playbook located in the customer tenant**.

    This configuration is used when there is no need to protect intellectual property. For this scenario to work, permissions to execute the playbook need to be granted to Azure Sentinel in ***both tenants***. In the customer tenant, you grant them in the **Manage playbook permissions** panel, just like in the scenario above. To grant the relevant permissions in the service provider tenant, you need to add an additional Azure Lighthouse delegation that grants access rights to the **Azure Security Insights** app, with the **Azure Sentinel Automation Contributor** role, on the resource group where the playbook resides.

    The scenario looks like this:

    :::image type="content" source="./media/automate-incident-handling-with-automation-rules/automation-rule-multi-tenant.png" alt-text="Multi-tenant automation rule architecture":::

    See [our instructions](tutorial-respond-threats-playbook.md#permissions-to-run-playbooks) for setting this up.

## Creating and managing automation rules

You can create and manage automation rules from different points in the Azure Sentinel experience, depending on your particular need and use case.

- **Automation blade**

    Automation rules can be centrally managed in the new **Automation** blade (which replaces the **Playbooks** blade), under the **Automation rules** tab. (You can also now manage playbooks in this blade, under the **Playbooks** tab.) From there, you can create new automation rules and edit the existing ones. You can also drag automation rules to change the order of execution, and enable or disable them.

    In the **Automation** blade, you see all the rules that are defined on the workspace, along with their status (Enabled/Disabled) and which analytics rules they are applied to.

    When you need an automation rule that will apply to many analytics rules, create it directly in the **Automation** blade. From the top menu, click **Create** and **Add new rule**, which opens the **Create new automation rule** panel. From here you have complete flexibility in configuring the rule: you can apply it to any analytics rules (including future ones) and define the widest range of conditions and actions.

- **Analytics rule wizard**

    In the **Automated response** tab of the analytics rule wizard, you can see, manage, and create automation rules that apply to the particular analytics rule being created or edited in the wizard.

    When you click **Create** and one of the rule types (**Scheduled query rule** or **Microsoft incident creation rule**) from the top menu in the **Analytics** blade, or if you select an existing analytics rule and click **Edit**, you'll open the rule wizard. When you select the **Automated response** tab, you will see a section called **Incident automation**, under which the automation rules that currently apply to this rule will be displayed. You can select an existing automation rule to edit, or click **Add new** to create a new one.

    You'll notice that when you create the automation rule from here, the **Create new automation rule** panel shows the **analytics rule** condition as unavailable, because this rule is already set to apply only to the analytics rule you're editing in the wizard. All the other configuration options are still available to you.

- **Incidents blade**

    You can also create an automation rule from the **Incidents** blade, in order to respond to a single, recurring incident. This is useful when creating a [suppression rule](#incident-suppression) for automatically closing "noisy" incidents. Select an incident from the queue and click **Create automation rule** from the top menu.

    You'll notice that the **Create new automation rule** panel has populated all the fields with values from the incident. It names the rule the same name as the incident, applies it to the analytics rule that generated the incident, and uses all the available entities in the incident as conditions of the rule. It also suggests a suppression (closing) action by default, and suggests an expiration date for the rule. You can add or remove conditions and actions, and change the expiration date, as you wish.

## Auditing automation rule activity

You may be interested in knowing what happened to a given incident, and what a certain automation rule may or may not have done to it. You have a full record of incident chronicles available to you in the *SecurityIncident* table in the **Logs** blade. Use the following query to see all your automation rule activity:

```kusto
SecurityIncident
| where ModifiedBy contains "Automation"
```

## Next steps

In this document, you learned how to use automation rules to manage your Azure Sentinel incidents queue and implement some basic incident-handling automation.

- To learn more about advanced automation options, see [Automate threat response with playbooks in Azure Sentinel](automate-responses-with-playbooks.md).
- For help in implementing automation rules and playbooks, see [Tutorial: Use playbooks to automate threat responses in Azure Sentinel](tutorial-respond-threats-playbook.md).
