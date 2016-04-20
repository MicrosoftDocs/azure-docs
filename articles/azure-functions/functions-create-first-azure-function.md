<properties
   pageTitle="Create your first Azure Function | Microsoft Azure"
   description="Build your first Azure Function, a serverless application, in less than two minutes."
   services="functions"
   documentationCenter="na"
   authors="ggailey777"
   manager="erikre"
   editor=""
   tags=""
   />

<tags
   ms.service="functions"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="multiple"
   ms.workload="na"
   ms.date="04/19/2016"
   ms.author="glenga"/>

# Create your first Azure Function

##Overview
Azure Functions is an event-driven, compute-on-demand experience that extends the existing Azure application platform with capabilities to implement code triggered by events occurring in other Azure services, SaaS products, and on-premises systems. With Azure Functions, your applications scale based on demand and you pay only for the resources you consume. Azure Functions enables you to create scheduled or triggered units of code implemented in a variety of programming languages. To learn more about Azure Functions, see the [Azure Functions Overview](functions-overview.md).

This topic shows you how to use the Azure Functions quickstart in the portal to create a simple "hello world"  Node.js function that is invoked by an HTTP-trigger. You can also watch a short video to see how these steps are performed in the portal user interface.

## Watch the video

The following video show how to perform the basic steps in this tutorial 

[AZURE.VIDEO create-your-first-azure-function]

##Create a function from the quickstart

A function app hosts the execution of your functions in Azure. Follow these steps to create a new function app as well as the new function. Before you can create your first function, you need top have an active Azure account. If you don't already have an Azure account, [free accounts are available](https://azure.microsoft.com/free/).

1. Go to the [Azure Functions portal](https://functions.azure.com/signin) and sign-in with your Azure account.

2. Type a **Name** for your new function app, select your preferred **Region**, then click **Create + get started**. 

3. In the **Quickstart** tab, click **WebHook + API** > **Create a function**. A new predefined Node.js function is created. 

4. (Optional) At this point in the quickstart, you can choose to take a quick tour of Azure Functions features in the portal.	Once you have completed or skipped the tour, you can test your new function by using the HTTP trigger.

##Test the function

Since the Azure Functions quickstarts contain functional code, you can immediately test executing your new function.

1. In the **Develop** tab, review the **Code** window and notice that this Node.js code expects an HTTP request with a *name* value passed either in the message body or in a query string. When the function runs, this value is returned in the response message.

2. Scroll down, change the value of *name* to your name, and click **Run**. You will see that execution is triggered by a test HTTP request, information is written to the streaming logs, and the "hello" response is displayed in the **Output**. 

3. To trigger the same execution from an external web browser, copy the **Function URL** value from the **Develop** tab and paste it in a web browser, then append the query string value `&name=yourname` and click **Go**. The same information is written to the logs and the browser displays the "hello" response as before.

##Next steps

This quickstart demonstrates a very simple execution of the most basic kind of function. Azure Functions is powerful and flexible compute-on-demand experience that is powered by Azure App Service, with support for various triggers as well as input and output bindings. See these topics for more information about leveraging the power of Azure Functions in your apps.

+ [Azure Functions developer reference](functions-reference.md)  
Programmer reference for coding functions and defining triggers and bindings.
+ [What is the Azure WebJobs SDK](../app-service-web/websites-dotnet-webjobs-sdk.md)  
Azure Functions is based on the WebJobs SDK, so you should familiarize yourself with concepts like triggers, bindings, and the JobHost runtime.
+ [Testing Azure Functions](functions-test-a-function.md)  
Describes various tools and techniques for testing your functions.
+ [How to scale Azure Functions](functions-scale.md)  
Discuses service plans available with Azure Functions, including the Dynamic service plan, and how to choose the right plan. 
+ [What is Azure App Service?](../app-service/app-service-value-prop-what-is.md)  
Azure Functions leverages the Azure App Service platform for core functionality like deployments, environment variables, and diagnostics. 

[AZURE.INCLUDE [Getting Started Note](../../includes/functions-get-help.md)]