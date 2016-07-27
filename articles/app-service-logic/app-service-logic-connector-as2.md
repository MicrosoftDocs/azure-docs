<properties 
   pageTitle="Using the AS2 Connector in Logic Apps | Microsoft Azure App Service" 
   description="How to create and configure the AS2 connector or API app and use it in a logic app in Azure App Service" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="rajeshramabathiran" 
   manager="erikre" 
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="04/20/2016"
   ms.author="rajram"/>

# Get started with the AS2 Connector and add it to your Logic App

[AZURE.INCLUDE [app-service-logic-version-message](../../includes/app-service-logic-version-message.md)]

Use the AS2 Connector to receive and send messages over the AS2 (Applicability Statement 2) transport protocol in business-to-business communications. Data is transported securely and reliably over the Internet. Security is achieved using digital certificates and encryption.

You can add the AS2 Connecto to your business workflow and process data as part of a business-to-business workflow within a Logic App. 

## Triggers and Actions
A Trigger starts a new instance based on a specific event, like the arrival of an AS2 message from a partner. An Action is the result, like after receiving an AS2 message, then send the message using AS2.

The AS2 Connector can be used as a trigger or an action in a logic app and supports data in JSON and XML formats. The AS2 Connector has the following Triggers and Actions available: 

Triggers | Actions
--- | ---
Receive & Decode | Encode & Send

## Requirements to Get Started
The following items must be created by you before they can be used by the AS2 connector:

Requirement | Description
--- | ---
TPM API App | Before creating an AS2 connector, you have to create a [BizTalk Trading Partner Management Connector][1]. <br/><br/>**Note** Know the name of your TPM API App. 
Azure SQL Database | Stores B2B items including partners, schemas, certificates, and agreeements. Each of the B2B API Apps requires its own Azure SQL Database. <br/><br/>**Note** Copy the connection string to this database.<br/><br/>[Create an Azure SQL Database](../sql-database/sql-database-get-started.md)
Azure Blob Storage container | Stores message properties when AS2 archiving is enabled. If you don't need AS2 message archiving, a Storage container is not needed. <br/><br/>**Note** If you are enabling archiving, copy the connection string to this Blob Storage.<br/><br/>[About Azure Storage Accounts](../storage/storage-create-storage-account.md).

## Create the AS2 Connector

A connector can be created within a logic app or be created directly from the Azure Marketplace. To create a connector from the Marketplace:  

1. In the Azure startboard, select **Marketplace**.
2. Search for “AS2 Connector”, select it, and select **Create**.
3. Enter the Name, App Service Plan, and other properties.
4. Enter the following package settings:

	Property | Description
--- | --- 
Database Connection String | Enter the ADO.NET connection string to the Azure SQL Database you created. When you copy the connection string, the password is not added to the connection string. Be sure to enter the password in the connection string before you paste.
Enable Archiving for incoming messages | Optional. Enable this property to store the message properties of an incoming AS2 message received from a partner. 
Azure Blob Storage Connection String  | Enter the connection string to the Azure Blob Storage container you created. When Archiving is enabled, the encoded and decoded messages are stored in this Storage container.
TPM Instance Name | Enter the name of the **BizTalk Trading Partner Management** API App you previously created. When you create the AS2 connector, this connector executes only the AS2 agreements within this specific TPM instance.

5. Select **Create**. 

Trading partners are the entities involved in B2B (Business-to-Business) communications. When two partners establish a relationship, this is referred to as an Agreement. The agreement defined is based on the communication the two partners wish to achieve and is protocol or transport specific.

See the steps to [create a trading partner agreement][2].

## Use the Connector as a Trigger

1. When creating or editing a logic app, select the AS2 Connector you created from the right pane:  
	![Trigger settings][3]

2. Click the right arrow →:  
	![Trigger options][4]

3. The AS2 Connector exposes a single trigger. Select *Receive & Decode*:  
	![Receive and decode input][5]

4. This trigger has no inputs. Click the right arrow →:  
	![Receive and decode configured][6]

As part of the output, the connector returns the AS2 payload as well as the AS2-specific metadata.

The Trigger is fired when an AS2 Payload is as a POST to https://{Host URL}/decode.  You can find the Host URL in the API App settings.  You may also need to change the Access Level of the API App in Application Settings to Public (authenticated or anonymous).

## Use the Connector as an Action
1. After your trigger (or choose 'run this logic manually'), add the AS2 connector you created from the right pane:  
	![Action settings][7]

2. Click the right arrow →:  
	![List of Actions][8]

3. The AS2 connector supports only one action. Select *Encode and Send*:  
	![Encode and send input][9]

4. Enter the inputs for the action and configure it:  
	![Encode and send configured][10]

	Parameters include: 

	Parameter | Type | Description
--- | --- | ---
Payload | object| The content of the payload to encode and post to the configured end point. The payload needs to be provided as a JSON Object.
AS2 From | string | The AS2 identity of the sender of the AS2 message. This parameter is used to lookup the appropriate agreement for sending the message.
AS2 To | string | The AS2 identity of the receiver of the AS2 message. This parameter is used to lookup the appropriate agreement for sending the message.
Partner URL | string | The end point of the partner to which the message needs to be sent.
Enable Archiving | boolean | Determines if the outbound message should be archived.

The action returns a HTTP 200 response code on successful completion.

## Do more with your Connector
You can [archive your AS2 messages](app-service-logic-archive-as2-messages.md).

More on logic apps at [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, [Try Logic Apps](https://tryappservice.azure.com/?appservice=logic). You can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).

<!--References -->
[1]: app-service-logic-connector-tpm.md
[2]: app-service-logic-create-a-trading-partner-agreement.md
[3]: ./media/app-service-logic-connector-as2/TriggerSettings.PNG
[4]: ./media/app-service-logic-connector-as2/TriggerOptions.PNG
[5]: ./media/app-service-logic-connector-as2/ReceiveAndDecodeInput.PNG
[6]: ./media/app-service-logic-connector-as2/ReceiveAndDecodeConfigured.PNG
[7]: ./media/app-service-logic-connector-as2/ActionSettings.PNG
[8]: ./media/app-service-logic-connector-as2/ListOfActions.PNG
[9]: ./media/app-service-logic-connector-as2/EncodeAndSendInput.PNG
[10]: ./media/app-service-logic-connector-as2/EncodeAndSendConfigured.PNG
