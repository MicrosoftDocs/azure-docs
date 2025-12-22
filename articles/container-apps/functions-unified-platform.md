---
title: Run event-driven and batch workloads with Azure Functions on Azure Container Apps
description: Learn how Azure Functions on Azure Container Apps enables you to run event-driven, batch, and API workloads with the flexibility of containers and the scalability of serverless computing.
services: azure-container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: overview
ms.date: 11/19/2025
ms.author: cshoe
---

# Run event-driven and batch workloads with Azure Functions on Azure Container Apps

Azure Functions on Azure Container Apps combines the productivity of Function-as-a-Service (FaaS) with the flexibility of containerized hosting. This integration allows you to deploy event-driven functions as continuous services while maintaining the ability to handle finite workloads with definitive start and end times.

This platform uses a rich set of triggers and bindings and incorporates advanced Azure Container Apps features, enabling it to execute virtually any containerized workload.

## Key benefits

The primary advantages of running Azure Functions on Azure Container Apps include:

- **Unified platform**: Run both event-driven and finite workloads on a single platform

- **Flexible hosting**: Use containerized environments with advanced deployment capabilities

- **Comprehensive triggers**: Support for HTTP, timer, storage, Event Hubs, Cosmos DB, and Service Bus triggers

- **Scalable architecture**: Automatic scaling with traffic splitting and revision management

## Common use cases

Azure Functions on Azure Container Apps is ideal for event-driven, batch, and API workloads that need rapid scaling, flexible deployment, and seamless integration with Azure services. The following table details the implementation and rationale associated with common scenarios.

| Scenario Type | Implementation | Rationale |
|---|---|---|
| Schedule tasks | Use Timer triggers that execute code on predefined timed intervals, such as executing data clean-up code or generating reports.  | Timer triggers reliably ensure code execution at specific, recurring intervals, defining a discrete task timeframe. |
| Batch or stream processing | Use Event Hubs triggers to capture and transform data from IoT or event source streams, or use blob or queue triggers with durable execution patterns (such as fan-out/fan-in) to process large datasets. | Functions efficiently process and transform data as soon as events arrive. |
| Machine learning<br>(inference/processing) | Functions can run AI inference by pulling data from a queue or integrating with services using bindings. GPU support is available on Azure Container Apps for compute-intensive machine learning workloads. | Functions can wrap the complex logic needed for model processing and leverage highly optimized hardware resources available on Azure Container Apps. |
| Event-driven workloads<br>(discrete) | Use Queue Storage triggers or Service Bus triggers where a message arrival instantly triggers processing. Durable Functions can orchestrate this workload. | Functions excel at immediate response to messages and events, managing message queues and processing event streams. |
| On-demand processing | Use HTTP triggers as webhooks or APIs to initiate processing upon request. For asynchronous work, the HTTP trigger can defer the actual work to a queue-triggered function. | HTTP endpoints allow manual or programmatic initiation of any workload, providing on-demand execution. |
| CI/CD runners<br>(agent execution) | Although typically containerized tasks, the required trigger logic (such as queue events) can be managed by Functions. The containerized function itself executes the necessary code in response to the event. | Functions provide the event processing, scaling, and execution environment necessary to run code triggered by external CI/CD platforms. |

Additionally, the following scenarios support critical capabilities:

### Event-driven processing

- Real-time data processing from various Azure services
- HTTP-triggered APIs and webhooks
- Timer-based scheduled tasks
- Message queue processing

### Finite and batch workloads

- Data transformation and ETL processes
- File processing and validation
- Scheduled maintenance tasks
- One-time data migration jobs

## Advanced capabilities

The following advanced scenarios feature Azure Functions on Azure Container Apps:

### GPU-accelerated workloads

With support for specialized hardware requirements, Azure Functions on Azure Container Apps can run workloads that demand advanced compute capabilities such as:

- **GPU-enabled compute**: Serverless GPU resources for AI and machine learning workloads

- **Dedicated workload profiles**: High-performance computing for intensive applications

- **Flexible scaling**: Scale GPU resources based on demand

### Complex stateful workflows

Azure Functions on Azure Container Apps supports advanced workflow management using Durable Functions including:

- **Stateful orchestration**: Manage complex, long-running processes

- **Human interaction patterns**: Support for approval workflows and user input

- **Monitoring and observability**: Built-in tracking for workflow execution

- **Extended processing time**: Handle processes that exceed standard limits

### Scalable web APIs

You can use advanced features such as custom ingress, traffic management featuring:

- **Custom ingress settings**: Advanced traffic routing and load balancing

- **High availability**: Built-in redundancy and failover

- **Performance optimization**: Automatic scaling based on traffic patterns

### Advanced deployment strategies

Azure Functions on Azure Container Apps offers sophisticated deployment management capabilities including:

- **Multi-revision support**: Run multiple versions simultaneously

- **Traffic splitting**: Gradual rollouts and A/B testing

- **Blue-green deployments**: Zero-downtime updates

- **Rollback capabilities**: Quick reversion to previous versions

### Microservices integration

Azure Functions on Azure Container Apps offers native Dapr integration including:

- **Service invocation**: Secure communication between services
- **Pub/Sub messaging**: Decoupled event-driven communication
- **State management**: Distributed state across services
- **Observability**: Built-in monitoring and tracing

## Next steps

- [Create your first Azure Function on Azure Container Apps](functions-container-apps.md)
- [Configure scaling in Azure Container Apps](./scale-app.md)
- [Learn about Dapr integration](./dapr-overview.md)
- [Explore deployment strategies](./revisions.md)
