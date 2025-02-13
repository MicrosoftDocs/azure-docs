---
title: Automate threat response in Microsoft Sentinel with automation rules | Microsoft Docs
description: This article explains what Microsoft Sentinel automation rules are, and how to use them to implement your Security Orchestration, Automation and Response (SOAR) operations. Automation rules increase your SOC's effectiveness and save you time and resources.
author: batamig
ms.author: bagol
ms.topic: conceptual
ms.date: 10/16/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security



#Customer intent: As a SOC analyst, I want to automate incident response tasks using automation rules so that I can streamline threat management and improve operational efficiency.

---

# Automate threat response in Microsoft Sentinel with automation rules

This article explains what Microsoft Sentinel automation rules are, and how to use them to implement your Security Orchestration, Automation and Response (SOAR) operations. Automation rules increase your SOC's effectiveness and save you time and resources.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## What are automation rules?

Automation rules are a way to centrally manage automation in Microsoft Sentinel, by allowing you to define and coordinate a small set of rules that can apply across different scenarios.

Automation rules apply to the following categories of use cases:

- Perform basic automation tasks for incident handling without using playbooks. For example:
    - [Add incident tasks](incident-tasks.md) for analysts to follow.
    - Suppress noisy incidents.
    - Triage new incidents by changing their status from New to Active and assigning an owner.
    - Tag incidents to classify them.
    - Escalate an incident by assigning a new owner.
    - Close resolved incidents, specifying a reason and adding comments.

- Automate responses for multiple analytics rules at once.

- Control the order of actions that are executed.

- Inspect the contents of an incident (alerts, entities, and other properties) and take further action by calling a playbook.

- Automation rules can also be the mechanism by which you run a playbook in response to an **alert** *not associated with an incident*.

In short, automation rules streamline the use of automation in Microsoft Sentinel, enabling you to simplify complex workflows for your threat response orchestration processes.

## Components

Automation rules are made up of several components:

- **[Triggers](#triggers)** that define what kind of incident event causes the rule to run, subject to **conditions**.
- **[Conditions](#conditions)** that determine the exact circumstances under which the rule runs and performs **actions**.
- **[Actions](#actions)** to change the incident in some way or call a [playbook](automate-responses-with-playbooks.md), which performs more complex actions and interacts with other services.

### Triggers

Automation rules are triggered **when an incident is created or updated** or **when an alert is created**. Recall that incidents include alerts, and that both alerts and incidents can be created by analytics rules, as explained in [Threat detection in Microsoft Sentinel](threat-detection.md).

The following table shows the different possible scenarios that cause an automation rule to run.

| Trigger type | Events that cause the rule to run |
| --------- | ------------ |
| **When incident is created** | **Microsoft Defender portal:**<li>A new incident is created in the Microsoft Defender portal.<br><br>**Microsoft Sentinel not onboarded to the Defender portal:**<li>A new incident is created by an analytics rule.<li>An incident is ingested from Microsoft Defender XDR.<li>A new incident is created manually. |
| **When incident is updated** | <li>An incident's status is changed (closed/reopened/triaged).<li>An incident's owner is assigned or changed.<li>An incident's severity is raised or lowered.<li>Alerts are added to an incident.<li>Comments, tags, or tactics are added to an incident. |
| **When alert is created** | <li>An alert is created by a Microsoft Sentinel **Scheduled** or **NRT** analytics rule. |

#### Incident-based or alert-based automation?

With automation rules centrally handling the response to both incidents and alerts, how should you choose which to automate, and in which circumstances?

For most use cases, **incident-triggered automation** is the preferable approach. In Microsoft Sentinel, an **incident** is a “case file” – an aggregation of all the relevant evidence for a specific investigation. It’s a container for alerts, entities, comments, collaboration, and other artifacts. Unlike **alerts** which are single pieces of evidence, incidents are modifiable, have the most updated status, and can be enriched with comments, tags, and bookmarks. The incident allows you to track the attack story that keeps evolving with the addition of new alerts. 

For these reasons, it makes more sense to build your automation around incidents. So the most appropriate way to create playbooks is to base them on the Microsoft Sentinel incident trigger in Azure Logic Apps.

The main reason to use **alert-triggered automation** is for responding to alerts generated by analytics rules that *do not create incidents* (that is, where incident creation is *disabled* in the **Incident settings** tab of the [analytics rule wizard](detect-threats-custom.md#configure-the-incident-creation-settings)).

This reason is especially relevant when your Microsoft Sentinel workspace is onboarded to the Defender portal. In this scenario, all incident creation happens in the Defender portal, and therefore the incident creation rules in Microsoft Sentinel *must be disabled*.

Even without being onboarded to the unified portal, you might anyway decide to use alert-triggered automation if you want to use other external logic to decide if and when to create incidents from alerts, and how alerts are grouped together. For example:

- A playbook, triggered by an alert that doesn’t have an associated incident, can enrich the alert with information from other sources, and based on some external logic decide whether to create an incident or not.

- A playbook, triggered by an alert, can, instead of creating an incident, look for an appropriate existing incident to add the alert to. Learn more about [incident expansion](relate-alerts-to-incidents.md).

- A playbook, triggered by an alert, can notify SOC personnel of the alert so the team can decide whether or not to create an incident.

- A playbook, triggered by an alert, can send the alert to an external ticketing system for incident creation and management, and that system creates a new ticket for each alert.

> [!NOTE]
> - Alert-triggered automation is available only for alerts created by [**Scheduled**, **NRT**, and **Microsoft security** analytics rules](threat-detection.md).
>
> - Alert-triggered automation for alerts created by Microsoft Defender XDR is not available in the Defender portal. For more information, see [Automation in the Defender portal](automation.md#automation-with-the-unified-security-operations-platform).

### Conditions

Complex sets of conditions can be defined to govern when actions (see below) should run. These conditions include the event that triggers the rule (incident created or updated, or alert created), the states or values of the incident's properties and [entity properties](#supported-entity-properties) (for incident trigger only), and also the analytics rule or rules that generated the incident or alert.

When an automation rule is triggered, it checks the triggering incident or alert against the conditions defined in the rule. For incidents, the property-based conditions are evaluated according to **the current state** of the property at the moment the evaluation occurs, or according to **changes in the state** of the property (see below for details). Since a single incident creation or update event could trigger several automation rules, the **order** in which they run (see below) makes a difference in determining the outcome of the conditions' evaluation. The **actions** defined in the rule are executed only if all the conditions are satisfied.

#### Incident create trigger

For rules defined using the trigger **When an incident is created**, you can define conditions that check the **current state** of the values of a given list of incident properties, using one or more of the following operators:

- **equals** or **does not equal** the value defined in the condition.
- **contains** or **does not contain** the value defined in the condition.
- **starts with** or **does not start with** the value defined in the condition.
- **ends with** or **does not end with** the value defined in the condition.

For example, if you define **Analytic rule name** as **Contains == Brute force attack against a Cloud PC**, an analytic rule with the **Brute force attack against Azure portal** doesn't meet the condition. However, if you define **Analytic rule name** as **Does not contain == User credentials**, then both the **Brute force attack against a Cloud PC** and **Brute force against Azure portal** analytics rules meet the condition.

> [!NOTE]
> The **current state** in this context refers to the moment the condition is evaluated - that is, the moment the automation rule runs. If more than one automation rule is defined to run in response to the creation of this incident, then changes made to the incident by an earlier-run automation rule are considered the current state for later-run rules.
>

#### Incident update trigger

The conditions evaluated in rules defined using the trigger **When an incident is updated** include all of those listed for the incident creation trigger. But the update trigger includes more properties that can be evaluated.

One of these properties is **Updated by**. This property lets you track the type of source that made the change in the incident. You can create a condition evaluating whether the incident was updated by one of the following values, depending on whether you onboarded your workspace to the Defender portal:

##### [Onboarded workspaces](#tab/onboarded)

- An application, including applications in both the Azure and Defender portals.
- A user, including changes made by users in both the Azure and Defender portals.
- **AIR**, for updates by [automated investigation and response in Microsoft Defender for Office 365](/microsoft-365/security/office-365-security/air-about)
- An alert grouping (that added alerts to the incident), including alert groupings that were done both by analytics rules and built-in Microsoft Defender XDR correlation logic
- A playbook
- An automation rule
- Other, if none of the above values apply

##### [Workspaces not onboarded](#tab/not-onboarded)

- An application
- A Microsoft Sentinel user
- An alert grouping done by analytics rules (that added alerts to the incident). 
- A playbook
- An automation rule
- Microsoft Defender XDR

---

Using this condition, for example, you can instruct this automation rule to run on any change made to an incident, except if it was made by another automation rule.

More to the point, the update trigger also uses other operators that check **state changes** in the values of incident properties as well as their current state. A **state change** condition would be satisfied if:

An incident property's value was
- **changed** (regardless of the actual value before or after).
- **changed from** the value defined in the condition.
- **changed to** the value defined in the condition.
- **added** to (this applies to properties with a list of values).

#### *Tag* property: individual vs. collection

The incident property **Tag** is a collection of individual items&mdash;a single incident can have multiple tags applied to it. You can define conditions that check **each tag in the collection individually**, and conditions that check **the collection of tags as a unit**.

- **Any individual tag** operators check the condition against every tag in the collection. The evaluation is *true* when *at least one tag* satisfies the condition.
- **Collection of all tags** operators check the condition against the collection of tags as a single unit. The evaluation is *true* only if *the collection as a whole* satisfies the condition.

This distinction matters when your condition is a negative (does not contain), and some tags in the collection satisfy the condition and others don't.

Let's look at an example where your condition is, **Tag does not contain "2024"**, and you have two incidents, each with two tags:

| \ Incidents &#9654;<br>Condition &#9660; \ | Incident 1<br>Tag 1: 2024<br>Tag 2: 2023 | Incident 2<br>Tag 1: 2023<br>Tag 2: 2022 |
| -------------------------------------- | :------------------------: | :------------------------: |
| **Any individual tag<br>does not contain "2024"** | ***TRUE***      | TRUE                       |
| **Collection of all tags<br>does not contain "2024"** | ***FALSE*** | TRUE                       |

In this example, in *Incident 1*: 
- If the condition checks each tag individually, then since there's at least one tag that *satisfies the condition* (that *doesn't* contain "2024"), the overall condition is **true**.
- If the condition checks all the tags in the incident as a single unit, then since there's at least one tag that *doesn't satisfy the condition* (that *does* contain "2024"), the overall condition is **false**.

In *Incident 2*, the outcome is the same, regardless of which type of condition is defined.

#### Supported entity properties

For the list of entity properties supported as conditions for automation rules, see [Microsoft Sentinel automation rules reference](automation-rule-reference.md).

#### Alert create trigger

Currently the only condition that can be configured for the alert creation trigger is the set of analytics rules for which the automation rule is run.

### Actions

Actions can be defined to run when the conditions (see above) are met. You can define many actions in a rule, and you can choose the order in which they run (see below). The following actions can be defined using automation rules, without the need for the [advanced functionality of a playbook](automate-responses-with-playbooks.md):

- Adding a task to an incident – you can create a [checklist of tasks for analysts to follow](incident-tasks.md) throughout the processes of triage, investigation, and remediation of the incident, to ensure that no critical steps are missed.

- Changing the status of an incident, keeping your workflow up to date.

  - When changing to “closed,” specifying the [closing reason](investigate-cases.md#close-an-incident) and adding a comment. This helps you keep track of your performance and effectiveness, and fine-tune to reduce [false positives](false-positives.md).

- Changing the severity of an incident – you can reevaluate and reprioritize based on the presence, absence, values, or attributes of entities involved in the incident.

- Assigning an incident to an owner – this helps you direct types of incidents to the personnel best suited to deal with them, or to the most available personnel.

- Adding a tag to an incident – this is useful for classifying incidents by subject, by attacker, or by any other common denominator.

Also, you can define an action to [**run a playbook**](tutorial-respond-threats-playbook.md), in order to take more complex response actions, including any that involve external systems. The playbooks available to be used in an automation rule depend on the [**trigger**](automate-responses-with-playbooks.md#azure-logic-apps-basic-concepts) on which the playbooks *and* the automation rule are based: Only incident-trigger playbooks can be run from incident-trigger automation rules, and only alert-trigger playbooks can be run from alert-trigger automation rules. You can define multiple actions that call playbooks, or combinations of playbooks and other actions.  Actions are executed in the order in which they are listed in the rule.

Playbooks using [either version of Azure Logic Apps (Standard or Consumption)](automate-responses-with-playbooks.md#logic-app-types) are available to run from automation rules.

### Expiration date

You can define an expiration date on an automation rule. The rule is disabled after that date passes. This is useful for handling (that is, closing) "noise" incidents caused by planned, time-limited activities such as penetration testing.

### Order

You can define the order in which automation rules are run. Later automation rules evaluate the conditions of the incident according to its state after being acted on by previous automation rules.

For example, if "First Automation Rule" changed an incident's severity from Medium to Low, and "Second Automation Rule" is defined to run only on incidents with Medium or higher severity, it doesn't run on that incident.

The order of automation rules that add [incident tasks](incident-tasks.md) determines the order in which the tasks appear in a given incident.

Rules based on the update trigger have their own separate order queue. If such rules are triggered to run on a just-created incident (by a change made by another automation rule), they run only after all the applicable rules based on the create trigger are finished running.

#### Notes on execution order and priority

- Setting the **order** number in automation rules determines their order of execution.
- Each trigger type maintains its own queue.
- For rules created in the Azure portal, the **order** field is automatically populated with the number following the highest number used by existing rules of the same trigger type.
- However, for rules created in other ways (command line, API, etc.), the **order** number must be assigned manually.
- There is no validation mechanism that prevents multiple rules from having the same order number, even within the same trigger type. 
- You can allow two or more rules of the same trigger type to have the same order number, if you don't care which order they run in.
- For rules of the same trigger type with the same order number, the execution engine randomly selects which rules run in which order.
- For rules of different *incident trigger* types, all applicable rules with the *incident creation* trigger type run first (according to their order numbers), and only then the rules with the *incident update* trigger type (according to *their* order numbers).
- Rules always run sequentially, never in parallel.

> [!NOTE]
> After onboarding to the Defender portal, if multiple changes are made to the same incident in a five to ten minute period, a single update is sent to Microsoft Sentinel, with only the most recent change.

## Common use cases and scenarios

### Incident tasks

Automation rules allow you to standardize and formalize the steps required for the triaging, investigation, and remediation of incidents, by [creating tasks](incident-tasks.md) that can be applied to a single incident, across groups of incidents, or to all incidents, according to the conditions you set in the automation rule and the threat detection logic in the underlying analytics rules. Tasks applied to an incident appear in the incident's page, so your analysts have the entire list of actions they need to take, right in front of them, and don't miss any critical steps.

### Incident- and alert-triggered automation

Automation rules can be triggered by the creation or updating of incidents and also by the creation of alerts. These occurrences can all trigger automated response chains, which can include playbooks ([special permissions are required](#permissions-for-automation-rules-to-run-playbooks)). 

### Trigger playbooks for Microsoft providers

Automation rules provide a way to automate the handling of Microsoft security alerts by applying these rules to incidents created from the alerts. The automation rules can call playbooks ([special permissions are required](#permissions-for-automation-rules-to-run-playbooks)) and pass the incidents to them with all their details, including alerts and entities. In general, Microsoft Sentinel best practices dictate using the incidents queue as the focal point of security operations.

Microsoft security alerts include the following:

- Microsoft Entra ID Protection
- Microsoft Defender for Cloud
- Microsoft Defender for Cloud Apps
- Microsoft Defender for Office 365
- Microsoft Defender for Endpoint
- Microsoft Defender for Identity
- Microsoft Defender for IoT

### Multiple sequenced playbooks/actions in a single rule

You can now have near-complete control over the order of execution of actions and playbooks in a single automation rule. You also control the order of execution of the automation rules themselves. This allows you to greatly simplify your playbooks, reducing them to a single task or a small, straightforward sequence of tasks, and combine these small playbooks in different combinations in different automation rules.

### Assign one playbook to multiple analytics rules at once

If you have a task you want to automate on all your analytics rules – say, the creation of a support ticket in an external ticketing system – you can apply a single playbook to any or all of your analytics rules – including any future rules – in one shot. This makes simple but repetitive maintenance and housekeeping tasks a lot less of a chore.

### Automatic assignment of incidents

You can assign incidents to the right owner automatically. If your SOC has an analyst who specializes in a particular platform, any incidents relating to that platform can be automatically assigned to that analyst.

### Incident suppression

You can use rules to automatically resolve incidents that are known false/benign positives without the use of playbooks. For example, when running penetration tests, doing scheduled maintenance or upgrades, or testing automation procedures, many false-positive incidents might be created that the SOC wants to ignore. A time-limited automation rule can automatically close these incidents as they are created, while tagging them with a descriptor of the cause of their generation.

### Time-limited automation

You can add expiration dates for your automation rules. There might be cases other than incident suppression that warrant time-limited automation. You might want to assign a particular type of incident to a particular user (say, an intern or a consultant) for a specific time frame. If the time frame is known in advance, you can effectively cause the rule to be disabled at the end of its relevancy, without having to remember to do so.

### Automatically tag incidents

You can automatically add free-text tags to incidents to group or classify them according to any criteria of your choosing.

## Use cases added by update trigger

Now that changes made to incidents can trigger automation rules, more scenarios are open to automation. 

### Extend automation when incident evolves

You can use the update trigger to apply many of the above use cases to incidents as their investigation progresses and analysts add alerts, comments, and tags. Control alert grouping in incidents.

### Update orchestration and notification

Notify your various teams and other personnel when changes are made to incidents, so they don't miss any critical updates. Escalate incidents by assigning them to new owners and informing the new owners of their assignments. Control when and how incidents are reopened.

### Maintain synchronization with external systems

If you used playbooks to create tickets in external systems when incidents are created, you can use an update-trigger automation rule to call a playbook that updates those tickets.

## Automation rules execution

Automation rules are run sequentially, according to the [order](#order) you [determine](create-manage-use-automation-rules.md#finish-creating-your-rule). Each automation rule is executed after the previous one has finished its run. Within an automation rule, all actions are run sequentially in the order in which they are defined.

Playbook actions within an automation rule might be treated differently under some circumstances, according to the following criteria:

| Playbook run time | Automation rule advances to the next action... |
| ----------------- | --------------------------------------------------- |
| Less than a second | Immediately after playbook is completed |
| Less than two minutes | Up to two minutes after playbook began running,<br>but no more than 10 seconds after the playbook is completed |
| More than two minutes | Two minutes after playbook began running,<br>regardless of whether or not it was completed |

### Permissions for automation rules to run playbooks

When a Microsoft Sentinel automation rule runs a playbook, it uses a special Microsoft Sentinel service account specifically authorized for this action. The use of this account (as opposed to your user account) increases the security level of the service.

In order for an automation rule to run a playbook, this account must be granted explicit permissions to the resource group where the playbook resides. At that point, any automation rule can run any playbook in that resource group.

When you're configuring an automation rule and adding a **run playbook** action, a drop-down list of playbooks appears. Playbooks to which Microsoft Sentinel does not have permissions display as unavailable ("grayed out"). You can grant Microsoft Sentinel permission to the playbooks' resource groups on the spot by selecting the **Manage playbook permissions** link. To grant those permissions, you need **Owner** permissions on those resource groups. [See the full permissions requirements](tutorial-respond-threats-playbook.md#respond-to-incidents).

#### Permissions in a multitenant architecture

Automation rules fully support cross-workspace and [multitenant deployments](extend-sentinel-across-workspaces-tenants.md#manage-workspaces-across-tenants-using-azure-lighthouse) (in the case of multitenant, using [Azure Lighthouse](/azure/lighthouse/)).

Therefore, if your Microsoft Sentinel deployment uses a multitenant architecture, you can have an automation rule in one tenant run a playbook that lives in a different tenant, but permissions for Sentinel to run the playbooks must be defined in the tenant where the playbooks reside, not in the tenant where the automation rules are defined.

In the specific case of a Managed Security Service Provider (MSSP), where a service provider tenant manages a Microsoft Sentinel workspace in a customer tenant, there are two particular scenarios that warrant your attention:

- **An automation rule created in the customer tenant is configured to run a playbook located in the service provider tenant.** 

    This approach is normally used to protect intellectual property in the playbook. Nothing special is required for this scenario to work. When defining a playbook action in your automation rule, and you get to the stage where you grant Microsoft Sentinel permissions on the relevant resource group where the playbook is located (using the **Manage playbook permissions** panel), you can see the resource groups belonging to the service provider tenant among those you can choose from. [See the whole process outlined here](tutorial-respond-threats-playbook.md#respond-to-incidents).

- **An automation rule created in the customer workspace (while signed into the service provider tenant) is configured to run a playbook located in the customer tenant**.

    This configuration is used when there is no need to protect intellectual property. For this scenario to work, permissions to execute the playbook need to be granted to Microsoft Sentinel in ***both tenants***. In the customer tenant, you grant them in the **Manage playbook permissions** panel, just like in the scenario above. To grant the relevant permissions in the service provider tenant, you need to add an additional Azure Lighthouse delegation that grants access rights to the **Azure Security Insights** app, with the **Microsoft Sentinel Automation Contributor** role, on the resource group where the playbook resides.

    The scenario looks like this:

    :::image type="content" source="./media/automate-incident-handling-with-automation-rules/automation-rule-multi-tenant.png" alt-text="Multi-tenant automation rule architecture":::

    See [our instructions](automation/run-playbooks.md#configure-playbook-permissions-for-incidents-in-a-multitenant-deployment) for setting this up.

## Creating and managing automation rules

You can [create and manage automation rules](create-manage-use-automation-rules.md) from different areas in Microsoft Sentinel or the Defender portal, depending on your particular need and use case.

- **Automation page**

    Automation rules can be centrally managed in the **Automation** page, under the **Automation rules** tab. From there, you can create new automation rules and edit the existing ones. You can also drag automation rules to change the order of execution, and enable or disable them.

    In the **Automation** page, you see all the rules that are defined on the workspace, along with their status (Enabled/Disabled) and which analytics rules they are applied to.

    When you need an automation rule that applies to incidents from Microsoft Defender XDR, or from many analytics rules in Microsoft Sentinel, create it directly in the **Automation** page.

- **Analytics rule wizard**

    In the **Automated response** tab of the Microsoft Sentinel analytics rule wizard, under **Automation rules**, you can view, edit, and create automation rules that apply to the particular analytics rule being created or edited in the wizard.

    When you create an automation rule from here, the **Create new automation rule** panel shows the **analytics rule** condition as unavailable, because this rule is already set to apply only to the analytics rule you're editing in the wizard. All the other configuration options are still available to you.

- **Incidents page**

    You can also create an automation rule from the **Incidents** page, in order to respond to a single, recurring incident. This is useful when creating a [suppression rule](#incident-suppression) for [automatically closing "noisy" incidents](false-positives.md).

    When you create an automation rule from here, the **Create new automation rule** panel populates all the fields with values from the incident. It names the rule the same name as the incident, applies it to the analytics rule that generated the incident, and uses all the available entities in the incident as conditions of the rule. It also suggests a suppression (closing) action by default, and suggests an expiration date for the rule. You can add or remove conditions and actions, and change the expiration date, as you wish.

### Export and import automation rules

Export your automation rules to Azure Resource Manager (ARM) template files, and import rules from these files, as part of managing and controlling your Microsoft Sentinel deployments as code. The export action creates a JSON file in your browser's downloads location, that you can then rename, move, and otherwise handle like any other file.

The exported JSON file is workspace-independent, so it can be imported to other workspaces and even other tenants. As code, it can also be version-controlled, updated, and deployed in a managed CI/CD framework.

The file includes all the parameters defined in the automation rule. Rules of any trigger type can be exported to a JSON file.

For instructions on exporting and importing automation rules, see [Export and import Microsoft Sentinel automation rules](import-export-automation-rules.md).

## Next steps

In this document, you learned about how automation rules can help you to centrally manage response automation for Microsoft Sentinel incidents and alerts.

- [Create and use Microsoft Sentinel automation rules to manage incidents](create-manage-use-automation-rules.md).
- [Use automation rules to create lists of tasks for analysts](create-tasks-automation-rule.md).
- To learn more about advanced automation options, see [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md).
- For help with implementing playbooks, see [Tutorial: Use playbooks to automate threat responses in Microsoft Sentinel](tutorial-respond-threats-playbook.md).
