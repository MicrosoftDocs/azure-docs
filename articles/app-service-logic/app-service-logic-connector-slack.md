<properties 
	pageTitle="Using the Slack Connector in Azure App Service"
	description="How to get started with Slack Connector"
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
	ms.date="08/19/2015"
	ms.author="andalmia"/>

# Slack Connector

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
<br/>
![][1] 

4. Click **Create**. 

## Using the Connector as an Action in your Logic App

> [AZURE.IMPORTANT] The connectors and Logic apps should always be created in the same resource group. 

Once the Slack connector is created, you can add it as an action to your Logic App: 

1.	Within your Logic app, open **Triggers and Actions**.  
	[Create a new Logic App](app-service-logic-create-a-logic-app.md)

2.	The Slack connector is listed in the gallery on the right hand side:
<br/>
![][2]

3.	Select the Slack Connector you created to automatically add it to your logic app. 
4.	Select **Authorize**. Sign-in to your Slack account. Towards the end, you are asked to give permission to your connector to access your Slack account. Select **Authorizify**:
<br/>
![][3]
![][4]
![][5]
![][6]
	
5.	You can now use the Slack connector in the flow. The Post Message action is available: 
<br/>
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
