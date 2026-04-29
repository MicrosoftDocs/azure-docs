---
title: Agent Playground in Azure SRE Agent
description: Test and refine your agent configurations in real time before deploying changes with the split-screen editor and AI-powered evaluation.
ms.topic: feature-guide
ms.service: azure-sre-agent
ms.date: 03/18/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: playground, testing, custom agent, evaluation, quality, iterate
#customer intent: As an SRE, I want to test my agent configurations in an isolated playground so that I can iterate quickly without affecting production workflows.
---

# Agent playground in Azure SRE Agent
Test custom agent behavior in real time before deploying changes. Edit instructions, tools, and handoffs with instant feedback in a split-screen layout. Evaluate agent quality with AI-powered scoring and quick fixes.

## The problem

Building effective agent configurations is an iterative process. You write instructions, assign tools, and set up handoffs. You might discover that your agent misunderstands intent or lacks a critical tool only after deploying. Each cycle of edit, deploy, test, and fix wastes time and risks disrupting production workflows.

Without a dedicated testing environment, you deploy changes to see how they behave. You test in live conversations that affect real threads. You guess whether your instructions are clear enough.

## How the playground works

The playground is a dedicated view in the **Agent Canvas** alongside Canvas and Table views. Select **Test playground** from the view toggle to enter a split-screen environment where you edit and test.

:::image type="content" source="media/common/playground-agent-selected.png" alt-text="Screenshot of agent playground showing split-screen layout with form editor on left and chat test panel on right." lightbox="media/common/playground-agent-selected.png":::

### Select what to test

Use the **Custom agent/Tool** dropdown at the top to choose what to test.

| Entity | What you can test |
|---|---|
| **Custom agent** | Instructions, tools, handoffs, and memory in a live chat |
| **Your agent** | Override the orchestrator prompt and test routing behavior |
| **System tool** | Execute built-in tools with custom parameters |
| **Kusto tool** | Run queries against your connected clusters |

:::image type="content" source="media/common/playground-entity-selector.png" alt-text="Screenshot of entity selector dropdown showing custom agents and tools available for testing." lightbox="media/common/playground-entity-selector.png":::

### Edit and test side by side

For custom agents, the playground splits into two panels.

**Editor:**

- **Form view**: Edit custom agent name, instructions, handoff instructions, handoff custom agents, tools, and knowledge base access.
- **YAML view**: Edit the full agent configuration as YAML.

**Testing:**

- **Test tab**: Chat with your agent by using the current configuration.
- **Evaluation tab**: Run AI-powered quality analysis.

> [!NOTE]
> When you modify the configuration, chat input is disabled until you select **Apply** to save your changes or **Discard** to revert. This behavior prevents testing stale configurations. Selecting **Apply** also starts a fresh chat thread so you can test the updated configuration from scratch.

## What makes this approach different

Unlike testing in live conversations, the playground provides an isolated environment where changes don't affect production threads. The split-screen layout means you see the effect of instruction changes immediately without switching between views or waiting for deployments.

The evaluation feature goes beyond manual testing. AI analyzes your agent configuration and chat behavior to surface problems you might miss: unclear instructions, missing tools, safety gaps, and intent misalignment.

| Before | After |
|---|---|
| Deploy changes, then test in live chat | Test instantly in an isolated environment |
| Guess whether instructions are clear | Get AI-powered clarity scores |
| Discover missing tools during incidents | Evaluation surfaces tool gaps proactively |
| Switch between multiple tabs for editing and testing | Use a split-screen with editor and chat side by side |

## Evaluate agent quality

The **Evaluation** tab provides AI-powered quality scoring for your agent configuration. Select **Evaluate** to analyze your current setup and recent chat behavior.

The evaluation returns the following scores:

| Score | What it measures |
|---|---|
| **Overall** | Combined quality score (0–100) |
| **Intent match** | How well your agent's behavior aligns with its goal (1–5) |
| **Completeness** | Whether the prompt covers role, goal, and operational guidance |
| **Tool fit** | Whether the right tools are configured |
| **Prompt clarity** | How clear and actionable the instructions are |
| **Actionability** | Whether responses include concrete, executable next steps |
| **Safety** | Error handling, confirmation prompts, and safeguards |

### Quick fixes

When evaluation identifies improvements, select **Review and apply** to open the quick fixes dialog. Select the fixes you want, preview the YAML diff, and then use the **Accept selected fixes** button. You can choose to continue editing or save immediately.

> [!TIP]
> Run evaluation after a few test conversations. The evaluation considers chat behavior alongside your configuration to provide more accurate scoring.

> [!NOTE]
> If you change the agent configuration after running an evaluation, the results are marked as **outdated** and you're prompted to reevaluate. Similarly, new chat activity after an evaluation marks results as **stale**. Reevaluate to get insights that reflect your latest testing.

## Test tools in isolation

You can test system tools and Kusto tools independently from the agent playground.

### System tools

Select a system tool from the **Custom agent/Tool** dropdown to test built-in capabilities independently. Enter parameter values and select **Execute Tool** to see the raw JSON output.

### Kusto tools

Select a Kusto tool to test your query against connected clusters. The test panel shows query results with row counts, columns, and execution time. Adjust your KQL and rerun.

For step-by-step instructions, see [Test a tool in the playground](test-tool-playground.md).

## AI-assisted configuration

The playground includes two AI assistance features for refining custom agent instructions:

- **Refine with AI**: Rewrites your instructions and handoff description in place. This feature directly replaces your current text with an AI-improved version, so review the changes before saving.
- **View AI suggestions**: Opens a read-only panel alongside the form showing AI recommendations: suggestions for improvement, warnings about potential problems, and improved versions of your instructions and handoff description. This feature doesn't modify your configuration. Use it as a reference while editing.

## Get started

| Resource | What you learn |
|---|---|
| [Test a tool in the playground](test-tool-playground.md) | Step-by-step walkthrough of the playground interface |

## Related content

| Resource | Description |
|---|---|
| [Custom agents](sub-agents.md) | How custom agents work and when to use them |
| [Kusto tools](kusto-tools.md) | Build reusable KQL queries for your agent |
| [Python code execution](python-code-execution.md) | Create custom Python tools |
