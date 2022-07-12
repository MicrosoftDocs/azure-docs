---
title: Connect to FTP servers
description: Connect to an FTP server from workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 07/11/2022
tags: connectors
---

# Connect to an FTP server from workflows in Azure Logic Apps

This article shows how to access your FTP server from a workflow in Azure Logic Apps with the FTP connector. You can then create automated workflows that run when triggered by events in your FTP server or in other systems and run actions to manage your FTP server data, content, and resources.

For example, your workflow can start with an FTP trigger that monitors and responds to events on your FTP server. The trigger makes the outputs available to subsequent actions in your workflow. Your workflow can run FTP actions that create, send, receive, and manage files through your FTP server account using the following specific tasks:

* Monitor when files are added or changed.
* Get, create, copy, update, list, and delete files.
* Get file content and metadata.
* Extract archives to folders.

If you're new to Azure Logic Apps, review the following get started documentation:

* [What is Azure Logic Apps](../logic-apps/logic-apps-overview.md)
* [Quickstart: Create your first logic app workflow](../logic-apps/quickstart-create-first-logic-app-workflow.md)

## Connector technical reference

The FTP connector has different versions, based on [logic app type and host environment](../logic-apps/logic-apps-overview.md#resource-environment-differences).

| Logic app | Environment | Connector version |
|-----------|-------------|-------------------|
| **Consumption** | Multi-tenant Azure Logic Apps | Managed connector (Standard class). For more information, review the following documentation: <br><br>- [FTP managed connector reference](/connectors/ftp) <br>- [Managed connectors in Azure Logic Apps](managed.md) |
| **Consumption** | Integration service environment (ISE) | Managed connector (Standard class) and ISE version, which has different message limits than the Standard class. For more information, review the following documentation: <br><br>- [FTP managed connector reference](/connectors/ftp) <br>- [ISE message limits](../logic-apps/logic-apps-limits-and-config.md#message-size-limits) <br>- [Managed connectors in Azure Logic Apps](managed.md) |
| **Standard** | Single-tenant Azure Logic Apps and App Service Environment v3 (Windows plans only) | Managed connector (Standard class) and built-in connector, which is [service provider based](../logic-apps/custom-connector-overview.md#service-provider-interface-implementation). The built-in connector can directly access Azure virtual networks with a connection string and doesn't need the on-premises data gateway. For more information, review the following documentation: <br><br>- [FTP managed connector reference](/connectors/ftp) <br>- [FTP built-in connector operations](#built-in-operations) section later in this article <br>- [Managed connectors in Azure Logic Apps](managed.md) <br>- [Built-in connectors in Azure Logic Apps](built-in.md) |
||||

## Limitations

* Capacity and throughput

  * Built-in connector for Standard workflows:

    By default, FTP actions can read or write files that are *200 MB or smaller*. Currently, the FTP built-in connector doesn't support chunking.

  * Managed connector for Consumption and Standard workflows

    By default, FTP actions can read or write files that are *50 MB or smaller*. To handle files larger than 50 MB, FTP actions support [message chunking](../logic-apps/logic-apps-handle-large-messages.md). The **Get file content** action implicitly uses chunking.

* If you have an on-premises FTP server, consider the following options:

  * Consumption workflows: Create a [Standard logic app workflow](../logic-apps/single-tenant-overview-compare.md) instead, or use [Azure App Service Hybrid connections](../app-service/app-service-hybrid-connections.md), which both let you access on-premises data sources without an on-premises data gateway.

  * Standard workflows: Use the FTP built-in connector operations, which work without an on-premises data gateway.

* For more limitations that apply to both the FTP managed connector and built-in connector, review the [FTP managed connector reference - Limitations](/connectors/ftp/#limitations).

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* The logic app workflow where you want to access your FTP account. To start your workflow with an FTP trigger, you have to start with a blank workflow. To use an FTP action, start your workflow with another trigger, such as the **Recurrence** trigger.

* For more requirements that apply to both the FTP managed connector and built-in connector, review the [FTP managed connector reference - Requirements](/connectors/ftp/#requirements).

<a name="known-issues"></a>

## Known issues

By default, triggers that return an array have a **Split On** setting that's already enabled. With this setting enabled, the trigger automatically *debatches* the array by internally creating a separate workflow instance to process each array item. All the workflow instances run in parallel so that the array items are processed at the same time.

However, when the **Split On** setting is enabled, *managed* connector triggers return the outputs for all the array items as lists. Any subsequent actions that reference these outputs have to first handle these outputs as lists. To handle each array item individually, you can add extra actions. For example, to iterate through these array items, you can use a **For each** loop. For triggers that return only metadata or properties, use an action that gets the array item's metadata first, and then use an action to get the items contents.

You have to apply this approach only for *managed* connector triggers, not built-in connector triggers that return outputs for one array item at a time when the **Split On** setting is enabled.

For example, suppose you have managed connector trigger named **When a file is added or modified (properties only)** that returns the metadata or properties for the new or updated files as arrays. To get the metadata separately for each file, you might use a **For each** loop to process the array, the **Get file metadata** action to get each file's metadata, and then the **Get file content** action to get each file's content.

<a name="add-ftp-trigger"></a>

## Add an FTP trigger

A Consumption logic app workflow has only the FTP managed connector. However, a Standard logic app workflow can use the FTP managed connector *and* the FTP built-in connector. The FTP managed connector and built-in connector each have only one trigger available:

* Managed connector trigger: The FTP trigger named **When a file is added or modified (properties only)** starts a Consumption or Standard logic app workflow when one or more files are added or changed in a folder on the FTP server. This trigger gets only the file properties or metadata, not the file content. However, to get the content, your workflow can follow this trigger with other FTP actions to get the file content. 

  For more information about this trigger, review [When a file is added or modified (properties only)](/connectors/ftp/#when-a-file-is-added-or-modified-(properties-only)).

* Built-in connector trigger: The FTP trigger named **When a file is added or updated** starts a Standard logic app workflow when one or more files are added or changed in a folder on the FTP server. This trigger gets only the file properties or metadata, not the file content. However, to get the content, your workflow can follow this trigger with other FTP actions to get the file content. For more information about this trigger, review [When a file is added or updated](#when-file-added-updated).

The following steps use the Azure portal, but with the appropriate Azure Logic Apps extension, you can also use the following tools to create logic app workflows:

* Consumption logic app workflows: [Visual Studio](../logic-apps/quickstart-create-logic-apps-with-visual-studio.md) or [Visual Studio Code](../logic-apps/quickstart-create-logic-apps-visual-studio-code.md)

* Standard logic app workflows: [Visual Studio Code](../logic-apps/create-single-tenant-workflows-visual-studio-code.md)

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), and open your blank logic app workflow in the designer.

1. Find and select the [FTP trigger](/connectors/ftp/) that you want to use.

   1. On the designer, under the search box, select **All**.

   1. In the search box, enter **ftp**.

   1. From the triggers list, select the trigger that you want.

      This example continues with the trigger named **When a filed is added or modified (properties only)**.

      ![Screenshot shows Azure portal, Consumption workflow designer, and FTP trigger selected.](./media/connectors-create-api-ftp/ftp-select-trigger-consumption.png)

1. Provide the [information for your connection](/connectors/ftp/#creating-a-connection). When you're done, select **Create**.

   > [!NOTE]
   >
   > By default, this connector transfers files in text format. To transfer files in binary format, 
   > for example, where and when encoding is used, select the binary transport option.

   ![Screenshot shows Consumption workflow designer and FTP connection profile.](./media/connectors-create-api-ftp/ftp-trigger-connection-consumption.png)

1. After the trigger information box appears, in the **Folder** box, select the folder icon so that a list appears. 

   To find the folder you want to monitor for new or edited files, select the right angle arrow (**>**), browse to that folder, and then select the folder.

   ![Screenshot shows Consumption workflow designer, FTP trigger, and "Folder" property where browsing for folder to select.](./media/connectors-create-api-ftp/ftp-trigger-select-folder-consumption.png)

   Your selected folder appears in the **Folder** box.

   ![Screenshot shows Consumption workflow designer, FTP trigger, and "Folder" property with selected folder.](./media/connectors-create-api-ftp/ftp-trigger-selected-folder-consumption.png)

1. When you're done, save your workflow.

### [Standard](#tab/standard)

This section shows the steps for the FTP built-in connector trigger named **When a file is added or updated** and the FTP managed connector trigger named **When a file is added or modified (properties only)**.

* If you use the FTP managed trigger **When a file is added or modified (properties only)**, you have to later use the **Get file metadata** action first to get a single array item before you use any other action on the file that was added or modified. This workaround results from the [known issue around the **Split On** setting](#known-issues) described earlier in this article.

* If you use the FTP built-in trigger named **When a file is added or updated**, you can subsequently get the file content by using the FTP built-in action named **Get file content** without using the **Get file metadata** action first, unlike if you use the FTP managed trigger. For more information about FTP built-in connector operations, review [FTP built-in connector operations](#ftp-built-in-connector-operations) later in this article.

<a name="built-in-connector-trigger"></a>

#### Built-in connector trigger

1. In the [Azure portal](https://portal.azure.com), and open your blank logic app workflow in the designer.

1. On the designer, select **Choose an operation**. In the search box, enter **ftp**. Under the search box, select **Built-in**. From the triggers list, select the trigger named **When a filed is added or updated**.

   ![Screenshot shows the Azure portal, Standard workflow designer, search box with "Built-in" selected underneath, and FTP trigger selected.](./media/connectors-create-api-ftp/ftp-select-trigger-built-in-standard.png)

1. Provide the information for your connection. When you're done, select **Create**.

   > [!NOTE]
   >
   > By default, this connector transfers files in text format. To transfer files in binary format, 
   > for example, where and when encoding is used, select the binary transport option.

   ![Screenshot shows Standard workflow designer, FTP built-in trigger, and connection profile.](./media/connectors-create-api-ftp/ftp-trigger-connection-built-in-standard.png)

1. After the trigger information box appears, in the **Folder** box, select the folder icon so that a list appears. To find the folder you want to monitor for new or edited files, select the right angle arrow (**>**), browse to that folder, and then select the folder.

   ![Screenshot shows Standard workflow designer, FTP built-in trigger, and "Folder" property where browsing for folder to select.](./media/connectors-create-api-ftp/ftp-trigger-built-in-select-folder-standard.png)

   Your selected folder appears in the **Folder** box.

   ![Screenshot shows Standard workflow designer, FTP built-in trigger, and "Folder" property with selected folder.](./media/connectors-create-api-ftp/ftp-trigger-built-in-selected-folder-standard.png)

1. When you're done, save your logic app workflow.

<a name="managed-connector-trigger"></a>

#### Managed connector trigger

1. In the [Azure portal](https://portal.azure.com), and open your blank logic app workflow in the designer.

1. On the designer, select **Choose an operation**. In the search box, enter **ftp**. Under the search box, select **Azure**. From the triggers list, select the trigger named **When a filed is added or modified (properties only)**.

   ![Screenshot shows the Azure portal, Standard workflow designer, search box with "Azure" selected underneath, and FTP trigger selected.](./media/connectors-create-api-ftp/ftp-select-trigger-azure-standard.png)

1. Provide the [information for your connection](/connectors/ftp/#creating-a-connection). When you're done, select **Create**.

   > [!NOTE]
   >
   > By default, this connector transfers files in text format. To transfer files in binary format, 
   > for example, where and when encoding is used, select the binary transport option.

   ![Screenshot shows Standard workflow designer, FTP managed connector trigger, and connection profile.](./media/connectors-create-api-ftp/ftp-trigger-connection-azure-standard.png)

1. After the trigger information box appears, in the **Folder** box, select the folder icon so that a list appears. To find the folder you want to monitor for new or edited files, select the right angle arrow (**>**), browse to that folder, and then select the folder.

   ![Screenshot shows Standard workflow designer, FTP managed connector trigger, and "Folder" property where browsing for folder to select.](./media/connectors-create-api-ftp/ftp-trigger-azure-select-folder-standard.png)

   Your selected folder appears in the **Folder** box.

   ![Screenshot shows Standard workflow designer, FTP managed connector trigger, and "Folder" property with selected folder.](./media/connectors-create-api-ftp/ftp-trigger-azure-selected-folder-standard.png)

1. When you're done, save your logic app workflow.

---

When you save your workflow, this step automatically publishes your updates to your deployed logic app, which is live in Azure. With only a trigger, your workflow just checks the FTP server based on your specified schedule. You have to [add an action](#add-ftp-action) that responds to the trigger. For this example, you can add an FTP action that gets the new or updated file's metadata, and then use those return values to get the new or updated content.

<a name="add-ftp-action"></a>

## Add an FTP action

A Consumption logic app workflow can use only the FTP managed connector. However, a Standard logic app workflow can use the FTP managed connector and the FTP built-in connector. Each version has multiple actions. For example, both managed and built-in connector versions have their own actions to get file metadata and get file content.

* Managed connector actions: These actions run in a Consumption or Standard logic app workflow.

* Built-in connector actions: These actions run only in a Standard logic app workflow.

To show how to add an FTP action, the following steps use the Azure portal, but with the appropriate Azure Logic Apps extension, you can also use the following tools to create logic app workflows:

* Consumption logic app workflows: [Visual Studio](../logic-apps/quickstart-create-logic-apps-with-visual-studio.md) or [Visual Studio Code](../logic-apps/quickstart-create-logic-apps-visual-studio-code.md)

* Standard logic app workflows: [Visual Studio Code](../logic-apps/create-single-tenant-workflows-visual-studio-code.md)

Before you can use an FTP action, your workflow must already start with a trigger, which can be any kind that you choose. For example, you can use the generic **Recurrence** built-in trigger to start your workflow on specific schedule.

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), and open your logic app workflow in the designer.

1. Find and select the [FTP action](/connectors/ftp/) that you want to use.

   This example continues with the action named **Get file metadata** so you can get the metadata for a single array item.

   1. On the designer, under the trigger or any other actions, select **New step**.

   1. Under the **Choose an operation** search box, select **All**.

   1. In the search box, enter **ftp get file metadata**.

   1. From the actions list, select the action named **Get file metadata**.

   ![Screenshot shows the Azure portal, Consumption workflow designer, search box with "ftp get file metadata" entered, and "Get file metadata" action selected.](./media/connectors-create-api-ftp/ftp-get-file-metadata-action-consumption.png)

1. If necessary, provide the [information for your connection](/connectors/ftp/#creating-a-connection). When you're done, select **Create**.

   > [!NOTE]
   >
   > By default, this connector transfers files in text format. To transfer files in binary format, 
   > for example, where and when encoding is used, select the binary transport option.

   ![Screenshot shows Consumption workflow designer and FTP connection profile for an action.](./media/connectors-create-api-ftp/ftp-action-connection-consumption.png)

1. After the **Get file metadata** action information box appears, complete the following steps:

   1. Click in the **File** box so that the dynamic content list appears.
   
      You can now select outputs from the preceding trigger.

   1. From the dynamic content list, under **When a file is added or modified**, select **List of Files Id**.

      ![Screenshot shows Consumption workflow designer, "Get file metadata" action, dynamic content list opened, and "List of Files Id" selected.](./media/connectors-create-api-ftp/ftp-get-file-metadata-list-files-id-output-consumption.png)

1. In the designer, under the **Get file metadata** action, select **New step**.

1. Find and select the action named **Get file content**.

   1. On the designer, under the **Choose an operation** search box, select **All**.

   1. In the search box, enter **ftp get file content**.

   1. From the actions list, select the action named **Get file content**.

   ![Screenshot shows the Azure portal, Consumption workflow designer, search box with "ftp get file content" entered, and "Get file content" action selected.](./media/connectors-create-api-ftp/ftp-get-file-content-action-consumption.png)

1. After the **Get file content** action information box appears, complete the following steps:

   1. Click in the **File** box so that the dynamic content list appears.
   
      You can now select outputs from the preceding trigger and any other actions.

   1. From the dynamic content list, under **Get file metadata**, select **Id**, which references the file that was added or updated.

      ![Screenshot shows Consumption workflow designer, "Get file content" action, and "File" property with dynamic content list opened and "Id" property selected.](./media/connectors-create-api-ftp/ftp-get-file-content-id-output-consumption.png)

      The **Id** property now appears in the **File** box.

      ![Screenshot shows Consumption workflow designer, "Get file content" action, and "File" property with "Id" entered.](./media/connectors-create-api-ftp/ftp-get-file-content-id-entered-consumption.png)

1. When you're done, save your logic app workflow.

### [Standard](#tab/standard)

The steps to add and use an FTP action differ based on whether you used a managed connector trigger or a built-in connector trigger to start your workflow.

* [**Workflows with a built-in trigger**](#built-in-trigger-workflows): Describes the steps for workflows that start with a built-in trigger.

  If you use the FTP built-in trigger named **When a file is added or updated** and the FTP built-in action named **Get file content**. For more information about FTP built-in connector operations, review [FTP built-in connector operations](#ftp-built-in-connector-operations) later in this article.

  If you use the FTP built-in trigger in your workflow, you only need to use the **Get file content** action.

* [**Workflows with a managed trigger**](#managed-trigger-workflows): Describes the steps for workflows that start with a managed trigger. Due to the **Split On** setting's current behavior, 

However, if you use the FTP managed connector trigger in your workflow, and you want to get the content from a newly added or modified file, you have to use the FTP action named **Get file metadata** followed by **Get file content**.

  This example uses the FTP managed trigger named **When a file is added or modified (properties only)** and the FTP managed actions named **Get file metadata** and **Get file content**. For more information about FTP managed connector operations, review [FTP managed connector operations](/connectors/create-api-ftp).

  This 

   

For example, if you used the FTP managed connector trigger in your workflow, and you want to get the content from a newly added or modified file, you have to use the FTP action named **Get file metadata** followed by **Get file content**. However, if you used the FTP built-in trigger, you only need to use the **Get file content** action.

<a name="built-in-trigger-workflows"></a>

#### Workflows with a built-in trigger

1. In the [Azure portal](https://portal.azure.com), and open your logic app workflow in the designer.

1. On the designer, under the trigger or any other actions, select the plus sign (**+**) > **Add an action**.

1. On the **Add an action** pane, under the **Choose an operation** search box, select **Built-in**.

1. In the search box, enter **ftp get file content**. From the actions list, select **Get file content**.

   ![Screenshot shows Azure portal, Standard workflow designer, search box with "Built-in" selected underneath, and "Get file content" selected.](./media/connectors-create-api-ftp/ftp-action-get-file-content-built-in-standard.png)

1. If necessary, provide the information for your connection. When you're done, select **Create**.

   > [!NOTE]
   >
   > By default, this connector transfers files in text format. To transfer files in binary format, 
   > for example, where and when encoding is used, select the binary transport option.

   ![Screenshot shows Standard workflow designer, FTP built-in action, and connection profile.](./media/connectors-create-api-ftp/ftp-action-connection-built-in-standard.png)

1. In the action information pane that appears, click inside the **File path** box so that the dynamic content list appears.

   You can now select outputs from the preceding trigger.

1. From the dynamic content list, under **When a file is added or updated**, select **File path**.

   ![Screenshot shows Standard workflow designer, "Get file content" action, dynamic content list opened, and "File path" selected.](./media/connectors-create-api-ftp/ftp-action-get-file-content-file-path-built-in-standard.png)

   The action's **File path** property now references the **File path** trigger output.

   ![Screenshot shows Standard workflow designer and "Get file content" action complete.](./media/connectors-create-api-ftp/ftp-action-get-file-content-complete-built-in-standard.png)

1. Add any other actions that your workflow needs. When you're done, save your logic app workflow.

<a name="managed-trigger-workflows"></a>

#### Workflows with a managed trigger

1. In the [Azure portal](https://portal.azure.com), and open your logic app workflow in the designer.

1. On the designer, under the trigger or any other actions, select the plus sign (**+**) > **Add an action**.

   The **Choose an operation** box appears with the **Add an action** pane on the right side.

1. In the **Choose an operation** search box, enter **ftp get file metadata**. Under the search box, select **Azure**. From the actions list, select the **Get file metadata** action.

   ![Screenshot shows Azure portal, Standard workflow designer, search box with "Azure" selected underneath, and "Get file metadata" action selected.](./media/connectors-create-api-ftp/ftp-action-get-file-metadata-azure-standard.png)

1. If necessary, provide the [information for your connection](/connectors/ftp/#creating-a-connection). When you're done, select **Create**.

   > [!NOTE]
   >
   > By default, this connector transfers files in text format. To transfer files in binary format, 
   > for example, where and when encoding is used, select the binary transport option.

   ![Screenshot shows Standard workflow designer, FTP managed connector action, and connection profile.](./media/connectors-create-api-ftp/ftp-action-connection-azure-standard.png)

1. In the action information pane that appears, click inside the **File** box so that the dynamic content list appears.

   You can now select outputs from the preceding trigger.

1. From the dynamic content list, under **When a file is added or modified (properties only)**, select **List of Files Id**.

   ![Screenshot shows Standard workflow designer, "Get file metadata" action, dynamic content list opened, and "List of Files Id" selected.](./media/connectors-create-api-ftp/ftp-get-file-metadata-list-files-azure-standard.png)

   The action's **File** property now references the **List of Files Id** trigger output.

   ![Screenshot shows Standard workflow designer, "Get file metadata" action, and "File" property set to "List of Files Id" trigger output.](./media/connectors-create-api-ftp/ftp-get-file-metadata-complete-azure-standard.png)

1. In the designer, under the **Get file metadata** action, select the plus sign (**+**) > **Add an action**. 

1. In the **Choose an operation** search box, enter **ftp get file content**. Under the search box, select **Azure**. From the actions list, select the **Get file content** action.

   ![Screenshot shows Standard workflow designer, "Get file content" action, and "File" property set to "Id" trigger output.](./media/connectors-create-api-ftp/ftp-get-file-content-azure-standard.png)

1. In the action information pane that appears, click inside the **File** box so that the dynamic content list appears.

   You can now select outputs from the preceding trigger or actions.

1. From the dynamic content list, under **Get file metadata**, select **Id**.

   ![Screenshot shows Standard workflow designer, "Get file content" action, dynamic content list opened, and "Id" selected.](./media/connectors-create-api-ftp/ftp-get-file-content-file-id-azure-standard.png)

   The action's **File** property now references the **Id** action output.

   ![Screenshot shows Standard workflow designer, "Get file content" action, and "File" property set to "Id" action output.](./media/connectors-create-api-ftp/ftp-get-file-content-complete-azure-standard.png)

1. Add any other actions that your workflow needs. When you're done, save your logic app workflow.

---

## Test your workflow

To check that your workflow returns the content that you expect, add another action that sends you the content from the uploaded or updated file.

1. Under the **Get file content** action, add an action that can send you the file's contents. This example adds the **Send an email** action for the Office 365 Outlook.

   ![Add an action for sending email](./media/connectors-create-api-ftp/select-send-email-action.png)

1. After the action appears, provide the information and include the properties that you want to test. For example, include the **File content** property, which appears in the dynamic content list after you select **See more** in the **Get file content** section.

   ![Provide information about email action](./media/connectors-create-api-ftp/selected-send-email-action.png)

1. Save your logic app. To run and trigger the logic app, on the toolbar, select **Run**, and then add a file to the FTP folder that your logic app now monitors.

<a name="built-in-operations"></a>

## FTP built-in connector operations

The FTP built-in connector is available only for Standard logic app workflows and provides the following operations:

| Trigger | Description |
|---------|-------------|
| [**When a file is added or updated**](#when-file-added-updated) | Start a logic app workflow when a file is added or updated in the specified folder on the FTP server. <p><p>**Note**: This trigger gets only the file metadata or properties, not the file content. However, to get the content, your workflow can follow this trigger with the [**Get file content**](#get-file-content) action. |
|||

| Action | Description |
|--------|-------------|
| [**Create file**](#create-file) | Create a file using the specified file path and file content. |
| [**Delete file**](#delete-file) | Delete a file using the specified file path. |
| [**Get file content**](#get-file-content) | Get the content of a file using the specified file path. |
| [**Get file metadata**](#get-file-metadata) | Get the metadata or properties of a file using the specified file path. |
| [**List files and subfolders in a folder**](#list-files-subfolders-folder) | Get a list of files and subfolders in the specified folder. |
| [**Update file**](#update-file) | Update a file using the specified file path and file content. |
|||

<a name="when-file-added-updated"></a>

### When a file is added or updated

Operation ID: `whenFtpFilesAreAddedOrModified`

This trigger starts a logic app workflow run when a file is added or updated in the specified folder on the FTP server. The trigger gets only the file metadata or properties, not any file content. However, to get the content, your workflow can follow this trigger with the [**Get file content**](#get-file-content) action.

#### Parameters

| Name | Key | Required | Type | Description |
|------|-----|----------|------|-------------|
| **Folder path** | `folderPath` | True | String | The folder path, relative to the root directory. |
| **Number of files to return** | `maxFileCount` | False | Integer | The maximum number of files to return from a single trigger run. Valid values range from 1 - 100. <br><br>**Note**: Enabled by default, the **Split On** setting forces this trigger to process each file individually. |
| **Cutoff timestamp to ignore older files** | `oldFileCutOffTimestamp` | False | DateTime | The cutoff time to use for ignoring older files. Use the timestamp format `YYYY-MM-DDTHH:MM:SS`. To disable this feature, leave this property empty. |
||||||

#### Returns

When the trigger's **Split On** setting is enabled, the trigger returns the metadata or properties for one file at a time. Otherwise, the trigger returns a list with each file's metadata.

| Name | Type |
|------|------|
| **List of files** | [BlobMetadata](/connectors/ftp/#blobmetadata) |
|||

<a name="create-file"></a>

### Create file

Operation ID: `createFile`

This action creates a file using the specified file path and file content.

> [!IMPORTANT]
>
> If the file is deleted or renamed on the FTP server immediately after creation, 
> the operation might return an HTTP **404** error by design. To avoid this problem, 
> include a 1-minute delay before you delete or rename any newly created files. You can 
> use the [**Delay** action](connectors-native-delay.md) to add this delay to your workflow.

#### Parameters

| Name | Key | Required | Type | Description |
|------|-----|----------|------|-------------|
| **File path** | `filePath` | True | String | The file path, including the file name extension if any, relative to the root directory. |
| **File content** | `fileContent` | True | string | The content for the file |
||||||

#### Returns

This action returns a [BlobMetadata](/connectors/ftp/#blobmetadata) object named **Body**.

| Name | Type |
|------|------|
| **Body** | [BlobMetadata](/connectors/ftp/#blobmetadata) |
|||

<a name="delete-file"></a>

### Delete file

Operation ID: `deleteFtpFile`

This action deletes a file using the specified file path.

#### Parameters

| Name | Key | Required | Type | Description |
|------|-----|----------|------|-------------|
| **File path** | `filePath` | True | String | The file path, including the file name extension if any, relative to the root directory. |
||||||

#### Returns

None

<a name="get-file-content"></a>

### Get file content

Operation ID: `getFtpFileContent`

This action gets the content of a file using the specified file path.

#### Parameters

| Name | Key | Required | Type | Description |
|------|-----|----------|------|-------------|
| **File path** | `path` | True | String | The file path, including the file name extension if any, relative to the root directory. |
||||||

#### Returns

This action returns the content of a file as a binary value named **File content**.

| Name | Type |
|------|------|
| **File content** | Binary |
|||

<a name="get-file-metadata"></a>

### Get file metadata

Operation ID: `getFileMetadata`

This action gets the metadata or properties of a file using the specified file path.

#### Parameters

| Name | Key | Required | Type | Description |
|------|-----|----------|------|-------------|
| **File path** | `path` | True | String | The file path, including the file name extension if any, relative to the root directory. |
||||||

#### Returns

This action returns a [BlobMetadata](/connectors/ftp/#blobmetadata) object named **Body**.

| Name | Type |
|------|------|
| **Body** | [BlobMetadata](/connectors/ftp/#blobmetadata) |
|||

<a name="list-files-subfolders-folder"></a>

### List the files and subfolders in a folder

Operation ID: `listFilesInFolder`

This action gets a list of files and subfolders in the specified folder.

#### Parameters

| Name | Key | Required | Type | Description |
|------|-----|----------|------|-------------|
| **Folder path** | `folderPath` | True | The folder path, relative to the root directory. |
| **File content** | `fileContent` | True | string | The content for the file |
||||||

#### Returns

This action returns an array that's named **Response** and contains [BlobMetadata](/connectors/ftp/#blobmetadata) objects.

| Name | Type |
|------|------|
| **Response** | Array with [BlobMetadata](/connectors/ftp/#blobmetadata) objects |
|||

<a name="update-file"></a>

### Update file

Operation ID: `updateFile`

This action updates a file using the specified file path and file content.

> [!IMPORTANT]
>
> If the file is deleted or renamed on the FTP server immediately after an update, 
> the operation might return an HTTP **404** error by design. To avoid this problem, 
> include a 1-minute delay before you delete or rename any updated files. You can use 
> the [**Delay** action](connectors-native-delay.md) to add this delay to your workflow.

#### Parameters

| Name | Key | Required | Type | Description |
|------|-----|----------|------|-------------|
| **File path** | `filePath` | True | The file path, including the file name extension if any, relative to the root directory. |
| **File content** | `fileContent` | True | string | The content for the file |
||||||

#### Returns

This action returns a [BlobMetadata](/connectors/ftp/#blobmetadata) object named **Body**.

| Name | Type |
|------|------|
| **Body** | [BlobMetadata](/connectors/ftp/#blobmetadata) |
|||

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)