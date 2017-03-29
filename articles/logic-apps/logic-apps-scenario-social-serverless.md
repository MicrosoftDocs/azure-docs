---
title: Scenario - Create a customer insights dashboard with Azure Serverless | Microsoft Docs
description: An example of how you can build a dashboard to manage customer feedback, social data, and more with Azure Logic Apps and Azure Functions.
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
ms.author: jehollan
---
# Create a real-time customer insights dashboard with Azure Logic Apps and Azure Functions

Azure Serverless tools provide powerful capabilities to quickly build and host applications in the cloud, without having to think about infrastructure.  In this scenario, we will create a dashboard to trigger on customer feedback, analyze feedback with connectors provided out-of-the-box, enrich with Azure Functions, and publish to a source like Power BI, Azure Data Lake, or any other destination desired.

## Overview of the scenario and tools used

In order to impliment this solution we will levarage the two key components of serverless apps in Azure - [Azure Functions](https://azure.microsoft.com/services/functions/) and [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/).

Logic Apps is a serverless workflow engine in the cloud.  It provides orchestration across serverless components, and also connects to over 100 connectors out-of-the-box.  For this scenario, we will create a logic app to trigger on feedback from customers.  Some of the connectors that fit into this would include (but not be limited to) Outlook.com, Office 365, Survey Monkey, Twitter, and an HTTP Request [from a web form](https://blogs.msdn.microsoft.com/logicapps/2017/01/30/calling-a-logic-app-from-an-html-form/).  For this scenario, we will monitor a brand on Twitter with the Twitter connector.  

Functions provide serverless compute in the cloud.  In this scenario, we will use Azure Functions to flag tweets from customers based on a series of pre-defined key words.

The entire solution can be [build in Visual Studio](logic-apps-deploy-from-vs.md) and [deployed as part of a resource template](logic-apps-create-deploy-template.md).  There is also video walkthrough of the scenario [on Channel 9](http://aka.ms/logicappsdemo).

## Building the logic app to trigger on customer data

After [creating a logic app](logic-apps-create-a-logic-app.md) in Visual Studio or the Azure Portal:

1. Add a new trigger for **On New Tweets** from Twitter
1. Configure the trigger to listen to tweets on a keyword or hashtag.

> [!NOTE]
> The recurrence property on the trigger will determine how frequently the logic app checks for new items on polling-based triggers

![Example of Twitter trigger][1]

This app will now fire on all new tweets.  The next step we will analyze sentiment from the tweets.  For this we can leverage the out-of-the-box [Azure Congitive Service](https://azure.microsoft.com/services/cognitive-services/) connector to leverage sentiment of text.

1. Click **New Step**
1. Select or search for the **Text Analytics** connector
1. Select the **Detect Sentiment** operation
1. If prompted, provide a valid Cognitive Services key for the Text Analytics service
1. Add the **Tweet Text** as the text to analyze.

Now that we have the tweet data, and insights on the tweet, a number of other connectors may be relevant:
* Power BI - Add Rows to Streaming Dataset: View tweets real-time on a Power BI dashboard.
* Azure Data Lake - Append file: Add customer data to an Azure Data Lake dataset.
* SQL - Add rows: store data in a database for later retreival.
* Slack - Send message: Alert a slack channel on negative feedback that requires actions.

One other action we will add here is an Azure Function to process the tweet and flag it based on a pre-defined set of key words.

## Enriching the data with an Azure Function

Before we can create a function, we need to have a function app in our Azure subscription.  Details on creating an Azure Function in the portal can [be found here](../azure-functions/functions-create-first-azure-function-azure-portal.md)

For a function to be called directly from a logic app, it needs to have an HTTP trigger binding.  We recommend using the **HttpTrigger** template.

In this scenario, the request body of the Azure Function would be the tweet text.  Inside the function, simply define logic on if the tweet text contains a key word or phrase.  The function itself could be kept as simple or complex as needed for the scenario.

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

One of the benefits of authoring serverless orchestrations in Logic Apps is the rich debug and monitoring capabilities.  Any run (current or historic) can be viewed from within Visual Studio, the Azure Portal, or via the REST API and SDKs.

One of the easiest ways to test a logic app is using the **Run** button in the designer.  Clicking **Run** will continue to poll the trigger every 5 seconds until an event is detected, and give a live view as the run progresses.

Previous run histories can be viewed on the Overview blade in the Azure Portal, or using the Visual Studio Cloud Explorer.

## Creating a deployment template for automated deployments

Once a solution has been developed, it can be captured and deployed via an Azure deployment template to any Azure region in the world.  This is useful for both modifying parameters for different versions of this workflow, but also for integrating this solution in a build and release pipeline.  Details on creating a deployment template can be found [in this article](logic-apps-create-deploy-template.md).

Azure Functions can also be incorporated in the deployment template - so the entire solution with all dependencies can be managed as a single template.  An example of a function deployment template can be found in the [Azure Quickstart Template repo](https://github.com/Azure/azure-quickstart-templates/tree/master/101-function-app-create-dynamic) page.

## What's Next

* [See other examples and scenarios for Azure Logic Apps](logic-apps-examples-and-scenarios.md)
* [Watch a video walkthrough on creating this solution end-to-end](http://aka.ms/logicappsdemo)
* [Learn how to handle and catch exceptions within a logic app](logic-apps-exception-handling.md)

<!-- Image References -->
[1]: ./media/logic-apps-scenario-social-serverless/twitter.png
[2]: ./media/logic-apps-scenario-social-serverless/function.png