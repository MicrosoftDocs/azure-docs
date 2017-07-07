---
title: Learn to use the Azure Service Bus connector in your logic apps | Microsoft Docs
description: Create logic apps with Azure App service. Connect to Azure Service Bus to send and receive messages. You can perform actions such as send to queue, send to topic, receive from queue, and receive from subscription.
services: logic-apps
documentationcenter: .net,nodejs,java
author: MandiOhlinger
manager: anneta
editor: ''
tags: connectors

ms.assetid: d6d14f5f-2126-4e33-808e-41de08e6721f
ms.service: logic-apps
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: integration
ms.date: 08/02/2016
ms.author: mandia; ladocs

---
# Get started with the Azure Service Bus connector
Connect to Azure Service Bus to send and receive messages. You can perform actions such as send to queue, send to topic, receive from queue, and receive from subscription.

To use [any connector](apis-list.md), you first need to create a logic app. You can get started by [creating a logic app now](../logic-apps/logic-apps-create-a-logic-app.md).

## Connect to Service Bus
Before your logic app can access any service, you first need to create a connection to the service. A [connection](connectors-overview.md) provides connectivity between a logic app and another service.  

> [!INCLUDE [Steps to create a connection to Azure Service Bus](../../includes/connectors-create-api-servicebus.md)]
> 
> 

## Use a Service Bus trigger
A trigger is an event that can be used to start the workflow defined in a logic app. [Learn more about triggers](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts).  

> [!INCLUDE [Steps to create a Service Bus trigger](../../includes/connectors-create-api-servicebus-trigger.md)]
> 
> 

## Use a Service Bus action
An action is an operation carried out by the workflow defined in a logic app. [Learn more about actions](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts).

[!INCLUDE [Steps to create a Service Bus action](../../includes/connectors-create-api-servicebus-action.md)]

## Connector-specific details

View any triggers and actions defined in the swagger, and also see any limits in the [connector details](/connectors/servicebus/). 

## Next steps
[Create a logic app](../logic-apps/logic-apps-create-a-logic-app.md).

