---
title: Create customer insights dashboard
description: Manage customer feedback, social media data, and more by building a customer dashboard with Azure Logic Apps and Azure Functions
services: logic-apps
ms.suite: integration
author: jeffhollan
ms.author: jehollan
ms.reviewer: estfan, logicappspm
ms.topic: article
ms.date: 03/15/2018
---

# Create a streaming customer insights dashboard with Azure Logic Apps and Azure Functions

Azure offers [serverless](https://azure.microsoft.com/solutions/serverless/) tools that help you quickly build 
and host apps in the cloud, without having to think about infrastructure. 
In this tutorial, you can create a dashboard that triggers on customer feedback, 
analyzes feedback with machine learning, and publishes insights to a source, 
such as Power BI or Azure Data Lake.

For this solution, you use these key Azure components for serverless apps: 
[Azure Functions](https://azure.microsoft.com/services/functions/) and 
[Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/).
Azure Logic Apps provides a serverless workflow engine 
in the cloud so that you can create orchestrations across 
serverless components and connect to 200+ services and APIs. 
Azure Functions provides serverless computing in the cloud. 
This solution uses Azure Functions for flagging customer 
tweets based on predefined keywords.

In this scenario, you create a logic app that triggers on finding feedback from customers. 
Some connectors that help you respond to customer feedback include Outlook.com, 
Office 365, Survey Monkey, Twitter, and an 
[HTTP request from a web form](https://blogs.msdn.microsoft.com/logicapps/2017/01/30/calling-a-logic-app-from-an-html-form/). 
The workflow that you create monitors a hashtag on Twitter.

You can [build the entire solution in Visual Studio](../logic-apps/quickstart-create-logic-apps-with-visual-studio.md) 
and [deploy the solution with Azure Resource Manager template](../logic-apps/logic-apps-deploy-azure-resource-manager-templates.md). 
For a video walkthrough that shows how to create this solution, 
[watch this Channel 9 video](https://aka.ms/logicappsdemo). 

## Trigger on customer data

1. In the Azure portal or Visual Studio, 
create a blank logic app. 

   If you're new to logic apps, 
   review the [quickstart for the Azure portal](../logic-apps/quickstart-create-first-logic-app-workflow.md) 
   or the [quickstart for Visual Studio](../logic-apps/quickstart-create-logic-apps-with-visual-studio.md).

2. In Logic App Designer, find and add the 
Twitter trigger that has this action: 
**When a new tweet is posted**

3. Set up the trigger to listen for 
tweets based on a keyword or hashtag.

   On polling-based triggers, 
   such as the Twitter trigger, 
   the recurrence property 
   determines how often the logic app 
   checks for new items.

   ![Example of Twitter trigger][1]

This logic app now fires on all new tweets. 
You can then take and analyze the tweet data 
so that you can better understand the sentiments expressed. 

## Analyze tweet text

To detect the sentiment behind some text, 
you can use [Azure Cognitive Services](https://azure.microsoft.com/services/cognitive-services/).

1. In Logic App Designer, under the trigger, choose **New step**.

2. Find the **Text Analytics** connector.

3. Select the **Detect Sentiment** action.

4. If prompted, provide a valid Cognitive Services 
key for the Text Analytics service.

5. Under **Request Body**, select the **Tweet Text** 
field, which provides the tweet text as input for analysis.

After you get the tweet data and insights about the tweet, 
you can now use several other relevant connectors and their actions:

* **Power BI - Add Rows to Streaming Dataset**: 
View incoming tweets on a Power BI dashboard.
* **Azure Data Lake - Append file**: 
Add customer data to an Azure Data Lake dataset to include in analytics jobs.
* **SQL - Add rows**: Store data in a database for later retrieval.
* **Slack - Send message**: Notify a Slack channel 
about negative feedback that might require action.

You can also create and an Azure Function 
so that you can perform custom processing on your data. 

## Process data with Azure Functions

Before you create a function, 
create a function app in your Azure subscription. 
Also, for your logic app to directly call a function, 
the function must have an HTTP trigger binding, 
for example, use the **HttpTrigger** template. 
Learn [how to create your first function app and function in the Azure portal](../azure-functions/functions-create-first-azure-function-azure-portal.md).

For this scenario, use the tweet text as 
the request body for your Azure Function. 
In your function code, define the logic 
that determines whether the tweet 
text contains a keyword or phrase. 
Keep the function as simple or complex 
as necessary for the scenario.
At the end of the function, return a 
response to the logic app with some data, 
for example, a simple boolean value such 
as `containsKeyword` or a complex object.

> [!TIP]
> To access a complex response from a 
> function in a logic app, use the **Parse JSON** action.

When you're done, save the function 
and then add the function as an action 
in the logic app that you're building.

## Add Azure function to logic app

1. In Logic App Designer, under the **Detect Sentiment** action, 
choose **New step**.

2. Find the **Azure Functions** connector, 
and then select the function that you created.

3. Under **Request Body**, select **Tweet Text**.

![Configured Azure Function step][2]

## Run and monitor your logic app

To review any current or previous runs for your logic app, 
you can use the rich debugging and monitoring capabilities 
that Azure Logic Apps provides in the Azure portal, 
Visual Studio, or through the Azure REST APIs and SDKs.

To easily test your logic app, in Logic App Designer, 
choose **Run Trigger**. The trigger polls for tweets 
based on your specified schedule until a tweet that 
meets your criteria is found. While the run progresses, 
the designer shows a live view for that run.

To view previous run histories in Visual Studio or the Azure portal: 

* Open Visual Studio Cloud Explorer. 
Find your logic app, open the app's shortcut menu. 
Select **Open run history**.

  > [!TIP]
  > If you don't have this command in Visual Studio 2019, check that you have the latest updates for Visual Studio.

* In the Azure portal, find your logic app. 
On your logic app's menu, choose **Overview**. 

## Create automated deployment templates

After you create a logic app solution, 
you can capture and deploy your app as an 
[Azure Resource Manager template](../azure-resource-manager/templates/overview.md) 
to any Azure region in the world. 
You can use this capability both to modify parameters 
for creating different versions of your app and for 
integrating your solution into Azure Pipelines. 
You can also include Azure Functions in your deployment 
template so that you can manage the entire solution 
with all dependencies as a single template. Learn 
how to [automate logic app deployment](logic-apps-azure-resource-manager-templates-overview.md).

For an example deployment template with an Azure function, 
check the [Azure quickstart template repository](https://github.com/Azure/azure-quickstart-templates/tree/master/101-function-app-create-dynamic).

## Next steps

* [Find other examples and scenarios for Azure Logic Apps](logic-apps-examples-and-scenarios.md)

<!-- Image References -->
[1]: ./media/logic-apps-scenario-social-serverless/twitter.png
[2]: ./media/logic-apps-scenario-social-serverless/function.png
