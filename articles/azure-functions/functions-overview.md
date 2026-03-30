---
title: Azure Functions overview
description: Learn how you can use Azure Functions to build robust serverless apps without writing extra code.
ms.assetid: 01d6ca9f-ca3f-44fa-b0b9-7ffee115acd4
ms.topic: overview
ms.date: 03/06/2025
ms.custom: devdivchpfy22, build-2023
#customer intent: As a developer, I want an overview of Azure Functions capabilities and hosting options so that I can choose the right model and plan for my workload.
---

# What is Azure Functions?

Azure Functions is a serverless solution that allows you to build robust apps while using less code, and with less infrastructure and lower costs. Instead of worrying about deploying and maintaining servers, you can use the cloud infrastructure to provide all the up-to-date resources needed to keep your applications running.

You focus on the code that matters most to you, in the most productive language for you, and Azure Functions handles the rest. For a list of supported languages, see [Supported languages in Azure Functions](supported-languages.md).

## Scenarios

Functions provides a comprehensive set of event-driven [triggers and bindings](functions-triggers-bindings.md) that connect your functions to other services without having to write extra code.

The following list includes common integrated scenarios that use Functions.

| If you want to... | then...|
| --- | --- |
| [Process file uploads](./functions-scenarios.md#process-file-uploads) | Run code when a file is uploaded or changed in blob storage. |
| [Process data in real time](./functions-scenarios.md#real-time-stream-and-event-processing)| Capture and transform data from event and IoT source streams on the way to storage.   |
| [Run AI inference](./functions-scenarios.md#machine-learning-and-ai)| Pull text from a queue and present it to various AI services for analysis and classification. |
| [Run scheduled task](./functions-scenarios.md#run-scheduled-tasks)| Execute data clean-up code on predefined timed intervals. |
| [Build a scalable web API](./functions-scenarios.md#build-a-scalable-web-api)| Implement a set of REST endpoints for your web applications using HTTP triggers. |
| [Build a serverless workflow](./functions-scenarios.md#build-a-serverless-workflow)| Create an event-driven workflow from a series of functions using Durable Functions. |
| [Respond to database changes](./functions-scenarios.md#respond-to-database-changes)| Run custom logic when a document is created or updated in a database. |
| [Create reliable message systems](./functions-scenarios.md#create-reliable-message-systems)| Process message queues using Azure Queue Storage, Service Bus, or Event Hubs. |

These scenarios allow you to build event-driven systems using modern architectural patterns. For more information, see [Azure Functions scenarios](functions-scenarios.md).

## Development lifecycle

Functions supports you through every stage of app development:

1. **Code** in [C#, Java, JavaScript, PowerShell, or Python](./supported-languages.md), or use [custom handlers](./functions-custom-handlers.md) for languages like Rust and Go.
1. **Develop and debug** locally with [Visual Studio, Visual Studio Code, Maven, and other tools](functions-develop-local.md).
1. **Deploy** to Azure using [CLI, CI/CD pipelines, or your IDE](functions-deployment-technologies.md).
1. **Monitor** performance and diagnose issues with built-in [Azure Monitor and Application Insights](functions-monitoring.md) integration.

## Hosting options

Functions provides various [hosting options](functions-scale.md) for your business needs and application workload.

| Hosting option | Description |
| --- | --- |
| [Flex Consumption plan](flex-consumption-plan.md) | **Recommended.** Fast event-driven scaling, virtual network integration, and pay-as-you-go billing. |
| [Premium plan](functions-premium-plan.md) | Always-warm instances for the fastest response times, unlimited execution duration, and virtual network integration. |
| [Dedicated plan](dedicated-plan.md) | Run functions in an existing App Service plan with predictable scaling and costs. |
| [Container Apps](../container-apps/functions-overview.md) | Deploy fully customized containerized function apps alongside microservices in Azure Container Apps. |
| [Consumption plan](consumption-plan.md) | Legacy serverless plan (Windows only). Use the Flex Consumption plan for new apps. |

For a detailed comparison, see [Azure Functions hosting options](functions-scale.md).

## Related content

- [Azure Functions scenarios](functions-scenarios.md)
- [Get started with Azure Functions](functions-get-started.md)
