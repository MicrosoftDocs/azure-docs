---
title: Building a serverless social media dashboard in Azure | Microsoft Docs
description: Building a serverless social media dashboard in Azure
services: functions, logic-apps, cognitive-services
keywords: workflow, cloud apps, cloud services, business processes, system integration, enterprise application integration, EAI
documentationcenter: ''
author: ggailey777
manager: erikre
editor: ''

ms.assetid: 60495cc5-1638-4bf0-8174-52786d227734
ms.service: functions
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/11/2017
ms.author: glenga, riande
---

# Create a function that  Azure

Azure Functions integrates with Azure Logic Apps to enable you to let you use the computing power of Functions in orchestrations with other Azure and third-party services. This tutorial shows you how to use Functions with Logic Apps and Azure Cognitive Services to analyze sentiment from Twitter posts. An HTTP triggered function categorizes tweets as green, yellow, or red based on the sentiment score. An email is sent when poor sentiment is detected. 

![image first two steps of app in Logic App Designer](media/functions-twitter-email/designer1.png)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Cognitive Services account.
> * Create a function that categorizes tweet sentiment.
> * Create a logic app that connects to Twitter.
> * Add sentiment detection to the logic app. 
> * Connect the logic app to the function.
> * Send an email based on the response from the function.

## Prerequisites

[!INCLUDE [Previous topic](../../includes/functions-quickstart-previous-topics.md)]

You also need an active [Twitter](https://twitter.com/) account.

## Create a Cognitive Services account

A Cognitive Services account is required to detect the sentiment of tweets being monitored.

1. Log in to the Azure portal.

2. Click the **New** button found on the upper left-hand corner of the Azure portal.

3. Click **Data + Analytics** > **Cognitive  Services**. Then, use the settings as specified in the table, accept the terms, check **Pin to dashboard**, and click **Create**.

    ![Create Cognitive account blade](media/functions-twitter-email/cog_svcs_account.png)

    | Setting      |  Suggested value   | Description                                        |
    | --- | --- | --- |
    | **Name** | MyCognitiveServicesAccnt | Choose a unique account name. |
    | **API type** | Text Analytics API | API used to analyze text.  |
    | **Location** | West US | Currently, only **West US** is available for text analytics. |
    | **Pricing tier** | F0 | Start with the lowest tier. If you run out of calls, scale to a higher tier.|
    | **Resource group** | myResourceGroup | Use the same resource group for all services in this tutorial.|

4. After the account is created, click your new Cognitive Services account pinned to the dashboard. 

5. In the account, click **Keys**, and then copy the value of **Key 1** and save it. You use this key to connect the logic app to your Cognitive Services account. 
 
    ![Keys](media/functions-twitter-email/keys.png)

## Create the function

1. Expand your function app, click the **+** button next to **Functions**, click the **HTTPTrigger** template. Type `CategorizeSentiment` for the function **Name** and click **Create**.

    ![Function Apps blade, Functions +](media/functions-twitter-email/add_fun.png)

2. Replace the contents of the *run.csx* file with the following code, then click **Save**:

    ```c#
    using System.Net;
    
    public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
    {
        // The sentiment category defaults to 'GREEN'. 
        string category = "GREEN";
    
        // Get the sentiment score from the request body.
        double score = await req.Content.ReadAsAsync<double>();
        log.Info(string.Format("The sentiment score received is '{0}'.",
                    score.ToString()));
    
        // Set the category based on the sentiment score.
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
    This function code returns a color category based on the sentiment score received in the request. 

3. To test the function, click **Test** at the far right to expand the Test tab. Type a value of `0.2` for the **Request body**, and then click **Run**. A value of **RED** is returned in the body of the response. 

    ![Test the function in the Azure portal](./media/functions-twitter-email/test.png)

## Create a logic app

1. In the Azure portal, click the **New** button found on the upper left-hand corner of the Azure portal.

2. Click **Enterprise Integration** > **Logic App**. Then, use the settings as specified in the table, check **Pin to dashboard**, and click **Create**.
 
4. Then, type a **Name** like `TweetSentiment`,  use the settings as specified in the table, accept the terms, check **Pin to dashboard**, and click **Create**.

    ![Create logic app in the Azure portal](./media/functions-twitter-email/new_logicApp.png)

    | Setting      |  Suggested value   | Description                                        |
    | ----------------- | ------------ | ------------- |
    | **Name** | TweetSentiment | Choose an appropriate name for your app. |
    | **Resource group** | myResourceGroup | API used to analyze text.  |
    | **Location** | East US | Choose a location close to you. |
    | **Resource group** | myResourceGroup | Choose the same existing resource group as before.|

4. After the app is created, click your new logic app pinned to the dashboard. Then in the Logic Apps Designer, scroll down and click the **Blank Logic App** template. 

    ![Blank Logic Apps template](media/functions-twitter-email/blank.png)

You can now use the Logic Apps Designer to add services and triggers to your app.

## Connect to Twitter

1. In the designer, click the **Twitter** service, click the **When a new tweet is posted** trigger, sign in to your Twitter account, and authorize Logic Apps to use your account.

2. Use the Twitter trigger settings as specified in the table and click **Save**. 

    ![Twitter connector settings](media/functions-twitter-email/azure_tweet.png)

    | Setting      |  Suggested value   | Description                                        |
    | ----------------- | ------------ | ------------- |
    | **Search text** | #Azure | Use a hashtag that is popular enough for to generate new tweets in the chosen interval. When using the Free tier and your hashtag is too popular, you can quickly use up the transactions in your Cognitive Services account. |
    | **Frequency** | Minute | The frequency unit used for polling Twitter.  |
    | **Interval** | 15 | The time elapsed between Twitter requests, in frequency units. |
 
Now your app is connected to Twitter. Next, you connect to text analytics to detect the sentiment of collected tweets.

## Add sentiment detection

1. Click **New Step**, and then **Add an action**.

    ![New Step, and then Add an action](media/functions-twitter-email/new_step.png)

2. In **Choose an action**, click **Text Analytics** and then click the **Detect sentiment** action.

    ![Detect Sentiment](media/functions-twitter-email/detect_sent.png)

3. Type a connection name such as `MyCognitiveServicesConnection`, paste the key for your Cognitive Services account that you saved, and click **Create**.  

4. Click **Text to analyze** > **Tweet text**, and then click **Save**.  

    ![Detect Sentiment](media/functions-twitter-email/ds_tta.png)

Now that sentiment detection is configured, you can add a connection to your function that consumes the sentiment score output.

## Connect sentiment output to your function

1. In the Logic Apps Designer, click **New step** > **Add an action**, and then click **Azure Functions**. 

2. Click **Choose an Azure function**, select the **CategorizeSentiment** function you created earlier.  

![Azure Function box showing Choose an Azure function](media/functions-twitter-email/choose_fun.png)

3. In **Request Body**, click **Score** and then **Save**.

![Score](media/functions-twitter-email/trigger_score.png)


## Add email notification

In this section, we add a conditional check for negative sentiment tweets (condition RED).

* Select **New step**.
* Select **Add a condition**.
* Select **Body** in the first **Choose a value** text box.
* Enter "RED" in the second  **Choose a value** text box.
* Save the app.

![condition box](media/functions-twitter-email/condition.png)

* In the **IF YES, DO NOTHING** box select **Add an action**.
* Enter Outlook or Gmail in the **Search all services and actions** box. Outlook is used in this tutorial. See [Add a Gmail action] (../logic-apps/logic-apps-create-a-logic-app.md#add-an-action-that-responds-to-your-trigger) for Gmail instructions. Note: If you have a personal [Microsoft account](https://account.microsoft.com/account), you can use that for the Outlook.com account.

![Choose an action box](media/functions-twitter-email/outlook.png)

Select **Outlook.com Send an email**.

![Outlook.com  box](media/functions-twitter-email/sendEmail.png)

Sign into Outlook.com.

![sig in box](media/functions-twitter-email/signin_outlook.png)

Enter the following items:

   * **To**: The email the message should be sent to.
   * **Subject**: Score.
   * **Body**: The location and the Tweet text.

![Send an email box](media/functions-twitter-email/sendEmail2.png)

Save the app.
Select **Run** to start the app.

### Check the status

In the Logic app blade, select **Overview**, and then select a row in the **Runs history** column:

![Overview blade](media/functions-twitter-email/over1.png)

The following image shows the run details when the condition was not true, email was not sent.

![Overview blade](media/functions-twitter-email/skipped.png)

If want to immediately test the **Send an email** function:

* Change the **INPUTS**  in the first step (**When a new tweet is posted**) to a popular term, such as #football, #soccer, or #futbol.

Processing popular terms consumes more resources than less popular terms. You might want to change your search term after you've verified email is working.

The following image shows the run details when the condition was true, and email was sent.

![Overview blade](media/functions-twitter-email/sent.png)

You can select any of the service boxes to show more information on the data used for the run. Select the **When a new tweet is posted**, it shows the search text and all the outputs, even those outputs we're not using.

## Next steps

*  [Introduction to Azure Functions](functions-overview.md)
*  [Azure Logic Apps](../logic-apps/logic-apps-what-are-logic-apps.md)
*  [Add conditions and run workflows](../logic-apps/logic-apps-use-logic-app-features.md)
*  [Logic app templates](../logic-apps/logic-apps-use-logic-app-templates.md)
*  [Create logic apps from Azure Resource Manager templates](../logic-apps/logic-apps-arm-provision.md)

## Get help

To ask questions, answer questions, and learn what other Azure Logic Apps users are doing,
visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).

To help improve Azure Logic Apps and connectors, vote on or submit ideas at the
[Azure Logic Apps user feedback site](http://aka.ms/logicapps-wish).
