---
title: Build serverless apps with Azure Logic Apps & Azure Functions in Visual Studio
description: Build, deploy, and manage your first serverless app with Azure Logic Apps and Azure Functions in Visual Studio
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.custom: vs-azure
ms.topic: article
ms.date: 04/25/2019
---

# Build your first serverless app with Azure Logic Apps and Azure Functions - Visual Studio

You can quickly develop and deploy cloud apps by using the 
serverless tools and capabilities in Azure such as 
[Azure Logic Apps](../logic-apps/logic-apps-overview.md) 
and [Azure Functions](../azure-functions/functions-overview.md). 
This article shows how to start building a serverless app, 
which uses a logic app that calls an Azure function, in Visual Studio. 
To learn more about serverless solutions in Azure, see 
[Azure Serverless with Functions and Logic Apps](../logic-apps/logic-apps-serverless-overview.md).

## Prerequisites

To build a serverless app in Visual Studio, you need these items:

* An Azure subscription. If you don't have an Azure subscription, 
[sign up for a free Azure account](https://azure.microsoft.com/free/).

* Download and install these tools, if you don't have them already:

  * [Visual Studio 2019, 2017, or 2015 - Community edition or greater](https://aka.ms/download-visual-studio). 
  This quickstart uses Visual Studio Community 2017, which is free.

    > [!IMPORTANT]
    > When you install Visual Studio 2019 or 2017, make sure 
    > that you select the **Azure development** workload.

  * [Microsoft Azure SDK for .NET (2.9.1 or later)](https://azure.microsoft.com/downloads/). 
  Learn more about [Azure SDK for .NET](https://docs.microsoft.com/dotnet/azure/dotnet-tools?view=azure-dotnet).

  * [Azure PowerShell](https://github.com/Azure/azure-powershell#installation)

  * Azure Logic Apps Tools for the Visual Studio version you want:

    * [Visual Studio 2019](https://aka.ms/download-azure-logic-apps-tools-visual-studio-2019)

    * [Visual Studio 2017](https://aka.ms/download-azure-logic-apps-tools-visual-studio-2017)

    * [Visual Studio 2015](https://aka.ms/download-azure-logic-apps-tools-visual-studio-2015)
  
    You can either download and install Azure Logic Apps Tools 
    directly from the Visual Studio Marketplace, or learn 
    [how to install this extension from inside Visual Studio](https://docs.microsoft.com/visualstudio/ide/finding-and-using-visual-studio-extensions). 
    Make sure that you restart Visual Studio after you finish installing.

  * [Azure Functions Core Tools](https://www.npmjs.com/package/azure-functions-core-tools) 
  for locally debugging Functions

* Access to the web while using the embedded Logic App Designer

  The designer requires an internet connection to create resources in Azure 
  and to read the properties and data from connectors in your logic app. 
  For example, if you use the Dynamics CRM Online connector, 
  the designer checks your CRM instance for available 
  default and custom properties.

## Create resource group project

To get started, create an 
[Azure Resource Group project](../azure-resource-manager/vs-azure-tools-resource-groups-deployment-projects-create-deploy.md) 
for your serverless app. In Azure, you create resources within a resource group, 
which is a logical collection you use for organizing, managing, and deploying 
resources for an entire app as a single asset. For a serverless app in Azure, 
your resource group includes resources for both Azure Logic Apps and Azure Functions. 
Learn more about [Azure resource groups and resources](../azure-resource-manager/resource-group-overview.md).

1. Start Visual Studio, and sign in with your Azure account.

1. On the **File** menu, select **New** > **Project**.

   ![Create new project in Visual Studio](./media/logic-apps-serverless-get-started-vs/create-new-project-visual-studio.png)

1. Under **Installed**, select **Visual C#** or **Visual Basic**. 
Select **Cloud** > **Azure Resource Group**.

   > [!NOTE]
   > If the **Cloud** category or **Azure Resource Group** project doesn't exist, 
   > make sure you installed the Azure SDK for Visual Studio.

   If you're using Visual Studio 2019, follow these steps:

   1. In the **Create a new project** box, select the 
   **Azure Resource Group** project template for either 
   Visual C# or Visual Basic, and choose **Next**.

   1. Provide the name for the Azure resource group you want to use 
   and other project information. When you're done, choose **Create**.

1. Give your project a name and a location, and then choose **OK**.

   Visual Studio prompts you to select a template from the templates list. 
   This example uses an Azure Quickstart template so you can build a serverless 
   app that includes a logic app and a call to an Azure function.

   > [!TIP]
   > In scenarios where you don't want to predeploy your solution 
   > into an Azure resource group, you can use the blank **Logic App** 
   > template, which just creates an empty logic app.

1. From the **Show templates from this location** list, 
select **Azure Quickstart (github.com/Azure/azure-quickstart-templates)**.

1. In the search box, enter "logic-app" as your filter. 
From the results, select this template: **101-logic-app-and-function-app**

   ![Select Azure quickstart template](./media/logic-apps-serverless-get-started-vs/select-template.png)

   Visual Studio creates and opens a solution for your resource group project. 
   The Azure Quickstart template you selected creates a deployment template 
   named `azuredeploy.json` inside your resource group project. This deployment 
   template includes the definition for a simple logic app that triggers on an 
   HTTP request, calls an Azure function, and returns the result as an HTTP response.

   ![New serverless solution](./media/logic-apps-serverless-get-started-vs/create-serverless-solution.png)

1. Next, you must deploy your solution to Azure before you can open 
the deployment template and review the resources for your serverless app.

## Deploy your solution

Before you can open your logic app with the Logic App Designer in Visual Studio, 
you must have an Azure resource group that's already deployed in Azure. The designer 
can then create connections to resources and services in your logic app. For this task, 
deploy your solution from Visual Studio to the Azure portal.

1. In Solution Explorer, from your resource project's shortcut menu, 
select **Deploy** > **New**.

   ![Create new deployment for resource group](./media/logic-apps-serverless-get-started-vs/deploy.png)

1. If not already selected, select your Azure subscription and the
resource group to where you want to deploy. Choose **Deploy**.

   ![Deployment settings](./media/logic-apps-serverless-get-started-vs/deploy-to-resource-group.png)

1. If the **Edit Parameters** box appears, provide the resource name 
to use for your logic app and your Azure function app at deployment, 
and then save your settings. Make sure you use a globally unique name 
for your function app.

   ![Provide names for your logic app and function app](./media/logic-apps-serverless-get-started-vs/logic-function-app-name-parameters.png)

   When Visual Studio starts deployment to your specified resource group, 
   your solution's deployment status appears in the Visual Studio **Output** window. 
   After deployment finishes, your logic app is live in the Azure portal.

## Edit logic app in Visual Studio

Now that your solution is deployed to your resource group, 
open your logic app with the Logic App Designer so that you 
can edit and change your logic app.

1. In Solution Explorer, from the `azuredeploy.json` file's shortcut menu, 
select **Open With Logic App Designer**.

   ![Open "azuredeploy.json" in Logic App Designer](./media/logic-apps-serverless-get-started-vs/open-logic-app-designer.png)

1. After the **Logic App Properties** box appears and if not already selected, 
under **Subscription**, select your Azure subscription. Under **Resource Group**, 
select the resource group and location where you deployed your solution, 
and then choose **OK**.

   ![Logic app properties](./media/logic-apps-serverless-get-started-vs/logic-app-properties.png)

   After the Logic App Designer opens, you can continue adding steps or change the workflow, and save your updates.

   ![Opened logic app in Logic App Designer](./media/logic-apps-serverless-get-started-vs/opened-logic-app.png)

## Create Azure Functions project

To create your Functions project and function with JavaScript, 
Python, F#, PowerShell, Batch, or Bash, follow the steps in the article, 
[Work with Azure Functions Core Tools](../azure-functions/functions-run-local.md). 
To develop your Azure function with C# inside your solution, you can 
use a C# class library by following the steps in the article, 
[Publish a .NET class library as a Function App](https://blogs.msdn.microsoft.com/appserviceteam/2017/03/16/publishing-a-net-class-library-as-a-function-app/).

## Deploy functions from Visual Studio

Your deployment template deploys any Azure functions that you have in your solution 
from the Git repo that's specified by variables in the `azuredeploy.json` file. 
If you create and author your Functions project in your solution, you can check 
that project into Git source control, for example, GitHub or Azure DevOps, 
and then update the `repo` variable so that the template deploys your Azure function.

## Manage logic apps and view run history

For logic apps already deployed in Azure, you can still edit, 
manage, view run history, and disable those apps from Visual Studio.

1. From the **View** menu in Visual Studio, open **Cloud Explorer**.

1. Under **All subscriptions**, select the Azure subscription 
associated with the logic apps you want to manage, and choose **Apply**.

1. Under **Logic Apps**, select your logic app. From that app's shortcut menu, 
select **Open with Logic App Editor**.

You can now download the already published logic app into your resource group project. 
So although you might have started a logic app in the Azure portal, you can still import 
and manage that app in Visual Studio. For more information, see 
[Manage logic apps with Visual Studio](../logic-apps/manage-logic-apps-with-visual-studio.md).

## Next steps

* [Manage logic apps with Visual Studio](manage-logic-apps-with-visual-studio.md)
