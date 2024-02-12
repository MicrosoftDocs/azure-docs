---
title: Create a function that integrates with Azure Logic Apps
description: Create a function integrate with Azure Logic Apps and Azure AI services. The resulting workflow categorizes tweet sentiments sends email notifications.
ms.assetid: 60495cc5-1638-4bf0-8174-52786d227734
ms.topic: tutorial
ms.date: 04/10/2021
ms.devlang: csharp
ms.custom: "devx-track-csharp, mvc, cc996988-fb4f-47"
---

# Tutorial: Create a function to integrate with Azure Logic Apps

Azure Functions integrates with Azure Logic Apps in the Logic Apps Designer. This integration allows you use the computing power of Functions in orchestrations with other Azure and third-party services.

This tutorial shows you how to create a workflow to analyze Twitter activity. As tweets are evaluated, the workflow sends notifications when positive sentiments are detected.

In this tutorial, you learn to:

> [!div class="checklist"]
> * Create an Azure AI services API Resource.
> * Create a function that categorizes tweet sentiment.
> * Create a logic app that connects to Twitter.
> * Add sentiment detection to the logic app.
> * Connect the logic app to the function.
> * Send an email based on the response from the function.

## Prerequisites

* An active [Twitter](https://twitter.com/) account.
* An [Outlook.com](https://outlook.com/) account (for sending notifications).

> [!NOTE]
> If you want to use the Gmail connector, only G-Suite business accounts can use this connector without restrictions in logic apps. If you have a Gmail consumer account, you can use the Gmail connector with only specific Google-approved apps and services, or you can [create a Google client app to use for authentication in your Gmail connector](/connectors/gmail/#authentication-and-bring-your-own-application). <br><br>For more information, see [Data security and privacy policies for Google connectors in Azure Logic Apps](../connectors/connectors-google-data-security-privacy-policy.md).

## Create Text Analytics resource

The Azure AI services APIs are available in Azure as individual resources. Use the Text Analytics API to detect the sentiment of posted tweets.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **Create a resource** in the upper left-hand corner of the Azure portal.

1. Under _Categories_, select **AI + Machine Learning**

1. Under _Text Analytics_, select **Create**.

1. Enter the following values in the _Create Text Analytics_ screen.

    | Setting | Value | Remarks |
    | ------- | ----- | ------- |
    | Subscription | Your Azure subscription name | |
    | Resource group | Create a new resource group named **tweet-sentiment-tutorial** | Later, you delete this resource group to remove all the resources created during this tutorial. |
    | Region | Select the region closest to you | |
    | Name | **TweetSentimentApp** | |
    | Pricing tier | Select **Free F0** | |

1. Select **Review + create**.

1. Select **Create**.

1. Once the deployment is complete, select **Go to Resource**.

## Get Text Analytics settings

With the Text Analytics resource created, you'll copy a few settings and set them aside for later use.

1. Select **Keys and Endpoint**.

1. Copy **Key 1** by clicking on the icon at the end of the input box.

1. Paste the value into a text editor.

1. Copy the **Endpoint** by clicking on the icon at the end of the input box.

1. Paste the value into a text editor.

## Create the function app

1. From the top search box, search for and select **Function app**.

1. Select **Create**.

1. Enter the following values.

    | Setting | Suggested Value | Remarks |
    | ------- | ----- | ------- |
    | Subscription | Your Azure subscription name | |
    | Resource group | **tweet-sentiment-tutorial** | Use the same resource group name throughout this tutorial. |
    | Function App name | **TweetSentimentAPI** + a unique suffix | Function application names are globally unique. Valid characters are `a-z` (case insensitive), `0-9`, and `-`. |
    | Publish | **Code** | |
    | Runtime stack | **.NET** | The function code provided for you is in C#. |
    | Version | Select the latest version number | |
    | Region | Select the region closest to you | |

1. Select **Review + create**.

1. Select **Create**.

1. Once the deployment is complete, select **Go to Resource**.

## Create an HTTP-triggered function  

1. From the left menu of the _Functions_ window, select **Functions**.

1. Select **Add** from the top menu and enter the following values.

    | Setting | Value | Remarks |
    | ------- | ----- | ------- |
    | Development environment | **Develop in portal** | |
    | Template | **HTTP Trigger** | |
    | New Function | **TweetSentimentFunction** | This is the name of your function. |
    | Authorization level | **Function** | |

1. Select the **Add** button.

1. Select the **Code + Test** button.

1. Paste the following code in the code editor window.

    ```csharp
    #r "Newtonsoft.Json"
    
    using System;
    using System.Net;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Primitives;
    using Newtonsoft.Json;
    
    public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
    {
    
        string requestBody = String.Empty;
        using (StreamReader streamReader =  new  StreamReader(req.Body))
        {
            requestBody = await streamReader.ReadToEndAsync();
        }
    
        dynamic score = JsonConvert.DeserializeObject(requestBody);
        string value = "Positive";
    
        if(score < .3)
        {
            value = "Negative";
        }
        else if (score < .6) 
        {
            value = "Neutral";
        }
    
        return requestBody != null
            ? (ActionResult)new OkObjectResult(value)
           : new BadRequestObjectResult("Pass a sentiment score in the request body.");
    }
    ```

    A sentiment score is passed into the function, which returns a category name for the value.

1. Select the **Save** button on the toolbar to save your changes.

    > [!NOTE]
    > To test the function, select **Test/Run** from the top menu. On the _Input_ tab, enter a value of `0.9` in the _Body_ input box, and then select **Run**. Verify that a value of _Positive_ is returned in the _HTTP response content_ box in the _Output_ section.

Next, create a logic app that integrates with Azure Functions, Twitter, and the Azure AI services API.

## Create a logic app

1. From the top search box, search for and select **Logic Apps**.

1. Select **Add**.

1. Select **Consumption** and enter the following values.

    | Setting | Suggested Value |
    | ------- | --------------- |
    | Subscription | Your Azure subscription name |
    | Resource group | **tweet-sentiment-tutorial** |
    | Logic app name | **TweetSentimentApp** |
    | Region | Select the region closest to you, preferably the same region you selected in previous steps. |

    Accept default values for all other settings.

1. Select **Review + create**.

1. Select **Create**.

1. Once the deployment is complete, select **Go to Resource**.

1. Select the **Blank Logic App** button.

    :::image type="content" source="media/functions-twitter-email/blank-logic-app-button.png" alt-text="Blank Logic App button":::

1. Select the **Save** button on the toolbar to save your progress.

You can now use the Logic Apps Designer to add services and triggers to your application.

## Connect to Twitter

Create a connection to Twitter so your app can poll for new tweets.

1. Search for **Twitter** in the top search box.

1. Select the **Twitter** icon.

1. Select the **When a new tweet is posted** trigger.

1. Enter the following values to set up the connection.

    | Setting |  Value |
    | ------- | ---------------- |
    | Connection name | **MyTwitterConnection** |
    | Authentication Type | **Use default shared application** |

1. Select **Sign in**.

1. Follow the prompts in the pop-up window to complete signing in to Twitter.

1. Next, enter the following values in the _When a new tweet is posted_ box.

    | Setting | Value |
    | ------- | ----- |
    | Search text | **#my-twitter-tutorial** |
    | How often do you want to check for items? | **1** in the textbox, and <br> **Hour** in the dropdown. You may enter different values but be sure to review the current [limitations](/connectors/twitterconnector/#limits) of the Twitter connector.  |

1. Select the **Save** button on the toolbar to save your progress.

Next, connect to text analytics to detect the sentiment of collected tweets.

## Add Text Analytics sentiment detection

1. Select **New step**.

1. Search for **Text Analytics** in the search box.

1. Select the **Text Analytics** icon.

1. Select **Detect Sentiment** and enter the following values.

    | Setting | Value |
    | ------- | ----- |
    | Connection name | **TextAnalyticsConnection** |
    | Account Key | Paste in the Text Analytics account key you set aside earlier. |
    | Site URL | Paste in the Text Analytics endpoint you set aside earlier. |

1. Select **Create**.

1. Click inside the _Add new parameter_ box, and check the box next to **documents** that appears in the pop-up.

1. Click inside the _documents Id - 1_ textbox to open the dynamic content pop-up.

1. In the _dynamic content_ search box, search for **id**, and click on **Tweet id**.

1. Click inside the _documents Text - 1_ textbox to open the dynamic content pop-up.

1. In the _dynamic content_ search box, search for **text**, and click on **Tweet text**.

1. In **Choose an action**, type **Text Analytics**, and then click the **Detect sentiment** action.

1. Select the **Save** button on the toolbar to save your progress.

The _Detect Sentiment_ box should look like the following screenshot.

:::image type="content" source="media/functions-twitter-email/detect-sentiment.png" alt-text="Detect Sentiment settings":::

## Connect sentiment output to function endpoint

1. Select **New step**.

1. Search for **Azure Functions** in the search box.

1. Select the **Azure Functions** icon.

1. Search for your function name in the search box. If you followed the guidance above, your function name begins with **TweetSentimentAPI**.

1. Select the function icon.

1. Select the **TweetSentimentFunction** item.

1. Click inside the _Request Body_ box, and select the _Detect Sentiment_ **score** item from the pop-up window.

1. Select the **Save** button on the toolbar to save your progress.

## Add conditional step

1. Select the **Add an action** button.

1. Click inside the _Control_ box, and search for and select **Control** in the pop-up window.

1. Select **Condition**.

1. Click inside the _Choose a value_ box, and select the _TweetSentimentFunction_ **Body** item from the pop-up window.

1. Enter **Positive** in the _Choose a value_ box.

1. Select the **Save** button on the toolbar to save your progress.

## Add email notifications

1. Under the _True_ box, select the **Add an action** button.

1. Search for and select **Office 365 Outlook** in the text box.

1. Search for **send** and select **Send an email** in the text box.

1. Select the **Sign in** button.

1. Follow the prompts in the pop-up window to complete signing in to Office 365 Outlook.

1. Enter your email address in the _To_ box.

1. Click inside the _Subject_ box and click on the **Body** item under _TweetSentimentFunction_. If the _Body_ item isn't shown in the list, click the **See more** link to expand the options list.

1. After the _Body_ item in the _Subject_, enter the text **Tweet from:**.

1. After the _Tweet from:_ text, click on the box again and select **User name** from the _When a new tweet is posted_ options list.

1. Click inside the _Body_ box and select **Tweet text** under the _When a new tweet is posted_ options list. If the _Tweet text_ item isn't shown in the list, click the **See more** link to expand the options list.

1. Select the **Save** button on the toolbar to save your progress.

The email box should now look like this screenshot.

:::image type="content" source="media/functions-twitter-email/email-notification.png" alt-text="Email notification":::

## Run the workflow

1. From your Twitter account, tweet the following text: **I'm enjoying #my-twitter-tutorial**.

1. Return to the Logic Apps Designer and select the **Run** button.

1. Check your email for a message from the workflow.

## Clean up resources

To clean up all the Azure services and accounts created during this tutorial, delete the resource group.

1. Search for **Resource groups** in the top search box.

1. Select the **tweet-sentiment-tutorial**.

1. Select **Delete resource group**

1. Enter **tweet-sentiment-tutorial** in the text box.

1. Select the **Delete** button.

Optionally, you may want to return to your Twitter account and delete any test tweets from your feed.

## Next steps

> [!div class="nextstepaction"]
> [Create a serverless API using Azure Functions](functions-create-serverless-api.md)
