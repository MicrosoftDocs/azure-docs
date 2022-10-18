---
title: XML messages and flat files
description: Process, validate, and transform XML messages in Azure Logic Apps with Enterprise Integration Pack.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/20/2022
---

# XML messages and flat files in Azure Logic Apps with Enterprise Integration Pack

In [Azure Logic Apps](logic-apps-overview.md), you can process XML messages that you send and receive by using the Enterprise Integration Pack. If you've used BizTalk Server, the Enterprise Integration Pack provides similar capabilities to transform and validate messages, work with flat files, and even use XPath to enrich or extract specific properties from a message. If you're new to this space, these features expand how you process messages in your logic app's workflow. For example, if you have a business-to-business (B2B) scenario and work with specific XML schemas, you can use the Enterprise Integration Pack to enhance how your company processes these messages.

For example, the Enterprise Integration Pack includes these capabilities:

* [XML validation](logic-apps-enterprise-integration-xml-validation.md): Validate an incoming or outgoing XML message against a specific schema.

* [XML transform](logic-apps-enterprise-integration-transform.md): Convert or customize an XML message based on your requirements or the requirements of a partner by using maps.

* [Flat file encoding and flat file decoding](logic-apps-enterprise-integration-flatfile.md): Encode or decode a flat file.

  For example, SAP accepts and sends IDOC files in flat file format. Many integration platforms create XML messages, including Logic Apps. So, you can create a logic app that uses the flat file encoder to "convert" XML files to flat files.

* [XPath](workflow-definition-language-functions-reference.md#xpath): Enrich a message and extract specific properties from the message. You can then use the extracted properties to route the message to a destination, or an intermediary endpoint.

## Sample

[Deploy a fully operational logic app](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.logic/logic-app-veter-pipeline) (GitHub sample) by using the XML features in Azure Logic Apps.

## Next steps

Learn more about the [Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md)
