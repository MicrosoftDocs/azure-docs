<properties 
   pageTitle="Twilio Connector API App" 
   description="How to use the TwilioConnector" 
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


# Using the Twilio connector in your logic app #

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. 

Twilio connector lets you send and receive SMSes from your Twilio account. It also lets you retrieve phone numbers, and usage data.

## Creating an Twilio connector for your Logic App ##
To use the Twilio connector, you need to first create an instance of the Twilio connector API app. This can be done as follows:

1.	Open the Azure Marketplace using the + NEW option at the bottom left of the Azure Portal.
2.	Browse to “API Apps” and search for “Twilio connector”.
3.	Configure the Twilio connector as follows:
 
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


4.	Click on Create. A new Twilio Connector will be created.
5.	Once the API app instance is created, you can create a logic App in the same resource group to use the Twilio connector. 

## Using the Twilio Connector in your Logic App ##
Once your API app is created, you can now use the Twilio connector as an action for your Logic App. To do this, you need to:

1.	Create a new Logic App and choose the same resource group which has the Twilio Connector.
 
	![][2]
2.	Open “Triggers and Actions” to open the Logic Apps Designer and configure your flow. 
 
	![][3]
3.	The Twilio connector would appear in the “API Apps in this resource group” section in the gallery on the right hand side.
 
	![][4]
4. You can drop the Twilio Connector API app into the editor by clicking on the “Twilio Connector”.
 
5.	You can now use Twilio connector in the flow. You can use the "Send Message" action in the flow to send a message. Configure the input properties for "Send Message" action as follows:
	- **From Phone Number** - Enter a Twilio phone number enabled for the type of message you wish to send. Only phone numbers or short codes purchased from Twilio will work with this connector.
	- **To Phone Number** - The destination phone number. The format accepted is: +, followed by the country code, then the phone number. For example, +16175551212. If you omit the +, Twilio will use the country code you entered in the 'From' number.
	- **Text** - The text of the message you want to send.
 
	![][5]
	![][6] 



	<!--Image references-->
[1]: ./media/app-service-logic-connector-twilio/img1.PNG
[2]: ./media/app-service-logic-connector-twilio/img2.PNG
[3]: ./media/app-service-logic-connector-twilio/img3.png
[4]: ./media/app-service-logic-connector-twilio/img4.png
[5]: ./media/app-service-logic-connector-twilio/img5.PNG
[6]: ./media/app-service-logic-connector-twilio/img6.PNG
