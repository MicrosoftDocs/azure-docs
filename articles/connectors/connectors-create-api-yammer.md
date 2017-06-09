---
title: Add the Yammer Connector in your Azure Logic Apps | Microsoft Docs
description: Overview of the Yammer Connector with REST API parameters
services: logic-apps
documentationcenter: ''
author: MandiOhlinger
manager: anneta
editor: ''
tags: connectors

ms.assetid: b5ae0827-fbb3-45ec-8f45-ad1cc2e7eccc
ms.service: logic-apps
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/18/2016
ms.author: mandia; ladocs

---
# Get started with the Yammer connector
Connect to Yammer to access conversations in your enterprise network. With Yammer, you can:

* Build your business flow based on the data you get from Yammer. 
* Use triggers for when there is a new message in a group, or a feed your following.
* Use actions to post a message, get all messages, and more. These actions get a response, and then make the output available for other actions. For example, when a new message appears, you can send an email using Office 365.

Get started by creating a logic app now; see [Create a logic app](../logic-apps/logic-apps-create-a-logic-app.md).

## Create a connection to Yammer
To use the Yammer connector, you first create a **connection** then provide the details for these properties: 

| Property | Required | Description |
| --- | --- | --- |
| Token |Yes |Provide Yammer Credentials |

> [!INCLUDE [Steps to create a connection to Yammer](../../includes/connectors-create-api-yammer.md)]
> 

## Connector-specific details

View any triggers and actions defined in the swagger, and also see any limits in the [connector details](/connectors/yammer/).

## More connectors
Go back to the [APIs list](apis-list.md).