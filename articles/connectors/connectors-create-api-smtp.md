---
title: Connect to SMTP from Azure Logic Apps | Microsoft Docs
description: Automate tasks and workflows that send email through your SMTP (Simple Mail Transfer Protocol) account by using Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.assetid: d4141c08-88d7-4e59-a757-c06d0dc74300
ms.topic: article
tags: connectors
ms.date: 08/25/2018
---

# Send email from your SMTP account with Azure Logic Apps

With Azure Logic Apps and the Simple Mail Transfer Protocol (SMTP) connector, 
you can create automated tasks and workflows that send email from your SMTP account. 
You can also have other actions use the output from SMTP actions. For example, 
after your SMTP sends an email, you can notify your team in Slack with the Slack connector. 
If you're new to logic apps, review [What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 

* Your SMTP account and user credentials

  Your credentials authorize your logic app to create 
  a connection and access your SMTP account.

* Basic knowledge about 
[how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

* The logic app where you want to access your SMTP account. 
To use an SMTP action, start your logic app with a trigger, 
such as a Salesforce trigger, if you have a Salesforce account.

  For example, you can start your logic app with the 
  **When a record is created** Salesforce trigger. 
  This trigger fires each time that a new record, 
  such as a lead, is created in Salesforce. 
  You can then follow this trigger with the SMTP 
  **Send Email** action. That way, when the new 
  record is created, your logic app sends an email 
  from your SMTP account about the new record.

## Connect to SMTP

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. Sign in to the [Azure portal](https://portal.azure.com), 
and open your logic app in Logic App Designer, if not open already.

1. Under the last step where you want to add an SMTP action, 
choose **New step**. 

   To add an action between steps, 
   move your pointer over the arrow between steps. 
   Choose the plus sign (**+**) that appears, 
   and then select **Add an action**.

1. In the search box, enter "smtp" as your filter. 
Under the actions list, select the action you want.

1. When prompted, provide this connection information:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Connection Name** | Yes | A name for the connection to your SMTP server | 
   | **SMTP Server Address** | Yes | The address for your SMTP server | 
   | **User Name** | Yes | Your username for your SMTP account | 
   | **Password** | Yes | Your password for your SMTP account | 
   | **SMTP Server Port** | No | A specific port on your SMTP server you want to use | 
   | **Enable SSL?** | No | Turn on or turn off SSL encryption. | 
   |||| 

1. Provide the necessary details for your selected action. 

1. Save your logic app or continue building your logic app's workflow.

## Connector reference

For technical details about triggers, actions, and limits, which are 
described by the connector's OpenAPI (formerly Swagger) description, 
review the connector's [reference page](/connectors/smtpconnector/).

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](https://aka.ms/logicapps-wish).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)