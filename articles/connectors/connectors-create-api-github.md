---
# required metadata
title: Connect to GitHub - Azure Logic Apps | Microsoft Docs
description: Monitor GitHub events with GitHub REST APIs and Azure Logic Apps
author: ecfan
manager: jeconnoc
ms.author: estfan
ms.date: 03/02/2018
ms.topic: article
ms.service: logic-apps
services: logic-apps

# optional metadata
ms.reviewer: klam, LADocs
ms.suite: integration
tags: connectors
---

# Connect to GitHub

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

## Connector-specific details

For triggers and actions defined in Swagger and any limits, 
review the [connector details](/connectors/github/).

## Find more connectors

* Review the [Connectors list](apis-list.md).