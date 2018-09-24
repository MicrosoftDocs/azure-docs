---
# required metadata
title: Connect to Box - Azure Logic Apps | Microsoft Docs
description: Create and manage files with Box REST APIs and Azure Logic Apps
author: ecfan
manager: jeconnoc
ms.author: estfan
ms.date: 11/07/2016
ms.topic: article
ms.service: logic-apps
services: logic-apps

# optional metadata
ms.reviewer: klam, LADocs
ms.suite: integration
tags: connectors
---

# Create and manage files in Box with Azure Logic Apps

This article shows how you can create and manage your files 
in Box from inside a logic app with the Box connector. 
That way, you can create logic apps that automate tasks 
and workflows for managing your files and other actions, 
for example:

* Build your business flow based on the data you get from Box. 

* Trigger automated tasks and workflow when a file is created or updated.

* Run actions that copies a file, deletes a file, and more. 

  When these actions get a response, they make the output available for other actions. 
  For example, when a file is changed on Box, you can send that file in email using Office 365.

## Prerequisites

* A [Box account](https://www.box.com/home)

* An Azure subscription. If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 

* The logic app where you want to access your Box account. 
To start your logic app with a Box trigger, you need a 
[blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). 

* Basic knowledge about [how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md).
If you're new to logic apps, review 
[What is Azure Logic Apps](../logic-apps/logic-apps-overview.md).

## Connector reference

For technical details, such as triggers, actions, and limits, 
as described by the connector's Swagger file, 
see the [connector's reference page](/connectors/box/). 

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](http://aka.ms/logicapps-wish).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)