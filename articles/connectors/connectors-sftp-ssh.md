---
title: Connect to SFTP account with SSH - Azure Logic Apps | Microsoft Docs
description: Automate tasks that monitor, create, manage, send, and receive files for an SFTP server through SSH by using Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: divswa, LADocs
ms.topic: article
tags: connectors
ms.date: 10/26/2018
---

# Monitor, create, and manage SFTP files by using SSH and Azure Logic Apps

With Azure Logic Apps and the SFTP-SSH connector, 
you can automate tasks and processes that monitor, 
create, send, and receive files on an 
[SFTP](https://www.ssh.com/ssh/sftp/) server 
along with other actions, for example:

* Monitor when files are added or changed.
* Get, create, copy, rename, update, list, and delete files.
* Create folder.
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
> The SFTP-SSH connector can handle files up to *1 GB* in size. 
> For larger messages, you can also use 
> [chunking for handling large messages](../logic-apps/logic-apps-handle-large-messages.md). 
>
> Also, ***the SFTP-SSH connector supports these private SSH key 
> formats but only the MD5 fingerprint***:
> 
> * PuTTY-based RSA (Rivest Shamir Adleman), not open RSA
> * DSA (Digital Signature Algorithm)

## SFTP-SSH versus SFTP

Here are the few key differences between the SFTP-SSH connector and the 
[SFTP connector](../connectors/connectors-create-api-sftp.md). The SFTP-SSH 
connector provides these capabilities:

* Uses the <a href="https://github.com/sshnet/SSH.NET" target="_blank">**SSH.NET**</a> library, 
which is an open-source Secure Shell (SSH) library that supports .NET. 

* Reads or writes files up to *1 GB* in size compared 
to the SFTP connector. For files larger than 1 GB, use 
[chunking for handling large messages](../logic-apps/logic-apps-handle-large-messages.md). 

* Provides the **Create folder** action, which creates 
a folder at the specified path on the SFTP server.

* Provides the **Rename file** action, which renames a file on the SFTP server.

* Caches the connection to SFTP server, which improves performance 
and reduces the number of connection attempts on the server. 

  You can control the duration used for caching the connection 
  by setting up the <a href="http://man.openbsd.org/sshd_config#ClientAliveInterval" target="_blank">**ClientAliveInterval**</a> property on your SFTP server. 

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 

* Your SFTP server address and account credentials, 
which authorize your logic app to access your SFTP account 

  > [!NOTE] 
  > 
  > ***The SFTP-SSH connector supports these private SSH key 
  > formats but only the MD5 fingerprint***:
  > 
  > * PuTTY-based RSA (Rivest Shamir Adleman), not open RSA
  > * DSA (Digital Signature Algorithm)
  > 
  > When you're creating your logic app, after you add 
  > the SFTP-SSH trigger or action you want, you'll need 
  > to provide connection information for your SFTP server. 
  > If you're using an SSH private key, make sure you 
  > ***copy*** the key from your SSH private key file, 
  > and ***paste*** that key into the connection details, 
  > ***Don't manually enter or edit the key***, 
  > which might cause the connection to fail. 
  > For more information, see the later steps in this article.

* Basic knowledge about 
[how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

* The logic app where you want to access your SFTP account. 
To start with an SFTP - SSH trigger, 
[create a blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). 
To use an SFTP - SSH action, start your logic app with another trigger, 
for example, the **Recurrence** trigger.

## Connect to SFTP with SSH

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. Sign in to the [Azure portal](https://portal.azure.com), 
and open your logic app in Logic App Designer, if not open already.

1. For blank logic apps, in the search box, 
enter "sftp ssh" as your filter. Under the triggers list, 
select the trigger you want. 

   -or-

   For existing logic apps, under the last step where 
   you want to add an action, choose **New step**. 
   In the search box, enter "sftp ssh" as your filter. 
   Under the actions list, select the action you want.

   To add an action between steps, 
   move your pointer over the arrow between steps. 
   Choose the plus sign (**+**) that appears, 
   and then select **Add an action**.

1. Provide the necessary details for your connection.

   > [!IMPORTANT] 
   > When you enter your SSH private key in the 
   > **SSH private key** property, follow these 
   > additional steps, which help make sure you 
   > provide the complete and correct value for this property. 
   > An invalid key causes the connection to fail.
   
   Although you can use any text editor, here are sample 
   steps that show how to correctly copy and paste your key 
   by using Notepad.exe as an example.
    
   1. Open the SSH private key file in a text editor. 
   These steps use Notepad as the example.

   1. On Notepad's **Edit** menu, select **Select All**.

   1. Select **Edit** > **Copy**.

   1. When you provide the connection details for the 
  SFTP-SSH trigger or action's **SSH private key** property, 
  ***make sure you paste*** the key. ***Don't manually enter 
  or edit the key***.

1. When you're done providing the connection details, 
choose **Create**.

1. Now provide the necessary details for your selected trigger 
or action and continue building your logic app's workflow.

## How SFTP-SSH trigger polling works

The SFTP-SSH triggers work by polling the SFTP file system 
and looking for any file that was changed since the last poll. 
Some tools let you preserve the timestamp when the files change, 
so in these cases, you need to disable this feature for your 
trigger to work. Here are some common settings:

| SFTP client | Action | 
|-------------|--------| 
| Winscp | Options → Preferences… → Transfer → Edit… → Preserve timestamp → Disable |
| FileZilla | Transfer → Preserve timestamps of transferred files → Disable | 
||| 

When a trigger finds a new file, the trigger checks that the new file is complete, 
and not partially written. For example, a file might have changes in progress when 
the trigger checks the file server. To avoid returning a partially written file, 
the trigger notes the timestamp for the file that has recent changes, but doesn't 
immediately return that file. The trigger returns the file only when polling the 
server again. Sometimes, this behavior might cause a delay that is up to twice 
the trigger's polling interval. 

When requesting file content, the trigger doesn't retrieve files larger than 50 MB. 
To get files larger than 50 MB, follow this pattern:

* Use a trigger that returns file properties, 
such as **When a file is added or modified (properties only)**. 
* Follow the trigger with an action that reads the complete file, 
such as **Get file content using path**.

## Examples

### SFTP - SSH trigger: When a file is added or modified

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

### SFTP - SSH action: Get content

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