<properties
   pageTitle="Using the Azure Service Bus Connector in Logic Apps | Microsoft Azure App Service"
   description="How to create and configure the Azure Service Bus Connector or API app and use it in a logic app in Azure App Service"
   services="logic-apps"
   documentationCenter=".net,nodejs,java"
   authors="rajeshramabathiran"
   manager="erikre"
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="03/16/2016"
   ms.author="rajram"/>


# Get started with the Azure Service Bus Connector and add it to your Logic App 
>[AZURE.NOTE] This version of the article applies to logic apps 2014-12-01-preview schema version. For the 2015-08-01-preview schema version, click [Service Bus API](../connectors/connectors-create-api-servicebus.md).

Connect to Azure Service Bus to send messages to Queues and Topics and receive messages from Queues and Subscriptions. Connectors are used in Logic Apps as a part of a "workflow". 

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
2. Search for “Azure Service Bus connector”, select it, and select **Create**.
3. Enter the Name, App Service Plan, and other properties:  
	![][1]

4. Enter the following package settings:

	Name | Description
--- | ---
Connection String | The connection string for Azure Service Bus. For example, enter: *Endpoint=sb://[namespace].servicebus.windows.net;SharedAccessKeyName=[name];SharedAccessKey=[key]*.
Entity Name | Enter the name of the Queue or Topic.
Subscription Name | Enter the name of the Subscription to receive messages from.

5. Click **Create**.

## Using the Service Bus Connector in your Logic App
Once your connector is created, you can now use the Azure Service Bus connector as a trigger or action for your Logic App. To do this:

1.	Create a new Logic App and choose the same resource group that has the Azure Service Bus Connector:  
	![][2]

2.	Open “Triggers and Actions” to open the Logic Apps designer and configure your workflow:  
	![][3]

3. The Azure Service Bus connector appears in the “API Apps in this resource group” section in the gallery on the right hand side:  
	![][4]

4. You can drop the Azure Service Bus Connector into the editor by clicking on the “Azure Service Bus Connector”.

5.	You can now use Azure Service Bus connector in the workflow. You can use the message retrieved from the Azure Service Bus trigger ("Message Available") in other actions in the flow:  
	![][5]  

	![][6]

You can also use the Azure Service Bus "Send Message" action:  
![][7]  

![][8]

## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).


<!--Image references-->
[1]: ./media/app-service-logic-connector-azureservicebus/img1.PNG
[2]: ./media/app-service-logic-connector-azureservicebus/img2.PNG
[3]: ./media/app-service-logic-connector-azureservicebus/img3.png
[4]: ./media/app-service-logic-connector-azureservicebus/img4.PNG
[5]: ./media/app-service-logic-connector-azureservicebus/img5.PNG
[6]: ./media/app-service-logic-connector-azureservicebus/img6.PNG
[7]: ./media/app-service-logic-connector-azureservicebus/img7.PNG
[8]: ./media/app-service-logic-connector-azureservicebus/img8.PNG
