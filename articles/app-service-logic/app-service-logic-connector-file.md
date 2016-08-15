<properties
	pageTitle="Using the File connector in Logic apps | Microsoft Azure App Service"
	description="How to create and configure the file connector or API app and use it in a Logic app in Azure App Service"
	authors="rajeshramabathiran"
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
	ms.date="05/31/2016"
	ms.author="rajram"/>

# Get started with the file connector and add it to your Logic app
>[AZURE.NOTE] This version of the article applies to Logic apps 2014-12-01-preview schema version.

Connect to a file system to upload, download, and more to your files on a host machine. Logic apps can trigger based on a variety of data sources and offer connectors to get and process data. You can add the file connector to your business workflow and process data as part of this workflow within a Logic app. 

The file connector uses the Hybrid Connection Manager for hybrid connectivity to the host file system.

## Creating a file connector for your Logic app ##
To use the file connector, you need to first create an instance of the file connector API app. This can be done as follows:

1.	Open the Azure Marketplace using the + NEW option on the left side of the Azure Portal.
2.	Browse to “Marketplace > API Apps” and search for “file connector”.
3.	Configure the file connector as follows:  
![][1]

	- **Name** - give a name for your file connector
	- **Package Settings**
		- **Root Folder** - Specify the root folder path on your host machine. Eg. D:\FileConnectorTest
		- **Service Bus Connection String** - Provide a Service Bus Connection String. Make sure that the service bus namespace is of type Standard and NOT Basic to allow for use of Service Bus Relays.  Service Bus Relay is used to connect to the Hybrid Connection Manager.
	- **App Service plan** - select or create a App Service plan
	- **Pricing tier** - choose a pricing tier for the connector
	- **Resource group** - select or create a resource group where the connector should reside
	- **Subscription** - choose a subscription you want this connector to be created in
	- **Location** - choose the geographic location where you would like the connector to be deployed

4. Click on Create. A new file connector will be created

## Configure Hybrid Connection Manager ##
Once the API App instance is created, browse to its dashboard.  This can be done by clicking on Browse > API Apps > select your file connector API App.  From here the Hybrid Connection Manager needs to be configured.
For more information on configuring and trouble shooting the Hybrid Connection Manager see [Using the Hybrid Connection Manager].

## Using the file connector in your Logic app ##
Once your API app is created, you can now use the file connector as an action for your Logic app. To do this, you need to:

1.	Create a new Logic app and choose the same resource group which has the file connector. Follow instructions to [Create a new Logic app].

2.	Open “Triggers and Actions” within the created Logic app to open the Logic apps Designer and configure your flow.

3.	The file connector would appear in the “API Apps in this resource group” section in the gallery on the right hand side.

4.	You can drop the file connector API app into the editor by clicking on the “file connector”. file connector exposes one trigger and 4 Actions:  
![][5]

6.	Each one of these exposes certain properties. The image below lists the properties for the trigger and Get file Action:  
![][6]

7. Once these are configured, the Trigger and Action can be used in your flow. Similarly, other actions can be configured as well.

> [AZURE.NOTE] The file trigger will delete the file after it is successfully read from the folder.

## File connector REST APIs ##
To use the connector outside of a Logic app, the REST APIs exposed by the connector can be leveraged. You can view this API Definitions using Browse->Api App->file connector. Now click on the API Definition lens under the Summary Section to view all the APIs exposed by this connector:  
![][7]

Details of the APIs can be found at [file connector API definition].

## Do more with your connector
Now that the connector is created, you can add it to a business workflow using a Logic app. See [What are Logic apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic apps before signing up for an Azure account, go to [Try Logic app](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter Logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and connector](app-service-logic-monitor-your-connectors.md).

<!-- Image reference -->
[1]: ./media/app-service-logic-connector-file/img1.PNG
[5]: ./media/app-service-logic-connector-file/img5.PNG
[6]: ./media/app-service-logic-connector-file/img6.PNG
[7]: ./media/app-service-logic-connector-file/img7.PNG

<!-- Links -->
[Create a new Logic app]: app-service-logic-create-a-logic-app.md
[File connector API definition]: https://msdn.microsoft.com/library/dn936296.aspx
[Using the Hybrid Connection Manager]: app-service-logic-hybrid-connection-manager.md
