---
title: Serverless scenario - Create a customer insights dashboard with Azure | Microsoft Docs
description: Learn how you can manage customer feedback, social media data, and more by building a customer dashboard with Azure Logic Apps and Azure Functions
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
ms.date: 03/29/2017
ms.author: jehollan; LADocs
---

# Create a streaming customer insights dashboard with Azure Logic Apps and Azure Functions

Azure offers serverless tools that help you quickly build 
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
tweets based on predefined keyswords.

In this scenario, you create a logic app 
that triggers on finding feedback from customers. 
Some connectors that help you respond to 
customer feedback include Outlook.com, 
Office 365, Survey Monkey, Twitter, and an 
[HTTP request from a web form](https://blogs.msdn.microsoft.com/logicapps/2017/01/30/calling-a-logic-app-from-an-html-form/). 
The workflow that you create monitors 
a hashtag on Twitter.

You can [build the entire solution in Visual Studio](../logic-apps/quickstart-create-logic-apps-with-visual-studio.md) 
and [deploy the solution with Azure Resource Manager template](../logic-apps/logic-apps-create-deploy-template.md). 
For a video walkthrough, watch [this Channel 9 video](http://aka.ms/logicappsdemo).

## Build the logic app to trigger on customer data

After [creating a logic app](quickstart-create-first-logic-app-workflow.md) in Visual Studio or the Azure portal:

1. Add a trigger for **On New Tweets** from Twitter
2. Configure the trigger to listen to tweets on a keyword or hashtag.

   > [!NOTE]
   > The recurrence property on the trigger will determine how frequently the logic app checks for new items on polling-based triggers

   ![Example of Twitter trigger][1]

This app will now fire on all new tweets.  We can then take that tweet data and understand more of the sentiment expressed.  For this we use the [Azure Cognitive Service](https://azure.microsoft.com/services/cognitive-services/) to detect sentiment of text.

1. Click **New Step**
1. Select or search for the **Text Analytics** connector
1. Select the **Detect Sentiment** operation
1. If prompted, provide a valid Cognitive Services key for the Text Analytics service
1. Add the **Tweet Text** as the text to analyze.

Now that we have the tweet data, and insights on the tweet, a number of other connectors may be relevant:
* Power BI - Add Rows to Streaming Dataset: View tweets real time on a Power BI dashboard.
* Azure Data Lake - Append file: Add customer data to an Azure Data Lake dataset to include in analytics jobs.
* SQL - Add rows: Store data in a database for later retrieval.
* Slack - Send message: Alert a slack channel on negative feedback that requires actions.

An Azure Function can also be used to do more custom compute on top of the data.

## Enriching the data with an Azure Function

Before we can create a function, we need to have a function app in our Azure subscription.  Details on creating an Azure Function in the portal can [be found here](../azure-functions/functions-create-first-azure-function-azure-portal.md)

For a function to be called directly from a logic app, it needs to have an HTTP trigger binding.  We recommend using the **HttpTrigger** template.

In this scenario, the request body of the Azure Function would be the tweet text.  In the function code, simply define logic on if the tweet text contains a key word or phrase.  The function itself could be kept as simple or complex as needed for the scenario.

At the end of the function, simply return a response to the logic app with some data.  This could be a simple boolean value (e.g. `containsKeyword`), or a complex object.

![Configured Azure Function step][2]

> [!TIP]
> When accessing a complex response from a function in a logic app, use the Parse JSON action.

Once the function is saved, it can be added into the logic app created above.  In the logic app:

1. Click to add a **New Step**
1. Select the **Azure Functions** connector
1. Select to choose an existing function, and browse to the function created
1. Send in the **Tweet Text** for the **Request Body**

## Running and monitoring the solution

One of the benefits of authoring serverless orchestrations in Logic Apps is the rich debug and monitoring capabilities.  Any run (current or historic) can be viewed from within Visual Studio, the Azure portal, or via the REST API and SDKs.

One of the easiest ways to test a logic app is using the **Run** button in the designer.  Clicking **Run** will continue to poll the trigger every 5 seconds until an event is detected, and give a live view as the run progresses.

Previous run histories can be viewed on the Overview blade in the Azure portal, or using the Visual Studio Cloud Explorer.

## Creating a deployment template for automated deployments

Once a solution has been developed, it can be captured and deployed via an Azure deployment template to any Azure region in the world.  This is useful for both modifying parameters for different versions of this workflow, but also for integrating this solution in a build and release pipeline.  Details on creating a deployment template can be found [in this article](logic-apps-create-deploy-template.md).

Azure Functions can also be incorporated in the deployment template - so the entire solution with all dependencies can be managed as a single template.  An example of a function deployment template can be found in the [Azure quickstart template repository](https://github.com/Azure/azure-quickstart-templates/tree/master/101-function-app-create-dynamic).

## Next steps

* [See other examples and scenarios for Azure Logic Apps](logic-apps-examples-and-scenarios.md)
* [Watch a video walkthrough on creating this solution end-to-end](http://aka.ms/logicappsdemo)
* [Learn how to handle and catch exceptions within a logic app](logic-apps-exception-handling.md)

<!-- Image References -->
[1]: ./media/logic-apps-scenario-social-serverless/twitter.png
[2]: ./media/logic-apps-scenario-social-serverless/function.png