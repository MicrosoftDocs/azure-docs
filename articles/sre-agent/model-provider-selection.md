---
title: Model Provider Selection in Azure SRE Agent
description: Learn how to choose your Azure SRE Agent AI model provider and model to match your operational workloads and data residency requirements.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 03/30/2026
author: dm-chelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
ms.custom: model provider, model selection, Claude, GPT-5, Anthropic, Azure OpenAI, data residency, EUDB
#customer intent: As an SRE, I want to choose the right AI model provider for my agent so that I can balance performance, cost, and data residency requirements.
---

# Model provider selection in Azure SRE Agent

Choose between Azure OpenAI (GPT-5 family) and Anthropic (Claude family) as your agent's AI provider. Change models anytime in **Settings** > **Basics**—no downtime, takes effect on the next conversation.

> [!TIP]
> - Choose between **Azure OpenAI** (GPT-5 family) and **Anthropic** (Claude family) as your agent's AI provider
> - Default provider depends on region: **Anthropic** in East US 2 and Australia East, **Azure OpenAI** in Sweden Central (EU data residency)
> - Change models anytime in **Settings > Basics**—no downtime, takes effect on the next conversation

## How to change your model provider

1. Go to **Settings > Basics** in the agent portal.
2. Scroll to the **Model provider** section.
3. Select a provider from the **Provider** dropdown.
4. Select a specific model from the **Model** dropdown, or leave it as **Automatic** to let the agent choose the best model for each task.
5. Select **Save**.

The change takes effect immediately—your next conversation uses the new model. No restart is required.

### Pricing

Different models have different AAU rates. See [Pricing and billing—AAU rates by model](pricing-billing.md#aau-rates-by-model) for the current rates per token type.

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

**Flexible model routing**—Your agent automatically routes different task types (reasoning, code generation, quick responses) to the appropriate model within your selected provider. You choose the provider; the agent optimizes model usage per task.

**Capability unlocks**—Selecting a Claude model automatically enables web search. Your agent can search the internet during investigations without any extra configuration.

**No migration required**—Changing models is a settings change. Existing knowledge, memory, connectors, and scheduled tasks all work with any model provider.

## Before and after

| Aspect | Before | After |
|--------|--------|-------|
| **Model choice** | Single default model | Multiple providers and models to choose from |
| **Web search** | Not available | Automatic with Claude models |
| **Switching cost** | N/A | Zero—change in Settings, effective immediately |

## Related content

- [Agent reasoning](agent-reasoning.md)
- [Deep context](workspace-tools.md)
- [Audit agent actions](audit-agent-actions.md)

## Next step

> [!div class="nextstepaction"]
> [Pricing and billing—AAU rates by model](pricing-billing.md)
