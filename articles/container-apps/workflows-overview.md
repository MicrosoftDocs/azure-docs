---
title: Workflow in Azure Container Apps
description: Learn how to build and scale durable workflows on Azure Container Apps with the Durable Task SDKs, Durable Task Scheduler, or Durable Functions.
services: container-apps, azure-functions
author: vyomnagrani
ms.service: azure-container-apps
ms.topic: overview
ms.date: 11/23/2026
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

Events such as temporary infrastructure failures or dependency downtime can interrupt workflow execution. Durable execution persists workflow state so a workflow can resume after a process or replica stops.

## Durable execution 

Durable execution provides a way to run code and persist workflow state. If a process stops, the workflow can resume from its last recorded point. You can configure retry policies for operations that fail.

You can build durable workflows in Azure Container Apps by using the Durable Task SDKs or Durable Functions. Both can use the Durable Task Scheduler as a managed backend. Container Apps runs your application code, and the scheduler persists workflow state and coordinates work.

## Workflow frameworks for developers in Azure

Azure provides two code-oriented workflow frameworks you can use to build apps that run on Azure Container Apps:
- **Durable Task SDKs**
- **Durable Functions** 

The Durable Task SDKs are portable libraries for apps that run in your own worker process. Durable Functions runs in the Azure Functions host and provides Functions triggers and bindings.

### Durable Task SDKs

The Durable Task SDKs are lightweight client libraries for authoring workflows in your application code. They let your app connect to a workflow engine hosted in Azure called the [Durable Task Scheduler](../durable-task/scheduler/durable-task-scheduler.md). A worker in your Container App runs orchestration and activity code. The scheduler stores workflow state and dispatches work to workers, which you can scale independently from the scheduler.

To scale Container Apps workers based on pending orchestration, activity, or entity work, use the [Durable Task Scheduler KEDA scaler](../durable-task/sdks/durable-task-scheduler-auto-scaling.md).

#### SDK availability

| Language | Status | Source |
|---|---|---|
| .NET (C#) | GA | [durabletask-dotnet](https://github.com/microsoft/durabletask-dotnet) |
| Python | GA | [durabletask-python](https://github.com/microsoft/durabletask-python) |
| Java | GA | [durabletask-java](https://github.com/microsoft/durabletask-java) |
| JavaScript / TypeScript | GA | [durabletask-js](https://github.com/microsoft/durabletask-js) |
| [Go](../durable-task/sdks/durable-task-go.md) | Preview | [durabletask-go](https://github.com/microsoft/durabletask-go) |

> [!NOTE]
> The Go Durable Task SDK is in preview. For Go-specific requirements and compatibility details, see [Develop with the Durable Task SDK for Go](../durable-task/sdks/durable-task-go.md). To learn which framework is recommended for production use, see [Choose your orchestration framework](../durable-task/common/choose-orchestration-framework.md).

#### Quickstarts

Try configuring the Durable Task SDKs for your container app by using the following quickstarts.

| Quickstart | Description | 
| ---------- | ----------- |
| [Create an app with Durable Task SDKs and Durable Task Scheduler](../durable-task/sdks/quickstart-portable-durable-task-sdks.md) | Create workflows that use the fan-out/fan-in pattern. Available for .NET, Python, Java, and JavaScript/TypeScript. |
| [Host a Durable Task SDK app on Azure Container Apps](../durable-task/sdks/quickstart-container-apps-durable-task-sdk.md) | Use the Azure Developer CLI to create Durable Task Scheduler resources and deploy them to Azure with two container apps running workflow tasks. Available for .NET, Python, Java, and JavaScript/TypeScript. |

### Durable Functions 

As an extension of Azure Functions, [Durable Functions](../durable-task/durable-functions/durable-functions-overview.md) runs in the Functions host. In Container Apps, it provides:
- Integrations with other Azure services through Azure Functions [triggers and bindings](../azure-functions/functions-triggers-bindings.md)
- The Azure Functions local development experience

For hosting requirements and limitations, see [Azure Functions on Azure Container Apps](functions-overview.md).

### Durable execution for AI agents

AI agents that run for hours, call external tools, and must survive infrastructure failures are a natural fit for durable execution. The Durable Task programming model handles the challenges common in production agent workloads:

- **Checkpoint large language model (LLM) calls**: Put each call in an activity so the workflow can record its result and resume from its history after a process stops.
- **Human-in-the-loop approval**: Pause an agent workflow to wait for a person to approve or reject a step, with configurable timeouts.
- **Retry flaky tool and model calls**: Configure retry policies with backoff to handle transient failures from LLM APIs and external services.
- **Survive replica restarts**: On Container Apps, scale-in events and deployments can recycle replicas. Durable execution lets the agent resume from its last recorded point on a new replica.

To learn more, see [Durable Task for AI agents](../durable-task/sdks/durable-task-for-ai-agents.md) and [Agentic application patterns](../durable-task/sdks/durable-agents-patterns.md).

## Why Azure Container Apps for workflows

Azure Container Apps provides several platform capabilities that complement durable execution:

- **Scale to zero**: Set the worker app's minimum replica count to zero to reduce idle compute. When work arrives, the app might have cold-start latency.
- **Event-driven scaling with KEDA**: Scale worker replicas based on pending orchestration, activity, or entity work by using the [Durable Task Scheduler KEDA scaler](../durable-task/sdks/durable-task-scheduler-auto-scaling.md). Worker apps scale independently from the managed Scheduler resource.
- **Managed identity**: Use [managed identity](../container-apps/managed-identity.md) to authenticate your container apps to the Durable Task Scheduler and other Azure services. See [Configure managed identity for Durable Task Scheduler](../durable-task/scheduler/durable-task-scheduler-identity.md).
- **Built-in observability**: Stream container app logs to [Azure Monitor](../container-apps/log-monitoring.md) and use the [Durable Task Scheduler dashboard](../durable-task/scheduler/durable-task-scheduler-dashboard.md) to review orchestration history.
- **Ingress and networking**: Expose your client container app with [built-in ingress](../container-apps/ingress-overview.md) while keeping worker apps internal.

## How to choose 

You can host applications built with either the Durable Task SDKs or Durable Functions in Azure Container Apps. The following table provides a quick comparison to help you decide:

| Feature | Durable Task SDKs | Durable Functions |
|---|---|---|
| **Compute coupling** | Decoupled, runs on Container Apps | Coupled to the Azure Functions runtime |
| **Languages (GA)** | .NET, Python, Java, JavaScript/TypeScript | .NET, Python, Java, JavaScript, PowerShell |
| **Languages (Preview)** | Go | Not available |
| **Triggers and bindings** | You define your own entry points | Built-in Azure Functions triggers (HTTP, Queue, Timer, Event Grid, and more) |
| **Storage backends** | Durable Task Scheduler | Durable Task Scheduler and other Durable Functions storage providers |
| **Pricing model** | Pay for Container Apps compute. Durable Task Scheduler charges are separate. | Pay for Container Apps compute. Durable Task Scheduler charges are separate when you use Scheduler. |
| **Portability** | Runs on Container Apps, Azure Kubernetes Service (AKS), Azure App Service, and virtual machines (VMs) | Requires the Azure Functions runtime |

Container Apps compute charges and Durable Task Scheduler charges are separate. See [Durable Task Scheduler billing](../durable-task/scheduler/durable-task-scheduler-billing.md) and [Azure Container Apps pricing](https://azure.microsoft.com/pricing/details/container-apps/). For provider-specific behavior, see [Choose your orchestration framework](../durable-task/common/choose-orchestration-framework.md).

## Next steps

> [!div class="nextstepaction"]
> [Host a Durable Task SDK app on Azure Container Apps](../durable-task/sdks/quickstart-container-apps-durable-task-sdk.md)

- [Configure Durable Task Scheduler autoscaling for Container Apps](../durable-task/sdks/durable-task-scheduler-auto-scaling.md)
- [Configure managed identity for Durable Task Scheduler](../durable-task/scheduler/durable-task-scheduler-identity.md)
- [Learn more about the Durable Task Scheduler](../durable-task/scheduler/durable-task-scheduler.md)
- [Develop locally with the Durable Task Scheduler emulator](../durable-task/scheduler/develop-with-durable-task-scheduler.md)
- [Monitor workflows with the Durable Task Scheduler dashboard](../durable-task/scheduler/durable-task-scheduler-dashboard.md)
- [Durable Task for AI agents](../durable-task/sdks/durable-task-for-ai-agents.md)
- [OpenTelemetry tracing for Durable Task](../durable-task/sdks/durable-task-scheduler-opentelemetry-tracing.md) 