<properties
   pageTitle="Using the Twilio Connector in Logic Apps | Microsoft Azure App Service"
   description="How to create and configure the Twilio Connector or API app and use it in a logic app in Azure App Service"
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


# Get started with the Twilio Connector and add it to your Logic App
>[AZURE.NOTE] This version of the article applies to logic apps 2014-12-01-preview schema version. For the 2015-08-01-preview schema version, click [Twilio API](../connectors/connectors-create-api-twilio.md).

Connect to your Twilio account to send and receive SMS messages. You can also retrieve phone numbers and usage data. Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. You can add the Twilio Connector to your business workflow and process data as part of this workflow within a Logic App. 

## Creating an Twilio connector for your Logic App ##
A connector can be created within a logic app or be created directly from the Azure Marketplace. To create a connector from the Marketplace:  

1. In the Azure startboard, select **Marketplace**.
2. Search for “Twilio Connector”, select it, and select **Create**.
3. Configure the Twilio connector as follows:  
![][1]  
	- **Location** - choose the geographic location where you would like the connector to be deployed
	- **Subscription** - choose a subscription you want this connector to be created in
	- **Resource group** - select or create a resource group where the connector should reside
	- **Web hosting plan** - select or create a web hosting plan
	- **Pricing tier** - choose a pricing tier for the connector
	- **Name** - give a name for your Twilio Connector
	- **Package settings**
		- **Account SID** - The unique identifier of the account. Account SID for your account can be retrieved from <https://www.twilio.com/user/account/settings>
		- **Auth Token** - Authorization token associated with the account. Authorization Token for your account can be retrieved from <https://www.twilio.com/user/account/settings>


4.	Click on Create. A new Twilio Connector is created.
5.	Once the API app instance is created, you can create a logic App to use the Twilio connector.

## Using the Twilio Connector in your Logic App ##
Once your API app is created, you can now use the Twilio connector as an action for your Logic App. To do this, you need to:

1.	Create a new Logic App and choose the same resource group which has the Twilio Connector:  
![][2]
2.	Open “Triggers and Actions” to open the Logic Apps Designer and configure your flow:  
![][3]
3.	The Twilio connector would appear in the “API Apps in this resource group” section in the gallery on the right hand side:  
![][4]
4. You can drop the Twilio Connector API app into the editor by clicking on the “Twilio Connector”.

5.	You can now use Twilio connector in the flow. You can use the "Send Message" action in the flow to send a message. Configure the input properties for "Send Message" action as follows:
	- **From Phone Number** - Enter a Twilio phone number enabled for the type of message you wish to send. Only phone numbers or short codes purchased from Twilio will work with this connector.
	- **To Phone Number** - The destination phone number. The format accepted is: +, followed by the country code, then the phone number. For example, +16175551212. If you omit the +, Twilio will use the country code you entered in the 'From' number.
	- **Text** - The text of the message you want to send.

	![][5]  
	![][6]

## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).

<!--Image references-->
[1]: ./media/app-service-logic-connector-twilio/img1.PNG
[2]: ./media/app-service-logic-connector-twilio/img2.PNG
[3]: ./media/app-service-logic-connector-twilio/img3.png
[4]: ./media/app-service-logic-connector-twilio/img4.png
[5]: ./media/app-service-logic-connector-twilio/img5.PNG
[6]: ./media/app-service-logic-connector-twilio/img6.PNG
