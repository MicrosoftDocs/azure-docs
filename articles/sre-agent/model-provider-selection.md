---
title: Model Provider Selection in Azure SRE Agent
description: Learn how to choose your Azure SRE Agent AI model provider and model to match your operational workloads and data residency requirements.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 04/02/2026
author: dm-chelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
ms.custom: model provider, Anthropic, Azure OpenAI, data residency, EUDB
#customer intent: As an SRE, I want to choose the right AI model provider for my agent so that I can balance performance, cost, and data residency requirements.
---

# Model provider selection in Azure SRE Agent

Choose between Azure OpenAI (GPT-5 family) and Anthropic (Claude family) as your agent's AI provider. Change providers anytime in **Settings** > **Basics**—no downtime, takes effect on the next conversation.

> [!TIP]
> - Choose between **Azure OpenAI** (GPT-5 family) and **Anthropic** (Claude family) as your agent's AI provider
> - Your agent automatically selects the best model within your chosen provider—no manual model configuration needed
> - Default provider depends on region: **Anthropic** in East US 2 and Australia East, **Azure OpenAI** in Sweden Central (EU data residency)
> - Change providers anytime in **Settings > Basics**—no downtime, takes effect on the next conversation

## Available providers

| Provider | Models | Strengths |
|----------|--------|----------|
| **Azure OpenAI** | GPT-5 family (for example, GPT-5, GPT-5.2) | Structured output, function calling, fast tool execution |
| **Anthropic** | Claude family (for example, Claude Opus 4.5, Claude Sonnet 4.6) | Long-context reasoning, code analysis, built-in web search |

Available models within each provider may change as new versions are released. Your agent automatically selects the best model within your chosen provider for each task. You select the provider; the agent handles model routing.

## How to change your model provider

1. Go to **Settings > Basics** in the agent portal.
2. Scroll to the **Model provider** section.
3. Select a provider from the **Provider** dropdown.
4. Select **Save**.

The change takes effect immediately—your next conversation uses the new provider. No restart is required. Your agent automatically selects the best model within the provider for each task.

### Pricing

Different models have different AAU rates. Select the ℹ icon next to the **Model provider** label to open the pricing page, or see [Pricing and billing—AAU rates by model](pricing-billing.md#aau-rates-by-model) for the current rates per token type.

### Data residency

> [!NOTE]
> Organizations with EU data residency requirements should select Azure OpenAI—Anthropic is excluded from EU Data Boundary (EUDB) commitments.

For agents deployed in regions covered by the EU Data Boundary (EUDB), the model picker indicates which providers are covered:

| Provider | EUDB status |
|----------|-------------|
| **Azure OpenAI** | Covered by EUDB commitments |
| **Anthropic** | Excluded from EUDB |

If EU data residency is a requirement for your organization, select Azure OpenAI.

## What makes this approach different

**Automatic model routing**—Your agent automatically selects the best model within your chosen provider for each task. Reasoning, code generation, and quick responses each use the optimal model—no manual configuration needed.

**Capability unlocks**—Selecting Anthropic as your provider automatically enables web search. Your agent can search the internet during investigations without any extra configuration.

**No migration required**—Changing providers is a settings change. Existing knowledge, memory, connectors, and scheduled tasks all work with any model provider.

## Before and after

| Aspect | Before | After |
|--------|--------|-------|
| **Provider choice** | Single default provider | Choose between Azure OpenAI and Anthropic |
| **Model routing** | Fixed model | Agent automatically selects the best model per task |
| **Web search** | Not available | Automatic with Anthropic provider |
| **Switching cost** | N/A | Zero—change provider in Settings, effective immediately |

## Related content

- [Agent reasoning](agent-reasoning.md)
- [Deep context](workspace-tools.md)
- [Audit agent actions](audit-agent-actions.md)

## Next step

> [!div class="nextstepaction"]
> [Pricing and billing—AAU rates by model](pricing-billing.md)
