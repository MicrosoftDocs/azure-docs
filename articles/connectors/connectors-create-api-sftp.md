---
title: Learn how to use the SFTP connector in your logic apps | Microsoft Docs
description: Create logic apps with Azure App service. Connect to SFTP API to send and receive files. You can perform various operations such as create, update, get or delete files.
services: logic-apps
documentationcenter: .net,nodejs,java
author: MandiOhlinger
manager: anneta
editor: ''
tags: connectors

ms.assetid: 697eb8b0-4a66-40c7-be7b-6aa6b131c7ad
ms.service: logic-apps
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: integration
ms.date: 07/20/2016
ms.author: mandia; ladocs

---
# Get started with the SFTP connector
Use the SFTP connector to access an SFTP account to send and receive files. You can perform various operations such as create, update, get or delete files.  

To use [any connector](apis-list.md), you first need to create a logic app. You can get started by [creating a logic app now](../logic-apps/logic-apps-create-a-logic-app.md).

## Connect to SFTP
Before your logic app can access any service, you first need to create a *connection* to the service. A [connection](connectors-overview.md) provides connectivity between a logic app and another service.  

### Create a connection to SFTP
> [!INCLUDE [Steps to create a connection to SFTP](../../includes/connectors-create-api-sftp.md)]
> 
> 

## Use an SFTP trigger
A trigger is an event that can be used to start the workflow defined in a logic app. [Learn more about triggers](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts).  

In this example, the **SFTP - When a file is added or modified** trigger is used to initiate a logic app workflow when a file is added to, or modified on, an SFTP server. You also add a condition that checks the contents of the new or modified file, and makes a decision to extract the file if its contents indicate that it should be extracted before using the contents. Finally, add an action to extract the contents of a file, and place the extracted contents in a folder on the SFTP server. 

In an enterprise example, you could use this trigger to monitor an SFTP folder for new files that represent customer orders.  You could then use an SFTP connector action, such as **Get file content**, to get the contents of the order for further processing and storage in an orders database.

> [!INCLUDE [Steps to create an SFTP trigger](../../includes/connectors-create-api-sftp-trigger.md)]
> 
> 

## Add a condition
> [!INCLUDE [Steps to add a condition](../../includes/connectors-create-api-sftp-condition.md)]
> 
> 

## Use an SFTP action
An action is an operation carried out by the workflow defined in a logic app. [Learn more about actions](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts).  

> [!INCLUDE [Steps to create an SFTP action](../../includes/connectors-create-api-sftp-action.md)]
> 
> 

## Connector-specific details

View any triggers and actions defined in the swagger, and also see any limits in the [connector details](/connectors/sftpconnector/).

## More connectors
Go back to the [APIs list](apis-list.md).