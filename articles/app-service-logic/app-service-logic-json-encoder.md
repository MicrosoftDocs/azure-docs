<properties 
   pageTitle="BizTalk JSON Encoder" 
   description="BizTalk JSON Encoder" 
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

#BizTalk JSON Encoder
BizTalk JSON Encode Decode connector helps your app interop between JSON and XML data. It can convert a given JSON instance to XML and vice versa.

##Using BizTalk JSON Encoder
To use the BizTalk JSON Encoder, you need to first create an instance of the BizTalk JSON Encoder API app. This can be done either inline while creating a logic app or by selecting the BizTalk JSON Encoder API app from the Azure Marketplace.

##Using BizTalk JSON Encoder in Logic Apps designer surface
BizTalk JSON Encoder can be used as an action. It does not have any triggers.

###Action
- Click on BizTalk JSON Encoder from the right pane

	![Action settings][3]
- Click on ->

	![List of Actions][4]
- BizTalk JSON Encoder supports only one action. Select *Xml to JSON*

	![Xml to JSON input][5]
- Provide the inputs for the action and configure it

	![Encode and send configured][6]

<table>
	<tr>
		<th>Parameter</th>
		<th>Type</th>
		<th>Description of the parameter</th>
	</tr>
	<tr>
		<td>Input Xml</td>
		<td>object</td>
		<td>Input Xml content</td>
	</tr>
	<tr>
		<td>Remove Outer Envelope</td>
		<td>string</td>
		<td>Flag set to remove Root node from Xml content</td>
	</tr>
</table>

The action returns a json representation of the input content.

## Do more with your Connector
Now that the connector is created, you can add it to a business flow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

You can also review performance statistics and control security to the connector. See [Manage  and Monitor API apps and connector](../app-service-api/app-service-api-manage-in-portal.md).

<!--References -->
[1]: app-service-logic-connector-tpm
[2]: app-service-logic-create-a-trading-partner-agreement
[3]: ./media/app-service-logic-json-encoder/ActionSettings.PNG
[4]: ./media/app-service-logic-json-encoder/ListOfActions.PNG
[5]: ./media/app-service-logic-json-encoder/EncodeInput.PNG
[6]: ./media/app-service-logic-json-encoder/EncodeConfigured.PNG