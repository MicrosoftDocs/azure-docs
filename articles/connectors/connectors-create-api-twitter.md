---
title: Connect to Twitter from Azure Logic Apps
description: Automate tasks and workflows that monitor and manage tweets, plus get data about followers, your followed users, other users, timelines, and more from your Twitter account by using Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: klam, logicappspm
ms.topic: article
ms.date: 08/25/2018
tags: connectors
---

# Monitor and manage Twitter by using Azure Logic Apps

With Azure Logic Apps and the Twitter connector, 
you can create automated tasks and workflows that monitor 
and manage data you care about in Twitter such as tweets, 
followers, users and followed users, timelines, and more, 
along with other actions, for example:

* Monitor, post, and search tweets.
* Get data such as followers, followed users, timelines, and more.

You can use triggers that get responses from your Twitter account 
and make the output available to other actions. You can use actions 
that perform tasks with your Twitter account. You can also have 
other actions use the output from Twitter actions. For example, 
when a new tweet with a specific hashtag appears, you can send 
messages with the Slack connector. If you're new to logic apps, 
review [What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
[sign up for a free Azure account](https://azure.microsoft.com/free/). 

* Your Twitter account and user credentials

   Your credentials authorize your logic app to create 
   a connection and access your Twitter account.

* Basic knowledge about 
[how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

* The logic app where you want to access your Twitter account. 
To start with a Twitter trigger, [create a blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). 
To use a Twitter action, start your logic app with another trigger, 
for example, the **Recurrence** trigger.

## Connect to Twitter

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. Sign in to the [Azure portal](https://portal.azure.com), 
and open your logic app in Logic App Designer, if not open already.

1. Choose a path: 

   * For blank logic apps, in the search box, 
   enter "twitter" as your filter. 
   Under the triggers list, select the trigger you want. 

     -or-

   * For existing logic apps: 
   
     * Under the last step where you want to add an action, 
     choose **New step**. 

       -or-

     * Between the steps where you want to add an action, 
     move your pointer over the arrow between steps. 
     Choose the plus sign (**+**) that appears, 
     and then select **Add an action**.
     
       In the search box, enter "twitter" as your filter. 
       Under the actions list, select the action you want.

1. If you're prompted to sign in to Twitter, 
sign in now so you can authorize access for your logic app.

1. Provide the necessary details for your selected trigger 
or action and continue building your logic app's workflow.

## Examples

### Twitter trigger: When a new tweet is posted

This trigger starts a logic app workflow when the trigger detects 
a new tweet, for example, with the hashtag, #Seattle. So for example, 
when these tweets are found, you can add a file with the tweets' 
contents to storage, such as a Dropbox account by using the Dropbox connector. 

Optionally, you can include a condition that eligible tweets 
must come from users with at least a specified number of followers.

**Enterprise example**: You can use this trigger to monitor tweets 
about your company and upload the tweets' content to a SQL database.

### Twitter action: Post a tweet

This action posts a tweet, but you can set up the action so that the tweet 
contains the content from tweets found by the previously described trigger. 

## Connector reference

For technical details about triggers, actions, and limits, which are 
described by the connector's OpenAPI (formerly Swagger) description, 
review the connector's [reference page](/connectors/twitterconnector/).

## Get support

* For questions, visit the [Microsoft Q&A question page for Azure Logic Apps](https://docs.microsoft.com/answers/topics/azure-logic-apps.html).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](https://aka.ms/logicapps-wish).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
