<properties
	pageTitle="Overview of schemas and the Enterprise Integration Pack | Microsoft Azure"
	description="Learn how to use schemas with the Enterprise Integration Pack and logic apps"
	services="logic-apps"
	documentationCenter=".net,nodejs,java"
	authors="msftman"
	manager="erikre"
	editor="cgronlun"/>

<tags
	ms.service="logic-apps"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/29/2016"
	ms.author="deonhe"/>

# Learn about schemas and the Enterprise Integration Pack  

## Why use a schema?
Use schemas to confirm that XML documents you receive are valid, with the expected data in a predefined format. Schemas are used to validate messages that are exchanged in a B2B scenario.

## Add a schema
From the Azure portal:  

1. Select **More services**.  
![Screenshot of Azure portal, with "More services" highlighted](./media/app-service-logic-enterprise-integration-overview/overview-11.png)    

2. In the filter search box, enter **integration**, and select **Integration Accounts** from the results list.     
![Screenshot of filter search box](./media/app-service-logic-enterprise-integration-overview/overview-21.png)  
3. Select the **integration account** to which you add the schema.    
![Screenshot of list of integration accounts](./media/app-service-logic-enterprise-integration-overview/overview-31.png)  

4. Select the **Schemas** tile.  
![Screenshot of IEP Integration Account, with "Schemas" highlighted](./media/app-service-logic-enterprise-integration-schemas/schema-11.png)  

### Add a schema file less than 2 MB  

1. In the **Schemas** blade that opens (from the preceding steps), select **Add**.  
![Screenshot of Schemas blade, with "Add" button highlighted](./media/app-service-logic-enterprise-integration-schemas/schema-21.png)  

2. Enter a name for your schema. Then, to upload the schema file, select the folder icon next to the **Schema** text box. After the upload process is completed, select **OK**.    
![Screenshot of "Add Schema", with "Small file" highlighted](./media/app-service-logic-enterprise-integration-schemas/schema-31.png)  

### Add a schema file larger than 2 MB (up to a maximum of 8 MB)  

The process for this depends on the blob container access level: **Public** or **No anonymous access**. To determine this access level, in **Azure Storage Explorer**, under **Blob Containers**, select the blob container you want. Select **Security**, and select the **Access Level** tab.

1. If the blob security access level is **Public**, follow these steps.  
  ![Screenshot of Azure Storage Explorer, with "Blob Containers", "Security", and "Public" highlighted](./media/app-service-logic-enterprise-integration-schemas/blob-public.png)  

	a. Upload the schema to storage, and copy the URI.  
	![Screenshot of storage account, with URI highlighted](./media/app-service-logic-enterprise-integration-schemas/schema-blob.png)  

	b. In **Add Schema**, select **Large file**, and provide the URI in the **Content URI** text box.  
	![Screenshot of schemas, with "Add" button and "Large file" highlighted](./media/app-service-logic-enterprise-integration-schemas/schema-largefile.png)  

2. If the blob security access level is **No anonymous access**, follow these steps.  
  ![Screenshot of Azure Storage Explorer, with "Blob Containers", "Security", and "No anonymous access" highlighted](./media/app-service-logic-enterprise-integration-schemas/blob-1.png)  

	a. Upload the schema to storage.  
	![Screenshot of storage account](./media/app-service-logic-enterprise-integration-schemas/blob-3.png)

	b. Generate a shared access signature for the schema.  
	![Screenshot of storage sccount, with shared access signatures tab highlighted](./media/app-service-logic-enterprise-integration-schemas/blob-2.png)

	c. In **Add Schema**, select **Large file**, and provide the shared access signature URI in the **Content URI** text box.  
	![Screenshot of schemas, with "Add" button and "Large file" highlighted](./media/app-service-logic-enterprise-integration-schemas/schema-largefile.png)  

3. In the **Schemas** blade of the EIP Integration Account, you should now see the newly added schema.  
![Screenshot of EIP Integration Account, with "Schemas" and the new schema highlighted](./media/app-service-logic-enterprise-integration-schemas/schema-41.png)
  

## Edit schemas
1. Select the **Schemas** tile.  
2. Select the schema you want to edit from the **Schemas** blade that opens.
3. On the **Schemas** blade, select **Edit**.  
![Screenshot of Schemas blade](./media/app-service-logic-enterprise-integration-schemas/edit-12.png)    
4. Select the schema file you want to edit by using the file picker dialog box that opens.
5. Select **Open** in the file picker.  
![Screenshot of file picker](./media/app-service-logic-enterprise-integration-schemas/edit-31.png)  
6. You receive a notification that indicates the upload was successful.  

## Delete schemas
1. Select the **Schemas** tile.  
2. Select the schema you want to delete from the **Schemas** blade that opens.  
3. On the **Schemas** blade, select **Delete**.
![Screenshot of Schemas blade](./media/app-service-logic-enterprise-integration-schemas/delete-12.png)  

4. To confirm your choice, select **Yes**.  
![Screenshot of "Delete schema" confirmation message](./media/app-service-logic-enterprise-integration-schemas/delete-21.png)  
5. Finally, notice that the list of schemas in the **Schemas** blade refreshes, and the schema you deleted is no longer listed.  
![Screenshot of EIP Integration Account, with "Schemas" highlighted](./media/app-service-logic-enterprise-integration-schemas/delete-31.png)    

## Next steps

- [Learn more about the Enterprise Integration Pack](./app-service-logic-enterprise-integration-overview.md "Learn about the enterprise integration pack").  
