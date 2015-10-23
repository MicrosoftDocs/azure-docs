<properties
	pageTitle="Using the Dropbox Connector in Logic Apps | Microsoft Azure App Service"
	description="How to create and configure the Dropbox Connector or API app and use it in a logic app in Azure App Service"
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
	ms.date="08/23/2015"
	ms.author="sameerch"/>

# Get started with the Dropbox Connector and add it to your Logic App
Connect to Dropbox account to upload or download files. Logic apps can trigger based on a variety of data sources and offer connectors to get and process data. You can add the Dropbox connector to your business workflow and process data as part of this workflow within a Logic App.

## Triggers and Actions

A Trigger starts a new instance based on a specific event, like the arrival of a new message. An Action is the result, like after receiving a new message, then upload the file to Dropbox.

The Dropbox connector can be used as an action in a logic app and supports data in JSON and XML formats. The Dropbox connector has the following Triggers and Actions available:

Triggers | Actions
--- | ---
None | <ul><li>Delete File</li><li>Get File</li><li>Upload File</li><li>List Files</li></ul>


## Create an Dropbox connector for your Logic App
A connector can be created within a logic app or be created directly from the Azure Marketplace. To create a connector from the Marketplace:  

1. In the Azure startboard, select **Marketplace**.
2. Search for “Dropbox Connector”, select it, and select **Create**.
3. Enter the Name, App Service Plan, and other properties:  
	![][1]
	- **Location** - choose the geographic location where you would like the connector to be deployed
	- **Subscription** - choose a subscription you want this connector to be created in
	- **Resource group** - select or create a resource group where the connector should reside
	- **App Service plan** - select or create a web hosting plan
	- **Pricing tier** - choose a pricing tier for the connector
	- **Name** - give a name for your Dropbox Connector  
4. Select **Create**.


## Using the Dropbox Connector in your Logic App
Once your API app is created, you can now use the Dropbox connector as an action for your Logic App. To do this:

1.	In your logic app, open **Triggers and Actions** to open the Logic Apps Designer and configure your flow:  
	![][3]
2.	The Dropbox connector is listed in the gallery:  
	![][4]
3.	Select the Dropbox connector to automatically add in the designer. Select **Authorize**, enter your credentials, and select **Allow**:  
	![][5]
	![][6]
	![][7]

You can now use Dropbox connector in the flow. You can use the Dropbox action "upload File" to upload a file to your Dropbox account:  
	![][8]
	![][9]

Configure the input properties for "Upload File" action as follows:  

- **File Path** - Specify the destination Dropbox file path of the file to be uploaded. Example: Photos/image.png
- **Content** - Specifies the content of the file to be uploaded. Often, this will come from a previous step in your Logic App.
- **Content Transfer Encoding** - Specify none or base64.
- **Overwrite** - Specify "true" to overwrite the file if it already exists.

## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).

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
