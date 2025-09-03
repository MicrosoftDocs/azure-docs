---
title: Incident response plans in Azure SRE Agent Preview
description: Learn customize incident response plans with specialized instructions for mitigating incidents.
author: craigshoemaker
ms.topic: how-to
ms.date: 09/03/2025
ms.author: cshoe
ms.service: azure
---

# Incident response plans in Azure SRE Agent

An Azure SRE Agent incident response plans allows you to define how incidents are detected, reviewed, and mitigated within your environment. When you define custom plans, you tailor the agent’s response to incidents, set autonomy levels, and provide custom instructions for incident management. You can choose between either semi-autonomous and fully autonomous operations, depending on your needs.

## How incident response plans work

When Azure SRE Agent detects an incident in your environment, the incident management tools step in to help you resolve issues as fast as possible. The agent can provide context and elevate incidents to your team to resolve manually, or the agent can work to resolve issues on your behalf. The behavior of the agent depends entirely on how you configure the incident response plan.

## Default settings

When you enable incident management, by default all incidents are processed using the following plan details:

- Connected to Azure Monitor alerts
- Processes all P1 incidents from all impacted services
- Runs in review mode

While this configuration represents the defaults, you can customize everything from the incident management system to the filters and autonomy level. Supported incident management platforms include PagerDuty and ServiceNow.

## Customize a response plan

You can create custom instructions through selecting management services, applying filters, setting autonomy level, and customizing the prompt context used to process incidents.

### Filter incidents

The following filters are available for you to customize incident plan instructions.

| Filter | Description |
|---|---|
| Incident type | Select the type of incidents you want your plan to process. Options include default, major, and security incidents.  |
| Impacted service | Select the service you want your plan to process. Options include all impacted services, or you can select a service by name. |
| Priority | Select the incident priority level you want your plan to process. Options include all priorities or P1 - P5. |
| Title contains | Provide a text string to match against incident title values. |

### Set autonomy level

Inside an incident response plan, you can choose the autonomy level for the agent.

| Autonomy level | Description | Is default |
|---|---|---|
| Review | In this semi-autonomous mode, the agent diagnoses incidents then mitigates or modifies resources only after you review and approve and the proposed actions. | Yes |
| Autonomous | In this fully autonomous mode, the agent analyzes incidents and independently performs mitigation or resource modifications.<br><br>**Note** : If the agent doesn't have the required permissions to take action, it prompts you to grant temporary access to elevated permissions. | No |

## Define custom instructions

To customize your incident response plan, SRE Agent looks at a series of previous incidents to figure out how they've been resolved in the past. After the agent creates a profile based on historical incidents, it generates more detailed context that the agent uses to respond to incidents.

You can customize the generated instructions or replace them with your own instructions.

## Related content

- [Incident management](./incident-management.md)
