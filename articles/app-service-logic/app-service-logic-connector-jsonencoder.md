<properties
   pageTitle="Using the BizTalk JSON Encoder connector in Logic Apps | Microsoft Azure App Service "
   description="How to create and configure the BizTalk JSON Encoder Connector or API app and use it in a logic app in Azure App Service"
   services="logic-apps"
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

# Get started with the BizTalk JSON Encoder and add it to your Logic App 

[AZURE.INCLUDE [app-service-logic-version-message](../../includes/app-service-logic-version-message.md)]


BizTalk JSON Encode Decode connector helps your app interop between JSON and XML data. It can convert a given JSON instance to XML and vice versa.

You can add the BizTalk JSON Encoder to your business workflow and process data as part of this workflow within a Logic App. 

## Using BizTalk JSON Encoder
To use the BizTalk JSON Encoder, you need to first create an instance of the BizTalk JSON Encoder API app. This can be done either inline while creating a logic app or by selecting the BizTalk JSON Encoder API app from the Azure Marketplace.

## Using BizTalk JSON Encoder in Logic Apps designer surface
Follow steps for [Creating a Logic App]. BizTalk JSON Encoder can be used as an action. It does not have any triggers.

### Action
- Click on BizTalk JSON Encoder from the right pane

	![Action settings][3]
- Click on ->

	![List of Actions][4]
- BizTalk JSON Encoder supports two actions. Select *Xml to JSON*

	![Xml to JSON input][5]
- Provide the inputs for the action and configure it

	![Encode and send configured][6]

Parameter|Type|Description of the parameter
---|---|---
Input Xml|object|Input Xml content
Remove Outer Envelope|string|Flag set to remove Root node from Xml content

The action returns a json representation of the input content.

## Do more with your Connector
Now that the connector is created, you can add it to a business flow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

 

<!--References -->
[1]: app-service-logic-connector-tpm
[2]: app-service-logic-create-a-trading-partner-agreement
[3]: ./media/app-service-logic-json-encoder/ActionSettings.PNG
[4]: ./media/app-service-logic-json-encoder/ListOfActions.PNG
[5]: ./media/app-service-logic-json-encoder/EncodeInput.PNG
[6]: ./media/app-service-logic-json-encoder/EncodeConfigured.PNG

<!--Links -->
[Creating a Logic App]: app-service-logic-create-a-logic-app.md
