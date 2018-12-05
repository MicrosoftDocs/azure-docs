---
title: Add schemas for XML validation - Azure Logic Apps | Microsoft Docs
description: Create schemas that validate XML documents in Azure Logic Apps with Enterprise Integration Pack
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: jonfan, estfan, LADocs
ms.topic: article
ms.assetid: 56c5846c-5d8c-4ad4-9652-60b07aa8fc3b
ms.date: 07/29/2016
---

# Validate XML with schemas in Azure Logic Apps with Enterprise Integration Pack

Schemas confirm that the XML documents you receive are valid and have the expected data in a predefined format. Schemas also help validate messages that are exchanged in a B2B scenario.

## Add a schema

1. In the Azure portal, select **All services**.

	![Azure portal, "All services"](media/logic-apps-enterprise-integration-schemas/overview-11.png)

2. In the filter search box, enter **integration**, 
and select **Integration Accounts** from the results list.

	![Filter search box](media/logic-apps-enterprise-integration-schemas/overview-21.png)

3. Select the **integration account** where you want to add the schema.

	![List of integration accounts](media/logic-apps-enterprise-integration-schemas/overview-31.png)

4. Choose the **Schemas** tile.

	![Example integration account, "Schemas"](media/logic-apps-enterprise-integration-schemas/schema-11.png)

### Add a schema file smaller than 2 MB

1. In the **Schemas** blade that opens (from the preceding steps), 
choose **Add**.

	![Schemas blade, "Add"](media/logic-apps-enterprise-integration-schemas/schema-21.png)

2. Enter a name for your schema. Upload the schema file by 
selecting the folder icon next to the **Schema** box. 
After the upload process completes, select **OK**.

	![Screenshot of "Add Schema", with "Small file" highlighted](media/logic-apps-enterprise-integration-schemas/schema-31.png)

### Add a schema file larger than 2 MB (up to 8 MB maximum)

These steps differ based on the blob container access level: **Public** or **No anonymous access**.

**To determine this access level**

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

