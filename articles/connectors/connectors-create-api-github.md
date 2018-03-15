---
title: Connect to GitHub with Azure Logic Apps | Microsoft Docs
description: Automate workflows for GitHub with Azure Logic Apps
services: logic-apps
documentationcenter: 
author: MandiOhlinger
manager: anneta
editor: ''
tags: connectors

ms.assetid: 8f873e6c-f4c0-4c2e-a5bd-2e953efe5e2b
ms.service: logic-apps
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: integration
ms.date: 03/02/2018
ms.author: mandia; ladocs
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