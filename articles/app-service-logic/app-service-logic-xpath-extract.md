<properties
   pageTitle="Using the BizTalk XPath Extractor in logic apps in Azure App Service | Microsoft Azure"
   description="BizTalk XPath Extractor"
   services="logic-apps"
   documentationCenter=".net,nodejs,java"
   authors="rajram"
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

# BizTalk XPath Extractor

[AZURE.INCLUDE [app-service-logic-version-message](../../includes/app-service-logic-version-message.md)]


BizTalk XPath Extract connector helps your app lookup and extract data from XML content based on a given XPath.

## Using the BizTalk Xpath Extractor
1. To use the BizTalk Xpath Extractor, you need to first create an instance of the BizTalk Xpath Extractor API app. This can be done either inline while creating a logic app or by selecting the BizTalk Xpath Extractor API app from the Azure Marketplace.

	>[AZURE.NOTE] There are no configuration settings associated with BizTalk Xpath Extractor.
2. [Create a new logic app]. Open “Triggers and Actions” within your Logic App to open the Logic Apps Designer to configure your flow.
3. On designer, the right pane lists the API Apps available to build your flow. Find the "BizTalk XPath Extractor". Selecting it adds the Xpath Extractor to your flow and provisions an instance of it.
4. Once provisioned, the designer shows up the action associated with BizTalk XPath Extractor API App:  
	![BizTalk XPath Extractor Choose Action][1]

5. Choose "Extract Using XPath". "Extract Using XPath" evaluates input xpath expression on a given input XML:  
	![BizTalk XPath Extractor Input][2]

	Parameter|Type|Description of the parameter
---|---|---
XPath|string|Query path inside xml.
Input Xml|string|Input Xml content.

The action returns the output as a string - Result. Result contains the value of query path inside the XML.

<!-- References -->
[1]: ./media/app-service-logic-xpath-extract/ChooseAction.PNG
[2]: ./media/app-service-logic-xpath-extract/ConfigureInput.PNG

<!-- Links -->
[Create a new Logic App]: app-service-logic-create-a-logic-app.md
