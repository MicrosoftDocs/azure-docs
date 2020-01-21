---
title: Azure Functions Overview 
description: Understand how to use Azure Functions to optimize asynchronous workloads in minutes.
author: mattchenderson

ms.assetid: 01d6ca9f-ca3f-44fa-b0b9-7ffee115acd4
ms.topic: overview
ms.date: 01/16/2020

ms.custom: H1Hack27Feb2017, mvc

---

# An introduction to Azure Functions

Azure Functions allows you to run small pieces of code (called "functions") without worrying about application infrastructure. With Azure Functions, the cloud infrastructure provides all the up-to-date servers you need to keep your application running at scale.

A function is "triggered" by a specific type of event. [Supported triggers](./functions-triggers-bindings.md) include responding to changes in data, responding to messages, running on a schedule, or as the result of an HTTP request.

While you can always code directly against a myriad of services, integrating with other services is streamlined by using bindings. Bindings give you [declarative access to a wide variety of Azure and and third-party services](./functions-triggers-bindings.md).

## Features

Some key features of Azure Functions include:

- **Serverless applications**: Functions allow you to develop [serverless](https://azure.microsoft.com/solutions/serverless/) applications on Microsoft Azure.

- **Choice of language**: Write functions using your choice of [C#, Java, JavaScript, Python, and PowerShell](supported-languages.md).

- **Pay-per-use pricing model**: Pay only for the time spent running your code. See the Consumption hosting plan option in the [pricing section](#pricing).  

- **Bring your own dependencies**: Functions supports NuGet and NPM, giving you access to your favorite libraries.

- **Integrated security**: Protect HTTP-triggered functions with OAuth providers such as Azure Active Directory, Facebook, Google, Twitter, and Microsoft Account.

- **Simplified integration**: Easily integrate with Azure services and software-as-a-service (SaaS) offerings.

- **Flexible development**: Set up continuous integration and deploy your code through [GitHub](../app-service/scripts/cli-continuous-deployment-github.md), [Azure DevOps Services](../app-service/scripts/cli-continuous-deployment-vsts.md), and other [supported development tools](../app-service/deploy-local-git.md).

- **Stateful serverless architecture**: Orchestrate serverless applications with [Durable Functions](durable/durable-functions-overview.md).

- **Open-source**: The Functions runtime is open-source and [available on GitHub](https://github.com/azure/azure-webjobs-sdk-script).

## What can I do with Functions?

Functions is a great solution for processing bulk data, integrating systems, working with the internet-of-things (IoT), and building simple APIs and micro-services.

A series of templates is available to get you started with key scenarios including:

- **HTTP**: Run code based on [HTTP requests](functions-create-first-azure-function.md)

- **Timer**: Schedule code to [run at predefined times](./functions-create-scheduled-function.md)

- **Azure Cosmos DB**: Process [new and modified Azure Cosmos DB documents](./functions-create-cosmos-db-triggered-function.md)

- **Blob storage**: Process [new and modified Azure Storage blobs](./functions-create-storage-blob-triggered-function.md)

- **Queue storage**: Respond to [Azure Storage queue messages](./functions-create-storage-queue-triggered-function.md)

- **Event Grid**: Respond to [Azure Event Grid events via subscriptions and filters](../event-grid/resize-images-on-storage-blob-upload-event.md)

- **Event Hub**: Respond to [high-volumes of Azure Event Hub events](./functions-bindings-event-hubs.md)

- **Service Bus Queue**: Connect to other Azure or on-premises services by [responding Service Bus queue messages](./functions-bindings-service-bus.md)

- **Service Bus Topic**: Connect other Azure services or on-premises services by [responding to Service Bus topic messages](./functions-bindings-service-bus.md)

## <a name="pricing"></a>How much does Functions cost?

Azure Functions has three kinds of pricing plans. Choose the one that best fits your needs:

- **Consumption plan**: Azure provides all of the necessary computational resources. You don't have to worry about resource management, and only pay for the time that your code runs.

- **Premium plan**: You specify a number of pre-warmed instances that are always online and ready to immediately respond. When your function runs, Azure provides any additional computational resources that are needed. You pay for the pre-warmed instances running continuously and any additional instances you use as Azure scales your app in and out.

- **App Service plan**: Run your functions just like your web apps. If you use App Service for your other applications, your functions can run on the same plan at no additional cost.

For more information about hosting plans, see [Azure Functions hosting plan comparison](functions-scale.md). Full pricing details are available on the [Functions Pricing page](https://azure.microsoft.com/pricing/details/functions/).

## Next Steps

- [Create your first Azure Function](functions-create-first-function-vs-code.md)  
  Get started with [Visual Studio Code](functions-create-first-function-vs-code.md), the [command line](functions-create-first-azure-function-azure-cli.md), or use the [Azure portal](functions-create-first-azure-function.md).

- [Azure Functions developer reference](functions-reference.md)  
  Provides more technical information about the Azure Functions runtime and a reference for coding functions and defining triggers and bindings.

- [How to scale Azure Functions](functions-scale.md)  
  Discusses service plans available with Azure Functions, including the Consumption hosting plan, and how to choose the right plan.

- [Learn more about Azure App Service](../app-service/overview.md)  
  Azure Functions leverages Azure App Service for core functionality like deployments, environment variables, and diagnostics.
