---
title: Connect to Box
description: Automate tasks and workflows that create and manage files in Box by using Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: klam, logicappspm
ms.topic: conceptual
ms.date: 11/07/2016
tags: connectors
---

# Create and manage files in Box by using Azure Logic Apps

This article shows how you can create and manage your files 
in Box from inside a logic app with the Box connector. 
That way, you can create logic apps that automate tasks 
and workflows for managing your files and other actions, 
for example:

* Build your business flow based on the data you get from Box.

* Trigger automated tasks and workflow when a file is created or updated.

* Run an action that copies a file or deletes a file.

  When these actions get a response, they make the output available for other actions. 
  For example, when a file is changed on Box, you can send that file in email using Office 365.

## Prerequisites

* A [Box account](https://www.box.com/home)

* An Azure subscription. If you don't have an Azure subscription, 
[sign up for a free Azure account](https://azure.microsoft.com/free/). 

* The logic app where you want to access your Box account. 
To start your logic app with a Box trigger, you need a 
[blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

* Basic knowledge about [how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md).
If you're new to logic apps, review 
[What is Azure Logic Apps](../logic-apps/logic-apps-overview.md).

## Connector reference

For technical details, such as triggers, actions, and limits, 
as described by the connector's OpenAPI (formerly Swagger) file, 
see the [connector's reference page](/connectors/box/).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)