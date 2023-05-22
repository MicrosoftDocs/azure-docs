---
title: Azure Functions Overview 
description: Learn how you can use Azure Functions to build robust serverless apps.
ms.assetid: 01d6ca9f-ca3f-44fa-b0b9-7ffee115acd4
ms.topic: overview
ms.date: 05/22/2023
ms.custom: contperf-fy21q2, devdivchpfy22, ignite-2022
---

# Azure Functions overview

Azure Functions is a managed, event-based, serverless compute experience that provides scalable compute resources for your cloud-based solutions. You can use Functions to perform key tasks, such as process file uploads, respond in near real time to streams, perform machine learning model inference, run code as a schedule task, and build serverless workflows. 

:::image type="content" source="media/functions-overview/functions-scenarios-overview.png" alt-text="Diagram that represents a set of seven scenarios supported by Azure Functions. ":::

For more information, see [Azure Functions Scenarios](functions-scenarios.md).

## Run your code in the cloud

Functions allows you to implement your system's logic as readily available units of work to perform specific tasks. These units are called _functions_. Functions can perform any number of tasks required by your cloud-based solutions, and you can reuse the tasks in various scenarios. Functions provides a comprehensive set of [triggers and bindings](functions-triggers-bindings.md), which help your functions connect to other services without having to write extra code. 

:::image type="content" source="media/functions-overview/integrated-programming-model.png" alt-text="Diagram of an integrated programming model with Azure Functions triggers, input bindings, and output bindings." :::

The open source [Functions runtime](https://github.com/Azure/azure-functions-host) is the underlying host that provides the compute resources for running your code in the Azure cloud. 

## Event-driven execution

Functions uses triggers to receive events from other services, including event and message-based services like Azure Event Hubs, Azure Event Grid, Azure IoT Hub, and Azure Service Bus. This means that your function code can easily consume events and related data from other Azure and select partner services. 

## Flexible development options

With Functions, you write your function code in your preferred language using your favorite development tools and then deploy your code to the Azure cloud. Functions provides native support for developing in [C#, Java, JavaScript, PowerShell, Python](./supported-languages.md), plus the ability to use [more languages](./functions-custom-handlers.md), such as Rust and Go. 

Functions integrates directly with Visual Studio, Visual Studio Code, Maven, and other popular development tools to enable seemless debugging and [deployments](functions-deployment-technologies.md). 

Functions also integrates with Azure Application Insights to provide comprehensive runtime telemetry and analysis of your [functions in the cloud](functions-monitoring.md).

## Flexible hosting options

Functions provides a variety [hosting options](functions-scale.md) for your business needs and application workload. Dynamic scale plans range from fully serverless, where you only pay for execution time (Consumption plan), to always warm instances kept ready for fastest response times (Premium plan). [Event-driven scaling hosting options](./functions-scale.md#scale) in dynamic scale plans mean functions run only when needed, and you don't have to pay for more resources than you need.

If you want complete control over your functions runtime environment and dependencies, you can even deploy your functions in containers that you can fully customize. These custom containers can be hosted by Functions, deployed as part of a microservices architecture in Azure Container Apps, or even self-hosted in Kubernetes. 

## Next Steps

> [!div class="nextstepaction"]
> [Azure Functions Scenarios](./functions-scenarios.md)
> [Get started through lessons, samples, and interactive tutorials](./functions-get-started.md)
