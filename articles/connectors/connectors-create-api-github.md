---
title: GitHub connector in Azure Logic Apps | Microsoft Docs
description: Create Logic apps with Azure App service. GitHub is a web-based Git repository hosting service. It offers all of the distributed revision control and source code management (SCM) functionality of Git as well as adding its own features.
services: logic-apps
documentationcenter: .net,nodejs,java
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
ms.date: 08/18/2016
ms.author: mandia; ladocs

---
# Get started with the GitHub connector
GitHub is a web-based Git repository hosting service. It offers all of the distributed revision control and source code management (SCM) functionality of Git as well as adding its own features.

You can get started by creating a Logic app now, see [Create a logic app](../logic-apps/logic-apps-create-a-logic-app.md).

## Create a connection to GitHub
To create Logic apps with GitHub, you must first create a **connection** then provide the details for the following properties: 

| Property | Required | Description |
| --- | --- | --- |
| Token |Yes |Provide GitHub Credentials |

After you create the connection, you can use it to execute the actions and listen for the triggers described in this article. 

> [!INCLUDE [Steps to create a connection to GitHub](../../includes/connectors-create-api-github.md)]
> 

## Connector-specific details

View any triggers and actions defined in the swagger, and also see any limits in the [connector details](/connectors/github/).

## More connectors
Go back to the [APIs list](apis-list.md).