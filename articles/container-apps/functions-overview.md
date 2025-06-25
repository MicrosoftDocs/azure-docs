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

Azure Functions provides integrated support for developing, deploying, and managing containerized function apps on Azure Container Apps. Use Azure Container Apps for your Functions apps when you need to run in the same environment as other microservices, APIs, websites, workflows, or any container hosted programs.

Container Apps hosting lets you run your functions in a fully supported and managed, container-based environment with built-in support for open-source monitoring, mTLS, Dapr, and Kubernetes Event-driven Autoscaling (KEDA).

As an integrated feature on Azure Container Apps,  you can  deploy Azure Functions images directly onto Azure Container Apps using the `Microsoft.App` resource provider by setting `kind=functionapp` when calling `az containerapp create`. Apps created this way have access to all Azure Container Apps features.

This article shows you how to create and deploy an Azure Functions app that runs within Azure Container Apps. You learn how to:

- Set up a containerized Functions app with preconfigured auto scaling rules
- Deploy your application using either the Azure portal or Azure CLI
- Verify your deployed function with an HTTP trigger

By running Functions in Container Apps, you benefit from automatic scaling, easy configuration, and a fully managed container environment—all without having to manage the underlying infrastructure yourself.

## Key Benefits
The Container Apps (ACA) hosting model builds on the flexibility of containerized workloads and the event-driven nature of Azure Functions. It offers the following key advantages:
- **Run functions as containers** with custom dependencies and language stacks.
- **Scale to zero and up to 1000 instances** using KEDA.
- **Secure networking** with full VNet integration.
- **Advanced deployment features** like revisions, traffic splitting, and Dapr integration.
- **[Serverless and Dedicated GPU](../container-apps/gpu-serverless-overview.md)** support for compute-intensive workloads.
- **Unified ACA environment** to run Functions alongside microservices, APIs, and background jobs.

This table helps you directly compare the features of function on ACA with Flex consumption and classic consumption plan.
| Feature |	Container Apps (ACA) | Flex Consumption Plan |
| --- | --- | --- |
| Scale to Zero |	Yes (via KEDA) | Yes |
| Max Scale-Out | 1000 (default 10, configurable) |	1000 |
| Always-On Instances |	Yes (via minReplicas) |	Yes (via always-ready instances) |
| VNet Integration |	Yes |	Yes |
| Custom Container Support | Yes (bring your own image) |	Limited (no bring your own container) |
| GPU Support | Yes (via Serverless GPU Dedicated workload profile) | No |
| Built-in Features |	ACA feature support e.g. KEDA, Dapr, Multi-revisions, mTLS, sidecars, Ingress control and more |	Functions-only features |
| Billing Model |	ACA pricing: Consumption plan (vCPU, memory, requests) & Dedicated plan (workload profile based) |	Execution-time + always-ready instances |

For a complete comparison of the Function on ACA against Flex Consumption plan and all other plan and hosting types, see [function scale and hosting options](../azure-functions/functions-scale.md).

## Scenarios

Azure Functions on Container Apps provide a versatile combination of services to meet the needs of your applications. The following scenarios are representative of the types of situations where paring Azure Container Apps with Azure Functions gives you the control and scaling features you need.

- **Line-of-business APIs**: Package custom libraries, packages, and APIs with Functions for line-of-business applications.

- **Migration support**: Migration of on-premises legacy and/or monolith applications to cloud native microservices on containers.

- **Event-driven architecture**: Supports event-driven applications for workloads already running on Azure Container Apps.

- **Serverless workloads**: Serverless workload processing of videos, images, transcripts, or any other processing intensive tasks that required  GPU compute resources.

- **Common Azure Functions scenarios**: All common Azure Functions scenarios like processing file uploads, running scheduled tasks, responding to database changes, machine learning/AI and others detailed in [Azure Functions scenarios](/azure/azure-functions/functions-scenarios?pivots=programming-language-csharp).

## Pricing and Billing
Azure Functions on Azure Container Apps (ACA) follows the same pricing model as Azure Container Apps. Billing is based on the [plan type](../container-apps/plans.md) you select for your environment, which can be either Consumption or Dedicated.
- [Consumption plan](..//container-apps/billing.md#consumption-plan): This serverless compute option bills you only for the resources your apps use while they are running.
- [Dedicated plan](../container-apps/billing.md#consumption-dedicated): This option provides customized compute resources, billing you for the instances allocated to each workload profile.

Your choice of plan determines how billing calculations are made. Different applications within an environment can use different plans.

Key points to note:
- There are no additional charges for using the Azure Functions programming model within ACA.
- Durable Functions and other advanced patterns are supported and billed under the same ACA pricing model.
For detailed billing mechanics and examples, refer to the [Billing in Azure Container Apps](../container-apps/billing.md) documentation.

## Event-driven scaling

All Functions triggers are available in your containerized Functions app. However, only the following triggers can dynamically scale (from zero instances) based on received events when running in a Container Apps environment:

- Azure Event Grid
- Azure Event Hubs
- Azure Blob Storage (Event Grid based)
- Azure Queue Storage
- Azure Service Bus
- [Durable Functions (MSSQL storage provider)](../azure-functions/durable/durable-functions-mssql-container-apps-hosting.md)
- HTTP
- Kafka
- Timer
- Azure Cosmos DB

Azure Functions on Container Apps are designed to configure the scale parameters and rules as per the event target. You don't need to worry about configuring the KEDA scaled objects. You can still set minimum and maximum replica count when creating or modifying your function app.

Auto scaling for Azure Cosmos DB trigger and Durable functions is currently supported using connection strings only.

You can write your function code in any [language stack supported](/azure/azure-functions/supported-languages?tabs=isolated-process%2Cv4&pivots=programming-language-csharp) by Azure Functions. You can use the same Functions triggers and bindings with event-driven scaling.

## Managed identity authorization

To adhere to security best practices, connect to remote services using Microsoft Entra authentication and managed identity authorization.

Managed identities are available for the following connections:

- [Default storage account](/azure/azure-functions/functions-reference) (AzureWebJobsStorage)
- [Azure Container Registry](/azure/azure-functions/functions-deploy-container-apps?tabs=acr): When running in Container Apps, you can use Microsoft Entra ID with managed identities for all binding extensions that support managed identities. Currently, only these binding extensions support event-driven scaling when using managed identity authentication:
- Azure Event Hubs
- Azure Queue Storage
- Azure Service Bus

For other bindings, use fixed replicas when using managed identity authentication. For more information, see the [Functions developer guide](/azure/azure-functions/functions-reference).

## Scaling and Performance

Azure Functions on ACA scale automatically based on events using KEDA, with no need to configure scale rules manually. You can still set min/max replicas to control scaling behavior.

- **Event-driven scaling**: Automatically scales based on triggers like Event Grid, Service Bus, or HTTP.
- **Scale to zero**: Idle apps scale down to zero to save costs.
- **Cold start control**: Avoid cold starts by setting minReplicas ≥ 1.
- **Concurrency**: Each instance can process multiple events in parallel.
- **High scale**: Scale up to 1000 instances per app (default is 10).
- **GPU support**: Run compute-heavy workloads like AI inference using GPU-backed nodes in Dedicated plans.

This makes ACA ideal for both bursty and steady-state workloads. To learn more, see [set scaling rules in azure container apps](../container-apps/scale-app.md)

## Networking and Security

Azure Functions on ACA benefit from ACA’s robust [networking](../container-apps/networking.md) and [security features](../container-apps/security.md) for secure, scalable deployments:

- **VNet Integration**: Access private resources securely via internal endpoints and private databases.
- **Managed Identity**: Authenticate with Azure services using system/user-assigned identities—no secrets or connection strings needed.
- **Dapr Support**: Enable pub/sub, state management, and secure service invocation via Dapr sidecars. (To learn more see [Microservice APIs powered by Dapr](../container-apps/dapr-overview.md))
- **Ingress &amp; TLS**: Expose secure HTTP endpoints with TLS/mTLS, custom domains, or keep them internal.
- **Environment Isolation**: Functions share ACA environment boundaries for secure, scoped communication.

These capabilities make ACA-hosted Functions ideal for enterprise-grade, secure serverless applications.

## Application logging

You can monitor your containerized function app hosted in Container Apps using Azure Monitor Application Insights in the same way you do with apps hosted by Azure Functions. For more information, see [Monitor Azure Functions](/azure/azure-functions/monitor-functions).

For bindings that support event-driven scaling, scale events are logged as `FunctionsScalerInfo` and `FunctionsScalerError` events in your Log Analytics workspace. For more information, see [Application Logging in Azure Container Apps](./logging.md).

## Next steps

> [!div class="nextstepaction"]
> [Use Azure Functions in Azure Container Apps](functions-usage.md)
