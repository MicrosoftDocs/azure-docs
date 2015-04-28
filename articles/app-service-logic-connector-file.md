<properties 
	pageTitle="File Connector"
	description="Get started with File Connector"
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

# Using the File connector in your logic app #

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. 

File Connector allows you to upload\download\delete files from file system on a host machine.

## Creating a File connector for your Logic App ##
To use the File connector, you need to first create an instance of the File connector API app. This can be done as follows:

1.	Open the Azure Marketplace using the + NEW option at the bottom left of the Azure Portal.
2.	Browse to “Web and Mobile > Azure Marketplace” and search for “File connector”.
3.	Configure the File connector as follows:
 
	![][1]
 
	- **Name** - give a name for your File Connector
	- **Package Settings**
		- **Root Folder** - Specify the root folder path on your host machine. Eg. D:\FileConnectorTest
		- **Service Bus Connection String** - Provide a Service Bus Connection String. Make sure that the service bus namespace is of type Standard and NOT Basic
	- **App Service plan** - select or create a App Service plan
	- **Pricing tier** - choose a pricing tier for the connector
	- **Resource group** - select or create a resource group where the connector should reside
	- **Subscription** - choose a subscription you want this connector to be created in
	- **Location** - choose the geographic location where you would like the connector to be deployed

4. Click on Create. A new File Connector will be created
5. Once the API app instance is created, browse to its dashboard. This can be done by clicking Browse->Api Apps->Select your File Connector API App
6. You can see in the File Connector dashboard that the "Hybrid Connection" lens shows "On-Premise Setup Incomplete". To complete the Hybrid Setup, open this dashboard from the host machine whose file system needs to be connected to. Then Click on the "Hybrid Connection" lens. On the opened "Hybrid Connection" blade click on the "Download and configure" link to install the On-premises Hybrid Connection Manager

	![][2]

7. This will launch an installer that will ask you for the "Relay Listen Connection String". Copy paste the "Primary Configuration String" from the "Hybrid Connection" blade. Click Install.

	![][3]

8. To verify that the hybrid installation was successful, re-open the File Connector dashboard. You should see the Hybrid Connection Status as "Connected"

	![][4]

## Using the File Connector in your Logic App ##
Once your API app is created, you can now use the File connector as an action for your Logic App. To do this, you need to:

1.	Create a new Logic App and choose the same resource group which has the File connector. Follow instructions to [Create a new Logic App].  	
	
2.	Open “Triggers and Actions” within the created Logic App to open the Logic Apps Designer and configure your flow.  	
	
3.	The File connector would appear in the “API Apps in this resource group” section in the gallery on the right hand side.
 	
4.	You can drop the File Connector API app into the editor by clicking on the “File Connector”. File Connector exposes one trigger and 4 Actions.
 
	![][5]

6.	Each one of these exposes certain properties. The image below lists the properties for the trigger and Get File Action
 
	![][6]

7. One these are configured, the Trigger and Action can be used in your flow. Similarly, other actions can be configured as well.

8. To use the connector outside of a logic App, the REST APIs exposed by the connector can be leveraged. You can view this API Definitions using Browse->Api App->File Connector. Now click on the API Definition lens under the Summary Section to view all the APIs exposed by this connector.

	![][7]

9. Details of the APIs can be found at [File Connector API Definition].

<!-- Image reference -->
[1]: ./media/app-service-logic-connector-file/img1.PNG
[2]: ./media/app-service-logic-connector-file/img2.PNG
[3]: ./media/app-service-logic-connector-file/img3.PNG
[4]: ./media/app-service-logic-connector-file/img4.PNG
[5]: ./media/app-service-logic-connector-file/img5.PNG
[6]: ./media/app-service-logic-connector-file/img6.PNG
[7]: ./media/app-service-logic-connector-file/img7.PNG

<!-- Links -->
[Create a new Logic App]: app-service-logic-create-a-logic-app.md
[File Connector API Definition]: https://msdn.microsoft.com/en-US/library/dn936296.aspx