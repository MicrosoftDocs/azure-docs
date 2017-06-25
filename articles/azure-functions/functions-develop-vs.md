---
title: Develop Azure Functions using Visual Studio  | Microsoft Docs
description: Learn how to develop and test Azure Functions by using Azure Functions Tools for Visual Studio 2017.
services: functions
documentationcenter: .net
author: ggailey777  
manager: erikre
editor: ''

ms.service: functions
ms.workload: na
ms.tgt_pltfrm: dotnet
ms.devlang: na
ms.topic: article
ms.date: 06/23/2017
ms.author: glenga, donnam

---
# Azure Functions Tools for Visual Studio  

Azure Functions Tools for Visual Studio 2017 is an extension for Visual Studio that lets you develop, test, and deploy C# functions to Azure. If this is your first experience with Azure Functions, you can learn more at [An introduction to Azure Functions](functions-overview.md).

The Azure Functions Tools provides the following benefits: 

* Create pre-compiled C# functions. Pre-complied functions provide a better cold-start performance than C# script-based functions. They also let you use other standard Visual Studio tools for class libraries, including code analysis, unit testing, complete IntelliSense, 3rd party extensions, and others.
* Use WebJobs attributes to declare function bindings directly in the C# code instead of maintaining a separate function.json for binding definitions.
* Edit, build, and run functions on your local development computer. 
* Publish your Azure Functions project directly to Azure. 

## Prerequisites

Before you install Azure Functions Tools, you must have installed [Visual Studio 2017 Preview version 15.3](https://www.visualstudio.com/vs/preview/), including one of the following workloads:

* Azure development
* ASP.NET and web development
    
## Install the Azure Functions Tools

You can [download and install the extension package](https://marketplace.visualstudio.com/vsgallery/e3705d94-7cc3-4b79-ba7b-f43f30774d28), or use the following steps to install it from Visual Studio.  

[!INCLUDE [Install the Azure Functions Tools for Visual Studio](../../includes/functions-install-vstools.md)] 


## Create an Azure Functions project 



## Configure the project for local testing



## Next steps

For more information about Azure Functions Tools, see the Common Questions section of the [Visual Studio 2017 Tools for Azure Functions](https://blogs.msdn.microsoft.com/webdev/2017/05/10/azure-function-tools-for-visual-studio-2017/) blog post.

To learn more about the Azure Functions Core Tools, see [Code and test Azure functions locally](functions-run-local.md).