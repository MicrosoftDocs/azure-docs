---
title: Create custom connectors from Web APIs - Azure Logic Apps | Microsoft Docs
description: Build custom connectors from Web APIs for Azure Logic Apps
author: ecfan
manager: anneta
editor: 
services: logic-apps
documentationcenter: 

ms.assetid: 
ms.service: logic-apps
ms.workload: logic-apps
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/1/2017
ms.author: LADocs; estfan
---

# Build custom connectors from Web APIs in Azure Logic Apps

To create a custom connector that you can call from logic app workflows, 
create a Web API that you can host with Azure Web Apps, 
authenticate with Azure Active Directory, 
and register as a connector with Azure Logic Apps. 
This tutorial shows you how to perform these tasks 
by building an ASP.NET Web API app.

## Prerequisites

* [Visual Studio 2013 or later](https://www.visualstudio.com/vs/)

* Code for your Web API. If you don't have any, try this tutorial: 
[Getting Started with ASP.NET Web API 2 (C#)](http://www.asp.net/web-api/overview/getting-started-with-aspnet-web-api/tutorial-your-first-web-api).

* An Azure subscription. If you don't have a subscription, 
you can start with a [free Azure account](https://azure.microsoft.com/free/). 
Otherwise, sign up for a [Pay-As-You-Go subscription](https://azure.microsoft.com/pricing/purchase-options/).

## Create and deploy an ASP.NET Web API app to Azure

1. In Visual Studio, choose **File** > **New Project** 
so you can create a C# ASP.NET Web API app.

2. Select the **Web API** template. 
If not already selected, select **Host in the cloud**. 
Choose **Change Authentication**.

3. Select **No Authentication**, and choose **OK**.

4. When the **New ASP.NET Project** box appears, choose **OK**. 

5. When the **Configure Microsoft Azure Web App** box appears, 
review these Web App settings described in the table, make any changes, and choose **OK**.

   |Setting|Suggested value|Description| 
   |:------|:--------------|:----------| 
   |Your Azure work or school account, or your personal Microsoft account| |Select your user account.| 
   |**Web App name**|*custom-web-api-app-name*, or the default name|Enter the name for your Web API app, which is used in your app's URL.| 
   |**Subscription**|*Azure-subscription-name*|Select the Azure subscription that you want to use.|
   |**App Service plan**|*App-Service-plan-name*|Select an existing App Service plan, or if you haven't already, create a plan. <p>**Note:** An App Service plan is a web app collection in your Azure subscription.| 
   |**Resource group**|*Azure-resource-group-name*|Select an existing Azure resource group, or if you haven't already, create a resource group. <p>**Note**: An Azure resource group organizes Azure resources in your Azure subscription.| 
   |**Region**|*deployment-region*|Select the region for deploying your Web App.| 
   |**Database server**|*database-server*|If required by your Web API app, select or create an Azure datbase server.|
   ||| 

6. Create or add the code for your Web API app.

## Create a Swagger file that describes your Web API

To connect your Web API app to Logic Apps, 
you need a Swagger file that describes your API's operations. 
You can write your own OpenAPI definition for your API with the online editor, 
but this tutorial uses an open source tool named Swashbuckle.

1. If you haven't already, install the Swashbuckle Nuget 
package in your Visual Studio project. 

   1. Choose **Tools** > **NuGet Package Manager** > **Package Manager Console**.

   2. In the **Package Manager Console**, enter this command: 
   
      `Install-Package Swashbuckle`

2. If you haven't already, run your Web API app.

   After you install Swashbuckle and run your Web API app, 
   Swashbuckle generates an OpenAPI file at this URL: 

   http://*{your-web-app-root-URL}*/swagger/docs/v1
   
   Swashbuckle also generates a user interface at this URL: 
      
   http://*{your-web-app-root-URL}*/swagger

3. When you're ready, publish your Web API app to Azure. 
To publish from Visual Studio, 
right-click your web project in Solution Explorer, 
choose **Publish...**, and follow the prompts.

   > [!IMPORTANT]
   > Duplicate operation IDs make an OpenAPI document invalid. 
   > If you used the sample C# template, 
   > the template *repeats this operation ID twice*: `Values_Get` 
   > 
   > To fix this problem, change one instance to `Value_Get` and republish.

4. Get the OpenAPI document by browsing to this location: 

   http://*{your-web-app-root-URL}*/swagger/docs/v1

   You can also download a [sample OpenAPI document](http://pwrappssamples.blob.core.windows.net/samples/webAPI.json) 
   from this tutorial. 
   Make sure that you remove the comments, which starting with "//", 
   before you use the document.

5. Save the content as a JSON file. Based on your browser, 
you might have to copy and paste the text into an empty text file.

## Set up authentication with Azure Active Directory



