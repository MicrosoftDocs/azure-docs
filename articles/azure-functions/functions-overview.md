---
title: Azure Functions Overview 
description: Understand how to use Azure Functions to optimize asynchronous workloads in minutes.
author: mattchenderson

ms.assetid: 01d6ca9f-ca3f-44fa-b0b9-7ffee115acd4
ms.topic: overview
ms.date: 10/03/2017

ms.custom: H1Hack27Feb2017, mvc

---
# An introduction to Azure Functions  
Azure Functions is a solution for easily running small pieces of code, or "functions," in the cloud. You can write just the code you need for the problem at hand, without worrying about a whole application or the infrastructure to run it. Functions can make development even more productive, and you can use your development language of choice, such as C#, Java, JavaScript, PowerShell, and Python. Pay only for the time your code runs and trust Azure to scale as needed. Azure Functions lets you develop [serverless](https://azure.microsoft.com/solutions/serverless/) applications on Microsoft Azure.

This topic provides a high-level overview of Azure Functions. If you want to jump right in and get started with Functions, start with [Create your first Azure Function](functions-create-first-azure-function.md). If you are looking for more technical information about Functions, see the [developer reference](functions-reference.md).

## Features
Here are some key features of Functions:

* **Choice of language** - Write functions using your choice of C#, Java, JavaScript, Python, and other languages. See [Supported languages](supported-languages.md) for the complete list.
* **Pay-per-use pricing model** - Pay only for the time spent running your code. See the Consumption hosting plan option in the [pricing section](#pricing).  
* **Bring your own dependencies** - Functions supports NuGet and NPM, so you can use your favorite libraries.  
* **Integrated security** - Protect HTTP-triggered functions with OAuth providers such as Azure Active Directory, Facebook, Google, Twitter, and Microsoft Account.  
* **Simplified integration** - Easily leverage Azure services and software-as-a-service (SaaS) offerings. See the [integrations section](#integrations) for some examples.  
* **Flexible development** - Code your functions right in the portal or set up continuous integration and deploy your code through [GitHub](../app-service/scripts/cli-continuous-deployment-github.md), [Azure DevOps Services](../app-service/scripts/cli-continuous-deployment-vsts.md), and other [supported development tools](../app-service/deploy-local-git.md).  
* **Open-source** - The Functions runtime is open-source and [available on GitHub](https://github.com/azure/azure-webjobs-sdk-script).  

## What can I do with Functions?
Functions is a great solution for processing data, integrating systems, working with the internet-of-things (IoT), and building simple APIs and microservices. Consider Functions for tasks like web APIs, image or order processing, file maintenance, or for any tasks that you want to run on a schedule. 

Functions provides templates to get you started with key scenarios, including the following:

* **HTTPTrigger** - Trigger the execution of your code by using an HTTP request. For an example, see [Create your first function](functions-create-first-azure-function.md).
* **TimerTrigger** - Execute cleanup or other batch tasks on a predefined schedule. For an example, see [Create a function triggered by a timer](functions-create-scheduled-function.md).
* **CosmosDBTrigger** - Process Azure Cosmos DB documents when they are added or updated in collections in a NoSQL database. For more information, see [Azure Cosmos DB bindings](functions-bindings-cosmosdb-v2.md).
* **BlobTrigger** - Process Azure Storage blobs when they are added to containers. You might use this function for image resizing. For more information, see [Blob storage bindings](functions-bindings-storage-blob.md).
* **QueueTrigger** - Respond to messages as they arrive in an Azure Storage queue. For more information, see [Azure Queue storage bindings](functions-bindings-storage-queue.md).
* **EventGridTrigger** -  Respond to events delivered to a subscription in Azure Event Grid. Supports a subscription-based model for receiving events, which includes filtering. A good solution for building event-based architectures. For an example, see [Automate resizing uploaded images using Event Grid](../event-grid/resize-images-on-storage-blob-upload-event.md).
* **EventHubTrigger** -  Respond to events delivered to an Azure Event Hub. Particularly useful in application instrumentation, user experience or workflow processing, and internet-of-things (IoT) scenarios. For more information, see [Event Hubs bindings](functions-bindings-event-hubs.md).
* **ServiceBusQueueTrigger** - Connect your code to other Azure services or on-premises services by listening to message queues. For more information, see [Service Bus bindings](functions-bindings-service-bus.md).
* **ServiceBusTopicTrigger** - Connect your code to other Azure services or on-premises services by subscribing to topics. For more information, see [Service Bus bindings](functions-bindings-service-bus.md).

Azure Functions supports *triggers*, which are ways to start execution of your code, and *bindings*, which are ways to simplify coding for input and output data. For a detailed description of the triggers and bindings that Azure Functions provides, see [Azure Functions triggers and bindings developer reference](functions-triggers-bindings.md).

## <a name="integrations"></a>Integrations
Azure Functions integrates with various Azure and 3rd-party services. These services can trigger your function and start execution, or they can serve as input and output for your code. The following service integrations are supported by Azure Functions:

* Azure Cosmos DB
* Azure Event Hubs
* Azure Event Grid
* Azure Notification Hubs
* Azure Service Bus (queues and topics)
* Azure Storage (blob, queues, and tables)
* On-premises (using Service Bus)
* Twilio (SMS messages)

## <a name="pricing"></a>How much does Functions cost?
Azure Functions has two kinds of pricing plans. Choose the one that best fits your needs: 

* **Consumption plan** - When your function runs, Azure provides all of the necessary computational resources. You don't have to worry about resource management, and you only pay for the time that your code runs.
* **Premium plan** -  You specify a number of pre-warmed instances that are always online and ready to respond immediately. When your function runs, Azure provides any additional computational resources that are needed. You pay for the pre-warmed instances running continuously and any additional instances you use as Azure scales your app in and out.
* **App Service plan** - Run your functions just like your web apps. When you are already using App Service for your other applications, you can run your functions on the same plan at no additional cost. 

For more information about hosting plans, see [Azure Functions hosting plan comparison](functions-scale.md). Full pricing details are available on the [Functions Pricing page](https://azure.microsoft.com/pricing/details/functions/).

## Next Steps
* [Create your first Azure Function](functions-create-first-azure-function.md)  
  Jump right in and create your first function using the Azure Functions quickstart. 
* [Azure Functions developer reference](functions-reference.md)  
  Provides more technical information about the Azure Functions runtime and a reference for coding functions and defining triggers and bindings.
* [Testing Azure Functions](functions-test-a-function.md)  
  Describes various tools and techniques for testing your functions.
* [How to scale Azure Functions](functions-scale.md)  
  Discusses service plans available with Azure Functions, including the Consumption hosting plan, and how to choose the right plan. 
* [Learn more about Azure App Service](../app-service/overview.md)  
  Azure Functions leverages Azure App Service for core functionality like deployments, environment variables, and diagnostics. 

