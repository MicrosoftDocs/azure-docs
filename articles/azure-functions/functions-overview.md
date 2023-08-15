---
title: Azure Functions Overview 
description: Learn how you can use Azure Functions to build robust serverless apps.
ms.assetid: 01d6ca9f-ca3f-44fa-b0b9-7ffee115acd4
ms.topic: overview
ms.date: 05/22/2023
ms.custom: contperf-fy21q2, devdivchpfy22, ignite-2022, build-2023
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Functions overview

Azure Functions is a serverless solution that allows you to write less code, maintain less infrastructure, and save on costs. Instead of worrying about deploying and maintaining servers, the cloud infrastructure provides all the up-to-date resources needed to keep your applications running.

You focus on the code that matters most to you, in the most productive language for you, and Azure Functions handles the rest.

For the best experience with the Functions documentation, choose your preferred development language from the list of native Functions languages at the top of the article.

## Scenarios

Functions provides a comprehensive set of event-driven [triggers and bindings](functions-triggers-bindings.md) that connect your functions to other services without having to write extra code. 

The following are a common, _but by no means exhaustive_, set of integrated scenarios that feature Functions.

| If you want to... | then...|
| --- | --- |
| [Process file uploads](./functions-scenarios.md#process-file-uploads) | Run code when a file is uploaded or changed in blob storage. |
| [Process data in real time](./functions-scenarios.md#real-time-stream-and-event-processing)| Capture and transform data from event and IoT source streams on the way to storage.   |
| [Infer on data models](./functions-scenarios.md#machine-learning-and-ai)| Pull text from a queue and present it to various AI services for analysis and classification. |
| [Run scheduled task](./functions-scenarios.md#run-scheduled-tasks)| Execute data clean-up code on pre-defined timed intervals. |
| [Build a scalable web API](./functions-scenarios.md#build-a-scalable-web-api)| Implement a set of REST endpoints for your web applications using HTTP triggers. |
| [Build a serverless workflow](./functions-scenarios.md#build-a-serverless-workflow)| Create an event-driven workflow from a series of functions using Durable Functions. |
| [Respond to database changes](./functions-scenarios.md#respond-to-database-changes)| Run custom logic when a document is created or updated in Azure Cosmos DB. |
| [Create reliable message systems](./functions-scenarios.md#create-reliable-message-systems)| Process message queues using Queue Storage, Service Bus, or Event Hubs. |

These scenarios allow you to build event-driven systems using modern architectural patterns. For more information, see [Azure Functions Scenarios](functions-scenarios.md).

## Development lifecycle

With Functions, you write your function code in your preferred language using your favorite development tools and then deploy your code to the Azure cloud. Functions provides native support for developing in [C#, Java, JavaScript, PowerShell, Python](./supported-languages.md), plus the ability to use [more languages](./functions-custom-handlers.md), such as Rust and Go. 

Functions integrates directly with Visual Studio, Visual Studio Code, Maven, and other popular development tools to enable seemless debugging and [deployments](functions-deployment-technologies.md). 

Functions also integrates with Azure Monitor and Azure Application Insights to provide comprehensive runtime telemetry and analysis of your [functions in the cloud](functions-monitoring.md).

## Hosting options

Functions provides a variety [hosting options](functions-scale.md#overview-of-plans) for your business needs and application workload. [Event-driven scaling hosting options](./event-driven-scaling.md) range from fully serverless, where you only pay for execution time (Consumption plan), to always warm instances kept ready for fastest response times (Premium plan). 

When you have excess App Service hosting resources, you can host your functions in an existing App Service plan. This kind of Dedicated hosting plan is also a good choice when you need predictable scaling behaviors and costs from your functions. 

If you want complete control over your functions runtime environment and dependencies, you can even deploy your functions in containers that you can fully customize. Your custom containers can be hosted by Functions, deployed as part of a microservices architecture in Azure Container Apps, or even self-hosted in Kubernetes. 

## Next Steps

> [!div class="nextstepaction"]
> [Azure Functions Scenarios](./functions-scenarios.md)
> [Get started through lessons, samples, and interactive tutorials](./functions-get-started.md)
