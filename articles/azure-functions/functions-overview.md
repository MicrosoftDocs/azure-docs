---
title: Azure Functions Overview 
description: Learn how Azure Functions can help build scalable serverless apps.
author: craigshoemaker
ms.assetid: 01d6ca9f-ca3f-44fa-b0b9-7ffee115acd4
ms.topic: overview
ms.date: 11/20/2020
ms.author: cshoe
ms.custom: H1Hack27Feb2017, mvc
---

# Introduction to Azure Functions

We often build systems based on a series of important events. Whether you're building an API for a web application, reacting to data as it changes in a database, processing streams of IoT data, or even managing message queues - every application needs a way to run some logic as these events occur.

To meet this need, Azure Functions provides "compute on-demand" - and in two significant ways.

First, Azure Functions allows you to implement your system's logic into readily available blocks of code. These code blocks are called "functions". Different functions can run anytime you need to respond to critical events.

Second, as requests for a function increase, Azure makes available as many servers and instances of these blocks of code as necessary to meet demand - but only while needed. As demand falls, extra servers and application instances drop off automatically.

Where do all the compute resources come from? Azure Functions can [provide as many or as few resources as needed](./functions-scale.md) to meet your application's demand, and you might only be [billed when your functions are running](./pricing.md).

Providing you with compute resources on-demand managed by Azure, where you pay for only what you use, is the essence of [serverless computing](https://azure.microsoft.com/solutions/serverless/).

## Scenarios

The following are common, _but by no means exhaustive_, set of scenarios for Azure Functions. In many cases, a function also [integrates with other cloud services](./functions-triggers-bindings.md).

| If you want to... | then... |
| --- | --- |
| **Build a web API** | Implement an endpoint for your web applications using the [HTTP trigger](./functions-bindings-http-webhook.md) |
| **Process file uploads** | Run code when a file is uploaded or changed in [blob storage](./functions-bindings-storage-blob.md) |
| **Build a serverless orchestration** | Chain a series of functions together using [durable functions](./durable-functions-overview.md) |
| **Respond to database changes** | Run custom logic as data changes in [Cosmos DB](./functions-bindings-cosmosdb-v2.md) |
| **Run scheduled tasks** | Execute code at [set times](./functions-bindings-timer.md) |
| **Create reliable message queue** systems | Process message queues using [Queue Storage](./functions-bindings-storage-queue.md), [Service Bus](./functions-bindings-service-bus.md), or [Event Hubs](./functions-bindings-event-hubs.md) |
| **Analyze IoT data streams** | Collect and process [data from IoT devices](./functions-bindings-event-iot.md) |
| **Process data in real time** | Use [Functions and Signal R](./functions-bindings-signalr-service.md) to respond to data in the moment |
| **Troubleshoot code** | Use [monitoring tools](./functions-monitoring.md) and [testing strategies](./functions-test-a-function.md) |
| **Use a preferred language** |  Write functions in your choice of [C#, Java, JavaScript, PowerShell, and Python](./supported-languages.md), or use a [custom handler](./functions-custom-handlers.md) to use virtually any other language |
| **Review deployment options** | From a tools-based approach to using external pipelines, there's a [myriad of deployment options](./functions-deployment-technologies.md). |

## Next Steps

> [!div class="nextstepaction"]
> [Get started through lessons, samples, and interactive tutorials](./functions-get-started.md)
