---
title: Create a logic app  | Microsoft Docs
description:
services: logic-apps
keywords: workflow, cloud apps, cloud services, business processes, system integration, enterprise application integration, EAI
documentationcenter: ''
author: rick-anderson
manager: wpickett
editor: ''

ms.assetid: 60495cc5-1638-4bf0-8174-52786d227734
ms.service: logic-apps
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 05/08/2017
ms.author: riande
---

# Create your first logic app workflow 

This quickstart will show you how to create a logic app in the Azure portal that:

* Checks for new tweets using a keyword you supply.
* Uses the **Detect Sentiment** connector to estimate the tweets sentiment (from poor to very good).
* Use an Azure function to process the tweet sentiment into three categories (RED, YELLOW or GREEN).
* Uses a condition to check if the sentiment is RED (poor).
* Sends an email if the condtion is RED.

The following image shows the completed app in the **Logic App Designer**.

![image of completed app in Logic App Designer](media/functions-twitter-email/designer1.png)

## Log in to Azure

Log in to the [Azure portal](https://portal.azure.com/).

## Create a Cognitive Services account

A Cognitive Services account is required to detect the sentiment of tweets we will be monitoring. 

1. Navigate to **New > Intelligence + analytics > Cognitive  Services**. Set each required field:


 * **API type** : **Text Analytics API**
 * **Pricing tier** : **F0 (5K Calls per 30 days)**. If you run out of calls, set to a higer tier.

 ![Create Cognitive account blade](media/functions-twitter-email/cog_svcs_account.png)

1. Select **Keys** to show the keys. You'll need a key in a later step.

 ![Keys](media/functions-twitter-email/keys.png)

## Create an Azure Function App

<!-- TODO make Azure Function App  a link -->

Create an Azure Function App to categorize the tweet sentiment into three categories (RED, YELLOW or GREEN).

1. Select **New > Compute > Function App**

 ![New > compute > function app](media/functions-twitter-email/fun_app.png)

1. Complete the **Function App** input fields:

  * **App name** : Use a name you can associate with this project.
  * **Resource Group** : Select the resource group you previously created.
  * **Hosting Plan** : Select **Consumption Plan**, which  is billed based on resource consumption and executions. <!-- TODO link to https://azure.microsoft.com/en-us/pricing/details/functions/ -->
  * **Location** : Select a location you used previously.
  * Select **Create**.

1. Once the Function App deploys, add a function:

 ![Function Apps blade, Functions +](media/functions-twitter-email/add_fun.png)

1. Replace the contents of the *run.csx* file with the following code:

```c#
using System.Net;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{
    log.Info("C# HTTP trigger function processed a request.");
    string category = "GREEN";

    // Get request body
    double score = await req.Content.ReadAsAsync<double>();

    if (score < .3)
    {
        category = "RED";
    }
    else if (score < .6)
    {
        category = "YELLOW";
    }

    return req.CreateResponse(HttpStatusCode.OK, category);
}
```

  Save the change.

1. Select **Test** (shown in red above).
1. Enter 0.2 in the **Request body** text box and then select **Run**. The output shows "RED" and the HTTP status is 200 OK.

 ![enter new code and save](media/functions-twitter-email/save_fun.png)

## Create a logic app

1. In the Azure Portal, click the **New > Web + Mobile > Logic App**

![new logic app step above](media/functions-twitter-email/new_logicApp.png)

1. In the **Create logic app** blade, enter each field, and the select **Create**.

![Create logic app step above](media/functions-twitter-email/new_logicApp2.png)

 Once the logic app is created, it opens in the designer.

1. Select the **Blank Logic App** template.

![Blank Logic App](media/functions-twitter-email/blank.png)

## Add a trigger to twitter

The **Logic App Designer** displays many services and triggers you can connect to.

1. Select the **Twitter** service.

![twitter connector](media/functions-twitter-email/twitter_connector.png)

1. Select the **When a new tweet is posted** trigger.

![When a new tweet is posted trigger](media/functions-twitter-email/tw_trig.png)

1. Sign in to your twitter account.

![Sign in to your twitter account](media/functions-twitter-email/signin_twit.png)

1. Enter your password and select **Authorize app**.

![auth twitter new window from above](media/functions-twitter-email/auth_twit.png)

1. Enter the search text, frequency and interval. If you specify a popular term (such as #football, #soccer, or #futbol), you can quickly use all your [TODO]. #Azure every 15 minutes works pretty well:

![#Azure every 15 min](media/functions-twitter-email/azure_tweet.png)

1. Select **New Step**, and then **Add an action**.

![New Step, and then Add an action](media/functions-twitter-email/new_step.png)

1. Add the **Text Analytics** connector.

![Chose an action window](media/functions-twitter-email/choose_action.png)

1. Select the **Detect Sentiment** action. The sentiment rating is often good, but it sometimes misinterperts the text.

![Detect Sentiment](media/functions-twitter-email/detect_sent.png)

1. Create the Detect Sentiment action:

  * Enter a connection name such as **MyKey**.
  * Copy and paste the key you created in the [Create a Cognitive Services account](#create-a-cognitive-services-account) step. 
  * Select **Create**.
  * Save the app.


![Detect Sentiment](media/functions-twitter-email/ta_detect_sent.png)

1. Select the **Tweet text** icon for the **Text to analyze**

![Detect Sentiment](media/functions-twitter-email/ds_tta.png)

![Detect Sentiment](media/functions-twitter-email/ds_tta2.png)

 Save the app.


## Add an Azure Function

In this section, we'll add the Azure Function we created previously that categorized tweet sentiment as RED, YELLOW or GREEN.

1. In the Logic Apps Designer, select **New step**, and then select **Add an action**.
1. Select **Azure Functions**.
1. Select **Choose an Azure function**.

![Azure Function box showing Choose an Azure function](media/functions-twitter-email/choose_fun.png)

1. Select the Azure Function you previously created.
1. Select **Score** to populate the **Request Body**.

![Score](media/functions-twitter-email/trigger_score.png)

1. Save the app.


