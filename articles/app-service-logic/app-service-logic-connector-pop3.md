<properties
   pageTitle="Using the POP3 connector in Logic apps | Microsoft Azure App Service"
   description="How to create and configure the POP3 connector or API app and use it in a Logic app in Azure App Service"
   services="logic-apps"
   documentationCenter=".net,nodejs,java"
   authors="anuragdalmia"
   manager="erikre"
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="05/31/2016"
   ms.author="sameerch"/>


# Get started with the POP3 connector and add it to your Logic app
>[AZURE.NOTE] This version of the article applies to Logic apps 2014-12-01-preview schema version.

Connect to a POP3 server to retrieve emails, including emails with attachments.

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. You can add the POP3 connector to your business workflow and process data as part of this workflow within a Logic app. 


## Creating an POP3 connector for your Logic app ##
To use the POP3 connector, you need to first create an instance of the POP3 connector API app. This can be done from either the Logic app designer directly or outside it. Creating an instance outside the designer can be done as follows:

1.	Open the Azure Marketplace from the homepage of Azure Portal.
2.	Under "Everything", search for “POP3 connector”.
3.	Configure the POP3 connector as follows:

	![][1]
	- **Location** - choose the geographic location where you would like the connector to be deployed
	- **Subscription** - choose a subscription you want this connector to be created in
	- **Resource group** - select or create a resource group where the connector should reside
	- **Web hosting plan** - select or create a web hosting plan
	- **Pricing tier** - choose a pricing tier for the connector
	- **Name** - give a name for your POP3 connector
	- **Package settings**
		- **User Name** Specify the user name to connect to the POP3 Server
		- **Password** Specify the password to connect to the POP3 Server
		- **Server Address** Specify the POP3 Server name or IP address
		- **Server Port** Specify the POP3 Server port number
		- **Enable SSL** Specify true to use POP3 over a secure SSL/TLS channel
4.	Click on Create. A new POP3 connector will be created.
5.	Once the API app instance is created, you can create a Logic App in the same resource group to use the POP3 connector.

## Using the POP3 connector in your Logic app ##
Once your API app is created, you can now use the POP3 connector as a trigger for your Logic app. To do this, you need to:

1.	Create a new Logic app and choose the same resource group which has the POP3 connector.

	![][2]
2.	Open “Triggers and Actions” to open the Logic apps Designer and configure your flow.

	![][3]
3.	The POP3 connector would appear in the “API Apps in this resource group” section in the gallery on the right hand side. Select that.

	![][4]
4.	You can drop the POP3 connector API app into the editor by clicking on the “POP3 connector”.

5.	You can now use POP3 connector in the flow. Select "Get Email" trigger and configure frequency and interval. You can use the email retrieved from the POP3 trigger in other actions in the flow.
		 

	![][5]
	![][6]

## Do more with your connector
Now that the connector is created, you can add it to a business workflow using a Logic app. See [What are Logic apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic app](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter Logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and connectors](app-service-logic-monitor-your-connectors.md).


<!--Image references-->
[1]: ./media/app-service-logic-connector-pop3/img1.PNG
[2]: ./media/app-service-logic-connector-pop3/img2.PNG
[3]: ./media/app-service-logic-connector-pop3/img3.png
[4]: ./media/app-service-logic-connector-pop3/img4.PNG
[5]: ./media/app-service-logic-connector-pop3/img5.PNG
[6]: ./media/app-service-logic-connector-pop3/img6.PNG
