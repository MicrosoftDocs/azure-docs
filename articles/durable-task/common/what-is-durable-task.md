---
title: "Durable Execution Framework"
description: "Durable Task is Microsoft's durable execution framework for building fault-tolerant workflows as ordinary code. Learn how it works and get started."
author: cgillum
ms.author: cgillum
ms.reviewer: hannahhunter
ms.date: 04/22/2026
ms.topic: overview
ms.service: durable-task
titleSuffix: Durable Task
ai-usage: ai-assisted
#Customer intent: As a developer, I want to understand what Durable Task is and how it can help me build fault-tolerant, distributed applications.
---

# What is Durable Task?

Durable Task is Microsoft's implementation of *durable execution*, an industry-wide approach to making ordinary code fault-tolerant by automatically persisting its progress. It's a framework for building fault-tolerant workflows and orchestrations as ordinary code. Instead of managing complex retry logic, state machines, or message queues, you write your business logic as straightforward functions, and Durable Task handles state persistence, automatic recovery, and distributed coordination for you.

Durable Task workflows can run for hours, days, or even months, reliably resuming from the last completed step after any crash, restart, or redeployment. Common use cases include distributed transactions, multi-agent AI orchestration, data processing pipelines, and infrastructure management.

The rest of this article explains where Durable Task fits, the languages and hosting models it supports, and how it's structured, so you can decide how to build fault-tolerant applications with it.

## What Durable Task includes

Durable Task includes:

- The **[Durable Task SDKs](../sdks/durable-task-overview.md)** for self-hosted applications.
- The **[Durable Functions](../durable-functions/durable-functions-overview.md)** for serverless hosting on Azure Functions.
- The **[Durable Task Scheduler](../scheduler/durable-task-scheduler.md)**, a fully managed backend service purpose-built for durable workloads.

## Key Durable Task use cases

Use Durable Task when your application requires reliable, long-running workflow orchestration across distributed services. Common scenarios include:

- **Long-running processes**: Durable Task can manage state and progress for processes that run for extended periods, despite interruptions or errors. Examples include order processing, data pipelines, machine learning model training, and long-running simulations.
- **Parallel and fan-out/fan-in scenarios**: Durable Task can coordinate work that fans out across multiple workers running in parallel on different machines, and then aggregate the results. Examples include image processing, map-reduce jobs, and ETL workflows.
- **Orchestrating microservices and APIs**: Durable Task can coordinate work across distributed services, APIs, and machines with complex control flow and error handling. Durable Task also supports distributed transactions that use the saga pattern, where each step has compensating logic that runs automatically if a later step fails.
- **Business process automation**: Durable Task can automate complex, deterministic business processes that involve multiple steps, dependencies, human-in-the-loop, and error handling over long periods. Examples include supply chain management, document review, customer onboarding, and identity verification.
- **Infrastructure automation**: Durable Task can manage infrastructure provisioning, configuration, and deployment with complex dependencies and error handling. Examples include cloud resource management and CI/CD pipelines.
- **Multi-agent orchestration**: Durable Task can coordinate the work of multiple AI agents, ensuring reliable task-adherence over long horizons and efficient token usage for complex, multi-step AI processes. Examples include AI agents for deep research, coding, and customer support.

A common theme across these scenarios is that they involve work that's too complex, too long-running, or too distributed to manage reliably with ad hoc code. Durable Task provides the underlying guarantees—persistence, fault tolerance, and stateful coordination—so you can express that work as straightforward code.

## Supported languages and Durable Task hosting models

Durable Task supports multiple programming languages across two hosting models: **Azure Functions** (through the Durable Functions extension) and **self-hosted** (through the standalone Durable Task SDKs). The *Azure Functions* hosting model provides a fully managed, serverless compute environment with built-in scaling and orchestration features, while the *self-hosted* model supports running durable applications on any compute platform, such as Azure Container Apps, Azure Kubernetes Service, Azure App Service, or virtual machines.

| Language | Azure Functions | Self-hosted |
| - | :-: | :-: |
| .NET (C#/F#) | Yes | Yes |
| JavaScript/TypeScript | Yes | Yes |
| Python | Yes | Yes |
| Java | Yes | Yes |
| PowerShell | Yes | No |

> [!NOTE]
> [Durable Task Go SDK](https://github.com/microsoft/durabletask-go) is also available as a community-supported, open-source option for self-hosted scenarios, but is in experimental stages and not yet recommended for production use.

For guidance on choosing between Azure Functions and self-hosted, see [Choose your hosting model](./choose-orchestration-framework.md).

## Durable Task architecture: SDK and state storage backend

Durable Task has two main layers: an **SDK** that you use in your application code and a **state storage backend** that manages state.

### Durable Task SDK

You use the Durable Task SDK to author orchestrations, activities, and entities in your application code. It internally handles the mechanics of durable execution—replaying orchestrator functions, managing local execution context, and communicating with the state storage backend. Durable Task offers several SDK options across the supported languages and the two hosting models: Azure Functions and self-hosted.

For guidance on choosing between these options, see [Choose your hosting model](./choose-orchestration-framework.md).

### State storage backend

The state storage backend persists orchestration state, maintains the execution history, and coordinates distributed scale-out across compute instances.

The recommended state storage option is the **[Durable Task Scheduler](../scheduler/durable-task-scheduler.md)**—a fully managed Azure service that's purpose-built and highly optimized for Durable Task workloads. It works with both Durable Functions and the standalone Durable Task SDKs, and provides the richest set of features with no storage infrastructure to manage.

Alternatively, Durable Functions supports several **bring-your-own (BYO) storage** options. These options give you more control over where you store state, but require you to provision and manage the underlying infrastructure yourself. BYO storage backends are currently only available with Durable Functions.

For more information about storage options, see [Storage providers](durable-task-storage-providers.md).

## Additional Durable Task resources

### Research publications

Microsoft develops Durable Task in collaboration with Microsoft Research. As a result, the team produces research papers and artifacts, including:

* [Durable Functions: Semantics for Stateful Serverless](https://www.microsoft.com/research/uploads/prod/2021/10/DF-Semantics-Final.pdf) *(OOPSLA'21)*
* [Serverless Workflows with Durable Functions and Netherite](https://arxiv.org/pdf/2103.00033.pdf) *(preprint)*

### Video overview

The following video highlights the benefits of Durable Functions:

> [!VIDEO https://learn.microsoft.com/Shows/Azure-Friday/Durable-Functions-in-Azure-Functions/player]

## Next steps

> [!div class="nextstepaction"]
> [Choose your hosting model](./choose-orchestration-framework.md)

- [Durable Task for AI agents](../sdks/durable-task-for-ai-agents.md)
  - [Agentic application patterns](../sdks/durable-agents-patterns.md)
  - [Microsoft Agent Framework extension](../sdks/durable-agents-microsoft-agent-framework.md)
- Get started with:
  - [The Durable Task SDKs](../sdks/durable-task-overview.md)
  - [Durable Functions](../durable-functions/durable-functions-overview.md)
- [The Durable Task Scheduler](../scheduler/durable-task-scheduler.md)
