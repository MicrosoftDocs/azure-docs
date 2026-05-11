---
title: Select models for agents in Microsoft Discovery
description: Learn how to choose the right OpenAI model for your Microsoft Discovery agents based on use case, output quality, cost, and response time.
author: leijgao
ms.author: leijiagao
ms.service: azure
ms.topic: how-to
ms.date: 04/15/2026

#CustomerIntent: As a researcher or scientist, I want to select the best model for my Discovery agents so that I can balance output quality, cost, and response time.
---

# Select models for agents in Microsoft Discovery

Microsoft Discovery is built on [Microsoft Foundry Agent Service](/azure/foundry/agents/concepts/runtime-components). All models available in the [Foundry model catalog](https://ai.azure.com/catalog/models) are accessible for Discovery agents. During public preview, we recommend OpenAI GPT-5.x series models for the best experience with Discovery agents.

This article helps you choose the right model for your agents based on task complexity, output quality, cost, and response time.

## Prerequisites

- An active [Azure subscription](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A deployed Microsoft Discovery workspace with at least one project. For setup instructions, see [Get started with Microsoft Discovery infrastructure](quickstart-infrastructure-portal.md).
- A chat model deployment configured at the workspace level. For details, see [Create a chat model deployment](quickstart-infrastructure-portal.md#6-create-chat-model-deployment).

## Understand available GPT-5.x models

The following table summarizes the OpenAI GPT-5.x models recommended for Discovery agents during public preview.

| Model | Context window | Strength | Relative cost | Response time |
| --- | --- | --- | --- | --- |
| **GPT-5.2** | 400,000 tokens | General-purpose reasoning, tool use, structured output | Medium | Medium |
| **GPT-5.4** | 1,050,000 tokens | Production-grade tasks with large context requirements | Medium-High | Medium |
| **GPT-5.2-Pro** | 400,000 tokens | Deep reasoning, complex research, advanced code generation | High | Slow |
| **GPT-5.4-Pro** | 1,050,000 tokens | Maximum reasoning depth with extended context | Highest | Slowest |
| **GPT-5.2-Chat** | 400,000 tokens | Conversational interactions, Question and Answer, guidance | Medium-Low | Fast |
| **GPT-5.4-Chat** | 1,050,000 tokens | Conversational interactions with larger context | Medium | Fast |
| **GPT-5-mini** | 400,000 tokens | High-volume, cost-sensitive workloads | Low | Fast |
| **GPT-5-nano** | 400,000 tokens | Ultra-low-cost, latency-sensitive workloads | Lowest | Fastest |

## Match models to agent use cases

Different agent tasks have different requirements. Use the following guidance to select the right model for each agent in your project.

### Prompt agents for research and analysis

Research agents handle literature review, data analysis, summarization, and scientific reasoning. These tasks require strong reasoning and accurate output.

**Recommended models:**

- **GPT-5.2** (default recommendation)—Provides reliable reasoning for most research tasks. It handles tool execution, structured output, and multi-step analysis well. Start here for most prompt agents.
- **GPT-5.4**—Choose this model when your agent processes large documents or needs extended context. The 1,050,000 token context window supports ingesting full papers, datasets, or lengthy experiment logs.
- **GPT-5.2-Pro / GPT-5.4-Pro**—Use Pro variants for agents that perform deep scientific reasoning, complex hypothesis generation, or advanced code synthesis. Pro models allocate more compute per request and produce more thorough outputs. Expect higher cost and slower response times.

### Prompt agents for planning and routing

Planning agents generate research plans, make routing decisions, or coordinate other agents. These tasks need consistent, deterministic behavior rather than creative reasoning.

**Recommended models:**

- **GPT-5.2**—Handles planning and routing reliably. Set temperature to `0` for deterministic behavior.
- **GPT-5.2-Chat**—A cost-effective alternative for lightweight planning tasks that don't require deep reasoning. Chat models respond faster and cost less per token.
- **GPT-5-mini**—Suitable for simple routing decisions where the agent selects from a fixed set of options. Offers the best balance of cost and speed for straightforward classification tasks.

### Prompt agents for tool execution

Tool-execution agents invoke Discovery tools, code interpreters, or Model Context Protocol (MCP) tools. They need reliable function calling and structured output generation.

**Recommended models:**

- **GPT-5.2**—Offers the most consistent tool-calling behavior across the model family. It reliably generates structured JSON for function arguments and parses tool responses accurately.
- **GPT-5.4**—Choose this model when tool operations involve large input payloads or when the agent needs to maintain context across many sequential tool calls.

### Prompt agents for user interaction

Interactive agents handle Question and Answer, onboarding, or exploratory conversations with researchers. They benefit from natural conversational tone and fast response times.

**Recommended models:**

- **GPT-5.2-Chat / GPT-5.4-Chat**—Optimized for conversational interactions. Chat models provide natural, responsive dialogue, with lower latency and cost compared to their base counterparts.
- **GPT-5-mini**—A strong choice for high-volume interactive scenarios if cost efficiency matters. Delivers good conversational quality at a fraction of the cost.

### Workflow agents

Workflow agents orchestrate multiple prompt agents through action flows. The workflow agent itself doesn't use a model directly. Instead, each prompt agent invoked within the workflow uses its own model deployment. Apply the guidance in the previous sections to each prompt agent in your workflow.

For multi-agent workflows, you can mix models across agents. For example, use GPT-5-mini for a routing agent, GPT-5.2 for a data-processing agent, and GPT-5.2-Pro for a synthesis agent. This approach optimizes cost without sacrificing output quality where it matters.

## Evaluate tradeoffs between quality, cost, and speed

Use the following decision matrix to guide your model selection.

| Priority | Recommended model | Tradeoff |
| --- | --- | --- |
| **Highest output quality** | GPT-5.4-Pro | Slowest response, highest cost |
| **Best general-purpose balance** | GPT-5.2 | Good quality, moderate cost, moderate speed |
| **Large context requirements** | GPT-5.4 | Higher cost, supports up to 1,050,000 tokens |
| **Fast conversational responses** | GPT-5.2-Chat or GPT-5.4-Chat | Reduced reasoning depth |
| **Cost optimization** | GPT-5-mini | Good quality at lower cost |
| **Lowest cost and latency** | GPT-5-nano | Reduced output quality, best for simple tasks |

### Tips for optimizing cost

- **Start with GPT-5.2.** It's the recommended default for Discovery agents. Move to a different model only when you have a specific reason.
- **Use smaller models for simple tasks.** Routing, classification, and formatting tasks don't need Pro-level reasoning. GPT-5-mini or GPT-5-nano reduces cost significantly.
- **Reserve Pro models for high-value tasks.** Deep research synthesis, complex hypothesis generation, and advanced code analysis justify the higher cost.
- **Mix models in workflows.** Assign different models to different agents within the same workflow based on each agent's task complexity.

## Configure a model deployment for your agent

You configure model deployments at the workspace level. All agents in a project share these deployments.

1. Deploy a model as an Azure resource managed resource at the workspace level using Azure CLI, Bicep, or ARM templates. See [Create a chat model deployment](quickstart-infrastructure-portal.md#6-create-chat-model-deployment) for detailed steps.

1. In Discovery Studio, create or edit a prompt agent.

1. Under **Chat model**, select the deployment name that corresponds to the model you want to use (for example, `my-gpt-52-deployment`).

1. Adjust **Temperature** and **Top-P** response controls based on your use case:
   - For planning and routing agents, set **Temperature** to `0` for deterministic output.
   - For research and analysis agents, use **Temperature** between `0.3` and `0.7` for balanced creativity and precision.
   - For exploratory or brainstorming agents, set **Temperature** between `0.7` and `1.0`.

1. Save the agent. Each save creates a new immutable version.

You can deploy multiple models in the same workspace and assign different deployments to different agents. Reference deployments by name, not resource ID.

## Related content

- [Agent types in Microsoft Discovery](concept-discovery-agent-types.md)
- [Create agents in Microsoft Discovery](how-to-agent-creation.md)
- [Microsoft Foundry models overview](/azure/foundry/concepts/foundry-models-overview)
- [Foundry model catalog](https://ai.azure.com/catalog/models)
