---
title: Create your first function in Azure using Visual Studio | Microsoft Docs
description: Create and publish a simple HTTP triggered function to Azure by using Azure Functions Tools for Visual Studio. 
services: functions
documentationcenter: na
author: rachelappel
manager: cfowler
editor: ''
tags: ''
keywords: azure functions, functions, event processing, compute, serverless architecture

ms.assetid: 82db1177-2295-4e39-bd42-763f6082e796
ms.service: functions
ms.devlang: multiple
ms.topic: quickstart
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 09/06/2017
ms.author: glenga
ms.custom: mvc

---
# Create your first function using Visual Studio

Azure Functions lets you execute your code in a serverless environment without having to first create a VM or publish a web application.

In this topic, you learn how to use the Visual Studio 2017 tools for Azure Functions to create and test a "hello world" function locally. You will then publish the function code to Azure. These tools are available as part of the Azure development workload in Visual Studio 2017 version 15.3, or a later version.

![Azure Functions code in a Visual Studio project](./media/functions-create-your-first-function-visual-studio/functions-vstools-intro.png)

## Prerequisites

To complete this tutorial, install:

* [Visual Studio 2017 version 15.3](https://www.visualstudio.com/vs/preview/), including the **Azure development** workload.

    ![Install Visual Studio 2017 with the Azure development workload](./media/functions-create-your-first-function-visual-studio/functions-vs-workloads.png)
    
    >[!NOTE]  
    >After you install or upgrade to Visual Studio 2017 version 15.3, you must manually update the Visual Studio 2017 tools for Azure Functions. You can update the tools from the **Tools** menu under **Extensions and Updates...** > **Updates** > **Visual Studio Marketplace** > **Azure Functions and Web Jobs Tools** > **Update**. 

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 

## Create an Azure Functions project in Visual Studio

[!INCLUDE [Create a project using the Azure Functions template](../../includes/functions-vstools-create.md)]

Now that you have created the project, you can create your first function.

## Create the function

1. In **Solution Explorer**, right-click on your project node and select **Add** > **New Item**. Select **Azure Function** and click **Add**.

2. Select **HttpTrigger**, type a **Function Name**, select **Anonymous** for **Access Rights**, and click **Create**. The function created is accessed by an HTTP request from any client. 

    ![Create a new Azure Function](./media/functions-create-your-first-function-visual-studio/functions-vstools-add-new-function-2.png)

    A code file is added to your project that contains a class that implements your function code. This code is based on a template, which receives a name value and echos it back. The **FunctionName** attribute sets the name of your function. The **HttpTrigger** attribute indicates the message that triggers the function. 

    ![Function code file](./media/functions-create-your-first-function-visual-studio/functions-code-page.png)

Now that you have created an HTTP-triggered function, you can test it on your local computer.

## Test the function locally

Azure Functions Core Tools lets you run Azure Functions project on your local development computer. You are prompted to install these tools the first time you start a function from Visual Studio.  

1. To test your function, press F5. If prompted, accept the request from Visual Studio to download and install Azure Functions Core (CLI) tools.  You may also need to enable a firewall exception so that the tools can handle HTTP requests.

2. Copy the URL of your function from the Azure Functions runtime output.  

    ![Azure local runtime](./media/functions-create-your-first-function-visual-studio/functions-vstools-f5.png)

3. Paste the URL for the HTTP request into your browser's address bar. Append the query string `?name=<yourname>` to this URL and execute the request. The following shows the response in the browser to the local GET request returned by the function: 

    ![Function localhost response in the browser](./media/functions-create-your-first-function-visual-studio/functions-test-local-browser.png)

4. To stop debugging, click the **Stop** button on the Visual Studio toolbar.

After you have verified that the function runs correctly on your local computer, it's time to publish the project to Azure.

## Publish the project to Azure

You must have a function app in your Azure subscription before you can publish your project. You can create a function app right from Visual Studio.

[!INCLUDE [Publish the project to Azure](../../includes/functions-vstools-publish.md)]

## Test your function in Azure

1. Copy the base URL of the function app from the Publish profile page. Replace the `localhost:port` portion of the URL you used when testing the function locally with the new base URL. As before, make sure to append the query string `?name=<yourname>` to this URL and execute the request.

    The URL that calls your HTTP triggered function looks like this:

        http://<functionappname>.azurewebsites.net/api/<functionname>?name=<yourname> 

2. Paste this new URL for the HTTP request into your browser's address bar. The following shows the response in the browser to the remote GET request returned by the function: 

    ![Function response in the browser](./media/functions-create-your-first-function-visual-studio/functions-test-remote-browser.png)
 
## Next steps

You have used Visual Studio to create a C# function app with a simple HTTP triggered function. 

+ To learn how to configure your project to support other types of triggers and bindings, see the [Configure the project for local development](functions-develop-vs.md#configure-the-project-for-local-development) section in [Azure Functions Tools for Visual Studio](functions-develop-vs.md).
+ To learn more about local testing and debugging using the Azure Functions Core Tools, see [Code and test Azure Functions locally](functions-run-local.md). 
+ To learn more about developing functions as .NET class libraries, see [Using .NET class libraries with Azure Functions](functions-dotnet-class-library.md). 

