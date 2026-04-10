---
title: Durable Task for AI agents - Azure
description: Learn how durable execution on Azure provides fault-tolerant, scalable infrastructure for production AI agents using Durable Functions, Durable Task SDKs, and the Durable Task Scheduler.
author: cgillum
ms.topic: conceptual
ms.date: 04/07/2026
ms.author: cgillum
---

# Durable Task for AI agents

The [Durable Task Scheduler](../scheduler/durable-task-scheduler.md), combined with the Durable Task programming model, provides the underlying infrastructure for _durable execution_, handling state management, checkpointing, and distributed coordination so that your agent code doesn't have to. 

With the Durable Task programming model, you can build resilient, stateful agentic workflows using standard programming constructs (like loops, conditionals, and error handling) in .NET, Python, Java, and JavaScript/TypeScript, while the runtime persists state and recovers from failures automatically.

Although the Durable Task programming model isn't an agent framework itself, it works with any AI agent framework, including Microsoft Agent Framework, LangChain, or direct LLM API calls. This separation of concerns lets you focus on agent logic while Durable Task handles reliable execution at scale.

In this article, you learn about:

> [!div class="checklist"]
>
> - Production challenges that durable execution solves for AI agents
> - Agentic workflow patterns supported by the Durable Task programming model
> - How the Durable Task tech stack compares to other agentic workflow options on Azure

## Production challenges durable execution solves

AI agents that do real work in production are typically long-running, stateful, and dependent on external tools and services. Human-in-the-loop interactions, multi-step reasoning chains, and tool-augmented workflows can keep an agent session active for hours, days, or even weeks. Throughout that time, the agent accumulates state, including conversation history, intermediate results, and pending decisions, that must be preserved across every step.

Processing large volumes of LLM tokens is expensive and time-consuming. Model providers can impose rate limits that throttle your agent mid-workflow. If an infrastructure failure, such as a VM restart or network outage, occurs partway through a multi-step agent task, the tokens already consumed and the time already spent are lost.

Interruptions to long-running agent workflows, whether from compute restarts, deployments, scale-in events, or transient infrastructure failures, compound these costs. Without a recovery mechanism, a crashed agent session must restart from the beginning, re-consuming all previously spent tokens and repeating all previously completed work.

Durable execution solves these challenges. The Durable Task runtime automatically checkpoints every state transition in an agent workflow (LLM responses, tool call results, and control flow decisions) to durable storage. When a failure occurs, execution resumes _automatically_ on a healthy VM from the last checkpoint rather than restarting from scratch. Completed LLM calls aren't repeated, preserving both token spend and wall-clock time. Built-in retry policies with configurable backoff handle transient failures from LLM APIs, external tools, and downstream services without any additional code.

## Agentic workflow patterns

Durable Task supports a range of agentic workflow patterns that fall into two broad categories:

- **Deterministic workflows**: Your code defines the control flow. You write the sequence of steps — including branching, parallelism, and error handling — using standard programming constructs. The LLM is called as a step within the workflow but doesn't control the overall flow.
- **Agent-directed workflows (agent loops)**: The LLM drives the control flow. The agent decides which tools to call, in what order, and when the task is complete. You provide tools and instructions, but the agent determines the execution path at runtime.

Both categories benefit from durable execution and can be combined in the same application. For a detailed look at the supported patterns with code samples, see [Agentic application patterns](./durable-agents-patterns.md).

## Compare agentic workflow options on Azure

Several options exist for building agentic workflows on Azure in addition to the Durable Task tech stack. Each option has different strengths and trade-offs depending on your requirements for control flow, programming language support, AI framework integration, hosting, state management, and target audience. The following table helps you decide which one fits your needs.

| Capability | Durable Task | Microsoft Agent Framework graph-based workflows | Logic Apps agent loop |
| --- | --- | --- | --- |
| **Control flow** | Code-defined (imperative) | Code-defined (graphs) | Designer / declarative (JSON) |
| **Programming languages** | .NET, Python, Java, TypeScript/JavaScript | .NET, Python | Visual designer / JSON |
| **AI framework support** | Any framework (Semantic Kernel, LangChain, AutoGen, etc.) or direct model API calls | Optimized for Microsoft Agent Framework | Built-in AI connectors |
| **Hosting** | Azure Functions (via Durable Functions) or any host (via Durable Task SDKs) | Any, with first-class [Foundry Hosted Agents](/azure/foundry/agents/concepts/hosted-agents) support | Azure Logic Apps managed service (Consumption or Standard SKU) |
| **State storage** | Durable Task Scheduler (managed) | Bring your own (extensible via checkpoint manager) | Logic Apps runtime (managed) |
| **Agent-directed workflows** | Build your own using orchestrations and entities, or use the [Durable Task extension for Microsoft Agent Framework](./durable-agents-microsoft-agent-framework.md) | Built-in | Yes, via the Agent Loop action |
| **Target audience** | Backend developers | Application developers | Integration developers / low-code users |
| **Long-running tasks** | First-class (hours / days / weeks / eternal) | Supported via developer-controlled workflow state checkpointing | Supported for _stateful_ workflows only (up to 90 days) |
| **Recovery from failure** | Automatic | Manual | Automatic |
| **Observability** | Execution history in the Durable Task Scheduler dashboard, OpenTelemetry | OpenTelemetry, custom visualization | Azure Monitor / Logic Apps diagnostics |

## Next steps

- [Agentic application patterns](./durable-agents-patterns.md)
- [Durable Task extension for Microsoft Agent Framework (Preview)](./durable-agents-microsoft-agent-framework.md)
- [Durable Task Scheduler overview](../scheduler/durable-task-scheduler.md)
