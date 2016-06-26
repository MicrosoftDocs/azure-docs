<properties 
	pageTitle="Overview of Enterprise Integration Pack | Microsoft Azure App Service" 
	description="Use the features of Enterprise Integration Pack to enable business process and integration scenarios using Microsoft Azure App service" 
	services="app-service\logic" 
	documentationCenter=".net,nodejs,java"
	authors="msftman" 
	manager="erickre" 
	editor="cgronlun"/>

<tags 
	ms.service="app-service-logic" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/29/2016" 
	ms.author="deonhe"/>

# Maps

## Overview
Enterprise integration uses maps to transform XML data from one format to another format. 

## What is it?
A map is an XML document that defines who data in a document should be transformed into another format. 

## Why would I use it?
Let's assume you regularly receive B2B orders or invoices from a customers who uses the YYYMMDD format for dates. However, in your organization, you store dates in the MMDDYYY format. You can use a map to *transform* the YYYMMDD date format into the MMDDYYY before storing the order or invoice details in your customer activity database.

## How to create it?
1. Select **Browse**  
![](./media/app-service-logic-enterprise-integration-overview/overview-1.png)    
2. Enter **integration** in the filter search box and select **Integration Accounts** from the results list     
 ![](./media/app-service-logic-enterprise-integration-overview/overview-1.png)
3. Select the **integration account** to which you will add the map  
![](./media/app-service-logic-enterprise-integration-overview/overview-1.png)
4.  Select the **Maps** tile  
![](./media/app-service-logic-enterprise-integration-maps/map-1.png)
5. Select the **Add** button in the Maps blade that opens  
![](./media/app-service-logic-enterprise-integration-maps/map-2.png)
6. Enter a **Name** for your map, then to upload the map file, select the folder icon on the right side of the **Map** text box. After the upload process is completed, select the **OK** button.  
![](./media/app-service-logic-enterprise-integration-maps/map-3.png) 
7. The map is now being provisioned into your integration account. This will receive an onscreen notification that indicates the success or failure of adding the map file. Select the **Maps** tile, you will then see your newly added map in the Maps blade:    

8. Select the **Maps** tile. This refreshes the tile and you should see the number of maps increase, reflecting the new map that has been added successfully.    
![](./media/app-service-logic-enterprise-integration-maps/map-4.png)  