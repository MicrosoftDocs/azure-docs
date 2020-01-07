---
title: Connect to Outlook.com
description: Automate tasks and workflows that manage email, calendars, and contacts in Outlook.com by using Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: klam, logicappspm
ms.topic: article
ms.date: 08/18/2016
tags: connectors
---

# Manage email, calendars, and contacts in Outlook.com by using Azure Logic Apps

With [Azure Logic Apps](../logic-apps/logic-apps-overview.md) and the [Outlook.com connector](/connectors/outlook/), you can create automated tasks and workflows that manage your @outlook.com or @hotmail.com account by building logic apps. For example, you automate these tasks:

* Send email. 
* Schedule meetings.
* Add contacts. 

> [!NOTE]
> To automate tasks for a Microsoft work account such as @fabrikam.onmicrosoft.com, use the 
> [Office 365 Outlook connector](../connectors/connectors-create-api-office365-outlook.md).

## Prerequisites

* An [Outlook.com account](https://outlook.live.com/owa/)

* An Azure subscription. If you don't have an Azure subscription, 
[sign up for a free Azure account](https://azure.microsoft.com/free/). 

* The logic app where you want to access your Outlook.com account. 
To start your logic app with an Outlook trigger, you need a 
[blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). 

* Basic knowledge about 
[how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md).

## Connect to Outlook.com

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

[!INCLUDE [Connect to Outlook.com](../../includes/connectors-create-api-outlook.md)]

## Connector reference

For technical details, such as triggers, actions, and limits, 
as described by the connector's Swagger file, 
see the [connector's reference page](/connectors/outlook/). 

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](https://aka.ms/logicapps-wish).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
