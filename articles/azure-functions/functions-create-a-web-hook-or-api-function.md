<properties
   pageTitle="Create a web hook or API Azure Function | Microsoft Azure"
   description="Use Azure Functions to create a function that is invoked by a WebHook or API call."
   services="azure-functions"
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
   ms.date="04/25/2016"
   ms.author="glenga"/>
   
# Create a web hook or API Azure Function

This topic shows you how to use the Azure Functions quickstart in the Azure Functions portal to create a simple "hello world"  Node.js function that is invoked by an HTTP-trigger. You can also watch a short video to see how these steps are performed in the portal.

## Watch the video

The following video show how to perform the basic steps in this tutorial 

[AZURE.VIDEO create-a-web-hook-or-api-azure-function]

##Create a function from a template

A function app hosts the execution of your functions in Azure. Follow these steps to create a new function app as well as the new function. Before you can create a function, you need to have an active Azure account. If you don't already have an Azure account, [free accounts are available](https://azure.microsoft.com/free/).

1. Go to the [Azure Functions portal](https://functions.azure.com/signin) and sign-in with your Azure account.

2. Type a unique **Name** for your new function app or accept the generated one, select your preferred **Region**, then click **Create + get started**. 

3. In the **Quickstart** tab, click **WebHook + API** > **Create a function**. A new predefined Node.js function is created. 

4. (Optional) At this point in the quickstart, you can choose to take a quick tour of Azure Functions features in the portal.	Once you have completed or skipped the tour, you can test your new function by using the HTTP trigger.

##Test the function

[AZURE.INCLUDE [Getting Started Note](../../includes/functions-get-help.md)]