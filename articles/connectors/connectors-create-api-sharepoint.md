---
title: Connect to SharePoint from Azure Logic Apps
description: Monitor and manage resources in SharePoint Online or SharePoint Server on premises by using Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: logicappspm
ms.topic: article
ms.date: 04/27/2021
tags: connectors
---

# Connect to SharePoint resources with Azure Logic Apps

To automate tasks that monitor and manage resources, such as files, folders, lists, and items, in SharePoint Online or in on-premises SharePoint Server, you can create automated integration workflows by using Azure Logic Apps and the SharePoint connector.

The following list describes example tasks that you can automate:

* Monitor when files or items are created, changed, or deleted.
* Create, get, update, or delete items.
* Add, get, or delete attachments. Get the content from attachments.
* Create, copy, update, or delete files. 
* Update file properties. Get the content, metadata, or properties for a file.
* List or extract folders.
* Get lists or list views.
* Set content approval status.
* Resolve persons.
* Send HTTP requests to SharePoint.
* Get entity values.

In your logic app workflow, you can use a trigger that monitors events in SharePoint and makes the output available to other actions. You can then use actions to perform various tasks in SharePoint. You can also include other actions that use the output from SharePoint actions. For example, if you regularly retrieve files from SharePoint, you can send email alerts about those files and their content by using the Office 365 Outlook connector or Outlook.com connector. If you're new to logic apps, review [What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md). Or, try this [quickstart to create your first example logic app workflow](../logic-apps/quickstart-create-first-logic-app-workflow.md).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/). 

* Your SharePoint site address and user credentials. You need these credentials so that you can authorize your workflow to access your your SharePoint account.

* For connections to an on-premises SharePoint server, you need to [install and set up the on-premises data gateway](../logic-apps/logic-apps-gateway-install.md) on a local computer and a [data gateway resource that's already created in Azure](../logic-apps/logic-apps-gateway-connection.md).

  You can then select the gateway resource to use when you create the SharePoint Server connection from your workflow.

* The logic app workflow where you need access to your SharePoint site or server.

  * To start the workflow with a SharePoint trigger, you need a blank logic app workflow.
  * To add a SharePoint action, your workflow needs to already have a trigger.

## Connect to SharePoint

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

## Add a trigger

1. From the Azure portal, Visual Studio Code, or Visual Studio, open your logic app workflow in the Logic App Designer, if not open already.

1. On the designer, in the search box, enter `sharepoint` as the search term. Select the **SharePoint** connector.

1. From the **Triggers** list, select the trigger that you want to use.

1. When you are prompted to sign in and create a connection, choose one of the following options:

   * For SharePoint Online, select **Sign in** and authenticate your user credentials.
   * For SharePoint Server, select **Connect via on-premises data gateway**. Provide the request information about the gateway resource to use, the authentication type, and other necessary details.

1. When you're done, select **Create**.

   After your workflow successfully creates the connection, your selected trigger appears.

1. Provide the information to set up the trigger and continue building your workflow.

## Add an action

1. From the Azure portal, Visual Studio Code, or Visual Studio, open your logic app workflow in the Logic App Designer, if not open already.

1. Choose one of the following options:

   * To add an action as the currently last step, select **New step**.
   * To add an action between steps, move your pointer over the arrow between those steps. Select the plus sign (**+**), and then select **Add an action**.

1. Under **Choose an operation**, in the search box, enter `sharepoint` as the search term. Select the **SharePoint** connector.

1. From the **Actions** list, select the action that you want to use.

1. When you are prompted to sign in and create a connection, choose one of the following options:

   * For SharePoint Online, select **Sign in** and authenticate your user credentials.
   * For SharePoint Server, select **Connect via on-premises data gateway**. Provide the request information about the gateway resource to use, the authentication type, and other necessary details.

1. When you're done, select **Create**.

   After your workflow successfully creates the connection, your selected action appears.

1. Provide the information to set up the action and continue building your workflow.

## Connector reference

For more technical details about this connector, such as triggers, actions, and limits as described by the connector's Swagger file, review the [connector's reference page](/connectors/sharepoint/).

## Next steps

Learn about other [Logic Apps connectors](../connectors/apis-list.md)