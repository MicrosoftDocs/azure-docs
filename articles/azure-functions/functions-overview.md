---
title: Azure Functions Overview 
description: Learn how you can use Azure Functions to build and deploy code in robust serverless apps and are triggered based on events in your cloud-computing infrastruture and can scale dynamically as needed.
ms.assetid: 01d6ca9f-ca3f-44fa-b0b9-7ffee115acd4
ms.topic: overview
ms.date: 04/11/2023
ms.custom: contperf-fy21q2, devdivchpfy22, ignite-2022
---

# Introduction to Azure Functions

Azure Functions is a serverless solution that allows you to write less code, maintain less infrastructure, and save on costs. Instead of worrying about deploying and maintaining servers, the cloud infrastructure provides all the up-to-date resources needed to keep your applications running. You focus on the code that matters most to you, in the most productive language for you, and Azure Functions handles the rest.

## Serverless compute

First and foremost, Azure Functions provides a simple, affordable, and scaleable way to run your code in the cloud. Azure Functions allows you to implement your system's logic into readily available blocks of code. These code blocks are called _functions_. Different functions can run on-demand, when scheduled, or anytime you need to respond to events in your cloud services. 

Providing compute resources on-demand is the essence of [serverless computing](https://azure.microsoft.com/solutions/serverless/) in Azure Functions. When running in the [Consumption](./consumption-plan.md) plan, you only pay while your functions are running. 

For more information, see [Azure Functions hosting options](./functions-scale.md).

## Event-driven execution

Any cloud-based compute service or web API must be responsive HTTP requests and scheduled exection, which Functions supports with HTTP and timer triggers, respectively. However, we also need systems that react to a series of critical events. Whether you're building a web API, responding to database changes, processing IoT data streams, or even managing message queues, every application needs a way to run some code as these events occur. 

In addition to scheduled jobs and HTTP requests, Functions also integrates with other Azure services so that your functions can eaasily consume events and related data from other Azure Services and select partner services. Functions includes a set of binding extensions that makes it easy to connect to and respond to event from other Azure services, including: Azure Cosmos DB, Azure Event Hubs, Azure IoT Hubs, Azure Service Bus, Azure SignalR, Azure SQL, and Azure Storage. Supported third-party and open-source binding extensions include: Dapr, Kafka, RabbitMQ, SendGrid, and Twilio. 

For more information, see [Azure Functions triggers and bindings concepts](./functions-triggers-bindings.md). 

## Dynamic scaling

As demands on your functions increase, Azure Functions meets the demand with as many resources and function instances as necessary, and only for as long as needed. As requests fall, any extra resources and application instances drop-off automatically. Dynamic scaling is offered in both [Consumption](./consumption-plan.md) and [Premium](./functions-premium-plan.md) plans. 

For more information, see [Event-driven scaling in Azure Functions](./event-driven-scaling.md).

## App Service infrastructure

Functions lets you manage one or more individual functions together as a function app. The function app is a unit of deployment, management, and scaling for your functions. Like with web apps, a single local development project is deployed to a specific function app in Azure. Function apps benefit from the existing infrastructure provided by Azure App Service, including deployments, authentication/authorization, configuration, monitoring, and networking. 
 
Because of this, you can also host your function app in a dedicated [App Service](./dedicated-plan.md) plan. You can do this when you already have existing App Service resources available and you don't need the benefits of dynamic scaling. This means that you can also run your functions in an App Service Environment (ASE). 

To learn more about deploying and managing function apps, see [Deployment technologies in Azure Functions](./functions-deployment-technologies.md) and [Manage your function app](./functions-how-to-use-azure-function-app-settings.md), respectively.

## Developer-focused

Azure Functions lets you write your function code in your favorite programming language. Functions has native support for C#, Java, JavaScript, PowerShell, Python, and TypeScript. For more information, see [Supported languages in Azure Functions](./supported-languages.md).

For popular development languages not natively supported by Functions, such as Go and Rust, you can still create functions in those languages using the _custom handlers_ feature. For more information, see [Azure Functions custom handlers](./functions-custom-handlers.md). 

The Azure Functions Core Tools provides a local development and runtime environment that streamlines function development on your local computer. Core Tools is a command-line utility that lets you create and execute your functions locally and then publish them to Azure resources. Both Visual Studio and Visual Studio Code feature deep and seemless integration of Core Tools into Azure Functions development projects. For more information, see [Code and test Azure Functions locally](./functions-develop-local.md). 

## Quickstart templates

To make it easy to get started writing your function code, Azure Functions provides a set of code templates in each natively-supported language. You can use these templates to create new functions using any supported trigger. To learn how to use language-specific templates, see [Getting started with Azure Functions](./functions-get-started.md), and choose the option for your programming language at the top of the article. 

## Scenarios

These scenarios allow you to build event-driven systems using modern architectural patterns.

`<<Pending>>`

## Watch a video

You can watch this video for a quick overview of Azure Functions: 

> [!VIDEO https://www.youtube.com/embed/8-jz5f_JyEQ]

## Next Steps

> [!div class="nextstepaction"]
> [Functions reference scenarios](./functions-scenarios.md)
