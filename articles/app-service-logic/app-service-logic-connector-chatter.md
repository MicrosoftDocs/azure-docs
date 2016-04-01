<properties
   pageTitle="Using the Chatter Connector in Logic Apps | Microsoft Azure App Service"
   description="How to create and configure the Chatter Connector or API app and use it in a logic app in Azure App Service"
   services="app-service\logic"
   documentationCenter=".net,nodejs,java"
   authors="anuragdalmia"
   manager="erikre"
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="02/10/2016"
   ms.author="sameerch"/>


# Get started with the Chatter Connector and add it to your Logic App 
>[AZURE.NOTE] This version of the article applies to logic apps 2014-12-01-preview schema version.

Connect to Chatter and post a message or search a feed. For example, you can search a Chatter feed and when you find something specific, you can post that Chatter message to a Sales group.

You can add the Chatter connector to your business workflow and process data as part of this workflow within a Logic App. 

## Triggers and Actions

A Trigger starts a new instance based on a specific event, like the arrival of a new Chatter message. An Action is the result, like after receiving a new Chatter message, then post the message to another Chatter group,  or another social media site, like Facebook or Twitter.

The Chatter Connector can be used as a trigger or an action in a logic app and supports data in JSON and XML formats. The Chatter connector has the following Triggers and Actions available:

Triggers | Actions
--- | ---
New Message | <ul><li>Post Message</li><li>Search</li></ul>


## Create the Chatter connector for your Logic App
A connector can be created within a logic app or be created directly from the Azure Marketplace. To create a connector from the Marketplace:  

1. In the Azure startboard, select **Marketplace**.
2. Search for “Chatter Connector”, select it, and select **Create**.
3. Enter the Name, App Service Plan, and other properties:  
	![][1]  
	- **Location** - choose the geographic location where you would like the connector to be deployed
	- **Subscription** - choose a subscription you want this connector to be created in
	- **Resource group** - select or create a resource group where the connector should reside
	- **Web hosting plan** - select or create a web hosting plan
	- **Pricing tier** - choose a pricing tier for the connector
	- **Name** - give a name for your Chatter Connector

4. Select **Create**.


## Using the Chatter Connector in your Logic App
Once your API app is created, you can now use the Chatter connector as a trigger or action in your Logic App. To do this:

1. In your logic app, open **Triggers and Actions** to open the Logic Apps Designer and configure your flow.

2. The Chatter connector is listed in the gallery:  
	![][4]
3. Select the Chatter connector to automatically add in the designer. Select **Authorize**, enter your credentials, and select **Allow**:  
	![][5]
	![][6]
	![][7]

You can now use Chatter connector in the flow. You can use the new message retrieved from the Chatter trigger ("New Message") in other actions in the flow. Configure the input properties for the Chatter trigger as follows:

**Group ID** - Enter the ID of the group from which new message should be retrieved. If Group ID is not provided, then new message is retrieved from the User’s Feed:  
	![][8]
	![][9]


In the similar way you can use the Chatter action in the flow to post a message by selecting "Post Message" action. Configure the input properties for "Post Message" action as follows:  
	- **Message Text** - Text content of the message to be posted
	- **Group ID** - Specify the ID of the group to which new message should be posted. If group ID is not provided, the message will be posted to user’s feed.
	- 	**File Name** - Name of the file to be attached with this message
	- 	**Content Data** - Content Data of the attachment
	- 	**Content Type** - Content Type of the Attachment
	- 	**Content Transfer Encoding** - Content Transfer Encoding of the attachment (“none”|”base64”)
	- 	**Mentions** - Array of user names to be tagged in this message
	- 	**Hashtags** - Array of hashtags to be posted along the message  

![][10]
![][11]

## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).


<!--Image references-->
[1]: ./media/app-service-logic-connector-chatter/img1.PNG
[2]: ./media/app-service-logic-connector-chatter/img2.PNG
[3]: ./media/app-service-logic-connector-chatter/img3.png
[4]: ./media/app-service-logic-connector-chatter/img4.png
[5]: ./media/app-service-logic-connector-chatter/img5.PNG
[6]: ./media/app-service-logic-connector-chatter/img6.PNG
[7]: ./media/app-service-logic-connector-chatter/img7.PNG
[8]: ./media/app-service-logic-connector-chatter/img8.PNG
[9]: ./media/app-service-logic-connector-chatter/img9.PNG
[10]: ./media/app-service-logic-connector-chatter/img10.PNG
[11]: ./media/app-service-logic-connector-chatter/img11.PNG
