<properties 
   pageTitle="Facebook Connector API App" 
   description="How to use the FacebookConnector" 
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
   ms.date="03/20/2015"
   ms.author="adgoda"/>


# Using the Facebook connector in your logic app #

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. 

Facebook Connector lets you retrieve “New Post on User Timeline”, “New Post on Page”, “Publish Post”, “Publish Photo” and so on from your Facebook account.

- Facebook connector trigger will retrieve “New Post on User Timeline” or “New Post on Page”. When a new tweet is retrieved, it triggers a new instance of the flow and passes the data received in the request to the flow for processing. 
- Facebook connector actions lets you “Publish Post”, “Publish Photo” and so on. These actions gets back a response and makes it available for the actions in the flow to consume.

## Creating an Facebook connector for your Logic App ##
To use the Facebook connector, you need to first create an instance of the Facebook connector API app. This can be done as follows:

1.	Open the Azure Marketplace using the + NEW option at the bottom left of the Azure Portal.
2.	Browse to “Web and Mobile > API apps” and search for “Facebook connector”.
3.	Configure the Facebook connector as follows:
 
	![][1]
4.	Click OK to create.
5.	Once the API app instance is created, you can create a logic App in the same resource group to use the Facebook connector. 
	- Facebook connector API app instance can also be created from the Logic App. 
	- Open the Logic App editor and click on the Facebook Connector available in the gallery on the right hand side
	- This will create a Facebook connector API app instance in the same resource group in which the logic app has been created.


## Using the Facebook Connector in your Logic App ##
Once your API app is created, you can now use the Facebook connector as a trigger/action for your Logic App. To do this, you need to:

1.	Create a new Logic App and choose the same resource group which has the Facebook connector.
 
	![][2]
2.	Open “Triggers and Actions” to open the Logic Apps Designer and configure your flow. 
 
	![][3]
3.	The Facebook connector would appear in the “Recently Used” section in the gallery on the right hand side. Select that.
 
	![][4]
4.	You can drop the Facebook Connector API app into the editor by clicking on the “Facebook Connector” under “Recently used” from the gallery on your right hand side. Click on the Authorize button. Provide your Facebook credentials.
  
	![][5]
5.	Allow “Azure AppService Logic Apps” 

	![][6]
	![][7]
	![][8]     
6.	Select a trigger.
 
	![][9]
7.	You can now use the Posts retrieved from the Facebook trigger in other actions. In the below flow, whenever a new post has been posted on User’s Facebook timeline, the same post will be Tweeted in User’s Twitter Timeline.
 
	![][10]
8.	In the similar way you can create flows by using Facebook connector actions. The below flow will retrieve new message posted on Yammer group and publish the same post on Facebook page managed by User
 
	![][11]

**TIP** - To get Facebook Page ID or Yammer Group id look for the numeric code in the url.

<!--Image references-->
[1]: ./media/app-service-logic-connector-facebook/img1.png
[2]: ./media/app-service-logic-connector-facebook/img2.png
[3]: ./media/app-service-logic-connector-facebook/img3.png
[4]: ./media/app-service-logic-connector-facebook/img4.png
[5]: ./media/app-service-logic-connector-facebook/img5.png
[6]: ./media/app-service-logic-connector-facebook/img6.png
[7]: ./media/app-service-logic-connector-facebook/img7.png
[8]: ./media/app-service-logic-connector-facebook/img8.png
[9]: ./media/app-service-logic-connector-facebook/img9.png
[10]: ./media/app-service-logic-connector-facebook/img10.png
[11]: ./media/app-service-logic-connector-facebook/img11.png
