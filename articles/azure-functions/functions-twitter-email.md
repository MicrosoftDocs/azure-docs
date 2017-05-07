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

This quickstart shows you how to create a logic app in the Azure portal that:

* Checks for new tweets using a keyword you supply.
* Uses the **Detect Sentiment** connector to estimate the tweets sentiment (from poor to good).
* Uses an Azure function to process the tweet sentiment into three categories (RED, YELLOW, or GREEN - for poor, neutral, and good).
* Uses a condition to check if the sentiment is RED (poor).
* Sends an email if the condition is RED.

The following image shows the completed app in the **Logic App Designer**.

![image of completed app in Logic App Designer](media/functions-twitter-email/designer1.png)


## Create a Cognitive Services account

A Cognitive Services account is required to detect the sentiment of tweets we are monitoring. 

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to **New > Intelligence + analytics > Cognitive  Services**. Set each required field:

 * **API type**: **Text Analytics API**
 * **Pricing tier**: **F0 (5K Calls per 30 days)**. If you run out of calls, set to a higher tier.

 ![Create Cognitive account blade](media/functions-twitter-email/cog_svcs_account.png)

1. Select **Keys**. You'll need a key in a later step.

 ![Keys](media/functions-twitter-email/keys.png)

## Create an Azure Function App

<!-- TODO make Azure Function App  a link -->

Create an Azure Function App to categorize the tweet sentiment into three categories (RED, YELLOW or GREEN).

1. Select **New > Compute > Function App**

 ![New > compute > function app](media/functions-twitter-email/fun_app.png)

1. Complete the **Function App** input fields:

  * **App name**: Use a name you can associate with this project.
  * **Resource Group**: Select the resource group you previously created.
  * **Hosting Plan**: Select **Consumption Plan**, which  is billed based on resource consumption and executions. <!-- TODO link to https://azure.microsoft.com/en-us/pricing/details/functions/ -->
  * **Location**: Select the location you previously used.
  * Select **Create**.

 ![Function App Create](media/functions-twitter-email/fun_app_create.png)

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

 ![enter new code and save](media/functions-twitter-email/save_fun.png)

1. Save the change.

1. Select **Test** (shown in red above).
1. Enter 0.2 in the **Request body** text box and then select **Run**. The output shows "RED" and the HTTP status is 200 OK.

 ![test ](media/functions-twitter-email/test.png)


## Create a logic app

1. In the Azure portal, click the **New > Web + Mobile > Logic App**

![new logic app step preceeding step](media/functions-twitter-email/new_logicApp.png)

1. In the **Create logic app** blade, enter each field, and the select **Create**.

![Create logic app step preceeding step](media/functions-twitter-email/new_logicApp2.png)

 Once the logic app is created, it opens in the designer.

1. Select the **Blank Logic App** template.

![Blank Logic App](media/functions-twitter-email/blank.png)

## Add a trigger to twitter

The **Logic App Designer** displays many services and triggers you can connect to.

1. Select the **Twitter** service.

  ![twitter connector](media/functions-twitter-email/twitter_connector.png)

1. Select the trigger **When a new tweet is posted**.

  ![When a new tweet is posted trigger](media/functions-twitter-email/tw_trig.png)

1. Sign in to your twitter account.

  ![Sign in to your twitter account](media/functions-twitter-email/signin_twit.png)

1. Enter your password and select **Authorize app**.

  ![authentication twitter new window from above](media/functions-twitter-email/auth_twit.png)

1. Enter the search text, frequency, and interval. If you specify a popular term (such as #football, #soccer, or #futbol), you can quickly use all your [TODO]. We'll search for #Azure every 15 minutes:

  ![#Azure every 15 min](media/functions-twitter-email/azure_tweet.png)

1. Select **New Step**, and then **Add an action**.

  ![New Step, and then Add an action](media/functions-twitter-email/new_step.png)

1. Add the **Text Analytics** connector.

  ![Chose an action window](media/functions-twitter-email/choose_action.png)

1. Select the **Detect Sentiment** action. The sentiment rating is often good, but it sometimes misinterprets the text.

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

1. Save the app.


## Add an Azure Function

In this section, we add the Azure Function we created previously that categorized tweet sentiment as RED, YELLOW, or GREEN.

1. In the Logic Apps Designer, select **New step**, and then select **Add an action**.
1. Select **Azure Functions**.
1. Select **Choose an Azure function**.

  ![Azure Function box showing Choose an Azure function](media/functions-twitter-email/choose_fun.png)

1. Select the Azure Function you previously created.
1. Select **Score** to populate the **Request Body**.

  ![Score](media/functions-twitter-email/trigger_score.png)

1. Save the app.

## Add email notification

In this section, we add a conditional check for negative sentiment tweets (condition RED).

1. Select **New step**.
1. Select **Add a condition**.
1. Select **Body** in the first **Choose a value** text box. 
1. Enter "RED" in the second  **Choose a value** text box.
1. Save the app.

  ![condition box](media/functions-twitter-email/condtion.png)

1. In the **IF YES, DO NOTHING** box select **Add an action**.
1. Enter Outlook or Gmail in the **Search all services and actions** box. Outlook is used in this tutorial. See [Add a Gmail actions) (../logic-apps/logic-apps-create-a-logic-app#add-an-action-that-responds-to-your-trigger) for Gmail instructions. Note: If you have a personal [Microsoft account](https://account.microsoft.com/account), you can use that for the Outlook.com account. 

  ![Choose an action box](media/functions-twitter-email/outlook.png)

1. Select **Outlook.com Send an email**.

  ![Outlook.com  box](media/functions-twitter-email/sendEmail.png)

1. Sign into Outlook.com.

  ![sig in in box](media/functions-twitter-email/signin_outlook.png)

1. Enter the following items:

  * **To**: The email the message should be sent to.
  * **Subject**: Score.
  * **Body**: The location and the Tweet text.

  ![Send an email box](media/functions-twitter-email/sendEmail2.png)

1. Save the app.
1. Select **Run** to start the app.

### Check the status 

In the Logic app blade, select **Overview**, and then select a row in the **Runs history** column:

![Overview blade](media/functions-twitter-email/over1.png)

The image following shows the run details when the condition was not true, email was not sent.

![Overview blade](media/functions-twitter-email/skipped.png)

The image following shows the run details when the condition was true, and email was sent.

![Overview blade](media/functions-twitter-email/sent.png)

You can select any of the service boxes to show find more information on the data used for the run. Select the **When a new tweet is posted**, it shows the search text and all the outputs, even those outputs we're not using. 

## Get help

To ask questions, answer questions, and learn what other Azure Logic Apps users are doing, 
visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).

To help improve Azure Logic Apps and connectors, vote on or submit ideas at the 
[Azure Logic Apps user feedback site](http://aka.ms/logicapps-wish).

## Next steps

*  [Add conditions and run workflows](../logic-apps/logic-apps-use-logic-app-features.md)
*	 [Logic app templates](../logic-apps/logic-apps-use-logic-app-templates.md)
*  [Create logic apps from Azure Resource Manager templates](../logic-apps/logic-apps-arm-provision.md)
