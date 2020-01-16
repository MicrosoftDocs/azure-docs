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

Each function is "triggered" by a specific action. [Supported triggers](./functions-triggers-bindings.md) include responding to changes in data, responding to messages, running on a schedule, or as the result of an HTTP request.

Integrating with other services is streamlined by using bindings. Bindings give you [declarative access to a wide variety of Azure and and third-party services](./functions-triggers-bindings.md).

## Features

Some key features of Azure Functions include:

- **Serverless applications**: Functions allow you to develop [serverless](https://azure.microsoft.com/solutions/serverless/) applications on Microsoft Azure

- **Choice of language**: Write functions using your choice of C#, Java, JavaScript, Python, and other languages. See [Supported languages](supported-languages.md) for the complete list.

- **Pay-per-use pricing model**: Pay only for the time spent running your code. See the Consumption hosting plan option in the [pricing section](#pricing).  

- **Bring your own dependencies**: Functions support NuGet and NPM, so you can use your favorite libraries.

- **Integrated security**: Protect HTTP-triggered functions with OAuth providers such as Azure Active Directory, Facebook, Google, Twitter, and Microsoft Account.

- **Simplified integration**: Easily integrate with Azure services and software-as-a-service (SaaS) offerings. See the [integrations section](#integrations) for some examples.

- **Flexible development**: Set up continuous integration and deploy your code through [GitHub](../app-service/scripts/cli-continuous-deployment-github.md), [Azure DevOps Services](../app-service/scripts/cli-continuous-deployment-vsts.md), and other [supported development tools](../app-service/deploy-local-git.md).

- **Open-source**: The Functions runtime is open-source and [available on GitHub](https://github.com/azure/azure-webjobs-sdk-script).

## What can I do with Functions?

Functions is a great solution for processing bulk data, integrating systems, working with the internet-of-things (IoT), and building simple APIs and micro-services.

A series of templates is available to get you started with key scenarios including:

- **HTTP**: Run code based on [HTTP requests](functions-create-first-azure-function.md)

- **Timer**: Schedule code to [run at predefined times](./functions-create-scheduled-function.md)

- **Azure Cosmos DB**: Process [new and modified Azure Cosmos DB documents](functions-bindings-cosmosdb-v2.md)

- **Blob storage**: Process [new and modified Azure Storage blobs](functions-bindings-storage-blob.md)

- **Queue storage**: Respond [Azure Storage queue messages](./functions-bindings-storage-queue.md)

- **Event Grid**: Respond [Azure Event Grid events via subscriptions and filters](../event-grid/resize-images-on-storage-blob-upload-event.md)

- **Event Hub**: Respond to [high-volumes of Azure Event Hub events](./functions-bindings-event-hubs.md)

- **Service Bus Queue**: Connect to other Azure or on-premises services by [responding Service Bus queue messages](./functions-bindings-service-bus.md)

- **Service Bus Topic**: Connect other Azure services or on-premises services by [responding to Service Bus topic messages](./functions-bindings-service-bus.md)

## <a name="integrations"></a> Integrations

Azure Functions integrates with various Azure and 3rd-party services. These services can trigger your function and start execution, or they can serve as input and output for your code. The following service integrations are supported by Azure Functions:

- [Azure Cosmos DB](./functions-bindings-cosmosdb-v2.md)
- [Azure Event Hubs](./functions-bindings-event-hubs.md)
- [Azure Event Grid](./functions-bindings-event-grid.md)
- [Azure Notification Hubs](./functions-bindings-notification-hubs.md)
- [Azure Service Bus (queues and topics)](./functions-bindings-service-bus.md)
- [Azure Storage (blob, queues, and tables)](./functions-bindings-storage-blob.md)
- [On-premises (using Service Bus)](./functions-bindings-service-bus.md)
- [Signal R service](./functions-bindings-signalr-service.md)
- [Twilio (SMS messages)](./functions-bindings-twilio.md)

## <a name="pricing"></a>How much does Functions cost?

Azure Functions has two kinds of pricing plans. Choose the one that best fits your needs:

- **Consumption plan**: Azure provides all of the necessary computational resources. You don't have to worry about resource management, and only pay for the time that your code runs.

- **Premium plan**: You specify a number of pre-warmed instances that are always online and ready to immediately respond. When your function runs, Azure provides any additional computational resources that are needed. You pay for the pre-warmed instances running continuously and any additional instances you use as Azure scales your app in and out.

- **App Service plan**: Run your functions just like your web apps. If you use App Service for your other applications, your functions can run on the same plan at no additional cost.

For more information about hosting plans, see [Azure Functions hosting plan comparison](functions-scale.md). Full pricing details are available on the [Functions Pricing page](https://azure.microsoft.com/pricing/details/functions/).

## Next Steps

- [Create your first Azure Function](functions-create-first-azure-function.md)  
  Jump right in and create your first function using the Azure Functions quickstart.

- [Azure Functions developer reference](functions-reference.md)  
  Provides more technical information about the Azure Functions runtime and a reference for coding functions and defining triggers and bindings.

- [Testing Azure Functions](functions-test-a-function.md)  
  Describes various tools and techniques for testing your functions.

- [How to scale Azure Functions](functions-scale.md)  
  Discusses service plans available with Azure Functions, including the Consumption hosting plan, and how to choose the right plan.

- [Learn more about Azure App Service](../app-service/overview.md)  
  Azure Functions leverages Azure App Service for core functionality like deployments, environment variables, and diagnostics.
