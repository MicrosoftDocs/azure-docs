---
title: Azure Functions on Azure Container Apps overview
description: Learn how Azure Functions works with autoscaling rules in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic:  how-to
ms.date: 04/07/2025
ms.author: cshoe
---

# Azure Functions on Azure Container Apps overview

Azure Functions on Azure Container Apps is a fully managed hosting option that enables you to run serverless Functions within the Container Apps environment. It combines the event-driven programming model of Azure Functions with the scalability, flexibility, and advanced features of Container Apps -including Kubernetes-based orchestration, built-in autoscaling via KEDA, Dapr integration, Sidecar support, VNet support, and revision management. 

You can use this setup when you want your Functions to run alongside other containerized apps like microservices, APIs, or websites —especially when you need custom dependencies or want to take advantage of scale-to-zero for cost savings. If you're running compute-heavy tasks like AI inference, Container Apps also supports GPU-based hosting through serverless GPU offering and Dedicated workload profiles.

As an integrated feature on Azure Container Apps,  you can  deploy Azure Functions images directly onto Azure Container Apps using the `Microsoft.App` resource provider by setting `kind=functionapp` when calling `az containerapp create`. Apps created this way have access to all Azure Container Apps features. If deploying via Azure Portal, you can simply enable the “Optimize for Functions app” option during setup.

## Key benefits
The Container Apps hosting model builds on the flexibility of containerized workloads and the event-driven nature of Azure Functions. It offers the following key advantages:
- **Run Functions as containers** with custom dependencies and language stacks.
- **Scale in to zero and scale out to 1000 instances** using KEDA.
- **[Secure networking](../container-apps/networking.md)** with full [VNet integration](../container-apps/custom-virtual-networks.md).
- **Advanced [Container App features](../container-apps/overview.md#features)** like multi-revisions, traffic splitting, [Dapr integration](../container-apps/dapr-overview.md) and [observability components](../container-apps/observability.md).
- **[Serverless and Dedicated GPU](../container-apps/gpu-serverless-overview.md)** support for compute-intensive workloads.
- **Unified Container Apps environment** to run Functions alongside microservices, APIs, and background jobs.

The following table helps you compare the features of Functions on Container Apps with [Flex consumption plan](../azure-functions/flex-consumption-plan.md).

| Feature | Container Apps | Flex Consumption Plan |
| --- | --- | --- |
| Scale to zero | ✅ Yes (via KEDA) | ✅ Yes |
| Max scale-out | 1,000 (default 10, configurable) |	1,000 |
| Always-on instances | ✅ Yes (via `minReplicas`) | ✅ Yes (via always-ready instances) |
| VNet integration |	✅ Yes | ✅ Yes |
| Custom container support | ✅ Yes (bring your own image) | ❌ Limited (no bring your own container) |
| GPU support | ✅ Yes (via serverless GPU dedicated workload profile) | ❌ No |
| Built-in features | Container Apps feature support. For instance, KEDA, Dapr, multi-revisions, mTLS, sidecars, ingress control and more | Functions-only features |
| Billing model | Container Apps pricing: Consumption plan (vCPU, memory, requests) & Dedicated plan (workload profile based) | Execution-time + always-ready instances |

For a complete comparison of the Functions on Container Apps against Flex Consumption plan and all other plan and hosting types, see [Functions scale and hosting options](../azure-functions/functions-scale.md).

## Scenarios

Azure Functions on Container Apps are ideal for a wide range of use cases, especially when you need event-driven execution, container flexibility, or secure integration with other services:

- **Line-of-business APIs:** Package custom libraries, packages, and APIs with Functions for line-of-business applications.
- **Migration and modernization:** Migration of on-premises legacy and/or monolith applications to cloud native microservices on containers.
- **Event-driven processing:** Handle events from Event Grid, Service Bus, Event Hubs and other event sources with ease of Functions programming model.
- **AI & GPU workloads:** Serverless workload processing of videos, images, transcripts, or any other processing intensive tasks that required  GPU compute resources. Read more [here](../container-apps/gpu-serverless-overview.md).
- **Microservices:** Integrate Functions with other Container Apps hosted services.
- **Custom containers:** Package Functions with custom runtimes or sidecars.
- **Private apps:** Secure internal-only Functions using VNet and internal ingress.
- **General Functions:** Run any standard [Azure Functions scenarios](../azure-functions/functions-scenarios.md) (e.g., timers, file processing, database triggers).

## Deployment and Setup

To deploy Azure Functions on Azure Container Apps, you package your Functions app as a custom container image and deploy it like any other container app—with one key difference: set the `kind=functionapp` property when using the Azure CLI or ARM/Bicep templates.

<img width="752" height="278" alt="image" src="https://github.com/user-attachments/assets/1b1e70d1-e3bf-4103-b5b0-a7f03015b4db" />

_Create via CLI: Set “kind=functionapp” property_

In the Azure Portal, simply enable the “Optimize for Functions app” option during container app creation to streamline the setup.

<img width="752" height="594" alt="image" src="https://github.com/user-attachments/assets/db3aa864-556e-443a-9606-36d0a02113b5" />

_Create via Portal: Option to optimize for Azure Functions_

All standard deployment methods are supported, including:
- [Azure CLI](../container-apps/functions-usage.md?pivots=azure-cli)
- [Azure Portal](../container-apps/functions-usage.md?pivots=azure-portal)
- ARM templates / [Bicep](https://github.com/Azure/azure-functions-on-container-apps/tree/main/samples/ACAKindfunctionapp)
- CI/CD pipelines (e.g., GitHub Actions, Azure Pipelines)

For detailed steps and examples, refer to the official [getting started documentation](../container-apps/functions-usage.md).

## Pricing and billing
Azure Functions on Azure Container Apps follow the same pricing model as Azure Container Apps. Billing is based on the [plan type](../container-apps/plans.md) you select for your environment, which can be either Consumption or Dedicated.
- [Consumption plan](..//container-apps/billing.md#consumption-plan): This serverless compute option bills you only for the resources your apps use while they are running.
- [Dedicated plan](../container-apps/billing.md#consumption-dedicated): This option provides customized compute resources, billing you for the instances allocated to each workload profile.

Your choice of plan determines how billing calculations are made. Different applications within an environment can use different plans.

Key points to note:
- There are no additional charges for using the Azure Functions programming model within Container Apps.
- Durable Functions and other advanced patterns are supported and billed under the same Container Apps pricing model.
For detailed billing mechanics and examples, refer to the [Billing in Azure Container Apps](../container-apps/billing.md) documentation.

## Event-driven scaling

All Functions triggers are available in your containerized Functions app. However, only the following triggers can dynamically scale (from zero instances) based on received events when running in a Container Apps environment:

- Azure Event Grid
- Azure Event Hubs
- Azure Blob Storage (Event Grid based)
- Azure Queue Storage
- Azure Service Bus
- [Durable Functions (MSSQL storage provider)](../azure-functions/durable/durable-functions-mssql-container-apps-hosting.md)
- Durable Functions (DTS storage provider)
- HTTP
- Kafka
- Timer
- Azure Cosmos DB

Azure Functions on Azure Container Apps are designed to configure the scale parameters and rules as per the event target. You don't need to worry about configuring the KEDA scaled objects. You can still set minimum and maximum replica count when creating or modifying your Functions app.

You can write your Functions code in any [language stack supported](/azure/azure-functions/supported-languages?tabs=isolated-process%2Cv4&pivots=programming-language-csharp) by Azure Functions. You can use the same Functions triggers and bindings with event-driven scaling.

## Managed identity authorization

To adhere to security best practices, connect to remote services using Microsoft Entra authentication and managed identity authorization.

Managed identities are available for the following connections:

- [Default storage account](../azure-functions/functions-reference.md#connecting-to-host-storage-with-an-identity) (AzureWebJobsStorage)
- Azure Container Registry: When running in Container Apps, you can use Microsoft Entra ID with managed identities for all binding extensions that support managed identities. Currently, only these binding extensions support event-driven scaling when using managed identity authentication:
- Azure Event Hubs
- Azure Queue Storage
- Azure Service Bus

For other bindings, use fixed replicas when using managed identity authentication. For more information, see the [Functions developer guide](/azure/azure-functions/functions-reference).

## Scaling and performance

Azure Functions on Container Apps scale automatically based on events using KEDA, with no need to configure scale rules manually. You can still set min/max replicas to control scaling behavior.

- **Event-driven scaling**: Automatically scales based on triggers like Event Grid, Service Bus, or HTTP.
- **Scale to zero**: Idle apps scale-in to zero to save costs.
- **Cold start control**: Avoid cold starts by setting `minReplicas` ≥ 1.
- **Concurrency**: Each instance can process multiple events in parallel.
- **High scale**: Scale out to 1,000 instances per app (default is 10).
- **GPU support**: Run compute-heavy workloads like AI inference using GPU-backed nodes.

This makes Container Apps ideal for both bursty and steady-state workloads. To learn more, see [Set scaling rules in Azure Container Apps](../container-apps/scale-app.md)

## Networking and security

Azure Functions on Container Apps benefit from Container Apps’ robust [networking](../container-apps/networking.md) and [security features](../container-apps/security.md) for secure, scalable deployments:

- **VNet integration**: Access private resources securely via internal endpoints and private databases.
- **Managed identity**: Authenticate with Azure services using system/user-assigned identities—no secrets or connection strings needed.
- **Dapr support**: Enable pub/sub, state management, and secure service invocation via Dapr sidecars. For more information, see [Microservice APIs powered by Dapr](../container-apps/dapr-overview.md).
- **Ingress and TLS**: Expose secure HTTP endpoints with TLS/mTLS, custom domains, or keep them internal.
- **Environment Isolation**: Functions share Container Apps environment boundaries for secure, scoped communication.

These capabilities make Container Apps-hosted Functions ideal for enterprise-grade, secure serverless applications.

## Monitoring and Logging

Azure Functions on Container Apps integrate seamlessly with Azure’s observability tools for performance tracking and issue diagnosis:

- **Application Insights:** Provides telemetry for requests, dependencies, exceptions, and custom traces. For more information, see [Monitor Azure Functions](../azure-functions/monitor-functions.md).  
- **Log analytics:** Captures container lifecycle and scaling events (e.g., FunctionsScalerInfo entries). For more information, see [Application Logging in Azure Container Apps](../container-apps/logging.md).  
- **Custom logging:** Supports standard frameworks like ILogger and console logging for structured output.  
- **Centralized monitoring:** Container Apps environment offers unified dashboards and alerts across all apps.

## Submit Feedback

Submit an issue or a feature request to the [Azure Container Apps GitHub repo](https://github.com/microsoft/azure-container-apps/issues).

## Next Steps / Further Resources

To continue learning and building with Azure Functions on Container Apps, explore the following resources:

- [Getting started](../container-apps/functions-usage.md) – Step-by-step guide to deploying and configuring Functions in Container Apps.
- [Azure Container Apps documentation](../container-apps/billing.md) – Full reference for Container Apps features including scaling, networking, Dapr, and workload profiles.
- [Azure Container Apps pricing](https://azure.microsoft.com/en-us/pricing/details/container-apps/) – Details on consumption-based billing and Dedicated plan costs.
- [Azure Functions hosting options](../azure-functions/functions-scale.md) – Comparison of hosting plans including Container Apps, Flex Consumption, Premium, and Dedicated.
- [Azure Functions developer guide](../azure-functions/functions-reference.md) – Deep dive into triggers, bindings, runtime behavior, and configuration.
  
