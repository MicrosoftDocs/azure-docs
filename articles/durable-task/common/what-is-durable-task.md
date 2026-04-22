---
title: "What is Durable Task?"
description: "Discover what Durable Task is and how its SDKs, Durable Functions, and Durable Task Scheduler enable durable execution with horizontal scalability, fault tolerance, and automatic state persistence. Get started today."
author: cgillum
ms.author: cgillum
ms.reviewer: hannahhunter
ms.date: 02/14/2026
ms.topic: overview
ms.service: durable-task
titleSuffix: Durable Task
#Customer intent: As a developer, I want to understand what Durable Task is and how it can help me build fault-tolerant, distributed applications.
---

# What is Durable Task?

Durable Task is Microsoft's durable execution framework for building fault-tolerant workflows and orchestrations as ordinary code. Instead of managing complex retry logic, state machines, or message queues, you write your business logic as straightforward functions — Durable Task handles state persistence, automatic recovery, and distributed coordination for you.

Durable Task workflows can run for hours, days, or even months, reliably resuming from the last completed step after any crash, restart, or redeployment. Common use cases include distributed transactions, multi-agent AI orchestration, data processing pipelines, and infrastructure management.

Durable Task encompasses:
- The **[Durable Task SDKs](../sdks/durable-task-overview.md)** for self-hosted applications.
- The **[Durable Functions](../../azure-functions/durable-functions/durable-functions-overview.md)** for serverless hosting on Azure Functions
- The **[Durable Task Scheduler](../scheduler/durable-task-scheduler.md)**, a fully managed backend service purpose-built for durable workloads.

> [!NOTE]
> *Durable execution* is an industry-wide approach to making ordinary code fault-tolerant by automatically persisting its progress. Durable Task is Microsoft's implementation of durable execution.

## Key Durable Task use cases

Use Durable Task when your application requires reliable, long-running workflow orchestration across distributed services. Common scenarios include:

- **Long-running processes**: Durable Task can manage state and progress for processes that run for extended periods of time, even in the face of interruptions or errors. Examples include order processing, data pipelines, machine learning model training, and long-running simulations.
- **Parallel and fan-out/fan-in scenarios**: Durable Task can coordinate work that is fanned out across multiple workers running in parallel on different machines, and then aggregate results back together. Examples include image processing, map-reduce jobs, and ETL workflows.
- **Orchestrating microservices and APIs**: Durable Task can coordinate work across distributed services, APIs, and machines with complex control flow and error handling. Durable Task also enables implementing distributed transactions using the saga pattern, where each step has compensating logic that runs automatically if a later step fails.
- **Business process automation**: Durable Task can automate complex, deterministic business processes that involve multiple steps, dependencies, human-in-the-loop, and error handling over long periods of time. Examples include supply chain management, document review, customer onboarding, and identity verification.
- **Infrastructure automation**: Durable Task can manage infrastructure provisioning, configuration, and deployment with complex dependencies and error handling. Examples include cloud resource management and CI/CD pipelines.
- **Multi-agent orchestration**: Durable Task can coordinate work performed by multiple AI agents, ensuring reliable task-adherence over long horizons and efficient token usage for complex, multi-step AI processes. Examples include AI agents for deep research, coding, and customer support.

A common theme across these scenarios is that they involve work that is too complex, too long-running, or too distributed to manage reliably with ad-hoc code. Durable Task provides the underlying guarantees - persistence, fault tolerance, and stateful coordination - so you can express that work as straightforward code.

## Supported languages and Durable Task hosting models

Durable Task supports multiple programming languages across two hosting models: **Azure Functions** (via the Durable Functions extension) and **self-hosted** (via the standalone Durable Task SDKs). The *Azure Functions* hosting model provides a fully managed, serverless compute environment with built-in scaling and orchestration features, while the *self-hosted* model allows you to run durable applications on any compute platform of your choice, such as Azure Container Apps, Azure Kubernetes Service, Azure App Service, or virtual machines.

| Language | Azure Functions | Self-hosted |
| - | :-: | :-: |
| .NET (C#/F#) | ✅ | ✅ |
| JavaScript/TypeScript | ✅ | ✅ |
| Python | ✅ | ✅ |
| Java | ✅ | ✅ |
| PowerShell | ✅ | ❌ |

> [!NOTE]
> [Go](https://github.com/microsoft/durabletask-go) is also available as a community-supported, open-source SDK for self-hosted scenarios, but is currently in experimental stages and not yet recommended for production use.

For guidance on choosing between Azure Functions and self-hosted, see [Choose your hosting model](./choose-orchestration-framework.md).

## Architectural components

Durable Task has two main layers: an **SDK** that you use in your application code and a **state storage backend** that manages state.

### Durable Task SDK

The Durable Task SDK is what you use to author orchestrations, activities, and entities in your application code. It internally handles the mechanics of durable execution - replaying orchestrator functions, managing local execution context, and communicating with the state storage backend. Durable Task offers several SDK options for the different languages and hosting models mentioned previously.

For guidance on choosing between these options, see [Choose your hosting model](./choose-orchestration-framework.md).

### State storage backend

The state storage backend is responsible for persisting orchestration state, maintaining the execution history, and coordinating distributed scale-out across compute instances.

The recommended state storage option is the **[Durable Task Scheduler](../scheduler/durable-task-scheduler.md)** - a fully managed Azure service purpose-built and highly optimized for Durable Task workloads. It works with both Durable Functions and the standalone Durable Task SDKs, and provides the richest set of features with no storage infrastructure to manage.

Alternatively, Durable Functions supports several **bring-your-own (BYO) storage** options. These give you more control over where state is stored, but require you to provision and manage the underlying infrastructure yourself. BYO storage backends are currently only available with Durable Functions.

For more information about storage options, see [Storage providers](durable-task-storage-providers.md).

## Additional Durable Task resources

### Research publications

Durable Task is developed in collaboration with Microsoft Research. As a result, the team actively produces research papers and artifacts, including:

* [Durable Functions: Semantics for Stateful Serverless](https://www.microsoft.com/research/uploads/prod/2021/10/DF-Semantics-Final.pdf) *(OOPSLA'21)*
* [Serverless Workflows with Durable Functions and Netherite](https://arxiv.org/pdf/2103.00033.pdf) *(preprint)*

### Video overview

The following video highlights the benefits of Azure Durable Functions:

> [!VIDEO https://learn.microsoft.com/Shows/Azure-Friday/Durable-Functions-in-Azure-Functions/player]

## Next steps

> [!div class="nextstepaction"]
> [Choose your hosting model](./choose-orchestration-framework.md)

- [Durable Task for AI agents](../sdks/durable-task-for-ai-agents.md)
  - [Agentic application patterns](../sdks/durable-agents-patterns.md)
  - [Microsoft Agent Framework extension](../sdks/durable-agents-microsoft-agent-framework.md)
- Get started with:
  - [The Durable Task SDKs](../sdks/durable-task-overview.md)
  - [Durable Functions](../../azure-functions/durable-functions/durable-functions-overview.md)
- [The Durable Task Scheduler](../scheduler/durable-task-scheduler.md)
