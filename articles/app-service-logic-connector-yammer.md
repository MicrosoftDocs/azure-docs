<properties 
   pageTitle="Yammer Connector API App" 
   description="How to use the Yammer Connector" 
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


# Using the Yammer connector in your logic app #

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. 

Yammer connector lets you connect to Yammer and perform Post Message action and a trigger to retrieve new message.

## Creating an Yammer connector for your Logic App ##
To use the Yammer connector, you need to first create an instance of the Yammer connector API app. This can be done as follows:

1.	Open the Azure Marketplace using the + NEW option at the bottom left of the Azure Portal.
2.	Browse to “Web and Mobile > API Apps” and search for “Yammer Connector”.
3.	Configure the Yammer connector as follows:
 
	![][1]
	- **Location** - choose the geographic location where you would like the connector to be deployed
	- **Subscription** - choose a subscription you want this connector to be created in
	- **Resource group** - select or create a resource group where the connector should reside
	- **Web hosting plan** - select or create a web hosting plan
	- **Pricing tier** - choose a pricing tier for the connector
	- **Name** - give a name for your Yammer Connector 

4.	Click on Create. A new Yammer Connector will be created.
5.	Once the API app instance is created, you can create a logic App in the same resource group to use the Yammer connector. 

## Using the Yammer Connector in your Logic App ##
Once your API app is created, you can now use the Yammer connector as a trigger/action for your Logic App. To do this, you need to:

1.	Create a new Logic App and choose the same resource group which has the Yammer Connector.
 
	![][2]
2.	Open “Triggers and Actions” to open the Logic Apps Designer and configure your flow. 
 
	![][3]
3.	The Yammer connector would appear in the “API Apps in this resource group” section in the gallery on the right hand side.
 
	![][4]
4. You can drop the Yammer Connector API app into the editor by clicking on the “Yammer Connector”. Click on the Authorize button. Provide your Yammer credentials. Click “Allow”
 
	![][5]![][6]![][7]
5.	You can now use Yammer connector in the flow. You can use the new message retrieved from the Yammer trigger ("New Message") in other actions in the flow. Configure the input properties of Yammer trigger as follows:

	- **Group ID** - The ID of the group from which the new message should be retrieved. If the Group ID is not provided, the message will be retrieved from the Following Feed. Group ID can be retrieved from the Group URL in Yammer.
		Example: Group ID in the below URL is "5453203"
		https://www.yammer.com/microsoft.com/#/threads/inGroup?type=in_group&feedId=5453203
 
	![][8]![][9]

	

6.	In the similar way you can use the Yammer action in the flow to post a message by selecting "Post Message" action. Configure the input properties for "Post Message" action  as follows:
	- **Message Text** - Text content of the message to be posted
	- **Group ID** - Specify the ID of the group to which new message should be posted. If Group ID is not provided the message will be posted to All Company Feed. Group ID can be retrieved from the Group URL in Yammer. 
	Example: Group ID in the below URL is "5453203"
	https://www.yammer.com/microsoft.com/#/threads/inGroup?type=in_group&feedId=5453203
	- 	**Tag Users** - Array of user network names who needs to be tagged in the message. 
	- 	**Attachments** - Attachments to be post along with the post. It contains the following fields:
		- File Name
		- Content
		- Content transfer Encoding
		- Content Type

	![][10]![][11]




	<!--Image references-->
[1]: ./media/app-service-logic-connector-yammer/img1.png
[2]: ./media/app-service-logic-connector-yammer/img2.png
[3]: ./media/app-service-logic-connector-yammer/img3.png
[4]: ./media/app-service-logic-connector-yammer/img4.png
[5]: ./media/app-service-logic-connector-yammer/img5.png
[6]: ./media/app-service-logic-connector-yammer/img6.png
[7]: ./media/app-service-logic-connector-yammer/img7.png
[8]: ./media/app-service-logic-connector-yammer/img8.png
[9]: ./media/app-service-logic-connector-yammer/img9.png
[10]: ./media/app-service-logic-connector-yammer/img10.png
[11]: ./media/app-service-logic-connector-yammer/img11.png