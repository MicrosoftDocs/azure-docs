---
title: Azure Functions Overview 
description: Learn how you can use Azure Functions to build robust serverless apps.
ms.assetid: 01d6ca9f-ca3f-44fa-b0b9-7ffee115acd4
ms.topic: overview
ms.date: 05/15/2023
ms.custom: contperf-fy21q2, devdivchpfy22, ignite-2022
---

# Azure Functions overview

Azure Functions is an event-based, serverless compute experience that accelerates application development and provides up-to-date resources to keep your apps running. Compute tasks you can perform using Azure Functions can include: processing file uploads, responding in near real time to streams, performing machine learning model inference, running code as a schedule task, and building serverless workflows. For more information, see [Azure Functions Scenarios](functions-scenarios.md).

Using Azure Functions provides the following benefits:

- **[Integrated programming model and runtime](#integrated-programming-model-and-runtime)**: Use the Functions runtime host and available triggers and bindings to run your function app and react to events.

- **[End-to-end development experience](#end-to-end-development-experience)**: Take advantage of a complete, end-to-end development experience—from building and debugging locally on major platforms like Windows, macOS, and Linux, to deploying and monitoring in the cloud.

- **[Hosting options flexibility](#flexible-hosting-options)**: Choose the hosting model that best fits your business needs, including containers, without compromising development experience.

- **[Fully managed and cost-effective](#fully-managed-and-cost-effective)**: Automated and flexible scaling based on your workload volume, lets you focus on adding value in your code instead of managing infrastructure.

## Integrated programming model and runtime

The open source [Functions runtime](https://github.com/Azure/azure-functions-host) is the underlying host that provides the functionality that's required to run your function app. Various [triggers and bindings](functions-triggers-bindings.md) mean you can easily connect to other services with minimal code. 

![Diagram of an integrated programming model with Azure Functions triggers, input bindings, and output bindings.](./media/functions-overview/integrated-programming-model.png)

## End-to-end development experience

Azure Functions offers a complete, end-to-end development experience—from developing and debugging in [C#, Java, JavaScript, PowerShell, Python](./supported-languages.md), and [other languages](./functions-custom-handlers.md), to [deploying](functions-deployment-technologies.md) and [monitoring in the cloud](functions-monitoring.md).

![Diagram of the end-to-end development experience using Azure Functions with developing, debugging locally, and then deploying to Azure.](./media/functions-overview/end-to-end-development-experience.png)

## Flexible hosting options

Choose the right Functions [hosting plan](functions-scale.md) for your business needs and application workload, from serverless and elastic scale options to plans that offer features for specialized needs, including containerized options.

![Diagram of the Azure Functions flexibility in the various hosting options supported by Functions.](./media/functions-overview/hosting-options-flexibility.png)

## Fully managed and cost-effective

You can focus on building your app while Azure Functions takes care of the infrastructure with serverless computing. [Event driven scaling hosting options](./functions-scale.md#scale) mean functions run only when needed. 

![Diagram of how Azure Functions enables fully-managed and cost-effective resources that scale up and down with demand.](./media/functions-overview/fully-managed-and-cost-effective.png)


## Next Steps

> [!div class="nextstepaction"]
> [Azure Functions Scenarios](./functions-scenarios.md)
> [Get started through lessons, samples, and interactive tutorials](./functions-get-started.md)
