<properties 
	pageTitle="Using the Slack Connector in Logic Apps | Microsoft Azure App Service"
	description="How to create and configure the Slack Connector or API app and use it in a logic app in Azure App Service"
	authors="rajeshramabathiran" 
	manager="erikre" 
	editor="" 
	services="app-service\logic" 
	documentationCenter=""/>

<tags
	ms.service="app-service-logic"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/16/2016"
	ms.author="rajram"/>

# Get started with the Slack Connector and add it to your Logic App
>[AZURE.NOTE] This version of the article applies to logic apps 2014-12-01-preview schema version. For the 2015-08-01-preview schema version, click [Slack API](../connectors/connectors-create-api-slack.md).

Connect to Slack channels and post messages to your team. Connectors can be used in Logic Apps as a part of a "workflow" to do different tasks. When you use the Slack Connector in your workflow, you can achieve a variety of scenarios using other connectors. For example, you can use the [Facebook Connector](app-service-logic-connector-facebook.md) in your workflow to post a message to your Slack channel. 

## Triggers and Actions
*Triggers* are events that happen. For example, when an order is updated or when a new customer is added. An *Action* is the result of the trigger. For example, when an order is updated, send an alert to the salesperson. Or, when a new customer is added, send a welcome email to the new customer. 

The Slack Connector can be used as an action in a logic app and supports data in JSON and XML formats. Currently, there are no triggers available for the Slack Connector. 

The Slack Connector has the following Triggers and Actions available: 

Triggers | Actions
--- | ---
None | Post Message

## Create the Slack connector
A connector can be created within a logic app or be created directly from the Azure Marketplace. To create a connector from the Marketplace: 

1. In the Azure startboard, select **Marketplace**.
2. Select **API Apps** and search for “Slack Connector”.
3. Enter the Name, App Service Plan, and other properties:  
![][1] 

4. Click **Create**. 

## Using the Connector as an Action in your Logic App

> [AZURE.IMPORTANT] The connectors and Logic apps should always be created in the same resource group. 

Once the Slack connector is created, you can add it as an action to your Logic App: 

1.	Within your Logic app, open **Triggers and Actions**.  
	[Create a new Logic App](app-service-logic-create-a-logic-app.md)

2.	The Slack connector is listed in the gallery on the right hand side:  
![][2]

3.	Select the Slack Connector you created to automatically add it to your logic app. 
4.	Select **Authorize**. Sign-in to your Slack account. Towards the end, you are asked to give permission to your connector to access your Slack account. Select **Authorizify**:  
![][3]  
![][4]  
![][5]  
![][6]  
	
5.	You can now use the Slack connector in the flow. The Post Message action is available:  
![][7]


Lets walk through the "Post Message" experience. You can use this action to post a message to any Slack Channel:  
![][8]

Configure the input properties for "Post Message" action:

Property | Description
--- | ---
Text | Enter the text of the message to be posted.
Channel Name | Enter the Slack Channel where this message is posted. If the channel is not entered, then the message is posted to #general.
Advanced Properties | **Bot User name**: Name of the bot to use for this message. The message is posted as "Bot" if this is not entered.<p><p>**Icon URL**: The image URL to use as the icon for this message.<p><p>**Icon Emoji**: Emoji to use as the icon for this message. This property overrides the Icon URL property.


The Slack connector has REST APIs available so you can use the connector outside of a Logic App. Open your Slack Connector and select **API definition**:  
![][9]


## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).


<!-- Image reference -->
[1]: ./media/app-service-logic-connector-slack/img1.PNG
[2]: ./media/app-service-logic-connector-slack/img2.PNG
[3]: ./media/app-service-logic-connector-slack/img3.PNG
[4]: ./media/app-service-logic-connector-slack/img4.PNG
[5]: ./media/app-service-logic-connector-slack/img5.PNG
[6]: ./media/app-service-logic-connector-slack/img6.PNG
[7]: ./media/app-service-logic-connector-slack/img7.PNG
[8]: ./media/app-service-logic-connector-slack/img8.PNG
[9]: ./media/app-service-logic-connector-slack/img9.PNG
