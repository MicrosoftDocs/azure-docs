---
title: Billing for Azure SRE Agent Preview
description: Learn how different agent actions are billed in Azure SRE Agent.
author: craigshoemaker
ms.author: cshoe
ms.topic: concept-article
ms.date: 08/08/2025
ms.service: azure-sre-agent
---

# Billing for Azure SRE Agent Preview

Azure SRE Agent Preview works on your behalf in two ways.

As soon as you create the agent, it begins monitoring your resources. During this time, the agent examines system data and learns about your resource's behavior. This continuous attention ensures that the agent is ready to respond to problems regardless of the scale or complexity of what you deploy on Azure. This type of action is called *always-on flow*.

The agent works differently from continuous monitoring when when the agent works on tasks on its own. For example, when the agent detects a situation that requires attention, it carries out discrete, measurable tasks that use AI components to address the problem. The same action holds true when you issue a prompt to the agent. This type of action is called *active flow*.

The following table summarizes the distinctions between the two types of actions.

| Action type | Description | Triggered when... |
|---|---|---|
| Always-on flow | Continuous monitoring of your resources | You create the agent, and monitoring continues until the agent is deleted. |
| Active flow | Measurable tasks that the agent takes to mitigate problems or to interact with you | Either you prompt the agent to take action, or the agent autonomously takes action on your behalf and reports the results. |

The amount of time that your agent spends in these flows affects how you're billed for the agent.

## Calculation methods

Billing for Azure SRE Agent is based on Azure agent units (AAUs). AAUs standardize measuring agentic processing across all prebuilt Azure agents. This common metric makes it easier for you to adopt new agents, compare agents, and better understand pricing in a predictable way.

Actions in the always-on flow and actions in the active flow are billed at different rates. The total cost to use SRE Agent is a combination of costs for the two action types.

The following table can help you estimate the costs associated with how you use SRE Agent.

| Action type | Calculation basis |
|---|---|
| Always-on flow | 4 AAUs per agent hour |
| Active flow  | 0.25 AAUs per agent task, per second |

AAUs continuously accumulate under the always-on flow for as long as your agent exists. Charges associated with active flow accumulate as the agent works on specific tasks. These tasks include (but aren't limited to):

- Answering questions from your prompts.
- Generating reports, summaries, and responses for you.
- Remediating problems on your behalf (either autonomously or based on your prompts).

To illustrate, consider an instance where the agent detects and fixes an "application down" scenario for you. The constant monitoring is billed at the rate for always-on flow. Any actions that the agent takes to fix the problem, ask you questions, seek approval, and provide status reports are billed at the rate for active flow.

Billing for Azure SRE Agent begins on September 1, 2025. For more information on current AAU pricing for your region, see the Azure [pricing calculator](https://azure.microsoft.com/pricing/details/sre-agent/).

## Related content

- [Azure SRE Agent overview](./overview.md)
