---
title: Connect to SendGrid from Azure Logic Apps | Microsoft Docs
description: Automate tasks and workflows that send emails and manage mailing lists in SendGrid by using Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.assetid: bc4f1fc2-824c-4ed7-8de8-e82baff3b746
ms.topic: article
tags: connectors
ms.date: 08/24/2018
---

# Send emails and manage mailing lists in SendGrid by using Azure Logic Apps

With Azure Logic Apps and the SendGrid connector, 
you can create automated tasks and workflows that 
send emails and manage your recipient lists, 
for example:

* Send email.
* Add recipients to lists.
* Get, add, and manage global suppression.

You can use SendGrid actions in your logic apps to perform these tasks. 
You can also have other actions use the output from SendGrid actions. 

This connector provides only actions, so to start your logic app, 
use a separate trigger, such as a **Recurrence** trigger. 
For example, if you regularly add recipients to your lists, 
you can send email about recipients and lists using the 
Office 365 Outlook connector or Outlook.com connector.
If you're new to logic apps, review 
[What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 

* A [SendGrid account](https://www.sendgrid.com/) 
and a [SendGrid API key](https://sendgrid.com/docs/ui/account-and-settings/api-keys/)

   Your API key authorizes your logic app to create 
   a connection and access your SendGrid account.

* Basic knowledge about 
[how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

* The logic app where you want to access your SendGrid account. 
To use a SendGrid action, start your logic app with another trigger, 
for example, the **Recurrence** trigger.

## Connect to SendGrid

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

1. In the search box, enter "sendgrid" as your filter. 
Under the actions list, select the action you want.

1. Provide a name for your connection. 

1. Enter your SendGrid API key, 
and then choose **Create**.

1. Provide the necessary details for your selected action 
and continue building your logic app's workflow.

## Connector reference

For technical details about triggers, actions, and limits, which are 
described by the connector's OpenAPI (formerly Swagger) description, 
review the connector's [reference page](/connectors/sendgrid/).

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](https://aka.ms/logicapps-wish).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)