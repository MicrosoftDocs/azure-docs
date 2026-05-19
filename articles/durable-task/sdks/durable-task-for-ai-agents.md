---
title: "Durable Task for AI Agents - Azure"
description: Learn how durable execution on Azure provides fault-tolerant, scalable infrastructure for production AI agents using Durable Functions, Durable Task SDKs, and the Durable Task Scheduler.
author: cgillum
ms.topic: conceptual
ms.date: 05/05/2026
ms.author: cgillum
---

# Durable Task for AI agents

AI agents that run for hours, call external tools, and must survive infrastructure failures need _durable execution_ — the ability to automatically checkpoint progress and resume from where they left off. The [Durable Task Scheduler](../scheduler/durable-task-scheduler.md) and Durable Task programming model provide this infrastructure, handling state management, checkpointing, and distributed coordination so your agent code doesn't have to.

With this programming model, you build resilient, stateful agentic workflows using standard programming constructs (loops, conditionals, error handling) in .NET, Python, Java, and JavaScript/TypeScript. The runtime persists state and recovers from failures automatically.

Durable Task isn't an agent framework — it works _with_ any AI agent framework, including Microsoft Agent Framework, LangChain, or direct LLM API calls. You focus on agent logic; Durable Task handles reliable execution at scale.

In this article, you learn about:

> [!div class="checklist"]
>
> - Production challenges that durable execution solves for AI agents
> - Agentic workflow patterns supported by the Durable Task programming model
> - How the Durable Task tech stack compares to other agentic workflow options on Azure

> [!TIP]
> **Ready to start building?** Jump to [Agentic application patterns](./durable-agents-patterns.md) for code samples, or try the [Durable Task extension for Microsoft Agent Framework](./durable-agents-microsoft-agent-framework.md) for a turnkey integration.

## Production challenges durable execution solves

AI agents in production face several challenges that durable execution addresses:

- **Long-running, stateful sessions** — Human-in-the-loop interactions, multi-step reasoning, and tool-augmented workflows can keep an agent active for hours, days, or weeks. The agent accumulates state (conversation history, intermediate results, pending decisions) that must be preserved across every step.
- **Expensive token consumption** — Processing large volumes of LLM tokens is costly and time-consuming. Rate limits can throttle your agent mid-workflow. If a failure occurs partway through, tokens already consumed and time already spent are lost.
- **Infrastructure interruptions** — Compute restarts, deployments, scale-in events, and transient failures can crash an agent session. Without recovery, the agent must restart from the beginning, re-consuming all previously spent tokens and repeating all completed work.

Durable execution solves these challenges:

- **Automatic checkpointing** — The Durable Task runtime checkpoints every state transition (LLM responses, tool call results, control flow decisions) to durable storage.
- **Resume from last checkpoint** — When a failure occurs, execution resumes _automatically_ on a healthy VM. Completed LLM calls aren't repeated, preserving both token spend and wall-clock time.
- **Built-in retries** — Configurable retry policies with backoff handle transient failures from LLM APIs, external tools, and downstream services without additional code.

## Agentic workflow patterns

Durable Task supports a range of agentic workflow patterns that fall into two broad categories:

- **Deterministic workflows**: Your code defines the control flow. You write the sequence of steps — including branching, parallelism, and error handling — using standard programming constructs. The LLM is called as a step within the workflow but doesn't control the overall flow.
- **Agent-directed workflows (agent loops)**: The LLM drives the control flow. The agent decides which tools to call, in what order, and when the task is complete. You provide tools and instructions, but the agent determines the execution path at runtime.

Both categories benefit from durable execution and can be combined in the same application. For a detailed look at the supported patterns with code samples, see [Agentic application patterns](./durable-agents-patterns.md).

## Compare agentic workflow options on Azure

Several options exist for building agentic workflows on Azure in addition to the Durable Task tech stack. Each option has different strengths and trade-offs depending on your requirements for control flow, programming language support, AI framework integration, hosting, state management, and target audience. The following table helps you decide which one fits your needs.

| Capability | Durable Task | Agent Framework workflows | Logic Apps agent loop |
| --- | --- | --- | --- |
| **Control flow** | Imperative (code-defined) | Graph-based (code-defined) | Declarative (designer / JSON) |
| **Languages** | .NET, Python, Java, TypeScript/JS | .NET, Python | Visual designer / JSON |
| **AI framework support** | Any (Semantic Kernel, LangChain, AutoGen, direct API) | Optimized for Agent Framework | Built-in AI connectors |
| **Hosting** | Azure Functions or any host | Any; first-class [Foundry Hosted Agents](/azure/foundry/agents/concepts/hosted-agents) | Logic Apps managed service |
| **State storage** | Durable Task Scheduler (managed) | Bring your own (checkpoint manager) | Logic Apps runtime (managed) |
| **Agent-directed workflows** | Build your own, or use the [Durable Task extension](./durable-agents-microsoft-agent-framework.md) | Built-in | Agent Loop action |
| **Target audience** | Backend developers | Application developers | Integration / low-code users |
| **Long-running tasks** | First-class (hours to eternal) | Via developer-controlled checkpointing | Stateful workflows only (up to 90 days) |
| **Failure recovery** | Automatic | Manual | Automatic |
| **Observability** | Scheduler dashboard, OpenTelemetry | OpenTelemetry, custom visualization | Azure Monitor, Logic Apps diagnostics |

## Next steps

- [Agentic application patterns](./durable-agents-patterns.md)
- [Durable Task extension for Microsoft Agent Framework (Preview)](./durable-agents-microsoft-agent-framework.md)
- [Durable Task Scheduler overview](../scheduler/durable-task-scheduler.md)
