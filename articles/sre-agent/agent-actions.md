---
title: How agent actions are categorized in Azure SRE Agent (preview)
description: Learn how different agent actions are classified in Azure SRE Agent.
author: craigshoemaker
ms.author: cshoe
ms.topic: tutorial
ms.date: 06/23/2025
ms.service: azure
---

# How agent actions are categorized in Azure SRE Agent

The Azure SRE Agent works on your behalf in two different ways. As soon as you create the agent, it begins monitoring resources associated to the agent. During this time, the agent is looking at telemetry data and learning about your resource's behavior. This continuous attention ensures the agent is ready to respond to issues regardless of the scale or complexity of what you have deployed on Azure.

By contrast, the agent is working in a different context from continuous monitoring when you prompt the agent or it works on a discrete action on its own. For example, when the agent detects a situation requiring attention, it carries out discrete, measurable tasks that use AI components to attempt to address the issue. The same holds true when you issue a prompt to the agent.

The distinctions between these two types of operations are known as *always-on flow* and *active flow*.

| Flow type | Description | Triggered when... |
|---|---|---|
| Always-on | Continuous monitoring of your resources. | You create the agent, and it continues monitoring until the agent is deleted. |
| Active | Discrete, measurable tasks taken by the agent in an attempt to mitigate issues. | Either you prompt the agent to take action, or the agent autonomously takes action on your behalf. |

The amount of time your agent spends in these flows affects how you're billed for the agent.

## Related content

- [Billing in Azure SRE Agent](./billing.md)