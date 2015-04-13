<properties 
	pageTitle="OneDrive Connector"
	description="Get started with OneDrive Connector"
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
	ms.date="04/09/2015"
	ms.author="andalmia"/>

# Using the OneDrive connector in your logic app #

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. 

OneDrive Connector allows you to upload\download\delete files from your OneDrive account.

## Creating a OneDrive connector for your Logic App ##
To use the OneDrive connector, you need to first create an instance of the OneDrive connector API app. This can be done as follows:

1.	Open the Azure Marketplace using the + NEW option at the bottom left of the Azure Portal.
2.	Browse to “Web and Mobile > Azure Marketplace” and search for “OneDrive connector”.
3.	Configure the OneDrive connector as follows:
 
	![][1] 
	- **Name** - give a name for your OneDrive Connector
	- **App Service plan** - select or create a App Service plan
	- **Pricing tier** - choose a pricing tier for the connector
	- **Resource group** - select or create a resource group where the connector should reside
	- **Subscription** - choose a subscription you want this connector to be created in
	- **Location** - choose the geographic location where you would like the connector to be deployed

4. Click on Create. A new OneDrive Connector will be created.
5. Once the API app instance is created, you can create a logic App in the same resource group to use the OneDrive connector.

## Using the OneDrive Connector in your Logic App ##
Once your API app is created, you can now use the OneDrive connector as an action for your Logic App. To do this, you need to:

1.	Create a new Logic App and choose the same resource group which has the OneDrive connector. Follow instructions to [Create a new Logic App].  	
	
2.	Open “Triggers and Actions” within the created Logic App to open the Logic Apps Designer and configure your flow.  	
	
3.	The OneDrive connector would appear in the “API Apps in this resource group” section in the gallery on the right hand side.
 
	![][2]
4.	You can drop the OneDrive Connector API app into the editor by clicking on the “OneDrive Connector”. Click on the Authorize button. Provide your Microsoft credentials (if not automatically signed in). Click “Yes” to allow access.
 
	![][3]
	![][4]
	
5.	You can now use the OneDrive connector in the flow. Currently, triggers are not available within the OneDrive connector. The Actions available are - Get File, Upload a File, Delete File and List Files.
 
	![][5]

6.	Lets walk through an "Upload File" experience. You can use the OneDrive action "upload File" to upload a file to your OneDrive account.
 
	![][6]

	Configure the input properties for "Upload File" action as follows:

 - **File Path** - Specify the file path of the file to be uploaded
 - **Content** - Specifies the content of the file to be uploaded
 - **Content Transfer Encoding** - Specify none or base64
 - **Overwrite** - Specify "true" to overwrite the file if it already exists. This is an advanced property

7. One these are configured, the "Upload a File" Action is configured and can be used in your flow. Similarly, other actions can be configured as well.

8. To use the connector outside of a logic App, the REST APIs exposed by the connector can be leveraged. You can view this API Definitions using Browse->Api App->OneDrive Connector. Now click on the API Definition lens under the Summary Section to view all the APIs exposed by this connector.

	![][7]

9. Details of the APIs can be found at [OneDrive API Definition].

<!-- Image reference -->
[1]: ./media/app-service-logic-connector-onedrive/img1.PNG
[2]: ./media/app-service-logic-connector-onedrive/img2.PNG
[3]: ./media/app-service-logic-connector-onedrive/img3.PNG
[4]: ./media/app-service-logic-connector-onedrive/img4.PNG
[5]: ./media/app-service-logic-connector-onedrive/img5.PNG
[6]: ./media/app-service-logic-connector-onedrive/img6.PNG
[7]: ./media/app-service-logic-connector-onedrive/img7.PNG

<!-- Links -->
[Create a new Logic App]: app-service-logic-create-a-logic-app.md
[OneDrive API Definition]: https://msdn.microsoft.com/en-us/library/dn974227.aspx