---
title: Connect to SFTP account from Azure Logic Apps | Microsoft Docs
description: Automate tasks and workflows that monitor, create, manage, send, and receive files for an SFTP server by using Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: divswa, LADocs
ms.assetid: 697eb8b0-4a66-40c7-be7b-6aa6b131c7ad
ms.topic: article
tags: connectors
ms.date: 09/24/2018
---

# Monitor, create, and manage SFTP files by using Azure Logic Apps and SFTP-SSH connector

With Azure Logic Apps and the SFTP-SSH connector, 
you can create automated tasks and workflows that 
monitor, create, send, and receive files through your 
account on an [SFTP](https://www.ssh.com/ssh/sftp/) server, 
along with other actions, for example:

* Monitor when files are added or changed.
* Get, create, copy, rename, update, list, and delete files.
* Create folder.
* Get file content and metadata.
* Extract archives to folders.


There are few key differences between SFTP - SSH and the [SFTP](connectors-create-api-sftp.md) connector. SFTP - SSH connector:
* uses <a href="https://github.com/sshnet/SSH.NET" target="_blank">**SSH.NET**</a> which is an open source Secure Shell (SSH) library for .NET.
* provides large files support of upto **1 Giga byte (GB)**. The connector can read or write files that are as large as 1 GB
* provides **Create folder** action, to create folder at the specified path on the SFTP server
* provides **Rename file** action, to rename file on the SFTP server
* caches the connection to SFTP server to improve performance and reduce number of connection attempts on the server. 
Users can control the duration for which the connection is cached by configuring the <a href="http://man.openbsd.org/sshd_config#ClientAliveInterval" target="_blank">**ClientAliveInterval**</a> on their SFTP server. 


## How trigger polling works
The triggers work by polling the SFTP file system, and looking for any file that has been modified since the last poll. Certain tools allow the file modification time to be preserved. In such cases, you need to disable the feature for your trigger to work. Here are some common settings:

| SFTP client                  | Action                                                                           |
| :--------------------------- | :--------------------------------------------------------------------------------|
| Winscp                       | Options → Preferences… → Transfer → Edit… → Preserve timestamp → Disable         |
| FileZilla                    | Transfer → Preserve timestamps of transferred files → Disable                    |


When the triggers encounter a new file, it will try to ensure that the new file is completely written. For instance, it is possible that the file is being written or modified, and updates are being made at the time the trigger polled the file server. To avoid returning a file with partial content, the trigger will take note of the timestamp of files which are modified recently, but will not immediately return those files. Those files will be returned only when the trigger polls again. Sometimes, this may lead a delay up to twice the trigger polling interval.

The trigger doesn't pick up files over 50MB if the content is asked for. To pick files larger than 50 MB, the recommended pattern is to use trigger that returns file properties like **When a file is added or modified (properties only)**, followed by an action to read full file, like **Get file content using path**.


You can use triggers that get responses from your SFTP server and 
make the output available to other actions. You can use actions in 
your logic apps to perform tasks with files on your SFTP server. 
You can also have other actions use the output from SFTP actions. 
For example, if you regularly retrieve files from your SFTP server, 
you can send email about those files and their content by using 
the Office 365 Outlook connector or Outlook.com connector.
If you're new to logic apps, review 
[What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 

* Your SFTP host server address and account credentials - your credentials authorize your logic app to create 
   a connection and access your SFTP account.

  The content of the SSH private key should be copied/pasted entirely into the “SSH private key” field in the multiline format. Below are sample steps how to provide the SSH private key using Notepad.exe:
    
   1. Open the SSH private key file in Notepad.exe
   2. Click Edit → Select All
   3. Click Edit → Copy
   4. In the "SSH private key" field (while creating a connection), click right mouse button and click Paste. Do not edit the "SSH private key" field manually.

  > [!NOTE]
  > The connector uses SSH.NET library which supports following SSH private key formats
  > * RSA 
  > * DSA
  > Also, the library supports MD5 finger-print only.
  

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