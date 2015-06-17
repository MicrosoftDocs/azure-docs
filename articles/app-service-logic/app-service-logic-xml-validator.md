<properties
   pageTitle="BizTalk XML Validator"
   description="BizTalk XML Validator"
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

# BizTalk XML Validator

BizTalk XML Validate connector helps your app validate XML data against predefined XML schemas. Users can use either existing schemas or generate schemas based out of a flat file instance, JSON instance or existing connectors.

##Using the BizTalk XML Validator
1. To use the BizTalk XML Validator, you need to first create an instance of the BizTalk XML Validator API app. This can be done either inline while creating a logic app or by selecting the BizTalk XML Validator API app from the Azure Marketplace.

###Configure BizTalk XML Validator
BizTalk XML Validator takes schemas as part of its configuration. User can launch the API App configuration blade by either launching the API App directly from the Azure portal, or through by double clicking the API App on the designer surface.

![BizTalk XML Validator Configuration][1]

In the API App blade, user can configure schemas by clicking on *Schemas* part

![BizTalk XML Validator Schemas Part][2]

Users can upload schemas from disk or generate one from a flat file instance or a JSON instance.

![BizTalk XML Validator Schemas][3]


###Using the BizTalk Flat File Encoder in design surface
Once configured, users can click on *->* and choose from an action from a list of actions.

![BizTalk XML Validator List of actions][4]

####Validate Xml

Validate Xml action Validates a given xml input against pre-configured schemas.

![BizTalk XML Validator Validate Xml][5]

<table>
	<tr>
		<th>Parameter</th>
		<th>Type</th>
		<th>Description of the parameter</th>
	</tr>
	<tr>
		<td>Input Xml</td>
		<td>string</td>
		<td>Input Xml to be validated</td>
	</tr>
</table>


The action returns the output as an object. Output contains the model representing response of Xml Validator. It consists of result, schema name, root node and error description.

![6]

<!-- References -->
[1]: ./media/app-service-logic-xml-validator/XmlValidator.ClickToConfigure.PNG
[2]: ./media/app-service-logic-xml-validator/XmlValidator.SchemasPart.PNG
[3]: ./media/app-service-logic-xml-validator/XmlValidator.SchemaUpload.PNG
[4]: ./media/app-service-logic-xml-validator/XmlValidator.ListOfActions.PNG
[5]: ./media/app-service-logic-xml-validator/XmlValidator.ValidateXml.PNG
[6]: ./media/app-service-logic-xml-validator/img1.PNG
 