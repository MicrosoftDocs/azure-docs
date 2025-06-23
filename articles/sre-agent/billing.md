---
title: Billing for Azure SRE Agent (preview)
description: Learn different agent actions are billed in Azure SRE Agent.
author: craigshoemaker
ms.author: cshoe
ms.topic: tutorial
ms.date: 06/23/2025
ms.service: azure
---

# Billing for Azure SRE Agent (preview)

Billing for Azure SRE Agent is based on Azure Agent Units (AAU). AAUs standardize measuring agentic processing across all prebuilt Azure agents. This common metric makes it easier for you to adopt new agents, compare different agents, and better understand pricing in a predictable way.

Agent actions carried out by Azure SRE Agent fall under two categories: always-on flow and active flow. Always-on flow actions are billed at one rate, while active flow actions are billed at different rate. Total cost to use SRE Agent is a combination of the costs associated with the agent's always-on and active flow actions.

Use the following table to help you estimate the costs associated with how you use SRE Agent.

| Action category | Calculation basis |
|---|---|
| Always-on flow | 4 AAU per agent hour |
| Active flow  | 0.25 AAU per agent task, per second |

For more information on current AAU pricing for your region, see the Azure pricing calculator.

## Related content

- [Agent actions](./agent-actions.md)
