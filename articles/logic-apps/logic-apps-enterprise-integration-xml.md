---
title: XML messages and flat files
description: Process XML messages and flat files in workflows for Azure Logic Apps using the Enterprise Integration Pack.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 12/05/2024
---

# Process XML messages and flat files in Azure Logic Apps

In [Azure Logic Apps](logic-apps-overview.md), you can process and validate the XML messages that you send and receive. If you've used BizTalk Server, these capabilities similarly parse, compose, transform, and validate XML messages, encode and decode flat files, and even use XPath to enrich or extract specific properties from a message. If you're new to this space, these features expand how you can process messages in your logic app's workflow. For example, if you have a business-to-business (B2B) scenario and work with specific XML schemas, you can use these XML capabilities to enhance how your business handles these messages.

For example, the Azure Logic Apps includes the following XML capabilities:

| Task | Description |
|------|-------------|
| [Compose XML with schema](logic-apps-enterprise-integration-xml-compose.md) (Standard workflows only) | Create XML documents from JSON data by using a schema. |
| [Parse XML with schema](logic-apps-enterprise-integration-xml-parse.md) (Standard workflows only) | Parse XML documents by using a schema. |
| [Transform XML](logic-apps-enterprise-integration-transform.md) | Convert or customize an XML message based on your requirements or partner requirements by using maps. |
| [Encode and decode flat files](logic-apps-enterprise-integration-flatfile.md) | Encode or decode a flat file. <br><br>For example, SAP accepts and sends IDOC files in flat file format. Many integration platforms create XML messages, including Azure Logic Apps. So, you can create a logic app workflow that uses the flat file encoder to convert XML into flat file format. |
| [Validate XML](logic-apps-enterprise-integration-xml-validation.md) | Validate an inbound or outbound XML message against a specific schema. |
| [XPath](workflow-definition-language-functions-reference.md#xpath) | Enrich a message and extract specific properties from the message. You can then use the extracted properties to route the message to a destination, or an intermediary endpoint. |

## Sample

[Deploy a fully operational logic app](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.logic/logic-app-veter-pipeline) (GitHub sample) by using the XML features in Azure Logic Apps.

## Related content

[Enterprise integration overview](logic-apps-enterprise-integration-overview.md)
