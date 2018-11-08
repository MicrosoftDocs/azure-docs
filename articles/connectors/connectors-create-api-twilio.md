---
title: Connect to Twilio from Azure Logic Apps | Microsoft Docs
description: Automate tasks and workflows that manage global SMS, MMS, and IP messages through your Twilio account by using Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.assetid: 43116187-4a2f-42e5-9852-a0d62f08c5fc
ms.topic: article
tags: connectors
ms.date: 08/25/2018
---

# Manage messages in Twilio with Azure Logic Apps

With Azure Logic Apps and the Twilio connector, 
you can create automated tasks and workflows 
that get, send, and list messages in Twilio, 
which include global SMS, MMS, and IP messages. 
You can use these actions to perform tasks with 
your Twilio account. You can also have other actions 
use the output from Twilio actions. For example, 
when a new message arrives, you can send the message 
content with the Slack connector. If you're new to logic apps, 
review [What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 

* From [Twilio](https://www.twilio.com/): 

  * Your Twilio account ID and 
  [authentication token](https://support.twilio.com/hc/en-us/articles/223136027-Auth-Tokens-and-How-to-Change-Them), 
  which you can find on your Twilio dashboard

    Your credentials authorize your logic app to create a 
    connection and access your Twilio account from your logic app. 
    If you're using a Twilio trial account, 
    you can send SMS only to *verified* phone numbers.

  * A verified Twilio phone number that can send SMS

  * A verified Twilio phone number that can receive SMS

* Basic knowledge about 
[how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

* The logic app where you want to access your Twilio account. 
To use a Twilio action, start your logic app with another trigger, 
for example, the **Recurrence** trigger.

## Connect to Twilio

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. Sign in to the [Azure portal](https://portal.azure.com), 
and open your logic app in Logic App Designer, if not open already.

1. Choose a path: 

     * Under the last step where you want to add an action, 
     choose **New step**. 

       -or-

     * Between the steps where you want to add an action, 
     move your pointer over the arrow between steps. 
     Choose the plus sign (**+**) that appears, 
     and then select **Add an action**.
     
       In the search box, enter "twilio" as your filter. 
       Under the actions list, select the action you want.

1. Provide the necessary details for your connection, 
and then choose **Create**:

   * The name to use for your connection
   * Your Twilio account ID 
   * Your Twilio access (authentication) token

1. Provide the necessary details for your selected action 
and continue building your logic app's workflow.

## Connector reference

For technical details about triggers, actions, and limits, which are 
described by the connector's OpenAPI (formerly Swagger) description, 
review the connector's [reference page](/connectors/twilio/).

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](https://aka.ms/logicapps-wish).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)