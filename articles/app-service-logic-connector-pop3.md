<properties 
   pageTitle="POP3 Connector API App" 
   description="How to use the POP3Connector" 
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


# Using the POP3 connector in your logic app #

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. 

POP3 Connector lets you connect to a POP3 server and provides a trigger to retrieve emails with attachments.

## Creating an POP3 connector for your Logic App ##
To use the POP3 connector, you need to first create an instance of the POP3 connector API app. This can be done as follows:

1.	Open the Azure Marketplace using the + NEW option at the bottom left of the Azure Portal.
2.	Browse to “Web and Mobile > API Apps” and search for “POP3 connector”.
3.	Configure the POP3 connector as follows:
 
	![][1]
	- **Location** - choose the geographic location where you would like the connector to be deployed
	- **Subscription** - choose a subscription you want this connector to be created in
	- **Resource group** - select or create a resource group where the connector should reside
	- **Web hosting plan** - select or create a web hosting plan
	- **Pricing tier** - choose a pricing tier for the connector
	- **Name** - give a name for your POP3 Connector
	- **Package settings**
		- **User Name** Specify the user name to connect to the POP3 Server
		- **Password** Specify the password to connect to the POP3 Server
		- **Server Address** Specify the POP3 Server name or IP address
		- **Server Port** Specify the POP3 Server port number
		- **Enable SSL** Specify true to use POP3 over a secure SSL/TLS channel
4.	Click on Create. A new POP3 Connector will be created.
5.	Once the API app instance is created, you can create a logic App in the same resource group to use the POP3 connector. 

## Using the POP3 Connector in your Logic App ##
Once your API app is created, you can now use the POP3 connector as a trigger for your Logic App. To do this, you need to:

1.	Create a new Logic App and choose the same resource group which has the POP3 connector.
 
	![][2]
2.	Open “Triggers and Actions” to open the Logic Apps Designer and configure your flow. 
 
	![][3]
3.	The POP3 connector would appear in the “API Apps in this resource group” section in the gallery on the right hand side. Select that.
 
	![][4]
4.	You can drop the POP3 Connector API app into the editor by clicking on the “POP3 Connector”. 
	
5.	You can now use POP3 connector in the flow. Select "Get Email" trigger and configure frequency and interval. You can use the email retrieved from the POP3 trigger in other actions in the flow.
		 
	
	![][5]
	![][6]


	<!--Image references-->
[1]: ./media/app-service-logic-connector-pop3/img1.PNG
[2]: ./media/app-service-logic-connector-pop3/img2.PNG
[3]: ./media/app-service-logic-connector-pop3/img3.png
[4]: ./media/app-service-logic-connector-pop3/img4.PNG
[5]: ./media/app-service-logic-connector-pop3/img5.PNG
[6]: ./media/app-service-logic-connector-pop3/img6.PNG
