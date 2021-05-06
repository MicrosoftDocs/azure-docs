---
title: Azure Functions Overview 
description: Learn how Azure Functions can help build robust serverless apps.
author: craigshoemaker
ms.assetid: 01d6ca9f-ca3f-44fa-b0b9-7ffee115acd4
ms.topic: overview
ms.date: 11/20/2020
ms.author: cshoe
ms.custom: contperf-fy21q2
---

# Introduction to Azure Functions

Azure Functions is a serverless solution that allows you to write less code, maintain less infrastructure, and save on costs. Instead of worrying about deploying and maintaining servers, the cloud infrastructure provides all the up-to-date resources needed to keep your applications running.

You focus on the pieces of code that matter most to you, and Azure Functions handles the rest.<br /><br />

> [!VIDEO https://www.youtube.com/embed/8-jz5f_JyEQ]

We often build systems to react to a series of critical events. Whether you're building a web API, responding to database changes, processing  IoT data streams, or even managing message queues - every application needs a way to run some code as these events occur.

To meet this need, Azure Functions provides "compute on-demand" in two significant ways.

First, Azure Functions allows you to implement your system's logic into readily available blocks of code. These code blocks are called "functions". Different functions can run anytime you need to respond to critical events.

Second, as requests increase, Azure Functions meets the demand with as many resources and function instances as necessary - but only while needed. As requests fall, any extra resources and application instances drop off automatically.

Where do all the compute resources come from? Azure Functions [provides as many or as few compute resources as needed](./functions-scale.md) to meet your application's demand.

Providing compute resources on-demand is the essence of [serverless computing](https://azure.microsoft.com/solutions/serverless/) in Azure Functions.

## Scenarios

In many cases, a function [integrates with an array of cloud services](./functions-triggers-bindings.md) to provide feature-rich implementations.

The following are a common, _but by no means exhaustive_, set of scenarios for Azure Functions.

| If you want to... | then... |
| --- | --- |
| **Build a web API** | Implement an endpoint for your web applications using the [HTTP trigger](./functions-bindings-http-webhook.md) |
| **Process file uploads** | Run code when a file is uploaded or changed in [blob storage](./functions-bindings-storage-blob.md) |
| **Build a serverless workflow** | Chain a series of functions together using [durable functions](./durable/durable-functions-overview.md) |
| **Respond to database changes** | Run custom logic when a document is created or updated in [Cosmos DB](./functions-bindings-cosmosdb-v2.md) |
| **Run scheduled tasks** | Execute code at [set times](./functions-bindings-timer.md) |
| **Create reliable message queue systems** | Process message queues using [Queue Storage](./functions-bindings-storage-queue.md), [Service Bus](./functions-bindings-service-bus.md), or [Event Hubs](./functions-bindings-event-hubs.md) |
| **Analyze IoT data streams** | Collect and process [data from IoT devices](./functions-bindings-event-iot.md) |
| **Process data in real time** | Use [Functions and SignalR](./functions-bindings-signalr-service.md) to respond to data in the moment |

As you build your functions, you have the following options and resources available:

- **Use your preferred language**: Write functions in [C#, Java, JavaScript, PowerShell, or Python](./supported-languages.md), or use a [custom handler](./functions-custom-handlers.md) to use virtually any other language.

- **Automate deployment**: From a tools-based approach to using external pipelines, there's a [myriad of deployment options](./functions-deployment-technologies.md) available.

- **Troubleshoot a function**: Use [monitoring tools](./functions-monitoring.md) and [testing strategies](./functions-test-a-function.md) to gain insights into your apps.

- **Flexible pricing options**: With the [Consumption](./pricing.md) plan, you only pay while your functions are running, while the [Premium](./pricing.md) and [App Service](./pricing.md) plans offer features for specialized needs.

## Next Steps

> [!div class="nextstepaction"]
> [Get started through lessons, samples, and interactive tutorials](./functions-get-started.md)
