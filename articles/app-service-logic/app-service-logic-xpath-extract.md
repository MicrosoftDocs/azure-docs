<properties
   pageTitle="BizTalk XPath Extractor"
   description="BizTalk XPath Extractor"
   services="app-service\logic"
   documentationCenter=".net,nodejs,java"
   authors="prkumar"
   manager="dwrede"
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="03/20/2015"
   ms.author="rajram"/>

#BizTalk XPath Extractor

BizTalk XPath Extract connector helps your app lookup and extract data from XML content based on a given XPath.

##Using the BizTalk Xpath Extractor
1. To use the BizTalk Xpath Extractor, you need to first create an instance of the BizTalk Xpath Extractor API app. This can be done either inline while creating a logic app or by selecting the BizTalk Xpath Extractor API app from the Azure Marketplace.

	>[AZURE.NOTE] There are no configuration settings associated with BizTalk Xpath Extractor.
2. [Create a new logic app]. Open “Triggers and Actions” within the created Logic App to open the Logic Apps Designer to configure your flow.
3. On designer, the right pane lists the API Apps available to build your flow with. Find the "BizTalk XPath Extractor". Selecting this would add the Xpath Extractor to your flow and will provision an instance of it.
2. Once provisioned, the designer shows up the action associated with BizTalk XPath Extractor API App.

![BizTalk XPath Extractor Choose Action][1]

3. Choose "Extract Using XPath"

"Extract Using XPath" evaluates input xpath expression on a given input Xml.

![BizTalk XPath Extractor Input][2]

<table>
	<tr>
		<th>Parameter</th>
		<th>Type</th>
		<th>Description of the parameter</th>
	</tr>
	<tr>
		<td>XPath</td>
		<td>string</td>
		<td>Query path inside xml.</td>
	</tr>
	<tr>
		<td>Input Xml</td>
		<td>string</td>
		<td>Input Xml content.</td>
	</tr>
</table>

The action returns the output as a string - Result. Result contains the value of query path inside Xml.

<!-- References -->
[1]: ./media/app-service-logic-xpath-extract/ChooseAction.PNG
[2]: ./media/app-service-logic-xpath-extract/ConfigureInput.PNG

<!-- Links -->
[Create a new Logic App]: app-service-logic-create-a-logic-app.md
