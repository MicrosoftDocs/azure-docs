---
title: Connect to an SFTP server from workflows
description: Connect to your SFTP file server from workflows using Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 10/15/2022
tags: connectors
---

# Connect to an SFTP file server from workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

This how-to guide shows how to access your [SSH File Transfer Protocol (SFTP)](https://www.ssh.com/ssh/sftp/) server from a workflow in Azure Logic Apps. SFTP is a network protocol that provides file access, file transfer, and file management over any reliable data stream and uses the [Secure Shell (SSH)](https://www.ssh.com/ssh/protocol/) protocol.

In Consumption logic app workflows, you can use the **SFTP-SSH** *managed* connector, while in Standard logic app workflows, you can use the **SFTP** built-in connector or the **SFTP-SSH** managed connector. You can use these connector operations to create automated workflows that run when triggered by events in your SFTP server or in other systems and run actions to manage files on your SFTP server. Both the managed and built-in connectors use the SSH protocol.

For example, your workflow can start with an SFTP trigger that monitors and responds to events on your SFTP server. The trigger makes the outputs available to subsequent actions in your workflow. Your workflow can run SFTP actions that get, create, and manage files through your SFTP server account. The following list includes more example tasks:

* Monitor when files are added or changed.
* Get, create, copy, rename, update, list, and delete files.
* Create folders.
* Get file content and metadata.
* Extract archives to folders.

## Connector technical reference

The SFTP connector has different versions, based on [logic app type and host environment](../logic-apps/logic-apps-overview.md#resource-environment-differences).

| Logic app type (plan) | Environment | Connector version |
|------------------------|-------------|-------------------|
| **Consumption** | Multi-tenant Azure Logic Apps | Managed connector (Standard class). For more information, review the following documentation: <br><br>- [SFTP-SSH managed connector reference](/connectors/sftpwithssh/) <br>- [Managed connectors in Azure Logic Apps](managed.md) |
| **Consumption** | Integration service environment (ISE) | Managed connector (Standard class) and ISE version, which has different message limits than the Standard class. For more information, review the following documentation: <br><br>- [SFTP-SSH managed connector reference](/connectors/sftpwithssh/) <br>- [ISE message limits](../logic-apps/logic-apps-limits-and-config.md#message-size-limits) <br>- [Managed connectors in Azure Logic Apps](managed.md) |
| **Standard** | Single-tenant Azure Logic Apps and App Service Environment v3 (Windows plans only) | Managed connector (Azure-hosted) and built-in connector, which is [service provider based](../logic-apps/custom-connector-overview.md#service-provider-interface-implementation). The built-in connector can directly access Azure virtual networks with a connection string. For more information, review the following documentation: <br><br>- [SFTP-SSH managed connector reference](/connectors/sftpwithssh/) <br>- [SFTP built-in connector](/azure/logic-apps/connectors/built-in/reference/sftp/) <br>- [Managed connectors in Azure Logic Apps](managed.md) <br>- [Built-in connectors in Azure Logic Apps](built-in.md) |

## Limitations

* Before you use the SFTP-SSH managed connector, review the known issues and limitations in the [SFTP-SSH managed connector reference](/connectors/sftpwithssh/).

* Before you use the SFTP built-in connector, review the known issues and limitations in the [SFTP built-in connector reference](/azure/logic-apps/connectors/built-in/reference/sftp/).

## Chunking

* For the managed SFTP-SSH connector, the following actions support [chunking](../logic-apps/logic-apps-handle-large-messages.md):

  | Action | Chunking support | Override chunk size support |
  |--------|------------------|-----------------------------|
  | **Copy file** | No | Not applicable |
  | **Create file** | Yes | Yes |
  | **Create folder** | Not applicable | Not applicable |
  | **Delete file** | Not applicable | Not applicable |
  | **Extract archive to folder** | Not applicable | Not applicable |
  | **Get file content** | Yes | Yes |
  | **Get file content using path** | Yes | Yes |
  | **Get file metadata** | Not applicable | Not applicable |
  | **Get file metadata using path** | Not applicable | Not applicable |
  | **List files in folder** | Not applicable | Not applicable |
  | **Rename file** | Not applicable | Not applicable |
  | **Update file** | No | Not applicable |

  SFTP-SSH actions that support chunking can handle files up to 1 GB, while SFTP-SSH actions that don't support chunking can handle files up to 50 MB. The default chunk size is 15 MB. However, this size can dynamically change, starting from 5 MB and gradually increasing to the 50 MB maximum. Dynamic sizing is based on factors such as network latency, server response time, and so on.

  > [!NOTE]
  >
  > For logic apps in an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), 
  > this connector's ISE-labeled version requires chunking to use the [ISE message limits](../logic-apps/logic-apps-limits-and-config.md#message-size-limits) instead.

  You can override this adaptive behavior when you [specify a constant chunk size](#change-chunk-size) to use instead. This size can range from 5 MB to 50 MB. For example, suppose you have a 45-MB file and a network that can that support that file size without latency. Adaptive chunking results in several calls, rather that one call. To reduce the number of calls, you can try setting a 50-MB chunk size. In different scenario, if your logic app workflow is timing out, for example, when using 15-MB chunks, you can try reducing the size to 5 MB.

  Chunk size is associated with a connection. This attribute means you can use the same connection for both actions that support chunking and actions that don't support chunking. In this case, the chunk size for actions that support chunking ranges from 5 MB to 50 MB.

* SFTP-SSH triggers don't support message chunking. When triggers request file content, they select only files that are 15 MB or smaller. To get files larger than 15 MB, follow this pattern instead:

  1. Use an SFTP-SSH trigger that returns only file properties. These triggers have names that include the description, **(properties only)**.

  1. Follow the trigger with the SFTP-SSH **Get file content** action. This action reads the complete file and implicitly uses message chunking.

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Connection and authentication information to access your SFTP server, such as the server address, account credentials, access to an SSH private key, and the SSH private key password. For more information, see [SFTP-SSH managed connector reference - Authentication and permissions](/connectors/sftpwithssh/#authentication-and-permissions).

* The logic app workflow where you want to access your SFTP account. To start with an SFTP-SSH trigger, you have to start with a blank workflow. To use an SFTP-SSH action, start your workflow with another trigger, such as the **Recurrence** trigger.

## Add SFTP-SSH trigger

### [Consumption](#tab/consumption)

1. Sign in to the [Azure portal](https://portal.azure.com), and open your logic app in Logic App Designer, if not open already.

1. For blank logic apps, in the search box, enter `sftp ssh` as your filter. Under the triggers list, select the trigger you want.

   -or-

   For existing logic apps, under the last step where you want to add an action, select **New step**. In the search box, enter `sftp ssh` as your filter. Under the actions list, select the action you want.

   To add an action between steps, move your pointer over the arrow between steps. Select the plus sign (**+**) that appears, and then select **Add an action**.

1. Provide the necessary details for your connection.

   > [!IMPORTANT]
   >
   > When you enter your SSH private key in the **SSH private key** property, follow these additional steps, which help 
   > make sure you provide the complete and correct value for this property. An invalid key causes the connection to fail.

   Although you can use any text editor, here are sample steps that show how to correctly copy and paste your key by using Notepad.exe as an example.

   1. Open your SSH private key file in a text editor. These steps use Notepad as the example.

   1. On the Notepad **Edit** menu, select **Select All**.

   1. Select **Edit** > **Copy**.

   1. In the SFTP-SSH trigger or action, *paste the complete* copied key in the **SSH private key** property, which supports multiple lines. ***Don't manually enter or edit the key***.

1. After you finish entering the connection details, select **Create**.

1. Now provide the necessary details for your selected trigger or action and continue building your logic app's workflow.

<a name="change-chunk-size"></a>

## Override chunk size

To override the default adaptive behavior that chunking uses, you can specify a constant chunk size from 5 MB to 50 MB.

1. In the action's upper-right corner, select the ellipses button (**...**), and then select **Settings**.

   ![Open SFTP-SSH settings](./media/connectors-sftp-ssh/sftp-ssh-connector-setttings.png)

1. Under **Content Transfer**, in the **Chunk size** property, enter an integer value from `5` to `50`, for example: 

   ![Specify chunk size to use instead](./media/connectors-sftp-ssh/specify-chunk-size-override-default.png)

1. After you finish, select **Done**.

## Examples

<a name="file-added-modified"></a>

### SFTP - SSH trigger: When a file is added or modified

This trigger starts a workflow when a file is added or changed on an SFTP server. As example follow-up actions, the workflow can use a condition to check whether the file content meets specified criteria. If the content meets the condition, the **Get file content** SFTP-SSH action can get the content, and then another SFTP-SSH action can put that file in a different folder on the SFTP server.

**Enterprise example**: You can use this trigger to monitor an SFTP folder for new files that represent customer orders. You can then use an SFTP-SSH action such as **Get file content** so you get the order's contents for further processing and store that order in an orders database.

<a name="get-content"></a>

### SFTP - SSH action: Get file content using path

This action gets the content from a file on an SFTP server by specifying the file path. So for example, you can add the trigger from the previous example and a condition that the file's content must meet. If the condition is true, the action that gets the content can run.

<a name="troubleshooting-errors"></a>

## Troubleshoot problems

This section describes possible solutions to common errors or problems.

<a name="connection-attempt-failed"></a>

### 504 error: "A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond" or "Request to the SFTP server has taken more than '00:00:30' seconds"

This error can happen when your logic app can't successfully establish a connection with the SFTP server. There might be different reasons for this problem, so try these troubleshooting options:

* The connection timeout is 20 seconds. Check that your SFTP server has good performance and intermediate devices, such as firewalls, aren't adding overhead.

* If you have a firewall set up, make sure that you add the **Managed connector IP** addresses for your region to the approved list. To find the IP addresses for your logic app's region, see [Managed connector outbound IPs - Azure Logic Apps](/connectors/common/outbound-ip-addresses).

* If this error happens intermittently, change the **Retry policy** setting on the SFTP-SSH action to a retry count higher than the default four retries.

* Check whether your SFTP server puts a limit on the number of connections from each IP address. Any such limit hinders communication between the connector and the SFTP server. Make sure to remove this limit.

* To reduce connection establishment cost, in the SSH configuration for your SFTP server, increase the [**ClientAliveInterval**](https://man.openbsd.org/sshd_config#ClientAliveInterval) property to around one hour.

* Review the SFTP server log to check whether the request from logic app reached the SFTP server. To get more information about the connectivity problem, you can also run a network trace on your firewall and your SFTP server.

<a name="file-does-not-exist"></a>

### 404 error: "A reference was made to a file or folder which does not exist"

This error can happen when your workflow creates a file on your SFTP server with the SFTP-SSH **Create file** action, but immediately moves that file before the Logic Apps service can get the file's metadata. When your workflow runs the **Create file** action, the Logic Apps service automatically calls your SFTP server to get the file's metadata. However, if your logic app moves the file, the Logic Apps service can no longer find the file so you get the `404` error message.

If you can't avoid or delay moving the file, you can skip reading the file's metadata after file creation instead by following these steps:

1. In the **Create file** action, open the **Add new parameter** list, select the **Get all file metadata** property, and set the value to **No**.

1. If you need this file metadata later, you can use the **Get file metadata** action.

## Connector reference

For more technical details about this connector, such as triggers, actions, and limits as described by the connector's Swagger file, see the [connector's reference page](/connectors/sftpwithssh/).

> [!NOTE]
> For logic apps in an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), 
> this connector's ISE-labeled version require chunking to use the [ISE message limits](../logic-apps/logic-apps-limits-and-config.md#message-size-limits) instead.

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
