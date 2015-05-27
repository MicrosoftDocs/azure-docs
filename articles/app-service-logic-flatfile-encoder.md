<properties 
   pageTitle="BizTalk Flat File Encoder" 
   description="BizTalk Flat File Encoder" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="rajram" 
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

[Creating a new logic app](http://aka.ms/createnewlogicapp) > [Connectors](http://aka.ms/usingconnectors)

#BizTalk Flat File Encoder

BizTalk Flat File Encode Decode connector helps your app interop between flat file data (example excel, csv) and XML data. It can convert a given flat file instance to XML and vice versa.

##Using the BizTalk Flat File Encoder
1. To use the BizTalk Flat File Encoder, you need to first create an instance of the BizTalk Flat File Encoder API app. This can be done either inline while creating a logic app or by selecting the BizTalk Flat File Encoder API app from the Azure Marketplace.

		NOTE: There are no configuration settings associated with BizTalk Xpath Extractor.
2. The designer shows up the action associated with BizTalk XPath Extractor API App.
	
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
[1]: /media/app-service-logic-xpath-extract/BizTalkXPathExtractor.ChooseAction.png
[2]: /media/app-service-logic-xpath-extract/BizTalkXPathExtractor.ConfigureInput.png
