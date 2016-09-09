<properties 
   pageTitle="Using the BizTalk Edifact Connector in Logic Apps | Microsoft Azure App Service" 
   description="How to create and configure the BizTalk Edifact Connector or API app and use it in a logic app in Azure App Service" 
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

# Get started with the BizTalk Edifact Connector and add it to your Logic App  

[AZURE.INCLUDE [app-service-logic-version-message](../../includes/app-service-logic-version-message.md)]

Use the Edifact service to receive and send messages over the Edifact protocol in business to business communications. Edifact is also commonly referred to as ASC Edifact or Accredited Standards Committee Edifact and is widely used across industries.

You can add the BizTalk Edifact connector to your business workflow and process data as part of this workflow within a Logic App. 

## Prerequisites
- TPM API App: Before creating a Edifact connector, you have to create a [BizTalk Trading Partner Management Connector][1].
- SQL Azure database: Each of the B2B API Apps requires its own Azure SQL Database.
- Azure Service Bus: This is optional, and used only in the case of batching.

## Using Edifact Connector
To use the Edifact Connector, you need to first create an instance of the AS2 Connector API app. This can be done either inline while creating a logic app or by selecting the AS2 Connector API app from the Azure Marketplace.

## Configuring Edifact Connector
Trading partners are the entities involved in B2B (Business-to-Business) communications. When two partners establish a relationship, this is referred to as an Agreement. The agreement defined is based on the communication the two partners wish to achieve and is protocol or transport specific.

See the steps to [create a trading partner agreement][2].

## Using Edifact Connector in Logic Apps designer surface
Edifact Connector can be used either as a trigger or as an action.

### Trigger
- Launch the Azure Logic Apps flow designer
- Click on Edifact Connector from the right pane:  
![Trigger settings][3]
- Click on ->:  
![Trigger options][4]
- EDIFACT Connector exposes a single trigger. Select *Release Batch*:  
![Release batch input][5]
- This trigger has no inputs. Click on ->:  
![Release batch configured][6]
- As part of the output, the connector returns the Edifact payload, agreement id as well as information as to whether the message is batched, or not.

### Action
- Click on Edifact Connector from the right pane:  
![Action settings][7]
- Click on ->:  
![List of Actions][8]
- Edifact connector supports many actions. Select *Encode*:  
![Encode input][9]
- Provide the inputs for the action and configure it:  
![Encode configured][10]

	Parameter|Type|Description of the parameter
---|---|---
Content|string|XML Message
Agreement ID|integer|Agreement ID
Is Batched Message|boolean|Is Batched Message
Data Element Separator|string|Data Element Separator
Component Separator|string|Component Separator
Segment Terminator|string|Segment Terminator
Decimal Point Indicator|string|Decimal Point Indicator
Repetition Separator|string|Repetition Separator
Escape Character|string|Escape Character
Replacement Character|string|Replacement Character
Segment Terminator Suffix|string|Segment Terminator Suffix

The action returns an object containing the EDIFACT payload on successful completion.

## Do more with your Connector
Now that the connector is created, you can add it to a business flow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

 


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
