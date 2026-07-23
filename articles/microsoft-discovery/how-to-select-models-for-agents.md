---
title: Select Models for Agents in Microsoft Discovery
description: Choose the right model for your Microsoft Discovery agents, based on use case, output quality, cost, and response time.
author: leijgao
ms.author: leijiagao
ms.service: azure
ms.topic: how-to
ms.date: 05/29/2026

#CustomerIntent: As a researcher or scientist, I want to select the best model for my Discovery agents so that I can balance output quality, cost, and response time.
---

# Select models for agents in Microsoft Discovery

Microsoft Discovery is built on [Foundry Agent Service](/azure/foundry/agents/concepts/runtime-components). All models available in the [Microsoft Foundry model catalog](https://ai.azure.com/catalog/models) are accessible for Discovery agents. During public preview, use OpenAI GPT-5.x series models for the best experience with Discovery agents.

This article helps you choose the right model for your agents based on task complexity, output quality, cost, and response time. The guidance applies to both Microsoft Discovery and the Discovery app, with more flexibility available in the Discovery app for third-party model endpoints. (The Discovery app is a local experience built on GitHub Copilot.)

## Applicability

| Offering | Model guidance | Additional options |
| --- | --- | --- |
| Microsoft Discovery | All guidance in this article applies. You deploy models as workspace-level managed resources. | Models are from the [Foundry model catalog](https://ai.azure.com/catalog/models). |
| The Discovery app | Same model selection principles apply. | Supports bring-your-own-model (BYOM) endpoints from third-party platforms. |

## Prerequisites

- An active [Azure subscription](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A deployed Microsoft Discovery workspace with at least one project. For setup instructions, see [Get started with Microsoft Discovery infrastructure](quickstart-infrastructure-portal.md).
- A chat model deployment configured at the workspace level. For details, see [Create a chat model deployment](quickstart-infrastructure-portal.md#6-create-chat-model-deployment).

## Understand available GPT-5.x models

The following table summarizes the OpenAI GPT-5.x models recommended for Discovery agents during public preview.

| Model | Context window | Strengths | Relative cost | Response time |
| --- | --- | --- | --- | --- |
| GPT-5.2 | 400,000 tokens | General-purpose reasoning, tool use, structured output | Medium | Medium |
| GPT-5.4 | 1,050,000 tokens | Production-grade tasks with large context requirements | Medium-High | Medium |
| GPT-5.5 | 1,050,000 tokens | Latest reasoning capabilities with improved accuracy and instruction following | High | Medium |
| GPT-5.2-Pro | 400,000 tokens | Deep reasoning, complex research, advanced code generation | High | Slow |
| GPT-5.4-Pro | 1,050,000 tokens | Maximum reasoning depth with extended context | Highest | Slowest |
| GPT-5.2-Chat | 400,000 tokens | Conversational interactions, question and answer, guidance | Medium-Low | Fast |
| GPT-5.4-Chat | 1,050,000 tokens | Conversational interactions with larger context | Medium | Fast |
| GPT-5-mini | 400,000 tokens | High-volume, cost-sensitive workloads | Low | Fast |
| GPT-5-nano | 400,000 tokens | Ultra-low-cost, latency-sensitive workloads | Lowest | Fastest |

## Understand available Grok models

Grok models are available through Foundry and provide an alternative for biology and life sciences research workflows. Compared to GPT models, Grok models have fewer content restrictions on biology-vertical queries. They're better suited for agents that reason over biomedical literature, molecular biology, genomics, and related domains, where GPT safety filters might limit useful scientific output.

| Model | Strength | Relative cost | Response time |
| --- | --- | --- | --- |
| Grok-4.20-reasoning | Chain-of-thought reasoning for complex biology and life sciences tasks | High | Slow |
| Grok-4.20-non-reasoning | Fast inference for biology-focused agents without chain-of-thought overhead | Medium | Fast |

### When to use Grok models

- **Biology and life sciences agents**. Use Grok models when your agent handles queries about molecular structures, drug interactions, genetic pathways, or other biology-specific content. GPT models might refuse or over-filter responses.

- **Grok-4.20-reasoning**. Choose the reasoning variant for agents that perform multistep scientific reasoning, hypothesis generation, or complex analysis in biology domains. The chain-of-thought capability produces more thorough and explainable outputs.

- **Grok-4.20-non-reasoning**. Choose the non-reasoning variant for high-throughput agents that need fast responses for biology-focused queries, without the overhead of extended reasoning.

> [!NOTE]
> Grok models are supported as BYOM deployments. Ensure the model is available in your target region and the corresponding quota is reserved. Check the [Foundry model catalog](https://ai.azure.com) for current availability.

## Match models to agent use cases

Different agent tasks have different requirements. Use the following guidance to select the right model for each agent in your project.

### Prompt agents for research and analysis

Research agents handle literature review, data analysis, summarization, and scientific reasoning. These tasks require strong reasoning and accurate output.

Recommended models:

- GPT-5.4 (default recommendation). Provides strong reasoning with a large 1,050,000 token context window for most research tasks. It handles tool execution, structured output, and multistep analysis well. Start here for most prompt agents.

- GPT-5.5. The latest model in the GPT-5.x family, with improved reasoning accuracy and following of instructions. Choose GPT-5.5 for agents that require cutting-edge performance on complex scientific reasoning tasks. Available in limited regions (`eastus2`, `northcentralus`, `southcentralus`, `westus3`, `polandcentral`, and `swedencentral`).

- GPT-5.2. A cost-effective alternative when extended context isn't required. Offers reliable reasoning at a lower cost than GPT-5.4.

- GPT-5.2-Pro or GPT-5.4-Pro. Use Pro variants for agents that perform deep scientific reasoning, complex hypothesis generation, or advanced code synthesis. Pro models allocate more compute per request and produce more thorough outputs. Expect higher cost and slower response times.

### Prompt agents for planning and routing

Planning agents generate research plans, make routing decisions, or coordinate other agents. These tasks need consistent, deterministic behavior rather than creative reasoning.

Recommended models:

- GPT-5.4. Handles planning and routing reliably. Set temperature to `0` for deterministic behavior.

- GPT-5.2-Chat. A cost-effective alternative for lightweight planning tasks that don't require deep reasoning. Chat models respond faster and cost less per token.

- GPT-5-mini. Suitable for simple routing decisions where the agent selects from a fixed set of options. Offers the best balance of cost and speed for straightforward classification tasks.

### Prompt agents for tool execution

Tool-execution agents invoke Discovery tools, code interpreters, or model context protocol tools. They need reliable function calling and structured output generation.

Recommended models:

- GPT-5.4. Offers consistent tool-calling behavior, with a large context window. It reliably generates structured JSON for function arguments and parses tool responses accurately, while supporting many sequential tool calls.

- GPT-5.2. A cost-effective alternative when tool operations don't involve large input payloads or extended context.

### Prompt agents for user interaction

Interactive agents handle question and answer, onboarding, or exploratory conversations with researchers. They benefit from a natural conversational tone and fast response times.

Recommended models:

- GPT-5.2-Chat or GPT-5.4-Chat. Optimized for conversational interactions. Chat models provide natural, responsive dialogue, with lower latency and cost compared to their base counterparts.

- GPT-5-mini. A strong choice for high-volume interactive scenarios if cost efficiency matters. Delivers good conversational quality at a fraction of the cost.

### Multi-agent orchestration

When you use the [Discovery Engine](concept-discovery-engine.md) for multi-agent orchestration, each prompt agent that the engine invokes uses its own model deployment. Apply the guidance in the previous sections to each prompt agent in your project.

For multi-agent scenarios, you can mix models across agents. For example, use GPT-5-mini for a routing agent, GPT-5.2 for a data-processing agent, and GPT-5.2-Pro for a synthesis agent. This approach optimizes cost without sacrificing output quality where it matters.

## Evaluate tradeoffs between quality, cost, and speed

Use the following decision matrix to guide your model selection.

| Priority | Recommended model | Tradeoff |
| --- | --- | --- |
| Highest output quality | GPT-5.4-Pro | Slowest response, highest cost |
| Latest reasoning capabilities | GPT-5.5 | Limited region availability |
| Best general-purpose balance | GPT-5.4 | Good quality, large context, moderate cost |
| Large context requirements | GPT-5.4 | Higher cost, supports up to 1,050,000 tokens |
| Biology and life sciences | Grok-4.20-reasoning | Fewer content restrictions on biology queries; BYOM deployment required |
| Fast biology inference | Grok-4.20-non-reasoning | Fewer content restrictions; no chain-of-thought reasoning |
| Fast conversational responses | GPT-5.2-Chat or GPT-5.4-Chat | Reduced reasoning depth |
| Cost optimization | GPT-5-mini | Good quality at lower cost |
| Lowest cost and latency | GPT-5-nano | Reduced output quality, best for simple tasks |

### Tips for managing cost

- Start with GPT-5.4. It's the recommended default for Discovery agents. Move to a different model only when you have a specific reason.

- Use smaller models for simple tasks. Routing, classification, and formatting tasks don't need Pro-level reasoning. GPT-5-mini or GPT-5-nano reduces cost significantly.

- Reserve Pro models for high-value tasks. Deep research synthesis, complex hypothesis generation, and advanced code analysis justify the higher cost.

- Mix models across agents. Assign different models to different agents, based on each agent's task complexity.

## Configure a model deployment for your agent

You configure model deployments at the workspace level. All agents in a project share these deployments.

1. Deploy a model as an Azure managed resource at the workspace level, by using the Azure CLI, Bicep, or Azure Resource Manager templates. See [Create a chat model deployment](quickstart-infrastructure-portal.md#6-create-chat-model-deployment) for detailed steps.

1. In Discovery Studio, create or edit a prompt agent.

1. Under **Chat model**, select the deployment name that corresponds to the model you want to use (for example, `my-gpt-52-deployment`).

1. Adjust **Temperature** and **Top-P** response controls, based on your use case:
   - For planning and routing agents, set **Temperature** to `0` for deterministic output.
   - For research and analysis agents, use **Temperature** between `0.3` and `0.7` for balanced creativity and precision.
   - For exploratory or brainstorming agents, set **Temperature** between `0.7` and `1.0`.

1. Save the agent. Each save creates a new immutable version.

You can deploy multiple models in the same workspace, and assign different deployments to different agents. Reference deployments by name, not by resource ID.

## Model selection in the Discovery app

The model selection guidance in this article applies equally to the Discovery app. The same principles for matching models to agent use cases, evaluating tradeoffs among quality, cost, and speed, and configuring response controls remain valid.

### BYOM

The Discovery app provides more flexibility by allowing you to connect third-party model endpoints directly. In addition to models from the Foundry model catalog, the Discovery app supports:

- OpenAI endpoints. Connect directly to OpenAI API endpoints (for example, GPT-4o, GPT-5) by using your own API keys.

- Anthropic endpoints. Connect to Anthropic Claude models directly.

- Other third-party platforms. Any model endpoint that follows standard API conventions.

With this flexibility, you can:

- Experiment with models not currently available in the Foundry catalog.

- Compare performance across different model providers.

- Use specialized models for domain-specific tasks.

> [!IMPORTANT]
> When you use third-party model endpoints in the Discovery app, you're responsible for endpoint security, data handling, and compliance with your organization's policies. Microsoft Discovery model guidance remains the recommended baseline for production and team use.

### Configuration in the Discovery app

To configure a third-party model endpoint in the Discovery app:

1. Open the Discovery app settings.

1. Add a new model endpoint by providing the endpoint URL and authentication credentials.

1. Reference the configured endpoint when you create or edit your custom agent.

The same temperature, Top-P, and other response control parameters apply, regardless of the model provider.

## Related content

- [Agent types in Microsoft Discovery](concept-discovery-agent-types.md)
- [Create agents in Microsoft Discovery](how-to-agent-creation.md)
- [Microsoft Foundry models overview](/azure/foundry/concepts/foundry-models-overview)
- [Foundry model catalog](https://ai.azure.com/catalog/models)
