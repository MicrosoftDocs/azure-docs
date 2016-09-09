<properties 
   pageTitle="Using the Wait Connector in Logic Apps | Microsoft Azure App Service" 
   description="How to create and configure the Wait Connector or API app and use it in a logic app in Azure App Service" 
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
   ms.date="04/19/2016"
   ms.author="rajram"/>

# Get started with the Wait Connector and add it to your Logic App

>[AZURE.NOTE] We are ending support for this connector because its functionality is now included by default as the **delay action** when you create new Logic apps. We recommend that you upgrade all your Logic apps that are using this connector. This version of the article applies to logic apps 2014-12-01-preview schema version.

Wait connector enables an app to delay its execution for a specified duration or until the occurrence of a specified time. You can add the Wait Connector to your business workflow and process data as part of this workflow within a Logic App. When used in a Logic App, it can be used to delay execution.

## Using Wait Connector
To use the Wait connector, you need to first create an instance of the Wait Connector API app. This can be done either inline while creating a logic app or by selecting the Wait Connector API app from the Azure Marketplace.

## Using Wait Connector in the Logic Apps designer surface
Wait Connector can be used as an action. It does not have any triggers.

### Action
- Click on Wait Connector from the right pane:  
![List of Actions][1]
- Wait Connector supports two actions: 
	- Delay
	- Delay Until
	 
- Select *Delay*:  
![Delay input][2]
- Provide the inputs for the action and configure it:  
![Action configured][3]

Parameter|Type|Description of the parameter
---|---|---
Duration In Minutes|integer|Delay duration in minutes


## Do more with your Connector
Now that the connector is created, you can add it to a business flow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

 

<!--References -->
[1]: ./media/app-service-logic-wait/ListOfActions.PNG
[2]: ./media/app-service-logic-wait/DelayInput.PNG
[3]: ./media/app-service-logic-wait/ActionConfigured.PNG
