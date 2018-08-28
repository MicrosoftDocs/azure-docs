---
title: XML messages for B2B enterprise integration - Azure Logic Apps | Microsoft Docs
description: Process, validate, transform, and enrich XML messages for B2B solutions in Azure Logic Apps with Enterprise Integration Pack
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: jonfan, estfan, LADocs
ms.topic: article
ms.assetid: 47672dc4-1caa-44e5-b8cb-68ec3a76b7dc
ms.date: 02/27/2017
---

# XML messages and flat files in Azure Logic Apps with Enterprise Integration Pack

Using logic apps, you have the ability to process XML messages that you send and receive. This feature is included with the Enterprise Integration Pack. For those users with a BizTalk Server background, the Enterprise Integration Pack gives you similar abilities to transform and validate messages, work with flat files, and even use XPath to enrich or extract specific properties from a message. 

For those users who are new to this space, these features expand how you process messages within your workflow. For example, if you are in a business-to-business scenario, and work with specific XML schemas, then you can use the Enterprise Integration Pack to enhance how your company processes these messages. 

The Enterprise Integration Pack includes: 

* [XML validation](logic-apps-enterprise-integration-xml-validation.md "Learn about XML message validation") - Validate an incoming or outgoing XML message against a specific schema.
* [XML transform](../logic-apps/logic-apps-enterprise-integration-transform.md "Learn about XML message transformations and maps") - Convert or customize an XML message based on your requirements, or the requirements of a partner.
* [Flat file encoding and flat file decoding](logic-apps-enterprise-integration-flatfile.md "Learn about flat file encoding/decoding") - Encode or decode a flat file. For example, SAP accepts and sends IDOC files in flat file format. Many integration platforms create XML messages, including Logic Apps. So, you can create a logic app that uses the flat file encoder to "convert" XML files to flat files. 
* [XPath](https://msdn.microsoft.com/library/mt643789.aspx) - Enrich a message and extract specific properties from the message. You can then use the extracted properties to route the message to a destination, or an intermediary endpoint.

## Try it out
[Deploy a fully operational logic app ](https://github.com/Azure/azure-quickstart-templates/tree/master/201-logic-app-veter-pipeline) (GitHub sample) by using the XML features in Azure Logic Apps.

## Learn more
[Learn more about the Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md "Learn about Enterprise Integration Pack")
