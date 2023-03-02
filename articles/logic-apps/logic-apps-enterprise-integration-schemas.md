---
title: Add schemas to use with workflows
description: Add schemas for workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/30/2022 
---

# Add schemas to use with workflows with Azure Logic Apps

Workflow actions such as **Flat File** and **XML Validation** require a schema to perform their tasks. For example, the **XML Validation** action requires an XML schema to check that documents use valid XML and have the expected data in the predefined format. This schema is an XML document that uses [XML Schema Definition (XSD)](https://www.w3.org/TR/xmlschema11-1/) language and has the .xsd file name extension. The **Flat File** actions use a schema to encode and decode XML content.

This article shows how to add a schema to your integration account. If you're working with a Standard logic app workflow, you can also add a schema directly to your logic app resource.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription yet, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* The schema file that you want to add. To create schemas, you can use the following tools:

  * Visual Studio 2019 and the [Microsoft Azure Logic Apps Enterprise Integration Tools Extension](https://aka.ms/vsenterpriseintegrationtools).

  * Visual Studio 2015 and the [Microsoft Azure Logic Apps Enterprise Integration Tools for Visual Studio 2015 2.0](https://aka.ms/vsmapsandschemas) extension.

   > [!NOTE]
   > Don't install the extension alongside the BizTalk Server extension. Having both extensions might 
   > produce unexpected behavior. Make sure that you only have one of these extensions installed.
   >
   > On high resolution monitors, you might experience a [display problem with the map designer](/visualstudio/designers/disable-dpi-awareness) 
   > in Visual Studio. To resolve this display problem, either [restart Visual Studio in DPI-unaware mode](/visualstudio/designers/disable-dpi-awareness#restart-visual-studio-as-a-dpi-unaware-process), 
   > or add the [DPIUNAWARE registry value](/visualstudio/designers/disable-dpi-awareness#add-a-registry-entry).

* Based on whether you're working on a Consumption or Standard logic app workflow, you'll need an [integration account resource](logic-apps-enterprise-integration-create-integration-account.md). Usually, you need this resource when you want to define and store artifacts for use in enterprise integration and B2B workflows.

  > [!IMPORTANT]
  >
  > To work together, both your integration account and logic app resource must exist in the same Azure subscription and Azure region.

  * If you're working on a Consumption logic app workflow, you'll need an [integration account that's linked to your logic app resource](logic-apps-enterprise-integration-create-integration-account.md?tabs=consumption#link-account).

  * If you're working on a Standard logic app workflow, you can link your integration account to your logic app resource, upload schemas directly to your logic app resource, or both, based on the following scenarios:

    * If you already have an integration account with the artifacts that you need or want to use, you can link your integration account to multiple Standard logic app resources where you want to use the artifacts. That way, you don't have to upload schemas to each individual logic app. For more information, review [Link your logic app resource to your integration account](logic-apps-enterprise-integration-create-integration-account.md?tabs=standard#link-account).

    * The **Flat File** built-in connector lets you select a schema that you previously uploaded to your logic app resource or to a linked integration account, but not both. You can then use this artifact across all child workflows within the same logic app resource.

    So, if you don't have or need an integration account, you can use the upload option. Otherwise, you can use the linking option. Either way, you can use these artifacts across all child workflows within the same logic app resource.

## Limitations

* Limits apply to the number of artifacts, such as schemas, per integration account. For more information, review [Limits and configuration information for Azure Logic Apps](logic-apps-limits-and-config.md#integration-account-limits).

* Based on whether you're working on a Consumption or Standard logic app workflow, schema file size limits might apply.

  * If you're working with Standard workflows, no limits apply to schema file sizes.

  * If you're working with Consumption workflows, the following limits apply:

    * If your schema is [2 MB or smaller](#smaller-schema), you can add your schema to your integration account *directly* from the Azure portal.

    * If your schema is bigger than 2 MB but not bigger than the [size limit for schemas](logic-apps-limits-and-config.md#artifact-capacity-limits), you'll need an Azure storage account and a blob container where you can upload your schema. Then, to add that schema to your integration account, you can then link to your storage account from your integration account. For this task, the following table describes the items you need:

      | Item | Description |
      |------|-------------|
      | [Azure storage account](../storage/common/storage-account-overview.md) | In this account, create an Azure blob container for your schema. Learn [how to create a storage account](../storage/common/storage-account-create.md). |
      | Blob container | In this container, you can upload your schema. You also need this container's content URI later when you add the schema to your integration account. Learn how to [create a blob container](../storage/blobs/storage-quickstart-blobs-portal.md). |
      | [Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md) | This tool helps you more easily manage storage accounts and blob containers. To use Storage Explorer, choose a step: <br><br>- In the Azure portal, select your storage account. From your storage account menu, select **Storage Explorer**. <br><br>- For the desktop version, [download and install Azure Storage Explorer](https://www.storageexplorer.com/). Then, connect Storage Explorer to your storage account by following the steps in [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md). To learn more, see [Quickstart: Create a blob in object storage with Azure Storage Explorer](../storage/blobs/quickstart-storage-explorer.md). |

      To add larger schemas, you can also use the [Azure Logic Apps REST API - Schemas](/rest/api/logic/schemas/create-or-update). For Standard workflows, the Azure Logic Apps REST API is currently unavailable.

* Usually, when you're using an integration account with your workflow, you add the schema to that account. However, if you're referencing or importing a schema that's not in your integration account, you might receive the following error when you use the element `xsd:redefine`:

  `An error occurred while processing the XML schemas: ''SchemaLocation' must successfully resolve if <redefine> contains any child other than <annotation>.'.`

  To resolve this error, you need to use the element `xsd:import` or `xsd:include` instead of `xsd:redefine`, or use a URI.

<a name="add-schema"></a>

## Add schemas

* If you're working with a Consumption workflow, you must add your schema to a linked integration account.

* If you're working with a Standard workflow, you have the following options:

  * Add your schema to a linked integration account. You can share the schema and integration account across multiple Standard logic app resources and their child workflows.

  * Add your schema directly to your logic app resource. However, you can only share that schema across child workflows in the same logic app resource.

<a name="add-schema-integration-account"></a>

### Add schema to integration account

1. In the [Azure portal](https://portal.azure.com), sign in with your Azure account credentials.

1. In the main Azure search box, enter **integration accounts**, and select **Integration accounts**.

1. Select the integration account where you want to add your schema.

1. On your integration account's menu, under **Settings**, select **Schemas**.

1. On the **Schemas** pane toolbar, select **Add**.

For Consumption workflows, based on your schema's file size, now follow the steps for uploading a schema that's either [up to 2 MB](#smaller-schema) or [more than 2 MB, up to 8 MB](#larger-schema).

<a name="smaller-schema"></a>

### Add schemas up to 2 MB

1. On the **Add Schema** pane, enter a name for your schema. Keep **Small file** selected. Next to the **Schema** box, select the folder icon. Find and select the schema you're uploading.

1. When you're done, select **OK**.

   After your schema finishes uploading, the schema appears in the **Schemas** list.

<a name="larger-schema"></a>

### Add schemas more than 2 MB

To add larger schemas for Consumption workflows to use, you can either use the [Azure Logic Apps REST API - Schemas](/rest/api/logic/schemas/create-or-update) or upload your schema to an Azure blob container in your Azure storage account. Your steps for adding schemas differ based whether your blob container has public read access. So first, check whether or not your blob container has public read access by following these steps: [Set public access level for blob container](../vs-azure-tools-storage-explorer-blobs.md#set-the-public-access-level-for-a-blob-container)

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

---

### Add schema to Standard logic app resource

The following steps apply only if you want to add a schema directly to your Standard logic app resource. Otherwise, [add the schema to your integration account](#add-schema-integration-account).

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

<a name="edit-schema"></a>

---

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

The following steps apply only if you're updating a schema that you added to your logic app resource. Otherwise, follow the Consumption steps for updating a schema in your integration account.

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

The following steps apply only if you're deleting a schema that you added to your logic app resource. Otherwise, follow the Consumption steps for deleting a schema from your integration account.

1. In the [Azure portal](https://portal.azure.com), open your logic app resource, if not already open.

1. On your logic app resource's menu, under **Settings**, select **Schemas**.

1. After the **Schemas** pane opens, select your schema, and then select **Delete**.

1. To confirm you want to delete the schema, select **Yes**.

---

## Next steps

* [Validate XML for workflows in Azure Logic Apps](logic-apps-enterprise-integration-xml-validation.md)
* [Transform XML for workflows in Azure Logic Apps](logic-apps-enterprise-integration-transform.md)
