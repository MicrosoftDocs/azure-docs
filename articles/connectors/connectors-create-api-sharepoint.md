---
title: Connect to SharePoint from Azure Logic Apps | Microsoft Docs
description: Automate tasks and workflows that monitor and manage resources in SharePoint Online or SharePoint Server on premises by using Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.assetid: e0ec3149-507a-409d-8e7b-d5fbded006ce
ms.topic: article
tags: connectors
ms.date: 08/25/2018
---

# Monitor and manage SharePoint resources with Azure Logic Apps

With Azure Logic Apps and the SharePoint connector, 
you can create automated tasks and workflows that 
monitor and manage resources, such as files, folders, 
lists, items, persons, and so on, in SharePoint 
Online or in SharePoint Server on premises, for example:

* Monitor when files or items are created, changed, or deleted.
* Create, get, update, or delete items.
* Add, get, or delete attachments. Get the content from attachments.
* Create, copy, update, or delete files. 
* Update file properties. Get the content, metadata, or properties for a file.
* List or extract folders.
* Get lists or list views.
* Set content approval status.
* Resolve persons.
* Send HTTP requests to SharePoint.
* Get entity values.

You can use triggers that get responses from SharePoint and 
make the output available to other actions. You can use actions 
in your logic apps to perform tasks in SharePoint. You can also 
have other actions use the output from SharePoint actions. 
For example, if you regularly fetch files from SharePoint, 
you can send messages to your team by using the Slack connector.
If you're new to logic apps, review [What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 

* Your SharePoint site address and user credentials

  Your credentials authorize your logic app to create 
  a connection and access your SharePoint account. 

* Before you can connect logic apps to on-premises 
systems such as SharePoint Server, you need to 
[install and set up an on-premises data gateway](../logic-apps/logic-apps-gateway-install.md). 
That way, you can specify to use your gateway installation when 
you create the SharePoint Server connection for your logic app.

* Basic knowledge about 
[how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

* The logic app where you want to access your SharePoint account. 
To start with a SharePoint trigger, [create a blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). 
To use a SharePoint action, start your logic app with a trigger, 
such as a Salesforce trigger, if you have a Salesforce account.

  For example, you can start your logic app with the 
  **When a record is created** Salesforce trigger. 
  This trigger fires each time that a new record, 
  such as a lead, is created in Salesforce. 
  You can then follow this trigger with the SharePoint 
  **Create file** action. That way, when the new 
  record is created, your logic app creates a file 
  in SharePoint with information about that new record.

## Connect to SharePoint

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. Sign in to the [Azure portal](https://portal.azure.com), 
and open your logic app in Logic App Designer, if not open already.

1. For blank logic apps, in the search box, 
enter "sharepoint" as your filter. 
Under the triggers list, select the trigger you want. 

   -or-

   For existing logic apps, under the last step where 
   you want to add a SharePoint action, choose **New step**. 
   In the search box, enter "sharepoint" as your filter. 
   Under the actions list, select the action you want.

   To add an action between steps, 
   move your pointer over the arrow between steps. 
   Choose the plus sign (**+**) that appears, 
   and then select **Add an action**.

1. When you're prompted to sign in, 
provide the necessary connection information. 
If you're using SharePoint Server, 
make sure you select **Connect via on-premises data gateway**. 
When you're done, choose **Create**.

1. Provide the necessary details for your selected trigger 
or action and continue building your logic app's workflow.

## Connector reference

For technical details about triggers, actions, and limits, which are 
described by the connector's OpenAPI (formerly Swagger) description, 
review the connector's [reference page](/connectors/sharepoint/).

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](https://aka.ms/logicapps-wish).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
