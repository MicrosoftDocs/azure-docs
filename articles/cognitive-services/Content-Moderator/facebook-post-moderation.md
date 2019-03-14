---
title: "Tutorial: Moderate Facebook content - Content Moderator"
titlesuffix: Azure Cognitive Services
description: In this tutorial, you will learn how to use machine-learning-based Content Moderator to help moderate Facebook posts and comments.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: tutorial
ms.date: 01/18/2019
ms.author: pafarley
#Customer intent: As the moderator of a Facebook page, I want to use Azure's machine learning technology to automate and streamline the process of post moderation.
---

# Tutorial: Moderate Facebook posts and commands with Azure Content Moderator

In this tutorial, you will learn how to use Azure Content Moderator to help moderate the posts and comments on a Facebook page. Facebook will send the content posted by visitors to the Content Moderator service. Then your Content Moderator workflows will either publish the content or create reviews within the Review tool, depending on the content scores and thresholds. See the [Build 2017 demo video](https://channel9.msdn.com/Events/Build/2017/T6033) for a working example of this scenario.

This tutorial shows you how to:

> [!div class="checklist"]
> * Create a Content Moderator team.
> * Create Azure Functions that listen for HTTP events from Content Moderator and Facebook.
> * Link a Facebook page to Content Moderator using a Facebook application.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

This diagram illustrates each component of this scenario:

![Diagram of Content Moderator receiving information from Facebook through "FBListener" and sending information through "CMListener"](images/tutorial-facebook-moderation.png)

## Prerequisites

- A Content Moderator subscription key. Follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to the Content Moderator service and get your key.
- A [Facebook account](https://www.facebook.com/).

## Create a review team

Refer to the [Try Content Moderator on the web](quick-start.md) quickstart for instructions on how to sign up for the [Content Moderator Review tool](https://contentmoderator.cognitive.microsoft.com/) and create a review team. Take note of the **Team ID** value on the **Credentials** page.

## Configure image moderation workflow

Refer to the [Define, test, and use workflows](review-tool-user-guide/workflows.md) guide to create a custom image workflow. This will allow Content Moderator to automatically check images on Facebook and send some to the Review tool. Take note of the workflow **name**.

## Configure text moderation workflow

Again, refer to the [Define, test, and use workflows](review-tool-user-guide/workflows.md) guide; this time create a custom text workflow. This will allow Content Moderator to automatically check text content. Take note of the workflow **name**.

![Configure Text Workflow](images/text-workflow-configure.PNG)

Test your workflow using the **Execute Workflow** button.

![Test Text Workflow](images/text-workflow-test.PNG)

## Create Azure Functions

Sign in to the [Azure Portal](https://portal.azure.com/) and follow these steps:

1. Create an Azure Function App as shown on the [Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-create-function-app-portal) page.
2. Go to the newly created Function App.
3. Within the App, go to the **Platform features** tab and select **Application settings**. In the **Application settings** section of the next page, scroll to the bottom of the list and click **Add new setting**. Add the following key/value pairs
    
    | App Setting name | value   | 
    | -------------------- |-------------|
    | cm:TeamId   | Your Content Moderator TeamId  | 
    | cm:SubscriptionKey | Your Content Moderator subscription key - See [Credentials](review-tool-user-guide/credentials.md) | 
    | cm:Region | Your Content Moderator region name, without the spaces. See preceding note. |
    | cm:ImageWorkflow | Name of the workflow to run on Images |
    | cm:TextWorkflow | Name of the workflow to run on Text |
    | cm:CallbackEndpoint | Url for the CMListener Function App that you create later in this guide |
    | fb:VerificationToken | The secret token, also used to subscribe to the Facebook feed events |
    | fb:PageAccessToken | The Facebook graph api access token does not expire and allows the function Hide/Delete posts on your behalf. |

    Click the **Save** button at the top of the page.

1. Using the **+** button on the left pane, to bring up the New function pane.

    ![Azure Functions pane with the Add Function button highlighted.](images/new-function.png)

    Then click **+ New function** at the top of the page. This function receives events from Facebook. Create this function by following these steps:

    1. Click on the tile that says **Http trigger**.
    1. Enter the name **FBListener**. The **Authorization Level** field should be set to **Function**.
    1. Click **Create**.
    1. Replace the contents of the **run.csx** with the contents from **FbListener/run.csx**

    [!code-csharp[FBListener: csx file](~/samples-fbPageModeration/FbListener/run.csx?range=1-160)]

1. Create a new **Http trigger** function named **CMListener**. This function receives events from Content Moderator. Replace the contents of the **run.csx** with the contents from **CMListener/run.csx**

    [!code-csharp[FBListener: csx file](~/samples-fbPageModeration/CmListener/run.csx?range=1-106)]

---

## Configure the Facebook page and App
1. Create a Facebook App.

    ![facebook developer page](images/facebook-developer-app.png)

    1. Navigate to the [Facebook developer site](https://developers.facebook.com/)
    2. Click on **My Apps**.
    3. Add a New App.
    1. name it something
    1. Select **Webhooks -> Set Up**
    1. Select **Page** in the dropdown menu and select **Subscribe to this object**
    1. Provide the **FBListener Url** as the Callback URL and the **Verify Token** you configured under the **Function App Settings**
    1. Once subscribed, scroll down to feed and select **subscribe**.

2. Create a Facebook Page.

    1. Navigate to [Facebook](https://www.facebook.com/bookmarks/pages) and create a **new Facebook Page**.
    2. Allow the Facebook App to access this page by following these steps:
        1. Navigate to the [Graph API Explorer](https://developers.facebook.com/tools/explorer/).
        2. Select **Application**.
        3. Select **Page Access Token**, Send a **Get** request.
        4. Click the **Page ID** in the response.
        5. Now append the **/subscribed_apps** to the URL and Send a **Get** (empty response) request.
        6. Submit a **Post** request. You get the response as **success: true**.

3. Create a non-expiring Graph API access token.

    1. Navigate to the [Graph API Explorer](https://developers.facebook.com/tools/explorer/).
    2. Select the **Application** option.
    3. Select the **Get User Access Token** option.
    4. Under the **Select Permissions**, select **manage_pages** and **publish_pages** options.
    5. We will use the **access token** (Short Lived Token) in the next step.

4. We use Postman for the next few steps.

    1. Open **Postman** (or get it [here](https://www.getpostman.com/)).
    2. Import these two files:
        1. [Postman Collection](https://github.com/MicrosoftContentModerator/samples-fbPageModeration/blob/master/Facebook%20Permanant%20Page%20Access%20Token.postman_collection.json)
        2. [Postman Environment](https://github.com/MicrosoftContentModerator/samples-fbPageModeration/blob/master/FB%20Page%20Access%20Token%20Environment.postman_environment.json)       
    3. Update these environment variables:
    
        | Key | Value   | 
        | -------------------- |-------------|
        | appId   | Insert your Facebook App Identifier here  | 
        | appSecret | Insert your Facebook App's secret here | 
        | short_lived_token | Insert the short lived user access token you generated in the previous step |
    4. Now run the 3 APIs listed in the collection: 
        1. Select **Generate Long-Lived Access Token** and click **Send**.
        2. Select **Get User ID** and click **Send**.
        3. Select **Get Permanent Page Access Token** and click **Send**.
    5. Copy the **access_token** value from the response and assign it to the App setting, **fb:PageAccessToken**.

The solution sends all images and text posted on your Facebook page to Content Moderator. Then the workflows that you configured earlier are invoked. The content that does not pass your criteria defined in the workflows gets passed to reviews within the review tool. The rest of the content gets published automatically.

## Next steps

In this tutorial, you set up a program to analyze product images for the purpose of tagging them by product type and allowing a review team to make informed decisions about content moderation. Next, learn more about the details of image moderation.

> [!div class="nextstepaction"]
> [Image moderation](./image-moderation-api.md)
