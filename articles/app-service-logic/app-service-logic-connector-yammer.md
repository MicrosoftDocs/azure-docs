<properties
   pageTitle="Using the Yammer Connector in Logic Apps | Microsoft Azure App Service"
   description="How to create and configure the Yammer Connector or API app and use it in a logic app in Azure App Service"
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
   ms.date="03/16/2016"
   ms.author="sameerch"/>


# Using the Yammer connector in your logic app #
>[AZURE.NOTE] This version of the article applies to logic apps 2014-12-01-preview schema version. For the 2015-08-01-preview schema version, click [Yammer API](../connectors/connectors-create-api-yammer.md).

Connect to Yammer and Post Messages action and a trigger to retrieve new message.

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow.

## Creating an Yammer connector for your Logic App ##
To use the Yammer connector, you need to first create an instance of the Yammer connector API app. This can be done as follows:

1. In the Azure startboard, select **Marketplace**.
2. Search for “Yammer Connector”, select it, and select **Create**.
3. Configure the Yammer connector as follows:  
![][1]

	- **Location** - choose the geographic location where you would like the connector to be deployed
	- **Subscription** - choose a subscription you want this connector to be created in
	- **Resource group** - select or create a resource group where the connector should reside
	- **App Service plan** - select or create a web hosting plan
	- **Pricing tier** - choose a pricing tier for the connector
	- **Name** - give a name for your Yammer Connector

4. Click on Create. A new Yammer Connector is created.
5. Once the API app instance is created, you can create a logic App to use the Yammer connector.

## Using the Yammer Connector in your Logic App ##
Once your API app is created, you can now use the Yammer connector as a trigger/action for your Logic App. To do this, you need to:

1.	Create a new Logic App:  
![][2]

2.	Open “Triggers and Actions” to open the Logic Apps Designer and configure your flow:  
![][3]

3.	The Yammer connector would appear in the “API Apps in this resource group” section in the gallery on the right hand side:  
![][4]

4. You can drop the Yammer Connector API app into the editor by clicking on the “Yammer Connector”. Click on the Authorize button. Provide your Yammer credentials. Click “Allow”:  
![][5]  
![][6]  
![][7]

You can now use Yammer connector in the flow.

## Use the Yammer connector as a trigger

You can use the new message retrieved from the Yammer trigger ("New Message") in other actions in the flow. Configure the input properties of Yammer trigger as follows:

- **Group ID** - The ID of the group from which the new message should be retrieved. If the Group ID is not provided, the message will be retrieved from the Following Feed. Group ID can be retrieved from the Group URL in Yammer.
		
	Example: Group ID in the following URL is "5453203":  
https://www.yammer.com/microsoft.com/#/threads/inGroup?type=in_group&feedId=5453203  
![][8]  
![][9]

## Use the Yammer connector to post a message

You can also use the Yammer connector as an action in your logic apps. First, specify a trigger for your logic app or check 'run this logic manually' (as shown below). Add the yammer connector, authorize as appropriate and choose the "Post Message" action. Configure the input properties for "Post Message" action  as follows:

- **Message Text** - Text content of the message to be posted
- **Group ID** - Specify the ID of the group to which new message should be posted. If Group ID is not provided the message will be posted to All Company Feed. Group ID can be retrieved from the Group URL in Yammer.  

	Example: Group ID in the following URL is "5453203":  
https://www.yammer.com/microsoft.com/#/threads/inGroup?type=in_group&feedId=5453203
- 	**Tag Users** - Array of user network names who needs to be tagged in the message:  
![][10]  
![][11]

## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).

<!--Image references-->
[1]: ./media/app-service-logic-connector-yammer/img1.PNG
[2]: ./media/app-service-logic-connector-yammer/img2.PNG
[3]: ./media/app-service-logic-connector-yammer/img3.png
[4]: ./media/app-service-logic-connector-yammer/img4.png
[5]: ./media/app-service-logic-connector-yammer/img5.PNG
[6]: ./media/app-service-logic-connector-yammer/img6.PNG
[7]: ./media/app-service-logic-connector-yammer/img7.png
[8]: ./media/app-service-logic-connector-yammer/img8.PNG
[9]: ./media/app-service-logic-connector-yammer/img9.PNG
[10]: ./media/app-service-logic-connector-yammer/img10.PNG
[11]: ./media/app-service-logic-connector-yammer/img11.PNG
