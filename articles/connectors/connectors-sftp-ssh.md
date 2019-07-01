---
title: Connect to SFTP server with SSH - Azure Logic Apps
description: Automate tasks that monitor, create, manage, send, and receive files for an SFTP server by using SSH and Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: divswa, klam, LADocs
ms.topic: article
ms.date: 06/18/2019
tags: connectors
---

# Monitor, create, and manage SFTP files by using SSH and Azure Logic Apps

To automate tasks that monitor, create, send, and receive files on a [Secure File Transfer Protocol (SFTP)](https://www.ssh.com/ssh/sftp/) server by using the [Secure Shell (SSH)](https://www.ssh.com/ssh/protocol/) protocol, you can build and automate integration workflows by using Azure Logic Apps and the SFTP-SSH connector. SFTP is a network protocol that provides file access, file transfer, and file management over any reliable data stream. Here are some example tasks you can automate:

* Monitor when files are added or changed.
* Get, create, copy, rename, update, list, and delete files.
* Create folders.
* Get file content and metadata.
* Extract archives to folders.

You can use triggers that monitor events on your SFTP server and make output available to other actions. You can use actions that perform various tasks on your SFTP server. You can also have other actions in your logic app use the output from SFTP actions. For example, if you regularly retrieve files from your SFTP server, you can send email alerts about those files and their content by using the Office 365 Outlook connector or Outlook.com connector. If you're new to logic apps, review [What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

For differences between the SFTP-SSH connector and the SFTP connector, review the [Compare SFTP-SSH versus SFTP](#comparison) section later in this topic.

## Limits

* By default, SFTP-SSH actions can read or write files that are *1 GB or smaller* but only in *15 MB* chunks at a time. To handle files larger than 15 MB, SFTP-SSH actions support [message chunking](../logic-apps/logic-apps-handle-large-messages.md), except for the Copy File action, which can handle only 15 MB files. The **Get file content** action implicitly uses message chunking. 

* SFTP-SSH triggers don't support chunking. When requesting file content, triggers select only files that are 15 MB or smaller. To get files larger than 15 MB, follow this pattern instead:

  * Use an SFTP-SSH trigger that returns file properties, such as **When a file is added or modified (properties only)**.

  * Follow the trigger with the SFTP-SSH **Get file content** action, which reads the complete file and implicitly uses message chunking.

<a name="comparison"></a>

## Compare SFTP-SSH versus SFTP

Here are other key differences between the SFTP-SSH connector and the SFTP connector where the SFTP-SSH connector has these capabilities:

* Uses the [SSH.NET library](https://github.com/sshnet/SSH.NET), which is an open-source Secure Shell (SSH) library that supports .NET.

  > [!NOTE]
  >
  > The SFTP-SSH connector supports *only* these private keys, 
  > formats, algorithms, and fingerprints:
  >
  > * **Private key formats**: RSA (Rivest Shamir Adleman) and 
  > DSA (Digital Signature Algorithm) keys in both OpenSSH and ssh.com formats
  > * **Encryption algorithms**: DES-EDE3-CBC, DES-EDE3-CFB, DES-CBC, 
  > AES-128-CBC, AES-192-CBC, and AES-256-CBC
  > * **Fingerprint**: MD5

* By default, SFTP-SSH actions can read or write files that are *1 GB or smaller* but only in *15 MB* chunks at a time. To handle files larger than 15 MB, SFTP-SSH actions can use [message chunking](../logic-apps/logic-apps-handle-large-messages.md). However, the Copy File action supports only 15 MB files because that action doesn't support message chunking. SFTP-SSH triggers don't support chunking.

* Provides the **Create folder** action, which creates a folder at the specified path on the SFTP server.

* Provides the **Rename file** action, which renames a file on the SFTP server.

* Caches the connection to SFTP server *for up to 1 hour*, which improves performance and reduces the number of attempts at connecting to the server. To set the duration for this caching behavior, edit the [**ClientAliveInterval**](https://man.openbsd.org/sshd_config#ClientAliveInterval) property in the SSH configuration on your SFTP server.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* Your SFTP server address and account credentials, which let your logic app access your SFTP account. You also need access to an SSH private key and the SSH private key password.

  > [!IMPORTANT]
  >
  > The SFTP-SSH connector supports *only* these private 
  > key formats, algorithms, and fingerprints:
  >
  > * **Private key formats**: RSA (Rivest Shamir Adleman) and 
  > DSA (Digital Signature Algorithm) keys in both OpenSSH and ssh.com formats
  > * **Encryption algorithms**: DES-EDE3-CBC, DES-EDE3-CFB, DES-CBC, 
  > AES-128-CBC, AES-192-CBC, and AES-256-CBC
  > * **Fingerprint**: MD5
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

* Basic knowledge about [how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

* The logic app where you want to access your SFTP account. To start with an SFTP-SSH trigger, [create a blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). To use an SFTP-SSH action, start your logic app with another trigger, for example, the **Recurrence** trigger.

## How SFTP-SSH triggers work

SFTP-SSH triggers work by polling the SFTP file system and looking for any file that was changed since the last poll. Some tools let you preserve the timestamp when the files change. In these cases, you have to disable this feature so your trigger can work. Here are some common settings:

| SFTP client | Action |
|-------------|--------|
| Winscp | Go to **Options** > **Preferences** > **Transfer** > **Edit** > **Preserve timestamp** > **Disable** |
| FileZilla | Go to **Transfer** > **Preserve timestamps of transferred files** > **Disable** |
|||

When a trigger finds a new file, the trigger checks that the new file is complete, and not partially written. For example, a file might have changes in progress when the trigger checks the file server. To avoid returning a partially written file, the trigger notes the timestamp for the file that has recent changes, but doesn't immediately return that file. The trigger returns the file only when polling the server again. Sometimes, this behavior might cause a delay that is up to twice the trigger's polling interval.

## Connect to SFTP with SSH

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. Sign in to the [Azure portal](https://portal.azure.com), and open your logic app in Logic App Designer, if not open already.

1. For blank logic apps, in the search box, enter "sftp ssh" as your filter. Under the triggers list, select the trigger you want.

   -or-

   For existing logic apps, under the last step where you want to add an action, choose **New step**. In the search box, enter "sftp ssh" as your filter. Under the actions list, select the action you want.

   To add an action between steps, move your pointer over the arrow between steps. Choose the plus sign (**+**) that appears, and then select **Add an action**.

1. Provide the necessary details for your connection.

   > [!IMPORTANT]
   >
   > When you enter your SSH private key in the 
   > **SSH private key** property, follow these 
   > additional steps, which help make sure you provide 
   > the complete and correct value for this property. 
   > An invalid key causes the connection to fail.

   Although you can use any text editor, here are sample steps that show how to correctly copy and paste your key by using Notepad.exe as an example.

   1. Open your SSH private key file in a text editor. These steps use Notepad as the example.

   1. On the Notepad **Edit** menu, select **Select All**.

   1. Select **Edit** > **Copy**.

   1. In the SFTP-SSH trigger or action you added, paste the *complete* key you copied into the **SSH private key** property, which supports multiple lines.  ***Make sure you paste*** the key. ***Don't manually enter or edit the key***.

1. When you're done entering the connection details, choose **Create**.

1. Now provide the necessary details for your selected trigger or action and continue building your logic app's workflow.

## Examples

<a name="file-added-modified"></a>

### SFTP - SSH trigger: When a file is added or modified

This trigger starts a logic app workflow when a file is added or changed on an SFTP server. For example, you can add a condition that checks the file's content and gets the content based on whether the content meets a specified condition. You can then add an action that gets the file's content, and puts that content in a folder on the SFTP server.

**Enterprise example**: You can use this trigger to monitor an SFTP folder for new files that represent customer orders. You can then use an SFTP action such as **Get file content** so you get the order's contents for further processing and store that order in an orders database.

<a name="get-content"></a>

### SFTP - SSH action: Get content using path

This action gets the content from a file on an SFTP server. So for example, you can add the trigger from the previous example and a condition that the file's content must meet. If the condition is true, the action that gets the content can run.

## Connector reference

For technical details about triggers, actions, and limits, which are described by the connector's OpenAPI (formerly Swagger) description, review the connector's [reference page](/connectors/sftpconnector/).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
