---
title: Add LUIS endpoint information to Application Insights  | Microsoft Docs 
description: Build an Azure Function to add LUIS query information to Application Insights.
services: cognitive-services
author: v-geberr
manager: kamran.iqbal

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 01/12/2018
ms.author: v-geberr
---

# Use an Azure Function app to add LUIS information to Application Insights

## Prerequisites

> [!div class="checklist"]
* Your LUIS **[LUIS endpoint key](manage-keys#endpoint-key)**. 
* Your existing LUIS [**application ID**](./luis-get-started-create-app.md). The application ID is shown in the application dashboard. 

> [!Tip]
> If you do not already have a subscription, you can register for a [free account](https://azure.microsoft.com/free/).

## Scenario
This tutorial will add LUIS request and response information to the ApplicationInsights telemetry data storage. 

## What is ApplicationInsights?
Use [Application Insights](https://docs.microsoft.com/azure/application-insights/app-insights-overview) to monitor your live web application. It includes powerful analytics tools to help you diagnose telemetry issues and to understand what users actually do with your app. It's designed to help you continuously improve performance and usability. 

Currently, LUIS does not natively support Application Insights telemetry, but the Azure Function service does. 

## What is an Azure function app?
The [Azure Function](https://docs.microsoft.com/azure/azure-functions/) app is a serverless platform, currently supporting C# and Nodejs. An Azure function app is a unit of code that is executed based on an HTTP call. Azure functions can be triggered, cascaded, and returned to the caller. Any code you can call from .Net Core or Nodejs can be called from an Azure function. You have access to both NuGet (C#) and NPM (Nodejs) modules.

While you can develop Azure functions local to your development computer, you can also use the Azure portal's development environment for functions. Using the portal is a better fit for working with ApplicationInsights for this tutorial. 

While the Azure function in this tutorial is written in C#, your calling code can be in any programming language. The Azure function is a drop-in replacement for the LUIS endpoint. 

## Function purpose

This tutorial will wrap the LUIS API endpoint query in an Azure function. The function's purpose is to send LUIS query or error information to Application Insights. Instead of calling the LUIS API as an HTTP Request, you call the Azure function as an HTTP Request. The function returns the LUIS query results or errors without altering them.

![Concept of Azure Function](./media/luis-tutorial-appinsights/concept.png)

The function can, in additional to calling LUIS and Application Insights, call or use any REST or SDK on the C# or Nodejs platform. 

## Data Storage

Each call to the Azure function adds custom information to your Application Insights service including the LUIS query response of intents, entities, and scores, Azure Keys, LUIS App ID, and the region. Each custom data item is a name/value pair. In Application Insights, all the custom data is stored in a single JSON field of name/value pairs. 

## Azure services
The tutorial uses four Azure resources. The Azure function service is hosted in an App Service plan. The ApplicationInsights service stores data in an Azure Storage Account. When the Azure function is created, your Azure resources list has 4 new items:

|Azure Service|Purpose|
|--|--|
|ApplicationInsights|ApplicationInsights|Application Analytics|
|Azure Function app (AppService)|Serverless code|
|Storage Account|Data storage|
|App Service plan|Hosts app|

For this tutorial, all 4 services are in the "West US 2" region.

## Create the Function app
1. Sign in to **[Microsoft Azure](https://ms.portal.azure.com/)** 
2. Click the green **+** sign in the upper left-hand panel and search for "Function app" in the marketplace, and follow the **create experience** to create a Function app.

    ![Azure Search](./media/) 

3. Create the Function app with settings including account name, pricing tiers, etc. Select **Consumption Plan** for the Hosting plan. Turn on **Application Insights**. Select "West US 2" for he Hosting Plan and Application Insights Location regions. Check **Pin to dashboard** so you can quickly return to the function. Select **Create**.

    ![Function app creation settings](./media/) 

When Deployment succeeds, you see the Function app settings. This is currently an empty Function app. You need to add the first function.

## Add function
1. In the Function apps list on the left, click on the blue **+** symbol to add a function.
2. Select a **Webhook + API** scenario and choose **CScharp** for the language. Then click **Create this function**.

The functions list, under the Function Apps, shows one function named **HttpTriggerCSharp1**. The right window displays the code for run.csx. The method inside the file, **Run** is the main entry. 

By default, when you call it with an HTTP request with a query string or body that includes "name" and a value for "name", the function sends an HTTP response of "Hello " + name. If no value for name was provided, the function sends an HTTP error of BadRequest and a message asking for a name. 

You can test the function in the far-right **Test** pane. Click on **Run**. You can see the log of the function at the bottom, under the code window. Click the blue **^** to enlarge the log view. 

You now have a working function. 

> [!CAUTION]
> Since you do not have the Visual Studio Intellisense in the portal, your function may error without an explanation. A best practice is to make small changes and test often. 

## Function files
All files associated with the function are available for editing. You can view the files by clicking **View files** next to **Test** in the far-right panel. A basic function has a function.json file, a readme.md file, and a run.csx file. You can add, delete, or upload a file.

> [!Note]
> * For this tutorial, you do not need to change the function.json or the readme.md files.

## Add Application Insights dependency
A basic function has no dependencies so the dependency file, **package.json** is not in the list. Create the file and add the following code:

   [!code-javascript[Package.json dependencies](~/samples-luis/documentation-samples/azure-function-application-insights-endpoint/project.json)]

## Add C# code
## Test successful LUIS Query
## Test failing LUIS Query
## View LUIS entries in Application Insights
## View LUIS entries in Analytics

## Next steps

> [!div class="nextstepaction"]
> [Test and train your app in LUIS.ai](Train-Test.md)