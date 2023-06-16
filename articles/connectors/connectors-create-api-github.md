---
title: Access, monitor, and manage your GitHub repo
description: Monitor GitHub events and manage your GitHub repo by creating automated workflows with Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 03/02/2018
tags: connectors
---

# Monitor and manage your GitHub repo by using Azure Logic Apps

GitHub is a web-based Git repository hosting service that offers all of the distributed 
revision control and source code management (SCM) functionality in Git plus other features.

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* The logic app where you want to access your Outlook account. To start your workflow with an Office 365 Outlook trigger, you need to have a Consumption or Standard logic app with a blank workflow. To add an Office 365 Outlook action to your workflow, your logic app workflow needs to already have a trigger.

  * [Create an example Consumption logic app workflow](../logic-apps/quickstart-create-example-consumption-workflow.md)
  * [Create an example Standard logic app workflow](../logic-apps/create-single-tenant-workflows-azure-portal.md)

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

* [Managed connectors for Azure Logic Apps](managed.md)
* [Built-in connectors for Azure Logic Apps](built-in.md)
* [What are connectors in Azure Logic Apps](introduction.md)