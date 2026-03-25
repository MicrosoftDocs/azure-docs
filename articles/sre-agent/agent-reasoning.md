---
title: Agent Reasoning in Azure SRE Agent
description: Learn how your agent processes requests, selects tools, classifies actions, and explains its thinking.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: reasoning, thinking, tool selection, action classification, approval, context gathering
#customer intent: As an SRE, I want to understand how my agent reasons through problems so that I can trust its actions and guide its behavior effectively.
---

# Agent reasoning in Azure SRE Agent
Your agent reasons through problems rather than following scripts. It gathers evidence, selects the right tools, classifies actions by risk, and explains its thinking, all visible in the chat interface.

## The reasoning loop

Every message you send goes through the same loop.

:::image type="content" source="media/agent-reasoning/agent-reasoning-flow.svg" alt-text="A screenshot of Agent reasoning flow: understand request, gather context, reason, then act or respond. Loops up to 10 times.":::

1. **Understand**: Parse your request and identify what data is needed.
1. **Gather context**: Query data sources in parallel, including logs, metrics, resource status, deployment history, and [memory](memory.md).
1. **Reason**: Analyze gathered data, identify patterns, and form conclusions.
1. **Act or respond**: Execute safe actions, request approval for risky ones, or present findings.

If the problem requires more work, the loop iterates up to 10 times per turn. After that, your agent asks whether to continue.

## Adaptive thinking

For complex problems, your agent shows its reasoning process in the chat. A collapsible **Thinking** section appears with descriptive titles for each step (like "Exploring Azure health issues" or "Analyzing active alerts") and elapsed time.

:::image type="content" source="media/agent-reasoning/thinking-accordion-active.png" alt-text="Screenshot of adaptive thinking showing reasoning step.":::

Your agent automatically adjusts reasoning depth. A status check gets a quick response. A multistep outage gets multistep reasoning with evidence correlation.

## Memory and knowledge in reasoning

Your agent doesn't start from scratch. It searches [memory](memory.md) at the beginning of every conversation. This memory shapes how it reasons.

| What it draws from | How it improves reasoning |
|---|---|
| **Session insights** | Learns from all past conversations, including incident investigations, troubleshooting sessions, and scheduled task results |
| **Similar symptom patterns** | Recognizes recurring patterns and jumps to likely causes faster |
| **Your uploaded runbooks and docs** | Follows your team's procedures instead of generic advice |
| **User preferences** | Remembers your environment context and response preferences |

The more knowledge you provide, such as runbooks, architecture docs, and team procedures, the more relevant your agent's reasoning becomes. For more information, see [Memory and knowledge](memory.md).

## Tool selection

Your agent selects tools strategically based on the problem.

1. Starts with all tools registered on the current [subagent](sub-agents.md).
1. Filters by platform, selecting only incident tools for the connected [incident platform](incident-platforms.md).
1. Filters by published list, selecting only tools you make available.
1. Adjusts as new information emerges during the conversation.

Each subagent has its own tool set. When your agent delegates to a different subagent, the available tools change automatically.

For more information on available tools, see [Tools](tools.md).

## Action classification

Your agent classifies every action before executing it.

| Classification | Behavior | Examples |
|---|---|---|
| **Safe** | Executes immediately | Query logs, check resource status, list deployments |
| **Cautious** | Executes with a brief explanation | Send emails, post Teams messages |
| **Destructive** | Requires your confirmation | Restart an app, scale resources, modify configurations |

How your agent handles each type depends on your [run mode](run-modes.md).

| Run mode | Safe | Cautious | Destructive |
|---|---|---|---|
| **ReadOnly** | Executes | Reads only | Blocked |
| **Review** | Executes | Executes | Asks for approval |
| **Autonomous** | Executes | Executes | Executes |

## Conversation management

Two mechanisms keep long conversations productive.

| Mechanism | What it does |
|---|---|
| **Compaction** | When conversations get very long, your agent summarizes earlier context while preserving key findings. You can trigger this action manually by using the `/compact` command. |
| **Automatic retries** | If a service interruption occurs mid-response, your agent retries transparently. |
| **Error handling** | If a model encounters a temporary issue, your agent displays a user-friendly message ("model is temporarily experiencing issues") instead of a generic internal error. |

## Cancellation

When you select **Stop**, your agent immediately halts all operations and adds an internal marker that prevents retrying the canceled task. Your next message starts fresh, unless you explicitly modify the canceled request.

## Boundaries

The following table summarizes what agent reasoning does and doesn't do.

| What reasoning does | What it doesn't do |
|---|---|
| Gathers evidence from multiple sources in parallel | Guarantee finding a root cause (evidence might be insufficient) |
| Classifies actions and respects your run mode | Auto-remediate without confirmation in Review mode |
| Explains its thinking step by step | Share investigation methodology across separate agents |
| Adjusts reasoning depth to problem complexity | Replace human judgment for critical decisions |

## Next step

> [!div class="nextstepaction"]
> [Explore the agent playground](./agent-playground.md)

## Related content

- [Root cause analysis](root-cause-analysis.md): Deep investigation with hypothesis trees
- [Run modes](run-modes.md): ReadOnly, Review, and Autonomous behavior
- [Memory and knowledge](memory.md): How your agent remembers context across conversations
- [Tools](tools.md): Built-in and custom tool capabilities
- [Skills](skills.md): Domain-specific investigation procedures
