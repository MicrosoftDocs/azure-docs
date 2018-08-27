---
title: Connect to file systems on premises - Azure Logic Apps | Microsoft Docs
description: Automate tasks and workflows that connect to on-premises file systems with the File System connector through the on-premises data gateway in Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: derek1ee
ms.author: deli
ms.reviewer: klam, estfan, LADocs
ms.topic: article
ms.date: 09/18/2017
---

# Connect to on-premises file systems with Azure Logic Apps

With the File System connector and Azure Logic Apps, 
you can create automated tasks and workflows that 
create and manage files on an on-premises file share, 
for example:  

- Create, get, append, update, and delete files
- List files in folders or root folders.
- Get file content and metadata.

This article shows how you can connect to an on-premises 
file system as described by this example scenario: 
copy a file that's uploaded to Dropbox to a file share, 
and then send an email. To securely connect and access on-premises systems, 
logic apps use the [on-premises data gateway](../logic-apps/logic-apps-gateway-connection.md). 
If you're new to logic apps, review [What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 

* Before you can connect logic apps to on-premises 
systems such as your file system server, you need to 
[install and set up an on-premises data gateway](../logic-apps/logic-apps-gateway-install.md). 
That way, you can specify to use your gateway installation when 
you create the file system connection from your logic app.

* A [Drobox account](https://www.dropbox.com/) and your user credentials

  Your credentials authorize your logic app to create 
  a connection and access your Drobox account. 

* Basic knowledge about [how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md). 
For this example, you need a blank logic app.

## Add trigger and actions

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. Sign in to the [Azure portal](https://portal.azure.com), 
and open your logic app in Logic App Designer, if not open already.

1. In the search box, enter "dropbox" as your filter. 
From the triggers list, select this trigger: 
**When a file is created** 

1. Under the trigger, choose **Next step**. 
In the search box, enter "file system" as your filter. 
From the actions list, select this action: 
**Create file - File System**

   ![Find File System connector](media/logic-apps-using-file-connector/search-file-connector.png)

1. If you don't already have a connection to your file system, 
you're prompted to create a connection. 

1. When you're prompted to sign in, 
select **Connect via on-premise data gateway** 
and provide the necessary connection information.

   ![Configure connection](media/logic-apps-using-file-connector/create-file.png)

   | Setting | Description |
   | ------- | ----------- |
   | **Root folder** | Specify the root folder for your file system. You can specify a local folder on the machine where the on-premises data gateway is installed, or the folder can be a network share that the machine can access. <p>**Tip:** The root folder is the main parent folder, which is used for relative paths for all file-related actions. | 
   | **Authentication type** | The type of authentication that's used by your file system | 
   | **Username** | Provide your username {*domain*\\*username*} for your previously installed gateway. | 
   | **Password** | Provide your password for your previously installed gateway. | 
   | **Gateway** | Select your previously installed gateway. | 
   ||| 

1. When you're done, choose **Create**. 

   Logic Apps configures and tests your connection, 
   making sure that the connection works properly. 
   If the connection is set up correctly, 
   options appear for the action that you previously selected. 
   The file system connector is now ready for use.

1. In the **Create file** action, provide the necessary details
for copying files from Dropbox to the root folder in your 
on-premises file share.

   ![Create file action](media/logic-apps-using-file-connector/create-file-filled.png)

1. Now, add an Outlook action that sends an email 
so that the appropriate users know about the new file. 
Enter the recipients, title, and body of the email. 

   From the dynamic content list, you can choose data outputs 
   from the file connector so you can add more details to the email.

   ![Send email action](media/logic-apps-using-file-connector/send-email.png)

1. Save your logic app. Test your app by uploading a file to Dropbox. 

   The file should get copied to the on-premises file share, 
   and you should receive an email about the operation.

## Connector reference

For technical details about triggers, actions, and limits, which are 
described by the connector's OpenAPI (formerly Swagger) description, 
review the connector's [reference page](/connectors/fileconnector/).

## Get support

* For questions, visit the 
[Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).

* To help improve Azure Logic Apps and connectors, vote on or submit ideas at the 
[Azure Logic Apps User Voice site](http://aka.ms/logicapps-wish).

## Next steps

* [Connect to on-premises data](../logic-apps/logic-apps-gateway-connection.md) 
* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
* [Enterprise integration for B2B scenarios](../logic-apps/logic-apps-enterprise-integration-overview.md)
