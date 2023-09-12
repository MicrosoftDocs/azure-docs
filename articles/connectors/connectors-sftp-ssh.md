---
title: Connect to an SFTP server from workflows
description: Connect to your SFTP file server from workflows using Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/01/2023
---

# Connect to an SFTP file server from workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

This how-to guide shows how to access your [SSH File Transfer Protocol (SFTP)](https://www.ssh.com/ssh/sftp/) server from a workflow in Azure Logic Apps. SFTP is a network protocol that provides file access, file transfer, and file management over any reliable data stream and uses the [Secure Shell (SSH)](https://www.ssh.com/ssh/protocol/) protocol.

In Consumption logic app workflows, you can use the **SFTP-SSH** *managed* connector, while in Standard logic app workflows, you can use the **SFTP** built-in connector or the **SFTP-SSH** managed connector. You can use these connector operations to create automated workflows that run when triggered by events in your SFTP server or in other systems and run actions to manage files on your SFTP server. Both the managed and built-in connectors use the SSH protocol.

> [!NOTE]
>
> The [**SFTP** *managed* connector](/connectors/sftp/) has been deprecated, so this connector's operations no longer appear in the workflow designer.

For example, your workflow can start with an SFTP trigger that monitors and responds to events on your SFTP server. The trigger makes the outputs available to subsequent actions in your workflow. Your workflow can run SFTP actions that get, create, and manage files through your SFTP server account. The following list includes more example tasks:

* Monitor when files are added or changed.
* Get, create, copy, rename, update, list, and delete files.
* Create folders.
* Get file content and metadata.
* Extract archives to folders.

The following steps use the Azure portal, but with the appropriate Azure Logic Apps extension, you can also use the following tools to create and edit logic app workflows:

* Consumption logic app workflows: [Visual Studio](../logic-apps/quickstart-create-logic-apps-with-visual-studio.md) or [Visual Studio Code](../logic-apps/quickstart-create-logic-apps-visual-studio-code.md)

* Standard logic app workflows: [Visual Studio Code](../logic-apps/create-single-tenant-workflows-visual-studio-code.md)

## Connector technical reference

The SFTP connector has different versions, based on [logic app type and host environment](../logic-apps/logic-apps-overview.md#resource-environment-differences).

| Logic app type (plan) | Environment | Connector version |
|------------------------|-------------|-------------------|
| **Consumption** | Multi-tenant Azure Logic Apps | Managed connector, which appears in the designer under the **Standard** label. For more information, review the following documentation: <br><br>- [SFTP-SSH managed connector reference](/connectors/sftpwithssh/) <br>- [Managed connectors in Azure Logic Apps](managed.md) |
| **Consumption** | Integration service environment (ISE) | Managed connector, which appears in the designer under the **Standard** label, and the ISE version, which appears in the designer with the **ISE** label and has different message limits than the managed connector. For more information, review the following documentation: <br><br>- [SFTP-SSH managed connector reference](/connectors/sftpwithssh/) <br>- [ISE message limits](../logic-apps/logic-apps-limits-and-config.md#message-size-limits) <br>- [Managed connectors in Azure Logic Apps](managed.md) |
| **Standard** | Single-tenant Azure Logic Apps and App Service Environment v3 (Windows plans only) | Managed connector, which appears in the connector gallery under **Runtime** > **Shared**, and the built-in connector, which appears in the connector gallery under **Runtime** > **In-App** and is [service provider-based](../logic-apps/custom-connector-overview.md#service-provider-interface-implementation). The built-in connector can directly connect to an SFTP server and access Azure virtual networks by using a connection string without an on-premises data gateway. For more information, review the following documentation: <br><br>- [SFTP-SSH managed connector reference](/connectors/sftpwithssh/) <br>- [SFTP built-in connector reference](/azure/logic-apps/connectors/built-in/reference/sftp/) <br><br>- [Managed connectors in Azure Logic Apps](managed.md) <br>- [Built-in connectors in Azure Logic Apps](built-in.md) |

## General limitations

* Before you use the SFTP-SSH managed connector, review the known issues and limitations in the [SFTP-SSH managed connector reference](/connectors/sftpwithssh/).

* Before you use the SFTP built-in connector, review the known issues and limitations in the [SFTP built-in connector reference](/azure/logic-apps/connectors/built-in/reference/sftp/).

<a name="known-issues"></a>

## Known issues

[!INCLUDE [Managed connector trigger "Split On" setting issue](../../includes/connectors-managed-trigger-split-on.md)]

## Chunking

For more information about how the SFTP-SSH managed connector can handle large files exceeding default size limits, see [SFTP-SSH managed connector reference - Chunking](/connectors/sftpwithssh/#chunking).

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Connection and authentication information to access your SFTP server, such as the server address, account credentials, access to an SSH private key, and the SSH private key password. For more information, see [SFTP-SSH managed connector reference - Authentication and permissions](/connectors/sftpwithssh/#authentication-and-permissions).

  > [!IMPORTANT]
  >
  > When you create your connection and enter your SSH private key in the **SSH private key** property, make sure to 
  > [follow the steps for providing the complete and correct value for this property](/connectors/sftpwithssh/#authentication-and-permissions). 
  > Otherwise, a non-valid key causes the connection to fail.

* The logic app workflow where you want to access your SFTP account. To start with an SFTP-SSH trigger, you have to start with a blank workflow. To use an SFTP-SSH action, start your workflow with another trigger, such as the **Recurrence** trigger.

<a name="add-sftp-trigger"></a>

## Add an SFTP trigger

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app with blank workflow in the designer.

1. In the designer, [follow these general steps to add the SFTP-SSH trigger that you want](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=consumption#add-trigger).

1. If prompted, provide the necessary [connection information](/connectors/sftpwithssh/#creating-a-connection). When you're done, select **Create**.

1. After the trigger information box appears, provide the necessary details for your selected trigger. For more information, see  [SFTP-SSH managed connector triggers reference](/connectors/sftpwithssh/#triggers).

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

<a name="built-in-connector-trigger"></a>

#### Built-in connector trigger

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app with blank workflow in the designer.

1. In the designer, [follow these general steps to add the SFTP-SSH built-in trigger that you want](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger).

1. If prompted, provide the necessary [connection information](/azure/logic-apps/connectors/built-in/reference/sftp/#authentication). When you're done, select **Create**.

1. After the trigger information box appears, provide the necessary details for your selected trigger. For more information, see [SFTP built-in connector triggers reference](/azure/logic-apps/connectors/built-in/reference/sftp/#triggers).

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

<a name="managed-connector-trigger"></a>

#### Managed connector trigger

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app with blank workflow in the designer.

1. In the designer, [follow these general steps to add the SFTP-SSH managed trigger that you want](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger).

1. If prompted, provide the necessary [connection information](/connectors/sftpwithssh/#creating-a-connection). When you're done, select **Create**.

1. After the trigger information box appears, provide the necessary details for your selected trigger. For more information, see  [SFTP-SSH managed connector triggers reference](/connectors/sftpwithssh/#triggers).

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

---

When you save your workflow, this step automatically publishes your updates to your deployed logic app, which is live in Azure. With only a trigger, your workflow just checks the FTP server based on your specified schedule. You have to [add an action](#add-sftp-action) that responds to the trigger and does something with the trigger outputs.

For example, the trigger named **When a file is added or modified** starts a workflow when a file is added or changed on an SFTP server. As a subsequent action, you can add a condition that checks whether the file content meets your specified criteria. If the content meets the condition, use the action named **Get file content** to get the file content, and then use another action to put that file content into a different folder on the SFTP server.

<a name="add-sftp-action"></a>

## Add an SFTP action

Before you can use an SFTP action, your workflow must already start with a trigger, which can be any kind that you choose. For example, you can use the generic **Recurrence** built-in trigger to start your workflow on specific schedule.

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app with workflow in the designer.

1. In the designer, [follow these general steps to add the SFTP-SSH action that you want](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=consumption#add-action).

1. If prompted, provide the necessary [connection information](/connectors/sftpwithssh/#creating-a-connection). When you're done, select **Create**.

1. After the action information box appears, provide the necessary details for your selected action. For more information, see [SFTP-SSH managed connector actions reference](/connectors/sftpwithssh/#actions).

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

<a name="built-in-connector-action"></a>

#### Built-in connector action

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app with workflow in the designer.

1. In the designer, [follow these general steps to add the SFTP-SSH built-in action that you want](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

1. If prompted, provide the necessary [connection information](/connectors/sftpwithssh/#creating-a-connection). When you're done, select **Create**.

1. After the action information box appears, provide the necessary details for your selected action. For more information, see [SFTP built-in connector actions reference](/azure/logic-apps/connectors/built-in/reference/sftp/#actions).

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

<a name="managed-connector-action"></a>

#### Managed connector action

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app with workflow in the designer.

1. In the designer, [follow these general steps to add the SFTP-SSH managed action that you want](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

1. If prompted, provide the necessary [connection information](/connectors/sftpwithssh/#creating-a-connection). When you're done, select **Create**.

1. After the action information box appears, provide the necessary details for your selected action. For more information, see [SFTP-SSH managed connector actions reference](/connectors/sftpwithssh/#actions).

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

---

For example, the action named **Get file content using path** gets the content from a file on an SFTP server by specifying the file path. You can use the trigger from the previous example and a condition that the file content must meet. If the condition is true, a subsequent action can get the content.

---

## Troubleshooting

For more information, see the following documentation: 

- [SFTP-SSH managed connector reference - Troubleshooting](/connectors/sftpwithssh/#troubleshooting)
- [SFTP built-in connector reference - Troubleshooting](/azure/logic-apps/connectors/built-in/reference/sftp#troubleshooting)

## Next steps

* [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
* [Built-in connectors for Azure Logic Apps](../connectors/built-in.md)
