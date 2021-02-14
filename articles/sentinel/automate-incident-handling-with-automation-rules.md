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
ms.date: 02/14/2021
ms.author: yelevin
---
# Security Orchestration, Automation, and Response (SOAR) in Azure Sentinel

This article describes the Security Orchestration, Automation, and Response (SOAR) capabilities of Azure Sentinel, and shows how the use of automation rules and playbooks in response to security threats increases your SOC's effectiveness and saves you time and resources.

## Azure Sentinel as a SOAR solution

Azure Sentinel, in addition to being a Security Information and Event Management (SIEM) system, is also a platform for Security Orchestration, Automation, and Response (SOAR). One of its primary purposes is to automate any recurring and predictable detection and response tasks that are the responsibility of your Security Operations Center and personnel (SOC/SecOps), freeing up time and resources for more in-depth investigation of, and hunting for, advanced threats. Automation takes a few different forms in Azure Sentinel, from playbooks that run predetermined sequences of actions in response to various triggers, to automation rules that centrally manage the automation of incident response.

## Automation rules

Automation rules are a new concept in Azure Sentinel. This feature allows users to centrally manage the automation of incident handling. Besides letting you assign playbooks to incidents (not just to alerts as before), automation rules also allow you to automate responses for multiple analytics rules at once, automatically tag, assign, or close incidents without the need for playbooks, and control the order of actions that are executed. Automation rules will streamline automation use in Azure Sentinel and will enable you to simplify complex workflows for your incident orchestration processes.

### Components

Automation rules are made up of several components:

#### Trigger

Automation rules are triggered by the creation of an incident. 

To review – incidents are created from alerts by analytics rules, of which there are four types, as explained in the tutorial [Investigate alerts with Azure Sentinel](tutorial-detect-threats-built-in.md).

#### Conditions

Complex sets of conditions can be defined to govern when actions (see below) should run. These conditions are typically based on the states or values of incident and entity details, and they can include AND/OR/NOT/CONTAINS operators and be nested hierarchically.

#### Actions

Sets of actions can be defined to run when the conditions (see above) are met. You can define many sets and group many actions in a set, and you can choose the order in which they’ll run (see below).
Here are some examples of actions that can be defined using automation rules, in many cases without using a playbook:

- Changing the status of an incident, keeping your workflow up to date.

  - When changing to “closed,” specifying the closing reason and adding a comment. This helps you keep track of your performance and effectiveness, and fine-tune to reduce false positives.

- Changing the severity of an incident – you can reevaluate and reprioritize based on the results of a preliminary investigation.

- Assigning an incident to an owner – this helps you direct types of incidents to the personnel best suited to deal with them, or to the most available personnel.

- Adding a tag to an incident – this is useful for classifying incidents by subject, by attacker, or by any other common denominator.

- You can also define an action to run a playbook, in order to take more complex response actions, including any that involve external systems. Only playbooks activated by the incident trigger (link to Triggers description in playbook doc) are available to be used in automation rules. You can define an action to include multiple playbooks, or combinations of playbooks and other actions, and the order in which they will run.

#### Expiration date

You can define an expiration date on an automation rule. The rule will be disabled after that date. This is useful for handling (that is, closing) “noise” incidents caused by planned, time-limited activities such as penetration testing.

#### Order

You can define the order in which automation rules will run.

### Common use cases and scenarios

#### Incident-triggered automation

Until now, only alerts could trigger an automated response, through the use of playbooks. With automation rules, incidents can now trigger automated response chains, which can include new incident-triggered playbooks, when an incident is created. 

#### Trigger playbooks for Microsoft providers

Automation rules provide a way to automate the handling of Microsoft security alerts by applying these rules to incidents created from the alerts. The automation rules can call playbooks and pass the incidents to them with all their details, including alerts and entities. In general, Azure Sentinel best practices position incidents as the focal point of security operations.

Microsoft security alerts include the following:

- Microsoft Cloud App Security (MCAS)
- Azure AD Identity Protection
- Azure Defender (ASC)
- Defender for IoT (formerly ASC for IoT)
- Microsoft Defender for Office 365 (formerly Office 365 ATP)
- Microsoft Defender for Endpoint (formerly MDATP)
- Microsoft Defender for Identity (formerly Azure ATP)

#### Multiple sequenced playbooks/actions in a single rule

You can now have near-complete control over the order of execution of actions and playbooks in a single automation rule. You also control the order of execution of the automation rules themselves. This allows you to greatly simplify your playbooks, reducing them to a single task or a small, straightforward sequence of tasks, and combine these small playbooks in different combinations in different automation rules.

#### Assign one playbook to multiple analytics rules at once

If you have a task you want to automate on all your analytics rules – say, the creation of a support ticket in an external ticketing system – you can apply a single playbook to any or all of your analytics rules – including any future rules – in one shot. This makes simple but repetitive maintenance tasks a lot less of a chore.

#### Automatic assignments of incidents

You can assign incidents to the right owner automatically. If your SOC has an analyst who specializes in a particular platform, any incidents relating to that platform can be automatically assigned to that analyst.

#### Incident suppression

You can use rules to automatically resolve incidents that are known false/benign positives without the use of playbooks. For example, when running penetration tests, doing scheduled maintenance or upgrades, or testing automation procedures, many false-positive incidents may be created that the SOC wants to ignore. A time-limited automation rule can automatically close these incidents as they are created, while tagging them with a descriptor of the cause of their generation.

#### Time-limited automation

You can add expiration date for your automation rules. There may be cases other than incident suppression that warrant time-limited automation. You may want to assign a particular type of incident to a particular user (say, an intern or a consultant) for a specific time frame. If the time frame is known in advance, you can effectively cause the rule to be disabled at the end of its relevancy, without having to remember to do so.

#### Automatically tag incidents

You can automatically add free-text tags to incidents to group or classify them according to any criteria of your choosing.

### Automation rules execution

Automation rules are run sequentially, in an order determined by the user. Each automation rule is executed after the previous one has finished its run. Within an automation rule, all actions are run sequentially in the order in which they are defined.

For playbook actions, there is a two-minute delay between the beginning of the playbook action and the next action on the list.

### Creating and managing automation rules

Automation rules are centrally managed in the new **Automation** blade (which replaces the **Playbooks** blade), under the **Automation Rules** tab. From there, users can create new automation rules and edit the existing ones. They can also drag automation rules to change the order of execution, and enable or disable them.

In the **Automation** blade, you see all the rules that are defined on the workspace, along with their status (Enabled/Disabled) and which analytics rules they are applied to.

### Create a new automation rule

13:20 in presentation – from Automation blade

18:45 in presentation – from Analytics rule wizard, Automated response tab

20:30 in presentation – from Incidents blade – useful for incident suppression, automatically populates conditions

Audit automation rule actions in Logs, query SecurityIncidents table with filter ModifiedBy contains “Automation”

## Next steps

