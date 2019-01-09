---
title: Transform XML with XSLT maps - Azure Logic Apps | Microsoft Docs
description: Add XSLT maps that transform XML in Azure Logic Apps with Enterprise Integration Pack
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: jonfan, estfan, LADocs
ms.topic: article
ms.assetid: 90f5cfc4-46b2-4ef7-8ac4-486bb0e3f289
ms.date: 07/08/2016
---

# Add maps for XML transformation in Azure Logic Apps with Enterprise Integration Pack

Enterprise integration uses maps to transform XML data between formats. 
A map is an XML document that defines the data in a document that 
should be transformed into another format. 

## Why use maps?

Suppose that you regularly receive B2B orders or invoices from a customer who uses the YYYMMDD format for dates. However, in your organization, you store dates in the MMDDYYY format. You can use a map to *transform* the YYYMMDD date format into the MMDDYYY before storing the order or invoice details in your customer activity database.


## How do I create a map?

You can create BizTalk Integration projects with the 
[Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md "Learn about the enterprise integration pack") for Visual Studio 2015. 
You can then create an Integration Map file that lets you 
visually map items between two XML schema files. 
After you build this project, you will have an XSLT document.

If the map has a reference to an external assembly, then both must be uploaded to the integration account. They should be uploaded in a specific order, first the assembly and then the map that references the assembly.


## How do I add a map?

1. In the Azure portal, select **Browse**.

	![](./media/logic-apps-enterprise-integration-overview/overview-1.png)

2. In the filter search box, enter **integration**, 
then select **Integration Accounts** from the results list.

	![](./media/logic-apps-enterprise-integration-overview/overview-2.png)

3. Select the integration account where you want to add the map.

	![](./media/logic-apps-enterprise-integration-overview/overview-3.png)

4. Select the **Maps** tile.

	![](./media/logic-apps-enterprise-integration-maps/map-1.png)

5. After the Maps page opens, choose **Add**.

	![](./media/logic-apps-enterprise-integration-maps/map-2.png)  

6. Enter a **Name** for your map. To upload the map file, 
choose the folder icon on the right side of the **Map** text box. 
After the upload process completes, choose **OK**.

	![](./media/logic-apps-enterprise-integration-maps/map-3.png)

7. After Azure adds the map to your integration account, 
you get an onscreen message that shows whether your map file 
was added or not. After you get this message, 
choose the **Maps** tile so you can view the newly added map.

	![](./media/logic-apps-enterprise-integration-maps/map-4.png)


## How do I add an assembly?
Open the integration account where you want to upload the assembly.

1. Choose the **Assemblies** tile.

	![integrationaccount-assembly-tile](./media/logic-apps-enterprise-integration-maps/assemblytile.png)

2. After the Assemblies page opens, choose **Add**. Enter a **Name** for your assembly. To upload the assembly file, 
choose the folder icon on the right side of the **Assembly** text box. 
After the upload process completes, choose **OK**.

 	![add-assembly](./media/logic-apps-enterprise-integration-maps/assemblyfile.png)


## How do I edit a map?

You must upload a new map file with the changes that you want. 
You can first download the map for editing.

To upload a new map that replaces the existing map, 
follow these steps.

1. Choose the **Maps** tile.

2. After the Maps page opens, select the map that you want to edit.

3. On the **Maps** page, choose **Update**.

	![](./media/logic-apps-enterprise-integration-maps/edit-1.png)

4. In the file picker, select the map file that you want to upload, 
then select **Open**.

	![](./media/logic-apps-enterprise-integration-maps/edit-2.png)

## How to delete a map?

1. Choose the **Maps** tile.

2. After the Maps page opens, select the map you want to delete.

3. Choose **Delete**.

	![](./media/logic-apps-enterprise-integration-maps/delete.png)

4. Confirm that you want to delete the map.

	![](./media/logic-apps-enterprise-integration-maps/delete-confirmation-1.png)

## Next Steps
* [Learn more about the Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md "Learn about Enterprise Integration Pack")  
* [Learn more about agreements](../logic-apps/logic-apps-enterprise-integration-agreements.md "Learn about enterprise integration agreements")  
* [Learn more about transforms](logic-apps-enterprise-integration-transform.md "Learn about enterprise integration transforms")  

