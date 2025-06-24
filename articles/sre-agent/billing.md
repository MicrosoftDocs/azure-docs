---
title: Billing for Azure SRE Agent (preview)
description: Learn different agent actions are billed in Azure SRE Agent.
author: craigshoemaker
ms.author: cshoe
ms.topic: tutorial
ms.date: 06/24/2025
ms.service: azure
---

# Billing for Azure SRE Agent (preview)

The Azure SRE Agent works on your behalf in two different ways. As soon as you create the agent, it begins monitoring your resources. During this time, the agent looks at telemetry data and learns about your resource's behavior. This continuous attention ensures the agent is ready to respond to issues regardless of the scale or complexity of what you deploy on Azure.

By contrast, the agent works differently from continuous monitoring when you prompt the agent or it works on tasks on its own. For example, when the agent detects a situation requiring attention, it carries out distinct, measurable tasks that use AI components to attempt to address the issue. The same holds true when you issue a prompt to the agent.

The distinctions between these two types of actions are known as *always-on flow* and *active flow*.

| Action type | Description | Triggered when... |
|---|---|---|
| Always-on | Continuous monitoring of your resources. | You create the agent, and monitoring continues until the agent is deleted. |
| Active | Discrete, measurable tasks taken by the agent in an attempt to mitigate issues or interact with you. | Either you prompt the agent to take action, or the agent autonomously takes action on your behalf and reports the results. |

The amount of time your agent spends in these flows affects how you're billed for the agent.

## Calculation methods

Billing for Azure SRE Agent is based on Azure Agent Units (AAU). AAUs standardize measuring agentic processing across all prebuilt Azure agents. This common metric makes it easier for you to adopt new agents, compare different agents, and better understand pricing in a predictable way.

Actions in the *always-on flow* are billed at one rate, while *active flow* actions are billed at a different rate. Total cost to use SRE Agent is a combination of *always-on* and *active flow* costs.

Use the following table to help you estimate the costs associated with how you use SRE Agent.

| Action type | Calculation basis |
|---|---|
| Always-on flow | 4 AAU per agent hour |
| Active flow  | 0.25 AAU per agent task, per second |

AAUs continuously accumulate under the *always-on flow* for as long as your agent exists. Charges associated with *active flow* accumulate as the agent works on specific tasks. These tasks include (but aren't limited to) the following actions:

- Answering questions from your prompts
- Generating reports, summaries, and responses for you
- Remediating issues on your behalf (either autonomously or based on your prompts)

To illustrate, consider an instance where the agent detected and fixed an "application down" scenario for you. The constant monitoring is billed at the *always-on* rate. Any action the agent takes to fix the problem, ask you questions, seek approval, and provide status reports are all billed at the *active flow* rate.

<!-- For more information on current AAU pricing for your region, see the Azure pricing calculator. -->

## Related content

- [Overview](./overview.md)
