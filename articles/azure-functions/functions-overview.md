---
title: Azure Functions Overview | Microsoft Docs
description: Understand how to use Azure Functions to optimize asynchronous workloads in minutes.
services: functions
documentationcenter: na
author: mattchenderson
manager: erikre
editor: ''
tags: ''
keywords: azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture

ms.assetid: 01d6ca9f-ca3f-44fa-b0b9-7ffee115acd4
ms.service: functions
ms.devlang: multiple
ms.topic: get-started-article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 02/27/2017
ms.author: cfowler;mahender;glenga

ms.custom: H1Hack27Feb2017, mvc

---
# An introduction to Azure Functions  
Azure Functions is a solution for easily running small pieces of code, or "functions," in the cloud. You can write just the code you need for the problem at hand, without worrying about a whole application or the infrastructure to run it. Functions can make development even more productive, and you can use your development language of choice, such as C#, F#, Node.js, Python or PHP. Pay only for the time your code runs and trust Azure to scale as needed. Azure Functions lets you develop serverless applications on Microsoft Azure.

This topic provides a high-level overview of Azure Functions. If you want to jump right in and get started with Azure Functions, start with [Create your first Azure Function](functions-create-first-azure-function.md). If you are looking for more technical information about Functions, see the [developer reference](functions-reference.md).

## Features
Here are some key features of Azure Functions:

* **Choice of language** - Write functions using C#, F#, Node.js, Python, PHP, batch, bash, or any executable.
* **Pay-per-use pricing model** - Pay only for the time spent running your code. See the Consumption hosting plan option in the [pricing section](#pricing).  
* **Bring your own dependencies** - Functions supports NuGet and NPM, so you can use your favorite libraries.  
* **Integrated security** - Protect HTTP-triggered functions with OAuth providers such as Azure Active Directory, Facebook, Google, Twitter, and Microsoft Account.  
* **Simplified integration** - Easily leverage Azure services and software-as-a-service (SaaS) offerings. See the [integrations section](#integrations) for some examples.  
* **Flexible development** - Code your functions right in the portal or set up continuous integration and deploy your code through GitHub, Visual Studio Team Services, and other [supported development tools](../app-service-web/web-sites-deploy.md#deploy-using-an-ide).  
* **Open-source** - The Functions runtime is open-source and [available on GitHub](https://github.com/azure/azure-webjobs-sdk-script).  

## What can I do with Functions?
Azure Functions is a great solution for processing data, integrating systems, working with the internet-of-things (IoT), and building simple APIs and microservices. Consider Functions for tasks like image or order processing, file maintenance, or for any tasks that you want to run on a schedule. 

Functions provides templates to get you started with key scenarios, including the following:

* **BlobTrigger** - Process Azure Storage blobs when they are added to containers. You might use this function for image resizing.
* **EventHubTrigger** -  Respond to events delivered to an Azure Event Hub. Particularly useful in application instrumentation, user experience or workflow processing, and Internet of Things (IoT) scenarios.
* **Generic webhook** - Process webhook HTTP requests from any service that supports webhooks.
* **GitHub webhook** - Respond to events that occur in your GitHub repositories. For an example, see [Create a webhook or API function](functions-create-a-web-hook-or-api-function.md).
* **HTTPTrigger** - Trigger the execution of your code by using an HTTP request.
* **QueueTrigger** - Respond to messages as they arrive in an Azure Storage queue. For an example, see [Create an Azure Function that binds to an Azure service](functions-create-an-azure-connected-function.md).
* **ServiceBusQueueTrigger** - Connect your code to other Azure services or on-premises services by listening to message queues. 
* **ServiceBusTopicTrigger** - Connect your code to other Azure services or on-premises services by subscribing to topics. 
* **TimerTrigger** - Execute cleanup or other batch tasks on a predefined schedule. For an example, see [Create an event processing function](functions-create-an-event-processing-function.md).

Azure Functions supports *triggers*, which are ways to start execution of your code, and *bindings*, which are ways to simplify coding for input and output data. For a detailed description of the triggers and bindings that Azure Functions provides, see [Azure Functions triggers and bindings developer reference](functions-triggers-bindings.md).

## <a name="integrations"></a>Integrations
Azure Functions integrates with various Azure and 3rd-party services. These services can trigger your function and start execution, or they can serve as input and output for your code. The following service integrations are supported by Azure Functions. 

* Azure Cosmos DB
* Azure Event Hubs 
* Azure Mobile Apps (tables)
* Azure Notification Hubs
* Azure Service Bus (queues and topics)
* Azure Storage (blob, queues, and tables) 
* GitHub (webhooks)
* On-premises (using Service Bus)
* Twilio (SMS messages)

## <a name="pricing"></a>How much does Functions cost?
Azure Functions has two kinds of pricing plans, choose the one that best fits your needs: 

* **Consumption plan** - When your function runs, Azure provides all of the necessary computational resources. You don't have to worry about resource management, and you only pay for the time that your code runs. 
* **App Service plan** - Run your functions just like your web, mobile, and API apps. When you are already using App Service for your other applications, you can run your functions on the same plan at no additional cost. 

Full pricing details are available on the [Functions Pricing page](https://azure.microsoft.com/pricing/details/functions/). For more information about scaling your functions, see [How to scale Azure Functions](functions-scale.md).

## Next Steps
* [Create your first Azure Function](functions-create-first-azure-function.md)  
  Jump right in and create your first function using the Azure Functions quickstart. 
* [Azure Functions developer reference](functions-reference.md)  
  Provides more technical information about the Azure Functions runtime and a reference for coding functions and defining triggers and bindings.
* [Testing Azure Functions](functions-test-a-function.md)  
  Describes various tools and techniques for testing your functions.
* [How to scale Azure Functions](functions-scale.md)  
  Discusses service plans available with Azure Functions, including the Consumption hosting plan, and how to choose the right plan. 
* [Learn more about Azure App Service](../app-service/app-service-value-prop-what-is.md)  
  Azure Functions leverages the Azure App Service platform for core functionality like deployments, environment variables, and diagnostics. 

