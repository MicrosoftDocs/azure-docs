<properties
   pageTitle="Using the SMTP Connector in Logic Apps | Microsoft Azure App Service"
   description="How to create and configure the SMTP Connector or API app and use it in a logic app in Azure App Service"
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


# Get started with the SMTP Connector and add it to your Logic App
>[AZURE.NOTE] This version of the article applies to logic apps 2014-12-01-preview schema version. For the 2015-08-01-preview schema version, click [SMTP API](../connectors/connectors-create-api-smtp.md).

Connect to a SMTP server and send email, including emails with attachments. SMTP connector "Send Email" action lets you send email to the specified email address(es).

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of a workflow. You can add the SMTP Connector to your business workflow and process data as part of this workflow within a Logic App. 


## Triggers and Actions
*Triggers* are events that happen. For example, when an order is updated or when a new customer is added. An *Action* is the result of the trigger. For example, when an order is updated or a new customer is added, send an email to the new customer.

The SMTP Connector can be used as an action in a logic app and supports data in JSON and XML formats. Currently, there are no triggers for this connector.

The SMTP Connector has the following Triggers and Actions available:

Triggers | Actions
--- | ---
None | Send email


## Create the SMTP Connector
A connector can be created within a logic app or be created directly from the Azure Marketplace. To create a connector from the Marketplace:  

1. In the Azure startboard, select **Marketplace**.
2. Select **API Apps** and search for “SMTP Connector”.
3. **Create** the connector.
4. Enter the Name, App Service Plan, and other properties.
5. Enter the following package settings:

	Name | Required |  Description
	--- | --- | ---
	User Name | Yes | Enter a user name that can connect to the SMTP server.
	Password | Yes | Enter the user name password.
	Server Address | Yes | Enter the SMTP Server name or IP address.
	Server Port | Yes | Enter SMTP Server port number.
	Enable SSL | No | Enter *true* to use SMTP over a secure SSL/TLS channel.

6. Select **Create**.

> [AZURE.IMPORTANT] Some SMTP Servers may have issues with how this connector works (SendGrid and Gmail).  If you wish to send mail from SendGrid our [GitHub repository](https://github.com/logicappsio/SendGridAPI) has a custom API which will interface directly with SendGrid APIs.

## Using the SMTP Connector in your Logic App
Once your connector is created, you can now use the SMTP connector as an action for your Logic App. To do this:

1.	Create a new Logic App:  
![][2]
2.	Open **Triggers and Actions** to open the Logic Apps designer and configure your workflow:  
![][3]
3.	The SMTP connector is listed in the “API Apps in this resource group” section in the gallery on the right hand side. Select it:  
![][4]
4.	Select the SMTP Connector to automatically add it to the workflow designer.

You can now configure the SMTP connector to use in your workflow. Select the **Send Email** action and configure the input properties:

	Property | Description
	--- | ---
	To | Enter the email address of recipient(s). Separate multiple email addresses using a semicolon (;). For example, enter: *recipient1@domain.com;recipient2@domain.com*.
	Cc | Enter the email address of the carbon copy recipient(s). Separate multiple email addresses using a semicolon (;). For example, enter: *recipient1@domain.com;recipient2@domain.com*.
	Subject | Enter the subject of the email.
	Body | Enter body of the email.
	Is HTML | When this property is set to true, the contents of the body are sent as HTML.
	Bcc | Enter the email address of recipient(s) for blind carbon copy. Separate multiple email addresses using a semicolon (;). For example, enter: *recipient1@domain.com;recipient2@domain.com*.
	Importance | Enter the Importance of the email. The options are Normal, Low, and High.
	Attachments | Attachments to be sent along with the email. It contains the following fields: <ul><li>Content (String)</li><li>Content transfer Encoding (Enum) (“none”|”base64”)</li><li>Content Type (String)</li><li>Content ID (String)</li><li>File Name (String)</li></ul>

![][5]  
![][6]

## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).

<!--Image references-->
[1]: ./media/app-service-logic-connector-smtp/img1.PNG
[2]: ./media/app-service-logic-connector-smtp/img2.PNG
[3]: ./media/app-service-logic-connector-smtp/img3.png
[4]: ./media/app-service-logic-connector-smtp/img4.PNG
[5]: ./media/app-service-logic-connector-smtp/img5.PNG
[6]: ./media/app-service-logic-connector-smtp/img6.PNG
