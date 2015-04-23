<properties 
   pageTitle="SMTP Connector API App" 
   description="How to use the SMTPConnector" 
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


# Using the SMTP connector in your logic app #

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. 

SMTP Connector lets you connect to a SMTP server and perform an action to send email with attachments. SMTP connector "Send Email" action lets you send email to the specified email address(es). 

## Creating an SMTP connector for your Logic App ##
To use the SMTP connector, you need to first create an instance of the SMTP connector API app. This can be done as follows:

1.	Open the Azure Marketplace using the + NEW option at the bottom left of the Azure Portal.
2.	Browse to “Web and Mobile > Azure Marketplace” and search for “SMTP connector”.
3.	Configure the SMTP connector as follows:
 
	![][1]
	- **Location** - choose the geographic location where you would like the connector to be deployed
	- **Subscription** - choose a subscription you want this connector to be created in
	- **Resource group** - select or create a resource group where the connector should reside
	- **Web hosting plan** - select or create a web hosting plan
	- **Pricing tier** - choose a pricing tier for the connector
	- **Name** - give a name for your SMTP Connector
	- **Package settings**
		- **User Name** Specify the user name to connect to the SMTP Server
		- **Password** Specify the password to connect to the SMTP Server
		- **Server Address** Specify the SMTP Server name or IP address
		- **Server Port** Specify the SMTP Server port number
		- **Enable SSL** Specify true to use SMTP over a secure SSL/TLS channel
4.	Click on Create. A new SMTP Connector will be created.
5.	Once the API app instance is created, you can create a logic App in the same resource group to use the SMTP connector. 

## Using the SMTP Connector in your Logic App ##
Once your API app is created, you can now use the SMTP connector as an action for your Logic App. To do this, you need to:

1.	Create a new Logic App and choose the same resource group which has the SMTP connector.
 
	![][2]
2.	Open “Triggers and Actions” to open the Logic Apps Designer and configure your flow. 
 
	![][3]
3.	The SMTP connector would appear in the “API Apps in this resource group” section in the gallery on the right hand side. Select that.
 
	![][4]
4.	You can drop the SMTP Connector API app into the editor by clicking on the “SMTP Connector”. 
	
7.	You can now use SMTP connector in the flow. Select "Send Email" action and configure the input properties as follows:
	- **To** - This is the email address of recipient(s). Separate multiple email addresses using a semicolon (;). For example: recipient1@domain.com;recipient2@domain.com.
	- **Cc** - This is the email address of the carbon copy recipient(s). Separate multiple email addresses using a semicolon (;). For example: recipient1@domain.com;recipient2@domain.com.
	- **Subject** - This is the subject of the email.
	- **Body** - This is the body of the email.
	- **Is HTML** - When this property is set to true, the contents of the body will be sent as HTML.
	- **Bcc** - This is the email address of recipient(s) for blind carbon copy. Separate multiple email addresses using a semicolon (;). For example: recipient1@domain.com;recipient2@domain.com.
	- **Importance** - This is the Importance of the email. The options are Normal, Low, High.
	- **Attachments** - Attachments to be sent along with the email. It contains the following fields:
		- Content (String)
		- Content transfer Encoding (Enum) (“none”|”base64”)
		- Content Type (String)
		- Content ID (String)
		- File Name (String)
	 
	
	![][5] 
	![][6]


	<!--Image references-->
[1]: ./media/app-service-logic-connector-smtp/img1.PNG
[2]: ./media/app-service-logic-connector-smtp/img2.PNG
[3]: ./media/app-service-logic-connector-smtp/img3.png
[4]: ./media/app-service-logic-connector-smtp/img4.PNG
[5]: ./media/app-service-logic-connector-smtp/img5.PNG
[6]: ./media/app-service-logic-connector-smtp/img6.PNG
