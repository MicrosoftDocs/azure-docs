---
title: Connect to GitHub - Azure Logic Apps
description: Monitor GitHub events with GitHub REST APIs and Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
manager: carmonm
ms.reviewer: klam, LADocs
ms.topic: conceptual
ms.date: 03/02/2018
tags: connectors
---

# Connect to GitHub from Azure Logic Apps

GitHub is a web-based Git repository hosting service that offers all of the distributed 
revision control and source code management (SCM) functionality in Git plus other features.

To get started with the GitHub connector, 
[create a logic app first](../logic-apps/quickstart-create-first-logic-app-workflow.md).

## Create a connection to GitHub

To use the GitHub connector in a logic app, 
you must first create a *connection* and then provide details for these properties: 

| Property | Required | Description | 
| -------- | -------- | ----------- | 
| Token | Yes | Provide your GitHub credentials. |

After you create the connection, you can execute the actions 
and listen for the triggers described in this article.

> [!INCLUDE [Steps to create a connection to GitHub](../../includes/connectors-create-api-github.md)]
> 

## Connector reference

For technical details about triggers, actions, and limits, which are described by the connector's OpenAPI (formerly Swagger) description, review the [connector's reference page](/connectors/github/).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)