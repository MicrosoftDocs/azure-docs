<properties
   pageTitle="Using the Twitter Connector in Microsoft Azure App Service"
   description="How to use the Twitter Connector API App"
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
   ms.date="07/14/2015"
   ms.author="sameerch"/>


# Twitter Connector

Connect to your Twitter feed to post tweets and gets tweets from your timeline, your friends' timeline, and followers of your Twitter account. Connectors can be used in Logic Apps to retrieve, process, or push data as a part of a "workflow". When you use the Twitter Connector in your workflow, you can achieve a variety of scenarios. For example, you can:

- Get new tweets associated with a given keyword or text. When a new tweet is retrieved, it triggers a new instance of your workflow and passes the data to the next connector in your workflow. For example, you create a Twitter Connector and use the New Tweet From Search trigger to monitor #peanutbutterandjelly. Whenever there's a new tweet for #peanutbutterandjelly, your workflow (aka logic app) starts automatically.
- Using the different actions, like "Search Tweets", you take the response and use it within your workflow. For example, you can search tweets for your company name. When it's found, you can use a logic app to write this data into a SQL Server database. Then, use the SQL Server data to determine what is being tweeted about your company. 


## Triggers and Actions
*Triggers* are events that happen. For example, a new tweet can trigger or start a workflow or process. An *Action* is the result of something. For example, you can search for a specific tweet and when found, send an email or update a database. 

The Twitter Connector can be used as a trigger or an action in a logic app and supports data in JSON and XML formats. 

The Twitter Connector has the following Triggers and Actions available:

Triggers | Actions
--- | ---
New Tweet From Search | <ul><li>Get User Timeline</li><li>Search Tweets</li><li>Tweet</li><li>Get Mentions Timeline</li><li>Get Home Timeline</li><li>Get Followers</li><li>Get Friends</li><li>Get User Details</li><li>Tweet to User</li><li>Send Direct Message</li></ul>

> [AZURE.IMPORTANT] The **New Tweet** trigger has been archived. Currently, it is still available as an Advanced operation and can be used. The **Retweet** action is removed and no longer supported. If you use the Retweet action, it fails at runtime. As a result, remove the Retweet action from your logics apps. 


## Create the Twitter connector
A connector can be created within a logic app or be created directly from the Azure Marketplace. To create a connector from the Marketplace:

1. In the Azure startboard, select **Marketplace**.
2. Search for “Twitter Connector”.
3. Enter the Name, App Service Plan, and other properties:

	![][1]
4.	Click **Create**.


## Using the Twitter Connector in your Logic App
Once your API app is created, you can now use the Twitter connector as a trigger or action for your Logic Apps. To do this:

1.	Create a new Logic App or open an existing Logic App:

	![][2]
2.	Open **Triggers and Actions** to open the Logic Apps designer:

	![][3]
3.	The Twitter connector is listed on the right hand side. Select it to automatically add it to your logic app:

	![][4]
4.	Select **Authorize**, enter your Twitter credentials, and select **Authorize app**:

	![][5]


You can now configure the Twitter connector to build your workflow. You can use the Tweets retrieved from the Twitter trigger in other actions in the flow:

![][6]

In the similar way, you can use the Twitter actions in your workflow. Select a Twitter action and configure the inputs for that action:

![][7]
![][8]

## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

Create the API Apps using REST APIs. See [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).

	<!--Image references-->
[1]: ./media/app-service-logic-connector-twitter/img1.png
[2]: ./media/app-service-logic-connector-twitter/img2.png
[3]: ./media/app-service-logic-connector-twitter/img3.png
[4]: ./media/app-service-logic-connector-twitter/img4.png
[5]: ./media/app-service-logic-connector-twitter/img5.png
[6]: ./media/app-service-logic-connector-twitter/triggers.png
[7]: ./media/app-service-logic-connector-twitter/img7.png
[8]: ./media/app-service-logic-connector-twitter/actions.png
