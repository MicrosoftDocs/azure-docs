---
title: Validate XML with schemas - Azure Logic Apps | Microsoft Docs
description: Add schemas to validate XML documents in Azure Logic Apps with Enterprise Integration Pack
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: jonfan, estfan, LADocs
ms.topic: article
ms.assetid: 56c5846c-5d8c-4ad4-9652-60b07aa8fc3b
ms.date: 01/22/2019
---

# Validate XML with schemas in Azure Logic Apps with Enterprise Integration Pack

To check that documents use valid XML and have the expected data 
in the predefined format for enterprise integration scenarios 
in Azure Logic Apps, your logic app can use schemas. 
A schema can also validate messages that logic apps exchange
in business-to-business (B2B) scenarios.

For limits related to integration accounts and artifacts such as schemas, 
see [Limits and configuration information for Azure Logic Apps](../logic-apps/logic-apps-limits-and-config.md#integration-account-limits).

## Prerequisites

* An Azure subscription. If you don't have a subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>.

* An [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) 
where you store your schemas and other artifacts for enterprise 
integration and business-to-business (B2B) solutions. 

  If your schema is [2 MB or smaller](#smaller-schema), 
  you can add your schema to your integration account 
  directly from the Azure portal. However, if your 
  schema is bigger than 2 MB but no bigger than the 
  [schema size limit](../logic-apps/logic-apps-limits-and-config.md#artifact-capacity-limits), 
  you can upload your schema to an Azure storage account. 
  To add that schema to your integration account, you can 
  then link to your storage account from your integration account. 
  For this task, here are the items you need: 

  * [Azure storage account](../storage/common/storage-account-overview.md) 
  where you create a blob container for your schema. Learn how to 
  [create a storage account](../storage/common/storage-quickstart-create-account.md). 

  * Blob container for storing your schema. Learn how to 
  [create a blob container](../storage/blobs/storage-quickstart-blobs-portal.md). 
  You need your container's content URI later when you 
  add the schema to your integration account.

  * [Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md), 
  which you can use for managing storage accounts and blob containers. 
  To use Storage Explorer, choose either option here:
  
    * Go to your storage account in the Azure portal. 
    On your storage account menu, select **Storage Explorer**.

    * For the desktop version, [download and install Azure Storage Explorer](https://www.storageexplorer.com/). 
  Then, follow these [steps for connecting Azure Storage Explorer to your storage account](../vs-azure-tools-storage-manage-with-storage-explorer.md).

You don't need a logic app when creating and adding schemas. 
However, to use a schema, your logic app needs linking to 
an integration account where you store that schema. Learn 
[how to link logic apps to integration accounts](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md#link-account). 
If you don't have a logic app yet, learn [how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md).

## Add schemas

1. Sign in to the <a href="https://portal.azure.com" target="_blank">Azure portal</a> 
with your Azure account credentials.

1. To find and open your integration account, 
on the main Azure menu, select **All services**. 
In the search box, enter "integration account". 
Select **Integration accounts**.

   ![Find integration account](./media/logic-apps-enterprise-integration-schemas/find-integration-account.png)

1. Select the integration account where you 
want to add your schema, for example:

   ![Select integration account](./media/logic-apps-enterprise-integration-schemas/select-integration-account.png)

1. On your integration account's **Overview** page, 
under **Components**, select the **Schemas** tile.

   ![Select "Schemas"](./media/logic-apps-enterprise-integration-schemas/select-schemas.png)

1. After the **Schemas** page opens, choose **Add**.

   ![Choose "Add"](./media/logic-apps-enterprise-integration-schemas/add-schema.png)

Based on your schema (.xsd) file's size, follow the 
steps for uploading a schema that's either 
[up to 2 MB](#smaller-schema) or 
[more than 2 MB, up to 8 MB](#larger-schema).

<a name="smaller-schema"></a>

### Upload schemas up to 2 MB

1. Under **Add Schema**, enter a name for your schema. 
Keep **Small file** selected. Next to the **Schema** box, 
choose the folder icon. Find and select the schema you're uploading, 
for example:

   ![Upload smaller schema](./media/logic-apps-enterprise-integration-schemas/upload-smaller-schema-file.png)

1. When you're ready, choose **OK**.

   After your schema finishes uploading, 
   the schema appears in the **Schemas** list.

<a name="larger-schema"></a>

### Upload schemas more than 2 MB

<a name="add-schema-storage-account"></a>

Add larger schemas to storage accounts
[larger than 2 MB up to 8 MB](#larger-schema)


Your steps for adding maps differ based whether or not your blob container 
has public read access. So first, check your blob container's access level.



First, determine your blob container's access level: 
**Public read access** or ****.

1.	Open **Azure Storage Explorer**. 

2.	Under **Blob Containers**, select the blob container you want. 

3.	Select **Security**, **Access Level**.

If the blob security access level is **Public**, 
follow these steps.

![Azure Storage Explorer, with "Blob Containers", "Security", and "Public" highlighted](media/logic-apps-enterprise-integration-schemas/blob-public.png)

1. Upload the schema to your storage account, 
and copy the URI.

	![Storage account, with URI highlighted](media/logic-apps-enterprise-integration-schemas/schema-blob.png)

2. In **Add Schema**, select **Large file**, 
and provide the URI in the **Content URI** text box.

	![Schemas, with "Add" button and "Large file" highlighted](media/logic-apps-enterprise-integration-schemas/schema-largefile.png)

If the blob security access level is **No anonymous access**, 
follow these steps.

![Azure Storage Explorer, with "Blob Containers", "Security", and "No anonymous access" highlighted](media/logic-apps-enterprise-integration-schemas/blob-1.png)

1. Upload the schema to your storage account.

	![Storage account](media/logic-apps-enterprise-integration-schemas/blob-3.png)

2. Generate a shared access signature for the schema.

	![Storage account, with shared access signatures tab highlighted](media/logic-apps-enterprise-integration-schemas/blob-2.png)

3. In **Add Schema**, select **Large file**, 
and provide the shared access signature URI in the **Content URI** text box.

	![Schemas, with "Add" button and "Large file" highlighted](media/logic-apps-enterprise-integration-schemas/schema-largefile.png)

4. In the **Schemas** blade of your integration account, 
your newly added schema should appear.

	![Your integration account, with "Schemas" and the new schema highlighted](media/logic-apps-enterprise-integration-schemas/schema-41.png)

1. Under **Add Schema**, enter a name for your schema. 
Choose **Large file (larger than 2 MB)**. 

   The **Content URI** box now appears, 
   rather than the **Schema** box. 
   You can now enter the location for the 
   blob container where you're storing your schema.

## Edit schemas

1. Choose the **Schemas** tile.

2. After the **Schemas** blade opens, 
select the schema that you want to edit.

3. On the **Schemas** blade, choose **Edit**.

	![Schemas blade](media/logic-apps-enterprise-integration-schemas/edit-12.png)

4. Select the schema file that you want to edit, then select **Open**.

	![Open schema file to edit](media/logic-apps-enterprise-integration-schemas/edit-31.png)

Azure shows a message that the schema uploaded successfully.

## Delete schemas

1. Choose the **Schemas** tile.

2. After the **Schemas** blade opens, 
select the schema you want to delete.

3. On the **Schemas** blade, choose **Delete**.

	![Schemas blade](media/logic-apps-enterprise-integration-schemas/delete-12.png)

4. To confirm that you want to delete the selected schema, 
choose **Yes**.

	!["Delete schema" confirmation message](media/logic-apps-enterprise-integration-schemas/delete-21.png)

	In the **Schemas** blade, the schema list refreshes 
	and no longer includes the schema that you deleted.

	![Your integration Account, with "Schemas" highlighted](media/logic-apps-enterprise-integration-schemas/delete-31.png)

## Next steps

* [Learn more about the Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md "Learn about the enterprise integration pack").  

