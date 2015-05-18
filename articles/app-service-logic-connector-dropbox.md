<properties 
	pageTitle="Dropbox Connector"
	description="Get started with Dropbox Connector"
	authors="anuragdalmia" 
	manager="dwrede" 
	editor="" 
	services="app-service\logic" 
	documentationCenter=""/>

<tags
	ms.service="app-service-logic"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/31/2015"
	ms.author="adgoda"/>

# Using the Dropbox connector in your logic app #

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. 

Dropbox Connector allows you to upload or download files from your Dropbox account.

## Creating an Dropbox connector for your Logic App ##
To use the Dropbox connector, you need to first create an instance of the Dropbox connector API app. This can be done as follows:

1.	Open the Azure Marketplace using the + NEW option at the bottom left of the Azure Portal.
2.	Browse to “Web and Mobile --> Azure Marketplace” and search for “Dropbox connector”.
3.	Configure the Dropbox connector as follows:
 
	![][1] 
	- **Location** - choose the geographic location where you would like the connector to be deployed
	- **Subscription** - choose a subscription you want this connector to be created in
	- **Resource group** - select or create a resource group where the connector should reside
	- **App Service plan** - select or create a web hosting plan
	- **Pricing tier** - choose a pricing tier for the connector
	- **Name** - give a name for your Dropbox Connector
4. Click on Create. A new Dropbox Connector will be created.
5. Once the API app instance is created, you can create a logic App in the same resource group to use the Dropbox connector.

## Using the Dropbox Connector in your Logic App ##
Once your API app is created, you can now use the Dropbox connector as an action for your Logic App. To do this, you need to:

1.	Create a new Logic App and choose the same resource group which has the Dropbox connector.
 	
	![][2]
2.	Open “Triggers and Actions” to open the Logic Apps Designer and configure your flow. 
 	
	![][3]
3.	The Dropbox connector would appear in the “API Apps in this resource group” section in the gallery on the right hand side.
 
	![][4]
4.	You can drop the Dropbox Connector API app into the editor by clicking on the “Dropbox Connector”. Click on the Authorize button. Provide your Dropbox credentials. Click “Allow”
 
	![][5]
	![][6]
	![][7]
6.	You can now use Dropbox connector in the flow. You can use the Dropbox action "upload File" to upload a file to your Dropbox account.
 
	![][8]
	![][9]

Configure the input properties for "Upload File" action as follows:

- **File Path** - Specify the destination Dropbox file path of the file to be uploaded. Example: Photos/image.png
- **Content** - Specifies the content of the file to be uploaded. Often, this will come from a previous step in your Logic App.
- **Content Transfer Encoding** - Specify none or base64.
- **Overwrite** - Specify "true" to overwrite the file if it already exists.


<!-- Image reference -->
[1]: ./media/app-service-logic-connector-dropbox/img1.PNG
[2]: ./media/app-service-logic-connector-dropbox/img2.PNG
[3]: ./media/app-service-logic-connector-dropbox/img3.png
[4]: ./media/app-service-logic-connector-dropbox/img4.png
[5]: ./media/app-service-logic-connector-dropbox/img5.PNG
[6]: ./media/app-service-logic-connector-dropbox/img6.PNG
[7]: ./media/app-service-logic-connector-dropbox/img7.PNG
[8]: ./media/app-service-logic-connector-dropbox/img8.PNG
[9]: ./media/app-service-logic-connector-dropbox/img9.PNG
