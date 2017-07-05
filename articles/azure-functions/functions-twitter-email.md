---
title: Create a function that integrates with Azure Logic Apps | Microsoft Docs
description: Create a function that categories tweet sentiment using Azure services.
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

# Create a function that integrates with Azure Logic Apps

Azure Functions integrates with Azure Logic Apps in the Logic Apps Designer. This integration lets you use the computing power of Functions in orchestrations with other Azure and third-party services. 

This tutorial shows you how to use Functions with Logic Apps and Azure Cognitive Services to analyze sentiment from Twitter posts. An HTTP triggered function categorizes tweets as green, yellow, or red based on the sentiment score. An email is sent when poor sentiment is detected. 

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

+ An active [Twitter](https://twitter.com/) account. 
+ An [Outlook.com](https://outlook.com/) account (for sending notifications).
+ This topic uses as its starting point the resources created in [Create your first function from the Azure portal](functions-create-first-azure-function.md).  
If you haven't already done so, complete these steps now to create your function app.

## Create a Cognitive Services account

A Cognitive Services account is required to detect the sentiment of tweets being monitored.

1. Log in to the [Azure portal](https://portal.azure.com/).

2. Click the **New** button found on the upper left-hand corner of the Azure portal.

3. Click **Data + Analytics** > **Cognitive  Services**. Then, use the settings as specified in the table, accept the terms, and check **Pin to dashboard**.

    ![Create Cognitive account blade](media/functions-twitter-email/cog_svcs_account.png)

    | Setting      |  Suggested value   | Description                                        |
    | --- | --- | --- |
    | **Name** | MyCognitiveServicesAccnt | Choose a unique account name. |
    | **API type** | Text Analytics API | API used to analyze text.  |
    | **Location** | West US | Currently, only **West US** is available for text analytics. |
    | **Pricing tier** | F0 | Start with the lowest tier. If you run out of calls, scale to a higher tier.|
    | **Resource group** | myResourceGroup | Use the same resource group for all services in this tutorial.|

4. Click **Create** to create your account. After the account is created, click your new Cognitive Services account pinned to the dashboard. 

5. In the account, click **Keys**, and then copy the value of **Key 1** and save it. You use this key to connect the logic app to your Cognitive Services account. 
 
    ![Keys](media/functions-twitter-email/keys.png)

## Create the function

Functions provides a great way to offload processing tasks in a logic apps workflow. This tutorial uses an HTTP triggered function to process tweet sentiment scores from Cognitive Services and return a category value.  

1. Expand your function app, click the **+** button next to **Functions**, click the **HTTPTrigger** template. Type `CategorizeSentiment` for the function **Name** and click **Create**.

    ![Function Apps blade, Functions +](media/functions-twitter-email/add_fun.png)

2. Replace the contents of the run.csx file with the following code, then click **Save**:

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

Now you have a function that categorizes sentiment scores. Next, you create a logic app that integrates your function with your Twitter and Cognitive Services accounts. 

## Create a logic app   

1. In the Azure portal, click the **New** button found on the upper left-hand corner of the Azure portal.

2. Click **Enterprise Integration** > **Logic App**. Then, use the settings as specified in the table, check **Pin to dashboard**, and click **Create**.
 
4. Then, type a **Name** like `TweetSentiment`,  use the settings as specified in the table, accept the terms, and check **Pin to dashboard**.

    ![Create logic app in the Azure portal](./media/functions-twitter-email/new_logicApp.png)

    | Setting      |  Suggested value   | Description                                        |
    | ----------------- | ------------ | ------------- |
    | **Name** | TweetSentiment | Choose an appropriate name for your app. |
    | **Resource group** | myResourceGroup | API used to analyze text.  |
    | **Location** | East US | Choose a location close to you. |
    | **Resource group** | myResourceGroup | Choose the same existing resource group as before.|

4. Click **Create** to create your logic app. After the app is created, click your new logic app pinned to the dashboard. Then in the Logic Apps Designer, scroll down and click the **Blank Logic App** template. 

    ![Blank Logic Apps template](media/functions-twitter-email/blank.png)

You can now use the Logic Apps Designer to add services and triggers to your app.

## Connect to Twitter

First, create a connection to your Twitter account. The logic app polls for tweets, which trigger the app to run.

1. In the designer, click the **Twitter** service, and click the **When a new tweet is posted** trigger. Sign in to your Twitter account and authorize Logic Apps to use your account.

2. Use the Twitter trigger settings as specified in the table. 

    ![Twitter connector settings](media/functions-twitter-email/azure_tweet.png)

    | Setting      |  Suggested value   | Description                                        |
    | ----------------- | ------------ | ------------- |
    | **Search text** | #Azure | Use a hashtag that is popular enough for to generate new tweets in the chosen interval. When using the Free tier and your hashtag is too popular, you can quickly use up the transactions in your Cognitive Services account. |
    | **Frequency** | Minute | The frequency unit used for polling Twitter.  |
    | **Interval** | 15 | The time elapsed between Twitter requests, in frequency units. |

3.  Click **Save** to connect to your Twitter account. 

Now your app is connected to Twitter. Next, you connect to text analytics to detect the sentiment of collected tweets.

## Add sentiment detection

1. Click **New Step**, and then **Add an action**.

    ![New Step, and then Add an action](media/functions-twitter-email/new_step.png)

2. In **Choose an action**, click **Text Analytics**, and then click the **Detect sentiment** action.

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

Now, your function is triggered when a sentiment score is sent from the logic app. A color-coded category is returned to the logic app by the function. Next, you add an email notification that is sent when a sentiment value of **RED** is returned from the function. 

## Add email notifications

The last part of the workflow is to trigger an email when the sentiment is scored as _RED_. This topic uses an Outlook.com connector. You can perform similar steps to use a Gmail or Office 365 Outlook connector.   

1. In the Logic Apps Designer, click **New step** > **Add a condition**. 

2. Click **Choose a value**, then click **Body**. Select **is equal to**, click **Choose a value** and type `RED`, and click **Save**. 

    ![Add a condition to the logic app.](media/functions-twitter-email/condition.png)

3. In **IF YES, DO NOTHING**, click **Add an action**, search for `outlook.com`, click **Send an email**, and sign in to your Outlook.com account.
    
    ![Choose an action for the condition.](media/functions-twitter-email/outlook.png)

    > [!NOTE]
    > If you don't have an Outlook.com account, you can choose another connector, such as Gmail or Office 365 Outlook

4. In the **Send an email** action, use the email settings as specified in the table. 

    ![Configure the email for the send an email action.](media/functions-twitter-email/sendemail.png)

    | Setting      |  Suggested value   | Description  |
    | ----------------- | ------------ | ------------- |
    | **To** | Type your email address | The email address that receives the notification. |
    | **Subject** | Negative tweet sentiment detected  | The subject line of the email notification.  |
    | **Body** | Tweet text, Location | Click the **Tweet text** and **Location** parameters. |

5.  Click **Save**.

Now that the workflow is complete, you can enable the logic app and see the function at work.

## Test the workflow

1. In the Logic App Designer, click **Run** to start the app.

2. In the left column, click **Overview** to see the status of the logic app. 
 
    ![Logic app execution status](media/functions-twitter-email/over1.png)

3. (Optional) Click one of the runs to see details of the execution.

4. Go to your function, view the logs, and verify that sentiment values were received and processed.
 
    ![View function logs](media/functions-twitter-email/sent.png)

5. When a potentially negative sentiment is detected, you receive an email. If you haven't received an email, you can change the function code to return RED every time:

        return req.CreateResponse(HttpStatusCode.OK, "RED");

    After you have verified email notifications, change back to the original code:

        return req.CreateResponse(HttpStatusCode.OK, category);

    > [!IMPORTANT]
    > After you have completed this tutorial, you should disable the logic app. By disabling the app, you avoid being charged for executions and using up the transactions in your Cognitive Services account.

Now you have seen how easy it is to integrate Functions into a Logic Apps workflow.

## Disable the logic app

To disable the logic app, click **Overview** and then click **Disable** at the top of the screen. This stops the logic app from running and incurring charges without deleting the app. 

    ![Function logs](media/functions-twitter-email/disable-logic-app.png)

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a Cognitive Services account.
> * Create a function that categorizes tweet sentiment.
> * Create a logic app that connects to Twitter.
> * Add sentiment detection to the logic app. 
> * Connect the logic app to the function.
> * Send an email based on the response from the function.

Advance to the next tutorial to learn how to create a serverless API for your function.

> [!div class="nextstepaction"] 
> [Create a serverless API using Azure Functions](functions-create-serverless-api.md)

To learn more about Logic Apps, see [Azure Logic Apps](../logic-apps/logic-apps-what-are-logic-apps.md).

