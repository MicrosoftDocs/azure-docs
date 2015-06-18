<properties 
   pageTitle="AS2 Connector" 
   description="AS2 Connector" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="rajeshramabathiran" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="06/14/2015"
   ms.author="rajram"/>

#AS2 Connector
Microsoft Azure AS2 Connector lets one receive and send messages over AS2 transport protocol in business to business communications. AS2 stands for Applicability Statement 2. Data is transported securely and reliably over the Internet. Security is achieved by using digital certificates and encryption.

##Pre-requisites
- TPM API App: Before creating an AS2 connector, you have to create a [BizTalk Trading Partner Management Connector][1]
- SQL Azure database: Each of the B2B API Apps requires its own Azure SQL Database.
- Azure Blob Storage container: Stores message properties when AS2 archiving is enabled. If you don't need AS2 message archiving, a Storage container is not needed. 

##Using AS2 Connector
To use the AS2 Connector, you need to first create an instance of the AS2 Connector API app. This can be done either inline while creating a logic app or by selecting the AS2 Connector API app from the Azure Marketplace.

##Configuring AS2 Connector
Trading partners are the entities involved in B2B (Business-to-Business) communications. When two partners establish a relationship, this is referred to as an Agreement. The agreement defined is based on the communication the two partners wish to achieve and is protocol or transport specific.

Steps involved in creating a trading partner agreement is documented [here][2]

##Using AS2 Connector in Logic Apps designer surface
AS2 Connector can be used either as a trigger or as an action.

###Trigger
- Launch the Azure Logic Apps flow designer
- Click on AS2 Connector from the right pane

	![Trigger settings][3]
- Click on ->

	![Trigger options][4]
- AS2 Connector exposes a single trigger. Select *Receive & Decode*

	![Receive and decode input][5]
- This trigger has no inputs. Click on ->

	![Receive and decode configured][6]
- As part of the output, the connector returns the AS2 payload as well as AS2 specific metadata.

###Action
- Click on AS2 Connector from the right pane

	![Action settings][7]
- Click on ->

	![List of Actions][8]
- AS2 connector supports only one action. Select *Encode and Send*

	![Encode and send input][9]
- Provide the inputs for the action and configure it

	![Encode and send configured][10]

<table>
	<tr>
		<th>Parameter</th>
		<th>Type</th>
		<th>Description of the parameter</th>
	</tr>
	<tr>
		<td>Payload</td>
		<td>object</td>
		<td>Payload</td>
	</tr>
	<tr>
		<td>AS2 From</td>
		<td>string</td>
		<td>AS2 From</td>
	</tr>
	<tr>
		<td>AS2 To</td>
		<td>string</td>
		<td>AS2 To</td>
	</tr>
	<tr>
		<td>Partner URL</td>
		<td>string</td>
		<td>Partner URL</td>
	</tr>
	<tr>
		<td>Enable Archiving</td>
		<td>boolean</td>
		<td>Enable Archiving</td>
	</tr>
</table>

The action returns a HTTP 200 response code on successful completion.

## Do more with your Connector
Now that the connector is created, you can add it to a business flow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

You can also review performance statistics and control security to the connector. See [Manage  and Monitor API apps and connector](../app-service-api/app-service-api-manage-in-portal.md).

<!--References -->
[1]: app-service-logic-connector-tpm
[2]: app-service-logic-create-a-trading-partner-agreement
[3]: ./media/app-service-logic-connector-as2/TriggerSettings.PNG
[4]: ./media/app-service-logic-connector-as2/TriggerOptions.PNG
[5]: ./media/app-service-logic-connector-as2/ReceiveAndDecodeInput.PNG
[6]: ./media/app-service-logic-connector-as2/ReceiveAndDecodeConfigured.PNG
[7]: ./media/app-service-logic-connector-as2/ActionSettings.PNG
[8]: ./media/app-service-logic-connector-as2/ListOfActions.PNG
[9]: ./media/app-service-logic-connector-as2/EncodeAndSendInput.PNG
[10]: ./media/app-service-logic-connector-as2/EncodeAndSendConfigured.PNG