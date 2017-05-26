---
title: Add the Azure blob storage Connector in your Logic Apps | Microsoft Docs
description: Get started and configure the Azure blob storage connector in a logic app
services: ''
documentationcenter: ''
author: MandiOhlinger
manager: anneta
editor: ''
tags: connectors

ms.assetid: b5dc3f75-6bea-420b-b250-183668d2848d
ms.service: logic-apps
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: integration
ms.date: 05/02/2017
ms.author: mandia; ladocs

---
# Use the Azure blob storage connector in a logic app
Use the Azure Blob storage connector to upload, update, get, and delete blobs in your storage account, all within a logic app.  

With Azure blob storage, you:

* Build your workflow by uploading new projects, or getting files that have been recently updated.
* Use actions to get file metadata, delete a file, copy files, and more. For example, when a tool is updated in an Azure web site (a trigger), then update a file in blob storage (an action). 

This topic shows you how to use the blob storage connector in a logic app.

To learn more about Logic Apps, see [What are logic apps](../logic-apps/logic-apps-what-are-logic-apps.md) and [create a logic app](../logic-apps/logic-apps-create-a-logic-app.md).

To learn more about Logic Apps, see [What are logic apps](../logic-apps/logic-apps-what-are-logic-apps.md) and [create a logic app](../logic-apps/logic-apps-create-a-logic-app.md).

## Connect to Azure blob storage
Before your logic app can access any service, you first create a *connection* to the service. A connection provides connectivity between a logic app and another service. For example, to connect to a storage account, you first create a blob storage *connection*. To create a connection, enter the credentials you normally use to access the service you are connecting to. So with Azure storage, enter the credentials to your storage account to create the connection. 

#### Create the connection
> [!INCLUDE [Create a connection to Azure blob storage](../../includes/connectors-create-api-azureblobstorage.md)]

## Use a trigger
This connector does not have any triggers. Use other triggers to start the logic app, such as a Recurrence trigger, an HTTP Webhook trigger, triggers available with other connectors, and more. [Create a logic app](../logic-apps/logic-apps-create-a-logic-app.md) provides an example.

## Use an action
An action is an operation carried out by the workflow defined in a logic app.

1. Select the plus sign. You see several choices: **Add an action**, **Add a condition**, or one of the **More** options.
   
    ![](./media/connectors-create-api-azureblobstorage/add-action.png)
2. Choose **Add an action**.
3. In the text box, type “blob” to get a list of all the available actions.
   
    ![](./media/connectors-create-api-azureblobstorage/actions.png) 
4. In our example, choose **AzureBlob - Get file metadata using path**. If a connection already exists, then select the **...** (Show Picker) button to select a file.
   
    ![](./media/connectors-create-api-azureblobstorage/sample-file.png)
   
    If you are prompted for the connection information, then enter the details to create the connection. [Create the connection](connectors-create-api-azureblobstorage.md#create-the-connection) in this topic describes these properties. 
   
   > [!NOTE]
   > In this example, we get the metadata of a file. To see the metadata, add another action that creates a new file using another connector. For example, add a OneDrive action that creates a new "test" file based on the metadata. 


5. **Save** your changes (top left corner of the toolbar). Your logic app is saved and may be automatically enabled.

> [!TIP]
> [Storage Explorer](http://storageexplorer.com/) is a great tool to  manage multiple storage accounts.

## Connector-specific details

View any triggers and actions defined in the swagger, and also see any limits in the [connector details](/connectors/azureblobconnector/). 

## Next steps
[Create a logic app](../logic-apps/logic-apps-create-a-logic-app.md). Explore the other available connectors in Logic Apps at our [APIs list](apis-list.md).

