<properties 
   pageTitle="Using the Azure Service Bus Connector in Azure App Service" 
   description="How to use the Azure Service Bus Connector" 
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
   ms.date="06/24/2015"
   ms.author="adgoda"/>


# Azure Service Bus connector

Azure Service Bus connector lets you send messages from Service Bus entities like Queues and Topics and receive messages from Service Bus entities like Queues and Subscriptions. 

## Triggers and Actions
Triggers are events that happen. For example, when an order is updated or when a new customer is added. An Action is the result of the trigger. For example, when an order or a new message is put in a queue, send an alert or a message.  

The Azure Service Bus Connector can be used as a trigger or an action in a logic app and supports data in JSON and XML formats.

The Azure Service Bus Connector has the following Triggers and Actions available: 

Triggers | Actions
--- | ---
Message Available | Send message 

## Create the Azure Service Bus connector
A connector can be created within a logic app or be created directly from the Azure Marketplace. To create a connector from the Marketplace:  

1. In the Azure startboard, select **Marketplace**.
2. Select **API Apps** and search for “Azure Service Bus connector”.
3. Enter the Name, App Service Plan, and other properties:
<br/>
![][1]

4. Enter the following package settings:

	Name | Description 
--- | ---
Connection String | The connection string for Azure Service Bus. For example, enter: *Endpoint=sb://[namespace].servicebus.windows.net;SharedAccessKeyName=[name];SharedAccessKey=[key]*.
Entity Name | Enter the name of the Queue or Topic.
Subscription Name | Enter the name of the Subscription to receive messages from. 

5. Click **Create**. 

Once the API app instance is created, you can create a logic App in the same resource group to use the Azure Service Bus connector. 

## Using the Service Bus Connector in your Logic App
Once your API app is created, you can now use the Azure Service Bus connector as a trigger or action for your Logic App. To do this:

1.	Create a new Logic App and choose the same resource group that has the Azure Service Bus Connector:
<br/>
![][2]

2.	Open “Triggers and Actions” to open the Logic Apps Designer and configure your workflow:
<br/>
![][3]

3. The Azure Service Bus connector appears in the “API Apps in this resource group” section in the gallery on the right hand side:
<br/>
![][4]

4. You can drop the Azure Service Bus Connector API app into the editor by clicking on the “Azure Service Bus Connector”.
 
5.	You can now use Azure Service Bus connector in the workflow. You can use the message retrieved from the Azure Service Bus trigger ("Message Available") in other actions in the flow:
<br/>
![][5]
<br/>
![][6] 

In the similar way, you can use the Azure Service Bus action "Send Message":
<br/>
![][7]
<br/>
![][8]

## Do more with your Connector
More on logic apps at [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

Create the API Apps using REST APIs. See [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage  and Monitor API apps and connector](../app-service-api/app-service-api-manage-in-portal.md).


	<!--Image references-->
[1]: ./media/app-service-logic-connector-azureservicebus/img1.PNG
[2]: ./media/app-service-logic-connector-azureservicebus/img2.PNG
[3]: ./media/app-service-logic-connector-azureservicebus/img3.png
[4]: ./media/app-service-logic-connector-azureservicebus/img4.PNG
[5]: ./media/app-service-logic-connector-azureservicebus/img5.PNG
[6]: ./media/app-service-logic-connector-azureservicebus/img6.PNG
[7]: ./media/app-service-logic-connector-azureservicebus/img7.PNG
[8]: ./media/app-service-logic-connector-azureservicebus/img8.PNG 
