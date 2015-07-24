<properties 
   pageTitle="BizTalk X12 Connector" 
   description="BizTalk X12 Connector" 
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

#BizTalk X12 Connector
Microsoft Azure X12 Service lets one receive and send messages as per X12 protocol in business to business communications. X12 is also commonly referred to as ASC X12 or Accredited Standards Committee X12. It is widely used across industries.

##Pre-requisites
- TPM API App: Before creating a X12 connector, you have to create a [BizTalk Trading Partner Management Connector][1]
- SQL Azure database: Each of the B2B API Apps requires its own Azure SQL Database.
- Azure Service Bus: This is optional, and used only in the case of batching.

##Using BizTalk X12 Connector
To use the BizTalk X12 Connector, you need to first create an instance of the BizTalk X12 Connector API app. This can be done either inline while creating a logic app or by selecting the BizTalk X12 Connector API app from the Azure Marketplace.

##Configuring BizTalk X12 Connector
Trading partners are the entities involved in B2B (Business-to-Business) communications. When two partners establish a relationship, this is referred to as an Agreement. The agreement defined is based on the communication the two partners wish to achieve and is protocol or transport specific.

Steps involved in creating a trading partner agreement is documented [here][2]

##Using X12 Connector in Logic Apps designer surface
X12 Connector can be used either as a trigger or as an action.

###Trigger
- Launch the Azure Logic Apps flow designer
- Click on X12 Connector from the right pane

	![Trigger settings][3]
- Click on ->

	![Trigger options][4]
- BizTalk X12 Connector exposes a single trigger. Select *Release Batch*

	![Release batch input][5]
- This trigger has no inputs. Click on ->

	![Release batch configured][6]
- As part of the output, the connector returns the X12 payload, agreement id as well as information as to whether the message is batched, or not.

###Action
- Click on X12 Connector from the right pane

	![Action settings][7]
- Click on ->

	![List of Actions][8]
- X12 connector supports many actions. Select *Encode*

	![Encode input][9]
- Provide the inputs for the action and configure it

	![Encode configured][10]

<table>
	<tr>
		<th>Parameter</th>
		<th>Type</th>
		<th>Description of the parameter</th>
	</tr>
	<tr>
		<td>Content</td>
		<td>string</td>
		<td>XML Message</td>
	</tr>
	<tr>
		<td>Agreement ID</td>
		<td>string</td>
		<td>Agreement ID</td>
	</tr>
	<tr>
		<td>Is Batched Message</td>
		<td>string</td>
		<td>Is Batched Message</td>
	</tr>
</table>

The action returns an object containing the X12 payload.

## Do more with your Connector
Now that the connector is created, you can add it to a business flow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

You can also review performance statistics and control security to the connector. See [Manage  and Monitor API apps and connector](../app-service-api/app-service-api-manage-in-portal.md).


<!--References -->
[1]: app-service-logic-connector-tpm.md 
[2]: app-service-logic-create-a-trading-partner-agreement.md
[3]: ./media/app-service-logic-connector-x12/TriggerSettings.PNG
[4]: ./media/app-service-logic-connector-x12/ListOfTriggers.PNG
[5]: ./media/app-service-logic-connector-x12/ReleaseBatchTriggerInput.PNG
[6]: ./media/app-service-logic-connector-x12/ReleaseBatchTriggerConfigured.PNG
[7]: ./media/app-service-logic-connector-x12/ActionSettings.PNG
[8]: ./media/app-service-logic-connector-x12/ListOfActions.PNG
[9]: ./media/app-service-logic-connector-x12/EncodeInput.PNG
[10]: ./media/app-service-logic-connector-x12/EncodeConfigured.PNG
[11]: ./media/app-service-logic-connector-x12/TriggerSettings.PNG