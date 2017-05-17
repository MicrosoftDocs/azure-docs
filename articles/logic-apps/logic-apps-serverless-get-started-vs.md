---
title: Build a serverless app in Visual Studio | Microsoft Docs
description: Get started with your first serverless app with this guide on creating, deploying, and managing the app in Visual Studio.
keywords: ''
services: logic-apps
author: jeffhollan
manager: anneta
editor: ''
documentationcenter: ''

ms.assetid: d565873c-6b1b-4057-9250-cf81a96180ae
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/30/2017
ms.author: jehollan
---
# Build a serverless app in Visual Studio with Logic Apps and Functions

Serverless tools and capabilities in Azure allow for rapid development and deployment of cloud applications.  This document focuses on how to get started in Visual Studio building a serverless application.  An overview of serverless in Azure [can be found in this article](logic-apps-serverless-overview.md).

## Getting everything ready

Here are the prerequisites needed to build a serverless application from Visual Studio:

* [Visual Studio 2017](https://www.visualstudio.com/vs/) or Visual Studio 2015 - Community, Professional, or Enterprise
* [Logic Apps Tools for Visual Studio](https://marketplace.visualstudio.com/items?itemName=VinaySinghMSFT.AzureLogicAppsToolsforVisualStudio-18551)
* [Latest Azure SDK](https://azure.microsoft.com/downloads/) (2.9.1 or greater)
* [Azure PowerShell](https://github.com/Azure/azure-powershell#installation)
* [Azure Functions CLI](https://www.npmjs.com/package/azure-functions-cli) to debug Functions locally
* Access to the web when using the embedded Logic App designer

## Getting started with a deployment template

Managing resources in Azure are done within a resource group.  A resource group is a logical grouping of resources.  Resource groups allow deployment and management of a collection of resources.  For a Serverless application in Azure, our resource group contains both Azure Logic Apps, and Azure Functions.  By using the Resource Group project within Visual Studio, we are able to develop, manage, and deploy the entire application as a single asset.

### Create a Resource Group project in Visual Studio

1. In Visual Studio, click to add a **New Project**
1. In the **Cloud** category, select to create an Azure **Resource Group** project  
 * If you do not see the category or project listed, be sure you have the Azure SDK installed for Visual Studio
1. Give the project a name and location, and select **Ok** to create
    Visual Studio prompts to select a template.  You could select to start from Blank, start with a Logic App or other resource.  However, in this case we use an Azure Quickstart Template to get us started with a serverless app.
1. Select to show templates from **Azure Quickstart**
    ![Selecting Azure Quickstart templates][1]
1. Select the serverless quickstart template: **101-logic-app-and-function-app** and click **Ok**

The quickstart template creates a deployment template in your resource group project.  The template contains a simple Logic App that calls an Azure Functions, and returns the result.  If you open the `azuredeploy.json` file in the Solution Explorer, you can see the resources for the serverless app.

## Deploying the serverless application

Before you can open the Logic App visual designer in Visual Studio, there needs to be a pre-deployed Azure Resource Group.  This allows the designer to create and use connections to resources and services in the logic app.  To get started, we simply need to deploy the solution created.

1. Right-click the project in Visual Studio, select **Deploy**, and create a **New** deployment
    ![Selecting new resource deployment][2]
1. Select a valid Azure subscription and Resource group
1. Select to **Deploy** the solution
1. Enter in the name for the Logic App and the Azure Function App.  The Azure Function name does need to be globally unique

The serverless solution deploys into the specified resource group.  If you look at the **Output** in Visual Studio you can see the status of the deployment.

## Editing the logic app in Visual Studio

Once the solution has been deployed into any resource group, the visual designer can be used to edit and make changes to the logic app.

1. Right-click the `azuredeploy.json` file in the Solution Explorer and select **Open With Logic Apps Designer**
1. Select the **Resource Group** and **Location** the solution has been deployed to and select **OK**

The Logic App visual designer should now be visible with Visual Studio.  You can continue to add steps, modify the workflow, and save changes.  You can also create logic apps from Visual Studio.  If you right-click the **Resources** in the template navigator, you can choose to add a **Logic App** to the project.  Empty logic apps load in the visual designer without a pre-deploy into a resource group.

### Managing and viewing run history for a deployed logic app

You can also manage and view the run history for logic apps deployed in Azure.  If you open the **Cloud Explorer** tool in Visual Studio, you can right-click any Logic App and choose to edit, disable, view properties, or view run history.  Clicking edit also allows you to download a published logic app into a Visual Studio Resource Group project.  This means that even if you started building your logic app in the Azure portal, you can still import it and manage it from Visual Studio.

## Developing an Azure Function in Visual Studio

The deployment template deploys any Azure Functions that are contained in the solution for the git repository specified in the `azuredeploy.json` variables.  If you author a function project within the solution, check it into source control (GitHub, Visual Studio Team Services, etc.), and update the `repo` variable, the template will deploy the Azure Function.

### Creating an Azure Function project

If using JavaScript, Python, F#, Bash, Batch, or PowerShell, follow the [steps in the Functions CLI](../azure-functions/functions-run-local.md) to create a project.  If developing a function in C#, you can use a [C# class library](https://blogs.msdn.microsoft.com/appserviceteam/2017/03/16/publishing-a-net-class-library-as-a-function-app/) in the current solution for the Azure Function.

## Next steps

* [Learn how to build a serverless social dashboard](logic-apps-scenario-social-serverless.md)
* [Manage a logic app from Visual Studio Cloud Explorer](logic-apps-manage-from-vs.md)
* [Logic App workflow definition language](logic-apps-workflow-definition-language.md)

<!-- Image references -->
[1]: ./media/logic-apps-serverless-get-started-vs/select-template.png
[2]: ./media/logic-apps-serverless-get-started-vs/deploy.png