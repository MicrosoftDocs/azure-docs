---
title: Connect to SFTP account from Azure Logic Apps | Microsoft Docs
description: Automate tasks and workflows that monitor, create, manage, send, and receive files for an SFTP server by using Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.assetid: 697eb8b0-4a66-40c7-be7b-6aa6b131c7ad
ms.topic: article
tags: connectors
ms.date: 10/11/2018
---

# Monitor, create, and manage SFTP files by using Azure Logic Apps

With Azure Logic Apps and the SFTP connector, 
you can create automated tasks and workflows that 
monitor, create, send, and receive files through your 
account on an [SFTP](https://www.ssh.com/ssh/sftp/) server, 
along with other actions, for example:

* Monitor when files are added or changed.
* Get, create, copy, update, list, and delete files.
* Get file content and metadata.
* Extract archives to folders.

You can use triggers that get responses from your SFTP server and 
make the output available to other actions. You can use actions in 
your logic apps to perform tasks with files on your SFTP server. 
You can also have other actions use the output from SFTP actions. 
For example, if you regularly retrieve files from your SFTP server, 
you can send email about those files and their content by using 
the Office 365 Outlook connector or Outlook.com connector. 
If you're new to logic apps, review 
[What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

> [!NOTE]
> For files larger than 50 MB and up to 1 GB, 
> use the [SFTP-SSH connector](../connectors/connectors-sftp-ssh.md). 
> The SFTP connector supports only files that are 50 MB or smaller 
> unless you use [chunking for handling large messages](../logic-apps/logic-apps-handle-large-messages.md). 

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 

* Your SFTP host server address and account credentials

   Your credentials authorize your logic app to create 
   a connection and access your SFTP account.

* Basic knowledge about 
[how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

* The logic app where you want to access your SFTP account. 
To start with an SFTP trigger, 
[create a blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). 
To use an SFTP action, start your logic app with another trigger, 
for example, the **Recurrence** trigger.

## Connect to SFTP

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. Sign in to the [Azure portal](https://portal.azure.com), 
and open your logic app in Logic App Designer, if not open already.

1. For blank logic apps, in the search box, 
enter "sftp" as your filter. Under the triggers list, 
select the trigger you want. 

   -or-

   For existing logic apps, under the last step where 
   you want to add an action, choose **New step**. 
   In the search box, enter "sftp" as your filter. 
   Under the actions list, select the action you want.

   To add an action between steps, 
   move your pointer over the arrow between steps. 
   Choose the plus sign (**+**) that appears, 
   and then select **Add an action**.

1. Provide the necessary details for your connection, 
and then choose **Create**.

1. Provide the necessary details for your selected trigger 
or action and continue building your logic app's workflow.

## Examples

### SFTP trigger: When a file is added or modified

This trigger starts a logic app workflow when the trigger 
detects when a file is added or changed on an SFTP server. 
So for example, you can add a condition that checks the file's 
content and decides whether to get that content, 
based on whether that content meets a specified condition. 
Finally, you can add an action that gets the file's content, 
and put that content in a folder on the SFTP server. 

**Enterprise example**: You can use this trigger to monitor 
an SFTP folder for new files that represent customer orders. 
You can then use an SFTP action such as **Get file content**, 
so you can get the order's contents for further processing 
and store that order in an orders database.

### SFTP action: Get content

This action gets the content from a file on an SFTP server. 
So for example, you can add the trigger from the previous 
example and a condition that the file's content must meet. 
If the condition is true, the action that gets the content can run. 

## Connector reference

For technical details about triggers, actions, and limits, which are 
described by the connector's OpenAPI (formerly Swagger) description, 
review the connector's [reference page](/connectors/sftpconnector/).

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](http://aka.ms/logicapps-wish).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)