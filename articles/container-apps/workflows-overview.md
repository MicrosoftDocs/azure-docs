---
title: Workflow in Azure Container Apps
description: Learn about your workflow options for Azure Container Apps.
services: container-apps, azure-functions
author: lilyjma
ms.service: azure-container-apps
ms.topic: overview
ms.date: 07/29/2026
ms.author: jiayma
ms.reviewer: cshoe, hannahhunter
ms.custom:
  - build-2025
---

# Workflow in Azure Container Apps

> [!NOTE]
> The term *workflow* often has multiple meanings. In the context of Durable Functions, you might see workflows referred to as orchestrations. To avoid any confusion with container orchestrations, this article uses the term workflow instead.
>
> This article covers *code-oriented* workflow frameworks (Durable Task SDKs and Durable Functions). For *low-code / declarative* workflows, see [Azure Logic Apps Standard on Azure Container Apps](/azure/logic-apps/create-standard-workflows-hybrid-deployment). 

A workflow is a multistep operation that usually occurs in a specific order or involves long-running tasks. Real-world scenarios requiring workflows include:
- Order processing
- AI agent orchestration
- Infrastructure management
- Data processing pipelines 

Events like temporary infrastructure failures or dependency downtime can often interrupt workflow execution. To prevent interruptions, use *durable execution*, which continues from the point of failure instead of restarting.

## Durable execution 

Durable execution provides a fault-tolerant approach to running code and handles failures gracefully through automatic retries and state persistence. Durable execution is built on three core principles:

- **Incremental execution:** Each operation is executed independently and in order.
- **State persistence:** The output of each step is saved to ensure progress isn't lost.
- **Fault tolerance:** If a step fails, the operation is retried from the last successful step, skipping previously completed steps.

Durable execution benefits scenarios that require stateful chaining of operations. It simplifies the implementation of complex, long-running, stateful, and fault-tolerant application patterns. 

You can achieve durable execution in your workflows in Azure Container Apps by using one of the Azure-managed workflow frameworks.

## Workflow frameworks for developers in Azure

Azure provides two code-oriented workflow frameworks you can use to build apps that run on Azure Container Apps: 
- **Durable Task SDKs**
- **Durable Functions** 

These frameworks are designed for developers and are available in multiple programming languages. 

### Durable Task SDKs

The Durable Task SDKs are lightweight client SDKs that provide an unopinionated programming model for authoring workflows. Unlike Durable Functions, which is tightly coupled with the Functions compute, these portable SDKs are decoupled from any compute. They allow your app to connect to a workflow engine hosted in Azure called the [Durable Task Scheduler](../durable-task/scheduler/durable-task-scheduler.md). 

To ensure durable execution, the Durable Task SDKs require a storage backend to persist workflow state as the app runs. The Durable Task Scheduler backend continuously checkpoints workflow state as the app runs and automatically handles retries to ensure durable execution. The scheduler is responsible for:

- Schedules and manages workflow task execution.
- Stores and maintains workflow state.
- Handles persistence, failures, and retries.
- Load balances orchestration execution at scale on your container app.

#### SDK availability

| Language | Status |
|---|---|
| .NET (C#) | GA |
| Python | GA |
| Java | GA |
| JavaScript / TypeScript | Preview |

> [!NOTE]
> The JavaScript / TypeScript Durable Task SDK is currently in preview. [Learn which framework is recommended for production use.](../durable-task/common/choose-orchestration-framework.md)

#### Quickstarts

Try out configuring the Durable Task SDKs for your container app by using the following quickstarts.

| Quickstart | Description | 
| ---------- | ----------- |
| [Create an app with Durable Task SDKs and Durable Task Scheduler](../durable-task/sdks/quickstart-portable-durable-task-sdks.md) | Create workflows that use the fan-out/fan-in pattern. Available for .NET, Python, Java, and JavaScript/TypeScript. |
| [Host a Durable Task SDK app on Azure Container Apps](../durable-task/sdks/quickstart-container-apps-durable-task-sdk.md) | Use the Azure Developer CLI to create Durable Task Scheduler resources and deploy them to Azure with two container apps running workflow tasks. Available for .NET, Python, Java, and JavaScript/TypeScript. |

### Durable Functions 

As a feature of Azure Functions, [Durable Functions](../durable-task/durable-functions/durable-functions-overview.md) inherits many characteristics of Azure Functions as a code-oriented workflow framework offering in Azure. For example, by using Durable Functions, you benefit from:
- Integrations with other Azure services through Azure Functions [triggers and bindings](../azure-functions/functions-triggers-bindings.md)
- Local development experience
- Serverless pricing model 

### Durable execution for AI agents

AI agents that run for hours, call external tools, and must survive infrastructure failures are a natural fit for durable execution. The Durable Task programming model handles the challenges common in production agent workloads:

- **Checkpoint every large language model (LLM) call**: If a failure occurs mid-workflow, the agent resumes from the last checkpoint instead of re-consuming tokens and repeating completed work.
- **Human-in-the-loop approval**: Pause an agent workflow to wait for a person to approve or reject a step, with configurable timeouts.
- **Retry flaky tool and model calls**: Built-in retry policies with backoff handle transient failures from LLM APIs and external services.
- **Survive pod restarts**: On Container Apps, scale-in events and deployments can recycle replicas. Durable execution picks up exactly where the agent left off on a new replica.

To learn more, see [Durable Task for AI agents](../durable-task/sdks/durable-task-for-ai-agents.md) and [Agentic application patterns](../durable-task/sdks/durable-agents-patterns.md).

## Why Azure Container Apps for workflows

Azure Container Apps provides several platform capabilities that complement durable execution:

- **Scale to zero**: Worker container apps scale down to zero replicas when there are no pending workflow tasks, so you pay only for active compute.
- **Event-driven scaling with KEDA**: Scale worker replicas based on orchestration and activity backlog using [KEDA scalers](../container-apps/scale-app.md), matching compute to workload demand.
- **Managed identity**: Use [managed identity](../container-apps/managed-identity.md) to authenticate your container apps to the Durable Task Scheduler and other Azure services without managing credentials.
- **Built-in observability**: Stream container app logs to [Azure Monitor](../container-apps/log-monitoring.md) and pair them with the [Durable Task Scheduler dashboard](../durable-task/scheduler/durable-task-scheduler-dashboard.md) for end-to-end visibility into workflow execution.
- **Ingress and networking**: Expose your client container app with [built-in ingress](../container-apps/ingress-overview.md) while keeping worker apps internal.

## How to choose 

You can host applications built with either the Durable Task SDKs or Durable Functions in Azure Container Apps. The following table provides a quick comparison to help you decide:

| Feature | Durable Task SDKs | Durable Functions |
|---|---|---|
| **Compute coupling** | Decoupled - runs on any container platform | Coupled to the Azure Functions runtime |
| **Languages (GA)** | .NET, Python, Java | .NET, Python, Java, JavaScript, PowerShell |
| **Languages (Preview)** | JavaScript / TypeScript | Not available |
| **Triggers and bindings** | You define your own entry points | Built-in Azure Functions triggers (HTTP, Queue, Timer, Event Grid, and more) |
| **Storage backends** | Durable Task Scheduler | Durable Task Scheduler, Azure Storage, MSSQL, Netherite |
| **Pricing model** | Pay for your container app compute | Serverless (Consumption) or container app compute |
| **Portability** | Runs unchanged on Azure Kubernetes Service (AKS), Azure App Service, and virtual machines (VMs) | Requires Azure Functions runtime |

For detailed guidance, see [Choose your orchestration framework](../durable-task/common/choose-orchestration-framework.md). 

## Next steps

> [!div class="nextstepaction"]
> [Learn more about the Durable Task Scheduler](../durable-task/scheduler/durable-task-scheduler.md)

- [Develop locally with the Durable Task Scheduler emulator](../durable-task/scheduler/develop-with-durable-task-scheduler.md)
- [Monitor workflows with the Durable Task Scheduler dashboard](../durable-task/scheduler/durable-task-scheduler-dashboard.md)
- [Durable Task for AI agents](../durable-task/sdks/durable-task-for-ai-agents.md)
- [OpenTelemetry tracing for Durable Task](../durable-task/sdks/durable-task-scheduler-opentelemetry-tracing.md) 