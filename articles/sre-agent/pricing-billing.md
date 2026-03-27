---
title: Pricing and billing for Azure SRE Agent
description: Learn how Azure SRE Agent billing works with Azure Agent Units, including always-on flow, active flow rates, and cost optimization tips.
ms.topic: concept-article
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.service: azure-sre-agent
ms.ai-usage: ai-assisted
#customer intent: As an Azure administrator, I want to understand how Azure SRE Agent billing works so that I can estimate costs and manage my spending.
---

# Pricing and billing for Azure SRE Agent

Learn how Azure SRE Agent billing works and what to expect on your Azure bill.

> [!TIP]
> Azure SRE Agent has two billing components: **always-on flow** (fixed) and **active flow** (variable, depends on task complexity). Monitor consumption in the portal at **Settings** > **Agent consumption**.

## How billing works

Azure SRE Agent charges are based on Azure agent units (AAUs), a standardized measure of agentic processing used across all prebuilt Azure agents. Your monthly bill combines two types of charges.

### Always-on flow (fixed cost)

When you create an agent, a fixed rate applies as long as the agent exists.

| Component | Rate |
|---|---|
| Always-on flow | 4 AAUs per agent-hour |

Always-on flow doesn't mean the agent is actively processing work. It represents the baseline cost of keeping your agent provisioned and available. Always-on billing continues from agent creation until the agent is deleted.

### Active flow (variable cost)

When your agent performs tasks such as answering prompts, investigating incidents, generating reports, or executing remediation, those tasks consume active flow AAUs.

| Component | Rate |
|---|---|
| Active flow | 0.25 AAUs per agent task |

The actual AAU consumption for active flow depends on the complexity of the task. Simple queries consume fewer AAUs, while multistep investigations across multiple data sources consume more.

Key details:

- **Only processing time counts.** You pay for active flow only during the time the agent processes your request. Time the agent spends waiting for your response isn't billed as active flow.
- **Active flow resets monthly.** Your AAU consumption counter resets at the beginning of each calendar month.

## Active flow by task type

The amount of active flow AAUs consumed depends on what the agent is doing. The following scenarios show how task complexity affects consumption.

### Quick question (low complexity)

You ask the agent a simple question like *"What's the current CPU usage on my app?"* The agent checks one data source and responds.

| Aspect | Details |
|---|---|
| **AAU consumption** | Low |
| **What happens** | Agent queries a single connector and returns a summary. |
| **Example prompts** | "Show me recent alerts" or "What's the status of my AKS cluster?" |

### Incident investigation (medium complexity)

An incident triggers, and the agent investigates by querying logs, correlating metrics, and analyzing multiple data sources to identify the root cause.

| Aspect | Details |
|---|---|
| **AAU consumption** | Medium |
| **What happens** | Agent runs multiple tool calls across connectors, reasons over results, and builds a timeline. |
| **Example triggers** | Automated incident from Azure Monitor or "Investigate why latency spiked in the last hour." |

### Full remediation (high complexity)

The agent investigates an issue, identifies the fix, executes a remediation runbook, and verifies the resolution, potentially across multiple resources.

| Aspect | Details |
|---|---|
| **AAU consumption** | High |
| **What happens** | Investigation, action execution, and verification across multiple tools and data sources. |
| **Example triggers** | "Diagnose and fix the failing deployment" or an automated incident with a response plan. |

> [!TIP]
> To keep active flow costs predictable, set a monthly AAU allocation limit in **Settings** > **Agent consumption**. The agent continues background monitoring even after reaching the limit.

## Monitor your costs

Use the SRE Agent portal and Microsoft Cost Management to track and control spending.

### In the SRE Agent portal

Go to **Settings** > **Agent consumption** to view your usage.

| Information | Description |
|---|---|
| **Monthly AAU limit** | Shows your combined always-on and active flow allocation. |
| **Total active flow consumption** | A progress bar comparing current usage to your limit. |
| **Daily active flow consumption** | A bar chart showing AAU usage per day for the current month. |

### Set a spending limit

Select **Change AAU allocation** to set a monthly active flow AAU limit (up to 200,000 AAUs).

- When your agent reaches the active flow limit, it continues running in always-on mode (background monitoring) but becomes unavailable for chat and actions until the next month.
- You can increase or decrease the allocation at any time.

### In Microsoft Cost Management

For detailed billing breakdowns across multiple agents and resources, use [Microsoft Cost Management](https://portal.azure.com/#view/Microsoft_Azure_CostManagement/Menu/~/overview) in the Azure portal.

## Cost optimization tips

Use the following strategies to manage your Azure SRE Agent spending.

| Strategy | Impact | How to implement |
|---|---|---|
| **Delete unused agents** | Eliminates all costs | Delete agents you no longer need. All billing stops immediately. |
| **Set AAU allocation limits** | Caps active flow spend | Use **Settings** > **Agent consumption** to set a monthly limit. |

## Frequently asked questions

This section answers common questions about Azure SRE Agent pricing and billing.

### Do I get charged when the agent is waiting for me to respond?

No. Only the time the agent spends actively processing a task counts as active flow. If the agent asks for your approval and waits, that waiting time isn't billed.

### What happens if I stop my agent?

A stopped agent can't monitor your resources or respond to prompts, but it still incurs the fixed always-on cost. Active flow AAUs aren't consumed while the agent is stopped.

To stop your agent, go to **Settings** > **Basics** and select **Stop**. To resume, select **Start** from the same page. To stop all billing entirely, delete the agent.

### Can one agent handle multiple workloads?

Yes. A single agent can monitor multiple resources within its configured scope. Consolidating workloads under one agent reduces always-on costs compared to deploying separate agents.

### Is there a free tier?

No. Azure SRE Agent pricing starts when you create the agent. See the [Azure pricing calculator](https://azure.microsoft.com/pricing/details/sre-agent/) for current rates.

### Is pricing the same in all regions?

Pricing might vary by region. Check the [Azure pricing calculator](https://azure.microsoft.com/pricing/details/sre-agent/) for current pricing in your region.

### When did billing start?

Billing for Azure SRE Agent started on September 1, 2025. For current pricing details, see the [Azure pricing calculator](https://azure.microsoft.com/pricing/details/sre-agent/).

## Next step

> [!div class="nextstepaction"]
> [Monitor agent usage](monitor-agent-usage.md)

## Related content

- [Billing for Azure SRE Agent](billing.md)
- [Azure SRE Agent pricing calculator](https://azure.microsoft.com/pricing/details/sre-agent/)
- [Supported regions](supported-regions.md)
- [Data residency and privacy](data-privacy.md)
