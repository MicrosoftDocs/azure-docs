---
title: Add the Twilio Connector in your Azure Logic apps | Microsoft Docs
description: Overview of the Twilio Connector with REST API parameters
services: logic-apps
documentationcenter: ''
author: MandiOhlinger
manager: anneta
editor: ''
tags: connectors

ms.assetid: 43116187-4a2f-42e5-9852-a0d62f08c5fc
ms.service: logic-apps
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: integration
ms.date: 09/19/2016
ms.author: mandia; ladocs

---
# Get started with the Twilio connector
Connect to Twilio to send and receive global SMS, MMS, and IP messages. With Twilio, you can:

* Build your business flow based on the data you get from Twilio. 
* Use actions that get a message, list messages, and more. These actions get a response, and then make the output available for other actions. For example, when  you get a new Twilio message, you can take this message and use it a Service Bus workflow. 

Get started by creating a logic app; see [Create a logic app](../logic-apps/logic-apps-create-a-logic-app.md).

## Create a connection to Twilio
When you add this Connector to your logic apps, enter the following Twilio values:

| Property | Required | Description |
| --- | --- | --- |
| Account ID |Yes |Enter your Twilio account ID |
| Access Token |Yes |Enter your Twilio access token |

> [!INCLUDE [Steps to create a connection to Twilio](../../includes/connectors-create-api-twilio.md)]
> 
> 

If you don't have a Twilio access token, see [User Identity & Access Tokens](https://www.twilio.com/docs/api/chat/guides/identity).

## Connector-specific details

View any triggers and actions defined in the swagger, and also see any limits in the [connector details](/connectors/twilio/).

## More connectors
Go back to the [APIs list](apis-list.md).