<properties 
	pageTitle="Slack Connector"
	description="Get started with Slack Connector"
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
	ms.date="04/21/2015"
	ms.author="andalmia"/>

# Using the Slack connector in your logic app #

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. 

Slack Connector lets you post messages to Slack channels.

## Creating a Slack connector for your Logic App ##
To use the Slack connector, you need to first create an instance of the Slack connector API app. This can be done as follows:

1.	Open the Azure Marketplace using the "+ NEW" option at the bottom left of the Azure Portal.
2.	Browse to “Web and Mobile > Azure Marketplace” and search for “Slack connector”.
3.	Configure the Slack connector as follows:
 
	![][1] 
	- **Name** - give a name for your Slack Connector
	- **App Service plan** - select or create a App Service plan
	- **Pricing tier** - choose a pricing tier for the connector
	- **Resource group** - select or create a resource group where the connector should reside
	- **Subscription** - choose a subscription you want this connector to be created in
	- **Location** - choose the geographic location where you would like the connector to be deployed

4. Click on Create. A new Slack Connector will be created.
5. Once the API app instance is created, you can create a logic App in the same resource group to use the Slack connector.

## Using the Slack Connector in your Logic App ##
Once your API app is created, you can now use the Slack connector as an action for your Logic App. To do this, you need to:

1.	Create a new Logic App and choose the same resource group which has the Slack connector. Follow instructions to [Create a new Logic App].  	
	
2.	Open “Triggers and Actions” within the created Logic App to open the Logic Apps Designer and configure your flow.  	
	
3.	The Slack connector would appear in the “API Apps in this resource group” section in the gallery on the right hand side.
 
	![][2]
4.	You can drop the Slack Connector API app into the editor by clicking on the “Slack Connector”. Click on the Authorize button. Provide your Microsoft credentials (if not automatically signed in). Sign-in to your slack account by following the steps. Towards the end, you will be asked to give permission to your connector to access your slack account. Please click "Authorizify"
 
	![][3]
	![][4]
	![][5]
	![][6]
	
5.	You can now use the Slack connector in the flow. Currently, triggers are not available within the Slack connector. The Actions available are - Post Message
 
	![][7]

6.	Lets walk through the "Post Message" experience. You can use this action to post a message to any Slack Channel.
 
	![][8]

	Configure the input properties for "Post Message" action as follows:

 - **Text** - Specify the text of the message to be posted
 - **Channel Name** - Specify the Slack Channel to which this message is to be uploaded. If this is not provided, then message will be posted in #general

 	**Advanced Properties**
 	- **Bot User name** - Name of the bot to use for this message. Message will be posted as "Bot" if this is not specified.
 	- **Icon URL** - URL to an image to use as the icon for this message
 	- **Icon Emoji** - Emoji to use as the icon for this message. Overrides Icon URL
 

7. To use the connector outside of a logic App, the REST APIs exposed by the connector can be leveraged. You can view this API Definitions using Browse->Api App->Slack Connector. Now click on the API Definition lens under the Summary Section to view all the APIs exposed by this connector.

	![][9]

9. Details of the APIs can also be found at [Slack API Definition].

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

<!-- Links -->
[Create a new Logic App]: app-service-logic-create-a-logic-app.md
[Slack API Definition]: https://msdn.microsoft.com/en-us/library/dn708020.aspx