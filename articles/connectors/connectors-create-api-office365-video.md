---
title: Connect to Office 365 Video
description: Automate tasks and workflows that manage videos in Office 365 Video by using Azure Logic Apps 
services: logic-apps
ms.suite: integration
ms.reviewer: klam, logicappspm
ms.topic: article
ms.date: 05/18/2016
tags: connectors
---

# Manage videos in Office365 Video by using Azure Logic Apps

Connect to Office 365 Video to get information about an Office 365 video, get a list of videos, and more. With Office 365 Video, you can:

* Build your business flow based on the data you get from Office 365 Video. 

* Use actions that check the video portal status, get a list of all video in a channel, and more. These actions get a response, and then make the output available for other actions. 

For example, you can use the Bing Search connector to search for Office 365 videos, and then use the Office 365 video connector to get information about that video. If the video meets your requirements, you can post this video on Facebook.

You can get started by creating a logic app now, see [Create a logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

## Connect to Office365 Video

When you add this connector to your logic apps, you must sign-in to your Office 365 Video account and allow logic apps to connect to your account.

> [!INCLUDE [Steps to create a connection to Office 365 Video](../../includes/connectors-create-api-office365video.md)]

After you create the connection, you enter the Office 365 video properties, like the tenant name or channel ID. 

## Connector-specific details

View any triggers and actions defined in the swagger, and also see any limits in the [connector details](/connectors/office365videoconnector/).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)