<properties
   pageTitle="Using the Facebook Connector in Logic Apps | Microsoft Azure App Service"
   description="How to create and configure the Facebook Connector or API app and use it in a logic app in Azure App Service"
   services="app-service\logic"
   documentationCenter=".net,nodejs,java"
   authors="rajeshramabathiran"
   manager="erikre"
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="03/16/2016"
   ms.author="rajram"/>


# Get started with the Facebook Connector and add it to your Logic App
>[AZURE.NOTE] This version of the article applies to logic apps 2014-12-01-preview schema version. For the 2015-08-01-preview schema version, click [Facebook API](../connectors/connectors-create-api-facebook.md).

Connect to Facebook account to post a message or publish a photo. Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. 

With the Facebook Connector, you can:

- Use triggers to retrieve “New Post on User Timeline” or “New Post on Page”. When a new post is retrieved, it triggers a new instance of the flow and passes the data received in the request to the flow for processing.
- Use actions that let you “Publish Post”, “Publish Photo”, and so on. These actions gets back a response and makes it available for the actions in the flow to consume.

You can add the Facebook Connector to your business workflow and process data as part of this workflow within a Logic App. 

## Triggers and Actions

Triggers | Actions
--- | ---
<ul><li>New Post on User Timeline</li><li>New Post on Page</li></ul> | <ul><li>Publish Post</li><li>Publish Photo</li></ul>



## Create the Facebook connector for your Logic App
A connector can be created within a logic app or be created directly from the Azure Marketplace. To create a connector from the Marketplace:  

1. In the Azure startboard, select **Marketplace**.
2. Search for “Facebook Connector”, select it, and select **Create**.
3. Enter the Name, App Service Plan, and other properties:  
	![][1]
4.	Select **Create**.


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

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

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
