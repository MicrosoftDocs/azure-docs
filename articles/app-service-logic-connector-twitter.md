<properties 
   pageTitle="Twitter Connector API App" 
   description="How to use the TwitterConnector" 
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


# Using the Twitter connector in your logic app #

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. 

Twitter Connector lets you post tweets and get tweets from your timeline, friends, and followers from your Twitter account.

- Twitter connector trigger will retrieve new tweets associated with the given keyword. When a new tweet is retrieved, it triggers a new instance of the flow and passes the data received in the request to the flow for processing. 
- Twitter connector actions lets you “Tweet”, “Search Tweets”, “Retweet”, “Get User Timeline” and so on. These actions get back a response and makes it available for the actions in the flow to consume.

## Creating an Twitter connector for your Logic App ##
To use the Twitter connector, you need to first create an instance of the Twitter connector API app. This can be done as follows:

1. Open the Azure Marketplace using the + NEW option at the bottom left of the Azure Portal.
1. Browse to “API Apps” and search for “Twitter connector”.
1. Configure the Twitter connector as follows:

	![][1]
4.	Click OK to create.
5.	Once the API app instance is created, you can create a logic App in the same resource group to use the Twitter connector. 
	- Twitter connector API app instance can also be created from the Logic App. 
	- Open the Logic App editor and click on the Twitter Connector available in the gallery on the right hand side
	- This will create a Twitter connector API app instance in the same resource group in which the logic app has been created.


## Using the Twitter Connector in your Logic App ##
Once your API app is created, you can now use the Twitter connector as a trigger/action for your Logic App. To do this, you need to:

1.	Create a new Logic App and choose the same resource group which has the Twitter connector.
 	
	![][2]
2.	Open “Triggers and Actions” to open the Logic Apps Designer and configure your flow. 
 	
	![][3]
3.	The Twitter connector would appear in the “Recently Used” section in the gallery on the right hand side. Select that.
 
	![][4]
4.	You can drop the Twitter Connector API app into the editor by clicking on the “Twitter Connector” under “Recently used” from the gallery on your right hand side. Click on the Authorize button. Provide your Twitter credentials. Click on “Authorize App”
 
	![][5]
6.	You can now use Twitter connector in the flow. You can now use the Tweets retrieved from the Twitter trigger in other actions in the flow.
 
	![][6]
7.	In the similar way you can use the Twitter actions in the flow. Select a Twitter action and configure the inputs for that respective action.

	![][7] 
	![][8]

	<!--Image references-->
[1]: ./media/app-service-logic-connector-twitter/img1.png
[2]: ./media/app-service-logic-connector-twitter/img2.png
[3]: ./media/app-service-logic-connector-twitter/img3.png
[4]: ./media/app-service-logic-connector-twitter/img4.png
[5]: ./media/app-service-logic-connector-twitter/img5.png
[6]: ./media/app-service-logic-connector-twitter/img6.png
[7]: ./media/app-service-logic-connector-twitter/img7.png
[8]: ./media/app-service-logic-connector-twitter/img8.png
