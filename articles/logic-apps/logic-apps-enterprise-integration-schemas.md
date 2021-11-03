---
title: Add schemas to validate XML in workflows
description: Add schemas to validate XML documents in workflows with Azure Logic Apps and the Enterprise Integration Pack.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 09/14/2021
---

# Add schemas to validate XML in workflows with Azure Logic Apps

To check that documents use valid XML and have the expected data in the predefined format, your logic app workflow can use XML schemas with the **XML Validation** action. An XML schema describes a business document that's represented in XML using the [XML Schema Definition (XSD)](https://www.w3.org/TR/xmlschema11-1/).

If you're new to logic apps, review [What is Azure Logic Apps](logic-apps-overview.md)? For more information about B2B enterprise integration, review [B2B enterprise integration workflows with Azure Logic Apps and Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md).

## Prerequisites

* An Azure account and subscription. If you don't have a subscription yet, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* To create schemas, you can use the following tools:

  * Visual Studio 2019 and the [Microsoft Azure Logic Apps Enterprise Integration Tools Extension](https://aka.ms/vsenterpriseintegrationtools).

  * Visual Studio 2015 and the [Microsoft Azure Logic Apps Enterprise Integration Tools for Visual Studio 2015 2.0](https://aka.ms/vsmapsandschemas) extension.

   > [!IMPORTANT]
   > Don't install the extension alongside the BizTalk Server extension. Having both extensions might 
   > produce unexpected behavior. Make sure that you only have one of these extensions installed.

   > [!NOTE]
   > On high resolution monitors, you might experience a [display problem with the map designer](/visualstudio/designers/disable-dpi-awareness) 
   > in Visual Studio. To resolve this display problem, either [restart Visual Studio in DPI-unaware mode](/visualstudio/designers/disable-dpi-awareness#restart-visual-studio-as-a-dpi-unaware-process), 
   > or add the [DPIUNAWARE registry value](/visualstudio/designers/disable-dpi-awareness#add-a-registry-entry).

* An [integration account resource](logic-apps-enterprise-integration-create-integration-account.md) where you define and store artifacts, such as trading partners, agreements, certificates, and so on, for use in your enterprise integration and B2B workflows. This resource has to meet the following requirements:

  * Is associated with the same Azure subscription as your logic app resource.

  * Exists in the same location or Azure region as your logic app resource where you plan to use the **XML Validation** action.

  * If you use the [**Logic App (Consumption)** resource type](logic-apps-overview.md#resource-type-and-host-environment-differences), you have to [link your integration account to your logic app resource](logic-apps-enterprise-integration-create-integration-account.md#link-account) before you can use your artifacts in your workflow.

    To create and add schemas for use in **Logic App (Consumption)** workflows, you don't need a logic app resource yet. However, when you're ready to use those schemas in your workflows, your logic app resource requires a linked integration account that stores those schemas.

  * If you use the [**Logic App (Standard)** resource type](logic-apps-overview.md#resource-type-and-host-environment-differences), you need an existing logic app resource because you don't store schemas in your integration account. Instead, you can directly add schemas to your logic app resource using either the Azure portal or Visual Studio Code. You can then use these schemas across multiple workflows within the *same logic app resource*.

    You still need an integration account to store other artifacts, such as partners, agreements, and certificates, along with using the [AS2](logic-apps-enterprise-integration-as2.md), [X12](logic-apps-enterprise-integration-x12.md), and [EDIFACT](logic-apps-enterprise-integration-edifact.md) operations. However, you don't need to link your logic app resource to your integration account, so the linking capability doesn't exist. Your integration account still has to meet other requirements, such as using the same Azure subscription and existing in the same location as your logic app resource.

    > [!NOTE]
    > Currently, only the **Logic App (Consumption)** resource type supports [RosettaNet](logic-apps-enterprise-integration-rosettanet.md) operations. 
    > The **Logic App (Standard)** resource type doesn't include [RosettaNet](logic-apps-enterprise-integration-rosettanet.md) operations.

* If your schema is [2 MB or smaller](#smaller-schema), you can add your schema to your integration account *directly* from the Azure portal. However, if your schema is bigger than 2 MB but not bigger than the [size limit for schemas](logic-apps-limits-and-config.md#artifact-capacity-limits), you can upload your schema to an Azure storage account. To add that schema to your integration account, you can then link to your storage account from your integration account. For this task, here are the items you need:

    | Item | Description |
    |------|-------------|
    | [Azure storage account](../storage/common/storage-account-overview.md) | In this account, create an Azure blob container for your schema. Learn [how to create a storage account](../storage/common/storage-account-create.md). |
    | Blob container | In this container, you can upload your schema. You also need this container's content URI later when you add the schema to your integration account. Learn how to [create a blob container](../storage/blobs/storage-quickstart-blobs-portal.md). |
    | [Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md) | This tool helps you more easily manage storage accounts and blob containers. To use Storage Explorer, choose a step: <p>- In the Azure portal, select your storage account. From your storage account menu, select **Storage Explorer**. <p>- For the desktop version, [download and install Azure Storage Explorer](https://www.storageexplorer.com/). Then, connect Storage Explorer to your storage account by following the steps in [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md). To learn more, see [Quickstart: Create a blob in object storage with Azure Storage Explorer](../storage/blobs/quickstart-storage-explorer.md).  |
    |||

  To add larger schemas for the **Logic App (Consumption)** resource type, you can also use the [Azure Logic Apps REST API - Schemas](/rest/api/logic/schemas/create-or-update). However, for the **Logic App (Standard)** resource type, the Azure Logic Apps REST API is currently unavailable.

## Limits

* For **Logic App (Standard)**, no limits exist for schema file sizes.

* For **Logic App (Consumption)**, limits exist for integration accounts and artifacts such as schemas. For more information, review [Limits and configuration information for Azure Logic Apps](logic-apps-limits-and-config.md#integration-account-limits).

  Usually, when you're using an integration account with your workflow and you want to validate XML, you add or upload the schema to that account. If you're referencing or importing a schema that's not in your integration account, you might receive the following error when you use the element `xsd:redefine`:

  `An error occurred while processing the XML schemas: ''SchemaLocation' must successfully resolve if <redefine> contains any child other than <annotation>.'.`

  To resolve this error, you need to use the element `xsd:import` or `xsd:include` instead of `xsd:redefine`, or use a URI.

<a name="add-schema"></a>

## Add schemas

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), sign in with your Azure account credentials.

1. In the main Azure search box, enter `integration accounts`, and select **Integration accounts**.

1. Select the integration account where you want to add your schema.

1. On your integration account's menu, under **Settings**, select **Schemas**.

1. On the **Schemas** pane toolbar, select **Add**.

Based on your schema (.xsd) file's size, follow the steps for uploading a schema that's either [up to 2 MB](#smaller-schema) or [more than 2 MB, up to 8 MB](#larger-schema).

<a name="smaller-schema"></a>

### Add schemas up to 2 MB

1. On the **Add Schema** pane, enter a name for your schema. Keep **Small file** selected. Next to the **Schema** box, select the folder icon. Find and select the schema you're uploading.

1. When you're done, select **OK**.

   After your schema finishes uploading, the schema appears in the **Schemas** list.

<a name="larger-schema"></a>

### Add schemas more than 2 MB

To add larger schemas, you can upload your schema to an Azure blob container in your Azure storage account. Your steps for adding schemas differ based whether your blob container has public read access. So first, check whether or not your blob container has public read access by following these steps: [Set public access level for blob container](../vs-azure-tools-storage-explorer-blobs.md#set-the-public-access-level-for-a-blob-container)

#### Check container access level

1. Open Azure Storage Explorer. In the Explorer window, expand your Azure subscription if not already expanded.

1. Expand **Storage Accounts** > {*your-storage-account*} > **Blob Containers**. Select your blob container.

1. From your blob container's shortcut menu, select **Set Public Access Level**.

   * If your blob container has at least public access, select **Cancel**, and follow these steps later on this page: [Upload to containers with public access](#public-access)

     ![Public access](media/logic-apps-enterprise-integration-schemas/azure-blob-container-public-access.png)

   * If your blob container doesn't have public access, select **Cancel**, and follow these steps later on this page: [Upload to containers without public access](#public-access)

     ![No public access](media/logic-apps-enterprise-integration-schemas/azure-blob-container-no-public-access.png)

<a name="public-access"></a>

#### Upload to containers with public access

1. Upload the schema to your storage account. In the right-hand window, select **Upload**.

1. After you finish uploading, select your uploaded schema. On the toolbar, select **Copy URL** so that you copy the schema's URL.

1. Return to the Azure portal where the **Add Schema** pane is open. Enter a name for your assembly. Select **Large file (larger than 2 MB)**.

   The **Content URI** box now appears, rather than the **Schema** box.

1. In the **Content URI** box, paste your schema's URL. Finish adding your schema.

After your schema finishes uploading, the schema appears in the **Schemas** list. On your integration account's **Overview** page, under **Artifacts**, your uploaded schema appears.

<a name="no-public-access"></a>

#### Upload to containers without public access

1. Upload the schema to your storage account. In the right-hand window, select **Upload**.

1. After you finish uploading, generate a shared access signature (SAS) for your schema. From your schema's shortcut menu, select **Get Shared Access Signature**.

1. In the **Shared Access Signature** pane, select **Generate container-level shared access signature URI** > **Create**. After the SAS URL gets generated, next to the **URL** box, select **Copy**.

1. Return to the Azure portal where the **Add Schema** pane is open. Select **Large file**.

   The **Content URI** box now appears, rather than the **Schema** box.

1. In the **Content URI** box, paste the SAS URI you previously generated. Finish adding your schema.

After your schema finishes uploading, the schema appears in the **Schemas** list. On your integration account's **Overview** page, under **Artifacts**, your uploaded schema appears.

### [Standard](#tab/standard)

#### Azure portal

1. On your logic app resource's menu, under **Settings**, select **Schemas**.

1. On the **Schemas** pane toolbar, select **Add**.

1. On the **Add schema** pane, enter a unique name for your schema.

1. Next to the **Schema** box, select the folder icon. Select the schema to upload.

1. When you're done, select **OK**.

   After your schema file finishes uploading, the schema appears in the **Schemas** list. On your integration account's **Overview** page, under **Artifacts**, your uploaded schema also appears.

#### Visual Studio Code

1. In your logic app project's structure, open the **Artifacts** folder and then the **Schemas** folder.

1. In the **Schemas** folder, add your schema.

---

<a name="edit-schema"></a>

## Edit a schema

To update an existing schema, you have to upload a new schema file that has the changes you want. However, you can first download the existing schema for editing.

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your integration account, if not already open.

1. On your integration account's menu, under **Settings**, select **Schemas**.

1. After the **Schemas** pane opens, select your schema. To download and edit the schema first, on the **Schemas** pane toolbar, select **Download**, and save the schema.

1. When you're ready to upload the updated schema, on the **Schemas** pane, select the schema that you want to update. On the **Schemas** pane toolbar, select **Update**.

1. Find and select the updated schema you want to upload.

1. When you're done, select **OK**.

   After your schema file finishes uploading, the updated schema appears in the **Schemas** list.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your logic app resource, if not already open.

1. On your logic app resource's menu, under **Settings**, select **Schemas**.

1. After the **Schemas** pane opens, select your schema. To download and edit the schema first, on the **Schemas** pane toolbar, select **Download**, and save the schema.

1. On the **Schemas** pane toolbar, select **Add**.

1. On the **Add schema** pane, enter a unique name for your schema.

1. Next to the **Schema** box, select the folder icon. Select the schema to upload.

1. When you're done, select **OK**.

   After your schema file finishes uploading, the updated schema appears in the **Schemas** list.

---

<a name="delete-schema"></a>

## Delete a schema

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your integration account, if not already open.

1. On your integration account's menu, under **Settings**, select **Schemas**.

1. After the **Schemas** pane opens, select your schema, and then select **Delete**.

1. To confirm you want to delete the schema, select **Yes**.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your logic app resource, if not already open.

1. On your logic app resource's menu, under **Settings**, select **Schemas**.

1. After the **Schemas** pane opens, select your schema, and then select **Delete**.

1. To confirm you want to delete the schema, select **Yes**.

---

## Next steps

* [Validate XML for workflows in Azure Logic Apps](logic-apps-enterprise-integration-xml-validation.md)
* [Transform XML for workflows in Azure Logic Apps](logic-apps-enterprise-integration-transform.md)
