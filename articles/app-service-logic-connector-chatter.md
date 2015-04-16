<properties 
   pageTitle="Chatter Connector API App" 
   description="How to use the Chatter Connector" 
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


# Using the Chatter connector in your logic app #

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. 

Chatter Connector lets you connect to Chatter and perform various actions such as Post Message, Search and a trigger to retrieve new messages.

## Creating an Chatter connector for your Logic App ##
To use the Chatter connector, you need to first create an instance of the Chatter connector API app. This can be done as follows:

1.	Open the Azure Marketplace using the + NEW option at the bottom left of the Azure Portal.
2.	Browse to “Web and Mobile > API Apps” and search for “Chatter Connector”.
3.	Configure the Chatter connector as follows:
 
	![][1]
	- **Location** - choose the geographic location where you would like the connector to be deployed
	- **Subscription** - choose a subscription you want this connector to be created in
	- **Resource group** - select or create a resource group where the connector should reside
	- **Web hosting plan** - select or create a web hosting plan
	- **Pricing tier** - choose a pricing tier for the connector
	- **Name** - give a name for your Chatter Connector 

4.	Click on Create. A new Chatter Connector will be created.
5.	Once the API app instance is created, you can create a logic App in the same resource group to use the Chatter connector. 

## Using the Chatter Connector in your Logic App ##
Once your API app is created, you can now use the Chatter connector as a trigger/action for your Logic App. To do this, you need to:

1.	Create a new Logic App and choose the same resource group which has the Chatter Connector.
 
	![][2]
2.	Open “Triggers and Actions” to open the Logic Apps Designer and configure your flow. 
 
	![][3]
3.	The Chatter connector would appear in the “API Apps in this resource group” section in the gallery on the right hand side.
 
	![][4]
4. You can drop the Chatter Connector API app into the editor by clicking on the “Chatter Connector”. Click on the Authorize button. Provide your credentials. Click “Allow”
 
	![][5]
	![][6]
	![][7]
5.	You can now use Chatter connector in the flow. You can use the new message retrieved from the Chatter trigger ("New Message") in other actions in the flow. Configure the input properties for the Chatter trigger as follows:
	- **Group ID** - Specify the ID of the group from which new message should be retrieved. If Group ID is not provided then new message will be retrieved from the User’s Feed. 

 
	![][8]
	![][9]


6. In the similar way you can use the Chatter action in the flow to post a message by selecting "Post Message" action. Configure the input properties for "Post Message" action as follows:
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