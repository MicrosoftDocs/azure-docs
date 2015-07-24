<properties 
   pageTitle="BizTalk Edifact Connector" 
   description="BizTalk Edifact Connector" 
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

#BizTalk Edifact Connector
Microsoft Azure Edifact Service lets one receive and send messages as per Edifact protocol in business to business communications. Edifact is also commonly referred to as ASC Edifact or Accredited Standards Committee Edifact. It is widely used across industries.

##Pre-requisites
- TPM API App: Before creating a Edifact connector, you have to create a [BizTalk Trading Partner Management Connector][1]
- SQL Azure database: Each of the B2B API Apps requires its own Azure SQL Database.
- Azure Service Bus: This is optional, and used only in the case of batching.

##Using Edifact Connector
To use the Edifact Connector, you need to first create an instance of the AS2 Connector API app. This can be done either inline while creating a logic app or by selecting the AS2 Connector API app from the Azure Marketplace.

##Configuring Edifact Connector
Trading partners are the entities involved in B2B (Business-to-Business) communications. When two partners establish a relationship, this is referred to as an Agreement. The agreement defined is based on the communication the two partners wish to achieve and is protocol or transport specific.

Steps involved in creating a trading partner agreement is documented [here][2]

##Using Edifact Connector in Logic Apps designer surface
Edifact Connector can be used either as a trigger or as an action.

###Trigger
- Launch the Azure Logic Apps flow designer
- Click on Edifact Connector from the right pane

	![Trigger settings][3]
- Click on ->

	![Trigger options][4]
- EDIFACT Connector exposes a single trigger. Select *Release Batch*

	![Release batch input][5]
- This trigger has no inputs. Click on ->

	![Release batch configured][6]
- As part of the output, the connector returns the Edifact payload, agreement id as well as information as to whether the message is batched, or not.

###Action
- Click on Edifact Connector from the right pane

	![Action settings][7]
- Click on ->

	![List of Actions][8]
- Edifact connector supports many actions. Select *Encode*

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
		<td>integer</td>
		<td>Agreement ID</td>
	</tr>
	<tr>
		<td>Is Batched Message</td>
		<td>boolean</td>
		<td>Is Batched Message</td>
	</tr>
	<tr>
		<td>Data Element Separator</td>
		<td>string</td>
		<td>Data Element Separator</td>
	</tr>
	<tr>
		<td>Component Separator</td>
		<td>string</td>
		<td>Component Separator</td>
	</tr>
	<tr>
		<td>Segment Terminator</td>
		<td>string</td>
		<td>Segment Terminator</td>
	</tr>
	<tr>
		<td>Decimal Point Indicator</td>
		<td>string</td>
		<td>Decimal Point Indicator</td>
	</tr>
	<tr>
		<td>Repetition Separator</td>
		<td>string</td>
		<td>Repetition Separator</td>
	</tr>
	<tr>
		<td>Escape Character</td>
		<td>string</td>
		<td>Escape Character</td>
	</tr>
	<tr>
		<td>Replacement Character</td>
		<td>string</td>
		<td>Replacement Character</td>
	</tr>
	<tr>
		<td>Segment Terminator Suffix</td>
		<td>string</td>
		<td>Segment Terminator Suffix</td>
	</tr>
</table>

The action returns an object containing the EDIFACT payload on successful completion.

## Do more with your Connector
Now that the connector is created, you can add it to a business flow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

You can also review performance statistics and control security to the connector. See [Manage  and Monitor API apps and connector](../app-service-api/app-service-api-manage-in-portal.md).


<!--References -->
[1]: app-service-logic-connector-tpm.md
[2]: app-service-logic-create-a-trading-partner-agreement.md
[3]: ./media/app-service-logic-connector-edifact/TriggerSettings.PNG
[4]: ./media/app-service-logic-connector-edifact/ListOfTriggers.PNG
[5]: ./media/app-service-logic-connector-edifact/ReleaseBatchTriggerInput.PNG
[6]: ./media/app-service-logic-connector-edifact/ReleaseBatchTriggerConfigured.PNG
[7]: ./media/app-service-logic-connector-edifact/ActionSettings.PNG
[8]: ./media/app-service-logic-connector-edifact/ListOfActions.PNG
[9]: ./media/app-service-logic-connector-edifact/EncodeInput.PNG
[10]: ./media/app-service-logic-connector-edifact/EncodeConfigured.PNG