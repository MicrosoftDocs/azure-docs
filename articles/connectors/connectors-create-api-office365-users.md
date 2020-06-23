---
title: Connect to Office 365 Users
description: Automate tasks and workflows that get and manage profiles in Office 365 Users profiles by using Azure Logic Apps 
services: logic-apps
ms.suite: integration
ms.reviewer: klam, logicappspm
ms.date: 08/18/2016
ms.topic: article
tags: connectors
---

# Get and manage profiles in Office 365 Users by using Azure Logic Apps

Connect to Office 365 Users to get profiles, search users, and more. With Office 365 Users, you can:

* Build your business flow based on the data you get from Office 365 Users. 
* Use actions that get direct reports, get a manager's user profile, and more. These actions get a response, and then make the output available for other actions. For example, get a person's direct reports, and then take this information and update a database in Azure SQL Database. 

You can get started by creating a logic app now, see [Create a logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

## Create a connection to Office 365 Users

When you add this connector to your logic apps, you must sign-in to your Office 365 Users account so that Azure Logic Apps can connect to your account.

> [!INCLUDE [Steps to create a connection to Office 365 Users](../../includes/connectors-create-api-office365users.md)]
> 
> 

After you create the connection, you enter the Office 365 Users properties, like the user ID. The **REST API reference** in this article describes these properties.

## Connector-specific details

For technical details about triggers, actions, and limits, which are described by the connector's Swagger description, review the [connector's reference page](/connectors/officeusers/).

## Next steps

* Learn about other [Logic Apps connectors](apis-list.md)