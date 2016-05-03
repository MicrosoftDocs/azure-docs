<properties
   pageTitle="Azure Functions Overview | Microsoft Azure"
   description="Understand how Azure Functions can optimize asynchronous workloads by creating simple functions that can be written in minutes."
   services="functions"
   documentationCenter="na"
   authors="mattchenderson"
   manager="erikre"
   editor=""
   tags=""
   keywords="azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture"/>

<tags
   ms.service="functions"
   ms.devlang="multiple"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="multiple"
   ms.workload="na"
   ms.date="04/21/2016"
   ms.author="cfowler;mahender"/>
   
   
# Azure Functions Overview

This topic provides a high-level overview of Azure Functions. If you want to jump right in and get started with Azure Functions, start with [Create your first Azure Function](functions-create-first-azure-function.md). If you are looking for more technical information about Functions, see the [developer reference](functions-reference.md).

## A faster way to functions

Write any function under a minute - either when you need a simple job to clean a database or to build functionality that processes millions of messages from connected devices. Use your development language of choice (C#, Node.JS, Python and more). Pay only for the time your code runs and trust Azure to scale as needed.

Azure functions is a solution for easily running small pieces of code, or "functions," in the cloud. You can write just the code you need for the problem at hand, without worrying about a whole application or the infrastructure to run it. This can make development even more productive, and you can [get started with your first function](functions-create-first-azure-function.md) in just minutes.

## What can I do with Functions?

Azure Functions is a great solution for processing data, and integrating systems, working with the internet of things (IoT), and building simple APIs and microservices.

Functions includes a gallery of templates for common scenarios, including:

* Responding to a GitHub webhook request
* Resizing an image that was uploaded to Azure Storage
* Working with order processing queues
* And much more! 

For a deeper look at how Functions works and some example configurations, see the [Developer Reference](functions-reference.md).

## Features

Azure Functions is a full-featured, enterprise-ready platform that comes with features to make complicated integration and connectivity tasks trivial. With this core set of capabilities, developers using Azure Functions can become even more productive by focusing only on their goal rather than putting together infrastructure pieces.

The following features are included with Azure Functions:
    
* **Choice of language** - Write functions using C#, Node.js, Python, F#, PHP, batch, bash, Java, or any executable.  
* **Pay-per-use pricing model** - Pay only for the time spent running your code. See the Dynamic App Service Plan option in the [pricing section](#pricing) below.  
* **Bring your own dependencies** - Functions supports NuGet and NPM, so you can use your favorite libraries.  
* **Integrated security** - Protect HTTP-triggered functions with OAuth providers such as Azure Active Directory, Facebook, Google, Twitter, and Microsoft Account.  
* **Code-less integration** - Easily leverage Azure services and software-as-a-service (SaaS) offerings. See the [integrations section](#integrations) below for some examples.  
* **Flexible development** - Modify your functions with an in-portal editor, or set up continuous integration and deploy your code through GitHub, Visual Studio Team Services, and more.  
* **Open-source** - Functions is open-source and [available on GitHub](https://github.com/azure/azure-webjobs-sdk-script).  

### <a name="integrations"></a>Integrations

Azure Functions supports a variety of integrations with Azure and 3rd-party services. You can use these to trigger your function and start execution or to serve as input and output for your code. The table below shows some example integrations supported by Azure Functions.

[AZURE.INCLUDE [dynamic compute](../../includes/functions-bindings.md)]

## <a name="pricing"></a>How much does Functions cost?

There are two ways to run Azure Functions: using a Dynamic App Service Plan and using a Classic App Service plan.

In a **Dynamic App Service Plan**, you don't have to worry about resource management. Whenever your function is run, Azure will provide all of the necessary computational resources. You only pay for the time that your code spends running. Full pricing details are available on the [Functions Pricing page](/pricing/details/functions).

A **Classic App Service Plan** allows you to run functions just like your web, mobile, and API apps. This is a great solution if you are already using App Service for other applications - your functions can run on the same plan for no additional cost. Full details can be found on the [App Service Pricing page](/pricing/details/app-service/).

## Reporting Issues

[AZURE.INCLUDE [Reporting Issues](../../includes/functions-reporting-issues.md)]

##Next Steps

+ [Create your first Azure Function](functions-create-first-azure-function.md)  
Jump right in and create your first function using the Azure Functions quickstart. 
+ [Azure Functions developer reference](functions-reference.md)  
Provides more technical information about the Azure Functions runtime and a reference for coding functions and defining triggers and bindings.
+ [Testing Azure Functions](functions-test-a-function.md)  
Describes various tools and techniques for testing your functions.
+ [How to scale Azure Functions](functions-scale.md)  
Discusses service plans available with Azure Functions, including the Dynamic service plan, and how to choose the right plan. 
+ [What is Azure App Service?](../app-service/app-service-value-prop-what-is.md)  
Azure Functions leverages the Azure App Service platform for core functionality like deployments, environment variables, and diagnostics. 