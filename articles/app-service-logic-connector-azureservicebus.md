<properties 
   pageTitle="Azure Service Bus Connector API App" 
   description="How to use the AzureServiceBusConnector" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="anuragdalmia" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="03/31/2015"
   ms.author="adgoda"/>


# Using the Azure Service Bus connector in your logic app #

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. 

Azure Service Bus Connector lets you receive from and send messages to a Queue/Topic/Subscription.

## Creating an Azure Service Bus connector for your Logic App ##
To use the Azure Service Bus connector, you need to first create an instance of the Azure Service Bus connector API app. This can be done as follows:

1.	Open the Azure Marketplace using the + NEW option at the bottom left of the Azure Portal.
2.	Browse to “Web and Mobile > API Apps” and search for “Azure Service Bus connector”.
3.	Configure the Azure Service Bus connector as follows:
 
	![][1]
	- **Location** - choose the geographic location where you would like the connector to be deployed
	- **Subscription** - choose a subscription you want this connector to be created in
	- **Resource group** - select or create a resource group where the connector should reside
	- **Web hosting plan** - select or create a web hosting plan
	- **Pricing tier** - choose a pricing tier for the connector
	- **Name** - give a name for your Azure Service Bus Connector
	- **Package settings**
		- **Connection String** - The connection string for Azure Service Bus. Example: Endpoint=sb://[namespace].servicebus.windows.net;SharedAccessKeyName=[name];SharedAccessKey=[key]
		- **Entity Name** - The name of the Queue or Topic
		- **Subscription Name** - The name of the Subscription to receive messages from. 

4.	Click on Create. A new Azure Service Bus Connector will be created.
5.	Once the API app instance is created, you can create a logic App in the same resource group to use the Azure Service Bus connector. 

## Using the Azure Service Bus Connector in your Logic App ##
Once your API app is created, you can now use the Azure Service Bus connector as a trigger/action for your Logic App. To do this, you need to:

1.	Create a new Logic App and choose the same resource group which has the Azure Service Bus Connector.
 
	![][2]
2.	Open “Triggers and Actions” to open the Logic Apps Designer and configure your flow. 
 
	![][3]
3.	The Azure Service Bus connector would appear in the “API Apps in this resource group” section in the gallery on the right hand side.
 
	![][4]
4. You can drop the Azure Service Bus Connector API app into the editor by clicking on the “Azure Service Bus Connector”.
 
5.	You can now use Azure Service Bus connector in the flow. You can use the message retrieved from the Azure Service Bus trigger ("Message Available") in other actions in the flow.
 
	![][5]
	![][6] 
6.	In the similar way you can use the Azure Service Bus action "Send Message" to send message

	![][7]
	![][8]


	<!--Image references-->
[1]: ./media/app-service-logic-connector-azureservicebus/img1.PNG
[2]: ./media/app-service-logic-connector-azureservicebus/img2.PNG
[3]: ./media/app-service-logic-connector-azureservicebus/img3.png
[4]: ./media/app-service-logic-connector-azureservicebus/img4.PNG
[5]: ./media/app-service-logic-connector-azureservicebus/img5.PNG
[6]: ./media/app-service-logic-connector-azureservicebus/img6.PNG
[7]: ./media/app-service-logic-connector-azureservicebus/img7.PNG
[8]: ./media/app-service-logic-connector-azureservicebus/img8.PNG