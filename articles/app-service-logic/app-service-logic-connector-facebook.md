<properties
   pageTitle="Using the Facebook connector in your logic app in Azure App Service"
   description="How to use the Facebook Connector in a logic app"
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
   ms.date="08/09/2015"
   ms.author="andalmia"/>


# Facebook Connector

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow.

- Facebook connector trigger will retrieve “New Post on User Timeline” or “New Post on Page”. When a new tweet is retrieved, it triggers a new instance of the flow and passes the data received in the request to the flow for processing.
- Facebook connector actions lets you “Publish Post”, “Publish Photo” and so on. These actions gets back a response and makes it available for the actions in the flow to consume.

## Triggers and Actions

Triggers | Actions
--- | ---
<ul><li>New Post on User Timeline</li><li>New Post on Page</li></ul> | <ul><li>Publish Post</li><li>Publish Photo</li></ul>



## Create the Facebook connector for your Logic App
To use the Facebook connector, you need to first create an instance of the Facebook connector API app. This can be done as follows:

1. In the Azure startboard, select **Marketplace**.
2. Search for “Facebook Connector”, select it, and select **Create**.
3. Enter the Name, App Service Plan, and other properties:  
	![][1]
4.	Select **Create**.

Once the API app instance is created, you can create a logic App in the same resource group to use the Facebook connector.
	- Facebook connector API app instance can also be created from the Logic App.
	- Open the Logic App editor and click on the Facebook Connector available in the gallery on the right hand side
	- This will create a Facebook connector API app instance in the same resource group in which the logic app has been created.


## Using the Facebook Connector in your Logic App
Once your API app is created, you can now use the Facebook connector as a trigger/action for your Logic App. To do this, you need to:

1.	In your logic app, open **Triggers and Actions** to open the Logic Apps Designer and configure your flow:  
	![][3]
2.	The Facebook connector is listed in the gallery:  
	![][4]
3. Select the Facebook connector to automatically add in the designer. Select **Authorize**, enter your credentials, and select **Allow**:  
	![][5]
	![][6]
	![][7]
	![][8]
4.	Select a trigger:  
	![][9]

You can now use the Posts retrieved from the Facebook trigger in other actions. In the below flow, whenever a new post has been posted on User’s Facebook timeline, the same post will be Tweeted in User’s Twitter Timeline:  
	![][10]

In the similar way you can create flows by using Facebook connector actions. The below flow will retrieve new message posted on Yammer group and publish the same post on Facebook page managed by User:  
	![][11]

> [AZURE.TIP] To get Facebook Page ID or Yammer Group ID, look for the numeric code in the URL.

## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

Create the API Apps using REST APIs. See [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).

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
