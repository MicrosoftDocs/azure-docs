<properties 
	pageTitle="Using the BizTalk Transform in logic apps in Azure App Service| Microsoft Azure" 
	description="Learn how to transform XML documents from one schema to another" 
	authors="anuragdalmia" 
	manager="erikre" 
	editor="" 
	services="logic-apps" 
	documentationCenter=""/>

<tags
	ms.service="logic-apps"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/20/2016"
	ms.author="anuragdalmia"/>

# BizTalk Transform

[AZURE.INCLUDE [app-service-logic-version-message](../../includes/app-service-logic-version-message.md)]

## Overview
The BizTalk Transform API App converts data from one format to another format. For example, you might take shipping and billing addresses from a purchase order and insert them into an invoice document. Or you may have an incoming message that contains the current date in the *YearMonthDay* format. You want to reformat the date to be in the *MonthDayYear* format. 

You can do this using the Transform API App in Microsoft Azure App Service. A Transform, which is also known as a map, consists of a Source XML schema (the input) and a Target XML schema (the output). You can use different built-in functions to help manipulate or control the data, including string manipulations, conditional assignments, arithmetic expressions, date time formatters, and even looping constructs. 

Maps are created in Visual Studio using the [Microsoft Azure BizTalk Services SDK](http://www.microsoft.com/download/details.aspx?id=39087). When you are finished creating and testing the map, you upload the map (.trfm) into the BizTalk Transform API App.

Additional features include:

- The transformation created in a map can be simple, such as copying a name and address from one document to another. Or, you can create more complex transformations using the out-of-the-box map operations.
- Multiple map operations or functions are readily available, including strings, date time functions, and so on.
- Can do a direct data copy between the schemas. In the BizTalk Mapper, this is as simple as drawing a line that connects the elements in the source schema with their counterparts in the destination schema.
- When creating a map, you view a graphical representation of the map, including seeing all the relationships and links you create.
- Use the **Test Map** feature to add a sample XML message. With a simple click, you can test the map you created, and see the generated output.
- Upload existing Azure BizTalk Service maps (.trfm) and use all the benefits of the Transform API App.
- When you create the map, you don't need to add a schema. When your map is ready, add it to the Transform API App and you're ready to go. 
- Includes support for the XML format.


## Download Schemas from Connector API Apps
You can download the XML schemas for connectors such as SQL, SAP and SharePoint from the API App summary page. For example, if you want to download XML schemas for a specific SAP Connector API App, browse for the API App and open the summary page. Select **Download Schemas** and a zip file with all the schemas corresponding to the SAP actions is downloaded to your computer. You can use the schemas to author a map (.trfm) in Visual Studio.


## Create and Add the Map
Transforms or Maps are created in Visual Studio using the [Microsoft Azure BizTalk Services SDK](http://www.microsoft.com/download/details.aspx?id=39087), which is a free download. 

For help creating a Map, see [Create a Map in Visual Studio](http://aka.ms/createamapinvs). After the map is created and ready for production, you can add the Map (.trfm file) to the BizTalk Transform API App you created in the Azure portal. 

If the map changes or is modified after it is uploaded, you can upload the updated map to replace the existing map in the Transform API App.

1.	Select **Browse** on Azure portal (left of the screen) and select **API Apps**. If **API Apps** isn't displayed, select **Everything**, and select **API Apps** from the available list:

	![][7]

2.	The list of all **API Apps** created in your Azure subscription is shown:

	![][8]

3.	Select the BizTalk Transform API App you created in the previous section.

4.	The configuration blade for the API App opens. You can see **Maps** in the Components section:

	![][9]

5.	Select **Maps** to open the new blade with the list of maps.

6.	Select the **Add Map** icon on the top to open the **Add Map** blade:

	![][10]

7.	Select the File icon and browse for a map file (.trfm) from your local computer.

8.  Select **OK** and a new map is created. It is shown in the list of maps.


## Use a BizTalk Transform API App in a Logic App
Once the map has been authored and tested, it is now ready for consumption.

1. Within the Logic App, BizTalk Transform is available in the gallery to the right. Select  **BizTalk Transform Service** from the gallery. The Transform is added to the flow:

	![][11]

2. Select the **Transform** action. The input parameters are displayed:

	![][12]

3. Enter the following parameters to complete the **Transform** action configuration:
		 
	- Input XML
		- Enter the valid XML content that conforms to the source schema of a map in Transform API App. This can be an output from a previous action in Logic App such as ‘Call RFC – SAP’ or ‘Insert Into Table – SQL’.
		
	- Map Name (optional)
		- Enter a valid map name that is already uploaded in your Transform API App. If no map is entered, the map is automatically selected based on the source schema to which the input XML conforms to.

	![][13]

4. The output of the action 'Output XML' can be used in subsequent actions in your Logic Apps.

<!--Image references-->
[1]: ./media/app-service-logic-transform-xml-documents/Create_Everything.png
[2]: ./media/app-service-logic-transform-xml-documents/Create_Marketplace.png
[4]: ./media/app-service-logic-transform-xml-documents/Search_TransformAPIApp.png
[5]: ./media/app-service-logic-transform-xml-documents/Transform_APIApp_Landing_Page.png
[6]: ./media/app-service-logic-transform-xml-documents/New_TransformAPIApp_Blade.png
[7]: ./media/app-service-logic-transform-xml-documents/Browse_APIApps.png
[8]: ./media/app-service-logic-transform-xml-documents/Select_APIApp_List.png
[9]: ./media/app-service-logic-transform-xml-documents/Configure_Transform_APIApp.png
[10]: ./media/app-service-logic-transform-xml-documents/Add_Map.png
[11]: ./media/app-service-logic-transform-xml-documents/Transform_action_flow.png
[12]: ./media/app-service-logic-transform-xml-documents/Transform_Inputs.png
[13]: ./media/app-service-logic-transform-xml-documents/Transform_configured.png
[14]: ./media/app-service-logic-transform-xml-documents/Download_Schemas.png



 